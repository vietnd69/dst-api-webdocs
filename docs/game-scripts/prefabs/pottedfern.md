---
id: pottedfern
title: Pottedfern
description: A decorative cave plant that can be placed in the world, destroyed with a hammer to yield loot, and burns or haunts players upon interaction.
tags: [decoration, environment, destruction]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5e1299b5
system_scope: environment
---

# Pottedfern

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pottedfern` is a decorative prefab that appears as a potted fern in the caves. It is primarily used as an environmental furnishing and features destructible behavior: when hammered, it collapses, spawns an animation, and drops loot. It integrates with the `workable`, `lootdropper`, `burnable`, `propagator`, and `hauntable` systems. It supports save/load via custom `OnSave`/`OnLoad` hooks.

## Usage example
```lua
local inst = SpawnPrefab("pottedfern")
inst.Transform:SetPosition(vec3(x, y, z))
-- Optional: customize animation before placing
inst.animname = "f" .. tostring(math.random(10))
inst.AnimState:PlayAnimation(inst.animname)
```

## Dependencies & tags
**Components used:** `inspectable`, `workable`, `lootdropper`  
**Tags added:** `cavedweller`, `pottedplant`  
**Functions called from other files:** `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableWork`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `"f1"`–`"f10"` (random) | The animation state (e.g., `"f3"`) to play on initialization and during save/load. |

## Main functions
### `onsave(inst, data)`
* **Description:** Captures and stores the current animation name (`inst.animname`) into the save data so the fern resumes the same visual state when loaded.
* **Parameters:**  
  `inst` (Entity) — the potted fern entity.  
  `data` (table) — the save data table to modify.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores the animation state from save data. If a skin is active, overrides the animation to `"c"` (a generic fallback).
* **Parameters:**  
  `inst` (Entity) — the potted fern entity.  
  `data` (table) — the loaded save data.
* **Returns:** Nothing.

### `onhammered(inst)`
* **Description:** Handler called when the workable action (hammer) completes. Spawns a collapse effect, triggers loot drop via `lootdropper`, and removes the entity.
* **Parameters:** `inst` (Entity) — the potted fern entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (uses callbacks on components instead).
- **Pushes:** None explicitly.

### Notable external callbacks used:
- `inst.components.workable:SetOnFinishCallback(onhammered)` — triggers `onhammered` on work completion.
- `inst.components.lootdropper:DropLoot()` — called inside `onhammered` to drop loot at the entity’s position.