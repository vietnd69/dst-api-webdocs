---
id: sleepbomb
title: Sleepbomb
description: A throwable item that explodes upon impact to release a sleep-inducing cloud and visual burst effect.
tags: [combat, throwable, crowd_control, fx, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 21ce4321f
system_scope: combat
---

# Sleepbomb

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sleepbomb` is a throwable item prefabricated with projectile, weapon, equippable, and reticule capabilities. It is designed for crowd control by applying non-lethal crowd-control effects. When thrown, it behaves as a complex projectile, traveling toward a target position determined by the `ReticuleTargetFn` function, and upon impact, spawns two prefabs (`sleepbomb_burst` and `sleepcloud`) at the impact point. It supports both standard and advanced (Lava Arena) targeting modes, adjusting reticule behavior and interaction accordingly.

## Usage example
```lua
local inst = SpawnPrefab("sleepbomb")
inst.components.equippable:Equip()
-- Later, when thrown via action or input:
inst:PushEvent("throw")
-- Upon impact, OnHit() is triggered automatically by the complexprojectile component
```

## Dependencies & tags
**Components used:** `transform`, `animstate`, `soundemitter`, `network`, `locomotor`, `complexprojectile`, `weapon`, `reticule`, `inspectable`, `inventoryitem`, `stackable`, `equippable`, `hauntable`
**Tags:** Adds `projectile`, `complexprojectile`, `weapon`, `nopunch` (only in lava arena), `NOCLICK` (post-throw), and checks for `debris`/`hauntable` via `MakeHauntableLaunch(inst)`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` (set to `false` when thrown) | Indicates whether the item survives beyond a single session. Set to `false` on throw to prevent persistence. |
| `reticule.*` | various | see config | Configuration used by the `reticule` component for aiming feedback (e.g., `targetfn`, `ease`, `twinstickmode`). |

## Main functions
### `OnHit(inst, attacker, target)`
* **Description:** Triggered automatically by the `complexprojectile` component on collision. Removes the sleepbomb instance and spawns `sleepbomb_burst` and `sleepcloud` at the impact position.
* **Parameters:**  
  `inst` (Entity) — The sleepbomb entity instance.  
  `attacker` (Entity) — The entity that launched the projectile.  
  `target` (Entity) — The entity hit by the projectile (may be `nil` if it hit the world).  
* **Returns:** Nothing.
* **Error states:** No explicit failure conditions; relies on safe position retrieval and prefab spawning.

### `onthrown(inst)`
* **Description:** Triggered automatically by the `complexprojectile` component upon launch. Configures physics, animation, and tags for projectile state.
* **Parameters:**  
  `inst` (Entity) — The sleepbomb entity instance.  
* **Returns:** Nothing.
* **Error states:** May silently fail if physics or animation setup is blocked by game state.

### `onequip(inst, owner)`
* **Description:** Sets visual carry animation state for the equipped item, overriding the `swap_object` symbol.
* **Parameters:**  
  `inst` (Entity) — The sleepbomb instance.  
  `owner` (Entity) — The entity equipping the item (typically a player).  
* **Returns:** Nothing.

### `onunequip(inst, owner)`
* **Description:** Restores the default hand animation upon unequipping.
* **Parameters:**  
  `inst` (Entity) — The sleepbomb instance.  
  `owner` (Entity) — The entity unequipping the item.  
* **Returns:** Nothing.

### `ReticuleTargetFn()`
* **Description:** Calculates the optimal ground target position for aiming. Iterates from `r = 6.5` down to `3.5` in steps of `-0.25` along the player's local X axis, returning the first passable and unblocked point.
* **Parameters:** None.
* **Returns:** `Vector3` — The world position of the valid ground target. Defaults to origin `Vector3()` if no valid point is found.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** `throw` — implied by standard DST item behavior (not explicitly coded in `sleepbomb.lua`, but required to trigger the projectile launch via `complexprojectile`).
- **Automatically handles:** `OnHit`, `OnLaunch` — dispatched via `complexprojectile` callbacks (`SetOnHit`, `SetOnLaunch`).