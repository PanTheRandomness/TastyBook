const { addUser } = require("./userSQL");
const { executeSQL } = require("./executeSQL");

jest.mock("./executeSQL", () => ({
    executeSQL: jest.fn(),
}));

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