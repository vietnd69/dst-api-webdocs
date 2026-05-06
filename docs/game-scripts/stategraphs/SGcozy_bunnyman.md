---
id: SGcozy_bunnyman
title: Sgcozy Bunnyman
description: Defines the animation state machine and AI behavior for the Cozy Bunnyman entity.
tags: [ai, animation, stategraph, entity, behavior]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: f11ca9e3
system_scope: entity
---

# Sgcozy Bunnyman

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`SGcozy_bunnyman` is the stategraph responsible for controlling the animations, movement, and reactive behaviors of the Cozy Bunnyman prefab. It manages states for idling, combat, social interactions (cheer, dance, disappoint), and event-specific actions like pillowfighting or hiding. It relies heavily on `commonstates` for standard locomotion and status effects (sleep, freeze, death).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("statemachinegraph")
inst.sg:LoadStateGraph("cozy_bunnyman")

-- Trigger a state change via event
inst:PushEvent("cheer", { text = "Yay!" })

-- Manually transition state
inst.sg:GoToState("idle")
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- Provides standard handlers for locomotion, sleep, freeze, death, and hopping.

**Components used:**
- `locomotor` -- Controls movement speed and stopping during states.
- `talker` -- Displays speech bubbles during emotes.
- `health` -- Checks death status and health percentage for panic logic.
- `combat` -- Manages attack targeting and execution.
- `follower` -- Tracks leader entity and loyalty percentage.
- `leader` -- Checks if leader is roll calling.
- `inventory` -- Handles item giving during eat state.
- `entitytracker` -- Tracks specific entities like carrots.
- `lootdropper` -- Spawns loot on death.
- `timer` -- Manages hide duration timers.

**Tags:**
- `idle` -- Added when idle or creepy.
- `canrotate` -- Allows entity rotation during idle/emote states.
- `emote` -- Marks social animation states.
- `busy` -- Prevents interruption during actions.
- `attack` -- Marks combat states.
- `noattack` -- Prevents attacking during spawn/despawn.
- `hide` -- Marks hidden states.
- `alert` -- Marks alert state.
- `jumping` -- Marks knockback state.
- `sleeping` -- Added by CommonHandlers.
- `frozen` -- Added by CommonHandlers.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AREACLEAR_COMBAT` | table | `{"_combat"}` | Tags used to check for combat entities during hide logic. |
| `AREACLEAR_CHECK_FOR_HOSTILES` | table | `{"hostile", "monster"}` | Tags used to check for hostile entities during hide logic. |
| `RINGOUT_TEXT_DATA` | table | `{text = STRINGS.RABBIT_GIVEUP}` | Default text data for ringout disappointment. |

## Main functions
### `State: "idle"`
* **Description:** Default resting state. Plays idle animations and stops movement.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- State data (unused).
* **Returns:** None
* **Error states:** None

### `State: "cheer"`
* **Description:** Plays happy animation and optional speech.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `text` (string or table of strings).
* **Returns:** None
* **Error states:** Errors if `inst.components.talker` is nil when `data.text` is provided.

### `State: "dance"`
* **Description:** Plays dance animation with sound effect and optional speech.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `text`.
* **Returns:** None
* **Error states:** Errors if `inst.components.talker` is nil when `data.text` is provided.

### `State: "disappoint"`
* **Description:** Plays abandonment animation and optional speech.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `text`.
* **Returns:** None
* **Error states:** Errors if `inst.components.talker` is nil when `data.text` is provided.

### `State: "creepy"`
* **Description:** Plays creepy idle animation and optional speech.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `text`.
* **Returns:** None
* **Error states:** Errors if `inst.components.talker` is nil when `data.text` is provided.

### `State: "reject"`
* **Description:** Plays rejection animation and optional speech.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `text`.
* **Returns:** None
* **Error states:** Errors if `inst.components.talker` is nil when `data.text` is provided.

### `State: "funnyidle"`
* **Description:** Dynamic idle state that changes animation based on health, loyalty, and combat status.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.components.health`, `inst.components.follower`, or `inst.components.combat` are nil.

### `State: "death"`
* **Description:** Plays death animation, stops physics, and drops loot.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `afflicter`.
* **Returns:** None
* **Error states:** Errors if `inst.components.lootdropper` is nil.

### `State: "abandon"`
* **Description:** Plays abandonment animation while facing a leader entity.
* **Parameters:**
  - `inst` -- Entity instance.
  - `leader` -- Leader entity to face (can be nil).
* **Returns:** None
* **Error states:** None

### `State: "attack"`
* **Description:** Executes standard attack animation and combat logic.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.components.combat` is nil.

### `State: "attack_object"`
* **Description:** Executes overhead attack animation for objects.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.components.combat` is nil.

### `State: "attack_object_pre_idle"`
* **Description:** Pre-attack idle state for overhead attacks with looping animation.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "eat"`
* **Description:** Handles eating logic, including special hareball barf behavior.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- State data.
* **Returns:** None
* **Error states:** Errors if `inst.components.inventory` or `inst.components.entitytracker` is nil during specific logic branches.

### `State: "disgust"`
* **Description:** Plays disgust animation with rotation loops and sound effects.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `loopcount` (optional loop counter).
* **Returns:** None
* **Error states:** None (data parameter is nil-checked before access)

### `State: "hide"`
* **Description:** Hides the entity and schedules re-emergence based on area safety.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** Errors if `inst.components.timer` or `inst.components.health` is nil.

### `State: "alert"`
* **Description:** Alert state playing attention animation sequence.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "knockback"`
* **Description:** Applies physics knockback away from a source.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `radius`, `knocker`, `strengthmult`.
* **Returns:** None
* **Error states:** Errors if `inst.components.health` is nil (no nil check before `IsDead()`).

### `State: "spawn_pre"`, `State: "spawn_loop"`, `State: "spawn_pst"`
* **Description:** Sequence for spawning from the ground.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "despawn"`
* **Description:** Removes the entity after animation.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "digtolocation"`
* **Description:** Teleports entity to a specific location with spawn effects.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `pos`, `arena`.
* **Returns:** None
* **Error states:** None

### `State: "pickup"`
* **Description:** Handles item pickup actions, including body pillows.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "gottoken"`
* **Description:** Reaction to receiving a token.
* **Parameters:**
  - `inst` -- Entity instance.
  - `data` -- Table containing `text`.
* **Returns:** None
* **Error states:** Errors if `inst.components.health` is nil (no nil check before `IsDead()` in event handler).

### `CommonStates.AddWalkStates`
* **Description:** Adds standard walking states and timeline logic.
* **Parameters:** `states` table, configuration tables.
* **Returns:** None
* **Error states:** None

### `CommonStates.AddRunStates`
* **Description:** Adds standard running states and timeline logic.
* **Parameters:** `states` table, configuration tables.
* **Returns:** None
* **Error states:** None

### `State: "hit"`
* **Description:** Damage response state playing hurt animation and recovery.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "refuse"`
* **Description:** Rejection state added via CommonStates helper with pig_reject animation.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

### `State: "attack_object_pre"`
* **Description:** Pre-attack state for overhead attacks, sets is_holding_overhead memory flag.
* **Parameters:** `inst` -- Entity instance.
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:**
  - `gobacktocave` -- Transitions to `despawn` if not busy/sleeping.
  - `cheer` -- Transitions to `cheer` state if idle.
  - `disappoint` -- Transitions to `disappoint` state if idle.
  - `dance` -- Transitions to `dance` state if idle.
  - `reject` -- Transitions to `reject` state if idle.
  - `question` -- Transitions to `creepy` state if idle.
  - `hide` -- Transitions to `hide` state if not busy.
  - `digtolocation` -- Transitions to `digtolocation` state if not busy/sleeping.
  - `raiseobject` -- Transitions to `attack_object_pre` state.
  - `pillowfight_ringout` -- Transitions to `disappoint` if alive.
  - `doattack` -- Transitions to `attack` or `attack_object` state.
  - `pillowfight_ended` -- Transitions to `cheer` or `disappoint` based on win status.
  - `knockback` -- Transitions to `knockback` state if alive.
  - `gotyotrtoken` -- Transitions to `gottoken` state if alive.
  - `cheating` -- Transitions to `disappoint` state if alive.
  - `animover` -- Internal event to return to `idle` after animations.
  - `animqueueover` -- Internal event to return to `idle` after animation queues.
  - `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnAttacked`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid` -- Common stategraph handlers.

- **Pushes:**
  - `pillowfight_fighterarrived` -- Pushed by arena component during `digtolocation`.
  - `oneaten` -- Pushed to hareball item during `eat` state.
  - `locomote` -- Pushed by locomotor component during movement states.