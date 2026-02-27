---
id: lunarthrall_plantspawner
title: Lunarthrall Plantspawner
description: This world-level component orchestrates the spawning of Lunarthrall plant-based gestalts during lunar rift events, managing wave timing, plant target selection, and rift lifecycle integration.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 2f5324bf
---

# Lunarthrall Plantspawner

## Overview
This is a `TheWorld`-level world component responsible for managing the lunar rift-triggered infestation cycle of lunar plants into Lunarthrall gestalt minions. It coordinates with rift spawners, plant herds, and game time to schedule and execute spawning waves, handle onscreen/offscreen target selection, and clean up when the rift ends or waves are depleted.

## Dependencies & Tags
- Relies on the following world components: `riftspawner`, `timer`.
- Listens to events:
  - `ms_lunarrift_maxsize`
  - `plantherdspawned`
  - `ms_lunarportal_removed`
  - `lunarthrallplant_infested`
  - `timerdone`
  - `ms_gestalt_possession`
- Tags involved (via `PLANT_MUST`, `PLANTS_MUST`, `HUSK_MUST`): `"lunarthrall_plant"`, `"plant"`, `"lunarplant_target"`, `"epiccorpse"`, `"lunarthrall_plant"` (again for husks).
- No direct component additions to its own entity (`self.inst` is `TheWorld`).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The world entity instance (`TheWorld`). |
| `waves_to_release` | `number?` | `nil` | Remaining wave count (set when rift reaches max size). |
| `plantherds` | `table` | `{}` | List of registered plant herds (`Plantherd` instances) used for infestation target selection. |
| `spawntasks` | `table` | `{}` | Tracks active spawner tasks (for cancellation on cleanup). |
| `targetedplants` | `table` | `{}` | Map of plant GUIDs currently selected for infestation (used to prevent overlap/duplication). |
| `currentrift` | `Entity?` | `nil` | Reference to the active `lunarrift_portal` rift entity, if any. |

## Main Functions

### `SpawnGestalt(target, rift)`
* **Description:** Spawns a `lunarthrall_plant_gestalt` prefab. If `rift` is provided and valid, spawns it at the rift’s position and plays a sound; otherwise spawns it offscreen (using a spiral search) and moves it toward the target.
* **Parameters:**
  - `target` (`Entity`): The plant entity that the gestalt will infest.
  - `rift` (`Entity?`): Optional rift from which to spawn.

### `SpawnPlant(target)`
* **Description:** Infests a target plant with a `lunarthrall_plant` (husk) directly (offscreen infestation). Calls `infest()` and `playSpawnAnimation()` on the new plant.
* **Parameters:**
  - `target` (`Entity`): The plant to infest.

### `InvadeTarget(target)`
* **Description:** Decides whether to spawn a gestalt (if target is onscreen) or directly infest the plant (if offscreen).
* **Parameters:**
  - `target` (`Entity`): The plant to infest.

### `FindHerd()`
* **Description:** Selects a suitable plant herd for infestation. Filters herds based on available uninfested, non-withered members that are far enough from existing husks (`EXISTING_PLANT_SPACE = 30`). Returns a random herd from the top 5 candidates ranked by valid member count.
* **Returns:** `Entity?` — A plant herd entity, or `nil` if no viable herd found.

### `FindWildPatch()`
* **Description:** Scans the world for wild plants (with tags `"plant"` and `"lunarplant_target"`) not yet infested. Searches 10 random points within a 40-unit radius on land and picks the location with the most plants within 20 units. Returns the list of plants at that best location.
* **Returns:** `table?` — Array of plant entities, or `nil` if none found.

### `FindPlant()`
* **Description:** Returns a random infestable plant from all registered herds, checking via `caninfest()`.
* **Returns:** `Entity?` — An infestable plant entity, or `nil`.

### `MoveGestaltToPlant(thrall)`
* **Description:** Offsets the given `lunarthrall_plant_gestalt` to an offscreen position using a spiral outward search, then assigns it to track `plant_target`.
* **Parameters:**
  - `thrall` (`Entity`): The gestalt entity to position.

### `RemoveWave()`
* **Description:** Decrements the remaining wave count. If the count reaches zero, cancels all pending tasks, and starts a 10-second timer to finish/remove the rift.
* **No parameters.**

### `setHerdsOnPlantable(plantable)`
* **Description:** Adds `knownlocations` and `herdmember` components to a plantable entity, and assigns it to a `domesticplantherd`. Used to register plants for potential herd infestation.
* **Parameters:**
  - `plantable` (`Entity`): The plant entity to prepare for herd membership.

### `OnSave()`
* **Description:** Serializes core state for savegames (rift GUID, wave count, task remainders). Returns `{state, refs}` format expected by DST save system.
* **Returns:** `{state: table, refs: table}`

### `OnLoad(data)`
* **Description:** Loads the `waves_to_release` value from saved data.
* **Parameters:**
  - `data` (`table?`): Saved state data.

### `LoadPostPass(newents, data)`
* **Description:** Resolves entity references (e.g., rift) and restores pending tasks (spawntask, nextspawn) after loading.
* **Parameters:**
  - `newents` (`table`): Map of GUID → entity for newly loaded ents.
  - `data` (`table?`): Saved task data.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing remaining waves and timing info.
* **Returns:** `string`

### `LongUpdate(dt)`
* **Description:** Keeps task timers updated during long frame gaps (e.g., save/load or lag), by rescheduling them with reduced remaining time.
* **Parameters:**
  - `dt` (`number`): Delta time since last update.

## Events & Listeners
- Listens for:
  - `ms_lunarrift_maxsize` → `OnLunarRiftReachedMaxSize`
  - `plantherdspawned` → `OnPlantHerdSpawned`
  - `ms_lunarportal_removed` → `OnLunarPortalRemoved`
  - `lunarthrallplant_infested` → `OnPlantInfested`
  - `timerdone` → `OnTimerDone`
  - `ms_gestalt_possession` → `OnGestaltPossession`
- Emits:
  - `"finish_rift"` event on the rift entity (via `PushEvent`) when its lifecycle ends (after 10 seconds from wave completion).