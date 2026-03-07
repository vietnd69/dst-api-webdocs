---
id: furnituredecortaker
title: Furnituredecortaker
description: Manages the attachment and detachment of decorative items to furniture entities in the game.
tags: [inventory, decoration, furniture, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 3df78c6c
system_scope: entity
---

# Furnituredecortaker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FurnitureDecorTaker` handles the logic for accepting, attaching, and removing decorative items placed on furniture entities (e.g., lamps on desks). It ensures proper tag management (`furnituredecortaker`, `hasfurnituredecoritem`) and coordinates with `furnituredecor` and `inventoryitem` components to manage item ownership and placement state. The component supports event callbacks, save/load persistence, and network synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("furnituredecortaker")

-- Optional: Set custom acceptance logic and callbacks
inst.components.furnituredecortaker.abletoaccepttest = function(inst, item, giver) return item:HasTag("lamp") end
inst.components.furnituredecortaker.ondecorgiven = function(inst, item, giver) print("Decoration placed!") end
inst.components.furnituredecortaker.ondecortaken = function(inst, item) print("Decoration removed!") end

-- Accept a decorative item
inst.components.furnituredecortaker:AcceptDecor(lamp_entity, player_entity)
```

## Dependencies & tags
**Components used:** `furnituredecor`, `inventoryitem`, `stackable`  
**Tags:** Adds `furnituredecortaker` when the component is active; adds `hasfurnituredecoritem` when a decoration is present.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `true` | Whether the entity can accept new decorative items. |
| `decor_item` | Entity or `nil` | `nil` | The current decorative item attached to this entity, or `nil` if none. |
| `abletoaccepttest` | Function or `nil` | `nil` | Optional callback: `(inst, item, giver)` → boolean to override acceptance logic. |
| `ondecorgiven` | Function or `nil` | `nil` | Optional callback: `(inst, item, giver)` fired when an item is placed. |
| `ondecortaken` | Function or `nil` | `nil` | Optional callback: `(inst, item)` fired when an item is removed or taken. |

## Main functions
### `SetEnabled(enabled)`
* **Description:** Enables or disables acceptance of new decorative items. Automatically manages the `furnituredecortaker` tag.
* **Parameters:** `enabled` (boolean) — whether to allow accepting decorations.
* **Returns:** Nothing.

### `AbleToAcceptDecor(item, giver)`
* **Description:** Checks if the entity can currently accept the given decorative item. Honors the `enabled` state and optional `abletoaccepttest` callback.
* **Parameters:**  
  - `item` (Entity) — the proposed decorative item.  
  - `giver` (Entity) — the entity giving/placing the item (may be `nil`).  
* **Returns:** `true` if the item can be accepted, otherwise `false`.
* **Error states:** Returns `false` if `item` is `nil` or `enabled` is `false`.

### `AcceptDecor(item, giver)`
* **Description:** Accepts and attaches a decorative item. Removes the item from its previous owner, sets up callbacks for removal/pickup events, and notifies connected systems via `furnituredecor:PutOnFurniture`.
* **Parameters:**  
  - `item` (Entity) — the decorative item to attach.  
  - `giver` (Entity) — the entity providing the item (may be `nil`).  
* **Returns:** `true`.
* **Error states:** Returns early (no action) if `AbleToAcceptDecor` would return `false`. Handles stackable items by converting to their base unit if necessary.

### `TakeItem()`
* **Description:** Removes the current decorative item, restores the entity to an `enabled` state, cleans up event listeners, and notifies connected systems via `furnituredecor:TakeOffFurniture`.
* **Parameters:** None.
* **Returns:** The removed decorative item (Entity), or `nil` if no item was attached.

### `OnSave()`
* **Description:** Serializes the GUID of the attached decorative item for saving to disk.
* **Parameters:** None.
* **Returns:** `{item_guid = GUID}`, or `nil` if no decorative item is attached.

### `LoadPostPass(ents, data)`
* **Description:** Reattaches a previously saved decorative item after world load, by retrieving the entity from `ents` using the stored GUID.
* **Parameters:**  
  - `ents` (table) — mapping of GUIDs to entity data.  
  - `data` (table) — must contain `item_guid`.  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging UI (e.g., in entity inspection tools).
* **Parameters:** None.
* **Returns:** `"Can Take: True"` or `"Can Take: False"` based on `enabled`.

## Events & listeners
- **Listens to:**  
  - `onremove` (on `decor_item`) — triggers `_on_decor_item_removed` when the item is destroyed.  
  - `onpickup` (on `decor_item`) — triggers `_on_decor_item_picked_up` when the item is picked up.  
- **Pushes:**  
  - None directly. Callbacks (`ondecorgiven`, `ondecortaken`) are invoked as side effects of `AcceptDecor` and `TakeItem`.
