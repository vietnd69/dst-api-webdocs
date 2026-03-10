---
id: prefabskins
title: Prefabskins
description: This component manages player-specific prefab skins and their associated network replication in DST.
tags: [player, network, skins]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 87539c3f
system_scope: player
---

# Prefabskins

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Prefabskins is an auto-generated component responsible for handling player-specific prefab skins — assets that visually customize how prefabs (e.g., characters, items, pets) appear for a given player. It is designed to track and replicate skin state across the network without requiring explicit logic beyond auto-generation metadata. All functionality is provided via the framework's code generation pipeline.

## Usage example
Typical usage is internal and handled automatically by the game client when loading player account items or saving skin preferences; however, a mod might interact with it like this:

```lua
-- Example: Access the prefabskins component on a player entity
local player = ThePlayer
if player and player.components and player.components.prefabskins then
    -- Check available skins (internal API)
    -- Note: Actual skin setting/retrieval is typically handled via replica or RPCs
    -- This component primarily exists to support networked skin state
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None found

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None |  |  | No properties are defined. |

## Main functions
No functions are explicitly defined. All functionality is auto-generated and handled by the engine infrastructure.

## Events & listeners
No events are emitted or listened to by this component.