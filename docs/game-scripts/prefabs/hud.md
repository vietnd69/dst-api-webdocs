---
id: hud
title: Hud
description: Defines the HUD prefab responsible for loading user interface assets and dependencies.
tags: [ui, assets, prefab]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 9f5e9d69
system_scope: ui
---

# Hud

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Hud` is a prefab definition used primarily to preload and manage assets required for the game's user interface. It does not represent a physical entity in the world but ensures that animations, images, and sounds for meters, compasses, and screens are available when needed. This prefab is typically loaded automatically by the engine during initialization. The prefab function creates a basic entity without attaching any components, serving purely as an asset container.

## Usage example
```lua
-- The hud prefab is usually loaded automatically by the game engine.
-- Modders typically do not need to spawn this directly.
-- To reference assets defined here, ensure the prefab is loaded:

if not Prefabs["hud"] then
    -- Prefab not registered, assets may be missing
end

-- Spawning it creates an empty entity with assets preloaded:
local hud_inst = SpawnPrefab("hud")
```

## Dependencies & tags
**External dependencies:**
None identified.

**Prefab dependencies:**
- `minimap` -- Prefab dependency required for minimap functionality
- `gridplacer` -- Prefab dependency required for grid placement logic

**Components used:**
None identified.

**Tags:**
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `fn()`
*   **Description:** Internal constructor function called by the Prefab system to instantiate the entity. It creates a basic entity without adding specific components, serving purely as an asset loading container.
*   **Parameters:** None
*   **Returns:** Entity instance created via `CreateEntity()`.
*   **Error states:** None

## Events & listeners
None.