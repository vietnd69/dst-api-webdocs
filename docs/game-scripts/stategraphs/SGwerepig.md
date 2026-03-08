---
id: SGwerepig
title: Sgwerepig
description: Manages the state machine for the Werepig character, handling animations, movement, combat, and transformation between pig and werepig forms.
tags: [ai, animation, combat, transformation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: bdf6a5e5
system_scope: entity
---

# Sgwerepig

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwerepig` defines the stategraph for the Werepig entity, controlling its behavior through a set of discrete states (e.g., idle, walk, run, attack, howl, transform). It integrates with multiple components—`combat`, `locomotor`, `health`, and `sleeper`—to handle movement, combat actions, death, transformation, and sleeper wake-up logic. The stategraph also incorporates shared states from `commonstates.lua` (e.g., sleep, frozen, electrocute) and adds custom logic for transformation, howling, and action handling.

## Usage example
The `SGwerepig` stategraph is automatically assigned to the Werepig prefab during entity instantiation and is not directly added by modders. It is referenced internally as the stategraph name `"werepig"`. Modders customizing Werepig behavior should override state behaviors or add custom events via mod hooks.

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `sleeper`, `animstate`, `physics`, `soundemitter`  
**Tags:** Adds/uses `"busy"`, `"idle"`, `"canrotate"`, `"attack"`, `"moving"`, `"running"`, `"transform"`, `"hostile"`; checks `"electrocute"` via `HasStateTag`

## Properties
No public properties.

## Main functions
The `SGwerepig` is constructed via the `StateGraph` constructor and does not expose standalone public methods. Core behavior is implemented in state callbacks (e.g., `onenter`, `ontimeout`, event handlers).

### `StateGraph("werepig", states, events, "init", actionhandlers)`
*   **Description:** Constructor that creates the stategraph with the provided states, event handlers, initial state `"init"`, and action handlers for `EAT` and `PICKUP`.
*   **Parameters:**
    *   `"werepig"` (string) — stategraph name.
    *   `states` (table) — list of `State` definitions (see below).
    *   `events` (table) — list of `EventHandler` and `CommonHandlers` entries.
    *   `"init"` (string) — initial state name.
    *   `actionhandlers` (table) — table of `ActionHandler`s.
*   **Returns:** A configured `StateGraph` instance (used internally by DST's stategraph system).
*   **Error states:** None — construction is guaranteed to succeed if inputs are valid.

## Events & listeners
- **Listens to:**
  - `transformwere` — triggers `"transformWere"` state if entity is alive.
  - `giveuptarget` — triggers `"howl"` state if no stun lock and entity is alive.
  - `newcombattarget` — triggers `"howl"` (30% chance) or plays idle sound.
  - `attacked` — handled in `"transformWere"` state to transition to `"hit"` or electrocute.
  - `animover`, `animqueueover`, `ontimeout`, `oncorpsedeathanimover` — internal state transitions.
  - All `CommonHandlers` events: `OnStep`, `OnLocomote`, `OnSleep`, `OnFreeze`, `OnElectrocute`, `OnAttack`, `OnAttacked`, `OnDeath`, `OnHop`, `OnSink`, `OnFallInVoid`, `OnIpecacPoop`.

- **Pushes:**
  - `onwakeup` — emitted via `components.sleeper:WakeUp()` in `"transformWere"` state exit.
  - Standard DST events (e.g., `"animover"`, `"attacked"`) are handled but not pushed by this stategraph itself.