const bcrypt = require("bcrypt");
const { signJWT } = require("../signJWT");
const sql = require("../../db/userSQL");
const { signup, login, getAllUsers, deleteUser, forgotPassword, updatePassword } = require("../userController");
const { v4: uuidv4 } = require("uuid");
const { verificationEmail, passwordResetEmail } = require("../../utils/sendEmail");

jest.mock("bcrypt");
jest.mock("../signJWT");
jest.mock("../../db/userSQL");
jest.mock("../../db/executeSQL");
jest.mock("uuid");
jest.mock("../../utils/sendEmail");

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
        sql.addEmail.mockResolvedValue({ insertId: 1 });
        sql.addUser.mockResolvedValue({ insertId: 1 });
        bcrypt.hash.mockResolvedValue("hashedpassword");
        uuidv4.mockResolvedValue("123");
        verificationEmail.mockResolvedValue("123");

        signJWT.mockResolvedValue("mockedtoken");

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle successful signup with valid API key", async () => {
        // Set API key in the request body
        req.body.api_key = process.env.ADMIN_REGISTRATION_API_KEY;

        // Mocking the necessary functions for successful signup with API key
        sql.addEmail.mockResolvedValue({ insertId: 1 });
        sql.addUser.mockResolvedValue({ insertId: 1 });
        bcrypt.hash.mockResolvedValue("hashedpassword");
        uuidv4.mockResolvedValue("123");
        verificationEmail.mockResolvedValue("123");

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle invalid API key with 401 status code", async () => {
        // Set an invalid API key in the request body
        req.body.api_key = "invalidapikey";

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle duplicate user", async () => {
        // Mocking the necessary functions and calls
        bcrypt.hash.mockResolvedValue("hashedpassword");

        // Mock the functions from your SQL module
        const originalAddEmail = require("../../db/userSQL").addEmail;
        const originalAddUser = require("../../db/userSQL").addUser;

        // Mock the addEmail function to throw an error with code 'ER_DUP_ENTRY'
        require("../../db/userSQL").addEmail = jest.fn(() => {
            throw { code: 'ER_DUP_ENTRY' };
        });

        // Mock the addUser function to throw an error with code 'ER_DUP_ENTRY'
        require("../../db/userSQL").addUser = jest.fn(() => {
            throw { code: 'ER_DUP_ENTRY' };
        });

        // Mock the return value for executeSQL("BEGIN;");
        jest.spyOn(require("../../db/executeSQL"), "executeSQL").mockResolvedValue();

        await signup(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.send).toHaveBeenCalled();

        // Restore the original functions after the test
        require("../../db/userSQL").addEmail = originalAddEmail;
        require("../../db/userSQL").addUser = originalAddUser;
    });

    it("should handle internal server error", async () => {
        // Mocking the necessary functions for internal server error
        sql.addEmail.mockRejectedValue(new Error("Database error"));

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
        sql.findUserInfo.mockResolvedValue([{ id: 1, name: "Test User", email: "test@example.com", password: "hashedpassword", admin: null, isVerified: 1 }]);
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
        sql.findUserInfo.mockResolvedValue([]);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle incorrect password with 401 status code", async () => {
        // Mocking the necessary functions for incorrect password
        sql.findUserInfo.mockResolvedValue([{ id: 1, name: "Test User", email: "test@example.com", password: "hashedpassword", admin: null, isVerified: 1 }]);
        bcrypt.compare.mockResolvedValue(false);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle unverified user with 403 status code", async () => {
        sql.findUserInfo.mockResolvedValue([{ id: 1, name: "Test User", email: "test@example.com", password: "hashedpassword", admin: null }]);
        bcrypt.compare.mockResolvedValue(true);

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        // Mocking the necessary functions for internal server error
        sql.findUserInfo.mockRejectedValue(new Error("Database error"));

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
        expect(res.json).toHaveBeenCalledWith(mockUsers);
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
        sql.deleteUser.mockResolvedValue({ affectedRows: 1 });
        await deleteUser(req, res);

        expect(sql.deleteUser).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should 404 status if affectedRows is 0", async () => {
        sql.deleteUser.mockResolvedValue({ affectedRows: 0 });
        await deleteUser(req, res);

        expect(sql.deleteUser).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(404);
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

describe("forgotPassword", () => {
    beforeEach(() => {
        req = {
            body: { email: "test@example.com" }
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update verification string", async () => {
        sql.updateEmailVerification.mockResolvedValue({ affectedRows: 1 });
        passwordResetEmail.mockResolvedValue();

        await forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return status code 401 if affectedRows is zero", async () => {
        sql.updateEmailVerification.mockResolvedValue({ affectedRows: 0 });

        await forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors and return 500 status on failure", async () => {
        const mockError = new Error("Database error");
        sql.updateEmailVerification.mockRejectedValue(mockError);

        await forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});

describe("updatePassword", () => {
    beforeEach(() => {
        req = {
            body: { newPassword: "asd", verificationString: "123" }
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should update password", async () => {
        sql.updatePassword.mockResolvedValue({ affectedRows: 1 });

        await updatePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return status code 401 if affectedRows is zero", async () => {
        sql.updatePassword.mockResolvedValue({ affectedRows: 0 });

        await updatePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle errors and return 500 status on failure", async () => {
        const mockError = new Error("Database error");
        sql.updatePassword.mockRejectedValue(mockError);

        await updatePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});