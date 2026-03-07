---
id: quagmire_evergreen
title: Quagmire Evergreen
description: Defines prefabs for Quagmire-themed evergreen trees including variants (small, normal, tall) and stumps, with shared initialization logic and server-side extension hooks.
tags: [environment, vegetation, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fac27e0d
system_scope: environment
---

# Quagmire Evergreen

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_evergreen.lua` is a prefab definition script that creates multiple variants of evergreen trees used in the Quagmire biome. It defines shared initialization logic via the `fn` helper function, then constructs and returns prefabs for small, normal, tall, and stump variants. The script does not implement a runtime component but rather pre-configures entities before they are instantiated in the world. It relies on external server-side extension hooks (`master_postinit`, `master_postinit_tree`, `master_postinit_stump`) in `event_server_data("quagmire", ...)` for post-initialization logic (e.g., loot generation, growth state, etc.).

## Usage example
This file is not used directly in mod code but is loaded as part of the core game assets. As a modder, you would reference its generated prefabs by name, e.g.:

```lua
-- Spawn a normal Quagmire evergreen on the master simulation
local inst = Prefab("quagmire_evergreen_normal")
TheWorld:SpawnPrefab("quagmire_evergreen_normal")

-- Or use the stump variant
TheWorld:SpawnPrefab("quagmire_evergreen_stump")
```

## Dependencies & tags
**Components used:** None — this is a prefab factory, not a component.
**Tags:** Adds `plant`, `tree`, and `shelter` to each generated entity.

## Properties
Not applicable — this file defines prefabs, not a component instance.

## Main functions
This file does not define component-style functions accessible at runtime.

### `fn(treedef_id)`
*   **Description:** Internal constructor used to instantiate the core entity shared across all evergreen variants. Sets up transform, animation, physics, minimap, network, tags, sound, and applies snow-covered pristine state. Delegates to server-side `master_postinit` if on master simulation.
*   **Parameters:** `treedef_id` (number or nil) — 1-based index into `TREE_DEFS` to select tree variant (`nil` for default/complete tree).
*   **Returns:** Entity instance (`inst`) — fully initialized for client, with server hook invoked on master.
*   **Error states:** Returns early on client if `TheWorld.ismastersim` is false.

### `MakeTree(id, name, _assets, _prefabs)`
*   **Description:** Wraps `fn` in a `Prefab` constructor, including optional custom assets/prefabs and server-side `master_postinit_tree` hook.
*   **Parameters:**  
    * `id` (number or nil) — passed to `fn`.  
    * `name` (string) — prefab name (e.g., `"quagmire_evergreen_normal"`).  
    * `_assets`, `_prefabs` (tables) — optional asset and prefab dependencies (defaults to `nil`).  
*   **Returns:** `Prefab` object ready for registration and spawning.
*   **Error states:** Returns early on client (client returns unmodified instance from `fn`).

### `MakeStump(name)`
*   **Description:** Specializes `fn` for stump variants and invokes `master_postinit_stump` on master simulation.
*   **Parameters:** `name` (string) — prefab name, e.g., `"quagmire_evergreen_stump"`.
*   **Returns:** `Prefab` object.

## Events & listeners
None — this file does not define event listeners or push events directly. It delegates to server-side hooks in `event_server_data("quagmire", "prefabs/quagmire_evergreen")`.