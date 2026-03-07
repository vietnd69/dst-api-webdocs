---
id: atrium_key
title: Atrium Key
description: A unique, non-potable item that reveals the location of the Atrium on the map when held by the player.
tags: [inventory, map, unique, key]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b342cf13
system_scope: inventory
---

# Atrium Key

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `atrium_key` prefab is a unique item that enables map reveal functionality for the Atrium area. When held (or placed in the inventory of the grand owner), it stops its associated icon's map revealing and hides it from the map; when dropped or lost by the owner, it resumes map revealing. It uses a secondary `atrium_key_icon` entity to render the map icon and integrates with the `maprevealable`, `inventoryitem`, and `container` components to track ownership and manage map state.

## Usage example
```lua
-- Example: Attaching the atrium_key to a player and checking its reveal behavior
local key = SpawnPrefab("atrium_key")
player.components.inventory:GiveItem(key)
-- The key now stops revealing the map (icon hidden)
-- If dropped:
key.components.inventoryitem:Drop()
-- The key resumes map revealing (icon appears)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `tradable`, `maprevealable`, `container` (via event callbacks)  
**Tags:** Adds `irreplaceable`, `nonpotatable`, and `CLASSIFIED` (to icon entity only)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_owner` | `Entity` or `nil` | `nil` | The grand owner of the key (after `GetGrandOwner` resolution). Used to reparent the icon entity. |
| `_container` | `Entity` or `nil` | `nil` | The container (e.g., inventory) the key is stored in. Used to listen for inventory-related events. |
| `icon` | `Entity` | Created via `SpawnPrefab("atrium_key_icon")` | Icon entity responsible for map rendering and reveal functionality. |

## Main functions
### `storeincontainer(inst, container)`
* **Description:** Registers event callbacks on the container to track when the key is put in, dropped from, or removed from it, and stores a reference to the container.
* **Parameters:**  
  - `container` (`Entity?`) — the container entity, must have a `container` component.  
* **Returns:** Nothing.
* **Error states:** No-op if `container` is `nil` or lacks the `container` component.

### `unstore(inst)`
* **Description:** Removes all event listeners previously added by `storeincontainer` and clears the `_container` reference.
* **Parameters:** None.
* **Returns:** Nothing.

### `topocket(inst, owner)`
* **Description:** Switches the key to "pocketed" state — stops map revealing, reparents the icon to the grand owner's entity, and sets the map restriction to `"nightmaretracker"`. Ensures the key’s `icon.entity` follows the player when held.
* **Parameters:**  
  - `owner` (`Entity`) — the new owner or container entity. If it has `inventoryitem`, its grand owner is used.  
* **Returns:** Nothing.

### `toground(inst)`
* **Description:** Switches the key to "dropped" state — resumes map revealing, resets map restriction, and reparents the icon back to the key entity itself.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnRemoveEntity(inst)`
* **Description:** Cleans up the icon entity when the key is removed from the world.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"onputininventory"` (on `icon`) → triggers `topocket(inst, ...)`
  - `"ondropped"` (on `icon`) → triggers `toground(inst)`
  - `"onputininventory"` (on container) → triggers `inst._oncontainerownerchanged`
  - `"ondropped"` (on container) → triggers `inst._oncontainerownerchanged`
  - `"onremove"` (on container) → triggers `inst._oncontainerremoved`
- **Pushes:** None.
