---
id: endtable
title: Endtable
description: A decorative and functional structure that can hold flowers and emit light, with built-in durability and destruction handling.
tags: [structure, decoration, light, destructible]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cffa9d18
system_scope: world
---

# Endtable

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `endtable` prefab represents a furniture item that serves both decorative and functional purposes. It can hold a single flower, which provides visual and sanity effects when fresh, and emits light when placed. The component logic is embedded directly in the prefab's construction function (`fn()`), not as a reusable component class. It integrates with multiple systems: `workable` (for hammering/destruction), `vase` (for flower management), `burnable` (for fire interaction), `lootdropper` (for item drops on destruction), and `inspectable` (for UI status reporting). It is typically placed via the `endtable_placer` prefabricator.

## Usage example
```lua
local inst = SpawnPrefab("endtable")
inst.Transform:SetPosition(x, y, z)
inst:PushEvent("onbuilt")
-- Optional: add a fresh flower
if inst.components.vase then
    inst.components.vase:SetFlower("orchid", TUNING.ENDTABLE_FLOWER_WILTTIME)
end
```

## Dependencies & tags
**Components used:** `workable`, `vase`, `inspectable`, `lootdropper`, `burnable`, `light`, `sound`, `animstate`, `transform`, `network`, `propagator`, `hauntable`, `snowcovered`, `lunarhailbuildup`
**Tags:** Adds `structure`, `vase`; checks `burnt`, `structure`

## Properties
No public properties.

## Main functions
The main functionality resides in the `fn()` constructor, which is not a typical method but the entity factory. No standalone utility functions are exported.

### Constructor (`fn`)
*   **Description:** Builds and configures the endtable entity instance with all required components and callbacks. Runs once per instance.
*   **Parameters:** None (closed over by closure).
*   **Returns:** `Entity` — fully initialized endtable instance.
*   **Error states:** Returns a non-mastersim proxy entity early on non-master instances; logic is skipped.

### Placer factory (`MakePlacer("endtable_placer", ...)`)
*   **Description:** Returns a prefabricator for placing endtables via build mode. Includes animation state override (`HideSymbol("swap_flower")`) to ensure no flower is shown on initial placement.
*   **Parameters:** None (called with arguments at definition site).
*   **Returns:** Prefabricator function suitable for use in the build menu.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `onbuilt` — triggers placement animation and sound (`onbuilt`). `ondeconstructstructure` — spawns `spoiled_food` if a flower is present (`ondeconstructstructure`).
- **Pushes:** None directly; relies on component events (`loot_prefab_spawned`, `sanitydelta`, etc.) via integrated components.

## Save/Load Integration
The endtable implements custom save/load logic:
- **onsave:** Records `burnt` state if currently burning or burnt.
- **onload:** Restores `flowerid` (for backward compatibility) and re-applies burnt state via component callbacks.