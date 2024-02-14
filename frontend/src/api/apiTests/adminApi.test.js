const { getAllUsers, deleteUser } = require("../adminApi");
const BASE_URL = "http://localhost:3004";

describe("Admin API", () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch all users with token", async () => {
        const token = "mockToken";
        fetch.mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce([
                { id: 1, name: "User 1", username: "user1", email: "user1@example.com" },
                { id: 2, name: "User 2", username: "user2", email: "user2@example.com" }
            ]),
        });

        const response = await getAllUsers(token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        expect(response).toEqual([
            { id: 1, name: "User 1", username: "user1", email: "user1@example.com" },
            { id: 2, name: "User 2", username: "user2", email: "user2@example.com" }
        ]);
    });

    it("should throw an error if fetch all users fails", async () => {
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(getAllUsers("mockToken")).rejects.toThrow("Fetch failed");
    });

    it("should delete a user with token", async () => {
        const token = "mockToken";
        const userId = 1;
        fetch.mockResolvedValueOnce({
            ok: true,
        });

        await deleteUser(userId, token);

        expect(fetch).toHaveBeenCalledWith(`${BASE_URL}/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
    });

    it("should throw an error if delete user fails", async () => {
        const token = "mockToken";
        const userId = 1;
        global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Fetch failed")));

        await expect(deleteUser(userId, token)).rejects.toThrow("Fetch failed");
    });
});
