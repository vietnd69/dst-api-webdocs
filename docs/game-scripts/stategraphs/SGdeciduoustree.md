---
id: SGdeciduoustree
title: Sgdeciduoustree
description: Defines the state machine for deciduous tree entities, controlling animations and behavior during aggressive idle, chopping, burning, and electrocution states.
tags: [animation, behavior, state-machine]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 481a01f1
system_scope: entity
---

# Sgdeciduoustree

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGdeciduoustree` is a stategraph that manages the animated behavior of deciduous tree prefabs in DST, particularly when they enter aggressive or disturbed states (e.g., during monster encounters, player chopping, or environmental effects like fire or lightning). It orchestrates transitions between idle, aggression pre-attack, attack, post-attack, burning, and electrocuted states using `animqueueover` and `animover` event callbacks. The state machine delegates certain logic to `CommonStates.AddElectrocuteStates`, integrating with the standard electrocution response system.

## Usage example
```lua
-- Typically attached automatically to the deciduoustree prefab via its stategraph definition.
-- Modders rarely invoke it directly, but can trigger transitions via:
inst.sg:GoToState("burning") -- enters burning animation state
inst.sg:GoToState("gnash_pre", { push = true, skippre = false }) -- initiates aggressive aggression animation
```

## Dependencies & tags
**Components used:** `deciduoustreeupdater` — accessed to read `monster_target` and `last_monster_target` properties in the `gnash_idle` state.
**Tags:** States may carry tags such as `gnash`, `idle`, `busy`, or `burning`. Tags are used internally by the stategraph logic (e.g., to identify states during animation or state queries).

## Properties
No public properties. The stategraph is stateless at the graph level; behavior is parameterized via state `data` and component properties (`inst.monster`, `inst.components.deciduoustreeupdater.*`).

## Main functions
Stategraph logic is defined declaratively via `State` objects — no explicit functional methods are exposed by this module. The primary behavior occurs in `onenter` handlers and event callbacks.

## Events & listeners
- **Listens to:** `animover`, `animqueueover`, `electrocute` — the latter integrates via `CommonHandlers.TryElectrocuteOnEvent`.
- **Pushes:** No custom events are fired; transitions are internal to the state machine (`inst.sg:GoToState(...)`).