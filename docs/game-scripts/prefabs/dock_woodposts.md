---
id: dock_woodposts
title: Dock Woodposts
description: Implements dock woodpost structures and their deployable item form, handling placement, animation, loot drops on destruction, and network synchronization.
tags: [structure, item, deployable, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 13f58463
system_scope: world
---

# Dock Woodposts

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dock_woodposts` prefab implements a dock structural component used in the game world. It provides two prefabs: the placed structure (`dock_woodposts`) and a deployable item version (`dock_woodposts_item`). The structure uses animation states to indicate placement and idle cycles, supports looting when hammered, and integrates with the deploy system to allow construction at designated sites. It participates in save/load serialization and responds to network synchronization.

## Usage example
```lua
-- Placing a woodpost at a target location
local post = SpawnPrefab("dock_woodposts")
post.Transform:SetPosition(x, y, z)
post:place()

-- As a deployable item
local item = SpawnPrefab("dock_woodposts_item")
item.Transform:SetPosition(x, y, z)
item.Transform:SetRotation(angle)
-- Deploy logic triggers on: item.components.deployable.ondeploy
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `deployable`, `inventoryitem`, `stackable`, `inspectable`, `burnable`, `propagator`, `physics`
**Tags:** Adds `dock_woodpost` to the placed structure; `deploykititem` to the item.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_post_id` | string | `"1"`, `"2"`, or `"3"` | Identifies which animation idle sequence to use (`idle[1|2|3]`). Set during initialization or load. |
| `place` | function | `place` | Public method that plays the placement animation and sound when the structure is placed. |
| `OnSave` | function | `onsave` | Callback used to persist state (`post_id`) to save data. |
| `OnLoad` | function | `onload` | Callback used to restore state from saved data. |

## Main functions
### `place(inst)`
* **Description:** Plays the placement sound and animation for the woodpost and transitions to the idle animation state. Typically invoked once when the structure is initially placed in the world.
* **Parameters:** `inst` (entity) — the structure instance.
* **Returns:** Nothing.
* **Error states:** None — always succeeds on the master simulation.

### `setpostid(inst, id)`
* **Description:** Assigns an animation ID (1–3) if not already set or if a new ID is provided; plays the corresponding idle animation. Used during construction and load.
* **Parameters:**  
  `inst` (entity) — the structure instance.  
  `id` (string or nil) — optional ID to assign; if nil, randomly selects `"1"`, `"2"`, or `"3"`.
* **Returns:** Nothing.
* **Error states:** If `id` is `nil`, defaults to a random integer string `"1"`, `"2"`, or `"3"`.

### `OnHammered(inst, worker)`
* **Description:** Handles destruction via hammering: drops loot, spawns a collapse FX (using the `collapse_small` prefab), and removes the entity.
* **Parameters:**  
  `inst` (entity) — the destroyed structure instance.  
  `worker` (entity) — the entity performing the hammer action.
* **Returns:** Nothing.
* **Error states:** None.

### `OnHit(inst)`
* **Description:** Briefly plays the placement animation frame when the structure is hit (e.g., during construction), then resumes the idle animation. Prevents redundant playback.
* **Parameters:** `inst` (entity) — the structure instance.
* **Returns:** Nothing.
* **Error states:** Only executes if the current animation is the idle variant or the frame is `>= 15`.

### `onsave(inst, data)`
* **Description:** Appends `_post_id` to the `data` table for serialization.
* **Parameters:**  
  `inst` (entity) — the structure instance.  
  `data` (table) — the save data table.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores `_post_id` from save data; calls `setpostid` to reinitialize animation state.
* **Parameters:**  
  `inst` (entity) — the structure instance.  
  `data` (table or nil) — the loaded data, may contain `post_id`.
* **Returns:** Nothing.
* **Error states:** Falls back to random ID if `data` is `nil` or `post_id` is missing.

### `ondeploy(inst, pt, deployer)`
* **Description:** Deploy logic for the item variant: spawns a new `dock_woodposts` instance at the target point, calls `place()` on it, and removes the deploy kit item.
* **Parameters:**  
  `inst` (entity) — the deployable item instance.  
  `pt` (vector3) — deployment position.  
  `deployer` (entity) — the deployer entity (not used directly).
* **Returns:** Nothing.
* **Error states:** Silently fails if `SpawnPrefab("dock_woodposts", ...)` returns `nil`.

## Events & listeners
- **Listens to:** None explicitly via `inst:ListenForEvent`.
- **Pushes:** None explicitly via `inst:PushEvent`.  
  *(The component relies on callback hooks from `workable` and `deployable` rather than event subscriptions.)*