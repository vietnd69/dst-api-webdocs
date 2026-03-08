---
id: SGfused_shadeling
title: Sgfused Shadeling
description: Manages the state machine and behavior transitions for the Fused Shadeling boss enemy, including idle movement, jumping, attacking, being hit, taunting, teleporting, and despawning.
tags: [combat, ai, boss, physics]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 28dda915
system_scope: entity
---

# Sgfused Shadeling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfused_shadeling` is the stategraph defining the full behavioral lifecycle of the `fused_shadeling` boss entity. It handles transitions between states such as idle wandering, jumping (with speed decay and knockback), attacking via combat component, getting hit (triggering teleportation), taunting ( interrupting damage immunity), spawning/despawning sequences, and managing temporary invulnerability. It leverages `CommonHandlers` and `CommonStates` utilities to integrate standard movement and state transitions, while directly interacting with the `combat`, `health`, `locomotor`, `lootdropper`, `timer`, and `miasmamanager` components during execution.

## Usage example
```lua
-- Typically added to the fused_shadeling prefab definition in prefabs/fused_shadeling.lua
inst:AddTag("shadeling")
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddComponent("locomotor")
inst:AddComponent("lootdropper")
inst:AddComponent("timer")
inst:AddComponent("miasmamanager") -- via world component

-- Stategraph is attached at prefab creation time by DST engine
-- Manual state changes are done via:
inst.sg:GoToState("attack", target)
inst.sg:GoToState("hit")
inst.sg:GoToState("jump_pre", target_position)
```

## Dependencies & tags
**Components used:**  
- `combat` (`DoAttack`, `DropTarget`, `StartAttack`, `TryAttack`, `target`)  
- `health` (`IsDead`)  
- `locomotor` (`Stop`, `StopMoving`, `EnableGroundSpeedMultiplier`)  
- `lootdropper` (`DropLoot`)  
- `timer` (`StartTimer`)  
- `miasmamanager` (`GetMiasmaAtPoint`, `IsMiasmaActive` via `TheWorld.components.miasmamanager`)  

**Tags:**  
- Added: `idle`, `canrotate`, `busy`, `noattack`, `jumping`, `attack`, `hit`, `taunt`, `temp_invincible`, `invisible`  
- State tags added dynamically: `noattack`, `temp_invincible`, `invisible`, `busy`, `jumping`, `attack`, `hit`, `taunt`  
- Removed: `noattack`, `busy`, `temp_invincible`, `invisible`, `NOCLICK` (via state transitions)  

## Properties
No public properties. All state-specific data is stored in `inst.sg.mem` or `inst.sg.statemem`.

## Main functions
This file defines a `StateGraph`, not a component class; therefore it returns no callable methods. State behavior is implemented via state entries in the `states` table and `events` array. Stategraph entry points are controlled by the engine via `inst.sg:GoToState()`.

### CommonHandlers.OnLocomote and OnDeath
*   **Description:** Event handlers provided by `stategraphs/commonstates.lua` that automatically transition the entity to `walk` or `death` states in response to locomotion and health events.
*   **Parameters:** None (defined externally).
*   **Returns:** Nothing.

### `go_to_idle(inst)`
*   **Description:** Helper function to transition the entity back to the `idle` state.
*   **Parameters:** `inst` (EntityInstance) - the shadeling entity instance.
*   **Returns:** Nothing.

### `teleport_test_fn(test_position)`
*   **Description:** Predicate function used during teleportation to verify that a candidate position has miasma present.
*   **Parameters:** `test_position` (Vector3) - candidate world position.
*   **Returns:** `true` if `GetMiasmaAtPoint()` returns non-nil at that position, else `false`.

### `do_teleport(inst)`
*   **Description:** Attempts to find a walkable position within a miasma-enabled radius and teleports the shadeling there. Used during hit/teleport transitions.
*   **Parameters:** `inst` (EntityInstance) - the shadeling entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` – triggers idle repetition or next transition after animation completes.  
  - `animqueueover` – fires on death state conclusion to remove the entity.  
  - `doattack` – initiates the `attack` state if not busy or dead.  
  - `attacked` – triggers the `hit` state, possibly followed by `teleport_pre` (on random chance or lighter weapon hit).  
  - `try_jump` – initiates `jump_pre` with provided jump target if not busy.  
  - `do_despawn` – sets `persists = false`, marks `despawning`, and transitions to `despawn_pre`.  
  - `locomote` – via `CommonHandlers.OnLocomote` (not explicitly listed, but implies movement event handling).  
  - `death` – via `CommonHandlers.OnDeath` (transition to `death`).  

- **Pushes:**  
  - `droppedtarget` – via `combat:DropTarget()` (only if no next target).  
  - `doattack` – via `combat:DoAttack()` during attack timeline.  
  - Events from component interactions (e.g., `SetPosition` by bomb spawner) are not pushed by this stategraph itself.  
