-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(45) NOT NULL,
  `registrationState` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Recipe`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Recipe` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `User_id` INT NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `visibleToAll` TINYINT NOT NULL,
  `created` DATETIME NOT NULL,
  `modified` DATETIME NULL,
  PRIMARY KEY (`id`, `User_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Recipe_User1_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Recipe_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `mydb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Ingredient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Ingredient` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`RecipesIngredient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`RecipesIngredient` (
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
    REFERENCES `mydb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RecipesIngredient_Ingredient1`
    FOREIGN KEY (`Ingredient_id`)
    REFERENCES `mydb`.`Ingredient` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Review` (
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
    REFERENCES `mydb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Review_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `mydb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Keyword`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Keyword` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `word` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Favourite`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Favourite` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Recipe_id` INT NOT NULL,
  `User_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`, `User_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Favourites_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  INDEX `fk_Favourite_User1_idx` (`User_id` ASC) VISIBLE,
  CONSTRAINT `fk_Favourites_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `mydb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Favourite_User1`
    FOREIGN KEY (`User_id`)
    REFERENCES `mydb`.`User` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`RecipesKeyword`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`RecipesKeyword` (
  `id` INT ZEROFILL NOT NULL,
  `Recipe_id` INT NOT NULL,
  `Keyword_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`, `Keyword_id`),
  UNIQUE INDEX `idRecipesKeywords_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_RecipesKeyword_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  INDEX `fk_RecipesKeyword_Keyword1_idx` (`Keyword_id` ASC) VISIBLE,
  CONSTRAINT `fk_RecipesKeyword_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `mydb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RecipesKeyword_Keyword1`
    FOREIGN KEY (`Keyword_id`)
    REFERENCES `mydb`.`Keyword` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Image` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `filename` VARCHAR(255) NOT NULL,
  `Recipe_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Recipe_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_Image_Recipe1_idx` (`Recipe_id` ASC) VISIBLE,
  CONSTRAINT `fk_Image_Recipe1`
    FOREIGN KEY (`Recipe_id`)
    REFERENCES `mydb`.`Recipe` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
