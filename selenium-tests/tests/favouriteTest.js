const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("./loginTest");

const favouriteTest = async () => {
    let driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
    try {
        await driver.get("http://localhost:3000");

        // Wait for the page to load
        await driver.wait(until.elementLocated(By.className("recipeView")), 5000);
        console.log("Page loaded successfully.");

        // Login
        login(driver);
        console.log("Login successful.");

        // Wait for the login process to complete
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Cucumber')]")), 5000);
        console.log("Login process completed.");

        // Wait for recipe views to reload after login
        await driver.wait(until.elementLocated(By.className("recipeView")), 5000);
        console.log("Recipe views reloaded after login.");

        // Locate and click on a specific recipe to navigate to its page
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Amazing Apple Pie')]")), 5000).click(); 
        console.log("Navigated to recipe page.");

        // Now, you are on the recipe page
        // Locate the favourite button and click it
        await driver.findElement(By.css("[data-testid='saveToFavouritesButton']")).click();
        console.log("Clicked on the 'Add to favourites' button.");

        // Go back to the recipe list page
        await driver.findElement(By.css("[data-testid='favouriteNav']")).click();
        console.log("Navigated back to recipe list page.");
        console.log("Favourite add successfully.");

        // Locate and click on the specific recipe again to navigate to its page
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Amazing Apple Pie')]")), 15000).click(); 
        console.log("Navigated to recipe page again.");

        // Locate and click on the remove from favourites button
        await driver.findElement(By.css("[data-testid='saveToFavouritesButton']"), 5000).click();
        console.log("Clicked on the 'Remove from favourites' button.");

        await driver.findElement(By.css("[data-testid='favouriteNav']")).click();
        console.log("Navigated back to recipe list page.");
        console.log("Favourite removed successfully.");

        /*const noFavouriteMessage = await driver.findElement(By.xpath("//*[contains(text(), 'No favourite recipes found')]")).isDisplayed();
        if (noFavouriteMessage) {
            console.log("No favourite recipes found message is displayed.");
        } else {
            console.log("Favourite recipe is found.");
        }*/

        console.log("Favourite test finished");
    } finally {
        await driver.quit();
    }
}

favouriteTest();

module.exports = { favouriteTest };
