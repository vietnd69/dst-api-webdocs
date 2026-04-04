---
id: critters
title: Critters
description: Defines prefab factories for creating companion critter entities with hunger, sleep, and follower behaviors.
tags: [prefab, companion, pet, entity]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: prefabs
source_hash: 1a3f7b10
system_scope: entity
---

# Critters

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
The `critters.lua` prefab file provides factory functions for creating companion critter entities in Don't Starve Together. It defines the `MakeCritter` function which constructs fully-featured pet entities with hunger mechanics, sleep behavior, follower AI, and locomotion capabilities. Each critter supports perishable hunger states that affect behavior, special power callbacks for unique effects, and save/load persistence. The file also includes `MakeBuilder` for spawning critters via player construction actions.

## Usage example
```lua
local standard_diet = { FOODGROUP.OMNI }

-- Create a lamb critter prefab
local lamb_prefab = MakeCritter("critter_lamb", "sheepington", 6, 
    standard_diet, false, {
        favoritefood = "guacamole",
        allow_platform_hopping = true
    })

-- Create corresponding builder prefab
local lamb_builder = MakeBuilder("critter_lamb")
```

## Dependencies & tags
**Components used:** `spawnfader`, `inspectable`, `follower`, `knownlocations`, `sleeper`, `eater`, `perishable`, `locomotor`, `embarker` (when `allow_platform_hopping`), `drownable` (when `allow_platform_hopping`), `crittertraits`, `timer`

**Tags:** Adds `critter`, `companion`, `notraptrigger`, `noauradamage`, `small_livestock`, `NOBLOCK`, `flying` (flying critters only), `ignorewalkableplatformdrowning` (flying critters only), `CLASSIFIED` (builder only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `favoritefood` | string | `nil` | Preferred food item for this critter variant. |
| `playmatetags` | table | `{"critter"}` | Tags used to identify compatible playmate entities. |
| `_special_powers` | table | `nil` | Stores special power state for critters with custom abilities. |
| `wormlight` | entity | `nil` | Reference to attached wormlight spell entity (saved/loaded). |
| `pettype` | string | `nil` | Prefab name of the pet to spawn (builder only). |
| `linked_skinname` | string | `nil` | Skin identifier for the spawned pet (builder only). |
| `OnBuiltFn` | function | `builder_onbuilt` | Callback executed when builder entity is constructed (builder only). |

## Main functions
### `MakeCritter(name, animname, face, diet, flying, data, prefabs)`
*   **Description:** Factory function that creates a complete critter prefab with all necessary components, assets, and behaviors configured.
*   **Parameters:** 
    *   `name` (string) - Prefab name identifier.
    *   `animname` (string) - Animation bank name base.
    *   `face` (number) - Facing direction count (2, 4, 6, or 8).
    *   `diet` (table) - Food groups this critter can eat.
    *   `flying` (boolean) - Whether the critter flies.
    *   `data` (table) - Configuration table with optional fields like `favoritefood`, `allow_platform_hopping`, `special_powers_fn`, `master_postinit`, `common_postinit`, `assets`, `flyingsoundloop`, `buildname`, `skin_only`, `playmatetags`.
    *   `prefabs` (table) - Additional prefab dependencies.
*   **Returns:** Prefab object registered with the game.

### `MakeBuilder(prefab)`
*   **Description:** Creates a builder prefab that spawns a critter at the player's location when constructed.
*   **Parameters:** `prefab` (string) - Name of the critter prefab to spawn.
*   **Returns:** Prefab object for the builder entity.

### `GetPeepChance(inst)`
*   **Description:** Calculates the probability of the critter performing a peep animation based on hunger state.
*   **Parameters:** `inst` (entity) - The critter entity instance.
*   **Returns:** Number between 0 and 0.8 representing peep chance. Returns 0.8 when perishable percent is 0 (fully perished/starving), scales down as perish percent improves.

### `IsAffectionate(inst)`
*   **Description:** Determines if the critter is in an affectionate state based on hunger.
*   **Parameters:** `inst` (entity) - The critter entity instance.
*   **Returns:** Boolean. Returns `true` if perishable component is missing or hunger percent is above starving threshold.

### `IsHungry(inst)`
*   **Description:** Checks if the critter is in a hungry state.
*   **Parameters:** `inst` (entity) - The critter entity instance.
*   **Returns:** Boolean. Returns `true` if hunger percent is at or below the hungry threshold.

### `IsPlayful(inst)`
*   **Description:** Determines if the critter is in a playful state.
*   **Parameters:** `inst` (entity) - The critter entity instance.
*   **Returns:** Boolean. Currently returns the same value as `IsAffectionate`.

### `IsSuperCute(inst)`
*   **Description:** Placeholder function for cuteness determination.
*   **Parameters:** `inst` (entity) - The critter entity instance.
*   **Returns:** Boolean. Always returns `true`.

### `OnSave(inst, data)`
*   **Description:** Serializes critter state for saving, including attached wormlight spell entity.
*   **Parameters:** 
    *   `inst` (entity) - The critter entity instance.
    *   `data` (table) - Save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores critter state from save data, reattaching wormlight spell entity if present.
*   **Parameters:** 
    *   `inst` (entity) - The critter entity instance.
    *   `data` (table) - Loaded save data table.
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Post-load initialization that triggers special powers based on current hunger state.
*   **Parameters:** `inst` (entity) - The critter entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `perishchange` - Triggers special power callbacks when hunger state changes.
- **Listens to:** `onremove` - Cleans up special power buff entities when critter is removed.
- **Pushes:** `perishchange` - Fired during load post-pass to initialize special powers with current hunger percent.