---
id: maxwellhome
title: Maxwellhome
description: Defines static map layout data for the Maxwell home scenario, containing pre-configured entities with fixed positions and properties.
tags: [map, scene, static, level-design, maxwell]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 591dbca5
system_scope: world
---

# Maxwellhome

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The Maxwellhome module is a pure data structure representing a static map layout for the Maxwell home scenario. It does not implement any logic, components, or events; it exclusively contains pre-defined entity definitions—including grass, berrybush, and treasurechest—with hardcoded coordinates, rotation, and properties. This structure is used to instantiate the physical layout of the map during world generation.

## Usage example
The module is typically imported and used as a raw data table during world setup, for example:
```lua
local maxwellhome = require("scripts/maps/maxwellhome")
-- Use `maxwellhome` as a lookup to instantiate entities:
for name, data in pairs(maxwellhome) do
    local inst = Spawn Prefab(name)
    inst.Transform:SetPosition(data.x, data.y, data.z)
    inst.Transform:SetRotation(data.rot)
    -- Additional initialization per entity type...
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None  

## Properties
The table contains named entries, each representing an entity with the following inherent structure (based on chunk data):

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `x` | number | (varies) | X-axis world coordinate |
| `y` | number | (varies) | Y-axis world coordinate (height) |
| `z` | number | (varies) | Z-axis world coordinate |
| `rot` | number | (varies) | Rotation angle in degrees |
| `prefab` | string | (varies) | Prefab name used to spawn the entity |

Note: This is a data table, not an instance-based object. Values are static and defined inline per entity entry.

## Main functions
No functions are defined in this module.

## Events & listeners
No events are defined or referenced in this module.