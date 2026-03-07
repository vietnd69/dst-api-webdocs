---
id: turfs
title: Turfs
description: Generates prefabs for ground tile items that can be placed on the map to replace existing tiles.
tags: [world, placement, terrain, inventory, fuel]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f88ad51b
system_scope: world
---

# Turfs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `turfs.lua` file dynamically generates Prefab definitions for all ground tile types defined in `worldtiledefs.lua`. Each generated prefab represents a stackable, inventory-holdable item (like Grass, Sand, or Cobblestone) that can be placed on the map using a deployable component. These prefabs are used both as inventory items and as fuel sources. The file leverages a factory function (`make_turf`) to instantiate prefabs with consistent behavior, animations, and component setups.

## Usage example
```lua
-- This file is not typically used directly; it returns a list of prefabs.
-- Example usage in a mod:
local Turfs = require "prefabs/turfs"
for _, turf_prefab in ipairs(Turfs) do
    print("Loaded turf prefab:", turf_prefab)
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `bait`, `fuel`, `deployable`  
**Tags added:** `groundtile`, `molebait`  
**Tags checked:** None  

## Properties
No public properties are defined outside of those set via component APIs.

## Main functions
### `make_turf(tile, data)`
*   **Description:** Factory function that creates and returns a `Prefab` definition for a single ground tile type. Configures the entity with required components, animations, and placement behavior.
*   **Parameters:**  
    `tile` (string) - The internal tile identifier (e.g., `"grass"`, `"sand"`) from `GroundTiles.turf`.  
    `data` (table) - A table containing keys like `name`, `bank_build`, `anim`, `pickupsound`, `bank_override`, `build_override`, `animzip_override`, `invicon_override`.
*   **Returns:** `Prefab` - A fully configured prefab definition.
*   **Error states:** None documented.

## Events & listeners
- **Listens to:** None (no event listeners are registered directly in this file).
- **Pushes:** None (the `ondeploy` callback fires placement logic, but no events are explicitly pushed by this file).