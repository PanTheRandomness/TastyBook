import React from "react";
import { render, fireEvent } from "@testing-library/react";
import NavigationBar from "../NavigationBar";
import { useUser } from "../../customHooks/useUser";
import { BrowserRouter } from "react-router-dom";

jest.mock("../../customHooks/useUser");

describe("NavigationBar component", () => {
    test("renders Register and Login links when user is not logged in", () => {
        useUser.mockReturnValue({ user: null });

        const { getByText } = render(<BrowserRouter><NavigationBar /></BrowserRouter>);

        expect(getByText("Register")).toBeInTheDocument();
        expect(getByText("Login")).toBeInTheDocument();
    });

    test("renders Add Recipe, Admin, and Logout links when user is logged in as admin", () => {
        useUser.mockReturnValue({ user: { role: "admin" } });

        const { getByText } = render(<BrowserRouter><NavigationBar /></BrowserRouter>);

        expect(getByText("Add Recipe")).toBeInTheDocument();
        expect(getByText("Admin")).toBeInTheDocument();
        expect(getByText("Logout")).toBeInTheDocument();
    });

    test("renders Add Recipe and Logout links when user is logged in as non-admin", () => {
        useUser.mockReturnValue({ user: { role: null } });

        const { getByText, queryByText } = render(<BrowserRouter><NavigationBar /></BrowserRouter>);

        expect(getByText("Add Recipe")).toBeInTheDocument();
        expect(queryByText("Admin")).not.toBeInTheDocument();
        expect(getByText("Logout")).toBeInTheDocument();
    });

    test("calls onLogout function when Logout link is clicked", () => {
        useUser.mockReturnValue({ user: { role: null } });
        const onLogout = jest.fn();

        const { getByText } = render(<BrowserRouter><NavigationBar onLogout={onLogout} /></BrowserRouter>);

        fireEvent.click(getByText("Logout"));
        expect(onLogout).toHaveBeenCalledTimes(1);
    });
});