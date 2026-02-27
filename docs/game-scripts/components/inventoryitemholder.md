---
id: inventoryitemholder
title: Inventoryitemholder
description: A component that allows an entity to hold a single non-perishable item, enabling give/take interactions with flexible stacking support.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: ad6aa8b6
---

# Inventoryitemholder

## Overview
The `InventoryItemHolder` component enables an entity (typically a structure) to hold exactly one item at a time. The held item is non-perishable and inaccessible to entities (`outofreach` state) while stored. It supports optional stacking (via `acceptstacks`), tag-based item restrictions, and custom callbacks for item give/take actions. The item is automatically released when the holder entity is removed.

## Dependencies & Tags
**Tags added/removed dynamically:**
- `inventoryitemholder_give`: Added when the holder accepts giving items (either empty or stackable and not full).
- `inventoryitemholder_take`: Added when an item is currently held.
  
**Component interactions:**
- Relies on `inventoryitem`, `stackable`, and `inventory` components of held or interacting entities.
- Registers event callbacks for `onremove`, `ondropped`, and `onputininventory` on the held item to handle loss scenarios.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to. |
| `item` | `Entity?` | `nil` | The currently held item; `nil` if empty. |
| `allowed_tags` | `table<string>?` | `nil` | Optional list of tags the held item must possess. If `nil`, no restrictions. |
| `acceptstacks` | `boolean` | `false` | Whether stacking is allowed (item can be added to an existing stack). |
| `onitemgivenfn` | `function?` | `nil` | Callback invoked after an item is given: `(holder, item, giver)`. |
| `onitemtakenfn` | `function?` | `nil` | Callback invoked after an item is taken: `(holder, item, taker, wholestack_taken)`. |
| `_onitemremoved` | `function` | — | Internal callback for when the holder is destroyed (sets `item = nil`). |
| `_onitemmissing` | `function` | — | Internal callback triggered if the held item is moved away unexpectedly (e.g., dropped). |

## Main Functions
### `SetAllowedTags(tags)`
* **Description:** Sets the list of allowed item tags. Only items with at least one matching tag can be held.
* **Parameters:**  
  `tags` (`table<string>?`) — Array of tag strings or `nil` for no restrictions.

### `SetOnItemGivenFn(fn)`
* **Description:** Registers a callback invoked after successfully giving an item to this holder.
* **Parameters:**  
  `fn` (`function?`) — Function with signature `(holder, item, giver)`.

### `SetOnItemTakenFn(fn)`
* **Description:** Registers a callback invoked after successfully taking an item from this holder.
* **Parameters:**  
  `fn` (`function?`) — Function with signature `(holder, item, taker, wholestack_taken)`.

### `SetAcceptStacks(bool)`
* **Description:** Enables or disables stacking behavior. When enabled, new items of the same prefab/skin can be added to the existing stack.
* **Parameters:**  
  `bool` (`boolean`) — Whether to allow stacking.

### `IsHolding()`
* **Description:** Checks if an item is currently held.
* **Parameters:** —  
* **Returns:** `boolean` — `true` if `self.item` is non-nil and valid.

### `CanGive(item, giver)`
* **Description:** Determines if the holder can accept the given item.
* **Parameters:**  
  `item` (`Entity`) — The item being given.  
  `giver` (`Entity?`) — The entity attempting to give the item (used for inventory access).  
* **Returns:** `boolean` — `true` if the item meets tag restrictions and stacking rules.

### `CanTake(taker)`
* **Description:** Determines if an item can currently be taken.
* **Parameters:**  
  `taker` (`Entity?`) — The entity attempting to take the item (not used in logic).  
* **Returns:** `boolean` — `true` if an item is currently held and valid.

### `GiveItem(item, giver)`
* **Description:** Attempts to give the item to this holder. Handles stacking, entity hierarchy, and internal state updates. May return a partially stacked item to the giver.
* **Parameters:**  
  `item` (`Entity`) — The item to give.  
  `giver` (`Entity?`) — The entity giving the item (may be a container or inventory holder).  
* **Returns:** `boolean` — `true` if the operation succeeded.

### `TakeItem(taker, wholestack)`
* **Description:** Takes the held item and gives it to the taker (or drops it if no taker is provided). Supports partial stack taking when `wholestack=false`.
* **Parameters:**  
  `taker` (`Entity?`) — The entity receiving the item.  
  `wholestack` (`boolean?`) — Whether to take the full stack (`true` by default).  
* **Returns:** `boolean` — `true` if the operation succeeded.

### `OnSave()`
* **Description:** Serializes the held item for saving. Only saves if the item persists.
* **Parameters:** —  
* **Returns:**  
  `data` (`table?`) — Save data containing the item record.  
  `references` (`table?`) — Entity references needed for saving.

### `OnLoad(data, newents)`
* **Description:** Restores the held item from save data after world load.
* **Parameters:**  
  `data` (`table`) — Save data containing item record.  
  `newents` (`table`) — Map of restored entity IDs.

### `OnRemoveFromEntity()`
* **Description:** Releases the held item when the holder is removed, dropping it or giving it to a container if needed.
* **Parameters:** —  
* **Returns:** —

### `GetDebugString()`
* **Description:** Returns a formatted debug string for inspection (item info and allowed tags).
* **Parameters:** —  
* **Returns:** `string` — Debug info.

## Events & Listeners
- **Listens to:**
  - `onremove` (on held item): Triggers `_onitemremoved`, sets `item = nil`.
  - `ondropped` (on held item): Triggers `_onitemmissing` if item moves unexpectedly.
  - `onputininventory` (on held item): Triggers `_onitemmissing` if item is placed in another inventory.
  
- **Pushes no custom events** — only manipulates dynamic tags (`inventoryitemholder_give`, `inventoryitemholder_take`).