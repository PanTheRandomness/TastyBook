const { executeSQL } = require("../executeSQL");
const { addFavourite, deleteFavourite } = require("../favouriteSQL");

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
    it("should detele favourite from database", async () => {
        const recipeId = 1;
        const userId = 1;

        await deleteFavourite(recipeId, userId);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM favourite WHERE Recipe_id=? AND User_id=?", [recipeId, userId]);
    });
});