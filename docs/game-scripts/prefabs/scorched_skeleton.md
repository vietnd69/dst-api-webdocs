---
id: scorched_skeleton
title: Scorched Skeleton
description: A breakable environmental prop that yields boneshards, ash, and collapse FX when hammered by players.
tags: [environment, breakable, loot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0c62526
system_scope: environment
---

# Scorched Skeleton

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `scorched_skeleton` prefab is a static, breakable environmental object that appears in specific areas (e.g., the Ruins). It has multiple idle animation variants and responds to the `HAMMER` action. When hammered to completion, it drops a randomized set of loot (boneshards and ash) and spawns a collapse FX, then destroys itself. It supports game save/load via custom `OnSave`/`OnLoad` handlers and is conditionally hidden if the player lacks skeleton-related content.

## Usage example
```lua
-- Typically created automatically via worldgen; manual instantiation example:
local inst = Prefab("scorched_skeleton", fn)
-- Note: The prefab is instantiated by the engine using its `fn` constructor.
-- Modders should not manually call `fn()`; instead, override worldgen or extend prefabs.
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `transform`, `animstate`, `network`, `soundemitter`  
**Tags:** None explicitly added/removed; relies on engine-provided tags (e.g., `buildable`, `structure` via physics setup).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animnum` | number | Random from `[1,2,3,4,5,6]` | Selected animation variant used for `idleX` animation playback. |

## Main functions
This prefab does not define custom public methods beyond event callbacks. Core behavior is implemented via callbacks passed to components.

### `onhammered(inst)`
* **Description:** Callback triggered when the `workable` component finishes hammering. Drops loot, spawns a collapse FX, and removes the entity.
* **Parameters:** `inst` (Entity) — the scorched skeleton instance.
* **Returns:** Nothing.
* **Error states:** N/A.

### `onsave(inst, data)`
* **Description:** Callback used during save to persist the current animation variant.
* **Parameters:** `inst` (Entity), `data` (table) — save data table to populate.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Callback used during load to restore the animation variant and resume the correct animation.
* **Parameters:** `inst` (Entity), `data` (table or `nil`) — loaded save data.
* **Returns:** Nothing.
* **Error states:** Early exit if `data` or `data.anim` is missing.

## Events & listeners
- **Listens to:** None (custom event callbacks are attached directly as `inst.OnSave`/`inst.OnLoad`, not via `ListenForEvent`).
- **Pushes:** `entity_droploot` — automatically triggered by `lootdropper:DropLoot()`.