---
id: SGwormwood_carrat
title: Sgwormwood Carrat
description: Controls the state machine for the Carrat character in DST, handling idle, movement, pickup/give actions, and death behaviors.
tags: [ai, animation, entity, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a189175b
system_scope: entity
---

# Sgwormwood carrat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph defines the behavior and animation flow for the Carrat character (Wormwood’s companion). It implements a state machine that manages idle looping, movement transitions (walk/run), pickup/give actions, death, and stun recovery. It integrates with common state handlers and leverages the `locomotor` and `lootdropper` components to handle movement control and loot dropping during death.

## Usage example
The stategraph is applied automatically when the Carrat prefab is constructed and does not require manual instantiation. It is referenced as `"wormwood_carrat"` in the stategraph registry and activated when an entity with this stategraph enters its first state.

## Dependencies & tags
**Components used:** `locomotor`, `lootdropper`  
**Tags:** `idle`, `canrotate`, `busy`, `stunned`, `moving`, `running`, `debris` (via `CommonStates.AddWalkStates`, `CommonStates.AddRunStates`, etc.), and `burnt` (inherited from loot logic).

## Properties
No public properties are defined in this stategraph.

## Main functions
This is a declarative stategraph definition returning `StateGraph`. It does not expose callable functions directly. Core state behavior is defined in the `states` table:

- **State: `"idle"`**  
  - *Description:* Default state where Carrat remains stationary and plays idle animations. After a short timeout, it transitions to `"idle2"` or repeats `"idle"`.  
  - *Key behavior:* Sets physics to stopped, plays animation `"idle1"` in a loop, schedules timeout (1–2 seconds).  
  - *Transition:* `ontimeout` → `"idle"` or `"idle2"` based on `math.random()`.

- **State: `"idle2"`**  
  - *Description:* A secondary idle animation state that plays `"idle2"` once, then returns to `"idle"`.  
  - *Key behavior:* Plays `"idle2"` animation once, schedules sound event at 10 frames.  
  - *Transition:* `animover` → `"idle"`.

- **State: `"pickup"`**  
  - *Description:* Performs pickup or trap-check actions (buffered by `PerformBufferedAction`).  
  - *Key behavior:* Sets physics inactive, plays `"eat_pre"` once, triggers `PerformBufferedAction()` at frame 9.  
  - *Transition:* `animover` → `"idle"`.  
  - *Tags:* `"busy"`.

- **State: `"give"`**  
  - *Description:* Performs give/drop actions (e.g., from `ACTIONS.GIVE`, `ACTIONS.DROP`, `ACTIONS.GIVEALLTOPLAYER`).  
  - *Key behavior:* Sets physics inactive, plays `"lose_small_pre"` once, triggers `PerformBufferedAction()` at frame 7.  
  - *Transition:* `animover` → `"idle"`.  
  - *Tags:* `"busy"`.

- **State: `"stunned"`**  
  - *Description:* Handles stun effects (e.g., from stun bombs).  
  - *Key behavior:* Plays `"stunned_loop"` animation, schedules timeout (±2 seconds around 6 seconds), plays sound unless suppressed.  
  - *Transition:* `ontimeout` → `"idle"` with animation `"stunned_pst"`.  
  - *Tags:* `"busy"`, `"stunned"`.

- **State: `"death"`**  
  - *Description:* Handles Carrat’s death sequence.  
  - *Key behavior:* Calls `locomotor:StopMoving()`, plays `"death"` animation, removes physics colliders, and triggers `lootdropper:DropLoot()` at position. Plays death sound immediately.  
  - *Tags:* `"busy"`.

- **Common states (via `CommonStates`):**  
  - `AddSleepExStates`, `AddFrozenStates`, `AddElectrocuteStates`, `AddHitState`, `AddSinkAndWashAshoreStates`, `AddVoidFallStates`: Include states like `"sleep"`, `"frozen"`, `"electrocute"`, `"hit"`, `"sink"`, `"voidfall"` with appropriate physics, animation, and event handling.  
  - `AddWalkStates`, `AddRunStates`: Define `"walk_start"`, `"walking"`, `"walk_stop"`, `"run_start"`, `"running"`, `"run_stop"` with footstep sounds.

## Events & listeners
- **Listens to:**  
  - `"locomote"` — handles transitions between walking/running/idle via `locomotor:WantsToMoveForward()` and `WantsToRun()`.  
  - `"animover"` — transitions from action states (`pickup`, `give`) back to `"idle"`.  
  - `"stunbomb"` — transitions to `"stunned"`.  
  - Common handlers: `"onsleep"`, `"onwake"`, `"onfreeze"`, `"onelectrocute"`, `"onattacked"`, `"ondeath"`, `"onsink"`, `"onfallinvoid"`.

- **Pushes:**  
  - No explicit events are pushed by this stategraph itself. Event propagation occurs via common handlers and entity-level event handling.

