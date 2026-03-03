---
id: gravedigger
title: Gravedigger
description: A callback-triggering component invoked when a gravesite is used, commonly attached to grave-related prefabs.
tags: [grave, interaction, callback]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2187161f
system_scope: entity
---

# Gravedigger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Gravedigger` is a simple component that provides a callback hook for when a gravesite (typically associated with grave objects like `grave`) is used by an entity. It does not implement logic itself but enables external code to define behavior via the `onused` callback when an interaction occurs. This component is commonly attached to grave prefabs and works in conjunction with the game’s UI or action systems (e.g., `actions.lua`) that trigger usage events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("gravedigger")

-- Define behavior when the grave is used
inst.components.gravedigger.onused = function(grave, user, target)
    print(user:GetDebugString() .. " used " .. grave:GetDebugString())
    -- Custom logic: spawn loot, trigger cutscene, etc.
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onused` | function or `nil` | `nil` | Callback function invoked when the grave is used. Signature: `function(grave, user, target)`. |

## Main functions
### `OnUsed(user, target)`
* **Description:** Invokes the `onused` callback if it is set. This function is typically called internally by the game when a player interacts with the grave.
* **Parameters:**  
  - `user` (entity) – The entity that used the grave (e.g., a player character).  
  - `target` (entity) – The target of the use action; often the same as `self.inst` (the grave entity itself).  
* **Returns:** Nothing.  
* **Error states:** If `onused` is `nil`, the function does nothing and returns silently.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
