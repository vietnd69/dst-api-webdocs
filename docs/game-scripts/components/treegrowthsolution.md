---
id: treegrowthsolution
title: Treegrowthsolution
description: Applies growth effects to a target entity when used, consuming itself in the process if not stackable.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: c6e49270
---

# Treegrowthsolution

## Overview
This component enables an item to cause target entities (typically trees or plants) to grow when used. It handles precondition checks (e.g., blocking growth on stumps or burnt entities), spawns optional visual effects, delegates growth logic to the target’s `growable` component or custom override function, and consumes or decrements the item’s stack size upon success.

## Dependencies & Tags
- Uses `SpawnPrefab` (global) to instantiate visual effects.
- Interacts with the following target entity components/tags:
  - `target.components.growable` → calls `DoGrowth()`
  - `target.components.stackable` → used to decrement stack size on success
  - Tags checked on target: `"no_force_grow"`, `"stump"`, `"fire"`, `"burnt"`
- Does *not* add or remove any tags on itself or the target.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` → passed via constructor | The entity that owns this component (i.e., the growth-item). |
| `fx_prefab` | `string?` | `nil` | Optional prefab name for visual effects (e.g., particle fx) to spawn at the target's position. Set externally before calling `GrowTarget`. |

*Note: `fx_prefab` is commented out in the constructor but is set and used at runtime. It must be assigned externally (e.g., via `inst.components.treegrowthsolution.fx_prefab = "growthfx"`).*

## Main Functions

### `GrowTarget(target)`
* **Description:** Attempts to trigger growth on the given `target` entity. Performs guard checks (prevents growth of stumps, burnt entities, etc.), spawns visual effects if configured, invokes the target’s growth logic, and consumes or decrements the owner item. Returns `true` on success, `false` otherwise.
* **Parameters:**
  - `target` (`Entity`): The entity to grow (e.g., a sapling or tree).

## Events & Listeners
None identified.