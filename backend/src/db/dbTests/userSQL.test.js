const { addUser, findUserByUsernameAndEmail, isUserTableNotEmpty, getAllUsers, deleteUser } = require("../userSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("findUserByUsernameAndEmail", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should execute the correct SQL query for username only", async () => {
        const username = "testUser";
        const expectedQuery = "SELECT * FROM user WHERE username=?";
        executeSQL.mockResolvedValueOnce([]);

        await findUserByUsernameAndEmail(username);

        expect(executeSQL).toHaveBeenCalledWith(expectedQuery, [username]);
    });

    it("should execute the correct SQL query for username and email", async () => {
        const username = "testUser";
        const email = "test@example.com";
        const expectedQuery = "SELECT * FROM user WHERE username=? OR email=?";
        executeSQL.mockResolvedValueOnce([]);

        await findUserByUsernameAndEmail(username, email);

        expect(executeSQL).toHaveBeenCalledWith(expectedQuery, [username, email]);
    });
});

describe("isUserTableNotEmpty", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should return 1 if user table is not empty", async () => {
        executeSQL.mockResolvedValueOnce([{ "EXISTS (SELECT 1 FROM user)": 1 }]);

        const result = await isUserTableNotEmpty();

        expect(executeSQL).toHaveBeenCalledWith("SELECT EXISTS (SELECT 1 FROM user)", []);

        expect(result).toEqual([{ "EXISTS (SELECT 1 FROM user)": 1 }]);
    });

    it("should return 0 if user table is empty", async () => {
        executeSQL.mockResolvedValueOnce([{ "EXISTS (SELECT 1 FROM user)": 0 }]);

        const result = await isUserTableNotEmpty();

        expect(executeSQL).toHaveBeenCalledWith("SELECT EXISTS (SELECT 1 FROM user)", []);

        expect(result).toEqual([{ "EXISTS (SELECT 1 FROM user)": 0 }]);
    });
});

describe("addUser", () => {
    it("should insert a user into the database", async () => {
        executeSQL.mockResolvedValueOnce({ insertId: 1 });

        const username = "testuser";
        const name = "Test User";
        const email = "test@example.com";
        const password = "hashedpassword";
        const admin = null;

        const result = await addUser(username, name, email, password, admin);

        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO user (username, name, email, password, admin) VALUES (?,?,?,?,?)",
            [username, name, email, password, admin]
        );

        expect(result).toEqual({ insertId: 1 });
    });
});

describe("getAllUsers", () => {
    it("should return all users from the database", async () => {
        const mockUsers = [
            { id: 1, username: "user1", name: "User One", email: "user1@example.com" },
            { id: 2, username: "user2", name: "User Two", email: "user2@example.com" },
        ];

        executeSQL.mockResolvedValueOnce(mockUsers);

        const result = await getAllUsers();

        expect(executeSQL).toHaveBeenCalledWith("SELECT id, username, name, email FROM user", []);

        expect(result).toEqual(mockUsers);
    });
});

describe("deleteUser", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should delete a user from the database", async () => {
        const userId = 1;

        // Mock the executeSQL function to resolve successfully
        executeSQL.mockResolvedValueOnce({ affectedRows: 1 });

        const result = await deleteUser(userId);

        // Check if executeSQL is called with the correct query and parameters
        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM user WHERE id=?", [userId]);

        // Check if the function returns the expected result
        expect(result).toEqual({ affectedRows: 1 });
    });

    it("should handle the case where user does not exist", async () => {
        const userId = 2;

        // Mock the executeSQL function to resolve with no affected rows
        executeSQL.mockResolvedValueOnce({ affectedRows: 0 });

        const result = await deleteUser(userId);

        // Check if executeSQL is called with the correct query and parameters
        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM user WHERE id=?", [userId]);

        // Check if the function returns the expected result
        expect(result).toEqual({ affectedRows: 0 });
    });
});