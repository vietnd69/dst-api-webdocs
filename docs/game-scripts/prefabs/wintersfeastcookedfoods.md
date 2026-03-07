---
id: wintersfeastcookedfoods
title: Wintersfeastcookedfoods
description: Generates prefabs for Winters Feast cooked foods, configuring them with finite uses and inventory interactions.
tags: [inventory, cooking, seasonal, food, components]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 70cc2e23
system_scope: inventory
---

# Wintersfeastcookedfoods

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines a factory function that creates individual `Prefab`s for each Winters Feast cooked food item. Each generated food entity is configured with the `finiteuses` component (to track consumption uses), inventory capabilities (`inventoryitem`), and additional gameplay integrations such as baiting, tradability, burnable state, and hauntable behavior. It acts as a declarative generator rather than a reusable component itself, producing reusable prefab definitions for use throughout the game.

## Usage example
This file does not define a standalone component; it outputs a list of prefabs for use in the game. A typical usage within the modding ecosystem would be:
```lua
-- Inside a mod's main.lua or another prefab definition
local WINTERSFEASTCOOKEDFOODS = require "prefabs/wintersfeastcookedfoods"

-- WINTERSFEASTCOOKEDFOODS is a table of generated Prefab objects
-- These can be referenced by name in cooking recipes or world spawning
```

## Dependencies & tags
**Components used:** `finiteuses`, `inspectable`, `inventoryitem`, `bait`, `tradable`  
**Tags:** Adds `wintersfeastcookedfood`  
**Files required:** `tuning`, `wintersfeastcookedfoods` (data table)

## Properties
No public properties. This file exports `Prefab` instances, not component classes.

## Main functions
### `MakeFood(name)`
*   **Description:** Constructs and returns a `Prefab` for a single Winters Feast cooked food item identified by `name`. Sets up visual, physical, and gameplay properties including finite uses, inventory, and floatability.
*   **Parameters:** `name` (string) - the unique identifier and asset reference for the food (e.g., `"roasted_goo"`).
*   **Returns:** `Prefab` — a fully configured prefab definition ready for registration or use in recipes.
*   **Error states:** Returns a client-only entity (early return) if called on a non-master simulation (`TheWorld.ismastersim == false`).

## Events & listeners
This file does not define any event listeners or events directly. However, it relies on `finiteuses` component behavior: when uses deplete, the `finiteuses` component fires the `"percentusedchange"` event and calls the optional `onfinished` callback. In this file's current implementation, the `onfinished` callback is intentionally disabled via comment, so no automatic entity removal occurs on use depletion.