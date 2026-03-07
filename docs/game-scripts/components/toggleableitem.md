---
id: toggleableitem
title: Toggleableitem
description: Manages the toggle state (on/off) of an item and executes a user-defined callback when toggled.
tags: [inventory, utility]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 967dd1e3
system_scope: entity
---

# Toggleableitem

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ToggleableItem` is a simple utility component that tracks whether an item is in an "on" or "off" state and triggers a customizable callback function whenever the state changes. It is designed to be attached to prefabs that need a binary toggle behavior (e.g., lanterns, lighters, or wearable items with active/passive modes). It does not directly interact with other components but relies on external logic to call `ToggleItem()` (e.g., via `onaction` or `inventoryitem` usage events).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("toggleableitem")
inst.components.toggleableitem:SetOnToggleFn(function(item, is_on)
    if is_on then
        item.components.light:Enable(true)
    else
        item.components.light:Enable(false)
    end
end)
inst.components.toggleableitem:ToggleItem() -- toggles state and triggers callback
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `on` | boolean | `false` | Current toggle state (`true` = on, `false` = off). |
| `onusefn` | function or `nil` | `nil` | Callback function executed on toggle; receives `(item_inst, is_on)` as arguments. |
| `stopuseevents` | table or `nil` | `nil` | Reserved field (unused in current implementation). |
| `inst` | Entity | `nil` | Reference to the entity owning this component. |

## Main functions
### `SetOnToggleFn(fn)`
* **Description:** Sets the callback function that is executed whenever `ToggleItem()` is called. The function is invoked *after* the `on` state is updated.
* **Parameters:** `fn` (function or `nil`) — A function that takes two arguments: `item_inst` (the entity), and `is_on` (boolean indicating the new state). Passing `nil` disables the callback.
* **Returns:** Nothing.

### `ToggleItem()`
* **Description:** Toggles the `on` state and executes the callback function (if set).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
