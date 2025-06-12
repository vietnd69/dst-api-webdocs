---
id: recipes-overview
title: Recipes Overview
sidebar_position: 1
slug: /api/recipes
---

# Recipes Overview

The recipe system in Don't Starve Together provides the foundation for crafting and cooking mechanics. This system enables players to combine ingredients to create items, tools, structures, and food.

## Types of Recipes

The game includes several types of recipes:

1. **Crafting Recipes** - For creating tools, items, and structures
2. **Cooking Recipes** - For preparing food in cooking stations
3. **Character-Specific Recipes** - Unique recipes only available to certain characters

## Recipe Components

A recipe consists of the following components:

- **Ingredients** - Required items to craft the recipe
- **Technology Level** - Required tech level to unlock the recipe (Science, Magic, etc.)
- **Builder Requirements** - Special requirements like character tags or skills
- **Product** - The resulting item when the recipe is crafted

## Recipe Registration

Recipes are registered to the game using functions like:

- `Recipe2()` - For standard crafting recipes
- `AddCookerRecipe()` - For registering cooking recipes
- `AddRecipeCard()` - For recipe cards that can be found in-game

## Recipe API

The recipe system provides several API functions for mod developers to interact with:

- Testing if a recipe is valid
- Getting a list of candidate recipes
- Adding new recipes to the game
- Modifying existing recipes 