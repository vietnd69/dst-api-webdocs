---
id: firepen
title: Firepen
description: A ranged weapon that ignites targets, unfreezes frozen entities, wakes sleeping creatures, and fuels burnable objects using fire-based projectiles.
tags: [combat, ranged, ignition, fire]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 134abccb
system_scope: inventory
---

# Firepen

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `firepen` is a ranged weapon prefab that launches fire-based projectiles. Its core responsibility is to interact with target entities upon impact: igniting flammable objects, unfreezing frozen ones, waking sleeping creatures, suggesting targets for combat, and delivering fuel to fueled entities (e.g., campfires). It uses the `weapon`, `equippable`, `finiteuses`, and `floater` components to manage gameplay behavior, equipping, and durability.

## Usage example
```lua
local inst = Prefab("firepen", fn, assets)
-- The firepen is automatically instantiated via the Prefab system
-- Typical usage in gameplay:
inst.components.weapon:SetDamage(0) -- Already set to 0 by default
inst.components.weapon:SetRange(8, 10) -- Range settings applied on creation
inst.components.finiteuses:SetUses(1) -- Starts with 1 use; depletes per attack
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `equippable`, `finiteuses`, `floater`, `freezable`, `fuel`, `fueled`, `sleeper`, `weapon`  
**Tags added by this entity:** `weapon`, `rangedweapon`, `rangedlighter`, `firepen`  
**Tags added to projectiles:** `controlled_burner` (if wielder is a `controlled_burner`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_specialinfo` | string | `"REDSTAFF"` | Label used for scrapbook categorization. |
| `skin_sound` | string? | `nil` | Optional override for impact sound; used if present. |
| `inst.components.finiteuses.total` | number | `TUNING.FIREPEN_MAXUSES` | Maximum number of uses before the item is removed. |
| `inst.components.finiteuses.current` | number | `1` | Starts with 1 use (non-full); decrements on attack. |
| `inst.components.weapon.damage` | number | `0` | Weapon damage is zero; effects are status-based, not direct. |
| `inst.components.weapon.attackrange` | number | `8` | Melee range (unused for ranged weapon but required by weapon component). |
| `inst.components.weapon.hitrange` | number | `10` | Projectile hit range (distance from launcher to target). |

## Main functions
### `OnAttack(inst, attacker, target)`
*   **Description:** Called when the weapon hits a target. Handles status effects: unfreezing, waking, suggesting target, and either igniting or fueling the target depending on its components.
*   **Parameters:**  
    `inst` (Entity) – The firepen instance.  
    `attacker` (Entity) – The entity wielding the firepen.  
    `target` (Entity) – The entity struck by the projectile.  
*   **Returns:** Nothing. Returns early if the target is invalid.  
*   **Error states:** May silently fail if target components are missing or `nil`. Does not spawn fuel if `SpawnPrefab("cutgrass")` returns `nil`.

### `projectilelaunched(inst, attacker, target, proj)`
*   **Description:** Called when a projectile is launched. Tags the projectile with `controlled_burner` if the attacker is a `controlled_burner`.
*   **Parameters:**  
    `inst` (Entity) – The firepen instance.  
    `attacker` (Entity) – The wielder.  
    `target` (Entity) – Intended target (unused in this handler).  
    `proj` (Entity) – The spawned projectile.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` – Only indirectly via `burnable:Ignite()`, which registers this listener to stop burning upon death.
- **Pushes (via weapon component):** `takefuel`, `onignite`, `unfreeze`, `onwakeup`, `attacked` – Used to notify other systems of interactions.  
- **Listeners from components:** `percentusedchange` (via `finiteuses`), `onfinished` (fires `inst.Remove` when uses reach zero).