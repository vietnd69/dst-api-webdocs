---
id: wx78_heartveinspawner
title: Wx78 Heartveinspawner
description: Server-side prefab that periodically spawns shadow_heart_vein entities around WX-78 players using the shadow heart skill mechanic.
tags: [prefab, wx78, spawning, skill]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 68eacc18
system_scope: entity
---

# Wx78 Heartveinspawner

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_heartveinspawner.lua` registers a server-side only entity that manages periodic spawning of `shadow_heart_vein` prefabs for WX-78's shadow heart skill. The prefab attaches a `periodicspawner` component configured with WX-78-specific TUNING constants for spawn timing, density, and variance. On clients, the entity is immediately removed since spawning logic runs exclusively on the master simulation. When the spawner entity is removed, it cleans up all existing shadow heart veins in its vicinity via the `OnRemoveEntity` lifecycle hook.

## Usage example
```lua
-- Spawn the heartveinspawner (typically done by WX-78 skill system):
local inst = SpawnPrefab("wx78_heartveinspawner")
inst.Transform:SetPosition(10, 0, 10)

-- The spawner automatically begins spawning shadow_heart_vein entities
-- based on TUNING.SKILLS.WX78.SHADOWHEART_SPAWN_* constants
```

## Dependencies & tags
**Components used:**
- `periodicspawner` -- handles periodic spawning with density constraints and custom spawn point function

**Tags:**
- `CLASSIFIED` -- added in fn() to hide entity from normal entity queries

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefabs` | table | `{ "shadow_heart_vein" }` | Array of dependent prefab names that must be loaded with this entity. |
| `POSITION_CANT_TAGS` | constant (local) | `{ "INLIMBO", "NOBLOCK", "FX" }` | Tags that invalidate a spawn position if entities with these tags are present. |
| `IS_CLEAR_AREA_RADIUS` | constant (local) | `2` | Radius in world units for checking if spawn area is clear of blocking entities. |
| `VEINS_MUST_TAGS` | constant (local) | `{ "shadow_heart_vein" }` | Tags used to find existing veins when spawner is removed for cleanup. |
| `TUNING.SKILLS.WX78.SHADOWHEART_SPAWN_PERIOD` | constant | --- | Base period in seconds between spawn attempts. |
| `TUNING.SKILLS.WX78.SHADOWHEART_SPAWN_VARIANCE` | constant | --- | Random variance added to spawn period. |
| `TUNING.SKILLS.WX78.SHADOWHEART_SPAWN_DENSITY_RANGE` | constant | --- | Maximum radius around spawner for vein density checks. |
| `TUNING.SKILLS.WX78.SHADOWHEART_SPAWN_DENSITY_MAX` | constant | --- | Maximum number of veins allowed within density range. |

## Main functions

### `fn()`
* **Description:** Prefab constructor that creates the spawner entity. On clients, immediately schedules removal since this is server-only logic. On master, attaches Transform, hides the entity, adds CLASSIFIED tag, configures periodicspawner component with WX-78 shadow heart parameters, and sets OnRemoveEntity cleanup hook. Returns `inst` for the prefab framework.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — client branch guards against periodicspawner setup; master branch has no unguarded component access.

### `IsValidPosition(pos)` (local)
* **Description:** Validates whether a world position is suitable for spawning a shadow heart vein. Checks that no entities with blocking tags (INLIMBO, NOBLOCK, FX) exist within IS_CLEAR_AREA_RADIUS and confirms the position is surrounded by land via Map:IsSurroundedByLand.
* **Parameters:**
  - `pos` -- Vector3 position to validate
* **Returns:** `true` if position is valid for spawning, `false` otherwise
* **Error states:** None — pos:Get() is safe on valid Vector3; TheSim and TheWorld.Map are global singletons.

### `GetSpawnPoint(inst)` (local)
* **Description:** Finds a valid spawn point around the spawner entity. Makes up to 3 attempts to find a walkable offset at a random radius between 2 and SHADOWHEART_SPAWN_DENSITY_RANGE. Uses FindWalkableOffset with IsValidPosition as the validation callback. Returns nil if no valid position found after all attempts.
* **Parameters:**
  - `inst` -- spawner entity instance
* **Returns:** Vector3 spawn position or `nil` if no valid position found
* **Error states:** None — inst:GetPosition() is safe on entities with Transform component (attached in fn()).

### `OnRemoved(inst)` (local)
* **Description:** Cleanup callback fired when the spawner entity is removed. Finds all shadow_heart_vein entities within SHADOWHEART_SPAWN_DENSITY_RANGE and schedules them for deletion. Ensures orphaned veins are cleaned up when the spawner is destroyed.
* **Parameters:**
  - `inst` -- spawner entity instance being removed
* **Returns:** None
* **Error states:** None — ent:IsValid() guard protects against invalid entities in the results array.

## Events & listeners
None — the prefab does not register any event listeners via ListenForEvent, does not push events via PushEvent, and does not watch world state variables. The periodicspawner component handles its own internal spawning logic without exposing events to this prefab.