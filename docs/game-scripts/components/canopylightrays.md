---
id: canopylightrays
title: Canopylightrays
description: Manages the spawning and despawning of decorative light ray effects in a circular area around the entity.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
source_hash: d4493bdc
---

# Canopylightrays

## Overview
This component is responsible for creating and managing decorative light ray visual effects on the ground within a circular area around its parent entity. It uses a global, reference-counted system to ensure that multiple overlapping canopies do not spawn duplicate light rays in the same location. When an entity with this component is removed, it decrements the reference count for the light rays it created, and if a count reaches zero, the light ray effect is removed from the world.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `range` | number | `floor(TUNING.SHADE_CANOPY_RANGE/4)` | The radius, in grid units, within which light rays can be spawned. |
| `lightray_prefab` | string | `"lightrays_canopy"` | The prefab name of the light ray entity to spawn. |
| `lightray_positions` | table | `{}` | An array that stores the `{x, z}` coordinates of light rays this component instance has spawned or referenced. |

## Main Functions
### `SpawnLightrays()`
* **Description:** Iterates through tiles in a circular area around the entity's position. With a 10% chance per tile, it attempts to spawn a light ray. It uses a global table to check if a light ray already exists at a target position. If one exists, its reference count is incremented. If not, a new light ray prefab is spawned, its reference count is set to 1, and it's added to the global lookup table.
* **Parameters:** This function takes no parameters.

### `DespawnLightrays()`
* **Description:** Iterates through all the light ray positions managed by this component instance. For each one, it finds the corresponding light ray entity in the global table and decrements its reference counter. If the reference counter drops to zero, the light ray entity is removed from the game world.
* **Parameters:** This function takes no parameters.

### `OnRemoveEntity()`
* **Description:** A cleanup function called when the component's parent entity is being removed. It ensures that all managed light rays are properly de-referenced by calling `DespawnLightrays()`. This function is also aliased as `OnRemoveFromEntity`.
* **Parameters:** This function takes no parameters.