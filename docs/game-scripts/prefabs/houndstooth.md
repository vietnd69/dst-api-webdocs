---
id: houndstooth
title: Houndstooth
description: A small, reusable projectile item used as ammunition for blowpipes, supporting stacking, floating, and self-stacking.
tags: [ammo, inventory, floating, stacking]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2b064b0f
system_scope: inventory
---

# Houndstooth

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `houndstooth` prefab is a lightweight projectile item used as ammunition for the blowpipe. It is implemented as a standard entity with inventory capabilities, floating behavior for water traversal, and support for automatic stacking via the `selfstacker` component. It integrates with several systems: `stackable` (for capacity limits), `inventoryitem` (for storage/usage), `inspectable` (for UI inspection), `reloaditem` (as part of ranged ammunition workflows), and `snowmandecor` (presumably for decorative or event-related interactions).

## Usage example
```lua
local inst = Prefab("houndstooth", fn, assets)
-- A typical usage in prefabs is to return the constructed instance directly.
-- As a prefab, it is instantiated via TheSim:LoadPrefab("houndstooth").
local ammo = TheSim:LoadPrefab("houndstooth")
ammo.components.inventoryitem:PushToInventory()
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `reloaditem`, `selfstacker`, `snowmandecor`, `animstate`, `transform`, `soundemitter`, `network`
**Tags:** Adds `blowpipeammo`, `reloaditem_ammo`, `selfstacker`

## Properties
No public properties. The `stackable` component's `maxsize` property is set directly in the constructor (`inst.components.stackable.maxsize = TUNING.STACK_SIZE_SMALLITEM`), but this is not a public property of `houndstooth.lua` itself.

## Main functions
This file defines only a single top-level function:

### `fn()`
* **Description:** Constructor function that creates and configures the `houndstooth` entity instance. Called during prefab instantiation.
* **Parameters:** None.
* **Returns:** `inst` (Entity) — the fully initialized entity instance.
* **Error states:** None documented; returns `nil` on client if `TheWorld.ismastersim` is false before returning, otherwise returns a fully populated entity.

## Events & listeners
- **Listens to:**
  - `floater_startfloating` — plays the `"float"` animation when the entity begins floating in water.
  - `floater_stopfloating` — resumes the `"idle"` animation when floating ends.

- **Pushes:** None. This prefab does not define logic to push events.
