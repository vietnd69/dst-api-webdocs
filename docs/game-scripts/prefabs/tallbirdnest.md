---
id: tallbirdnest
title: Tallbirdnest
description: Manages the tallbird nesting behavior, egg spawning, and seasonal reproduction cycle.
tags: [behavior, spawning, seasonal, environment, nest]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9bf57dd6
system_scope: environment
---

# Tallbirdnest

> Based on game build **714004** | Last updated: 2026-03-07

## Overview
`Tallbirdnest` is a prefab that represents the nest structure used by tallbirds to lay and hatch eggs. It integrates with the `pickable` component to manage egg collection, the `childspawner` component to handle tallbird egg spawning, and implements custom logic to coordinate nesting cycles, egg laying upon nest vacancy, and seasonal smallbird spawning. The nest transitions between states (egg present, nest empty, regenerating) and supports seasonal reproduction mechanics specific to Spring.

## Usage example
```lua
local nest = SpawnPrefab("tallbirdnest")
nest.Transform:SetPosition(x, y, z)
-- Nest automatically begins regenerating eggs after being placed
-- Eggs can be harvested via standard pickable interactions
-- When an egg is laid, the nest enters a regenerative state
nest.components.pickable:Regen() -- force immediate egg regrowth (if empty)
```

## Dependencies & tags
**Components used:** `pickable`, `childspawner`, `inspectable`, `hauntable`
**Tags:** `antlion_sinkhole_blocker`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `readytolay` | boolean | `nil` | Indicates the nest is ready to lay an egg (set after nesting finishes while egg is still absent). |
| `spawnedsmallbirdthisseason` | boolean | `false` | Tracks whether a smallbird has been spawned this season for this nest. |
| `thief` | entity | `nil` | The entity that last picked the egg, triggering defensive tallbird behavior. |
| `nesttime` | number (epoch) | `nil` | Absolute time when nesting should complete. |
| `nesttask` | task | `nil` | Timer task tracking nesting progress. |

## Main functions
### `StartNesting(inst, time)`
*   **Description:** Initiates a nesting cycle. If called with no `time`, uses random duration from `TUNING.TALLBIRD_LAY_EGG_TIME_MIN` + variance. Schedules `DoNesting` to run after `time` seconds.
*   **Parameters:** `time` (number, optional) - duration in seconds.
*   **Returns:** Nothing.
*   **Error states:** Cancels any existing nesting task before starting a new one.

### `StopNesting(inst)`
*   **Description:** Cancels any active nesting task and clears associated state (`nesttime`, `nesttask`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ForceLay(inst)`
*   **Description:** Attempts to lay an egg immediately if the nest is empty (`pickable` not `CanBePicked`) and any tallbird child is within `TALLBIRD_LAY_DIST` (16 units).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onpicked(inst, picker)`
*   **Description:** Triggered when the egg is harvested. Causes all nearby tallbirds to attack the picker, sets nesting state to prepare for future egg, and restarts nesting cycle.
*   **Parameters:** `picker` (entity, optional) - the entity that picked the egg.
*   **Returns:** Nothing.

### `onmakeempty(inst)`
*   **Description:** Triggered when the egg is removed (e.g., by harvesting). Sets nest animation and disables regen in `childspawner`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onregrow(inst)`
*   **Description:** Triggered when the egg has regenerated. Restores normal state, resets `thief`, and clears `readytolay`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onvacate(inst)`
*   **Description:** Triggered by `childspawner` when a child (tallbird) leaves the nest. Forces the nest to become empty (egg removed) and restarts nesting.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `onsleep(inst)`
*   **Description:** If the nest is ready to lay (`readytolay`) and currently has no egg, forces immediate egg laying when a nearby tallbird sleeps.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SpawnSmallBird(inst)`
*   **Description:** Spawns a `smallbird` if a tallbird is present and hasn't already spawned one this season. Handles delayed spawning if the tallbird is asleep.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SeasonalSpawnChanges(inst)`
*   **Description:** Coordinates seasonal smallbird spawning logic: schedules a smallbird spawn in Spring if not yet spawned this season; resets state in non-Spring seasons.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst.StartNesting = StartNesting`
*   **Description:** Exposes `StartNesting` as a method on the nest instance for external calls (e.g., `nest:StartNesting(30)`).
*   **Parameters:** None (delegates to `StartNesting` function).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `entitysleep` - triggers `onsleep` to lay eggs if conditions are met.
- **Pushes:** None directly (relies on component events).
- **World state watch:** `isspring` - triggers `SeasonalSpawnChanges` on world season change.
- **Save/load hooks:** `OnSave`, `OnLoad` - persist nesting state, `readytolay`, and seasonal spawn tracking.