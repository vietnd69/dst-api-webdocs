---
id: inventory_classified
title: Inventory Classified
description: Manages client-side preview and server-side synchronization of inventory and equipment state for networked entities, enabling responsive UI updates during item interactions.
tags: [inventory, network, ui, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a603f07
system_scope: inventory
---

# Inventory Classified

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`inventory_classified` is a prefabricated entity component that acts as a *classified* data container for inventory-related state, primarily used on the client to decouple UI responsiveness from server latency. It mirrors an inventory’s active item, slots, and equipment via networked proxies and supports optimistic UI updates (preview state) while waiting for RPC confirmations. On the server, it provides low-level setters (`SetActiveItem`, `SetSlotItem`, `SetSlotEquip`) to update the underlying networked values. It integrates closely with `PlayerController`, `PlayerActionPicker`, and `ConstructionBuilderUIData`, and is typically attached to an inventory’s parent entity (e.g., a player or container).

## Usage example
```lua
-- On the server, attach a classified entity to an inventory owner:
local owner = TheEntity
owner:AddComponent("inventory")
owner.inventory_classified = CreateEntity()
owner.inventory_classified:AddTag("CLASSIFIED")
owner.inventory_classified.entity:AddNetwork()
-- ( Typically handled by the inventory prefab’s internal logic )

-- On the client, use the classified methods for item actions:
local classified = ThePlayer.inventory_classified
if classified then
    classified:PutAllOfActiveItemInSlot(3)  -- Move active item to slot 3
    -- ... or retrieve items from crafting containers ...
    local has, count = classified:Has("twigs", 2, true)
end
```

## Dependencies & tags
**Components used:** `inventory` (via `inst._parent.inventory_classified`), `playercontroller`, `playeractionpicker`, `constructionbuilderuidata`, `spellbook`.  
**Tags:** Adds `CLASSIFIED` to the classified entity. Does *not* modify tags on the owner.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ignoreoverflow` | boolean | `false` | If true, ignores the overflow container (e.g., body slot’s inventory) for `Has` and `GetOverflowContainer`. |
| `_refreshtask` | Task | `nil` | Client-side timer task used to batch refresh events. |
| `_busy` | boolean | `true` (initial) | Indicates if a preview operation is pending or a refresh task is queued. |
| `_activeitem` | Entity or nil | `nil` | Local preview of the currently active item. |
| `_returncontainer`, `_returnslot` | Entity or nil, number or nil | `nil` | Used to track where the active item should be returned on completion of an operation. |
| `_itemspreview`, `_equipspreview` | table or nil | `nil` | Local preview arrays of items and equipment, used during optimistic updates. |

## Main functions
### `Has(prefab, amount, checkallcontainers)`
* **Description:** Checks whether the inventory (and optionally open containers and overflow) contains at least `amount` of `prefab`. Accounts for stack sizes, crafting exclusion tags, and preview state.
* **Parameters:** `prefab` (string), `amount` (number), `checkallcontainers` (boolean) – if true, includes open containers (e.g., backpacks) in the search.
* **Returns:** `(has: boolean, count: number)` – whether the amount is met and the exact count found.

### `IsBusy()`
* **Description:** Determines if the classified is currently in a preview state (waiting for a refresh or RPC) and thus should block further optimistic actions.
* **Parameters:** None.
* **Returns:** `boolean` – true if `inst._busy` or `inst._parent` is nil.

### `GetItemInSlot(slot)`
* **Description:** Returns the item in the given inventory slot, preferring preview state if active.
* **Parameters:** `slot` (number) – 1-based slot index.
* **Returns:** `Entity or nil`.

### `GetEquippedItem(eslot)`
* **Description:** Returns the equipped item in the given equipment slot, preferring preview state if active.
* **Parameters:** `eslot` (string) – e.g., `EQUIPSLOTS.HANDS`, `EQUIPSLOTS.BODY`.
* **Returns:** `Entity or nil`.

### `GetItems()` and `GetEquips()`
* **Description:** Returns copies of the inventory items and equipment arrays, excluding the active item (unless preview arrays exist). Used for iteration and UI rendering.
* **Parameters:** None.
* **Returns:** `table` – array of items or equipment entities.

### `GetNextAvailableSlot(item)`
* **Description:** Determines where an item should be placed in the inventory, checking equipment slots first for stacking, then inventory slots, and finally the overflow container.
* **Parameters:** `item` (Entity) – the item to place.
* **Returns:** `(slot: number or nil, container: "invslots" or "equips" or "overflow", useoverflow: boolean)`. Returns `nil` if no slot is available.

### `ReceiveItem(item, count)`
* **Description:** Attempts to place `item` into the inventory, handling stacking and overflow. Optimistically updates preview state and sends an RPC on success. Can be called recursively (via internal loop flag).
* **Parameters:** `item` (Entity), `count` (number or nil) – amount to receive; defaults to full stack.
* **Returns:** `number or nil` – the number of items remaining (not placed), or `nil` if fully received.

### `RemoveIngredients(recipe, ingredientmod)`
* **Description:** Consumes items required by `recipe`, applying `ingredientmod` to amounts. Returns false if any ingredient cannot be consumed (e.g., due to busy state).
* **Parameters:** `recipe` (table), `ingredientmod` (number) – multiplier for ingredient amounts.
* **Returns:** `boolean` – true if all ingredients were removed; false otherwise.

### `QueueRefresh(delay)`
* **Description:** Schedules a refresh event after `delay` seconds (often 0), preventing duplicate tasks by canceling pending ones. Sets `_busy = true` while queued.
* **Parameters:** `delay` (number) – seconds to wait before refreshing.

### `PushNewActiveItem(data, returncontainer, returnslot)`
* **Description:** Sets a local preview of the active item, triggering `"newactiveitem"` events and scheduling a refresh. Used when splitting or moving items.
* **Parameters:** `data` (table or nil) – event payload, `returncontainer` (Entity or nil), `returnslot` (number or nil).

### `PutOneOfActiveItemInSlot(slot)`, `PutAllOfActiveItemInSlot(slot)`, `TakeActiveItemFromCountOfSlot(slot, count)`
* **Description:** Optimistic UI wrappers for common inventory slot interactions (e.g., stacking, splitting stacks, moving whole items). Each updates preview state, pushes events, and sends the appropriate RPC. Checks `IsBusy` before acting.

### `EquipActionItem(item)`
* **Description:** Equips `item` if it matches the active or cursor item, handling replacement of currently equipped items in the same slot.
* **Parameters:** `item` (Entity).
* **Returns:** Does not return, but pushes `"equip"`/`"unequip"` events and sends RPC.

### `UseItemFromInvTile(item)`
* **Description:** Initiates an item use action from an inventory tile, fetching actions via `PlayerActionPicker` and dispatching via `PlayerController:RemoteUseItemFromInvTile`.
* **Parameters:** `item` (Entity).
* **Returns:** Does not return; may fail silently if `IsBusy()`.

## Events & listeners
- **Listens to:**
  - `"activedirty"` – updates preview of active item, schedules `OnActiveDirty`.
  - `"items[i]dirty"` (for each slot `i`) – updates slot preview, schedules `OnItemsDirty`.
  - `"equips[slot]dirty"` – updates equipment preview, schedules `OnEquipsDirty`.
  - `"stackitemdirty"` (from `TheWorld`) – if holding the item, schedules `OnStackItemDirty`.
- **Pushes:**
  - `"refreshinventory"` – after `Refresh`, to update HUD.
  - `"newactiveitem"` – when active item changes.
  - `"gotnewitem"` – on item acquisition or stack size change.
  - `"itemlose"` – on item removal from a slot.
  - `"equip"`, `"unequip"` – on equipment changes.
