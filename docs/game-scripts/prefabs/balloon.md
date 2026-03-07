---
id: balloon
title: Balloon
description: A floating, equippable cat toy that can be customized with different shapes and colors.
tags: [inventory, pet, toy]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a29b26ac
system_scope: entity
---

# Balloon

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `balloon` prefab is a floating, interactive cat toy that can be equipped, held, and customized. It supports dynamic shape selection (one of nine possible shapes), color variation, and rope styling. It integrates with the `equippable` component for hands-based usage and uses shared logic from `balloons_common.lua` for behavior (e.g., floating physics, pop effects, color assignment, and rope rendering). The prefab is primarily used as a companion item for cats like Wigfrid’s companions.

## Usage example
```lua
local inst = CreateEntity()
-- Typically created via Prefab("balloon", fn, assets, prefabs), not directly.
-- To equip it for testing:
inst:AddTag(" character ")
inst:AddComponent("equippable")
inst.components.equippable:Equip("HAND")
```

## Dependencies & tags
**Components used:** `equippable`, `inventoryitem`
**Tags:** Adds `nopunch`, `cattoyairborne`, `balloon`, `noepicmusic`. Does not manage or check tags beyond initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `balloon_num` | number | Random (1–9) | Index of the balloon shape (used in `balloon_shapes2` animations). |
| `colour_idx` | number | Assigned by `BALLOONS.SetColour()` | Index representing the balloon’s color variant. |
| `scrapbook_tex` | string | `"balloon"` | Texture name used for scrapbook rendering. |
| `balloon_build` | string | `"balloon_shapes2"` | Build name for balloon shape override in `AnimState`. |
| `scrapbook_overridedata` | table | Populated in `fn` | List of override definitions for scrapbook animation symbols. |

## Main functions
### `SetBalloonShape(inst, num)`
* **Description:** Updates the balloon’s visual shape by overriding the `swap_balloon` animation symbol and setting the inventory item’s image name for proper display when held.
* **Parameters:** `num` (number) – integer between `1` and `9` inclusive, specifying the shape variant.
* **Returns:** Nothing.
* **Error states:** If `num` is outside `1–9`, the underlying `AnimState:OverrideSymbol` call may fail silently or render a default symbol.

### `onsave(inst, data)`
* **Description:** Serializes the balloon’s current state into the `data` table for world save compatibility.
* **Parameters:** `data` (table) – the save data table to populate.
* **Returns:** Nothing.

### `onload(inst, data)`
* **Description:** Restores the balloon’s shape and color from saved data upon world load.
* **Parameters:** `inst` (entity), `data` (table | `nil`) – the loaded save data.
* **Returns:** Nothing.
* **Error states:** If `data` is `nil` or fields are missing, no action is taken; safe for partial or missing data.

## Events & listeners
- **Listens to:** None (does not register `inst:ListenForEvent` calls).
- **Pushes:** None (does not fire `inst:PushEvent` calls).  
  *Note:* The `inventoryitem` component’s `ChangeImageName` function internally pushes `imagechange`, but the balloon prefab itself does not push custom events.