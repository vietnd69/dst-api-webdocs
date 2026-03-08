---
id: SGchester
title: Sgchester
description: Manages the state machine and animation logic for Chester, a mob that can open and close like a container, move via bouncing, and be transformed or devoured.
tags: [ai, container, locomotion, boss]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: c549432b
system_scope: entity
---

# Sgchester

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGchester` is the state graph for the Chester mob, handling its core behaviors including movement (bouncing/walking), opening/closing animations, transformation via `morph`, and special states like `knockbacklanded` and `devoured`. It integrates heavily with the `locomotor` component for bouncing physics, the `container`/`container_proxy` component for open/close state and interaction, and the `freezable` component to handle status effects. It also spawns visual effects (e.g., slime trails, morph FX) and manages sound playback for transitions and panting.

## Usage example
This stategraph is applied automatically to the Chester prefab during entity initialization. Modders typically interact with it via events (e.g., triggering `morph` or `knockback`), not by directly calling its state functions. Example usage:
```lua
-- Trigger Chester's morph transformation with a custom function
inst:PushEvent("morph", { morphfn = function(chester) chester:CustomMorph() end })

-- Simulate a knockback impact
inst:PushEvent("knockback", {
    knocker = attacker,
    radius = 1.0,
    strengthmult = 1.2,
})
```

## Dependencies & tags
**Components used:** `container`, `container_proxy`, `freezable`, `health`, `locomotor`, `sleeper`
**Tags:** Adds and checks many internal state tags (`busy`, `idle`, `open`, `knockback`, `devoured`, `noelectrocute`, `nointerrupt`, `invisible`, `notalking`, etc.) via `sg:HasStateTag()` and `sg:GoToState()`.

## Properties
No public properties. All state-specific data is stored in `inst.sg.mem` and `inst.sg.statemem` (state memory and per-state memory respectively).

## Main functions
No top-level functions are exported by `SGchester` itself. It defines helper functions in the local scope and registers a `StateGraph` via `return StateGraph("chester", states, events, "init")`. The following local helper functions are key internal utilities:
### `ToggleOffPhysics(inst)`
*   **Description:** Disables physics collision for the entity by setting the ground-only collision mask and marks `isphysicstoggle` in state memory.
*   **Parameters:** `inst` (Entity) — the Chester instance.
*   **Returns:** Nothing.

### `ToggleOnPhysics(inst)`
*   **Description:** Restores full physics collision mask (world, obstacles, characters, giants) and clears `isphysicstoggle`.
*   **Parameters:** `inst` (Entity) — the Chester instance.
*   **Returns:** Nothing.

### `ClearStatusAilments(inst)`
*   **Description:** Unfreezes the entity if it is currently frozen.
*   **Parameters:** `inst` (Entity) — the Chester instance.
*   **Returns:** Nothing.

### `SpawnMoveFx(inst, scale)`
*   **Description:** Spawns a random variation of `hutch_move_fx` and ensures recent variations are not reused immediately (up to `MAX_RECENT_FX`). The effect scale is interpolated based on `scale`.
*   **Parameters:** 
    *   `inst` (Entity) — the Chester instance.
    *   `scale` (number) — scale factor between `MIN_FX_SCALE` (.5) and `MAX_FX_SCALE` (1.6).
*   **Returns:** Nothing.

### `SetContainerCanBeOpened(inst, canbeopened)`
*   **Description:** Controls whether Chester can be interacted with as a container. When `canbeopened` is false, it closes any open containers (via `container:Close()` or `container_proxy:Close()`) and disables opening; when true, it enables opening.
*   **Parameters:** 
    *   `inst` (Entity) — the Chester instance.
    *   `canbeopened` (boolean) — whether to allow opening.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
    - `"animover"` — transition states (e.g., open→open_idle, close→idle).
    - `"animqueueover"` — ends transition state.
    - `"attacked"` — triggers `hit` or `electrocute` state, plays hurt sound.
    - `"morph"` — enters `morph` state with custom callback.
    - `"knockback"` — enters `knockbacklanded` state.
    - `"devoured"` — enters `devoured` state.
    - `"spitout"` — exits `devoured` and triggers `knockback`.
    - `"onstep"`, `"onsleep"`, `"onelectrocute"`, `"onlocomote"`, `"onhop"`, `"onsink"`, `"onfallinvoid"`, `"ondeath"`, `"oncorpsechomped"` — via `CommonHandlers`.
- **Pushes:** 
    - `"refreshcrafting"` — when container closes.
    - `"unfreeze"`, `"onwakeup"` — via component interactions.
    - `"knockback"` — from `spitout` and `devoured` exit.