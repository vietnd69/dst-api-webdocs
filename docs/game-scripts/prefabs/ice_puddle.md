---
id: ice_puddle
title: Ice Puddle
description: A non-persistent background visual effect that renders a static ice puddle animation at a specific transform position.
tags: [environment, fx, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ffb97548
system_scope: environment
---

# Ice Puddle

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`ice_puddle` is a lightweight, non-persistent prefab used to render a background-layered ice puddle visual effect. It is intended for scenery or environmental decoration and is not functional—meaning it does not interact with gameplay systems (e.g., physics, damage, or AI). Its entity is configured as non-networked (`persists = false`) and uses only transform, animation state, and tag components. The `FX` tag ensures it behaves like other visual FX entities, particularly for rendering and inspection compatibility when parented.

## Usage example
This prefab is typically instantiated via level/gen scripts (e.g., room or static layout definitions) and not directly manipulated by mod code:

```lua
-- Example usage inside a room or static layout task
local puddle = SpawnPrefab("ice_puddle")
puddle.Transform:SetPos(x, y, z)
-- Positioning and parenting is handled at higher-level scene setup
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
Not applicable. This is a prefab definition, not a component with custom logic.

## Events & listeners
Not applicable.