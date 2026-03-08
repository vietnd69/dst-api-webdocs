---
id: SGshadow_knight
title: Sgshadow Knight
description: Manages the state transitions and combat behavior of the Shadow Knight boss entity, including attack phases, taunting mechanics, and transition to/away from the idle state.
tags: [combat, boss, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1e63ea2e
system_scope: combat
---

# Sgshadow Knight

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadow_knight` defines the state graph for the Shadow Knight boss entity, implementing combat states (attack, hit, death), movement pauses during actions, and boss-specific behaviors like taunting and target switching. It inherits common states (idle, walk, sink/washashore) and transitions from the shared `SGshadow_chesspieces` stategraph module. The stategraph orchestrates animations, timeline events, and interactions with the `combat` and `locomotor` components during key moments such as attack initiation, completion, and taunt execution.

## Usage example
```lua
-- The Shadow Knight prefab typically includes the stategraph automatically.
-- Example of manually setting the stategraph on an entity (not typical in DST modding):
local inst = CreateEntity()
inst:AddStateGraph("shadow_knight")
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`
**Tags:** Adds state tags `attack`, `busy`, `taunt`, `hit`, `death`; checks `animover` and `animdone` via event handling.

## Properties
No public properties defined. State-specific data is stored in `inst.sg.statemem` (e.g., `attack`, `remaining`), and `inst.components.combat.target` is used to guide behavior.

## Main functions
### `StateGraph("shadow_knight", states, ShadowChess.CommonEventList, "appear")`
*   **Description:** Constructor function returning the fully configured `StateGraph` object for the Shadow Knight. It registers all custom states (e.g., `attack`, `taunt`) and merges in common states (idle, hit, death, etc.) via `ShadowChess.States` helpers. The initial state is `"appear"`.
*   **Parameters:**
    * `name` ("shadow_knight") — unique identifier for the stategraph.
    * `states` — table of `State` objects defining behaviors and transitions.
    * `eventList` (`ShadowChess.CommonEventList`) — list of shared event handlers.
    * `startState` ("appear") — the entry state.
*   **Returns:** A `StateGraph` instance configured for the Shadow Knight entity.

## Events & listeners
- **Listens to:** `animover` — used in `attack`, `attack_short`, `attack_long`, and `taunt` states to detect animation completion and trigger state transitions.
- **Pushes:** None defined directly in this file; relies on inherited infrastructure from `SGshadow_chesspieces` and common stategraph systems.