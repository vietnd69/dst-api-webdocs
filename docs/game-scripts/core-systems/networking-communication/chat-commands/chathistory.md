---
id: chathistory
title: ChatHistory
description: Chat history management system for storing, synchronizing, and filtering chat messages
sidebar_position: 1
slug: /game-scripts/core-systems/chathistory
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# ChatHistory

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **ChatHistory** system manages chat message storage, synchronization, and filtering in Don't Starve Together. It provides a circular buffer for chat messages with network synchronization between clients and server, word filtering for content moderation, and support for multiple chat types including player messages, emotes, announcements, and NPC chatter.

## Usage Example

```lua
-- Add a system message
ChatHistory:OnSystemMessage("Player Wilson has joined the game")

-- Add chat listener for UI updates
local function UpdateChatUI(chatMessage)
    if chatMessage.type == ChatTypes.Message then
        print(string.format("%s says: %s", chatMessage.sender, chatMessage.message))
    end
end
ChatHistory:AddChatHistoryListener(UpdateChatUI)

-- Get recent messages
for i = 1, 5 do
    local msg = ChatHistory:GetChatMessageAtIndex(i)
    if msg then
        print("Message:", msg.message)
    end
end
```

## Constants

### MAX_CHAT_HISTORY

**Value:** `100`

**Status:** stable

**Description:** Maximum number of chat messages stored in the circular buffer.

### NPC_CHATTER_MAX_CHAT_NO_DUPES

**Value:** `20`

**Status:** stable

**Description:** Maximum range for checking duplicate NPC chatter messages to prevent spam.

## Enumerations

### ChatTypes

**Status:** stable

**Description:** Enumeration defining different types of chat messages.

**Values:**
- `ChatTypes.Message` (1): Regular player chat messages
- `ChatTypes.Emote` (2): Player emote actions  
- `ChatTypes.Announcement` (3): Server announcements
- `ChatTypes.SkinAnnouncement` (4): Skin unlock announcements
- `ChatTypes.SystemMessage` (5): System-generated messages
- `ChatTypes.CommandResponse` (6): Responses to admin commands
- `ChatTypes.ChatterMessage` (7): NPC/creature chatter (client-side only)

**Example:**
```lua
if chatMessage.type == ChatTypes.Announcement then
    print("Server announcement:", chatMessage.message)
end
```

### NoWordFilterForChatType

**Status:** stable

**Description:** Table defining which chat types bypass word filtering.

**Values:**
- `[ChatTypes.SkinAnnouncement]` = false
- `[ChatTypes.CommandResponse]` = true

## Classes/Components

### ChatHistoryManager

**Status:** stable

**Description:** Main class managing chat history storage, network synchronization, and message filtering using a circular buffer system.

**Version History:**
- Current implementation in build 676042

#### Properties
- `listeners` (table): Registered callback functions for message notifications
- `history` (table): Circular buffer storing chat messages
- `history_start` (number): Current position in circular buffer
- `request_history_start` (number): Starting index for history requests
- `join_server` (boolean): Flag indicating if player is joining server
- `max_chat_history_plus_one` (table): Last overwritten message reference

#### Methods

##### AddToHistory(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context) {#add-to-history}

**Status:** stable

**Description:**
Adds a new chat message to the history buffer with duplicate filtering for NPC chatter and automatic listener notification.

**Parameters:**
- `type` (number): Chat type from ChatTypes enumeration
- `sender_userid` (string): Unique user identifier for the sender
- `sender_netid` (number): Network entity ID of the sender
- `sender_name` (string): Display name of the message sender
- `message` (string): Chat message content text
- `colour` (table): Color data for message display (RGBA format)
- `icondata` (string/table): Profile icon or vanity data
- `whisper` (boolean): Whether message is a private whisper
- `localonly` (boolean): Whether message stays on local client only
- `text_filter_context` (number): Context for content filtering system

**Returns:**
- (table): Generated chat message object, or nil if filtered out

**Example:**
```lua
-- Add regular player message
local chatMsg = ChatHistory:AddToHistory(
    ChatTypes.Message,
    "player123",
    456,
    "Wilson",
    "Hello everyone!",
    {1, 1, 1, 1},  -- White color
    "default",
    false,  -- Not whisper
    false,  -- Not local only
    TEXT_FILTER_CTX_CHAT
)
```

**Version History:**
- Stable implementation since build 676042

##### GetChatMessageAtIndex(idx) {#get-chat-message-at-index}

**Status:** stable

**Description:**
Retrieves a chat message by its position in history, where index 1 returns the newest message.

**Parameters:**
- `idx` (number): History index (1 = newest, MAX_CHAT_HISTORY = oldest)

**Returns:**
- (table): Chat message object, or nil if no message exists at index

**Example:**
```lua
-- Get most recent message
local latest = ChatHistory:GetChatMessageAtIndex(1)
if latest then
    print("Latest message:", latest.message)
end

-- Display recent chat history
for i = 1, 10 do
    local msg = ChatHistory:GetChatMessageAtIndex(i)
    if msg then
        print(string.format("[%d] %s: %s", i, msg.sender or "System", msg.message))
    end
end
```

##### GenerateChatMessage(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context) {#generate-chat-message}

**Status:** stable

**Description:**
Creates a formatted chat message object without adding it to history. Applies word filtering and color formatting.

**Parameters:**
- Same as AddToHistory method

**Returns:**
- (table): Formatted chat message with all display properties

**Example:**
```lua
-- Generate message object for processing
local msgObj = ChatHistory:GenerateChatMessage(
    ChatTypes.Announcement,
    nil, nil, nil,
    "Server restart in 5 minutes",
    ANNOUNCEMENT_COLOR,
    nil, false, false, nil
)
```

##### OnSay(guid, userid, netid, name, prefab, message, colour, whisper, isemote, user_vanity) {#on-say}

**Status:** stable

**Description:**
Handles regular player chat messages and emotes with distance-based filtering for whispers.

**Parameters:**
- `guid` (number): Entity GUID of the speaker
- `userid` (string): Player user ID
- `netid` (number): Network ID of the player
- `name` (string): Player display name
- `prefab` (string): Character prefab name
- `message` (string): Chat message content
- `colour` (table): Message color data
- `whisper` (boolean): Is whisper message
- `isemote` (boolean): Is emote action
- `user_vanity` (table): Vanity items data

**Example:**
```lua
-- Typically called by network events
ChatHistory:OnSay(
    player.GUID,
    player.userid,
    player.Network:GetNetworkID(),
    player:GetDisplayName(),
    player.prefab,
    "Hello world!",
    player.chat_colour,
    false,  -- Not whisper
    false,  -- Not emote
    player.vanity_items
)
```

##### OnAnnouncement(message, colour, announce_type) {#on-announcement}

**Status:** stable

**Description:**
Handles server announcements with special formatting and color coding.

**Parameters:**
- `message` (string): Announcement message text
- `colour` (table): Message color data
- `announce_type` (string): Type of announcement for icon display

**Example:**
```lua
-- Add server announcement
ChatHistory:OnAnnouncement(
    "Welcome to the server!",
    ANNOUNCEMENT_COLOR,
    ANNOUNCE_TYPE.GENERAL
)
```

##### OnSystemMessage(message) {#on-system-message}

**Status:** stable

**Description:**
Adds system-generated messages with standard formatting.

**Parameters:**
- `message` (string): System message content

**Example:**
```lua
-- Add system notification
ChatHistory:OnSystemMessage("Player Wilson has joined the game")
```

##### OnChatterMessage(inst, name_colour, message, colour, user_vanity, user_vanity_bg, priority) {#on-chatter-message}

**Status:** stable

**Description:**
Handles NPC and creature chatter with duplicate filtering and priority-based display control.

**Parameters:**
- `inst` (Entity): Creature/NPC entity instance
- `name_colour` (table): Name display color
- `message` (string): Chatter message text
- `colour` (table): Message color data
- `user_vanity` (string): Icon data for the creature
- `user_vanity_bg` (string): Icon background data
- `priority` (number): Chat priority level for filtering

**Example:**
```lua
-- Add creature chatter
local spider = GetClosestInstWithTag("spider", ThePlayer, 10)
if spider then
    ChatHistory:OnChatterMessage(
        spider,
        MONSTER_NAME_COLOR,
        "*chittering sounds*",
        MONSTER_CHAT_COLOR,
        "spider_icon",
        "dark_bg",
        1  -- Low priority
    )
end
```

##### AddChatHistoryListener(fn) {#add-chat-history-listener}

**Status:** stable

**Description:**
Registers a callback function to receive notifications when new chat messages are added.

**Parameters:**
- `fn` (function): Callback function that receives chat message objects

**Example:**
```lua
-- Register UI update listener
local function UpdateChatUI(chatMessage)
    if chatMessage.type == ChatTypes.Message then
        print(string.format("%s says: %s", chatMessage.sender, chatMessage.message))
    end
end

ChatHistory:AddChatHistoryListener(UpdateChatUI)
```

##### RemoveChatHistoryListener(fn) {#remove-chat-history-listener}

**Status:** stable

**Description:**
Unregisters a chat message listener to prevent memory leaks.

**Parameters:**
- `fn` (function): Previously registered callback function

**Example:**
```lua
-- Clean up listener when UI is destroyed
ChatHistory:RemoveChatHistoryListener(UpdateChatUI)
```

##### SendCommandResponse(messages) {#send-command-response}

**Status:** stable

**Description:**
Adds command response messages to chat history, supporting both single strings and arrays.

**Parameters:**
- `messages` (string/table): Single message or array of messages

**Example:**
```lua
-- Single response
ChatHistory:SendCommandResponse("Current day: " .. TheWorld.state.cycles)

-- Multiple responses  
ChatHistory:SendCommandResponse({
    "Command executed successfully",
    "Result: 42 items processed"
})
```

##### RequestChatHistory() {#request-chat-history}

**Status:** stable

**Description:**
Requests chat history from server when joining a game session for synchronization.

**Example:**
```lua
-- Automatically called when joining server
ChatHistory:RequestChatHistory()
```

##### SendChatHistory(userid, last_message_hash, first_message_hash) {#send-chat-history}

**Status:** stable

**Description:**
Sends chat history to a requesting client with hash-based deduplication (server-side).

**Parameters:**
- `userid` (string): Target user ID to send history to
- `last_message_hash` (number): Hash of the last message client has
- `first_message_hash` (number): Hash of the first message client has

##### RecieveChatHistory(chat_history) {#receive-chat-history}

**Status:** stable

**Description:**
Receives and processes compressed chat history from server (client-side).

**Parameters:**
- `chat_history` (string): Compressed and encoded chat history data

##### GetChatHistory() {#get-chat-history}

**Status:** stable

**Description:**
Serializes current chat history for saving to disk with compression.

**Returns:**
- (string): Compressed and encoded chat history data

**Example:**
```lua
-- Save chat history (typically in save system)
local historyData = ChatHistory:GetChatHistory()
-- Store historyData in save file
```

##### SetChatHistory(history) {#set-chat-history}

**Status:** stable

**Description:**
Loads chat history from saved data with decompression and validation.

**Parameters:**
- `history` (string): Compressed chat history data from save file

**Example:**
```lua
-- Load chat history on game start
if savedData.chatHistory then
    ChatHistory:SetChatHistory(savedData.chatHistory)
end
```

##### HasHistory() {#has-history}

**Status:** stable

**Description:**
Checks if any chat messages exist in the history buffer.

**Returns:**
- (boolean): True if history contains messages, false otherwise

**Example:**
```lua
-- Check if chat UI should be visible
if ChatHistory:HasHistory() then
    ShowChatPanel()
end
```

##### JoinServer() {#join-server}

**Status:** stable

**Description:**
Sets flag indicating player is joining server to prevent message processing during synchronization.

**Example:**
```lua
-- Called when starting to join a server
ChatHistory:JoinServer()
```

##### GetDisplayName(name, prefab) {#get-display-name}

**Status:** stable

**Description:**
Sanitizes and formats display names for chat, providing fallback for empty names.

**Parameters:**
- `name` (string): Player name to sanitize
- `prefab` (string): Character prefab name

**Returns:**
- (string): Sanitized display name or fallback text

**Example:**
```lua
local displayName = ChatHistory:GetDisplayName(player.name, player.prefab)
```

##### GetLastDeletedChatMessage() {#get-last-deleted-chat-message}

**Status:** stable

**Description:**
Returns the message that was overwritten when the circular buffer wrapped around.

**Returns:**
- (table): Last overwritten chat message object, or nil

**Example:**
```lua
-- Check what message was lost due to buffer overflow
local deleted = ChatHistory:GetLastDeletedChatMessage()
if deleted then
    print("Oldest message was deleted:", deleted.message)
end
```

## Message Object Structure

Chat message objects contain the following fields:

```lua
{
    type = ChatTypes.Message,           -- Message type from ChatTypes enum
    sender = "Wilson",                  -- Sender display name
    sender_userid = "player123",        -- Sender user ID  
    sender_netid = 456,                 -- Sender network ID
    message = "Hello everyone!",        -- Message content
    s_colour = {1, 1, 1, 1},           -- Sender name color (RGBA)
    m_colour = {0.8, 0.8, 0.8, 1},     -- Message text color (RGBA)
    icondata = "default",               -- Profile icon identifier
    icondatabg = "bg_default",          -- Icon background identifier
    localonly = false,                  -- Local-only message flag
    text_filter_context = TEXT_FILTER_CTX_CHAT  -- Word filter context
}
```

## Global Instance

### ChatHistory

**Status:** stable

**Description:** Global singleton instance of ChatHistoryManager available throughout the game.

**Example:**
```lua
-- Global access to chat history system
ChatHistory:OnSystemMessage("Game started")
local recentMessage = ChatHistory:GetChatMessageAtIndex(1)
```

## Common Uses

### Basic Chat System Integration
```lua
-- Initialize chat system with listeners
local function SetupChatSystem()
    local function OnChatMessage(chatMsg)
        -- Update UI with new message
        local chatPanel = ThePlayer.HUD.ChatPanel
        if chatPanel then
            chatPanel:AddMessage(chatMsg)
        end
        
        -- Log important messages
        if chatMsg.type == ChatTypes.Announcement then
            print("ANNOUNCEMENT:", chatMsg.message)
        end
    end
    
    ChatHistory:AddChatHistoryListener(OnChatMessage)
end
```

### NPC Chatter with Filtering
```lua
-- Add creature chatter with proper filtering
local function AddCreatureChatter(creature, message, priority)
    if not creature or not creature:IsValid() then
        return
    end
    
    -- Check if chatter is enabled in settings
    if not Profile:GetNPCChatEnabled() then
        return
    end
    
    -- Check priority level against user preferences
    priority = priority or 0
    if Profile:GetNPCChatLevel() > priority then
        return
    end
    
    ChatHistory:OnChatterMessage(
        creature,
        CREATURE_NAME_COLOR,
        message,
        CREATURE_CHAT_COLOR,
        nil,  -- No vanity icon
        nil,  -- No background
        priority
    )
end
```

### Chat History Display
```lua
-- Display recent chat messages
local function ShowRecentChat(numMessages)
    numMessages = numMessages or 10
    
    print("=== Recent Chat History ===")
    for i = 1, numMessages do
        local msg = ChatHistory:GetChatMessageAtIndex(i)
        if not msg then break end
        
        local sender = msg.sender or "System"
        local content = msg.message
        
        if msg.type == ChatTypes.Emote then
            print("* " .. content)
        elseif msg.type == ChatTypes.Announcement then
            print("[ANNOUNCEMENT] " .. content)
        else
            print(sender .. ": " .. content)
        end
    end
end
```

## Related Modules

- [Networking](mdc:dst-api-webdocs/docs/game-scripts/core-systems/networking.md): Message synchronization and RPC calls
- [UI Widgets](mdc:dst-api-webdocs/docs/game-scripts/widgets/): Chat display widgets and panels
- [Text Filtering](mdc:dst-api-webdocs/docs/game-scripts/core-systems/text-filtering.md): Content moderation system
- [Player Management](mdc:dst-api-webdocs/docs/game-scripts/core-systems/player-management.md): Player identification
- [Save System](mdc:dst-api-webdocs/docs/game-scripts/core-systems/save-system.md): Chat history persistence
