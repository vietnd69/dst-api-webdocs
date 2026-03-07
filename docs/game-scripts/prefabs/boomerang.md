---
id: boomerang
title: Boomerang
description: A reusable ranged weapon that returns to the thrower after hitting a target or missing, with finite durability and equippable state.
tags: [combat, projectile, inventory, weapon]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c9741b62
system_scope: entity
---

# Boomerang

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boomerang` prefab implements a reusable thrown weapon that automatically returns to its owner after use, unless depleted or dropped. It integrates with multiple components: `weapon` (damage/range), `projectile` (throwing/trajectory/return logic), `finiteuses` (durability tracking), `inventoryitem` (dropped behavior), and `equippable` (equipped state and visual overrides). The prefab is optimized by pre-tagging entities with `"thrown"`, `"weapon"`, and `"projectile"` to streamline runtime handling.

## Usage example
```lua
local inst = SpawnPrefab("boomerang")
-- The boomerang is fully initialized upon spawn; no further setup required.
-- To use it, equip it to a player's hands and throw:
player.components.inventory:Equip(inst)
player.components.projectile:Throw(player, target)
```

## Dependencies & tags
**Components used:** `weapon`, `finiteuses`, `projectile`, `inventoryitem`, `equippable`, `inspectable`
**Tags:** Adds `"thrown"`, `"weapon"`, `"projectile"` during initialization; `"usesdepleted"` when depleted.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `TUNING.BOOMERANG_DAMAGE` | Base damage dealt on hit. |
| `attackrange` / `hitrange` | number | `TUNING.BOOMERANG_DISTANCE` / `TUNING.BOOMERANG_DISTANCE + 2` | Range for melee-style auto-attack vs. projectile hit detection. |
| `uses` | number | `TUNING.BOOMERANG_USES` | Current remaining uses. |
| `max_uses` | number | `TUNING.BOOMERANG_USES` | Maximum durability. |
| `speed` | number | `10` | Velocity used when throwing. |

## Main functions
### `OnFinished(inst)`
*   **Description:** Called when `finiteuses` reaches zero. Plays the `"used"` animation and schedules removal on animation completion.
*   **Parameters:** `inst` (Entity) — the boomerang instance.
*   **Returns:** Nothing.

### `OnEquip(inst, owner)`
*   **Description:** Sets up visual override for equipped state. Applies skin-specific animations if applicable; shows `"ARM_carry"` and hides `"ARM_normal"` on the owner.
*   **Parameters:** `inst` (Entity) — the boomerang; `owner` (Entity) — the player equipping it.
*   **Returns:** Nothing.

### `OnUnequip(inst, owner)`
*   **Description:** Reverts visual overrides on unequip. Restores `"ARM_normal"` and hides `"ARM_carry"`; pushes `"unequipskinneditem"` event if skinned.
*   **Parameters:** `inst` (Entity) — the boomerang; `owner` (Entity) — the player unequipping it.
*   **Returns:** Nothing.

### `OnThrown(inst, owner, target)`
*   **Description:** Triggered on throw. Plays spin animation, disables landed events, and plays throw sound (unless throwing at self).
*   **Parameters:** `inst` (Entity) — the boomerang; `owner` (Entity) — thrower; `target` (Entity) — intended target.
*   **Returns:** Nothing.

### `OnHit(inst, owner, target)`
*   **Description:** Handles projectile impact. If owner is target (self-hit) or ghost, drops item; otherwise returns to owner. Spawns `"impact"` FX at hit location if target has `combat` component.
*   **Parameters:** `inst` (Entity) — the boomerang; `owner` (Entity) — thrower; `target` (Entity) — hit entity.
*   **Returns:** Nothing.

### `OnMiss(inst, owner, target)`
*   **Description:** Handles projectile miss. If owner is target, drops item; otherwise returns to owner.
*   **Parameters:** `inst` (Entity) — the boomerang; `owner` (Entity) — thrower; `target` (Entity) — missed target.
*   **Returns:** Nothing.

### `OnCaught(inst, catcher)`
*   **Description:** Handles catch event. Equips or gives item to catcher if inventory is open; pushes `"catch"` event on catcher.
*   **Parameters:** `inst` (Entity) — the boomerang; `catcher` (Entity) — entity catching it.
*   **Returns:** Nothing.

### `ReturnToOwner(inst, owner)`
*   **Description:** Throws boomerang back to owner. Plays return sound and uses `projectile:Throw(owner, owner)`.
*   **Parameters:** `inst` (Entity) — the boomerang; `owner` (Entity) — original thrower.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — used in `OnFinished` to trigger `inst.Remove`.
- **Pushes:** `on_landed` — fired when dropped via `OnDropped`.
- **Pushes via components:**
  - `onthrown`, `onhit`, `onmiss`, `oncaught`, `percentusedchange` — from `projectile` and `finiteuses`.
  - `equipskinneditem`, `unequipskinneditem`, `catch`, `hostileprojectile` — from owner/ target interaction via events.