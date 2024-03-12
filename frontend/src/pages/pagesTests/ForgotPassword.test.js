import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import ForgotPassword from "../ForgotPassword";
import { forgotPassword } from "../../api/userApi";

jest.mock("../../api/userApi", () => ({
    forgotPassword: jest.fn(),
}));

describe("ForgotPassword component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders the Forgot Password component", () => {
        const { getByText, getByPlaceholderText } = render(<ForgotPassword />);
        expect(getByText("Forgot Password")).toBeInTheDocument();
        expect(getByText("Enter your email and we\'ll send you a reset link")).toBeInTheDocument();
        expect(getByPlaceholderText("email")).toBeInTheDocument();
        expect(getByText("Send reset link")).toBeInTheDocument();
    });

    it("submits the form and displays error message on failure", async () => {
        const errorMessage = "Reset link failed";
        forgotPassword.mockRejectedValue(new Error(errorMessage));
        const { getByPlaceholderText, getByText } = render(<ForgotPassword />);

        const emailInput = getByPlaceholderText("email");
        const submitButton = getByText("Send reset link");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await act(async () => {
            expect(forgotPassword).toHaveBeenCalledWith("test@example.com");
        });
        await waitFor(() => expect(getByText(errorMessage)).toBeInTheDocument());
    });

    it("submits the form successfully", async () => {
        forgotPassword.mockResolvedValue();
        const { getByPlaceholderText, getByText, queryByText } = render(<ForgotPassword />);

        const emailInput = getByPlaceholderText("email");
        const submitButton = getByText("Send reset link");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.click(submitButton);

        await act(async () => {
            expect(forgotPassword).toHaveBeenCalledWith("test@example.com");
            expect(queryByText("Reset link failed")).not.toBeInTheDocument();
        });
    });
});