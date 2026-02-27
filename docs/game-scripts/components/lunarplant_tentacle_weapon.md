---
id: lunarplant_tentacle_weapon
title: Lunarplant Tentacle Weapon
description: This component attaches to a weapon and spawns Lunarplant Tentacles as secondary attacks under specific skill and luck conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: 617a3306
---

# Lunarplant Tentacle Weapon

## Overview
This component extends a weapon entity to trigger the spawning of Lunarplant Tentacles when the weapon is used to attack. It requires the owner to have a specific skill (`wormwood_allegiance_lunar_plant_gear_2`) activated and succeeds based on a configured spawn chance. Tentacles are spawned at random nearby walkable positions (avoiding holes) and are given the attacked target as their target.

## Dependencies & Tags
- Relies on: `health`, `combat`, `skilltreeupdater`, `component.owner` (on `owner` entity), `component.combat` (on spawned tentacle)
- Events listened to: `equipped`, `unequipped`, `onattackother`, `onremove`
- No tags are added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_chance` | `number` | `0.2` | Probability (0–1) that a tentacle spawns per successful attack condition check. |
| `tentacle_prefab` | `string` | `"lunarplanttentacle"` | Prefab name used to spawn the tentacle. |
| `should_do_tentacles_fn` | `function` | `DefaultLunarPlantTentacleCondition` | Callback function determining whether tentacles should be spawned for a given attack. |
| `owner` | `Entity or nil` | `nil` | The player/entity currently wielding the weapon. Set/cleared via `equipped`/`unequipped` events. |
| `_on_attack` | `function` | (internal) | Callback wrapper used to route attack events to `OnAttack`. |
| `_erase_owner` | `function` | (internal) | Callback used to clear the `owner` reference when the owner entity is removed. |
| `_equipped_callback` | `function` | (internal) | Handler for `equipped` events, invokes `SetOwner(data.owner)`. |
| `_unequipped_callback` | `function` | (internal) | Handler for `unequipped` events, invokes `SetOwner(nil)`. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** Cleans up event listeners and references when this component is removed from an entity. Removes all registered callbacks and clears the owner reference.
* **Parameters:** None.

### `SetOwner(owner)`
* **Description:** Assigns the weapon’s current owner and registers or unregisters event listeners on the owner to track attacks and entity removal.
* **Parameters:**
  - `owner` (`Entity or nil`): The entity that equipped or unequipped the weapon.

### `OnAttack(owner, attack_data)`
* **Description:** Handles weapon attack events. Checks if the attack originated from this weapon, if the owner meets the skill requirement, and whether luck roll succeeds; if so, spawns a Lunarplant Tentacle near the target.
* **Parameters:**
  - `owner` (`Entity`): The entity performing the attack.
  - `attack_data` (`table or nil`): Attack metadata including `weapon` and `target`. Function exits early if `nil` or the weapon does not match.

## Events & Listeners
- Listens to `equipped` → triggers `_equipped_callback`
- Listens to `unequipped` → triggers `_unequipped_callback`
- Listens to `onattackother` on owner → triggers `_on_attack`
- Listens to `onremove` on owner → triggers `_erase_owner`