---
id: forestpetrification
title: Forestpetrification
description: Tracks nearby petrifiable entities and periodically triggers large-scale petrification events in the forest based on cooldown cycles.
tags: [forest, petrification, world, event]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 42cd0af4
system_scope: world
---

# Forestpetrification

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ForestPetrification` manages the large-scale petrification mechanic in the forest biome. It tracks all entities tagged with `petrifiable`, periodically initiates a search across the forest sector to locate petrifiable entities, and triggers petrification events when a minimum threshold is met. The component runs exclusively on the master simulation (`TheWorld.ismastersim`) and coordinates cooldown cycles, search scans, and petrification events via the `petrifiable` component.

It interacts directly with the `Petrifiable` component (via `inst.components.petrifiable:Petrify(...)`) to execute petrification and uses a spatial sector-based search algorithm to efficiently locate nearby entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("forestpetrification")
-- The component automatically starts tracking and managing cooldowns on init.
-- Modders can manually trigger a search:
inst.components.forestpetrification:FindForest()
```

## Dependencies & tags
**Components used:** `petrifiable` (external), `transform` (via `FindEntities`)
**Tags:** Adds `petrifiable` tracking; listens for `ms_registerpetrifiable` and `ms_unregisterpetrifiable` events.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this component (assigned in constructor). |

## Main functions
### `FindForest()`
*   **Description:** Immediately stops any active cooldown and starts searching the forest for petrifiable entities. Used to manually trigger a petrification cycle.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnPostInit()`
*   **Description:** Called after the entity is fully initialized. Starts the initial cooldown cycle if not already active.
*   **Parameters:** None (invoked by engine).
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Processes one step of the sector search. Called frequently while a search is in progress (`_tovisit` is non-nil). Limits work per frame via `MAX_WORK` to avoid frame spikes.
*   **Parameters:** `dt` (number, unused) — time delta.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Handles long-duration time advances (e.g., world loading, time skips). Fast-forwards the cooldown or triggers search once cooldown ends.
*   **Parameters:** `dt` (number) — total elapsed time in seconds.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes the component state for world save. Returns cooldown state and search progress (if any).
*   **Parameters:** None.
*   **Returns:** `{ cooldown = number or 0 }` or `nil` if nothing to save.

### `OnLoad(data)`
*   **Description:** Restores the component state from save data. Restarts cooldown if present.
*   **Parameters:** `data` (table) — previously saved state.
*   **Returns:** Nothing.

### `LoadPostPass(newents, data)`
*   **Description:** Finalizes load reconstruction. If a search was in progress at save time (`cooldown == 0` and search not complete), restarts it post-load.
*   **Parameters:** `newents` (table), `data` (table).
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable string describing current state for debug UI.
*   **Parameters:** None.
*   **Returns:** `string` — `"Finding forest..." + count`, `"Cooldown in X day(s)"`, or `"Idle"`.

## Events & listeners
- **Listens to:**  
  - `ms_registerpetrifiable` — registers a new petrifiable entity for tracking.  
  - `ms_unregisterpetrifiable` — unregisters and cleans up a tracked petrifiable entity.  
  - `onremove` (on tracked targets) — removes target from tracking when destroyed.  
  - `ms_cyclecomplete` — triggers transition from cooldown to search phase.  
- **Pushes:** None (does not fire custom events).
