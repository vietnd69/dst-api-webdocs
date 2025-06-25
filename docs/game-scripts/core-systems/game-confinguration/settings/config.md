---
id: config
title: Config
description: Platform configuration management system for Don't Starve Together with platform-specific overrides
sidebar_position: 1
slug: core-systems-config
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Config

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Config** module provides a flexible platform configuration management system for Don't Starve Together. It implements a class-based system for managing configuration options with platform-specific overrides, enabling centralized control over settings that vary between desktop, mobile, and web platforms.

This system is essential for handling platform differences in UI rendering, performance optimizations, and feature availability across different deployment targets.

## Usage Example

```lua
-- Check if vignette should be hidden (mobile platforms)
if TheConfig:IsEnabled("hide_vignette") then
    -- Mobile optimization: remove performance-heavy vignette
    HideVignetteEffects()
end

-- Enable netbook mode for compact UI
if TheConfig:IsEnabled("force_netbookmode") then
    -- Use compact layout for smaller screens
    SetCompactUIMode()
end

-- Runtime configuration changes
TheConfig:Enable("debug_mode")
TheConfig:SetOptions({
    new_feature = true,
    performance_mode = false
})
```

## Class Definition

### Config(options) {#config-constructor}

**Status:** `stable`

**Description:**
Creates a new Config instance with optional initial configuration options. The constructor initializes an empty options table and applies any provided options.

**Parameters:**
- `options` (table, optional): Initial configuration options to set as key-value pairs

**Returns:**
- (Config): New Config instance

**Example:**
```lua
-- Create config with initial options
local config = Config({
    hide_vignette = true,
    force_netbookmode = false,
    custom_option = "value"
})

-- Create empty config
local empty_config = Config()
```

## Methods

### SetOptions(options) {#setoptions}

**Status:** `stable`

**Description:**
Sets multiple configuration options at once by merging the provided options table with existing options. Existing options with the same keys will be overwritten.

**Parameters:**
- `options` (table): Table of key-value pairs representing configuration options

**Example:**
```lua
-- Set multiple options at once
TheConfig:SetOptions({
    hide_vignette = true,
    force_netbookmode = false,
    new_feature = "enabled",
    debug_level = 2
})

-- Options are merged, not replaced
TheConfig:SetOptions({additional_setting = true})
```

### IsEnabled(option) {#isenabled}

**Status:** `stable`

**Description:**
Checks if a specific configuration option is enabled. Returns the value of the option or nil if not set. This is the primary method for checking configuration state.

**Parameters:**
- `option` (string): Name of the configuration option to check

**Returns:**
- (any): Value of the option, or `nil` if not set

**Example:**
```lua
-- Check boolean options
local vignetteHidden = TheConfig:IsEnabled("hide_vignette")
if vignetteHidden then
    ApplyMobileUISettings()
end

-- Check any value type
local debugLevel = TheConfig:IsEnabled("debug_level")
if debugLevel and debugLevel > 1 then
    ShowAdvancedDebugInfo()
end

-- Handle missing options
local customSetting = TheConfig:IsEnabled("nonexistent_option")
if customSetting == nil then
    print("Option not configured")
end
```

### Enable(option) {#enable}

**Status:** `stable`

**Description:**
Enables a specific configuration option by setting it to `true`. This is a convenience method for boolean configuration options.

**Parameters:**
- `option` (string): Name of the configuration option to enable

**Example:**
```lua
-- Enable features at runtime
TheConfig:Enable("force_netbookmode")
TheConfig:Enable("debug_mode")

-- Check the result
if TheConfig:IsEnabled("debug_mode") then
    print("Debug mode now enabled")
end
```

### Disable(option) {#disable}

**Status:** `stable`

**Description:**
Disables a specific configuration option by setting it to `nil`. This effectively removes the option from the configuration.

**Parameters:**
- `option` (string): Name of the configuration option to disable

**Example:**
```lua
-- Disable features
TheConfig:Disable("hide_vignette")
TheConfig:Disable("experimental_feature")

-- Option is now nil
local disabled = TheConfig:IsEnabled("hide_vignette")
assert(disabled == nil, "Option should be nil after disable")
```

### __tostring() {#tostring}

**Status:** `stable`

**Description:**
Returns a formatted string representation of all configuration options for debugging and inspection purposes. This metamethod is automatically called when the config object is converted to a string.

**Returns:**
- (string): Multi-line string showing all options and their values

**Example:**
```lua
-- Print all configuration options
print(tostring(TheConfig))

-- Example output:
-- PLATFORM CONFIGURATION OPTIONS
-- hide_vignette = true
-- force_netbookmode = true
-- custom_option = value

-- Use in debugging
local configDebug = tostring(TheConfig)
WriteToLogFile("Current config: " .. configDebug)
```

## Global Instance

### TheConfig {#theconfig}

**Status:** `stable`

**Description:**
Global configuration instance automatically created with default values and platform-specific overrides applied. This is the primary interface for accessing configuration throughout the game.

**Type:** `Config`

**Example:**
```lua
-- TheConfig is globally available everywhere
if TheConfig:IsEnabled("force_netbookmode") then
    SetCompactLayout()
end

-- Access from any module
local function ApplyPlatformSettings()
    if TheConfig:IsEnabled("hide_vignette") then
        RemoveVignetteEffects()
    end
end
```

## Default Configuration

The module defines default configuration values applied to all platforms before platform-specific overrides:

```lua
local defaults = {
    hide_vignette = false,
    force_netbookmode = false,
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `hide_vignette` | boolean | `false` | Controls whether vignette effects are hidden for performance on mobile platforms |
| `force_netbookmode` | boolean | `false` | Forces compact UI layout for smaller screens and web platforms |

## Platform Overrides

The system applies platform-specific configuration overrides based on the global `PLATFORM` variable:

### NACL Platform {#nacl-platform}

**Status:** `stable`

**Description:**
Chrome Native Client platform configuration.

```lua
NACL = {
    force_netbookmode = true,
}
```

**Overrides:**
- `force_netbookmode = true`: Enables compact UI for web browser constraints

### Android Platform {#android-platform}

**Status:** `stable`

**Description:**
Android mobile platform configuration.

```lua
ANDROID = {
    hide_vignette = true,
    force_netbookmode = true,
}
```

**Overrides:**
- `hide_vignette = true`: Removes vignette effects for better mobile performance
- `force_netbookmode = true`: Uses compact UI layout for mobile screens

### iOS Platform {#ios-platform}

**Status:** `stable`

**Description:**
iOS mobile platform configuration.

```lua
IOS = {
    hide_vignette = true,
    force_netbookmode = true,
}
```

**Overrides:**
- `hide_vignette = true`: Removes vignette effects for better mobile performance  
- `force_netbookmode = true`: Uses compact UI layout for mobile screens

## Implementation Details

### Platform Override Application

The configuration system automatically applies platform overrides during module initialization:

```lua
TheConfig = Config(defaults)
if platform_overrides[PLATFORM] then
    TheConfig:SetOptions(platform_overrides[PLATFORM])
end
```

**Process:**
1. Create Config instance with default values
2. Check if current platform has specific overrides
3. Apply platform overrides using `SetOptions`
4. Global `TheConfig` instance is ready for use

### Option Storage

All configuration options are stored in the `options` table within each Config instance:

```lua
function Config:SetOptions(options)
    for k,v in pairs(options) do
        self.options[k] = v
    end
end
```

**Storage Characteristics:**
- Direct table storage for fast access
- Supports any value type (boolean, number, string, table)
- Options can be added, modified, or removed at runtime
- Memory efficient with minimal overhead

## Common Usage Patterns

### Platform-Specific UI Adjustments

```lua
-- Apply mobile-specific optimizations
if TheConfig:IsEnabled("hide_vignette") then
    -- Remove performance-heavy vignette overlay
    RemoveVignetteOverlay()
    SetMobileRenderingMode()
end

if TheConfig:IsEnabled("force_netbookmode") then
    -- Compact UI for smaller screens
    SetCompactButtonLayout()
    SetSmallUIScale()
    EnableScrollableMenus()
end
```

### Runtime Configuration Management

```lua
-- Enable experimental features dynamically
TheConfig:Enable("experimental_ai")
TheConfig:Enable("beta_ui")

-- Batch configuration updates
TheConfig:SetOptions({
    performance_mode = true,
    high_quality_audio = false,
    debug_rendering = true,
    log_level = 3
})

-- Conditional feature activation
if PlayerHasBetaAccess() then
    TheConfig:Enable("beta_features")
end
```

### Configuration-Driven Features

```lua
-- UI scaling based on configuration
local function ApplyUIScaling()
    if TheConfig:IsEnabled("force_netbookmode") then
        SetUIScale(0.8)  -- Compact scale
    else
        SetUIScale(1.0)  -- Normal scale
    end
end

-- Performance adjustments
local function OptimizeGraphics()
    if TheConfig:IsEnabled("hide_vignette") then
        DisablePostProcessing()
    end
    
    local perfMode = TheConfig:IsEnabled("performance_mode")
    if perfMode then
        ReduceParticleEffects()
        LowerShadowQuality()
    end
end
```

### Debugging and Diagnostics

```lua
-- Configuration state inspection
local function DumpConfig()
    print("=== CURRENT CONFIGURATION ===")
    print(tostring(TheConfig))
    print("===============================")
end

-- Conditional debugging
if TheConfig:IsEnabled("debug_mode") then
    DumpConfig()
    EnableVerboseLogging()
end

-- Configuration validation
local function ValidateConfig()
    local requiredOptions = {"hide_vignette", "force_netbookmode"}
    for _, option in ipairs(requiredOptions) do
        local value = TheConfig:IsEnabled(option)
        if value == nil then
            print("Warning: Missing required config option:", option)
        end
    end
end
```

## Constants

### PLATFORM

**Status:** `stable`

**Description:** Global variable containing the current platform identifier used for applying platform-specific overrides.

**Possible Values:**
- `"NACL"`: Chrome Native Client
- `"ANDROID"`: Android mobile
- `"IOS"`: iOS mobile  
- `"WINDOWS"`: Windows desktop
- `"LINUX"`: Linux desktop
- `"OSX"`: macOS desktop

## Best Practices

### ✅ Recommended Usage

- Use `TheConfig:IsEnabled()` for all configuration checks
- Group related options using `SetOptions()` for batch updates
- Check for nil values when options might not be set
- Use descriptive option names that indicate their purpose
- Apply platform-specific optimizations through configuration
- Use configuration for feature flags and experimental features

### ❌ Usage Warnings

- Don't access `self.options` directly; use provided methods
- Don't assume options exist without checking for nil
- Don't use configuration for frequently changing values
- Don't store complex objects that might cause memory issues
- Don't modify platform override tables at runtime
- Don't use configuration for security-sensitive settings

## Error Handling

### Safe Configuration Access

```lua
-- Always check for nil when option might not exist
local customSetting = TheConfig:IsEnabled("optional_feature")
if customSetting ~= nil then
    ApplyCustomSetting(customSetting)
end

-- Provide defaults for missing options
local debugLevel = TheConfig:IsEnabled("debug_level") or 0
SetDebugLevel(debugLevel)
```

### Validation Patterns

```lua
-- Validate configuration state
local function ValidateRequiredConfig()
    local required = {"hide_vignette", "force_netbookmode"}
    for _, option in ipairs(required) do
        if TheConfig:IsEnabled(option) == nil then
            error("Required configuration option missing: " .. option)
        end
    end
end
```

## Related Systems

- **[Class](./class.md)**: Base class system used by Config
- **[Constants](./constants.md)**: Platform constants and global definitions  
- **[Main](./main.md)**: Game initialization and platform detection
- **[Frontend](./frontend.md)**: UI system that uses platform configuration

## Technical Notes

- Config extends the base Class system for object-oriented functionality
- Platform detection relies on the global `PLATFORM` variable set during initialization
- Configuration options are applied in order: defaults first, then platform overrides
- The `__tostring` metamethod enables easy debugging of configuration state
- All option values are stored in the `options` table for O(1) access
- Memory usage is minimal as only set options consume memory
- No persistence; configuration is rebuilt on each game start

---

*These configuration utilities provide platform-aware settings management essential for cross-platform deployment of Don't Starve Together.*
