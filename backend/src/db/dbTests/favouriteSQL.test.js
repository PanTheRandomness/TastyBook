const { executeSQL } = require("../executeSQL");
const { addFavourite, deleteFavourite, getFavourites, isFavourite } = require("../favouriteSQL");

jest.mock("../executeSQL");

describe("addFavourite", () => {
    it("should add favourite to database", async () => {
        const recipeId = 1;
        const userId = 1;

        await addFavourite(recipeId, userId);

        expect(executeSQL).toHaveBeenCalledWith("INSERT IGNORE INTO favourite (Recipe_id, User_id) VALUES (?,?)", [recipeId, userId]);
    });
});

describe("deleteFavourite", () => {
    it("should delete favourite from database", async () => {
        const recipeId = 1;
        const userId = 1;

        await deleteFavourite(recipeId, userId);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM favourite WHERE Recipe_id=? AND User_id=?", [recipeId, userId]);
    });
});

describe("getFavourites", () => {
    it("should get favourites from database", async () => {
        const userId = 1;

        await getFavourites(userId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id LEFT JOIN favourite f ON f.Recipe_id=r.id WHERE f.User_id=? GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", [userId]);
    });
});

describe("isFavourite", () => {
    it("should check if the recipe is marked favourite", async () => {
        const userId = 1;
        const recipeId = 1;

        await isFavourite(userId, recipeId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT id FROM favourite WHERE User_id=? AND Recipe_id=?", [userId, recipeId]);
    });
});