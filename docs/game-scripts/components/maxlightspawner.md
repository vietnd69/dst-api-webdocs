---
id: maxlightspawner
title: Maxlightspawner
description: Spawns and manages a fixed number of light prefabs in a circular pattern around an entity.
tags: [light, environment, spawner]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: cc174c3f
system_scope: environment
---

# Maxlightspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MaxLightSpawner` manages a set of `maxwelllight` prefabs positioned in a circle around the owning entity. It handles spawning lights, tracking ownership, and persisting light references across save/load cycles. The component is designed for entities like Maxwell or Abigail that require decorative or functional lighting arrangements.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maxlightspawner")
inst.components.maxlightspawner.radius = 4
inst.components.maxlightspawner.maxlights = 3
inst.components.maxlightspawner:SpawnAllLights()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `maxwelllight` prefabs as children (via `SpawnPrefab`), but does not tag the spawner entity itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lights` | table | `{}` | Map of owned light entities (key and value both the light instance). |
| `numlights` | number | `0` | Current count of owned lights. |
| `maxlights` | number | `2` | Maximum number of lights this spawner may manage. |
| `angleoffset` | number | `0` | Initial angular offset (in degrees) for the light placement circle. |
| `radius` | number | `3` | Radius of the circle on which lights are spawned (in world units). |
| `lightname` | string | `"maxwelllight"` | Name of the prefab to spawn for lights. |

## Main functions
### `TakeOwnership(light)`
*   **Description:** Registers a light entity as owned by this spawner. Updates internal tracking.
*   **Parameters:** `light` (entity) — the light prefab instance to claim.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Prepares light ownership data for saving. Collects GUIDs of all owned lights.
*   **Parameters:** None.
*   **Returns:** Two values:  
    1. A `data` table containing `{ lights = {guid1, guid2, ...} }`.  
    2. The same `lights` array (redundant; likely legacy behavior).

### `OnLoad(data)`
*   **Description:** Handles legacy save data format compatibility during load. Converts `data.childid` to `data.lights` if present.
*   **Parameters:** `data` (table) — raw save data passed from world loader.
*   **Returns:** Nothing.

### `LoadPostPass(newents, savedata)`
*   **Description:** Restores light references after all entities are created. Reclaims ownership of lights using saved GUIDs.
*   **Parameters:**  
    - `newents` (table) — mapping of GUIDs to entity instances created during world load.  
    - `savedata` (table) — contains the `lights` array of GUIDs to reload.  
*   **Returns:** Nothing.

### `SpawnLight(location)`
*   **Description:** Spawns a single `maxwelllight` prefab at a given world position and registers it.
*   **Parameters:** `location` (Vector3) — world coordinates where the light should appear.
*   **Returns:** (entity or nil) — the newly spawned light, or `nil` if spawning failed.

### `SpawnAllLights()`
*   **Description:** Spawns up to `maxlights` lights in a circular formation around the spawner entity's current position.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `numlights >= maxlights`.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
