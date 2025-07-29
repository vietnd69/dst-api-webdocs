---
id: multiplayer-overview
title: Multiplayer Overview
description: Overview of multiplayer-specific systems for server management, content delivery, and player experience
sidebar_position: 0
slug: game-scripts/core-systems/networking-communication/multiplayer
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: multiplayer-system
system_scope: multiplayer gameplay experience and server management
---

# Multiplayer Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Multiplayer category provides specialized systems for managing the multiplayer gameplay experience in Don't Starve Together. These systems handle server content delivery, UI popup management with network synchronization, and client-side preference management to create a seamless multiplayer environment.

### Key Responsibilities
- Deliver and manage server announcements and game content
- Synchronize UI popups and screen states across clients
- Manage client-side server preferences and filtering
- Provide RPC communication for multiplayer interactions
- Handle content caching and offline functionality

### System Scope
This category includes multiplayer-specific functionality for content delivery, UI synchronization, and preference management but excludes core networking protocols (handled by Networking) and basic chat systems (handled by Chat Commands).

## Architecture Overview

### System Components
Multiplayer systems are designed as client-server synchronized components that manage various aspects of the multiplayer experience from content delivery to UI state management.

### Data Flow
```
Server Content → MOTD Manager → Content Cache → UI Display
Client Interaction → Popup Manager → RPC Communication → Server Sync
User Preferences → Server Preferences → Local Storage → Filter Application
```

### Integration Points
- **Networking**: RPC communication and client-server synchronization
- **User Interface**: Screen management and popup display
- **Data Management**: Content caching and preference persistence
- **System Core**: Platform integration and engine services

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [MOTD Manager](./motdmanager.md) | stable | Content delivery system |
| 676042 | 2025-06-21 | [Popup Manager](./popupmanager.md) | stable | UI popup synchronization |
| 676042 | 2025-06-21 | [Server Preferences](./serverpreferences.md) | stable | Client preference management |

## Core Multiplayer Modules

### [MOTD Manager](./motdmanager.md)
Message of the Day system for downloading and displaying game announcements.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Content Download | stable | Server content retrieval | Automatic updates, retry logic, caching |
| Content Organization | stable | Category-based content sorting | Patch notes, skins, news, Twitch integration |
| Image Management | stable | Content image caching | Progressive loading, slot management |
| Platform Integration | stable | Steam/Rail platform support | Platform-specific delivery |

### [Popup Manager](./popupmanager.md)
System for managing game UI popups with RPC communication.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Popup Registration | stable | Popup type management | Built-in and mod popup support |
| RPC Communication | stable | Client-server popup sync | Message validation, state synchronization |
| Screen Management | stable | UI screen lifecycle | Open/close handling, HUD integration |
| Validation System | stable | Input parameter validation | Type checking, security validation |

### [Server Preferences](./serverpreferences.md)
Client-side management for server display preferences and filtering.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| Preference Storage | stable | Persistent client settings | Local storage, data expiration |
| Profanity Filtering | stable | Content filtering system | Automatic detection, manual overrides |
| Server Filtering | stable | Server visibility control | User-controlled hiding, preference toggle |
| Data Management | stable | Preference synchronization | Load/save operations, data validation |

## Common Multiplayer Patterns

### MOTD Content Access
```lua
-- Check if MOTD system is available
if TheMotdManager:IsEnabled() then
    -- Get current content
    local motd_info, sorted_keys = TheMotdManager:GetMotd()
    
    -- Process content by category
    for i, key in ipairs(sorted_keys) do
        local content = motd_info[key]
        if content.data.category == "patchnotes" then
            print("Patch notes:", content.data.title)
        end
    end
    
    -- Check for updates
    if TheMotdManager:IsNewUpdateAvailable() then
        print("New game version available!")
    end
end
```

### Popup Management with RPC
```lua
-- Register popup with RPC validation
local popup = PopupManagerWidget({
    rpcvalidation = function(param1, param2)
        return optstring(param1) and optbool(param2)
    end
})

-- Open popup with synchronization
POPUPS.COOKBOOK.fn(ThePlayer, true)

-- Send data between client and server
popup:SendMessageToServer(ThePlayer, "recipe_data", true)
```

### Server Preference Management
```lua
-- Initialize server preferences
local prefs = ServerPreferences()

-- Load existing preferences
prefs:Load(function(success)
    if success then
        print("Preferences loaded successfully")
    end
end)

-- Check server visibility
local server_data = {name = "Test Server", description = "Description"}
if not prefs:IsNameAndDescriptionHidden(server_data) then
    -- Display server in browser
    DisplayServerInList(server_data)
end

-- Toggle server visibility
prefs:ToggleNameAndDescriptionFilter(server_data)
prefs:Save()
```

## Multiplayer System Dependencies

### Required Systems
- [Networking](../networking/index.md): RPC communication and client-server messaging
- [System Core](../../system-core/index.md): Platform services and engine integration
- [Data Management](../../data-management/index.md): Content caching and preference storage

### Optional Systems
- [User Interface](../../user-interface/index.md): Screen display and popup rendering
- [Chat Commands](../chat-commands/index.md): Integration with command and messaging systems
- [Mod Support](../../mod-support/index.md): Custom popup registration and content extension

## Performance Considerations

### Content Delivery Optimization
- MOTD content uses progressive image loading with slot management (10 max image slots)
- Automatic retry logic with exponential backoff for failed downloads
- Content caching reduces redundant network requests
- Category-based content organization optimizes display performance

### Network Efficiency
- RPC communication uses validated message formats to prevent invalid data
- Popup state synchronization minimizes bandwidth usage
- Server preference updates batch changes to reduce network overhead
- Content compression reduces download sizes

### Memory Management
- Automatic cleanup of expired preference data based on `USER_HISTORY_EXPIRY_TIME`
- Image cache management prevents unlimited memory growth
- Popup lifecycle management prevents memory leaks
- Efficient JSON parsing and storage for persistent data

## Development Guidelines

### Best Practices
- Always validate RPC parameters using appropriate validation functions
- Implement proper error handling for network operations
- Use the popup manager for all synchronized UI screens
- Follow established patterns for content delivery and caching
- Test multiplayer functionality with various network conditions

### Common Pitfalls
- Not validating RPC parameters can cause network synchronization issues
- Bypassing popup manager for UI screens breaks client-server synchronization
- Not handling network failures gracefully can impact user experience
- Ignoring preference persistence can lose user customizations
- Not considering platform differences for content delivery

### Testing Strategies
- Test content delivery with various network speeds and interruptions
- Verify popup synchronization across multiple clients
- Test preference persistence across game sessions
- Validate RPC communication with malformed data
- Check platform-specific functionality on target platforms

## Multiplayer Integration Patterns

### With User Interface
Multiplayer systems drive UI presentations:
- MOTD content populates main menu announcement sections
- Popup manager synchronizes screen states across all clients
- Server preferences filter server browser display
- Content categorization drives UI organization and priority

### With Networking
Systems integrate with network infrastructure:
- RPC communication for popup state synchronization
- Content download using platform-specific network services
- Preference synchronization using local and remote storage
- Error handling for network interruptions and failures

### With Data Management
Content and preference persistence:
- MOTD content caching for offline availability
- Server preference storage using persistent data systems
- Image cache management with automatic cleanup
- JSON encoding/decoding for structured data storage

## Content Management

### MOTD Content Categories
The system organizes content with specific priorities:

| Category | Priority | Description | Example Content |
|----------|----------|-------------|-----------------|
| patchnotes | 1 | Game updates and changes | Version updates, bug fixes |
| skins | 2 | Cosmetic content releases | New character skins, item skins |
| twitch | 3 | Streaming integration | Twitch drops, stream features |
| news | 4 | General announcements | Community events, developer updates |
| none | 100 | Uncategorized content | Miscellaneous announcements |

### Popup Types
Available popup types with RPC support:

| Popup | Purpose | RPC Validation | Key Features |
|-------|---------|----------------|--------------|
| GIFTITEM | Inventory management | `optbool(usewardrobe)` | Item gifting interface |
| WARDROBE | Character customization | Skin parameter validation | Clothing/appearance editor |
| GROOMER | Beefalo customization | Beefalo skin validation | Mount customization |
| COOKBOOK | Recipe viewing | Basic validation | Recipe browser |
| SCRAPBOOK | Collection tracking | Basic validation | Achievement/collection viewer |

## Security and Validation

### RPC Security
- All RPC parameters validated using type-safe validation functions
- Input sanitization prevents malformed data transmission
- Parameter count and type verification before processing
- Error handling for invalid or unexpected data

### Content Filtering
- Server preference system includes profanity filtering
- User-controlled server visibility settings
- Automatic content categorization and priority management
- Safe handling of user-generated server names and descriptions

### Data Integrity
- JSON validation for preference data persistence
- Hash-based server identification for preference consistency
- Automatic data expiration prevents stale preference accumulation
- Error recovery for corrupted preference data

## Troubleshooting Multiplayer Issues

### Common MOTD Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Content not loading | Empty announcement section | Check network connectivity and retry |
| Images not displaying | Text without images | Verify image cache and download status |
| Outdated content | Stale announcements | Force refresh or clear cache |
| Platform integration failure | No content on specific platforms | Check platform-specific settings |

### Common Popup Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Popup not synchronizing | Different states on clients | Check RPC communication and validation |
| Screen not opening | No response to popup commands | Verify HUD integration and screen availability |
| Data not transmitting | Missing popup parameters | Validate RPC parameter formatting |
| Multiple instances | Duplicate popups | Ensure proper popup lifecycle management |

### Common Preference Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Preferences not saving | Lost settings between sessions | Check persistent storage permissions |
| Filter not working | Unwanted servers still visible | Verify preference loading and application |
| Data corruption | Unexpected preference behavior | Reset preferences and reload |
| Profanity filter issues | Incorrect content filtering | Update filter patterns and clear cache |

## Extension and Customization

### Adding Custom Popups
```lua
-- Register mod popup with validation
local mod_popup = PopupManagerWidget({
    rpcvalidation = function(custom_param)
        return optstring(custom_param)
    end
})

-- Add to mod popup system
MOD_POPUPS["MY_CUSTOM_POPUP"] = mod_popup
```

### Custom Content Integration
- MOTD system supports category extension for mod content
- Popup manager accommodates unlimited custom popup types
- Server preferences can be extended with additional filtering criteria
- Platform integration supports custom content delivery endpoints

### Preference System Extension
```lua
-- Add custom server filtering criteria
local custom_prefs = ServerPreferences()
custom_prefs.custom_filters = {}

-- Implement custom filtering logic
function custom_prefs:IsCustomFiltered(server_data)
    return self.custom_filters[server_data.name] == true
end
```

## Future Development Considerations

### Scalability Design
- MOTD system supports unlimited content categories and types
- Popup manager handles arbitrary popup types with consistent RPC patterns
- Server preferences scale to large server lists with efficient filtering
- Content delivery adapts to various platform requirements and constraints

### Integration Planning
- New multiplayer features should leverage existing RPC communication patterns
- Content delivery should follow established caching and update mechanisms
- UI synchronization should use popup manager for consistency
- Preference systems should integrate with established persistence patterns

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Networking](../networking/index.md) | Communication layer | RPC calls, content download, state sync |
| [Chat Commands](../chat-commands/index.md) | Communication features | Command integration, message handling |
| [User Interface](../../user-interface/index.md) | Display layer | Screen management, popup rendering |
| [Data Management](../../data-management/index.md) | Storage layer | Content caching, preference persistence |

## Contributing Guidelines

### Adding Multiplayer Features
1. Use established RPC patterns for client-server communication
2. Implement proper validation for all network-transmitted data
3. Follow popup manager patterns for UI synchronization
4. Consider offline functionality for content delivery features
5. Test thoroughly in multiplayer environments with network variations

### Content System Modifications
1. Maintain backward compatibility with existing content formats
2. Follow established category and priority systems for new content types
3. Consider platform differences for content delivery mechanisms
4. Test content caching and offline availability
5. Document any new content categories or delivery patterns

### Quality Standards
- All RPC communication must include proper validation
- Content delivery must handle network failures gracefully
- UI synchronization must maintain consistency across all clients
- Preference changes must persist correctly across sessions
- Integration points must be documented and validated
