---
id: SGklaus
title: Sgklaus
description: Manages the full state machine for Klaus, the seasonal winter boss, handling combat, summoning, transitions (enrage/call for help), laughter cycles, and death/resurrection logic.
tags: [combat, ai, boss, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c6ee31d0
system_scope: entity
---

# Sgklaus

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGklaus` is a stategraph that controls the AI behavior of Klaus, the winter season boss. It orchestrates movement, combat sequences (claw swipes, chomp lunges), summoning Deer soldiers, transitions (including the enrage state and calling for help), laughter cycles (triggered when nearby Deers survive attacks), and the death/resurrection loop. It interacts with multiple components—`combat`, `commander`, `health`, `freezable`, `burnable`, `sleeper`, `hauntable`, `grouptargeter`, `locomotor`, `lootdropper`, `timer`, and `epicscare`—to drive the boss’s behavior, responsiveness, and visual/audio feedback.

## Usage example
This is a stategraph, not a component, and is registered via `return StateGraph("klaus", states, events, "init")` at the end of the file. It is used internally by the `klaus` prefab to manage its behavior.

## Dependencies & tags
**Components used:** `combat`, `commander`, `health`, `freezable`, `burnable`, `sleeper`, `hauntable`, `grouptargeter`, `locomotor`, `lootdropper`, `timer`, `epicscare`.  
**Tags added/removed:** `idle`, `canrotate`, `hit`, `busy`, `attack`, `nosleep`, `nofreeze`, `noelectrocute`, `caninterrupt`, `transition`, `enrage`, `corpse`. Tags are dynamically added/removed during state transitions (e.g., `nosleep`, `nofreeze`, `noelectrocute` during attacks, transitions, and resurrection).

## Properties
No public properties are exposed directly by this stategraph file. State-specific data is stored in `inst.sg.mem` and `inst.sg.statemem` (e.g., `wantstotransition`, `laughing`, `deer`, `target`, `speed`, `jump`).

## Main functions
The stategraph itself is a configuration table (`states`, `events`) returned as a `StateGraph`. The core logic resides in state handlers (`onenter`, `timeline`, `ontimeout`, `onexit`, `onupdate`, `events`) and helper functions defined at module scope. These helpers are documented here:

### `DeerCanCast(deer)`
* **Description:** Validates whether a Deer soldier is capable of casting a spell. Checks multiple state and component conditions.
* **Parameters:** `deer` (Entity) – the Deer entity to validate.
* **Returns:** `boolean` – `true` if the Deer can cast, `false` otherwise.
* **Error states:** Returns `false` if the Deer is asleep, frozen, burning, dead, panicking, or taking fire damage.

### `PickCommandDeer(inst, highprio, lowprio)`
* **Description:** Selects a suitable Deer soldier to issue a command to, based on priority and validity. Iterates over all soldiers and respects priority order.
* **Parameters:**  
  - `inst` (Entity) – Klaus entity.  
  - `highprio` (Entity, optional) – high-priority Deer (e.g., previously used).  
  - `lowprio` (Entity, optional) – fallback low-priority Deer.
* **Returns:** `Entity or nil` – selected Deer or `nil` if none qualify.
* **Error states:** Returns `nil` if no valid Deers can cast.

### `ChooseAttack(inst)`
* **Description:** Decides between commanding Deer soldiers (if cooldown allows and soldiers exist) or performing a direct attack.
* **Parameters:** `inst` (Entity) – Klaus entity.
* **Returns:** `boolean` – always `true`.
* **Error states:** Attempts to command only if `command_cd` timer is not running. Falls back to `"attack"` state if no Deer can be selected.

### `TryChomp(inst)`
* **Description:** Finds and initiates a chomp attack on a valid target.
* **Parameters:** `inst` (Entity) – Klaus entity.
* **Returns:** `boolean` – `true` if a chomp attack was started, `false` otherwise.
* **Error states:** Returns `false` if `FindChompTarget()` returns `nil`.

### `CalcChompSpeed(inst, target)`
* **Description:** Calculates the forward speed for Klaus’s chomp lunge, based on distance to the target.
* **Parameters:**  
  - `inst` (Entity) – Klaus entity.  
  - `target` (Entity) – target to lunge toward.
* **Returns:** `number` – speed multiplier for the lunge (`> 0` if moving, `0` otherwise).
* **Error states:** Returns `0` if target is invalid, too close, or position retrieval fails.

### `StartLaughing(inst)`
* **Description:** Initializes the laughter cycle by setting the number of remaining laughs.
* **Parameters:** `inst` (Entity) – Klaus entity.
* **Returns:** Nothing.

### `ReduceLaughing(inst, amt)`
* **Description:** Decreases the laughter count; removes the laughter state if count reaches zero.
* **Parameters:**  
  - `inst` (Entity) – Klaus entity.  
  - `amt` (number) – amount to subtract from laugh count.
* **Returns:** Nothing.

### `StopLaughing(inst)`
* **Description:** Immediately terminates any laughter state by clearing the laugh count.
* **Parameters:** `inst` (Entity) – Klaus entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `doattack` – triggers `ChooseAttack`.
  - `attacked` – initiates `hit` state unless busy or recovering.
  - `chomp` – triggers `TryChomp` or queues chomp intent.
  - `enrage` – triggers `transition` to `enrage` (if not enraged and not busy).
  - `transition` – triggers `transition` to `callforhelp` (if not already enraging and not busy).
  - `animover`, `death`, `freeze`, `electrocute`, `sleep`, `wake`, `sink`, `voidfall`, `corpsechomped`, `dropkey` – via `CommonHandlers`.
- **Pushes:**
  - `epicscare` (via `EpicScare:Scare`) during `taunt_roar`.
  - `dropkey` with a `klaussackkey` entity during death (if unchained).
  - `locomote`, `onextinguish`, `epicscare`, `attacked` events are forwarded as needed.