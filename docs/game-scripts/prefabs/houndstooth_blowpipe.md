---
id: houndstooth_blowpipe
title: Houndstooth Blowpipe
description: A ranged weapon that fires houndstooth darts; manages ammo loading/unloading, equipping animations, and projectile behavior including visual tail effects and impact spawning.
tags: [combat, weapon, projectile, inventory]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 62284fb7
system_scope: combat
---

# Houndstooth Blowpipe

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `houndstooth_blowpipe` prefab implements a ranged weapon with built-in ammo storage (via a `container` component) and dynamic projectile creation (`houndstooth_proj`). It coordinates equipping/unequipping animations, weapon range/damage setup on ammo load/unload, and projectile-specific behaviors such as tail effects and impact FX. It relies heavily on the `weapon`, `equippable`, `container`, `projectile`, and `planardamage` components to function.

## Usage example
```lua
-- In a prefab definition:
local function fn()
    local inst = CreateEntity()
    -- ... setup ...
    inst:AddComponent("equippable")
    inst:AddComponent("weapon")
    -- Attach the blowpipe's weapon logic to this entity (e.g., for a modded variant)
    -- The blowpipe itself is a Prefab; typically referenced as "houndstooth_blowpipe"
    return inst
end

-- Usage of the blowpipe components:
inst.components.weapon:SetDamage(TUNING.HOUNDSTOOTH_BLOWPIPE_DAMAGE)
inst.components.container:WidgetSetup("houndstooth_blowpipe")
```

## Dependencies & tags
**Components used:** `equippable`, `weapon`, `container`, `planardamage`, `damagetypebonus`, `projectile`, `inspectable`, `inventoryitem`, `light`, `soundemitter`, `animstate`, `transform`, `network`, `physics`
**Tags:** Adds `weapon`, `NOCLICK`, `NOBLOCK`, `blowpipe` (when loaded), `rangedweapon` (when loaded)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `OnAmmoLoaded` | function | `OnAmmoLoaded` | Callback fired when an item is added to the container; sets projectile prefab and range. |
| `OnAmmoUnloaded` | function | `OnAmmoUnloaded` | Callback fired when ammo is removed from container; clears projectile and range. |
| `scrapbook_anim` | string | `"idle_houndstooth"` | Animation used in the scrapbook UI. |
| `scrapbook_weaponrange` | number | `TUNING.HOUNDSTOOTH_BLOWPIPE_ATTACK_DIST_MAX` | Range displayed in scrapbook. |
| `scrapbook_weapondamage` | number | `TUNING.HOUNDSTOOTH_BLOWPIPE_DAMAGE` | Damage displayed in scrapbook. |
| `scrapbook_planardamage` | number | `TUNING.HOUNDSTOOTH_BLOWPIPE_PLANAR_DAMAGE` | Planar damage displayed in scrapbook. |

## Main functions
### `OnEquip(inst, owner)`
* **Description:** Handles equipping animations and opens the container. Sets skin override if applicable, shows the carry animation, and opens the blowpipe's container for the owner.
* **Parameters:** `inst` (Entity) — the blowpipe instance; `owner` (Entity) — the player equipping it.
* **Returns:** Nothing.
* **Error states:** None identified; safe for use during equip flow.

### `OnUnequip(inst, owner)`
* **Description:** Reverses equip changes. Hides carry animation, shows normal arms, closes the container, and fires the `unequipskinneditem` event if skinned.
* **Parameters:** `inst` (Entity); `owner` (Entity).
* **Returns:** Nothing.

### `OnEquipToModel(inst, owner)`
* **Description:** Closes the container when the item is placed in a model view (e.g., inventory slot preview).
* **Parameters:** `inst` (Entity); `owner` (Entity).
* **Returns:** Nothing.

### `OnProjectileLaunched(inst, attacker, target)`
* **Description:** Consumes one dart from the blowpipe's container upon firing. Removes the ammo stack from the container and destroys the item.
* **Parameters:** `inst` (Entity); `attacker` (Entity); `target` (Entity).
* **Returns:** Nothing.

### `OnAmmoLoaded(inst, data)`
* **Description:** Triggered when an item is loaded into the blowpipe. Sets the projectile to `"houndstooth_proj"`, configures weapon range, and adds `blowpipe`/`rangedweapon` tags.
* **Parameters:** `inst` (Entity); `data` (table) — must contain `item` (Entity).
* **Returns:** Nothing.
* **Error states:** Returns early if `inst.components.weapon` is missing or `data.item` is nil.

### `OnAmmoUnloaded(inst, data)`
* **Description:** Triggered when ammo is removed. Clears projectile and range, removes `blowpipe`/`rangedweapon` tags.
* **Parameters:** `inst` (Entity); `data` (table) — may be nil.
* **Returns:** Nothing.

### `Projectile_CreateTailFx(inst)`
* **Description:** Creates a non-networked FX entity (`lavaarena_blowdart_attacks`) for the projectile's tail. Uses `weighted_random_choice` to select animation (`tail_5_8` or `tail_5_9`).
* **Parameters:** `inst` (Entity) — ignored; local instance created internally.
* **Returns:** Entity — the FX entity with animation and bloom.
* **Error states:** None identified.

### `Projectile_UpdateTail(inst)`
* **Description:** Spawns and positions a tail FX entity ahead of the projectile, skipping if close to target (prevents visual glitch).
* **Parameters:** `inst` (Entity) — the projectile.
* **Returns:** Entity or `nil` — the tail FX if spawned; `nil` otherwise.
* **Error states:** Skips spawning if projectile is near target (`inst:IsNear(target, 1.5)`), or if projectile is not visible.

### `Projectile_OnThrown(inst, owner, target, attacker)`
* **Description:** Records the target of the projectile using a net_entity sync for remote clients.
* **Parameters:** `inst` (Entity); `owner` (Entity); `target` (Entity or `nil`); `attacker` (Entity).
* **Returns:** Nothing.

### `Projectile_OnPreHit(inst, attacker, target)`
* **Description:** Spawns impact FX (`hitsparks_piercing_fx`) just before projectile impact, but only if the target is valid and not already dead.
* **Parameters:** `inst` (Entity); `attacker` (Entity); `target` (Entity).
* **Returns:** Nothing.
* **Error states:** Skips impact FX if target is nil, invalid, attacker invalid, or target `health:IsDead()` returns true.

### `Projectile_SpawnImpactFx(inst, attacker, target)`
* **Description:** Creates and positions the impact FX at launch offset height.
* **Parameters:** `inst` (Entity); `attacker` (Entity); `target` (Entity).
* **Returns:** Entity — the spawned impact FX.
* **Error states:** Returns `nil` if any entity is invalid.

## Events & listeners
- **Listens to:** `itemget` — triggers `OnAmmoLoaded`.
- **Listens to:** `itemlose` — triggers `OnAmmoUnloaded`.
- **Pushes:** `equipskinneditem` — when a skinned item is equipped.
- **Pushes:** `unequipskinneditem` — when a skinned item is unequipped.
