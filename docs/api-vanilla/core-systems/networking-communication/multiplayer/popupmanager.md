---
id: popupmanager
title: PopupManager
description: System for managing game UI popups and screen overlays with RPC communication
sidebar_position: 2
slug: api-vanilla/core-systems/popupmanager
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# PopupManager

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The PopupManager system handles the display and management of various UI screens and popups in Don't Starve Together. It provides a centralized way to open, close, and communicate with different game screens through RPC (Remote Procedure Call) communication between client and server.

## PopupManagerWidget Class

### PopupManagerWidget(data)

**Status:** `stable`

**Description:**
Creates a new popup manager widget instance with default RPC validation and handler functions.

**Parameters:**
- `data` (table, optional): Configuration data for the popup widget

**Example:**
```lua
local popup = PopupManagerWidget({
    -- Optional configuration data
})
```

## PopupManagerWidget Methods

### popup:Close(inst, ...)

**Status:** `stable`

**Description:**
Closes the popup and sends appropriate RPC messages to synchronize the close action between client and server.

**Parameters:**
- `inst` (EntityScript): The player instance
- `...`: Additional arguments to pass with the close event

**Example:**
```lua
POPUPS.COOKBOOK:Close(ThePlayer)
```

### popup:SendMessageToServer(inst, ...)

**Status:** `stable`

**Description:**
Sends a message from client to server for this popup instance.

**Parameters:**
- `inst` (EntityScript): The player instance
- `...`: Message arguments to send to server

**Example:**
```lua
popup:SendMessageToServer(ThePlayer, "data1", "data2")
```

### popup:SendMessageToClient(inst, ...)

**Status:** `stable`

**Description:**
Sends a message from server to client for this popup instance.

**Parameters:**
- `inst` (EntityScript): The player instance
- `...`: Message arguments to send to client

**Example:**
```lua
popup:SendMessageToClient(player, "response_data")
```

### popup:__tostring()

**Status:** `stable`

**Description:**
Returns a string representation of the popup widget.

**Returns:**
- (string): Formatted string with popup ID and code

**Example:**
```lua
local popup_string = tostring(POPUPS.COOKBOOK)
-- Returns: "COOKBOOK (4)"
```

## Available Popups

The system provides the following built-in popup types:

### POPUPS.GIFTITEM

**Status:** `stable`

**Description:**
Manages the gift item/inventory management screen.

**RPC Validation:**
```lua
function(usewardrobe)
    return optbool(usewardrobe)
end
```

**Example:**
```lua
-- Open gift item screen
POPUPS.GIFTITEM.fn(ThePlayer, true)

-- Close gift item screen
POPUPS.GIFTITEM.fn(ThePlayer, false)
```

### POPUPS.WARDROBE

**Status:** `stable`

**Description:**
Manages the character wardrobe/clothing customization screen.

**RPC Validation:**
```lua
function(base_skin, body_skin, hand_skin, legs_skin, feet_skin)
    return optstring(base_skin) and optstring(body_skin) and 
           optstring(hand_skin) and optstring(legs_skin) and 
           optstring(feet_skin)
end
```

**Example:**
```lua
-- Open wardrobe screen for target entity
POPUPS.WARDROBE.fn(ThePlayer, true, target_entity)
```

### POPUPS.GROOMER

**Status:** `stable`

**Description:**
Manages the beefalo grooming/customization screen.

**RPC Validation:**
```lua
function(beef_body_skin, beef_horn_skin, beef_head_skin, beef_feet_skin, beef_tail_skin, cancel)
    return optstring(beef_body_skin) and optstring(beef_horn_skin) and 
           optstring(beef_head_skin) and optstring(beef_feet_skin) and 
           optstring(beef_tail_skin) and optbool(cancel)
end
```

**Example:**
```lua
-- Open groomer screen for beefalo
POPUPS.GROOMER.fn(ThePlayer, true, beefalo_target, filter_options)
```

### POPUPS.COOKBOOK

**Status:** `stable`

**Description:**
Manages the cookbook screen for viewing recipes.

**Example:**
```lua
-- Open cookbook screen
POPUPS.COOKBOOK.fn(ThePlayer, true)

-- Close cookbook screen
POPUPS.COOKBOOK.fn(ThePlayer, false)
```

### POPUPS.PLANTREGISTRY

**Status:** `stable`

**Description:**
Manages the plant registry screen for viewing discovered plants.

**Example:**
```lua
-- Open plant registry screen
POPUPS.PLANTREGISTRY.fn(ThePlayer, true)
```

### POPUPS.PLAYERINFO

**Status:** `stable`

**Description:**
Manages the player information screen.

**Example:**
```lua
-- Open player info screen
POPUPS.PLAYERINFO.fn(ThePlayer, true)
```

### POPUPS.SCRAPBOOK

**Status:** `stable`

**Description:**
Manages the scrapbook screen for viewing collected entries.

**Example:**
```lua
-- Open scrapbook screen
POPUPS.SCRAPBOOK.fn(ThePlayer, true)
```

### POPUPS.INSPECTACLES

**Status:** `stable`

**Description:**
Manages the inspectacles puzzle screen.

**RPC Validation:**
```lua
function(solution)
    return optuint(solution)
end
```

**Example:**
```lua
-- Open inspectacles screen
POPUPS.INSPECTACLES.fn(ThePlayer, true)
```

### POPUPS.BALATRO

**Status:** `stable`

**Description:**
Manages the Balatro card game screen.

**RPC Validation:**
```lua
function(solution)
    return optuint(solution)
end
```

**Example:**
```lua
-- Open Balatro screen with cards
local jokers = {joker1, joker2, joker3}
local cards = {card1, card2, card3, card4, card5}
POPUPS.BALATRO.fn(ThePlayer, true, target, joker1, joker2, joker3, card1, card2, card3, card4, card5)
```

### POPUPS.PUMPKINCARVING

**Status:** `stable`

**Description:**
Manages the pumpkin carving customization screen.

**RPC Validation:**
```lua
function(cutdata)
    return optstring(cutdata)
end
```

**Example:**
```lua
-- Open pumpkin carving screen
POPUPS.PUMPKINCARVING.fn(ThePlayer, true, pumpkin_target)
```

### POPUPS.SNOWMANDECORATING

**Status:** `stable`

**Description:**
Manages the snowman decorating customization screen.

**RPC Validation:**
```lua
function(decordata, obj)
    return optstring(decordata) and optentity(obj)
end
```

**Example:**
```lua
-- Open snowman decorating screen
POPUPS.SNOWMANDECORATING.fn(ThePlayer, true, snowman_target, decoration_object)
```

## Utility Functions

### GetPopupFromPopupCode(popupcode, mod_name)

**Status:** `stable`

**Description:**
Retrieves a popup instance by its numeric code.

**Parameters:**
- `popupcode` (number): The numeric code of the popup
- `mod_name` (string, optional): Name of the mod if retrieving a mod popup

**Returns:**
- (PopupManagerWidget): The popup instance, or nil if not found

**Example:**
```lua
-- Get vanilla popup by code
local cookbook_popup = GetPopupFromPopupCode(4)

-- Get mod popup by code
local mod_popup = GetPopupFromPopupCode(1, "my_mod_name")
```

### GetPopupIDFromPopupCode(popupcode, mod_name)

**Status:** `stable`

**Description:**
Retrieves a popup ID string by its numeric code.

**Parameters:**
- `popupcode` (number): The numeric code of the popup
- `mod_name` (string, optional): Name of the mod if retrieving a mod popup ID

**Returns:**
- (string): The popup ID string, or nil if not found

**Example:**
```lua
-- Get popup ID by code
local popup_id = GetPopupIDFromPopupCode(4)
-- Returns: "COOKBOOK"
```

## Global Tables

### POPUPS

**Status:** `stable`

**Description:**
Global table containing all available popup instances indexed by their ID.

**Example:**
```lua
-- Access specific popups
local cookbook = POPUPS.COOKBOOK
local wardrobe = POPUPS.WARDROBE
```

### POPUPS_BY_POPUP_CODE

**Status:** `stable`

**Description:**
Global table mapping popup codes to popup instances for vanilla popups.

### POPUP_IDS

**Status:** `stable`

**Description:**
Array of popup ID strings in the order they were registered.

### MOD_POPUPS_BY_POPUP_CODE

**Status:** `stable`

**Description:**
Table mapping mod names to their popup code mappings for mod-added popups.

### MOD_POPUP_IDS

**Status:** `stable`

**Description:**
Table mapping mod names to their popup ID arrays for mod-added popups.

## Integration with HUD System

All popup functions integrate with the player's HUD system to open and close screens:

```lua
-- General pattern for popup functions
function(inst, show, ...)
    if inst.HUD then
        if not show then
            inst.HUD:CloseSpecificScreen()
        elseif not inst.HUD:OpenSpecificScreen(...) then
            POPUPS.SPECIFIC:Close(inst)
        end
    end
end
```

## RPC Communication

The popup system uses RPC (Remote Procedure Call) communication to synchronize popup states between client and server:

- **RPC.ClosePopup**: Sent when closing a popup
- **RPC.RecievePopupMessage**: Sent for server-bound messages
- **CLIENT_RPC.RecievePopupMessage**: Sent for client-bound messages

## Related Modules

- [HUD System](../screens/): UI screen management
- [RPC System](./networking.md): Network communication
- [ModUtil](./modutil.md): Mod integration for custom popups
