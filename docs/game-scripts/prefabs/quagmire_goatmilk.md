---
id: quagmire_goatmilk
title: Quagmire Goatmilk
description: A consumable food item that serves as cat food and can be used in Quagmire stew recipes.
tags: [food, inventory, catfood]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bc7d96d9
system_scope: inventory
---

# Quagmire Goatmilk

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_goatmilk` prefab represents a food item used in DST's Quagmire expansion. It is designed to be usable by cats (e.g., Clawdius) and as an ingredient in Quagmire-specific cooking. As a prefab, it defines the entity's visual and network behavior, but does not include custom component logic beyond standard ECS components like `transform`, `animstate`, and `network`. The file declares dependencies on two prefabs (`quagmire_burnt_ingredients` and `spoiled_food`), indicating potential fallback or child entities, but no active component interaction is observed in the provided code.

## Usage example
This is typically instantiated by the game engine and added to the world via the prefab system:

```lua
-- Create the goatmilk item in the world
local item = SpawnPrefab("quagmire_goatmilk")
item.Transform:SetPosition(x, y, z)

-- Usage as cat food
if item:HasTag("catfood") then
    -- Can be consumed by cats
end

-- Usage in stew recipes
if item:HasTag("quagmire_stewable") then
    -- Can be added to Quagmire cooking pots
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `catfood`, `quagmire_stewable`.

## Properties
No public properties.

## Main functions
No custom main functions — the prefab uses standard engine components only.

## Events & listeners
No event listeners or pushed events defined in this file.