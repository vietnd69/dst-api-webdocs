---
id: SGwormwood_lightflier
title: Sgwormwood Lightflier
description: Defines the state machine logic for the Lightflier creature, handling movement, combat, sleep, and status effects.
tags: [ai, stategraph, flying, combat, sleep]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 58c8e9fa
system_scope: entity
---

# Sgwormwood Lightflier

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwormwood_lightflier` defines the state graph for the Lightflier entity (a flying creature in DST). It inherits standard behaviors from `commonstates.lua`, including locomotion, combat, sleep, freeze, and electrocute handling, while defining custom states (`idle`, `action`, `startled`) and animation logic specific to this entity. The state graph governs how the creature transitions between states based on gameplay events and integrates flying-specific logic via `Land()` and `Liftoff()` callbacks.

## Usage example
This state graph is used internally by the game and is not instantiated directly in mods. It is assigned to a prefab via `inst:SetStateGraph("SGwormwood_lightflier")`. Example of entity setup:
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddPhysics()
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddComponent("locomotor")
inst:AddStateGraph("SGwormwood_lightflier")
```

## Dependencies & tags
**Components used:** None directly referenced (relies on `commonstates.lua` helper functions).
**Tags:** Adds `"idle"`, `"canrotate"`, `"busy"` on entering relevant states.

## Properties
No public properties.

## Main functions
Not applicable (this is a state graph definition, not a component with callable methods).

## Events & listeners
- **Listens to:** `animover`, `startled`, `Locomote`, `Freeze`, `Electrocute`, `Attacked`, `Death`, `SleepEx`, `WakeEx`.
- **Pushes:** No events are directly pushed by this state graph definition.