---
id: migrationpetsoverrider
title: Migrationpetsoverrider
description: Provides a mechanism to override positioning logic for migration pets spawned by the player spawner system.
tags: [migration, spawner, positioning]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 82301181
system_scope: entity
---

# Migrationpetsoverrider

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Migrationpetsoverrider` is a lightweight component designed to customize the spawn offset calculation for migration pets—entities that follow or accompany a player under specific game conditions (e.g., pig kingdoms or other seasonal mechanics). It allows modders to inject a custom function that determines the spatial offset relative to the player where migration pets should appear. The component is typically attached to the player entity and used by `playerspawner`-related logic.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("migrationpetsoverrider")

-- Define a custom offset function (e.g., pets spawn 2 units ahead and 1 unit to the side)
inst.components.migrationpetsoverrider:SetOffsetFromFn(function(owner, x, y, z)
    return x + 2, y, z + 1
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `getoffsetfromfn` | function or `nil` | `nil` | Custom function that calculates spawn offset for migration pets. Signature: `fn(inst, x, y, z) → ox, oy, oz`. |

## Main functions
### `SetOffsetFromFn(fn)`
* **Description:** Assigns the function used to compute the positional offset for migration pets relative to the entity. If set to `nil`, defaults to no offset (i.e., `(0, 0, 0)`).
* **Parameters:** `fn` (function or `nil`) — a callback function that takes the owner entity and current world coordinates (`x`, `y`, `z`), and returns adjusted coordinates (`ox`, `oy`, `oz`).
* **Returns:** Nothing.

### `GetOffsetFrom(x, y, z)`
* **Description:** Computes the final spawn coordinates by applying the configured offset function, if present.
* **Parameters:**  
  `x` (number) — base X coordinate (world space)  
  `y` (number) — base Y coordinate (world space)  
  `z` (number) — base Z coordinate (world space)
* **Returns:**  
  `ox` (number) — adjusted X coordinate  
  `oy` (number) — adjusted Y coordinate  
  `oz` (number) — adjusted Z coordinate  
* **Error states:** Returns `(0, 0, 0)` if `getoffsetfromfn` is not set.

## Events & listeners
- **Listens to:** None  
- **Pushes:** None
