---
id: planarentity
title: Planarentity
description: Provides planar attack resistance mechanics, modifying incoming damage and triggering visual effects when non-planar damage is absorbed.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b9be8f5f
---

# Planarentity

## Overview
This component grants planar defense capabilities to an entity by reducing incoming non-planar damage through a custom formula and spawning visual feedback effects. It does not actively manage planar damage (e.g., handling planar-specific attacks) but focuses on resisting *non-planar* damage sources.

## Dependencies & Tags
**Dependencies:**
- No explicit component additions (e.g., `AddComponent`) are visible in the source.
- Relies on external prefabs: `"planar_resist_fx"` and `"planar_hit_fx"`.
- Requires the entity to have a `Transform` component (for position access) and `GetPhysicsRadius()` support (from `Physics` or similar component).
- May optionally depend on a `spawn_effect_on` callback property (commented out in source), suggesting integration with entities like `centipede` for targeted effect placement.

**Tags:** None identified.

## Properties
No public properties are initialized in the constructor (`_ctor` is not present, and the class function only stores `inst`). The commented line `--self.spawn_effect_on = nil` indicates an optional callback that may be set externally but is not part of the core component initialization.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed) | Reference to the associated game entity. |

*Note:* No public properties beyond `inst` were clearly identified.

## Main Functions

### `AbsorbDamage(damage, attacker, weapon, spdmg)`
* **Description:** Calculates reduced damage using a scaling formula, and triggers resistance effects if the attack is non-planar (i.e., `spdmg` is `nil` or lacks a `planar` field). Returns the modified damage value and `spdmg`.
* **Parameters:**
  - `damage` (number): Raw incoming damage value.
  - `attacker` (Entity?): The source entity of the attack (may be `nil`).
  - `weapon` (any): Weapon item involved (unused in current logic).
  - `spdmg` (table?): Damage table; if `nil` or `spdmg.planar` is falsy, resistance effects are applied.

### `OnResistNonPlanarAttack(attacker)`
* **Description:** Spawns a `planar_resist_fx` particle effect around the entity to visually represent damage absorption. The effect position is randomized in a ring around the entity and adjusted based on the attacker’s position if available.
* **Parameters:**
  - `attacker` (Entity?): The attacking entity (used to orient the effect direction).

### `OnPlanarAttackUndefended(target)`
* **Description:** Spawns a `planar_hit_fx` particle effect *attached to the target entity*, likely used to indicate planar damage was applied without resistance (e.g., planar weapons hitting non-planar targets). Note: Despite the name, the function itself does not imply resistance failure—it simply visualizes the hit.

## Events & Listeners
None identified.