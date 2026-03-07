---
id: shadowthrall_horns
title: Shadowthrall Horns
description: A boss enemy prefab with shadow-aligned alignment, using custom combat logic, brain, and team-based state synchronization.
tags: [combat, ai, boss, shadow]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fd22b345
system_scope: entity
---

# Shadowthrall Horns

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadowthrall_horns` is a boss entity prefab that functions as a shadow-aligned hostile monster. It utilizes a dedicated brain (`SGshadowthrall_horns`), integrates with an entity tracker system for coordinated team behavior (via "hands" and "wings" sub-entities), and implements custom retargeting and deaggro logic. It spawns FX entities (flames and fabric effects), supports dynamic colour syncing, handles loot dropping with a custom loot table, and includes sanity aura and planar damage capabilities.

## Usage example
```lua
-- Example of spawning a shadowthrall_horns instance with default settings
local horns = SpawnPrefab("shadowthrall_horns")
if horns ~= nil then
    horns.Transform:SetPosition(x, y, z)
    -- Additional setup: ensure master simulation is active for components to initialize fully
    if TheWorld.ismastersim then
        -- Custom modifications may be applied here (e.g., health buff)
        -- horns.components.health:SetMaxHealth(new_health)
    end
end
```

## Dependencies & tags
**Components used:** `colouraddersync`, `combat`, `entitytracker`, `health`, `locomotor`, `lootdropper`, `planardamage`, `sanityaura`, `inspectable`, `drownable`, `planarentity`, `colouradder`, `knownlocations`  
**Tags added:** `monster`, `hostile`, `scarytoprey`, `shadowthrall`, `shadow_aligned`, `FX` (on local FX entities only)  
**Tags checked:** `player`, `debuffed` (indirectly via `combat`), `hiding` (via `combat`)

## Properties
No public properties exposed on the prefab instance itself. Most configuration occurs via `TUNING` constants and component setup.

## Main functions
The prefab itself does not define public methods; the following are key internal callback functions that form part of its behavior.

### `RetargetFn(inst)`
*   **Description:** Determines the new combat target for the shadowthrall_horns when retargeting. Skips retargeting if in "appearing" or "invisible" state. If a valid target is already within attack range, it is retained; otherwise, the closest player within aggro range is selected.
*   **Parameters:** `inst` (Entity) — the shadowthrall_horns instance.
*   **Returns:** `player` (Entity or `nil`) — the selected target entity, or `nil` if no suitable target exists.
*   **Error states:** Returns `nil` if no player is within aggro range or if all candidate targets are invalid (e.g., hidden).

### `KeepTargetFn(inst, target)`
*   **Description:** Determines whether to retain the current combat target. Checks combat validity and proximity to the main entity or its tracked sub-entities ("hands" and "wings").
*   **Parameters:** 
    * `inst` (Entity) — the shadowthrall_horns instance.
    * `target` (Entity) — the current target to evaluate.
*   **Returns:** `true` if the target should be kept; `false` otherwise.
*   **Error states:** Returns `false` if the target is outside deaggro range and not near tracked sub-entities.

### `OnAttacked(inst, data)`
*   **Description:** Reacts to the entity being attacked by switching combat target to the attacker if the current target is out of attack range.
*   **Parameters:** 
    * `inst` (Entity) — the shadowthrall_horns instance.
    * `data` (table) — event payload containing `attacker` (Entity).
*   **Returns:** Nothing.
*   **Error states:** No effect if `data.attacker` is `nil` or if the current target is already within range.

### `OnNewCombatTarget(inst, data)`
*   **Description:** Synchronizes combat targeting across the team: when the main entity gains a new target, suggests the same target to "hands" and "wings" sub-entities.
*   **Parameters:** 
    * `inst` (Entity) — the shadowthrall_horns instance.
    * `data` (table) — event payload with `oldtarget` and `target`.
*   **Returns:** Nothing.
*   **Error states:** Only acts if `oldtarget` is `nil` (new target acquisition) and sub-entity components exist and are combat-capable.

### `OnLoadPostPass(inst)`
*   **Description:** Ensures state-group memory (`lastattack`) is initialized for the main entity and its team members ("hands", "wings") to prevent state-group startup errors on save/load.
*   **Parameters:** `inst` (Entity) — the shadowthrall_horns instance.
*   **Returns:** Nothing.

### `GetWintersFeastOrnaments(inst)`
*   **Description:** Returns ornament data for Winters Feast event loot generation.
*   **Parameters:** `inst` (Entity) — the shadowthrall_horns instance.
*   **Returns:** `{ basic = 1, special = "winter_ornament_shadowthralls" }` if both "hands" and "wings" sub-entities are absent; otherwise `nil`.
*   **Error states:** Returns `nil` if either sub-entity exists.

### `CreateFlameFx()`
*   **Description:** Spawns and configures a local-only FX entity for flame animation on the shadowthrall_horns.
*   **Parameters:** None.
*   **Returns:** FX entity (Entity).
*   **Error states:** Only runs on non-dedicated servers; FX is non-persistent and not networked.

### `CreateFabricFx()`
*   **Description:** Spawns and configures a local-only FX entity for fabric animation.
*   **Parameters:** None.
*   **Returns:** FX entity (Entity).

### `OnColourChanged(inst, r, g, b, a)`
*   **Description:** Updates highlight FX children with new colour values when the entity’s colour changes.
*   **Parameters:** 
    * `inst` (Entity) — the shadowthrall_horns instance.
    * `r`, `g`, `b`, `a` (numbers) — colour channel values (0.0 to 1.0).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
    * `attacked` — triggers `OnAttacked` to update combat target on damage receipt.
    * `newcombattarget` — triggers `OnNewCombatTarget` to coordinate team targeting.
- **Pushes:** None directly; relies on component-level event pushing (e.g., `combat` component).