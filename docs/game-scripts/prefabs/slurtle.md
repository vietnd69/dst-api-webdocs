---
id: slurtle
title: Slurtle
description: A prefabricated entity that defines the Slurtle and Snurtle creatures, including their combat, locomotion, eating, explosive, and spawner behaviors.
tags: [combat, ai, mob, explosive, spawner]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b955d993
system_scope: entity
---

# Slurtle

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `slurtle.lua` file defines two prefabs—`slurtle` and `snurtle`—which represent hostile mob entities in the game. It creates the core entity structure (animation, physics, sound, network, dynamic shadow), attaches essential components (`combat`, `health`, `eater`, `locomotor`, `lootdropper`, `explosive`, `periodicspawner`, `thief`, `inventory`, `inspectable`, `knownlocations`, `burnable`, `freezable`, `hauntable`), configures tunable values (health, damage, speed, explosion range), and defines custom logic for behaviors such as home-based target retention, slime spawning upon eating, and sound/fire response handling. The prefabs share most initialization logic through a common function (`commonfn`) and diverge only for brain assignment, loot tables, and tuning constants.

## Usage example
```lua
-- Instantiate a Slurtle with default properties
local slurtle = SpawnPrefab("slurtle")

-- Programmatically adjust behavior after spawn
if slurtle ~= nil and slurtle.components ~= nil then
    slurtle.components.health:SetMaxHealth(200)
    slurtle.components.locomotor.walkspeed = 5
end

-- Manually trigger slime production
slurtle.stomach = 6
OnEatElement(slurtle, { components = { edible = { hungervalue = 6 } } })
```

## Dependencies & tags
**Components used:** `locomotor`, `eater`, `lootdropper`, `inspectable`, `knownlocations`, `periodicspawner`, `thief`, `inventory`, `explosive`, `burnable`, `freezable`, `hauntable`, `combat`, `health`  
**Tags added:** `cavedweller`, `animal`, `explosive`, and either `slurtle` or `snurtle` depending on variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stomach` | number | `0` | Tracks consumed elemental food units; triggers slime production when `>= SPAWN_SLIME_VALUE`. |
| `lastmeal` | number | `0` | Stores time of last meal (not modified in code shown). |
| `persists` | boolean | `true` | Controls persistence when ignited (`false` when on fire). |

## Main functions
### `commonfn(bank, build, tag, common_postinit)`
*   **Description:** Shared factory function for both Slurtle and Snurtle prefabs. Sets up basic entity structure (animations, sound, physics, network, shadow), adds tags, attaches and configures common components (e.g., `eater`, `lootdropper`, `explosive`, `periodicspawner`, `burnable`, `freezable`, `hauntable`), and registers the state graph and events.
*   **Parameters:**  
    `bank` (string) – Animation bank name (e.g., `"slurtle"`).  
    `build` (string) – Animation build name (e.g., `"slurtle"`).  
    `tag` (string or nil) – Optional additional tag (e.g., `"snurtle"`).  
    `common_postinit` (function or nil) – Optional hook to apply variant-specific post-initialization (e.g., `snurtle_common_postinit`).
*   **Returns:** Entity instance (`inst`) – fully initialized entity if `TheWorld.ismastersim`, otherwise a minimal client-only instance.
*   **Error states:** None documented.

### `makeslurtle()`
*   **Description:** Constructs the Slurtle variant by calling `commonfn` with `"slurtle"` parameters and applying Slurtle-specific overrides. Adds `combat` and `health`, sets brain, loot table, walking speed, damage, health, attack range/duration, and registers the `attacked` event listener for targeting and sharing.
*   **Parameters:** None (calls `commonfn` internally).
*   **Returns:** Fully configured Slurtle entity instance.

### `Snurtle_OnAttacked(inst, data)`
*   **Description:** Event handler called when Snurtle is attacked. Shares aggro with nearby Slurtles (but does *not* set the Snurtle's own combat target).
*   **Parameters:**  
    `inst` (Entity) – The Snurtle entity.  
    `data` (table or nil) – Attack event data, expected to contain `attacker`.
*   **Returns:** Nothing.
*   **Error states:** If `data` or `data.attacker` is missing, defaults attacker to `nil`; shares aggro regardless.

### `OnIgniteFn(inst)`
*   **Description:** Fire event handler that plays a rattling sound and disables persistence (causing the entity to be deleted on world save/restore).
*   **Parameters:** `inst` (Entity) – The Slurtle/Snurtle entity.
*   **Returns:** Nothing.

### `OnExtinguishFn(inst)`
*   **Description:** Fire extinguished handler that stops the rattling sound and re-enables persistence.
*   **Parameters:** `inst` (Entity) – The Slurtle/Snurtle entity.
*   **Returns:** Nothing.

### `OnExplodeFn(inst)`
*   **Description:** Explosion handler that kills the rattling sound and spawns a small explosion FX entity at the Slurtle's location.
*   **Parameters:** `inst` (Entity) – The Slurtle/Snurtle entity.
*   **Returns:** Nothing.

### `OnEatElement(inst, food)`
*   **Description:** Eating callback for elemental-type food. Accumulates `stomach` value; when it reaches `SPAWN_SLIME_VALUE`, spawns one or more `slurtleslime` prefabs proportional to food value.
*   **Parameters:**  
    `inst` (Entity) – The Slurtle/Snurtle entity.  
    `food` (Entity or table) – The consumed food, expected to have `components.edible.hungervalue`.
*   **Returns:** Nothing.

### `KeepTarget(inst, target)`
*   **Description:** Target retention function used by `combat` to decide whether to retain a target. Returns `true` only if the target is valid *and* lies within `MAX_CHASEAWAY_DIST` of the Slurtle's remembered "home" location.
*   **Parameters:**  
    `inst` (Entity) – The Slurtle entity.  
    `target` (Entity) – The current combat target.
*   **Returns:** `true` if target should be kept; `false` otherwise.

## Events & listeners
- **Listens to:**  
  `"attacked"` (Slurtle only) – triggers `Slurtle_OnAttacked`, which sets the attacker as the combat target and shares aggro with nearby Slurtles.  
  `"attacked"` (Snurtle only) – triggers `Snurtle_OnAttacked`, which shares aggro *without* setting Snurtle's own target.  
  `"ifnotchanceloot"` – triggers `OnNotChanceLoot` to play a shatter sound when loot is dropped via non-chance mechanics.
- **Pushes:** No events directly. Relies on component-specific event pushes (e.g., `lootdropper` events).