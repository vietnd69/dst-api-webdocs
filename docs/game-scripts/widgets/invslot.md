---
id: invslot
title: Invslot
description: An inventory slot widget extending ItemSlot that handles item interactions including clicking, trading, dropping, using, and inspecting items within container UIs.
tags: [widget, ui, inventory]
sidebar_position: 10

last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 695800b8
system_scope: ui
---

# Invslot

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`InvSlot` is a UI widget extending `ItemSlot` that represents a single inventory slot within container interfaces. It handles all player input controls for item manipulation including picking up, placing, stacking, trading between containers, dropping, using, and inspecting items. The widget queries replica components (`inventory`, `container`, `stackable`) to determine valid actions and plays appropriate sound feedback. It also supports a special construction mode via `ConvertToConstructionSlot()` for building interfaces.

## Usage example
```lua
local InvSlot = require("widgets/invslot")

-- Inside a screen's _ctor:
local slot = self:AddChild(InvSlot(1, "images/inventory.tex", "slot_bg", ThePlayer, container))
slot:SetPosition(0, 0, 0)

-- Convert to construction mode for building UI:
local ingredient = { GetAtlas = function() return "images/ingredients.tex" end, GetImage = function() return "wood" end, amount = 4 }
slot:ConvertToConstructionSlot(ingredient, 2)
```

## Dependencies & tags
**External dependencies:**
- `widgets/itemslot` -- Parent widget class providing base slot functionality
- `TheFocalPoint` -- SoundEmitter for click feedback sounds
- `TheInput` -- control state checks for modifier keys
- `GetDesiredMaxTakeCountFunction` -- determines max take count for items

**Components used:**
- `inventory` (replica) -- Accessed via `owner.replica.inventory` for item operations
- `container` (replica) -- Accessed via `container.replica.container` for slot manipulation
- `stackable` (replica) -- Checked for stack operations and quantity handling
- `inventoryitem` (replica) -- Checked for locked slot status and pocket restrictions
- `equippable` (replica) -- Checked for equipment slot matching in FindBestContainer
- `constructionbuilderuidata` -- Used in FindBestContainer for construction container logic

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | --- | The character/entity that owns this inventory slot; used for replica access. |
| `container` | entity | --- | The container entity this slot belongs to; provides slot item access. |
| `num` | number | --- | The slot number/index within the container. |
| `highlight_scale` | number | `1.6` | Scale factor for slot highlight; set to `1.7` in construction mode. |
| `base_scale` | number | `1.5` | Base scale factor for the slot widget. |

## Main functions
### `_ctor(num, atlas, bgim, owner, container)`
* **Description:** Initialises the InvSlot widget, calls `ItemSlot._ctor(self, atlas, bgim, owner)`, and stores references to the slot number, owner entity, and container entity.
* **Parameters:**
  - `num` -- integer slot index within the container
  - `atlas` -- string atlas path for slot background image
  - `bgim` -- string texture name for slot background
  - `owner` -- entity instance (typically player) that owns this inventory
  - `container` -- entity instance representing the container this slot belongs to
* **Returns:** nil
* **Error states:** None — all parameters are stored directly without dereferencing.

### `OnControl(control, down)`
* **Description:** Handles input control events for the slot. Routes to appropriate action handlers based on control type and modifier keys. Plays negative click sound for read-only containers.
* **Parameters:**
  - `control` -- CONTROL_* enum value (e.g., CONTROL_ACCEPT, CONTROL_SECONDARY)
  - `down` -- boolean indicating if control is pressed down
* **Returns:** `true` if control was handled, `false` otherwise
* **Error states:** Errors if `TheFocalPoint` is nil (should always exist in-game). No guard present for `TheFocalPoint.SoundEmitter`.

### `Click(stack_mod)`
* **Description:** Handles clicking on the slot. Behavior depends on whether there is an active item held and/or an item in the slot:
  - Active item exists, slot empty — puts active item into slot (entire stack or one item based on `stack_mod`)
  - Active item nil, slot has item — takes item from slot (entire stack, half, or custom count)
  - Both exist — stacks, swaps, or rejects based on stackability and container rules
  Plays appropriate sound feedback for success/failure.
* **Parameters:** `stack_mod` -- boolean; if true, operates on single item from stack instead of entire stack
* **Returns:** nil
* **Error states:** None

### `CanTradeItem(stack_mod)`
* **Description:** Checks if the item in this slot can be traded to another container. Returns `false` if item is nil, has `CanOnlyGoInPocket()` restriction, or is locked in slot (unless `stack_mod` is true and item is stackable with remaining quantity).
* **Parameters:** `stack_mod` -- boolean; allows partial trade of locked stackable items
* **Returns:** `true` if item can be traded, `false` otherwise
* **Error states:** None

### `TradeItem(stack_mod)`
* **Description:** Moves items between open containers. Finds the best destination container using `FindBestContainer()`, then transfers the item (entire stack, half, or custom count based on `stack_mod` and item rules). Plays sound feedback for success/failure.
* **Parameters:** `stack_mod` -- boolean; if true, trades half the stack or single item
* **Returns:** nil
* **Error states:** None

### `DropItem(single)`
* **Description:** Drops the item from this slot onto the ground. Calls `owner.replica.inventory:DropItemFromInvTile()` with the tile's item.
* **Parameters:** `single` -- boolean; if true, drops single item from stack instead of entire stack
* **Returns:** nil
* **Error states:** None

### `UseItem()`
* **Description:** Uses the item in this slot. Calls `owner.replica.inventory:UseItemFromInvTile()` with the tile's item.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `Inspect()`
* **Description:** Opens the inspection dialog for the item in this slot. Calls `owner.replica.inventory:InspectItemFromInvTile()` with the tile's item.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `ConvertToConstructionSlot(ingredient, amount)`
* **Description:** Converts this slot to display construction/recipe ingredient status. Shows ingredient image with tinted background, displays quantity progress label (e.g., "2/4"), and sets up callbacks for tile quantity changes. If `ingredient` is nil, reverts to normal slot appearance.
* **Parameters:**
  - `ingredient` -- table with `GetAtlas()`, `GetImage()`, and `amount` fields; or nil to revert
  - `amount` -- number of this ingredient already contributed to the recipe
* **Returns:** nil
* **Error states:** None

### `FindBestContainer(self, item, containers, exclude_containers)` (local)
* **Description:** Local helper function that finds the optimal destination container for an item. Prioritizes in order: (1) construction builder container with matching ingredient slot, (2) container with same item that can stack, (3) container with empty slot, (4) container with non-stackable empty slot, (5) low-priority container. Checks replica components for stackability, equip slots, and skin matching.
* **Parameters:**
  - `self` -- InvSlot instance
  - `item` -- entity instance to find container for
  - `containers` -- table of candidate container entities
  - `exclude_containers` -- table of container entities to exclude (or nil)
* **Returns:** Container entity instance or `nil` if no suitable container found
* **Error states:** None

## Events & listeners
None — widgets handle input via `OnControl()` override rather than engine events.