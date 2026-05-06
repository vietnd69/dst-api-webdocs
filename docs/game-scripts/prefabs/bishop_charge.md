---
id: bishop_charge
title: Bishop Charge
description: Defines projectile and visual effect prefabs for the Chess Bishop's charge attack, including deprecated and updated versions.
tags: [combat, prefab, fx, boss, chess]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: e4f41992
system_scope: combat
---

# Bishop Charge

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`bishop_charge` defines three related prefabs for the Chess Bishop enemy's charge attack mechanic. The file contains both deprecated legacy implementations (`bishop_charge`, `bishop_charge_hit`) and a newer improved version (`bishop_charge2_fx`) that handles area-of-effect damage, visual effects, and lighting. The new prefab uses the `combat` and `updatelooper` components to process hits over time while displaying animated electrical effects.

## Usage example
```lua
-- Spawn the new bishop charge effect at a position
local charge = SpawnPrefab("bishop_charge2_fx")
charge.Transform:SetPosition(x, y, z)

-- Link the charge to its caster (the bishop entity)
charge.SetupCaster(charge, bishop_inst)

-- The charge will automatically process AOE hits and remove itself
-- after HIT_DURATION frames
```

## Dependencies & tags
**External dependencies:**
- `prefabs/clockwork_common` -- provides `FindAOETargetsAtXZ` for area-of-effect target detection
- `easing` -- provides `inQuad` function for light intensity fade animation

**Components used:**
- `projectile` -- (deprecated) handles projectile movement and hit detection on `bishop_charge`
- `combat` -- processes damage output and target acquisition on `bishop_charge2_fx`
- `updatelooper` -- runs per-frame update logic for effects and hit processing on `bishop_charge2_fx`
- `transform`, `animstate`, `soundemitter`, `light`, `network` -- standard entity components

**Tags:**
- `projectile` -- added to `bishop_charge` (deprecated)
- `FX` -- added to `bishop_charge_hit` and `bishop_charge2_fx`
- `NOCLICK` -- added to `bishop_charge2_fx` to prevent player interaction
- `notarget` -- added to `bishop_charge2_fx` to prevent being targeted by AI

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `caster` | entity | `nil` | Reference to the bishop entity that fired this charge. |
| `targets` | table | `{}` | Tracks entities already hit to prevent duplicate damage. |
| `fadet` | number | `0` | Timer for light intensity fade animation. |
| `fadeflicker` | number | `0` | Counter for light flicker effect (cycles 0-3). |
| `_soundplayed` | boolean | `nil` | Flag indicating if the explosion sound has been played. |
| `persists` | boolean | `false` | Prevents the entity from being saved in world state. |

## Main functions
### `fn()`
* **Description:** Constructor for the deprecated `bishop_charge` prefab. Creates a projectile entity that moves forward and triggers a hit effect on impact.
* **Parameters:** None
* **Returns:** Entity instance configured as a homing projectile.
* **Error states:** None

### `hit_fn()`
* **Description:** Constructor for the deprecated `bishop_charge_hit` prefab. Creates a non-networked FX entity that plays the hit sound effect at the impact location.
* **Parameters:** None
* **Returns:** Entity instance that plays sound and removes itself after 0.5 seconds.
* **Error states:** None

### `fx2fn()`
* **Description:** Constructor for the new `bishop_charge2_fx` prefab. Creates an area-of-effect damage entity with animated electrical effects, dynamic lighting, and per-frame hit processing.
* **Parameters:** None
* **Returns:** Entity instance with combat, updatelooper, and light components configured.
* **Error states:** Errors if `TUNING.BISHOP_DAMAGE` is not defined when setting combat damage.

### `SetupCaster(inst, caster)`
* **Description:** Links the charge effect to the bishop that fired it. Sets prefab name override for death announcements and triggers initial hit processing if targets table exists.
* **Parameters:**
  - `inst` -- the charge FX entity
  - `caster` -- the bishop entity that fired the charge
* **Returns:** None
* **Error states:** Errors if `caster` is invalid when calling `caster.prefab` or `caster.components.combat`.

### `OnUpdate(inst, dt)`
* **Description:** Per-frame update function that processes area-of-effect damage, manages light intensity animation, and tracks hit targets. Plays explosion sound on first update.
* **Parameters:**
  - `inst` -- the charge FX entity
  - `dt` -- delta time since last frame
* **Returns:** None
* **Error states:** Errors if `inst.caster` is invalid and `inst.components.combat` is nil when accessing combat damage.

### `DisableHits(inst)`
* **Description:** Stops hit processing by removing the update function and disabling the light component. Called when the charge effect duration expires.
* **Parameters:** `inst` -- the charge FX entity
* **Returns:** None
* **Error states:** Errors if `inst.components.updatelooper` is nil when calling `RemoveOnUpdateFn`.

### `ShowBase(inst)`
* **Description:** Creates a child FX entity displaying the electrical crackle animation. Used for both server and client visual effects.
* **Parameters:** `inst` -- parent charge entity
* **Returns:** Child FX entity instance
* **Error states:** None

### `ShowBase_Client(inst)`
* **Description:** Client-side variant of `ShowBase` that adds an updatelooper component to synchronize animation frames with the parent entity.
* **Parameters:** `inst` -- parent charge entity
* **Returns:** Child FX entity instance with post-update function
* **Error states:** None

### `Base_PostUpdate_Client(fx)`
* **Description:** Post-update function that synchronizes the child FX animation frame with the parent entity's current frame, then removes itself after one execution.
* **Parameters:** `fx` -- child FX entity
* **Returns:** None
* **Error states:** Errors if `fx.entity:GetParent()` returns nil or invalid entity.

### `PlayHitSound(proxy)`
* **Description:** Creates a temporary non-networked entity to play the hit explosion sound at the specified proxy location, then removes itself.
* **Parameters:** `proxy` -- entity with GUID to get transform position from
* **Returns:** None
* **Error states:** Errors if `proxy.GUID` is nil or invalid.

### `OnHit(inst, owner, target)`
* **Description:** Deprecated hit callback for `bishop_charge`. Spawns a hit effect prefab at the impact location and removes the projectile.
* **Parameters:**
  - `inst` -- the projectile entity
  - `owner` -- the entity that fired the projectile
  - `target` -- the entity that was hit
* **Returns:** None
* **Error states:** None

### `OnAnimOver(inst)`
* **Description:** Deprecated callback that removes the projectile entity 0.3 seconds after animation completes.
* **Parameters:** `inst` -- the projectile entity
* **Returns:** None
* **Error states:** None

### `OnThrown(inst)`
* **Description:** Deprecated callback registered when projectile is thrown. Sets up animation over listener for cleanup.
* **Parameters:** `inst` -- the projectile entity
* **Returns:** None
* **Error states:** None

### `KeepTargetFn(inst)`
* **Description:** Combat component callback that always returns false, preventing the charge FX from maintaining a combat target.
* **Parameters:** `inst` -- the charge FX entity
* **Returns:** `false` (boolean)
* **Error states:** None

## Events & listeners
- **Listens to:** `animover` -- triggers entity removal when animation completes (deprecated prefabs and child FX entities)
- **Pushes:** `electrocute` -- fired on each hit target with attacker, stimuli type, and fork count data