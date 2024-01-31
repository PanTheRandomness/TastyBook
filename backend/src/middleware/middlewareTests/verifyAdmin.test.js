const { verifyAdmin } = require("../verifyAdmin");

describe("verifyAdmin", () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            user: {
                role: "admin",
            },
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should pass with admin role", () => {
        verifyAdmin(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it("should handle non-admin user with 401 status code", () => {
        // Set the role to a non-admin value
        req.user.role = null;

        verifyAdmin(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
});