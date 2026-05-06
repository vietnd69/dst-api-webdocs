---
id: wagdrone_projectile
title: Wagdrone Projectile
description: Defines projectile prefab factories for wagdrone and WX-78 zap drone electrical attacks with area damage and electrocute effects.
tags: [combat, projectile, electric, fx, prefab]
sidebar_position: 10

last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: f71c9907
system_scope: combat
---

# Wagdrone Projectile

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`wagdrone_projectile.lua` defines two projectile prefabs used for electrical area-of-effect attacks: `wagdrone_projectile_fx` for wagdrone flying attacks and `wx78_drone_zap_projectile_fx` for WX-78 skill-based zap drone attacks. The file provides a `MakeProjectile` factory function that creates entities with physics, lighting, sound, and combat components. Projectiles fall to ground level, explode on impact, and apply electric damage to multiple targets within radius while triggering electrocute status effects.

## Usage example
```lua
-- Spawn wagdrone projectile at position
local inst = SpawnPrefab("wagdrone_projectile_fx")
inst.Transform:SetPosition(10, 5, 10)
inst:Launch(10, 5, 10)

-- Attach projectile to weapon before launch
inst:AttachTo(weapon_inst)
inst:Launch(10, 0, 10)

-- WX-78 variant with custom caster reference
local wx78_inst = SpawnPrefab("wx78_drone_zap_projectile_fx")
wx78_inst.caster = player_inst
wx78_inst:Launch(10, 5, 10)
```

## Dependencies & tags
**External dependencies:**
- `easing` -- animation interpolation for light intensity and falling motion
- `prefabs/wagdrone_common` -- shared target finding logic for wagdrone variant

**Components used:**
- `transform` -- position and parent entity management
- `animstate` -- animation playback for projectile loop and hit effects
- `soundemitter` -- charging and explosion sound playback
- `light` -- dynamic light with radius, intensity, and falloff control
- `network` -- replication via `net_bool` for showbase state
- `follower` -- follow parent entity symbol before launch
- `physics` -- sphere physics with motor velocity for falling
- `updatelooper` -- OnUpdate and PostUpdate function registration
- `combat` -- damage application with CanTarget and DoAttack methods

**Tags:**
- `FX` -- added to projectile and base effect entities
- `NOCLICK` -- prevents player interaction/clicking
- `notarget` -- prevents AI from targeting the projectile itself

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `TUNING.WAGDRONE_FLYING_DAMAGE` | Base damage value applied to targets. |
| `insulated_dmg_mult` | number | `TUNING.WAGDRONE_FLYING_INSULATED_DAMAGE_MULT` | Damage multiplier for electric-immune targets. |
| `showbase` | net_bool | `false` | Networked boolean controlling base effect visibility on clients. |
| `_FindTargets` | function | `wagdrone_FindTargets` or `wx78_drone_zap_FindTargets` | Custom function for finding valid targets in radius. |
| `_CheckTarget` | function | `nil` or `wx78_drone_zap_CheckTarget` | Optional function to validate individual targets. |
| `_OnAttackedTarget` | function | `nil` or `wx78_drone_zap_OnAttackedTarget` | Optional callback fired after successfully attacking a target. |
| `caster` | entity | `nil` | Caster entity reference for WX-78 variant (used for ally checks and attacked event). |
| `weapon` | entity | `nil` | Parent weapon entity that the projectile is attached to before launch. |

## Main functions
### `MakeProjectile(name, common_postinit, master_postinit, override_assets)`
* **Description:** **Internal factory function** that creates and returns a Prefab instance with all required components and behaviors. Called internally to generate both wagdrone and WX-78 projectile variants. Not accessible externally via require().
* **Parameters:**
  - `name` -- string prefab name identifier
  - `common_postinit` -- function or nil, called on all instances after basic setup
  - `master_postinit` -- function or nil, called only on master sim instances
  - `override_assets` -- asset table or nil, overrides default asset list
* **Returns:** Prefab instance ready for registration in Prefabs table.
* **Error states:** None

### `Launch(inst, x, y, z)`
* **Description:** Initiates projectile flight by stopping follower behavior, detaching from parent, teleporting to launch position, and applying downward motor velocity. Enables light and starts update loop.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `x` -- number, world X coordinate
  - `y` -- number, world Y coordinate (height)
  - `z` -- number, world Z coordinate
* **Returns:** None
* **Error states:** Errors if `inst.components.updatelooper` is nil (not added on client instances).

### `AttachTo(inst, parent)`
* **Description:** Attaches projectile to a parent entity (typically weapon) before launch. Sets up follower to track parent's light symbol and plays charging sound loop.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `parent` -- parent entity instance (must have GUID and AnimState with "light" symbol)
* **Returns:** None
* **Error states:** Errors if `parent` is nil or `parent.GUID` is nil (no guard before member access on parent.GUID and parent.AnimState).

### `OnUpdate(inst, dt)`
* **Description:** **Internal callback.** Main update loop handling projectile physics, ground detection, target finding, and damage application. Manages light intensity fade and flicker effects during hit duration. Not intended for direct calls.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `dt` -- number, delta time in seconds
* **Returns:** None (returns early if still falling)
* **Error states:** Errors if `inst.components.combat` is nil (server-only component not present on client).

### `DisableHits(inst, OnUpdate)`
* **Description:** **Internal callback.** Disables hit detection after explosion duration expires. Removes update function, disables light, and sets showbase to false locally. Not intended for direct calls.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `OnUpdate` -- function reference to remove from updatelooper
* **Returns:** None
* **Error states:** Errors if `inst.components.updatelooper` is nil.

### `OnShowBase(inst)`
* **Description:** **Internal callback.** Client-side function that creates visual base effect entity when showbase network variable is true. Handles animation frame synchronization with parent projectile. Not intended for direct calls.
* **Parameters:** `inst` -- projectile entity instance
* **Returns:** None
* **Error states:** Errors if `inst.entity:GetParent()` returns nil when accessing parent AnimState.

### `FxPostUpdate(fx)`
* **Description:** **Internal callback.** Post-update function for client-side FX entity that synchronizes animation frame with parent projectile. Removes updatelooper component after first execution. Not intended for direct calls.
* **Parameters:** `fx` -- FX entity instance
* **Returns:** None
* **Error states:** None (safely removes updatelooper during PostUpdate as noted in source comments).

### `KeepTargetFn(inst)`
* **Description:** **Internal callback.** Combat component keep-target function that always returns false, preventing projectile from maintaining combat target state. Not intended for direct calls.
* **Parameters:**
  - `inst` -- entity instance (passed by Combat component)
* **Returns:** `false` (boolean)
* **Error states:** None

### `wagdrone_FindTargets(inst, x, z, radius)`
* **Description:** **Internal callback.** Wagdrone variant target finder that delegates to WagdroneCommon.FindShockTargets for area target detection. Not intended for direct calls.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `x` -- number, world X coordinate
  - `z` -- number, world Z coordinate
  - `radius` -- number, search radius
* **Returns:** Table of entity instances within radius.
* **Error states:** None

### `wx78_drone_zap_FindTargets(inst, x, z, radius)`
* **Description:** WX-78 variant target finder using TheSim:FindEntities with specific tag filters based on PVP status. Excludes allies, walls, shadows, and other immune entity types.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `x` -- number, world X coordinate
  - `z` -- number, world Z coordinate
  - `radius` -- number, search radius
* **Returns:** Table of entity instances matching combat tags and exclusion filters.
* **Error states:** None

### `wx78_drone_zap_CheckTarget(inst, target)`
* **Description:** WX-78 variant target validator that checks if target is not an ally of the caster. Returns false for allies to prevent friendly fire.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `target` -- candidate target entity instance
* **Returns:** `true` if target is valid (not ally), `false` otherwise.
* **Error states:** None

### `wx78_drone_zap_OnAttackedTarget(inst, target)`
* **Description:** WX-78 variant callback that pushes "attacked" event to damaged target with caster as attacker. Triggers aggro behavior if target is within aggro range of caster.
* **Parameters:**
  - `inst` -- projectile entity instance
  - `target` -- entity instance that was attacked
* **Returns:** None
* **Error states:** None (includes validity checks for inst.caster and target before pushing event).

## Events & listeners
- **Listens to:** `showbasedirty` (client-side) -- triggers OnShowBase when network variable changes
- **Listens to:** `animover` (FX entity) -- triggers fx.Remove when base effect animation completes
- **Pushes:** `electrocute` (on targets) -- applies immediate electrocute status with no data payload
- **Pushes:** `attacked` (WX-78 variant on targets) -- includes attacker, damage, and weapon data for aggro systems