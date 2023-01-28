import PropTypes from 'prop-types';
import Header from './components/Header';
import Footer from './components/Footer';

import '../styles/mg_base.css';
import '../styles/globals.css';

export default function RootLayout({ children }) {
    return (
        <html>
            <head />
            <body id="appWrapper">
                <Header />

                <div className='page-container'>
                    {children}
                </div>

                <Footer />
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
};
