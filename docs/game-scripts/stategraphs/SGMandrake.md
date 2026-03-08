---
id: SGMandrake
title: Sgmandrake
description: Manages the state machine for the Mandrake entity, handling animations, sounds, and transitions for idle movement, being picked/planted, being hit, and death.
tags: [entity, stategraph, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 67ed9dd4
system_scope: entity
---

# Sgmandrake

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGMandrake` is the StateGraph for the Mandrake entity (`prefabs/mandrake.lua`). It defines all major states (e.g., `idle`, `hit`, `death`, `picked`, `plant`, `ground`, `item`) and their behaviors—such as animation playback, sound effects, physics control, and timeout-driven transitions. It integrates with `CommonStates` to inherit standard locomotion, freeze, and electrocute state handling, while responding to game events like `attacked`, `death`, and animation completion. It depends on the `health` and `burnable` components to determine whether to react to attacks or extinguish flames on death.

## Usage example
```lua
-- This stategraph is instantiated automatically by the engine when the Mandrake prefab is created.
-- Modders typically do not interact with this StateGraph directly.
-- To customize Mandrake behavior, override its Prefab or StateGraph using onpreinit/onpostinit hooks.
-- Example hook in a mod main file:
TheMod:OnPostInit(function()
    -- Not applicable; stategraphs are system-managed.
end)
```

## Dependencies & tags
**Components used:** `health`, `burnable`
**Tags:** States use `idle`, `canrotate`, `busy`, `noelectrocute`, `canrotate`, `canrotate` (see timeline for footstep). No persistent tags added/removed.

## Properties
No public properties.

## Main functions
This is a StateGraph definition file, not a component class, so it does not expose methods callable via `inst.components.X`. It returns a configured `StateGraph` instance.

## Events & listeners
- **Listens to:**
  - `CommonHandlers.OnStep()` — triggers walk-related logic.
  - `CommonHandlers.OnLocomote(false, true)` — handles movement start/stop.
  - `CommonHandlers.OnFreeze()` — enters frozen state on freeze event.
  - `CommonHandlers.OnElectrocute()` — enters electrocute state on electrocution.
  - `attacked` — triggers hit or electrocute response; plays hit sound, optionally cancels electrocution, transitions to `hit` state.
  - `death` — transitions to `death` state.
  - `animover` — many states use this to loop or transition to next state after animation completes (e.g., `idle`, `hit`, `picked`, `plant`).
- **Pushes:**
  - None directly (no `inst:PushEvent` calls in this file). Events are forwarded to state handlers and consumed internally.
  - Note: State handlers call `inst.sg:SetTimeout(...)` in `death` state; upon timeout, `ontimeout` calls `inst:oncooked()`, which fires the `cooked` event—*but this event callback is defined in the prefab file*, not here.
