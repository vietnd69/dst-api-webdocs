---
id: SGsharkboi
title: Sgsharkboi
description: Defines the animation state machine for the Sharkboi entity, managing combat attacks, torpedo dives, ice summoning, swimming locomotion, defeat sequences, and player interactions through coordinated state handlers and timeline events.
tags: [combat, ai, boss, locomotion, animation]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 7dd586ce
system_scope: entity
---

# Sgsharkboi

> Based on game build **722832** | Last updated: 2026-04-27

## Overview

SGsharkboi is an animation state machine that controls the Sharkboi entity's behavior across multiple combat phases, locomotion modes, and interaction states. The stategraph manages three primary attack patterns (melee swipe, arc attack, and torpedo dive), ice-based abilities including summoning and plowing effects, and swimming traversal via fin states. It integrates with CommonStates for standardized walk, run, sleep, frozen, and electrocute behavior via `CommonStates.AddWalkStates()`, `AddRunStates()`, `AddSleepExStates()`, `AddFrozenStates()`, and `AddElectrocuteStates()` calls. Additional states from CommonStates integration include: `walk_start`, `walk`, `walk_stop`, `run_start`, `run`, `run_stop`, `sleep`, `sleeping`, `wake`, `frozen`, `frozen_enter`, `frozen_exit`, `electrocute_enter`, `electrocute_loop`, `electrocute_exit`. The stategraph also handles defeat sequences, electrocute reactions, and trader-style item exchanges through talk, refuse, and give states. Key component integrations include combat for attack targeting, locomotor for movement control, timer for ability cooldowns, talker for dialogue, and sound emitter for audio feedback. State tags such as `fin`, `torpedoready`, `defeated`, and `busy` gate transitions and affect entity targeting by other systems.

## Usage example

```lua
-- Access the stategraph on a Sharkboi instance
local sharkboi = SpawnPrefab("sharkboi")

-- Transition to a specific state
sharkboi.sg:GoToState("attack1")

-- Check if currently in a combat state
if sharkboi.sg:HasStateTag("attack") then
    print("Sharkboi is attacking")
end

-- Check state tags to determine current behavior
if sharkboi.sg:HasStateTag("defeated") then
    print("Sharkboi has been defeated")
end

-- Check locomotion state tags
if sharkboi.sg:HasStateTag("fin") then
    print("Sharkboi is swimming")
end

```
## Dependencies & tags

**External dependencies:**
- `stategraphs/commonstates` -- Required for CommonHandlers event handlers (OnFreeze, OnSleepEx, OnWakeEx, TryElectrocuteOnEvent, HitRecoveryDelay) and AddWalkStates/AddRunStates/AddSleepExStates/AddFrozenStates/AddElectrocuteStates integration

**Components used:**
- `combat` -- Accessed for target, ignorehitrange, CanTarget, DoAttack methods in ChooseAttack and _AOEAttack
- `health` -- Accessed for currenthealth and minhealth in ShouldBeDefeated; IsDead and Kill called in _AOEAttack
- `timer` -- TimerExists called in ChooseAttack to check torpedo_cd and standing_dive_cd cooldowns
- `locomotor` -- WantsToMoveForward, WantsToRun, SetMoveDir called in locomote event handler; checked for nil in _AOEAttack
- `inventory` -- ArmorHasTag called in _AOEAttack to detect heavyarmor tag
- `trader` -- Checked for existence in minhealth event handler
- `workable` -- Checked for CanBeWorked and Destroyed in DoAOEWork
- `pickable` -- Checked for CanBePicked and Picked in DoAOEWork
- `mine` -- Deactivated in TossItems
- `inventoryitem` -- Checked for nobounce property in TossItems
- `talker` -- Chatter method called in TryChatter
- `Transform` -- Used for position and rotation in most functions
- `Physics` -- Used for teleport and velocity in TossLaunch
- `AnimState` -- Used to play animations in idle and talk states
- `sg` -- Stategraph memory and state transitions accessed throughout
- `SoundEmitter` -- PlaySound, PlayingSound, KillSound for audio effects
- `DynamicShadow` -- Enable(false/true) to toggle shadow visibility

**Tags:**
- `fin` -- check
- `moving` -- check
- `idle` -- check
- `running` -- check
- `defeated` -- check
- `dizzy` -- check
- `torpedoready` -- check
- `busy` -- check
- `caninterrupt` -- check
- `frozen` -- check
- `digging` -- check
- `candefeat` -- check
- `talking` -- check
- `hostile` -- check
- `_combat` -- check
- `INLIMBO` -- check
- `flight` -- check
- `invisible` -- check
- `notarget` -- check
- `noattack` -- check
- `heavyarmor` -- check
- `heavybody` -- check
- `FX` -- check
- `DECOR` -- check
- `NPC_workable` -- check
- `pickable` -- check
- `CHOP_workable` -- check
- `HAMMER_workable` -- check
- `MINE_workable` -- check
- `DIG_workable` -- check
- `canrotate` -- add/remove
- `try_restore_canrotate` -- add
- `stump` -- check
- `intense` -- check
- `_inventoryitem` -- check
- `locomotor` -- check
- `jumping` -- add
- `nosleep` -- add
- `temp_invincible` -- add
- `notalksound` -- add
- `noelectrocute` -- add
- `hit` -- add
- `attack` -- add
- `cantalk` -- add
- `electrocute` -- check
- `fastdig` -- add

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AOE_RANGE_PADDING` | constant (local) | `3` | Padding added to AOE search radius in `_AOEAttack` and `DoAOEWork`. |
| `AOE_TARGET_MUSTHAVE_TAGS` | constant (local) | `{ "_combat" }` | Required tags for entities targeted by AOE attacks. |
| `AOE_TARGET_CANT_TAGS` | constant (local) | `{ "INLIMBO", "flight", "invisible", "notarget", "noattack" }` | Excluded tags for AOE attack targets. |
| `WORK_RADIUS_PADDING` | constant (local) | `0.5` | Padding added to work search radius in `DoAOEWork`. |
| `COLLAPSIBLE_WORK_ACTIONS` | constant (local) | `{ CHOP=true, HAMMER=true, MINE=true }` | Work actions that can be collapsed during AOE work. |
| `COLLAPSIBLE_TAGS` | constant (local) | `{ "NPC_workable", "CHOP_workable", "HAMMER_workable", "MINE_workable" }` | Tags for workable entities affected by AOE work. |
| `COLLAPSIBLE_WORK_AND_DIG_ACTIONS` | constant (local) | `shallowcopy(COLLAPSIBLE_WORK_ACTIONS)` with `DIG` added | Work and dig actions for AOE digging. |
| `COLLAPSIBLE_DIG_TAGS` | constant (local) | `shallowcopy(COLLAPSIBLE_TAGS)` with `pickable` and `DIG_workable` added | Tags for entities affected by AOE digging. |
| `NON_COLLAPSIBLE_TAGS` | constant (local) | `{ "FX", "DECOR", "INLIMBO" }` | Tags for entities excluded from AOE work. |
| `TOSSITEM_MUST_TAGS` | constant (local) | `{ "_inventoryitem" }` | Required tags for items tossed by `TossItems`. |
| `TOSSITEM_CANT_TAGS` | constant (local) | `{ "locomotor", "INLIMBO" }` | Excluded tags for tossed items. |
| `SWIPE_ARC` | constant (local) | `240` | Arc angle in degrees for swipe attacks. |
| `SWIPE_OFFSET` | constant (local) | `2` | Distance offset for swipe attack origin. |
| `SWIPE_RADIUS` | constant (local) | `3.5` | Radius for swipe attack AOE. |
| `CHATTER_DELAYS` | constant (local) | table | String table names mapped to delay and length values for chatter throttling. |
| `DEFAULT_CHAT_ECHO_PRIORITY` | constant (local) | `CHATPRIORITIES.LOW` | Default echo priority for chatter. |
| `CHATTER_ECHO_PRIORITIES` | constant (local) | table | String table names mapped to high priority for important chatter. |
| `SPAWN_CHECK_TAGS` | constant (local) | `{ "locomotor" }` | Tags to check for spawn point clearance. |
| `SPAWN_CHECK_NOTAGS` | constant (local) | `{ "INLIMBO", "invisible", "flight" }` | Tags to exclude for spawn point clearance. |

## Main functions

### `DoImpactShake(inst)`
* **Description:** Triggers vertical camera shake for all cameras with intensity 1, duration 0.3 seconds, centered on the entity.
* **Parameters:**
  - `inst` -- Entity instance to center the camera shake effect on
* **Returns:** nil

### `DoJumpOutShake(inst)`
* **Description:** Triggers full camera shake for all cameras with intensity 0.6, duration 0.2 seconds, centered on the entity.
* **Parameters:**
  - `inst` -- Entity instance to center the camera shake effect on
* **Returns:** nil

### `DoDiggingShake(inst)`
* **Description:** Triggers full camera shake for all cameras with intensity 0.6, duration 0.15 seconds, centered on the entity during digging actions.
* **Parameters:**
  - `inst` -- Entity instance to center the camera shake effect on
* **Returns:** nil

### `ChooseAttack(inst, target)`
* **Description:** Selects and transitions to an appropriate attack state based on current state tags and timer cooldowns. Checks fin state, torpedo_cd timer, standing_dive_cd timer, and melee range to decide between fin_stop, ice_summon, standing_dive_jump_pre, or attack1 states.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
  - `target` -- Optional target entity; defaults to inst.components.combat.target if nil
* **Returns:** boolean -- true if an attack state was triggered, false otherwise
* **Error states:** Errors if inst.components.combat is nil (accessed without nil guard when target is nil); errors if inst.components.timer is nil (TimerExists called without guard)

### `ShouldBeDefeated(inst)`
* **Description:** Checks if the entity's current health is at or below minimum health threshold to determine defeat state.
* **Parameters:**
  - `inst` -- Entity instance to check defeat status for
* **Returns:** boolean -- true if currenthealth `<=` minhealth, false otherwise
* **Error states:** Errors if inst.components.health is nil (currenthealth and minhealth accessed without guard)

### `_transfer_statemem_to_electrocute(inst)`
* **Description:** Transfers state memory values to inst.sg.mem based on current state tags (defeated, dizzy, or torpedoready) before electrocute state transition.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `_AOEAttack(inst, dig, dist, radius, arc, heavymult, mult, forcelanded, targets)`
* **Description:** Performs area-of-effect attack by finding entities within radius using TheSim:FindEntities, filtering by AOE_TARGET_MUSTHAVE_TAGS and AOE_TARGET_CANT_TAGS, then applying combat damage or instant kill based on dig flag and target type. Calculates arc cone if specified using entity rotation.
* **Parameters:**
  - `inst` -- Entity instance performing the AOE attack
  - `dig` -- Boolean indicating if this is a digging attack (kills non-locomotor entities)
  - `dist` -- Distance offset from entity position for attack origin
  - `radius` -- Radius of the AOE effect
  - `arc` -- Arc angle in degrees for directional attack cone, or nil for full circle
  - `heavymult` -- Knockback strength multiplier for heavy-armored targets
  - `mult` -- Knockback strength multiplier for normal targets
  - `forcelanded` -- Boolean passed to knockback event
  - `targets` -- Optional table to track already-hit targets to prevent duplicates
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil (ignorehitrange, CanTarget, DoAttack called without guard); errors if inst.Transform is nil (GetWorldPosition, GetRotation called without guard)

### `DoAOEWork(inst, dig, dist, radius, arc, targets)`
* **Description:** Performs area-of-effect work or digging on entities within range. Checks workable and pickable components, destroys workables, and picks pickables. Optionally removes stumps if digging.
* **Parameters:**
  - `inst` -- Entity instance performing the work
  - `dig` -- Boolean flag to include dig actions
  - `dist` -- Distance offset from entity position
  - `radius` -- Search radius for entities
  - `arc` -- Arc angle for directional work or nil
  - `targets` -- Table to track processed targets or nil
* **Returns:** nil
* **Error states:** Errors if TheSim or entity Transform components are missing.

### `TossLaunch(inst, launcher, basespeed, startheight, startradius)`
* **Description:** Calculates a random launch angle and velocity, teleports the item to the start position, and sets physics velocity to toss it away from the launcher.
* **Parameters:**
  - `inst` -- Entity instance to launch
  - `launcher` -- Entity instance launching the item
  - `basespeed` -- Base speed for launch velocity
  - `startheight` -- Starting Y position for teleport
  - `startradius` -- Radius offset from launcher for start position
* **Returns:** nil
* **Error states:** Errors if inst or launcher Transform or Physics components are missing.

### `TossItems(inst, dist, radius)`
* **Description:** Finds inventory items within range, removes ice prefabs, deactivates mines, and tosses valid items using TossLaunch if they are not nobounce.
* **Parameters:**
  - `inst` -- Entity instance tossing items
  - `dist` -- Distance offset for search center
  - `radius` -- Search radius for items
* **Returns:** nil
* **Error states:** Errors if TheSim or entity components are missing.

### `DoAOEAttackAndWork(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Combines AOE work (non-dig) and AOE attack logic. Calls DoAOEWork and _AOEAttack.
* **Parameters:**
  - `inst` -- Entity instance attacking
  - `dist` -- Distance offset
  - `radius` -- Attack radius
  - `heavymult` -- Damage multiplier for heavy targets
  - `mult` -- General damage multiplier
  - `forcelanded` -- Boolean to force landed state
  - `targets` -- Table to track targets
* **Returns:** nil
* **Error states:** Errors if _AOEAttack is not defined or global components are missing.

### `DoAOEAttackAndDig(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Combines AOE work (dig), AOE attack, and item tossing. Calls DoAOEWork, _AOEAttack, and TossItems.
* **Parameters:**
  - `inst` -- Entity instance attacking
  - `dist` -- Distance offset
  - `radius` -- Attack radius
  - `heavymult` -- Damage multiplier for heavy targets
  - `mult` -- General damage multiplier
  - `forcelanded` -- Boolean to force landed state
  - `targets` -- Table to track targets
* **Returns:** nil
* **Error states:** Errors if _AOEAttack is not defined or global components are missing.

### `DoArcAttack(inst, dist, radius, arc, heavymult, mult, forcelanded, targets)`
* **Description:** Performs directional AOE work and attack within a specific arc. Calls DoAOEWork and _AOEAttack.
* **Parameters:**
  - `inst` -- Entity instance attacking
  - `dist` -- Distance offset
  - `radius` -- Attack radius
  - `arc` -- Arc angle for directional attack
  - `heavymult` -- Damage multiplier for heavy targets
  - `mult` -- General damage multiplier
  - `forcelanded` -- Boolean to force landed state
  - `targets` -- Table to track targets
* **Returns:** nil
* **Error states:** Errors if _AOEAttack is not defined or global components are missing.

### `DoAOEAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Performs standard AOE work and attack. Calls DoAOEWork and _AOEAttack.
* **Parameters:**
  - `inst` -- Entity instance attacking
  - `dist` -- Distance offset
  - `radius` -- Attack radius
  - `heavymult` -- Damage multiplier for heavy targets
  - `mult` -- General damage multiplier
  - `forcelanded` -- Boolean to force landed state
  - `targets` -- Table to track targets
* **Returns:** nil
* **Error states:** Errors if _AOEAttack is not defined or global components are missing.

### `DoRunWork(inst)`
* **Description:** Performs AOE work while running with fixed distance 1 and radius 2.
* **Parameters:**
  - `inst` -- Entity instance performing work
* **Returns:** nil

### `DoLandingWork(inst)`
* **Description:** Performs AOE work on landing with fixed distance 0 and radius 2.
* **Parameters:**
  - `inst` -- Entity instance performing work
* **Returns:** nil

### `DoFinWork(inst)`
* **Description:** Performs AOE dig work and tosses items with fixed distance 0.3 and radius 0.8.
* **Parameters:**
  - `inst` -- Entity instance performing work
* **Returns:** nil

### `SpawnSwipeFX(inst, offset, reverse)`
* **Description:** Spawns sharkboi_swipe_fx prefab, parents it to inst, sets position, and optionally reverses animation.
* **Parameters:**
  - `inst` -- Entity instance spawning FX
  - `offset` -- X offset for FX position
  - `reverse` -- Boolean to reverse the FX animation
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab or inst.sg.statemem is missing.

### `KillSwipeFX(inst)`
* **Description:** Removes the swipe FX prefab if it exists and is valid, and clears the statemem reference.
* **Parameters:**
  - `inst` -- Entity instance owning the FX
* **Returns:** nil

### `SpawnIcePlowFX(inst, sideoffset)`
* **Description:** Spawns sharkboi_iceplow_fx prefab at inst position, adjusted by sideoffset perpendicular to rotation.
* **Parameters:**
  - `inst` -- Entity instance spawning FX
  - `sideoffset` -- Lateral offset for FX position
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab or inst Transform is missing.

### `SpawnIceImpactFX(inst, x, z)`
* **Description:** Spawns sharkboi_iceimpact_fx prefab at specified or inst position.
* **Parameters:**
  - `inst` -- Entity instance spawning FX
  - `x` -- X position for FX or nil to use inst position
  - `z` -- Z position for FX or nil to use inst position
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab or inst Transform is missing.

### `SpawnIceTrailFX(inst)`
* **Description:** Spawns sharkboi_icetrail_fx prefab at inst position and matches inst rotation.
* **Parameters:**
  - `inst` -- Entity instance spawning FX
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab or inst Transform is missing.

### `SpawnIceHoleFX(inst, x, z)`
* **Description:** Spawns sharkboi_icehole_fx prefab at specified or inst position and returns the FX instance.
* **Parameters:**
  - `inst` -- Entity instance spawning FX
  - `x` -- X position for FX or nil to use inst position
  - `z` -- Z position for FX or nil to use inst position
* **Returns:** FX entity instance
* **Error states:** Errors if SpawnPrefab or inst Transform is missing.

### `IsTargetInFront(inst, target, arc)`
* **Description:** Checks if the target is within the specified arc angle in front of inst based on rotation.
* **Parameters:**
  - `inst` -- Entity instance checking angle
  - `target` -- Target entity to check
  - `arc` -- Arc angle threshold or nil defaults to 180
* **Returns:** boolean
* **Error states:** Returns false if target is nil or invalid.

### `IsSpawnPointClear(pt)`
* **Description:** Checks if a position is clear of entities with locomotor component and without INLIMBO, invisible, or flight tags.
* **Parameters:**
  - `pt` -- Position table with x and z fields
* **Returns:** boolean
* **Error states:** Errors if TheSim is missing.

### `TryChatter(inst, strtblname, index, ignoredelay, force)`
* **Description:** Triggers chatter via talker component if delay constraints are met. Updates lastchatter time and sets echo priority.
* **Parameters:**
  - `inst` -- Entity instance chatting
  - `strtblname` -- String table name for chatter
  - `index` -- Specific string index or nil for random
  - `ignoredelay` -- Boolean to bypass delay check
  - `force` -- Boolean to force text display
* **Returns:** nil
* **Error states:** Errors if inst.components.talker or STRINGS are missing.

### `onenter (idle)(inst, norotate)`
* **Description:** Handles transitions to sleep, give, or defeat states based on conditions. Stops locomotor, plays idle animation, and manages rotation tags.
* **Parameters:**
  - `inst` -- Entity instance entering state
  - `norotate` -- Boolean flag to disable rotation
* **Returns:** nil
* **Error states:** Errors if ShouldBeDefeated or inst components are missing.

### `onexit (idle)(inst)`
* **Description:** Resets face direction to four-faced if not keepsixfaced and disables locomotor pusheventwithdirection.
* **Parameters:**
  - `inst` -- Entity instance exiting state
* **Returns:** nil

### `onenter (talk)(inst, noanim)`
* **Description:** Stops locomotor, sets six-faced rotation, plays talk animations if not noanim, and sets state timeout.
* **Parameters:**
  - `inst` -- Entity instance entering state
  - `noanim` -- Boolean flag to skip animation
* **Returns:** nil

### `ontimeout (talk)(inst)`
* **Description:** Sets keepsixfaced flag and transitions to talk_pst state.
* **Parameters:**
  - `inst` -- Entity instance timing out
* **Returns:** nil

### `onexit (talk)(inst)`
* **Description:** Resets face direction to four-faced if not keepsixfaced.
* **Parameters:**
  - `inst` -- Entity instance exiting state
* **Returns:** nil

### `onenter (refuse)(inst, data)`
* **Description:** Stops locomotor, sets six-faced transform, plays reject animation. If data provided, faces giver and plays chatter based on reason (SHARKBOI_REFUSE_NOT_OCEANFISH, SHARKBOI_REFUSE_TOO_SMALL, SHARKBOI_REFUSE_EMPTY).
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional table with giver entity and reason string (NOT_OCEANFISH, TOO_SMALL, EMPTY)
* **Returns:** nil
* **Error states:** None

### `onexit (refuse)(inst)`
* **Description:** Restores four-faced transform if keepsixfaced state memory flag is not set.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (give)(inst, giver)`
* **Description:** Stops locomotor, sets six-faced transform, plays take animation, stores giver in state memory. Plays chatter based on pendingreward count (SHARKBOI_ACCEPT_BIG_OCEANFISH if `>1`, SHARKBOI_ACCEPT_OCEANFISH otherwise).
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `giver` -- entity giving the oceanfish
* **Returns:** nil
* **Error states:** None

### `onupdate (give)(inst)`
* **Description:** Continuously faces the giver entity while valid. Clears giver from state memory if giver becomes invalid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (give)(inst)`
* **Description:** Restores four-faced transform if keepsixfaced state memory flag is not set.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (spawn)(inst)`
* **Description:** Stops locomotor, plays spawn animation, plays emerge and spawn sounds, spawns splash Green_large prefab, plays idle chatter, ignores all talker input with spawn source, sets random rotation, applies motor velocity override for emergence movement, disables collisions, triggers impact shake.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (spawn)(inst)`
* **Description:** Stops ignoring talker input, clears motor velocity override, stops physics. Re-enables collisions at position if isobstaclepassthrough memory flag is set.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (hit)(inst, nextstateparams)`
* **Description:** Stops locomotor, plays hit animation, plays hit sound, updates hit recovery delay, stores nextstateparams. Restores dizzy or torpedoready tags if present in lasttags.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `nextstateparams` -- optional parameters for state transition after hit recovery
* **Returns:** nil
* **Error states:** None

### `onenter (attack1)(inst, target)`
* **Description:** Stops locomotor, plays atk1 animation, faces target if valid, stores target in state memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- attack target entity
* **Returns:** nil
* **Error states:** None

### `onexit (attack1)(inst)`
* **Description:** Calls KillSwipeFX to clean up swipe visual effects.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (attack1_pst)(inst)`
* **Description:** Stops locomotor and plays atk1_pst post-attack animation.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (attack2)(inst, target)`
* **Description:** Stops locomotor, plays atk2 animation, stores target in state memory, starts combat attack, plays attack and swipe sounds, spawns swipe FX.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- attack target entity
* **Returns:** nil
* **Error states:** None

### `onexit (attack2)(inst)`
* **Description:** Calls KillSwipeFX to clean up swipe visual effects.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (attack2_pst)(inst)`
* **Description:** Stops locomotor movement and plays the atk2_pst animation. Removes busy tag at FrameEvent 5 via timeline.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (attack2_delay)(inst, target)`
* **Description:** Stops locomotor, plays atk2_delay animation, and stores target reference and position in statemem. Rotates entity halfway toward target if angle difference is less than 60 degrees.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- target entity to face and track
* **Returns:** nil
* **Error states:** None

### `onupdate (attack2_delay)(inst)`
* **Description:** Continuously updates target position if target is valid, and rotates entity toward target position with clamped rotation speed (max 1 degree per update) if angle difference is less than 90 degrees.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (attack3)(inst, target)`
* **Description:** Stops locomotor, plays atk3 animation, stores target in statemem, calls combat:StartAttack(), and sets physics motor velocity override to 9. Timeline includes deceleration at FrameEvent 3, sound effects at FrameEvents 6 and 8, swipe FX spawn, arc attack at FrameEvent 12, caninterrupt tag at FrameEvent 19, and busy tag removal at FrameEvent 24.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- target entity for the attack
* **Returns:** nil
* **Error states:** None

### `onupdate (attack3)(inst)`
* **Description:** Handles deceleration by decrementing decelspeed from 9 to 1, updating motor velocity override each step, then clearing override and stopping physics when decelspeed reaches 1 or below.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (attack3)(inst)`
* **Description:** Clears motor velocity override and stops physics to ensure clean exit from attack state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (ice_summon)(inst, target)`
* **Description:** Stops locomotor, plays ice_summon animation, stores target reference and position, and forces entity to face target position. Timeline includes sound effects at FrameEvents 10 and 35, spawns sharkboi_icetunnel_fx prefab at FrameEvent 35, removes noelectrocute tag at FrameEvent 42, and adds caninterrupt tag at FrameEvent 58.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- target entity to face
* **Returns:** nil
* **Error states:** None

### `onupdate (ice_summon)(inst)`
* **Description:** Updates target position if target is valid, and rotates entity toward target position with clamped rotation speed (max 2 degrees per update) if angle difference is less than 90 degrees.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (ice_summon)(inst)`
* **Description:** Removes the ice tunnel FX prefab if state was interrupted (not_interrupted flag is false) and FX is still valid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (torpedo_pre)(inst, target)`
* **Description:** Stops locomotor, plays torpedo_pre animation. Checks lasttags for electrocute or hit to set quick/slightlyquick flags and adjust animation frame. Plays attack_small sound. Stores target reference and position, forces entity to face target. Timeline triggers PlayFootstep at varying frames based on quick flags.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- target entity to face
* **Returns:** nil
* **Error states:** None

### `onupdate (torpedo_pre)(inst)`
* **Description:** Updates target position if target is valid, and rotates entity toward target position with clamped rotation speed (max 2 degrees per update) if angle difference is less than 90 degrees.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (torpedo_jump)(inst)`
* **Description:** Stops locomotor, plays torpedo_jump animation, plays attack_big sound, calls combat:StartAttack(), stops and starts torpedo_cd timer with TUNING.SHARKBOI_TORPEDO_CD, sets motor velocity override to 16, disables character collisions, and initializes empty targets array in statemem. Timeline plays torpedo_drill sound at FrameEvent 8.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onupdate (torpedo_jump)(inst)`
* **Description:** Calls DoAOEAttackAndWork with radius 2.5 and damage 1, passing statemem.targets array to track hit entities.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (torpedo_jump)(inst)`
* **Description:** If torpedo state was not entered (torpedo flag is false), kills drill sound, clears motor velocity override, stops physics, and re-enables character collisions.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onupdate (torpedo)(inst)`
* **Description:** Calls DoAOEAttackAndDig for area damage, manages ice delay counters (icedelay, traildelay, shakedelay) spawning ice plow/trail FX and digging shake effects at intervals. Returns early if state is no longer torpedo.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `ontimeout (torpedo)(inst)`
* **Description:** Transitions to torpedo_climb state when torpedo state timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (torpedo)(inst)`
* **Description:** Restores four-faced transform, clears motor velocity override, stops physics, re-enables character collisions, and kills drill sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (torpedo_climb)(inst)`
* **Description:** Stops locomotor and plays torpedo_climb animation.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (torpedo_dizzy)(inst, hits)`
* **Description:** Stops locomotor, plays torpedo_dizzy animation. If hits provided, sets animation frame to 23, plays hit sound at 0.6 volume, and stores hits in statemem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `hits` -- optional number of hits received, affects frame and sound playback
* **Returns:** nil
* **Error states:** None

### `onenter (torpedo_pst)(inst, hits)`
* **Description:** Stops locomotor, plays torpedo_pst animation. If hits, sets frame to 19 and plays talk/hit sounds. Otherwise adds dizzy and caninterrupt tags. Sets statemem.hits to 3 to prevent returning to torpedo_dizzy.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `hits` -- optional number of hits received
* **Returns:** nil
* **Error states:** None

### `onenter (standing_dive_jump_pre)(inst, target)`
* **Description:** Stops locomotor, plays icedive_standing_jump_pre animation. If target is valid, stores target and targetpos in statemem and forces entity to face target position.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- optional target entity to face and track
* **Returns:** nil
* **Error states:** None

### `onupdate (standing_dive_jump_pre)(inst)`
* **Description:** Tracks target position updates including velocity leading (0.3s prediction). Updates rotation to face target if angle difference is less than 45 degrees, otherwise clears target.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dive_jump_delay)(inst, target)`
* **Description:** Stops locomotor, hides entity, toggles off all object collisions. Sets motor velocity override based on whether idle tag was in lasttags (TUNING.SHARKBOI_FINSPEED / 4 or / 2). Sets 0.5 second timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- optional target entity to track
* **Returns:** nil
* **Error states:** None

### `onupdate (dive_jump_delay)(inst)`
* **Description:** Tracks target position updates with velocity leading (0.3s prediction). Updates rotation to face target if angle difference is less than 45 degrees, otherwise clears target.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `ontimeout (dive_jump_delay)(inst)`
* **Description:** Sets diving flag in statemem and transitions to dive_jump_pre state with target and targetpos data.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (dive_jump_delay)(inst)`
* **Description:** Clears motor velocity override and stops physics. If not diving, restores all object collisions at current position. Shows entity.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dive_jump_pre)(inst, data)`
* **Description:** Stops locomotor, plays icedive_jump_pre animation, disables dynamic shadow. If data is valid entity or table, stores target/targetpos in statemem and forces face point. Toggles off all object collisions and triggers digging shake.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional target entity or table with target/targetpos fields
* **Returns:** nil
* **Error states:** None

### `onupdate (dive_jump_pre)(inst)`
* **Description:** If targets exist in statemem, calls DoAOEAttackAndDig. Tracks single target position with velocity leading (0.3s prediction) and updates rotation if angle difference is less than 45 degrees.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dive_jump)(inst, pos)`
* **Description:** Stops locomotor, plays icedive_jump animation, plays attack sound, starts combat attack, manages standing_dive_cd timer based on fastdig tag, calculates dive distance using rotation and target position, clamps distance between 2-8 units, adjusts for ground gaps, sets motor velocity override, and toggles off object collisions.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `pos` -- optional target position vector for dive direction calculation
* **Returns:** nil
* **Error states:** None

### `onexit (dive_jump)(inst)`
* **Description:** Clears motor velocity override, stops physics, gets world position, and toggles on object collisions at entity position.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dive_dig_pre)(inst, targets)`
* **Description:** Stops locomotor, plays icedive_dig_pre animation, plays divedown sound, spawns ice impact FX, triggers impact shake, performs AOE attack and dig on targets, transitions to dive_dig_hit if sleeping or should be defeated, adds fastdig state tag if lasttags contains fastdig.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `targets` -- table of target entities from previous dive_jump state
* **Returns:** nil
* **Error states:** None

### `onenter (dive_dig_loop)(inst, hits)`
* **Description:** Stops locomotor, plays icedive_dig_loop animation (looping if no hits and no fastdig tag), stores hits in statemem, sets timeout to 2x animation length if not fastdig, plays looping feet sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `hits` -- number of hits accumulated, or nil
* **Returns:** nil
* **Error states:** None

### `ontimeout (dive_dig_loop)(inst)`
* **Description:** Transitions to dive_dig_pst state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (dive_dig_loop)(inst)`
* **Description:** Kills the looping sound named 'loop'.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dive_dig_hit)(inst, hits)`
* **Description:** Stops locomotor, plays icedive_dig_hit animation, increments hits counter in statemem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `hits` -- number of hits, defaults to 0 if nil
* **Returns:** nil
* **Error states:** None

### `onenter (dive_dig_pst)(inst)`
* **Description:** Stops locomotor, plays icedive_dig_pst animation, spawns and pauses ice hole FX.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (dive_dig_pst)(inst)`
* **Description:** If not finished, toggles on object collisions and enables dynamic shadow. If FX exists, resumes its animation.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (dive_dig_stun)(inst)`
* **Description:** Stops locomotor, plays icedive_stun animation, plays popup sound, spawns ice impact and hole FX, triggers digging shake, sets motor velocity override to 4 for bounce effect.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (dive_dig_stun)(inst)`
* **Description:** Clears motor velocity override and stops physics.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (fin_idle)(inst)`
* **Description:** Stops locomotor movement, hides entity, toggles off object collisions, sets 0.6 second timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `ontimeout (fin_idle)(inst)`
* **Description:** Resets combat cooldown.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (fin_idle)(inst)`
* **Description:** Gets world position, toggles on object collisions, shows entity.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (fin_start)(inst)`
* **Description:** Runs locomotor forward, plays fin_pre animation, plays movement_thru_ice looping sound if not already playing.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (fin_start)(inst)`
* **Description:** Kills looping sound if fin state was not completed.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (fin)(inst)`
* **Description:** Calls locomotor:RunForward(), plays fin_loop animation if not current, plays movement_thru_ice sound if not already playing, and sets state timeout to animation length.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `ontimeout (fin)(inst)`
* **Description:** Sets statemem.fin to true and transitions to fin state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (fin)(inst)`
* **Description:** Kills the loop sound if statemem.fin is not true.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (fin_stop)(inst, nextstateparams)`
* **Description:** Calls locomotor:RunForward(), plays fin_pst animation, plays movement_thru_ice sound if not already playing, stores nextstateparams in statemem and adds jumping tag if nextstateparams provided, and spawns ice trail FX.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `nextstateparams` -- optional parameters for next state transition
* **Returns:** nil
* **Error states:** None

### `onexit (fin_stop)(inst)`
* **Description:** Calls locomotor:StopMoving() and kills the loop sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (defeat)(inst)`
* **Description:** Calls locomotor:Stop(), plays defeated_pre animation, plays stunned_pre voice sound, calls StopAggro(), and triggers SHARKBOI_TALK_GIVEUP chatter.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (defeat)(inst)`
* **Description:** Calls MakeTrader() if statemem.defeat is false and ShouldBeDefeated returns true.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (defeat_loop)(inst, hits)`
* **Description:** Calls locomotor:Stop(), plays defeated_loop animation (looping), stores hits in statemem, adds caninterrupt tag and sets timeout to 3x animation length if hits `<` 30, otherwise adds noattack tag and sets timeout to 2x animation length if ShouldBeDefeated, and triggers SHARKBOI_TALK_GIVEUP chatter.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `hits` -- number of hits received, or nil
* **Returns:** nil
* **Error states:** None

### `ontimeout (defeat_loop)(inst)`
* **Description:** Sets statemem.defeat to true and transitions to defeat_pst state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (defeat_loop)(inst)`
* **Description:** Calls MakeTrader() if statemem.defeat is false and ShouldBeDefeated returns true.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (defeat_hit)(inst, hits)`
* **Description:** Calls locomotor:Stop(), increments hits, randomly selects defeated_hit1 or defeated_hit2 animation based on hits modulo 10 comparison, stores hits in statemem, plays stunned_hit voice sound, and triggers SHARKBOI_TALK_GIVEUP chatter.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `hits` -- number of hits received, defaults to 0 if nil
* **Returns:** nil
* **Error states:** None

### `onexit (defeat_hit)(inst)`
* **Description:** Calls MakeTrader() if statemem.defeat is false and ShouldBeDefeated returns true.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (defeat_pst)(inst)`
* **Description:** Calls locomotor:Stop(), plays defeated_pst animation, plays stunned_pst voice sound, and adds notarget tag if ShouldBeDefeated returns true.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (defeat_pst)(inst)`
* **Description:** Calls MakeTrader() if statemem.defeat is false and ShouldBeDefeated returns true.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `DoFootstep(inst, volume)`
* **Description:** Local helper function that records lastfootstep time in sg.mem and calls PlayFootstep with the given volume.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `volume` -- sound volume for footstep
* **Returns:** nil
* **Error states:** None

### `endonenter (walk states)(inst)`
* **Description:** CommonStates walk end callback that plays footstep sound if lastfootstep time is older than 0.3 seconds from current time.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `endonenter (run states)(inst)`
* **Description:** CommonStates run end callback that plays footstep sound if lastfootstep time is older than 0.3 seconds from current time.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onsleep (sleep states)(inst)`
* **Description:** CommonStates sleep callback that adds caninterrupt state tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onsleeping (sleep states)(inst)`
* **Description:** CommonStates sleeping callback that plays sleep_lp voice sound as loop.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexitsleeping (sleep states)(inst)`
* **Description:** CommonStates exit sleeping callback that kills the loop sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `loop(inst)`
* **Description:** Animation loop function that checks last state tags and adds corresponding state tags (defeated, digging, dizzy, torpedoready, fin), setting override_combat_fx_size and override_combat_fx_height based on tag, and returns the appropriate shock loop animation name.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** Animation name string or nil

### `pst(inst)`
* **Description:** Animation post function that checks last state tags and adds corresponding state tags, returning the appropriate shock pst animation name for defeated and fin states; digging state adds tag but no animation (handled in pst_onenter).
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** Animation name string or nil

### `loop_onenter(inst)`
* **Description:** Clears override_combat_fx_size and override_combat_fx_height to nil on state enter, allowing FX to reset since FX is already spawned at this point.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `loop_onexit(inst)`
* **Description:** Clears transfer_hits and transfer_target from sg.mem if state was not interrupted; if defeated tag is present and ShouldBeDefeated returns true, calls MakeTrader to convert entity.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** None

### `pst_onenter(inst)`
* **Description:** Checks if digging tag was present in lasttags and transitions to dive_dig_stun state if true.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onanimover(inst)`
* **Description:** Called when animation completes; checks state tags and transitions to appropriate next state: defeat_loop for defeated, torpedo_pst/torpedo_dizzy for dizzy based on hit count, torpedo_pre for torpedoready, fin/fin_stop based on locomotor movement for fin tag, or idle as fallback.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** None

### `pst_onexit(inst)`
* **Description:** Clears transfer_hits and transfer_target from sg.mem; if defeated tag is present and defeat was not already recorded in statemem and ShouldBeDefeated returns true, calls MakeTrader.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** None

## Events & listeners

**Listens to:**
- `electrocute` — Triggers electrocute state transition with state memory transfer via CommonHandlers.TryElectrocuteOnEvent
- `locomote` — Transitions between idle, walk_start, run_start, fin_start, fin_stop, walk_stop, or run_stop states based on locomotor movement flags and current state tags
- `attacked` — Handles hit recovery with state-specific transitions for defeated, digging, dizzy, and torpedoready states; checks busy and interrupt tags
- `minhealth` — Triggers hit or dive_dig_hit state when health reaches minimum, unless entity is trading or already defeated
- `doattack` — Calls ChooseAttack to select and transition to appropriate attack state if not busy or defeated
- `ontalk` — Records talk time and transitions to talk state if not hostile, trading, or busy
- `trade` — Handles trade completion by transitioning to give state or storing pending giver if busy
- `onrefuseitem` — Transitions to refuse state when trade is declined, if not busy
- `animover` — Multiple states listen for animation completion to transition to idle or next attack state
- `animqueueover` — Transitions to dive_dig_pst when animation queue completes (dive_dig_loop)

**Pushes:**
None.