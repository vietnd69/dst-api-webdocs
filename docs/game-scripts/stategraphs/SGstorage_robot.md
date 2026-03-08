---
id: SGstorage_robot
title: Sgstorage Robot
description: Defines the state machine for the Storage Robot character, controlling movement, idle behavior, pickup, store, and breakdown animations and logic.
tags: [ai, locomotion, inventory, sound, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e816d943
system_scope: locomotion
---

# Sgstorage Robot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGstorage_robot` is a StateGraph that governs the behavior and animation states of the Storage Robot character. It manages movement, idle states, item pickup, item store/dropoff, repair transitions, and mechanical failure states. It integrates tightly with the `fueled`, `locomotor`, and `inventory` components to handle fuel consumption, locomotion control, and item handling. The state machine uses common helpers (`CommonHandlers`, `CommonStates`) to standardize sink/fall-in-void and walk-state behavior.

## Usage example
The StateGraph is returned by the script and instantiated automatically by the DST engine when the Storage Robot prefab is created. As a built-in stategraph, it is not directly added to entities via `inst:AddStateGraph`. Instead, prefabs using this stategraph declare it via `inst:AddStateGraph("storage_robot")` (typically handled in the prefab definition file). Modders should override or extend states via stategraph hooks or by customizing prefab-specific overrides.

## Dependencies & tags
**Components used:**  
- `fueled` (`IsIdle`, `StartConsuming`, `StopConsuming`)  
- `locomotor` (`Stop`, `StopMoving`)  
- `inventory` (`DropEverything`, `CloseAllChestContainers`)  
- `inventoryitem` (`IsHeld`)  

**Tags added/removed by states:**  
- `"idle"` — in the `idle` state  
- `"busy"` — in `pickup`, `store`, `repairing_pre`, `repairing`, `breaking`, `idle_broken`  
- `"broken"` — in `breaking`, `idle_broken`  
- `"softstop"` — added via `CommonHandlers.OnLocomote(false, true)` in `events`  

**Tags not directly managed by this stategraph**, but checked/affected via components:  
- `"player"` — referenced only in the `inventory` component's `DropEverything` logic  

## Properties
No public properties are defined in the `storage_robot` stategraph itself. All configuration is embedded in state definitions and local functions.

## Main functions
This file returns a `StateGraph` instance and does not expose a `Class` constructor or public API methods. The internal logic consists of state handlers and helper functions.

### Local Helper Functions
### `_ReturnToIdle(inst)`
*   **Description:** Checks if the current animation has completed; if so, transitions the stategraph to the `idle` state. Used as a common `animover` handler.
*   **Parameters:** `inst` (Entity) — the entity instance.
*   **Returns:** Nothing.

### `MakeImmovable(inst)`
*   **Description:** Sets the entity’s physics mass to `99999`, effectively preventing movement during busy states.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `RestoreMobility(inst)`
*   **Description:** Restores the entity’s original physics mass by calling `GetFueledSectionMass()`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `PlaySectionSound(inst, sound, soundname)`
*   **Description:** Plays a section-specific sound (e.g., walk, idle, pickup, dropoff) using the entity’s sound emitter. Appends the result of `GetFueledSectionSuffix()` to the sound path for multi-section variations.
*   **Parameters:**  
    - `inst` (Entity)  
    - `sound` (string) — base sound name (e.g., `"walk"`)  
    - `soundname` (string) — identifier used by the emitter to prevent overlapping instances  
*   **Returns:** Nothing.

### `PlayVocalizationSound(inst, voice, soundname)`
*   **Description:** Plays a voice sound (e.g., neutral, pickup, breakdown), records the time, and uses `PlaySectionSound` to emit it.
*   **Parameters:**  
    - `inst` (Entity)  
    - `voice` (string) — e.g., `"neutral"`, `"pickup"`, `"dropoff"`, `"breakdown"`  
    - `soundname` (string) — emitter ID  
*   **Returns:** Nothing.

### `TryPlayingNeutralVocalizationSound(inst)`
*   **Description:** Attempts to play a random neutral vocalization if enough time has elapsed (`NEUTRAL_VOCALIZATION_INTERVAL`) and random chance passes. Skips if the sound is already playing or the item is held.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to (via `CommonHandlers` and inline events):**  
  - `locomote` — triggers soft-stop handling for walk states via `CommonHandlers.OnLocomote(false, true)`  
  - `sink` — transitions to `idle_broken` via `CommonHandlers.OnSink()`  
  - `fall_in_void` — transitions to `idle_broken` via `CommonHandlers.OnFallInVoid()`  
  - `animover` — used to transition out of finite animations (e.g., `pickup`, `store`, `repairing`, `breaking`)  
- **Pushes:** No custom events. Uses internal state transitions and the engine’s `locomote` event (from `LocoMotor:Stop`).