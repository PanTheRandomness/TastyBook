const { addRecipe, addStep, getAllRecipeHashes, getSteps, getRecipes, deleteRecipe, deleteSteps, editRecipe, getImage } = require("../recipeSQL");
const { executeSQL } = require("../executeSQL");

jest.mock("../executeSQL");

describe("getAllRecipeHashes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all hashes from recipe table", async () => {
        executeSQL.mockReturnValueOnce([{ hash: "123"}, { hash: "234" }]);
        const result = await getAllRecipeHashes(true);

        expect(executeSQL).toHaveBeenCalledWith("SELECT hash FROM recipe", []);
        expect(result).toEqual([{ hash: "123"}, { hash: "234" }]);
    });

    it("should return all hashes that are visible to all if no argument given", async () => {
        executeSQL.mockReturnValueOnce([{ hash: "123"}, { hash: "234" }]);

        const result = await getAllRecipeHashes();

        expect(executeSQL).toHaveBeenCalledWith("SELECT hash FROM recipe WHERE visibleToAll=1", []);
        expect(result).toEqual([{ hash: "123"}, { hash: "234" }]);
    });
});

describe("getRecipes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    it("should fetch all recipes if no hash is given", async () => {
        executeSQL.mockReturnValueOnce([{ id: 1 }, { id: 2 }]);

        const result = await getRecipes(null, true);

        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id WHERE 1=1 GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", []);
        expect(result).toEqual([{ id: 1 }, { id: 2 }]);
    });

    it("should add hash to params if hash is given", async () => {
        const hash = "123";
        executeSQL.mockReturnValueOnce([{ id: 1 }]);

        const result = await getRecipes(hash, true);

        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id WHERE 1=1 AND r.hash=? GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", [hash]);
        expect(result).toEqual([{ id: 1 }]);
    });

    it("should only fetch recipes that are visible to all if no logged in", async () => {
        executeSQL.mockReturnValueOnce([{ id: 1 }]);

        const result = await getRecipes(null, false);

        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id WHERE 1=1 AND r.visibleToAll=1 GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", []);
        expect(result).toEqual([{ id: 1 }]);
    });

    it("should add ingredient to params if ingredient is given", async () => {
        executeSQL.mockReturnValueOnce([{ id: 1 }]);
        const ingredient = "test_ingredient";

        const result = await getRecipes(null, false, ingredient);
        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id LEFT JOIN recipesingredient ri ON ri.Recipe_id = r.id LEFT JOIN ingredient i ON ri.Ingredient_id = i.id WHERE 1=1 AND r.visibleToAll=1 AND i.name LIKE ? GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", [`%${ingredient}%`]);
        expect(result).toEqual([{ id: 1 }]);
    });

    it("should add keyword to params if keyword is given", async () => {
        executeSQL.mockReturnValueOnce([{ id: 1 }]);
        const keyword = "test_keyword"

        const result = await getRecipes(null, false, null, keyword);
        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id LEFT JOIN recipeskeyword rk ON rk.Recipe_id = r.id LEFT JOIN keyword k ON rk.Keyword_id = k.id WHERE 1=1 AND r.visibleToAll=1 AND k.word LIKE ? GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", [`%${keyword}%`]);
        expect(result).toEqual([{ id: 1 }]);
    });

    it("should add both keyword and ingredient to params if they are given", async () => {
        executeSQL.mockReturnValueOnce([{ id: 1 }]);
        const ingredient = "test_ingredient";
        const keyword = "test_keyword"

        const result = await getRecipes(null, false, ingredient, keyword);
        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id LEFT JOIN recipesingredient ri ON ri.Recipe_id = r.id LEFT JOIN ingredient i ON ri.Ingredient_id = i.id LEFT JOIN recipeskeyword rk ON rk.Recipe_id = r.id LEFT JOIN keyword k ON rk.Keyword_id = k.id WHERE 1=1 AND r.visibleToAll=1 AND i.name LIKE ? AND k.word LIKE ? GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", [`%${ingredient}%` ,`%${keyword}%`]);
        expect(result).toEqual([{ id: 1 }]);
    });

    it("should add username to params if given", async () => {
        executeSQL.mockReturnValueOnce([{ id: 1 }]);
        const username = "testuser";

        const result = await getRecipes(null, false, null, null, username);
        expect(executeSQL).toHaveBeenCalledWith("SELECT r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes, AVG(re.rating) AS average_rating FROM recipe r LEFT JOIN user u ON r.User_id=u.id LEFT JOIN review re ON re.Recipe_id=r.id WHERE 1=1 AND r.visibleToAll=1 AND u.username LIKE ? GROUP BY r.id, u.username, r.hash, r.header, r.description, r.visibleToAll, r.created, r.modified, r.durationHours, r.durationMinutes", [`%${username}%`]);
        expect(result).toEqual([{ id: 1 }]);
    });
});

describe("getImage", () => {
    it("should get image from database", async () => {
        const hash = "123";
        executeSQL.mockReturnValueOnce([{ image: 1 }]);

        const result = await getImage(hash);
        
        expect(executeSQL).toHaveBeenCalledWith("SELECT image FROM recipe WHERE hash=?", [hash]);
        expect(result).toEqual([{ image: 1 }]);
    });
});

describe("addRecipe", () => {
    it("should insert a recipe into the database", async () => {
        const userId = 1;
        const header = "Header";
        const hash = "123456";
        const description = "Tasty food";
        const visibleToAll = 1;
        const durationHours = 1;
        const durationMinutes = 0;
        const image = [0];

        executeSQL.mockReturnValueOnce({ insertedId: 1 });

        const result = await addRecipe(userId, header, hash, description, visibleToAll, durationHours, durationMinutes, image);

        expect(executeSQL).toHaveBeenCalledWith(
            "INSERT INTO recipe (User_id, header, hash, description, visibleToAll, durationHours, durationMinutes, created, image) VALUES (?,?,?,?,?,?,?,NOW(),?)",
            [userId, header, hash, description, visibleToAll, durationHours, durationMinutes, image]
        );
        expect(result).toEqual({ insertedId: 1 });
    });
});

describe("addStep", () => {
    it("should insert a step into the database", async () => {
        const step = "Do this";
        const number = 2;
        const recipeId = 3;

        await addStep(step, number, recipeId);

        expect(executeSQL).toHaveBeenCalledWith("INSERT INTO recipesteps (step, number, Recipe_id) VALUES (?,?,?)", [step, number, recipeId]);
    });
});

describe("getSteps", () => {
    it("should return all recipes steps", async () => {
        const recipeId = 1;
        executeSQL.mockReturnValueOnce([{ number: 1, step: "eka" }, { number: 2, step: "toka" }]);

        const result = await getSteps(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("SELECT number, step FROM recipesteps WHERE Recipe_id=? ORDER BY number", [recipeId]);
        expect(result).toEqual([{ number: 1, step: "eka" }, { number: 2, step: "toka" }]);
    });
});

describe("deleteRecipe", () => {
    it("should delete recipe from database", async () => {
        const hash = "123";
        const userId = 1;

        await deleteRecipe(hash, userId);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM recipe WHERE hash=? AND User_id=?", [hash, userId]);
    });
    
    it("should delete delete recipe when no userId is given", async () => {
        const hash = "123";

        await deleteRecipe(hash);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM recipe WHERE hash=?", [hash]);
    });
});

describe("editRecipe", () => {
    it("should update recipe in the database", async () => {
        const userId = 1;
        const header = "Header";
        const hash = "123456";
        const description = "Tasty food";
        const visibleToAll = 1;
        const durationHours = 1;
        const durationMinutes = 0;
        const image = [0];

        await editRecipe(header, description, visibleToAll, durationHours, durationMinutes, image, hash, userId)

        expect(executeSQL).toHaveBeenCalledWith(
            "UPDATE recipe SET header=?, description=?, visibleToAll=?, durationHours=?, durationMinutes=?, image=?, modified=NOW() WHERE hash=? AND User_id=?",
            [header, description, visibleToAll, durationHours, durationMinutes, image, hash, userId]);
    });
});

describe("deleteSteps", () => {
    it("should delete recipes steps from the database", async () => {
        const recipeId = 1;

        await deleteSteps(recipeId);

        expect(executeSQL).toHaveBeenCalledWith("DELETE FROM recipesteps WHERE Recipe_id=?", [recipeId]);
    });
});