---
id: SGpig
title: Sgpig
description: Defines the state machine for pig entities, handling animations, actions (movement, combat, eating, sleeping), and state transitions during various game events.
tags: [ai, animation, stategraph, pig]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 773055a3
system_scope: entity
---

# Sgpig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpig` is a `StateGraph` definition that controls pig entity behavior through a collection of named states and transition events. It integrates with multiple components (`combat`, `follower`, `health`, `sleeper`, `shadowparasitemanager`) to manage transitions between idle, moving, attacking, eating, sleeping, dying, transforming (from Werepig), and reacting to environmental hazards (freezing, electrocution, void fall). The state machine also supports special actions like `chop`, `cheer`, `win_yotb`, and corpse handling.

## Usage example
```lua
-- This stategraph is automatically applied by the prefab "werepig" and its variants.
-- To create a pig entity using this stategraph:
local inst = Prefab("werepig")
inst:AddTag("pig")
-- The stategraph is internally assigned by the prefab definition; no direct SGpig call is needed.
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `health`, `sleeper`, `shadowparasitemanager`  
**Tags:** Adds `busy`, `idle`, `chopping`, `attack`, `transform`, `sleeping`, `noelectrocute`, `hostile` (conditionally removed during transformation)

## Properties
No public properties defined in this stategraph file. State behavior is configured entirely via `states` table and event handlers.

## Main functions
This file does not define any standalone functions. It returns a configured `StateGraph` instance. The primary "functions" are the state entries (`State{}` blocks) and event/action handlers.

### `State{name = ..., onenter = ..., events = ..., timeline = ..., onexit = ..., tags = ...}`
* **Description:** Represents a behavior state in the state machine. Each state defines what happens when entering (`onenter`), exiting (`onexit`), how time-based events (`timeline`) are processed, and which tag conditions control transitions (`tags`). `events` defines which external or animation events trigger state changes.
* **Parameters:**  
  - `name` (string) — unique identifier for the state (e.g., `"idle"`, `"attack"`)  
  - `onenter` (function) — runs when the state becomes active  
  - `onexit` (function) — runs when leaving the state  
  - `events` (table) — list of `EventHandler` entries mapping events to callbacks  
  - `timeline` (table) — list of `TimeEvent` entries for time-based triggers  
  - `tags` (table) — set of tags used by the stategraph for conditional transitions  
* **Returns:** A `State` object added to the `states` array.

## Events & listeners
- **Listens to:**
  - Standard state handlers (`CommonHandlers.OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnAttack`, `OnAttacked`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid`, `OnIpecacPoop`, `OnCorpseChomped`)
  - `"transformnormal"` — triggers `"transformNormal"` state if not dead
  - `"doaction"` — triggers `"chop"` state when action is `ACTIONS.CHOP`
  - `"cheer"` — triggers `"cheer"` state
  - `"win_yotb"` — triggers `"win_yotb"` state
  - `"animover"` — transitions back to `"idle"` after animations complete (in many states)

- **Pushes:**
  - None directly. Relies on the stategraph system to handle state transitions internally.