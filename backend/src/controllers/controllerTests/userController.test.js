const bcrypt = require("bcrypt");
const { signJWT } = require("../signJWT");
const sql = require("../../db/userSQL");
const { signup, login } = require("../userController");

jest.mock("bcrypt");
jest.mock("../signJWT");
jest.mock("../../db/userSQL");

describe("signup function", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: "testuser",
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            },
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle invalid request body with 400 status code", async () => {
        // Set one of the required fields to null
        req.body.username = null;
    
        await signup(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
      });

    it("should handle successful signup", async () => {
        // Mocking the necessary functions for successful signup
        sql.findUserByUsernameAndEmail.mockResolvedValue([]);
        sql.isUserTableNotEmpty.mockResolvedValue([{ "EXISTS (SELECT 1 FROM user)": 0 }]);
        sql.addUser.mockResolvedValue({ insertId: 1 });
        bcrypt.hash.mockResolvedValue("hashedpassword");
        signJWT.mockResolvedValue("mockedtoken");

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "mockedtoken" });
    });

    it("should handle duplicate user", async () => {
        // Mocking the necessary functions for duplicate user
        sql.findUserByUsernameAndEmail.mockResolvedValue([{ username: "testuser", email: "test@example.com" }]);

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        // Mocking the necessary functions for internal server error
        sql.findUserByUsernameAndEmail.mockRejectedValue(new Error("Database error"));

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("login function", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                username: "testuser",
                password: "password123",
            },
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle successful login", async () => {
        // Mocking the necessary functions for successful login
        sql.findUserByUsernameAndEmail.mockResolvedValue([{ id: 1, username: req.body.username, name: "Test User", email: "test@example.com", password: "hashedpassword", admin: null }]);
        bcrypt.compare.mockResolvedValue(true);
        signJWT.mockResolvedValue("mockedtoken");

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "mockedtoken" });
    });

    it("should handle invalid request body with 400 status code", async () => {
        // Set one of the required fields to null
        req.body.username = null;

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle user not found with 401 status code", async () => {
        // Mocking the necessary functions for user not found
        sql.findUserByUsernameAndEmail.mockResolvedValue([]);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle incorrect password with 401 status code", async () => {
        // Mocking the necessary functions for incorrect password
        sql.findUserByUsernameAndEmail.mockResolvedValue([{ id: 1, username: req.body.username, name: "Test User", email: "test@example.com", password: "hashedpassword", admin: null }]);
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        // Mocking the necessary functions for internal server error
        sql.findUserByUsernameAndEmail.mockRejectedValue(new Error("Database error"));

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});