---
id: SGshadowthrall_wings
title: Sgshadowthrall Wings
description: Manages the animation, state transitions, attack logic, and projectile spawning for the Shadow Thrall wings entity in Don't Starve Together.
tags: [ai, combat, boss, projectile, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: de8b3640
system_scope: ai
---

# Sgshadowthrall Wings

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadowthrall_wings` is a stategraph component that controls the behavioral states and animations of the Shadow Thrall's wings entity. It coordinates attack sequencing, projectile launching (via `complexprojectile`), synchronization with parent and sibling entities (hands/horns), shadow scaling, and loot dropping on death. The stategraph integrates with multiple components including `combat`, `entitytracker`, `locomotor`, and `lootdropper`, and relies heavily on `commonstates` for shared logic like locomotion and death handling.

## Usage example
```lua
-- This stategraph is automatically attached to the shadowthrall_wings prefab.
-- It is not directly instantiated by modders.
-- Typical usage occurs internally when the parent thrall triggers an attack:
inst.components.combat:SetTarget(target)
inst.components.combat:StartAttack()
-- The wings entity receives the "doattack" event and transitions to "cast"
-- to spawn radial projectiles.
```

## Dependencies & tags
**Components used:** `combat`, `complexprojectile`, `entitytracker`, `locomotor`, `lootdropper`  
**Tags added/removed:** `busy`, `idle`, `canrotate`, `noattack`, `temp_invincible`, `invisible`, `appearing`, `hit`, `attack`, `caninterrupt`, `canmove`, `noattack DuringDeath`, `NOCLICK`, `activeprojectile`  
**Tags checked:** `attack`, `hiding`

## Properties
No public properties exposed. Internal state is stored in `inst.sg.mem` and `inst.sg.statemem`.

## Main functions
The stategraph uses state callbacks (`onenter`, `onupdate`, `timeline`, `events`) rather than standalone functions. Key internal functions:

### `ChooseAttack(inst, data)`
*   **Description:** Determines if the wings can initiate an attack. Checks if "hands" or "horns" sub-entities are currently attacking. If valid target exists and no conflict, transitions to the `cast` state with the target.
*   **Parameters:** `inst` (Entity) — the wings entity instance; `data` (table or nil) — event data containing `target` field.
*   **Returns:** `true` if attack is initiated, `false` otherwise.

### `SetShadowScale(inst, scale)`
*   **Description:** Sets the dynamic shadow size during post-spawn phases.
*   **Parameters:** `inst` (Entity); `scale` (number) — multiplier for shadow dimensions.
*   **Returns:** Nothing.

### `SetSpawnShadowScale(inst, scale)`
*   **Description:** Sets temporary shadow size during spawning animation.
*   **Parameters:** `inst` (Entity); `scale` (number) — multiplier for shadow dimensions.
*   **Returns:** Nothing.

### `SetTeamAttackCooldown(inst, isstart)`
*   **Description:** Synchronizes attack timing between wings and its sibling "hands" and "horns" components. Sets shared cooldown and assigns formation angles for coordinated positioning around the target.
*   **Parameters:** `inst` (Entity); `isstart` (boolean) — `true` to set attack start time, `false` to restart cooldown.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `doattack` — triggers attack sequence if not busy and valid target exists.
- **Pushes:** None (uses common stategraph events like `animover`, `locomote`, `attacked`, `death` via `CommonHandlers`).

(stategraph ends with `return StateGraph("shadowthrall_wings", states, events, "idle")`)