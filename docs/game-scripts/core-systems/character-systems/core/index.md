---
id: character-systems-core
title: Character Systems Core Overview
sidebar_position: 0
slug: character-systems-core
last_updated: 2025-06-21
build_version: 676042
---

# Character Systems Core API Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## Purpose

The Character Systems Core provides essential utilities and management systems for character-related functionality in Don't Starve Together. This collection of modules handles character asset loading, player profile management, interaction tracking, and death record systems that form the foundation for character operations throughout the game.

## Key Concepts

### Character Asset Management
The core systems handle loading and management of character-specific assets including portraits, avatars, names, and metadata. These utilities support both vanilla characters and mod characters with appropriate fallback mechanisms.

### Player Data Persistence
Comprehensive systems for tracking and persisting player information including gameplay preferences, customization settings, interaction history, and death records. All data is managed with automatic version migration and platform-specific storage optimization.

### Automatic Tracking Systems
Background systems that continuously monitor and record player interactions, gameplay statistics, and preferences. These systems operate transparently to provide rich historical data for player experience enhancement.

### Cross-Platform Compatibility
All core character systems are designed to work consistently across different platforms (PC, Console) with platform-specific optimizations for storage methods and performance characteristics.

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [CharacterUtil](./characterutil.md) | stable | Current stable version for character asset utilities |
| 676042 | 2025-06-21 | [PlayerProfile](./playerprofile.md) | stable | Comprehensive profile and settings management |
| 676042 | 2025-06-21 | [PlayerHistory](./playerhistory.md) | stable | Player interaction tracking system |
| 676042 | 2025-06-21 | [PlayerDeaths](./playerdeaths.md) | stable | Death record management system |

## Common Usage Patterns

### Character Asset Loading
```lua
-- Load character portraits and avatars
local portraitWidget = Image()
local hasOval = SetSkinnedOvalPortraitTexture(portraitWidget, "wilson", "wilson_formal")

-- Get character information
local title = GetCharacterTitle("wilson", "wilson_formal")
local atlas, texture = GetCharacterAvatarTextureLocation("wilson")
```

### Player Profile Management
```lua
-- Initialize and load player profile
local profile = PlayerProfile()
profile:Load(function(success)
    if success then
        -- Configure player settings
        profile:SetVolume(8, 9, 7)
        profile:SetBloomEnabled(true)
        
        -- Manage character customization
        local wilson_skins = profile:GetSkinsForCharacter("wilson")
        profile:Save()
    end
end)
```

### Player Tracking Systems
```lua
-- Set up automatic player tracking
local history = PlayerHistory()
history:StartListening()

-- Record death events
local deaths = PlayerDeaths()
deaths:OnDeath({
    days_survived = 25,
    killed_by = "Spider Warrior",
    character = "wilson"
})
```

## Modules

| Module | Status | Description |
|-----|-----|----|
| [CharacterUtil](./characterutil.md) | stable | Utility functions for loading character portraits, avatars, names, and managing character metadata |
| [PlayerProfile](./playerprofile.md) | stable | Comprehensive player profile and settings management system |
| [PlayerHistory](./playerhistory.md) | stable | System for tracking and managing history of players encountered during gameplay |
| [PlayerDeaths](./playerdeaths.md) | stable | System for tracking and managing player death records and statistics |
