---
id: cannon_aoe_range_fx
title: Cannon Aoe Range Fx
description: Creates non-interactive visual effect entities for cannon area-of-effect and reticule indicators.
tags: [fx, visual, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c7068da9
system_scope: fx
---

# Cannon Aoe Range Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines two prefabs (`cannon_aoe_range_fx` and `cannon_reticule_fx`) used to render visual indicators in the game world. These entities serve purely cosmetic purposes—displaying cannon AOE (area-of-effect) range and aiming reticules—as background-layer animated assets. They are non-interactive, non-persistent, and explicitly excluded from client-side sleeping and user input processing via the `NOCLICK` and `FX` tags.

## Usage example
```lua
-- Create the AOE range effect at position (x, y, z)
local aoe_fx = SpawnPrefab("cannon_aoe_range_fx")
aoe_fx.Transform:SetPosition(x, y, z)

-- Create the reticule effect at a different position
local reticule_fx = SpawnPrefab("cannon_reticule_fx")
reticule_fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK` to all instances.

## Properties
No public properties

## Main functions
Not applicable — this file only defines prefabs, not reusable component logic. The prefabs are instantiated via `SpawnPrefab("...")`.

## Events & listeners
None identified
