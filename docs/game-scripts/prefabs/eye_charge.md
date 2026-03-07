---
id: eye_charge
title: Eye Charge
description: A short-lived projectile prefab used by eyeball turrets to deal damage, which spawns a hit FX entity upon collision.
tags: [combat, projectile, fx, boss]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fbfbac13
system_scope: combat
---

# Eye Charge

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`eye_charge` is a lightweight projectile prefab instantiated by eyeball turrets (e.g., during boss fights). It uses the `projectile` component to handle movement and collision detection. Upon hitting a target or missing, it spawns a corresponding hit FX entity (`eye_charge_hit`) or removes itself. The prefab is non-persistent, optimized for one-time use in combat scenarios, and strictly client/server-aware (e.g., FX only spawns on non-dedicated clients).

## Usage example
The `eye_charge` prefab is not added manually in mod code—it is spawned internally via `SpawnPrefab("eye_charge")` by the eyeball turret logic. A typical internal instantiation looks like:

```lua
local charge = SpawnPrefab("eye_charge")
charge.Transform:SetPosition(target_pos)
charge.components.projectile:Throw(owner, target_pos)
```

However, direct modder interaction with this prefab's components is rare and generally discouraged, as its behavior is fully encapsulated.

## Dependencies & tags
**Components used:** `projectile`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `projectile` (on master simulation); `eye_charge_hit` (hit FX) adds `FX`

## Properties
No public properties initialized in the constructor. All configuration is done via `projectile` component methods.

## Main functions
The `fn()` function defines prefab construction logic and is not called directly by modders. Two helper functions are used internally:

### `OnHit(inst, owner, target)`
* **Description:** Called when the projectile collides with a target. Spawns the `eye_charge_hit` FX at the projectile’s position and destroys the projectile.
* **Parameters:**  
  - `inst` (Entity) — the eye_charge instance.  
  - `owner` (Entity) — the entity that launched the projectile (e.g., eyeball turret).  
  - `target` (Entity) — the entity hit by the projectile.  
* **Returns:** Nothing.
* **Error states:** None. Assumes target position is valid; FX spawns unconditionally.

### `OnAnimOver(inst)`
* **Description:** Registers delayed self-removal after animation completes (via `DoTaskInTime`). Prevents premature cleanup if animation ends before expected.
* **Parameters:** `inst` (Entity) — the eye_charge instance.  
* **Returns:** Nothing.
* **Error states:** May be bypassed if `Remove()` is called earlier (e.g., by `OnHit`).

### `OnThrown(inst)`
* **Description:** Sets up a listener for the `"animover"` event upon throw completion to handle cleanup.
* **Parameters:** `inst` (Entity) — the eye_charge instance.  
* **Returns:** Nothing.

### `PlayHitSound(proxy)`
* **Description:** Spawns a temporary, non-networked entity that plays the hit explosion sound at the location of the projectile that triggered the hit.
* **Parameters:** `proxy` (table) — contains `GUID` of the projectile to position the sound at.
* **Returns:** Nothing.

### `hit_fn()`
* **Description:** Prefab factory for the `eye_charge_hit` FX entity. Handles client-only FX and delayed removal.
* **Parameters:** None (used internally by `Prefab()`).
* **Returns:** Entity — the FX instance.

## Events & listeners
- **Listens to:**  
  - `animover` — handled via `OnAnimOver` to trigger delayed removal after animation ends.  
- **Pushes:** None directly (depends on `projectile` component for internal events).
