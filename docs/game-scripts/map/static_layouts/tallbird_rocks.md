---
id: tallbird_rocks
title: Tallbird Rocks
description: A static map layout defining the placement of tallbird nests and rocks in a specific region of the game world.
tags: [map, environment, worldgen]
sidebar_position: 10

last_updated: 2026-03-02
build_version: 714014
change_status: stable
category_type: map
source_hash: afbed0a3
system_scope: environment
---

# Tallbird Rocks

> Based on game build **714014** | Last updated: 2026-03-02

## Overview
This file is a static layout definition (in Tiled Map Editor format) that specifies the spatial configuration of environmental assets—including Tallbird Nests and various rock types—in a fixed area of the world. It is not an ECS component and does not define behavior logic; rather, it provides layout metadata used by the world generation system to instantiate prefabs at designated positions. Entities like `tallbirdnest`, `rock1`, `rock2`, and `rock_flintless` are placed as objects in the map, and their coordinates are used to spawn corresponding prefabs during world initialization.

## Usage example
This file is loaded and processed internally by the world generation system; modders typically do not interact with it directly. However, for reference, the system reads its object layer to spawn prefabs as follows:

```lua
-- Pseudocode: how the engine might use the layout
for _, obj in ipairs(layout.layers.FG_OBJECTS.objects) do
    if obj.type == "tallbirdnest" then
        inst = SpawnPrefab("tallbirdnest")
        inst.Transform:SetPosition(obj.x, obj.y, 0)
    elseif obj.type:find("^rock") then
        inst = SpawnPrefab(obj.type)
        inst.Transform:SetPosition(obj.x, obj.y, 0)
    end
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties — this file is a data definition (a plain Lua table) with no component logic or state.

## Main functions
Not applicable

## Events & listeners
Not applicable