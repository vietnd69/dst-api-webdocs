---
id: SGbee
title: Sgbee
description: Manages the behavioral state machine for the Bee entity, handling flight, idle, movement, attacking, landing, pollinating, and resting phases.
tags: [ai, locomotion, combat, pollination, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 4ce32c7a
system_scope: entity
---

# Sgbee

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbee` defines the state graph for the Bee prefab, orchestrating its lifecycle and behaviors via a state machine. It integrates with the `health`, `combat`, `locomotor`, `homeseeker`, and `pollinator` components to handle state transitions for flying, landing, idle waiting, attacking, pollinating flowers, and resting. The graph supports interrupts for damage, freezing, electrocution, and sleep states, and includes custom logic for buzzing sound control and takeoff/landing transitions.

## Usage example
This state graph is automatically assigned to the Bee prefab during entity creation and is not directly instantiated by modders. It extends common state graph utilities via `CommonStates.AddSleepExStates`, `CommonStates.AddFrozenStates`, `CommonStates.AddElectrocuteStates`, `CommonStates.AddInitState`, and `CommonStates.AddCorpseStates`.

## Dependencies & tags
**Components used:** `health`, `combat`, `locomotor`, `homeseeker`, `pollinator`  
**Tags added by states:** `busy`, `moving`, `canrotate`, `idle`, `attack`, `landing`, `landed`, `nosleep`  
**Tags checked:** `worker`, `killer`

## Properties
No public properties defined. State data is stored in `inst.sg.statemem` (e.g., `statemem.takingoff`).

## Main functions
### `StartBuzz(inst)`
*   **Description:** Enables buzzing sound for the bee entity.
*   **Parameters:** `inst` (Entity) - the bee entity instance.
*   **Returns:** Nothing.

### `StopBuzz(inst)`
*   **Description:** Disables buzzing sound for the bee entity.
*   **Parameters:** `inst` (Entity) - the bee entity instance.
*   **Returns:** Nothing.

### `CleanupIfSleepInterrupted(inst)`
*   **Description:** Restores buzzing and flight state if the bee’s sleep was interrupted (not explicitly continued).
*   **Parameters:** `inst` (Entity) - the bee entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` — triggers `"hit"` state or electrocution handling, unless already dead or electrocuted.  
  - `doattack` — triggers `"attack"` state if not busy/dead.  
  - `animover` — used across multiple states (`death`, `action`, `premoving`, `moving`, `takeoff`, `taunt`, `attack`, `hit`, `land`) to advance state.  
  - `locomote` — transitions between `"idle"` and `"premoving"` based on movement intent and state tags.  
  - Death-related events (`OnDeath`, `OnCorpseChomped`, `OnCorpseDeathAnimOver`) via `CommonHandlers`.  
  - Freezing and electrocution via `CommonHandlers`.  
  - Sleep events (`OnSleepEx`, `OnWakeEx`) via `CommonStates.AddSleepExStates`.

- **Pushes:** None directly; events are fired by external systems (e.g., combat, animation system) or via common handlers.