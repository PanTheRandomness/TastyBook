const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("./loginTest");

const recipetest = async () => {
    let driver = await new Builder().forBrowser(process.env.BROWSER || "chrome").build();
    try {
        await driver.get("http://localhost:3000");
        //Kirjaudutaan sisään
        login(driver);
        
        addrecipetest(driver);
        await driver.sleep(10000);
        //editrecipetest(driver);
        //deleterecipetest(driver);
    } finally {
        await driver.quit();
    }
}

const addrecipetest = async (driver) => {
    try {
        console.log("starting addrecipetest");
        // Siirrytään reseptinluontiin
        await driver.wait(until.elementLocated(By.css("[data-testid='addrecipeNav']")), 5000);
        await driver.findElement(By.css("[data-testid='addrecipeNav']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='recipeNameInput']")), 5000);
        console.log("input found");

        //Syötetään reseptin tietoja
        await driver.findElement(By.css("[data-testid='recipeNameInput']")).sendKeys("Test Recipe");
        await driver.findElement(By.css("[data-testid='recipeDescriptionInput']")).sendKeys("Testing, testing...");
        console.log("Name & Descripion input complete");

        // Etsitään checkbox ja uncheckataan se
        const checkbox = await driver.findElement(By.css("[data-testid='visibleInput']"));
        await checkbox.click();
        console.log("Checkbox located");

        // Odota, että näkyvyysviesti tulee näkyviin
        await driver.wait(until.elementLocated(By.css("[data-testid='visibilityMessage']")), 5000);
        console.log("Visibility Message confirmed");
        // Checkataan checkbox uudelleen
        await checkbox.click();
        console.log("Visibility set back to public");

        //Syötetään reseptin tietoja
        await driver.findElement(By.css("[data-testid='recipeHoursInput']")).sendKeys("3");
        await driver.findElement(By.css("[data-testid='recipeMinutesInput']")).sendKeys("30");
        console.log("recipe time input complete");

        //HUOM! Kuvan lisäämisen testaaminen

        //Lisätään ainesosat
        await driver.findElement(By.css("[data-testid='addIngredient']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='ingredient-dialog-title']")), 5000);
        await driver.findElement(By.css("[data-testid='quantityInput']")).sendKeys("3");
        await driver.findElement(By.css("[data-testid='unitInput']")).sendKeys("dl");
        await driver.findElement(By.css("[data-testid='ingredientInput']")).sendKeys("Flour");
        await driver.findElement(By.css("[data-testid='addIngredient-button']")).click();
        console.log("Ingredient 1 added successfully!");

        await driver.wait(until.elementLocated(By.css("[data-testid='recipeIngredients']")), 5000);
        await driver.findElement(By.css("[data-testid='addIngredient']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='ingredient-dialog-title']")), 5000);
        await driver.findElement(By.css("[data-testid='quantityInput']")).sendKeys("2");
        await driver.findElement(By.css("[data-testid='unitInput']")).sendKeys("l");
        await driver.findElement(By.css("[data-testid='ingredientInput']")).sendKeys("Water");
        await driver.findElement(By.css("[data-testid='addIngredient-button']")).click();
        console.log("Ingredient 2 added successfully!");

        //Muokataan ainesosaa
        await driver.wait(until.elementLocated(By.css("[data-testid='edit-ingredient-1']")), 5000);
        await driver.findElement(By.css("[data-testid='edit-ingredient-1']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='ingredient-dialog-title']")), 5000);
        const unitedit = await driver.findElement(By.css("[data-testid='unitInput']"));
        await unitedit.clear();
        await unitedit.sendKeys("dl");
        await driver.findElement(By.css("[data-testid='saveIngredient-button']")).click();
        console.log("Ingredient 2 edited successfully!");

        //Poistetaan ainesosa
        await driver.wait(until.elementLocated(By.css("[data-testid='remove-ingredient-0']")), 5000);
        await driver.findElement(By.css("[data-testid='remove-ingredient-0']")).click();
        let ingredients = await driver.findElements(By.className("recipeform-ingredient"));
        let ingcount = ingredients.length;
        if (ingcount === 1) console.log("Ingredient 1 removed successfully!");
        else console.log("Removal of ingredient was not a success");

        //Luodaan stepit
        await driver.findElement(By.css("[data-testid='addStep']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='step-input']")), 5000);
        await driver.findElement(By.css("[data-testid='step-input']")).sendKeys("First step");
        await driver.findElement(By.css("[data-testid='addstepbutton']")).click();
        console.log("Step 1 added successfully!");

        await driver.wait(until.elementLocated(By.css("[data-testid='recipeSteps']")), 5000);
        await driver.findElement(By.css("[data-testid='addStep']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='step-input']")), 5000);
        await driver.findElement(By.css("[data-testid='step-input']")).sendKeys("Second step");
        await driver.findElement(By.css("[data-testid='addstepbutton']")).click();
        console.log("Step 2 added successfully!");

        //Muokataan steppiä
        await driver.wait(until.elementLocated(By.css("[data-testid='edit-step-1']")), 5000);
        await driver.findElement(By.css("[data-testid='edit-step-1']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='step-input']")), 5000);
        const stepedit = await driver.findElement(By.css("[data-testid='step-input']"));
        await stepedit.clear();
        await stepedit.sendKeys("2nd step");
        await driver.findElement(By.css("[data-testid='savestepbutton']")).click();
        console.log("Step 2 edited successfully!");

        //Poistetaan step
        await driver.wait(until.elementLocated(By.css("[data-testid='remove-step-0']")), 5000);
        await driver.findElement(By.css("[data-testid='remove-step-0']")).click();
        let steps = await driver.findElements(By.className("recipeform-step"));
        let stpcount = steps.length;
        if (stpcount === 1) console.log("Step 1 removed successfully!");
        else console.log("Removal of step was not a success");

        //Luodaan avainsanat
        await driver.findElement(By.css("[data-testid='addKeyword']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='keyword-input']")), 5000);
        await driver.findElement(By.css("[data-testid='keyword-input']")).sendKeys("First keyword");
        await driver.findElement(By.css("[data-testid='addkeywordbutton']")).click();
        console.log("Keyword 1 added successfully!");

        await driver.wait(until.elementLocated(By.css("[data-testid='recipeKeywords']")), 5000);
        await driver.findElement(By.css("[data-testid='addKeyword']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='keyword-input']")), 5000);
        await driver.findElement(By.css("[data-testid='keyword-input']")).sendKeys("Second Keyword");
        await driver.findElement(By.css("[data-testid='addkeywordbutton']")).click();
        console.log("Keyword 2 added successfully!");

        //Muokataan avainsanaa
        await driver.wait(until.elementLocated(By.css("[data-testid='edit-keyword-1']")), 5000);
        await driver.findElement(By.css("[data-testid='edit-keyword-1']")).click();
        await driver.wait(until.elementLocated(By.css("[data-testid='keyword-input']")), 5000);
        const kwedit = await driver.findElement(By.css("[data-testid='keyword-input']"));
        await kwedit.clear();
        await kwedit.sendKeys("2nd keyword");
        await driver.findElement(By.css("[data-testid='savekeywordbutton']")).click();
        console.log("Keyword 2 edited successfully!");

        //Poistetaan step
        await driver.wait(until.elementLocated(By.css("[data-testid='remove-keyword-0']")), 5000);
        await driver.findElement(By.css("[data-testid='remove-keyword-0']")).click();
        let keywords = await driver.findElements(By.className("recipeform-keyword"));
        let kwcount = keywords.length;
        if (kwcount === 1) console.log("Keyword 1 removed successfully!");
        else console.log("Removal of keyword was not a success");

        //Painetaan tallennusnapista
        await driver.wait(until.elementLocated(By.css("[data-testid='postbutton']")), 5000);
        await driver.findElement(By.css("[data-testid='postbutton']")).click();

        //Painetaan confirm
        await driver.wait(until.elementLocated(By.css("[data-testid='save-dialog']")), 5000);
        await driver.findElement(By.css("[data-testid='confirm-button']")).click();

        //Odotetaan, että reseptisivu latautuu ja tarkistetaan onko oikeat tiedot
        await driver.wait(until.elementLocated(By.css("[data-testid='recipeheader']")), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.css("[data-testid='recipeheader']")), "Test Recipe"), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.css("[data-testid='recipedescription']")), "Testing, testing..."), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.css("[data-testid='duration']")), "Duration: 3h 30min"), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.css("[data-testid='likeyword']")), "2nd keyword"), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.css("[data-testid='liingredient']")), "2 dl water"), 5000);
        await driver.wait(until.elementTextContains(driver.findElement(By.css("[data-testid='listep']")), "2nd step"), 5000);
        console.log("Recipe created successfully!");
    } catch (error) {
        console.error(error);
    }
}

const editrecipetest = async (driver) => {
    try{
        //Painetaan ellipsistä

        //Painetaan edit recipe

        //Muokataan otsikkoa ja kuvausta

        //Painetaan tallenna

        //Painetaan confirm

        //Odotetaan reseptin latautumista ja tarkistetaan oikeat tiedot

    } catch (error) {
        console.error(error);
    }
}

const deleterecipetest = async (driver) => {
    try{
        //Painetaan ellipsistä

        //Painetaan delete recipe

        //Painetaan confirm

        //Odotetaan etusivun latautumista ja varmistetaan, ettei resepti ole olemassa

    } catch (error) {
        console.error(error);
    }
}
//ajo pois lopuksi, module.exports = { recipetest };
recipetest();
