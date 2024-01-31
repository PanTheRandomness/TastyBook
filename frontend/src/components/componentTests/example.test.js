import { render, screen } from '@testing-library/react';
import ExampleComponent from "../exampleComponent";

test('renders example component', () => {
    render(<ExampleComponent />);
    const text = screen.getByText(/Example/i);
    expect(text).toBeInTheDocument();
});