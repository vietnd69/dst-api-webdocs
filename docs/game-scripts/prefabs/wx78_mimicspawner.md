---
id: wx78_mimicspawner
title: Wx78 Mimicspawner
description: Server-only invisible spawner entity that periodically generates Item Mimic entities for WX-78's Mimic Heart skill, with density control and cleanup on removal.
tags: [prefab, wx78, spawner, skill]
sidebar_position: 10
last_updated: 2026-05-01
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: e1d05e5c
system_scope: entity
---

# Wx78 Mimicspawner

> Based on game build **722832** | Last updated: 2026-05-01

## Overview
`wx78_mimicspawner.lua` registers a server-only invisible spawner entity for WX-78's Mimic Heart skill system. The prefab uses the `periodicspawner` component to generate `itemmimic_revealed` entities at configurable intervals within a density-controlled range. When the spawner is removed, it cleans up all nearby mimics to prevent orphaned entities. This prefab is not meant to run on clients — it removes itself immediately if instantiated on a non-master simulation.

## Usage example
```lua
-- Spawn the mimicspawner (typically done via WX-78 skill activation):
local inst = SpawnPrefab("wx78_mimicspawner")
inst.Transform:SetPosition(player.Transform:GetWorldPosition())

-- The spawner automatically starts spawning via periodicspawner component.
-- Note: This spawner is invisible (CLASSIFIED tag) and has no assets.
-- The dependent prefab 'itemmimic_revealed' must be loaded separately if needed.
```

## Dependencies & tags
**Components used:**
- `periodicspawner` -- controls periodic entity spawning with density filtering
- `knownlocations` -- accessed on spawned mimics to remember leash position
- `health` -- accessed on nearby mimics during cleanup to force death
- `itemmimic` -- checked via MimicDensityFilter to count existing mimics

**Tags:**
- `CLASSIFIED` -- added to spawner entity; hides it from most entity queries
- `itemmimic_revealed` -- used in MIMIC_MUST_TAGS to find spawned mimics during cleanup

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prefabs` | table | `{"itemmimic_revealed"}` | Array of dependent prefab names that must be loaded with this spawner. |
| `MIMIC_MUST_TAGS` | table | `{"itemmimic_revealed"}` | Tags used to find existing mimics during density checks and cleanup. |
| `TUNING.SKILLS.WX78.MIMICHEART_SPAWN_PERIOD` | constant | `---` | Base spawn interval in seconds for the periodicspawner component. |
| `TUNING.SKILLS.WX78.MIMICHEART_SPAWN_VARIANCE` | constant | `---` | Random variance added to spawn period for natural timing distribution. |
| `TUNING.SKILLS.WX78.MIMICHEART_SPAWN_DENSITY_RANGE` | constant | `---` | Search radius used for density checks to prevent overcrowding. |
| `TUNING.SKILLS.WX78.MIMICHEART_SPAWN_DENSITY_MAX` | constant | `---` | Maximum number of mimics allowed within the density range. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that builds the invisible spawner entity. On client simulations, schedules immediate self-removal. On master, attaches the `periodicspawner` component configured with WX-78 Mimic Heart tuning values, starts spawning, and registers the `OnRemoveEntity` cleanup callback.
* **Parameters:** None
* **Returns:** entity instance (`inst`)
* **Error states:** None — client branch safely removes entity; master branch guards all component access.

### `MimicDensityFilter(inst, ent)` (local)
* **Description:** Density filter callback for the `periodicspawner` component. Returns `true` if the entity has an `itemmimic` component, counting it toward the density limit.
* **Parameters:**
  - `inst` -- the spawner entity (unused in filter logic)
  - `ent` -- candidate entity to check for density counting
* **Returns:** `true` if `ent` has `itemmimic` component, `false` otherwise
* **Error states:** None — safely checks for component existence via `~= nil` pattern.

### `MimicSpawn(inst, ent)` (local)
* **Description:** Spawn callback fired by `periodicspawner` when a new mimic is created. Disables loot dropping on the mimic, records the spawner's position as a "leash" location in the mimic's `knownlocations` component, and pushes a "jump" event to trigger mimic animation/behavior.
* **Parameters:**
  - `inst` -- the spawner entity (source of leash position)
  - `ent` -- the newly spawned mimic entity
* **Returns:** None
* **Error states:** None — guards `knownlocations` component access with nil check before calling `RememberLocation`.

### `OnRemoved(inst)` (local)
* **Description:** Cleanup callback registered as `OnRemoveEntity`. Finds all entities with the `itemmimic_revealed` tag within the spawn density range and kills any that have `GetNoLoot()` set to `true` (indicating they were spawned by this spawner). Prevents orphaned mimics when the spawner is destroyed or WX-78 skill expires.
* **Parameters:** `inst` -- the spawner entity being removed
* **Returns:** None
* **Error states:** Errors if `inst.Transform` is nil (entity must have transform component for position query). Source assumes transform is always present from `fn()` construction. Errors if any found entity lacks `health` component (`ent.components.health:Kill()` has no nil guard).

## Events & listeners
**Listens to:**
- `onremove` (via `OnRemoveEntity` hook) -- triggers `OnRemoved` cleanup when spawner entity is destroyed

**Pushes:**
- `jump` -- pushed to spawned mimic entities via `MimicSpawn`; triggers mimic activation animation/behavior

**World state watchers:**
**None.**