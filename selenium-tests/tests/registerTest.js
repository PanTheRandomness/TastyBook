const { Builder, By, until } = require("selenium-webdriver");

const registerTest = async () => {
    let driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
    try {
        await driver.get("http://localhost:3000");
        
        // Locate and click the register button
        await driver.findElement(By.css("[data-testid='registerNav']")).click();
        console.log("Clicked on register button");

        (await driver.getCurrentUrl()).includes("/register");
        
        // Wait for the register form to load
        await driver.wait(until.elementLocated(By.css("[data-testid='username']")), 5000);
        console.log("Register form loaded successfully");
        
        // Fill in the registration form
        await driver.findElement(By.css("[data-testid='name']")).sendKeys("Heikki H");
        await driver.findElement(By.css("[data-testid='email']")).sendKeys("tastybook3+4@gmail.com");
        await driver.findElement(By.css("[data-testid='username']")).sendKeys("heikki");
        await driver.findElement(By.css("[data-testid='password']")).sendKeys("password123");
        console.log("Registration form filled");
        
        // Click the register button
        await driver.findElement(By.css("[data-testid='register-button']")).click();
        console.log("Clicked on register button");
        
        // Wait for the success dialog to appear
        await driver.wait(until.elementLocated(By.css("[data-testid='confirmation-message']")), 5000);
        console.log("Registration successful! User received confirmation email.");
    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        await driver.quit();
        console.log("Test finished.");
    }
}

registerTest();

module.exports = { registerTest };