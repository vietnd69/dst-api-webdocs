---
id: perdshrine
title: Perdshrine
description: A structure that accepts berrybushes to become functional and later spawns Perd creatures during daytime.
tags: [crafting, loot, creature]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 31da20df
system_scope: entity
---

# Perdshrine

> Based on game build **7140014** | Last updated: 2026-03-06

## Overview
The `perdshrine` prefab represents a buildable structure that serves as both a trader and a prototyper. Initially empty, it accepts specific dug berrybush items to transition through visual and functional states, eventually enabling Perd spawning during the day. It integrates with multiple core systems: burning (via `burnable` and `propagator`), trading (via `trader`), prototyping (via `prototyper`), looting (via `lootdropper`), and workability (via `workable`). The shrine is only active on the master simulation and saves/restores its bush state across saves.

## Usage example
```lua
local shrine = SpawnPrefab("perdshrine")
shrine.Transform:SetPosition(10, 0, 10)

-- Trade a dug berrybush to activate it
local bush = SpawnPrefab("dug_berrybush")
shrine.components.trader:Give(bush)

-- Once active, Perd may spawn nearby during the day if the conditions are met
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`, `prototyper`, `trader`, `inventoryitem`, `physics`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags added:** `structure`, `perdshrine`, `prototyper` (in pristine state only)  
**Tags checked:** `burnt`, `bush`, `pickable`, `fire`, `smolder`, `diseased`, `debuffed`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bush` | string or `nil` | `"empty"` (initially) | Tracks current bush state: `"empty"`, `"2"`, `"_juicy"`, or `nil` (uninitialized/dug). |

## Main functions
### `SetBush(inst, bush, loading)`
*   **Description:** Updates the shrine's bush state and visuals. Transitions between empty, 2x bush, and juicy bush variants. Removes the `prototyper` and `trader` components when loading or setting a bush; adds them when resetting to empty. Fires a sound effect unless `loading` is true.
*   **Parameters:** `bush` (string) — one of `"dug_berrybush"`, `"dug_berrybush2"`, `"dug_berrybush_juicy"`. `loading` (boolean) — suppresses sound if true (during load).
*   **Returns:** Nothing.
*   **Error states:** No-op if `bush` matches current state or is unrecognized.

### `MakeEmpty(inst)`
*   **Description:** Resets the shrine to its initial empty state by hiding the bush, removing the `prototyper`, and initializing the `trader` with acceptance rules for specific dug bushes.
*   **Parameters:** `inst` (Entity) — the shrine instance.
*   **Returns:** Nothing.

### `MakePrototyper(inst)`
*   **Description:** Adds the `prototyper` component and assigns Perdshrine-specific tech trees. If the Year of the Goat (YOTG) event is active, starts watching for `startday` to schedule Perd spawning.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns the shrine’s status string for UI or inspection purposes. Prioritizes `"BURNT"` > `"EMPTY"` > `nil`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `"BURNT"`, `"EMPTY"`, or `nil` (active with a bush).
*   **Error states:** Returns `nil` only if the shrine is fully active (has `prototyper` and a bush loaded).

## Events & listeners
- **Listens to:**
  - `"onbuilt"` — triggers `onbuilt` to set initial state and animation.
  - `"ondeconstructstructure"` — triggers `OnDeconstructStructure` to return loot.
  - `"spawnperd"` — triggers Perd spawning logic.
- **Pushes:** None directly (relies on component events).

Events handled via registered callbacks:
- `inst:ListenForEvent("onbuilt", onbuilt)`
- `inst:ListenForEvent("ondeconstructstructure", OnDeconstructStructure)`
- `inst:WatchWorldState("startday", OnStartDay)` (only when YOTG is active)