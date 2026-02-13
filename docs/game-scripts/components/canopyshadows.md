---
id: canopyshadows
title: Canopyshadows
description: Manages the procedural generation and lifecycle of shadow entities to create a large canopy effect around its owner.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
---

# Canopyshadows

## Overview
This component is responsible for creating a large, shaded area around an entity, such as a large tree. It procedurally calculates a circular pattern of shadow locations, then spawns and despawns "leaf canopy" entities at these positions. The system uses a global, reference-counted registry to efficiently manage overlapping canopies from multiple sources, ensuring that a shadow is only spawned once on any given tile. It also optimizes performance by despawning the shadows when the host entity is asleep (off-screen) and respawning them when it wakes up.

## Dependencies & Tags
*   **Dependencies:** Relies on the entity's `Transform` component to get its world position.
*   **Tags:** None identified.

## Properties

| Property           | Type    | Default Value                                | Description                                                                          |
| ------------------ | ------- | -------------------------------------------- | ------------------------------------------------------------------------------------ |
| `inst`             | `Entity`| The entity instance.                         | A reference to the host entity this component is attached to.                        |
| `range`            | `number`| `floor(TUNING.SHADE_CANOPY_RANGE/4)`           | The radius, in world tiles, within which canopy shadows will be generated.           |
| `canopy_positions` | `table` | `{}`                                         | An array storing the `{x, z}` world coordinates of each generated shadow position.    |
| `spawned`          | `boolean`| `false`                                      | A flag indicating whether the shadow entities are currently spawned in the world.    |

## Main Functions

### `OnRemoveEntity()`
*   **Description:** Handles cleanup when the component or entity is removed. It despawns all associated shadows and removes their position data from the global registry. This is aliased as `OnRemoveFromEntity`.
*   **Parameters:** None.

### `GenerateCanopyShadowPositions()`
*   **Description:** Calculates a random set of tile-aligned coordinates in a circle around the entity based on the `range` property. For each valid position, it increments a reference count in a global table to track how many canopy sources want a shadow at that location.
*   **Parameters:** None.

### `RemoveCanopyShadowPositions()`
*   **Description:** The counterpart to `GenerateCanopyShadowPositions`. It iterates through its stored shadow positions and decrements the global reference count for each, removing the entry from the global registry if the count reaches zero.
*   **Parameters:** None.

### `OnEntitySleep()`
*   **Description:** Called when the host entity goes to sleep (typically when off-screen). It despawns all visual shadow entities to save performance.
*   **Parameters:** None.

### `OnEntityWake()`
*   **Description:** Called when the host entity wakes up (typically when on-screen). It respawns the visual shadow entities.
*   **Parameters:** None.

### `SpawnShadows()`
*   **Description:** Spawns the actual leaf canopy entities at the pre-calculated positions. It uses a global `spawnrefs` counter to ensure that a shadow entity is only spawned once per tile, even if multiple canopies from different entities overlap.
*   **Parameters:** None.

### `DespawnShadows(ignore_entity_sleep)`
*   **Description:** Despawns the leaf canopy entities. It decrements the global `spawnrefs` counter and removes the shadow entity from the world only when the count reaches zero.
*   **Parameters:**
    *   `ignore_entity_sleep` (boolean, optional): If true, the despawn will proceed even if the entity is awake. This is used during entity removal to guarantee cleanup.