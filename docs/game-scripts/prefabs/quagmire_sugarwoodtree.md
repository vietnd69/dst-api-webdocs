---
id: quagmire_sugarwoodtree
title: Quagmire Sugarwoodtree
description: Defines the structure and assets for Quagmire sugarwood tree prefabs, including variants by size and tap state.
tags: [environment, plant, resource]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 164583a7
system_scope: environment
---

# Quagmire Sugarwoodtree

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_sugarwoodtree.lua` defines the prefabs for sugarwood trees in the Quagmire biome. It creates three size variants (`small`, `normal`, `tall`) and a generic default instance, configuring physics, animation, minimap icon, tags, and network behavior. The component is not a standalone entity component but a prefab factory — it constructs and returns `Prefab` objects used by the game engine to spawn tree instances. It does not implement game logic itself; initialization logic is delegated to `event_server_data("quagmire", ...).master_postinit` on the server side.

## Usage example
Prefabs defined by this file are not instantiated directly via code. They are referenced in world generation or spawner prefabs (e.g., in room tasksets or event layouts). Modders can extend the tree variant list by modifying `TREE_DEFS`, but this file itself is not added as a component to entities.

## Dependencies & tags
**Components used:** None. Uses entity components via `inst.entity:AddTransform()`, `inst.entity:AddAnimState()`, `inst.entity:AddMiniMapEntity()`, `inst.entity:AddNetwork()`, and utility functions like `MakeObstaclePhysics`, `MakeSnowCoveredPristine`.  
**Tags:** Adds `plant`, `tree`, `shelter`, `sugarwoodtree`, `tappable`.

## Properties
No public properties — this is a prefab factory file.

## Main functions
### `fn(tree_def)`
*   **Description:** Constructs and returns a raw `Inst` for a sugarwood tree instance. Called internally by `MakeTree` and `Prefab` constructors. Handles client-side and server-side initialization.
*   **Parameters:** `tree_def` (number or `nil`) — index into `TREE_DEFS` specifying size variant; defaults to `DEFAULT_TREE_DEF` (`2`, normal size).
*   **Returns:** `Inst` — the initialized entity instance.
*   **Error states:** Returns early with the client-side-only instance on non-master simulations (`TheWorld.ismastersim == false`).

### `MakeTree(i, name, _assets, _prefabs)`
*   **Description:** Wraps `fn(i)` inside a `Prefab` constructor, assigning the prefab a name, assets, and sub-prefabs. Used to generate the three size variants and the default tree prefab.
*   **Parameters:**  
    - `i` (number) — index used to select a `TREE_DEFS` entry.  
    - `name` (string) — prefab name (e.g., `"quagmire_sugarwoodtree_small"`).  
    - `_assets` (table, optional) — custom assets list.  
    - `_prefabs` (table, optional) — custom sub-prefabs list.
*   **Returns:** `Prefab` — a ready-to-register prefab object.

### `event_server_data("quagmire", "prefabs/quagmire_sugarwoodtree").master_postinit(inst, tree_def, TREE_DEFS)`
*   **Description:** Invokes a server-side extension hook (not defined in this file) to finalize server-side logic after initial instantiation. Typically adds components like `harvestable`, `workable`, or sap-related behavior.
*   **Parameters:** As passed by `fn` — `inst`, `tree_def`, and the full `TREE_DEFS` array.
*   **Returns:** Nothing.

## Events & listeners
None identified in this file. Event handling occurs in `master_postinit`, which resides in a separate file (`modscripts/quagmire/...` or `scripts/prefabs/quagmire_sugarwoodtree.lua` in the mod).

## Prefabs produced
- `quagmire_sugarwoodtree_small`
- `quagmire_sugarwoodtree_normal`
- `quagmire_sugarwoodtree_tall`
- `quagmire_sugarwoodtree` (default)

All share the same behavior and asset overrides but differ in animation bank and scale.