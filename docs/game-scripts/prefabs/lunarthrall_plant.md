---
id: lunarthrall_plant
title: Lunarthrall Plant
description: Controls the behavior of the Lunarthrall Plant boss, including vine spawning, targeting, state management, and coordination with vine segments and the back visual entity.
tags: [combat, ai, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b7cd30b4
system_scope: combat
---

# Lunarthrall Plant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`lunarthrall_plant` is a boss entity prefab that implements the Lunarthrall Plant's gameplay mechanics in DST. It coordinates vine spawning, entity targeting, and transitions between idle, attacking, and tired states. It manages a collection of vine segments (`lunarthrall_plant_vine`, `lunarthrall_plant_vine_end`) via the `vines` table, handles infestation of nearby pickable plants, and triggers death sequences including vine destruction and loot dropping. The prefab uses a stategraph (`SGlunarthrall_plant`) for its primary behavior loop and interacts with multiple components to handle health, combat, freeze effects, and colour syncing.

## Usage example
```lua
local plant = SpawnPrefab("lunarthrall_plant")
plant.Transform:SetPosition(x, y, z)

-- Infest a nearby tree to lock onto it
local tree = FindEntity(plant, 10, function(guy) return guy:HasTag("veggie") end)
if tree then
    plant:infest(tree)
end

-- Force a spawn animation (e.g., after reappearing)
plant:playSpawnAnimation()
```

## Dependencies & tags
**Components used:** `health`, `combat`, `lootdropper`, `inspectable`, `entitytracker`, `colouradder`, `timer`, `freezable`, `burnable`, `growable`, `pickable`, `planardamage`, `planarentity`, `follower`  
**Tags added by prefab:** `plant`, `lunar_aligned`, `hostile`, `lunarthrall_plant`, `retaliates`, `NPCcanaggro`, `gestaltmutant`, `fx`, `NOCLICK`, `soulless`  
**Tags added by vine segments:** `weakvine`, `lunarthrall_plant_segment`, `lunarthrall_plant_end`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `targetsize` | string | `"med"` | Controls which idle/death animation to play (`short`, `med`, or `tall`). Set during infestation based on the infested plant’s visual bounding box height. |
| `highlightchildren` | table | `{}` | List of child entities (`lunarthrall_plant_back`) used for visual highlighting. |
| `vines` | table | `{}` | List of active vine segments spawned by this plant. Managed via `vines`, `vinekilled`, and `vineremoved`. |
| `vinelimit` | number | `TUNING.LUNARTHRALL_PLANT_VINE_LIMIT` | Maximum number of vines that may be active at once. Decrements on vine spawn, increments when a vine is removed without being killed. |
| `tintcolor` | number | `0.6 + math.random() * 0.4` | Shared colour multiplier applied to the plant and its back entity/vines. |
| `back` | entity | `nil` | Reference to the `lunarthrall_plant_back` visual entity attached to the plant. |
| `wake` / `tired` | boolean | `nil` | State flags for the tired/wake cycle. Set during state transitions (`tired_pre`, `tired_wake`). |
| `waketask` / `resttask` | task | `nil` | Scheduled tasks to manage transitions between tired and attack states. |

## Main functions
### `infest(target, isLoad)`
*   **Description:** Infests a `pickable` target plant, locking onto it for targeting. Prevents player interaction and growth on the target, tracks it via `entitytracker`, positions the plant at the target’s location, sets the animation based on target size, and fires the `lunarthrallplant_infested` event. Used on initial spawn (with `isLoad = true`) or during gameplay.
*   **Parameters:** `target` (entity) — the pickable plant to infest. `isLoad` (boolean) — if true, skip animation start (handled post-load).
*   **Returns:** Nothing.
*   **Error states:** Silently returns if `target` is `nil` or lacks `pickable`/`growable` components.

### `deinfest()`
*   **Description:** Ends infestation on the tracked target. Restores `pickable.caninteractwith`, resumes growth via `growable:Resume`, and removes the `NOCLICK` tag. Called during plant removal or death.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `playSpawnAnimation()`
*   **Description:** Forces the stategraph to enter the `"spawn"` state, triggering the vine-eruption animation sequence.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `killvines()`
*   **Description:** Kills all vines in the `vines` table by calling `health:Kill()` on each. Used during the plant’s death sequence.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `vinekilled(vine)`
*   **Description:** Removes the given `vine` from the `vines` list and decrements `vinelimit` only if it was *not* killed (e.g., manually removed). If the plant has no vines and `vinelimit <= 0`, it schedules a tired-state transition.
*   **Parameters:** `vine` (entity) — the vine segment to process.
*   **Returns:** Nothing.

### `vineremoved(vine, killed)`
*   **Description:** Removes `vine` from the `vines` list. Increments `vinelimit` if `killed` is `false` (e.g., the vine was manually destroyed or moved). Does not trigger tired transitions; used by vine entities on removal.
*   **Parameters:** `vine` (entity), `killed` (boolean).
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Called post-load to re-infest the target plant if the entity tracker found a valid `targetplant`. Ensures state consistency after save/load.
*   **Parameters:** `inst` (entity) — the plant instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `death` — triggers `OnDeath`, which kills vines, drops loot, plays death animation, and removes the entity after animation completes.
  - `freeze` — triggers `OnFreeze`, cancelling wake/rest tasks and resetting tired/wake state and vine limit.
  - `onremove` — triggers `OnRemove`, which calls `deinfest()` and `killvines()` to clean up infestation and vines.
  - `attacked` — triggers `OnAttacked`, which sets the attacker as the new combat target (if not already switching targets and attacker isn’t a projectile).
  - `newcombattarget` (on `headplant`) — synchronizes combat target to the vine segment.
  - `droppedtarget` (on `headplant`) — clears the vine segment’s combat target.
  - `animover` — used in `OnDeath` to remove the entity once the death animation finishes.
  - `timerdone` (`name == "idletimer"`) — sets mode to `"retreat"` for `lunarthrall_plant_vine_end`.
- **Pushes:**
  - `lunarthrallplant_infested` — fired when infestation begins.
  - `doattack` — pushed by vine segments to initiate attack.
  - `moveforward`, `moveback`, `emerge` — pushed by vine segments to control movement logic.
