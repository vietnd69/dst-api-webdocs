---
id: cookbookupdater
title: Cookbookupdater
description: Manages recipe and food stat acquisition for the in-game cookbook, handling both local updates and network synchronization between server and clients.
tags: [crafting, network, inventory]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3c14278a
system_scope: crafting
---

# Cookbookupdater

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CookbookUpdater` is a client-side component responsible for tracking learned recipes and food statistics in the cookbook. It initializes a local `cookbook` instance via `cookbookdata.lua`, listens for player activation events to bind to `TheCookbook`, and provides methods to learn new recipes and food stats with automatic network replication on dedicated servers or remote clients.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("cookbookupdater")
inst.components.cookbookupdater:LearnRecipe("apple_pie", { "apple", "apple", "honey" })
inst.components.cookbookupdater:LearnFoodStats("apple_pie")
```

## Dependencies & tags
**Components used:** None (only uses global modules and RPC functions).
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `LearnRecipe(product, ingredients)`
* **Description:** Records a new recipe in the local cookbook and replicates it to connected clients if it is newly learned and the current instance is a remote player on a dedicated server or the master simulation.
* **Parameters:**  
  `product` (string or nil) — the recipe's output name.  
  `ingredients` (table or nil) — a list of ingredient names used in the recipe.  
* **Returns:** Nothing.
* **Error states:** Returns early if either `product` or `ingredients` is `nil`. Only initiates RPC replication if `cookbook:AddRecipe()` returns `true` (indicating a new recipe) and the entity has a valid `userid`.

### `LearnFoodStats(product)`
* **Description:** Records food stats (e.g., hunger, health, sanity changes) for a dish in the local cookbook and replicates the update if newly discovered.
* **Parameters:**  
  `product` (string) — the dish name whose stats are being learned.  
* **Returns:** Nothing.
* **Error states:** Only triggers RPC replication if `cookbook:LearnFoodStats()` returns `true` and the entity satisfies the same conditions as `LearnRecipe` (dedicated server or master sim with remote client, valid `userid`).

## Events & listeners
- **Listens to:** `playeractivated` — triggers `onplayeractivated` to bind the local `cookbook` instance to `TheCookbook` and enable saving, but only for the local player on non-dedicated clients.
- **Pushes:** None.
