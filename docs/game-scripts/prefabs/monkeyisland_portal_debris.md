---
id: monkeyisland_portal_debris
title: Monkeyisland Portal Debris
description: A destructible environmental prop from the Monkey Island scenario that yields randomized salvage loot when hammered and spawns particle effects upon destruction.
tags: [destructible, loot, environment, scenario]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a8f384c0
system_scope: environment
---

# Monkeyisland Portal Debris

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`monkeyisland_portal_debris` is a decorative, interactive prop used in the Monkey Island scenario. It represents scattered debris near a portal structure and can be hammered to obtain salvageable components (e.g., `wagpunk_bits`, `gears`, `trinket_6`). It uses the `workable` component to define hammer interactions and the `lootdropper` component to manage loot generation based on a shared loot table. The debris has multiple visual variants (IDs `1`–`3`) selected at spawn time for variety.

## Usage example
```lua
-- Example of spawning a debris instance programmatically (e.g., in a room generator)
local debris = SpawnPrefab("monkeyisland_portal_debris")
debris.Transform:SetPos(x, y, z)
```

## Dependencies & tags
**Components used:** `inspectable`, `lootdropper`, `workable`, `animstate`, `transform`, `soundemitter`, `network`  
**Tags:** None added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `debris_id` | string or nil | `nil` | ID used to select the visual variant (`"1"`, `"2"`, or `"3"`); set on initialization and saved/loaded for persistence. |

## Main functions
### `setdebristype(inst, index)`
*   **Description:** Assigns a visual debris variant by selecting an `idle` animation matching `debris_id`. If `index` is `nil`, picks a random ID (`1`–`3`). Prevents resetting if the current `debris_id` matches the requested `index`.
*   **Parameters:**  
    `inst` (Entity) – the debris entity instance.  
    `index` (string or number or nil) – the desired debris ID; if `nil`, a random ID is used.
*   **Returns:** Nothing.

### `OnHammered(inst, worker)`
*   **Description:** Called when the `workable` component finishes work (i.e., the debris is fully destroyed). Drops loot via `lootdropper`, spawns a `collapse_small` FX entity, and removes the debris entity.
*   **Parameters:**  
    `inst` (Entity) – the debris entity being destroyed.  
    `worker` (Entity) – the entity performing the hammering.
*   **Returns:** Nothing.

### `OnHit(inst, worker)`
*   **Description:** Triggered on each hammer hit. Plays a temporary `"hitX"` animation, followed by `"idleX"` to return to the resting state.
*   **Parameters:**  
    `inst` (Entity) – the debris entity being hit.  
    `worker` (Entity) – the entity performing the hammering.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (state persistence is handled via `inst.OnSave` and `inst.OnLoad` hooks, not events).  
- **Pushes:** None.