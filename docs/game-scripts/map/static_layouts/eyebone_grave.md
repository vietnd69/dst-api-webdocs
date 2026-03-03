---
id: eyebone_grave
title: Eyebone Grave
description: A static map layout file defining the visual and structural configuration for the Eyebone Grave location, including placement of gravestone objects and optional entity prefabs via object properties.
tags: [map, static_layout, worldgen]
sidebar_position: 1
last_updated: 2026-02-28
build_version: 714014
change_status: stable
category_type: map
source_hash: 319a904d
system_scope: world
---
# Eyebone Grave

> Based on game build **714014** | Last updated: 2026-02-28

## Overview
This file is a Tiled map export (`eyebone_grave.lua`) used for static world layout generation in Don't Starve Together. It defines an 8x8 tile grid where foreground objects — specifically gravestones and Eyebone-related prefabs — are placed via an object group. This layout is not a runtime entity component, but rather a data definition consumed during world generation to instantiate prefabs at specified coordinates. It plays a role in the world generation system by providing spatial references for pre-designed environmental assets (e.g., grave sites in Eyebone Ghost scenarios).

## Usage example
This file is not instantiated as an entity component. Instead, it is loaded by the world generation engine and processed to spawn prefabs. Example usage in worldgen logic:
```lua
-- Pseudocode: World generation engine would call something like this
local layout = require "map/static_layouts/eyebone_grave"
for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
    if obj.type == "gravestone" and obj.properties["data.setepitaph"] then
        -- Spawn gravestone prefab at obj.x, obj.y
        local gravestone = Prefab("gravestone")
        gravestone.Transform:SetPosition(obj.x, obj.y, 0)
        gravestone:AddTag("epitaph")
        gravestone.components.epitaph:SetEpitaph(obj.properties["data.setepitaph"])
    elseif obj.type == "chester_eyebone" and obj.properties.scenario == "eyebone_ghost" then
        -- Spawn Eyebone Ghost-specific chest variant
        local chest = Prefab("chester_eyebone")
        chest.Transform:SetPosition(obj.x, obj.y, 0)
        chest:AddTag("eyebone_chest")
    end
end
```

## Dependencies & tags
**Components used:** None directly — this is a pure data layout file.  
**Tags:** None assigned by this file. Tags are applied at runtime when prefabs are spawned based on `obj.type` and `properties`.

## Properties
No Lua properties are defined in this file. All data is structured as Tiled JSON-compatible tables with fixed keys (e.g., `version`, `width`, `layers`, `objects`).

## Main functions
No functions are defined. This file exports a single static Lua table representing a Tiled map.

## Events & listeners
Not applicable — this is a static data file and does not participate in runtime event systems.

