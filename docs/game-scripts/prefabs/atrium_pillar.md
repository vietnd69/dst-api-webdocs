---
id: atrium_pillar
title: Atrium Pillar
description: Provides a stationary physical and visual pillar obstacle in the Atrium area, with animated idle states that respond to power status.
tags: [obstacle, visual, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7a39ecfb
system_scope: environment
---

# Atrium Pillar

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `atrium_pillar` prefab defines a static, non-interactive environmental obstacle found in the Atrium. It includes physics (cylindrical collision), an animation state system, and responds to the `atriumpowered` world event to switch between idle animations (`idle` and `idle_active`). It is added to the world as a non-networked-only entity on the client and fully initialized on the master simulation.

## Usage example
This prefab is instantiated automatically by the world generation system and does not require manual instantiation in mod code. However, modders can replicate its behavior using the following pattern:
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
MakeObstaclePhysics(inst, 2.5)
inst.Physics:SetCylinder(2.35, 6)
inst.AnimState:SetBank("pillar_atrium")
inst.AnimState:SetBuild("pillar_atrium")
inst.AnimState:PlayAnimation("idle", true)
inst:AddTag("groundhole")
inst:AddTag("pillar_atrium")
inst.entity:SetPristine()
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `groundhole`, `pillar_atrium`.

## Properties
No public properties

## Main functions
Not applicable — this is a prefab definition, not a component. The logic is encapsulated in a local `fn()` factory function.

## Events & listeners
- **Listens to:** `atriumpowered` (on master simulation only) — triggers `OnPoweredFn` to update animation state based on power status.
- **Pushes:** None identified.