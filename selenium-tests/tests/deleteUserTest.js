const { Builder, By, until } = require("selenium-webdriver");

const deleteUserTest = async () => {
    let driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
    try {
        await driver.get("http://localhost:3000");

        // Kirjaudu sisään
        await login(driver);

        // Odota, että olet kirjautunut sisään ja olet etusivulla
        await driver.wait(until.elementLocated(By.css("[data-testid='frontpage-header']")), 10000);
        console.log("Logged in successfully and redirected to frontpage.");
        
        // Klikkaa Admin linkkiä navigaatiopalkissa
        await driver.findElement(By.xpath("//a[contains(text(), 'Admin')]")).click();
        console.log("Clicked Admin link.");

        // Odota admin-näkymän latautumista
        await driver.wait(until.elementLocated(By.className("adminContainer")), 10000);
        console.log("Admin page loaded successfully.");

        // Etsi toisen käyttäjän poistopainike ja klikkaa sitä
        const deleteButton = await driver.findElement(By.xpath("//tr[2]/td[6]/button"));
        await deleteButton.click();
        console.log("Clicked delete button for the second user.");

        // Odota vahvistusmodaalin näkyvän
        await driver.wait(until.elementLocated(By.className("confirmation-modal")), 5000);
        console.log("Confirmation modal appeared.");

        // Klikkaa "Yes" -painiketta poistoa vahvistaaksesi
        const yesButton = await driver.findElement(By.xpath("//button[contains(text(), 'Yes')]"));
        await yesButton.click();
        console.log("Clicked Yes button to confirm deletion.");

        console.log("User deleted successfully.");

        console.log("Delete user test finished.");

        
    } finally {
        await driver.quit();
    }
}

const login = async (driver) => {
    try {
        // Etsi ja klikkaa login-nappia
        await driver.findElement(By.css("[data-testid='loginNav']")).click();

        // Tarkista, että URL sisältää "/login"
        (await driver.getCurrentUrl()).includes("/login");
        
        // Odota, että kirjautumislomake latautuu
        await driver.wait(until.elementLocated(By.css("[data-testid='username']")), 10000);
        
        // Etsi käyttäjänimen ja salasanan syöttökentät ja syötä tiedot
        await driver.findElement(By.css("[data-testid='username']")).sendKeys("appleadam");
        await driver.findElement(By.css("[data-testid='password']")).sendKeys("appleadam");

        // Klikkaa kirjautumispainiketta
        await driver.findElement(By.css("[data-testid='login-button']")).click();
        
        // Odota kirjautumisprosessin loppumista
        await driver.wait(until.elementLocated(By.css("[data-testid='frontpage-header']")), 10000);
        console.log("Login successful! Redirected to frontpage.");
    } catch (error) {
        console.log("Login failed");
    }
}

deleteUserTest();

module.exports = { deleteUserTest };
