const { addUser, findUserByUsernameAndEmail } = require("./userSQL");
const { executeSQL } = require("./executeSQL");

jest.mock("./executeSQL", () => ({
    executeSQL: jest.fn(),
}));

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

describe("addUser", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should call executeSQL with admin parameter", async () => {
        // Call the function
        await addUser("test-username", "Test User", "test@example.com", "test-password", 1);

        // Assertions
        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO user (username, name, email, password, admin) VALUES (?,?,?,?,?)",
            ["test-username", "Test User", "test@example.com", "test-password", 1]
        );
    });

    it("should call executeSQL without admin parameter", async () => {
        // Call the function
        await addUser("test-username", "Test User", "test@example.com", "test-password");

        // Assertions
        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO user (username, name, email, password) VALUES (?,?,?,?)",
            ["test-username", "Test User", "test@example.com", "test-password"]
        );
    });
});