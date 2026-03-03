---
id: inventoryitemholder
title: Inventoryitemholder
description: Holds a single item for indirect interaction, allowing other entities to take or stack items under controlled conditions.
tags: [inventory, holder, interaction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ad6aa8b6
system_scope: inventory
---

# Inventoryitemholder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `InventoryItemHolder` component enables an entity to temporarily hold an item in an intermediate state—neither fully owned nor fully on the ground. It supports item stacking, tag-based restrictions, and custom callbacks for give/take actions. The held item is hidden from the scene, marked with the `outofreach` tag, and is automatically dropped if the holder is destroyed or the item is removed unexpectedly. It is typically used for structures or characters that mediate item exchange (e.g., crafting benches, item slots, NPC trade points). Note: perishable items are not officially supported.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitemholder")
inst:AddTag("inventoryitemholder_give")

-- Configure tag restrictions
inst.components.inventoryitemholder:SetAllowedTags({"weapon", "tool"})

-- Set callbacks
inst.components.inventoryitemholder:SetOnItemGivenFn(function(holder, item, giver)
    print(giver .. " gave " .. item .. " to holder")
end)

-- Attempt to give an item
if inst.components.inventoryitemholder:CanGive(item, giver) then
    inst.components.inventoryitemholder:GiveItem(item, giver)
end

-- Take item
inst.components.inventoryitemholder:TakeItem(player, true)
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`, `stackable`  
**Tags added/removed:** `inventoryitemholder_take`, `inventoryitemholder_give`, `outofreach`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `item` | `GameObject` or `nil` | `nil` | The item currently held. |
| `allowed_tags` | `table` or `nil` | `nil` | List of allowed item tags; `nil` means no restrictions. |
| `acceptstacks` | boolean | `false` | Whether the holder can accept stacked items (partial stacks). |
| `onitemgivenfn` | function or `nil` | `nil` | Callback fired after an item is given. Signature: `(holder, item, giver)`. |
| `onitemtakenfn` | function or `nil` | `nil` | Callback fired after an item is taken. Signature: `(holder, item, taker, was_full_remove)`. |

## Main functions
### `SetAllowedTags(tags)`
*   **Description:** Sets the list of item tags allowed to be held. Set to `nil` to disable restrictions.
*   **Parameters:** `tags` (table or `nil`) — array of tag strings, e.g., `{"tool", "weapon"}`.
*   **Returns:** Nothing.

### `SetOnItemGivenFn(fn)`
*   **Description:** Assigns a callback to run after an item is successfully given. The callback may receive `nil` for `item` if the item was fully stacked onto an existing item.
*   **Parameters:** `fn` (function or `nil`) — callback function.
*   **Returns:** Nothing.

### `SetOnItemTakenFn(fn)`
*   **Description:** Assigns a callback to run after an item is successfully taken. The `item` argument may be invalid (removed) if it was partially taken via stacking.
*   **Parameters:** `fn` (function or `nil`) — callback function.
*   **Returns:** Nothing.

### `SetAcceptStacks(bool)`
*   **Description:** Enables or disables stacking with the held item. When enabled and the item is stackable and not full, new matching items will stack instead of replacing.
*   **Parameters:** `bool` (boolean) — `true` to enable stacking.
*   **Returns:** Nothing.

### `IsHolding()`
*   **Description:** Indicates whether an item is currently held.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `self.item` is non-`nil`, otherwise `false`.

### `CanGive(item, giver)`
*   **Description:** Checks if the given item can be accepted by this holder, respecting tag restrictions and stacking rules.
*   **Parameters:**  
    `item` (GameObject) — the item being offered.  
    `giver` (GameObject) — the entity attempting to give the item (unused in current logic, but kept for API compatibility).  
*   **Returns:** `boolean` — `true` if the item can be given (no holder or stackable and matching), otherwise `false`.
*   **Error states:** Returns `false` if `item` lacks the `inventoryitem` component.

### `CanTake(taker)`
*   **Description:** Checks if an item can be taken by the specified taker.
*   **Parameters:** `taker` (GameObject) — the entity attempting to take the item (not used in validation beyond existence).
*   **Returns:** `boolean` — `true` if an item is currently held and valid.

### `GiveItem(item, giver)`
*   **Description:** Adds the given item to the holder, replacing the current item or stacking onto it if allowed.
*   **Parameters:**  
    `item` (GameObject) — the item to give.  
    `giver` (GameObject) — the entity giving the item; used to retrieve owner inventory.  
*   **Returns:** `boolean` — `true` if successful, `false` otherwise.
*   **Error states:** Returns `false` if the item fails `CanGive` or if the owner’s inventory is a container (giving from containers is disallowed). May return `true` even if `item` becomes `nil` (fully stacked).

### `TakeItem(taker, wholestack)`
*   **Description:** Removes the held item and delivers it to the taker (or drops it). If `wholestack` is `false` and the item is stackable, a partial stack may be taken.
*   **Parameters:**  
    `taker` (GameObject or `nil`) — entity receiving the item. If `nil`, item is dropped.  
    `wholestack` (boolean or `nil`) — whether to take the entire stack. Defaults to `true`.  
*   **Returns:** `boolean` — `true` if successful, `false` if `CanTake` fails.
*   **Error states:** The `item` passed to callbacks may be invalid if partially removed.

### `OnSave()`
*   **Description:** Serializes the held item for saving.
*   **Parameters:** None.
*   **Returns:**  
    `data` (table or `nil`) — contains `item` field with save record.  
    `references` (table or `nil`) — entity references required for deserialization.

### `OnLoad(data, newents)`
*   **Description:** Loads a previously saved item. Automatically calls `GiveItem` to restore the state.
*   **Parameters:**  
    `data` (table) — save data with `item` field.  
    `newents` (table) — mapping of entity GUIDs to loaded entities.  
*   **Returns:** Nothing.

### `OnRemoveFromEntity()`
*   **Description:** Drops the held item when the holder is removed. Cleans up held item and tags.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing the holder’s state.
*   **Parameters:** None.
*   **Returns:** `string` — formatted as `"Item: <item> | Allowed Tags: <tags or 'NO RESTRICTIONS'>"`.

## Events & listeners
- **Listens to:**  
  - `onremove` — triggered by the held item’s removal (not via `TakeItem`) to invalidate state.  
  - `ondropped` — same; used to detect unexpected item drop.  
  - `onputininventory` — same; used to detect unexpected inventory transfer.  
- **Pushes:** Events are *not* directly pushed by this component. Custom callbacks (`onitemgivenfn`, `onitemtakenfn`) handle side effects.

