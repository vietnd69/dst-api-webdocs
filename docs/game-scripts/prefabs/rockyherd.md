---
id: rockyherd
title: Rockyherd
description: Manages the herd system for spawning and maintaining groups of Rocky entities in the world, including seasonal spawning behavior and member population limits.
tags: [herd, spawner, season, group, entity]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d31b2dad
system_scope: world
---

# Rockyherd

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rockyherd` is a prefab container that acts as a herd spawner for Rocky entities. It maintains an instance of the `herd` component to track active Rocky members (with a maximum of 6) and uses the `periodicspawner` component to automatically spawn new Rockies at intervals, adjusted for season. It listens for seasonal changes to dynamically update spawn timing and enforces spawning rules such as maximum density within range and offscreen-only spawning.

## Usage example
```lua
-- Spawning a new Rocky herd instance (typically done internally by the world generation system)
local herd = Prefab("rockyherd", fn, nil, prefabs)()
-- The prefab is not meant for manual instantiation by modders; it's used as a world entity.
```

## Dependencies & tags
**Components used:** `herd`, `periodicspawner`, `scaler`
**Tags:** Adds `herd`, `NOBLOCK`, `NOCLICK`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gatherrange` | number | `TUNING.ROCKYHERD_RANGE` | Radius around the herd centroid where Rockies may gather/spawn. |
| `maxsize` | number | `6` | Maximum number of Rocky members allowed in this herd. |
| `membertag` | string | `"rocky"` | Tag used to identify eligible member entities for this herd. |

## Main functions
### `CanSpawn()`
* **Description:** Determines whether a new Rocky should be spawned based on current herd state and world constraints. Called by `periodicspawner` before each potential spawn.
* **Parameters:** None (accesses `inst.components.herd` and global tuning values).
* **Returns:** `true` if spawning is allowed; `false` otherwise.
* **Error states:** Returns `false` if the herd is full or if the number of existing Rockies in range meets or exceeds `TUNING.ROCKYHERD_MAX_IN_RANGE`.

### `OnSpawned(newent)`
* **Description:** Handler called when a new Rocky entity is spawned. Adds the entity to the herd and initializes its scale.
* **Parameters:** `newent` (entity instance) - the newly spawned Rocky entity.
* **Returns:** Nothing.
* **Error states:** No effect if `inst.components.herd` is `nil`.

### `SeasonalSpawningChanges(season)`
* **Description:** Adjusts the spawner timing based on the current season. spring increases spawn rate (via `SpringGrowthMod`).
* **Parameters:** `season` (string) – one of the `SEASONS.*` constants (e.g., `"SPRING"`, `"SUMMER"`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `season` (via `WatchWorldState`) – triggers `SeasonalSpawningChanges` when the world season changes.
- **Pushes:** None.