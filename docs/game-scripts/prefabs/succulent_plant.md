---
id: succulent_plant
title: Succulent Plant
description: Defines the prefabs for the succulent plant (growable flora) and its picked form (consumable inventory item) with drying and perishable behaviors.
tags: [environment, crafting, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1814b9c7
system_scope: environment
---

# Succulent Plant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `succulent_plant` prefab defines two related entities: the in-world **succulent plant** (a static flora item) and the **succulent_picked** item (a stackable inventory item derived from harvesting the plant). The picked variant supports multiple lifecycle behaviors: it is edible, perishable, dryable (via a meat rack), flammable, and lightweight. The plant variant provides pickable functionality with immediate removal upon harvesting.

## Usage example
```lua
-- Creating a succulent plant instance in the world
local plant = SpawnPrefab("succulent_plant")
plant.Transform:SetPosition(x, y, z)
plant.plantid = 3  -- Optional: set variant (1–5)

-- Picking it yields succulent_picked, which is automatically added to inventory
plant.components.pickable:Picked()
```

## Dependencies & tags
**Components used:** `inspectable`, `pickable`, `stackable`, `tradable`, `fuel`, `inventoryitem`, `edible`, `perishable`, `dryable`
**Tags:** Adds `succulent` (to plant), `cattoy`, `dryable` (to picked item)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plantid` | number | `nil` (default: random `1`–`5`) | Visual variant identifier for the plant; controls which symbology (`Symbol_1`, `Symbol_2`, etc.) is used for animation. Stored in save data. |
| `animstate.bank` | string | `"succulent"` or `"succulent_picked"` | Animation bank used for the entity. |
| `animstate.build` | string | `"succulent"` or `"succulent_picked"` | Base asset build used for animation. |
| `animstate.playanimation` | string | `"idle"` | Initial animation played on spawn. |

## Main functions
### `SetupPlant(inst, plantid)`
*   **Description:** Configures visual variant of the plant based on `plantid`. Removes override symbol for variant 1; sets override for variants 2–5.
*   **Parameters:** `inst` (Entity), `plantid` (number, optional) — if omitted or `nil`, defaults to a random integer in `1`–`5`.
*   **Returns:** Nothing.
*   **Error states:** No side effects if `plantid == 1`; no errors if `inst.AnimState` is missing (should not occur in normal usage).

## Events & listeners
- **Listens to:** None explicitly in this file (save/load callbacks assigned to `inst.OnSave` / `inst.OnLoad`).
- **Pushes:** None — entities created here do not emit custom events; rely on standard `pickable`, `perishable`, etc., event systems via components.