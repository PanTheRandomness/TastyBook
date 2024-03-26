require("dotenv").config();
const { frontpageTest } = require("./tests/frontpageTest");
const { reviewsTest } = require("./tests/reviewsTest");

const testAll = async () => {
    await frontpageTest();
    await reviewsTest();
}

testAll();