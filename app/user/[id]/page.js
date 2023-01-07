import PropTypes from 'prop-types';

export default function User({ params: { id } }) {
    return (
        <>
            <p>
                This is the dynamic user page.
            </p>

            <p>
                The user selected is id {id}.
            </p>
        </>
    );
}

User.propTypes = {
    params: PropTypes.number,
};
