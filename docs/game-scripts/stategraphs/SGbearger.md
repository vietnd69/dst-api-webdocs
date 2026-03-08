---
id: SGbearger
title: Sgbearger
description: Manages the complete behavioral stategraph for the Bearger entity, including movement, combat, attacks, staggering, yawn-based crowd control, and state transitions during special actions.
tags: [entity, combat, locomotion, physics, fx]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: f8d4d748
system_scope: entity
---

# Sgbearger

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbearger` is the stategraph component that defines the full behavioral state machine for the Bearger entity. It orchestrates transitions between movement states (walking, running, jumping), idle states (sleeping, waking), combat states (attack initiation, combo attacks, butt attacks), and special states (yawn, stagger, death). The stategraph integrates with core systems such as combat targeting, inventory, locomotion, and terrain interaction to handle complex AI logic, including arc and radial area-of-effect attacks, terrain destruction, camera shake, and coordination with mounted entities. State transitions are driven by internal logic, animation events, and external events like damage or stagger requests.

## Usage example
```lua
local bearger = SpawnPrefab("bearger")
bearger:AddComponent("combat")
bearger:AddComponent("health")
bearger:AddComponent("locomotor")
bearger:AddStateGraph("bearger", "stategraphs/SGbearger.lua")
-- The Bearger will automatically begin in the 'init' state, transitioning to 'idle'.
bearger.sg:GoToState("run") -- initiates running
bearger.sg:GoToState("sleep") -- begins sleep state
```

## Dependencies & tags
**Components used:**
- `combat` — for targeting, attack coordination, and cooldowns
- `health` — for death and state validation (`IsDead`)
- `eater` — for inventory filtering (`CanEat`)
- `inventory` — for item removal, armor tag checks (`ArmorHasTag`)
- `sleeper` — for sleepiness/grogginess effects during yawn
- `grogginess` — for grogginess accumulation
- `locomotor` — for movement control (`StopMoving`, `Stop`)
- `timer` — for cooldown and stagger timers
- `freezable` / `pinnable` / `fossilizable` — conditional checks in `yawnfn`
- `rider` — for mounted entity handling during yawn
- `groundpounder` — for ground pound execution
- `Transform` — for position, rotation, and parent updates
- `Physics` — for motor velocity overrides and collision toggling
- `SoundEmitter` — for sound playback
- `AnimState` — for animation management, FX parent, and stand state

**Tags:**
- Entity tags:
  - `"playerghost"`, `"FX"`, `"DECOR"`, `"INLIMBO"` — excluded from yawn targets (`YAWNTARGET_CANT_TAGS`)
  - `"sleeper"`, `"player"` — required for yawn targets (`YAWNTARGET_ONEOF_TAGS`)
  - `"NPC_workable"`, `"CHOP_workable"`, `"DIG_workable"`, `"HAMMER_workable"`, `"MINE_workable"` — workable types destroyable by Bearger
  - `"heavyarmor"`, `"heavybody"` — checked for knockback reduction
  - `"INLIMBO"`, `"flight"`, `"invisible"`, `"notarget"`, `"noattack"` — excluded from AOE targets
  - `"_combat"` — required for AOE targets
- State tags (via `inst.sg`):
  - `"busy"`, `"idle"`, `"canrotate"`, `"attack"`, `"hit"`, `"caninterrupt"`, `"staggered"`, `"frozen"`, `"yawn"`, `"weapontoss"`, `"jumping"`, `"nointerrupt"`
  - `"noelectrocute"`, `"dead"`, `"wantstoeat"`, `"moving"`, `"running"`, `"atk_pre"`, `"sleeping"`, `"nowake"`, `"waking"`, `"nosleep"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.swipefx` | `string` | `nil` | Prefab name for swipe FX (e.g., `"bearger_swipe"`) |
| `TUNING.BEARGER_YAWN_RANGE` | `number` | `20` | Max range for yawn targets (derived from `TUNING`) |
| `TRACKING_ARC` | `number` | `math.PI / 2` | Cone angle (radians) for target tracking/validity checks |

## Main functions
### `yawnfn(inst)`
* **Description:** Finds eligible targets within `TUNING.BEARGER_YAWN_RANGE`, applies sleepiness and grogginess, and handles mounted entities separately. Skips invalid, frozen, pinned, or fossilized targets, and entities lacking required tags.
* **Parameters:** `inst` — the Bearger entity instance.
* **Returns:** `true` (always, regardless of target count).

### `ClearInventory(inst)`
* **Description:** Removes all items from the Bearger's inventory that it can eat (via `CanEat` check), using the eater component.
* **Parameters:** `inst` — the Bearger entity instance.
* **Returns:** `nil` (early return if no inventory component).

### `ChooseAttack(inst, target)`
* **Description:** Determines and triggers an appropriate attack state based on current state, target type (e.g., beehive), hibernation status, timers, and `canrunningbutt` flags. Clears inventory on interruption.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `target` — optional override for combat target; defaults to `inst.components.combat.target`.
* **Returns:** `true` if a state transition occurs; `false` if no valid target or transition skipped.

### `DestroyStuff(inst, dist, radius, arc, nofx)`
* **Description:** Destroys collapsible workables (e.g., campfires, walls) in a cone-shaped area. Respects `COLLAPSIBLE_WORK_ACTIONS`, `COLLAPSIBLE_TAGS`, and `NON_COLLAPSIBLE_TAGS`. Skips FX spawn when `nofx` is `true`.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `dist` — forward offset distance to adjust hit position.
  - `radius` — detection radius.
  - `arc` — angular cone limit (radians); `nil` disables arc check.
  - `nofx` — if `true`, skips FX spawn.
* **Returns:** `nil`.

### `DoArcAttack(inst, dist, radius, heavymult, mult, forcelanded, targets)`
* **Description:** Performs an AOE arc attack, damaging and applying knockback to eligible targets in a forward-facing cone. Handles heavy armor/`heavybody` knockback reduction.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `dist` — forward offset for attack origin.
  - `radius` — base detection radius (plus padding).
  - `heavymult`, `mult` — knockback strength multipliers (`nil` disables knockback).
  - `forcelanded` — passed to knockback event.
  - `targets` — optional table to track already-hit targets.
* **Returns:** `nil`.

### `DoComboArcAttack(inst, targets)`
* **Description:** Wrapper for `DoArcAttack` with fixed combo parameters (no knockback, default radius and distance).
* **Parameters:** 
  - `inst` — the Bearger instance.
  - `targets` — table of pre-collided targets.
* **Returns:** `nil`.

### `DoComboArcWork(inst)`
* **Description:** Wrapper for `DestroyStuff` with fixed combo parameters (no FX).
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `DoAOEAttack(inst, dist, radius, min_dmg, max_dmg, dir, targets, extra_knockback)`
* **Description:** Performs a radial AOE attack centered at a position offset from `inst`. Supports `extra_knockback` to re-knock already-hit targets.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `dist` — distance offset (scalar, negative = backward) to compute center.
  - `radius` — AOE radius.
  - `min_dmg`, `max_dmg` — damage range.
  - `dir` — direction (`nil` for omnidirectional).
  - `targets` — pre-collided target list.
  - `extra_knockback` — if `true`, knocks back already-hit targets.
* **Returns:** `nil`.

### `TryStagger(inst)`
* **Description:** Attempts to transition to `"stagger_pre"` state. Does not validate preconditions (assumes state transition succeeds).
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `true`.

### `IsAggro(inst)`
* **Description:** Returns `true` if Bearger has a combat target that is not a beehive.
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `true`/`false`.

### `StartTrackingTarget(inst, target)`
* **Description:** Records target info in `statemem`, and rotates Bearger toward target if within `TRACKING_ARC`. Silently skips invalid or `nil` targets.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `target` — the target entity.
* **Returns:** `nil`.

### `UpdateTrackingTarget(inst)`
* **Description:** Continuously rotates Bearger toward tracked target's latest position while tracking is active.
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `StopTrackingTarget(inst)`
* **Description:** Disables target tracking (`statemem.tracking = false`).
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `ShouldComboTarget(inst, target)`
* **Description:** Checks if a target is valid for a combo attack: in range and facing within `TRACKING_ARC`.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `target` — the target entity.
* **Returns:** `true`/`false`.

### `ShouldButtTarget(inst, target)`
* **Description:** Checks if a target is within range for a butt attack (≤8 units) and facing within `TRACKING_ARC` *behind* the Bearger.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `target` — the target entity.
* **Returns:** `true`/`false`.

### `TryButt(inst)`
* **Description:** Attempts to initiate a butt attack if target meets `ShouldButtTarget` criteria and butt recovery is not active.
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `true` if butt state triggered; `false` otherwise.

### `SpawnSwipeFX(inst, offset, reverse)`
* **Description:** Spawns FX prefab (`inst.swipefx`) attached to Bearger, optionally reversed.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `offset` — X-offset for FX spawn.
  - `reverse` — if `true`, plays FX in reverse.
* **Returns:** `nil`.

### `KillSwipeFX(inst)`
* **Description:** Safely removes active swipe FX from `statemem.fx`, if any.
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `ShakeIfClose(inst)`, `ShakeIfClose_Pound(inst)`, `ShakeIfClose_Footstep(inst)`
* **Description:** Triggers camera shake via `TheSim.ShakeAllCameras` if Bearger is within `40` units.
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `DoFootstep(inst)`
* **Description:** Plays step sound; triggers camera shake on stomp (non-quadruped).
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `GoToStandState(inst, state, customtrans, params)`
* **Description:** Transitions to `"bi"` or `"quad"` stand state if not already in it.
* **Parameters:**
  - `inst` — the Bearger instance.
  - `state` — `"bi"` or `"quad"` (case-insensitive).
  - `customtrans`, `params` — passed to `GoToState`.
* **Returns:** `true` if state transition was made; `false` if already in state.

### `ToggleOnCharacterCollisions(inst)`
* **Description:** Re-enables character collisions (likely via `inst.Physics:SetCanCollide(true)`).
* **Parameters:** `inst` — the Bearger instance.
* **Returns:** `nil`.

### `ToggleOffCharacterCollisions(inst)`
* **Description:** Disables character collisions (likely via `inst.Physics:SetCanCollide(false)`). Called via timeline FrameEvent; may be a closure.
* **Parameters:** Called with `inst` implicitly or via closure.
* **Returns:** `nil`.

### `SpawnPrefab(prefabname)`
* **Description:** Spawns a new prefab (e.g., `"bearger_sinkhole"`).
* **Parameters:** `prefabname` — string name of prefab.
* **Returns:** The new prefab instance.

## Events & listeners
**Events listened to:**
- `"doattack"` — triggers `ChooseAttack` or buffers attack in busy states.
- `"attacked"` — handles hit/stagger logic, including electrocution fallback (`CommonHandlers.TryElectrocuteOnAttacked`) and inventory clearing.
- `"animover"` / `"animqueueover"` — transitions to next state upon animation completion.
- `"stagger"` — queues stagger via `statemem.dostagger`.
- `"timerdone"` — triggers transition from `"stagger"` state.
- `"onmissother"` — pushed when combo/attack hits no targets.
- CommonHandlers events: `OnLocomote`, `OnSleepEx`, `OnWakeEx`, `OnFreeze`, `OnElectrocute`, `OnDeath`, `OnSink`, `OnFallInVoid`, `OnCorpseChomped`.

**Events pushed:**
- `"ridersleep"` — for mounted entities during yawn.
- `"yawn"` — for players during yawn.
- `"knockedout"` — fallback for non-sleeper entities.
- `"knockback"` — from arc/AOE attacks.
- `"onmissother"` — when attack misses (e.g., `butt_pst`).
- `"docollapse"` — pushed on sinkhole prefab (`bearger_sinkhole`).