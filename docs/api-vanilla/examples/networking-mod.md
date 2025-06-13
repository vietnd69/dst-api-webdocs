---
id: networking-mod
title: Networking and Multiplayer
sidebar_position: 9
---

# Networking and Multiplayer

This tutorial walks through creating mods that handle networking and multiplayer functionality in Don't Starve Together. We'll build a mod that synchronizes custom data between clients and the server.

## Project Overview

We'll create a mod that adds a "Player Notes" system with:
- Ability to write notes that are visible to all players
- Real-time synchronization of note data between clients
- Proper handling of player join/leave events
- Network-efficient updates using RPC calls

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
playernotes_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── components/
│   │   └── playernotes.lua
│   ├── screens/
│   │   └── playernotescreen.lua
│   └── widgets/
│       └── playernotesui.lua
└── images/
    └── notes_assets.tex
    └── notes_assets.xml
```

## Step 2: Create the modinfo.lua File

```lua
name = "Player Notes"
description = "Add shareable notes between players"
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true

-- Not compatible with Don't Starve
dont_starve_compatible = false
reign_of_giants_compatible = false

-- This mod is required on all clients
all_clients_require_mod = true

-- This mod is not a client-only mod
client_only_mod = false

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags that describe your mod
server_filter_tags = {
    "utility",
    "multiplayer"
}

-- Configuration options
configuration_options = {
    {
        name = "max_note_length",
        label = "Max Note Length",
        options = {
            {description = "Short (100 chars)", data = 100},
            {description = "Medium (250 chars)", data = 250},
            {description = "Long (500 chars)", data = 500}
        },
        default = 250
    },
    {
        name = "note_history",
        label = "Note History",
        options = {
            {description = "Keep 5 notes", data = 5},
            {description = "Keep 10 notes", data = 10},
            {description = "Keep 20 notes", data = 20}
        },
        default = 10
    }
}
```

## Step 3: Create the Player Notes Component

Create `scripts/components/playernotes.lua`:

```lua
local PlayerNotes = Class(function(self, inst)
    self.inst = inst
    self.notes = {}
    self.max_notes = GetModConfigData("note_history") or 10
    self.max_note_length = GetModConfigData("max_note_length") or 250
    
    -- Initialize network variables
    self.net_dirty = false
    
    if TheWorld.ismastersim then
        -- Server-side initialization
        self.inst:DoTaskInTime(0, function() self:SyncNotes() end)
        
        -- Listen for player join events to sync notes
        self.inst:ListenForEvent("ms_playerleft", function(world, player)
            -- When a player leaves, update the player list
            self:SyncNotes()
        end, TheWorld)
        
        self.inst:ListenForEvent("ms_playerjoined", function(world, player)
            -- When a player joins, send them the notes
            self:SyncNotes()
        end, TheWorld)
    end
end)

-- Add a new note (server-side)
function PlayerNotes:AddNote(author, content)
    if not TheWorld.ismastersim then
        -- Client should send RPC instead
        return
    end
    
    -- Sanitize and trim content
    content = content:sub(1, self.max_note_length)
    content = content:gsub("<[^>]+>", "") -- Remove HTML-like tags
    
    -- Create the note
    local note = {
        author = author,
        content = content,
        timestamp = os.time()
    }
    
    -- Add to notes list
    table.insert(self.notes, note)
    
    -- Trim list if it exceeds max_notes
    while #self.notes > self.max_notes do
        table.remove(self.notes, 1)
    end
    
    -- Mark as dirty to sync
    self.net_dirty = true
    
    -- Sync to all clients
    self:SyncNotes()
    
    return true
end

-- Sync notes to clients
function PlayerNotes:SyncNotes()
    if not TheWorld.ismastersim then
        -- Only the server should sync
        return
    end
    
    -- Reset dirty flag
    self.net_dirty = false
    
    -- Prepare data for network
    local data = {}
    for i, note in ipairs(self.notes) do
        table.insert(data, {
            author = note.author,
            content = note.content,
            timestamp = note.timestamp
        })
    end
    
    -- Serialize data
    local serialized = json.encode(data)
    
    -- Send to all clients
    for i, player in ipairs(AllPlayers) do
        if player.userid then
            SendModRPCToClient(GetClientModRPC("PlayerNotes", "SyncNotes"), player.userid, serialized)
        end
    end
end

-- Receive notes from server (client-side)
function PlayerNotes:ReceiveNotes(serialized)
    if TheWorld.ismastersim then
        -- Server shouldn't receive notes
        return
    end
    
    -- Deserialize data
    local success, data = pcall(function() return json.decode(serialized) end)
    
    if success and data then
        self.notes = data
        
        -- Notify UI to update
        self.inst:PushEvent("noteschanged", { notes = self.notes })
    end
end

-- Get all notes
function PlayerNotes:GetNotes()
    return self.notes
end

-- Clear all notes (server-side)
function PlayerNotes:ClearNotes()
    if not TheWorld.ismastersim then
        -- Client should send RPC instead
        return
    end
    
    self.notes = {}
    self.net_dirty = true
    self:SyncNotes()
    
    return true
end

return PlayerNotes
```

## Step 4: Create the Notes UI Widget

Create `scripts/widgets/playernotesui.lua`:

```lua
local Widget = require "widgets/widget"
local Image = require "widgets/image"
local Text = require "widgets/text"
local TextEdit = require "widgets/textedit"
local ScrollableList = require "widgets/scrollablelist"
local Button = require "widgets/button"

-- Define our custom widget
local PlayerNotesUI = Class(Widget, function(self, owner)
    -- Call the parent constructor
    Widget._ctor(self, "PlayerNotesUI")
    
    -- Store reference to the player
    self.owner = owner
    
    -- Initialize widget
    self:SetupUI()
    
    -- Listen for note changes
    self.owner:ListenForEvent("noteschanged", function(inst, data) 
        self:RefreshNotes(data.notes)
    end)
end)

-- Set up the UI elements
function PlayerNotesUI:SetupUI()
    -- Create the background panel
    self.bg = self:AddChild(Image("images/notes_assets.xml", "notes_bg.tex"))
    self.bg:SetSize(500, 400)
    
    -- Add title
    self.title = self:AddChild(Text(TITLEFONT, 30))
    self.title:SetPosition(0, 170, 0)
    self.title:SetString("Player Notes")
    self.title:SetColour(1, 1, 1, 1)
    
    -- Add close button
    self.close_btn = self:AddChild(ImageButton("images/notes_assets.xml", "close_button.tex"))
    self.close_btn:SetPosition(230, 170, 0)
    self.close_btn:SetOnClick(function() self:Hide() end)
    
    -- Create notes list container
    self.notes_root = self:AddChild(Widget("notes_root"))
    self.notes_root:SetPosition(0, 30, 0)
    
    -- Create text entry for new notes
    self.note_entry = self:AddChild(TextEdit(CHATFONT, 20, ""))
    self.note_entry:SetPosition(0, -140, 0)
    self.note_entry:SetForceEdit(true)
    self.note_entry:SetCharacterLimit(GetModConfigData("max_note_length") or 250)
    self.note_entry:SetWidth(400)
    self.note_entry:SetHeight(60)
    
    -- Add submit button
    self.submit_btn = self:AddChild(ImageButton("images/notes_assets.xml", "submit_button.tex"))
    self.submit_btn:SetPosition(200, -140, 0)
    self.submit_btn:SetOnClick(function() self:SubmitNote() end)
    
    -- Add clear button
    self.clear_btn = self:AddChild(ImageButton("images/notes_assets.xml", "clear_button.tex"))
    self.clear_btn:SetPosition(-200, -140, 0)
    self.clear_btn:SetOnClick(function() self:ClearNotes() end)
    
    -- Hide by default
    self:Hide()
end

-- Submit a new note
function PlayerNotesUI:SubmitNote()
    local content = self.note_entry:GetString()
    
    if content and content:len() > 0 then
        -- Send RPC to server
        SendModRPCToServer(GetModRPC("PlayerNotes", "AddNote"), content)
        
        -- Clear the input
        self.note_entry:SetString("")
    end
end

-- Clear all notes
function PlayerNotesUI:ClearNotes()
    -- Send RPC to server
    SendModRPCToServer(GetModRPC("PlayerNotes", "ClearNotes"))
end

-- Refresh the notes display
function PlayerNotesUI:RefreshNotes(notes)
    -- Clear existing notes
    self.notes_root:KillAllChildren()
    
    -- No notes to display
    if not notes or #notes == 0 then
        local empty_text = self.notes_root:AddChild(Text(CHATFONT, 20))
        empty_text:SetString("No notes yet. Be the first to add one!")
        empty_text:SetPosition(0, 0, 0)
        return
    end
    
    -- Create scrollable list
    local list_items = {}
    
    -- Create items for each note
    for i, note in ipairs(notes) do
        local item = Widget("note_item_" .. i)
        
        -- Format timestamp
        local timestamp = note.timestamp and os.date("%Y-%m-%d %H:%M", note.timestamp) or "Unknown time"
        
        -- Add author and timestamp
        local header = item:AddChild(Text(CHATFONT, 16))
        header:SetString(note.author .. " - " .. timestamp)
        header:SetPosition(0, 15, 0)
        header:SetColour(0.7, 0.7, 1, 1)
        
        -- Add content
        local content = item:AddChild(Text(CHATFONT, 18))
        content:SetString(note.content)
        content:SetPosition(0, -10, 0)
        content:SetMultilineTruncatedString(note.content, 3, 400)
        
        -- Set item size
        item.height = 60
        
        table.insert(list_items, item)
    end
    
    -- Create scrollable list
    self.notes_list = self.notes_root:AddChild(ScrollableList(list_items, 450, 250))
    self.notes_list:SetPosition(0, 0, 0)
end

-- Toggle visibility
function PlayerNotesUI:ToggleVisibility()
    if self:IsVisible() then
        self:Hide()
    else
        self:Show()
        -- Request latest notes when showing
        if TheWorld.ismastersim then
            -- Server already has the data
            self:RefreshNotes(TheWorld.components.playernotes:GetNotes())
        else
            -- Client needs to request from server
            SendModRPCToServer(GetModRPC("PlayerNotes", "RequestNotes"))
        end
    end
end

return PlayerNotesUI
```

## Step 5: Create the Note Screen

Create `scripts/screens/playernotescreen.lua`:

```lua
local Screen = require "widgets/screen"
local PlayerNotesUI = require "widgets/playernotesui"

local PlayerNoteScreen = Class(Screen, function(self, owner)
    Screen._ctor(self, "PlayerNoteScreen")
    self.owner = owner
    
    -- Create the main UI widget
    self.notes_ui = self:AddChild(PlayerNotesUI(owner))
    self.notes_ui:SetPosition(0, 0, 0)
    
    -- Set up input handlers
    self:SetupInputHandlers()
end)

-- Set up input handlers
function PlayerNoteScreen:SetupInputHandlers()
    -- Close on ESC key
    self.cancel_handler = TheInput:AddKeyDownHandler(KEY_ESCAPE, function() 
        self:Close() 
    end)
end

-- Close the screen
function PlayerNoteScreen:Close()
    TheFrontEnd:PopScreen(self)
end

-- Clean up when the screen is removed
function PlayerNoteScreen:OnDestroy()
    if self.cancel_handler then
        self.cancel_handler:Remove()
        self.cancel_handler = nil
    end
    Screen.OnDestroy(self)
end

return PlayerNoteScreen
```

## Step 6: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- UI assets
    Asset("IMAGE", "images/notes_assets.tex"),
    Asset("ATLAS", "images/notes_assets.xml"),
}

-- Require our custom modules
local PlayerNotes = require "components/playernotes"
local PlayerNoteScreen = require "screens/playernotescreen"

-- Add custom strings
STRINGS.NAMES.PLAYERNOTES = "Player Notes"
STRINGS.UI.PLAYERNOTES = {
    TITLE = "Player Notes",
    SUBMIT = "Submit",
    CLEAR = "Clear All",
    EMPTY = "No notes yet. Be the first to add one!",
    PLACEHOLDER = "Type your note here...",
}

-- Define RPC handlers
AddModRPCHandler("PlayerNotes", "AddNote", function(player, content)
    if TheWorld.components.playernotes then
        local author = player.name or "Unknown Player"
        TheWorld.components.playernotes:AddNote(author, content)
    end
end)

AddModRPCHandler("PlayerNotes", "ClearNotes", function(player)
    if TheWorld.components.playernotes then
        TheWorld.components.playernotes:ClearNotes()
    end
end)

AddModRPCHandler("PlayerNotes", "RequestNotes", function(player)
    if TheWorld.components.playernotes then
        TheWorld.components.playernotes:SyncNotes()
    end
end)

-- Define client RPC handlers
AddClientModRPCHandler("PlayerNotes", "SyncNotes", function(serialized)
    if ThePlayer and ThePlayer.components.playernotes then
        ThePlayer.components.playernotes:ReceiveNotes(serialized)
    end
end)

-- Add the component to the world (server-side)
AddPrefabPostInit("world", function(inst)
    if TheWorld.ismastersim then
        inst:AddComponent("playernotes")
    end
end)

-- Add the component to the player (client-side)
AddPlayerPostInit(function(inst)
    if not TheWorld.ismastersim or inst == ThePlayer then
        inst:AddComponent("playernotes")
    end
    
    -- Add key handler to open notes screen (client-side only)
    if inst == ThePlayer then
        TheInput:AddKeyDownHandler(KEY_N, function()
            if not TheFrontEnd:GetActiveScreen() or TheFrontEnd:GetActiveScreen().name == "HUD" then
                TheFrontEnd:PushScreen(PlayerNoteScreen(inst))
            end
        end)
    end
end)

-- Add a button to the pause menu
AddClassPostConstruct("screens/pausescreen", function(self)
    if self.menu and self.menu.items then
        self.menu:AddItem("Player Notes", function()
            self:Close()
            TheFrontEnd:PushScreen(PlayerNoteScreen(ThePlayer))
        end, "Open shared player notes")
    end
end)

-- Print instructions when the game starts
AddSimPostInit(function()
    print("Player Notes mod loaded! Press 'N' to open the notes screen.")
end)
```

## Step 7: Create the UI Assets

For a complete mod, you'll need to create these asset files:

1. **UI Textures**: `images/notes_assets.tex` and `notes_assets.xml`
   - Contains textures for the panel background, buttons, and icons
   - Should include "notes_bg.tex", "close_button.tex", "submit_button.tex", and "clear_button.tex"

## Step 8: Testing Your Networking Mod

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new server and invite a friend to join
4. Test the networking features by:
   - Opening the notes screen with the 'N' key
   - Adding notes and verifying they appear on both clients
   - Having your friend add notes and checking that they sync to your client
   - Disconnecting and reconnecting to verify notes persist

## Understanding Networking in Don't Starve Together

DST uses a client-server architecture for networking:

### Server and Client Roles

- **Server**: Authoritative source of truth for game state
  - Runs on the host's machine or a dedicated server
  - Processes all game logic and physics
  - Sends state updates to clients

- **Client**: Displays the game state and sends player inputs
  - Receives updates from the server
  - Sends player actions to the server
  - Can run prediction for smoother gameplay

### Network Components

- **NetVars**: Synchronized variables that automatically replicate
  - Used for simple data that changes frequently
  - Examples: health, position, animation state

- **RPCs (Remote Procedure Calls)**: Function calls across the network
  - Used for events and complex data
  - Can be client-to-server or server-to-client

- **Events**: Local notifications that can trigger network updates
  - Used to respond to state changes
  - Can be used with RPCs to sync changes

### The Master Sim

Don't Starve Together uses a concept called "master simulation" (mastersim):

- `TheWorld.ismastersim` indicates if the current instance is the authoritative server
- Only the server should make authoritative changes to game state
- Clients should send requests to the server via RPCs
- The server then updates the state and broadcasts changes

## Key Networking Concepts

### 1. Server Authority

Always remember that the server is the authority. Important rules:

```lua
-- Check if we're on the server before making changes
if TheWorld.ismastersim then
    -- Make authoritative changes
    entity.components.health:SetVal(100)
else
    -- Send request to server
    SendModRPCToServer(GetModRPC("MyMod", "SetHealth"), entity, 100)
end
```

### 2. Data Synchronization

There are multiple ways to sync data:

- **NetVars**: For simple, frequently changing data
```lua
-- In component initialization
self.damage = net_float(inst.GUID, "weapon.damage", "damagechanged")

-- When setting the value (server-side)
self.damage:set(new_damage)

-- When getting the value (either side)
local current_damage = self.damage:value()

-- Listening for changes (client-side)
inst:ListenForEvent("damagechanged", OnDamageChanged)
```

- **RPCs**: For complex data or infrequent updates
```lua
-- Define the RPC handler (in modmain)
AddModRPCHandler("MyMod", "SyncData", function(player, entity_id, data_json)
    local entity = Ents[entity_id]
    if entity and entity.components.mycomponent then
        entity.components.mycomponent:ReceiveData(data_json)
    end
end)

-- Send data from server to clients
for i, player in ipairs(AllPlayers) do
    SendModRPCToClient(GetClientModRPC("MyMod", "SyncData"), player.userid, entity.GUID, json.encode(data))
end
```

### 3. Network Efficiency

Be mindful of network bandwidth:

- **Throttle Updates**: Don't send updates every frame
```lua
-- Only sync if enough time has passed
if self.last_sync_time + SYNC_INTERVAL < GetTime() then
    self:SyncToClients()
    self.last_sync_time = GetTime()
end
```

- **Delta Compression**: Only send changes, not the entire state
```lua
-- Track what has changed
self.dirty_fields = {}

-- When a field changes
function MyComponent:SetField(name, value)
    if self.fields[name] ~= value then
        self.fields[name] = value
        self.dirty_fields[name] = true
    end
end

-- When syncing
function MyComponent:SyncToClients()
    if next(self.dirty_fields) then
        -- Only send dirty fields
        SendModRPCToClient(GetClientModRPC("MyMod", "SyncFields"), player.userid, json.encode(self.dirty_fields))
        self.dirty_fields = {}
    end
end
```

### 4. Player Join/Leave Handling

Handle players joining and leaving properly:

```lua
-- Listen for player events
inst:ListenForEvent("ms_playerjoined", function(world, player)
    -- Send current state to the new player
    self:SyncToPlayer(player)
end, TheWorld)

inst:ListenForEvent("ms_playerleft", function(world, player)
    -- Clean up any player-specific data
    self.player_data[player.userid] = nil
    -- Notify remaining players
    self:BroadcastPlayerLeft(player)
end, TheWorld)
```

## Customization Options

Here are some ways to enhance your networking mod:

### Add Player-Specific Data

```lua
-- In the component, store player-specific data
function PlayerNotes:InitializePlayer(player)
    if not self.player_data then
        self.player_data = {}
    end
    
    self.player_data[player.userid] = {
        last_read_note = 0,
        favorite_notes = {}
    }
end

-- Add functions to work with player data
function PlayerNotes:MarkNoteAsFavorite(player, note_id, is_favorite)
    if not self.player_data[player.userid] then
        self:InitializePlayer(player)
    end
    
    if is_favorite then
        table.insert(self.player_data[player.userid].favorite_notes, note_id)
    else
        for i, id in ipairs(self.player_data[player.userid].favorite_notes) do
            if id == note_id then
                table.remove(self.player_data[player.userid].favorite_notes, i)
                break
            end
        end
    end
    
    -- Sync this player's favorites
    self:SyncPlayerData(player)
end
```

### Add Real-Time Collaboration

```lua
-- Add a "currently typing" indicator
function PlayerNotesUI:StartTyping()
    -- Send RPC to server
    SendModRPCToServer(GetModRPC("PlayerNotes", "PlayerTyping"), true)
end

function PlayerNotesUI:StopTyping()
    -- Send RPC to server
    SendModRPCToServer(GetModRPC("PlayerNotes", "PlayerTyping"), false)
end

-- In the component, track who's typing
function PlayerNotes:SetPlayerTyping(player, is_typing)
    if not self.typing_players then
        self.typing_players = {}
    end
    
    if is_typing then
        self.typing_players[player.userid] = player.name
    else
        self.typing_players[player.userid] = nil
    end
    
    -- Broadcast typing status to all players
    self:BroadcastTypingStatus()
end

-- Add a visual indicator in the UI
function PlayerNotesUI:UpdateTypingIndicator(typing_players)
    if not self.typing_indicator then
        self.typing_indicator = self:AddChild(Text(CHATFONT, 16))
        self.typing_indicator:SetPosition(0, -170, 0)
        self.typing_indicator:SetColour(0.7, 0.7, 0.7, 1)
    end
    
    local names = {}
    for userid, name in pairs(typing_players) do
        table.insert(names, name)
    end
    
    if #names > 0 then
        self.typing_indicator:SetString(table.concat(names, ", ") .. " typing...")
        self.typing_indicator:Show()
    else
        self.typing_indicator:Hide()
    end
end
```

### Add Data Persistence

```lua
-- In the component, add save/load functions
function PlayerNotes:OnSave()
    return {
        notes = self.notes
    }
end

function PlayerNotes:OnLoad(data)
    if data and data.notes then
        self.notes = data.notes
        self.net_dirty = true
    end
end

-- Add to world entity
AddPrefabPostInit("world", function(inst)
    if TheWorld.ismastersim then
        inst:AddComponent("playernotes")
        
        -- Add save/load hooks
        local old_OnSave = inst.OnSave
        inst.OnSave = function(inst, data)
            if old_OnSave then
                old_OnSave(inst, data)
            end
            
            data.playernotes = inst.components.playernotes:OnSave()
        end
        
        local old_OnLoad = inst.OnLoad
        inst.OnLoad = function(inst, data)
            if old_OnLoad then
                old_OnLoad(inst, data)
            end
            
            if data and data.playernotes and inst.components.playernotes then
                inst.components.playernotes:OnLoad(data.playernotes)
            end
        end
    end
end)
```

## Common Issues and Solutions

### Problem: Data not syncing between clients
**Solution**: Make sure you're checking TheWorld.ismastersim correctly and using RPCs properly

### Problem: Network spam causing lag
**Solution**: Throttle updates and only send what has changed

### Problem: Data lost when server restarts
**Solution**: Implement proper save/load functions for persistence

### Problem: Late-joining players don't get data
**Solution**: Handle the ms_playerjoined event to sync data to new players

### Problem: Race conditions in network code
**Solution**: Use a task delay to ensure components are fully initialized:

```lua
-- Delay initialization to ensure all components are ready
inst:DoTaskInTime(0.1, function()
    if TheWorld.components.playernotes then
        TheWorld.components.playernotes:SyncToClients()
    end
end)
```

## Next Steps

Now that you've created a networked mod, you can:

1. **Add More Features**: Create additional synchronized systems
2. **Improve Efficiency**: Optimize your network code for better performance
3. **Add Persistence**: Save and load custom data between game sessions
4. **Create Multiplayer Tools**: Build collaborative tools for players

For more advanced networking, check out the [Network System](../core/network-system.md) documentation to learn about the full capabilities of the networking system. 