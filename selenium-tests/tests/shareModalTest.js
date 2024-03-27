const { Builder, By, until } = require("selenium-webdriver");

const shareModalTest = async () => {
    let driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
    try {
        await driver.get("http://localhost:3000");

        // Wait for the page to load
        await driver.wait(until.elementLocated(By.className("recipeView")), 5000);
        console.log("Page loaded successfully.");

        // Click on a recipe to navigate to its page
        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Creamy Tomato Soup')]")), 5000).click(); 
        console.log("Navigated to recipe page.");

        // Wait for the recipe page to load
        await driver.wait(until.elementLocated(By.className("recipe-container")), 5000);
        console.log("Recipe page loaded.");

        // Click the share button to open the share modal
        await driver.findElement(By.css("[data-testid='shareButton']")).click();
        console.log("Clicked share button.");

         // Wait for the share modal to open
         await driver.wait(until.elementLocated(By.className("modal-content")), 5000);
         console.log("Share modal content loaded.");
 
         await driver.wait(until.elementLocated(By.className("modal-group")), 5000);
         console.log("Share modal group loaded.");
 
         // Wait for the input field to be visible
         await driver.wait(until.elementIsVisible(driver.findElement(By.css(".url"))), 5000);
         console.log("Share modal input field visible.");
 
         // Click the copy-button
         await driver.findElement(By.css("[data-testid='copy-button']")).click();
         console.log("Clicked copy button.");
 
         console.log("Share modal test finished");
     } finally {
         await driver.quit();
     }
 }

shareModalTest();

module.exports = { shareModalTest };
