const bcrypt = require("bcrypt");
const { signJWT } = require("../signJWT");
const sql = require("../../db/userSQL");
const { signup, login, getAllUsers, deleteUser } = require("../userController");

jest.mock("bcrypt");
jest.mock("../signJWT");
jest.mock("../../db/userSQL");

describe("signup", () => {
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

    it("should handle successful signup without api key", async () => {
        // Mocking the necessary functions for successful signup
        sql.findUserByUsernameAndEmail.mockResolvedValue([]);
        sql.addUser.mockResolvedValue({ insertId: 1 });
        bcrypt.hash.mockResolvedValue("hashedpassword");
        signJWT.mockResolvedValue("mockedtoken");

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "mockedtoken" });
    });

    it("should handle successful signup with valid API key", async () => {
        // Set API key in the request body
        req.body.api_key = process.env.ADMIN_REGISTRATION_API_KEY;

        // Mocking the necessary functions for successful signup with API key
        sql.findUserByUsernameAndEmail.mockResolvedValue([]);
        sql.addUser.mockResolvedValue({ insertId: 1 });
        bcrypt.hash.mockResolvedValue("hashedpassword");
        signJWT.mockResolvedValue("mockedtoken");

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: "mockedtoken" });
    });

    it("should handle invalid API key with 401 status code", async () => {
        // Set an invalid API key in the request body
        req.body.api_key = "invalidapikey";

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
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

describe("login", () => {
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

describe("getAllUsers", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("should return users when getAllUsers is successful", async () => {
        const mockUsers = [{ id: 1, username: "user1" }, { id: 2, username: "user2" }];
        sql.getAllUsers.mockResolvedValue(mockUsers);

        await getAllUsers(req, res);

        expect(sql.getAllUsers).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ users: mockUsers });
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should handle errors and return 500 status on failure", async () => {
        const mockError = new Error("Database error");
        sql.getAllUsers.mockRejectedValue(mockError);

        await getAllUsers(req, res);

        expect(sql.getAllUsers).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });
});

describe("deleteUser", () => {
    const userId = 123;
    let req, res;

    beforeEach(() => {
        req = {
            params: {
                userId: userId,
            },
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should delete a user and return 200 status on success", async () => {

        await deleteUser(req, res);

        expect(sql.deleteUser).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors and return 500 status on failure", async () => {
        const mockError = new Error("Database error");
        sql.deleteUser.mockRejectedValue(mockError);

        await deleteUser(req, res);

        expect(sql.deleteUser).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});