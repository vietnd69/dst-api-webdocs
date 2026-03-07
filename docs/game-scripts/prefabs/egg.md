---
id: egg
title: Egg
description: Defines prefabs for raw, cooked, and rotten bird eggs, each with distinct properties including edibility, perishability, and fertilizer usability.
tags: [food, cooking, fertilizer, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 96b66f70
system_scope: inventory
---

# Egg

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines three related prefabs—`bird_egg`, `bird_egg_cooked`, and `rottenegg`—that represent different states of a bird egg in the game. It uses a shared `commonfn` to set up common base properties (e.g., transform, animation, network, physics), then customizes behavior per state via dedicated constructor functions (`defaultfn`, `cookedfn`, `rottenfn`). Key interactions include edible nutrition, perishability with replacement items, cooking, and decomposition into usable fertilizer.

## Usage example
```lua
-- Create a raw bird egg
local egg = Prefab("bird_egg", ...)

-- Access its components after spawning
local inst = SpawnPrefab("bird_egg")
inst.components.edible.hungervalue = 5
inst.components.perishable:StartPerishing()
```

## Dependencies & tags
**Components used:** `edible`, `cookable`, `perishable`, `stackable`, `bait`, `inspectable`, `inventoryitem`, `tradable`, `floater`, `fuel`, `fertilizer`, `fertilizerresearchable`  
**Tags added:** `catfood`, `cookable`, `icebox_valid`, `cattoy`, `fertilizerresearchable`  
**Tags checked:** `TheWorld.ismastersim`

## Properties
No public properties are defined directly in this file. All components rely on their own internal state.

## Main functions
### `commonfn(anim, cookable)`
*   **Description:** Shared constructor for all egg prefabs. Sets up physics, animation, network, inventory, and core components (e.g., edible, perishable, stackable). Conditionally adds cookable behavior.
*   **Parameters:**  
    `anim` (string) – Animation state to play (`"idle"`, `"cooked"`, `"rotten"`).  
    `cookable` (boolean) – If true, adds the `cookable` tag and the `cookable` component with `product = "bird_egg_cooked"`.
*   **Returns:** `inst` (Entity) – The constructed entity, or the entity without simulation components on the client.
*   **Error states:** None. Returns early on the client if `TheWorld.ismastersim` is false.

### `defaultfn()`
*   **Description:** Constructs a pristine raw bird egg. Sets low nutritional values, medium perish time, and enables floater properties for visual floatation.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – The raw egg entity with `tradable.rocktribute = 1`.
*   **Note:** Overrides `healthvalue` and `sanityvalue` to `0` after `commonfn`, and sets `hungervalue = TUNING.CALORIES_TINY`.

### `cookedfn()`
*   **Description:** Constructs a cooked bird egg. Has higher hunger restoration than raw, faster perish rate, and replaces with `spoiled_food`.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – Cooked egg entity with `floater` scale and size adjusted for visual distinction.
*   **Note:** Sets `hungervalue = TUNING.CALORIES_SMALL` and `perishreplacement = "spoiled_food"`.

### `rottenfn()`
*   **Description:** Constructs a rotten egg prefab. Adds fertilizer functionality, fuel value, and small burnable behavior.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) – Rotten egg entity with `fertilizer` component initialized using nutrient data from `FERTILIZER_DEFS.rottenegg`.
*   **Note:** Adds a custom method `GetFertilizerKey(inst)` and assigns `fertilizerresearchable` with a research function.

## Events & listeners
None identified. This file defines prefabs and their initialization logic but does not register event listeners or push events directly.