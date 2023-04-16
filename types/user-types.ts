export type UserSignin = {
    _id: number;
    username: string;
    password: string;
    salt: string;
    role: string;
}

export type UserCollection = {
    _id: number;
}

export type UserProfile = {
    username: string;
    email: string;
    posts: number;
}

export type UserInfo = {
    id: string;
    username: string;
    email: string;
}
