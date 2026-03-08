---
id: SGalterguardian_phase3
title: Sgalterguardian Phase3
description: Manages the phase 3 state machine and behavior logic for the Alter Guardian boss in DST.
tags: [ai, boss, combat, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8aa8f043
system_scope: entity
---

# Sgalterguardian Phase3

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGalterguardian_phase3` defines the complete state graph for the Alter Guardian's Phase 3 behavior. It orchestrates movement, combat actions (stab attacks, summoning, trap spawning, beam/sweep attacks), and death sequence via a collection of named states and their transitions. The graph integrates with the `health`, `combat`, `locomotor`, `timer`, `knownlocations`, `grogginess`, and `lootdropper` components to handle targeting, movement, cooldowns, environmental awareness, and loot drops. It also manages visual FX such as laser beams, summon circles, and dynamic lighting.

## Usage example
This stategraph is automatically applied by the Alter Guardian prefab during Phase 3 via `StateGraph` registration. Modders may extend or override behaviors by hooking into its event handlers or custom states in their own `sgalterguardian_phase3.lua` if redefining the boss.

## Dependencies & tags
**Components used:**  
- `combat`: attack timing, target tracking, and cooldown management  
- `health`: death detection and invincibility toggling  
- `locomotor`: movement control (stop/pause)  
- `timer`: summon and trap cooldowns  
- `knownlocations`: geyser position lookup  
- `grogginess`: check for knocked-out players during summoning  
- `lootdropper`: loot generation on death  

**Tags:** States use common tags like `"busy"`, `"idle"`, `"attack"`, `"canrotate"`, `"canroll"`, `"noaoestun"`, `"noattack"`, `"nosleep"`, `"nostun"` to influence AI and gameplay interactions.

## Properties
No public properties are defined. All configuration is externalized to tunings (e.g., `TUNING.ALTERGUARDIAN_PHASE3_*` constants) and local constants at the top of the file.

## Main functions
### `hit_recovery_skip_cooldown_fn(inst, last_t, delay)`
*   **Description:** Determines whether the Alter Guardian can skip attack recovery during stun lock. It returns `true` only if the entity is not dodging, in a combat cooldown, and currently in an `"idle"` state tag.
*   **Parameters:**  
    - `inst`: entity instance (used to check `inst.sg.mem.isdodging`, `inst.components.combat:InCooldown()`, `inst.sg:HasStateTag("idle")`)  
    - `last_t`: not used  
    - `delay`: not used  
*   **Returns:** `true` if recovery can be skipped, `false` otherwise.

### `SpawnBeam(inst, target_pos)`
*   **Description:** Spawns a sequence of laser FX particles (`alterguardian_laser` / `alterguardian_laserempty`) along a straight path from the boss to the target point. Also triggers two light shake effects (initial and secondary blast). Used for the `"atk_beam"` state.
*   **Parameters:**  
    - `inst`: entity instance  
    - `target_pos`: `Vector3` or `Position` object representing the target point  
*   **Returns:** Nothing.

### `SpawnSweep(inst, target_pos)`
*   **Description:** Spawns a cone-shaped sequence of laser FX particles representing a sweeping attack. If `target_pos` is `nil`, performs a fixed-radius arc in front of the boss. Also triggers two light shake effects. Used for the `"atk_sweep"` state.
*   **Parameters:**  
    - `inst`: entity instance  
    - `target_pos`: optional `Vector3` or `Position` object  
*   **Returns:** Nothing.

### `start_summon_circle(inst)`
*   **Description:** Spawns and positions the visual FX for the summoning circle and overlay effect (`alterguardian_phase3circle` and `alterguardian_summon_fx`).
*   **Parameters:** `inst` (entity instance)  
*   **Returns:** Nothing.

### `stop_summon_circle(inst)`
*   **Description:** Cleans up summon FX objects and ends looping FX.
*   **Parameters:** `inst` (entity instance)  
*   **Returns:** Nothing.

### `SpawnLargeGestaltChanceMult(inst, chance, luck)`
*   **Description:** Computes adjusted spawn chance for large Gestalt projectiles using a luck-based formula. Returns increased chance for negative luck and decreased chance for positive luck.
*   **Parameters:**  
    - `chance`: base probability (number)  
    - `luck`: player luck value (number)  
*   **Returns:** Adjusted probability (number).

### `do_summon_spawn(inst)`
*   **Description:** Spawns Gestalt projectiles toward players in range. Filters out ghosts and knocked-out players. If no eligible players are found, sets `inst.sg.statemem.ready_to_finish = true`.
*   **Parameters:** `inst` (entity instance)  
*   **Returns:** Nothing.

### `do_stab_attack(inst)`
*   **Description:** Executes a melee stab attack using `combat:DoAttack()` on the target stored in `inst.sg.statemem.target`.
*   **Parameters:** `inst` (entity instance)  
*   **Returns:** Nothing.

### `post_attack_idle(inst)`
*   **Description:** Resets the `"runaway_blocker"` timer and transitions the state machine to `"idle"`.
*   **Parameters:** `inst` (entity instance)  
*   **Returns:** Nothing.

### `set_lightvalues(inst, val)`
*   **Description:** Dynamically adjusts the boss’s light intensity, radius, and falloff based on a `val` parameter (typically `0.0–1.0`). A linear scaling function for visual feedback.
*   **Parameters:**  
    - `inst` (entity instance)  
    - `val` (number): scale factor for light properties  
*   **Returns:** Nothing.

### `laser_sound(inst)`
*   **Description:** Placeholder for an optional second blast sound during laser attacks. Currently commented out.
*   **Parameters:** `inst` (entity instance)  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `"doattack"` - triggers attack state selection logic (`"atk_stab"`, `"atk_traps"`, `"atk_beam"`, `"atk_sweep"`, or `"atk_summon_pre"`)  
    - `"animover"` - handles animation completion transitions  
    - `"endtraps"` - exits trap attack state  
    - `"ontimeout"` - exits trap attack state if animation does not complete in time  
    - Death-related `CommonHandlers.OnDeath()`  
    - Locomotion and attack damage handling via `CommonHandlers.OnLocomote()` and `CommonHandlers.OnAttacked()`

- **Pushes:**  
    - `invincibletoggle` (via `health:SetInvincible()`)  
    - `"moonboss_defeated"` (on death)  
    - `"entity_droploot"` (via `lootdropper:DropLoot()`)