---
id: boat_cannon
title: Boat Cannon
description: Manages the behavior and state of a mounted cannon used on boats, including aiming, loading, firing, and interaction with operators and reticules.
tags: [combat, vehicle, mount, network]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a640fb48
system_scope: combat
---

# Boat Cannon

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boat_cannon` is a(prefab) entity that implements a deployable boat-mounted cannon used for ranged combat. It integrates with the `boatcannon`, `reticule`, `workable`, `burnable`, `lootdropper`, `inspectable`, `trader`, and `savedrotation` components to handle aiming, operator control, ammo loading, state persistence, and visual feedback. The cannon supports both mouse and controller-based targeting, respects firing arcs defined by `TUNING.BOAT.BOATCANNON.AIM_ANGLE_WIDTH`, and interacts with the `SGboatcannon` stategraph for animation and logic orchestration.

## Usage example
```lua
-- Create and deploy a boat cannon entity
local cannon = SpawnPrefab("boat_cannon")
cannon.Transform:SetPosition(player:GetPosition())

-- Load ammo via the trader component
local ammo_item = SpawnPrefab("cannonball_rock_item")
ammo_item.projectileprefab = "cannonball_rock"
player.components.trader:GiveItem(cannon, ammo_item)

-- Attach an operator (player)
if operator and operator.components.boatcannonuser then
    operator.components.boatcannonuser:SetCannon(cannon)
end

-- Ignite the cannon to fire (e.g., via a light source or scripted trigger)
cannon:PushEvent("onignite")
```

## Dependencies & tags
**Components used:** `boatcannon`, `reticule`, `workable`, `burnable`, `lootdropper`, `inspectable`, `trader`, `savedrotation`, `timer`, `light`, `mini map`, `network`, `animstate`, `transform`, `soundemitter`
**Tags:** Adds `boatcannon`; checks `burnt`, `burning`, `light`, `busy`; also uses `monster`, `animal`, `creaturecorpse` in loot logic via `lootdropper`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RANGE` | number | Calculated from `TUNING.CANNONBALLS.ROCK.SPEED` etc. | Fixed travel distance of a projectile in world units when fired. |
| `MONKEY_ISLAND_CENTER_TAGS` | table | `{ "monkeyqueen" }` | Tags used to locate a reference entity for automatic orientation during placement. |

## Main functions
### `ClampReticulePos(inst, pos, newx, newz)`
* **Description:** Constrains reticule positioning to the cannon’s allowed firing arc, returning a clamped world position within bounds. Used to prevent aiming outside the cannon’s angular range.
* **Parameters:**  
  `inst` (Entity) – The cannon instance.  
  `pos` (Vector3) – Cannon's current world position.  
  `newx`, `newz` (number) – Direction vector components from controller input or player-facing direction.  
* **Returns:** Vector3 – The clamped target position on the firing arc or original input if within arc.
* **Error states:** None.

### `reticule_target_function(inst)`
* **Description:** Computes the reticule's target world position for aiming based on player controller input (mouse or analog stick). Respects controller deadzone and camera heading. Falls back to default range if input is zero.
* **Parameters:**  
  `inst` (Entity) – The cannon instance.  
* **Returns:** Vector3 – Target world position or default position at fixed range ahead of cannon.

### `reticule_mouse_target_function(inst, mousepos)`
* **Description:** Calculates reticule target position when using mouse aiming, based on mouse location relative to the cannon and clamped to the firing arc.
* **Parameters:**  
  `inst` (Entity) – The cannon instance.  
  `mousepos` (Vector3?) – Mouse position in world coordinates, or `nil`.  
* **Returns:** Vector3? – Clamped target position, or `nil` if `mousepos` is `nil`.

### `onhammered(inst, worker)`
* **Description:** Handler for when the cannon is destroyed (e.g., hammered or exploded). Extinguishes fires, drops loot, spawns debris FX, and releases any loaded ammo as an item. Destroys the cannon entity.
* **Parameters:**  
  `inst` (Entity) – The cannon instance.  
  `worker` (Entity?) – The entity performing the hammering action.  
* **Returns:** Nothing.

### `OnAmmoLoaded(inst)`
* **Description:** Callback fired when ammo is successfully loaded into the cannon. Transitions the cannon into the `"load"` state (animation and logic).
* **Parameters:**  
  `inst` (Entity) – The cannon instance.  
* **Returns:** Nothing.

### `onburnt(inst)`
* **Description:** Called when the cannon is burnt to completion. Cancels any active operator and applies default burnt structure logic (`DefaultBurntStructureFn`).
* **Parameters:**  
  `inst` (Entity) – The cannon instance.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` – triggers orientation logic based on boat or ground placement.  
- **Listens to:** `onignite` – initiates firing sequence if ammo is loaded and resets operator.  
- **Listens to:** `ammoloaded` – transitions the cannon to `"load"` state.  
- **Pushes:** `ammounloaded`, `ammoloaded` – fired when `boatcannon:LoadAmmo()` changes ammo state.  
- **Pushes:** `onextinguish` – via `burnable` when extinguished.