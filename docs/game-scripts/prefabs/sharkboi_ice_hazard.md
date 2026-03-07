---
id: sharkboi_ice_hazard
title: Sharkboi Ice Hazard
description: Manages a dynamic, seasonally-adjusted ice boulder that melts or grows over time and can be mined for ice shards.
tags: [environment, physics, combat, season]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ff638dc6
system_scope: environment
---

# Sharkboi Ice Hazard

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sharkboi_ice_hazard` is a prefab component that models a dynamic ice boulder used in the Sharkboi arena ( Sharkboi mod content). It supports multiple growth/maturity stages (`dryup`, `empty`, `short`, `medium`, `tall`), automatically transitions between stages over time (grow or melt), responds to mining and collision damage (e.g., from boats), and handles fire melting. It integrates with multiple systems: `workable` (mining), `lootdropper` (ice shards), `floater` (bobbing on water), `inspectable` (status display), `lunarhailbuildup`, `timer`, and network sync via `net_tinybyte`/`net_bool`.

## Usage example
```lua
local ice_hazard = SpawnPrefab("sharkboi_ice_hazard")
ice_hazard.Transform:SetPosition(x, y, z)
-- Stage transitions occur automatically based on timing and season
-- Can be mined via ACTIONS.MINE or impacted by boats
```

## Dependencies & tags
**Components used:** `lootdropper`, `savedscale`, `timer`, `workable`, `inspectable`, `floater`, `lunarhailbuildup`
**Tags:** Adds `frozen`, `ignorewalkableplatforms`, `antlion_sinkhole_blocker`, `floaterobject`; conditionally adds `CLASSIFIED` on `dryup`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `stage` | string | `"tall"` (initially) | Current stage (`"dryup"`, `"empty"`, `"short"`, `"medium"`, `"tall"`). |
| `_ismelt` | net_bool | `false` | Networked flag indicating melt state (`"melt"` source). |
| `_stage` | net_tinybyte | `4` (0-based index for `"tall"`) | Networked stage index (0–4). |
| `_shouldgrow` | boolean | `true` | Direction of natural stage change: `true` = grow, `false` = melt. |
| `_shouldlocalfx` | boolean | `true` on clients | Controls local splash effect spawning. |

## Main functions
### `SetStage(stage_name, source, snap_to_stage)`
*   **Description:** Changes the boulder’s stage (growth/maturity), updates animations, physics, loot potential, and lunar hail buildup. Handles stage-specific behavior like removal, naming, and tag changes.
*   **Parameters:** 
    - `stage_name` (string) – Target stage name (`"dryup"`, `"empty"`, `"short"`, `"medium"`, `"tall"`).
    - `source` (string) – Trigger: `"grow"`, `"melt"`, or `"work"` (mining).
    - `snap_to_stage` (boolean) – If `true`, jump directly to target; otherwise, advance/regress one step at a time.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `source == "melt"` or `"work"` and `currentstage <= targetstage`, or if `source == "grow"` and `currentstage >= targetstage`. Also returns early if growing from `"dryup"` while overlapping blockers (`locomotor`, `FX` tags).

### `StartFireMelt()`
*   **Description:** Schedules a delayed transition to `"dryup"` stage after 4 seconds if a fire melt event is active.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopFireMelt()`
*   **Description:** Cancels a pending fire melt task if one exists.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CleanupTick()`
*   **Description:** On Sharkboi arena cleanup tick, cancels growth, stops the stage-update timer, and restarts melting.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CleanupForced()`
*   **Description:** Immediately destroys the boulder (and spawns a splash FX) without playing out the usual melting animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoWorkedBy_GameThread(inst, worker, numworks)`
*   **Description:** Wrapper to invoke `workable:WorkedBy` off the physics collision thread.
*   **Parameters:** 
    - `inst` (Entity) – The boulder.
    - `worker` (Entity) – The colliding boat/character.
    - `numworks` (number) – Computed impact strength.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"stagedirty"` – Triggers `OnStageDirty` (client-side).
  - `"timerdone"` – Triggers `OnTimerDone`, advancing stage toward `"empty"` (melt) or `"tall"` (grow).
  - `"firemelt"` – Starts a 4-second melt timer.
  - `"stopfiremelt"` – Cancels the fire melt timer.
  - `"ms_cleanupticksharkboiarena"` – Triggers `CleanupTick`.
  - `"ms_cleanedupsharkboiarena"` – Triggers `CleanupForced`.
  - `"on_collide"` – Handles boat collision damage via `OnCollide`.
  - `"onsave"` / `"onload"` – Stores/restores `stage` for persistence.
- **Pushes:**
  - `"on_landed"` – When boulder becomes a physical obstacle (non-empty/dryup stage).
  - `"on_no_longer_landed"` – When obstacle physics removed (empty/dryup).
  - `"loot_prefab_spawned"` – Via `lootdropper:SpawnLootPrefab`.
  - `"stagedirty"` – Networked change to `_ismelt`/`_stage`, triggers update callbacks.