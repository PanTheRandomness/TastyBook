const { addUser, getAllUsers, deleteUser } = require("../userSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");


describe("addUser", () => {
    it("should insert a user into the database", async () => {
        executeSQL.mockResolvedValueOnce({ insertId: 1 });

        const username = "testuser";
        const name = "Test User";
        const email_id = 1;
        const password = "hashedpassword";
        const admin = null;

        const result = await addUser(username, name, email_id, password, admin);

        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO user (username, name, Email_id, password, admin) VALUES (?,?,?,?,?);",
            [username, name, email_id, password, admin]
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