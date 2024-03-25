const { Builder, By, until } = require("selenium-webdriver");

const loginTest = async () => {
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:3000");
        
        // Locate and click the login button
        await driver.findElement(By.css("[data-testid='loginNav']")).click();

        (await driver.getCurrentUrl()).includes("/login");
        
        // Wait for the login form to load
        await driver.wait(until.elementLocated(By.css("[data-testid='username']")), 5000);
        
        // Locate username and password input fields and enter text
        await driver.findElement(By.css("[data-testid='username']")).sendKeys("appleadam");
        await driver.findElement(By.css("[data-testid='password']")).sendKeys("appleadam");

        await driver.findElement(By.css("[data-testid='login-button']")).click();
        
        // Wait for login process to complete
        await driver.wait(until.elementLocated(By.css("[data-testid='frontpage-header']")), 5000);
        console.log("Login successful! Redirected to frontpage.");
    } finally {
        await driver.quit();
    }
}

loginTest();