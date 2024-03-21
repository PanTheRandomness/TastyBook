const users = [
    {
        name: "Adam A", username: "appleadam", email: "tastybook3+1@gmail.com", admin: 1
    },
    {
        name: "Bert B", username: "bananabert", email: "tastybook3+2@gmail.com"
    },
    {
        name: "Claire C", username: "cinnamonclaire", email: "tastybook3+3@gmail.com"
    }
]

const recipes = [
    {
        header: "Amazing Apple Pie",
        image: "applepie.jpg",
        creator: "appleadam",
        description: "An amazingly tasty apple pie.",
        visibleToAll: 1,
	    durationHours: 2,
	    durationMinutes: 30,
        ingredients: [
            {
                quantity: "1kg", name: "apples"
            },
            {
                quantity: "190g+", name: "golden sugar"
            },
            {
                quantity: "0.5 tsp", name: "cinnamon"
            },
            {
                quantity: "350g + 3tbsp", name: "flour"
            },
            {
                quantity: "225g", name: "butter"
            },
            {
                quantity: "2", name: "eggs"
            },
            {
                name: "softly whipped cream"
            }
        ],
        steps: [
            "Peel and slice the apples to be around 5mm thick. Lay them on a backing sheet between 2 layers of paper towels.",
            "Beat the butter and 50g of sugar until mixed",
            "Add 1 whole egg and 2 yolk, keep the extra egg white for glazing",
            "Beat together for just under 1 min",
            "Work in 350g of flour with a wooden spoon, 1 third at a time. When it begins to clump, finish gathering by hand",
            "Gently work the dough into a ball, wrap in cling film, and chill for 45 mins",
            "Mix the rest of the sugar, cinnamon and 3 tbsp of flour for the filling in a bowl that is large enough to fit all the apple slices",
            "Heat the oven to 190C/fan",
            "Lightly beat the egg white with a fork",
            "Cut off a third of the pastry and keep it wrapped while you roll out the rest, and use this to line a pie tin - 20-22cm round and 4cm deep - leaving a slight overhang",
            "Roll the remaining third to a circle about 28cm in diameter.",
            "Pat the apples dry with kitchen paper, and tip them into the bowl with the cinnamon-sugar mix. Give a quick mix with your hands and immediately pile high into the pastry-lined tin.",
            "Brush a little water around the pastry rim and lay the pastry lid over the apples pressing the edges together to seal.",
            "Trim the edge with a sharp knife and make 5 little slashes on top of the lid for the steam to escape.",
            "Brush it all with the egg white and sprinkle with caster sugar.",
            "Bake for 40-45 mins, until golden, then remove and let it sit for 5-10 mins.",
            "Sprinkle with more sugar and serve while still warm from the oven with softly whipped cream."
        ],
        keywords: ["Apple", "Fruit", "Pie", "Baking"]
    },
    {
        header: "Fresh Cucumber & Avocado Salad",
        image: "salad.jpg",
	    creator: "bananabert",
	    description: "A fresh cucumber & avocado salad.",
	    durationHours: 0,
	    durationMinutes: 15,
        ingredients: [
            {
                quantity: "2 cloves", name: "garlic"
            },
            {
                quantity: "3 tsp", name: "sesame seeds"
            },
            {
                quantity: "1", name: "ripe avocado"
            },
            {
                quantity: "1", name: "cucumber"
            },
            {
                quantity: "a pinch of", name: "wasabi"
            },
            {
                quantity: "1 tbsp", name: "sesame oil"
            }
        ],
        steps: [
            "Peel the cucumber to ribbons",
            "Peel and cube the avocado",
            "Press the garlic",
            "Mix the veggies and sprinkle with sesame seeds and oil"
        ],
        keywords: ["Vegetarian", "Salad"]
    },
    {
        header:	"Quick Breakfast Omelette",
        image: "omelette.jpg",
	    creator: "appleadam",
	    description: "A basic and quick omelette",
	    visibleToAll: 1,
	    durationHours: 0,
	    durationMinutes: 10,
        ingredients: [
            {
                quantity: "3", name: "eggs, beaten"
            },
            {
                quantity: "1 tsp", name: "sunflower oil"
            },
            {
                quantity: "1 tsp", name: "butter"
            }
        ],
        steps: [
            "Season the beaten eggs well with salt and pepper.",
            "Heat the oil and butter in a non-stick frying pan over a medium-low heat until the butter has melted and is foaming.",
            "Pour the eggs into the pan, tilt the pan ever so slightly from one side to another to allow the eggs to swirl and cover the surface of the pan completely.",
            "Let the mixture cook for about 20 seconds then scrape a line through the middle with a spatula.",
            "Tilt the pan again to allow it to fill back up with the runny egg. Repeat once or twice more until the egg has just set.",
            "At this point you can fill the omelette with whatever you like - some grated cheese, sliced ham, fresh herbs, sautéed mushrooms or smoked salmon all work well. Scatter the filling over the top of the omelette and fold gently in half with the spatula.",
            "Slide onto a plate to serve."
        ],
        keywords: ["Omelette", "Basic", "Quick"]
    },
    {
        header: "Creamy Tomato Soup",
        image: "tomatosoup.jpg",
	    creator: "bananabert",
	    description: "A nice tomato soup",
	    visibleToAll: 1,
	    durationHours: 0,
	    durationMinutes: 30,
        ingredients: [
            {
                quantity: "2 tbsp", name: "unsalted butter"
            },
            {
                quantity: "2 tbsp", name: "olive oil"
            },
            {
                quantity: "1 medium", name: "onion, thinly sliced"
            },
            {
                quantity: "3", name: "garlic cloves, smashed"
            },
            {
                quantity: "12 dl", name: "canned whole tomatoes in juice"
            },
            {
                quantity: "2.4 dl", name: "water"
            },
            {
                quantity: "1.6 dl", name: "heavy cream"
            },
            {
                quantity: "1 tbsp", name: "sugar"
            },
            {
                quantity: "0.25 tsp", name: "crushed red pepper"
            },
            {
                quantity: "0.25 tsp", name: "celery seed"
            },
            {
                quantity: "0.25 tsp", name: "dried oregano"
            },
            {
                quantity: "a pinch of", name: "salt"
            },
            {
                quantity: "a pinch of", name: "ground black pepper"
            },
            {
                name: "crutons"
            }
        ],
        steps: [
            "In a large saucepan, melt 1 tablespoon of the butter in 1 tablespoon of the olive oil. Add the sliced onion and smashed garlic and cook over moderate heat, stirring occasionally, until softened, about 5 minutes.",
            "Add the tomatoes and their juice, the water, heavy cream, sugar, crushed red pepper, celery seed, and oregano; season with salt and pepper. Bring the soup to a boil over high heat, breaking up the tomatoes with the back of a spoon. Reduce the heat to moderate and simmer for 10 minutes.",
            "Working in batches, transfer the tomato soup to a blender and puree until smooth.",
            "Season with salt and pepper. Ladle the soup into bowls and serve with the croutons."
        ],
        keywords: ["Soup", "Tomato", "Quick", "Vegetarian"]
    },
    {
        header: "Ham Sandwich",
        image: "sandwich.jpg",
	    creator: "cinnamonclaire",
	    description: "THE BEST ham sandwich",
	    visibleToAll: 1,
	    durationHours: 0,
	    durationMinutes: 5,
        ingredients: [
            {
                quantity: "75 g", name: "Black Forest ham, sliced thin"
            },
            {
                quantity: "1 tbsp", name: "Dijon mustard"
            },
            {
                quantity: "1 tbsp", name: "mayonnaise"
            },
            {
                quantity: "1 leaf", name: "Boston lettuce"
            },
            {
                quantity: "2 slices", name: "white bread, toasted"
            },
            {
                name: "French pickles"
            }
        ],
        steps: [
            "Place the 2 slices of bread on a work surface, spread one with mustard and the other with mayonnaise.",
            "Fold the ham slices over on themselves and place side by side on the mustard side.",
            "Top with lettuce, close the sandwich and cut in 2. Serve with French pickles."
        ],
        keywords: ["Quick", "Sandwich"]
    },
    {
        header: "Gluten-Free Crêpes",
        image: "crepes.jpg",
	    creator: "bananabert",
	    description: "Crêpes, but Gluten Free",
	    durationHours: 1,
	    durationMinutes: 10,
        ingredients: [
            {
                quantity: "3dl", name: "Milk"
            },
            {
                quantity: "1", name: "egg"
            },
            {
                quantity: "1 tsp", name: "sugar"
            },
            {
                quantity: "0.5 tsp", name: "salt"
            },
            {
                quantity: "1.5 dl", name: "gluten-free flour-mix"
            }
        ],
        steps: [
            "Mix egg & milk lightly in a bowl",
            "Add flour while mixing",
            "let rise for 20-30min",
            "Cook the crêpes on a pan with butter",
            "Serve with sugar, whipped cream or jelly"
        ],
        keywords: ["Crêpes", "Gluten-Free", "Baking"]
    },
    {
        header: "Breakfast Smoothie",
        image: "smoothie.jpg",
	    creator: "appleadam",
	    description: "Meal-prep-friendly breakfast smoothie!",
	    durationHours: 0,
	    durationMinutes: 10,
        ingredients: [
            {
                quantity: "1", name: "apple"
            },
            {
                quantity: "1", name: "banana"
            },
            {
                quantity: "handful", name: "baby spinach"
            },
            {
                quantity: "1", name: "carrot"
            },
            {
                quantity: "0.5 dl", name: "apple juice"
            },
            {
                quantity: "0.5 dl", name: "oats"
            }
        ],
        steps: [
            "Peel and cube the fruit & carrot, wash spinach",
            "Blend ingredients in a blender",
            "You can pre-make smoothies for the whole week!"
        ],
        keywords: ["Meal-Prep", "Breakfast", "Quick"]
    },
    {
        header:	"Vendace Mayonnaise",
        image: "mayonnaise.jpg",
	    creator: "cinnamonclaire",
	    description: "A tasty & fishy dip!",
	    visibleToAll: 1,
	    durationHours: 0,
	    durationMinutes: 10,
        ingredients: [
            {
                quantity: "1 can", name: "Finnish Vendace"
            },
            {
                quantity: "0.5 jars", name: "Hellmann's Mayonnaise"
            },
            {
                quantity: "pinches of", name: "salt, pepper & other spices"
            }
        ],
        steps: [
            "Purée the vendace in a mixer",
            "Mix in the mayonnaise",
            "taste and season to your liking :)",
            "Serve as a dip with rye crisps"
        ],
        keywords: ["Dip", "Fish", "Vendace", "Snack"]
    },
    {
        header: "Delicious Sweet Potato Fries",
        image: "fries.jpg",
	    creator: "bananabert",
	    description: "A fiber-full alternative to fries.",
	    durationHours: 0,
	    durationMinutes: 20,
        ingredients: [
            {
                quantity: "95g", name: "sweet potato, cut into fries"
            },
            {
                quantity: "1 tsp", name: "rapeseed oil"
            },
            {
                quantity: "0.25 tsp", name: "cayenne pepper"
            }
        ],
        steps: [
            "Heat the oven to 200C/180C fan/gas 6.",
            "Put 95g sweet potato, cut into fries, on a baking tray and toss with 1 tsp rapeseed oil and ¼ tsp cayenne pepper. ",
            "Bake in the oven for 20 mins and serve.",
            "Bake in the oven for 20 mins."
        ],
        keywords: ["Fries", "Quick", "Beginner", "Gluten-Free"]
    },
    {
        header:	"Easy Ice Cream Dessert Bowl",
        image: "icecream.jpg",
	    creator: "cinnamonclaire",
	    description: "An easy and customizable dessert for the whole family! Great for movie-nights ;)",
	    visibleToAll: 1,
	    durationHours: 0,
	    durationMinutes: 15,
        ingredients: [
            {
                name: "3x1 tub ice cream of choice, three different flavours"
            },
            {
                quantity: "1-2", name: "flavoured syrups"
            },
            {
                quantity: "Any amount", name: "toppings of choice"
            }
        ],
        steps: [
            "Scoop balls of the 3 ice creams into a large bowl",
            "Customize with syrups and toppings",
            "Share and enjoy"
        ],
        keywords: ["Dessert", "Beginner", "Customizable", "Family", "Quick"]
    }
]

module.exports = { users, recipes };