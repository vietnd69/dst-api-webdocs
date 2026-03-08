---
id: SGmoonspore
title: Sgmoonspore
description: Controls the animation and state transitions for a moonspore entity, including idle flight, takeoff, pre-pop delay, and final pop/explosion behaviors.
tags: [ai, boss, fx, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 309956e9
system_scope: fx
---

# Sgmoonspore

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGmoonspore` is a stategraph that defines the behavior of a moonspore entity (likely a boss or large environmental threat in caves). It manages transitions between idle flight, takeoff, delayed pre-pop preparation, and final pop/explosion states. The stategraph leverages `commonstates.lua` for shared event handling patterns and uses animation events, timeouts, and custom events (`"pop"`, `"preparedpop"`, `"popped"`, `"animover"`) to sequence visual and gameplay effects.

## Usage example
```lua
local inst = TheSim:FindFirstEntityByTag("moonspore")
if inst and inst.sg then
    -- Trigger immediate pop
    inst.sg:GoToState("pop")
    -- Or trigger delayed pop sequence
    inst.sg:GoToState("pre_pop")
end
```

## Dependencies & tags
**Components used:** None directly referenced via `inst.components.X`.  
**Tags:** Adds `busy` (in `"pre_pop"` and `"pop"` states), `idle`, `canrotate` (in `"idle"` state).  

## Properties
No public properties. The stategraph is configuration-only; runtime state is managed internally via `inst.sg`.

## Main functions
### `return_to_idle(inst)`
*   **Description:** Helper function that returns the stategraph to the `"idle"` state. Used as a callback for timeout and animation end events.
*   **Parameters:** `inst` (entity) — the instance whose stategraph is being controlled.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `"pop"` — triggers immediate transition to `"pop"` state.
  - `"preparedpop"` — triggers transition to `"pre_pop"` state (preceding `"pop"`).
  - `"animover"` — handled in `"pop"` and `"takeoff"` states to finalize state exits (removal or idle return).
- **Pushes:**
  - `"popped"` — fired at frame 4 of `"pop"` state just before animations finish (likely to trigger gameplay effects like damage or cleanup).