---
id: butterflyspawner
title: Butterflyspawner
description: Manages butterfly spawning behavior based on active players and world conditions.
tags: [spawn, world, entity, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 82b6d3bc
system_scope: world
---

# Butterflyspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Butterflyspawner` is a server-only component responsible for dynamically spawning and tracking butterflies in the world. It activates during daylight hours (excluding winter) and spawns butterflies near flowers when active players are present. The component uses task scheduling to stagger spawns and avoids overpopulating the world by respecting `TUNING.MAX_BUTTERFLIES`. It integrates with the `homeseeker` and `pollinator` components to ensure spawned butterflies properly link to flower targets and are cleaned up when asleep.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("butterflyspawner")
inst.components.butterflyspawner:StartTracking(butterfly_prefab)
-- Later, to stop tracking a butterfly and restore its original persistence state:
inst.components.butterflyspawner:StopTracking(butterfly_prefab)
```

## Dependencies & tags
**Components used:** `homeseeker`, `pollinator`
**Tags:** Checks `flower` and `butterfly` tags during entity searches; does not add or remove any tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance to which this component is attached (public for direct access). |
| `_activeplayers` | table | `{}` | List of currently active players. Internal state; not directly exposed. |
| `_scheduledtasks` | table | `{}` | Map of pending spawn tasks indexed by player. Internal state. |
| `_maxbutterflies` | number | `TUNING.MAX_BUTTERFLIES` | Maximum number of butterflies allowed in the world at once. |
| `_butterflies` | table | `{}` | Map tracking tracked butterflies and their restoration state. Internal state. |
| `_updating` | boolean | `false` | Whether the spawner is currently active and scheduling spawns. |

## Main functions
### `StartTracking(target)`
*   **Description:** Begins tracking a butterfly entity, temporarily disabling its persistence and ensuring it has a `homeseeker` component for home association. Used to manage entity lifetime during gameplay.
*   **Parameters:** `target` (`Entity`) — the butterfly entity to track.
*   **Returns:** Nothing.
*   **Error states:** No-op if `target` is already being tracked.

### `StopTracking(target)`
*   **Description:** Stops tracking a butterfly, restoring its original `persists` state and conditionally removing the `homeseeker` component.
*   **Parameters:** `target` (`Entity`) — the butterfly entity to stop tracking.
*   **Returns:** Nothing.
*   **Error states:** No-op if `target` is not currently tracked.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string containing current update status and butterfly counts.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"updating:{boolean} butterflies:{count}/{max}"`.

### `SpawnModeNever()` / `SpawnModeLight()` / `SpawnModeMed()` / `SpawnModeHeavy()`
*   **Description:** These methods are deprecated and contain no implementation.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — triggers on player join (world event), adds player to active list and schedules initial spawn if active.  
  - `ms_playerleft` — triggers on player leave (world event), cancels pending spawns and removes player from active list.  
  - `entitysleep` (on tracked butterflies) — schedules automatic removal of sleeping butterflies via `AutoRemoveTarget`.  
  - World state changes `"isday"` and `"iswinter"` — triggers `ToggleUpdate` to start/stop scheduling spawns based on season and time.  

- **Pushes:**  
  - None. This component does not fire custom events.
