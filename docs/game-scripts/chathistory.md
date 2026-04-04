---
id: chathistory
title: Chathistory
description: Manages client-side chat message storage, filtering, and network synchronization.
tags: [ui, network, utility]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 4cd941a6
system_scope: ui
---

# Chathistory

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`ChatHistory` is a global singleton manager responsible for storing and processing chat messages on the client. It maintains a circular buffer of recent messages, handles profanity filtering, suppresses duplicate NPC chatter, and synchronizes chat history with the server upon joining. This script is primarily used by the HUD system to render the chat log and manage incoming network messages.

## Usage example
```lua
-- Access the global manager instance
local history = ChatHistory

-- Add a listener to react to new messages
local function OnNewMessage(msg)
    print("New chat:", msg.message)
end
history:AddChatHistoryListener(OnNewMessage)

-- Manually add a system message to the history
history:OnSystemMessage("Server restarting soon")
```

## Dependencies & tags
**Components used:** None (Global Manager)
**Tags:** None identified.
**External Dependencies:** `util/emoji`, `Profile`, `ThePlayer`, `Ents`, `RPC`, `STRINGS`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `listeners` | table | `{}` | Stores callback functions triggered when new history is added. |
| `history` | table | `{}` | Circular buffer array storing chat message objects. |
| `history_start` | number | `MAX_CHAT_HISTORY` | Index pointer for the start of the circular buffer. |
| `request_history_start` | number/`nil` | `1` | Tracks the index range requested from the server during sync. |
| `MAX_CHAT_HISTORY` | number | `100` | Class constant defining the maximum buffer size. |
| `NPC_CHATTER_MAX_CHAT_NO_DUPES` | number | `20` | Class constant defining how many recent messages to check for NPC duplicates. |

## Main functions
### `AddToHistory(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context)`
*   **Description:** Processes a chat message and adds it to the internal history buffer. Handles filtering and duplicate suppression for NPC chatter.
*   **Parameters:**
    *   `type` (number) - One of `ChatTypes` enums (e.g., `ChatTypes.Message`).
    *   `sender_userid` (string/`nil`) - Unique ID of the sender.
    *   `sender_netid` (string/`nil`) - Network ID of the sender.
    *   `sender_name` (string/`nil`) - Display name of the sender.
    *   `message` (string) - The chat content.
    *   `colour` (table) - Color data for the message text.
    *   `icondata` (table/`nil`) - Vanity icon data for the sender.
    *   `whisper` (boolean) - Whether the message is a whisper.
    *   `localonly` (boolean) - Whether the message should not be synced to server.
    *   `text_filter_context` (string/`nil`) - Context for profanity filtering.
*   **Returns:** The generated `chat_message` table if successful, `nil` if joined server or filtered.
*   **Error states:** Returns early if `self.join_server` is true.

### `GetChatMessageAtIndex(idx)`
*   **Description:** Retrieves a specific message from the history buffer.
*   **Parameters:** `idx` (number) - Index relative to the newest message (`1` is newest, `MAX_CHAT_HISTORY` is oldest).
*   **Returns:** `chat_message` table or `nil` if empty.

### `AddChatHistoryListener(fn)`
*   **Description:** Registers a callback function to be executed whenever a new message is added to history.
*   **Parameters:** `fn` (function) - Callback accepting the `chat_message` table as an argument.
*   **Returns:** Nothing.

### `RemoveChatHistoryListener(fn)`
*   **Description:** Unregisters a previously added callback function.
*   **Parameters:** `fn` (function) - The function to remove.
*   **Returns:** Nothing.

### `OnSay(guid, userid, netid, name, prefab, message, colour, whisper, isemote, user_vanity)`
*   **Description:** Handler for incoming player chat messages from the network. Performs visibility checks before adding to history.
*   **Parameters:** Various message metadata including `guid`, `userid`, `message`, `colour`, etc.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `self.join_server` is true or if the player is too far from the entity (for non-whispers).

### `RequestChatHistory()`
*   **Description:** Calculates hashes of local history boundaries and sends an RPC to the server to request missing messages.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `self.join_server` is true or no request range is set.

### `GetChatHistory()`
*   **Description:** Serializes the current history buffer for saving or network transmission.
*   **Parameters:** None.
*   **Returns:** Encoded string data.

### `SetChatHistory(history)`
*   **Description:** Deserializes and restores the history buffer from saved data.
*   **Parameters:** `history` (string) - Encoded history data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (Does not use `inst:ListenForEvent`).
- **Pushes:** Internal callbacks via `self.listeners` table when `AddToHistory` succeeds.
- **Network Events:** Uses `RPC.GetChatHistory`, `CLIENT_RPC.RecieveChatHistory` for synchronization.