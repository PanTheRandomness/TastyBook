-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema recipedb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema recipedb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `recipedb` DEFAULT CHARACTER SET utf8 ;
USE `recipedb` ;

-- -----------------------------------------------------
-- Table `recipedb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `admin` TINYINT NULL,
  `registrationState` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`Recipe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`Recipe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `hash` VARCHAR(45) NULL,
  `header` VARCHAR(45) NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `visibleToAll` TINYINT NULL,
  `created` DATETIME NULL,
  `modified` DATETIME NULL,
  PRIMARY KEY (`id`, `User_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Recipe_User1_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Recipe_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `recipedb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`Ingredient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`Ingredient` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`RecipesIngredient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`RecipesIngredient` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Recipe_id` INT NOT NULL,
  `quantity` VARCHAR(45) NULL,
  `Ingredient_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`, `Ingredient_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_RecipesIngredient_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  INDEX `fk_RecipesIngredient_Ingredient1_idx` (`Ingredient_id` ASC) VISIBLE,
  CONSTRAINT `fk_RecipesIngredient_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `recipedb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RecipesIngredient_Ingredient1`
    FOREIGN KEY (`Ingredient_id`)
    REFERENCES `recipedb`.`Ingredient` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`Review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`Review` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rating` INT NOT NULL,
  `text` VARCHAR(2000) NOT NULL,
  `User_id` INT NOT NULL,
  `Recipe_id` INT NOT NULL,
  PRIMARY KEY (`id`, `User_id`, `Recipe_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Review_User1_idx` (`User_id` ASC) VISIBLE,
  INDEX `fk_Review_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_Review_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `recipedb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Review_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `recipedb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`Keyword`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`Keyword` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`Favourite`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`Favourite` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Recipe_id` INT NOT NULL,
  `User_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`, `User_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Favourites_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  INDEX `fk_Favourite_User1_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Favourites_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `recipedb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Favourite_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `recipedb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`RecipesKeyword`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`RecipesKeyword` (
  `id` INT ZEROFILL NOT NULL,
  `Recipe_id` INT NOT NULL,
  `Keyword_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`, `Keyword_id`),
  UNIQUE INDEX `idRecipesKeywords_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_RecipesKeyword_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  INDEX `fk_RecipesKeyword_Keyword1_idx` (`Keyword_id` ASC) VISIBLE,
  CONSTRAINT `fk_RecipesKeyword_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `recipedb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RecipesKeyword_Keyword1`
    FOREIGN KEY (`Keyword_id`)
    REFERENCES `recipedb`.`Keyword` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `recipedb`.`Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `recipedb`.`Image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `Recipe_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Image_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_Image_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `recipedb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
