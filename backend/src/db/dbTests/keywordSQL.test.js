const { addKeyword, getKeywordId, addRecipesKeyword, getRecipesKeywords, deleteRecipesKeywords } = require("../keywordSQL");
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

describe("getRecipesKeywords", () => {
    it("should return all recipes keywords", async () => {
        const recipeId = 1;
        executeSQL.mockResolvedValueOnce([{ id: 1, word: "Soup" }, { id: 2, word: "Meat" }]);
        const result = await getRecipesKeywords(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT k.id, k.word FROM recipeskeyword rk LEFT JOIN keyword k ON rk.Keyword_id=k.id WHERE rk.Recipe_id=?", [recipeId]);
        expect(result).toEqual([{ id: 1, word: "Soup" }, { id: 2, word: "Meat" }]);
    });
});

describe("deleteRecipesKeywords", () => {
    it("should delete recipes keywords from the database", async () => {
        const recipeId = 1;

        await deleteRecipesKeywords(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM recipeskeyword WHERE Recipe_id=?", [recipeId]);
    });
});