---
id: heavyobstacleusetarget
title: Heavyobstacleusetarget
description: Controls whether an entity can interact with heavy obstacles and updates the `can_use_heavy` tag accordingly.
tags: [interaction, obstacle, tag]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f14b4be8
system_scope: entity
---

# Heavyobstacleusetarget

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HeavyObstacleUseTarget` is a simple component that manages whether an entity is allowed to use heavy obstacles (e.g., large boulders or obstacles requiring special tools to move). It exposes a `can_use_heavy` property and automatically keeps the `can_use_heavy` tag synchronized on the entity based on that property's value. It also provides a `UseHeavyObstacle` method to delegate heavy-obstacle usage behavior via an optional callback function.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("heavyobstacleusetarget")
inst.components.heavyobstacleusetarget.can_use_heavy = false
-- The entity will no longer have the "can_use_heavy" tag.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds or removes `can_use_heavy` based on the `can_use_heavy` property.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `can_use_heavy` | boolean | `true` | Indicates whether the entity is allowed to use heavy obstacles. When set, it automatically updates the `can_use_heavy` tag on `self.inst`. |
| `on_use_fn` | function (optional) | `nil` | Callback function invoked by `UseHeavyObstacle`. Signature: `fn(inst, doer, heavy_obstacle)`. |

## Main functions
### `UseHeavyObstacle(doer, heavy_obstacle)`
*   **Description:** Invokes the optional `on_use_fn` callback (if set) to handle heavy-obstacle usage logic. Returns `false` if no callback is defined or if the callback returns `nil`/`false`.
*   **Parameters:**  
    * `doer` (Entity) — The entity performing the action.  
    * `heavy_obstacle` (Entity) — The heavy obstacle being used.  
*   **Returns:** `boolean` — The result of `on_use_fn(...)`, or `false` if `on_use_fn` is `nil`.  
*   **Error states:** None.

## Events & listeners
None.
