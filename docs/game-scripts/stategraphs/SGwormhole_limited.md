---
id: SGwormhole_limited
title: Sgwormhole Limited
description: Manages state transitions and animations for a limited-functionality wormhole entity, such as opening, closing, idle, and death states.
tags: [animation, state, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 98e1144b
system_scope: entity
---

# Sgwormhole Limited

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwormhole_limited` is a stategraph that defines the behavioral states and transitions for a wormhole entity with simplified functionality — notably, it does not perform teleportation itself but visualizes states such as opening, idle, coughing, closing, and death. It relies on the `AnimState` and `SoundEmitter` components to drive visual and audio feedback during transitions. This stategraph is likely used for decorative or narrative worms (e.g., the "sick" teleport worm variants), where gameplay functionality is minimal or absent.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("wormhole")
inst:AddComponent("animstate")
inst:AddComponent("soundemitter")
inst.sg = StateGraph("wormhole")
inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `animstate`, `soundemitter`  
**Tags:** Adds/uses tags: `idle`, `busy`, `open`

## Properties
No public properties

## Main functions
### `SetGroundLayering(inst)`
*   **Description:** Sets the entity's animation layer to `LAYER_BACKGROUND` with sort order `3`, ensuring it renders behind most foreground objects.
*   **Parameters:** `inst` (entity) — the entity whose `AnimState` is modified.
*   **Returns:** Nothing.

### `SetBBLayering(inst)`
*   **Description:** Sets the entity's animation layer to `LAYER_WORLD` with sort order `0`, placing it at normal world depth.
*   **Parameters:** `inst` (entity) — the entity whose `AnimState` is modified.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — triggers transition to next state after animation completion (used in `idlecough`, `opening`, `closing`, and `death` states).
- **Pushes:** None.