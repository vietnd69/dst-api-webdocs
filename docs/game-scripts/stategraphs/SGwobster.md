---
id: SGwobster
title: Sgwobster
description: Manages state transitions and animations for the Wobster creature during ocean fishing interactions, including hook escape, launch, and movement states.
tags: [ai, fishing, locomotion, animation, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 9904cf3f
system_scope: entity
---

# Sgwobster

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `wobster` stategraph defines the behavioral states and transitions for the Wobster creature—particularly during ocean fishing encounters. It coordinates animations, physics, and component interactions (notably `locomotor`, `oceanfishable`, and `oceanfishingrod`) to model reactions such as escaping the hook, being launched from the water, and returning to idle or home states. This stategraph integrates with common states like `idle`, `run`, and `enter_home` for continuity.

## Usage example
```lua
-- The stategraph is automatically applied by the prefab definition for the Wobster entity.
-- No manual instantiation is required; the engine loads it via StateGraph("wobster", ...)
-- and executes transitions (e.g., inst.sg:GoToState("bitehook_escape")) when triggered.
```

## Dependencies & tags
**Components used:** `locomotor`, `oceanfishable`, `oceanfishingrod`
**Tags:** Sets `"busy"`, `"jumping"` (on states: `bitehook_pre`, `bitehook_loop`, `bitehook_escape`, `launched_out_of_water`, `hop_pst`); checks `"partiallyhooked"`.

## Properties
No public properties.

## Main functions
### `StateGraph("wobster", states, events, "spawn_in", actionhandlers)`
*   **Description:** Constructs and returns the fully defined stategraph for the Wobster entity. It specifies the full state machine, including initial state (`spawn_in`), event handlers, and action handlers (e.g., `EAT`, `GOHOME`).
*   **Parameters:** 
    * `states` (table) – collection of state definitions (e.g., `bitehook_pre`, `idle`, `enter_home`).
    * `events` (table) – event handlers for lifecycle events (e.g., locomotion updates).
    * `"spawn_in"` (string) – name of the initial state.
    * `actionhandlers` (table) – defines which actions trigger transitions (e.g., `EAT` → `bitehook_pre`).
*   **Returns:** A `StateGraph` object ready to be attached to a Wobster entity.
*   **Error states:** Not applicable.

## Events & listeners
- **Listens to:** 
  - `animover` (in `bitehook_pre`, `hop_pst`, `spawn_in`) – triggers state transitions when animations complete.
  - `animqueueover` (in `bitehook_escape`) – transitions to `idle` after animation queue finishes.
- **Pushes:** None defined in this file.