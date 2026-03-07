---
id: retrofit_archiveteleporter
title: Retrofit Archiveteleporter
description: A utility prefab used to generate and link a pair of teleporter wormholes in the Blue Forest region or at a specified location, replacing an existing marker entity.
tags: [teleportation, worldgen, utility]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ad43e6da
system_scope: world
---

# Retrofit Archiveteleporter

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`retrofit_archiveteleporter` is a non-interactive utility prefab designed solely to create and link two wormhole teleporters during world generation or modded setup. It acts as a one-time setup tool: when spawned and its `DoRetrofitting()` method is invoked, it places two wormholes, pairs them via their `teleporter` components, disables sanity drain for both, and then removes itself. It does not behave like a gameplay entity and has no active logic beyond initialization.

## Usage example
```lua
-- Spawn the retrofit marker (typically during worldgen)
local marker = SpawnPrefab("retrofit_archiveteleporter")

-- Optional: perform retrofitting at a random Blue Forest site
local success = marker:DoRetrofitting()

-- Or: perform retrofitting at a specific point
local success = marker:DoRetrofitting(Vector3(100, 0, -200))
```

## Dependencies & tags
**Components used:** `teleporter` (accessed via spawned wormholes' components)
**Tags:** Adds `CLASSIFIED`, `NOCLICK`, `NOBLOCK` to itself. Does not add or modify tags on spawned wormholes.

## Properties
No public properties. The component entity itself does not expose any writable or observable state beyond its transient method.

## Main functions
### `DoRetrofitting(force_pt)`
*   **Description:** Locates a suitable site in the Blue Forest (if `force_pt` is `nil`) or uses the given position (`force_pt`) to spawn and link a pair of wormholes. Removes the marker entity upon success.
*   **Parameters:** 
    *   `force_pt` (optional Vector3) — If provided, the exact world position for one wormhole. If `nil`, searches for an empty location in Blue Forest map nodes.
*   **Returns:** `true` if both wormholes were successfully spawned and linked; `false` otherwise.
*   **Error states:** Returns `false` if no valid spawn point could be found or if any wormhole fails to spawn.

## Events & listeners
None identified.

## Prefab definition details
- **Prefab name:** `retrofit_archiveteleporter`
- **Constructor function:** `fn()`
- **Dependencies:** Requires the `"wormhole"` prefab (declared in `prefabs` list).
- **Entity behavior:** 
    - Non-networked (pristine entity).
    - No behavior on the client (`if not TheWorld.ismastersim then return inst end`).
    - Only the master simulation instance exposes `DoRetrofitting` as a method.