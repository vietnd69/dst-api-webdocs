---
id: SGwave_med
title: Sgwave Med
description: Defines a state machine for medium-sized ocean wave entities that rise, idle briefly, and then lower and remove themselves.
tags: [wave, environment, animation, sound]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 2b741c5e
system_scope: environment
---

# Sgwave Med

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwave_med` is a stategraph (state machine) that controls the lifecycle of a medium-sized wave entity in the ocean environment. It defines three sequential states—`rise`, `idle`, and `lower`—which handle animation playback, sound effects, collision activation, and eventual entity removal. This stategraph is used for visual ocean wave effects, likely spawned procedurally or in response to environmental triggers.

It relies on the `commonstates.lua` module via `require`, though no direct function calls from that module are used in the source code.

## Usage example
```lua
-- Typically instantiated and driven by a corresponding prefab (e.g., `rogue_wave_med`)
local inst = SpawnPrefab("rogue_wave_med")
-- Stategraph is automatically attached; no manual stategraph manipulation needed
-- The wave entity sets properties like idle_time and soundrise before spawning the stategraph
```

## Dependencies & tags
**Components used:** None explicitly. Assumes access to the following entity APIs: `AnimState`, `SoundEmitter`, and `sg`.
**Tags:** Adds `rising` in the `rise` state, `idle` in the `idle` state, and `lowering` in the `lower` state. These tags are added/removed automatically by the stategraph system.

## Properties
No public properties are defined in this stategraph. The state transitions depend on runtime instance properties such as:
- `inst.idle_time` (number, optional, defaults to `5` seconds in state `idle`)
- `inst.soundrise` (string, optional, sound name for rising animation)
- `inst.soundloop` (string, optional, sound name for looping during idle)
- `inst.waitingtolower` (boolean, used internally to control transition from `idle` → `lower`)

These are expected to be set on the owning entity instance before or during stategraph initialization.

## Main functions
This stategraph file does not expose standalone functions; it returns a preconfigured `StateGraph` object with the name `"wave"` and the defined state set. State behaviors are implemented via `onenter`, `ontimeout`, and `EventHandler` closures inside state definitions.

### State Definitions (Internal)

#### `rise` state
*   **Description:** The initial state; plays the `"appear"` animation and triggers sound effects. After animation completes, transitions to `idle`.
*   **Tags:** `"rising"`
*   **Key behaviors:**
    - On enter: plays `"appear"` animation.
    - Time event after `5*FRAMES`: plays `soundrise` (if set) and starts `soundloop` (if set).
    - On `animover`: transitions to `idle`.

#### `idle` state
*   **Description:** Keeps the wave visible; activates collision and waits for a timeout before beginning to lower.
*   **Tags:** `"idle"`
*   **Key behaviors:**
    - On enter: activates collision (`inst:activate_collision()`), plays `"idle"` animation (non-looping), and sets a timeout (`inst.idle_time` or `5` seconds).
    - On `animover`: if `inst.waitingToLower` is true, transitions to `lower`; otherwise re-plays `"idle"` animation.
    - On timeout: sets `inst.waitingtolower = true` (enabling transition on next `animover`).

#### `lower` state
*   **Description:** Ends the wave effect; plays `"disappear"` animation, kills any loop sound, and removes the entity.
*   **Tags:** `"lowering"`
*   **Key behaviors:**
    - On enter: resumes animation playback, plays `"disappear"` animation, and kills `soundloop` if present.
    - On `animover`: calls `inst:Remove()` to destroy the entity.

## Events & listeners
- **Listens to:**
  - `animover`: handled in `rise`, `idle`, and `lower` states to trigger state transitions or re-play animations.
  - Timeout event (from `SetTimeout`) in the `idle` state to set `waitingtolower`.
- **Pushes:** This stategraph does not push custom events. It relies on built-in stategraph mechanics and entity removal.