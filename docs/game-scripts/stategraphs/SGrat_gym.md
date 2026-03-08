---
id: SGrat_gym
title: Sgrat Gym
description: Controls state transitions and animations for the rat gym entity in Don't Starve Together, managing idle, training, resting, and burnout states.
tags: [stategraph, rat, gym, training]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: cc44b3af
system_scope: entity
---

# Sgrat Gym

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGrat_gym` is a StateGraph implementation for the rat gym entity (`yotc_carrat_gym_*` prefabs). It manages behavioral states such as `idle`, `active` (training), `sleep` (resting), `hit`, and `burnt`, with transitions driven by custom events and animation completion. It integrates with the `gym` and `timer` components to respond to training lifecycle events and pause/resume training timers during rest states.

## Usage example
This StateGraph is applied internally to rat gym prefabs via the `StateGraph` return value and does not require direct usage. Typical interaction occurs through events sent to the entity instance:

```lua
-- Start training
inst:PushEvent("starttraining", data)

-- Stop training (e.g., after training session ends)
inst:PushEvent("endtraining", data)

-- Initiate rest state
inst:PushEvent("rest", data)

-- End rest state
inst:PushEvent("endrest", data)
```

## Dependencies & tags
**Components used:** `gym`, `timer`  
**Tags used:** `active`, `hit`, `sleep`

## Properties
No public properties are defined or accessed directly in this StateGraph.

## Main functions
Not applicable. This is a declarative StateGraph definition — no explicit methods are exposed. State behavior is configured via `states` and `events` tables, and the graph is instantiated by the `StateGraph("rat_gym", ...)` call.

## Events & listeners
- **Listens to:**
  - `onbuilt` → transitions to `"place"`
  - `onburnt` → transitions to `"burnt"`
  - `hit` → transitions to `"hit"` (if not already in hit state or burnt)
  - `ratupdate` → transitions to `"idle"` (if not hit or burnt)
  - `endtraining` → transitions to `"active_pst"` or `"idle"` depending on active state (if not burnt)
  - `starttraining` → transitions to `"active_pre"` (if not already active or burnt)
  - `rest` → transitions to `"sleep_pre"` (if not sleeping or burnt)
  - `endrest` → transitions to `"sleep_pst"` (if currently sleeping and not burnt)

- **Pushes:**
  - Internally, transitions between states are handled by `inst.sg:GoToState(...)`; no external events are pushed by this graph.
