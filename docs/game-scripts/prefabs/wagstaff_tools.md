---
id: wagstaff_tools
title: Wagstaff Tools
description: Creates lightweight, eroding tool prefabs with toggleable lighting, used for special characters in DST.
tags: [inventory, lighting, erosion, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1eb8fafd
system_scope: inventory
---

# Wagstaff Tools

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagstaff_tools.lua` defines a factory function `maketool` used to create five distinct tool prefabs (`wagstaff_tool_1` through `wagstaff_tool_5`). These prefabs are lightweight entities intended for special use cases (e.g., Winona-exclusive tools), featuring dynamic erosion animation, persistent lighting toggling, and inventory integration. Each tool is non-persistable (`persists = false`), has custom naming logic (depending on the active player), and automatically erodes (fades in/out of a shadowed state) upon creation using the `erode` coroutine function.

## Usage example
```lua
-- Create a new wagstaff tool instance (e.g., tool #3: book)
local tool_prefab = require "prefabs/wagstaff_tools"
-- The returned prefabs are already instantiated via return statement

-- To create an instance at runtime (e.g., in a mod):
local tool = CreateEntity()
tool.entity:AddTransform()
tool.entity:AddAnimState()
tool.entity:AddLight()
tool.entity:AddNetwork()
MakeInventoryPhysics(tool)
tool:AddComponent("inventoryitem")
tool:AddComponent("stackable")
tool:AddComponent("inspectable")
tool:AddComponent("tradable")
-- ... manually configure as per maketool logic
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inspectable`, `tradable`, `light`, `animstate`, `transform`, `network`  
**Tags:** Adds `irreplaceable`, `wagstafftool`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `erodeparam` | number | `-0.20` (varies per tool) | Parameter passed to `AnimState:SetErosionParams` to control visual erosion intensity. |
| `shadow` | boolean | `true` | Tracks whether the tool currently casts a shadow (toggled during erosion). |

## Main functions
### `erode(inst, time, erodein, removewhendone)`
*   **Description:** Starts a coroutine that gradually toggles the `shadow` state and corresponding `Light:Enable()` calls to simulate a slow erosion/fade effect. The animation progresses linearly over `time` seconds, using `TheSim:GetTickTime()` for timing.
*   **Parameters:**  
    `time` (number, optional) – Total duration of the erosion in seconds (defaults to `1`).  
    `erodein` (boolean) – If `true`, the tool fades *into* a lit/shadowed state; if `false`, fades *out*.  
    `removewhendone` (boolean) – If `true`, removes the entity after erosion completes.  
*   **Returns:** Nothing (coroutine-based side effect).
*   **Error states:** None identified; uses `Yield()` to avoid blocking the main thread.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.  
