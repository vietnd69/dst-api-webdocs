---
id: chathistory
title: Chathistory
description: Manages client-side chat history storage, filtering, and synchronization for in-game chat messages.
tags: [chat, ui, network, history]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 4cd941a6
system_scope: ui
---

# Chathistory

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ChatHistory` is a singleton component that maintains a circular buffer of the most recent chat messages (up to `MAX_CHAT_HISTORY = 100`). It handles message ingestion from multiple chat sources (player chat, emotes, announcements, system messages, NPC chatter, and command responses), applies local word filtering, supports duplicate filtering for NPC chatter, and provides RPC-based synchronization for players joining a session mid-game. It also manages listener callbacks for real-time UI updates.

## Usage example
```lua
-- Access the global singleton instance
local chat_history = ChatHistory

-- Listen for new messages
chat_history:AddChatHistoryListener(function(message)
    print("New message:", message.message)
end)

-- Manually add a system message (client-side only)
chat_history:OnSystemMessage("Welcome to the server!")

-- Request chat history for a player who just joined
chat_history:RequestChatHistory()
```

## Dependencies & tags
**Components used:** None (this component does not directly interact with other `inst.components.X` objects).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `history` | table | `{}` | Circular buffer storing up to `MAX_CHAT_HISTORY` chat messages. |
| `history_start` | number | `100` (init), then updated mod `MAX_CHAT_HISTORY` | Index of the most recent message in the circular buffer. |
| `request_history_start` | number or `nil` | `1` (init) | Start index used when requesting chat history over network; `nil` after sync complete. |
| `max_chat_history_plus_one` | chat message or `nil` | `nil` | Holds the oldest overwritten message before the buffer wraps. |
| `listeners` | table | `{}` | Set-like table mapping listener functions to `true` for callback registration. |
| `join_server` | boolean | `false` | Flag indicating whether the current session started by joining a server. |

## Main functions
### `GetDisplayName(name, prefab)`
* **Description:** Returns the display name for a chat sender. Falls back to a default "Unknown User" string if `name` is empty.
* **Parameters:**  
  `name` (string) — Raw sender name.  
  `prefab` (string or `nil`) — Unused in this implementation, included for compatibility.
* **Returns:** `string` — The non-empty name or `STRINGS.UI.SERVERADMINSCREEN.UNKNOWN_USER_NAME`.

### `OnAnnouncement(message, colour, announce_type)`
* **Description:** Adds an announcement-type message to history (e.g., world event alerts). Skips if `join_server` is `true`.
* **Parameters:**  
  `message` (string) — The announcement text.  
  `colour` (table) — Text color table.  
  `announce_type` (any) — Unused; passed to `AddToHistory` as part of data.
* **Returns:** `chat_message` table — The added message object.

### `OnSkinAnnouncement(user_name, user_colour, skin_name)`
* **Description:** Records a player's skin change announcement.
* **Parameters:**  
  `user_name` (string) — Player's name.  
  `user_colour` (table) — Name color.  
  `skin_name` (string) — Name of the new skin.
* **Returns:** `chat_message` table — The added message object.

### `OnSystemMessage(message)`
* **Description:** Records a system-generated message (e.g., admin commands, status updates).
* **Parameters:**  
  `message` (string) — System message text.
* **Returns:** `chat_message` table — The added message object.

### `OnChatterMessage(inst, name_colour, message, colour, user_vanity, user_vanity_bg, priority)`
* **Description:** Records NPC chatter messages, respecting user-configured NPC chat level and duplicates in recent history.
* **Parameters:**  
  `inst` (entity) — The NPC entity generating the chatter.  
  `name_colour` (table or `nil`) — Name color; defaults to `DEFAULT_PLAYER_COLOUR`.  
  `message` (string) — The chatter message text.  
  `colour` (table) — Message color.  
  `user_vanity`, `user_vanity_bg` (tables or `nil`) — Optional vanity icon data.  
  `priority` (number, default `0`) — Chatter priority level; skips if below `Profile:GetNPCChatLevel()`.
* **Returns:** `chat_message` table — The added message object, or `nil` if filtered.

### `OnSay(guid, userid, netid, name, prefab, message, colour, whisper, isemote, user_vanity)`
* **Description:** Records a player chat message or emote. Filters by visibility range and skips whispering if not targeted or too far.
* **Parameters:**  
  `guid`, `userid`, `netid` (number or `nil`) — Sender identifiers.  
  `name`, `prefab` (string) — Sender display name and prefab.  
  `message` (string) — Chat message text.  
  `colour` (table) — Message color.  
  `whisper` (boolean) — Whether the message is whispered.  
  `isemote` (boolean) — Whether this is an emote.  
  `user_vanity` (table or `nil`) — Vanity icon data (flair).
* **Returns:** `chat_message` table — The added message object.

### `SendCommandResponse(messages)`
* **Description:** Sends multiple command responses (e.g., `/help` output) to chat history with system styling.
* **Parameters:**  
  `messages` (string or table of strings) — One or more response lines.
* **Returns:** `chat_message` table or `nil` — The last added message.

### `GenerateChatMessage(...)`
* **Description:** Constructs a normalized message record from raw parameters, including local word filtering and formatting.
* **Parameters:**  
  `type` (ChatTypes.*) — Message type enum.  
  `sender_userid`, `sender_netid` (number or `nil`) — Sender identifiers.  
  `sender_name` (string or `nil`) — Sender display name.  
  `message` (string) — Message text.  
  `colour` (table) — Message color.  
  `icondata` (table or string) — Icon name or icon table for ChatterMessage.  
  `whisper` (boolean or `nil`) — Whisper flag.  
  `localonly` (boolean or `nil`) — If `true`, message not sent over network.  
  `text_filter_context` (string) — Context for word filter (e.g., `TEXT_FILTER_CTX_CHAT`).
* **Returns:** `chat_message` table — A structured message object ready for insertion.

### `AddToHistory(...)`
* **Description:** Inserts a chat message into the circular history buffer, applies NPC duplicate filtering, and notifies listeners.
* **Parameters:** Same as `GenerateChatMessage(...)`, plus no `text_filter_context` in signature shown—actually passes same args.
* **Returns:** `chat_message` table — The newly added message.

### `GetChatMessageAtIndex(idx)`
* **Description:** Retrieves the chat message at position `idx`, where `idx = 1` is the newest and `idx = MAX_CHAT_HISTORY` is the oldest.
* **Parameters:**  
  `idx` (number) — 1-based index (descending recency).
* **Returns:** `chat_message` table or `nil` — The message, or `nil` if no message at that index.

### `AddChatHistoryListener(fn)`
* **Description:** Registers a callback to be invoked on every new message addition.
* **Parameters:**  
  `fn` (function) — Function accepting `chat_message` as its sole argument.
* **Returns:** Nothing.

### `RemoveChatHistoryListener(fn)`
* **Description:** Unregisters a previously added listener function.
* **Parameters:**  
  `fn` (function) — Listener to remove.
* **Returns:** Nothing.

### `AddJoinMessageToHistory(...)`
* **Description:** Inserts a single chat message at a specific position in history, used for reconstructing missing messages when joining.
* **Parameters:** Same as `GenerateChatMessage(...)` arguments (minus type).
* **Returns:** Nothing.

### `RequestChatHistory()`
* **Description:** Triggers network request for chat history before join point, by hashing first/last visible messages.
* **Parameters:** None.
* **Returns:** Nothing.

### `SendChatHistory(userid, last_message_hash, first_message_hash)`
* **Description:** Sends a slice of chat history to a specific client via RPC.
* **Parameters:**  
  `userid` (number) — Recipient's user ID.  
  `last_message_hash`, `first_message_hash` (number) — Hashes demarcating the message range.
* **Returns:** Nothing.

### `RecieveChatHistory(chat_history)`
* **Description:** Receives and inserts a batch of messages (compressed/encoded) at the join index.
* **Parameters:**  
  `chat_history` (string) — ZIP-compressed, base64-encoded message list.
* **Returns:** Nothing.

### `GetChatHistory()`
* **Description:** Serializes the entire history for saving (used for world persistence).
* **Parameters:** None.
* **Returns:** `string` — Base64-encoded, ZIP-compressed history table.

### `SetChatHistory(history)`
* **Description:** Restores chat history from saved data (e.g., world load).
* **Parameters:**  
  `history` (string) — Saved history string from `GetChatHistory()`.
* **Returns:** Nothing.

### `HasHistory()`
* **Description:** Reports whether any chat history exists.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if history table is non-empty.

### `AddToHistoryAtIndex(chat_message, index)`
* **Description:** Inserts one or more messages at a specific index (e.g., for mid-session history injection), shifting existing messages.
* **Parameters:**  
  `chat_message` (table or table of tables) — One or more message objects.  
  `index` (number) — Insertion position (1-based, oldest-first index).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None — listens for messages via direct method calls, not game events.
- **Pushes:** None — listeners are invoked synchronously in `AddToHistory`, but no `PushEvent` calls are made.