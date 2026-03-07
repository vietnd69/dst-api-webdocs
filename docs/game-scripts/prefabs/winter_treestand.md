---
id: winter_treestand
title: Winter Treestand
description: A structure that can be planted with a winter tree seed to grow into a full winter tree and yields wood when harvested before full growth.
tags: [structure, resource, growth, hammerable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e0c2e23
system_scope: environment
---

# Winter Treestand

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`winter_treestand` is a prefabricated structure entity representing an immature winter tree sapling stage. It serves as the initial placement of a winter tree seed before growth. The entity supports interaction via the `workable` component (hammerable) to harvest resources early, integrates with the `burnable` and `growable` systems, and emits a placement sound and animation upon build. When planted with a seed, it transforms into a full-grown winter tree.

## Usage example
```lua
local inst = SpawnPrefab("winter_treestand")
inst.Transform:SetPosition(world_position)
-- Optional: Plant a seed to grow the tree
inst:PushEvent("plantwintertreeseed", { seed = my_seed, doer = player })
-- Or hammer it to harvest wood before it grows
if inst.components.workable then
    inst.components.workable:Work(1, player)
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `burnable`, `growable`, `inspectable`, `hauntable`, `obstacle`
**Tags added:** `winter_treestand`, `structure`

## Properties
No public properties.

## Main functions
### `onhammered(inst)`
*   **Description:** Callback executed when the treestand is fully hammered. Drops loot (via `lootdropper`) and spawns a collapse FX, then removes the entity.
*   **Parameters:** `inst` (Entity) — the winter treestand instance being hammered.
*   **Returns:** Nothing.

### `onplanted(inst, data)`
*   **Description:** Handles planting a winter tree seed. Removes the treestand, spawns a new winter tree at the same position, starts its growth, and removes the seed.
*   **Parameters:**
    *   `inst` (Entity) — the winter treestand instance.
    *   `data` (table) — event payload containing `seed` (Entity) and `doer` (Entity).
*   **Returns:** Nothing.

### `onbuilt(inst)`
*   **Description:** Plays the placement sound and animation when the structure is placed in the world.
*   **Parameters:** `inst` (Entity) — the winter treestand instance.
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes burn state into the save data if the entity is burning or burnt.
*   **Parameters:** `inst` (Entity), `data` (table) — save data table to modify.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores burn state on load if `data.burnt` is true by invoking the `burnable` component’s `onburnt` handler.
*   **Parameters:** `inst` (Entity), `data` (table) — loaded save data (may be `nil`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
    - `onbuilt` — triggers `onbuilt` callback to play placement animation and sound.
    - `plantwintertreeseed` — triggers `onplanted` callback to convert the treestand into a growing tree.
- **Pushes:**
    - `itemplanted` — fired in `onplanted` to notify the world of the planting action (not specific to this entity).