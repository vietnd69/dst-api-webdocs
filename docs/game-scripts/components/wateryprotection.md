---
id: wateryprotection
title: Wateryprotection
description: Manages area-of-effect environmental protection including fire extinguishing, temperature reduction, moisture application, and wither protection for entities.
tags: [environment, protection, weather]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 42a90a57
system_scope: entity
---

# Wateryprotection

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`WateryProtection` provides area-of-effect environmental protection mechanics for entities. It handles fire extinguishing, temperature reduction, moisture/wetness application, coldness addition, and wither protection duration. Commonly used on water-based entities, sprinklers, or weather-related prefabs that affect surrounding entities within a radius.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wateryprotection")
inst.components.wateryprotection.witherprotectiontime = 10
inst.components.wateryprotection.addwetness = 50
inst.components.wateryprotection.extinguish = true
inst.components.wateryprotection:SpreadProtection(inst, 8)
```

## Dependencies & tags
**External dependencies:**
- `TheSim:FindEntities` -- finds entities within radius for protection spread
- `TheWorld.components.farming_manager` -- applies soil moisture at point

**Components used:**
- `burnable` -- checks IsBurning, IsSmoldering; calls Extinguish to put out fires
- `witherable` -- calls Protect to apply wither protection duration
- `freezable` -- calls AddColdness to add coldness value
- `temperature` -- calls GetCurrent and SetTemperature to reduce temperature
- `moisture` -- calls GetWaterproofness and DoDelta to apply wetness
- `inventoryitem` -- calls AddMoisture for inventory items without moisture component
- `farming_manager` (world) -- calls AddSoilMoistureAtPoint for soil moisture

**Tags:**
- `FX`, `DECOR`, `INLIMBO`, `burnt` -- ignored when spreading protection (entities with these tags are excluded)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `witherprotectiontime` | number | `0` | Duration in seconds that wither protection is applied to entities. |
| `temperaturereduction` | number | `0` | Amount of temperature reduction applied to entities. |
| `addcoldness` | number | `0` | Coldness value added to freezable entities. |
| `addwetness` | number | `0` | Wetness/moisture amount applied to entities. |
| `extinguish` | boolean | `true` | Whether to extinguish fires on affected entities. |
| `extinguishheatpercent` | number | `0` | Heat percentage parameter passed to burnable Extinguish function. |
| `ignoretags` | table | `{ "FX", "DECOR", "INLIMBO", "burnt" }` | List of tags to exclude when finding entities for protection spread. |
| `protection_dist` | number | `nil` | Default protection spread distance (commented out in source, may be set externally). |
| `onspreadprotectionfn` | function | `nil` | Optional callback function called after spreading protection. |

## Main functions
### `AddIgnoreTag(tag)`
*   **Description:** Adds a tag to the ignore list so entities with this tag are excluded from protection spread.
*   **Parameters:** `tag` -- string tag name to add to ignore list.
*   **Returns:** None.
*   **Error states:** None.

### `ApplyProtectionToEntity(ent, noextinguish)`
*   **Description:** Applies all configured protection effects to a single entity including fire extinguishing, wither protection, coldness, temperature reduction, and wetness.
*   **Parameters:**
    - `ent` -- entity instance to apply protection to.
    - `noextinguish` -- boolean to skip fire extinguishing even if extinguish is enabled.
*   **Returns:** None.
*   **Error states:** Errors if `ent` is nil when accessing `ent.components` (no nil guard present before component access).

### `SpreadProtectionAtPoint(x, y, z, dist, noextinguish)`
*   **Description:** Spreads protection effects to all entities within radius at a world position. Also applies soil moisture if farming_manager exists and calls optional callback.
*   **Parameters:**
    - `x` -- number world X coordinate.
    - `y` -- number world Y coordinate.
    - `z` -- number world Z coordinate.
    - `dist` -- number radius distance (defaults to `protection_dist` or `4` if nil).
    - `noextinguish` -- boolean to skip fire extinguishing.
*   **Returns:** None.
*   **Error states:** None.

### `SpreadProtection(inst, dist, noextinguish)`
*   **Description:** Spreads protection effects from an entity's current world position. Retrieves position via Transform component and calls SpreadProtectionAtPoint.
*   **Parameters:**
    - `inst` -- entity instance to get position from.
    - `dist` -- number radius distance.
    - `noextinguish` -- boolean to skip fire extinguishing.
*   **Returns:** None.
*   **Error states:** Errors if `inst` is nil or lacks `Transform` component when calling `inst.Transform:GetWorldPosition()` (no nil guard present).

## Events & listeners
None identified.