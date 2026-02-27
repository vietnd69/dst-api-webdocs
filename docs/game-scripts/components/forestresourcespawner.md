---
id: forestresourcespawner
title: Forestresourcespawner
description: Manages the automatic spawning and renewal of renewable forest resources (e.g., flint, grass, berry bushes) in the game world, based on player proximity and environmental constraints.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 5c3c03b2
---

# Forestresourcespawner

## Overview
This component is responsible for periodically spawning renewable natural resources (such as flint, saplings, grass, and berry bushes) in the game world when no players are near. It uses registered spawn points to determine where renewal may occur, avoids placing resources on roads or in invalid locations, and respects resource-specific renewal rules defined in `RENEWABLES`.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` (executes only on the server/multiplayer master).
- Does *not* add or modify component or tag definitions directly, but uses the following event signals:
  - Listens for `"ms_registerspawnpoint"` to track spawn locations.
  - Listens for `"ms_enableresourcerenewal"` to toggle renewal behavior.
- Internally relies on:
  - `inst.Map:CanPlantAtPoint`, `inst.Map:IsDeployPointClear`, `inst.Map:CanPlacePrefabFilteredAtPoint`
  - `TheSim:FindEntities`
  - `SpawnPrefab`, `RoadManager`, `DEPLOYSPACING`
  - `easing`, `TUNING.SEG_TIME`, `table.removearrayvalue`, `table.contains`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | *required argument* | The entity instance the component is attached to (typically `TheWorld`). |

**Note:** No additional public properties are exposed. Private state (`_enabled`, `_spawnpts`, `_task`) is encapsulated.

## Main Functions

### `DoPrefabRenew(x, z, ents, renewable_set, max)`
* **Description:** Checks whether a renewable resource set is underrepresented near a given location (based on `renewable_set.matches`) and, if so, spawns up to `max` random prefabs from `renewable_set.spawns` within a 60-unit radius. Placement respects map rules (e.g., avoids roads, checks deploy spacing).
* **Parameters:**
  - `x`, `z`: World coordinates (Y is assumed to be 0).
  - `ents`: List of entities in the renewal radius, used to detect existing matching prefabs.
  - `renewable_set`: A table with `spawns` (prefabs to consider) and `matches` (prefabs counted toward renewal condition).
  - `max`: Maximum number of prefabs to attempt spawning (max count per renewal batch).

### `DoRenew()`
* **Description:** Selects a random spawn point (using weighted random via `inQuint` easing), removes it from the active list (and re-adds it to cycle through), and triggers resource renewal if no player is within `MIN_PLAYER_DISTANCE`. Schedules the next renewal using `GetRenewablePeriod()`.
* **Parameters:** None (uses global state).

### `Start()`
* **Description:** Starts the renewal task loop if not already running.
* **Parameters:** None.

### `Stop()`
* **Description:** Cancels the renewal task, effectively pausing resource renewal.
* **Parameters:** None.

## Events & Listeners

- **Listens For:**
  - `"ms_registerspawnpoint"` → calls `OnRegisterSpawnPoint(inst, spawnpt)` to add a new spawn point and register a cleanup listener on `"onremove"`.
  - `"ms_enableresourcerenewal"` → calls `OnEnableResourceRenewal(inst, enable)` to toggle renewal.
- **Triggers:**
  - No events are pushed by this component.