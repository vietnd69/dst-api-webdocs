---
id: chatqueue
title: Chatqueue
description: Manages the display and animation of a scrolling chat message queue in the UI.
tags: [ui, chat, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: be82e5c1
system_scope: ui
---

# Chatqueue

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ChatQueue` is a UI widget component responsible for rendering a fixed-size, scrolling queue of chat messages (e.g., player chat, system messages, emotes). It maintains up to 7 message rows, handles fade-out animations, and supports whisper indicators and profile flairs. It inherits from `Widget` and is typically attached to the HUD or a chat-related screen.

## Usage example
```lua
local chatqueue = self:AddChild(ChatQueue(owner))
chatqueue:PushMessage("Bob", "Hello world!", WHITE, false, false, "default")
chatqueue:DisplaySystemMessage({"Welcome to the server!", "Type /help for commands."})
```

## Dependencies & tags
**Components used:** None (it is a widget, not a component; relies on `Widget` base class).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity?` | `nil` | The entity that owns this queue (not actively used in this implementation). |
| `chat_queue_data` | `table` | `{} ` | Internal array storing message metadata for each row. |
| `widget_rows` | `table` | `{} ` | Array of per-row widget containers (`message`, `user`, `flair`). |
| `chat_font` | `string` | `"TALKINGFONT"` | Font used for chat text. |
| `chat_size` | `number` | `30` | Font size for chat messages. |
| `chat_height` | `number` | `50` | Unused (retained for compatibility). |
| `user_width` | `number` | `160` | Max width in pixels for username text. |
| `user_max_chars` | `number` | `28` | Max characters before username truncation. |
| `message_width` | `number` | `850` | Max width in pixels for message text. |
| `message_max_chars` | `number` | `150` | Max characters before message truncation. |

## Main functions
### `calcChatAlpha(current_time, expire_time)`
*   **Description:** Computes the alpha value for a chat row based on time elapsed since expiration. Handles fade-out logic.
*   **Parameters:** 
    *   `current_time` (number) — current game time.
    *   `expire_time` (number) — time when the message is considered expired.
*   **Returns:** Number in `[0.0, 1.0]` indicating opacity.

### `DisplaySystemMessage(message)`
*   **Description:** Displays a system message by splitting it into multiple chat rows if necessary (due to chat width limits).
*   **Parameters:** 
    *   `message` (string or table of strings) — the message(s) to display.
*   **Returns:** Nothing.

### `DisplayEmoteMessage(name, prefab, message, colour, whisper)`
*   **Description:** Formats and displays an emote message, prepending the display name to the message text.
*   **Parameters:** 
    *   `name` (string) — raw name of the entity.
    *   `prefab` (string) — prefab name for context.
    *   `message` (string) — emote text (e.g., "waves").
    *   `colour` (table) — RGB(A) color array.
    *   `whisper` (boolean) — whether the emote is a whisper.
*   **Returns:** Nothing.

### `OnMessageReceived(name, prefab, message, colour, whisper, profileflair)`
*   **Description:** Normalizes and forwards a chat message to `PushMessage`, handling profile flair defaults.
*   **Parameters:** 
    *   `name` (string) — sender’s raw name.
    *   `prefab` (string) — sender’s prefab.
    *   `message` (string) — chat content.
    *   `colour` (table) — RGB(A) color array.
    *   `whisper` (boolean) — whether the message is whispered.
    *   `profileflair` (string or nil) — flair identifier (defaults to `"default"`).
*   **Returns:** Nothing.

### `PushMessage(username, message, colour, whisper, nolabel, profileflair)`
*   **Description:** Adds a new message to the top of the queue, shifting older messages down. Updates internal data and refreshes widgets.
*   **Parameters:** 
    *   `username` (string) — display name of the sender.
    *   `message` (string) — chat content.
    *   `colour` (table) — RGB(A) color array.
    *   `whisper` (boolean) — whether the message is whispered.
    *   `nolabel` (boolean) — if `true`, hides username and flair; uses raw color for message.
    *   `profileflair` (string) — flair identifier (e.g., `"default"`, `"moderator"`).
*   **Returns:** Nothing.

### `RefreshWidgets()`
*   **Description:** Synchronizes all `widget_rows` with current `chat_queue_data`, applying position, visibility, color, and alpha based on expiration status.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDisplayName(name, prefab)`
*   **Description:** Returns a displayable name, falling back to a known string for empty names.
*   **Parameters:** 
    *   `name` (string) — raw player name.
    *   `prefab` (string) — unused in this implementation.
*   **Returns:** String — the display name.

### `OnUpdate()`
*   **Description:** Called every frame. Updates expiration timers, pausing countdown when chat input is active.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
