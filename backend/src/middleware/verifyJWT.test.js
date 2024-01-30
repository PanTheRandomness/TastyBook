const { verifyJWT } = require("./verifyJWT");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

describe("verifyJWT middleware", () => {
    let req, res, next;

    beforeEach(() => {
        req = { headers: {} };
        res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();
    });

    // If this test is second expect(jwt.verify).not.toHaveBeenCalled() fails???
    it("should return 401 status if token is missing", () => {
        verifyJWT(req, res, next);
        
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });

    it("should call next if token is valid", () => {
        const token = "valid-token";
        req.headers.authorization = `Bearer ${token}`;

        jwt.verify.mockReturnValueOnce({ userId: "123", username: "testuser", role: null });

        verifyJWT(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
        expect(req.user).toEqual({ userId: "123", username: "testuser", role: null });
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should return 401 status if token is invalid", () => {
        const token = "invalid-token";
        req.headers.authorization = `Bearer ${token}`;

        jwt.verify.mockImplementationOnce(() => {
            throw new Error("Invalid token");
        });

        verifyJWT(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
        expect(req.user).toBeUndefined();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalled();
    });
});