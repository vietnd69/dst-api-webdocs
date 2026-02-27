---
id: farmplantable
title: Farmplantable
description: Enables an entity to be planted into soil by consuming itself and spawning a target plant at the soil's location.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 19ff54ef
---

# Farmplantable

## Overview
The `FarmPlantable` component provides planting logic for an entity (typically a seed or seed packet) that, when used on a soil entity, consumes itself, spawns a plant prefab at the soil’s position, and dispatches relevant planting events. It is designed for agricultural items that require interaction with soil to grow crops.

## Dependencies & Tags
- Relies on `target:HasTag("soil")` and `target:GetPosition()` — no formal component dependencies.
- No tags are added or removed on the owner (`self.inst`).
- Uses `SpawnPrefab`, `FunctionOrValue`, and standard world-level APIs (`TheWorld:PushEvent`), indicating integration with the game’s prefab system and event network.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the component’s owner entity (typically a seed or seed packet). |
| `plant` | `string \| function` | `nil` | The prefab name or a function returning the plant prefab to spawn. Initialized as `nil` and expected to be set externally before planting. |

## Main Functions
### `Plant(target, planter)`
* **Description:** Attempts to plant the owned item (e.g., a seed) into the specified `target` entity *if* it has the `"soil"` tag. Upon success, it removes the seed entity, spawns the configured plant at the soil’s position, plays a planting sound, and fires planting events.
* **Parameters:**
  - `target` (`Entity`): The entity to plant into (must have the `"soil"` tag).
  - `planter` (`Entity`): The entity performing the planting action (e.g., a player).

### `FunctionOrValue(self.plant, self.inst)`
* **Note:** Used internally to resolve the `plant` property to a string prefab name. Accepts either a string or a function that returns a string; if a function, it is called with `self.inst` as an argument.

## Events & Listeners
- **Listens to:** None (this component does not register any event listeners).
- **Pushes:**
  - `"on_planted"` on the spawned plant entity, with payload `{ doer = planter, seed = self.inst, in_soil = true }`.
  - `"itemplanted"` on `TheWorld`, with payload `{ doer = planter, pos = pt }`.