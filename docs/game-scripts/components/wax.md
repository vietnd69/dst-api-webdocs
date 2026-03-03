---
id: wax
title: Wax
description: Controls whether an entity functions as a wax spray, applying or removing the `waxspray` tag accordingly.
tags: [wax, item, tag]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8fc10d1c
system_scope: entity
---

# Wax

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wax` is a simple component that manages the `waxspray` tag on an entity based on its `is_spray` state. It is typically attached to wax-related items to indicate whether they are currently in "spray" mode. The component provides a clear API to toggle and query this mode, automatically synchronizing the entity's tags.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wax")

-- Activate spray mode
inst.components.wax:SetIsSpray()

-- Check current mode
if inst.components.wax:GetIsSpray() then
    -- Perform spray-specific logic
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `waxspray` when `is_spray` is true; removes it when false.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_spray` | boolean | `false` | Indicates whether the entity is acting as a wax spray. |

## Main functions
### `SetIsSpray()`
* **Description:** Sets the `is_spray` state to `true` and adds the `waxspray` tag to the entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetIsSpray()`
* **Description:** Returns the current `is_spray` state.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if the entity is in spray mode, `false` otherwise.

## Events & listeners
- **Listens to:** `is_spray` — an internal function `OnIsSprayFn` is bound to this property name in the class metatable and triggers tag updates when the property is set.
- **Pushes:** None identified
