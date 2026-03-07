---
id: lunaralterguardianspawner
title: Lunaralterguardianspawner
description: Manages the spawning and lifecycle of lunar rift guardian entities at designated locations in the world.
tags: [boss, world, entity, spawn]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 410481d9
system_scope: world
---

# Lunaralterguardianspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lunaralterguardianspawner` is a server-side component responsible for spawning and tracking lunar rift guardians (e.g., `alterguardian_phase1_lunarrift`) in response to external triggers, such as event progression or player actions. It ensures only one guardian exists or is pending at a time, handles safe spawn positioning away from holes and over land, and supports save/load persistence of pending and active guardians. The component is attached to a spawner entity (e.g., `wagstaff_npc_wagpunk_arena`) and should only exist on the master simulation (server) — it asserts this at construction.

## Usage example
```lua
local spawner = prefabs["wagstaff_npc_wagpunk_arena"]
spawner:AddComponent("lunaralterguardianspawner")

-- Trigger guardian spawn at the spawner's position
spawner.components.lunaralterguardianspawner:TrySpawnLunarGuardian(spawner)

-- Check if a guardian is active or pending
if spawner.components.lunaralterguardianspawner:HasGuardianOrIsPending() then
    print("Guardian is active or spawning")
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (set by constructor) | Reference to the entity this component is attached to. |
| `_activeguardian` | `Entity?` | `nil` | Private reference to the currently active guardian prefab instance. |
| `guardiancomingpt` | `Vector3?` | `nil` | Private position where the next guardian is queued to spawn. |

## Main functions
### `GetGuardian()`
* **Description:** Returns the currently active guardian entity, if any.
* **Parameters:** None.
* **Returns:** `Entity?` — the active `alterguardian_phase1_lunarrift` entity, or `nil` if none is active.
* **Error states:** None.

### `HasGuardianOrIsPending()`
* **Description:** Checks whether a guardian is currently active *or* scheduled to spawn (i.e., a spawn point has been queued).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `_activeguardian` is set or `guardiancomingpt` is set; otherwise `false`.

### `KickOffSpawn(delay)`
* **Description:** Creates and schedules the `alterguardian_phase1_lunarrift` prefab to spawn at the queued `guardiancomingpt` position after the specified delay. Registers cleanup on removal and transitions the new guardian to the `"spawn_lunar"` state.
* **Parameters:** `delay` (number) — time in seconds to wait before spawning.
* **Returns:** Nothing.

### `TrySpawnLunarGuardian(spawner)`
* **Description:** Attempts to initiate a guardian spawn. First validates that no guardian is active or pending, then computes a safe spawn position near the spawner, queues the position, and starts the spawn timer.
* **Parameters:** `spawner` (`Entity?`) — the spawner entity whose position is used as the spawn anchor. May be omitted or `nil`, but must provide a valid position if provided.
* **Returns:** Nothing.
* **Error states:** Early return (no effect) if `spawner` is `nil`, a guardian is already active or pending, or no valid spawn point can be found.

### `OnSave()`
* **Description:** Serializes the component state for world save. Captures the GUID of the active guardian and the queued spawn position (if any).
* **Parameters:** None.
* **Returns:** Two values:
  - `data` (`table`) — contains `activeguid`, `guardiancomingpt_x`, and `guardiancomingpt_z`.
  - `ents` (`table<number>`) — list of entity GUIDs to persist (e.g., the active guardian's GUID).
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Loads and restores state from a previous save. Recreates the queued spawn position (if saved) and re-invokes `KickOffSpawn` with a default 4-second delay.
* **Parameters:** `data` (`table?`) — the saved data table.
* **Returns:** Nothing.
* **Error states:** Early return if `data` is `nil`.

### `LoadPostPass(newents, data)`
* **Description:** Post-load hook to resolve the saved guardian GUID to its actual entity reference once the world is fully loaded.
* **Parameters:**  
  - `newents` (`table<GUID, {entity: Entity}>`) — map of loaded entities by GUID.  
  - `data` (`table`) — the saved data table (same as passed to `OnLoad`).  
* **Returns:** Nothing.
* **Error states:** Early no-op if `data.activeguid` is missing or the entity is not found in `newents`.

### `_Debug_SpawnGuardian(player)`
* **Description:** Internal debug utility that attempts to spawn a guardian at the provided player’s world position (or `ThePlayer` if no player given). Intended for manual testing, not production logic.
* **Parameters:** `player` (`Entity?`) — optional player entity whose position is used as spawn anchor.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` (on active guardian) — clears the `_activeguardian` reference when the guardian entity is removed from the world.
- **Pushes:** None.
