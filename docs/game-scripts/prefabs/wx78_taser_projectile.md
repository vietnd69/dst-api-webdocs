---
id: wx78_taser_projectile
title: Wx78 Taser Projectile
description: Client-side visual effect entity for WX-78's taser projectile, handling explosion effects, damage application, and electrocute visual feedback.
tags: [fx, electric, projectile, visual]
sidebar_position: 10
last_updated: 2026-05-04
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 792c796d
system_scope: fx
---

# Wx78 Taser Projectile

> Based on game build **722832** | Last updated: 2026-05-04

## Overview
`wx78_taser_projectile_fx.lua` defines the client-side visual effect entity for WX-78's taser projectile. The prefab handles explosion effects, damage application logic, and electrocute visual feedback. It is instantiated via `SpawnPrefab("wx78_taser_projectile_fx")` and primarily operates on the client side, with server-side replication via netvars. The entity is non-persistent (`persists = false`) and designed to be short-lived.

## Usage example
```lua
-- Spawn the taser projectile FX at world origin
local inst = SpawnPrefab("wx78_taser_projectile_fx")
inst.Transform:SetPosition(0, 0, 0)

-- Set owner and trigger explosion
local owner = ThePlayer
inst:SetFXOwner(owner)
inst:Explode(TUNING.SKILLS.WX78.TASER_BUILDUP_DAMAGE, 10, 0)

-- Trigger flash effect for visual feedback
inst:DoFlash(TUNING.ELECTROCUTE_DEFAULT_DURATION, 0.8)
```

## Dependencies & tags
**External dependencies:**
- `easing` -- imported but not referenced (unused import)
- `TUNING.ELECTRIC_DAMAGE_MULT` -- damage multiplier for electric attacks
- `TUNING.ELECTRIC_WET_DAMAGE_MULT` -- additional damage multiplier for wet entities
- `TUNING.SKILLS.WX78.TASER_BUILDUP_DAMAGE` -- base damage value for taser projectile
- `TUNING.ELECTROCUTE_DEFAULT_DURATION` -- default duration for electrocute effects

**Components used:**
- `combat` -- handles attack logic and target tracking
- `updatelooper` -- manages periodic update tasks
- `colouradder` -- controls visual effects (lighting/coloring)
- `network` -- enables netvar replication

**Tags:**
- `FX` -- added to indicate this is a visual effect entity
- `NOCLICK` -- prevents interaction with the entity
- `notarget` -- prevents targeting by other entities

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `showbase` | net_bool | `false` | Controls whether the base FX is shown; dirty event `showbasedirty`. |
| `baseradius` | net_float | `0` | Base radius for the taser explosion; replicated to clients. Dirty event: baseradiusdirty |
| `damage` | number | `0` | Damage value for the taser projectile. |
| `radius` | number | `0` | Current radius of the taser explosion effect. |
| `spdmg` | number | `0` | Special damage value for the taser projectile. |
| `fadet` | number | `0` | Fade timer for visual effects. |
| `fadeflicker` | number | `0` | Flicker counter for visual effects. |
| `flash` | number | `0` | Flash duration timer for the colouradder effect. |
| `blink` | number | `0` | Blink counter for the flash effect. |
| `percent` | number | `0` | Percentage value for shock animation selection. |
| `duration` | number | `0` | Duration of the electrocute effect. |
| `play_pst_task` | Task | `nil` | Task for playing PST animation. |
| `targets` | table | `{}` | Table of entities that have been targeted by the taser. |
| `canhitplayers` | boolean | `true` | Whether the taser can hit player entities. |
| `hidden` | boolean | `true` | Whether the entity is currently hidden. |

## Main functions

### `FxPostUpdate(fx)`
* **Description:** Updates the FX entity's animation frame to match the parent entity's current frame. Removes the updatelooper component from the FX entity to prevent further updates.
* **Parameters:**
  - `fx` -- entity instance of the FX
* **Returns:** None
* **Error states:** Errors if fx.entity:GetParent() or AnimState is nil (no nil guard present).

### `OnShowBase(inst, radius)`
* **Description:** Creates and configures a base FX entity for the taser explosion. Sets up the animation, scale, and positioning. For client-only, updates the frame to match the parent entity's animation frame.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `radius` -- optional radius value for the base FX
* **Returns:** None
* **Error states:** Errors if inst.AnimState is nil (no nil guard present).

### `DisableHits(inst, OnUpdate)`
* **Description:** Disables further hit processing for the taser projectile. Removes the updatelooper update function and sets showbase to false.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `OnUpdate` -- function reference for the update function to remove
* **Returns:** None
* **Error states:** Errors if inst.components.updatelooper is nil (no nil guard present).

### `OnUpdate(inst, dt)`
* **Description:** Handles the periodic update for the taser projectile. Finds entities within the radius, applies damage, and triggers electrocute events. Checks for valid targets and applies damage multipliers based on wetness and immunity.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `dt` -- delta time since last update
* **Returns:** None
* **Error states:** Errors if inst.Transform is nil, v.Transform is nil, or v has no Physics component (no nil guards present)

### `Flash_OnUpdate(inst, dt)`
* **Description:** Handles the periodic update for the flash effect. Updates the flash timer and blink counter. Adjusts the colouradder component for the owner entity based on flash state.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `dt` -- delta time since last update
* **Returns:** None
* **Error states:** Errors if inst.owner is nil (no nil guard present)

### `Explode(inst, damage, radius, spdmg)`
* **Description:** Triggers the taser explosion effect. Sets up the explosion radius, damage values, and animation. Adds the update function for hit processing and schedules cleanup tasks.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `damage` -- damage value for the explosion
  - `radius` -- radius of the explosion
  - `spdmg` -- special damage value
* **Returns:** None
* **Error states:** Errors if inst.entity:GetParent().Transform, inst.AnimState, inst.components.updatelooper, or inst.SoundEmitter is nil (no nil guards present).

### `SetFXOwner(inst, owner)`
* **Description:** Sets the owner for the FX entity. Sets the parent entity, updates the owner reference, and configures whether players can be hit.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `owner` -- entity instance of the owner
* **Returns:** None
* **Error states:** Errors if owner is nil (no nil guard present).

### `OnAnimOver(inst)`
* **Description:** Handles the animation over event. Hides the entity when specific shock animations complete.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
* **Returns:** None
* **Error states:** Errors if inst.AnimState is nil (no nil guard present).

### `PlayPst(inst, anim)`
* **Description:** Plays the PST animation for the taser effect. Cancels any existing task and schedules a new one.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `anim` -- animation name to play
* **Returns:** None
* **Error states:** Errors if inst.AnimState is nil (no nil guard present).

### `GetShockAnim(builduppercent)`
* **Description:** Determines the appropriate shock animation based on the build-up percentage.
* **Parameters:**
  - `builduppercent` -- percentage value for build-up
* **Returns:** String animation name
* **Error states:** None.

### `DoFlash(inst, duration, percent)`
* **Description:** Triggers the flash effect for the taser projectile. Sets up the flash timer, blink counter, and colouradder effects for the owner entity.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
  - `duration` -- duration of the flash effect
  - `percent` -- percentage value for shock animation selection
* **Returns:** None
* **Error states:** Errors if inst.AnimState, inst.SoundEmitter, or inst.components.updatelooper is nil (no nil guards present).

### `KeepTargetFn(inst)`
* **Description:** Determines whether the target should be kept. Always returns false to prevent target tracking.
* **Parameters:**
  - `inst` -- entity instance of the taser projectile
* **Returns:** `false`
* **Error states:** None.

### `fn()`
* **Description:** Client-side constructor for the taser projectile. Creates and configures the entity with necessary components, tags, and animation settings. Sets up netvars for replication and hooks up event listeners.
* **Parameters:** None
* **Returns:** Entity instance
* **Error states:** None.

## Events & listeners
**Listens to:**
- `showbasedirty` -- triggers OnShowBase; called when showbase netvar changes
- `animover` -- triggers OnAnimOver; called when animation completes

**Pushes:**
- `electrocute` -- Data: `{attacker = entity, stimuli = string, noresist = boolean}`

**World state watchers:**
- None.