---
id: antlion_sinkhole
title: Antlion Sinkhole
description: Manages the lifecycle and damage mechanics of an antlion-triggered sinkhole, including collapse stages, repair cycles, and area-of-effect interactions with nearby entities.
tags: [environment, combat, world, physics, event]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7afdeb4
system_scope: world
---

# Antlion Sinkhole

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`antlion_sinkhole` is a world entity prefab that implements a dynamic environmental hazard. It begins as a stable pit, enters a staged collapse sequence when triggered (via the `startcollapse` event), damages or destroys nearby workable and pickable entities, and ultimately repairs itself over time (via the `startrepair` event) before deactivating. It uses the `timer`, `unevenground`, and visual overrides to manage state transitions and sound effects.

## Usage example
```lua
local sinkhole = SpawnPrefab("antlion_sinkhole")
sinkhole.Transform:SetPosition(x, y, z)
sinkhole:PushEvent("startcollapse") -- begin the collapse sequence
-- Later, trigger repair:
sinkhole:PushEvent("startrepair", { num_stages = 3, time = 60 })
```

## Dependencies & tags
**Components used:** `timer`, `unevenground`  
**Tags added:** `antlion_sinkhole`, `antlion_sinkhole_blocker`, `NOCLICK`  
**Tags checked:** `scarytoprey`, `_combat`, `pickable`, `NPC_workable`, `flying`, `bird`, `ghost`, `playerghost`, `FX`, `DECOR`, `INLIMBO`, `_inventoryitem`, `locomotor`, `stump`  
**Tags removed:** `scarytoprey` (after final collapse stage)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `collapsestage` | number | `0` | Current collapse stage (0 to `NUM_CRACKING_STAGES`). |
| `remainingrepairs` | number | `nil` | Number of repair stages remaining during the repair phase. |
| `collapsetask` | task | `nil` | Periodic task reference for collapse progression. |
| `scrapbook_anim` | string | `"scrapbook"` | Animation name used in scrapbook UI. |
| `scrapbook_specialinfo` | string | `"ANTLIONSINKHOLE"` | Special info key for scrapbook display. |

## Main functions
### `UpdateOverrideSymbols(inst, state)`
* **Description:** Updates visual crack symbols and uneven ground behavior based on collapse or repair stage.
* **Parameters:**  
  `state` (number) – Current stage index (`0` to `NUM_CRACKING_STAGES`).
* **Returns:** Nothing.  
* **Error states:** If `unevenground` component is missing, attempts to call its methods are safely skipped.

### `SpawnFx(inst, stage, scale)`
* **Description:** Spawns random pre-fab FX entities and plays a sound at the sinkhole’s location to indicate collapse/repair activity.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
  `stage` (number) – Current stage number (used for sound volume).  
  `scale` (number) – Base scale factor for FX entities.  
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Handles `timerdone` events for the `"nextrepair"` timer. Decrements repair count and schedules next repair; deactivates the sinkhole when repairs complete.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
  `data` (table) – Event data; only processes when `data.name == "nextrepair"`.  
* **Returns:** Nothing.

### `start_repairs(inst, repairdata)`
* **Description:** Initiates the repair phase by setting the remaining repair stages and scheduling the first timer.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
  `repairdata` (table?) – Optional table containing `num_stages` and `time`. Falls back to defaults if omitted.  
* **Returns:** Nothing.

### `donextcollapse(inst)`
* **Description:** Advances the collapse sequence by one stage: shakes the camera, updates visuals, spawns FX, and affects entities within the sinkhole radius.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
* **Returns:** Nothing.  
* **Behavior details:**  
  - Works on entities with `workable` or `pickable` components, or deal damage to `combat`/`health` entities.  
  - Destroys workables only on the final stage.  
  - Deactivates mines via `Mine:Deactivate()` and launches inventory items via `SmallLaunch()`.  
  - Removes `scarytoprey` tag after final stage.

### `onstartcollapse(inst)`
* **Description:** Starts the collapse sequence with a periodic task and triggers the first collapse stage.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
* **Returns:** Nothing.

### `SmallLaunch(inst, launcher, basespeed)`
* **Description:** Applies physics velocity to launch an entity (e.g., a stuck item) away from the sinkhole.
* **Parameters:**  
  `inst` (Entity) – The entity to launch.  
  `launcher` (Entity) – The sinkhole entity providing the launch origin.  
  `basespeed` (number) – Base speed multiplier.  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes current collapse or repair state for world save.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
  `data` (table) – The save data table to populate.  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores state after loading and resumes tasks or visual updates accordingly.
* **Parameters:**  
  `inst` (Entity) – The sinkhole entity.  
  `data` (table?) – The loaded save data.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `timerdone` – Triggers `OnTimerDone`.  
  - `startcollapse` – Triggers `onstartcollapse`.  
  - `startrepair` – Triggers `start_repairs`.  
- **Pushes:** None.