---
id: blueprint_craftingset
title: Blueprint Craftingset
description: Creates a temporary entity that, when built, spawns and distributes blueprint prefabs to the builder's inventory.
tags: [crafting, inventory, prefab]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ef8a6b4c
system_scope: crafting
---

# Blueprint Craftingset

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This prefab file defines two prefabs—`blueprint_craftingset_ruins_builder` and `blueprint_craftingset_ruinsglow_builder`—that serve as intermediate entities used during world generation or construction. When the entity is built (typically by a builder character), it automatically spawns the associated blueprint prefabs (e.g., `turf_ruinsbrick_glow_blueprint`) and places them into the builder's inventory. It is non-persistent, exists only momentarily, and removes itself shortly after creation unless acted upon by a build action.

## Usage example
This prefab file itself is not added as a component to entities. Instead, it returns two prefabs via `MakeBlueprintSet`, which are used elsewhere (e.g., in room layouts or tasks) as buildable objects:
```lua
-- Example: How this file's output is used internally (not how a modder adds it)
local ruins_craftingset = Prefab("blueprint_craftingset_ruins_builder", ...) -- created by this file
-- The returned prefab can be placed in a room/task and will auto-trigger its OnBuiltFn when constructed.
```

## Dependencies & tags
**Components used:** `inventory` (via `builder.components.inventory:GiveItem(...)`)
**Tags:** Adds `CLASSIFIED`

## Properties
No public properties defined in the component sense. This file only defines prefabs, not components.

## Main functions
### `MakeBlueprintSet(name, blueprints)`
*   **Description:** Creates and returns a `Prefab` that spawns a temporary entity configured to release a set of blueprint prefabs upon being built.
*   **Parameters:** 
  - `name` (string) - The name of the prefab to be created (e.g., `"blueprint_craftingset_ruins_builder"`).
  - `blueprints` (table) - A list of base blueprint names (strings) to be spawned. Each will be suffixed with `"_blueprint"` when spawned.
*   **Returns:** A `Prefab` object (function returning `Entity`), ready for use in worldgen or as a buildable item.
*   **Error states:** Not applicable.

### `builder_onbuilt(inst, builder)`
*   **Description:** Callback function triggered when the entity is built. It spawns blueprint prefabs at the builder’s location and places them in the builder’s inventory, then destroys the entity.
*   **Parameters:** 
  - `inst` (Entity) - The blueprint craftingset entity being built.
  - `builder` (Entity) - The entity (typically a character) that built this entity.
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes `builder.components.inventory` exists.

## Events & listeners
- **Listens to:** None (this is a prefab file, not a component).
- **Pushes:** None.

## Additional notes
- Entities created by `MakeBlueprintSet` are non-networked (`inst.persists = false`) and self-destruct after 0 seconds if not built.
- Only the master simulation (server) processes the `OnBuiltFn`. On clients, the function returns early after creating the basic entity.
- This file does not define a component and should not be added via `inst:AddComponent(...)`.