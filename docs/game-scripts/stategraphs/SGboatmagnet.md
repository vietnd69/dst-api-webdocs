---
id: SGboatmagnet
title: Sgboatmagnet
description: Manages state transitions and animations for the boat magnet entity during beacon pairing and pulling operations.
tags: [locomotion, physics, ai]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 570b9b10
system_scope: physics
---

# Sgboatmagnet

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGboatmagnet` is the stategraph controlling the behavior of the `boatmagnet` entity. It handles transitions between states for beacon searching, pairing, pulling, and idle modes. The stategraph responds to internal events (`worked`, `animover`, `boatmagnet_pull_start`, `boatmagnet_pull_stop`) and interacts with the `boatmagnet` component to coordinate beacon pairing and pulling actions. It is primarily used for automated boat navigation mechanics.

## Usage example
The stategraph is returned at module load time and attached to entities via the stategraph system. It is not instantiated directly in mod code. A typical usage appears in a prefab definition:

```lua
local functionfn(inst)
    inst:AddStateGraph("boatmagnet")
    -- Other components like boatmagnet and physics are required for full functionality
end
```

## Dependencies & tags
**Components used:** `boatmagnet` (accessed via `inst.components.boatmagnet`)
**Tags:** `idle`, `busy`, `pulling`, `caninterrupt`, `burnt`

## Properties
No public properties are initialized in the stategraph constructor.

## Main functions
This is a declarative stategraph definition; it does not define public functions. State behavior is implemented via `onenter`, `onexit`, `onupdate`, and event handlers registered in state definitions.

## Events & listeners
- **Listens to:**  
  - `boatmagnet_pull_start` (global) — transitions from `idle` to `pull_pre`  
  - `boatmagnet_pull_stop` (global) — transitions from `pulling` to `pull_pst`  
  - `worked` (per-state) — interrupts current operation to play a hit animation  
  - `animover`, `animqueueover` (per-state) — sequence state transitions  
- **Pushes:** None (no events are fired via `inst:PushEvent`)