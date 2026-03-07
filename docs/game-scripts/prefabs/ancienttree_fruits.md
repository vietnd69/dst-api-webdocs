---
id: ancienttree_fruits
title: Ancienttree Fruits
description: Provides game logic for ancient tree fruits, including gem fruit temperature-based hatching, night vision fruit effects, and the night vision debuff component.
tags: [environment, inventory, debuff, cooking]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0415a1b1
system_scope: environment
---

# Ancienttree Fruits

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines three_prefabs and one debuff prefab for ancient tree fruits in DST: `ancientfruit_gem`, `ancientfruit_nightvision`, `ancientfruit_nightvision_cooked`, and `nightvision_buff`. The gem fruit uses temperature accumulation from nearby heaters (e.g., campfires) to progress through animation states and eventually hatch into randomized gems after a timer. The night vision fruit grants temporary night vision and applies a sanity penalty when eaten, and the cooked variant provides milder negative effects. The `nightvision_buff` prefab is a debuff that manages player night vision overrides (via `PlayerVision`) and sanity modifiers.

## Usage example
```lua
-- Spawn a gem fruit and warm it near a heater
local fruit = SpawnPrefab("ancientfruit_gem")
fruit.Transform:SetPosition(x, y, z)
-- The fruit automatically warms up when near active heaters

-- Create a night vision fruit eater effect
local eater = GetPlayer()
eater.components.edible:Eat("ancientfruit_nightvision")
-- The eater gains night vision and suffers sanity loss
```

## Dependencies & tags
**Components used:** `bait`, `cookable`, `debuff`, `edible`, `grogginess`, `heater`, `inspectable`, `inventoryitem`, `lootdropper`, `perishable`, `playervision`, `sanity`, `stackable`, `timer`, `tradable`  
**Tags added:** `molebait` (gem fruit only), `cookable` (night vision fruit only), `CLASSIFIED` (nightvision_buff only)  
**Tags checked:** `INLIMBO`, `HASHEATER`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_temperature` | number | `0` | Heat level of the gem fruit; ranges from `0` to `TUNING.ANCIENTFRUIT_GEM_TEMPERATURE_THRESHOLD.MAX`. |
| `GEMS_WEIGHTS` | table | `GEMS_WEIGHTED_LIST` | Weighted list of gem types (`bluegem`, `redgem`, `purplegem`, `greengem`, `orangegem`, `yellowgem`) used for random hatching. |
| `persists` | boolean | `false` | Indicates whether the item should be saved with the world. Set to `false` after hatching. |
| `pickupsound` | string | `"rock"` (gem), `"vegetation_firm"` (nightvision) | Sound played when the item is picked up. |

## Main functions
### `GemFruit_OnUpdate(inst, dt)`
* **Description:** Periodically checks for nearby heaters, accumulates temperature, and updates animation/ timers. It advances through `idle`, `heating_1`, `heating_2`, and `heatin_loop` animations based on temperature thresholds.
* **Parameters:** `inst` (entity), `dt` (number, delta time in seconds).
* **Returns:** Nothing.
* **Error states:** Does nothing if no valid heaters are within `TUNING.HATCH_CAMPFIRE_RADIUS`.

### `GemFruit_SpawnGem(inst, x, z, prefab)`
* **Description:** Spawns a single gem at specified world coordinates (or at the fruit’s position if `x`/`z` are `nil`). Supports mod-provided `prefab` overrides.
* **Parameters:** `inst` (entity), `x` (number?, x coordinate), `z` (number?, z coordinate), `prefab` (string?, optional gem prefab name).
* **Returns:** The spawned gem entity or `nil`.

### `GemFruit_SpawnAndLaunchGems(inst)`
* **Description:** Spawns and launches all gems contained in the stack. Attempts to stack gems of the same type up to their `maxsize` before launching. Returns a table mapping prefab names to count.
* **Parameters:** `inst` (entity).
* **Returns:** `spawned_prefabs` (table) — mapping of prefab names to spawn counts.
* **Error states:** Returns early if `stackable` component is missing or not stacked.

### `GemFruit_OnTimerDone(inst, data)`
* **Description:** Called when the hatch timer completes. Breaks the fruit, spawns and launches gems, then removes the fruit entity after animation.
* **Parameters:** `inst` (entity), `data` (table, must contain `{ name = "hatch_timer" }`).
* **Returns:** Nothing.

### `GemFruit_OnDestack(new, inst)`
* **Description:** Copies the current temperature to a new stack instance during stack splitting.
* **Parameters:** `new` (entity, the new stack), `inst` (entity, the original stack).
* **Returns:** Nothing.

### `NightVision_OnEaten(inst, eater)`
* **Description:** Called when the night vision fruit is eaten. Grants the `nightvision_buff` debuff to the eater, and sets grogginess to at least `1.5`.
* **Parameters:** `inst` (entity), `eater` (entity).
* **Returns:** Nothing.

### `NightVision_PlayBeatingSound(inst)`
* **Description:** Plays a looping "pulse" sound and restarts the beat task upon waking.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `NightVision_DoBeatingBounce(inst)`
* **Description:** Applies a small random upward velocity to the fruit when it is on the ground, simulating a "pulse bounce".
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `buff_OnAttached(inst, target)`
* **Description:** Called when the night vision debuff is applied. Sets the buff as a child of the target, grants forced night vision via `PlayerVision`, and applies a sanity penalty.
* **Parameters:** `inst` (entity, the buff), `target` (entity, the player).
* **Returns:** Nothing.

### `buff_OnDetached(inst, target)`
* **Description:** Called when the debuff ends. Removes the night vision and sanity modifiers, then schedules the buff for removal.
* **Parameters:** `inst` (entity), `target` (entity).
* **Returns:** Nothing.

### `buff_Expire(inst)`
* **Description:** Removes the debuff if the timer expires.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `buff_OnExtended(inst)`
* **Description:** Resets the duration timer upon buff extension.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `buff_OnEnabledDirty(inst)`
* **Description:** Syncs night vision state on client when the `_enabled` net_bool changes (e.g., due to respawning or limbo transitions).
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `enterlimbo`, `exitlimbo` — Pauses/resumes temperature update and hatching timer.  
  - `timerdone` — Triggers hatching for gem fruit.  
  - `death` — Stops the night vision buff when the target dies.  
  - `enableddirty` (client-only) — Syncs night vision override state after entity rejoin.  
- **Pushes:**  
  - None directly (relies on component events like `stacksizechange` from `stackable`).
