---
id: scrollablechatqueue
title: Scrollablechatqueue
description: Manages a scrollable queue of recent chat messages for the UI, rendering them with multiline support and automatic scrolling behavior.
tags: [ui, chat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: dccf00c0
system_scope: ui
---

# Scrollablechatqueue

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ScrollableChatQueue` is a UI widget responsible for displaying the most recent chat messages in a scrollable view. It integrates with `ChatHistory` to fetch and render messages, supports multiline chat text via a temporary text widget, and manages automatic scrolling when new messages arrive or the user scrolls up/down. It inherits from `Widget` and uses `ChatScrollList` for scrolling logic and `ChatLine` for individual message rendering.

## Usage example
```lua
local ScrollableChatQueue = require "widgets/redux/scrollablechatqueue"
local inst = CreateEntity()
inst:AddWidget("scrollablechatqueue", ScrollableChatQueue())
inst:ListenForEvent("on_player_log_in", function()
    inst.components.scrollablechatqueue:PushMessage()
end)
```

## Dependencies & tags
**Components used:** `Widget`, `ChatHistory` (via `ChatHistory:AddChatHistoryListener`, `ChatHistory:GetChatMessageAtIndex`, etc.)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `widget_rows` | table | `{}` | Array of `ChatLine` widgets used to render each chat line. |
| `chat_font` | string | `"TALKINGFONT"` | Font identifier for chat text. |
| `chat_size` | number | `30` | Font size for chat text. |
| `user_width` | number | `160` | Width constraint for sender name rendering. |
| `user_max_chars` | number | `28` | Maximum characters for sender name. |
| `message_width` | number | `850` | Width constraint for message content rendering. |
| `message_max_chars` | number | `150` | Maximum characters per message line. |
| `chat_listener` | function | `nil` | Listener callback added to `ChatHistory` to respond to new messages. |

## Main functions
### `GetChatLinesForMessage(history_index)`
* **Description:** Returns the number of rendered lines (as an integer) required to display the chat message at the given index in `ChatHistory`. The result is cached in `message_data.chatqueue_chatlines` to avoid repeated splits. If the index points beyond the current history (e.g., for the last deleted message), it retrieves that special case.
* **Parameters:** `history_index` (number) — The 1-based index into `ChatHistory`, or `ChatHistory.MAX_CHAT_HISTORY + 1` to retrieve the last deleted message.
* **Returns:** `number` — Number of lines needed to render the message; `nil` if no message data exists for the index.
* **Error states:** Returns `nil` if `ChatHistory` does not contain a message for the given index.

### `MakeChatScrollList()`
* **Description:** Initializes the internal `ChatScrollList`, creates and configures the `ChatLine` widgets in `self.widget_rows`, and sets up the data generation, rendering, and scrolling logic for the chat queue.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `self.chat_scroll_list` already exists.

### `PushMessage()`
* **Description:** Adjusts the scroll position when a new chat message is added. If the view was fully scrolled down (`max_scroll` is `true`) and a deleted message is present (e.g., chat limit exceeded), scroll up by the difference in line counts. Otherwise, scroll up by the number of lines in the new message to keep the newest messages visible.
* **Parameters:** None.
* **Returns:** Nothing.

### `CalculateChatAlpha(history_index)`
* **Description:** Returns the alpha (opacity) value for a chat line based on its age in history. Currently hardcoded to return `1.0` for valid messages and `0.0` for invalid/empty entries.
* **Parameters:** `history_index` (number?) — Index of the message in `ChatHistory`, or `nil` for invalid.
* **Returns:** `number` — Alpha value (`0.0` or `1.0`).

### `RefreshWidgets(force_update)`
* **Description:** Triggers a full refresh of all widgets in the scroll list. Sets a `history_updated` flag to bypass caching during updates.
* **Parameters:** `force_update` (boolean) — Whether to force a refresh even if internal state suggests it’s unnecessary.
* **Returns:** Nothing.

### `OnChatControl(control, down)`
* **Description:** Passes chat-related input events (e.g., up/down arrow, page up/down) to the underlying `ChatScrollList`.
* **Parameters:**  
  - `control` (string) — The control identifier (e.g., `"up"`, `"down"`).  
  - `down` (boolean) — Whether the control key was pressed.
* **Returns:** `boolean` — Return value from `ChatScrollList:OnChatControl`.

### `IsChatOpen()`
* **Description:** Returns the current open state of the chat UI.
* **Parameters:** None.
* **Returns:** `boolean` — `self.chat_open`.

### `Kill()`
* **Description:** Cleans up the component by removing the chat listener from `ChatHistory` and calling the parent `Kill` method.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `ChatHistory` events via `AddChatHistoryListener` — triggers `PushMessage()` on new chat entries.
- **Pushes:** None identified.