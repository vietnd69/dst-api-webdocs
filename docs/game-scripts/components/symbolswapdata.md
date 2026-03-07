---
id: symbolswapdata
title: Symbolswapdata
description: Stores and manages symbol-swapping configuration data for world symbols (e.g., for map generation or prefabs).
tags: [map, data, worldgen]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 93902c00
system_scope: world
---

# Symbolswapdata

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Symbolswapdata` is a lightweight data-holding component used to associate symbol-swap metadata (such as the source `build`, target `symbol`, and whether the symbol is skinned) with an entity. It does not implement game logic itself but serves as a data container for systems that perform symbol-swapping operations—typically during world generation or prefab instantiation. Entities using this component are usually map tiles, room elements, or procedural generation artifacts.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("symbolswapdata")
inst.components.symbolswapdata:SetData("forest", "symbol_tree_01", true)
-- Later, for debugging or logging:
print(inst.components.symbolswapdata:GetDebugString())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `build` | string or `nil` | `nil` | The name of the build/room type the symbol originates from (e.g., `"forest"`, `"caves"`). |
| `symbol` | string or `nil` | `nil` | The target symbol identifier to swap in (e.g., `"symbol_tree_01"`). |
| `is_skinned` | boolean or `nil` | `nil` | Whether the symbol should be treated as a skinned variant (e.g., for seasonal or event variants). |

## Main functions
### `SetData(build, symbol, is_skinned)`
* **Description:** Sets the symbol-swap metadata for the entity. Typically called during initialization before the symbol swap is applied by a higher-level system (e.g., `Room` or `StaticLayout`).
* **Parameters:**  
  - `build` (string or `nil`) — Identifier for the source build.  
  - `symbol` (string or `nil`) — Target symbol key to apply.  
  - `is_skinned` (boolean or `nil`) — Skinned variant flag.
* **Returns:** Nothing.
* **Error states:** No validation is performed; accepts `nil` for any argument.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the stored data.
* **Parameters:** None.
* **Returns:** string — Formatted as `"build:<value>, symbol:<value>, is_skinned:<value>"`, with empty strings for `nil` values.

## Events & listeners
None identified
