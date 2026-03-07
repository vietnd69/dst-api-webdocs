---
id: watersource
title: Watersource
description: Manages the presence of the "watersource" tag on an entity based on availability state.
tags: [water, tag, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9b6d52a3
system_scope: environment
---

# Watersource

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Watersource` is a simple component that ensures an entity correctly carries the `"watersource"` tag based on its current availability status. It is typically attached to entities representing bodies of water or water-containing objects. The component responds to changes in availability—automatically adding or removing the tag—and provides a `Use()` hook for custom behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("watersource")
-- Availability is true by default; tag "watersource" is added
inst.components.watersource:SetAvailable(false) -- removes tag
inst.components.watersource:SetAvailable(true)  -- adds tag
inst.components.watersource.onusefn = function(ent) print("Used!") end
inst.components.watersource:Use() -- triggers custom function
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds/Removes `"watersource"` tag based on `available` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `available` | boolean | `true` | Whether the water source is currently usable; controls the presence of the `"watersource"` tag. |
| `onusefn` | function or `nil` | `nil` | Optional callback invoked when `Use()` is called. |

## Main functions
### `Use()`
* **Description:** Invokes the `onusefn` callback if it is defined. Intended for custom logic when the water source is consumed or interacted with.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If `onusefn` is `nil`, this function does nothing.

### `SetAvailable(available)`
* **Description:** Updates the `available` state and synchronizes the `"watersource"` tag accordingly.
* **Parameters:** `available` (boolean) — whether the water source should be considered available.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified  

## Notes
- The constructor initializes `available` to `true`, so the `"watersource"` tag is added immediately after component creation unless explicitly disabled.
- This component does not automatically remove itself; clean up via `OnRemoveFromEntity()` is handled by the engine when the component is detached, ensuring tag removal on entity destruction.
