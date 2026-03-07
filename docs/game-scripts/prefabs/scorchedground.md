---
id: scorchedground
title: Scorchedground
description: Creates a background decorative ground effect with randomized animation and rotation for environmental immersion.
tags: [environment, decoration, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b2814ac
system_scope: environment
---

# Scorchedground

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`scorchedground` is a static, background-decorative prefab that renders a visually randomized scorched-ground tile. It uses a random animation frame and rotation upon spawn, and supports save/load persistence for network synchronization. It is non-interactive (tagged `NOCLICK`), non-collidable, and intended solely for visual enhancement in the game world.

## Usage example
```lua
-- The prefab is typically instantiated automatically by world generation systems.
-- Example manual instantiation (not typical in mod code):
local inst = SpawnPrefab("scorchedground")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `NOCLICK` and `FX` to the instance.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim` | string | Randomly selected from `"idle"`, `"idle2"`, ... `"idle10"` | Stores the currently playing animation name; used for save/load persistence. |

## Main functions
This prefab defines no custom public methods beyond lifecycle hooks (`OnSave`, `OnLoad`), which are assigned directly to the instance.

### `OnSave(inst, data)`
*   **Description:** Callback used during world save to persist runtime state.
*   **Parameters:**  
    `inst` (Entity) – the scorched ground instance.  
    `data` (table) – the save data table to populate.
*   **Returns:** Nothing.
*   **Error states:** Only stores `anim` and `rotation`; commented-out code indicates scale was previously considered but disabled.

### `OnLoad(inst, data)`
*   **Description:** Callback used during world load to restore saved state.
*   **Parameters:**  
    `inst` (Entity) – the scorched ground instance.  
    `data` (table) – the loaded save data table.
*   **Returns:** Nothing.
*   **Error states:** If `data` is `nil`, returns early. If `data.anim` is missing, animation is not restored. Scale restoration is disabled.

## Events & listeners
None identified