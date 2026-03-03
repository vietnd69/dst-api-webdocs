---
id: fertilizable
title: Fertilizable
description: Provides a callback hook for handling fertilizer application on an entity.
tags: [farming, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f5a4d40f
system_scope: entity
---

# Fertilizable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fertilizable` is a lightweight component that enables an entity to respond to fertilizer application via a customizable callback function (`onfertlizedfn`). It does not manage state or logic itself but delegates the fertilizer handling to an externally assigned callback. This component is typically attached to entities such as crops or soil plots that need to react when fertilized by a player or item.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fertilizable")

inst.components.fertilizable.onfertlizedfn = function(inst, fertilizer)
    print("Fertilized by", fertilizer(prefab))
    -- perform growth logic, add tags, etc.
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onfertlizedfn` | function | `nil` | Callback invoked when `:Fertilize(fertilizer)` is called. Receives `inst` and `fertilizer` as arguments. |

## Main functions
### `Fertilize(fertilizer)`
* **Description:** Triggers the fertilizer callback, if one is assigned. Typically called when a player applies fertilizer to this entity.
* **Parameters:** `fertilizer` (Entity) — the fertilizer item or entity being used.
* **Returns:** The return value of the callback function (`onfertlizedfn`), or `nil` if no callback is set.
* **Error states:** No explicit error handling; silently returns `nil` if `onfertlizedfn` is unassigned.

## Events & listeners
None identified
