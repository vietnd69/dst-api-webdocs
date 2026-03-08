---
id: SGshadow_trap
title: Sgshadow Trap
description: Manages the animation, sound, and state transitions for the Shadow Trap entity during spawning, idling, activation, and dispelling phases.
tags: [trap, fx, sound, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 1657e2d5
system_scope: entity
---

# Sgshadow Trap

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGshadow_trap` is the stategraph responsible for controlling the visual and auditory behavior of the Shadow Trap entity across its lifecycle: spawn, idle, proximity detection, activation, and dispelling. It defines state transitions based on animations and timers, triggers particle and sound effects, and interacts with other components (e.g., `base`, `shockwave`) via methods like `EnableTargetFX`, `EnableGroundFX`, and `TriggerTrap`. The stategraph is non-networking-heavy, avoiding `idle`/`busy` tags to reduce overhead, and relies on `animover` events for state progression.

## Usage example
This stategraph is implicitly attached to Shadow Trap prefabs and does not need manual instantiation. Typical usage occurs during gameplay when a Shadow Trap is placed or activated:
```lua
-- Shadow Trap prefabs automatically use this stategraph
local trap = SpawnPrefab("shadow_trap")
-- State transitions are triggered internally by animation events and timeouts
```

## Dependencies & tags
**Components used:** `base`, `shockwave`  
**Tags:** Adds/removes tags dynamically per state:
- `spawn`: none  
- `idle`: `candetect`, `canactivate`  
- `near_idle_pre`: `near`, `canactivate`  
- `near_idle`: `near`, `candetect`, `canactivate`  
- `near_idle_pst`: `canactivate`  
- `activate`, `activating_loop`, `trigger`, `dispell`: `activated`

## Properties
No public properties — the stategraph uses `inst.sg.statemem.activating` internally for transient state tracking.

## Main functions
### `TrySplashFX(inst)`
*   **Description:** Conditionally spawns an ocean splash effect if the trap is positioned over ocean water. Called during spawn and dispel.
*   **Parameters:** `inst` (entity) — the Shadow Trap instance.
*   **Returns:** Nothing.

### `StateGraph("shadow_trap", states, {}, "spawn")`
*   **Description:** Exports the finalized stategraph definition with initial state `"spawn"`. This is not a method but the core constructor call.
*   **Parameters:** None — parameters are provided internally by the engine.
*   **Returns:** `StateGraph` — registered stategraph object.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers state transitions when animations complete (e.g., `"spawn"` → `"idle"`, `"near_idle_pre"` → `"near_idle"`).  
  - `timeout` (in `"dispell"` state) — removes the entity after 1 second to wait for `"shadow_despawn"` animation.  
- **Pushes:** No custom events — relies on state changes and internal `inst:EnableTargetFX`, `inst:EnableGroundFX`, and `inst:TriggerTrap` calls for side effects.