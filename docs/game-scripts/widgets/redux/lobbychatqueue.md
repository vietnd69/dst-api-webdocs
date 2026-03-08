---
id: lobbychatqueue
title: Lobbychatqueue
description: Manages the display and scrolling of lobby chat history in the Redux UI, handling message insertion, pagination, and input focus redirection.
tags: [ui, chat, scrolling, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: d73eeab6
system_scope: ui
---

# Lobbychatqueue

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LobbyChatQueue` is a UI widget responsible for rendering and managing a scrollable queue of chat messages from the lobby screen. It integrates with the global `ChatHistory` system to populate and maintain chat display, dynamically creates `LobbyChatLine` widgets for individual messages, and handles scrolling, focus redirection, and control input. It inherits from `Widget` and is typically added as a child of the lobby UI container.

## Usage example
```lua
local lobby_chat_queue = LobbyChatQueue(chatbox, on_receive_new_message, next_widget)
ui_root:AddChild(lobby_chat_queue)
-- Messages are automatically rendered when ChatHistory fires events via its registered listener.
```

## Dependencies & tags
**Components used:** None (pure UI widget with no entity component dependencies).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chatbox` | Widget? | `nil` | Optional reference to the chat input widget; used to redirect focus for accepting messages. |
| `new_message_fn` | function? | `nil` | Callback invoked on receipt of a new non-silent message. |
| `nextWidget` | Widget? | `nil` | Widget to receive focus when navigating right from this queue. |
| `list_widgets` | table | `{}` | Internal list of `LobbyChatLine` and continuation widgets. |
| `message_count` | number | `0` | Total number of real (non-continuation) messages currently displayed. |
| `chat_font` | string | `CHATFONT` | Font used for rendering chat text. |
| `chat_size` | number | `20` | Font size for chat text. |
| `chat_listener` | function | see constructor | Listener function bound to `ChatHistory` events. |
| `scroll_list` | ScrollableList? | `nil` | The underlying scrollable list container for messages. |

## Main functions
### `Rebuild()`
* **Description:** Clears and re-populates the chat queue by fetching all messages from `ChatHistory` in reverse chronological order and pushing them via `PushMessage`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Kill()`
* **Description:** Tears down the widget, unsubscribing from `ChatHistory` events and calling the parent `Kill()` method.
* **Parameters:** None.
* **Returns:** Nothing.

### `PushMessage(chat_message, silent)`
* **Description:** Creates a new `LobbyChatLine` widget from `chat_message`, adds it to the scrollable list, and manages message count limits. If `silent` is `false`, triggers the `new_message_fn` callback. Handles multiline continuation lines automatically.
* **Parameters:**  
  - `chat_message` (table) - a chat record with fields `type`, `message`, `m_colour`, `sender`, `s_colour`, `icondata`, `icondatabg`.  
  - `silent` (boolean, optional) - if `true`, suppresses the `new_message_fn` callback. Default is `false`.
* **Returns:** Nothing.

### `DoFocusHookups()`
* **Description:** Configures focus navigation: sets the scroll list as the default focus target and wires rightward navigation to `nextWidget`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input control routing for scrolling and chat activation. Forwards `CONTROL_ACCEPT` to the chatbox (if present and valid), and delegates scroll/wheel controls to the scroll list.
* **Parameters:**  
  - `control` (number) - The `CONTROL_*` constant for the input action.  
  - `down` (boolean) - `true` if the control is being pressed; `false` on release.
* **Returns:** `true` if the control was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns a localized help string summarizing available controls (scrolling and chat activation), depending on scroll bar visibility and presence of `chatbox`.
* **Parameters:** None.
* **Returns:** `string` - concatenated localized help text.

## Events & listeners
- **Listens to:** `ChatHistory` events via `ChatHistory:AddChatHistoryListener(self.chat_listener)` — the listener invokes `PushMessage`.
- **Pushes:** None (does not fire custom events).