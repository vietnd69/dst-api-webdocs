---
id: SGboatrace_start
title: Sgboatrace Start
description: Controls the visual and audio state machine for the boatrace starting pillar entity in DST.
tags: [ui, audio, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1039223e
system_scope: ui
---

# Sgboatrace Start

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatrace_start` defines the stategraph for the boatrace starting pillar, a UI-adjacent interactive prop used during seasonal events. It manages animation playback, sound effects, and timeline-triggered events for states like `place`, `on`, `hit`, `reset`, `win`, `prize`, `fuse_on`, and `fuse_off`. The stategraph is anchored around the `"idle_off"` state as its default entry point and uses `animover` events to transition between states.

## Usage example
```lua
-- The stategraph is automatically associated with its owning entity during prefab registration.
-- Modders typically do not need to manually instantiate or configure it.
-- It is used internally by the `boatrace_start` prefab (YOTD 2024 event).
```

## Dependencies & tags
**Components used:** `AnimState`, `SoundEmitter`
**Tags:** Uses tags `idle`, `on` internally for state classification; no tags added/removed on the entity.

## Properties
No public properties.

## Main functions
### `inst:winOver()`
*   **Description:** Called when the `"win"` state completes animation. Likely triggers event logic (e.g., awarding prizes or advancing the mini-game).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst:prizeOver()`
*   **Description:** Called when the `"prize"` state completes animation. Likely initiates prize delivery or visual effects.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst:fuseoffOver()`
*   **Description:** Called when the `"fuse_off"` state completes animation. Likely signals the end of a countdown or spark effect.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `inst:fuseonOver()`
*   **Description:** Called when the `"fuse_on"` state completes animation. Likely triggers post-fuse lighting sequence (e.g., starting the main fire).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers state transitions or custom callbacks (`inst:winOver`, `inst:prizeOver`, `inst:fuseoffOver`, `inst:fuseonOver`, or `sg:GoToState("idle_off")` depending on current state).
- **Pushes:** None — this stategraph does not fire custom events.