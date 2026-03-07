---
id: carnival_plaza
title: Carnival Plaza
description: Serves as a central event structure in the Carnival event, managing decorative rank progression, crow kid spawners, and host summoning functionality.
tags: [event, spawn, combat, deployment, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9b897809
system_scope: environment
---

# Carnival Plaza

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnival_plaza` is a prefabricated event structure used exclusively during the Carnival event. It functions as a decorated shelter that can be upgraded through rank levels, spawns `carnival_crowkid` entities within a radius, and supports summoning the Carnival Host when activated. It integrates with multiple components including `carnivaldecorranker`, `childspawner`, `activatable`, `workable`, and `lootdropper`. The structure includes a floor visual and deployment helper ring for placement guidance.

## Usage example
```lua
-- Typically instantiated by the game during event setup, not manually
local plaza = SpawnPrefab("carnival_plaza")
plaza.Transform:SetPosition(x, y, z)

-- Manual rank update (if needed)
if plaza.components.carnivaldecorranker then
    plaza.components.carnivaldecorranker.rank = 2
end

-- Manual activation
plaza.components.activatable.OnActivate(plaza, player)
```

## Dependencies & tags
**Components used:** `inspectable`, `savedrotation`, `lootdropper`, `carnivaldecorranker`, `activatable`, `childspawner`, `workable`, `deployhelper`, `updatelooper`, `placer`  
**Tags added:** `carnivaldecor_ranker`, `carnival_plaza`, `structure`, `carnivalgame_part`, `shelter`  
**Tags checked:** `notarget`, `INLIMBO`, `hostile`, `playerghost`, `beaver`  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_choppeddown` | boolean | `false` | Indicates whether the plaza has been chopped down (via workable CHOP). |
| `_musiccheck` | task | `nil` | Periodic task reference for music update loop. |
| `helper` | entity | `nil` | Reference to the deploy helper visual ring entity. |
| `highlited` | boolean | `nil` | Flag set by helper ring when placement zone is valid. |

## Main functions
### `CreateFloor(parent)`
*   **Description:** Creates and returns a non-networked visual floor entity that is parented to the plaza structure and linked via the `placer` component.
*   **Parameters:** `parent` (entity) — The `carnival_plaza` entity that owns this floor.
*   **Returns:** `inst` (entity) — The created floor entity.

### `CreateDeployHelperRing()`
*   **Description:** Creates and returns a non-networked visual ring entity used as a placement helper during deployment.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The created helper ring entity.

### `DeployHelperRing_OnUpdate(helperinst)`
*   **Description:** Periodic callback for the deployment helper ring that updates its highlight color based on valid placement proximity and platform presence.
*   **Parameters:** `helperinst` (entity) — The helper ring instance.
*   **Returns:** Nothing.

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
*   **Description:** Callback used by `deployhelper` to create or destroy the helper ring when deployment mode changes.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance.  
  - `enabled` (boolean) — Whether helper mode is active.  
  - `recipename` (string) — Recipe name for the deployable (unused).  
  - `placerinst` (entity or nil) — The current placement target or cursor entity.
*   **Returns:** Nothing.

### `UpdateArtForRank(inst, rank, prev_rank, snap_animations)`
*   **Description:** Updates visual assets and animations based on the current rank (`1`, `2`, or `3`). Handles upgrade/downgrade animations and trunk/level visibility toggling.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance.  
  - `rank` (number) — The new rank level (1–3).  
  - `prev_rank` (number) — The previous rank level.  
  - `snap_animations` (boolean) — If `true`, skips animation playback (used during initialization).
*   **Returns:** Nothing.

### `onrankchanged(inst, new_rank, prev_rank, snap_animations)`
*   **Description:** Callback invoked when the plaza's rank changes. Adjusts child spawner limits and handles crow kid removal if rank decreased beyond current population.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance.  
  - `new_rank` (number) — The new rank value.  
  - `prev_rank` (number) — The previous rank value.  
  - `snap_animations` (boolean) — Whether to skip animations during update.
*   **Returns:** Nothing.

### `OnActivate(inst, doer)`
*   **Description:** Handles player activation of the plaza to summon the Carnival Host. Plays ringing animation/sound and delegates to `carnivalevent:SummonHost`.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance.  
  - `doer` (entity) — The entity performing activation (typically a player).
*   **Returns:** `true` if host summoning succeeds; otherwise `false, "NOCARNIVAL"` or `false` if chopped down.

### `GetStatus(inst)`
*   **Description:** Returns the current level status string used by the `inspectable` component for UI display.
*   **Parameters:** `inst` (entity) — The plaza instance.
*   **Returns:** `string` — Status value like `"LEVEL_1"`.

### `onremove(inst)`
*   **Description:** Cleanup callback invoked on entity removal. Unregisters the plaza from the `carnivalevent` world component.
*   **Parameters:** `inst` (entity) — The plaza instance.
*   **Returns:** Nothing.

### `IsSafeToSpawnCrowKid(inst)`
*   **Description:** Helper function used by `childspawner.canspawnfn` to determine if spawning should proceed (no lunar hailing and no nearby hostile entities).
*   **Parameters:** `inst` (entity) — The plaza instance (used only for position).
*   **Returns:** `boolean` — `true` if safe to spawn; `false` otherwise.

### `OnSpawnCrowKid(inst, child)`
*   **Description:** Callback invoked when a `carnival_crowkid` entity is spawned. Sets the child's starting state to `"glide"`.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance (parent spawner).  
  - `child` (entity) — The spawned crowkid.
*   **Returns:** Nothing.

### `chop_tree(inst, chopper, chopsleft, numchops)`
*   **Description:** Workable callback invoked during each chopping step. Plays chop sound and animation, drops a leaf.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance.  
  - `chopper` (entity or nil) — The entity doing the chopping.  
  - `chopsleft` (number) — Remaining chops before completion.  
  - `numchops` (number) — Total chops required.
*   **Returns:** Nothing.

### `chop_down_tree(inst, chopper)`
*   **Description:** Workable callback invoked upon final chop to complete tree fall. Initiates fall animation, drops loot, removes `shelter` tag, and marks as `persists = false`.
*   **Parameters:**  
  - `inst` (entity) — The plaza instance.  
  - `chopper` (entity or nil) — The entity doing the chopping.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` — Triggers floor animation placement and plaza orientation.  
  - `onremove` — Calls `UnregisterPlaza` for cleanup.  
  - `animover` — Removes the plaza entity after fall animation completes.  
  - `detachchild` — Used internally to remove excess crowkids during rank downgrades.  
- **Pushes:**  
  - `playcarnivalmusic` — Pushed to the local player when near and music check is active.