---
id: tumbleweedspawner
title: Tumbleweedspawner
description: Spawns and periodically regenerates tumbleweed entities in the world using the ChildSpawner component.
tags: [environment, spawner, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 21976236
system_scope: environment
---

# Tumbleweedspawner

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Tumbleweedspawner` is a prefab definition that creates an entity responsible for spawning and regenerating tumbleweed assets in the game world. It leverages the `childspawner` component to manage the number, timing, and regeneration of child entities ("tumbleweed"). The spawner is configured with randomized parameters from `TUNING` constants and initiates immediate spawning upon creation.

## Usage example
```lua
-- The spawner is typically spawned as part of world generation or event logic:
local spawner = SpawnPrefab("tumbleweedspawner")
-- Once spawned, it automatically begins spawning tumbleweeds via the childspawner component.
-- No additional setup is required by modders at runtime.
```

## Dependencies & tags
**Components used:** `childspawner`  
**Tags:** Adds the `CLASSIFIED` tag (non-standard, likely for internal use).  
**Prefabs referenced:** `"tumbleweed"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `childname` | string | `"tumbleweed"` | Name of the prefab to spawn as children (set on the `childspawner` component). |
| `spawnoffscreen` | boolean | `true` | Indicates whether children can be spawned when offscreen (set on the `childspawner` component). |
| `save_max_children` | boolean | `true` | Whether the maximum number of children should be saved in world save data (set on the `childspawner` component). |
| `maxchildren` | number | Random integer between `TUNING.MIN_TUMBLEWEEDS_PER_SPAWNER` and `TUNING.MAX_TUMBLEWEEDS_PER_SPAWNER` | Maximum number of tumbleweeds this spawner can hold at once (configured via `SetMaxChildren`). |
| `spawnperiod` | number | Random value between `TUNING.MIN_TUMBLEWEED_SPAWN_PERIOD` and `TUNING.MAX_TUMBLEWEED_SPAWN_PERIOD` | Average time (in seconds) between spawns (configured via `SetSpawnPeriod`). |
| `regenperiod` | number | `TUNING.TUMBLEWEED_REGEN_PERIOD` | Time (in seconds) between regeneration cycles (configured via `SetRegenPeriod`). |

## Main functions
### `ReleaseAllChildren()`
*   **Description:** Called internally during initialization to immediately spawn the initial batch of tumbleweeds up to the `maxchildren` limit. Invoked via `inst.components.childspawner:ReleaseAllChildren()`.
*   **Parameters:** None (caller is `childspawner` component, which uses `self.inst` as the target).
*   **Returns:** `nil`.
*   **Error states:** May spawn fewer children than requested if constraints (e.g., world limits or capacity) prevent full spawning.

### `StartSpawning()`
*   **Description:** Begins the periodic spawn cycle. After initialization, it sets the spawner into active mode, scheduling recurring spawn attempts.
*   **Parameters:** None.
*   **Returns:** `nil`.

## Events & listeners
None identified.