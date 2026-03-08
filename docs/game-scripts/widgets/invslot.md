---
id: invslot
title: Invslot
description: Handles player interaction with inventory slots, including item placement, removal, trading, and construction container integration.
tags: [ui, inventory, crafting, controller]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 52b76cd8
system_scope: ui
---

# Invslot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`InvSlot` is a UI widget that represents an interactive inventory slot in the player's interface. It extends `ItemSlot` and manages mouse/controller inputs for interacting with items in a container (e.g., inventory, backpack, construction bench). It coordinates item movement between the active hand and containers, supports stack splitting and merging, and integrates with construction containers via the `constructionbuilderuidata` component.

## Usage example
```lua
local invslot = InvSlot(slot_number, atlas, bgim, owner, container)
-- Typically added to a container widget (e.g., InventoryGrid) which manages layout and interaction.
-- The container must provide GetItemInSlot() and mutator methods like PutAllOfActiveItemInSlot().
```

## Dependencies & tags
**Components used:** `constructionbuilderuidata` (via `owner.components.constructionbuilderuidata`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or nil | `nil` | Owner entity of the slot (often the player), used for constructing container lookup. |
| `container` | container component or nil | `nil` | The container instance hosting this slot. Must implement `GetItemInSlot()`, `Put*`, `Move*`, and `CanTakeItemInSlot()`. |
| `num` | number | `nil` | Slot index (1-based) within the container. |
| `highlight_scale` | number | `1.6` | Scale factor applied during hover/highlight. |
| `base_scale` | number | `1.5` | Default scale of the slot (set in `ConvertToConstructionSlot`). |

## Main functions
### `OnControl(control, down)`
*   **Description:** Handles input controls (mouse, keyboard, controller) for the slot. Delegates to `Click()`, `UseItem()`, `DropItem()`, `TradeItem()`, or `Inspect()` depending on control type and modifier keys.
*   **Parameters:**  
    `control` (string) — Control identifier (e.g., `CONTROL_ACCEPT`, `CONTROL_SECONDARY`, `CONTROL_SPLITSTACK`, `CONTROL_TRADEITEM`, `CONTROL_INSPECT`).  
    `down` (boolean) — Whether the control is being pressed (`true`) or released (`false`). Only `true` is processed.
*   **Returns:** `true` if the control was handled, `false` otherwise.
*   **Error states:** If `container:IsReadOnlyContainer()` is `true`, prevents all actions except read-only inspection, and emits `"dontstarve/HUD/click_negative"`.

### `Click(stack_mod)`
*   **Description:** Performs the core inventory manipulation logic: placing, picking up, stacking, or swapping items between the active item and this slot.
*   **Parameters:**  
    `stack_mod` (boolean) — If `true`, splits or moves half of a stack; otherwise, moves the full stack or whole item.
*   **Returns:** Nothing.
*   **Error states:** No items are moved if the active item/container item is `nil`, the container rejects the operation, or `CanOnlyGoInPocket()` constraints apply.

### `CanTradeItem()`
*   **Description:** Determines whether the item in this slot can be traded/moved between containers.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the item does *not* have `CanOnlyGoInPocket()` restriction; `false` otherwise.

### `TradeItem(stack_mod)`
*   **Description:** Moves the item in this slot to the most suitable open container (or the player’s inventory), using priority logic (prefers stacks, then empty slots).
*   **Parameters:**  
    `stack_mod` (boolean) — If `true`, moves half the stack (if stackable); otherwise, moves the full stack.
*   **Returns:** Nothing.
*   **Error states:** Returns early without moving if there are no writable open containers or no suitable destination container is found.

### `DropItem(single)`
*   **Description:** Drops the item in this slot onto the ground.
*   **Parameters:**  
    `single` (boolean) — If `true`, drops one item; otherwise, drops the entire stack.
*   **Returns:** Nothing.
*   **Error states:** No action is taken if `owner`, `owner.replica.inventory`, `tile`, or `tile.item` is `nil`.

### `UseItem()`
*   **Description:** Uses or equips the item in this slot (e.g., right-click action).
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No action if `tile.item` or `inventory` is `nil`.

### `Inspect()`
*   **Description:** Opens the item’s inspection tooltip or menu.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No action if `tile.item` or `inventory` is `nil`.

### `ConvertToConstructionSlot(ingredient, amount)`
*   **Description:** Transforms the slot into a construction ingredient slot (used in crafting UI) by adding a highlighted overlay with progress labels.
*   **Parameters:**  
    `ingredient` (entity or nil) — The item prefab required for construction; if `nil`, resets the slot to normal.  
    `amount` (number) — Base quantity of the ingredient already placed.
*   **Returns:** Nothing.
*   **Error states:** Resets visuals if `ingredient` is `nil`.

## Events & listeners
None identified.