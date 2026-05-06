---
id: inventorybar
title: Inventorybar
description: Manages the player's inventory bar widget, handling item display, controller navigation, equip slots, and inventory interactions.
tags: [ui, inventory, widget, controller]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: widgets
source_hash: 10fc013c
system_scope: ui
---

# Inventorybar

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Inventorybar` is the primary UI widget responsible for rendering and managing the player's inventory interface. It handles inventory slot display, equipment slots, backpack overflow containers, controller-based navigation, and item interaction hints. The widget listens to inventory events from the owner entity and updates its visual state accordingly. It supports different game modes (lavaarena, quagmire, standard) with customized layouts and scales.

## Usage example
```lua
local owner = ThePlayer
local inv = owner.HUD.controls.inv

-- Open controller inventory
inv:OpenControllerInventory()

-- Refresh inventory display
inv:Refresh()

-- Navigate cursor
inv:CursorRight()
inv:SelectDefaultSlot()

-- Close inventory
inv:CloseControllerInventory()
```

## Dependencies & tags
**External dependencies:**
- `widgets/invslot` -- InvSlot widget for inventory slots
- `widgets/tilebg` -- TileBG widget for slot backgrounds
- `widgets/image` -- Image widget for textures
- `widgets/widget` -- Base Widget class
- `widgets/equipslot` -- EquipSlot widget for equipment
- `widgets/itemtile` -- ItemTile widget for item display
- `widgets/text` -- Text widget for UI strings
- `widgets/hudcompass` -- HudCompass widget for compass display
- `widgets/templates` -- UI template utilities
- `util/sourcemodifierlist` -- SourceModifierList for visibility modifiers

**Components used:**
- `playercontroller` -- accessed via `owner.components.playercontroller` for action retrieval and deploy mode
- `replica.inventory` -- accessed via `owner.replica.inventory` for inventory state and item data
- `replica.equippable` -- accessed on items for equip slot validation

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The player entity that owns this inventory widget. |
| `out_pos` | Vector3 | `Vector3(0,W,0)` | Target position when inventory is closed/hidden. |
| `in_pos` | Vector3 | `Vector3(0,W*1.5,0)` | Target position when inventory is open/visible. |
| `base_scale` | number | `0.6` | Base scale for inventory widgets. |
| `selected_scale` | number | `0.8` | Scale when a slot is selected. |
| `inv` | table | `{}` | Array of inventory slot widgets. |
| `backpackinv` | table | `{}` | Array of backpack overflow slot widgets. |
| `equip` | table | `{}` | Table of equipment slot widgets keyed by slot type. |
| `equipslotinfo` | table | `{}` | Array of equipment slot configuration data. |
| `root` | Widget | `nil` | Root widget container for all inventory children. |
| `hudcompass` | HudCompass | `nil` | Compass widget displayed near hand slot. |
| `hand_inv` | Widget | `nil` | Widget container for hand inventory display. |
| `bg` | Image | `nil` | Background image widget. |
| `bgcover` | Image/Widget | `nil` | Background cover image or dummy widget. |
| `hovertile` | ItemTile | `nil` | Hover tile for mouse-based item preview. |
| `cursortile` | ItemTile | `nil` | Cursor tile for controller-based item display. |
| `actionstring` | Widget | `nil` | Container for action hint text. |
| `actionstringtitle` | Text | `nil` | Title text showing item name. |
| `actionstringbody` | Text | `nil` | Body text showing available actions. |
| `repeat_time` | number | `0.2` | Time between controller input repeats. |
| `reps` | number | `0` | Repeat counter for controller input. |
| `open` | boolean | `false` | Whether the controller inventory is currently open. |
| `active_slot` | InvSlot/EquipSlot | `nil` | Currently selected/highlighted slot widget. |
| `current_list` | table | `nil` | Current inventory list being navigated. |
| `pin_nav` | boolean | `false` | Whether navigating the crafting pin bar. |
| `controller_build` | boolean | `nil` | Whether controller is attached during build. |
| `integrated_backpack` | boolean | `nil` | Whether integrated backpack is enabled. |
| `force_single_drop` | boolean | `false` | Force single item drop instead of stack. |
| `autopaused` | boolean | `false` | Whether the game is autopaused due to inventory. |
| `autopause_delay` | number | `0` | Delay timer before autopause activates. |
| `openhint` | Text | `nil` | Hint text showing how to open inventory. |
| `hint_update_check` | number | `2.0` | Timer for updating controller hint. |
| `hover_tile_visibility` | boolean | `true` | Whether hover tiles should be visible. |
| `hovertile_hide_sources` | SourceModifierList | `nil` | Modifier list controlling hover tile visibility. |
| `rebuild_pending` | boolean | `nil` | Flag indicating rebuild is needed. |
| `rebuild_snapping` | boolean | `nil` | Flag for snapping animation during rebuild. |
| `toprow` | Widget | `nil` | Widget container for top row slots. |
| `bottomrow` | Widget | `nil` | Widget container for bottom row (backpack) slots. |
| `inspectcontrol` | Widget | `nil` | Self-inspect button widget. |
| `backpack` | entity | `nil` | Backpack entity for event listeners. |
| `integrated_arrow` | Image | `nil` | Arrow image pointing to integrated backpack. |

## Main functions
### `AddEquipSlot(slot, atlas, image, sortkey)`
* **Description:** Adds an equipment slot configuration to the inventory. Called during initialization to define which equip slots are displayed.
* **Parameters:**
  - `slot` -- EQUIPSLOTS constant (e.g., EQUIPSLOTS.HANDS)
  - `atlas` -- string path to texture atlas
  - `image` -- string name of texture within atlas
  - `sortkey` -- number for sorting order (optional, defaults to array length)
* **Returns:** None
* **Error states:** None

### `Rebuild()`
* **Description:** Reconstructs the entire inventory layout, clearing and recreating all slot widgets. Called when inventory structure changes or after player swap.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Refresh(skipbackpack)`
* **Description:** Updates all inventory slot tiles with current item data from the owner's inventory replica.
* **Parameters:** `skipbackpack` -- boolean to skip backpack overflow refresh (optional)
* **Returns:** None
* **Error states:** Errors if `self.owner.replica.inventory` is nil when calling GetItems() or GetEquips().

### `RefreshIntegratedContainer()`
* **Description:** Refreshes the integrated backpack overflow container slots with current items.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.replica.inventory` is nil when calling GetOverflowContainer().

### `SetHoverTileHideModifier(source, hidden, key)`
* **Description:** Sets a visibility modifier for hover tiles from a specific source.
* **Parameters:**
  - `source` -- string identifier for the modifier source
  - `hidden` -- boolean whether to hide hover tiles
  - `key` -- string key for the modifier (optional, defaults to source)
* **Returns:** None
* **Error states:** Errors if `self.hovertile_hide_sources` is nil when calling SetModifier().

### `EnableHoverTileVisibility(enable)`
* **Description:** Enables or disables hover tile image visibility.
* **Parameters:** `enable` -- boolean to show or hide hover tile images
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Called every frame while the widget is updating. Handles controller input, autopause logic, cursor updates, and hint text refresh.
* **Parameters:** `dt` -- number delta time since last frame
* **Returns:** None
* **Error states:** Errors if `self.owner.components.playercontroller` is nil when accessing player controller methods.

### `OnControl(control, down)`
* **Description:** Handles controller input events for inventory interaction including item selection, dropping, and using items.
* **Parameters:**
  - `control` -- CONTROL_ constant for the input
  - `down` -- boolean whether the control is pressed or released
* **Returns:** `true` if control was handled, `nil` otherwise
* **Error states:** Errors if `self.owner.replica.inventory` is nil when accessing inventory methods.

### `OpenControllerInventory()`
* **Description:** Opens the controller-based inventory interface, locks focus, and scales widgets to selected scale.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD.controls` is nil when calling SetDark().

### `CloseControllerInventory()`
* **Description:** Closes the controller inventory, returns active item to slot, unlocks focus, and scales widgets back to base scale.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.HUD.controls` is nil when calling SetDark().

### `SelectSlot(slot)`
* **Description:** Selects a specific inventory slot, dehighlighting the previous active slot and highlighting the new one.
* **Parameters:** `slot` -- InvSlot or EquipSlot widget to select
* **Returns:** `true` if slot was changed, `nil` otherwise
* **Error states:** None

### `SelectDefaultSlot()`
* **Description:** Selects the first available inventory slot or first equipment slot as default.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdateCursor()`
* **Description:** Updates the cursor widget position and visibility based on active slot and controller state. Creates or kills cursor and cursortile as needed.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.active_slot` is invalid when calling GetWorldPosition().

### `UpdateCursorText()`
* **Description:** Updates the action hint text based on the currently selected item and available actions. Shows controller button prompts for examine, drop, use, equip, etc.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CursorNav(dir, same_container_only)`
* **Description:** Navigates the cursor in a direction to the closest valid slot widget.
* **Parameters:**
  - `dir` -- Vector3 direction for navigation
  - `same_container_only` -- boolean to restrict navigation to current container
* **Returns:** `true` if navigation succeeded, `nil` otherwise
* **Error states:** Errors if `self.owner.components.playercontroller` is nil when calling CancelDeployPlacement().

### `CursorLeft()`
* **Description:** Handles left navigation input, including pin bar transitions and container switching.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CursorRight()`
* **Description:** Handles right navigation input, including pin bar transitions and default slot selection.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CursorUp()`
* **Description:** Handles up navigation input, including pin bar navigation.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CursorDown()`
* **Description:** Handles down navigation input, including pin bar navigation and container switching.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetInventoryLists(same_container_only)`
* **Description:** Returns array of inventory lists for navigation. Includes inv, equip, backpackinv, and open containers.
* **Parameters:** `same_container_only` -- boolean to return only current container lists
* **Returns:** table of inventory list arrays
* **Error states:** None

### `GetClosestWidget(lists, pos, dir)`
* **Description:** Finds the closest widget in the given direction from a position.
* **Parameters:**
  - `lists` -- table of widget lists to search
  - `pos` -- Vector3 starting position
  - `dir` -- Vector3 direction to search
* **Returns:** `closest` (widget), `closest_list` (table) or `nil` if no widget found
* **Error states:** None

### `GetCursorItem()`
* **Description:** Returns the item entity currently under the cursor.
* **Parameters:** None
* **Returns:** Entity instance or `nil` if no item
* **Error states:** None

### `GetCursorSlot()`
* **Description:** Returns the slot number and container for the active slot.
* **Parameters:** None
* **Returns:** `slot_num`, `container` or `nil` if no active slot
* **Error states:** None

### `OnItemGet(item, slot, source_pos, ignore_stacksize_anim)`
* **Description:** Called when an item is added to inventory. Creates item tile and optionally animates from source position.
* **Parameters:**
  - `item` -- entity instance of the item
  - `slot` -- InvSlot widget receiving the item
  - `source_pos` -- Vector3 position for animation origin (optional)
  - `ignore_stacksize_anim` -- boolean to skip stack size animation
* **Returns:** None
* **Error states:** None

### `OnItemEquip(item, slot)`
* **Description:** Called when an item is equipped. Updates the equipment slot tile.
* **Parameters:**
  - `item` -- entity instance of the equipped item
  - `slot` -- EQUIPSLOTS constant for the slot
* **Returns:** None
* **Error states:** None

### `OnItemUnequip(item, slot)`
* **Description:** Called when an item is unequipped. Clears the equipment slot tile.
* **Parameters:**
  - `item` -- entity instance of the unequipped item
  - `slot` -- EQUIPSLOTS constant for the slot
* **Returns:** None
* **Error states:** None

### `OnItemLose(slot)`
* **Description:** Called when an item is removed from inventory. Clears the slot tile.
* **Parameters:** `slot` -- InvSlot widget that lost the item
* **Returns:** None
* **Error states:** None

### `OnNewActiveItem(item)`
* **Description:** Called when the player's active/held item changes. Updates hover tile or cursor tile accordingly.
* **Parameters:** `item` -- entity instance of the new active item or `nil`
* **Returns:** None
* **Error states:** None

### `OnBuild()`
* **Description:** Called when builditem event fires. Scales hover tile if present.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `Cancel()`
* **Description:** Cancels the current active item, returning it to inventory.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.owner.replica.inventory` is nil when calling ReturnActiveItem().

### `SetTooltipColour(r, g, b, a)`
* **Description:** Sets the colour of the action string title text.
* **Parameters:**
  - `r` -- number red channel (0-1)
  - `g` -- number green channel (0-1)
  - `b` -- number blue channel (0-1)
  - `a` -- number alpha channel (0-1)
* **Returns:** None
* **Error states:** None

### `GetDescriptionString(item)`
* **Description:** Returns the display name for an item, including adjective prefix if present.
* **Parameters:** `item` -- entity instance or `nil`
* **Returns:** string display name or empty string if item is nil
* **Error states:** None

### `PinBarNav(select_pin)`
* **Description:** Navigates to a crafting pin bar slot.
* **Parameters:** `select_pin` -- pin slot widget to select or `nil`
* **Returns:** `true` if navigation succeeded, `nil` otherwise
* **Error states:** None

### `OffsetCursor(offset, val, minval, maxval, slot_is_valid_fn)`
* **Description:** Calculates the next valid cursor position with wrapping.
* **Parameters:**
  - `offset` -- number direction offset (+1 or -1)
  - `val` -- number current position (optional)
  - `minval` -- number minimum valid index
  - `maxval` -- number maximum valid index
  - `slot_is_valid_fn` -- function to validate slot at index
* **Returns:** number next valid index
* **Error states:** None

### `RefreshRepeatDelay(control)`
* **Description:** Adjusts the controller input repeat delay based on repetition count and analog value.
* **Parameters:** `control` -- CONTROL_ constant being held
* **Returns:** None
* **Error states:** None

### `SetAutopausedInternal(pause)`
* **Description:** Sets the internal autopause state and calls SetAutopaused global function.
* **Parameters:** `pause` -- boolean whether to autopause
* **Returns:** None
* **Error states:** None

### `OnNewContainerWidget(containerwidg)`
* **Description:** Called when a new container widget is created. Scales it to match inventory state.
* **Parameters:** `containerwidg` -- container widget instance
* **Returns:** None
* **Error states:** None

### `OnEnable()`
* **Description:** Called when the widget is enabled. Updates cursor state.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnDisable()`
* **Description:** Called when the widget is disabled. Hides action string.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnShow()`
* **Description:** Called when the widget becomes visible. Updates position and shows hover tile.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnHide()`
* **Description:** Called when the widget becomes hidden. Updates position and hides hover tile.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnCraftingHidden()`
* **Description:** Called when crafting menu is hidden. Resets pin navigation if applicable.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `UpdatePosition()`
* **Description:** Updates the autoanchor position based on visibility and root position.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.autoanchor` is nil (not initialized in constructor, no nil guard before SetPosition call).

### `OnPlacerChanged(placer_shown)`
* **Description:** Called when deploy placer visibility changes. Sets hover tile hide modifier.
* **Parameters:** `placer_shown` -- boolean whether placer is shown
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `builditem` - calls OnBuild()
- **Listens to:** `itemget` - calls OnItemGet() with item data
- **Listens to:** `equip` - calls OnItemEquip() with equip data
- **Listens to:** `unequip` - calls OnItemUnequip() with unequip data
- **Listens to:** `newactiveitem` - calls OnNewActiveItem() with active item
- **Listens to:** `itemlose` - calls OnItemLose() with slot data
- **Listens to:** `refreshinventory` - calls Refresh() to update all slots
- **Listens to:** `onplacershown` - calls OnPlacerChanged(true)
- **Listens to:** `onplacerhidden` - calls OnPlacerChanged(false)
- **Listens to:** `sethovertilehidemodifier` - calls SetHoverTileHideModifier()
- **Listens to:** `seamlessplayerswap` - calls StopUpdating()
- **Listens to:** `finishseamlessplayerswap` - calls Rebuild() and Refresh()
- **Listens to:** `itemget` (backpack) - calls BackpackGet() for overflow container
- **Listens to:** `itemlose` (backpack) - calls BackpackLose() for overflow container
- **Listens to:** `refresh` (backpack) - calls BackpackRefresh() for overflow container