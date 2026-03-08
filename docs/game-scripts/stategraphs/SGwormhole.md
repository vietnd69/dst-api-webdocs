---
id: SGwormhole
title: Sgwormhole
description: Defines the state machine for a wormhole entity, managing idle, opening, open, and closing animation states and layering.
tags: [animation, sound, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 22b048e5
system_scope: entity
---

# Sgwormhole

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwormhole` is a state graph for a wormhole entity, defining its animation and sound behavior across four states: `idle`, `open`, `opening`, and `closing`. It controls how the wormhole renders in the world (via layering), plays sound effects, and transitions between states based on animation completion. The graph is created with the name `"wormhole"` and initializes the entity in the `"idle"` state.

## Usage example
```lua
-- Typically applied to a prefabricated wormhole entity
inst.sg = StateGraph("wormhole", states, {}, "idle")
-- Usage is internal to the stategraph system; no direct manual calls are required
-- State transitions are triggered automatically via animation events or `inst.sg:GoToState()`
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `idle`, `open`, or `busy` to the entity depending on the active state (via `state.tags`).

## Properties
No public properties

## Main functions
### `SetGroundLayering(inst)`
*   **Description:** Configures the wormhole's `AnimState` to render in the `LAYER_BACKGROUND` with sort order `3`, placing it behind most world elements.
*   **Parameters:** `inst` (entity instance) — the wormhole entity whose rendering is being adjusted.
*   **Returns:** Nothing.

### `SetBBLayering(inst)`
*   **Description:** Configures the wormhole's `AnimState` to render in the `LAYER_WORLD` with sort order `0`, placing it at the default world layer.
*   **Parameters:** `inst` (entity instance) — the wormhole entity whose rendering is being adjusted.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers state transitions (`opening` → `open`, `closing` → `idle`) when the current animation completes.
- **Pushes:** None identified