---
id: manageserverslotscreen
title: Manageserverslotscreen
description: Displays a UI screen for managing a specific server save slot, offering options to delete, clone, convert cloud/local storage, or open the save folder.
tags: [ui, server, save, cloud]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: acbd4f71
system_scope: ui
---

# Manageserverslotscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ManageServerSlotScreen` is a UI screen that presents a menu for managing a single save slot (local or cloud) in Don't Starve Together. It allows the user to delete, clone, convert between local and cloud storage, or open the associated save folder. The screen is constructed via a callback-based flow and integrates with `ShardSaveGameIndex`, `TheSim`, and `Profile` to perform operations on saves. It extends `Screen` and manages its own widget hierarchy including titles, background tints, and a button menu.

## Usage example
```lua
-- Example usage (typically invoked internally by server creation UI)
local screen = ManageServerSlotScreen(
    1, -- slot index
    function(slot) print("Delete slot", slot) end, -- ondeletefn
    function(did_change) print("Refresh", did_change) end -- refreshfn
)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties.

## Main functions
### `ManageServerSlotScreen(slot, ondeletefn, refreshfn)`
* **Description:** Constructor. Initializes the screen with the target save slot and callback functions for deletion and refresh. Builds the button menu conditionally based on platform (Steam, Linux, Steam Deck) and slot type (cloud vs local). Sets up the UI hierarchy (title, text, buttons).
* **Parameters:**
  - `slot` (number) — the save slot index to manage.
  - `ondeletefn` (function) — callback invoked when the user chooses to delete the slot.
  - `refreshfn` (function) — callback invoked after operations (clone/convert) to refresh the parent UI; may receive a boolean `did_change` flag.
* **Returns:** `nil`
* **Error states:** Throws `assert` errors if `ondeletefn` or `refreshfn` are missing.

### `OnCloneButton()`
* **Description:** Launches an input dialog prompting the user to name the cloned slot. Upon confirmation, calls `OnNameEntered` with the provided name.
* **Parameters:** None.
* **Returns:** `nil`

### `OnNameEntered(name)`
* **Description:** Clones the current slot to a new slot, sets the new slot’s name, saves index changes, and triggers refresh. Shows an error dialog if cloning fails.
* **Parameters:**
  - `name` (string) — the desired name for the new slot.
* **Returns:** `nil`

### `OnConvertButton()`
* **Description:** Converts the current slot between cloud and local storage (based on its current type), pops the current screen, and pushes a new `ManageServerSlotScreen` for the converted slot.
* **Parameters:** None.
* **Returns:** `nil`

### `OnOpenFolderButton()`
* **Description:** Opens the OS file explorer to the save folder for the current slot, provided platform and runtime checks pass (not Linux, and running on Steam or Rail).
* **Parameters:** None.
* **Returns:** `nil`

### `OnCancel()`
* **Description:** Closes the screen by popping it from the frontend stack.
* **Parameters:** None.
* **Returns:** `nil`

### `OnControl(control, down)`
* **Description:** Handles control input. Consumes `CONTROL_CANCEL` to invoke `OnCancel()`.
* **Parameters:**
  - `control` (string) — the control identifier.
  - `down` (boolean) — whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; otherwise delegates to parent.

### `GetHelpText()`
* **Description:** Returns localized help text indicating how to cancel/close the screen (e.g., "Back/ESC Cancel").
* **Parameters:** None.
* **Returns:** `string` — localized help string.

### `_Close()`
* **Description:** Helper to pop the screen from the frontend. Used internally.
* **Parameters:** None.
* **Returns:** `nil`

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified