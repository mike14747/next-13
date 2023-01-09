import PropTypes from 'prop-types';

export default function Page({ params: { id } }) {
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

Page.propTypes = {
    params: PropTypes.number,
};
