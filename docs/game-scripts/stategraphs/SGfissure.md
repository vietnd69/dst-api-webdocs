---
id: SGfissure
title: Sgfissure
description: Defines the state graph for controlling a fissure entity's on/off idle states with timed transitions.
tags: [environment, state, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 9616dabc
system_scope: environment
---

# Sgfissure

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfissure` is a state graph for a fissure entity that manages two primary idle states: `idle_on` (active) and `idle_off` (inactive), with transitions handled by timed auto-switching states (`idle_turnon` and `idle_turnoff`). It is used to animate and control periodic activation/deactivation cycles for environmental fissure prefabs, such as those in the Caves or other dynamic world zones.

The state graph leverages a callback system (`inst.turnon` and `inst.turnoff`) expected to be defined on the entity, allowing external logic to define visual/audio effects during transitions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("fissure")
inst.turnon = function(fissure) fissure.AnimState:PlayAnimation("turnon") end
inst.turnoff = function(fissure) fissure.AnimState:PlayAnimation("turnoff") end
inst.sg = StateGraph("fissure", require("stategraphs/SGfissure"), inst)
inst.sg:GoToState("idle_on")
```

## Dependencies & tags
**Components used:** None directly (relies on entity callbacks and `inst.sg` stategraph).
**Tags:** Adds `idle` tag to all four states.

## Properties
No public properties.

## Main functions
Not applicable. This file returns a `StateGraph` definition, not a component class.

## Events & listeners
- **Listens to:** `attacked`, `death` — currently defined with empty handlers; intended for future logic extension.
- **Pushes:** None (no custom events are fired by this state graph).