const { executeSQL } = require("../executeSQL");

jest.mock("mysql", () => {
    const mockConnection = {
        query: jest.fn()
    };
    return {
        createConnection: jest.fn(() => mockConnection)
    };
});

describe("executeSQL", () => {
    it("should resolve with the result when query is successful", async () => {
        const mockResult = [{ id: 1, username: "testuser" }];

        // Mock the query method to resolve with the mockResult
        require("mysql").createConnection().query.mockImplementationOnce((query, params, callback) => {
            callback(null, mockResult, null);
        });

        const result = await executeSQL("SELECT * FROM user", []);

        // Check if query is called with the correct parameters
        expect(require("mysql").createConnection().query).toHaveBeenCalledWith("SELECT * FROM user", [], expect.any(Function));

        // Check if the function returns the expected result
        expect(result).toEqual(mockResult);
    });

    it("should reject with an error when query encounters an error", async () => {
        const mockError = new Error("Database error");

        // Mock the query method to reject with the mockError
        require("mysql").createConnection().query.mockImplementationOnce((query, params, callback) => {
            callback(mockError, null, null);
        });

        // Use the test to assert the rejection
        await expect(executeSQL("SELECT * FROM user", [])).rejects.toEqual(mockError);

        // Check if query is called with the correct parameters
        expect(require("mysql").createConnection().query).toHaveBeenCalledWith("SELECT * FROM user", [], expect.any(Function));
    });
});