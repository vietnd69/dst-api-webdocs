---
id: writeablewidget
title: Writeablewidget
description: Manages the in-game text input interface for writing to writeable objects (e.g., signs, notebooks), handling UI rendering, input processing, and communication with the networked writeable component.
tags: [ui, input, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1e23baf9
system_scope: ui
---

# Writeablewidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WriteableWidget` is a UI screen implementation used to render and manage the text input interface for writeable objects (e.g., signs, notebooks). It extends `Screen` and functions as a modal overlay, providing an editable text field, accept/cancel/middle buttons, and integration with the `writeable` component’s replication system. Though named "widget", it is explicitly documented as a screen (see source comment), leveraging screen lifecycle methods like `OnBecomeActive` and `Close`. It interacts with the `playeractionpicker` component for action registration (see connected files), and relies on networked `replica.writeable` for writing finalized text.

## Usage example
```lua
local owner = ThePlayer
local writeable = some_entity.replica.writeable
local config = {
    prompt = "Write your message here:",
    maxcharacters = 100,
    defaulttext = "",
    acceptbtn = { text = "Done", control = CONTROL_ACCEPT },
    cancelbtn = { text = "Cancel", control = CONTROL_CANCEL },
    middlebtn = nil, -- optional
}
owner.HUD:OpenWriteableWidget(owner, writeable, config)
```

## Dependencies & tags
**Components used:**  
- `playeractionpicker` (via `RegisterContainer` and `UnregisterContainer`, though commented out in current code)  
- `writeable` (via `inst.replica.writeable`)  

**Tags:** None added/removed; relies on existing tags of the owner entity (e.g., `player`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (typically player) that opened the widget. |
| `writeable` | `WriteableReplica` | `nil` | Network replica of the writeable object being edited. |
| `config` | `table` | `nil` | Configuration table containing button specs, text limits, and callbacks. |
| `isopen` | `boolean` | `false` | Indicates whether the widget is currently active. |
| `scalingroot` | `Widget` | `nil` | Root widget for HUD scale management. |
| `root` | `Widget` | `nil` | Main visual container. |
| `edit_text` | `TextEdit` | `nil` | The editable text field widget. |
| `menu` | `Menu` | `nil` | Button menu for accept/cancel/middle actions. |
| `buttons` | `table` | `{}` | Internal list of button definitions. |

## Main functions
### `OnBecomeActive()`
*   **Description:** Called when the screen becomes the active screen. Sets focus to the text field and enables editing mode.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Close()`
*   **Description:** Closes the widget, finalizing or discarding edits and cleaning up UI elements.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OverrideText(text)`
*   **Description:** Sets the text in the editable field and reapplies focus.
*   **Parameters:** `text` (string) - The new text to display.
*   **Returns:** Nothing.

### `GetText()`
*   **Description:** Retrieves the current text in the editable field.
*   **Parameters:** None.
*   **Returns:** `string` – The current text content.

### `SetValidChars(chars)`
*   **Description:** Restricts allowed characters in the text field.
*   **Parameters:** `chars` (string) – A string of valid characters (used by the underlying filter).
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles button control inputs (e.g., Accept, Cancel). Triggers associated callbacks or delegates to base class.
*   **Parameters:**  
  - `control` (`number`) – Control identifier (e.g., `CONTROL_ACCEPT`).  
  - `down` (`boolean`) – Whether the control is pressed (`true`) or released (`false`).  
*   **Returns:** `boolean` – `true` if the event was handled; `false` otherwise.

## Events & listeners
- **Listens to:**  
  - `continuefrompause` (on `TheWorld`) – Updates scaling when resuming from pause if widget is open.  
  - `refreshhudsize` (on `owner.HUD.inst`) – Updates scaling when HUD size changes if widget is open.  
- **Pushes:** None directly. Text submission/cancellation is handled via callbacks in `onaccept`/`oncancel`.