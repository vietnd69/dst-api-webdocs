---
id: boatfragments
title: Boatfragments
description: Defines the prefabs for broken boat fragments, which are collectible, burnable, and workable objects that drop boards when hammered.
tags: [collectible, environment, workable]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 227aa138
system_scope: environment
---

# Boatfragments

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `boatfragments.lua` file defines three prefabs: `boatfragment03`, `boatfragment04`, and `boatfragment05`. These are static environmental objects representing salvaged pieces of a broken boat. Each fragment is equipped with components that allow it to be burned, hauntable, inspectable, and workable (specifically hammerable). When hammered, the fragment drops loot (boards) and collapses. It is always marked as `wet`.

## Usage example
```lua
-- Example of spawning a boat fragment programmatically
local frag = SpawnPrefab("boatfragment03")
frag.Transform:SetPosition(entity.Transform:GetWorldPosition())
frag.Physics:SetStatic(true)
frag:ActivatePhysics()
```

## Dependencies & tags
**Components used:** `edible`, `hauntable`, `inspectable`, `lootdropper`, `workable`, `burnable`, `propagator`  
**Tags:** Adds `wet`; checks `burnt`, `structure` (via burnable/lootdropper logic)

## Properties
No public properties.

## Main functions
### `fn(suffix, radius)`
*   **Description:** Constructor function that creates and configures a boat fragment entity. It is called per prefab to instantiate individual fragments with different animation suffixes.
*   **Parameters:**
    *   `suffix` (string) – Used to select appropriate animation states (`land_` + suffix, `idle_loop_` + suffix).
    *   `radius` (number) – Radius for obstacle physics.
*   **Returns:** `inst` (Entity) – A fully configured entity instance.
*   **Error states:** Returns early without adding master-only components if `TheWorld.ismastersim` is false (i.e., runs on the client).

### `onhammered(inst)`
*   **Description:** Callback executed when the workable component finishes being hammered. Drops loot, spawns a small collapse FX, and removes the fragment entity.
*   **Parameters:** `inst` (Entity) – The fragment being hammered.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly.
- **Pushes:** `entity_droploot` (via `LootDropper:DropLoot`).