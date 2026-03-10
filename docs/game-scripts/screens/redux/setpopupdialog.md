---
id: setpopupdialog
title: SetPopupDialog
description: Displays a UI dialog showing details of a skin set, including required items, ownership status, and reward information.
tags: [ui, inventory, skin]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: fe5545bb
system_scope: ui
---

# SetPopupDialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SetPopupDialog` is a UI screen component that presents detailed information about a specific skin set (identified by `set_item_type`). It displays the set's description, required items (with ownership indicators), and the reward item (the skin itself), along with navigation controls for sets containing multiple configurations. It integrates with the `TheInventory` system to check item ownership and uses `SKIN_SET_ITEMS` (from `skin_set_info.lua`) to determine required items per set.

## Usage example
```lua
local SetPopupDialog = require "screens/redux/setpopupdialog"
local screen = SetPopupDialog("beefalo_hat")
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `TheInventory`, `TheFrontEnd`, `TheInput`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `set_item_type` | string | — | Identifier for the skin set type being displayed (e.g., `"beefalo_hat"`). |
| `num_sets` | number | `0` | Number of available configurations in the skin set. |
| `current_set` | number | `1` | Index of the currently displayed set configuration. |
| `max_num_items` | number | `0` | Maximum number of required items across all set configurations. |

## Main functions
### `RefreshDisplay()`
* **Description:** Updates the UI to reflect the current set configuration (`current_set`), showing required items and their ownership status.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Closes the dialog by popping it from the frontend screen stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input controls, including closing the dialog with `CONTROL_CANCEL`, and scrolling between set configurations (if multiple exist) using `CONTROL_SCROLLBACK`/`CONTROL_SCROLLFWD`.
* **Parameters:**  
  - `control` (number) — The input control constant (e.g., `CONTROL_CANCEL`, `CONTROL_SCROLLBACK`).  
  - `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `true` if the input was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text describing available controls.
* **Parameters:** None.
* **Returns:** `string` — Concatenated help string with control labels and descriptions.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.