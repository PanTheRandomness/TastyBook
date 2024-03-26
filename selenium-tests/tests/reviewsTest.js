const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("./loginTest");

const reviewsTest = async () => {
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
        // Locate the review input field and enter some text
        await driver.findElement(By.css("[data-testid='reviewInput']")).sendKeys("This is a test review.");
        console.log("Entered review text.");

        // Select a rating
        await driver.findElement(By.css("[data-testid='ratingselect']")).sendKeys("5");
        console.log("Selected rating.");

        // Click the post review button
        await driver.findElement(By.css("[data-testid='postreviewbtn']")).click();
        console.log("Clicked post review button.");

        // Wait for the review to be posted
        await driver.wait(until.elementLocated(By.css(".review")), 5000);
        console.log("Review posted successfully.");

        console.log("Reviews test finished");
    } finally {
        await driver.quit();
    }
}

module.exports = { reviewsTest };