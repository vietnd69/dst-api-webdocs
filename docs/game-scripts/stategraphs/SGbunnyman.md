---
id: SGbunnyman
title: Sgbunnyman
description: Manages the state machine for the Bunnyman entity, handling idle, movement, combat, death, and special interactions like cheering and eating.
tags: [ai, stategraph, entity, combat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 31a6f049
system_scope: ai
---

# Sgbunnyman

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbunnyman` defines the state graph for the Bunnyman entity, implementing its behavior through a sequence of states and event handlers. It orchestrates animations, sounds, locomotion, and interactions with key components like `health`, `combat`, `follower`, and `locomotor`. The state machine integrates with common state helpers (`CommonStates`) to provide standard behaviors such as walking, running, sleeping, and death-related transitions. Special handling exists for shadow parasite revival and loyalty-based emotional states.

## Usage example
The state graph is automatically loaded and assigned to the Bunnyman prefab during entity initialization. Modders typically do not manually instantiate this state graph; instead, they may extend or override its behavior by registering new states or events.

```lua
-- Example: Adding a custom state to Bunnyman's state graph
local SGbunnyman = require("stategraphs/SGbunnyman")
local custom_state = State{
    name = "custom_state",
    tags = { "busy" },
    onenter = function(inst)
        inst.AnimState:PlayAnimation("custom_anim")
        inst.SoundEmitter:PlaySound("custom_sound")
    end,
    events = {
        EventHandler("animover", function(inst) inst.sg:GoToState("idle") end),
    },
}
-- Insert custom state into the states array before return (requires mod override)
```

## Dependencies & tags
**Components used:** `health`, `follower`, `combat`, `locomotor`, `shadowparasitemanager` (via `TheWorld.components.shadowparasitemanager`)
**Tags:** Adds and checks tags including `"busy"`, `"attack"`, `"sleeper"`, `"frozen"`, `"electrocuted"`, `"corpse"`, `"reviving"` (via common state helpers and explicit use in states like `death`, `attack`, `eat`, `cheer`, etc.)

## Properties
No public properties are defined in the state graph itself. Configuration values (e.g., thresholds, durations) are drawn from `TUNING.BUNNYMAN_*` constants.

## Main functions
This state graph definition is a pure data structure and does not expose standalone public functions. The primary entry point is the returned `StateGraph`, constructed via `StateGraph("bunnyman", states, events, "init", actionhandlers)`.

## Events & listeners
- **Listens to:**
  - `"animover"` — Triggers state transitions after animations complete (e.g., go to `"idle"`).
  - `"cheer"` — Initiates `"cheer"` state if not busy or dead.
  - `"onstep"`, `"onlocomote"`, `"onsleep"`, `"onfreeze"`, `"onelectrocute"`, `"onattack"`, `"onattacked"`, `"ondeath"`, `"onhop"`, `"onsink"`, `"onfallinvoid"` — Standard locomotion and status event handlers via `CommonHandlers`.
  - `"onchomp"` —Corpse handling via `CommonHandlers.OnCorpseChomped()`.
- **Pushes:** This file does not directly push custom events. The state graph internals use `inst.sg:GoToState()` and `inst:RemoveStateTag()` for internal orchestration.