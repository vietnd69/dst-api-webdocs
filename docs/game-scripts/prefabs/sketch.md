---
id: sketch
title: Sketch
description: Represents a collectible sketch item that references a specific chess piece blueprint, stores its identity, and provides recipe and image metadata for crafting and UI.
tags: [inventory, crafting, savefile]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0f6c1ce
system_scope: inventory
---

# Sketch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sketch` prefab represents a physical sketch item in DST that visually represents a chess piece blueprint. It stores an internal `sketchid` index pointing to a predefined entry in the global `SKETCHES` table, which maps sketch instances to specific chess piece prefabs, associated recipes, and optional custom image names. The component provides persistence via save/load hooks (`OnSave`/`OnLoad`) and exposes helper methods for querying recipe names and linked sketch prefabs. It integrates with the `named`, `inventoryitem`, `fuel`, `erasablepaper`, and `inspectable` components.

## Usage example
```lua
-- Example: Creating a generic sketch with default ID 1 (Pawn)
local sketch = Prefab("sketch", fn, assets)
local inst = CreateEntity()
inst:AddComponent("named")
inst:AddComponent("inventoryitem")
inst:AddComponent("fuel")
-- ... setup transforms, anim state ...
inst.sketchid = 5  -- Assign sketch ID manually
inst.components.named:SetName("Sketch: The Muse")
-- The sketch will use the image defined for ID 5 if present
```

## Dependencies & tags
**Components used:** `named`, `inventoryitem`, `fuel`, `erasablepaper`, `inspectable`  
**Tags added:** `sketch`, `_named` (temporary during construction for optimization)  
**Tags removed:** `_named` (post-construction, re-added by `named` component)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sketchid` | number | `1` | Index into the global `SKETCHES` table; determines which chess piece the sketch represents. |
| `pickupsound` | string | `"paper"` | Sound played when the sketch is picked up. |

## Main functions
### `GetRecipeName(inst)`
* **Description:** Returns the name of the recipe associated with this sketch’s chess piece (e.g., `"chesspiece_pawn_builder"`).
* **Parameters:** `inst` (entity instance) — the sketch instance.
* **Returns:** string — the recipe name.
* **Error states:** Returns `nil` if `inst.sketchid` is out of bounds.

### `GetSpecificSketchPrefab(inst)`
* **Description:** Returns the string name of the associated specific sketch prefab (e.g., `"chesspiece_pawn_sketch"`).
* **Parameters:** `inst` (entity instance) — the sketch instance.
* **Returns:** string — the prefab name suffixed with `"_sketch"`.
* **Error states:** Returns `nil` if `inst.sketchid` is out of bounds.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.  
(No events are defined or listened to directly by the `sketch` logic.)