---
id: inv_rocks
title: Inv Rocks
description: Represents a collectible stackable rock item usable as bait, repair material, and edible food in DST.
tags: [inventory, bait, repair, food]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: da1a3557
system_scope: inventory
---

# Inv Rocks

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`inv_rocks` defines the `rocks` prefab — a common, stackable item found in the game world that serves multiple gameplay purposes: as bait for moles, as a repair material for stone-based structures, as minimal food for certain creatures, and as tribute for the Quagmire game mode. It uses an entity-component architecture to integrate with DST’s core systems including inventory, tradability, and state persistence.

## Usage example
```lua
local rocks = SpawnPrefab("rocks")
rocks.Transform:SetPosition(x, y, z)
rocks:AddTag("dropped")
```

## Dependencies & tags
**Components used:** `edible`, `inventoryitem`, `repairer`, `stackable`, `tradable`, `inspectable`, `bait`, `snowmandecor`  
**Tags:** Adds `molebait`, `quakedebris`, `rocks`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animname` | string | `"f1"` | Current animation name (`"f1"`, `"f2"`, or `"f3"`), randomly assigned on the master. |
| `pickupsound` | string | `"rock"` | Sound label played when the item is picked up. |

## Main functions
### `onsave(inst, data)`
*   **Description:** Saves the current animation name to the save data to preserve visual variation across sessions.
*   **Parameters:**  
    * `inst` (Entity) — the rocks instance.  
    * `data` (table) — the save data table to populate.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `onload(inst, data)`
*   **Description:** Restores the animation name from save data and replays the animation on load.
*   **Parameters:**  
    * `inst` (Entity) — the rocks instance.  
    * `data` (table) — the loaded save data.  
*   **Returns:** Nothing.  
*   **Error states:** If `data` or `data.anim` is missing, no animation change occurs.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.  
- **Save hooks:** Assigns `inst.OnSave = onsave` and `inst.OnLoad = onload` for persistence.