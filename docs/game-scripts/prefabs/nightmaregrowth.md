---
id: nightmaregrowth
title: Nightmaregrowth
description: A spawner-like entity that triggers the growth of a nightmare growth prefab, which emits strong negative sanity aura and can destroy nearby structures.
tags: [sanity, environment, structure, combat, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: db07fd65
system_scope: environment
---

# Nightmaregrowth

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `nightmaregrowth` prefab represents a corrupted, growing entity found in the Grotto. It emits a powerful negative sanity aura and initiates structural destruction upon growth. The prefab is implemented as a multi-prefab system including a main entity (`nightmaregrowth`), a visual crack effect (`nightmaregrowth_crack`), and spawner variants. It integrates with the `inspectable`, `sanityaura`, and `workable` components to provide narrative interaction, sanity effects, and destruction behavior.

## Usage example
```lua
-- Create a nightmare growth at world position
local growth = SpawnPrefab("nightmaregrowth")
growth.Transform:SetPosition(x, y, z)

-- Grow the structure manually (triggers destruction and visual effects)
if growth.growfn then
    growth:growfn()
end
```

## Dependencies & tags
**Components used:** `sanityaura`, `inspectable`
**Tags:** Adds `ancient_text` to the main entity; `FX`, `NOCLICK`, `DECOR` to the crack effect.

## Properties
No public properties are exposed by the main `nightmaregrowth` entity beyond its components.

## Main functions
### `grow(inst)`
* **Description:** Triggers the growth animation, spawns the `collapse_small` FX prefab, destroys nearby workable structures within radius 4, plays sound effects, and sets up crack animations.
* **Parameters:** `inst` (Entity) — the nightmaregrowth instance.
* **Returns:** Nothing.
* **Error states:** None. Only affects entities within `DESTROY_RADIUS` (4 units) that are valid, possess `workable`, and are `CanBeWorked`.

### `SpawnCrack(inst)`
* **Description:** Spawns the `nightmaregrowth_crack` prefab at the current position, sets its rotation if available, and destroys any valid, workable structures in the immediate area using `workable:Destroy`.
* **Parameters:** `inst` (Entity) — the nightmaregrowth instance.
* **Returns:** Nothing.

### `rune_getdescription(inst, viewer)`
* **Description:** Returns a narrative text line if the viewer has the `ancient_reader` tag in any equipped slot; advances story progress first.
* **Parameters:** 
  * `inst` (Entity) — the nightmaregrowth instance.
  * `viewer` (Entity) — the player inspecting the entity.
* **Returns:** String (from `STRINGS.NIGHTMARE_OVERGROWTH.LINE_n`) or `nil` if conditions not met.

### `rune_getstatus(inst)`
* **Description:** Advances story progress counter without returning a status string.
* **Parameters:** `inst` (Entity) — the nightmaregrowth instance.
* **Returns:** `nil`.

## Events & listeners
- **Listens to:** `onremove` — triggers `OnRemove` to clean up the crack effect.
- **Pushes:** No events are fired by this prefab’s code.

## Save/Load Integration
The main entity supports serialization via `OnSave` and `OnLoad` hooks:
- Saves `storyprogress` (narrative line index) and `crack_rotation`.
- Loads saved data and restores state; ensures `_storyprogress` global does not regress.

## Spawner Variants
Three prefabs manage spawning behavior:
- `nightmaregrowth_spawner`: Schedules `nightmaregrowth` creation after a random delay (2.5–5.5 seconds), then removes itself. Supports `OnLoad` to spawn immediately if loaded mid-delay.
- `retrofitted_grotterwar_spawnpoint` and `retrofitted_grotterwar_homepoint`: Register server-side events for dungeon generation systems; do not spawn entities directly.

## crackfx (`nightmaregrowth_crack`)
A non-networked, non-persistent FX entity with:
- Layer `LAYER_BACKGROUND`, orientation `OnGround`, sort order 3.
- Tags: `FX`, `NOCLICK`, `DECOR`.
- Plays `crack_idle` animation (non-looping initially, but transitioned to).
- Rotation set randomly at spawn; rotation saved/restored alongside main entity.