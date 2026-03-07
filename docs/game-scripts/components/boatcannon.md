---
id: boatcannon
title: Boatcannon
description: Manages loading, aiming, and firing operations for a boat-mounted cannon, including ammo state tracking and projectile launch with recoil physics.
tags: [combat, vehicle, physics, projectile]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e9719b61
system_scope: combat
---

# Boatcannon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BoatCannon` is a component attached to cannon entities (typically mounted on boats) to handle operational logic: loading ammo, aiming via a user (operator), firing projectiles, and applying recoil to the boat platform. It integrates with `boatcannonuser`, `boatphysics`, and `complexprojectile` components to coordinate aiming, physics feedback, and projectile spawning.

## Usage example
```lua
local cannon = SpawnPrefab("boatcannon")
cannon:AddComponent("boatcannon")
cannon.components.boatcannon:LoadAmmo("cannonball")
cannon.components.boatcannon:StartAiming(player_entity)
cannon.components.boatcannon:Shoot()
```

## Dependencies & tags
**Components used:** `boatcannonuser`, `boatphysics`, `complexprojectile`  
**Tags:** Adds/removes `"ammoloaded"` based on loaded ammo state; adds `"occupied"` when a user is aiming.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `loadedammo` | string or `nil` | `nil` | Prefab name of the currently loaded projectile. |
| `operator` | Entity or `nil` | `nil` | The entity currently operating (aiming) the cannon. |

## Main functions
### `SetOnStartAimingFn(fn)`
* **Description:** Sets a callback function executed when aiming begins.
* **Parameters:** `fn` (function) — signature `(cannon_inst, operator_inst)`.
* **Returns:** Nothing.

### `SetOnStopAimingFn(fn)`
* **Description:** Sets a callback function executed when aiming stops.
* **Parameters:** `fn` (function) — signature `(cannon_inst, operator_inst)`.
* **Returns:** Nothing.

### `StartAiming(operator)`
* **Description:** Registers the provided entity as the cannon’s operator, adds the `"occupied"` tag, and triggers the `onstartfn` callback.
* **Parameters:** `operator` (Entity) — the entity that will control the cannon.
* **Returns:** Nothing.

### `StopAiming()`
* **Description:** Ends aiming by clearing the operator reference, removing the `"occupied"` tag, and triggering the `onstopfn` callback.
* **Parameters:** None.
* **Returns:** Nothing.

### `Shoot()`
* **Description:** Fires the loaded projectile. Spawns the projectile prefab, positions it relative to the cannon, launches it forward using `complexprojectile:Launch()`, applies recoil force to the current boat platform, and unloads the ammo.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No effect if `loadedammo` is `nil`.

### `IsAmmoLoaded()`
* **Description:** Reports whether the cannon currently has ammo loaded.
* **Parameters:** None.
* **Returns:** `true` if `loadedammo` is non-`nil`; otherwise `false`.

### `LoadAmmo(projectileprefab)`
* **Description:** Loads a projectile prefab into the cannon. Updates the `"ammoloaded"` tag and pushes `"ammoloaded"` or `"ammounloaded"` events accordingly.
* **Parameters:** `projectileprefab` (string or `nil`) — prefab name of the projectile to load, or `nil` to unload.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component state for saving.
* **Parameters:** None.
* **Returns:** `{ loadedammo = projectileprefab }` if ammo is loaded; otherwise `nil`.

### `OnLoad(data)`
* **Description:** Restores ammo state from saved data by calling `LoadAmmo`.
* **Parameters:** `data` (table) — contains `loadedammo` key if ammo was saved.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"onremove"` — on the operator entity, to call `StopAiming()` if the operator is removed.
- **Pushes:** `"ammoloaded"` or `"ammounloaded"` — when ammo state changes.

## Events (internal)
- **`onloadedammo` callback:** Internal listener for `loadedammo` changes. Automatically adds/removes `"ammoloaded"` tag based on whether ammo is present.

## Component lifecycle
- Attached to cannon prefabs (e.g., `boatcannon`).
- Manages ammo and operator state.
- Interacts with `boatcannonuser` via `SetCannon(nil)` on removal.
- Handles recoil by calling `boatphysics:ApplyForce()` on the parent boat platform.
- Projectile launch delegates to `complexprojectile:Launch()` using the cannon’s forward direction and range settings (`TUNING.BOAT.BOATCANNON.RANGE`).
