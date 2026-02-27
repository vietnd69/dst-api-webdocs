---
id: explosive
title: Explosive
description: Handles the logic for an entity's explosion, including area-of-effect damage, building destruction, fire ignition, and screen shake effects.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: 950c7ca1
---

# Explosive

## Overview
The `Explosive` component manages the behavior when an entity detonates. It calculates and applies area-of-effect damage to nearby entities, destroys or damages workable structures and inventory items (within a per-explosion limit), ignites flammable targets, triggers screen shake and camera flash effects for players, and notifies the world and affected entities via events. After detonation, the explosive entity is removed.

## Dependencies & Tags
- **Components used internally**: `stackable`, `damagetypebonus`, `workable`, `inventoryitem`, `burnable`, `fueled`, `health`, `combat`, `explosiveresist`
- **Tags used**: `"INLIMBO"`, `"notarget"` (to exclude entities), `"player"` (for PvP filtering)
- **Tags added**: None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `explosiverange` | `number` | `3` | Radius (in world units) of the explosion effect. |
| `explosivedamage` | `number` | `200` | Base damage dealt per stack to targets within range. |
| `buildingdamage` | `number` | `10` | Base damage applied per stack to workable entities (capped per-explosion). |
| `lightonexplode` | `boolean` | `true` | If `true`, ignites flammable targets that are not already burning. |
| `onexplodefn` | `function?` | `nil` | Optional custom callback invoked at the start of explosion handling. |
| `attacker` | `Entity?` | `nil` | The entity responsible for the explosion; used for target suggestion. |
| `pvpattacker` | `Entity?` | `nil` | PvP-specific attacker reference; if set, player targets are excluded unless they match it. |
| `skip_camera_flash` | `boolean?` | `nil` | Controls whether camera flash/shake effects are skipped for all players. |

## Main Functions

### `SetOnExplodeFn(fn)`
* **Description:** Assigns a custom function to be called when the explosion occurs (before any damage or effects are applied).
* **Parameters:**
  - `fn` (`function`): A function that receives the explosive entity (`inst`) as its only argument.

### `SetAttacker(attacker)`
* **Description:** Sets the non-PvP attacker entity reference for this explosion.
* **Parameters:**
  - `attacker` (`Entity?`): The entity causing or initiating the explosion.

### `SetPvpAttacker(attacker)`
* **Description:** Sets the PvP-specific attacker reference. If set, the explosion will ignore non-attacker players (used to prevent friendly-fire in PvP).
* **Parameters:**
  - `attacker` (`Entity?`): The PvP attacker entity; if set, only the attacker or non-player entities take damage.

### `OnBurnt()`
* **Description:** Triggers the explosion sequence. This is the main method called when the entity burns/explodes.
* **Parameters:** None. Uses internal state (`explosiverange`, `explosivedamage`, etc.) to determine effects.

## Events & Listeners
- **Listens for:** `OnBurnt()` is called externally (not via `ListenForEvent`).
- **Triggers:**
  - `v:PushEvent("explosion", { explosive = self.inst })` — broadcast to each affected entity.
  - `world:PushEvent("explosion", { damage = self.explosivedamage })` — broadcast per stack size to the world.
  - `world:PushEvent("entity_death", { inst = self.inst, explosive = true })` — fired when the explosive entity is destroyed.
  - `self.inst:PushEvent("death")` — death event for the explosive entity itself.