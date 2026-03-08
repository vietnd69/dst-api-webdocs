---
id: inventorybar
title: Inventorybar
description: Manages the player's inventory HUD bar, including slot layout, cursor navigation, item display, and controller mouse/focus integration.
tags: [ui, inventory, player]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c797ad3c
system_scope: player
---

# Inventorybar

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `Inventorybar` widget is the core UI component responsible for rendering and interacting with the player's inventory in Don't Starve Together. It displays inventory slots, equipment slots, integrated backpack contents, and the active item cursor — adapting its layout and behavior based on game mode (e.g., Quagmire, Lava Arena), controller/mouse input, and profile settings. It synchronizes with the `inventory` replica component, handles cursor navigation (including pin-based and directional), manages auto-pause during controller interaction, and coordinates with `PlayerController` for item actions like equipping, dropping, and using items on targets.

## Usage example
```lua
-- Example: Initializing and managing inventory bar in a custom HUD
local hud = Create Widget("hud")
local inventorybar = hud:AddChild("Inventorybar")
inventorybar:SetOwner(ThePlayer)
inventorybar:AddEquipSlot(EQUIPSLOTS.HANDS, "images/hud.xml", "hands.tex", 1)
inventorybar:Rebuild() -- Layout initial setup
inventorybar:OpenControllerInventory() -- Show when controller opens menu
inventorybar:CloseControllerInventory() -- Hide and return focus
```

## Dependencies & tags
**Components used:**
- `components/playercontroller`
- `components/inventory`
- `components/replica/inventory` (via `self.inst.replica.inventory`)
- `components/replica/rider` (via `self.inst.replica.rider`)

**Tags:** None (no tags defined or used in either chunk)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | — | The player entity the inventory belongs to. |
| `out_pos`, `in_pos` | Vector3 | — | Target positions for cursor movement (hover in/out). |
| `base_scale`, `selected_scale` | number | `0.6`, `0.8` | Scale multipliers for normal vs. selected slots. |
| `inv`, `backpackinv`, `equip`, `equipslotinfo` | table | — | Internal storage for inventory, backpack, equipment slots, and equipment metadata. |
| `root`, `toprow`, `bottomrow` | Widget | — | Layout hierarchy root widgets. |
| `hudcompass`, `hand_inv` | Widget | — | Compass and hand-inv positioning widgets. |
| `bg`, `bgcover`, `bgcover2` | Widget | — | Background and cover widgets for inventory mode (e.g., Quagmire, default). |
| `hovertile`, `cursortile` | Widget | — | Hover and active cursor tile widgets (controller mode). |
| `actionstring`, `actionstringtitle`, `actionstringbody` | Widget | — | Tooltip widgets for item action descriptions. |
| `repeat_time`, `reps` | number | — | Controller repeat input timing and counter. |
| `actionstringtime` | number | `10` | Delay (frames) before auto-hiding action string. |
| `openhint`, `hint_update_check` | Widget, timer | — | Hint text and timer for periodic hint updates. |
| `controller_build`, `integrated_backpack`, `force_single_drop`, `autopaused`, `autopause_delay` | boolean/number | — | State flags for controller mode, backpack integration, drop behavior, and auto-pause behavior. |
| `rebuild_pending`, `rebuild_snapping` | boolean | — | Flags indicating layout needs rebuild or snap repositioning. |
| `active_slot` | Widget (slot) | — | Currently selected slot widget. |
| `current_list` | table | — | List (e.g., `self.inv`, `self.equip`) containing `active_slot`. |

## Main functions
### `Inv:AddEquipSlot(slot, atlas, image, sortkey)`
* **Description:** Registers an equipment slot for display in the inventory bar. Stores metadata, sorts by `sortkey`, and marks layout for rebuild.
* **Parameters:**  
  - `slot` — equipment slot identifier (e.g., `EQUIPSLOTS.HANDS`)
  - `atlas` — texture atlas path (e.g., `"images/hud.xml"`)
  - `image` — image filename within atlas (e.g., `"hands.tex"`)
  - `sortkey` — optional integer for ordering; defaults to `#self.equipslotinfo`
* **Returns:** `nil`

### `Inv:Rebuild()`
* **Description:** Fully reconstructs the inventory bar UI from scratch. Determines layout based on game mode (default vs. Quagmire), presence of integrated backpack, and profile/controller settings.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:RefreshRepeatDelay(control)`
* **Description:** Adjusts input repeat timing for smooth controller navigation based on repeat count and analog stick depth.
* **Parameters:**  
  - `control` — input control identifier (e.g., `CONTROL_MOVE_LEFT`)
* **Returns:** `nil`

### `Inv:OnUpdate(dt)`
* **Description:** Frame update handler for UI state: cursor positioning, input repeat handling, hint refresh, auto-pause toggling, and deferred layout rebuilding.
* **Parameters:**  
  - `dt` — delta time in seconds
* **Returns:** `nil`

### `Inv:OffsetCursor(offset, val, minval, maxval, slot_is_valid_fn)`
* **Description:** Wraps a numeric cursor index across a range, skipping invalid slots via predicate.
* **Parameters:**  
  - `offset` — step direction (+1 or -1)
  - `val` — current index (can be `nil`)
  - `minval`, `maxval` — inclusive bounds
  - `slot_is_valid_fn` — function `(idx) -> boolean` to validate slots
* **Returns:** Valid index (number), or `nil` if none found after full wrap

### `Inv:PinBarNav(select_pin)`
* **Description:** Immediately navigates to a pin (e.g., crafting button) in pin-based navigation mode.
* **Parameters:**  
  - `select_pin` — pin slot widget or identifier
* **Returns:** `true` if navigation succeeded, `nil` otherwise

### `Inv:GetInventoryLists(same_container_only)`
* **Description:** Returns lists of inventory slots to search during cursor navigation (e.g., `self.inv`, `self.equip`, `self.backpackinv`).
* **Parameters:**  
  - `same_container_only` — boolean; restrict scope to current container and equipped slots if `true`
* **Returns:** Table of slot lists (e.g., `{self.inv, self.equip, self.backpackinv}`)

### `Inv:CursorNav(dir, same_container_only)`
* **Description:** Performs directional cursor navigation to the nearest valid slot in `dir`, updating `active_slot` and `current_list`.
* **Parameters:**  
  - `dir` — `Vector3` direction (e.g., `Vector3(-1,0,0)`)
  - `same_container_only` — boolean; restrict navigation scope
* **Returns:** `true` if a valid slot was selected, `nil` otherwise

### `Inv:CursorLeft()`, `Inv:CursorRight()`, `Inv:CursorUp()`, `Inv:CursorDown()`
* **Description:** Directional navigation handlers; calls `CursorNav` internally, plays click sound, and handles repeat resets or pin fallbacks.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:GetClosestWidget(lists, pos, dir)`
* **Description:** Finds the closest widget to `pos` in direction `dir` from `lists`, filtering to the forward half-plane.
* **Parameters:**  
  - `lists` — table of slot lists
  - `pos` — `Vector3` current position
  - `dir` — `Vector3` direction vector
* **Returns:** `slot` (widget) and `list`, or `nil, nil`

### `Inv:GetCursorItem()`, `Inv:GetCursorSlot()`
* **Description:**  
  - `GetCursorItem()` — returns the item in the active slot  
  - `GetCursorSlot()` — returns `(slot_num, container)` for the active slot  
* **Parameters:** None  
* **Returns:**  
  - `GetCursorItem()` — item instance or `nil`  
  - `GetCursorSlot()` — `{slot_num}, {container}` or `nil, nil`

### `Inv:OnControl(control, down)`
* **Description:** Handles controller button inputs for inventory actions: accept, drop stack, drop item, swap. Respects read-only containers and special conditions.
* **Parameters:**  
  - `control` — control identifier (e.g., `CONTROL_ACCEPT`)
  - `down` — must be `false` to trigger action
* **Returns:** `true` if input handled, otherwise `nil`

### `Inv:SetAutopausedInternal(pause)`
* **Description:** Sets global auto-pause state only when changed, preventing redundant toggling.
* **Parameters:**  
  - `pause` — boolean target state
* **Returns:** `nil`

### `Inv:OpenControllerInventory()`, `Inv:CloseControllerInventory()`
* **Description:**  
  - `OpenControllerInventory()` — opens inventory with animation, locks focus, starts auto-pause  
  - `CloseControllerInventory()` — closes inventory, returns active item, resets focus/scale  
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:GetDescriptionString(item)`
* **Description:** Formats item description as `"adjective name"` or just `"name"`.
* **Parameters:**  
  - `item` — item instance
* **Returns:** `string` description

### `Inv:SetTooltipColour(r, g, b, a)`
* **Description:** Sets color of `actionstringtitle`.
* **Parameters:**  
  - `r, g, b, a` — color components (0–1)
* **Returns:** `nil`

### `Inv:UpdateCursorText()`
* **Description:** Populates action string UI (`actionstringtitle/body`) with localized action keys and text, based on active item, inventory item, and slot context.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:OnEnable()`, `Inv:OnDisable()`, `Inv:OnNewContainerWidget(containerwidg)`
* **Description:**  
  - `OnEnable()` — shows cursor  
  - `OnDisable()` — hides action string  
  - `OnNewContainerWidget()` — applies `selected_scale` to late-adding containers if inventory open  
* **Parameters:**  
  - `containerwidg` — new container widget instance  
* **Returns:** `nil`

### `Inv:SelectSlot(slot)`
* **Description:** Selects a given slot, deselecting the current one. Updates pin navigation mode if needed.
* **Parameters:**  
  - `slot` — slot widget to select
* **Returns:** `true` if different and valid slot selected, `nil` otherwise

### `Inv:SelectDefaultSlot()`
* **Description:** Selects the first available slot in `self.inv`, or if empty, in `self.equip`.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:UpdateCursor()`
* **Description:** Updates cursor visuals and action string in controller mode; hides cursor for mouse mode.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:Refresh(skipbackpack)`
* **Description:** Syncs all inventory, equipment, and (optionally) backpack tile widgets with the replica state.
* **Parameters:**  
  - `skipbackpack` — boolean to skip integrated backpack refresh
* **Returns:** `nil`

### `Inv:RefreshIntegratedContainer()`
* **Description:** Updates integrated backpack (overflow container) slots when items change.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:OnPlacerChanged(placer_shown)`
* **Description:** Shows/hides hovertile and backgrounds during placement (e.g., deploy mode).
* **Parameters:**  
  - `placer_shown` — boolean; `true` when placer is active
* **Returns:** `nil`

### `Inv:Cancel()`
* **Description:** Returns active item to inventory via replica.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:OnItemLose(slot)`
* **Description:** Clears a slot when its item is lost or unequipped.
* **Parameters:**  
  - `slot` — slot widget to clear
* **Returns:** `nil`

### `Inv:OnBuild()`
* **Description:** Triggers hovertile scale animation on build action (e.g., drag build UI).
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:OnNewActiveItem(item)`
* **Description:** Updates cursor visuals (hovertile/cursortile) and action string to reflect the new active item.
* **Parameters:**  
  - `item` — new active item (or `nil`)
* **Returns:** `nil`

### `Inv:OnItemGet(item, slot, source_pos, ignore_stacksize_anim)`
* **Description:** Spawns and positions an `ItemTile` for a newly added item, optionally animating from `source_pos`.
* **Parameters:**  
  - `item` — item to add
  - `slot` — target slot
  - `source_pos` — optional origin `Vector3` for animation
  - `ignore_stacksize_anim` — skip stack-size animation
* **Returns:** `nil`

### `Inv:OnItemEquip(item, slot)`
* **Description:** Updates an equipment slot with a new `ItemTile`.
* **Parameters:**  
  - `item` — equipped item
  - `slot` — equipment slot index/key
* **Returns:** `nil`

### `Inv:OnItemUnequip(item, slot)`
* **Description:** Clears an equipment slot when item is unequipped.
* **Parameters:**  
  - `item` — unequipped item
  - `slot` — equipment slot
* **Returns:** `nil`

### `Inv:UpdatePosition()`
* **Description:** Adjusts HUD autoanchor to maintain alignment when inventory is toggled.
* **Parameters:** None  
* **Returns:** `nil`

### `Inv:OnShow()`, `Inv:OnHide()`, `Inv:OnCraftingHidden()`
* **Description:**  
  - `OnShow()` — update position, show hovertile  
  - `OnHide()` — update position, hide hovertile  
  - `OnCraftingHidden()` — reset pin navigation and default selection  
* **Parameters:** None  
* **Returns:** `nil`

## Events & listeners
* **Listens to (`self.inst`):**  
  - `"builditem"` — triggers `self:OnBuild()`  
  - `"itemget"` — triggers `self:OnItemGet(item, slot, src_pos, ignore_stacksize_anim)`  
  - `"equip"` / `"unequip"` — triggers `self:OnItemEquip(item, slot)` / `self:OnItemUnequip(item, slot)`  
  - `"newactiveitem"` — triggers `self:OnNewActiveItem(item)`  
  - `"itemlose"` — triggers `self:OnItemLose(slot)`  
  - `"refreshinventory"` — triggers `self:Refresh(true)`  
  - `"onplacershown"` / `"onplacerhidden"` — triggers `self:OnPlacerChanged(placer_shown)`  
  - `"seamlessplayerswap"` — triggers `self:StopUpdating()` (on source player only)  
  - `"finishseamlessplayerswap"` — triggers `self:Rebuild()` and `self:Refresh(true)` on target player if pending  

* **Listens to (`self.backpack`):**  
  - `"itemget"` — delegates to `Inv:OnItemGet` (via `BackpackGet`)  
  - `"itemlose"` — delegates to `self:OnItemLose` (via `BackpackLose`)  
  - `"refresh"` — triggers `self:RefreshIntegratedContainer()` (via `BackpackRefresh`)  

* **Pushes:** None