---
id: quagmire_altar
title: Quagmire Altar
description: A collectible altar entity in the Quagmire DLC that displays a food item and optionally acts as a camera focus target.
tags: [quagmire, collectible, world]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 24dc355f
system_scope: world
---

# Quagmire Altar

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `quagmire_altar` prefab represents an interactive altar used in the Quagmire scenario. It visually displays a food item (via klump-based asset loading) and supports networked synchronization of its displayed food ID and optional camera focus behavior. It integrates with the `focalpoint` system to control camera attention during gameplay.

## Usage example
```lua
local inst = SpawnPrefab("quagmire_altar")
inst.Transform:SetPosition(x, y, z)
inst.foodid:Set(42)
inst.klumpkey:Set("key_42")
inst._camerafocus:Set(true)
```

## Dependencies & tags
**Components used:** `animstate`, `soundemitter`, `transform`, `network`, `focalpoint` (via `TheFocalPoint.components.focalpoint`)
**Tags:** Adds `"quagmire_altar"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodid` | `net_byte` | `0` | Networked byte representing the food item ID shown on the altar. |
| `klumpkey` | `net_string` | `""` | Networked string key used to load dynamic assets for the food item. |
| `_camerafocus` | `net_bool` | `false` | Networked boolean controlling whether the altar becomes a camera focus source. |

## Main functions
### Constructor `fn()`
* **Description:** Initializes the altar entity, sets up visual and networked state, and registers event listeners. On the server, it triggers the `master_postinit` function from the server-specific data module.
* **Parameters:** None (this is the prefab constructor function).
* **Returns:** `inst` — the initialized entity.
* **Error states:** None documented.

## Events & listeners
- **Listens to:** `camerafocusdirty` — triggers `OnCameraFocusDirty` to manage camera focus state.
- **Pushes:** None directly; relies on `keydirty` event for client-side asset loading (not pushed by this prefab itself, but is a named replication event).