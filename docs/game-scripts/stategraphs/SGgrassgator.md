---
id: SGgrassgator
title: Sggrassgator
description: Manages the state machine for the Grass Gator entity, handling transitions between idle, attack, fall, dive, and death behaviors based on timers, events, and component states.
tags: [ai, combat, movement, death]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: dc91016f
system_scope: entity
---

# Sggrassgator

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGgrassgator` is a state graph responsible for controlling the behavior of the Grass Gator entity in `Don't Starve Together`. It defines discrete states (e.g., `idle`, `attack`, `shed`, `dive`, `fall`) and orchestrates transitions between them using event handlers and timeouts. The state graph relies heavily on components like `combat`, `locomotor`, `health`, `amphibiouscreature`, `lootdropper`, and `timer` to coordinate gameplay actions—such as spawning debris waves during diving, responding to attacks, and managing surface/dive timers. It also integrates common state utilities (`CommonStates`) to support walking, running, hitting, sleeping, freezing, electrocution, hop movement, and corpse handling.

## Usage example
This state graph is not used directly by modders; it is automatically applied when the `grassgator` entity is spawned. It defines internal state transitions and logic, but modders may extend behavior by listening to events it pushes (e.g., `doattack`, `attacked`, `shed`) or by modifying the underlying entity's components.

## Dependencies & tags
**Components used:**  
`amphibiouscreature`, `combat`, `health`, `locomotor`, `lootdropper`, `timer`  

**Tags added by states:**  
`idle`, `canrotate`, `attack`, `busy`, `nointerrupt`, `noelectrocute`, `diving`, `noattack`, `invisible`, `hit` (via `CommonStates.AddSimpleState`)  
**Tags checked:**  
`swimming`, `debuffed` (via `CommonHandlers`), `cattoy` (via `TWIGS_MUST`)

## Properties
No public properties — this is a state graph definition, not a component with instance variables.

## Main functions
This file does not define standalone public functions; it constructs and returns a `StateGraph` object. However, the following helper functions are defined for internal use:

### `spawnwaves(inst, numWaves, totalAngle, waveSpeed, wavePrefab, initialOffset, idleTime, instantActivate, random_angle)`
*   **Description:** Wraps `SpawnAttackWaves` to spawn debris waves around the Grass Gator, typically during dive/surface animations. Uses the gator’s position and rotation (or random angle if `random_angle` is true) as parameters.
*   **Parameters:**  
    `inst` (Entity) — the Grass Gator instance.  
    `numWaves` (number) — number of wave prefabs to spawn.  
    `totalAngle` (number) — total angular spread in degrees.  
    `waveSpeed` (number) — speed at which waves travel outward.  
    `wavePrefab` (string or `nil`) — prefab name for the debris (currently `nil`, defaults to internal logic).  
    `initialOffset` (number or `nil`) — offset from center; falls back to physics radius if `nil`.  
    `idleTime` (number) — delay between wave groups.  
    `instantActivate` (boolean or `nil`) — whether waves activate immediately.  
    `random_angle` (boolean) — whether to use a random direction instead of current facing.
*   **Returns:** Nothing — calls `SpawnAttackWaves` internally.

### `OnRemoveDebris(child)`
*   **Description:** Local callback that removes the `shadow` object from a debris entity (`child`) when it is removed. Ensures cleanup of visual effects.
*   **Parameters:** `child` (Entity) — the debris entity being removed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `doattack` — triggers `attack` state if not dead or interrupt-proof.  
  `attacked` — transitions to `hit` state unless electrocuted or busy; handles `CommonHandlers.TryElectrocuteOnAttacked`.  
  `startfalling` — transitions to `fall_pre`.  
  `shed` — transitions to `shed` if less than 3 Twigs are nearby and not busy.  
  `diveandrelocate` — transitions to `dive` if not busy.  
  `animover`, `animqueueover`, `frame X` events — drive state transitions.  
  `timeout` events — used in `idle`, `shed`, `fall_pre`, and `dive_loop` states.  
  `onremove` (on shadow prefabs) — via `OnRemoveDebris`.  
  `corpse` events — via `CommonHandlers.OnCorpseChomped()` and `CommonHandlers.OnCorpseDeathAnimOver()`.

- **Pushes:**  
  None directly — it relies on the state graph framework and common handlers to manage gameplay events.

The state graph also defines timelines with `TimeEvent` and `FrameEvent` callbacks (e.g., spawning sounds, waves, and managing state tags like `noattack`/`invisible`).