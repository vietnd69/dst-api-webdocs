---
id: SGcrabking
title: Sgcrabking
description: Defines the state machine for the Crab King boss, handling transitions between idle, taunt, casting, healing, and combat states.
tags: [boss, combat, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 180896e2
system_scope: ai
---

# Sgcrabking

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcrabking` is the stategraph responsible for managing the behavioral state transitions of the Crab King boss entity. It orchestrates transitions between idle behavior, taunts, freeze/cast attacks, claw/spawn stacking preparation, healing sequences (including rock repair), and hit/death animations. The stategraph integrates with common combat states (via `CommonStates.AddCombatStates`), freezing and electrocution states, and relies heavily on the `health`, `timer`, `locomotor`, and `boatphysics` components.

## Usage example
The stategraph is applied automatically to the Crab King prefab via its stategraph declaration. No direct instantiation is required. The component is invoked internally by the engine when the entity's state changes:
```lua
-- Internally handled by the entity; example of external influence:
inst:PushEvent("ck_taunt") -- forces Crab King into the "taunt" state
inst:PushEvent("activate", { isload = false }) -- initializes the Crab King in active mode
```

## Dependencies & tags
**Components used:** `health`, `timer`, `locomotor`, `boatphysics`, `heavyobstaclephysics`
**Tags:** Adds state tags including `idle`, `canrotate`, `busy`, `casting`, `spawning`, `fixing`, `fixpre`, `loserock_window`, `inert`, `noattack`, `noelectrocute`, `canwxscan`, `nointerrupt`, `invisible`, `hit`, `healing`, `fixing`

## Properties
No public properties are defined or initialized in the constructor for this stategraph. All state-specific data is stored in `inst.sg.statemem` or `inst` fields at runtime.

## Main functions
### `GetTransitionState(inst)`
*   **Description:** Determines which transition state to enter next based on the Crab King's current intent flags and conditions (e.g., `wantstosummonclaws`, `wantstoheal`, `wantstofreeze`). If multiple flags are set, the order of evaluation is priority-based.
*   **Parameters:** `inst` (Entity instance) — the Crab King entity.
*   **Returns:** string or `nil` — name of the next transition state (e.g., `"taunt"`, `"spawnclaws"`, `"fix_pre"`, `"cast_pre"`), or `nil` if no transition is pending.
*   **Error states:** None. Returns `nil` when no state change is needed.

### `push_nearby_boats(inst)`
*   **Description:** Applies a repulsive force to nearby boats within a radius to simulate water displacement from the Crab King's attack or movement.
*   **Parameters:** `inst` (Entity instance) — the Crab King entity.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if no nearby entities with the `boatphysics` component are found.

### `heal(inst)`
*   **Description:** Triggers health regeneration for the Crab King based on base regen and buffs scaled by orange gem count.
*   **Parameters:** `inst` (Entity instance) — the Crab King entity.
*   **Returns:** Nothing.
*   **Error states:** Regeneration amount is computed using `TUNING.CRABKING_REGEN` and `TUNING.CRABKING_REGEN_BUFF`.

### `testforlostrock(inst, rightarm)`
*   **Description:** Monitors animation progress during healing sequences (`fix_pre`, `fix_loop`) to detect if a rock was lost; if so, transitions to `fix_lostrock` state.
*   **Parameters:** `inst` (Entity instance), `rightarm` (boolean) — indicates which arm is performing the repair.
*   **Returns:** Nothing.
*   **Error states:** Does nothing unless `loserock_window` state tag is active and `regen_stun_cooldown` timer is not running.

### `spawnwaves(inst, numWaves, totalAngle, waveSpeed, wavePrefab, initialOffset, idleTime, instantActivate, random_angle)`
*   **Description:** Helper that forwards arguments to `SpawnAttackWaves` to spawn water-based projectiles during attacks.
*   **Parameters:**  
  - `numWaves` (number) — number of wave groups.  
  - `totalAngle` (number) — angular spread in degrees.  
  - `waveSpeed` (number) — speed of each wave.  
  - `wavePrefab` (string or `nil`) — prefab name.  
  - `initialOffset` (number or `nil`) — offset from center.  
  - `idleTime` (number) — delay between wave groups.  
  - `instantActivate` (boolean) — whether to activate immediately.  
  - `random_angle` (boolean) — whether to randomize rotation.
*   **Returns:** Nothing.

### `throwchunk(inst, prefab)`
*   **Description:** Spawns a chunk prefab (e.g., debris) at the Crab King's position and gives it a randomized physics velocity.
*   **Parameters:**  
  - `inst` (Entity instance) — the Crab King entity.  
  - `prefab` (string) — prefab name to spawn.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `activate` — initializes the entity in active (`inert_pst`) or idle state, starts freeze cooldown, and spawns cannons.  
  - `ck_taunt` — triggers `taunt` state.  
  - `socket` — enters `socket` state when gems are inserted.  
  - `attacked` — triggers hit反应, electrocution check, and potential state transition to `hit_light`.  
  - `animover`, `animqueueover`, `animdone` — drive state transitions on animation completion.  
  - `timerdone` — handles timeouts (e.g., `taunt`, `do_end_cast`).  
  - `startfalling`, `stopfalling` — via `heavyobstaclephysics:AddFallingStates` for crown drop logic.  
  - Freezing and electrocution events injected by `CommonStates.AddFrozenStates` and `CommonStates.AddElectrocuteStates`.  
  - Combat death/hit events via `CommonStates.AddCombatStates`.

- **Pushes:**  
  - `healthdelta` — automatically via `health:DoDelta`.  
  - `startfalling`, `stopfalling` — on crown entity during death.  
  - Custom events like `healthdelta`, `animover`, etc., are pushed internally by the engine or via `inst:PushEvent`.

