const { Builder, By, until } = require("selenium-webdriver");

const searchTest = async (keyword) => { 
    let driver = await new Builder().forBrowser("chrome").build();
    try {
        await driver.get("http://localhost:3000");
        
        await driver.findElement(By.css("[data-testid='searchNav']")).click();

        (await driver.getCurrentUrl()).includes("/search");

        await driver.findElement(By.css("[data-testid='searchByKeywordBtn']")).click();
        console.log("Clicked search by keyword button.");

        // Valitse hakukenttä ja syötä hakusana
        await driver.findElement(By.id("keywordInput")).sendKeys(keyword);
        console.log("Clicked post review button.");

        // Klikkaa hakupainiketta
        await driver.findElement(By.css("[data-testid='searchviewbtn']")).click();
        console.log("Clicked search button.");

        // Odota hakutuloksia
        await driver.wait(until.elementLocated(By.css(".recipeViewContainer")), 5000);

        // Tulosta hakutulokset
        const searchResults = await driver.findElements(By.css(".recipeViewContainer > li"));
        console.log("Search successfully.");
        console.log("Search test finished!");
        for (let i = 0; i < searchResults.length; i++) {
            console.log(await searchResults[i].getText());
        }
    } finally {
        await driver.quit();
    }
};

searchTest("soup"); 
