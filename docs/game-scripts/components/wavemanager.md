---
id: wavemanager
title: Wavemanager
description: Manages procedural spawning of ocean wave visual effects (shimmers and shore waves) near the player based on terrain type and distance from the camera.
tags: [environment, fx, ocean, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: cec24cbb
system_scope: environment
---

# Wavemanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WaveManager` is a dynamic environmental component responsible for spawning and animating ocean surface visual effects, such as shimmering water ripples and shore-breaking waves, in response to the player's location and the underlying terrain. It operates as a periodic updater that samples nearby tiles on the world map, spawning appropriate prefabs (`wave_shimmer`, `wave_shore`, `wave_shimmer_med`, `wave_shimmer_deep`) depending on tile type and surrounding water conditions. It is typically attached to a world-level entity (e.g., `TheWorld`) to manage ocean visuals globally.

## Usage example
```lua
-- Attaching to the world root (conceptual example)
local inst = CreateEntity()
inst:AddComponent("wavemanager")

-- Modifying global shimmer spawn rate
if inst.components.wavemanager then
    inst.components.wavemanager.shimmer_per_sec_mod = 0.5
end

-- Registering a blocker (e.g., a structure preventing wave spawning nearby)
inst:AddComponent("physicsblocker")
inst.components.physicsblocker:SetBlockerRadius(5)
inst:ListenForEvent("onregister", function(inst)
    TheWorld.components.wavemanager:RegisterBlocker(inst, 5)
end)
```

## Dependencies & tags
**Components used:** `None identified`  
**Tags:** Does not directly manage tags on the owner entity, but spawns prefabs with their own internal logic and tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shimmer` | table | see constructor | Maps `WORLD_TILES.*` constants to spawn configuration tables containing `per_sec`, `spawn_rate`, and `tryspawn` functions. |
| `ripple_per_sec` | number | `10` | Base rate for ripple effects (not currently used in `OnUpdate`). |
| `ripple_idle_time` | number | `5` | Time before ripple logic idles (not currently used in `OnUpdate`). |
| `shimmer_per_sec_mod` | number | `1.0` | Global multiplier applied to shimmer spawn rates; set to `0` to disable spawning and stop updates. |
| `blockers` | table | `{}` | Dictionary of entities (keys) and blocking distances (values); prevents wave spawning within radius of these entities. |

## Main functions
### `RegisterBlocker(inst, dist)`
*   **Description:** Registers an entity as a blocker, preventing shimmer/wave spawning within a radius of `dist` units from its position.
*   **Parameters:** `inst` (Entity) — the blocker entity; `dist` (number) — blocking radius in world units.
*   **Returns:** Nothing.

### `UnregisterBlocker(inst)`
*   **Description:** Removes an entity from the blocker list, restoring normal shimmer/wave spawning near it.
*   **Parameters:** `inst` (Entity) — the blocker entity to remove.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called periodically to attempt spawning shimmer effects based on tile type and proximity to the player. Iterates through configured shimmer types, accumulates spawn rates over time, and spawns prefabs if `canSpawn` returns true.
*   **Parameters:** `dt` (number) — delta time in seconds since last update.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `ThePlayer` or `TheWorld.Map` is `nil`. If `shimmer_per_sec_mod <= 0.0`, stops updating the component.

### `GetDebugString()`
*   **Description:** Returns a debug string containing the current shimmer spawn radius and camera-based spawn rate multiplier for debugging purposes.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"Shimmer: <radius>, Mult: <mult>"`.

## Events & listeners
- **Listens to:** None (relies on `StartUpdatingComponent` for periodic `OnUpdate` calls).
- **Pushes:** None.
