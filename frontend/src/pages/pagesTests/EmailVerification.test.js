import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { useParams, useNavigate } from 'react-router-dom';
import EmailVerification from "../EmailVerification";
import { verifyEmail } from "../../api/userApi";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock("../../api/userApi", () => ({
    verifyEmail: jest.fn(),
}));

describe("EmailVerification", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders null while loading", async () => {
        useParams.mockReturnValue({ verificationString: "some_verification_string" });

        await act(async () => {
            const { container } = render(<EmailVerification />);
            expect(container.firstChild).toBeNull();
        });
    });

    it("renders error message on failed verification", async () => {
        useParams.mockReturnValue({ verificationString: "some_verification_string" });
        verifyEmail.mockRejectedValue(new Error("Verification failed"));
    
        const { getByTestId } = render(<EmailVerification />);
        
        await waitFor(() => expect(getByTestId("error")).toBeInTheDocument());
    });

    it("navigates to /login after successful verification", async () => {
        useParams.mockReturnValue({ verificationString: "some_verification_string" });
    
        const navigateMock = jest.fn();
        useNavigate.mockReturnValue(navigateMock);
    
        const { queryByText } = render(<EmailVerification />);
        await act(async () => {
            expect(verifyEmail).toHaveBeenCalledWith("some_verification_string");
            await new Promise(resolve => setTimeout(resolve, 0));
            
            expect(queryByText("Email verification failed")).not.toBeInTheDocument();
            
            expect(navigateMock).toHaveBeenCalledWith("/login");
        });
    });
});