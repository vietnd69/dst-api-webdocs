---
id: playerprofile
title: PlayerProfile
description: Comprehensive player profile and settings management system
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# PlayerProfile

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `PlayerProfile` class provides comprehensive management of player preferences, settings, customization data, and persistent profile information. It handles audio/video settings, character customizations, control schemes, collection data, and numerous game preferences. The system supports different storage methods based on platform and automatically migrates settings between versions.

## Usage Example

```lua
-- Create a new PlayerProfile instance
local profile = PlayerProfile()

-- Load existing profile data
profile:Load(function(success)
    if success then
        -- Get audio volumes
        local ambient, sfx, music = profile:GetVolume()
        
        -- Get character skins
        local wilson_skins = profile:GetSkinsForCharacter("wilson")
        
        -- Set a preference
        profile:SetVibrationEnabled(true)
        profile:Save()
    end
end)
```

## Class Methods

### PlayerProfile() {#playerprofile-constructor}

**Status:** `stable`

**Description:**
Creates a new PlayerProfile instance with initialized persistent data structure and default settings. Platform-specific settings are configured based on `USE_SETTINGS_FILE` flag.

**Returns:**
- (PlayerProfile): New PlayerProfile instance

**Default Settings Include:**
- Audio volumes, HUD sizes, control sensitivities
- Graphics options (bloom, distortion, screen shake)
- Gameplay preferences (autopause, movement prediction)
- Collection and customization data structures

**Example:**
```lua
local profile = PlayerProfile()
```

### profile:Reset() {#reset}

**Status:** `stable`

**Description:**
Resets all profile data to default values while preserving some session data like `starts`.

**Example:**
```lua
profile:Reset()
-- All settings restored to defaults
```

### profile:SoftReset() {#softreset}

**Status:** `stable`

**Description:**
Performs a partial reset that preserves audio and some graphics settings while resetting other preferences.

**Example:**
```lua
profile:SoftReset()
-- Partial reset maintaining some user preferences
```

## Character Customization

### profile:GetSkinsForCharacter(character) {#getskinsforcharacter}

**Status:** `stable`

**Description:**
Returns the skin configuration for a specific character. Handles legacy data migration and validates skin ownership.

**Parameters:**
- `character` (string): Character prefab name (e.g., "wilson", "wendy")

**Returns:**
- (table): Character skin configuration with base skin and accessories

**Example:**
```lua
local wilson_skins = profile:GetSkinsForCharacter("wilson")
-- Returns: { base = "wilson_none", head = "wilson_guest_hat", ... }
```

### profile:SetSkinsForCharacter(character, skinList) {#setskinsforcharacter}

**Status:** `stable`

**Description:**
Sets the skin configuration for a specific character and saves the profile.

**Parameters:**
- `character` (string): Character prefab name
- `skinList` (table): Skin configuration table

**Example:**
```lua
local skin_config = {
    base = "wilson_formal",
    head = "wilson_guest_hat",
    hand = "wilson_gloves"
}
profile:SetSkinsForCharacter("wilson", skin_config)
```

### profile:GetSkinPresetForCharacter(character, preset_index) {#getskinpresetforcharacter}

**Status:** `stable`

**Description:**
Retrieves a saved skin preset for a character.

**Parameters:**
- `character` (string): Character prefab name
- `preset_index` (number): Preset slot index

**Returns:**
- (table): Skin preset configuration or empty table if not found

**Example:**
```lua
local preset = profile:GetSkinPresetForCharacter("wendy", 1)
```

### profile:SetSkinPresetForCharacter(character, preset_index, skin_list) {#setskinpresetforcharacter}

**Status:** `stable`

**Description:**
Saves a skin configuration as a preset for quick access.

**Parameters:**
- `character` (string): Character prefab name
- `preset_index` (number): Preset slot index
- `skin_list` (table): Skin configuration to save

**Example:**
```lua
local preset_config = { base = "wendy_formal", head = "wendy_flower" }
profile:SetSkinPresetForCharacter("wendy", 1, preset_config)
```

## Audio Settings

### profile:SetVolume(ambient, sfx, music) {#setvolume}

**Status:** `stable`

**Description:**
Sets audio volume levels for all audio categories.

**Parameters:**
- `ambient` (number): Ambient audio volume (0-10)
- `sfx` (number): Sound effects volume (0-10) 
- `music` (number): Music volume (0-10)

**Example:**
```lua
profile:SetVolume(8, 9, 7)
-- Sets ambient=8, sfx=9, music=7
```

### profile:GetVolume() {#getvolume}

**Status:** `stable`

**Description:**
Gets current audio volume levels.

**Returns:**
- (number, number, number): ambient, sfx, music volumes

**Example:**
```lua
local ambient, sfx, music = profile:GetVolume()
print("Volumes:", ambient, sfx, music)
```

### profile:SetMuteOnFocusLost(value) {#setmuteonfocuslost}

**Status:** `stable`

**Description:**
Controls whether audio is muted when the game loses focus.

**Parameters:**
- `value` (boolean): Whether to mute on focus lost

**Example:**
```lua
profile:SetMuteOnFocusLost(true)
```

## Graphics Settings

### profile:SetBloomEnabled(enabled) {#setbloomenabled}

**Status:** `stable`

**Description:**
Enables or disables bloom lighting effects.

**Parameters:**
- `enabled` (boolean): Whether bloom should be enabled

**Example:**
```lua
profile:SetBloomEnabled(true)
```

### profile:GetBloomEnabled() {#getbloomenabled}

**Status:** `stable`

**Description:**
Returns current bloom effect setting.

**Returns:**
- (boolean): Whether bloom is enabled

**Example:**
```lua
local bloom_on = profile:GetBloomEnabled()
```

### profile:SetScreenShakeEnabled(enabled) {#setscreenshakeenabled}

**Status:** `stable`

**Description:**
Controls screen shake effects during gameplay events.

**Parameters:**
- `enabled` (boolean): Whether screen shake should be enabled

**Example:**
```lua
profile:SetScreenShakeEnabled(false)
```

### profile:SetHUDSize(size) {#sethudsize}

**Status:** `stable`

**Description:**
Sets the HUD scale size.

**Parameters:**
- `size` (number): HUD size scale factor

**Example:**
```lua
profile:SetHUDSize(6) -- Larger HUD
```

## Gameplay Settings

### profile:SetMovementPredictionEnabled(enabled) {#setmovementpredictionenabled}

**Status:** `stable`

**Description:**
Controls client-side movement prediction for smoother gameplay.

**Parameters:**
- `enabled` (boolean): Whether movement prediction should be enabled

**Example:**
```lua
profile:SetMovementPredictionEnabled(true)
```

### profile:SetTargetLockingEnabled(enabled) {#settargetlockingenabled}

**Status:** `stable`

**Description:**
Controls automatic target locking during combat.

**Parameters:**
- `enabled` (boolean): Whether target locking should be enabled

**Example:**
```lua
profile:SetTargetLockingEnabled(false)
```

### profile:SetAutopauseEnabled(enabled) {#setautopauseenabled}

**Status:** `stable`

**Description:**
Controls whether the game automatically pauses in certain situations.

**Parameters:**
- `enabled` (boolean): Whether autopause should be enabled

**Example:**
```lua
profile:SetAutopauseEnabled(true)
```

## Collection and Customization

### profile:SetCustomizationItemState(customization_type, item_key, is_active) {#setcustomizationitemstate}

**Status:** `stable`

**Description:**
Sets the active state of a customization item.

**Parameters:**
- `customization_type` (string): Type of customization (e.g., "emotes")
- `item_key` (string): Unique identifier for the item
- `is_active` (boolean): Whether the item should be active

**Example:**
```lua
profile:SetCustomizationItemState("emotes", "wave", true)
```

### profile:GetCustomizationItemState(customization_type, item_key) {#getcustomizationitemstate}

**Status:** `stable`

**Description:**
Gets the active state of a customization item.

**Parameters:**
- `customization_type` (string): Type of customization
- `item_key` (string): Item identifier

**Returns:**
- (boolean): Whether the item is active

**Example:**
```lua
local is_active = profile:GetCustomizationItemState("emotes", "wave")
```

### profile:SetCollectionName(name) {#setcollectionname}

**Status:** `stable`

**Description:**
Sets the player's collection display name.

**Parameters:**
- `name` (string): Collection name to set

**Example:**
```lua
profile:SetCollectionName("My Awesome Collection")
```

## World Generation and Presets

### profile:GetWorldCustomizationPresets() {#getworldcustomizationpresets}

**Status:** `stable`

**Description:**
Returns all saved world customization presets with automatic version upgrading.

**Returns:**
- (table): Array of world customization preset configurations

**Example:**
```lua
local presets = profile:GetWorldCustomizationPresets()
for i, preset in ipairs(presets) do
    print("Preset", i, ":", preset.name)
end
```

### profile:AddWorldCustomizationPreset(preset, index) {#addworldcustomizationpreset}

**Status:** `stable`

**Description:**
Adds or updates a world customization preset.

**Parameters:**
- `preset` (table): Preset configuration data
- `index` (number, optional): Specific index to set, or append if nil

**Example:**
```lua
local new_preset = {
    name = "Challenging World",
    version = 4,
    settings = { difficulty = "hard", resources = "scarce" }
}
profile:AddWorldCustomizationPreset(new_preset)
```

## Control Configuration

### profile:SetControls(guid, data, enabled) {#setcontrols}

**Status:** `stable`

**Description:**
Sets or updates control configuration for a specific device.

**Parameters:**
- `guid` (string): Device GUID identifier
- `data` (table): Control mapping data
- `enabled` (boolean): Whether the control scheme is enabled

**Example:**
```lua
local control_data = { 
    -- Control mapping configuration
}
profile:SetControls("device_guid_123", control_data, true)
```

### profile:GetControls(guid) {#getcontrols}

**Status:** `stable`

**Description:**
Retrieves control configuration for a specific device.

**Parameters:**
- `guid` (string): Device GUID identifier

**Returns:**
- (table, boolean): Control data and enabled status

**Example:**
```lua
local controls, enabled = profile:GetControls("device_guid_123")
```

## Data Management

### profile:SetValue(name, value) {#setvalue}

**Status:** `stable`

**Description:**
Sets a generic profile value and marks the profile as dirty if changed.

**Parameters:**
- `name` (string): Setting name
- `value` (any): Value to set

**Example:**
```lua
profile:SetValue("custom_setting", 42)
```

### profile:GetValue(name) {#getvalue}

**Status:** `stable`

**Description:**
Gets a generic profile value.

**Parameters:**
- `name` (string): Setting name

**Returns:**
- (any): The stored value or nil if not found

**Example:**
```lua
local value = profile:GetValue("custom_setting")
```

### profile:Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves the profile to persistent storage if data has been modified.

**Parameters:**
- `callback` (function, optional): Function called after save completion

**Example:**
```lua
profile:Save(function(success)
    if success then
        print("Profile saved successfully")
    else
        print("Failed to save profile")
    end
end)
```

### profile:Load(callback, minimal_load) {#load}

**Status:** `stable`

**Description:**
Loads profile data from persistent storage with automatic settings application and migration.

**Parameters:**
- `callback` (function, optional): Function called with success status after load
- `minimal_load` (boolean, optional): Whether to skip settings application

**Example:**
```lua
profile:Load(function(success)
    if success then
        print("Profile loaded and settings applied")
    else
        print("Failed to load profile")
    end
end)
```

## Storage and Platform Support

### profile:GetSaveName() {#getsavename}

**Status:** `stable`

**Description:**
Returns the filename used for profile storage, varying by branch.

**Returns:**
- (string): Save file name ("profile" for release, "profile_BRANCH" for others)

**Example:**
```lua
local save_name = profile:GetSaveName()
```

## Properties

### profile.persistdata {#persistdata}

**Type:** `table`

**Description:** Main data structure containing all profile settings and preferences

### profile.dirty {#dirty}

**Type:** `boolean`

**Description:** Flag indicating whether profile data has been modified and needs saving

## Platform Configuration

The profile system adapts to different platforms:

- **PC/Steam**: Uses settings.ini file for graphics/audio, profile file for game data
- **Console (PS4/Switch)**: Stores all settings in profile file
- **Different storage methods**: Based on `USE_SETTINGS_FILE` constant

## Common Usage Patterns

### Complete Profile Setup
```lua
local profile = PlayerProfile()

-- Load existing profile
profile:Load(function(success)
    if success then
        -- Configure audio
        profile:SetVolume(8, 9, 7)
        
        -- Set graphics preferences
        profile:SetBloomEnabled(true)
        profile:SetHUDSize(6)
        
        -- Configure gameplay
        profile:SetMovementPredictionEnabled(true)
        profile:SetAutopauseEnabled(false)
        
        -- Save changes
        profile:Save()
    end
end)
```

### Character Customization Management
```lua
-- Set up character skins
local wilson_config = {
    base = "wilson_formal",
    head = "wilson_guest_hat"
}
profile:SetSkinsForCharacter("wilson", wilson_config)

-- Save as preset
profile:SetSkinPresetForCharacter("wilson", 1, wilson_config)

-- Load preset later
local saved_preset = profile:GetSkinPresetForCharacter("wilson", 1)
```

### Settings Migration Example
```lua
-- The profile system automatically handles version migration
profile:Load(function(success)
    if success then
        -- Settings are automatically migrated from old formats
        -- Audio settings moved from profile to settings.ini on PC
        -- Control schemes updated to current format
        -- World presets upgraded to latest version
    end
end)
```

## Related Modules

- [PlayerDeaths](./playerdeaths.md): Manages player death record tracking
- [PlayerHistory](./playerhistory.md): Tracks player interaction history
- [Controls](../controls.md): Input and control mapping system
- [TheInventory](../inventory.md): Item and skin ownership verification
