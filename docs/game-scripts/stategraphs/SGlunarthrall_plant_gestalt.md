---
id: SGlunarthrall_plant_gestalt
title: Sglunarthrall Plant Gestalt
description: Manages state transitions for the Lunarthrall Plant Gestalt entity during idle, spawning, and infestation behaviors.
tags: [ai, stategraph, boss, mutation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 396a24bc
system_scope: entity
---

# Sglunarthrall Plant Gestalt

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This stategraph governs the behavior of the `lunarthrall_plant_gestalt` entity, a boss-type creature capable of spawning lunar plants or mutating corpses. It defines transitions between states such as `idle`, `spawn`, `infest`, `infest_corpse`, and `spawn_hail`, coordinating animation playback, sound effects, physics overrides, and interactions with the `lunarthrall_plantspawner` and `entitytracker` components. The stategraph integrates with `commonstates` to support walking behaviors and ensures proper cleanup upon completion of animations or actions.

## Usage example
This stategraph is applied automatically to the `lunarthrall_plant_gestalt` prefab and is not added manually. A minimal representation of how the stategraph is constructed and returned is shown below:

```lua
require("stategraphs/commonstates")

-- Define states, handlers, and events as shown in source
-- ...

return StateGraph("lunarthrall_plant_gestalt", states, events, "idle", actionhandlers)
```

## Dependencies & tags
**Components used:** `locomotor`, `entitytracker`, `lunarthrall_plantspawner`  
**Tags:** Adds state tags dynamically: `idle`, `canrotate`, `busy`, `noattack`, `infesting`, `canmove` (via `AddWalkStates`), and `noattack`/`busy` in walk states.

## Properties
No public properties.

## Main functions
This file does not define any standalone public functions beyond internal helpers (`GoToIdle`, `Remove`, `SpawnTrail`). It is a pure stategraph definition file and exposes only the `StateGraph` constructor return value.

## Events & listeners
- **Listens to:** `animover` — triggers `GoToIdle` or `Remove` depending on the state handler table.  
- **Pushes:** No direct events are pushed by this stategraph. Entity events (`locomote`, animation/timeline callbacks) are handled internally via state callbacks and timeline events.