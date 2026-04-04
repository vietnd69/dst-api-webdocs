---
id: SGcritter_bulbin
title: Sgcritter Bulbin
description: Defines the animation state machine and behavior logic for the Bulbin critter entity.
tags: [stategraph, critter, animation, behavior]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: stategraphs
source_hash: 11d763f4
system_scope: entity
---

# Sgcritter Bulbin

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
`SGcritter_bulbin` is a StateGraph definition file that controls the animation states, sound emissions, and physics behaviors for the Bulbin critter. It extends common critter functionality provided by `SGcritter_common` and `commonstates` with specific actions such as rolling, whistling, and nuzzling. The graph manages state transitions based on events like eating, sleeping, or avoiding combat, and handles specific logic for physics overrides during rolling animations.

## Usage example
StateGraphs are typically assigned within a Prefab's `fn` or `onload` function where the entity instance `inst` is provided by the engine.

```lua
local SGcritter_bulbin = require("stategraphs/SGcritter_bulbin")

local function fn(inst)
    inst.sg = SGcritter_bulbin
end
```

## Dependencies & tags
**Components used:** `locomotor` (accessed directly in roll logic), `SoundEmitter`, `AnimState`, `Physics`, `Transform`.
**Tags:** Adds `busy`, `jumping` during the `roll_pre` state.
**External Modules:** `stategraphs/commonstates`, `stategraphs/SGcritter_common`.

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `SGCritterEvents.OnEat`, `SGCritterEvents.OnAvoidCombat`, `SGCritterEvents.OnTraitChanged`.
- **Listens to:** `OnSleepEx`, `OnWakeEx`, `OnLocomote`, `OnHop`, `OnSink`, `OnFallInVoid` (via CommonHandlers).
- **Pushes:** None identified.