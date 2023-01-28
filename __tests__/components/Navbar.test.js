import { render, screen, within } from '@testing-library/react';
import Navbar from '../../app/components/Navbar.js';
import '@testing-library/jest-dom';

describe('Navbar', () => {
    test('test the navigation links', () => {
        render(<Navbar />);

        const navElement = screen.getByRole('navigation');
        expect(navElement).toBeInTheDocument();

        const navList = within(navElement).getByRole('list');
        expect(navList).toBeInTheDocument();

        const items = within(navList).getAllByRole('listitem');
        expect(items.length).toBe(3);

        const links = within(navList).getAllByRole('link');
        expect(links.length).toBe(3);
        expect(links[0]).toHaveTextContent(/^Page 1$/i);
        expect(links[0]).toHaveAttribute('href', '/page1');
        expect(links[1]).toHaveTextContent(/^Page 2$/i);
        expect(links[1]).toHaveAttribute('href', '/page2');
        expect(links[2]).toHaveTextContent(/^Page 3$/i);
        expect(links[2]).toHaveAttribute('href', '/page3');
    });
});
