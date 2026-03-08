---
id: chatqueue
title: Chatqueue
description: Manages a scrollable queue of recent chat messages, rendering them with timed fading and word-wrapping support.
tags: [ui, chat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 12e78fb7
system_scope: ui
---

# Chatqueue

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ChatQueue` is a UI widget responsible for rendering and animating the history of chat messages in the in-game chat window. It maintains a fixed-size queue (`CHAT_QUEUE_SIZE = 7`) of chat entries pulled from `ChatHistory`, handles multiline message splitting using a temporary text widget, and manages per-message alpha fading based on expiration timers. It inherits from `Widget` and integrates with the Redux UI system.

## Usage example
```lua
local chatqueue = TheWidgetFactory.CreateWidget("chatqueue")
chatqueue:OnShow()
chatqueue:PushMessage() -- Adds a new message to the top of the queue
chatqueue:Kill() -- Properly cleans up listeners and children
```

## Dependencies & tags
**Components used:** `ChatHistory` (via `ChatHistory:GetChatMessageAtIndex`, `ChatHistory:AddChatHistoryListener`, `ChatHistory:RemoveChatHistoryListener`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `message_alpha_time` | table | `{}` | Maps chat history indices to absolute expiration timestamps (used for fading). |
| `widget_rows` | table | `{}` | Array of `ChatLine` widget children, one per queue slot. |
| `chat_font` | string | `TALKINGFONT` | Font used for chat messages. |
| `chat_size` | number | `30` | Font size for chat lines. |
| `user_width` | number | `160` | Max pixel width allocated to sender username display. |
| `user_max_chars` | number | `28` | Max characters allowed for sender username. |
| `message_width` | number | `850` | Max pixel width for message text (used for line-wrapping). |
| `message_max_chars` | number | `150` | Max characters allowed per chat message segment. |
| `chat_listener` | function | `nil` | Callback registered with `ChatHistory` to trigger new message rendering. |

## Main functions
### `SplitMultilineString(message)`
*   **Description:** Splits a multiline chat message string into individual lines using an internal temporary `text` widget for word-wrapping. Each line becomes a separate chat row in the queue.
*   **Parameters:** `message` (string) - The raw chat message string.
*   **Returns:** table of strings — an array of wrapped line strings.
*   **Error states:** Returns an empty table if the message is empty or the text widget fails.

### `PushMessage()`
*   **Description:** Shifts existing message timestamps down the queue, inserts a new message timestamp at index 1, and triggers a full refresh of the chat widget rows.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `ChatHistory` is empty or the queue is already full.

### `CalculateChatAlpha(history_index)`
*   **Description:** Computes the current alpha value for a chat message at a given history index based on time elapsed since expiration.
*   **Parameters:** `history_index` (number? | nil) — Index into `self.message_alpha_time` (1 = newest message).
*   **Returns:** number — Alpha value in `[0.0, 1.0]`. Returns `0.0` if index is missing, expired, or unset.
*   **Error states:** Returns `0.0` for `history_index == nil`, `nil` timestamps, or if expiration time has passed by more than `CHAT_FADE_TIME`.

### `RefreshWidgets(full_update)`
*   **Description:** Updates the UI to reflect chat history contents and current alpha values. If `full_update` is true, it re-reads all messages and rebuilds rows; otherwise, it only refreshes alpha for existing rows.
*   **Parameters:** `full_update` (boolean) — If `true`, re-pulls messages and re-layouts rows.
*   **Returns:** Nothing.
*   **Error states:** Writes blank lines if `ChatHistory` returns `nil` for a given index.

## Events & listeners
- **Listens to:** `ChatHistory` — via `AddChatHistoryListener` and `RemoveChatHistoryListener` to trigger updates when new messages appear.
- **Pushes:** No events — this component is read-only and does not fire events.