---
id: trident
title: Trident
description: A magical trident that enables远程 wave-spawned explosions on water and interacts with fish, plants, and structures in the ocean.
tags: [combat, ocean, magic, tool, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b29cfb2
system_scope: world
---

# Trident

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `trident` prefab functions as a magical ranged weapon that casts water-based spells. When used, it triggers area-of-effect explosions on the ocean surface, dealing damage to ocean-bound entities, launching fish and kelp as projectiles, damaging structures, and interacting with tendable farm plants. It consumes finite uses and supports inventory operations, equippable animations, and spellcasting logic via the `spellcaster` component.

## Usage example
```lua
local inst = SpawnPrefab("trident")
inst.components.finiteuses:SetUses(10)
inst.components.spellcaster:Spell(target_position)
```

## Dependencies & tags
**Components used:** `reticule`, `weapon`, `finiteuses`, `inventoryitem`, `tradable`, `equippable`, `spellcaster`, `inspectable`, `boatphysics`, `combat`, `complexprojectile`, `farmplanttendable`, `pickable`, `health`, `workable`, `oceanfishable`, `weighable`, `stackable`, `inventoryitemmoisture`.

**Tags:** Adds `allow_action_on_impassable`, `guitar`, `pointy`, `sharp`, `weapon`, `USESDEPLETED` (on exhaustion).

## Properties
No public properties.

## Main functions
### `do_water_explosion_effect(affected_entity, owner, position)`
*   **Description:** Applies gameplay effects to a target entity based on its components. May deal damage, launch fish/loot as projectiles, uproot kelp, or trigger platform-specific leak effects.
*   **Parameters:**  
    - `affected_entity` (Entity) — the entity struck in the explosion radius.  
    - `owner` (Entity) — the entity that used the trident.  
    - `position` (Vector3) — the location of the explosion.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; silently skips entities lacking applicable components.

### `create_water_explosion(inst, target, position)`
*   **Description:** Core spell function. Locates entities within spell radius on ocean tiles, applies `do_water_explosion_effect` to ocean-bound ones, spawns visual particles (crab_king_waterspout or boat leaks), and uses finite charges.
*   **Parameters:**  
    - `inst` (Entity) — the trident instance.  
    - `target` (unused in function body, kept for signature compatibility)  
    - `position` (Vector3) — the cast location.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `GetGrandOwner()` yields `nil`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `healthdelta`, `stacksizechange`, `percentusedchange`, `on_landed`, `on_no_longer_landed`, `equipskinneditem`, `unequipskinneditem`, `toolbroke`, `spawnnewboatleak`, and `buffed`-style event for tending plants.

The `FiniteUses` component also pushes `percentusedchange` and calls `on_uses_finished` when `current <= 0`, which emits `toolbroke` on the owner.