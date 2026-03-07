---
id: mooneye
title: Mooneye
description: A collectible map icon prefab that spawns a global map marker when placed on the ground and hides it when held in inventory.
tags: [map, collectible, network]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 38c8c7dd
system_scope: map
---

# Mooneye

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mooneye` prefab represents a set of colour-coded collectible items that synchronize with the global map. When held in an inventory, the map icon is hidden; when dropped on the ground, it automatically spawns a persistent `globalmapicon` to track its location on the map. It uses the `inventoryitem` component to detect holding state and adjusts its map visibility accordingly. The prefab also implements visual effects via animation and beacon tracking.

## Usage example
```lua
-- Example: Spawn a purple Mooneye and place it on the ground
local eye = SpawnPrefab("purplemooneye")
eye.Transform:SetPosition(x, y, z)
TheWorld:PushEvent("ms_spawnentity", eye)

-- The map icon is automatically created and tracked via the onground logic
```

## Dependencies & tags
**Components used:** `inventoryitem`, `tradable`, `inspectable`  
**Tags:** Adds `donotautopick`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `icon` | `globalmapicon` prefab instance or `nil` | `nil` | Reference to the spawned map icon when held on the ground. |
| `scrapbook_anim` | string | `"purplegem_idle"` (varies by colour) | Animation name used in the scrapbook UI. |
| `scrapbook_specialinfo` | string | `"MOONEYE"` | Metadata string for scrapbook categorization. |

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** `onputininventory` — calls `topocket()` to remove the map icon when the item is picked up.
- **Listens to:** `ondropped` — calls `togroup()` to spawn a `globalmapicon` when the item is placed on the ground.
- **Pushes:** None directly; relies on entity lifecycle events (`ms_spawnentity`, etc.) for placement/drop handling.