---
id: explosive
title: Explosive
description: Manages the behavior and effects of explosive entities, including area-of-effect damage, building destruction, ignition of flammable objects, and camera effects upon detonation.
tags: [combat, environment, physics]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 950c7ca1
system_scope: environment
---

# Explosive

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `explosive` component handles the lifecycle and impact of explosive entities, such as dynamite or bombs. When triggered (typically via combustion or external event), it calculates and applies damage to surrounding entities and structures, ignites flammable objects within range, and triggers visual/audio effects like screen flashes and camera shakes. It integrates closely with the `health`, `combat`, `burnable`, `workable`, `explosiveresist`, and `damagetypebonus` components to resolve damage, destruction, and mitigation effects.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("explosive")
inst.components.explosive.explosiverange = 4
inst.components.explosive.explosivedamage = 150
inst.components.explosive:SetOnExplodeFn(function() print("BOOM!") end)
-- Trigger explosion elsewhere, e.g., on death or via event
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `damagetypebonus`, `dockmanager`, `explosiveresist`, `fueled`, `health`, `inventoryitem`, `spdamageutil`, `stackable`, `workable`  
**Tags:** Checks for `INLIMBO`, `notarget`, `player`, `fireimmune`, `burnt`; does not add or remove tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `explosiverange` | number | `3` | Radius (in world units) within which effects are applied. |
| `explosivedamage` | number | `200` | Base damage dealt to entities per explosion stack. |
| `buildingdamage` | number | `10` | Damage dealt per stack to `workable` structures/objects. |
| `lightonexplode` | boolean | `true` | Whether igniting flammable entities is attempted on explosion. |
| `onexplodefn` | function | `nil` | Custom callback function executed at the start of explosion logic. |
| `attacker` | Entity | `nil` | Entity responsible for the explosion (used for target suggestion). |
| `pvpattacker` | Entity | `nil` | PvP-specific attacker reference. |
| `skip_camera_flash` | boolean | `nil` | Optional override to suppress camera flash effects. |

## Main functions
### `SetOnExplodeFn(fn)`
* **Description:** Assigns a custom function to be executed at the beginning of `OnBurnt`, before damage calculations.
* **Parameters:** `fn` (function) — takes the explosive entity as the sole argument.
* **Returns:** Nothing.

### `SetAttacker(attacker)`
* **Description:** Sets the `attacker` field used to suggest combat targets for affected entities.
* **Parameters:** `attacker` (Entity or `nil`) — the entity causing the explosion.
* **Returns:** Nothing.

### `SetPvpAttacker(attacker)`
* **Description:** Sets the `pvpattacker` field, which takes precedence over `attacker` in player-versus-player contexts.
* **Parameters:** `attacker` (Entity or `nil`) — the PvP source of the explosion.
* **Returns:** Nothing.

### `OnBurnt()`
* **Description:** Main explosion handler. Executed when the explosive is destroyed (e.g., burnt). Applies area-of-effect damage, ignite flammable objects, destroy workable structures, and trigger visual effects.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** 
  - If `self.inst` is destroyed or invalid during processing, behavior depends on caller safety (not guarded internally).
  - Entities tagged `INLIMBO` or `notarget` are skipped.
  - PvP-related logic ensures non-player entities or self-exploding entities are handled safely.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** 
  - `onignite` (via `burnable.Ignite`) — if a nearby flammable object is ignited.
  - `explosion` (via `inst:PushEvent`) — pushed on each valid entity hit by the explosion.
  - `entity_death` and `death` (via `world:PushEvent` and `inst:PushEvent`) — if the explosive entity itself has a `health` component and is destroyed.
  - `explosion` (via `world:PushEvent`) — pushed once per stacksize for global event hooks (e.g., achievements).
