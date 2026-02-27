---
id: furnituredecortaker
title: Furnituredecortaker
description: Manages the placement, acceptance, and removal of decorative furniture items on entities in the game.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 3df78c6c
---

# Furnituredecortaker

## Overview
This component enables an entity to accept, hold, and manage decorative furniture items—handling placement logic, event callbacks for item removal or pickup, and persistence across save/load cycles. It automatically adds/removes the `"furnituredecortaker"` and `"hasfurnituredecoritem"` tags based on state changes.

## Dependencies & Tags
- **Tags Added/Removed:**
  - `"furnituredecortaker"` — added when the component is enabled; removed when disabled or entity is destroyed.
  - `"hasfurnituredecoritem"` — added when a decor item is placed on the entity; removed when it is taken or removed.
- **Component Dependencies:**
  - Relies on `item.components.furnituredecor` (for `PutOnFurniture` and `TakeOffFurniture` calls).
  - Relies on `item.components.stackable` and `item.components.inventoryitem` for item handling during `AcceptDecor`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `true` | Controls whether the entity is currently accepting new decor items. Set via `SetEnabled()`. |
| `decor_item` | `Entity?` | `nil` | Reference to the currently placed decor item. `nil` if no item is placed. |
| `_on_decor_item_removed` | `function` | (internal) | Callback for `"onremove"` event — clears decor item and triggers `ondecortaken`. |
| `_on_decor_item_picked_up` | `function` | (internal) | Callback for `"onpickup"` event — detaches decor, triggers `ondecortaken`, and re-enables acceptance. |
| `abletoaccepttest` | `function?` | `nil` | Optional callback `(inst, item, giver) -> boolean` to override acceptance logic. |
| `ondecorgiven` | `function?` | `nil` | Optional callback invoked when decor is successfully placed: `(inst, item, giver)`. |
| `ondecortaken` | `function?` | `nil` | Optional callback invoked when decor is removed: `(inst, item)` (note: `item` is `nil` only if removed via `"onremove"`). |

## Main Functions
### `SetEnabled(enabled)`
* **Description:** Enables or disables acceptance of new decor items. Triggers tag updates via the `enabled` property handler.
* **Parameters:**
  - `enabled` (`boolean`) — the new enabled state.

### `AbleToAcceptDecor(item, giver)`
* **Description:** Determines whether the entity can currently accept the given item as decor. Checks item validity, enabled state, and optional custom test callback.
* **Parameters:**
  - `item` (`Entity?`) — the candidate decor item.
  - `giver` (`Entity?`) — the entity giving the item (e.g., a player).
* **Returns:** `boolean` — `true` if the item can be accepted; `false` otherwise.

### `AcceptDecor(item, giver)`
* **Description:** Places the given item onto the entity as a decor item. Removes ownership, sets up event listeners, updates internal state, and invokes `PutOnFurniture`.
* **Parameters:**
  - `item` (`Entity`) — the decor item to place.
  - `giver` (`Entity?`) — the entity giving the item (passed to `ondecorgiven` if defined).
* **Returns:** `true` on success.

### `TakeItem()`
* **Description:** Manually removes the current decor item (if present). Detaches listeners, calls `TakeOffFurniture`, triggers `ondecortaken`, and re-enables acceptance.
* **Parameters:** None.
* **Returns:** `Entity?` — the removed decor item (or `nil` if none existed).

### `OnSave()`
* **Description:** Serializes the current decor item by GUID. Returns save data if an item is present.
* **Parameters:** None.
* **Returns:** `{item_guid = number}?` — save data containing the GUID of the placed item, or `nil`.

### `LoadPostPass(ents, data)`
* **Description:** Restores the decor item after loading by retrieving the entity from `data.item_guid` and calling `AcceptDecor`.
* **Parameters:**
  - `ents` (`table`) — map of GUID → entity data (from save).
  - `data` (`table?`) — save data previously returned by `OnSave`.

### `GetDebugString()`
* **Description:** Returns a debug string summarizing the current acceptance status.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Can Take: True"` or `"Can Take: False"`.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from the entity. Removes the `"furnituredecortaker"` tag.
* **Parameters:** None.

## Events & Listeners
- **Listens for Events (on the `decor_item` entity):**
  - `"onremove"` — triggers `_on_decor_item_removed`.
  - `"onpickup"` — triggers `_on_decor_item_picked_up`.
- **Triggers Events (on `self.inst`):**
  - None (this component does not push events directly; it invokes optional callback functions like `ondecorgiven`, `ondecortaken`).