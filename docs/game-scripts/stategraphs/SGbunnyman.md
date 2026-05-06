---
id: SGbunnyman
title: SGbunnyman
description: Stategraph defining animation and behavior states for bunnyman entities.
tags: [ai, animation, creature]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 6d013f8a
system_scope: entity
---

# SGbunnyman

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`SGbunnyman` defines the animation state machine for bunnyman entities, controlling their visual states, movement, combat behaviors, and special interactions. It integrates with common state handlers from `commonstates.lua` and coordinates with multiple components including `combat`, `follower`, `health`, `leader`, and `locomotor`. The stategraph manages transitions between idle, attack, death, and various action states based on entity conditions and external events.

## Usage example
```lua
-- Attach stategraph to a bunnyman entity during prefab creation
local inst = CreateEntity()
inst:AddComponent("locomotor")
inst:AddComponent("combat")
inst:AddComponent("follower")
inst:AddComponent("health")

-- Assign the bunnyman stategraph
inst:SetStateGraph("bunnyman")

-- Trigger states via events
inst:PushEvent("cheer")  -- Plays cheer animation
inst.sg:GoToState("attack")  -- Force attack state
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- provides CommonHandlers and CommonStates helper functions

**Components used:**
- `combat` -- DoAttack(), HasTarget(), StartAttack() for combat actions
- `follower` -- GetLeader(), GetLoyaltyPercent() for loyalty-based animations
- `health` -- GetPercent(), IsDead() for health threshold checks
- `leader` -- IsRollCalling() for roll call detection
- `locomotor` -- RunForward(), WalkForward() for movement states
- `shadowparasitemanager` -- ReviveHosted() for parasite revival on death

**Tags:**
- `busy` -- added to most action states to prevent interruption
- `attack` -- added during attack state

## Properties
| None | | | No properties are defined. |

## Main functions
### `StateGraph("bunnyman", states, events, "init", actionhandlers)`
* **Description:** Constructs and returns the bunnyman stategraph with all defined states, event handlers, and action mappings. This is the file's return value.
* **Parameters:**
  - `name` -- string stategraph name ("bunnyman")
  - `states` -- table of State definitions
  - `events` -- table of EventHandler definitions
  - `"init"` -- default starting state name
  - `actionhandlers` -- table of ActionHandler mappings
* **Returns:** StateGraph instance for assignment via `inst:SetStateGraph()`

### `State{name = "funnyidle"}`
* **Description:** Idle state with conditional animations based on health, loyalty, and combat status. Plays angry animation if health below panic threshold or has combat target, hungry animation if loyalty low, happy animation if loyalty high or roll called, otherwise creepy idle.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** Errors if `inst.components.follower` or `inst.components.health` is nil when state enters.

### `State{name = "death"}`
* **Description:** Handles death animation and loot drop. Checks for shadow parasite hosting to potentially revive instead of dropping loot.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** None

### `State{name = "abandon"}`
* **Description:** Plays abandonment animation when follower relationship ends. Faces the leader entity if valid.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** None (leader validity checked before FacePoint call)

### `State{name = "attack"}`
* **Description:** Executes attack animation with sound effects. Triggers combat damage at frame 13 via TimeEvent.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** Errors if `inst.components.combat` is nil when StartAttack() or DoAttack() is called.

### `State{name = "eat"}`
* **Description:** Plays eating animation and performs buffered action at frame 20.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** None

### `State{name = "hit"}`
* **Description:** Plays hurt animation and updates hit recovery delay.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** None

### `State{name = "cheer"}`
* **Description:** Plays happy animation with sound. Triggered by "cheer" event if not busy or dead.
* **Parameters:** None (state definition)
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `cheer` -- transitions to cheer state if not busy or dead
- **Listens to:** `onstep` -- handled by CommonHandlers.OnStep()
- **Listens to:** `onlocomote` -- handled by CommonHandlers.OnLocomote()
- **Listens to:** `onsleep` -- handled by CommonHandlers.OnSleep()
- **Listens to:** `onfreeze` -- handled by CommonHandlers.OnFreeze()
- **Listens to:** `onelectrocute` -- handled by CommonHandlers.OnElectrocute()
- **Listens to:** `onattack` -- handled by CommonHandlers.OnAttack()
- **Listens to:** `onattacked` -- handled by CommonHandlers.OnAttacked() with max stun locks from TUNING.BUNNYMAN_MAX_STUN_LOCKS
- **Listens to:** `ondeath` -- handled by CommonHandlers.OnDeath()
- **Listens to:** `onhop` -- handled by CommonHandlers.OnHop()
- **Listens to:** `onsink` -- handled by CommonHandlers.OnSink()
- **Listens to:** `onfallinvoid` -- handled by CommonHandlers.OnFallInVoid()
- **Listens to:** `oncorpsechomped` -- handled by CommonHandlers.OnCorpseChomped()
- **Pushes:** None identified