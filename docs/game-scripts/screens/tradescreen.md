---
id: tradescreen
title: Tradescreen
description: Manages the Trade Inn UI screen where players select items to trade for rewards using a claw-machine minigame interface.
tags: [ui, trading, minigame, inventory]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 36f06858
system_scope: ui
---

# Tradescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`TradeScreen` is a UI screen component that implements the Trade Inn trading system. It manages player item selection, claw-machine animations, recipe validation, and networked item swapping. It extends `Screen` and integrates with components like `ItemSelector`, `UIAnim`, `SkinCollector`, and multiple game-screen modals. It coordinates with the server to process trades via `TheItems:SwapItems()` and updates the UI based on recipe state and inventory availability.

## Usage example
```lua
-- TradeScreen is not added as a component; it is instantiated and presented directly as a screen.
local TradeScreen = require "screens/tradescreen"

-- Example: open TradeScreen from a previous screen (e.g.,MainMenu or CharacterSelect)
TheFrontEnd:FadeToScreen(current_screen, function() return TradeScreen(prev_screen, profile) end)
```

## Dependencies & tags
**Components used:**  
- `components/uianim.lua` → referenced as `UIAnim` (class `UIAnim`), used for machine/animations.  
- `widgets/uianimbutton.lua` → used for interactive bird/character buttons.  
- `widgets/itemselector.lua` → for inventory list (`self.popup`).  
- `widgets/itemimage.lua` → for trade slot frames (`self.frames_single`).  
- `widgets/text.lua`, `widgets/image.lua`, `widgets/widget.lua`, `widgets/screen.lua`, `widgets/uianim.lua`, `widgets/uianimbutton.lua`, `widgets/mousetracker.lua`, `widgets/recipelist.lua`, `widgets/skincollector.lua`.

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | Profile data passed on initialization. |
| `prevScreen` | Screen? | `nil` | Screen to return to on quit. |
| `selected_items` | table | `{}` | List of items currently selected in the machine slots (1–`MAX_TRADE_ITEMS`). |
| `moving_items_list` | table | `{}` | Table of in-flight moving item animations. |
| `current_num_trade_items` | number | `9` | Number of visible trade slots (6 in specials mode). |
| `frames_height_adjustment` | number | `0` | Vertical offset for tile layout during transitions. |
| `specials_mode` | boolean | `false` | Whether the screen is in special recipes mode. |
| `sold_out` | boolean | `false` | Whether to show the "sold out" sign. |
| `machine_in_use` | boolean | `false` | Whether the claw machine animation is running. |
| `flush_items` | boolean | `false` | Whether the tile-flush animation is active. |
| `accept_waiting` | boolean | `false` | Whether a newly acquired item is waiting to be accepted. |
| `transitioning` | boolean | `false` | Whether the screen is changing modes (normal ↔ specials). |
| `quitting` | boolean | `false` | Whether the screen is shutting down. |
| `reset_started` | boolean | `false` | Whether a reset animation sequence has started. |
| `expected_rarity` | string? | `nil` | Expected rarity of the next item (for Innkeeper speech). |
| `gift_name` | string? | `nil` | Name of the newly acquired item (during gift animation). |
| `item_name_displayed` | boolean | `false` | Whether the acquired item name has been displayed. |
| `queued_item` | string? | `nil` | Item waiting to be given after a successful trade. |
| `moving_gift_item` | table? | `nil` | Moving animation object for the gift item. |
| `skin_in_task`, `idle_sound_task`, `snap_task`, `snap_sound`, `talk_task` | Task? | `nil` | Task handles for delayed audio and animations. |
| `warning_timeout` | number | `0` | Cooldown timer for warning speech (in seconds). |

## Main functions
### `DoInit()`
* **Description:** Initializes the full Trade Screen UI layout including background, buttons, claw machine, trade slots, and interactive character buttons (crow, snowbird, redbird, crowkid, kitcoon). Disables graphics features like stencil and light map for consistency.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoInitInventoryAndMachine()`
* **Description:** Sets up inventory and machine components: item selector (`ItemSelector`), claw machine animations, trade tile frames (`frames_single`), buttons (`resetbtn`, `tradebtn`), joystick tracker, title, and hover text display. Calls `ResetFrameTiles()` to position and initialize all 9 slots.
* **Parameters:** None.
* **Returns:** Nothing.

### `DoInitState()`
* **Description:** Initializes internal state booleans: `machine_in_use`, `flush_items`, `accept_waiting`, `specials_mode`, `sold_out`, `transitioning`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ToggleSpecialsMode()`
* **Description:** Toggles between normal (9-item) and special recipes (6-item) mode. Triggers transition animations (`snap`, `magicpoof`), updates `current_num_trade_items` and `frames_height_adjustment`, and plays appropriate sounds. Calls `RefreshUIState()` to update UI after the transition.
* **Parameters:** None.
* **Returns:** Nothing.

### `PlayMachineAnim(name, loop)`
* **Description:** Plays an animation on both the claw machine and background anims.
* **Parameters:**  
  `name` (string) – animation name.  
  `loop` (boolean) – whether to loop the animation.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Cancels animations, stops input, clears `selected_items` and `moving_items_list`, hides item name label, and moves any selected items back to the inventory list. Plays `skin_off` if a skin animation is running.
* **Parameters:** None.
* **Returns:** Nothing.

### `FinishReset(move_items)`
* **Description:** Finalizes a reset operation: clears claw machine symbols, plays `idle_empty`, optionally moves items back, resets frame tiles, and re-enables joystick.
* **Parameters:**  
  `move_items` (boolean) – whether to return selected items to inventory.
* **Returns:** Nothing.

### `EnableMachineTiles()` / `DisableMachineTiles()`
* **Description:** Shows/hides and enables/disables the trade slot frames based on `current_num_trade_items`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Callback invoked when the screen becomes active. Exits early if `do_nothing_on_activate` is set. Checks business status and shows a temporary-closed popup if `IS_OPEN_FOR_BUSINESS` is `false`. Restarts joystick and calls `RefreshUIState()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Trade(done_warning)`
* **Description:** Triggers the trade sequence. Validates inventory selection and shows a warning popup if any item will be fully consumed. Plays `claw_in` animation, updates Innkeeper speech, and calls `TheItems:SwapItems()` to send the trade request. On success, queues the acquired item for display via `queued_item`.
* **Parameters:**  
  `done_warning` (boolean) – internal flag to bypass the warning popup check on retry.
* **Returns:** Nothing.

### `FinishTrade()`
* **Description:** Executes `GiveItem()` if a `queued_item` exists, then clears `queued_item` and `selected_items`.
* **Parameters:** None.
* **Returns:** Nothing.

### `GiveItem(item)`
* **Description:** Animates the acquired item entering the inventory: sets up a `MovingItem` animation, plays `skin_in` and `idle_skin`, and schedules a delayed sound + item name display and achievement award.
* **Parameters:**  
  `item` (string) – item name to receive.
* **Returns:** Nothing.

### `DisplayItemName(gift)`
* **Description:** Displays the acquired item's name and rarity above the claw machine. Selects Innkeeper speech line based on whether the item’s rarity matches `expected_rarity`. Sets `accept_waiting = true`.
* **Parameters:**  
  `gift` (string) – item name.
* **Returns:** Nothing.

### `Quit()`
* **Description:** Shuts down the Trade Screen gracefully: cancels pending tasks, hides the Innkeeper, kills moving animations, kills sounds, fades back to previous screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `RemoveSelectedItem(number)`
* **Description:** Called when player clicks a selected slot in the machine. Initiates a moving animation to return the item to inventory, removes it from `selected_items`, and updates UI.
* **Parameters:**  
  `number` (number) – 1-based index of the slot.
* **Returns:** Nothing.

### `StartAddSelectedItem(item, start_pos)`
* **Description:** Called by `ItemSelector` when a player selects an item from the inventory. Initiates an animation to move the item into the first available trade slot, sets `last_added_item_index`, and updates `selected_items`.
* **Parameters:**  
  `item` (table) – item object with `item`, `type`, `count`, etc.  
  `start_pos` (vector) – starting screen position for animation.
* **Returns:** Nothing.

### `AddSelectedItem(item)`
* **Description:** Called when a moving item reaches its destination slot. Adds the item to `selected_items`, updates the frame tile, and triggers Innkeeper speech based on trade readiness.
* **Parameters:**  
  `item` (table) – item object with `target_index`.
* **Returns:** Nothing.

### `IsTradeAllowed()`
* **Description:** Returns `true` if the selected items match a valid trade recipe. In normal mode, checks if 9 items are selected. In specials mode, validates against current special recipe restrictions (each slot matches exactly one restriction).
* **Parameters:** None.
* **Returns:**  
  `matching_recipe` (boolean) – whether the current selection satisfies the active recipe.

### `RefreshUIState()`
* **Description:** Rebuilds the entire UI: updates `ItemSelector` data and filters, enables/disables `resetbtn`, `tradebtn`, machine tiles, and input handling. Toggles `sold_out_sign` visibility.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshMachineTilesState()`
* **Description:** Updates hover text and marks on individual trade slot tiles, including last-item warnings and rarity.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartFlushTiles()`
* **Description:** Initiates the programmatic animation sequence that clears trade tiles after a trade finishes (before `claw_in`).
* **Parameters:** None.
* **Returns:** Nothing.

### `FlushTilesUpdate(dt)`
* **Description:** Animates the tile-flush sequence using easing and per-tile randomness. Handles sound stage transitions (flush, flick/spin).
* **Parameters:**  
  `dt` (number) – delta time.
* **Returns:** Nothing (modifies internal tile positions/rotations directly).

### `ResetFrameTiles()`
* **Description:** Resets all tile positions, scales, and rotations to defaults based on `current_num_trade_items`. Clears pending `MoveTo` animations via `pos_t = nil`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main update loop. Handles internal animation transitions: from `claw_in` → `StartFlushTiles()`, `spiral_loop` → `FinishTrade()`, `skin_off` → move gift item, and flush animation progress. Manages `warning_timeout`.
* **Parameters:**  
  `dt` (number) – delta time.
* **Returns:** `true` (to continue update loop).

### `OnControl(control, down)`
* **Description:** Handles input: `CONTROL_CANCEL` → `Quit()`, `reset_control` → `Reset()`, `CONTROL_MENU_START` → `Trade()` or `Reset()` if accepting, `CONTROL_MENU_R2` → show bird/minigame menu, `CONTROL_MENU_MISC_1` → remove last full slot, `CONTROL_ACCEPT` → accept waiting item, scroll controls → `ScrollBack/ScrollFwd`.
* **Parameters:**  
  `control` (number) – control code (e.g., `CONTROL_CANCEL`).  
  `down` (boolean) – whether the control was pressed (not released).
* **Returns:** `true` if handled.

### `GetHelpText()`
* **Description:** Builds and returns localized help text strings based on current state and available controls (reset, trade, accept, remove item, birds menu, market link).
* **Parameters:** None.
* **Returns:**  
  `string` – concatenated help text for on-screen display.

## Events & listeners
- **Listens to:** None identified — `inst:ListenForEvent` calls are not present. All updates are driven by screen lifecycle (`OnBecomeActive`, `OnUpdate`) and input (`OnControl`).
- **Pushes:** None identified — `inst:PushEvent` calls are not present. Screen transitions are handled via `TheFrontEnd` methods (`FadeToScreen`, `FadeBack`, `PushScreen`).