---
id: monkeyhut
title: Monkeyhut
description: A shelter structure that spawns powder monkeys during the day and provides lighting at night.
tags: [shelter, spawner, lighting, environment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 317b47e4
system_scope: environment
---

# Monkeyhut

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `monkeyhut` prefab represents a shelter structure used by powder monkeys. It functions as a dynamic spawner that releases powder monkeys during daytime hours and emits light at night. The structure is interactable (hammerable), hauntable, and changes behavior based on time of day and burn status. It integrates with multiple core systems including `childspawner`, `lootdropper`, `burnable`, and `workable`, and supports world-settings overrides for spawning behavior.

## Usage example
```lua
-- Create and spawn a monkeyhut at a specific position
local hut = SpawnPrefab("monkeyhut")
hut.Transform:SetPosition(x, y, z)

-- Manually trigger spawning if needed (e.g., after unburning)
if hut.components.childspawner then
    hut.components.childspawner:StartSpawning()
end
```

## Dependencies & tags
**Components used:** `burnable`, `childspawner`, `combat`, `hauntable`, `inspectable`, `inventory`, `lootdropper`, `workable`, `worldsettingsutil`
**Tags:** `shelter`, `structure`, `burnt` (dynamically added), `DECOR`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_lightson` | boolean | `false` | Tracks whether the monkeyhut’s internal light is currently active. |
| `_window` | Entity or `nil` | `nil` | Reference to the optional lit window visual entity (created only on non-dedicated clients). |
| `loot` | table | `{"boards", "rocks"}` | Hardcoded list of loot items dropped upon destruction. |

## Main functions
### `StartSpawning(inst)`
* **Description:** Begins the child-spawning cycle if the world is not in winter and the monkeyhut is not burnt.
* **Parameters:** `inst` (Entity) — the monkeyhut instance.
* **Returns:** Nothing.

### `StopSpawning(inst)`
* **Description:** Stops child spawning if the monkeyhut is not burnt.
* **Parameters:** `inst` (Entity) — the monkeyhut instance.
* **Returns:** Nothing.

### `OnSpawned(inst, child)`
* **Description:** Callback fired when a `powder_monkey` is spawned. Handles gear assignment (cutlass, optional small hat), checks valid spawn position (prevents spawning over void), plays sound, and pauses spawning if night has begun with existing outside children.
* **Parameters:**  
  - `inst` (Entity) — the monkeyhut instance.  
  - `child` (Entity) — the spawned powder monkey.  
* **Returns:** Nothing.

### `OnGoHome(inst, child)`
* **Description:** Callback fired when a `powder_monkey` returns home. Registers loot with `piratespawner`, plays sound, and restarts spawning if no children are outside.
* **Parameters:**  
  - `inst` (Entity) — the monkeyhut instance.  
  - `child` (Entity) — the returning powder monkey.  
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Callback executed when the monkeyhut is fully hammered (destroyed). Extinguishes fire (if burning), removes the `childspawner`, drops loot, spawns a `collapse_big` FX, and removes the entity.
* **Parameters:**  
  - `inst` (Entity) — the monkeyhut instance.  
  - `worker` (Entity) — the entity performing the hammer action.  
* **Returns:** Nothing.

### `onhit(inst, worker)`
* **Description:** Callback for partial hits on the monkeyhut (before destruction). If not burnt, triggers animations, releases all children, and updates lighting animations.
* **Parameters:**  
  - `inst` (Entity) — the monkeyhut instance.  
  - `worker` (Entity) — the entity performing the hammer action.  
* **Returns:** Nothing.

### `OnHaunt(inst)`
* **Description:** Handles haunting behavior: attempts to spawn a powder monkey targeting a valid nearby character; returns `true` on success, `false` otherwise.
* **Parameters:** `inst` (Entity) — the monkeyhut instance.  
* **Returns:** `boolean` — `true` if spawning succeeded and hit animation triggered; `false` if conditions prevented spawning.

### `LightsOn(inst)` / `LightsOff(inst)`
* **Description:** Controls the monkeyhut’s lighting and window visibility based on time of day. `LightsOn` enables light and plays lit animations; `LightsOff` disables light and hides the window.
* **Parameters:** `inst` (Entity) — the monkeyhut instance.  
* **Returns:** Nothing.

### `OnIsNight(inst, isnight)`
* **Description:** World-state watcher callback triggered when night begins/ends. Stops spawning at night, starts it at day, and schedules `LightsOn`/`LightsOff` with a random delay.
* **Parameters:**  
  - `inst` (Entity) — the monkeyhut instance.  
  - `isnight` (boolean) — `true` if night just started; `false` if day just started.  
* **Returns:** Nothing.

### `Onburntup(inst)`
* **Description:** Triggered when the monkeyhut is fully burnt. Removes shelter tag, applies burnt animation, and destroys the window entity if present.
* **Parameters:** `inst` (Entity) — the monkeyhut instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `isnight` — triggers `OnIsNight` to manage spawning and lighting.  
  - `onignite` — triggers `onignite` to release children before burning fully.  
  - `burntup` — triggers `onburntup` when destruction completes.  
- **Pushes:**  
  - None directly (events are handled by `components` like `burnable`, `childspawner`, and `lootdropper`).

## World settings integration
The component `childspawner` supports world settings via `WorldSettings_ChildSpawner_SpawnPeriod` and `WorldSettings_ChildSpawner_RegenPeriod` in `worldsettingsutil.lua`. These functions use `TUNING.MONKEYHUT_ENABLED` to gate spawning.

## Construction notes
- On dedicated servers, the optional `_window` entity is not created.
- Client-side window state is synchronized via periodic task (`OnUpdateWindow`) that polls hut light and animation states.
- `OnPreLoad` calls `WorldSettings_ChildSpawner_PreLoad` to correctly restore spawner state from save data.