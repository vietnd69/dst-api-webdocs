---
id: cave_fern_withered
title: Cave Fern Withered
description: A withered cave fern prefab that can be harvested for cutgrass and spoils into spoiled_food after 10 seconds.
tags: [environment, harvest, decay, collectible]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 591bf505
system_scope: environment
---

# Cave Fern Withered

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cave_fern_withered` is a decorative and harvestable environment prefab found in the Caves. It represents a withered version of the standard cave fern, using the same base assets but with distinct animation variation and harvest behavior. It is harvested using the `pickable` component, yielding `cutgrass`, and spoils into `spoiled_food` after a fixed regeneration delay of 10 seconds. The prefab supports save/load via custom `OnSave` and `OnLoad` callbacks to preserve the currently playing animation state.

## Usage example
```lua
local inst = SpawnPrefab("cave_fern_withered")
inst.Transform:SetPosition(x, y, z)
inst.components.pickable:SetUp("cutgrass", 10)  -- optional, already configured
```

## Dependencies & tags
**Components used:** `inspectable`, `pickable`, `burnable`, `propagator`, `hauntable`
**Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | one of `names` array | The name of the animation currently playing (e.g., `"f3"`) — selected randomly at spawn. |
| `scrapbook_anim` | string | `"f1"` | Animation name used for scrapbook/encyclopedia representation. |
| `picksound` | string | `"dontstarve/wilson/pickup_plants"` | Sound played on harvest. Set in constructor. |
| `remove_when_picked` | boolean | `true` | If true, the entity is removed after harvesting. Set in constructor. |
| `quickpick` | boolean | `true` | If true, allows quick-pick behavior (e.g., skipping idle animation). Set in constructor. |

## Main functions
### `onsave(inst, data)`
*   **Description:** Callback triggered during world save to serialize the current animation state.
*   **Parameters:**  
    `inst` (Entity) — the entity instance.  
    `data` (table) — table to populate with serializable data.  
*   **Returns:** Nothing.
*   **Error states:** None; writes `inst.animname` to `data.anim` if defined.

### `onload(inst, data)`
*   **Description:** Callback triggered during world load to restore the animation state.
*   **Parameters:**  
    `inst` (Entity) — the entity instance.  
    `data` (table) — table containing previously saved state.  
*   **Returns:** Nothing.
*   **Error states:** If `data.anim` is missing or `nil`, no animation change occurs.

## Events & listeners
None identified.

