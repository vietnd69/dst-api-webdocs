---
id: SGfence_electric
title: Sgfence Electric
description: Manages state transitions and animation playback for an electric fence entity during connection, disconnection, idle, placement, and hit states.
tags: [electricity, animation, connection, entity, state]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8b91ffb6
system_scope: entity
---

# Sgfence Electric

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph defines the behavior of an electric fence entity in `Don't Starve Together`, controlling how it transitions between visual states such as idle (with or without active connections), linking (establishing connections to adjacent fences), disconnecting, placement, and being hit. It integrates with the `electricconnector` component to trigger and react to networked state changes, particularly during link establishment. The stategraph is initialized as `"fence_electric"` with `"idle"` as the default starting state.

## Usage example
```lua
-- The stategraph is automatically applied via the prefab definition.
-- No direct component usage is required in mod code, but events can be pushed to influence behavior:
inst:PushEvent("start_linking")     -- Initiates the linking sequence
inst:PushEvent("end_linking")       -- Finalizes the linking sequence
inst:PushEvent("disconnect_links")  -- Initiates disconnection animation
```

## Dependencies & tags
**Components used:** `electricconnector` (accessed via `inst.components.electricconnector`)
**Tags:** Checks `fully_electrically_linked`; adds state tags (`idle`, `linking`, `busy`) internally to the stategraph via state tags (not per-instance entity tags).

## Properties
No public properties.

## Main functions
Not applicable — this file defines a stategraph, not a component with public methods. It uses `StateGraph` to declare states and event handlers.

## Events & listeners
- **Listens to:**
  - `start_linking` — transitions to `"linking_pre"`.
  - `end_linking` — transitions to `"linking_pst"`.
  - `disconnect_links` — transitions to `"disconnect"`.
  - `animover` (per-state) — used to loop or return to `"idle"` after animations complete.
  - `linked_to` — triggers immediate transition to `"linking_pst"` upon successful connection.

- **Pushes:** This stategraph does not push events itself. It reacts to external events and internal state transitions triggered via `inst.sg:GoToState()`.
