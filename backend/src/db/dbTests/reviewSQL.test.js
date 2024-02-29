const { addReview, getReviews } = require("../reviewSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("addReview", () => {
    it("should add recipe to database", async () => {
        const rating = 5;
        const text = "text";
        const recipeId = 3;
        const userId = 2;

        await addReview(rating, text, recipeId, userId)

        expect(executeSQL).toHaveBeenCalledWith("INSERT INTO review (rating, text, Recipe_id, User_id) VALUES (?,?,?,?)", [rating, text, recipeId, userId]);
    });
});

describe("getReviews", () => {
    it("should get reviews from the database", async () => {
        const recipeId = 1;

        await getReviews(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, r.rating, r.text, u.username FROM review r LEFT JOIN user u ON r.User_id=u.id WHERE r.Recipe_id=?", [recipeId]);
    });
});