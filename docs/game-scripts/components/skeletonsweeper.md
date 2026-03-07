---
id: skeletonsweeper
title: Skeletonsweeper
description: Manages a cap on the number of active skeletons in the world by removing the oldest skeletons when the limit is exceeded.
tags: [skeleton, entity, world, cleanup, limit]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 52d704d6
system_scope: world
---

# Skeletonsweeper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Skeletonsweeper` is a server-only component that monitors and limits the number of active skeleton entities in the world. It listens for skeleton spawn events, maintains an ordered list of skeletons by spawn time (newest first), and automatically removes the oldest skeletons when the count exceeds the configured maximum (`TUNING.MAX_PLAYER_SKELETONS` by default). It supports dynamic enabling/disabling and optional skipping of decay (i.e., immediate removal vs. calling `Decay()`).

## Usage example
```lua
-- Typical usage: component is added automatically to the world entity
-- and activated on server startup.
-- Manual interaction is rare, but possible:
local world = TheWorld
if world.components.skeletonsweeper then
    world.components.skeletonsweeper:Sweep(5) -- limit to 5 skeletons
    world:PushEvent("ms_enableskeletonsweeper", { enable = false }) -- temporarily disable
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `Sweep(max_to_keep, no_decay)`
*   **Description:** Enforces the skeleton count limit by removing the oldest skeletons until the count is ≤ `max_to_keep`. Oldest skeletons are defined as those with the smallest `skeletonspawntime`.
*   **Parameters:**
    *   `max_to_keep` (number, optional): Maximum number of skeletons to retain. Defaults to `TUNING.MAX_PLAYER_SKELETONS`.
    *   `no_decay` (boolean, optional): If `true`, removed skeletons are removed directly via `:Remove()` instead of calling `:Decay()`. Used during initialization to avoid transient decay animations.
*   **Returns:** Nothing.
*   **Error states:** Early return with no effect if `_enabled` is `false`.

### `OnPostInit()`
*   **Description:** Final initialization step triggered after prefab post-init. Disables `_nosweep` so future skeleton spawns can trigger sweeps, and performs an initial sweep if enabled.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `ms_skeletonspawn` – triggered when a skeleton is spawned; registers the skeleton, sets up a removal listener, and initiates a sweep if enabled and `_nosweep` is false.  
  `ms_enableskeletonsweeper` – enables/disables the sweeper; triggers a sweep if newly enabled and `_nosweep` is false.
- **Pushes:** None identified
