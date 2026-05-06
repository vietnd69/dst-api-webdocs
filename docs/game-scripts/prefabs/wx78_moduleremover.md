---
id: wx78_moduleremover
title: Wx78 Moduleremover
description: Prefab for the WX-78 Module Remover item, allowing removal of installed system modules.
tags: [prefab, item, wx78, upgrade]
sidebar_position: 10
last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 6ed7c1c8
system_scope: inventory
---

# Wx78 Moduleremover

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`wx78_moduleremover.lua` registers a spawnable inventory item entity used by the WX-78 character. The prefab's `fn()` constructor builds the physics body and attaches client-side components; server-side logic within the same function attaches gameplay components (inspectable, inventoryitem, upgrademoduleremover). The prefab is referenced by its name `"wx78_moduleremover"` and instantiated with `SpawnPrefab("wx78_moduleremover")`.

## Usage example
```lua
-- Spawn at world origin:
local inst = SpawnPrefab("wx78_moduleremover")
inst.Transform:SetPosition(0, 0, 0)

-- Reference assets at load time:
local assets = {
    Asset("ANIM", "anim/wx78_moduleremover.zip"),
}

-- Verify component attachment on server:
if TheWorld.ismastersim then
    assert(inst.components.upgrademoduleremover ~= nil)
end
```

## Dependencies & tags
**External dependencies:**
- None identified

**Components used:**
- `inspectable` -- allows players to examine the item
- `inventoryitem` -- enables carrying in inventory slots
- `upgrademoduleremover` -- specific logic for removing WX-78 modules

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of `Asset(...)` entries listing animation files loaded with this prefab. |

## Main functions
### `fn()`
*   **Description:** Prefab constructor executed on both client and server. Sets up Transform, AnimState, and Network entities. Configures animation bank/build and plays idle animation. Applies inventory physics and floatable behavior. Sets inst.scrapbook_specialinfo = "WX78MODULEREMOVER" for scrapbook tracking. On the master simulation (`TheWorld.ismastersim`), attaches gameplay components (inspectable, inventoryitem, upgrademoduleremover) and applies burnable behavior via MakeSmallBurnable with TUNING.SMALL_BURNTIME, small propagator behavior (spreads fire) via MakeSmallPropagator, and hauntable launch behavior (ghosts can spawn it) via MakeHauntableLaunch. Returns `inst` to the prefab system.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** Errors if `CreateEntity()` fails to allocate an entity slot (no nil guard before entity member access).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.