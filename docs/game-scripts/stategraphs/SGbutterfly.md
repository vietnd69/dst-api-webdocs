---
id: SGbutterfly
title: Sgbutterfly
description: Manages the flight, idle, movement, and lifecycle state transitions for butterfly entities in DST.
tags: [locomotion, animation, lifecycle]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: fbd91661
system_scope: locomotion
---

# Sgbutterfly

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGbutterfly` defines the state machine for butterfly entities, governing their animation-driven flight patterns, idle behavior, landing, pollination, and death transitions. It integrates with the `locomotor` component for movement control and the `lootdropper` component to spawn loot upon death. States are optimized for aerial mobility and include standard lifecycle hooks (freezing, electrocution) via `CommonStates`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("butterfly")
inst:AddComponent("locomotor")
inst:AddComponent("lootdropper")
inst.AnimState = CreateAnimState()
inst.Physics = CreatePhysics()
inst.sg = StateGraph("butterfly", states, events, "takeoff", actionhandlers)
```

## Dependencies & tags
**Components used:** `locomotor`, `lootdropper`  
**Tags:** States use tags including `moving`, `canrotate`, `busy`, `landing`, `idle`, `landed`, `frozen`, `electrocuted`.

## Properties
No public properties exposed by the stategraph itself. Internal state memory (`inst.sg.statemem`) stores `wantstomove` as a boolean flag.

## Main functions
This is a `StateGraph` definition, not a component class, so it has no public methods. Instead, it returns a configured state machine via `StateGraph(...)`, with the following key components:

### `State{name = "moving"}`
*   **Description:** Enters flight mode. The butterfly moves forward continuously.
*   **Parameters:** None (state definition).
*   **Returns:** Nothing.
*   **Error states:** None. Requires `locomotor` to function.

### `State{name = "idle"}`
*   **Description:** Floats in place with an idle animation. Switches to `moving` if `wantstomove` is set, or loops in `idle` otherwise.
*   **Parameters:** None (state definition).
*   **Returns:** Nothing.

### `State{name = "land"}`
*   **Description:** Performs landing animation and transitions based on buffered actions (e.g., `POLLINATE`, `GOHOME`) or to `land_idle`.
*   **Parameters:** None (state definition).
*   **Returns:** Nothing.

### `State{name = "pollinate"}`
*   **Description:** Executes a short pollination period while landed, then takes off.
*   **Parameters:** None (state definition).
*   **Returns:** Nothing.

### `State{name = "death"}`
*   **Description:** Handles death. Stops physics, plays death animation, and triggers loot drop at current position. Schedules `LandFlyingCreature` to ensure proper landing after animation completes.
*   **Parameters:** None (state definition).
*   **Returns:** Nothing.

### `LandFlyingCreature(inst)`
*   **Description:** Helper called during `death` state timeline to ensure the butterfly lands (via physics setup) before looting. Required for correct loot drop height.
*   **Parameters:** `inst` (entity) — the butterfly entity.
*   **Returns:** Nothing.

### `RaiseFlyingCreature(inst)`
*   **Description:** Called on state exit for landed states (`land`, `land_idle`, `pollinate`) to re-enable flight physics before returning to air states.
*   **Parameters:** `inst` (entity) — the butterfly entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `locomote` — Syncs movement intent via `locomotor:WantsToMoveForward()` and transitions between `idle` and `moving`.
  - `death` — Immediately transitions to `death` state.
  - `animover` — In `land` and `takeoff` states to detect animation completion and continue state flow.
  - Freezing/electrocution hooks added via `CommonStates.AddFrozenStates` and `CommonStates.AddElectrocuteStates`.
- **Pushes:** None directly — inherits standard DST event behaviors via state transitions and common states.