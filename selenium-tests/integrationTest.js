require("dotenv").config();
const { favouriteTest } = require("./tests/favouriteTest");
const { frontpageTest } = require("./tests/frontpageTest");
const { reviewsTest } = require("./tests/reviewsTest");
const { searchTest } = require("./tests/searchTest");

const testAll = async () => {
    await frontpageTest();
    await reviewsTest();
    await searchTest();
    await favouriteTest();
}

testAll();