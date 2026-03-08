---
id: texteditlinked
title: Texteditlinked
description: A text input widget that links to adjacent text boxes to enable multi-box text entry flow, such as for password or code entry fields.
tags: [ui, input, text]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: de34e25d
system_scope: ui
---

# Texteditlinked

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TextEditLinked` is a UI widget that extends `TextEdit` to support chained input across multiple text boxes. It enables seamless cursor movement between linked text fields — for instance, auto-focusing the next field when the current one is filled, or moving to the previous field when backspacing from an empty field. This is typically used for entry forms that require segmented input (e.g., PIN codes, serial keys).

## Usage example
```lua
local TextEditLinked = require "widgets/texteditlinked"
local widget1 = TextEditLinked("fonts/arial", 20, "", color)
local widget2 = TextEditLinked("fonts/arial", 20, "", color)
local widget3 = TextEditLinked("fonts/arial", 20, "", color)

widget1:SetNextTextEdit(widget2)
widget2:SetNextTextEdit(widget3)
widget2:SetLastTextEdit(widget1)
widget3:SetLastTextEdit(widget2)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `next_text_edit` | `TextEditLinked` or `nil` | `nil` | Reference to the next text box in the chain. |
| `last_text_edit` | `TextEditLinked` or `nil` | `nil` | Reference to the previous text box in the chain. |
| `pasting` | boolean | `false` | Internal flag used during paste operations to prevent infinite loops across linked boxes. |

## Main functions
### `SetNextTextEdit(next_te)`
*   **Description:** Sets the next text box in the chain. When this box is full and a character is added, input is forwarded to this box.
*   **Parameters:** `next_te` (`TextEditLinked` or `nil`) – the linked text box to receive overflow input.
*   **Returns:** Nothing.

### `SetLastTextEdit(last_te)`
*   **Description:** Sets the previous text box in the chain. When this box is empty and backspace is pressed, focus moves to this box.
*   **Parameters:** `last_te` (`TextEditLinked` or `nil`) – the linked text box to receive focus on backspace.
*   **Returns:** Nothing.

### `OnTextInput(text)`
*   **Description:** Handles character input, enforcing the `limit` and forwarding overflow to `next_text_edit` if needed.
*   **Parameters:** `text` (string) – the character(s) to insert.
*   **Returns:** `false` if input is rejected (e.g., box full and no next box); otherwise inherits behavior from `TextEdit.OnTextInput`.
*   **Error states:** If the box has reached its `limit`, and `next_text_edit` is `nil`, the function returns `false` and no further action occurs.

### `OnRawKey(key, down)`
*   **Description:** Handles raw key events including backspace (to move to previous box when empty) and tab/paste (to move focus or split pasted content across boxes).
*   **Parameters:**  
  - `key` (KEY_*) – the key pressed (e.g., `KEY_BACKSPACE`, `KEY_TAB`, paste key).  
  - `down` (boolean) – `true` if key was pressed (not released).
*   **Returns:** `true` if the key event is handled internally; otherwise delegates to base class.
*   **Error states:**  
  - Backspace only triggers movement if `self.editing` is `true`, `str.len == 0`, and `last_text_edit` is not `nil`.  
  - Paste operations may distribute characters across linked boxes up to each box’s `limit`; stops when a box reports overflow.

## Events & listeners
*   **Listens to:** None  
*   **Pushes:** None