---
id: SGcritter_lunarmothling
title: Sgcritter Lunarmothling
description: Defines the state graph for the lunarmothling critter, managing its animations, sounds, and behavioral states (idle, walk, sleep, eat, etc.) in Don't Starve Together.
tags: [ai, animation, sound, critter, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 8e72076c
system_scope: entity
---

# Sgcritter Lunarmothling

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcritter_lunarmothling` defines the state graph for the lunarmothling, a flying critter in DST. It uses helper functions from `SGcritter_common.lua` and `commonstates.lua` to configure states for idle, walking, eating, sleeping, nuzzling, and combat-related emotes. The state graph is responsible for triggering appropriate animations and sounds in sync with game events.

## Usage example
This state graph is automatically assigned to lunarmothling prefabs by the engine during entity instantiation and is not added directly via code. It is referenced internally via the `StateGraph` return value.

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X`.  
**Tags:** None added, removed, or checked within this state graph.

## Properties
No public properties are defined. This is a state graph definition only.

## Main functions
### `SGCritterStates.AddIdle(states, num_emotes, timeline, anim_fn)`
*   **Description:** Adds a set of idle states to the provided `states` table. Configures idle animation selection and sound triggers.
*   **Parameters:**
    *   `states` (table) — The state table to populate.
    *   `num_emotes` (number) — Number of emote variations, used for indexing.
    *   `timeline` (table) — Sequence of `TimeEvent` entries with timing and callbacks.
    *   `anim_fn` (function) — Function returning animation name based on state memory.
*   **Returns:** None (modifies `states` in-place).

### `SGCritterStates.AddRandomEmotes(states, emotes)`
*   **Description:** Registers emote states chosen randomly during idle.
*   **Parameters:**
    *   `states` (table) — State table to populate.
    *   `emotes` (table) — Array of emote definitions, each with `anim` and `timeline`.
*   **Returns:** None.

### `SGCritterStates.AddEmote(states, name, timeline)`
*   **Description:** Adds a named emote (e.g., `"cute"`) with specified timing and callbacks.
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `name` (string) — Emote identifier.
    *   `timeline` (table) — Array of `TimeEvent` entries.
*   **Returns:** None.

### `SGCritterStates.AddCombatEmote(states, emote_data)`
*   **Description:** Adds combat-related emote states (pre-loop-post).
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `emote_data` (table) — Contains `pre`, `loop`, and `pst` arrays of `TimeEvent` entries.
*   **Returns:** None.

### `SGCritterStates.AddPlayWithOtherCritter(states, events, timeline_data, callbacks)`
*   **Description:** Adds states for critter-to-critter interaction (active/passive phases).
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `events` (table) — Event identifiers (e.g., `OnEat`, `OnSleepEx`).
    *   `timeline_data` (table) — `active` and `passive` timeline arrays.
    *   `callbacks` (table) — Optional callbacks (e.g., `inactive`).
*   **Returns:** None.

### `SGCritterStates.AddEat(states, timeline)`
*   **Description:** Adds eat state with sound triggers and timing (including flying animations).
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `timeline` (table) — Array of `TimeEvent` entries.
*   **Returns:** None.

### `SGCritterStates.AddHungry(states, timeline)`
*   **Description:** Adds hungry/distress state.
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `timeline` (table) — Sound/time event array.
*   **Returns:** None.

### `SGCritterStates.AddNuzzle(states, actionhandlers, timeline)`
*   **Description:** Adds nuzzle interaction state.
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `actionhandlers` (table) — Action handler table (currently empty).
    *   `timeline` (table) — Sound/time event array.
*   **Returns:** None.

### `SGCritterStates.AddWalkStates(states, timeline_data, flying)`
*   **Description:** Adds walk/locomotion states. Called twice: once with custom walk timeline, once without (fallback).
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `timeline_data` (table or `nil`) — Optional walk sound timeline; `nil` for generic walk.
    *   `flying` (boolean) — If `true`, applies flying-specific walk logic.
*   **Returns:** None.

### `CommonStates.AddSleepExStates(states, timeline_data, callbacks)`
*   **Description:** Adds sleep/wake states with extended control points.
*   **Parameters:**
    *   `states` (table) — State table to modify.
    *   `timeline_data` (table) — `starttimeline`, `sleeptimeline`, `waketimeline` arrays.
    *   `callbacks` (table) — Lifecycle hooks: `onexitsleep`, `onsleeping`, `onexitwake`, `onwake`.
*   **Returns:** None.

## Events & listeners
- **Listens to:** `OnEat`, `OnAvoidCombat`, `OnTraitChanged`, `OnSleepEx`, `OnWakeEx`, `OnLocomote`
- **Pushes:** None — this state graph does not push custom events; it consumes stategraph events internally.