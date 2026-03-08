---
id: SGwave
title: Sgwave
description: Manages the rise, idle, and lower animation sequence for wave-type environmental entities such as spires or platforms that appear and disappear over time.
tags: [animation, environmental, timing]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: b1d08215
system_scope: environment
---

# Sgwave

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwave` defines a simple state graph for entities that exhibit a cyclic appearance behavior: rising up, remaining idle for a fixed duration, then lowering and disappearing. It uses animations (`appear`, `idle`, `disappear`) and timed events to control `waveactive` state and scheduling. This stategraph is intended for visual/environmental effects rather than interactive gameplay entities, as it does not maintain persistent logic beyond animation and timing.

## Usage example
```lua
-- Typically assigned automatically to prefabs that use the SGwave stategraph.
-- Example for a custom spire prefab:
local inst = CreateEntity()
inst:AddTag("spire")
inst:AddTag("physics")
inst.sg = StateGraph("wave", { ... }, {}, "rise") -- internally handled via SGwave return
inst.idle_time = 10 -- optional override; defaults to 5 seconds
```

## Dependencies & tags
**Components used:** None explicitly accessed via `inst.components.X`. Relies on built-in services: `AnimState` for animation control and `sg` for stategraph execution.  
**Tags:** The stategraph assigns entity tags dynamically based on current state:
- `rising` — active during `rise` and `instant_rise` states.
- `idle` — active during the `idle` state.
- `lowering` — active during the `lower` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `idle_time` | number? | `5` | Duration (in seconds) the entity remains in the idle state before initiating the lower sequence. Set via `inst.idle_time` on the owning entity. |
| `waveactive` | boolean | `true` during `rise`, `idle`, and `lower`; `false` during `lower`'s later phase | Indicates whether the wave entity is currently "active" (visually/potentially interactable). Controlled via timeline events. |

## Main functions
Not applicable — `SGwave` is a stategraph definition, not a component with callable methods. Logic is expressed through state definitions (`onenter`, `ontimeout`, `timeline`, `events`).

## Events & listeners
- **Listens to:**
  - `animover` — triggers transition to the next state (`idle` → `lower`) after animations complete. Handled by `go_to_idle` helper for `rise`/`instant_rise`, and inline function for `lower`.
- **Pushes:**
  - None — `SGwave` does not push custom events.