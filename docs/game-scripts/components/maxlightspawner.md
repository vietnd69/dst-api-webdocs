---
id: maxlightspawner
title: Maxlightspawner
description: Spawns and manages up to two Maxwell-related lights in a circular arrangement around the spawner entity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: cc174c3f
---

# Maxlightspawner

## Overview
This component is responsible for spawning and tracking up to two `maxwelllight` prefabs in a circular pattern around its owner entity. It handles initialization, ownership tracking, and serialization/deserialization for save/load compatibility.

## Dependencies & Tags
- **Component Dependencies:** None (relies only on the owner entity `inst` being present).
- **Tag Additions/Removals:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (none) | Reference to the owner entity. |
| `lights` | `table` | `{}` | Dictionary mapping light entities to themselves for ownership tracking. |
| `numlights` | `number` | `0` | Current count of owned lights. |
| `maxlights` | `number` | `2` | Maximum number of lights the spawner is allowed to manage. |
| `angleoffset` | `number` | `0` | Initial angular offset (in degrees) for light placement. |
| `radius` | `number` | `3` | Radius (in world units) of the circular arrangement for light placement. |
| `lightname` | `string` | `"maxwelllight"` | Prefab name used for spawning lights. |

## Main Functions

### `TakeOwnership(light)`
* **Description:** Registers a light entity as owned by this spawner and increments the `numlights` counter.
* **Parameters:**
  * `light` (`Entity`): The light entity to register.

### `OnSave()`
* **Description:** Prepares save data for serialization, returning a table containing an array of owned light GUIDs.
* **Parameters:** None.
* **Returns:**
  * `data` (`table`): Save data table with a `lights` array of GUIDs.
  * `data.lights` (`table`): Array of light GUIDs (also returned separately for legacy compatibility).

### `OnLoad(data)`
* **Description:** Handles legacy save data migration; converts a single `childid` field into the `lights` array format if present.
* **Parameters:**
  * `data` (`table`): Save data table, potentially containing `childid`.

### `LoadPostPass(newents, savedata)`
* **Description:** Restores ownership of light entities after world loading is complete by resolving saved GUIDs to actual entities.
* **Parameters:**
  * `newents` (`table`): Table mapping saved GUIDs to entities.
  * `savedata` (`table`): Save data containing `lights` (array of GUIDs).

### `SpawnLight(location)`
* **Description:** Spawns a single `maxwelllight` prefab at the specified world position and adds it to ownership.
* **Parameters:**
  * `location` (`Vector3`): World coordinates where the light should be spawned.
* **Returns:**
  * `Entity` or `nil`: The spawned light entity, or `nil` if spawning failed.

### `SpawnAllLights()`
* **Description:** Spawns lights up to `maxlights`, distributing them evenly in a circle around the owner’s current position. The circle is centered on the owner, uses `radius` for spread, and respects `angleoffset` for orientation.
* **Parameters:** None.

## Events & Listeners
None identified.