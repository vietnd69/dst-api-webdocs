---
id: winona_spotlight
title: Winona Spotlight
description: Manages the winona spotlight's power behavior, target tracking, heat support, and lighting system.
tags: [power, lighting, targeting, heat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c4eff72b
system_scope: environment
---

# Winona Spotlight

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winona_spotlight` is a complex prefab component for Winona's spotlight structure in Don't Starve Together. It handles power management via engineering batteries, dynamic light positioning, automatic player targeting, heat output control (seasonally affected), and skill tree upgrades. The spotlight tracks nearby players within configurable ranges and rotates/tilts its beam toward the closest eligible target. It uses client-server synchronization for lighting parameters and interacts with circuit, power load, heater, workable, and burnable systems.

## Usage example
```lua
local spotlight = SpawnPrefab("winona_spotlight")
spotlight:AddBatteryPower(10) -- Power for 10 seconds
spotlight.components.circuitnode:ConnectTo("engineeringbattery")
```

## Dependencies & tags
**Components used:** `burnable`, `circuitnode`, `colouradder`, `deployable`, `deployhelper`, `heater`, `inspectable`, `lootdropper`, `placer`, `portablestructure`, `powerload`, `skilltreeupdater`, `updatelooper`, `workable`, `health`, `hauntable`
**Tags added:** `engineering`, `engineeringbatterypowered`, `spotlight`, `structure`, `FX`, `NOCLICK`, `CLASSIFIED`, `placer`, `portableitem`
**Tags checked:** `burnt`, `burning`, `playerghost`, `handyperson`, `debris`, `decal`, `decor`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RADIUS` | number | `TUNING.WINONA_SPOTLIGHT_RADIUS` | Light radius (affected by skill upgrades). |
| `MIN_RANGE` | number | `TUNING.WINONA_SPOTLIGHT_MIN_RANGE` | Minimum beam distance from the spotlight. |
| `MAX_RANGE` | number | `TUNING.WINONA_SPOTLIGHT_MAX_RANGE` | Maximum beam distance from the spotlight. |
| `_heated` | net_bool | `false` | Whether the spotlight is set to produce heat. |
| `_ranged` | net_bool | `false` | Whether the spotlight uses extended ranges (skill upgrade). |
| `_engineerid` | string or nil | `nil` | User ID of the engineer who built it (for skill sync). |
| `_wired` | boolean or nil | `nil` | Whether the spotlight is connected to a battery via circuit. |
| `_target` | entity or nil | `nil` | Current target entity being illuminated. |
| `_curlightdir` | number or nil | `nil` | Current interpolated light direction on client. |
| `_curlightdist` | number or nil | `nil` | Current interpolated light distance on client. |
| `_lightoffset` | net_tinybyte | `0` | Animation offset for hit feedback. |
| `_ledblinkdelay` | number or nil | `nil` | Timer for LED blink pattern (server-only). |
| `_updatedelay` | number or nil | `nil` | Timer for target search updates (server-only). |
| `_flash` | number or nil | `nil` | Spark flash intensity on wire disconnect (server-only). |

## Main functions
### `AddBatteryPower(power)`
*   **Description:** Activates the spotlight with battery power for the specified duration. Triggers blinking LED and starts seasonal dark/cold checks. Overrides any existing power timer if longer.
*   **Parameters:** `power` (number) - Duration in seconds to power the spotlight.
*   **Returns:** Nothing.

### `EnableTargetSearch(enable)`
*   **Description:** Enables or disables automatic target search. When enabled, periodically scans players for the best candidate within range. When disabled, immediately turns off the light and cancels pending tasks.
*   **Parameters:** `enable` (boolean) - Whether to start/stop searching for targets.
*   **Returns:** Nothing.

### `SetPowered(powered, duration)`
*   **Description:** Manages the spotlight's powered state using a task timer. When powered, watches world states (night, full moon, winter) to enable target search.
*   **Parameters:** `powered` (boolean) - Whether the spotlight is powered. `duration` (number, optional) - Power duration in seconds if powering on.
*   **Returns:** Nothing.

### `OnUpdateLightServer(inst, dt)`
*   **Description:** Server-side update function (run every frame while awake) that updates target selection, lighting direction/distance, LED blinking, and head tilt based on beam position.
*   **Parameters:** `inst` (entity) - The spotlight instance. `dt` (number) - Delta time in seconds.
*   **Returns:** Nothing.

### `OnUpdateLightClient(inst)`
*   **Description:** Client-side update function (run every frame while awake) that interpolates light direction and distance for smooth visual tweening.
*   **Parameters:** `inst` (entity) - The spotlight instance.
*   **Returns:** Nothing.

### `EnableLight(enable)`
*   **Description:** Turns the spotlight light and heat on or off, updating sounds, LED status, power load, and circuit events.
*   **Parameters:** `enable` (boolean) - Whether to turn the light on.
*   **Returns:** Nothing.

### `SetHeadTilt(headinst, tilt, lightenabled)`
*   **Description:** Controls the spotlight head's tilt animation and light shaft visibility based on beam elevation.
*   **Parameters:** `headinst` (entity) - The spotlight head entity. `tilt` (number) - Tilt level (1-3). `lightenabled` (boolean) - Whether the light shaft should be visible.
*   **Returns:** Nothing.

### `ConfigureSkillTreeUpgrades(inst, builder)`
*   **Description:** Reads active Winona skill upgrades (`winona_spotlight_heated`, `winona_spotlight_range`) from the builder's skill tree and updates internal flags.
*   **Parameters:** `inst` (entity) - The spotlight instance. `builder` (entity or nil) - The player who built the spotlight.
*   **Returns:** boolean - `true` if any upgrade state changed, otherwise `false`.

### `ApplySkillBonuses(inst)`
*   **Description:** Applies configured skill upgrades to the spotlight's range, radius, and heat behavior.
*   **Parameters:** `inst` (entity) - The spotlight instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onbuilt` (`OnBuilt`) - Triggered after placement to start build animation and circuit connection.  
  - `lightdistdirty` (`OnLightDistDirty`) - Client event when light distance changes.  
  - `skillsdirty` (`ApplySkillBonuses`) - Client event when skill upgrades change.  
  - `engineeringcircuitchanged` (`OnCircuitChanged`) - Circuit connection change.  
  - `winona_spotlightskillchanged` (lambda) - Skill tree changes from the owning engineer.  
  - `animover` (`OnBuilt3`, `OnDeath2`) - Animation completion handlers.  
  - `death` (via `Burnable` and `Health`) - Entity death handling.  
- **Pushes:**  
  - `engineeringcircuitchanged` (via `OnCircuitChanged`) - Event propagated to connected batteries.  
  - `entity_droploot` (via `LootDropper:DropLoot`).