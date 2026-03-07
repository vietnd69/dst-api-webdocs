---
id: fishingnetvisualizer
title: Fishingnetvisualizer
description: A visual proxy entity that displays a boat net animation and shadow, used to visually represent fishing nets placed by players or entities.
tags: [visual, fx, utility]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 82b4fb33
system_scope: entity
---

# Fishingnetvisualizer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fishingnetvisualizer` is a lightweight, non-interactive visual entity used to render a boat net animation and shadow at a given location. It is not a functional game object but serves as a visual proxy, typically attached to or instantiated near fishing nets. It includes a transform, animation state (using the `boat_net` bank), sound emitter, and a ground shadow handler to align with walkable surfaces.

## Usage example
```lua
-- Typical usage inside a function that spawns a visual net at a location:
local netvis = SpawnPrefab("fishingnetvisualizer")
if netvis ~= nil then
    netvis.Transform:SetPosition(x, y, z)
    netvis.GUID = TheSim:GetNextPersistID()
end
```

## Dependencies & tags
**Components used:** `groundshadowhandler`  
**Tags added:** `ignorewalkableplatforms`, `NOCLICK`

## Properties
No public properties are defined in the constructor or used by this prefab. All configuration occurs through component setup and animation state.

## Main functions
Not applicable — this is a Prefab definition, not a Component. It has no custom logic beyond instantiation.

## Events & listeners
Not applicable — this prefab does not define event listeners or push events directly.

