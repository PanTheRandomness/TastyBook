const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("./loginTest");

const frontpageTest = async () => {
    let driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
    try {
        await driver.get("http://localhost:3000");

        await driver.wait(until.elementLocated(By.className("recipeView")), 5000);

        let recipeViews = await driver.findElements(By.className("recipeView"));
        
        // Get the count of elements
        let count = recipeViews.length;
        if (count === 6) console.log("User not logged in sees correct amount of recipes");
        else console.log("User not logged in sees wrong amount of recipes");

        // Login
        login(driver);

        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Cucumber')]")), 5000);

        // Wait for recipe views to reload after login
        await driver.wait(until.elementLocated(By.className("recipeView")), 5000);

        recipeViews = await driver.findElements(By.className("recipeView"));
        count = recipeViews.length;
        console.log(count)
        if (count === 10) console.log("User logged in sees correct amount of recipes");
        else console.log("User logged in sees wrong amount of recipes");

        console.log("Frontpage test finished");
    } finally {
        await driver.quit();
    }
}

frontpageTest();

module.exports = { frontpageTest };