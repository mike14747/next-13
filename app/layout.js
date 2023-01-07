import PropTypes from 'prop-types';

import '../styles/globals.css';

export default function RootLayout({ children }) {
    return (
        <html>
            <head />
            <body>
                {/* header component will go here */}

                <main>
                    {children}
                </main>

                {/* footer component will go here */}
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
};
