---
id: voidcloth_boomerang
title: Voidcloth Boomerang
description: Manages the voidcloth boomerang weapon, including its equippable behavior, projectile generation, set-bonus activation when paired with a voidcloth hat, and dynamic damage scaling during return flight.
tags: [combat, equipment, fx, inventory, projectile]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2cfa61f8
system_scope: combat
---

# Voidcloth Boomerang

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `voidcloth_boomerang` prefab implements a unique ranged weapon that spawns projectiles and dynamically adjusts damage based on flight distance. It integrates with the `equippable`, `weapon`, `rechargeable`, `finiteuses`, `shadowlevel`, and `floater` components. Its core behavior includes:  
- Setting bonus activation when equipped alongside a `voidclothhat` (via `SetBuffOwner`).  
- Managing FX entities for visual feedback during equip/unequip and projectile flight.  
- Handling projectile lifecycle (launch, return, scaling damage, and cleanup).  
- Supporting broken/repaired state transitions via forge repair logic.  

It is used in three prefabs: the main weapon (`voidcloth_boomerang`), its FX follow-sprite (`voidcloth_boomerang_fx`), and the projectile entity (`voidcloth_boomerang_proj`).

## Usage example
```lua
local boomerang = SpawnPrefab("voidcloth_boomerang")
boomerang.components.equippable:SetOnEquip(function(inst, owner)
    -- Custom equip logic
end)

-- Simulate equipping and checking set-bonus
local hat = SpawnPrefab("voidclothhat")
hat.components.equippable:Equip(boomerang.owner, EQUIPSLOTS.HEAD)
assert(boomerang._bonusenabled == true)
```

## Dependencies & tags
**Components used:**  
`equippable`, `weapon`, `rechargeable`, `finiteuses`, `shadowlevel`, `floater`, `inspectable`, `inventoryitem`, `damagetypebonus`, `updatelooper`, `highlightchild`, `colouraddersync`, `colouradder`, `inventory` (via `GetEquippedItem`).

**Tags:**  
`shadow_item`, `magicweapon`, `rangedweapon`, `show_broken_ui`, `weapon`, `shadowlevel`, `rechargeable`, `NOCLICK`, `NOBLOCK`, `FX`, `broken` (conditional).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isbroken` | `net_bool` | `false` | Networked boolean indicating broken state; triggers state changes via event callback. |
| `_owner` | `Entity?` | `nil` | Owner of the boomerang; used to check for `voidclothhat` set-bonus. |
| `_fxowner` | `Entity?` | `nil` | Entity whose `colouradder` controls the FX appearance. |
| `_bonusenabled` | `boolean` | `false` | Whether the set-bonus is active (based on equipped `voidclothhat`). |
| `max_projectiles` | `number` | `TUNING.VOIDCLOTH_BOOMERANG_PROJECTILE.MAX_ACTIVE` | Maximum active projectiles allowed at once; increases with set-bonus. |
| `_projectiles` | `table` | `{}` | List of active projectiles spawned by this boomerang. |

## Main functions
### `SetBuffOwner(owner)`
* **Description:** Assigns an owner and sets up event listeners to detect equip/unequip of `voidclothhat` to enable/disable the set-bonus. Called automatically when the boomerang is equipped or unequipped.
* **Parameters:** `owner` (`Entity?`) – The entity equipping the boomerang. If `nil`, disables the set-bonus.
* **Returns:** Nothing.
* **Error states:** No side effects if `owner` is unchanged.

### `SetFxOwner(owner)`
* **Description:** Attaches/detaches the FX entity (`inst.fx`) to/from the owner’s `swap_object` symbol and manages colour syncing via `colouradder`.
* **Parameters:** `owner` (`Entity?`) – The entity whose symbol the FX follows, or `nil` to follow the boomerang itself.
* **Returns:** Nothing.

### `OnProjectileCountChanged()`
* **Description:** Updates the `rechargeable` state: discharges if max projectiles are active, otherwise recharges to full percent. Ensures proper weapon cooldown.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetIsBroken(isbroken)`
* **Description:** Updates visual and collision state when the boomerang is broken/repaired. Modifies `floater` parameters and toggles FX visibility.
* **Parameters:** `isbroken` (`boolean`) – `true` if broken.
* **Returns:** Nothing.

### `Projectile_ReturnToThrower(inst, thrower)`
* **Description:** Used by projectile entities to initiate return flight. Sets physics motor velocity, scaling, and direction toward the thrower.
* **Parameters:**  
  - `thrower` (`Entity`) – The entity that threw the projectile.  
* **Returns:** Nothing.

### `Projectile_OnUpdateFn(inst, dt)`
* **Description:** Projectile-side update function responsible for: scaling size/damage during return, detecting collection distance, and updating physics velocity with acceleration.
* **Parameters:**  
  - `dt` (`number`) – Time since last frame.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"equip"` / `"unequip"` on the owner – to detect when `voidclothhat` is equipped/unequipped.  
  - `"floater_stopfloating"` – to restore idle animation after floating ends.  
  - `"isbrokendirty"` – on client to update FX/scaling after network state change.  
  - `"equiptoggledirty"` – on FX entities to toggle visual presence based on local equip state.  
- **Pushes:** None directly. Events are driven via component callbacks and external systems (e.g., `weapon`, `rechargeable`).
