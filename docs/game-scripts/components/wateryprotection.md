---
id: wateryprotection
title: Wateryprotection
description: Applies protective effects (withering, cooling, extinguishing, and wetting) to entities within a radius, typically used for environmental interactions like rain or water-based abilities.
tags: [environment, protection, weather]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: feaa5fa9
system_scope: environment
---

# Wateryprotection

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wateryprotection` provides area-based protection and mitigation against environmental hazards such as fire, overheat, freezing, and desiccation. It is typically added to entities (e.g., characters, furniture, or consumables) that need to generate a protective field — for instance, a water source extinguishing nearby fires or reducing ambient temperature. The component interacts closely with `burnable`, `freezable`, `temperature`, `moisture`, `witherable`, and `farming_manager`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wateryprotection")

inst.components.wateryprotection.witherprotectiontime = 5
inst.components.wateryprotection.temperaturereduction = 15
inst.components.wateryprotection.addcoldness = 5
inst.components.wateryprotection.addwetness = 0.3
inst.components.wateryprotection.extinguish = true
inst.components.wateryprotection.applywetnesstoitems = true

inst.components.wateryprotection:SpreadProtection(inst, 6)
```

## Dependencies & tags
**Components used:**  
`burnable`, `witherable`, `freezable`, `temperature`, `moisture`, `inventoryitem`, `farming_manager`  
**Tags:** Adds `"FX"`, `"DECOR"`, `"INLIMBO"`, `"burnt"` to internal `ignoretags` list (excluded from protection application).  
**Custom ignore tags:** Can be added via `AddIgnoreTag(tag)`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `witherprotectiontime` | number | `0` | Duration (in seconds) to protect `witherable` entities from withering. |
| `temperaturereduction` | number | `0` | Amount to *subtract* from the target's current temperature (cooling effect). |
| `addcoldness` | number | `0` | Coldness value passed to `Freezable:AddColdness()` for `freezable` entities. |
| `addwetness` | number | `0` | Net moisture added to `moisture` or `inventoryitem` components (scaled by waterproofness). |
| `applywetnesstoitems` | boolean | `false` | If `true`, applies wetness to items in inventory even if they lack a `moisture` component. |
| `extinguish` | boolean | `true` | Whether fire and smolder states are removed from `burnable` entities. |
| `extinguishheatpercent` | number | `0` | Heat percentage used during extinguish — passed to `Burnable:Extinguish()`. |
| `ignoretags` | table of strings | `{ "FX", "DECOR", "INLIMBO", "burnt" }` | Tags that cause entities to be *skipped* during protection spreading. |

## Main functions
### `AddIgnoreTag(tag)`
* **Description:** Appends a tag to the list of entity tags to ignore during protection spreading.
* **Parameters:** `tag` (string) — the tag to add.
* **Returns:** Nothing.

### `ApplyProtectionToEntity(ent, noextinguish)`
* **Description:** Applies all configured protections to a *single* entity. Skips components that are not present on the entity.
* **Parameters:**  
  - `ent` (Entity) — the target entity.  
  - `noextinguish` (boolean, optional) — if `true`, skips fire extinguishing regardless of `extinguish` setting.
* **Returns:** Nothing.
* **Error states:** Silent no-op if entity lacks required components.

### `SpreadProtectionAtPoint(x, y, z, dist, noextinguish)`
* **Description:** Finds and protects all entities within a spherical radius (`dist`) around a point. Also spreads moisture into soil (via `farming_manager`) if `addwetness > 0`. Fires `onspreadprotectionfn`, if set.
* **Parameters:**  
  - `x`, `y`, `z` (numbers) — world coordinates.  
  - `dist` (number, optional) — search radius. Falls back to `self.protection_dist` or defaults to `4`.  
  - `noextinguish` (boolean, optional) — see `ApplyProtectionToEntity`.
* **Returns:** Nothing.

### `SpreadProtection(inst, dist, noextinguish)`
* **Description:** Convenience wrapper around `SpreadProtectionAtPoint`. Uses `inst`'s current world position as the origin.
* **Parameters:**  
  - `inst` (Entity) — the source entity whose position is used.  
  - `dist` (number, optional) — search radius.  
  - `noextinguish` (boolean, optional) — see `ApplyProtectionToEntity`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `ListenForEvent` calls).
- **Pushes:** None (no `PushEvent` calls).
