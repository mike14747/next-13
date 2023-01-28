import { render, screen } from '@testing-library/react';
import HomePage from '../app/page.js';
import '@testing-library/jest-dom';

describe('Home', () => {
    test('renders a heading', () => {
        render(<HomePage />);

        const heading = screen.getByRole('heading', {
            name: /welcome to next\.js!/i,
        });

        expect(heading).toBeInTheDocument();
    });
});
