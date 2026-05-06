---
id: commonstates
title: Commonstates
description: This file defines the CommonStates and CommonHandlers tables containing reusable state definitions, event handlers, and helper functions for entity stategraphs, including locomotion, combat, sleep, freeze, fossilize, electrocute, death, corpse management, rowing, drowning, void falling, lunar mutations, and gestalt possession behaviors.
tags: [stategraphs, locomotion, combat, entities, ai]
sidebar_position: 10

last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 4f633ff0
system_scope: entity
---

# Commonstates

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`commonstates.lua` provides a comprehensive library of reusable state definitions and event handlers for Don't Starve Together entity stategraphs. The file exports two primary tables: `CommonStates` for adding complete state groups (idle, walk, run, hop, sleep, frozen, combat, death, corpse, rowing, sinking, void falling, mutations, and possession), and `CommonHandlers` for standardized event handlers (attacked, electrocute, sleep, wake, death, locomote, and more). These helpers abstract common stategraph patterns, reducing duplication across entity definitions while ensuring consistent behavior for status ailments, locomotion transitions, combat reactions, and special mechanics like drowning or lunar mutations. Modders can extend existing stategraphs by calling these helper functions to inject standardized states without reimplementing core logic.

## Usage example
```lua
local CommonStates = require("stategraphs/commonstates")
local CommonHandlers = require("stategraphs/commonstates")

-- Add standard idle and walk states to a stategraph
CommonStates.AddIdle(states, nil, "idle_anim")
CommonStates.AddSimpleWalkStates(states, "walk")

-- Add combat states with custom callbacks
CommonStates.AddCombatStates(states, nil, nil, {
    onhitanimover = function(inst) inst.components.health:DoDamage(10) end
})

-- Use CommonHandlers for standardized event handling
events = {
    CommonHandlers.OnAttacked(1.5, 3),
    CommonHandlers.OnSleep(),
    CommonHandlers.OnDeath(),
}
```

## Dependencies & tags
**External dependencies:**
- `easing` -- Required module imported via require()

**Components used:**
- `freezable` -- IsFrozen(), Unfreeze() called to manage freeze status
- `pinnable` -- IsStuck(), Unstick() called to manage pin status
- `health` -- IsDead() checked before state transitions
- `drownable` -- GetFallingReason() called during sleep handling
- `fossilizable` -- OnSpawnFX() called during fossilization
- `combat` -- lastattacktype, laststimuli, InCooldown() accessed for hit recovery
- `sleeper` -- WakeUp() called during electrocute
- `burnable` -- Ignite(), IsBurning() called during electrocute
- `inventory` -- IsInsulated() checked for electrocute immunity
- `locomotor` -- WantsToMoveForward(), WantsToRun(), RunForward(), StopMoving() for movement
- `weapon` -- overridestimulifn, stimuli accessed for electric attack detection
- `electricattacks` -- Checked on attacker for electric attack source
- `embarker` -- GetEmbarkPosition, StartMoving, Cancel, Embark, HasDestination, antic accessed in hop states
- `amphibiouscreature` -- OnEnterOcean, OnExitOcean called in amphibious hop states
- `herdmember` -- Leave called in sink onexit
- `playercontroller` -- isclientcontrollerattached checked in GetRowHandAndFacing
- `gestaltcapturable` -- GetIsPlanar() called to determine planar status during possession

**Tags:**
- `creaturecorpse` -- check
- `epic` -- check
- `electrocute` -- add/check
- `jumping` -- add/check
- `sleeping` -- add/check
- `nofreeze` -- check
- `fossilized` -- add/check
- `idle` -- add/check
- `busy` -- add/check
- `caninterrupt` -- add/check
- `frozen` -- add/check
- `dead` -- add/check
- `nointerrupt` -- add/check
- `noelectrocute` -- add/check
- `canelectrocute` -- check
- `moving` -- add/check
- `running` -- add/check
- `canrotate` -- add/check
- `doing` -- add/check
- `swimming` -- add/check
- `ignorewalkableplatforms` -- add/check
- `boathopping` -- add/check
- `autopredict` -- add/check
- `nomorph` -- add/check
- `nosleep` -- add/check
- `waking` -- add/check
- `nowake` -- add/check
- `thawing` -- add/check
- `hit` -- add/check
- `attack` -- add/check
- `nopredict` -- add/check
- `rowing` -- add/check
- `is_rowing` -- add/check
- `row_fail` -- add/check
- `is_row_failing` -- add/check
- `drowning` -- add/check
- `silentmorph` -- add/check
- `falling` -- add/check
- `noattack` -- add/check
- `corpse` -- add/check
- `prerift_mutating` -- add/check
- `lunarrift_mutating` -- add/check
- `temp_invincible` -- add/check
- `NOCLICK` -- add
- `NOBLOCK` -- add
- `moonglass` -- check
- `LunarBuildup` -- check
- `crystal` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions





### `CommonHandlers.OnStep()`
* **Description:** Returns an EventHandler for the 'step' event that plays movement sounds.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonHandlers.OnSleep()`
* **Description:** Returns an EventHandler for the 'gotosleep' event.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonHandlers.OnFreeze()`
* **Description:** Returns an EventHandler for the 'freeze' event.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonHandlers.OnFreezeEx()`
* **Description:** Returns an EventHandler for the 'freeze' event using the extended handler.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonHandlers.OnFossilize()`
* **Description:** Returns an EventHandler for the 'fossilize' event.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None









### `CommonHandlers.ResetHitRecoveryDelay(inst)`
* **Description:** Resets hit recovery delay tracking by clearing last hit react time and count.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `CommonHandlers.ResetElectrocuteRecoveryDelay(inst)`
* **Description:** Resets electrocute recovery delay tracking by clearing last electrocute time and delay.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `CommonHandlers.HitRecoveryDelay(inst, delay, max_hitreacts, skip_cooldown_fn)`
* **Description:** Calculates hit recovery delay, returns true if entity is still in hit reaction cooldown. Handles projectile and electric attack modifiers.
* **Parameters:**
  - `inst` -- Entity instance
  - `delay` -- Custom delay time or nil to use default
  - `max_hitreacts` -- Maximum hit reactions before cooldown
  - `skip_cooldown_fn` -- Optional function to determine if cooldown should be skipped
* **Returns:** boolean - true if on cooldown
* **Error states:** None

### `CommonHandlers.ElectrocuteRecoveryDelay(inst)`
* **Description:** Checks if entity is in electrocute recovery delay based on last electrocute time and resistance.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** boolean - true if on delay
* **Error states:** None

### `CommonHandlers.UpdateHitRecoveryDelay(inst)`
* **Description:** Updates the last hit react time to current time.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `CommonHandlers.UpdateElectrocuteRecoveryDelay(inst)`
* **Description:** Updates electrocute recovery delay tracking, managing resistance decay and timing.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** nil
* **Error states:** None

### `CommonHandlers.AttackCanElectrocute(inst, data)`
* **Description:** Determines if an attack can cause electrocute based on electric stimuli and weapon properties.
* **Parameters:**
  - `inst` -- Target entity instance
  - `data` -- Attack data including stimuli and weapon info
* **Returns:** boolean
* **Error states:** None

### `CommonHandlers.SpawnElectrocuteFx(inst, data, duration)`
* **Description:** Spawns electrocute visual FX on the target entity.
* **Parameters:**
  - `inst` -- Target entity instance
  - `data` -- Attack data
  - `duration` -- Optional duration override for the FX
* **Returns:** fx entity instance
* **Error states:** None

### `CommonHandlers.TryGoToElectrocuteState(inst, data, state, statedata, ongotostatefn)`
* **Description:** Attempts to transition entity to electrocute or hit state, spawning FX and clearing status ailments.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Attack/event data
  - `state` -- Optional state override
  - `statedata` -- Optional state data override
  - `ongotostatefn` -- Optional callback after state transition
* **Returns:** boolean - true if successful
* **Error states:** None

### `CommonHandlers.TryElectrocuteOnAttacked(inst, data, state, statedata, ongotostatefn)`
* **Description:** Checks all conditions for electrocute on attacked and attempts state transition if valid.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Attack data
  - `state` -- Optional state override
  - `statedata` -- Optional state data override
  - `ongotostatefn` -- Optional callback after state transition
* **Returns:** boolean
* **Error states:** None

### `CommonHandlers.TryElectrocuteOnEvent(inst, data, state, statedata, ongotostatefn)`
* **Description:** Attempts electrocute state transition on generic event, checking insulation and state tags.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data
  - `state` -- Optional state override
  - `statedata` -- Optional state data override
  - `ongotostatefn` -- Optional callback after state transition
* **Returns:** boolean
* **Error states:** None

### `CommonHandlers.ShouldUseCorpseStateOnLoad(inst, cause)`
* **Description:** Determines if corpse state should be used on file load based on death cause and loot level.
* **Parameters:**
  - `inst` -- Entity instance
  - `cause` -- Death cause string
* **Returns:** boolean
* **Error states:** None

### `CommonHandlers.CorpseDeathAnimOver`
* **Description:** Direct function reference for corpse death animation over handler (assigned directly to CommonHandlers table, not a factory function).
* **Parameters:** `inst` -- Entity instance
* **Returns:** None (this is the handler function itself, assigned directly to CommonHandlers table)
* **Error states:** None

### `CommonHandlers.OnAttacked(hitreact_cooldown, max_hitreacts, skip_cooldown_fn)`
* **Description:** Returns an EventHandler for the 'attacked' event with optional cooldown parameters.
* **Parameters:**
  - `hitreact_cooldown` -- Optional hit reaction cooldown duration
  - `max_hitreacts` -- Optional maximum hit reactions
  - `skip_cooldown_fn` -- Optional function to skip cooldown
* **Returns:** EventHandler
* **Error states:** None





### `CommonHandlers.OnElectrocute()`
* **Description:** Returns an EventHandler for the 'electrocute' event.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonHandlers.OnAttack()`
* **Description:** Returns an EventHandler for the 'doattack' event.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None





### `CommonHandlers.OnDeath()`
* **Description:** Returns an EventHandler for the 'death' event.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `CommonHandlers.OnLocomote(can_run, can_walk)`
* **Description:** Returns an EventHandler for the 'locomote' event that manages walk/run state transitions based on locomotor desires.
* **Parameters:**
  - `can_run` -- Whether entity can run
  - `can_walk` -- Whether entity can walk
* **Returns:** EventHandler
* **Error states:** None

### `CommonStates.AddIdle(states, funny_idle_state, anim_override, timeline)`
* **Description:** Adds an idle state to the states table with configurable animation and optional funny idle variation.
* **Parameters:**
  - `states` -- State table to insert into
  - `funny_idle_state` -- Optional alternate idle state for variety
  - `anim_override` -- Optional animation override (string or function)
  - `timeline` -- Optional timeline for the state
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddSimpleState(states, name, anim, tags, finishstate, timeline, fns)`
* **Description:** Adds a simple animation state that plays once and transitions to finishstate.
* **Parameters:**
  - `states` -- State table to insert into
  - `name` -- State name
  - `anim` -- Animation to play
  - `tags` -- Optional state tags table
  - `finishstate` -- State to transition to on completion
  - `timeline` -- Optional timeline
  - `fns` -- Optional table with onenter/onexit callbacks
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddSimpleActionState(states, name, anim, time, tags, finishstate, timeline, fns)`
* **Description:** Adds a simple action state that performs a buffered action at specified time.
* **Parameters:**
  - `states` -- State table to insert into
  - `name` -- State name
  - `anim` -- Animation to play
  - `time` -- Time event for performing buffered action
  - `tags` -- Optional state tags table
  - `finishstate` -- State to transition to on completion
  - `timeline` -- Optional timeline override
  - `fns` -- Optional table with onenter/onexit callbacks
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddShortAction(states, name, anim, timeout, finishstate)`
* **Description:** Adds a short action state with timeout-based buffered action execution. Note: the state name is hardcoded as "name" in the source (the name parameter is not used for the state name).
* **Parameters:**
  - `states` -- State table to insert into
  - `name` -- State name
  - `anim` -- Animation to play
  - `timeout` -- Optional timeout duration
  - `finishstate` -- State to transition to on completion
* **Returns:** nil
* **Error states:** None









### `CommonStates.AddRunStates(states, timelines, anims, softstop, delaystart, fns)`
* **Description:** Adds run_start, run, and run_stop states with configurable animations, timelines, and callbacks.
* **Parameters:**
  - `states` -- State table to insert into
  - `timelines` -- Optional table with starttimeline/runtimeline/endtimeline
  - `anims` -- Optional table with startrun/run/stoprun animations
  - `softstop` -- Boolean or function to determine soft stop behavior
  - `delaystart` -- Whether to delay movement start
  - `fns` -- Optional table with start/run/end onenter/onupdate/onexit callbacks
* **Returns:** nil
* **Error states:** None
* **Description:** Adds simplified run states using a single animation for all phases.
* **Parameters:**
  - `states` -- State table to insert into
  - `anim` -- Animation to use for all run states
  - `timelines` -- Optional timelines table
* **Returns:** nil
* **Error states:** None





### `CommonStates.AddWalkStates(states, timelines, anims, softstop, delaystart, fns)`
* **Description:** Adds walk_start, walk, and walk_stop states to the stategraph with configurable animations, timelines, and callbacks.
* **Parameters:**
  - `states` -- table - state array to insert walk states into
  - `timelines` -- table - optional timeline definitions for start/walk/end
  - `anims` -- table - optional animation names for startwalk/walk/stopwalk
  - `softstop` -- boolean or function - whether to use soft stop animation behavior
  - `delaystart` -- boolean - whether to delay walk start by stopping movement first
  - `fns` -- table - optional callback functions for state enter/update/exit events
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddSimpleWalkStates(states, anim, timelines)`
* **Description:** Simplified wrapper for AddWalkStates using a single animation for all walk phases with softstop enabled.
* **Parameters:**
  - `states` -- table - state array to insert walk states into
  - `anim` -- string - animation name used for all walk phases
  - `timelines` -- table - optional timeline definitions
* **Returns:** nil
* **Error states:** None

### `CommonHandlers.OnHop()`
* **Description:** Returns an EventHandler for the onhop event that transitions to hop_pre or hop_antic state based on swimming status and embarker state.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `CommonStates.AddHopStates(states, wait_for_pre, anims, timelines, land_sound, landed_in_falling_state, data, fns)`
* **Description:** Adds hop_pre, hop_loop, hop_pst, hop_pst_complete, and hop_cancelhop states for entity hopping/embarking behavior.
* **Parameters:**
  - `states` -- table - state array to insert hop states into
  - `wait_for_pre` -- boolean - whether to wait for pre-hop animation before proceeding
  - `anims` -- table - optional animation names for pre/loop/pst phases
  - `timelines` -- table - optional timeline definitions for hop phases
  - `land_sound` -- string or function - sound to play on landing
  - `landed_in_falling_state` -- string or function - state to transition to if landed in water
  - `data` -- table - optional data configuration for hop behavior
  - `fns` -- table - optional callback functions for hop state events
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddAmphibiousCreatureHopStates(states, config, anims, timelines, updates)`
* **Description:** Adds specialized hop states for amphibious creatures that transition between water and land, handling swimming tag and ocean entry/exit.
* **Parameters:**
  - `states` -- table - state array to insert amphibious hop states into
  - `config` -- table - configuration including onenters/onexits callbacks and swimming_clear_collision_frame
  - `anims` -- table - optional animation names for pre/pst/antic phases
  - `timelines` -- table - optional timeline definitions for hop phases
  - `updates` -- table - unused in this chunk
* **Returns:** nil
* **Error states:** None







### `CommonStates.AddSleepStates(states, timelines, fns)`
* **Description:** Adds sleep, sleeping, and wake states for entity sleep behavior with optional callbacks.
* **Parameters:**
  - `states` -- table - state array to insert sleep states into
  - `timelines` -- table - optional timeline definitions for sleep/wake phases
  - `fns` -- table - optional callback functions for onsleep/onwake/onsleepexit
* **Returns:** nil
* **Error states:** None





















### `CommonStates.AddFrozenStates(states, onoverridesymbols, onclearsymbols)`
* **Description:** Adds frozen and thaw states for entity freeze behavior with optional symbol override callbacks.
* **Parameters:**
  - `states` -- table - state array to insert frozen states into
  - `onoverridesymbols` -- function - optional callback for additional symbol overrides on enter
  - `onclearsymbols` -- function - optional callback for additional symbol cleanup on exit
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddCombatStates(states, timelines, anims, fns, data)`
* **Description:** Adds hit, attack, and death states for combat behavior with configurable animations and callbacks.
* **Parameters:**
  - `states` -- table - state array to insert combat states into
  - `timelines` -- table - optional timeline definitions for hit/attack/death
  - `anims` -- table - optional animation names for hit/attack/death
  - `fns` -- table - optional callback functions for combat state events
  - `data` -- table - optional data including has_corpse_handler flag
* **Returns:** nil
* **Error states:** None

### `CommonStates.AddHitState(states, timeline, anim)`
* **Description:** Adds a hit state to the stategraph that plays a hit animation, stops locomotion, and plays hit sound.
* **Parameters:**
  - `states` -- table - state array to insert the hit state into
  - `timeline` -- table - animation timeline for the hit state
  - `anim` -- string or function - hit animation name or function returning animation name
* **Returns:** None
* **Error states:** None

### `CommonStates.AddElectrocuteStates(states, timelines, anims, fns)`
* **Description:** Adds electrocute and electrocute_pst states that handle electrocution status ailment with optional burn on exit.
* **Parameters:**
  - `states` -- table - state array to insert electrocute states into
  - `timelines` -- table - animation timelines for loop and pst states
  - `anims` -- table - animation names for loop and pst states
  - `fns` -- table - callback functions for various state events
* **Returns:** None
* **Error states:** None

### `CommonStates.AddDeathState(states, timeline, anim, fns, data)`
* **Description:** Adds a death state that stops locomotion, plays death animation, removes physics colliders, and drops death loot.
* **Parameters:**
  - `states` -- table - state array to insert the death state into
  - `timeline` -- table - animation timeline for death state
  - `anim` -- string - death animation name, defaults to 'death'
  - `fns` -- table - callback functions for deathenter and deathexit
  - `data` -- table - optional data including has_corpse_handler flag
* **Returns:** None
* **Error states:** None





### `CommonHandlers.OnSleepEx()`
* **Description:** Returns an EventHandler for the gotosleep event that calls onsleepex.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `CommonHandlers.OnWakeEx()`
* **Description:** Returns an EventHandler for the onwakeup event that calls onwakeex.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `CommonHandlers.OnNoSleepAnimOver(nextstate)`
* **Description:** Returns an EventHandler for animover that transitions to sleep if sleeping, otherwise to nextstate.
* **Parameters:**
  - `nextstate` -- string or function - state name or function to transition to after animation
* **Returns:** EventHandler
* **Error states:** None

### `CommonHandlers.OnNoSleepAnimQueueOver(nextstate)`
* **Description:** Returns an EventHandler for animqueueover that transitions to sleep if sleeping, otherwise to nextstate.
* **Parameters:**
  - `nextstate` -- string or function - state name or function to transition to after animation queue
* **Returns:** EventHandler
* **Error states:** None

### `CommonHandlers.OnNoSleepTimeEvent(t, fn)`
* **Description:** Returns a TimeEvent that transitions to sleep if sleeping and not dead, otherwise calls fn.
* **Parameters:**
  - `t` -- number - time in seconds for the TimeEvent
  - `fn` -- function - callback function to execute if not sleeping
* **Returns:** TimeEvent
* **Error states:** None

### `CommonHandlers.OnNoSleepFrameEvent(frame, fn)`
* **Description:** Returns a TimeEvent based on frame count that calls OnNoSleepTimeEvent.
* **Parameters:**
  - `frame` -- number - frame number for the event
  - `fn` -- function - callback function to execute
* **Returns:** TimeEvent
* **Error states:** None

### `CommonStates.AddSleepExStates(states, timelines, fns)`
* **Description:** Adds sleep, sleeping, and wake states with improved nosleep tag support.
* **Parameters:**
  - `states` -- table - state array to insert sleep states into
  - `timelines` -- table - animation timelines for start, sleep, and wake
  - `fns` -- table - callback functions for sleep state events
* **Returns:** None
* **Error states:** None

### `CommonStates.AddFossilizedStates(states, timelines, fns)`
* **Description:** Adds fossilized, unfossilizing, and unfossilized states that handle fossilization status ailment.
* **Parameters:**
  - `states` -- table - state array to insert fossilized states into
  - `timelines` -- table - animation timelines for fossilized states
  - `fns` -- table - callback functions for fossilized state events
* **Returns:** None
* **Error states:** None

### `CommonStates.AddRowStates(states, is_client)`
* **Description:** Adds row, row_fail, and row_idle states for boat rowing mechanics.
* **Parameters:**
  - `states` -- table - state array to insert row states into
  - `is_client` -- boolean - whether this is running on client
* **Returns:** None
* **Error states:** None

### `CommonHandlers.OnSink()`
* **Description:** Returns an EventHandler for the onsink event that calls onsink.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonStates.AddSinkAndWashAshoreStates(states, anims, timelines, fns, data)`
* **Description:** Adds sink and washed_ashore states that handle drowning and teleporting to shore.
* **Parameters:**
  - `states` -- table - state array to insert sink states into
  - `anims` -- table - animation names for sink and washashore
  - `timelines` -- table - animation timelines for sink and washashore
  - `fns` -- table - callback functions for sink state events
  - `data` -- table - optional data including shore_pt, noanim, skip_splash
* **Returns:** None
* **Error states:** None

### `CommonStates.AddSinkAndWashAsoreStates(states, anims, timelines, fns, data)`
* **Description:** Backward compatibility alias for AddSinkAndWashAshoreStates (originally misspelled).
* **Parameters:**
  - `states` -- table - state array to insert sink states into
  - `anims` -- table - animation names for sink and washashore
  - `timelines` -- table - animation timelines for sink and washashore
  - `fns` -- table - callback functions for sink state events
  - `data` -- table - optional data including shore_pt, noanim, skip_splash
* **Returns:** None
* **Error states:** None



### `CommonHandlers.OnFallInVoid()`
* **Description:** Returns an EventHandler for the onfallinvoid event that calls onfallinvoid.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None



### `CommonStates.AddVoidFallStates(states, anims, timelines, fns, data)`
* **Description:** Adds abyss_fall and abyss_drop states to handle entities falling into the void, including collision mask changes, locomotor cleanup, and teleportation via drownable component.
* **Parameters:**
  - `states` -- table - State array to insert abyss_fall and abyss_drop states into
  - `anims` -- table - Optional animation names for fallinvoid and voiddrop animations
  - `timelines` -- table - Optional timeline definitions for state animations
  - `fns` -- table - Optional callback functions for state events
  - `data` -- table - Optional configuration data including teleport_pt and noanim flags
* **Returns:** None
* **Error states:** None

### `CommonHandlers.OnIpecacPoop()`
* **Description:** Returns an EventHandler for the ipecacpoop event that triggers the IpecacPoop function.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `PlayMiningFX(inst, target, nosound)`
* **Description:** Spawns mining visual FX and plays appropriate sound based on target type (frozen, moonglass, crystal, or default). Does not play sound if nosound is true.
* **Parameters:**
  - `inst` -- Entity instance performing the mining
  - `target` -- Target entity being mined
  - `nosound` -- boolean - If true, skip sound playback
* **Returns:** None
* **Error states:** None

### `CommonStates.AddIpecacPoopState(states, anim)`
* **Description:** Adds ipecacpoop state that plays a laxative sound and animation while stopping physics.
* **Parameters:**
  - `states` -- table - State array to insert ipecacpoop state into
  - `anim` -- string - Animation name to play, defaults to 'hit'
* **Returns:** None
* **Error states:** None

### `CommonStates.AddCorpseStates(states, anims, fns, overridecorpseprefab)`
* **Description:** Adds corpse management states including corpse (death handling), corpse_idle (static corpse), and corpse_hit (corpse being attacked).
* **Parameters:**
  - `states` -- table - State array to insert corpse, corpse_idle, and corpse_hit states into
  - `anims` -- table - Animation names for corpse and corpse_hit states
  - `fns` -- table - Callback functions for corpseonenter, corpseonerode, corpseoncreate events
  - `overridecorpseprefab` -- string - Optional prefab name to override default corpse prefab
* **Returns:** None
* **Error states:** None

### `CommonStates.AddLunarPreRiftMutationStates(states, timelines, anims, fns, data)`
* **Description:** Adds pre-rift lunar mutation states for corpse transformation into mutated mob with loot drop and component removal.
* **Parameters:**
  - `states` -- table - State array to insert pre-rift mutation states into
  - `timelines` -- table - Timeline definitions for mutation animations
  - `anims` -- table - Animation names for mutate and mutate_pst states
  - `fns` -- table - Callback functions for mutation events
  - `data` -- table - Configuration including mutated_spawn_timing and post_mutate_state
* **Returns:** None
* **Error states:** None

### `CommonStates.AddLunarRiftMutationStates(states, timelines, anims, fns, data)`
* **Description:** Adds lunar rift mutation states with gestalt possession behavior, including twitching pre-mutation, mutation animation, and post-mutation flash effects.
* **Parameters:**
  - `states` -- table - State array to insert lunar rift mutation states into
  - `timelines` -- table - Timeline definitions for mutation animations
  - `anims` -- table - Animation names for mutate_pre, mutate, and mutate_pst states
  - `fns` -- table - Callback functions for mutation events
  - `data` -- table - Configuration including twitch_lp sound, mutatepst_flashtime, and post_mutate_state
* **Returns:** None
* **Error states:** None

### `CommonHandlers.OnCorpseDeathAnimOver(cancorpsefn)`
* **Description:** Returns an EventHandler for animover event that transitions to corpse state, with optional cancorpsefn check.
* **Parameters:**
  - `cancorpsefn` -- function - Optional function to check if entity can become a corpse
* **Returns:** EventHandler
* **Error states:** None

### `CommonHandlers.OnCorpseChomped()`
* **Description:** Returns an EventHandler for the chomped event that triggers corpse hit behavior.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `CommonStates.AddInitState(states, default_state)`
* **Description:** Adds init state that transitions to corpse_idle if entity is a corpse, otherwise to default_state.
* **Parameters:**
  - `states` -- table - State array to insert init state into
  - `default_state` -- string - Default state to transition to, defaults to 'idle'
* **Returns:** None
* **Error states:** None

### `CommonStates.AddParasiteReviveState(states)`
* **Description:** Adds parasite_revive state that plays parasite_death_pst animation and stops physics.
* **Parameters:**
  - `states` -- table - State array to insert parasite_revive state into
* **Returns:** None
* **Error states:** None

### `CommonHandlers.OnPossessChassis()`
* **Description:** Returns an EventHandler for the possess_chassis event that triggers possession behavior.
* **Parameters:** None
* **Returns:** EventHandler
* **Error states:** None

### `CommonStates.AddPossessChassisState(states, anim, possess_frame_timing, fns)`
* **Description:** Adds possess_chassis state for gestalt entities to possess a chassis, spawning possessed body and removing self on success.
* **Parameters:**
  - `states` -- table - State array to insert possess_chassis state into
  - `anim` -- string or function - Animation name or function returning animation name
  - `possess_frame_timing` -- number - Frame timing for possession attempt in timeline
  - `fns` -- table - Optional callback functions including onenter
* **Returns:** None
* **Error states:** None

## Events & listeners

> **Note:** The handlers in this file return `EventHandler` objects for stategraph state definitions, not entity-level `inst:ListenForEvent()` registrations. Stategraph events (e.g., `gotosleep`, `freeze`, `attacked`) are handled within state definitions via `events` tables, while animation events (`animover`, `animqueueover`) are triggered internally by the stategraph system when animations complete.

### Stategraph events (handled via CommonHandlers)
**Listens to:**
- `step` -- Handled by OnStep for movement sound playback
- `gotosleep` -- Handled by OnSleep/OnSleepEx for sleep transitions
- `freeze` -- Handled by OnFreeze/OnFreezeEx for freeze status
- `fossilize` -- Handled by OnFossilize for fossilization status
- `attacked` -- Handled by OnAttacked for hit reaction and electrocute checks
- `electrocute` -- Handled by OnElectrocute for electrocute status
- `doattack` -- Handled by OnAttack for attack state transition
- `death` -- Handled by OnDeath for death state transition
- `locomote` -- Handled by OnLocomote for walk/run state transitions
- `onhop` -- Handled by OnHop for hop/embark behavior
- `onsink` -- Handled by OnSink for drowning transitions
- `onfallinvoid` -- Handled by OnFallInVoid for void fall transitions
- `ipecacpoop` -- Handled by OnIpecacPoop for laxative behavior
- `chomped` -- Handled by OnCorpseChomped for corpse hit behavior
- `possess_chassis` -- Handled by OnPossessChassis for gestalt possession

### State-internal animation events (used within state definitions)
- `animover` -- Triggered when animation completes, used for state transitions in walk/hop/sleep/combat states
- `animqueueover` -- Triggered when animation queue completes, used in walk_stop state
- `done_embark_movement` -- Triggered when embark movement completes during hop
- `cancelhop` -- Triggered to cancel hop and transition to hop_cancelhop state
- `onwakeup` -- Triggered to wake entity from sleep state
- `unfreeze` -- Triggered to unfreeze entity from frozen state
- `onthaw` -- Triggered to begin thawing from frozen state
- `fossilize` -- Handled in fossilized state to extend fossilization
- `unfossilize` -- Handled in fossilized state to begin unfossilizing
- `unequip` -- Handled in row and row_fail states to return to idle
- `on_washed_ashore` -- Handled in sink state to transition to washed_ashore
- `on_void_arrive` -- Triggered in abyss_fall state when entity arrives at void destination

### Events pushed by states
- `locomote` -- Pushed in hop_loop onexit when locomotor.isrunning is true
- `startelectrocute` -- Pushed when entering electrocute state