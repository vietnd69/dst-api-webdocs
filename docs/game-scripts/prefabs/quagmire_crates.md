---
id: quagmire_crates
title: Quagmire Crates
description: Factory function for generating Quagmire crate prefabs, supporting both empty crates and pre-filled kits (e.g., oven, grill).
tags: [world, structure, crafting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a31d961e
system_scope: world
---

# Quagmire Crates

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_crates` is a prefab factory script that generates multiple Quagmire crate variants. It defines a base crate structure (with transform, animstate, network, and physics components) and configures it to represent either an empty crate or a crate containing specific cooking station kits (e.g., `pot_hanger`, `oven`, `grill_small`, `grill`). The crate prefab supports dynamic naming and is tagged for bundle/unwrappable behavior. Client-side and master-side initialization paths diverge, with the latter triggering a server-side `master_postinit` hook.

## Usage example
```lua
-- Standard prefab loading is handled automatically by DST.
-- This script registers prefabs like "quagmire_crate", "quagmire_crate_oven", etc.
-- To spawn one in code:
local crate = SpawnPrefab("quagmire_crate_oven")
crate.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `bundle` and `unwrappable` to the crate entity.

## Properties
No public properties

## Main functions
### `MakeCrate(kit)`
*   **Description:** Creates and returns a Prefab definition for a Quagmire crate. If `kit` is `nil`, it produces an empty crate; otherwise, it produces a crate containing items for the specified cooking kit.
*   **Parameters:** `kit` (string or `nil`) — the kit type (e.g., `"oven"`), or `nil` for an empty crate.
*   **Returns:** `Prefab` — the created prefab definition.
*   **Error states:** No explicit error handling; expects valid `kit` names from `KIT_NAMES` if provided.

## Events & listeners
- **Pushes:** `master_postinit` — dispatched to `event_server_data("quagmire", ...).master_postinit(...)` on the master simulation for initialization after prefab spawn.
