---
id: flamethrower_fx
title: Flamethrower Fx
description: Spawns and manages flame-effect entities for the flamethrower weapon's area-of-effect damage in Warg's mutated attack.
tags: [combat, fx, projectile, weapon]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6921895a
system_scope: fx
---

# Flamethrower Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`flamethrower_fx` is a client-side prefabricated effect entity used exclusively to visually and functionally simulate the flame breath attack of the Mutated Warg. It does *not* persist across sessions (`persists = false`) and is managed by a parent attacker entity (typically the Warg itself). It delegates actual combat logic (damage, planar damage, bonuses) to external components (`weapon`, `planardamage`, `damagetypebonus`) and spawns child FX prefabs (`warg_mutated_breath_fx`) to render the flame particles along the attack arc.

## Usage example
This prefab is not intended for manual instantiation by modders. It is created and controlled internally by the Mutated Warg's attack logic.

Typical internal usage (as seen in source):
```lua
-- The attacker (e.g., Warg) creates the FX entity and assigns itself as the source:
local fx = SpawnPrefab("flamethrower_fx")
fx:SetFlamethrowerAttacker(attacker)

-- After the attack completes, cleanly destroy it:
fx:KillFX()
```

## Dependencies & tags
**Components used:** `weapon`, `planardamage`, `damagetypebonus`, `transform`, `soundemitter`, `network`  
**Tags:** Adds `CLASSIFIED` only (for internal use).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flame_pool` | table | `{}` | Preallocated pool of flame FX prefabs for reuse. |
| `ember_pool` | table | `{}` | Preallocated pool of ember FX prefabs for reuse (not used in current code). |
| `angle` | number | `0` | Current firing angle in degrees (converted from entity rotation). |
| `flamethrower_attacker` | Entity | `nil` | The attacking entity that owns this FX (used for weapon damage attribution). |
| `tasks` | table | `{}` | List of scheduled periodic tasks that emit flame particles. |

## Main functions
### `SetFlamethrowerAttacker(attacker)`
* **Description:** Assigns the entity responsible for the attack. This is used to link weapon damage to the attacker (e.g., for loot attribution or AI targeting logic).
* **Parameters:** `attacker` (Entity or `nil`) — the entity performing the flamethrower attack.
* **Returns:** Nothing.

### `KillFX()`
* **Description:** Initiates shutdown of the flamethrower FX: cancels all periodic emission tasks, cleans up pooled FX instances, triggers a post-fire sound, and schedules full removal after a short delay (1 second) to allow lingering particles to finish rendering.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleanup helper called during destruction to safely remove all pooled FX entities and reset memory. Invoked by `KillFX`.
* **Parameters:** `inst` (Entity) — the flamethrower_fx instance being removed.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no event listeners registered).
- **Pushes:** None (no events fired).
(No event interaction occurs within this file.)

