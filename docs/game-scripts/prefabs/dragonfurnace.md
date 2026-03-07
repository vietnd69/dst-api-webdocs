---
id: dragonfurnace
title: Dragonfurnace
description: Manages the furnace's cooking, incineration, and hammering mechanics, including state transitions, sound handling, and loot generation.
tags: [cooking, destruction, loot, sound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 934db840
system_scope: crafting
---

# Dragonfurnace

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dragonfurnace` prefab implements a high-heat cooking and destruction device used in DST's dragonfly-related content. It functions as both a *cooker* and *incinerator*, integrating with `container`, `workable`, `inspectable`, `lootdropper`, and `heater` components. The entity handles construction (via `onbuilt`), hammering (via `workable`), and incineration (via `incinerator`) with associated animation, sound, and loot logic.

## Usage example
```lua
local inst = SpawnPrefab("dragonflyfurnace")
inst.Transform:SetPosition(player.Transform:GetWorldPosition())
inst.components.container.canbeopened = true
inst.components.heater.heat = 115
inst.components.lootdropper:DropLoot(inst:GetPosition())
```

## Dependencies & tags
**Components used:** `workable`, `container`, `incinerator`, `cooker`, `lootdropper`, `inspectable`, `heater`, `light`, `animstate`, `mini map entity`, `soundemitter`, `transform`, `network`, `hauntable`

**Tags added:** `structure`, `wildfireprotected`, `cooker`, `HASHEATER`

**Tags checked:** `irreplaceable`, `burnt`, `burnable`, `structure`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"hi"` | Animation name shown in the scrapbook for this entity. |
| `_task1`, `_task2` | function | `nil` | Internal task handles for timing animations/sounds during construction. |
| `OnSave` | function | `onsavesalad` | Save callback used when persisting entity state. |
| `OnLoad` | function | `onload` | Load callback that restores special state (e.g., "salad furnace" mode). |
| `OnEntitySleep`, `OnEntityWake` | function | `OnEntitySleep`, `OnEntityWake` | Handlers for entity sleep/wake state changes (controls looping sound). |

## Main functions
### `onworkfinished(inst)`
* **Description:** Called when the entity finishes hammering. Drops all loot, spawns a collapse FX, and removes the entity.
* **Parameters:** `inst` (Entity) — The dragonfurnace instance.
* **Returns:** Nothing.
* **Error states:** None.

### `onworked(inst)`
* **Description:** Called during hammering to interrupt cooking and transition to broken animation. Drops container contents, closes container, and plays incineration sound.
* **Parameters:** `inst` (Entity) — The dragonfurnace instance.
* **Returns:** Nothing.
* **Error states:** Stops any pending construction tasks (`_task1`, `_task2`).

### `OnIncinerateItems(inst)`
* **Description:** Plays incineration animation, kills loop sound, closes container, blocks further opening via `canbeopened = false`, and reopens it after animation completes.
* **Parameters:** `inst` (Entity) — The dragonfurnace instance.
* **Returns:** Nothing.
* **Error states:** None.

### `ShouldIncinerateItem(inst, item)`
* **Description:** Determines whether a given item should be incinerated. Blocks incineration for irreplaceable items, full containers, and fruitcake (`winter_food4`).
* **Parameters:** `inst` (Entity) — The dragonfurnace instance; `item` (Entity) — The item being considered.
* **Returns:** `true` (incinerate), `false` (preserve item).
* **Error states:** Returns `false` for `winter_food4` and items tagged `irreplaceable`.

### `onbuilt(inst)`
* **Description:** Triggered on construction. Plays animation sequence, stops existing loops, and schedules `BuiltTimeLine1` and `BuiltTimeLine2` for delayed fueling sounds.
* **Parameters:** `inst` (Entity) — The dragonfurnace instance.
* **Returns:** Nothing.
* **Error states:** Cancels pending tasks if called during rebuild.

### `makesalad(inst)`
* **Description:** Transforms the furnace into "Salad Furnace" mode (special variant). Sets green tint, adds `named` component, and overrides `OnSave`.
* **Parameters:** `inst` (Entity) — The furnace instance.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** `onbuilt` — Fires `onbuilt` to handle construction-time behavior.
- **Pushes:** None directly (relies on component event propagation: `workable`, `container`, `incinerator`, `inspectable`).
- **Internal listeners:** `OnEntitySleep`/`OnEntityWake` — Handle sound state for entity sleeping (handled outside event system via direct callback attach).
- **Custom hooks:** `OnSave`, `OnLoad` — Used for save/load persistence (custom callbacks attached to `inst`).