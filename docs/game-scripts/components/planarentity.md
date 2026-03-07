---
id: planarentity
title: Planarentity
description: Modifies incoming damage to follow a non-linear scaling curve and triggers planar-specific visual effects for resistances or vulnerabilities.
tags: [combat, planar, visual]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b9be8f5f
system_scope: combat
---

# Planarentity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PlanarEntity` is a combat-related component that applies a custom damage mitigation formula to incoming physical damage. It also handles specialized effects when resisting non-planar attacks and when planar attacks hit an undefended target. This component is intended for use on entities that interact with planar mechanics—such as planar creatures or planar-themed bosses—and modifies both damage calculation and visual feedback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("planarentity")
-- Optionally set spawn_effect_on for custom effect positioning (e.g., centipede-style logic)
-- inst.components.planarentity.spawn_effect_on = my_custom_effect_fn
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_effect_on` | function or `nil` | `nil` | Optional callback that takes `(inst, attacker)` and returns an entity. Used to determine where resist effects spawn (e.g., for centipede-like behavior). |

## Main functions
### `AbsorbDamage(damage, attacker, weapon, spdmg)`
*   **Description:** Applies a non-linear damage reduction formula to incoming physical damage. Returns the modified damage value and the original `spdmg` parameter. If `spdmg` is missing or lacks a `planar` key, triggers a non-planar attack resistance effect.
*   **Parameters:**
    *   `damage` (number) — Raw incoming damage value.
    *   `attacker` (Entity or `nil`) — The entity dealing damage.
    *   `weapon` (Entity or `nil`) — The weapon used (unused in this implementation).
    *   `spdmg` (table or `nil`) — Special damage info; if present, checked for `spdmg.planar` key.
*   **Returns:**
    *   `damage` (number) — Computed damage using the formula: `(math.sqrt(damage * 4 + 64) - 8) * 4`.
    *   `spdmg` (table or `nil`) — Echoes the input `spdmg`.
*   **Error states:** None. The function always returns a computed value; `spdmg` may be `nil`.

### `OnResistNonPlanarAttack(attacker)`
*   **Description:** Spawns a `planar_resist_fx` particle effect at a position relative to the entity and attacker. If `spawn_effect_on` is defined, it is used to determine the effect’s target entity.
*   **Parameters:**
    *   `attacker` (Entity or `nil`) — The entity causing the resistance effect.
*   **Returns:** Nothing.
*   **Error states:** None. Falls back to `self.inst` if `spawn_effect_on` is `nil`. Position is randomized on the entity’s surface using physics radius and angular randomness.

### `OnPlanarAttackUndefended(target)`
*   **Description:** Spawns a `planar_hit_fx` effect and parents it to the hit target’s entity, presumably to indicate a direct planar hit on an undefended entity.
*   **Parameters:**
    *   `target` (Entity) — The entity being hit by the undefended planar attack.
*   **Returns:** Nothing.

## Events & listeners
None identified.
