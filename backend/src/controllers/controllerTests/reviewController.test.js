const sql = require("../../db/reviewSQL");
const { addReview } = require("../reviewController");

jest.mock("../../db/reviewSQL");

describe("addReview", () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { rating: 3, text: "text", recipeId: 1 },
            user: { id: 1 }
        };
        res = {
            status: jest.fn(() => res),
            json: jest.fn(),
            send: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle incorrect request body", async () => {
        req.body.rating = null;

        await addReview(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if there is no recipe was found", async () => {
        sql.addReview.mockRejectedValue({ code: "ER_NO_REFERENCED_ROW_2" });

        await addReview(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalled();
    });

    it("adds review succesfully", async () => {
        sql.addReview.mockResolvedValueOnce();

        await addReview(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
    });

    it("should handle internal server error", async () => {
        sql.addReview.mockRejectedValue(new Error());

        await addReview(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalled();
    });
});