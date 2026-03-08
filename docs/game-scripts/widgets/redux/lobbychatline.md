---
id: lobbychatline
title: Lobbychatline
description: Renders a single chat message line in the lobby UI, supporting multiple message types including user messages, system messages, announcements, and skin notifications.
tags: [ui, chat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 89aa4c69
system_scope: ui
---

# Lobbychatline

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LobbyChatLine` is a UI widget responsible for displaying a single chat message in the lobby interface. It handles different message types (user messages, chatter messages, system messages, and announcements—including special skin announcements) and dynamically renders associated UI elements such as badges, usernames, and message content. The widget also manages multi-line truncation, indentation for wrapped lines, focus-based sizing, and visibility state tracking via a show count.

## Usage example
```lua
local line = LobbyChatLine(chat_font, ChatTypes.Message, "Hello world!", m_colour, "Player1", s_colour, flair_icon, bg_icon)
TheFrontEnd:AddWidget(line)
line:UpdatePositions()
line:IncrementShowCount()
```

## Dependencies & tags
**Components used:** None (pure UI widget, no components required)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `show_count` | number | `0` | Tracks how many times the line has been shown; determines visibility (visible if > 0). |
| `root` | Widget | — | Root container widget for all child elements. |
| `icon` | Widget or ImageButton | `nil` | Flair badge or button (depending on message type). |
| `message` | Text | `nil` | Main message text (for standard messages). |
| `user` | Text | `nil` | Username text (for messages with sender). |
| `skin_btn` | ImageButton | `nil` | Clickable button for skin announcements. |
| `skin_txt` | Text | `nil` | Secondary text (e.g., skin name) in skin announcements. |
| `type` | string | — | Chat type identifier (`ChatTypes.*`). |
| `multiline_indent_str` | string | — | Precomputed whitespace/tab string for indenting continuation lines. |
| `inital_update` | boolean | `false` | Flag indicating whether initial position update has been performed. |
| `extra_line_count` | number | `0` | Number of additional wrapped lines beyond the first. |
| `space_width`, `first_tab_width`, `tab_width` | number | — | Measured widths of space, first tab, and subsequent tab characters for layout. |

## Main functions
### `UpdatePositions()`
*   **Description:** Arranges child widgets (icon, username, message, skin components) based on type and dynamic sizing. Computes and sets positions to ensure correct alignment, indentation of wrapped lines, and multi-line truncation.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Sets `inital_update = true` after first run to adjust future layout behavior.

### `GetExtraLineCount()`
*   **Description:** Returns the number of wrapped lines beyond the first line.
*   **Parameters:** None.
*   **Returns:** `number` — extra line count.

### `UpdateSkinAnnouncementSize(size)`
*   **Description:** Adjusts font size of the skin announcement button and embedded text, then re-applies positioning. Used to scale up/down on focus.
*   **Parameters:** `size` (number) — new font size (e.g., `chat_size` or `focus_chat_size`).
*   **Returns:** Nothing.

### `OnGainFocus()`
*   **Description:** Handles focus gain: brings the line to front and scales skin announcements up to `focus_chat_size`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnLoseFocus()`
*   **Description:** Handles focus loss: scales skin announcements back to `chat_size`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnHide()`
*   **Description:** Prevents hiding if `show_count` is positive; forces `Show()` to be called if currently hidden.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IncrementShowCount()`
*   **Description:** Increases the `show_count` and ensures visibility if `show_count > 0`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DecrementShowCount()`
*   **Description:** Decreases the `show_count` and hides the widget when it reaches zero.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.