const sql = require("../../db/keywordSQL");
const { addRecipesKeyword } = require("../keywordController");

jest.mock("../../db/keywordSQL");

describe("addRecipesKeyWord", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle inserting keywords and recipe's ingredients to the database", async () => {
        const keyword = "Soup";
        const recipeId = 1;

        sql.addKeyword.mockResolvedValueOnce();
        sql.getKeywordId.mockResolvedValueOnce([{ id: 123 }]);
        sql.addRecipesKeyword.mockResolvedValueOnce();

        await addRecipesKeyword(keyword, recipeId);

        expect(sql.addKeyword).toHaveBeenCalledWith("Soup");
        expect(sql.getKeywordId).toHaveBeenCalledWith("Soup");
        expect(sql.addRecipesKeyword).toHaveBeenCalledWith(123, 1);
    });

    it("throws an error if any SQL query fails", async () => {
        const keyword = "Soup";
        const recipeId = 1;
        sql.addKeyword.mockRejectedValueOnce(new Error("Failed to add keyword"));

        await expect(addRecipesKeyword(keyword, recipeId)).rejects.toThrow("Failed to add keyword");
    
        // Verify that the other SQL functions were not called
        expect(sql.getKeywordId).not.toHaveBeenCalled();
        expect(sql.addRecipesKeyword).not.toHaveBeenCalled();
      });
});