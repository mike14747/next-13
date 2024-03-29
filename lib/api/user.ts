import clientPromise from '@/lib/mongodb';
import { mailTransporter } from '../helpers/nodemailerConfig';
import { usernamePattern, emailPattern, passwordPattern } from '@/lib/formInputPatterns';
import { generateRandom, hashPassword } from '../helpers/cryptoUtils';
import { UserSignin, UserProfile, UserCollection } from '@/types/user-types';
import { TransactionOptions, ReadPreference } from 'mongodb';

export async function getUserForSignin(username: string, password: string) {
    if (!username || !password) return null;

    // const salt = generateRandom(32);
    // console.log({ password: hashPassword(password, salt), salt });

    try {
        const connection = await clientPromise;
        const db = connection.db();

        const user = await db
            .collection('users')
            .findOne<UserSignin>({ username: username, active: true }, { projection: { _id: 1, username: 1, password: 1, salt: 1, role: 1 } });

        if (!user) return null;

        const hashedPassword = hashPassword(password, user?.salt);
        if (!hashedPassword) return null;

        if (hashedPassword === user.password) {
            return {
                id: user._id.toString(),
                username: user.username,
                role: user.role,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getUserProfile(_id: number) {
    if (!_id) return null;

    try {
        const connection = await clientPromise;
        const db = connection.db();

        const user = await db
            .collection<UserCollection>('users')
            .findOne<UserProfile>({ _id, active: true }, { projection: { username: 1, email: 1 } });

        if (!user) return null;

        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getAllUsers() {
    try {
        const connection = await clientPromise;
        const db = connection.db();

        const users = await db
            .collection('users')
            .find({})
            .project({ _id: 1, username: 1, email: 1, posts: 1, active: 1 })
            .toArray();

        if (!users) return null;

        return users;
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function checkForAvailableUsername(username: string) {
    if (!username) return null;

    try {
        const connection = await clientPromise;
        const db = connection.db();

        // I could have used a "findOne" in this query, but I wanted to be able to tell the difference between a failed db query and an empty result (null vs empty array when using "find")
        return await db
            .collection('users')
            .find({ username })
            .project({ _id: 1, username: 1 })
            .limit(1)
            .toArray();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function changeUsername(_id: number, newUsername: string) {
    if (!_id) return { code: 401 };
    const pattern = new RegExp(usernamePattern);
    if (!newUsername || !pattern.test(newUsername)) return { code: 400 };

    const connection = await clientPromise;
    const db = connection.db();

    // make sure newUsername is not already in use
    const inUseResult = await db
        .collection<UserCollection>('users')
        .find({ _id, username: newUsername })
        .project({ _id: 1 })
        .limit(1)
        .toArray();
    if (!inUseResult) return { code: 500 };
    if (inUseResult.length === 1) return { code: 409 };

    const session = connection.startSession();

    let transactionResult;

    const transactionOptions: TransactionOptions = {
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority' },
        readPreference: ReadPreference.primary,
    };

    try {
        transactionResult = await session.withTransaction(async () => {
            await db
                .collection<UserCollection>('users')
                .updateOne({ _id }, { $set: { username: newUsername } }, { session });

            await db
                .collection('topics')
                .updateMany({ user_id: _id }, { $set: { username: newUsername } }, { session });

            // this step is causing a validation error, so I've bypassed it for no
            // await db
            //     .collection('replies')
            //     .updateMany({ user_id: _id }, { $set: { username: newUsername } }, { session });

            await db
                .collection('forums')
                .updateMany({ 'lastPost.userId': _id }, { $set: { 'lastPost.username': newUsername } }, { session });

            await db
                .collection('topics')
                .updateMany({ 'lastReply.userId': _id }, { $set: { 'lastReply.username': newUsername } }, { session });
        }, transactionOptions);
    } catch (error) {
        console.log(error);
    } finally {
        await session.endSession();
    }

    return transactionResult?.ok === 1 ? { code: 200 } : { code: 500 };
}

export async function changeEmail(_id: number, newEmail: string) {
    if (!_id) return { code: 401 };
    const pattern = new RegExp(emailPattern);
    if (!newEmail || !pattern.test(newEmail)) return { code: 400 };

    const connection = await clientPromise;
    const db = connection.db();

    const updateResult = await db
        .collection<UserCollection>('users')
        .updateOne({ _id }, { $set: { email: newEmail } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
}

export async function changePassword(_id: number, password: string, resetPasswordToken = null) {
    if (!_id) return { code: 401 };
    const pattern = new RegExp(passwordPattern);
    if (!password || !pattern.test(password)) return { code: 400 };

    const connection = await clientPromise;
    const db = connection.db();

    if (resetPasswordToken) {
        // since a token is being passed, get the expiration date/time of the token if it exists in the db
        const tokenValidCheck = (await db
            .collection<UserCollection>('users')
            .find({ _id, resetPasswordToken })
            .project({ resetPasswordExpires: 1 })
            .limit(1)
            .toArray()) as [{ resetPasswordExpires: Date }];

        // make sure token is found and is not expired
        if (tokenValidCheck?.length !== 1) return { code: 406 };
        if (tokenValidCheck[0]?.resetPasswordExpires < new Date(Date.now())) return { code: 412 };
    }

    const salt = generateRandom(32);
    const hashedPassword = hashPassword(password, salt);

    const updateResult = await db
        .collection<UserCollection>('users')
        .updateOne({ _id }, { $set: { password: hashedPassword, salt } });

    return updateResult?.modifiedCount === 1 ? { code: 200 } : { code: 500 };
}

export async function forgotUsername(email: string) {
    if (!email) return { code: 400 };

    const connection = await clientPromise;
    const db = connection.db();

    const userData = await db
        .collection('users')
        .find({ email })
        .project({ username: 1 })
        .toArray();

    if (!userData) return { code: 500 };
    const usernames = userData as { username: string }[];

    if (usernames?.length > 0) {
        const mailDetails = {
            from: 'rmlbb.noreply@gmail.com',
            to: email,
            subject: 'Forgot Username',
            html: '<p>A request for your rmlbb username(s) has been made for this email address.</p><p>The rmlbb username(s) associated with this email address is/are:<br /><br />' + usernames.map(u => u.username).join('<br />') + '</p>',
        };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    } else {
        // email address doesn't match any in the database
        return { code: 404 };
    }
}

export async function resetPassword(username: string, email: string) {
    if (!username || !email) return { code: 400 };

    const connection = await clientPromise;
    const db = connection.db();

    const user = await db
        .collection('users')
        .find({ username, email })
        .project({ _id: 1 })
        .limit(1)
        .toArray();

    if (user?.length === 1) {
        const _id = user[0]._id;
        // generate a reset token
        const token = generateRandom(20);
        const link = `${process.env.BASE_URL}/reset-link/${user[0]._id}/${token}`;

        const mailDetails = {
            from: 'rmlbb.noreply@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: '<p>A password reset request for your rmlbb username <strong>"' + username + '"</strong> has been made for this email address.</p><p>Click this <a href="' + link + '">link</a> to reset your password. The link will expire in 1 hour.</p><p>If you did not request a password reset, ignore this email.</p>',
        };

        // add the reset token and expiration date to the user in the db
        const expiresDate = new Date(Date.now() + (60 * 60 * 1000));
        const updateResult = await db
            .collection('users')
            .updateOne({ _id: _id }, { $set: { resetPasswordToken: token, resetPasswordExpires: expiresDate } });

        if (updateResult?.modifiedCount !== 1) return { code: 500 };

        try {
            const emailSent = await mailTransporter.sendMail(mailDetails);
            return emailSent ? { code: 200 } : { code: 500 };
        } catch (error) {
            console.log(error);
            return { code: 500 };
        }
    } else {
        // username and email address doesn't match any user in the database
        return { code: 404 };
    }
}

export async function addUser(username: string, password: string, email: string, active = true) {
    const pattern1 = new RegExp(usernamePattern);
    if (!username || !pattern1.test(username)) return { code: 400 };

    const pattern2 = new RegExp(passwordPattern);
    if (!password || !pattern2.test(password)) return { code: 400 };

    const pattern3 = new RegExp(emailPattern);
    if (!email || !pattern3.test(email)) return { code: 400 };

    try {
        const connection = await clientPromise;
        const db = connection.db();

        // first make sure the username isn't already in use
        const usernameResult = await checkForAvailableUsername(username);
        if (!usernameResult) return { code: 500 };
        if (usernameResult.length > 0) return { code: 409 };

        // at this point, the new username must not already be in use, so make the change
        const salt = generateRandom(32);
        const hashedPassword = hashPassword(password, salt);
        if (!hashedPassword) return null;

        const newUser = {
            username,
            password: hashedPassword,
            salt,
            email,
            role: 'user',
            active,
            registeredDate: new Date(Date.now()),
        };

        const result = await db
            .collection('users')
            .insertOne(newUser);

        return result?.insertedId ? { code: 201 } : { code: 500 };
    } catch (error) {
        console.log(error);
        return { code: 500 };
    }
}
