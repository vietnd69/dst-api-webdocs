---
id: dumbbells
title: Dumbbells
description: Defines seven dumbbell prefab variants for Wolfgang, including standard, golden, marble, gem, heat rock, and elemental gem versions with mightiness-based mechanics.
tags: [wolfgang, mightiness, weapon, throwable]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: d119005c
system_scope: entity
---

# Dumbbells

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
The `dumbbells` prefab file defines seven weapon variants that integrate with Wolfgang's mightiness system. Each dumbbell type has unique consumption rates, efficiency multipliers, damage values, and special properties. The heat rock variant additionally functions as a thermal stone with temperature-based visual states and heating capabilities. Dumbbells can be used for melee attacks or thrown as projectiles when Wolfgang is in mighty state.

## Usage example
```lua
-- Spawn a standard dumbbell
local dumbbell = SpawnPrefab("dumbbell")

-- Spawn a golden dumbbell (higher efficiency, lower consumption)
local golden = SpawnPrefab("dumbbell_golden")

-- Spawn heat rock dumbbell (temperature mechanics)
local heat = SpawnPrefab("dumbbell_heat")

-- Check if dumbbell is tossable (requires mighty state)
if dumbbell.components.complexprojectile ~= nil then
    -- Can be thrown
end

-- Get remaining uses
local uses = dumbbell.components.finiteuses:GetUses()
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- balance constants for consumption, efficiency, damage, and insulation values

**Components used:**
- `reticule` -- targeting system for thrown attacks
- `inventoryitem` -- inventory ownership and pickup handling
- `inspectable` -- allows player inspection
- `equippable` -- equip/unequip callbacks and restricted to strongman
- `weapon` -- damage dealing and attack callbacks
- `finiteuses` -- durability and consumption tracking
- `mightydumbbell` -- mightiness workout integration
- `complexprojectile` -- added dynamically for throwing (mighty state only)
- `temperature` -- heat rock variant only, tracks current temperature
- `heater` -- heat rock variant only, emits heat based on temperature range
- `tradable` -- heat rock variant only, rock tribute value
- `lootdropper` -- red gem variant only, flings fire on hit

**Tags:**
- `dumbbell` -- added to all variants on creation
- `keep_equip_toss` -- added to all variants on creation
- `HASHEATER` -- heat rock variant only
- `icebox_valid` -- heat rock variant only, can be cooled in icebox
- `heatrock` -- heat rock variant only, temperature system tag
- `NOCLICK` -- added when thrown or when uses depleted
- `punch` -- added when owner is in wimpy state
- `projectile` -- checked by reticule hide function

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `swap_dumbbell` | string | `"swap_<name>"` | Animation build name for equipped state |
| `swap_dumbbell_symbol` | string | `"swap_<name>"` | Symbol name for equipped animation override |
| `thrown_consumption` | number | `consumption * TUNING.DUMBBELL_THROWN_CONSUMPTION_MULT` | Uses consumed when thrown |
| `impact_sound` | string | varies by variant | Sound played on impact |
| `isiceattack` | boolean | `false` | True for blue gem variant, enables freezing |
| `isfireattack` | boolean | `false` | True for red gem variant, spawns fire on hit |
| `currentTempRange` | number | `0` | Heat rock only, current temperature visual range (1-5) |
| `highTemp` | number | `nil` | Heat rock only, recorded highest temperature reached |
| `lowTemp` | number | `nil` | Heat rock only, recorded lowest temperature reached |
| `_light` | entity | `nil` | Heat rock only, light entity for hot state |
| `_owners` | table | `{}` | Heat rock only, tracks owner chain for light parenting |

## Main functions
### `MakeDumbbell(name, consumption, efficiency, damage, impact_sound, walkspeedmult)`
* **Description:** Factory function that creates a dumbbell prefab with specified parameters. Called internally to generate all seven variants.
* **Parameters:**
  - `name` -- string prefab name and animation build
  - `consumption` -- number base use consumption rate
  - `efficiency` -- table of three numbers for wimpy, normal, mighty efficiency
  - `damage` -- number or function for weapon damage
  - `impact_sound` -- string sound path for impact
  - `walkspeedmult` -- number or nil, walk speed multiplier when equipped
* **Returns:** Prefab object registered with the prefab system
* **Error states:** None

### `onequip(inst, owner)`
* **Description:** Called when dumbbell is equipped. Overrides owner's carry animation and registers mightiness state change listener.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `owner` -- player entity equipping the dumbbell
* **Returns:** None
* **Error states:** None

### `onunequip(inst, owner)`
* **Description:** Called when dumbbell is unequipped. Restores owner's arm animation and removes mightiness listener. Pushes `stopliftingdumbbell` event if lifting.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `owner` -- player entity unequipping the dumbbell
* **Returns:** None
* **Error states:** None

### `OnAttack(inst, attacker, target)`
* **Description:** Called on melee attack. Triggers mightiness workout if attacker is holding the dumbbell.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `attacker` -- attacking entity
  - `target` -- target entity
* **Returns:** None
* **Error states:** None

### `OnPickup(inst, owner)`
* **Description:** Called when dumbbell is picked up. Configures tossable and punch states based on owner's mightiness tags.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `owner` -- entity picking up the dumbbell
* **Returns:** None
* **Error states:** None

### `MakeTossable(inst)`
* **Description:** Adds `complexprojectile` component with configured physics and callbacks. Enables throwing mechanics.
* **Parameters:** `inst` -- dumbbell entity
* **Returns:** None
* **Error states:** None

### `RemoveTossable(inst)`
* **Description:** Removes `complexprojectile` component. Disables throwing mechanics.
* **Parameters:** `inst` -- dumbbell entity
* **Returns:** None
* **Error states:** None

### `CheckMightiness(inst, data)`
* **Description:** Checks owner's mightiness state and configures dumbbell behavior accordingly. Mighty state enables tossing, wimpy state enables punch mode.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `data` -- table with `state` field (wimpy, normal, or mighty)
* **Returns:** None
* **Error states:** Errors if `inst.components.inventory` is nil when getting equipped item

### `HeatFn(inst, observer)`
* **Description:** Heat rock only. Returns emitted temperature based on current temperature range relative to ambient.
* **Parameters:**
  - `inst` -- heat rock dumbbell entity
  - `observer` -- entity observing the heat (unused)
* **Returns:** number temperature value from `emitted_temperatures` table
* **Error states:** Errors if `inst.components.temperature` is nil

### `TemperatureChange(inst, data)`
* **Description:** Heat rock only. Handles temperature delta events. Updates visual range, lighting, and records extreme temperatures. Consumes uses when crossing temperature thresholds.
* **Parameters:**
  - `inst` -- heat rock dumbbell entity
  - `data` -- table with `hasrate` boolean field
* **Returns:** None
* **Error states:** Errors if `inst.components.temperature` or `inst.components.finiteuses` is nil

### `UpdateImages(inst, range)`
* **Description:** Heat rock only. Updates animation build, swap symbols, and inventory image based on temperature range. Enables bloom and light at range 5.
* **Parameters:**
  - `inst` -- heat rock dumbbell entity
  - `range` -- number temperature range (1-5)
* **Returns:** None
* **Error states:** Errors if `inst.components.equippable` is nil (no guard before `IsEquipped()` call)

### `AdjustLighting(inst, range, ambient)`
* **Description:** Heat rock only. Adjusts light intensity based on temperature. Light enabled only at range 5 with intensity scaled by temperature above threshold.
* **Parameters:**
  - `inst` -- heat rock dumbbell entity
  - `range` -- number temperature range (1-5)
  - `ambient` -- number ambient temperature
* **Returns:** None
* **Error states:** Errors if `inst._light` is nil (debug guard prints warning but does not prevent nil dereference on `_light.Light:SetIntensity()`)

### `OnOwnerChange(inst)`
* **Description:** Heat rock only. Updates light entity parenting based on owner chain. Handles inventory transitions and pocket dimension cases.
* **Parameters:** `inst` -- heat rock dumbbell entity
* **Returns:** None
* **Error states:** Errors if `inst._light` is nil

### `OnSave(inst, data)`
* **Description:** Heat rock only. Saves extreme temperature values to save data.
* **Parameters:**
  - `inst` -- heat rock dumbbell entity
  - `data` -- table to populate with save data
* **Returns:** None
* **Error states:** None

### `OnLoad(inst, data)`
* **Description:** Heat rock only. Restores extreme temperature values from save data.
* **Parameters:**
  - `inst` -- heat rock dumbbell entity
  - `data` -- table containing saved temperature data
* **Returns:** None
* **Error states:** None

### `OnRemove(inst)`
* **Description:** Heat rock only. Cleans up light entity on removal. Stores debug traceback on Steam for diagnostics.
* **Parameters:** `inst` -- heat rock dumbbell entity
* **Returns:** None
* **Error states:** Errors if `inst._light` is nil

### `ReticuleTargetFn()`
* **Description:** Returns valid throw target position by raycasting from player at decreasing ranges. Ensures throw target is passable and not blocked.
* **Parameters:** None
* **Returns:** `Vector3` position or last tested position if no valid spot found
* **Error states:** Errors if `ThePlayer` or `TheWorld.Map` is nil

### `ReticuleShouldHideFn(inst)`
* **Description:** Returns whether reticule should be hidden. Hidden when entity has `projectile` tag.
* **Parameters:** `inst` -- dumbbell entity
* **Returns:** boolean
* **Error states:** None

### `CanDamage(inst, target, attacker)`
* **Description:** Validates if target can receive damage from thrown dumbbell. Checks combat component, PVP settings, ghost state, and ally status.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `target` -- potential damage target
  - `attacker` -- dumbbell thrower
* **Returns:** boolean
* **Error states:** Errors if `attacker.components.combat` is nil when calling `IsAlly`

### `OnThrownHit(inst, attacker, target)`
* **Description:** Called when thrown dumbbell hits. Applies AOE damage, handles elemental effects (fire/ice), consumes uses, and resets physics if uses remain.
* **Parameters:**
  - `inst` -- dumbbell entity
  - `attacker` -- thrower entity
  - `target` -- hit target (unused, AOE affects all in range)
* **Returns:** None
* **Error states:** Errors if `inst.components.weapon`, `inst.components.complexprojectile`, or `inst.components.finiteuses` is nil

## Events & listeners
- **Listens to:** `mightiness_statechange` -- updates tossable/punch state on owner mightiness change
- **Listens to:** `temperaturedelta` -- heat rock only, updates temperature visuals and records extremes
- **Listens to:** `onputininventory` -- configures state on pickup
- **Listens to:** `ondropped` -- heat rock only, updates light parenting
- **Pushes:** `stopliftingdumbbell` -- fired on unequip if lifting, with `instant` flag