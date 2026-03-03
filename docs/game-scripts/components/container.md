---
id: container
title: Container
description: Manages item storage and interactions for entities, providing slot-based inventory logic, opening/closing behavior, and item transfer operations.
tags: [inventory, storage, interaction, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 02c56607
system_scope: inventory
---

# Container

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Container` is a core component that manages item storage for an entity using a fixed number of slots. It handles item insertion, removal, stacking, opening/closing by players, and synchronization with the UI via replicas. It interacts heavily with `inventoryitem`, `stackable`, `inventory`, and `playeractionpicker` components, and integrates with HUD systems for UI rendering. The component also supports special modes like infinite stacking and read-only behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("container")
inst.components.container:SetNumSlots(9)
inst.components.container.canbeopened = true
inst.components.container.skipopensnd = false
inst.components.container.skipclosesnd = false
inst.components.container.acceptsstacks = true
```

## Dependencies & tags
**Components used:** `inventoryitem`, `stackable`, `inventory`, `equippable`, `rider`, `preserver`, `playeractionpicker`, `constructionbuilderuidata`.  
**Tags checked:** `player`, `portablestorage`, `nocrafting`.  
**Tags added/removed:** None directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slots` | table | `{}` | Array of items stored in the container; indices are 1-based slot numbers. |
| `numslots` | number | `0` | Total number of available slots. |
| `canbeopened` | boolean | `true` | Whether the container can be opened by players. |
| `skipopensnd` | boolean | `false` | If `true`, suppress the open sound when opened. |
| `skipclosesnd` | boolean | `false` | If `true`, suppress the close sound when closed. |
| `acceptsstacks` | boolean | `true` | Whether the container allows item stacking (multiple items of same type in one slot). |
| `readonlycontainer` | boolean | `false` | If `true`, prevents item insertion/removal and triggers assertions on violation. |
| `usespecificslotsforitems` | boolean | `false` | If `true`, items are placed in slots based on `itemtestfn`. |
| `issidewidget` | boolean | `false` | Whether this container is rendered as a side HUD widget. |
| `type` | string or `nil` | `nil` | Container type identifier used for container deduplication (e.g., for UI grouping). |
| `widget` | table or `nil` | `nil` | Optional widget configuration (e.g., sounds, layout). |
| `itemtestfn` | function or `nil` | `nil` | Predicate `(item, slot) -> boolean` used to determine valid item-slot placements. |
| `priorityfn` | function or `nil` | `nil` | Predicate `(item) -> boolean` used to prioritize this container in item transfer. |
| `openlist` | table | `{}` | Map of openers (players/entities) to `true`; tracks who currently has the container open. |
| `opencount` | number | `0` | Number of entities currently holding the container open. |
| `infinitestacksize` | boolean | `false` | If `true`, ignores `maxsize` for stackable items. |
| `openlimit` | number or `nil` | `nil` | Maximum number of simultaneous openers allowed (if `nil`, no limit). |

## Main functions
### `SetNumSlots(numslots)`
*   **Description:** Sets the total number of slots. Must be greater than or equal to the current slot count.
*   **Parameters:** `numslots` (number) – new slot count.
*   **Returns:** Nothing.
*   **Error states:** Asserts if `numslots < self.numslots`.

### `NumItems()`
*   **Description:** Returns the number of non-empty slots currently holding items.
*   **Parameters:** None.
*   **Returns:** `number` – count of items in the container.

### `IsFull()`
*   **Description:** Checks if all slots are occupied.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `NumItems() >= numslots`.

### `IsEmpty()`
*   **Description:** Checks if no items are present.
*   **Parameters:** None.
*   **Returns:** `boolean` – `true` if `NumItems() == 0`.

### `DropItemBySlot(slot, drop_pos, keepoverstacked)`
*   **Description:** Removes the item in the specified slot and spawns it into the world at `drop_pos`.
*   **Parameters:**  
    - `slot` (number) – 1-based slot index.  
    - `drop_pos` (`Vector3` or `nil`) – optional world position; defaults to the container's position.  
    - `keepoverstacked` (boolean or `nil`) – if `true`, prevents dropping excess items beyond `originalmaxsize`.  
*   **Returns:** `Entity` – the dropped item instance, or `nil` if no item was present.

### `DropEverything(drop_pos, keepoverstacked)`
*   **Description:** Drops all items in the container into the world.
*   **Parameters:** Same as `DropItemBySlot`.
*   **Returns:** Nothing.

### `CanTakeItemInSlot(item, slot)`
*   **Description:** Validates whether an item can be placed in the container (optionally in a specific slot).
*   **Parameters:**  
    - `item` (`Entity` or `nil`) – item to validate.  
    - `slot` (number or `nil`) – optional 1-based slot index.  
*   **Returns:** `boolean` – `true` if the item is valid for insertion.

### `GiveItem(item, slot, src_pos, drop_on_fail)`
*   **Description:** Attempts to insert an item into the container.
*   **Parameters:**  
    - `item` (`Entity` or `nil`) – item to insert.  
    - `slot` (number or `nil`) – optional slot index.  
    - `src_pos` (`Vector3` or `nil`) – source position for stack dilution (e.g., for perishables).  
    - `drop_on_fail` (boolean or `nil`) – if `true`, drops the item on failure. Defaults to `true`.  
*   **Returns:** `boolean` – `true` on success; `false` otherwise.

### `RemoveItemBySlot(slot, keepoverstacked)`
*   **Description:** Removes an item from a specific slot.
*   **Parameters:**  
    - `slot` (number) – 1-based slot index.  
    - `keepoverstacked` (boolean or `nil`) – if `true`, preserves overstacked portions in the container.  
*   **Returns:** `Entity` – the removed item, or `nil` if the slot was empty.

### `GetItemInSlot(slot)`
*   **Description:** Retrieves the item in a specific slot.
*   **Parameters:** `slot` (number) – 1-based slot index.  
*   **Returns:** `Entity` – the item, or `nil`.

### `Open(doer)`
*   **Description:** Opens the container for a specific entity (`doer`). Handles HUD updates, sound playback, and auto-close logic.
*   **Parameters:** `doer` (`Entity` or `nil`) – entity opening the container.  
*   **Returns:** Nothing.

### `Close(doer)`
*   **Description:** Closes the container for a specific entity. Recursively closes nested containers.
*   **Parameters:** `doer` (`Entity` or `nil`) – entity closing the container.  
*   **Returns:** Nothing.

### `IsOpen()`
*   **Description:** Checks if the container is currently open by any entity.
*   **Parameters:** None.  
*   **Returns:** `boolean` – `true` if `opencount > 0`.

### `IsOpenedBy(guy)`
*   **Description:** Checks if a specific entity has the container open.
*   **Parameters:** `guy` (`Entity`) – entity to check.  
*   **Returns:** `boolean` – `true` if `guy` is in `openlist`.

### `Has(item, amount, iscrafting)`
*   **Description:** Counts items matching `item.prefab` and checks if at least `amount` are present.
*   **Parameters:**  
    - `item` (`string` or `Entity`) – prefab name or instance.  
    - `amount` (number) – required count.  
    - `iscrafting` (boolean) – if `true`, excludes items with the `nocrafting` tag.  
*   **Returns:** `(boolean, number)` – `(true, count)` if count >= `amount`; otherwise `(false, count)`.

### `GetCraftingIngredient(item, amount, reverse_search_order)`
*   **Description:** Returns a table mapping slot items (for `item`) to stack counts needed for crafting, respecting `reverse_search_order`.
*   **Parameters:**  
    - `item` (`string`) – prefab name.  
    - `amount` (number) – required count.  
    - `reverse_search_order` (boolean) – whether to prefer higher slot indices.  
*   **Returns:** `table` – `{ [item] = count, ... }`.

### `OnSave()`
*   **Description:** Generates save data for all items in the container.
*   **Parameters:** None.  
*   **Returns:** `(data, references)` – `data.items` contains serialized item records; `references` contains save references.

### `OnLoad(data, newents)`
*   **Description:** Loads saved items into the container.
*   **Parameters:**  
    - `data` (table) – save data from `OnSave`.  
    - `newents` (table) – newly spawned entities map.  
*   **Returns:** Nothing.

### `WidgetSetup(prefab, data)`
*   **Description:** Applies widget-specific properties from `containers.lua` and locks `widgetprops` as read-only.
*   **Parameters:**  
    - `prefab` (`string`) – prefab name.  
    - `data` (table) – widget configuration.  
*   **Returns:** Nothing.

### `IsHolding(item, checkcontainer)`
*   **Description:** Recursively checks if the container holds `item`, optionally descending into nested containers.
*   **Parameters:**  
    - `item` (`Entity`) – item to find.  
    - `checkcontainer` (boolean or `nil`) – if `true`, check nested containers.  
*   **Returns:** `boolean` – `true` if found.

### `ForEachItem(fn, ...)`
*   **Description:** Invokes `fn(item, ...)` for every item in the container.
*   **Parameters:**  
    - `fn` (function) – callback taking `(item, ...)`.  
    - `...` – optional arguments passed to `fn`.  
*   **Returns:** Nothing.

### `ConsumeByName(item, amount)`
*   **Description:** Removes `amount` items of a specific prefab.
*   **Parameters:**  
    - `item` (`string`) – prefab name.  
    - `amount` (number) – items to consume.  
*   **Returns:** Nothing.

### `EnableInfiniteStackSize(enable)`
*   **Description:** Enables or disables ignoring of max stack sizes for all items in the container.
*   **Parameters:** `enable` (boolean) – `true` to enable, `false` to disable.  
*   **Returns:** Nothing.

### `EnableReadOnlyContainer(enable)`
*   **Description:** Enables read-only mode, blocking item transfers and adding a `preserver` component to prevent spoilage. Triggers assertions on violations.
*   **Parameters:** `enable` (boolean) – `true` to enable, `false` to disable.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `player_despawn` – fires `player_despawn` event on all contained items.  
  - `onremove` – via `playeractionpicker` registration.  
  - `itemget`, `itemlose` – in read-only mode, triggers assertions on unauthorized transfers.  
- **Pushes:**  
  - `ondropped`, `onputininventory` – handled via `inventoryitem` callbacks.  
  - `dropitem`, `itemget`, `itemlose`, `onopen`, `onclose` – for UI and logic hooks.  
  - `gotnewitem`, `stacksizechange`, `refreshcrafting` – for UI updates.  
  - `ms_closeportablestorage` – triggers portable storage auto-close.
