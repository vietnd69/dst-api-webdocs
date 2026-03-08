---
id: SGLeif
title: Sgleif
description: State graph that defines all behavioral states for the Leif entity (Winter Tree), including idle, attack, death, spawn transitions, and state handling via events and timelines.
tags: [ai, stategraph, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: e59e93b4
system_scope: ai
---

# Sgleif

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGLeif` is the state graph for the Leif entity — the sentient winter tree boss — in *Don't Starve Together*. It defines the full set of states (e.g., `idle`, `attack`, `hit`, `death`, `sleeping`, `spawn`, `wake`, `panic`, and movement variants) and their transitions in response to game events (e.g., `attacked`, `death`, `doattack`). It integrates with core components such as `health`, `combat`, `burnable`, `lootdropper`, and `locomotor`, and leverages shared state helpers from `commonstates` for walk, idle, freeze, electrocute, sink, and wash ashore behaviors.

## Usage example
```lua
-- This state graph is automatically assigned by the game when the Leif prefab is instantiated.
-- Modders typically extend or override behaviors via:
--   - Modifying `TUNING.LEIF_*` constants (e.g., hit recovery duration).
--   - Adding or listening to events via `inst:ListenForEvent("attacked", fn)` in the prefab definition.
--   - Overriding specific states via `inst.sg.states = CustomStates` before `inst:StartScript("leif")`.
```

## Dependencies & tags
**Components used:** `health`, `combat`, `burnable`, `lootdropper`, `locomotor`  
**Tags checked/added:** `busy`, `attack`, `hit`, `sleeping`, `waking`, `idle`, `canrotate`, `electrocute`, `frozen`, `softstop` (via `locomotor:Stop()`), `frozen` (via common handlers)

## Properties
No public properties — this is a pure state graph definition file, not a component.

## Main functions
This file does not define public functions. It constructs and returns a `StateGraph` instance.

### `StateGraph("leif", states, events, "idle")`
*   **Description:** Returns the fully configured state graph for Leif, named `"leif"`, with `"idle"` as the initial state.
*   **Parameters:**  
    - `states` (table) — Full list of state definitions (created above).  
    - `events` (table) — Event handlers that trigger state transitions.  
    - `"idle"` (string) — The default starting state.
*   **Returns:** `StateGraph` instance.
*   **Error states:** None — fail-fast behavior if parameters are malformed is handled internally by the engine.

## Events & listeners
- **Listens to:**  
  `step`, `locomote`, `freeze`, `electrocute`, `sink`, `fallinvoid`, `attacked`, `death`, `doattack`, `gotosleep`, `onwakeup` — via `CommonHandlers.OnStep()`, `CommonHandlers.OnLocomote(...)`, `CommonHandlers.OnFreeze()`, `CommonHandlers.OnElectrocute()`, `CommonHandlers.OnSink()`, `CommonHandlers.OnFallInVoid()`, and custom `EventHandler` closures.  
- **Pushes:** None — this file only consumes events to drive state changes; it does not fire its own events directly.