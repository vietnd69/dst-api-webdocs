---
id: chester_eyebone
title: Chester Eyebone
description: Manages the state and behavior of the Chester Eyebone item, including morphing, respawning Chester, and synchronizing with its master.
tags: [inventory, npc, boss, transformation, save]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ceb1caa5
system_scope: inventory
---

# Chester Eyebone

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `chester_eyebone` prefab represents the in-game item used to summon Chester, the monster. It handles morphing into different variants (NORMAL, SNOW, SHADOW), manages Chester’s respawn timer, and tracks Chester’s binding status via the `leader` component. When held by a player, it periodically attempts to reconnect to an existing Chester entity and respawns Chester upon death. It integrates with the inventory, inspectable, and network systems to function correctly in multiplayer.

## Usage example
```lua
-- Example: Trigger a morph to the SNOW variant
local eyebone = SpawnPrefab("chester_eyebone")
if eyebone ~= nil then
    eyebone:MorphSnowEyebone()
end

-- Example: Stop an ongoing respawn
if eyebone ~= nil then
    eyebone:StopRespawn()
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `leader`, `transform`, `animstate`, `minimapentity`, `network`  
**Tags added:** `chester_eyebone`, `irreplaceable`, `nonpotatable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `EyeboneState` | string | `"NORMAL"` | Current morph state: `"NORMAL"`, `"SNOW"`, or `"SHADOW"`. |
| `openEye` | string | `"chester_eyebone"` | Inventory image name for the open-eye state. |
| `closedEye` | string | `"chester_eyebone_closed"` | Inventory image name for the closed-eye state. |
| `isOpenEye` | boolean? | `nil` | Indicates whether the eye is currently open (`true`) or closed (`nil`). |
| `respawntask` | Task? | `nil` | Pending respawn task if Chester is dead. |
| `respawntime` | number? | `nil` | Unix timestamp of when Chester is scheduled to respawn. |
| `fixtask` | Task? | `nil` | Temporary task that runs after pickup to rebind Chester. |

## Main functions
### `MorphNormalEyebone()`
*   **Description:** Resets the Eyebone to its default NORMAL variant. Clears skin overrides and sets standard image/build assets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MorphSnowEyebone()`
*   **Description:** Morphs the Eyebone to the SNOW variant. Updates `openEye`/`closedEye` image names and applies `_snow` skin overrides and build.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `MorphShadowEyebone()`
*   **Description:** Morphs the Eyebone to the SHADOW variant. Updates image names and applies `_shadow` skin overrides and build.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopRespawn()`
*   **Description:** Cancels any pending respawn task and resets related state (`respawntask`, `respawntime`).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetBuild()`
*   **Description:** Updates the AnimState to use the appropriate build (with or without skin overrides) based on `EyeboneState`.
*   **Parameters:** None (uses `inst.EyeboneState` internally).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` (on Chester) — triggers respawn with a delay (`TUNING.CHESTER_RESPAWN_TIME`) when Chester dies.  
  - `onremove` (on Chester, via `Follower`) — cleans up binding when Chester is removed (handled by `follower.lua`).  
- **Pushes:**  
  - `leaderchanged` — via `follower.lua` when leadership changes.  
  - `imagechange` — via `inventoryitem` when image is updated (e.g., open/closed state changes).