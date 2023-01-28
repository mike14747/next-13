import { render, screen } from '@testing-library/react';
import HomePage from '../../app/page.js';
import '@testing-library/jest-dom';

describe('Homepage', () => {
    test('renders a heading', () => {
        render(<HomePage />);

        expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/^homepage$/i);
    });
});
