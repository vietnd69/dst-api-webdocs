---
id: mushtree_spores
title: Mushtree Spores
description: Spore prefabs that spawn from mushtrees, persist briefly, and decay based on crowding and time.
tags: [environment, decay, inventory, lighting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7ae0f8d1
system_scope: environment
---

# Mushtree Spores

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mushtree_spores.lua` defines three spore prefabs (green/small, red/medium, blue/tall) that spawn from mushtrees and float in the world. These prefabs serve as collectible resources with limited lifespans. Their persistence is governed by:
- Crowding logic (excess nearby spores cause immediate spoilage)
- Perishable timer (decays over time)
- Pickup behavior (extends shelf life while in inventory)
- Burn/ignite mechanics (ignite when exposed to heat)

They rely heavily on the `perishable`, `workable`, `stackable`, `inventoryitem`, `propagator`, and `burnable` components.

## Usage example
```lua
local spore_blue = SpawnPrefab("mushroom_spore_blue")
if spore_blue ~= nil then
    spore_blue.Transform:SetPosition(x, y, z)
    spore_blue.Light:Enable(true)
end
```

## Dependencies & tags
**Components used:** `locomotor`, `inventoryitem`, `workable`, `perishable`, `stackable`, `burnable`, `propagator`, `inspectable`, `knownlocations`, `tradable`, `hauntable`
**Tags:** Adds `show_spoilage`, `spore`; removes `spore` on death.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `crowdingtask` | Task | `nil` | Reference to recurring task that checks spore density; cancels on pickup or renews on drop. |
| `persists` | boolean | `false` (set on death) | Determines whether the entity is saved to world save. |
| `scrapbook_anim` | string | `"flight_cycle"` | Animation used in scrapbook preview. |
| `scrapbook_animoffsety` | number | `65` | Vertical offset for scrapbook rendering. |
| `scrapbook_animpercent` | number | `0.36` | Animation time offset for scrapbook preview. |

## Main functions
### `depleted(inst)`
* **Description:** Handles spore death — disables workability, pushes `"death"` event, removes `"spore"` tag for crowding detection, marks as non-persistent, and schedules removal after 3 seconds if still present.
* **Parameters:** `inst` (Entity) — the spore instance.
* **Returns:** Nothing.
* **Error states:** Early-exits if entity is in limbo (removed entirely).

### `checkforcrowding(inst)`
* **Description:** Checks for nearby spores within `TUNING.MUSHSPORE_MAX_DENSITY_RAD`. If count exceeds `TUNING.MUSHSPORE_MAX_DENSITY`, spoils the spore instantly (`SetPercent(0)`). Otherwise, reschedules itself.
* **Parameters:** `inst` (Entity) — the spore instance.
* **Returns:** Nothing.
* **Error states:** None identified.

### `onpickup(inst)`
* **Description:** Increases spore shelf life when held by setting a local perish multiplier (`TUNING.SEG_TIME * 3 / TUNING.PERISH_SLOW`) and cancels the crowding check task.
* **Parameters:** `inst` (Entity) — the spore instance.
* **Returns:** Nothing.

### `ondropped(inst)`
* **Description:** Restores default perish rate (`1`), sets remaining work to `1`, splits excess stack items (teleporting each to current position), and re-enables crowding check if not already active.
* **Parameters:** `inst` (Entity) — the spore instance.
* **Returns:** Nothing.

### `onload(inst)`
* **Description:** Restores lighting and dynamic shadow visibility on load (the stategraph disables them during save/load).
* **Parameters:** `inst` (Entity) — the spore instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onputininventory` — triggers `onpickup`.
- **Listens to:** `ondropped` — triggers `ondropped`.
- **Pushes:** `death` — fired when spore spoils or is destroyed.
- **Pushes:** `perishchange` — fired internally by `perishable` when percent changes.
