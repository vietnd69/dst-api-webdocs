---
id: SGglommer
title: Sgglommer
description: Defines the state machine and behavior logic for the Glommer creature, handling movement, animations, sounds, and responses to environmental events.
tags: [ai, creature, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 91bd5c28
system_scope: entity
---

# Sgglommer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGglommer` is a `StateGraph` that defines the behavioral states and transitions for the Glommer creature (a flying boss-like entity from the *Reign of Giants* DLC). It handles idle behavior, locomotion (flying/walking), the "bored" bouncing animation, death/frozen states, and responses to player-triggered actions like "GOHOME". It integrates with common state handlers for sleep, electrocute, combat, and corpse states, and manipulates physics, animation, and sound via direct calls on `inst`.

## Usage example
```lua
-- This stategraph is applied automatically to the Glommer prefab via its definition.
-- Typically no manual instantiation is required in mod code.
-- To interact with its state, modders use:
inst.sg:GoToState("flyaway")  -- e.g., in response to GOHOME action
```

## Dependencies & tags
**Components used:** `locomotor` — accessed only in frozen/thaw states to halt movement via `inst.components.locomotor:StopMoving()`.
**Tags:** States apply dynamic tags such as `idle`, `busy`, `frozen`, `thawing`, `flight`, and `noelectrocute`, depending on current behavior.

## Properties
No public properties. All state behavior is encapsulated within the state definitions and event handlers.

## Main functions
No custom public methods are defined in `SGglommer`. State behavior is implemented as inline state function closures (e.g., `onenter`, `timeline`, `events`) and via helper functions `StartFlap(inst)` and `StopFlap(inst)` used internally.

## Events & listeners
- **Listens to:** Standard creature events (via `CommonHandlers`):
  - `sleep`, `freeze`, `electrocute`, `attack`, `attacked`, `death`, `locomote`, `corpsechomped`
  - `animover` — transitions from `idle`, `bored`, `goo` back to `idle`
  - `onthaw` — transitions from `frozen` to `thaw`
  - `unfreeze` — transitions from `thaw` to `idle` or `hit` depending on combat state
  - `action` — handled externally via `actionhandlers`, triggers `"flyaway"` state

- **Pushes:** None (event producers are external handlers, e.g., animations, timers, actions). Timers (`TimeEvent`) trigger local callbacks but do not push events.

> Note: The `StartFlap` and `StopFlap` functions manage a periodic task to play the `"flap"` sound during flying/active states. This is internal to the SG and not exposed as a public API.