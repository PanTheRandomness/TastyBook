const { addKeyword, getKeywordId, addRecipesKeyword } = require("../keywordSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("addKeyword", () => {
    it("should insert a keyword into the database", async () => {
        const word = "Soup";

        await addKeyword(word);

        expect(executeSQL).toHaveBeenCalledWith("INSERT IGNORE INTO keyword (word) VALUES (?)", [word]);
    });
});

describe("getKeyWordId", () => {
    it("should return id for a keyword from the database", async () => {
        const word = "Soup";
        executeSQL.mockResolvedValueOnce([{ id: 1 }]);

        const result = await getKeywordId(word);

        expect(executeSQL).toHaveBeenCalledWith("SELECT id FROM keyword WHERE word=?", [word]);
        expect(result).toEqual([{ id: 1 }]);
    });
});

describe("addRecipesKeyword", () => {
    it("should insert a recipes keyword into the database", async () => {
        const keywordId = 1;
        const recipeId = 1;

        await addRecipesKeyword(keywordId, recipeId);

        expect(executeSQL).toHaveBeenCalledWith("INSERT INTO recipeskeyword (Keyword_id, Recipe_id) VALUES (?,?)", [keywordId, recipeId]);
    });
});