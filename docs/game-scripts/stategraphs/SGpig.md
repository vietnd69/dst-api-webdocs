---
id: SGpig
title: SGpig
description: Stategraph defining animation and behavior states for pig-type entities including werepig transformation.
tags: [ai, animation, stategraph, pig, werepig]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 0e25a643
system_scope: brain
---

# SGpig

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`SGpig` is the stategraph that controls animation states and behavioral transitions for pig-type entities in Don't Starve Together. It manages standard actions like attacking, eating, and chopping, as well as special states for werepig transformation, follower loyalty behaviors, and death handling with shadow parasite revival support. This stategraph integrates with the `combat`, `follower`, `health`, `sleeper`, and `shadowparasitemanager` components to coordinate entity behavior.

## Usage example
```lua
-- Attach the pig stategraph to a pig prefab entity
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("follower")
inst:AddComponent("sleeper")

-- Assign the stategraph
inst:SetStateGraph("SGpig")

-- Trigger state transitions via events
inst:PushEvent("transformnormal")
inst:PushEvent("cheer")
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- provides CommonHandlers and CommonStates helper functions for standard state definitions

**Components used:**
- `combat` -- calls HasTarget(), StartAttack(), DoAttack() for combat states
- `follower` -- calls GetLeader(), GetLoyaltyPercent() for loyalty-based animations
- `health` -- calls IsDead() to check entity death state
- `leader` -- calls IsRollCalling() via leader entity for roll call detection
- `sleeper` -- calls GoToSleep() after werepig transformation
- `shadowparasitemanager` -- calls ReviveHosted() for parasite revival on death

**Tags:**
- `idle` -- added to funnyidle state
- `busy` -- added to death, abandon, transformNormal, attack, eat, hit, dropitem, cheer, win_yotb states
- `transform` -- added to transformNormal state
- `sleeping` -- added to transformNormal state
- `noelectrocute` -- added to transformNormal state
- `attack` -- added to attack state
- `chopping` -- added to chop state
- `hostile` -- removed during transformNormal state
- `guard` -- checked in funnyidle for angry animation

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `StateGraph("pig", states, events, "init", actionhandlers)`
* **Description:** Constructs and returns the pig stategraph with all defined states, event handlers, default init state, and action handlers. This is the return value of the file.
* **Parameters:**
  - `states` -- table of State definitions including custom and CommonStates-added states
  - `events` -- table of EventHandler and CommonHandler definitions
  - `"init"` -- default starting state name
  - `actionhandlers` -- table of ActionHandler mappings for player actions
* **Returns:** StateGraph instance assigned to pig-type entities

## States

### `funnyidle`
* **Description:** Default idle state with context-sensitive animations based on loyalty, time of day, combat status, and guard status.
* **Tags:** `idle`
* **Transitions:** On `animover` event, returns to `idle` state.
* **Behavior:** Plays "oink" sound on enter. Animation varies: "hungry" if loyalty `<= 0.05` and not roll-called, "idle_angry" if guard or has combat target, "idle_scared" at night, "idle_happy" if loyalty `> 0.3` or roll-called, otherwise "idle_creepy".

### `death`
* **Description:** Handles death animation and loot dropping, with shadow parasite revival support.
* **Tags:** `busy`
* **Transitions:** On `animover`, either calls `ReviveHosted()` if parasite-hosted or transitions to `corpse` state.
* **Behavior:** Plays grunt sound and death animation. Removes physics colliders and drops loot unless shadow parasite revival is pending.

### `abandon`
* **Description:** Plays abandonment animation when follower relationship ends.
* **Tags:** `busy`
* **Parameters:** `leader` -- the leader entity to face during animation
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Stops physics, plays "abandon" animation, faces leader position if leader is valid.

### `transformNormal`
* **Description:** Handles werepig-to-pig transformation with symbol overrides and post-transform sleep.
* **Tags:** `transform`, `busy`, `sleeping`, `noelectrocute`
* **Transitions:** On `animover`, calls `GoToSleep(15-19 seconds)` and transitions to `sleeping` state.
* **Behavior:** Plays transformation sound, switches to werepig_build, plays transform animation, removes `hostile` tag, overrides pig body symbols. On exit, restores original build and clears symbol overrides.

### `attack`
* **Description:** Standard attack animation with combat component integration.
* **Tags:** `attack`, `busy`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Plays attack and whoosh sounds, calls `StartAttack()`, stops physics, plays "atk" animation. At frame 13, calls `DoAttack()` and removes `attack` and `busy` tags.

### `chop`
* **Description:** Tree chopping action state.
* **Tags:** `chopping`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Stops physics, plays "atk" animation. At frame 13, performs buffered action.

### `eat`
* **Description:** Eating animation with sound effects.
* **Tags:** `busy`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Stops physics, plays "eat" animation. Performs buffered action at frame 10. Plays eat sound at frame 2, chew sounds at frames 11 and 21.

### `hit`
* **Description:** Hit reaction state when attacked.
* **Tags:** `busy`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Plays oink sound and hit animation, stops physics, updates hit recovery delay.

### `dropitem`
* **Description:** Item dropping/pickup animation state.
* **Tags:** `busy`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Stops physics, plays "pig_pickup" animation. Performs buffered action at frame 10.

### `cheer`
* **Description:** Cheer/buff animation state.
* **Tags:** `busy`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Stops physics, plays "buff" animation.

### `win_yotb`
* **Description:** Year of the Beast victory animation state.
* **Tags:** `busy`
* **Transitions:** On `animover`, returns to `idle` state.
* **Behavior:** Stops physics, plays "win" animation.

### CommonStates-added states
* **Description:** Additional states added via CommonStates helper functions.
* **States included:**
  - `walk` / `run` -- locomotion states with footstep sounds
  - `sleep` -- sleeping state with snore sound at frame 35
  - `idle` -- default idle (mapped to funnyidle)
  - `refuse` -- rejection animation ("pig_reject")
  - `frozen` -- freeze reaction states
  - `electrocute` -- electrocution reaction states
  - `pickup` -- item pickup action (10 frames)
  - `gohome` -- go home action (4 frames)
  - `hop` -- boat jump states (pre, loop, post)
  - `sink` / `washashore` -- water interaction states
  - `voidfall` -- falling into void state
  - `ipecacpoop` -- ipecac poison reaction
  - `parasiterevive` -- shadow parasite revival state
  - `corpse` -- corpse/chomped states

## Events & listeners
**Listens to:**
- `transformnormal` -- transitions to transformNormal state if not dead
- `doaction` -- transitions to chop state if action is CHOP and not busy/dead
- `cheer` -- transitions to cheer state if not busy/dead
- `win_yotb` -- transitions to win_yotb state if not busy/dead
- `animover` -- returns to idle state from most action states
- CommonHandlers: `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnAttack`, `OnAttacked`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid`, `OnIpecacPoop`, `OnCorpseChomped`

**Pushes:** None identified

## Action handlers
| Action | State |
|--------|-------|
| `ACTIONS.GOHOME` | gohome |
| `ACTIONS.EAT` | eat |
| `ACTIONS.CHOP` | chop |
| `ACTIONS.PICKUP` | pickup |
| `ACTIONS.EQUIP` | pickup |
| `ACTIONS.ADDFUEL` | pickup |
| `ACTIONS.TAKEITEM` | pickup |
| `ACTIONS.UNPIN` | pickup |
| `ACTIONS.DROP` | dropitem |
| `ACTIONS.MARK` | dropitem |