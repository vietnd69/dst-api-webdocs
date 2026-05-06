---
id: SGbuzzard
title: Sgbuzzard
description: Defines the complete SGbuzzard stategraph for the buzzard entity, including all state definitions, event handlers, local helper functions, and CommonStates integrations for locomotion, combat, death, and mutated flamethrower behaviors.
tags: [stategraph, ai, combat, locomotion, creature]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 6c5f8799
system_scope: entity
---

# Sgbuzzard

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

SGbuzzard is the animation state machine controlling buzzard entity behavior in Don't Starve Together. Stategraphs are accessed via `StartStateGraph()`, not called as utility functions. This stategraph manages locomotion (idle, glide, flyaway), combat (melee attack, flamethrower attacks for mutated variants), death sequences (fall, stun, corpse states), and special behaviors like corpse consumption and distress responses. It integrates with CommonStates for reusable state factories and event handlers, and coordinates with multiple components including combat, locomotor, burnable, childspawner, and periodicspawner. Mutated (lunar_aligned) buzzards have access to flamethrower attack states with specialized FX spawning and damage configuration.

## Usage example

```lua
-- Access the stategraph on a buzzard entity
local buzzard = SpawnPrefab("buzzard")
buzzard.sg:GoToState("idle")

-- Check current state tags
if buzzard.sg:HasStateTag("flight") then
    print("Buzzard is currently flying")
end

-- Listen for state transitions via events
buzzard:ListenForEvent("animover", function(inst)
    print("Animation completed, state may have transitioned")
end)

-- Trigger attack behavior
if buzzard.components.combat ~= nil then
    buzzard:PushEvent("doattack")
end
```

## Dependencies & tags

**External dependencies:**
- `stategraphs/commonstates` -- CommonStates and CommonHandlers for reusable state factories and event handlers
- `TheSim` -- FindEntities for buzzard and flame entity searches
- `TheWorld` -- components.migrationmanager for mutated buzzard migration, Map:IsPassableAtPoint for stuck check
- `TUNING` -- MUTATEDBUZZARD_FLAMETHROWER_DAMAGE, MUTATEDBUZZARD_FLAMETHROWER_PLANAR_DAMAGE, MUTATEDBUZZARD_DAMAGE, BUZZARD_ATTACK_RANGE, CROW_LEAVINGS_CHANCE constants
- `ACTIONS` -- EAT and GOHOME action handlers
- `SpawnPrefab` -- Spawns warg_mutated_breath_fx and lunar flame puff FX prefabs
- `GetTime` -- Stun duration timing calculations
- `DEGREES` -- Angle conversion for flamethrower FX positioning
- `PI2` -- Random angle generation for FX spread
- `FRAMES` -- TimeEvent frame calculations for flyaway timeline
- `RemovePhysicsColliders` -- Called in death state to disable collision
- `RaiseFlyingCreature` -- Elevates buzzard for flamethrower attack
- `ChangeToFlyingCharacterPhysics` -- Switches physics to flying mode
- `ChangeToCharacterPhysics` -- Restores ground physics after flight
- `ChangeToInventoryItemPhysics` -- Switches to item physics for fall state
- `SinkEntity` -- Sinks entity if in water after landing
- `ShouldEntitySink` -- Checks if entity should sink based on position
- `GetCombatFxSize` -- Gets FX size parameters from corpse for flame puff spawning
- `CanEntityBeNonGestaltMutated` -- Checks if corpse can mutate back from gestalt form

**Components used:**
- `health` -- IsDead checks in state transitions and event handlers
- `combat` -- target access, CanAttack, DoAttack, StartAttack, CalcHitRangeSq, TargetIs, SetDefaultDamage, GetHitRange
- `locomotor` -- Stop, StopMoving, WalkForward, WantsToMoveForward, CheckDrownable
- `timer` -- TimerExists for flamethrower cooldown check
- `homeseeker` -- home property access for GoHome call
- `childspawner` -- GoHome call for non-mutated buzzard departure
- `knownlocations` -- RememberLocation for landpoint storage
- `periodicspawner` -- TrySpawn for crow leavings during flyaway
- `burnable` -- IsBurning and Extinguish checks in distress and electrocute states

**Tags:**
- `idle` -- add
- `canrotate` -- add
- `busy` -- add
- `attack` -- add
- `hit` -- add
- `flight` -- add
- `noelectrocute` -- add
- `nosleep` -- add
- `moving` -- add
- `hopping` -- add
- `flamethrowering` -- add
- `eating_corpse` -- add
- `caninterrupt` -- add
- `stunned` -- add
- `corpse` -- add
- `lunar_aligned` -- check
- `prey` -- check
- `honey_ammo_afflicted` -- check
- `gelblob_ammo_afflicted` -- check
- `buzzard` -- check
- `gestaltmutant` -- check
- `NOCLICK` -- check
- `FX` -- check

## Properties

**State reference table:**

| State name | Tags | Description |
|------------|------|-------------|
| `init` | (none) | Default initialization state injected by CommonStates.AddInitState; transitions to first idle state. |
| `idle` | `idle, canrotate` | Default resting state; loops idle animation with random timeout. |
| `taunt` | `busy` | Plays taunt animation when combat target exists. |
| `caw` | `idle` | Plays caw animation as alternative to taunt. |
| `distress_pre` | `busy` | Pre-distress state when burning or afflicted. |
| `distress` | `busy` | Distress animation loop while burning. |
| `glide` | `idle, flight, busy, noelectrocute, nosleep` | Descent animation with velocity override and periodic flap sounds. |
| `kill` | `canrotate` | Executes attack animation with prey target storage. |
| `eat` | `busy` | Ground food consumption state. |
| `flyaway` | `flight, busy, canrotate, noelectrocute, nosleep` | Takeoff sequence with crow leavings spawn and migration handling. |
| `hop` | `moving, canrotate, hopping` | Short hop locomotion state. |
| `attack` | `attack, busy` | Melee attack sequence with combat integration. |
| `hit` | `hit, busy` | Hit reaction animation. |
| `death` | `busy` | Death animation with physics collider removal and loot drop. |
| `flamethrower_pre` | `attack, busy, flamethrowering` | Pre-flamethrower setup with physics switch and elevation. |
| `flamethrower_loop` | `attack, busy, flight, noelectrocute, flamethrowering` | Continuous flamethrower attack with breath FX spawning. |
| `flamethrower_pst` | `attack, busy, flamethrowering` | Post-flamethrower cooldown and landing sequence. |
| `corpse_eat_pre` | `eating_corpse, busy, caninterrupt` | Approach corpse for consumption. |
| `corpse_eat_loop` | `eating_corpse` | Consume corpse with flame extinguish and FX spawn. |
| `corpse_eat_pst` | `busy, caninterrupt` | Post-consumption recovery animation. |
| `fall` | `flight, busy, noelectrocute, nosleep` | Vertical or spiral fall animation with inventory physics. |
| `fall_to_stun` | `stunned, busy, nosleep, noelectrocute` | Ground impact transition to stun state. |
| `stun_pre` | `stunned, busy, nosleep, noelectrocute` | Pre-stun animation with duration tracking. |
| `stun_loop` | `stunned, busy, caninterrupt, nosleep` | Stunned animation loop with duration tracking. |
| `stun_hit` | `stunned, busy, hit, nosleep` | Hit reaction while stunned that may transition to stun_loop. |
| `stun_pst` | `stunned, busy, nosleep, noelectrocute` | Post-stun recovery with tag cleanup. |
| `corpse_fall` | `corpse, busy, noelectrocute` | Corpse fall animation with slide velocity. |
| `corpse_idle` | `corpse` | Corpse resting state on ground. |
| `sleep` | `nosleep` | Sleeping state (injected by CommonStates.AddSleepExStates). |
| `sleeping` | `nosleep, caninterrupt` | Continued sleeping state (injected by CommonStates.AddSleepExStates). |
| `waking` | `nosleep, caninterrupt` | Waking up from sleep (injected by CommonStates.AddSleepExStates). |
| `frozen` | `busy, nosleep` | Frozen state (injected by CommonStates.AddFrozenStates). |
| `freeze_pre` | `busy` | Pre-freeze animation (injected by CommonStates.AddFrozenStates). |
| `freeze_pst` | `busy` | Post-freeze recovery (injected by CommonStates.AddFrozenStates). |
| `electrocute_pre` | `busy, noelectrocute` | Pre-electrocute animation (injected by CommonStates.AddElectrocuteStates). |
| `electrocute_loop` | `busy, noelectrocute` | Electrocuted animation loop (injected by CommonStates.AddElectrocuteStates). |
| `electrocute_pst` | `busy, noelectrocute` | Post-electrocute recovery (injected by CommonStates.AddElectrocuteStates). |
| `mutate` | `busy` | Lunar mutation transformation (injected by CommonStates.AddLunarRiftMutationStates). |
| `mutatepst` | `busy` | Post-mutation recovery (injected by CommonStates.AddLunarRiftMutationStates). |
| `sink` | `busy` | Sinking underwater state (injected by CommonStates.AddSinkAndWashAshoreStates). |
| `wash_ashore` | `busy` | Washing ashore from water (injected by CommonStates.AddSinkAndWashAshoreStates). |
| `void_fall` | `busy` | Falling into void (injected by CommonStates.AddVoidFallStates). |

**File-scope constants:**

| Constant | Value | Usage |
|----------|-------|-------|
| `MUTATEDBUZZARD_SEARCH_RANGE` | `10` | Search radius for TargetAlreadyBeingFlameThrowered buzzard detection |
| `MUTATEDBUZZARD_MUST_TAGS` | `{ "buzzard", "gestaltmutant" }` | Required tags for mutated buzzard entity search |
| `MUTATEDBUZZARD_NO_TAGS` | `{ "NOCLICK" }` | Excluded tags for mutated buzzard entity search |
| `FINDFIRE_TAGS` | `{"FX"}` | Tags for finding existing flame FX in SpawnBreathFX |

## Main functions

### `TargetAlreadyBeingFlameThrowered(inst, target)`
* **Description:** Checks if another buzzard within search range is already attacking the target with flamethrower to prevent multiple buzzards lining up.
* **Parameters:**
  - `inst` -- buzzard entity instance
  - `target` -- target entity being checked for existing flamethrower attacks
* **Returns:** boolean -- true if target is already being flamethrowered
* **Error states:** None

### `ChooseAttack(inst, target)`
* **Description:** Selects attack type based on target availability and flamethrower cooldown. Prioritizes flamethrower attack if available and not on cooldown, otherwise uses melee attack.
* **Parameters:**
  - `inst` -- buzzard entity instance
  - `target` -- optional target entity; uses combat.target if nil
* **Returns:** nil
* **Error states:** Errors if inst.components.combat or inst.components.timer is nil -- no nil guards before access

### `IsValidFlameToExtend(inst)`
* **Description:** Validates if a flame FX entity can be extended by checking prefab name, tallflame flag, and kill_fx_task existence.
* **Parameters:**
  - `inst` -- potential flame FX entity
* **Returns:** boolean -- true if flame is valid for extension
* **Error states:** None

### `SpawnBreathFX(inst, angle, dist, targets)`
* **Description:** Spawns or reuses warg_mutated_breath_fx prefab at calculated position. Configures damage and restarts FX with scale variation. Extends existing valid flames if found nearby.
* **Parameters:**
  - `inst` -- buzzard entity spawning the FX
  - `angle` -- angle offset for FX spawn position
  - `dist` -- distance from buzzard for FX spawn
  - `targets` -- table of target entities for FX damage
* **Returns:** nil
* **Error states:** Errors if inst.Transform is nil -- no guard before GetWorldPosition call

### `ShouldDistress(inst)`
* **Description:** Determines if buzzard should enter distress state. Mutated (lunar_aligned) buzzards do not distress.
* **Parameters:**
  - `inst` -- buzzard entity instance
* **Returns:** boolean -- true if entity should distress
* **Error states:** None

### `GetLunarFlamePuffAnim(sz, ht)`
* **Description:** Returns formatted animation name for lunar flame puff FX based on size and height parameters.
* **Parameters:**
  - `sz` -- size string for animation name (e.g., 'small')
  - `ht` -- boolean indicating height variant
* **Returns:** string -- animation name like 'lunarflame_puff_small' or 'lunarflame_puff_small_true'
* **Error states:** None

### `FlyAwayToSky(inst)`
* **Description:** Handles buzzard departure. Mutated buzzards enter migration via MigrationManager. Non-mutated buzzards return to childspawner home. Debug-spawned buzzards are removed.
* **Parameters:**
  - `inst` -- buzzard entity instance
* **Returns:** nil
* **Error states:** Errors if inst.components.homeseeker.home.components.childspawner is nil -- unguarded chain access after homeseeker check

### `IsStuck(inst)`
* **Description:** Checks if buzzard is afflicted by honey or gelblob ammo and verifies the current position is passable.
* **Parameters:**
  - `inst` -- buzzard entity instance
* **Returns:** boolean -- true if stuck
* **Error states:** Errors if TheWorld.Map is nil -- no guard before IsPassableAtPoint call

### `onenter (idle)`
* **Description:** Stops physics, plays idle animation (either directly or via pushanim parameter), and sets random timeout between 3-4 seconds.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `pushanim` -- optional animation string to play before idle loop
* **Returns:** nil
* **Error states:** None

### `ontimeout (idle)`
* **Description:** Transitions to eat state if EAT action is buffered. Otherwise 75% chance to remain idle, 25% chance to taunt (if combat target exists) or caw.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (caw)`
* **Description:** Plays caw animation. Plays squack sound at frame 0 via timeline. On animover, 50% chance to loop caw or return to idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (taunt)`
* **Description:** Stops physics and plays taunt animation. Plays taunt sound at frame 0 via timeline.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (distress_pre)`
* **Description:** Stops locomotor and plays flap_pre animation. Transitions to distress state on animover.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (distress)`
* **Description:** Plays flap_loop animation with squack sound. Handles stop_honey_ammo_afflicted, stop_gelblob_ammo_afflicted, and onextinguish events to transition to flyaway or idle based on burn/death/stuck status.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (glide)`
* **Description:** Plays glide animation loop, disables dynamic shadow, sets motor velocity override for descent. Starts periodic flap sound task every 6 frames via DoPeriodicTask.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (eat)`
* **Description:** Stops physics and plays peck animation. On animover, 30% chance to perform buffered action then transitions to idle and forces brain update.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onupdate (glide)`
* **Description:** Maintains descent velocity. When y position reaches ground level or entity falls asleep, clears velocity, teleports to ground, plays land animation, re-enables shadow, and transitions to kill or idle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (glide)`
* **Description:** Re-enables dynamic shadow, cancels flap sound task, ensures entity is at ground level, and remembers landpoint in knownlocations component.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (kill)`
* **Description:** Pushes attack animation. Stores target in state memory if target has 'prey' tag for later kill execution.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- state data containing optional target with 'prey' tag
* **Returns:** nil
* **Error states:** None

### `onenter (flyaway)`
* **Description:** Checks if stuck and transitions to distress_pre if true. Stops locomotor, sets random timeout, determines vertical vs diagonal takeoff, spawns crow leavings via periodicspawner, plays takeoff animation and sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.periodicspawner is nil -- no nil guards

### `ontimeout (flyaway)`
* **Description:** Pushes takeoff loop animation and sets motor velocity based on vertical or diagonal takeoff mode. Disables dynamic shadow.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (flyaway)`
* **Description:** Re-enables dynamic shadow.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (attack)`
* **Description:** Stops movement, plays attack animation, starts combat attack sequence, and stores target in state memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- attack target entity
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.combat is nil -- no nil guards

### `onenter (hit)`
* **Description:** Stops movement and plays hit animation. Updates hit recovery delay via CommonHandlers. Transitions to idle on animover.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (death)`
* **Description:** Stops movement, plays death animation, removes physics colliders, drops death loot, and plays death sound. Uses CommonStates.OnCorpseDeathAnimOver handler.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (flamethrower_pre)`
* **Description:** Checks if stuck and transitions to distress_pre if true. Stops locomotor, plays pre-attack animation, switches to eight-faced mode, raises flying creature, changes to flying physics, stores target and position in state memory, sets motor velocity override, and sets flamethrower damage.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- flamethrower target entity
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.combat is nil -- no nil guards

### `onupdate (flamethrower_pre)`
* **Description:** Forces entity to face target position while target is valid. Clears target from state memory if invalid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (flamethrower_pre)`
* **Description:** If not attacking, lands flying creature, changes back to character physics, resets damage to normal buzzard damage, and kills loop sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (flamethrower_loop)`
* **Description:** Stops locomotor, plays loop animation, sets forward motor velocity, switches to eight-faced mode, stores targets, sets flamethrower cooldown if method exists, and plays fire breath looping sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `targets` -- table of target entities for breath FX
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard

### `onexit (flamethrower_loop)`
* **Description:** If not attacking, switches to four-faced mode, changes to character physics, resets damage, and kills loop sound. If attacking but not looping, resets damage only.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (flamethrower_pst)`
* **Description:** Stores targets, stops locomotor, plays post-attack animation, changes to character physics, switches to eight-faced mode, and sets decelerating motor velocity.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `targets` -- table of target entities for final breath FX
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard

### `onenter (corpse_eat_pre)`
* **Description:** Stops movement and plays corpse_eat_pre animation. Plays attack sound. Stores corpse in state memory. Transitions to corpse_eat_loop on animover.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `corpse` -- corpse entity to consume
* **Returns:** nil
* **Error states:** None

### `onenter (corpse_eat_loop)`
* **Description:** Plays eating loop animation and sound. If corpse is valid and nearby, stores in state memory, extinguishes flames if burning (with skip fade hack), spawns lunar flame puff FX, pushes chomped event, and starts revive mutate timer if applicable.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `corpse` -- corpse entity being consumed
* **Returns:** nil
* **Error states:** Errors if inst.components.combat or corpse.components.burnable is nil -- no nil guards

### `onenter (corpse_eat_pst)`
* **Description:** Plays corpse_eat_pst animation. Transitions to idle on animover.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (fall)`
* **Description:** Stops physics, disables shadow, determines vertical or spiral fall animation, sets random rotation, changes to inventory item physics, and sets velocity based on fall type.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onupdate (fall)`
* **Description:** Monitors y position. When at ground level, stops physics, teleports to ground, re-enables shadow, and either sinks entity or transitions to fall_to_stun state with ground hit sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (fall_to_stun)`
* **Description:** Stops locomotor, plays fall_to_stun animation, and sets stun end time in stategraph memory (10-13 seconds from current time).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard

### `onenter (stun_pre)`
* **Description:** Stops locomotor and plays stun_pre animation. Sets stun end time in stategraph memory (8-11 seconds). Timeline removes noelectrocute tag at frame 18 and adds caninterrupt at frame 19. Transitions to stun_loop on animover.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard

### `onenter (stun_loop)`
* **Description:** Checks if stun duration has expired and transitions to stun_pst if so. Otherwise stops locomotor, plays stun_loop animation if not current, and sets timeout to animation length.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `nohit` -- optional parameter (unused in logic)
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard

### `onenter (stun_hit)`
* **Description:** Stops locomotor and plays stun_hit animation. Timeline at frame 6 checks stun duration expiry (transitions to stun_pst if expired) or adds caninterrupt tag. Transitions to stun_loop on animover.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard

### `onenter (stun_pst)`
* **Description:** Stops locomotor and plays stun_pst animation. Timeline events at frames 22-30 remove stunned/noelectrocute tags, add caninterrupt, clear stun_endtime, remove busy tag, and check for distress transition if burning.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil -- no nil guard in onenter (burnable access occurs in timeline callback, not onenter)

### `onenter (corpse_fall)`
* **Description:** Stops physics, disables shadow, determines corpse fall animation type, sets random rotation, and sets velocity based on vertical or diagonal fall.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onupdate (corpse_fall)`
* **Description:** Monitors y position. When at ground level, stops physics, teleports to ground, re-enables shadow, applies slide velocity for diagonal falls, and either sinks entity or transitions to corpse_idle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

## Events & listeners

**Listens to:**
- `attacked` -- Transitions to hit or stun_hit state based on stun/electrocute status and busy tags
- `doattack` -- Triggers ChooseAttack if not dead and not busy (or has hit tag without electrocute/stun)
- `flyaway` -- Transitions to flyaway state if not dead and not busy
- `onignite` -- Transitions to distress_pre if not dead, not stunned/electrocuted, and ShouldDistress returns true
- `locomote` -- Transitions to idle or hop state based on locomotor movement desire and combat target presence
- `corpse_eat` -- Transitions to corpse_eat_pre if corpse is valid and not already eating or busy

**Pushes:**
- None identified