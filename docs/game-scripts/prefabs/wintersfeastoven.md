---
id: wintersfeastoven
title: Wintersfeastoven
description: Implements the Winters Feast Oven, a multi-stage cooking station that requires science-based cooking steps and produces festive dishes.
tags: [crafting, cooking, event, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 770041fb
system_scope: crafting
---

# Wintersfeastoven

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wintersfeastoven` is a structure that enables festive cooking during the Winters Feast event. It functions as a specialized cooking station using a two-stage science-lab-like process, where players place ingredients and wait for cooking progress through animation and sound cues. It interacts with the `madsciencelab`, `pickable`, `lootdropper`, `workable`, and `prototyper` components to manage cooking states, item pickup, hammering interactions, and lighting effects. The oven supports dynamic cook time scaling per dish and handles visual/fire effects and save/load persistence.

## Usage example
```lua
-- Typical usage is via the game's recipe system; manual usage example:
local oven = SpawnPrefab("wintersfeastoven")
oven.Transform:SetPosition(entity.Transform:GetWorldPosition())

-- After placing, crafting is initiated via recipe selection (handled by prototyper)
-- The oven automatically manages cooking stages and effects.
```

## Dependencies & tags
**Components used:** `madsciencelab`, `pickable`, `lootdropper`, `workable`, `prototyper`, `inspectable`, `hauntable`, `light`, `soundemitter`, `animstate`, `minimapentity`, `transform`, `network`  
**Tags:** `structure`, `FX`, `DECOR`, `CLASSIFIED` (for internal dummy prefabs)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `science_stages` | table | Deepcopy of `SCIENCE_STAGES` | Array of stage definitions containing `time`, `anim`, `fire_anim`, etc. |
| `caninteractwith` (pickable) | boolean | `false` | Controls whether the dish can be picked up after cooking. |
| `paused` (pickable) | boolean | `true` | Pauses regen timer; dish does not regenerate during cooking. |

## Main functions
### `StartMakingScience(inst, doer, recipe)`
* **Description:** Initiates the cooking process when a valid recipe is selected. Enables fire effects, sets cook time multiplier, starts the `madsciencelab` science stage, and lights the oven.
* **Parameters:** `inst` (entity), `doer` (player entity), `recipe` (recipe table with `product` field).
* **Returns:** Nothing.
* **Error states:** No-op if `recipe.product` is invalid or not a winter cooking prefab.

### `OnStageStarted(inst, stage)`
* **Description:** Triggered when a cooking science stage begins. Plays appropriate animations (pre-cook → cook loop), sound effects, and manages fire effect state.
* **Parameters:** `inst` (entity), `stage` (number) – current stage index (1 or 2).
* **Returns:** Nothing.

### `OnScienceWasMade(inst, wintercooking_id)`
* **Description:** Called when cooking completes. Replaces science state with a ready dish, plays finish animation/sound, extinguishes light, and sets up for pickup.
* **Parameters:** `inst` (entity), `wintercooking_id` (string) – e.g., `"wintercooking_berrysauce"`.
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Handles hammer interactions when a dish is ready. Drops the cooked dish as loot, spawns collapse FX, and destroys the oven entity.
* **Parameters:** `inst` (entity), `worker` (player entity).
* **Returns:** Nothing.

### `onhit(inst, worker)`
* **Description:** Handles hammer hits during idle or active cooking. Triggers door-open or door-close hit animations and plays impact sound.
* **Parameters:** `inst` (entity), `worker` (player entity).
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Returns a status string used for UI tooltips: `"DISH_READY"`, `"COOKING"`, `"ALMOST_DONE_COOKING"`, or `nil`.
* **Parameters:** `inst` (entity).
* **Returns:** `"DISH_READY"` if dish is ready; `"COOKING"` or `"ALMOST_DONE_COOKING"` depending on `madsciencelab.stage`; `nil` otherwise.

### `SetupDish(inst, itemname)`
* **Description:** Replaces the science state with a finished dish by setting up `pickable` with the target food prefab and updating visual symbol.
* **Parameters:** `inst` (entity), `itemname` (string) – e.g., `"berrysauce"`.
* **Returns:** Nothing.

### `SetOvenCookTimeMultiplier(inst, multiplier)`
* **Description:** Adjusts cook times across all stages based on dish-specific multiplier from `fooddef`.
* **Parameters:** `inst` (entity), `multiplier` (number) – e.g., `1.5` for slower cooking.
* **Returns:** Nothing.

### `CanCookPrefab(prefab)`
* **Description:** Validates if `prefab` is a valid winter cooking prefab (e.g., `"wintercooking_bibingka"`).
* **Parameters:** `prefab` (string).
* **Returns:** `true` if prefab matches known winter dishes, else `false`.

### `onturnon(inst)`
* **Description:** Handles oven "power on" behavior: opens oven door and starts proximity loop sound if not cooking and not burnt.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onturnoff(inst)`
* **Description:** Handles oven "power off" behavior: closes door and plays close sound if not cooking and not burnt.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `onitemtaken(inst, picker, loot)`
* **Description:** Called after a player picks up the cooked dish. Resets interact state, plays pickup sound, and cleans up dish symbol.
* **Parameters:** `inst` (entity), `picker` (player entity), `loot` (string prefab name).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"animover"` (via `OnInactive`) – to transition to idle state after cooking finishes.  
  - `"onbuilt"` (via `onbuilt`) – to play placement animation.  
- **Pushes:** None directly (delegates event propagation to components like `lootdropper` which pushes `"entity_droploot"`).