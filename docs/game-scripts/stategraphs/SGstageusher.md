---
id: SGstageusher
title: Sgstageusher
description: Defines the state machine for the Stageusher character, managing transitions between idle, sitting/standing, walking, attacking, and extinguishing states based on animation events and component interactions.
tags: [ai, animation, combat, locomotion, fire]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: becf272a
system_scope: entity
---

# Sgstageusher

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGstageusher` is the stategraph for the Stageusher entity, controlling its behavior through a set of discrete states including `idle`, `standup`, `sitdown`, `attack`, `attack_loop`, `hit`, and `extinguish` (with variants). It relies on the `locomotor`, `combat`, and `burnable` components to drive state transitions. The stategraph integrates with `CommonStates.AddWalkStates` to provide walk animations and handles both standing and seated postures via the `IsStanding` property and `ChangeStanding` method.

## Usage example
```lua
-- Typically added via the prefab definition:
inst:AddStateGraph("stageusher", "stategraphs/SGstageusher")

-- Event callbacks are registered automatically by the stategraph:
inst:PushEvent("doattack", { target = enemy })
inst:PushEvent("standup")
inst:PushEvent("sitdown")
```

## Dependencies & tags
**Components used:** `locomotor`, `combat`, `burnable`
**Tags:** Adds `"idle"`, `"canrotate"`, `"busy"`, `"attack"`, `"hit"` depending on state; checks `"busy"` via `HasStateTag`.

## Properties
No public properties.

## Main functions
### `State(name)`
*   **Description:** Each state is defined via `State { name = "...", ... }` and contributes to the overall behavior of the entity. States are returned in the `states` array and passed to `StateGraph`.
*   **Parameters:** N/A — this is a data definition, not a callable function.
*   **Returns:** N/A.

### `CommonStates.AddWalkStates(states, timelines)`
*   **Description:** Extends the `states` table with walk-related states (`walk_start`, `walk`, `walk_stop`) and injects provided timeline sound events.
*   **Parameters:**
    *   `states` (table) — the existing state definitions to extend.
    *   `timelines` (table) — contains `starttimeline`, `walktimeline`, and `endtimeline` mappings of frame offsets to sound callbacks.
*   **Returns:** Nothing (modifies `states` in place).

## Events & listeners
- **Listens to:**
  - `"doattack"` — triggers `attack` state (unless `"busy"` tag is present).
  - `"standup"` — triggers `standup` state (unless `"busy"`), or queues a standing request if busy.
  - `"sitdown"` — triggers `sitdown` state (unless `"busy"`), or queues a sitting request if busy.
  - `"animover"` — in most states, returns to `idle` after animation completes.
  - `"animqueueover"` — in `extinguish_standing`, transitions to `idle` after queued animations.
  - `"handfinished"` — in `attack_loop`, ends loop and goes to `standup`.
  - `"ontimeout"` — in `attack_loop`, safety fallback after 10 seconds.
  - `"OnLocomote"` and `"OnAttacked"` — provided via `CommonHandlers`.

- **Pushes:** None — the stategraph itself does not fire events; it responds to events pushed onto the entity.