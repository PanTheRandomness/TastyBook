const jwt = require("jsonwebtoken");
const { signJWT } = require("../signJWT");

jest.mock("jsonwebtoken");

describe("signJWT", () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should sign a JWT with correct arguments", async () => {
        const userId = "123";
        const username = "testuser";
        const role = null;

        // Mock the jwt.sign function
        jwt.sign.mockImplementation((payload, secret, options, callback) => {
            // Simulate successful signing
            callback(null, "mockedToken");
        });

        // Call the signJWT function
        const token = await signJWT(userId, username, role);

        // Assert that jwt.sign was called with the correct arguments
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: userId, username: username, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            expect.any(Function) // Expect it to be a callback function
        );

        // Assert that the function returns the expected token
        expect(token).toEqual("mockedToken");
    });

    it("should handle signing errors and reject the promise", async () => {
        const userId = "123";
        const username = "testuser";
        role = "admin";

        // Mock the jwt.sign function to simulate an error
        const errorMessage = "Signing error";
        jwt.sign.mockImplementation((payload, secret, options, callback) => {
            // Simulate an error during signing
            callback(errorMessage);
        });

        // Call the signJWT function
        await expect(signJWT(userId, username, role)).rejects.toEqual(errorMessage);

        // Assert that jwt.sign was called with the correct arguments
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: userId, username: username, role: role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            expect.any(Function) // Expect it to be a callback function
        );
    });
});