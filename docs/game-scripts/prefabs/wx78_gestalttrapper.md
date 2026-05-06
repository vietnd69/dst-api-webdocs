---
id: wx78_gestalttrapper
title: Wx78 Gestalttrapper
description: Spawnable inventory item prefab for WX-78 that functions as a socketable gestalt trapper component with low socket quality.
tags: [prefab, item, socketable, wx78]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 39f1b24d
system_scope: entity
---

# Wx78 Gestalttrapper

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_gestalttrapper.lua` registers a spawnable inventory item entity designed for WX-78 character gameplay. The prefab's `fn()` constructor builds the physics body, attaches animation state, and configures socketable behavior. Server-side initialization sets the socket quality to `SOCKETQUALITY.LOW` and attaches inspectable and inventoryitem components. The prefab is referenced by its name `"wx78_gestalttrapper"` and instantiated with `SpawnPrefab("wx78_gestalttrapper")`.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("wx78_gestalttrapper")
inst.Transform:SetPosition(0, 0, 0)

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/wx78_gestalttrapper.zip"),
}

-- Access socketable component on server:
if TheWorld.ismastersim then
    inst.components.socketable:SetSocketQuality(SOCKETQUALITY.LOW)
end
```

## Dependencies & tags
**External dependencies:**
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- configures item floating parameters in water
- `MakeItemSocketable_Client` -- client-side socketable item setup
- `MakeItemSocketable_Server` -- server-side socketable item setup
- `MakeHauntableLaunch` -- registers hauntable behavior for ghost interactions

**Components used:**
- `socketable` -- manages socket quality and socket interactions
- `inspectable` -- enables player inspection text
- `inventoryitem` -- allows item to be picked up and carried

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries listing animation files loaded with this prefab. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that runs on both client and server. Creates the entity, builds physics, attaches AnimState with bank and build, sets default idle animation, sets `inst.pickupsound` to `"metal"` for pickup sound effect, and configures socketable behavior with socket type `"socket_gestalttrapper"` via `MakeItemSocketable_Client`. Server-side logic sets socket quality and attaches gameplay components. Returns `inst` for framework processing.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None — runs on every host (client and server) with appropriate guards.

## Events & listeners
- **Listens to:** None identified in this file scope.
- **Pushes:** None identified in this file scope.
- **World state watchers:** None identified in this file scope.