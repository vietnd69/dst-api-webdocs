---
id: carnivalgamefeedable
title: Carnivalgamefeedable
description: Manages whether an entity can be fed during carnival minigames by toggling the `carnivalgame_canfeed` tag and providing a callback hook for feeding logic.
tags: [game, carnival, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e77130db
system_scope: entity
---

# Carnivalgamefeedable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CarnivalGameFeedable` is a lightweight component that enables or disables an entity's eligibility to be fed during carnival minigames. It controls the presence of the `carnivalgame_canfeed` tag on the entity based on its `enabled` state, and provides a customizable `OnFeed` callback that can be assigned by other systems (e.g., a carnival game manager) to define feeding behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("carnivalgamefeedable")
inst.components.carnivalgamefeedable.enabled = true
-- Assign custom feeding logic
inst.components.carnivalgamefeedable.OnFeed = function(ent, doer, item)
    print(doer .. " fed " .. ent .. " with " .. item)
    return true
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `carnivalgame_canfeed` when `enabled` is `true`; removes it when `false`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Controls whether the entity is marked as feedable via the `carnivalgame_canfeed` tag. |
| `OnFeed` | function or `nil` | `nil` | Optional callback function invoked when the entity is fed. Signature: `function(inst, doer, item)`. Should return a boolean indicating success. |

## Main functions
### `DoFeed(doer, item)`
*   **Description:** Invokes the `OnFeed` callback (if set) to handle feeding logic. Typically called by a feeding action handler (e.g., when a player feeds the entity during a carnival event).
*   **Parameters:**  
    - `doer` (Entity) — The entity performing the feeding action.  
    - `item` (Entity) — The food/item used to feed the entity.  
*   **Returns:**  
    - `true` or `false` — The return value of the `OnFeed` callback, or `false` if `OnFeed` is `nil`.  

## Events & listeners
None identified
