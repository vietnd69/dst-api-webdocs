---
id: SGwagboss_robot
title: Sgwagboss Robot
description: Manages the high-level behavior and state transitions of the Wagboss Robot boss entity, including attack selection, projectile targeting, AOEs, and camera effects.
tags: [entity, boss, combat, animation, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 53dd72ed
system_scope: entity
---

# Sgwagboss Robot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGwagboss_robot` stategraph defines the core behavioral logic for the Wagboss Robot boss entity in Don't Starve Together. It orchestrates attack patterns (orbital strikes, missile barrages, leaps, stomps, and tantrums), manages combat states (idle, walk, hit, stomp, leap, missiles, signal), handles environmental interactions (item tossing, workable destruction), and triggers screen shake and visual effects. It integrates with multiple component systems — `combat`, `health`, `locomotor`, `temperature`, `grouptargeter`, `workable`, and others — to dynamically respond to the game world and player actions. The stategraph is self-contained, with no external module dependencies beyond DST's core utilities.

## Usage example
The stategraph is automatically instantiated and attached to the boss entity via the game's entity initialization flow (e.g., in `prefabs/wagboss_robot.lua`). Typical usage involves triggering state transitions through events:
```lua
-- During combat, the boss queues an attack via 'doattack'
inst:PushEvent("doattack", { target = player_entity })

-- When hit, the 'attacked' event may interrupt ongoing attacks
inst:PushEvent("attacked", { attacker = player_entity })

-- State transitions are managed internally via timeline events and `inst.sg:GoToState("state_name")`
```
External code rarely interacts directly with this stategraph; instead, it acts on the entity's `components` (e.g., `inst.components.combat:Attack(target)`), and the stategraph reacts via registered event listeners.

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `timer`, `commander`, `grouptargeter`, `workable`, `temperature`, `fueled`, `burnable`, `freezable`, `inventory`, `mine`, `planardamage`

**Tags:**  
`idle`, `canrotate`, `off`, `busy`, `noattack`, `nointerrupt`, `caninterrupt`, `missiles_target_fail`, `hit`, `attack`, `moving`, `jumping`, `dead`, `missiles`, `first_missile`, `NOCLICK`, `hacking`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
### `_CollectMissileTargetEntities(x, z, r, tbl)`
* **Description:** Finds entities within a circular radius `r` centered at `(x, z)` that match heat-related or combat-relevant tags (e.g., heated, combat-active, not frozen). Returns a sparse table keyed by entity reference with value `true`. If `tbl` is provided, it populates and returns that table instead.
* **Parameters:** `x` (number, x-coordinate), `z` (number, z-coordinate), `r` (number, radius), `tbl` (optional table, result accumulator).
* **Returns:** Table with entity instances as keys and `true` as values.

### `_DistSqToNearestMissile(ent, _missiles)`
* **Description:** Computes the squared distance from entity `ent` to the nearest missile in `_missiles`, based on the missile's stored `.targetpos`. Used for target separation during selection.
* **Parameters:** `ent` (entity), `_missiles` (table of missile entities, each with `.targetpos`).
* **Returns:** Number (squared distance), or `math.huge` if no missiles exist.

### `_FindMissileTargets(inst, maxtargets, targets, _missiles)`
* **Description:** Collects valid missile targets for the boss by scanning for entities within heat threshold, not soldiers (via `commander`), and not already targeted if `_missiles` is provided. Supports deduplication and spacing optimization.
* **Parameters:** `inst` (boss entity), `maxtargets` (integer, maximum targets to return), `targets` (optional output table populated with `{ent=..., temp=..., dsq=...}` tables), `_missiles` (optional table of active missiles).
* **Returns:** Boolean (`true` if any valid targets found); if `targets` provided, returns `true` only if `#targets > 0`.

### `CollectMissileTargets`
* **Description:** Public alias for `_FindMissileTargets`. Used in the `"missiles"` state to populate the current target list before firing.
* **Parameters:** Same as `_FindMissileTargets`.
* **Returns:** Same as `_FindMissileTargets`.

### `TryRetargetMissiles(inst, data)`
* **Description:** Periodically recalculates missile targets during `"missiles"` or `"missiles_idle"` states to update aim points for moving or newly spawned targets. Avoids re-targeting already-locked missiles unless necessary. Validates boss state (not dead or out of combat) before proceeding.
* **Parameters:** `inst` (boss entity), `data` (table containing `{missiles = {...}, task = timer task, grouptargets = ...}`).
* **Returns:** None (side effects only; modifies missile target positions and `inst.sg.statemem`).

### `GenerateSelections(targets, numtoselect, _out, _seq, _i0, _n)`
* **Description:** Recursively generates all combinations of size `numtoselect` from the `targets` list using backtracking. Used by `_FindOrbitalStrikeTargets` to evaluate spread configurations.
* **Parameters:** `targets` (list), `numtoselect` (integer), `_out` (output accumulator), `_seq` (current partial selection), `_i0` (start index), `_n` (current recursion depth).
* **Returns:** List of combinations, each a list of target entities.

### `_FindOrbitalStrikeTargets(inst, targets)`
* **Description:** Finds valid targets for an orbital strike — either within the arena when active or within a fixed range otherwise. For > `maxtargets`, selects the most spatially spread-out subset by evaluating pairwise distances (cached by GUID pairs) and using `GenerateSelections` to optimize.
* **Parameters:** `inst` (boss entity), `targets` (optional output table of entities).
* **Returns:** Boolean (`true` if any targets found).

### `HasAnyOrbitalStrikeTarget`
* **Description:** Convenience wrapper to check if orbital strike targets exist without populating a list.
* **Parameters:** `inst` (entity).
* **Returns:** Boolean.

### `TryOrbitalStrike(inst)`
* **Description:** Spawns `wagboss_beam_fx` prefabs for each orbital target and clears the internal target table. Returns `true` only if beams were spawned.
* **Parameters:** `inst` (entity).
* **Returns:** Boolean (`true` if at least one beam spawned).

### `ChooseAttack(inst, target)`
* **Description:** Decides which attack to execute next based on attack cooldowns, target availability, and boss state (e.g., health thresholds). Prioritizes orbital strike > missile barrage > leap > tantrum > stomp, and falls back to `"idle"` if no valid attack. Queues the selected state via `inst.sg:GoToState(...)`.
* **Parameters:** `inst` (entity), `target` (optional entity, fallback target).
* **Returns:** Boolean (`true` if a new state was entered).

### `DoStompShake`
* **Description:** Triggers a vertical camera shake effect during stomp impacts or exits.
* **Parameters:** `inst` (entity, shake origin).
* **Returns:** None.

### `DoFootstepHeavyShake`, `DoFootstepMedShake`, `DoJumpShake`, `GetUpShake1`, `GetUpShake2`, `GetUpShakeLong`
* **Description:** Helper functions to trigger frame-specific screen shake with varying intensities. Used via timeline events during animations (e.g., heavy footstep, jump, getting up).
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `OnUpdateLeap(inst, dt)`
* **Description:** Called per frame during leap states (`leap_pre`, `leap`, `leap_pst`). Adjusts entity velocity and rotation toward target, applies deceleration upon landing/locking, and scales speed dynamically based on height/distance.
* **Parameters:** `inst` (entity), `dt` (delta time).
* **Returns:** None.

### `_AOEAttack(inst, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Applies area-of-effect damage/knockback to all entities within `radius`. Skips soldiers (via `commander`) and entities already in `targets`. Applies extra knockback if `heavymult` > 0 and handles "heavy armor" (via `inventory`) and "nobounce" (via `inventoryitem`) checks.
* **Parameters:** `inst` (entity), `radius` (number), `heavymult` (number), `mult` (number), `forcelanded` (boolean), `targets` (table for tracking applied targets).
* **Returns:** None.

### `_AOEWork(inst, radius, targets)`
* **Description:** Destroys workable objects (e.g., trees, rocks) within `radius` if their work actions are collapsible (via `workable.work_action`). Handles `nil` work_action or NPC_workable cases gracefully.
* **Parameters:** `inst` (entity), `radius` (number), `targets` (table for tracking applied workables).
* **Returns:** None.

### `_TossLaunch(inst, x0, z0, basespeed, startheight)`
* **Description:** Launches an item toward the boss (at `x0, z0`) with randomized direction, speed, and height using physics.
* **Parameters:** `inst` (item entity), `x0` (boss x), `z0` (boss z), `basespeed` (number), `startheight` (number).
* **Returns:** None.

### `_TossItems(inst, radius)`
* **Description:** Finds items within `radius`, deactivates mines (via `mine` component), and launches inventory items (skipping "nobounce" items) toward the boss using physics.
* **Parameters:** `inst` (boss entity), `radius` (number).
* **Returns:** None.

### `DoStompAOE`, `DoKickAOE`
* **Description:** Convenience wrappers invoking `_AOEWork`, `_AOEAttack`, and `_TossItems` (or just `_AOEAttack`) with fixed radius values for stomp/kick attacks.
* **Parameters:** `inst` (entity), `targets` (table for tracking).
* **Returns:** None.

### `SetShadowScale(inst, scale)`
* **Description:** Dynamically resizes the boss's dynamic shadow to match leap height or animations.
* **Parameters:** `inst` (entity), `scale` (number, scale factor).
* **Returns:** None.

### `StartStompFx`, `StopStompFx`
* **Description:** Activate/deactivate stomp-specific visual and physical effects (e.g., particle effects, ground cracks). Accepts optional `force` flag to bypass state checks.
* **Parameters:** `inst` (entity), `force` (optional boolean).
* **Returns:** None.

### `StartBackFx`, `StopBackFx`
* **Description:** Control back-layer visual effects (e.g., energy glow, sparks) during the `"death"` state.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `AddAlterSymbols`, `ClearAlterSymbols`
* **Description:** Manage layering of alter phase transition symbols (e.g., orbs, icons) during boss transitions in the `"death"` state.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `HackDrones`
* **Description:** Applies a hacking effect to nearby drones (e.g., temporary control, visual feedback) during `"signal_loop"`.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `SkipBarragePhase`
* **Description:** Called when missile barrage fails (no targets); transitions directly from `"missiles_idle"` to a post-barrage state.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `ErodeAway`
* **Description:** Triggers particle/destruction effects (e.g., crumbling, fading) at frame 220 of the `"death"` state.
* **Parameters:** `inst` (entity).
* **Returns:** None.

### `GetTime`
* **Description:** Returns the current simulation time (via `GetTime()` global), used for effects like flicker intervals.
* **Parameters:** None.
* **Returns:** Number.

### `GetRandomMinMax`
* **Description:** Returns a random float between `min` and `max`, used for randomized cooldowns (e.g., `TUNING.WAGBOSS_ROBOT_*_CD`).
* **Parameters:** `min` (number), `max` (number).
* **Returns:** Number.

### `SpawnPrefab`
* **Description:** Spawns a new prefab instance (e.g., `"wagboss_missile"`, `"alterguardian_phase4_lunarrift"`, `"wagboss_robot_leg"`).
* **Parameters:** `name` (string).
* **Returns:** Entity instance of the spawned prefab.

### `Launch2`
* **Description:** Launches legs toward a target (e.g., active alter) during `"death"` with physics. Used as `Launch2(leg, inst, 7, 4, 3, 2, 15 + math.random() * 4, dir1)`.
* **Parameters:** `leg` (entity), `inst` (boss), `7` (speed), `4` (rot speed), `3` (rot damp), `2` (lift), `15 + math.random() * 4` (height), `dir1` (direction).
* **Returns:** None.

### `ClearSpotForRequiredPrefabAtXZ`
* **Description:** Clears physics collision and entities at `(x, z)` in `"turnoff"` to prevent stuck colliders.
* **Parameters:** `x` (number), `z` (number).
* **Returns:** None.

### `ToggleOffCharacterCollisions`, `ToggleOnCharacterCollisions`
* **Description:** Toggle collision with player characters during `"turnoff"` (off state entry/exit).
* **Parameters:** `inst` (entity, implied).
* **Returns:** None.

## Events & listeners
- **Listens to:** `locomote` — Updates walk state based on locomotor forward movement.
- **Listens to:** `doattack` — Triggers `ChooseAttack` if not `busy`; queues attack in `"hit"` state via `inst.sg.statemem.doattack`.
- **Listens to:** `activate` — Attempts `"activate"` state transition if `"off"` and not `nointerrupt`; defers otherwise.
- **Listens to:** `losecontrol` — Attempts `"losecontrol"` state if not `busy`; defers otherwise.
- **Listens to:** `deactivate` — Attempts `"turnoff"` state if not `off`/`dead` and not `nointerrupt`; defers otherwise.
- **Listens to:** `death` — Attempts `"death"` state if not `dead`/`nointerrupt`; defers otherwise.
- **Listens to:** `animover` — Transitions to `"idle"` on animation finish unless state-specific override exists (e.g., `leap` → `leap_pst`, `missiles_hit` → `missiles_idle`/`missiles_pst`).
- **Listens to:** `attacked` — Interrupts ongoing `"missiles_idle"` or `"missiles_hit"` states to enter `"missiles_hit"` for recovery.
- **Pushes:** None identified (event pushing handled externally via entity state transitions).