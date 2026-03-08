---
id: commonstates
title: Commonstates
description: Provides reusable state definitions and event handlers for common entity behaviors such as movement, sleep, freezing, electrocution, death, and hopping.
tags: [stategraph, entity, movement, combat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 28bc56a4
system_scope: entity
---

# Commonstates

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `commonstates.lua` file defines a collection of reusable state definitions and event handlers for managing core gameplay behaviors in DST entities. It centralizes logic for locomotion (idle/walking/running/hopping), status states (sleep, freeze/thaw, electrocute), death-related transitions (corpse, fossilize, void fall, drowning), and combat reactions (hit, attack). It integrates tightly with components like `freezable`, `pinnable`, `health`, `drownable`, `sleeper`, `combat`, `inventory`, and `locomotor` via `inst:ListenForEvent()` and direct component calls, and it extensively uses `AnimState` and state-local memory (`inst.sg.mem`) to coordinate animations, physics, and networked behavior.

## Usage example
```lua
local states = {}
CommonStates.AddIdle(states, "funny_idle", nil, idle_timeline)
CommonStates.AddRunStates(states, run_timelines, run_anims, true, false, run_fns)
CommonStates.AddWalkStates(states, walk_timelines, walk_anims, true, false, walk_fns)
CommonStates.AddSleepStates(states, sleep_timelines, sleep_fns)
CommonStates.AddCombatStates(states, combat_timelines, combat_anims, combat_fns, data)
CommonStates.AddElectrocuteStates(states, electrocute_timelines, electrocute_anims, electrocute_fns)
CommonStates.AddFrozenStates(states)
CommonStates.AddSinkAndWashAshoreStates(states, sink_anims, sink_timelines, sink_fns)
```

## Dependencies & tags
**Components used:**
- `freezable`: Used to check/unfreeze (`:IsFrozen()`, `:Unfreeze()`), query thawing status (`:IsThawing()`), and extend freeze duration (`:OnExtend()`).
- `pinnable`: Used to check/unstick (`:IsStuck()`, `:Unstick()`).
- `drownable`: Used to determine falling reason (`:GetFallingReason()`), handle drowning conditions (`:ShouldDrown()`), manage sinking/washed-ashore/void-fall logic (`:OnFallInOcean()`, `:WashAshore()`, `:OnFallInVoid()`, `:VoidArrive()`, `:TakeDrowningDamage()`).
- `health`: Used to check death state (`:IsDead()`), set invincibility (`:SetInvincible()`).
- `sleeper`: Used to wake up (`:WakeUp()`), check sleep state (`:IsAsleep()`).
- `combat`: Used to inspect attack types (`lastattacktype`, `laststimuli`), check cooldown (`:InCooldown()`), start attacks (`:StartAttack()`), drop targets (`:DropTarget()`).
- `burnable`: Used to check burning state (`:IsBurning()`) and ignite (`:Ignite(...)`).
- `inventory`: Used to check insulation (`:IsInsulated()`).
- `locomotor`: Used for movement state (`:WantsToMoveForward()`, `:WantsToRun()`), control (`:StopMoving()`, `:WalkForward()`, `:RunForward()`), and track movement state (`.isrunning`, `.dest`, `.wantstomoveforward`, `.runspeed`).
- `embarker`: Used for embark coordination (`:GetEmbarkPosition()`, `:StartMoving()`, `:Embark()`, `:HasDestination()`, `:Cancel()`).
- `fossilizable`: Used for FX generation (`:OnSpawnFX()`) and lifecycle hooks (`:OnFossilize()`, `:OnExtend()`, `:OnUnfossilize()`).
- `amphibiouscreature`: Used in amphibious hop states (`:OnEnterOcean()`, `:OnExitOcean()`).
- `playercontroller`: Used to detect client-side logic (`isclientcontrollerattached`).
- `buffered action`: Used to inspect and execute buffered actions (`GetBufferedAction()`, `PerformBufferedAction()`, `PerformPreviewBufferedAction()`, `ClearBufferedAction()`).
- `physics`: Used to stop/modify collision (`Stop()`, `GetCollisionMask()`, `SetCollisionMask()`).
- `transform`: Used for orientation (`GetWorldPosition()`, `SetRotation()`, `GetAngleToPoint()`).
- `dynamicshadow`: Used to enable/disable shadows (`Enable()`).
- `sg.mem`, `statemem`: Used for state-local memory (e.g., `inst.sg.mem.thawing`, `continuesleeping`, `sleeping`).
- `anim`: Via `inst.AnimState` (`PlayAnimation`, `PushAnimation`, `OverrideSymbol`, `ClearOverrideSymbol`, `GetCurrentAnimationNumFrames`).
- `soundemitter`: Used to play/kills sounds (`PlaySound`, `KillSound`).

**Tags:**
- `"idle"`, `"moving"`, `"running"`, `"walking"` — added/checked in movement states.
- `"busy"` — added to nearly all action-blocking states (sleep, hop, attack, hit, death, electrocute, frozen, thaw, corpse, row, sink, abyss_fall, ipecacpoop, parasite_revive, lunarrift states).
- `"sleeping"`, `"waking"`, `"nowake"`, `"nosleep"`, `"continuesleeping"` — added/checked in sleep states.
- `"frozen"`, `"thawing"`, `"swap_frozen"` — added/checked in freeze/thaw states.
- `"hit"`, `"attack"`, `"electrocute"`, `"noelectrocute"`, `"nointerrupt"`, `"caninterrupt"`, `"electricdamageimmune"` (commented, unused).
- `"corpse"`, `"noattack"`, `"NOCLICK"`, `"NOBLOCK"`, `"dead"` — added/checked in corpse and related states.
- `"drowning"`, `"falling"`, `"nopredict"`, `"nomorph"`, `"silentmorph"`, `"caninterrupt"` (in some states).
- `"rowing"`, `"row_fail"`, `"is_rowing"`, `"is_row_failing"` — added to row states.
- `"jumping"`, `"boathopping"`, `"autopredict"`, `"nosleep"`, `"nomorph"`, `"nointerrupt"`, `"ignorewalkableplatforms"`, `"swimming"` — added/checked in hop states.
- `"lunarrift_mutating"`, `"temp_invincible"` — added in lunar rift mutation states.
- `"prerift_mutating"` — added in pre-rift mutation states.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_last_hitreact_time` | number | `nil` | Timestamp of last hit reaction (`GetTime()`). Used to enforce recovery delay. |
| `_last_hitreact_count` | number | `nil` | Count of hit reactions. Used to cap max hit reacts. |
| `_last_electrocute_time` | number | `nil` | Timestamp of last electrocution. |
| `_last_electrocute_delay` | number | `nil` | Previous electrocute delay used for resist decay. |
| `inst.hit_recovery` | number | `TUNING.DEFAULT_HIT_RECOVERY` | Default hit recovery delay override. |
| `inst.frozen_duration` | number | `TUNING.FROZEN_DURATION` | Default frozen state duration. |
| `inst.electrocute_duration` | number | `TUNING.ELECTROCUTE_DURATION` | Default electrocute loop duration. |
| `inst.corpse_duration` | number | `TUNING.CORPSE_DURATION` | Default corpse duration before fading. |

## Main functions

### `ClearStatusAilments(inst)`
* **Description:** Unfreezes and unsticks the entity by checking `freezable:IsFrozen()` and `pinnable:IsStuck()`, calling `Unfreeze()` and `Unstick()` respectively.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onstep(inst)`
* **Description:** Plays the `"dontstarve/movement/run_dirt"` sound if `inst.SoundEmitter` exists and the entity is moving.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onsleep(inst)`
* **Description:** Determines and transitions the stategraph to appropriate sleep/falling states (`"sink"`, `"abyss_fall"`, `"sleeping"`, or `"sleep"`) based on drownable falling reason and state tags. Skips if dead or in `"electrocute"`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onsleepex(inst)`
* **Description:** Internal handler for `gotosleep` event; checks conditions and transitions to `"sleep"` or sink/abyss states if falling. Skips if `"nosleep"`/`"sleeping"` or dead.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onwakeex(inst)`
* **Description:** Internal handler for `onwakeup` event; wakes entity via `sleeper:WakeUp()` and transitions to `"wake"` if not `"nowake"` or dead.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onfreeze(inst)`
* **Description:** Transitions to `"frozen"` state if entity has a `health` component and is not dead.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onfreezeex(inst)`
* **Description:** Similar to `onfreeze`, but allows freezing even if `health` component is missing (improved V2C variant).
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onfossilize(inst, data)`
* **Description:** Attempts to transition to `"fossilized"` state unless dead or already fossilized; if `"nofreeze"` tag present, executes FX-only fallback (`fossilizable:OnSpawnFX()`).
* **Parameters:** `inst`, `data` — event data passed through.
* **Returns:** None.

### `onunfreeze(inst)`
* **Description:** Transitions to `"hit"` (if available) or `"idle"` on unfreeze.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onthaw(inst)`
* **Description:** Sets `inst.sg.statemem.thawing = true` and transitions to `"thaw"`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onenterfrozenpre(inst)`
* **Description:** Pre-frozen setup: plays `"frozen"` looping animation, sound, and sets `"swap_frozen"` override symbol to `"frozen"`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onenterfrozenpst(inst)`
* **Description:** Post-frozen check: re-evaluates state transitions based on `freezable` component status (thawing, unfrozen, missing).
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onenterfrozen(inst)`
* **Description:** Calls `onenterfrozenpre(inst)` and `onenterfrozenpst(inst)` sequentially.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onexitfrozen(inst)`
* **Description:** Clears `"swap_frozen"` override symbol unless `inst.sg.statemem.thawing` is true.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onenterthawpre(inst)`
* **Description:** Pre-thaw setup: stops locomotion, plays `"frozen_loop_pst"`, starts `"thawing"` sound, and sets `"swap_frozen"` override symbol to `"frozen"`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onenterthawpst(inst)`
* **Description:** Post-thaw check: if `freezable` is absent or not frozen, calls `onunfreeze(inst)`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onenterthaw(inst)`
* **Description:** Calls `onenterthawpre(inst)` and `onenterthawpst(inst)` sequentially.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `onexitthaw(inst)`
* **Description:** Kills `"thawing"` sound and clears `"swap_frozen"` override symbol.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `hit_recovery_delay(inst, delay, max_hitreacts, skip_cooldown_fn)`
* **Description:** Returns `true` if the entity is currently in a hit reaction cooldown. Implements projectile-specific recovery time, max hit reacts, and optional cooldown bypass.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `delay` — optional override for hit recovery duration (default: `inst.hit_recovery` or `TUNING.DEFAULT_HIT_RECOVERY`).  
  - `max_hitreacts` — optional max hit reacts before enforced cooldown.  
  - `skip_cooldown_fn` — optional function returning `true` to bypass cooldown.  
* **Returns:** `true` if still in cooldown, `false` otherwise.

### `electrocute_recovery_delay(inst)`
* **Description:** Returns `true` if the entity is in an electrocute recovery delay window; handles first-hit no-delay and resist decay logic.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if still in cooldown, `false` otherwise.

### `update_hit_recovery_delay(inst)`
* **Description:** Updates `_last_hitreact_time` to current time (`GetTime()`), resetting the hit react timer.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `update_electrocute_recovery_delay(inst)`
* **Description:** Updates electrocute-related timers and resist decay, including max resist cap increase.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `CommonHandlers.ResetHitRecoveryDelay(inst)`
* **Description:** Clears hit recovery state variables `_last_hitreact_time` and `_last_hitreact_count`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `CommonHandlers.ResetElectrocuteRecoveryDelay(inst)`
* **Description:** Clears electrocute recovery state variables `_last_electrocute_time` and `_last_electrocute_delay`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `attack_can_electrocute(inst, data)`
* **Description:** Returns `true` if the incoming attack is electric and can electrocute this entity (checks `stimuli == "electric"`, `weaponoverride`, or `attacker.electricattacks`).
* **Parameters:**  
  - `inst` — the entity instance.  
  - `data` — attack event data.  
* **Returns:** `true` if electrocutable, `false` otherwise.

### `spawn_electrocute_fx(inst, data, duration)`
* **Description:** Spawns `"electrocute_fx"` prefab, sets its target, parameters (duration, noburn, numforks), and returns the spawned FX.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `data` — optional event/data with `attackdata`, `duration`, `noburn`, `numforks`, etc.  
  - `duration` — optional override duration.  
* **Returns:** The spawned FX instance (`fx`).

### `try_goto_electrocute_state(inst, data, state, statedata, ongotostatefn)`
* **Description:** Attempts to go to `"electrocute"` or fallback states (`"corpse_hit"`, `"hit"`) based on entity capabilities and available states. Handles burn ignition, status cleanup, and animation states.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `data` — event/data with `attackdata`, `duration`, `noburn`, `numforks`, etc.  
  - `state` — optional override state name.  
  - `statedata` — optional override state data.  
  - `ongotostatefn` — optional callback after state transition.  
* **Returns:** `true` if transition succeeded, `false` otherwise.

### `try_electrocute_onattacked(inst, data, state, statedata, ongotostatefn)`
* **Description:** Evaluates electrocution conditions (`CanEntityBeElectrocuted`, `attack_can_electrocute`, insulation, resistances, interruptability), then calls `try_goto_electrocute_state`.
* **Parameters:** Same as `try_goto_electrocute_state`.
* **Returns:** Result of `try_goto_electrocute_state`.

### `try_electrocute_onevent(inst, data, state, statedata, ongotostatefn)`
* **Description:** Similar to `try_electrocute_onattacked`, but for generic `"electrocute"` events (e.g., environmental triggers). Checks insulation, SG flags, resistances.
* **Parameters:** Same as `try_goto_electrocute_state`.
* **Returns:** `true` if electrocuted, else `false`.

### `onattacked(inst, data, hitreact_cooldown, max_hitreacts, skip_cooldown_fn)`
* **Description:** Core handler for `"attacked"` event: attempts electrocution or fallback to `"hit"` state, respecting interrupt and cooldown constraints.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `data` — attack event data.  
  - `hitreact_cooldown`, `max_hitreacts`, `skip_cooldown_fn` — optional overrides for hit recovery logic.  
* **Returns:** None.

### `onelectrocute(inst, data)`
* **Description:** Event handler for `"electrocute"` event — attempts `try_electrocute_onevent` unless dead.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `data` — event data.  
* **Returns:** None.

### `onattack(inst)`
* **Description:** Transitions to `"attack"` state unless currently `"busy"` (unless `"caninterrupt"` or `"frozen"` tags present).
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `should_use_corpse_state_on_load(inst, cause)`
* **Description:** Returns `true` if the entity should enter the `"corpse"` state upon load (i.e., if `cause == "file_load"`, has a corpse, and `GetDeathLootLevel() > 0`).
* **Parameters:**  
  - `inst` — the entity instance.  
  - `cause` — the cause string (e.g., `"file_load"`).  
* **Returns:** Boolean.

### `ondeath(inst, data)`
* **Description:** Transitions to `"corpse"` or `"death"` state depending on `should_use_corpse_state_on_load`.
* **Parameters:**  
  - `inst` — the entity instance.  
  - `data` — event data (e.g., with `cause`).  
* **Returns:** None.

### `onsink(inst, data)`
* **Description:** Handler for `"onsink"` event: transitions to `"sink"` if drowning conditions are met.
* **Parameters:** `inst`, `data`.
* **Returns:** None.

### `DoWashAshore(inst, skip_splash)`
* **Description:** Teleports entity, spawns splash FX, hides, sets invincibility, and calls `drownable:WashAshore()`.
* **Parameters:**  
  - `inst`.  
  - `skip_splash` — boolean to suppress splash FX.  
* **Returns:** None.

### `onfallinvoid(inst, data)`
* **Description:** Handler for `"onfallinvoid"` event: transitions to `"abyss_fall"` if void-falling conditions are met.
* **Parameters:** `inst`, `data`.
* **Returns:** None.

### `DoVoidFall(inst, skip_vfx)`
* **Description:** Teleports entity to void destination, spawns FX, hides, sets invincibility, calls `drownable:VoidArrive()`.
* **Parameters:**  
  - `inst`.  
  - `skip_vfx`.  
* **Returns:** None.

### `IpecacPoop(inst)`
* **Description:** Transitions to `"ipecacpoop"` state if not `"busy"` or dead.
* **Parameters:** `inst`.
* **Returns:** None.

### `oncorpsedeathanimover(inst)` (local)
* **Description:** Convenience handler: transitions entity to `"corpse"` state upon animation completion if entity is recognized as a corpse.
* **Parameters:**  
  - `inst`: The entity instance.  
* **Returns:** `nil`.

### `oncorpsechomped(inst, data)` (local)
* **Description:** Transitions from `"corpse"` to `"corpse_hit"` on `chomped` event, *unless* already in a `"hit"` state.
* **Parameters:**  
  - `inst`: The entity instance.  
  - `data`: Event data payload.  
* **Returns:** `nil`.

### `GetRowHandAndFacing(inst)`
* **Description:** Calculates row direction and left-hand flag for rowing states on boats, adjusting based on buffered action, facing, and platform physics.
* **Parameters:** `inst` — entity instance (assumed to be on a boat).
* **Returns:** `dir` (float), `lefthand` (boolean), or `nil, nil` if not on boat.

### `PlayMiningFX(inst, target, nosound)`
* **Description:** Spawns appropriate mining FX based on `target` tags (`frozen`, `moonglass`, `crystal`, etc.) and optionally plays sound.
* **Parameters:**  
  - `inst`.  
  - `target` — entity or `nil`.  
  - `nosound` — boolean to suppress sound.  
* **Returns:** None.

## Events & listeners
**Events listened to:**
- `step`: Played run sound in `onstep`.
- `gotosleep`: Triggers `onsleepex` for sleep/falling transitions.
- `onwakeup`: Triggers `onwakeex` for waking.
- `freeze`: Triggers `"frozen"` state via `onfreeze`/`onfreezeex`.
- `fossilize`: Triggers `"fossilized"` or FX-only fallback via `onfossilize`.
- `unfreeze`: Triggers `"hit"` or `"idle"` via `onunfreeze`.
- `onthaw`: Triggers `"thaw"` via `onthaw`.
- `attacked`: Triggers electrocute or hit recovery logic via `onattacked`.
- `electrocute`: Triggers `"electrocute"` state via `onelectrocute`.
- `startelectrocute`: Pushed at `"electrocute"` state entry; triggers `update_electrocute_recovery_delay`.
- `doattack`: Triggers `"attack"` state via `onattack`.
- `death`: Triggers `"corpse"`/`"death"` transition via `ondeath`.
- `locomote`: Handles walk/run transitions via `OnLocomote`.
- `onhop`: Handles hop event in `OnHop`.
- `animover`, `animqueueover`: Transitions on animation completion (various states: sleep, hit, attack, death, electrocute, row, sink, void fall, parasite_revive, hop).
- `done_embark_movement`, `cancelhop`: In hop states for embarker coordination.
- `onsink`: Triggers sink logic via `onsink`.
- `on_washed_ashore`: Triggers `"washed_ashore"` state.
- `onfallinvoid`: Triggers void-fall logic via `onfallinvoid`.
- `on_void_arrive`: Triggers `"abyss_drop"` state.
- `ipecacpoop`: Triggers `"ipecacpoop"` state via `IpecacPoop`.
- `chomped`: Triggers `"corpse_hit"` in corpse via `oncorpsechomped`.
- `unfossilize`: Triggers `"unfossilizing"` (not in source but implied by tag/listeners).
- `fossilize` (extended): Extends frozen/fossilize duration via `fossilizable:OnExtend()`.

**Events pushed:**
- `startelectrocute`: Fired at `"electrocute"` state entry to trigger damage effects.
- `on_washed_ashore`: Triggered via `DoWashAshore`.
- `on_void_arrive`: Triggered via `DoVoidFall`.

