---
title: "Config"
description: "Platform configuration management system for Don't Starve Together"
sidebar_position: 8
slug: /api-vanilla/core-systems/config
last_updated: "2024-12-19"
build_version: "675312"
change_status: "stable"
---

# Config Module 🟢

The **Config** module provides a flexible platform configuration management system for Don't Starve Together. It handles platform-specific settings and options that control various aspects of the game's behavior across different platforms.

## Overview

The Config module implements a class-based system for managing configuration options with platform-specific overrides. It provides a centralized way to handle settings that may vary between platforms like desktop, mobile, and web browsers.

## Global Instance

The module creates a global instance `TheConfig` that is used throughout the codebase to access configuration settings.

```lua
-- Global configuration instance
TheConfig = Config(defaults)
```

## Class Definition

### Config Class

```lua
local Config = Class(function(self, options)
    self.options = {}
    if options then
        self:SetOptions(options)
    end
end)
```

## Methods

### SetOptions(options)

Sets multiple configuration options at once.

**Parameters:**
- `options` (table): A table of key-value pairs representing configuration options

**Usage:**
```lua
local config = Config()
config:SetOptions({
    hide_vignette = true,
    force_netbookmode = false
})
```

### IsEnabled(option)

Checks if a specific configuration option is enabled.

**Parameters:**
- `option` (string): The name of the configuration option to check

**Returns:**
- (any): The value of the option, or `nil` if not set

**Usage:**
```lua
if TheConfig:IsEnabled("hide_vignette") then
    -- Hide vignette effects
end
```

### Enable(option)

Enables a specific configuration option by setting it to `true`.

**Parameters:**
- `option` (string): The name of the configuration option to enable

**Usage:**
```lua
TheConfig:Enable("force_netbookmode")
```

### Disable(option)

Disables a specific configuration option by setting it to `nil`.

**Parameters:**
- `option` (string): The name of the configuration option to disable

**Usage:**
```lua
TheConfig:Disable("hide_vignette")
```

### __tostring()

Returns a string representation of all configuration options for debugging purposes.

**Returns:**
- (string): Formatted string showing all options and their values

## Default Configuration

The module defines default configuration values that apply to all platforms:

```lua
local defaults = {
    hide_vignette = false,
    force_netbookmode = false,
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hide_vignette` | boolean | `false` | Controls whether vignette effects are hidden |
| `force_netbookmode` | boolean | `false` | Forces the game into netbook mode for smaller screens |

## Platform Overrides

The module supports platform-specific configuration overrides:

### NACL Platform
```lua
NACL = {
    force_netbookmode = true,
}
```

### Android Platform
```lua
ANDROID = {
    hide_vignette = true,
    force_netbookmode = true,
}
```

### iOS Platform
```lua
IOS = {
    hide_vignette = true,
    force_netbookmode = true,
}
```

## Usage Examples

### Basic Configuration Check
```lua
-- Check if vignette should be hidden
if TheConfig:IsEnabled("hide_vignette") then
    -- Apply UI adjustments for mobile platforms
    HideVignetteEffects()
end
```

### Netbook Mode Detection
```lua
-- Adjust UI layout based on netbook mode
if TheConfig:IsEnabled("force_netbookmode") then
    -- Use compact UI layout
    SetCompactUIMode()
else
    -- Use full UI layout
    SetFullUIMode()
end
```

### Runtime Configuration Changes
```lua
-- Enable an option at runtime
TheConfig:Enable("some_new_option")

-- Disable an option at runtime
TheConfig:Disable("some_option")

-- Set multiple options
TheConfig:SetOptions({
    new_feature = true,
    experimental_mode = false
})
```

## Platform Detection

The configuration system automatically applies platform-specific overrides based on the global `PLATFORM` variable:

- **Desktop**: Uses default configuration
- **NACL**: Enables netbook mode for Chrome Native Client
- **Android**: Hides vignette and enables netbook mode
- **iOS**: Hides vignette and enables netbook mode

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-12-19 | Current stable implementation |

## Related Modules

- **[Class](class.md)** - Base class system used by Config
- **[Constants](constants.md)** - Platform constants and definitions

## Technical Notes

- The Config class extends the base `Class` system
- Configuration options are stored in the `options` table
- Platform overrides are applied during module initialization
- The `__tostring` method provides debugging information

---

*This documentation covers the Config module as of build 675312. For the most current API information, please refer to the latest game files.*
