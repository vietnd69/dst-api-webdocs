---
id: lunarplant_tentacle_weapon
title: Lunarplant Tentacle Weapon
description: Spawns lunar tentacles as secondary attacks when equipped and used in combat, conditional on skill tree activation.
tags: [combat, equipment, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 617a3306
system_scope: combat
---

# Lunarplant Tentacle Weapon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LunarPlant_Tentacle_Weapon` is a passive weapon component that triggers the spawning of lunar tentacles upon the owner's successful attacks. It listens for `equipped`/`unequipped` events to attach/detach event callbacks to its owner, and responds to `onattackother` to attempt tentacle spawns. A conditional function (`should_do_tentacles_fn`) controls whether tentacle spawns occur — by default, it checks for the `"wormwood_allegiance_lunar_plant_gear_2"` skill activation via the `skilltreeupdater` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("combatweapon")
inst:AddComponent("lunarplant_tentacle_weapon")
inst.components.lunarplant_tentacle_weapon.spawn_chance = 0.25
inst.components.lunarplant_tentacle_weapon.tentacle_prefab = "lunarplanttentacle"
```

## Dependencies & tags
**Components used:** `combat`, `skilltreeupdater` (via `owner.components.skilltreeupdater` in condition)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawn_chance` | number | `0.2` | Probability (0.0–1.0) that a tentacle spawns per qualifying attack. |
| `tentacle_prefab` | string | `"lunarplanttentacle"` | Prefab name to spawn for tentacles. |
| `should_do_tentacles_fn` | function | `DefaultLunarPlantTentacleCondition` | Callback `(weapon, owner, attack_data) -> boolean` determining if tentacles should spawn. |
| `owner` | EntityInstance or `nil` | `nil` | Entity currently equipped with this weapon; set automatically via `equipped`/`unequipped` events. |

## Main functions
### `SetOwner(owner)`
*   **Description:** Assigns the weapon's owner and registers/deregisters event listeners for `onattackother` and `onremove` on the owner.
*   **Parameters:** `owner` (EntityInstance or `nil`) — the entity wielding the weapon.
*   **Returns:** Nothing.
*   **Error states:** No direct error states; safely handles `nil` owner.

### `OnAttack(owner, attack_data)`
*   **Description:** Attempts to spawn a lunar tentacle near the target of an attack, provided attack conditions are met and the luck roll succeeds.
*   **Parameters:**  
    `owner` (EntityInstance) — the entity performing the attack.  
    `attack_data` (table) — attack event payload, must include `weapon` (entity) and `target` (entity).
*   **Returns:** Nothing.
*   **Error states:**  
    - Returns early if `attack_data` is `nil` or `attack_data.weapon ~= self.inst`.  
    - Returns early if `should_do_tentacles_fn` returns `false`.  
    - Tentacle spawn may silently fail if `FindWalkableOffset` or `SpawnPrefab` returns `nil`.

## Events & listeners
- **Listens to (on `self.inst`):**  
  - `equipped` — triggers `_equipped_callback`, which calls `SetOwner(data.owner)`.  
  - `unequipped` — triggers `_unequipped_callback`, which calls `SetOwner(nil)`.  
- **Listens to (on `owner`):**  
  - `onattackother` — triggers `_on_attack`, which calls `OnAttack`.  
  - `onremove` — triggers `_erase_owner`, which sets `self.owner = nil`.  
- **Pushes:** None.
