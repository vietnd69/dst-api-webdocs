---
id: skinsscreen
title: SkinsScreen
description: Manages the skin collection UI, including inventory browsing, skin details, and navigation to related screens like character loadouts and trading.
tags: [ui, inventory, skin, character]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 7fc80e88
system_scope: ui
---

# SkinsScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SkinsScreen` is a UI screen that displays the player's skin collection, allowing browsing, filtering, and interaction with skin details. It provides access to related functionality such as character loadouts, trading, and set information via dedicated buttons and keyboard/controller input. It manages layout elements, a scrollable skin grid, a details panel, and dynamic help text, serving as the central interface for customization content.

## Usage example
The `SkinsScreen` is constructed and pushed to the frontend by the game's UI system (typically when navigating to the skin collection). It is not added as a component to an entity; instead, it extends `Screen` and is instantiated directly:
```lua
TheFrontEnd:PushScreen(SkinsScreen(profile))
```

## Dependencies & tags
**Components used:** None identified (this is a standalone UI screen, not an entity component).
**Tags:** None identified (no entity tags are managed).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | `nil` | The player profile object used for loading skin data and updating persistent settings. |
| `applied_filters` | table | `{}` | Stores currently applied filters (e.g., skin groups to show). |
| `list_widgets` | table | `nil` | Array of widgets representing individual grid slots in the inventory list. |
| `current_item_type` | string/nil | `nil` | Tracks the type of the currently selected skin item. |
| `scroll_list` | TrueScrollList | `nil` | The scrollable container for the skin grid. |
| `details_panel` | Widget | `nil` | Panel widget displaying details (name, image, rarity, set info) for a selected skin. |
| `inventory_list` | Widget | `nil` | Widget container for the skin grid and its frame. |
| `chest` | UIAnim | `nil` | Animated background element (a decorative chest). |
| `loadout_button` | ImageButton | `nil` | Button to open the character loadout screen. |
| `trade_button` | ImageButton | `nil` | Button to open the trading screen. |
| `title` | TextEdit | `nil` | Editable text field for the collection title. |
| `exit_button` | Widget | `nil` | Back button (keyboard/mouse variant). |
| `set_info_screen` | Screen/nil | `nil` | Reference to the currently open set information popup screen. |
| `sorry_popup`, `no_item_popup`, `usable_popup` | boolean/nil | `nil` | Flags to prevent duplicate popups during screen activation. |
| `full_skins_list`, `skins_list` | table | `{}` | Stored copies of the full and filtered skin lists. |

## Main functions
### `DoInit()`
*   **Description:** Initializes the screen layout, including background, buttons, editable title, skin grid, details panel, and help systems. Disables graphics features like stencil and light maps for UI rendering.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May create and push a "sorry" popup or no-items popup during initialization if offline or inventory is empty.

### `BuildInventoryList()`
*   **Description:** Creates the scrollable skin grid container (`inventory_list`), its frame, and the `TrueScrollList` for skin items using `SkinGridListConstructor`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateInventoryList()`
*   **Description:** Fetches the current skin list via `GetSkinsList()` and updates the scroll list with the data.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetSkinsList()`
*   **Description:** Populates `skins_list` and `full_skins_list` by calling `GetInventorySkinsList(true)` and `CopySkinsList()`. Stores a legacy timestamp (currently unused).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `BuildDetailsPanel()`
*   **Description:** Constructs the details panel UI, including hanger image, item image, name, description, rarity, set title, and set info button.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnItemSelect(type, item_type, item_id, itemimage)`
*   **Description:** Updates the details panel when a skin item is selected or deselected. Displays skin name, rarity, description, and set progress if applicable.
*   **Parameters:**  
    * `type` (string/nil) — Type of item: `"base"`, `"body"`, `"item"`, or other. Controls shadow scale.  
    * `item_type` (string/nil) — Internal skin type key. Used for fetching display strings.  
    * `item_id` (string/nil) — Item instance ID (unused in logic).  
    * `itemimage` (ItemImage/nil) — The UI item image widget (unused in logic).  
*   **Returns:** Nothing.
*   **Error states:** Early return if `type` or `item_type` is `nil`, hiding the details panel and showing the hanger.

### `UnselectAll()`
*   **Description:** Removes selection state from all inventory grid widgets.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Quit()`
*   **Description:** Saves the current collection timestamp, fades out, and pops the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Handles screen activation logic, including offline/empty-inventory scenarios, popup management, and updating the inventory list. Supports resuming from sub-screens (e.g., set info, trade).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Processes input events, including navigation controls (scrolling, back), menu button shortcuts (loadout, trade, set info, usable info), and scroll repeat logic.
*   **Parameters:**  
    * `control` (string) — The control action (e.g., `CONTROL_CANCEL`, `CONTROL_SCROLLFWD`, `CONTROL_MENU_START`).  
    * `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `true` if the event was handled; `false` otherwise.

### `ScrollBack(control)` / `ScrollFwd(control)`
*   **Description:** Implements scroll repeat logic for mouse wheel, keyboard, or controller inputs. Sets repeat time based on input device.
*   **Parameters:**  
    * `control` (string) — The control action (e.g., `CONTROL_SCROLLBACK`, `CONTROL_SCROLLFWD`).  
*   **Returns:** Nothing.

### `GetHelpText()`
*   **Description:** Builds and returns a localized help text string for context-sensitive button hints (e.g., back, scroll, loadout, trade).
*   **Parameters:** None.
*   **Returns:** `string` — A concatenated help text string for display in the UI.

## Events & listeners
*   **Listens to:** None identified (this screen does not register global or entity-specific events via `inst:ListenForEvent`).
*   **Pushes:** The screen itself does not fire custom events, but pushes new screens (e.g., `CharacterLoadoutSelectScreen`, `TradeScreen`, `SetPopupDialog`, `PopupDialogScreen`) via `TheFrontEnd:PushScreen`.