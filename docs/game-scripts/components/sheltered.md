---
id: sheltered
title: Sheltered
description: Manages shelter detection and status for entities, tracking overhead protection from structures and canopy trees.
tags: [environment, weather, player]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 692b313f
system_scope: entity
---

# Sheltered

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Sheltered` tracks whether an entity is currently under shelter protection from rain and overheating. It periodically scans for nearby shelter structures with the "shelter" tag and checks for canopy tree coverage. The component manages state synchronization between server and client via the `sheltered` replica and announces shelter status changes through the `talker` component when conditions warrant.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sheltered")
inst.components.sheltered:Start()
inst.components.sheltered:SetSheltered(true, 2)
local isSheltered = inst.components.sheltered.sheltered
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- accesses WATERPROOFNESS_SMALLMED, OVERHEAT_TEMP, TOTAL_DAY_TIME constants
- `TheSim` -- CountEntities for shelter detection
- `TheWorld` -- checks state.israining for announcement conditions
- `GetTime()` -- tracks stop/start timing
- `GetLocalTemperature()` -- checks overheating conditions
- `GetString()` -- retrieves announcement string

**Components used:**
- `talker` -- calls Say() for shelter announcements when cooldown allows
- `rainimmunity` -- checked for nil to determine announcement eligibility
- `sheltered` (replica) -- calls StartSheltered(), StopSheltered(), IsSheltered() for network sync

**Tags:**
- `shelter` -- required tag on entities counted as shelter sources
- `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `stump`, `burnt` -- excluded tags that disqualify shelter sources

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that owns this component. |
| `stoptime` | number | `GetTime()` | Timestamp when component was last stopped, or nil if running. |
| `presheltered` | boolean | `false` | Intermediate state before full sheltered status is confirmed. |
| `sheltered` | boolean | `false` | Whether the entity is currently under shelter protection. |
| `announcecooldown` | number | `0` | Time remaining before another shelter announcement can be made. |
| `sheltered_level` | number | `1` | Shelter protection level (1 = structure, 2 = canopy trees). |
| `mounted` | boolean | `false` | Whether the entity is currently mounted (affects shelter logic). |
| `waterproofness` | number | `TUNING.WATERPROOFNESS_SMALLMED` | Waterproofness value granted while sheltered. |

## Main functions

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Resets sheltered state to false.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Start()`
* **Description:** Resumes component updating. Recalculates announce cooldown based on time elapsed while stopped and restarts the updating cycle.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Stop()`
* **Description:** Pauses component updating. Records the stop time and sets sheltered state to false. Safe to call multiple times.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetSheltered(issheltered, level)`
* **Description:** Sets the sheltered state and protection level. Handles state transitions, replica synchronization, and event pushing. May trigger talker announcement if conditions are met (raining or overheating, cooldown expired).
* **Parameters:**
  - `issheltered` -- boolean indicating shelter status
  - `level` -- number indicating shelter level (1 = structure, 2 = canopy)
* **Returns:** None
* **Error states:** Errors if `self.inst.replica.sheltered` is nil when calling replica methods — no nil guard present for replica access.

### `OnUpdate(dt)`
* **Description:** Periodic update function that checks for shelter sources. Decrements announce cooldown, scans for entities with "shelter" tag (excluding disqualified tags), and checks canopy tree count. Calls SetSheltered with detected status.
* **Parameters:** `dt` -- delta time since last update in seconds
* **Returns:** None
* **Error states:** Errors if `self.inst.Transform` is nil when calling GetWorldPosition() — no nil guard present.

### `GetDebugString()`
* **Description:** Returns debug information about current component state including started/stopped status and sheltered flags.
* **Parameters:** None
* **Returns:** String containing debug state information
* **Error states:** None

## Events & listeners
- **Pushes:** `sheltered` -- fired when sheltered state changes, data table contains `{ sheltered=boolean, level=number }`