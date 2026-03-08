---
id: lobbychatqueue
title: Lobbychatqueue
description: Manages the display and scrolling of chat messages in the lobby UI, maintaining a rolling buffer of up to 20 messages.
tags: [ui, chat, scroll, lobby]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 0fd8ab31
system_scope: ui
---

# Lobbychatqueue

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LobbyChatQueue` is a UI widget responsible for displaying lobby chat messages in a scrollable list. It receives new chat messages, formats them (separating username and message content), stores the most recent 20 messages in memory, and updates a `ScrollableList` widget to render them. It handles focus navigation, control input (e.g., scroll, accept for chat activation), and provides localized help text.

## Usage example
```lua
local chat_queue = LobbyChatQueue(owner_widget, chatbox_widget, function() 
    print("New message received") 
end, next_widget_in_focus_chain)

chat_queue:OnMessageReceived("Alice", "player_prefab", "Hello world!", colour_value)
chat_queue:ScrollToEnd()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | widget | `nil` | The owner widget that owns this `LobbyChatQueue`. |
| `list_items` | table | `{}` | Internal list storing message data objects (up to `MAX_MESSAGES` entries). |
| `chat_font` | string | `TALKINGFONT` | Font used for chat text (used in `Text` widgets). |
| `chat_size` | number | `22` | Font size for chat messages. |
| `chatbox` | widget | `nil` | Reference to the associated chat input widget. |
| `new_message_fn` | function | `nil` | Optional callback fired after a new message is added. |
| `nextWidget` | widget | `nil` | Next widget in the focus chain (used for navigation). |
| `scroll_list` | ScrollableList | `nil` | The scrollable list widget used to render messages; lazily initialized on first message. |
| `default_focus` | widget | `nil` | The widget to receive default focus (typically `scroll_list` if present). |

## Main functions
### `GetDisplayName(name, prefab)`
* **Description:** Returns the display name to use for a chat sender. Falls back to a localized "Unknown User" string if `name` is empty.
* **Parameters:**  
  - `name` (string) – The raw username.  
  - `prefab` (string) – The prefab name (unused in base implementation but available for mods).  
* **Returns:** (string) The username or fallback string.

### `OnMessageReceived(name, prefab, message, colour)`
* **Description:** Adds a new chat message to the queue, updates internal storage (retaining only the most recent 20 messages), and rebuilds or updates the `ScrollableList` with formatted message widgets. Invokes `new_message_fn` callback if present. Automatically scrolls to the newest message.
* **Parameters:**  
  - `name` (string) – The sender’s username.  
  - `prefab` (string) – The sender’s prefab (used by `GetDisplayName`).  
  - `message` (string) – The message content.  
  - `colour` (table) – RGB/A colour table for the username text.  
* **Returns:** Nothing.

### `ScrollToEnd()`
* **Description:** Scrolls the internal `ScrollableList` to the bottom, showing the most recent message.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input control events (e.g., scroll wheel, accept button). Routes scroll controls to `scroll_list`, passes accept control to `chatbox` (if attached) during controller input, and delegates other inputs to `scroll_list` if it has focus.
* **Parameters:**  
  - `control` (number) – The control constant (e.g., `CONTROL_ACCEPT`, `CONTROL_SCROLLBACK`).  
  - `down` (boolean) – Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** (boolean) `true` if the control was handled, otherwise `false`.

### `GetHelpText()`
* **Description:** Returns localized help text describing available controls (scrolling and chat activation), depending on visible scrollbar presence and chatbox availability.
* **Parameters:** None.
* **Returns:** (string) Concatenated help text (e.g., `"Scroll: A / B  Accept: X"`).

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified