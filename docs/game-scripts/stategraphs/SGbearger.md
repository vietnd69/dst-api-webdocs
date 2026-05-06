---
id: SGbearger
title: Sgbearger
description: This stategraph defines the complete animation state machine for the Bearger boss entity, including combat states (melee, combo, ground pound, butt slam, yawn), locomotion (walk, run, stand transitions), sleep mechanics, and common state integrations.
tags: [stategraph, boss, combat, ai, behaviour]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 2f9ce8c5
system_scope: combat
---

# Sgbearger

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

Stategraphs are animation state machines accessed via `StartStateGraph()`, not called as utility functions. This stategraph controls the Bearger boss entity's complete behavior including combat (melee attacks, combo attacks, ground pound, butt slam, yawn), locomotion (walking, running, stand state transitions between bi and quad), and sleep/yawn mechanics that affect nearby entities. The Bearger uses a targeting system with tracking arcs and supports multiple attack patterns based on hibernation state and target type. CommonStates are integrated for frozen, electrocute, death, and sink behaviors.

## Usage example

```lua
-- Bearger stategraph is attached to the Bearger entity prefab
-- State transitions are triggered by events or AI brain decisions
local bearger = SpawnPrefab("bearger")

-- Trigger attack sequence
bearger:PushEvent("doattack", { target = player })

-- Check current state for AI decisions
if bearger.sg:HasStateTag("attack") then
    -- Bearger is in attack animation, don't approach
end

-- Listen for state completion
bearger:ListenForEvent("animover", function(inst)
    -- Animation finished, transition to next state
end)

-- Handle being hit
bearger:ListenForEvent("attacked", function(inst, data)
    -- Hit recovery or stagger logic
end)
```

## Dependencies & tags

**External dependencies:**
- `stategraphs/commonstates` -- CommonStates.AddCorpseStates, AddFrozenStates, AddElectrocuteStates, AddSinkAndWashAshoreStates, AddVoidFallStates, AddLunarRiftMutationStates, AddInitState, OnLocomote, OnSleepEx, OnWakeEx, OnFreeze, OnElectrocute, OnDeath, OnSink, OnFallInVoid, OnCorpseChomped, OnCorpseDeathAnimOver, TryElectrocuteOnAttacked, HitRecoveryDelay, UpdateHitRecoveryDelay, OnNoSleepFrameEvent
- `easing` -- imported but never referenced (unused import)
- `TheSim` -- FindEntities to search for entities in range
- `TUNING` -- BEARGER_YAWN_RANGE, BEARGER_YAWN_SLEEPTIME, BEARGER_MELEE_RANGE, BEARGER_YAWN_COOLDOWN, BEARGER_NORMAL_GROUNDPOUND_COOLDOWN, BEARGER_ANGRY_WALK_SPEED, BEARGER_CALM_WALK_SPEED, BEARGER_RUN_SPEED, MUTATED_BEARGER_STAGGER_TIME
- `DEGREES` -- rotation conversion constant
- `RADIANS` -- angle conversion constant
- `PI` -- math constant for angle calculations
- `FRAMES` -- animation frame timing constant
- `CAMERASHAKE` -- camera shake type constants (FULL, VERTICAL)
- `ACTIONS` -- GOHOME, STEAL, HAMMER, EAT, PICKUP, HARVEST, PICK, ATTACK action handlers

**Components used:**
- `combat` -- StartAttack, DoAttack, CanTarget, TargetIs, CalcAttackRangeSq, ignorehitrange, target
- `eater` -- CanEat to filter inventory items
- `freezable` -- IsFrozen to skip frozen entities in yawn
- `pinnable` -- IsStuck to skip pinned entities in yawn
- `fossilizable` -- IsFossilized to skip fossilized entities in yawn
- `rider` -- GetMount to apply sleep to mounted entities
- `sleeper` -- AddSleepiness, IsAsleep, WakeUp for sleep state management
- `grogginess` -- AddGrogginess for yawn effect
- `inventory` -- FindItem, ArmorHasTag for inventory clearing and heavy armor detection
- `timer` -- StartTimer, StopTimer, TimerExists for yawn, groundpound, and stagger cooldowns
- `locomotor` -- StopMoving, Stop, WalkForward, RunForward, walkspeed, runspeed
- `workable` -- GetWorkAction, CanBeWorked, Destroy for collapsing structures
- `health` -- IsDead to skip dead entities in attacks
- `groundpounder` -- GroundPound for ground pound and butt slam attacks

**Tags:**
- `busy`, `idle`, `canrotate`, `hit`, `yawn`, `attack`, `weapontoss`, `moving`, `running`, `atk_pre`, `sleeping`, `nowake`, `waking`, `nosleep`, `staggered`, `noelectrocute`, `dead`, `noattack`, `caninterrupt`, `jumping`, `nointerrupt` -- add
- `playerghost`, `FX`, `DECOR`, `INLIMBO`, `sleeper`, `player`, `beehive`, `hibernation`, `NPC_workable`, `_combat`, `flight`, `invisible`, `notarget`, `heavyarmor`, `heavybody`, `honeyed` -- check

## Properties

### State Reference

| State name | Tags | Description |
|------------|------|-------------|
| `bi` | `busy` | Transition state for two-legged stance |
| `quad` | `busy` | Transition state for four-legged stance |
| `idle` | `idle`, `canrotate` | Default idle state |
| `targetstolen` | `busy`, `canrotate` | Reaction when combat target is stolen |
| `hit` | `hit`, `busy` | Hit recovery from quad stance |
| `standing_hit` | `hit`, `busy` | Hit recovery from bi stance |
| `yawn` | `yawn`, `busy` | Yawn animation applying sleepiness to nearby entities |
| `attack_action` | None | Buffered action handler for attack |
| `attack` | `attack`, `busy`, `weapontoss` | Basic melee attack with swipe |
| `attack_combo1` | `attack`, `busy`, `jumping`, `weapontoss` | First combo attack with jump |
| `attack_combo2` | `attack`, `busy`, `jumping`, `weapontoss` | Second combo attack with jump |
| `attack_combo1a` | `attack`, `busy`, `jumping`, `weapontoss` | Alternate first combo attack |
| `pound` | `attack`, `busy` | Ground pound attack |
| `butt_pre` | `attack`, `busy` | Butt slam windup (standing) |
| `running_butt_pre` | `attack`, `busy` | Butt slam windup (from run) |
| `butt` | `attack`, `busy`, `jumping`, `nointerrupt` | Main butt slam attack |
| `butt_pst` | `attack`, `busy`, `jumping`, `noelectrocute` | Butt slam recovery |
| `butt_face_hit` | `hit`, `busy`, `noelectrocute` | Special hit state during butt recovery |
| `death` | `dead`, `busy`, `noattack` | Death animation |
| `action` | `busy` | Generic action (pick, harvest) |
| `eat_loop` | `busy` | Eating loop animation |
| `eat_pst` | `busy`, `caninterrupt` | Eat post-animation |
| `steal` | `busy` | Steal action (hammer, steal) |
| `walk_start` | `moving`, `canrotate` | Walk start transition |
| `walk` | `moving`, `canrotate` | Walking loop |
| `walk_stop` | `canrotate` | Walk stop transition |
| `run_start` | `moving`, `running`, `atk_pre`, `canrotate` | Run start transition |
| `run` | `moving`, `running`, `canrotate` | Running loop |
| `run_stop` | `canrotate` | Run stop transition |
| `sleep` | `busy`, `sleeping`, `nowake`, `caninterrupt` | Sleep transition |
| `sleeping` | `busy`, `sleeping` | Sleeping loop |
| `wake` | `busy`, `waking`, `nosleep` | Wake up transition |
| `stagger_pre` | `staggered`, `busy`, `nosleep`, `noelectrocute` | Stagger windup |
| `stagger_pre_timeline_from_frame3` | `staggered`, `busy`, `nosleep`, `noelectrocute` | Stagger pre from frame 3 |
| `stagger_idle` | `staggered`, `busy`, `caninterrupt`, `nosleep` | Stagger idle loop |
| `stagger_hit` | `staggered`, `busy`, `hit`, `nosleep` | Stagger from hit |
| `stagger_pst` | `staggered`, `busy`, `nosleep` | Stagger recovery |

**Injected states:** CommonStates.AddCorpseStates, AddFrozenStates, AddElectrocuteStates, AddSinkAndWashAshoreStates, AddVoidFallStates, AddLunarRiftMutationStates inject additional states for corpse, frozen, electrocute, sink, void fall, and mutation behaviors.

### File-scope constants

| Constant | Type | Value | Description |
|----------|------|-------|-------------|
| `SHAKE_DIST` | constant (local) | `40` | Camera shake distance threshold |
| `YAWNTARGET_CANT_TAGS` | table (local) | `{"playerghost", "FX", "DECOR", "INLIMBO"}` | Tags excluded from yawn targeting |
| `YAWNTARGET_ONEOF_TAGS` | table (local) | `{"sleeper", "player"}` | Tags required for yawn targeting |
| `COLLAPSIBLE_WORK_ACTIONS` | table (local) | `{CHOP=true, DIG=true, HAMMER=true, MINE=true}` | Work actions that trigger structure collapse |
| `COLLAPSIBLE_TAGS` | table (local) | `NPC_workable` + `_workable` variants | Tags for collapsible entities |
| `NON_COLLAPSIBLE_TAGS` | table (local) | `{"FX", "DECOR", "INLIMBO"}` | Tags excluded from destruction |
| `ARC` | constant (local) | `90 * DEGREES` | Arc angle for arc attacks (degrees to each side) |
| `AOE_RANGE_PADDING` | constant (local) | `3` | Padding added to AOE attack radius |
| `AOE_TARGET_MUSTHAVE_TAGS` | table (local) | `{"_combat"}` | Required tags for AOE targeting |
| `AOE_TARGET_CANT_TAGS` | table (local) | `{"INLIMBO", "flight", "invisible", "notarget", "noattack"}` | Tags excluded from AOE targeting |
| `MAX_SIDE_TOSS_STR` | constant (local) | `0.8` | Maximum knockback strength multiplier for side toss |
| `COMBO_ARC_OFFSET` | constant (local) | `0.5` | Distance offset for combo arc attacks |
| `TRACKING_ARC` | constant (local) | `90` | Angle threshold for target tracking |
| `IDLE_FLAGS` | table (local) | `{Aggro=0x01, Calm=0x02, NoFaced=0x04}` | Bit flags for idle state behavior |

## Main functions

### `yawnfn(inst)`
* **Description:** Applies sleepiness or grogginess to nearby entities within yawn range. Checks for frozen, pinned, or fossilized status before applying effects. Pushes ridersleep event to mounts, yawn event to players, or AddSleepiness/AddGrogginess to other entities.
* **Parameters:**
  - `inst` -- entity instance owning the stategraph
* **Returns:** `true`
* **Error states:** None

### `ClearInventory(inst)`
* **Description:** Removes all eatable items from the entity's inventory by repeatedly finding and removing items that pass the CanEat test.
* **Parameters:**
  - `inst` -- entity instance whose inventory to clear
* **Returns:** `nil`
* **Error states:** None - guards against nil inventory component

### `ChooseAttack(inst, target)`
* **Description:** Determines which attack state to transition to based on target type, running state, hibernation status, and timer existence. Clears inventory if interrupted. Prioritizes beehive attacks, running butt, yawn, ground pound, or standard attack.
* **Parameters:**
  - `inst` -- entity instance owning the stategraph
  - `target` -- optional target entity; defaults to combat.target
* **Returns:** boolean - true if attack state was entered, false if no valid target
* **Error states:** None - guards against invalid targets

### `DestroyStuff(inst, dist, radius, arc, nofx)`
* **Description:** Destroys workable entities within range that match collapsible tags. Calculates position offset based on rotation and distance. Spawns collapse_small prefab for visual effect unless nofx is true.
* **Parameters:**
  - `inst` -- entity instance performing destruction
  - `dist` -- distance offset from entity position
  - `radius` -- search radius for entities
  - `arc` -- angle arc constraint in radians; nil for full circle
  - `nofx` -- boolean to skip spawning collapse FX
* **Returns:** `nil`
* **Error states:** None

### `DoArcAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Performs arc-shaped melee attack hitting entities within angle constraint. Sets ignorehitrange on combat component. Applies knockback event with strength multiplier adjusted for heavy armor. Tracks targets in provided table.
* **Parameters:**
  - `inst` -- entity instance performing attack
  - `dist` -- distance offset from entity position
  - `radius` -- attack radius
  - `heavymult` -- knockback multiplier for heavy armor targets
  - `mult` -- standard knockback multiplier
  - `forcelanded` -- boolean to force landed state on knockback
  - `targets` -- table to track hit targets
* **Returns:** `nil`
* **Error states:** None

### `DoComboArcAttack(inst, targets)`
* **Description:** Wrapper for DoArcAttack with combo-specific parameters (COMBO_ARC_OFFSET offset, BEARGER_MELEE_RANGE radius, multiplier of 1).
* **Parameters:**
  - `inst` -- entity instance performing attack
  - `targets` -- table to track hit targets
* **Returns:** `nil`
* **Error states:** None

### `DoComboArcWork(inst)`
* **Description:** Calls DestroyStuff with combo-specific parameters to destroy workables during combo attack.
* **Parameters:**
  - `inst` -- entity instance performing work
* **Returns:** `nil`
* **Error states:** None

### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets, knockback_existing_targets)`
* **Description:** Performs area-of-effect attack hitting all entities within radius. Attacks new targets via combat:DoAttack. Applies knockback to new or existing targets based on knockback_existing_targets flag.
* **Parameters:**
  - `inst` -- entity instance performing attack
  - `dist` -- distance offset from entity position
  - `radius` -- attack radius
  - `heavymult` -- knockback multiplier for heavy armor targets
  - `mult` -- standard knockback multiplier
  - `forcelanded` -- boolean to force landed state on knockback
  - `targets` -- table to track hit targets
  - `knockback_existing_targets` -- boolean to apply knockback to already-hit targets
* **Returns:** `nil`
* **Error states:** None

### `TryStagger(inst)`
* **Description:** Transitions entity to stagger_pre state. Used as a helper for stagger transitions from various states.
* **Parameters:**
  - `inst` -- entity instance to stagger
* **Returns:** `true`
* **Error states:** None

### `IsAggro(inst)`
* **Description:** Returns true if entity has a combat target that is not a beehive. Used to determine aggressive vs calm behavior.
* **Parameters:**
  - `inst` -- entity instance to check
* **Returns:** boolean
* **Error states:** None

### `StartTrackingTarget(inst, target)`
* **Description:** Stores target reference and position in state memory. Rotates entity toward target if within TRACKING_ARC degrees. Sets tracking flag in statemem.
* **Parameters:**
  - `inst` -- entity instance doing tracking
  - `target` -- target entity to track
* **Returns:** `nil`
* **Error states:** None - guards against nil or invalid target

### `UpdateTrackingTarget(inst)`
* **Description:** Updates stored target position each frame while tracking is active. Smoothly rotates entity toward target position, clamping rotation change to 1 unit per update.
* **Parameters:**
  - `inst` -- entity instance doing tracking
* **Returns:** `nil`
* **Error states:** None

### `StopTrackingTarget(inst)`
* **Description:** Clears the tracking flag in state memory, ending target tracking behavior.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None

### `ShouldComboTarget(inst, target)`
* **Description:** Checks if target is valid for combo attack continuation. Verifies target is current combat target, within attack range, and within TRACKING_ARC degrees of entity rotation.
* **Parameters:**
  - `inst` -- entity instance checking target
  - `target` -- potential combo target
* **Returns:** boolean
* **Error states:** None

### `ShouldButtTarget(inst, target)`
* **Description:** Checks if target is valid for butt attack. Verifies target is valid and not dead/ghost, within 64 distance units, and within TRACKING_ARC degrees behind entity (180 degree offset).
* **Parameters:**
  - `inst` -- entity instance checking target
  - `target` -- potential butt attack target
* **Returns:** boolean
* **Error states:** None

### `TryButt(inst)`
* **Description:** Attempts to transition to butt_pre state if butt recovery is not active and a valid butt target exists. Checks stored statemem target first, then combat target.
* **Parameters:**
  - `inst` -- entity instance attempting butt attack
* **Returns:** boolean - true if butt state was entered
* **Error states:** None

### `SpawnSwipeFX(inst, offset, reverse)`
* **Description:** Spawns swipe visual effect prefab if inst.swipefx is set. Parents FX to entity, positions at offset, and optionally reverses animation. Stores FX reference in statemem.
* **Parameters:**
  - `inst` -- entity instance spawning FX
  - `offset` -- X offset for FX position
  - `reverse` -- boolean to reverse the FX animation
* **Returns:** `nil`
* **Error states:** None

### `KillSwipeFX(inst)`
* **Description:** Removes and clears the stored swipe FX from statemem if it exists and is valid.
* **Parameters:**
  - `inst` -- entity instance owning the FX
* **Returns:** `nil`
* **Error states:** None

### `ShakeIfClose(inst)`
* **Description:** Triggers full camera shake for all cameras within 40 units. Used for death and major impacts.
* **Parameters:**
  - `inst` -- entity instance causing shake
* **Returns:** `nil`
* **Error states:** None

### `ShakeIfClose_Pound(inst)`
* **Description:** Triggers vertical camera shake for all cameras within 40 units. Used for ground pound and butt slam attacks.
* **Parameters:**
  - `inst` -- entity instance causing shake
* **Returns:** `nil`
* **Error states:** None

### `ShakeIfClose_Footstep(inst)`
* **Description:** Triggers lighter full camera shake for all cameras within 40 units. Used for footstep impacts.
* **Parameters:**
  - `inst` -- entity instance causing shake
* **Returns:** `nil`
* **Error states:** None

### `DoFootstep(inst)`
* **Description:** Plays footstep sound based on stand state (soft for quad, stomp for bi). Triggers footstep camera shake for bi state.
* **Parameters:**
  - `inst` -- entity instance taking step
* **Returns:** `nil`
* **Error states:** None

### `GoToStandState(inst, state, customtrans, params)`
* **Description:** Transitions entity to specified stand state (bi or quad) if not already in that state. Uses customtrans animation if provided, otherwise uses standard transition.
* **Parameters:**
  - `inst` -- entity instance transitioning
  - `state` -- target stand state name (bi or quad)
  - `customtrans` -- optional custom transition animation
  - `params` -- optional parameters for transition
* **Returns:** boolean - true if transition occurred
* **Error states:** None

## Events & listeners

**Listens to:**
- `doattack` -- Triggers ChooseAttack to enter attack state; guarded by busy and dead checks
- `attacked` -- Handles hit recovery, stagger, and electrocute; clears inventory if interrupted
- `animover` -- Transitions to next state when animation completes
- `animqueueover` -- Transitions to next state when animation queue completes
- `timerdone` -- Handles stagger timer completion to transition to stagger_pst
- `stagger` -- Triggers stagger state; sets dostagger flag if already busy

**Pushes:**
- `ridersleep` -- Pushed to mounts during yawn; applies sleepiness to riders
- `yawn` -- Pushed to players during yawn; applies grogginess and knockout duration
- `knockedout` -- Pushed to entities without sleeper/grogginess components during yawn
- `knockback` -- Pushed during arc and AOE attacks; applies knockback force with strength multiplier
- `onmissother` -- Pushed when attack hits no targets; used by ChaseAndAttack behavior
- `docollapse` -- Pushed to sinkhole prefab to trigger collapse animation