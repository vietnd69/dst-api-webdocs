---
title: "ChatHistory"
description: "Chat history management system for storing, synchronizing, and filtering chat messages"
sidebar_position: 10
slug: /api-vanilla/core-systems/chathistory
last_updated: "2024-01-15"
build_version: "675312"
change_status: "stable"
---

# ChatHistory System

The **ChatHistory** system manages chat message storage, synchronization, and filtering in Don't Starve Together. It provides a circular buffer for chat messages, network synchronization between clients and server, word filtering, and support for multiple chat types including player messages, emotes, announcements, and NPC chatter.

## Overview

The ChatHistoryManager class implements a sophisticated chat system that handles message storage with a circular buffer, network synchronization for joining players, word filtering for appropriate content, and listener notifications for UI updates. It supports various chat types and provides efficient duplicate filtering for NPC chatter.

## Version History

| Version | Changes | Status |
|---------|---------|--------|
| 675312  | Current stable implementation | 🟢 **Stable** |
| Earlier | Initial chat history implementation | - |

## Constants

### Chat Limits
```lua
MAX_CHAT_HISTORY = 100  -- Maximum messages stored in history
NPC_CHATTER_MAX_CHAT_NO_DUPES = 20  -- Range for duplicate filtering of NPC messages
```

### ChatTypes Enumeration
```lua
ChatTypes = {
    Message = 1,           -- Regular player chat messages
    Emote = 2,            -- Player emote actions
    Announcement = 3,      -- Server announcements
    SkinAnnouncement = 4,  -- Skin unlock announcements
    SystemMessage = 5,     -- System-generated messages
    CommandResponse = 6,   -- Responses to admin commands
    ChatterMessage = 7,    -- NPC/creature chatter (client-side only)
}
```

## Core Class: ChatHistoryManager

### Constructor
```lua
ChatHistoryManager = Class(function(self)
```

Creates a new chat history manager with:
- Empty listener table for UI notifications
- Circular message buffer
- History start index tracking
- Request history management for joining players

## Core Methods

### Message Addition

#### AddToHistory(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context)
Adds a new chat message to the history buffer.

```lua
function ChatHistoryManager:AddToHistory(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context) -> table
```

**Parameters:**
- `type` (number): Chat type from ChatTypes enum
- `sender_userid` (string): Unique user identifier
- `sender_netid` (number): Network entity ID
- `sender_name` (string): Display name of sender
- `message` (string): Chat message content
- `colour` (table): Color data for message display
- `icondata` (string/table): Profile icon or vanity data
- `whisper` (boolean): Whether message is a whisper
- `localonly` (boolean): Whether message stays on local client
- `text_filter_context` (number): Context for word filtering

**Returns:**
- `table`: Generated chat message object, or nil if filtered out

**Usage:**
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

#### GenerateChatMessage(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context)
Creates a formatted chat message object without adding to history.

```lua
function ChatHistoryManager:GenerateChatMessage(type, sender_userid, sender_netid, sender_name, message, colour, icondata, whisper, localonly, text_filter_context) -> table
```

**Returns:**
- `table`: Formatted chat message with all display properties

**Usage:**
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

### Message Retrieval

#### GetChatMessageAtIndex(idx)
Retrieves a chat message by its position in history.

```lua
function ChatHistoryManager:GetChatMessageAtIndex(idx) -> table
```

**Parameters:**
- `idx` (number): History index (1 = newest, MAX_CHAT_HISTORY = oldest)

**Returns:**
- `table`: Chat message object, or nil if no message at index

**Usage:**
```lua
-- Get most recent message
local latest = ChatHistory:GetChatMessageAtIndex(1)
if latest then
    print("Latest message:", latest.message)
end

-- Get older messages
for i = 1, 10 do
    local msg = ChatHistory:GetChatMessageAtIndex(i)
    if msg then
        print(string.format("[%d] %s: %s", i, msg.sender or "System", msg.message))
    end
end
```

#### GetLastDeletedChatMessage()
Returns the message that was overwritten when the circular buffer wrapped.

```lua
function ChatHistoryManager:GetLastDeletedChatMessage() -> table
```

**Usage:**
```lua
-- Check what message was lost due to buffer overflow
local deleted = ChatHistory:GetLastDeletedChatMessage()
if deleted then
    print("Oldest message was deleted:", deleted.message)
end
```

### Chat Type Handlers

#### OnSay(guid, userid, netid, name, prefab, message, colour, whisper, isemote, user_vanity)
Handles regular player chat messages and emotes.

```lua
function ChatHistoryManager:OnSay(guid, userid, netid, name, prefab, message, colour, whisper, isemote, user_vanity)
```

**Parameters:**
- `guid` (number): Entity GUID
- `userid` (string): Player user ID
- `netid` (number): Network ID
- `name` (string): Player name
- `prefab` (string): Character prefab
- `message` (string): Chat message
- `colour` (table): Message color
- `whisper` (boolean): Is whisper message
- `isemote` (boolean): Is emote action
- `user_vanity` (table): Vanity items data

**Usage:**
```lua
-- Called automatically by network events
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

#### OnAnnouncement(message, colour, announce_type)
Handles server announcements.

```lua
function ChatHistoryManager:OnAnnouncement(message, colour, announce_type)
```

**Usage:**
```lua
-- Add server announcement
ChatHistory:OnAnnouncement(
    "Welcome to the server!",
    ANNOUNCEMENT_COLOR,
    ANNOUNCE_TYPE.GENERAL
)
```

#### OnChatterMessage(inst, name_colour, message, colour, user_vanity, user_vanity_bg, priority)
Handles NPC and creature chatter with duplicate filtering.

```lua
function ChatHistoryManager:OnChatterMessage(inst, name_colour, message, colour, user_vanity, user_vanity_bg, priority)
```

**Parameters:**
- `inst` (Entity): Creature/NPC entity
- `name_colour` (table): Name display color
- `message` (string): Chatter message
- `colour` (table): Message color
- `user_vanity` (string): Icon data
- `user_vanity_bg` (string): Icon background
- `priority` (number): Chat priority level

**Usage:**
```lua
-- Add creature chatter (typically called by creature AI)
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

#### OnSystemMessage(message)
Adds system-generated messages.

```lua
function ChatHistoryManager:OnSystemMessage(message)
```

**Usage:**
```lua
-- Add system notification
ChatHistory:OnSystemMessage("Player Wilson has joined the game")
```

### Listener Management

#### AddChatHistoryListener(fn)
Registers a callback function to receive chat message notifications.

```lua
function ChatHistoryManager:AddChatHistoryListener(fn)
```

**Parameters:**
- `fn` (function): Callback function that receives chat message objects

**Usage:**
```lua
-- Register UI update listener
local function UpdateChatUI(chatMessage)
    if chatMessage.type == ChatTypes.Message then
        print(string.format("%s says: %s", 
                          chatMessage.sender, 
                          chatMessage.message))
    end
end

ChatHistory:AddChatHistoryListener(UpdateChatUI)
```

#### RemoveChatHistoryListener(fn)
Unregisters a chat message listener.

```lua
function ChatHistoryManager:RemoveChatHistoryListener(fn)
```

**Usage:**
```lua
-- Clean up listener when UI is destroyed
ChatHistory:RemoveChatHistoryListener(UpdateChatUI)
```

### Network Synchronization

#### RequestChatHistory()
Requests chat history from server when joining a game.

```lua
function ChatHistoryManager:RequestChatHistory()
```

**Usage:**
```lua
-- Automatically called when joining server
-- Players will receive recent chat history
ChatHistory:RequestChatHistory()
```

#### SendChatHistory(userid, last_message_hash, first_message_hash)
Sends chat history to a requesting client (server-side).

```lua
function ChatHistoryManager:SendChatHistory(userid, last_message_hash, first_message_hash)
```

#### RecieveChatHistory(chat_history)
Receives and processes chat history from server (client-side).

```lua
function ChatHistoryManager:RecieveChatHistory(chat_history)
```

### Save/Load System

#### GetChatHistory()
Serializes chat history for saving.

```lua
function ChatHistoryManager:GetChatHistory() -> string
```

**Returns:**
- `string`: Compressed and encoded chat history data

**Usage:**
```lua
-- Save chat history (typically in save system)
local historyData = ChatHistory:GetChatHistory()
-- Store historyData in save file
```

#### SetChatHistory(history)
Loads chat history from saved data.

```lua
function ChatHistoryManager:SetChatHistory(history)
```

**Parameters:**
- `history` (string): Compressed chat history data

**Usage:**
```lua
-- Load chat history on game start
if savedData.chatHistory then
    ChatHistory:SetChatHistory(savedData.chatHistory)
end
```

### Utility Methods

#### HasHistory()
Checks if any chat messages exist in history.

```lua
function ChatHistoryManager:HasHistory() -> boolean
```

**Usage:**
```lua
-- Check if chat UI should be visible
if ChatHistory:HasHistory() then
    ShowChatPanel()
end
```

#### JoinServer()
Marks that the player is joining a server (prevents message processing during join).

```lua
function ChatHistoryManager:JoinServer()
```

#### GetDisplayName(name, prefab)
Sanitizes display names for chat.

```lua
function ChatHistoryManager:GetDisplayName(name, prefab) -> string
```

## Message Object Structure

Chat message objects contain the following fields:

```lua
{
    type = ChatTypes.Message,           -- Message type
    sender = "Wilson",                  -- Sender display name
    sender_userid = "player123",        -- Sender user ID
    sender_netid = 456,                -- Sender network ID
    message = "Hello everyone!",        -- Message content
    s_colour = {1, 1, 1, 1},          -- Sender name color
    m_colour = {0.8, 0.8, 0.8, 1},    -- Message text color
    icondata = "default",              -- Profile icon
    icondatabg = "bg_default",         -- Icon background
    localonly = false,                 -- Local-only flag
    text_filter_context = TEXT_FILTER_CTX_CHAT  -- Filter context
}
```

## Usage Examples

### Basic Chat System Setup
```lua
-- Initialize chat system listeners
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

### Chat History Display
```lua
-- Display recent chat history
local function ShowRecentChat(numMessages)
    numMessages = numMessages or 10
    
    print("=== Recent Chat History ===")
    for i = 1, numMessages do
        local msg = ChatHistory:GetChatMessageAtIndex(i)
        if not msg then break end
        
        local timestamp = os.date("%H:%M:%S")
        local sender = msg.sender or "System"
        local content = msg.message
        
        if msg.type == ChatTypes.Emote then
            print(string.format("[%s] * %s", timestamp, content))
        elseif msg.type == ChatTypes.Announcement then
            print(string.format("[%s] [ANNOUNCEMENT] %s", timestamp, content))
        else
            print(string.format("[%s] %s: %s", timestamp, sender, content))
        end
    end
end
```

### Custom Chat Commands
```lua
-- Add command response to chat
local function HandleChatCommand(command, args)
    local response = ""
    
    if command == "time" then
        response = "Current day: " .. TheWorld.state.cycles
    elseif command == "players" then
        local count = #AllPlayers
        response = string.format("Players online: %d", count)
    else
        response = "Unknown command: " .. command
    end
    
    ChatHistory:SendCommandResponse(response)
end
```

### NPC Chatter Integration
```lua
-- Add creature chatter with proper filtering
local function AddCreatureChatter(creature, message, priority)
    if not creature or not creature:IsValid() then
        return
    end
    
    -- Check if chatter is enabled
    if not Profile:GetNPCChatEnabled() then
        return
    end
    
    -- Check priority level
    priority = priority or 0
    if Profile:GetNPCChatLevel() > priority then
        return
    end
    
    local name_colour = CREATURE_NAME_COLORS[creature.prefab] or DEFAULT_CREATURE_COLOR
    local msg_colour = CREATURE_CHAT_COLORS[creature.prefab] or DEFAULT_CHAT_COLOR
    
    ChatHistory:OnChatterMessage(
        creature,
        name_colour,
        message,
        msg_colour,
        nil,  -- No vanity icon
        nil,  -- No background
        priority
    )
end
```

### Message Filtering and Moderation
```lua
-- Example of message filtering integration
local function FilterChatMessage(chatMsg)
    -- Check for inappropriate content
    if chatMsg.text_filter_context then
        local filtered = ApplyLocalWordFilter(
            chatMsg.message, 
            chatMsg.text_filter_context, 
            chatMsg.sender_netid
        )
        
        if filtered ~= chatMsg.message then
            print("Message was filtered for player:", chatMsg.sender)
            chatMsg.message = filtered
        end
    end
    
    -- Additional custom filtering
    if string.find(chatMsg.message:lower(), "spam") then
        -- Handle spam detection
        return false  -- Block message
    end
    
    return true  -- Allow message
end
```

## Best Practices

### Performance Optimization
- **Listener Management**: Remove listeners when UI components are destroyed
- **Message Filtering**: Use appropriate priority levels for NPC chatter to reduce spam
- **History Limits**: The circular buffer automatically manages memory usage
- **Network Efficiency**: Only sync necessary messages for joining players

### Message Handling
- **Type Checking**: Always check message type before special processing
- **Color Consistency**: Use standard color schemes for different message types
- **Icon Management**: Provide fallback icons for missing vanity items
- **Text Filtering**: Apply appropriate filtering contexts for content moderation

### Network Considerations
- **Join Timing**: Handle the join server flag to prevent message duplication
- **Local Messages**: Use local-only flag for client-side notifications
- **Compression**: History data is automatically compressed for network efficiency
- **Sync Safety**: Network sync handles hash-based deduplication

## Common Patterns

### Safe Message Addition
```lua
local function SafeAddMessage(type, sender, message, colour)
    if not ChatHistory or not message or message == "" then
        return
    end
    
    colour = colour or DEFAULT_CHAT_COLOR
    
    ChatHistory:AddToHistory(
        type,
        nil,  -- No user ID for system messages
        nil,  -- No net ID
        sender,
        message,
        colour,
        nil,  -- No icon
        false,  -- Not whisper
        true,  -- Local only
        nil   -- No filtering needed
    )
end
```

### Message Type Utilities
```lua
local function IsPlayerMessage(chatMsg)
    return chatMsg.type == ChatTypes.Message or chatMsg.type == ChatTypes.Emote
end

local function IsSystemMessage(chatMsg)
    return chatMsg.type == ChatTypes.Announcement or 
           chatMsg.type == ChatTypes.SystemMessage or
           chatMsg.type == ChatTypes.CommandResponse
end

local function IsNPCMessage(chatMsg)
    return chatMsg.type == ChatTypes.ChatterMessage
end
```

## Related Systems

- **[Networking](../networking.md)**: Message synchronization and RPC calls
- **[Text Filtering](../text-filtering.md)**: Content moderation and word filtering
- **[UI System](../../widgets/)**: Chat display widgets and panels
- **[Player Management](../player-management.md)**: Player identification and display names
- **[Save System](../save-system.md)**: Chat history persistence
- **[Localization](../localization.md)**: Message text localization

## Technical Notes

- **Circular Buffer**: Uses modular arithmetic for efficient memory management
- **Thread Safety**: Single-threaded design, not thread-safe
- **Memory Usage**: Automatically limits memory through message count caps
- **Compression**: Uses ZIP compression for save data and network sync
- **Hash-based Sync**: Prevents duplicate messages during network synchronization
- **Word Filtering**: Integrates with game's content filtering system

## Troubleshooting

### Messages Not Appearing
- Verify listeners are properly registered
- Check if join server flag is preventing message processing
- Ensure message type is supported by UI system
- Validate color data is properly formatted

### Network Sync Issues
- Confirm RPC handlers are properly registered
- Check network connectivity between client and server
- Verify hash-based deduplication is working correctly
- Ensure compressed data is not corrupted

### Performance Problems
- Remove unused listeners to prevent memory leaks
- Adjust NPC chatter priority levels to reduce spam
- Monitor circular buffer wraparound for excessive message volume
- Check word filtering performance with large messages

### Save/Load Errors
- Verify save data format matches expected structure
- Check compression/decompression integrity
- Ensure proper error handling for corrupted save data
- Validate history indices after loading
