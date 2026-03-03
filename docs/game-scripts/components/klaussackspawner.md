---
id: klaussackspawner
title: Klaussackspawner
description: Manages spawning and respawning of Klaus sacks in winter, tracking spawn counts and coordinating with world timers and spawner locations.
tags: [klaus, winter, spawner, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 9da92d3d
system_scope: world
---

# Klaussackspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`KlausSackSpawner` manages the lifecycle of Klaus sacks in winter, including initial spawning, respawn timing, and respawn logic after sack removal. It integrates with `worldsettingstimer` to handle scheduled spawns and validates potential spawn locations to ensure safety and distance from players and structures. This component is restricted to the master simulation and is typically attached to the world entity.

## Usage example
```lua
-- Typically added automatically to the world instance during startup.
-- Example interaction for external management (e.g., debug or event override):
TheWorld.components.klaussackspawner:GetKlausSack() -- Returns the active Klaus sack instance if valid
```

## Dependencies & tags
**Components used:** `worldsettingstimer`, `workable` (via external `Destroy` call during spawn)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *none* | The world entity instance that owns this component. |

*Note:* No other public properties are initialized directly in the constructor.

## Main functions
### `GetKlausSack()`
* **Description:** Returns the currently active Klaus sack entity if it exists and is valid; otherwise returns `nil`.
* **Parameters:** None.
* **Returns:** `Entity?` — the Klaus sack instance, or `nil` if no valid sack is present.

### `OnPostInit()`
* **Description:** Initializes timer-based spawning logic upon world load. Handles both standard winter mode and the Winters Feast event mode, including respawning delays, spawn counts, and timer setup.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes component state for saving, specifically tracking how many sacks have spawned this winter.
* **Parameters:** None.
* **Returns:** `{ spawnsthiswinter = number }` — a table containing the current spawn count.

### `OnLoad(data)`
* **Description:** Restores component state from saved data. Handles respawn timer restoration, spawn count restoration, and flag setting for post-load initialization.
* **Parameters:** `data` (table) — the loaded state data, including optional `timetorespawn` and `spawnsthiswinter` fields.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-friendly status string indicating either "Klaus Sack is in the world" or the remaining time until next spawn.
* **Parameters:** None.
* **Returns:** `string` — human-readable status.

## Events & listeners
- **Listens to:**
  - `ms_registerdeerspawningground` — registers a location as a potential Klaus sack spawner point.
  - `ms_registerklaussack` — registers a newly spawned Klaus sack instance.
  - `ms_restoreklaussackkey` — restores the sack’s key component when a key is dropped.
- **Pushes:** None.

### Internal event handlers
- `OnRemoveSpawner(spawner)` — removes a spawner point from the internal list.
- `OnRegisterSackSpawningPt(inst, spawner)` — adds a spawner point and sets up a listener for its removal.
- `OnRemoveSack(sack)` — triggers respawn logic after a sack is removed.
- `RegisterKlausSack(inst, sack)` — stores the sack instance and registers its removal listener.
- `RestoreKlausSackKey(inst, key)` — forwards key restoration to the sack.
- `OnIsWinter(self, iswinter)` — adjusts spawn behavior based on entering or exiting winter (non-event mode).
- `OnIsWinterEvent(self, iswinter)` — adjusts spawn behavior during Winters Feast event.

## Notes
- This component is **not loaded on clients** (`TheWorld.ismastersim` must be true).
- Spawning logic prioritizes locations with few or no adjacent structures and at least 35 units away from all players.
- During Winters Feast, spawns occur faster and are not limited by winter state beyond initial date.
- The `workable:Destroy` method is called on structures within 5 units at spawn time; if a structure lacks a `workable` component, it is removed entirely.
