---
id: slurtlehole
title: Slurtlehole
description: A hostile, structure-like entity that spawns slurtles or snurtles over time and explodes when ignited or destroyed.
tags: [entity, hostile, explosive, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fb95a0de
system_scope: environment
---

# Slurtlehole

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slurtlehole` is a stationary, hostile environmental entity found in caves. It functions as a spawner that periodically produces `slurtle` or occasionally a rare `snurtle`. It can be ignited and will explode, releasing all spawned creatures and dealing damage. As a structure, it interacts with fire and combat systems via the `childspawner`, `health`, `combat`, `lootdropper`, `burnable`, and `explosive` components.

## Usage example
This component is not intended for direct modder use; it is instantiated internally as a prefab. However, here is how it is typically constructed:
```lua
local inst = CreateEntity()
-- Entity setup: transforms, anims, sound, network, physics, tags
-- [component initialization and event listeners as defined in fn()]
```

## Dependencies & tags
**Components used:** `childspawner`, `lootdropper`, `health`, `combat`, `burnable`, `explosive`, `inspectable`  
**Tags added:** `cavedweller`, `hostile`, `explosive`, `structure`

## Properties
No public properties are initialized directly on `slurtlehole` itself. All state is managed by its attached components.

## Main functions
### `OnHit(inst, attacker, damage)`
* **Description:** Triggered when the slurtlehole is hit in combat. Attempts to spawn a child slurtle at the attacker and plays the "hit" animation.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
  * `attacker` (Entity) — The entity that dealt the hit.
  * `damage` (number) — Amount of damage dealt (unused).
* **Returns:** Nothing.
* **Error states:** Does not spawn if `childspawner` is missing or full; animation may be skipped if dead.

### `OnKilled(inst)`
* **Description:** Handles slurtlehole death: removes the `childspawner`, sets animation to "break" → "idle_broken", removes physics colliders, and schedules `OnDoKilled`.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
* **Returns:** Nothing.

### `OnDoKilled(inst)`
* **Description:** Finalizes death by dropping loot and playing the explosion sound.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
* **Returns:** Nothing.

### `OnIgniteFn(inst)`
* **Description:** Triggered on ignition. Plays shake animation, hiss sound, releases all children via `childspawner:ReleaseAllChildren()`, and calls `DefaultBurnFn`.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
* **Returns:** Nothing.

### `OnExtinguishFn(inst)`
* **Description:** Handles extinguishing by killing the hiss sound and calling `DefaultExtinguishFn`.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
* **Returns:** Nothing.

### `OnExplodeFn(inst)`
* **Description:** Triggered on explosion. Stops hiss sound and spawns `explode_small_slurtlehole` at the hole's position.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
* **Returns:** Nothing.

### `OnPostEndQuake(inst)`
* **Description:** Called after the quaking period ends. Restarts spawning via `childspawner:StartSpawning()`.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
* **Returns:** Nothing.

### `OnPreLoad(inst, data)`
* **Description:** Called during loading to restore world settings–dependent parameters for `childspawner`.
* **Parameters:**
  * `inst` (Entity) — The slurtlehole instance.
  * `data` (table) — Saved world/settings data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` — triggers `OnKilled` to handle entity destruction.
- **Listens to:** `endquake` (on `TheWorld.net`) — triggers spawning restart and schedules `OnPostEndQuake`.
- **Pushes:** None directly — relies on component-level events (`explosive`, `burnable`, `health`, etc.).