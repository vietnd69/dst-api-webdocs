---
id: mortarball
title: Mortarball
description: A throwable projectile component that deals damage, triggers splash effects, and interacts with terrain and entities during flight and impact.
tags: [combat, projectile, physics]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1164536f
system_scope: physics
---

# Mortarball

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mortarball` is a projectile prefab used to simulate high-trajectory stone projectiles (e.g., from a cannon or mortar). It combines physics-based flight with custom flight-time collision detection (`OnUpdateProjectile`) and impact logic (`OnHit`). During flight, it scans for and damages entities via `combat` and `complexprojectile` components. Upon landing, it spawns appropriate wreckage prefabs, triggers splash damage, knocks over workable objects, shatters kelp plants, releases fish loot, damages docks/walls, and spawns visual FX like waterspouts or splash animations.

## Usage example
```lua
-- Example: Creating and launching a mortarball
local mortar = SpawnPrefab("mortarball")
mortar.Transform:SetPosition(x, y, z)
mortar.components.complexprojectile:SetHorizontalSpeed(5)
mortar.components.complexprojectile:SetGravity(20)
mortar.components.complexprojectile:SetOnHit(function(inst, attacker, target)
    -- Custom on-hit behavior
end)
```

## Dependencies & tags
**Components used:** `combat`, `complexprojectile`, `groundshadowhandler`, `health`, `inventoryitem`, `locomotor`, `workable`, `pickable`, `stackable`, `dockmanager`, `oceanfishable`

**Tags added:** `projectile`, `complexprojectile`, `NOCLICK`  
**Tags checked/filtered against:** `boat`, `wall`, `wood`, `kelp`, `oceanfishable`, `_inventoryitem`, `wave`, `bullkelp_plant`, `boatbumper`, `crabking_ally`, `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`, `debris`, `_combat`, `_health`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `TUNING.MORTAR_DAMAGE` | Base damage applied on direct impact; used to set `combat.defaultdamage`. |
| `redgemcount` | number | `nil` | Optional property that scales build variant and damage mod. Affects animation build (`cannonball_rock_lvl2_build`, `cannonball_rock_lvl3_build`). |
| `isinventoryitem` | boolean | `false` (inferred) | Controls whether `MakeInventoryPhysics` or full physics setup is applied. |

## Main functions
### `launch_away(inst, position, use_variant_angle)`
* **Description:** launches an entity away from a given impact point using physics velocity, simulating splash ejection. Applies moisture if it's an inventory item and sets it as airborne.
* **Parameters:**  
  - `inst` (entity): The entity to launch (e.g., fish, kelp, inventory item).  
  - `position` (Vector3-like object with `Get()`): The origin point of the splash (e.g., impact point).  
  - `use_variant_angle` (boolean): If true, applies random angular variance (`±ANGLE_VARIANCE/2`) to direction.  
* **Returns:** Nothing.

### `OnHit(inst, attacker, target)`
* **Description:** Called when the projectile hits the ground or a platform. Handles splash damage (`combat:DoAreaAttack`), boat damage/leak generation, spawning wreckage prefabs (`mortarball_used_...`), kelp/fish/ground item ejection, and dock damage.
* **Parameters:**  
  - `inst` (entity): The mortarball instance.  
  - `attacker` (entity or `nil`): The originator of the shot (optional).  
  - `target` (entity or `nil`): The platform or object directly hit (e.g., boat or dock).  
* **Returns:** Nothing.

### `OnUpdateProjectile(inst)`
* **Description:** Called each frame during flight to detect and damage entities within a small radius (`TUNING.CANNONBALL_RADIUS`). Bypasses physics collision; instead uses `TheSim:FindEntities` to target `_combat`, `_health`, or `blocker` entities.
* **Parameters:**  
  - `inst` (entity): The mortarball instance.  
* **Returns:** Nothing.

### `common_fn(bank, build, anim, tag, isinventoryitem)`
* **Description:** Shared prefab constructor for mortarball-style prefabs. Initializes `AnimState`, `Physics`, `Transform`, `Network`, `ComplexProjectile`, `Combat`, and optional `GroundShadowHandler`.
* **Parameters:**  
  - `bank` (string): Animation bank name.  
  - `build` (string): Build name for visuals.  
  - `anim` (string or table): Animation name(s) to play.  
  - `tag` (string or `nil`): Optional tag to add (e.g., `"NOCLICK"`).  
  - `isinventoryitem` (boolean): Controls physics setup path.  
* **Returns:** `inst` (entity) — the fully initialized entity (client-only early return on non-mastersim).

### `setdamage(inst, damage)`
* **Description:** Updates the damage and switches the visual build variant based on `redgemcount`.
* **Parameters:**  
  - `inst` (entity): The mortarball instance.  
  - `damage` (number): New damage value.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `healthdelta` (via `combat`/`health`): Not directly listened to by this component, but it calls `health:DoDelta`.  
  - No explicit `inst:ListenForEvent` registrations are present.

- **Pushes:**  
  - `onareaattackother` (via `combat:DoAreaAttack`) — with `{target, weapon, stimuli}`.  
  - `stacksizechange` (if `stackable` is present, via `stackable:SetStackSize`).  
  - `healthdelta` (on boat/dock via `health:DoDelta`).  
  - `on_landed` / `on_no_longer_landed` (if `inventoryitem` is present, via `inventoryitem:SetLanded`).  
  - `spawnnewboatleak` (on hit boat if `redgemcount > 4`).  
  - `onareaattackother`, `on_landed`, `stacksizechange` — all indirectly triggered by impact logic.  
  - `onnoentitycollision` — *not used* in current code.

- **No explicit event handlers are defined in this file.**
