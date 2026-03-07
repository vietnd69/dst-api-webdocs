---
id: book_web_ground
title: Book Web Ground
description: Applies a ground speed penalty to non-follower entities within a radius while spawning a visual FX effect on the floor.
tags: [locomotion, environment, spell]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 27b26f4b
system_scope: locomotion
---

# Book Web Ground

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`book_web_ground` is a client-side entity prefab representing a visual FX effect placed on the ground that applies a temporary ground speed penalty to nearby entities. It is used as part of Wickerbottom's web spell in DST. The prefab creates a static groundFX entity with a 360-degree rotation, plays an animation sequence, and periodically scans the area for affected entities within `TUNING.BOOK_WEB_GROUND_RADIUS`. Entities that meet specific tagging criteria have their `locomotor` component modified via `PushTempGroundSpeedMultiplier`, unless they are followers of a player.

The prefab does not own a `component` class per se — it is a *prefab* that instantiates entities with `ANIMSTATE`, `SOUNDEMITTER`, `TRANSFORM`, and `NETWORK` services, and is typically spawned by the `book_web` spell. It is not persisted in the world (`inst.persists = false`).

## Usage example
The prefab is instantiated internally by the game and not meant to be manually constructed. A typical usage in spell logic would be:
```lua
inst:SpawnPrefab("book_web_ground")
```
where `inst` is the spell-casting entity (e.g., Wickerbottom). The entity is configured with its own internal logic (`OnInit`, `OnUpdate`, `Despawn`) and does not expose external APIs beyond internal method calls.

## Dependencies & tags
**Components used:**  
- `follower` (via `v.components.follower:GetLeader()`)  
- `locomotor` (via `v.components.locomotor:PushTempGroundSpeedMultiplier(...)`)  

**Tags added to entity:**  
- `"NOCLICK"` — prevents the entity from being clickable.  

**Tags used for filtering entities in radius scan:**  
- `SLOWDOWN_MUST_TAGS = { "locomotor" }`  
- `SLOWDOWN_CANT_TAGS = { "player", "flying", "playerghost", "INLIMBO" }`  
- Entities with a `follower` component where the leader has the `"player"` tag are *excluded* from slowdown, even if they meet the above criteria.

## Properties
No public properties are defined in this prefab's constructor.

## Main functions
### `OnUpdate(inst, x, y, z)`
* **Description:** Scans for entities within `TUNING.BOOK_WEB_GROUND_RADIUS` of the given world position and applies ground speed penalty to qualifying entities via their `locomotor` component. This function is called periodically and once at spawn.
* **Parameters:**  
  - `inst` (Entity) — the book_web_ground instance.  
  - `x`, `y`, `z` (numbers) — world coordinates to center the scan.  
* **Returns:** Nothing.
* **Error states:** No explicit error handling — relies on safe component existence checks (`v.components.locomotor ~= nil`, `v.components.follower ~= nil`).

### `OnInit(inst)`
* **Description:** Initializes the entity upon spawn: cancels any pre-existing periodic task, sets up a new `DoPeriodicTask` loop calling `OnUpdate`, triggers the initial `OnUpdate`, and plays the web-spell sound.
* **Parameters:**  
  - `inst` (Entity) — the book_web_ground instance.  
* **Returns:** Nothing.

### `Despawn(inst)`
* **Description:** Handles visual cleanup when the entity expires. Plays the `"despawn"` animation, listens for `"animover"` to automatically remove the entity.
* **Parameters:**  
  - `inst` (Entity) — the book_web_ground instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"animover"` — in `Despawn`, triggers `inst.Remove()` to clean up the entity after animation completes.  
- **Pushes:** None.