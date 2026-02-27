---
id: wateryprotection
title: Wateryprotection
description: Applies protective effects—such as extinguishing fire, reducing withering, cooling, and adding wetness—to nearby entities within a specified radius.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: feaa5fa9
---

# Wateryprotection

## Overview
This component provides area-of-effect protective functionalities when activated. It is designed to apply environmental protections—including fire extinguishing, withering protection, cooling, and moisture application—to nearby entities and, optionally, the surrounding terrain (soil moisture). It operates by scanning nearby entities within a configurable radius, excluding certain tags, and applying configured effects based on its property values.

## Dependencies & Tags
**Required Components (for target entities):**  
- `burnable` (for extinguishing/fire protection)  
- `witherable` (for withering protection)  
- `freezable` (for coldness addition)  
- `temperature` (for temperature reduction)  
- `moisture` or `inventoryitem` (for wetness application, depending on context and `applywetnesstoitems`)  

**Ignored Tags (default):** `"FX"`, `"DECOR"`, `"INLIMBO"`, `"burnt"`  
Additional tags may be added via `AddIgnoreTag`.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `witherprotectiontime` | number | `0` | Duration (in seconds) to protect against withering if the target entity has a `witherable` component. |
| `temperaturereduction` | number | `0` | Amount of temperature (in degrees) to subtract from target entities with a `temperature` component. |
| `addcoldness` | number | `0` | Amount of coldness to add to targets with a `freezable` component. |
| `addwetness` | number | `0` | Amount of wetness to apply to targets (adjusted by waterproofness) or items if `applywetnesstoitems` is `true`. |
| `applywetnesstoitems` | boolean | `false` | If `true`, applies `addwetness` to entities with `inventoryitem` but *without* `moisture`. |
| `extinguish` | boolean | `true` | Whether to extinguish fire (burning/smoldering) on targets with `burnable`. |
| `extinguishheatpercent` | number | `0` | Percentage of max heat to retain after extinguishing (used only if `extinguish` is `true`). |
| `ignoretags` | table of strings | `{ "FX", "DECOR", "INLIMBO", "burnt" }` | List of tags that entities must *not* have to be affected. |

## Main Functions

### `AddIgnoreTag(tag)`
* **Description:** Adds a custom tag to the list of ignored entities, preventing entities with that tag from receiving protection effects.  
* **Parameters:**  
  - `tag` (string): The tag to add to `ignoretags`.

### `ApplyProtectionToEntity(ent, noextinguish)`
* **Description:** Applies all configured protective effects to a *single* entity. Effects include extinguishing fire, applying withering protection, reducing temperature/coldness, and adding wetness.  
* **Parameters:**  
  - `ent` (Entity): The target entity to affect.  
  - `noextinguish` (boolean, optional): If `true`, skips the extinguishing logic—even if `extinguish` is `true`.

### `SpreadProtectionAtPoint(x, y, z, dist, noextinguish)`
* **Description:** Finds and applies protection effects to all entities within a radius around the given world coordinates. Also optionally updates soil moisture and calls a custom callback (if set).  
* **Parameters:**  
  - `x`, `y`, `z` (numbers): World coordinates around which to search for entities.  
  - `dist` (number, optional): Radius to search; defaults to `self.protection_dist` or `4` if both are `nil`.  
  - `noextinguish` (boolean, optional): Passed to `ApplyProtectionToEntity` to skip extinguishing.

### `SpreadProtection(inst, dist, noextinguish)`
* **Description:** Convenience wrapper for `SpreadProtectionAtPoint` that uses the current position of the component’s owner (`self.inst`).  
* **Parameters:**  
  - `inst` (Entity): The owner instance (source of position).  
  - `dist` (number, optional): Search radius (see `SpreadProtectionAtPoint`).  
  - `noextinguish` (boolean, optional): Passed through to `SpreadProtectionAtPoint`.

## Events & Listeners
None identified.