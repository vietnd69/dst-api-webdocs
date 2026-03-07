---
id: wormlight_plant
title: Wormlight Plant
description: A harvestable light-emitting plant that regenerates after being picked and spawns a wormlight_lesser item.
tags: [environment, plant, light, harvestable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fe68cdfa
system_scope: environment
---

# Wormlight Plant

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wormlight_plant` is a world entity that functions as a renewable light source and resource. It uses the `pickable` component to enable harvesting, which temporarily extinguishes its light and replaces the plant with a "picked" visual state. After a regen time defined by `TUNING.WORMLIGHT_PLANT_REGROW_TIME`, it regrows and reactivates its light. It also serves as fuel for fire via burnable components and can ignite nearby entities due to propagation and hauntability traits.

## Usage example
```lua
-- Typically instantiated internally by the game world, but for testing:
local inst = Prefab("wormlight_plant")
inst:AddComponent("pickable")
inst.components.pickable.picksound = "dontstarve/wilson/pickup_reeds"
inst.components.pickable:SetUp("wormlight_lesser", TUNING.WORMLIGHT_PLANT_REGROW_TIME)
```

## Dependencies & tags
**Components used:** `pickable`, `lootdropper`, `inspectable`
**Tags:** Adds `plant`

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab definition, not a component. Core behavior is implemented via `pickable` component hooks (see Events & listeners).

## Events & listeners
- **Listens to:** None directly; relies on `pickable` component events.
- **Pushes:** None directly; leverages `pickable`'s `onpickedfn`, `onregenfn`, and `makeemptyfn` hooks to drive visual states:
  - `onpickedfn`: Plays "picking" animation, transitions to "picked", disables light.
  - `onregenfn`: Plays "grow" animation, transitions to "berry_idle", enables light after ~8 frames.
  - `makeemptyfn`: Same visual effect as `onpickedfn`, used when item is picked with a tool that empties the object.