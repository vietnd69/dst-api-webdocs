---
id: barterscreen
title: Barterscreen
description: Manages the UI for player-initiated barter transactions (buying/selling items) with Doodads, including confirmation dialogs, duplicate handling, and server communication.
tags: [ui, commerce, inventory]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 913fc0e5
system_scope: ui
---

# Barterscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`BarterScreen` is a UI screen that presents a confirmation dialog for barter operations—either buying an item for Doodads (`is_buying = true`) or selling/dismantling owned items for Doodads (`is_buying = false`). It interacts with the global `TheItems` service to execute transactions and communicates success/failure via callbacks and popup dialogs. The screen includes special handling for items owned more than once (e.g., allowing bulk unsell of duplicates), visualizes the transaction with an arrow illustration, and manages focus and controller input.

## Usage example
```lua
-- Example: Open a barter screen to buy an item
local barter = BarterScreen(user_profile, prev_screen, "beefalo_wool", true, 0, function()
    print("Barter succeeded!")
end)
TheFrontEnd:PushScreen(barter)

-- Example: Open a barter screen to sell an item (owned count provided for duplicate handling)
local barter = BarterScreen(
    user_profile,
    prev_screen,
    "beefalo_wool",
    false,
    3, -- owned_count
    nil
)
TheFrontEnd:PushScreen(barter)
```

## Dependencies & tags
**Components used:** None (this is a UI screen, not a component attached to an entity instance).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table | — | User profile data (passed from caller). |
| `prev_screen` | Screen | — | The screen to return to after completion/cancellation. |
| `item_key` | string | `nil` | Identifier of the item being bartered (required). |
| `is_buying` | boolean | — | `true` for buying, `false` for selling. |
| `owned_count` | number | `0` | Number of owned instances of the item (used only when selling). |
| `barter_success_cb` | function? | `nil` | Optional callback invoked on successful barter. |
| `doodad_value` | number | — | Calculated Doodad cost (buy) or gain (sell). |
| `doodad_net` | number | — | Projected Doodad balance after transaction. |

## Main functions
### `BarterScreen(user_profile, prev_screen, item_key, is_buying, owned_count, barter_success_cb)`
* **Description:** Constructor. Initializes the screen state and builds the confirmation dialog. Registers `self.dialog` as the default focus widget.
* **Parameters:**  
  `user_profile` (table) — user account details.  
  `prev_screen` (Screen) — previous UI screen to return to.  
  `item_key` (string) — item identifier (required, `assert`ed).  
  `is_buying` (boolean) — transaction direction.  
  `owned_count` (number) — quantity of owned items (relevant only when selling).  
  `barter_success_cb` (function?) — optional success callback.  
* **Returns:** `BarterScreen` instance.

### `_BuildDialog()`
* **Description:** Constructs and returns the confirmation dialog widget (a `TEMPLATES.CurlyWindow`). Dynamically sets UI content, visuals, and button behavior based on `is_buying`, available funds, and item ownership. Handles duplicate-item selling with a secondary confirmation popup.
* **Parameters:** None.
* **Returns:** Widget — the dialog root containing illustration, text, and buttons.

### `_OnCancel()`
* **Description:** Handles user cancellation: resets `prev_screen.launched_commerce`, pops the screen from the front-end stack, and returns to the prior screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `_BarterComplete(success, status, sounds)`
* **Description:** Processes the result of a barter transaction. On success, pops the screen, plays success sounds, and invokes the optional callback. On failure, displays an error dialog and resets the simulation.
* **Parameters:**  
  `success` (boolean) — whether the server transaction succeeded.  
  `status` (string) — server response status code/message.  
  `sounds` (table of strings) — sound asset paths to play on success.  
* **Returns:** Nothing.
* **Error states:** If `success` is `false`, shows a server error dialog, prints the status, and calls `SimReset()`.

### `OnControl(control, down)`
* **Description:** Handles UI control inputs. Specifically, triggers `_OnCancel()` on `CONTROL_CANCEL` (e.g., Esc button on keyboard/controller) when the button is released (`not down`). Delegates other controls to the base `Screen` class.
* **Parameters:**  
  `control` (number) — the `CONTROL_*` constant.  
  `down` (boolean) — whether the control is pressed.  
* **Returns:** `true` if handled (by base class or cancel logic), else `false`.

### `GetHelpText()`
* **Description:** Returns a localized help string indicating the key/button for cancellation (e.g., `"ESC Back"`).
* **Parameters:** None.
* **Returns:** string — concatenated help text.

## Events & listeners
- **Listens to:** None (uses delayed frame task `self.inst:DoTaskInTime(0, ...)` to sequence screen popping, but does not register event listeners).
- **Pushes:** None.