require("dotenv").config();
const { deleteUserTest } = require("./tests/deleteUserTest");
const { favouriteTest } = require("./tests/favouriteTest");
const { frontpageTest } = require("./tests/frontpageTest");
const { reviewsTest } = require("./tests/reviewsTest");
const { searchTest } = require("./tests/searchTest");
const { shareModalTest } = require("./tests/shareModalTest");
//const { registerTest } = require("./tests/shareModalTest");

const testAll = async () => {
    await frontpageTest();
    await reviewsTest();
    await searchTest();
    await favouriteTest();
    await shareModalTest();
    await deleteUserTest();
    //await registerTest();
}

testAll();