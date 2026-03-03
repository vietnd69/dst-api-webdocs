---
id: ruinsshadelingspawner
title: Ruinsshadelingspawner
description: Manages spawning and lifecycle of a shadeling entity tied to an unsittable chair in a Nightmare-zone node, with cooldown enforcement.
tags: [spawn, boss, night, environment, chair]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 5d0916fb
system_scope: world
---

# Ruinsshadelingspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ruinsshadelingspawner` is a world-level component responsible for spawning and tracking the `ruins_shadeling` boss entity under specific conditions. It binds the shadeling to a designated chair within a Nightmare-zone visual node, enforcing a cooldown period after a shadeling is defeated or removed. The component listens to shadeling and chair events to manage spawning and cleanup logic automatically.

It operates globally via `TheWorld.components.ruinsshadelingspawner`, indicating it is a singleton-like component attached to `TheWorld` (the world entity), not individual prefabs.

## Usage example
```lua
-- Typically added during world initialization, not manually by mods
local spawner = TheWorld.components.ruinsshadelingspawner
spawner.cooldown = TUNING.TOTAL_DAY_TIME -- Optional: adjust cooldown duration

-- Attempt to spawn a shadeling at a given chair
local chair = GetChairPrefab()
local spawned = spawner:TrySpawnShadeling(chair)
if spawned ~= nil then
    -- Shadeling was successfully spawned and seated
end
```

## Dependencies & tags
**Components used:** `sittable` (via `chair.components.sittable`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shadeling` | `Entity` or `nil` | `nil` | Reference to the currently active shadeling prefab instance. |
| `cooldowntask` | `Task` or `nil` | `nil` | Active timer task managing the respawn cooldown. |
| `cooldown` | number | `TUNING.TOTAL_DAY_TIME` | Duration (in seconds) the spawner waits before allowing another spawn. |

## Main functions
### `TrySpawnShadeling(chair)`
*   **Description:** Attempts to spawn a shadeling at the given chair if all conditions are met: no active shadeling, cooldown inactive, chair is sittable and unoccupied, and the chair's position is inside a Nightmare-zone node.
*   **Parameters:** `chair` (Entity) – The chair entity at which to spawn the shadeling.
*   **Returns:** `Entity` (the spawned shadeling prefab) if successful; otherwise `nil`.
*   **Error states:** Returns `nil` if any condition fails (e.g., shadeling already spawned, chair occupied, or chair not in Nightmare-zone). Spawning fails silently without raising errors.

### `LongUpdate(dt)`
*   **Description:** Adjusts the remaining time on the cooldown task during long updates (e.g., when time-scale changes). It cancels the current task and reschedules a new one with updated time if needed.
*   **Parameters:** `dt` (number) – Delta time to apply when adjusting the remaining cooldown duration.
*   **Returns:** Nothing.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** 
  - `"ruins_shadeling_looted"` – Fired by the shadeling upon looting; triggers cooldown via `OnShadelingLooted`.
  - `"onremove"` (shadeling) – Fired when the shadeling is removed; clears `shadeling` reference via `OnShadelingRemoved`.
  - `"onremove"` (chair) – Fired when the chair is removed; despawns the shadeling via `OnChairRemoved`.
  - `"becomeunsittable"` (chair) – Fired when the chair becomes unsittable (e.g., broken); despawns the shadeling if it is not occupying the chair via `OnChairBecameUnsittable`.
- **Pushes:** None identified.
