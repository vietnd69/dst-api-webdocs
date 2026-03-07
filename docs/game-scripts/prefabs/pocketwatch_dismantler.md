---
id: pocketwatch_dismantler
title: Pocketwatch Dismantler
description: A prefab component for the pocketwatch dismantler item that enables crafting-related dismantling functionality.
tags: [crafting, inventory, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c5415b2c
system_scope: inventory
---

# Pocketwatch Dismantler

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pocketwatch_dismantler` is a prefab definition file that creates the in-game item used to dismantle Pocket Watches. The component itself is added to the entity during prefab instantiation on the master simulation, enabling it to participate in crafting systems and interact with the world (e.g., burning, being inspected,Haunted). This file defines the visual and physical representation of the item and attaches essential gameplay components.

## Usage example
```lua
-- The component is not added manually; it is part of the `pocketwatch_dismantler` prefab.
-- Example usage within a recipe:
 recipes.AddRecipe("pocketwatch_dismantler", {
     {"shadow_magic", 3},
     {"gold_nugget", 2},
     {"gear", 1}
 }, "crafter", {
     tech = TECH.SCIENCE_ONE
 })
```

## Dependencies & tags
**Components used:** None — this file only adds components to the instance during `fn()`, but the component `pocketwatch_dismantler` itself is not defined here (it must exist separately in the codebase as `components/pocketwatch_dismantler.lua`).  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component.

## Events & listeners
Not applicable.