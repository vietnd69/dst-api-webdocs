---
id: waterplant_seed
title: Waterplant Seed
description: Represents a throwable bomb item that explodes on impact, damaging nearby targets and damaging boats if no combat target is hit.
tags: [combat, throwable, weapon, explosion]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8039590d
system_scope: combat
---

# Waterplant Seed

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines two prefabs: `waterplant_bomb` (a throwable inventory item) and `waterplant_projectile` (a projectile launched from a waterplant entity). Both act as explosive devices that detonate upon impact, dealing area-of-effect damage to targets and optionally damaging boats if the explosion lands on a platform without hitting a valid target. The component relies heavily on the `combat`, `weapon`, `complexprojectile`, `equippable`, and `reticule` components to manage throwing physics, attack targeting, and interaction logic.

## Usage example
```lua
-- Create a waterplant bomb item
local bomb = SpawnPrefab("waterplant_bomb")
player.components.inventory:PushItem(bomb)

-- Equip and throw it (handled automatically by game when player uses item)
-- Or launch as a projectile from a waterplant entity
local projectile = SpawnPrefab("waterplant_projectile")
projectile.Transform:SetPosition(x, y, z)
projectile.components.complexprojectile:Launch(direction, speed)
```

## Dependencies & tags
**Components used:** `reticule`, `complexprojectile`, `weapon`, `combat`, `inspectable`, `inventoryitem`, `stackable`, `equippable`, `health`, `physics`, `animstate`, `soundemitter`, `transform`, `network`  
**Tags:** `noattack`, `projectile`, `complexprojectile`, `weapon`, `NOCLICK`, `notarget` (on projectiles), `INLIMBO`, `ghost`, `playerghost`, `FX`, `DECOR`, `companion`, `shadowminion`, `player` (exclusion tags used for targeting)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Ensures projectiles do not survive saves. |
| `attackrange` | number | `TUNING.WATERPLANT.ATTACK_AOE` | Area-of-effect radius for explosions (set via `combat:SetRange`). |
| `hitrange` | number | `10` | Maximum horizontal distance a thrown bomb can travel (set via `weapon:SetRange`). |

## Main functions
### `do_bomb(inst, thrower, target, no_hit_tags, damage, break_boats)`
*   **Description:** Core explosion logic executed when the bomb lands. Finds nearby entities within range, performs attacks using the `combat` component, and optionally spawns boat leaks if the platform is near water.
*   **Parameters:**  
    - `inst` (Entity): The bomb entity exploding.  
    - `thrower` (Entity?): Optional entity that threw the bomb. Used for correct combat attribution.  
    - `target` (Entity?): Initial target passed during throw (not used directly here).  
    - `no_hit_tags` (table): List of tag strings to exclude from targeting (e.g., `"player"`, `"companion"`).  
    - `damage` (number): Damage applied to each valid target.  
    - `break_boats` (boolean): Whether to check for and damage boats under water.  
*   **Returns:** Nothing.
*   **Error states:** If `thrower` is invalid, combat attribution is skipped; `ignorehitrange` is reset safely.

### `on_inventory_thrown(inst)`
*   **Description:** Called when the bomb is thrown from inventory. Enables spinning animation and configures physics for flight.
*   **Parameters:** `inst` (Entity) — the bomb instance.  
*   **Returns:** Nothing.

### `on_inventory_hit(inst, attacker, target)`
*   **Description:** Projectile impact handler for bombs thrown from inventory. Spawns visual FX, explosion logic via `do_bomb`, and removes the bomb.
*   **Parameters:**  
    - `inst` (Entity): The bomb.  
    - `attacker` (Entity): The player or entity that threw it.  
    - `target` (Entity): The initially targeted entity (unused in logic).  
*   **Returns:** Nothing.

### `reticule_target_fn()`
*   **Description:** Calculates where the reticule should point for the bomb item when equipped. Searches radially around the player to find the nearest valid passable ground position within range.
*   **Parameters:** None.  
*   **Returns:** `Vector3` — the world position of the reticule cursor.

### `projectile_keeptarget(inst)`
*   **Description:** Keeps the bomb from locking onto a single target during flight (returns `false` to allow homing-free targeting).
*   **Parameters:** `inst` (Entity) — unused.  
*   **Returns:** `false`.

### `onequip(inst, owner)`
*   **Description:** Animation handler when the bomb is equipped; shows the carry animation.
*   **Parameters:**  
    - `inst` (Entity): The bomb.  
    - `owner` (Entity): The player equipping the item.  
*   **Returns:** Nothing.

### `onunequip(inst, owner)`
*   **Description:** Reverts animation after unequipping the bomb.
*   **Parameters:**  
    - `inst` (Entity): The bomb.  
    - `owner` (Entity): The player unequipping the item.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (component code does not register `ListenForEvent` calls).
- **Pushes:** Not directly used, but the `do_bomb` function triggers `stunbomb` events on affected targets if they have the `"stunnedbybomb"` tag and survive.