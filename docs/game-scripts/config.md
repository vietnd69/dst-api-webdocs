---
id: config
title: Config
description: Manages global platform-specific configuration options and runtime settings.
tags: [utility, settings, platform]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 2ad4f3b1
system_scope: ui
---

# Config

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
The `Config` class provides a centralized key-value store for game settings and platform-specific overrides. It is instantiated globally as `TheConfig` to manage runtime options such as vignette visibility and netbook mode enforcement. Unlike entity components, this class is not attached to instances via `AddComponent` but is accessed directly as a global utility table. It initializes with default values and applies platform-specific overrides (e.g., `ANDROID`, `IOS`) during instantiation.

## Usage example
```lua
-- Access the global configuration instance
if TheConfig:IsEnabled("hide_vignette") then
    -- Vignette rendering is disabled
end

-- Enable a custom option dynamically
TheConfig:Enable("my_mod_setting")

-- Check if an option is active
local is_active = TheConfig:IsEnabled("my_mod_setting")
```

## Dependencies & tags
**Components used:** None. This is a global utility class, not an entity component.
**Tags:** None identified.

## Properties
The internal `options` table stores dynamic configuration keys. The following defaults are initialized in the global `TheConfig` instance:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `hide_vignette` | boolean | `false` | Controls whether the screen vignette effect is rendered. |
| `force_netbookmode` | boolean | `false` | Forces low-resolution or netbook rendering mode. |

## Main functions
### `SetOptions(options)`
*   **Description:** Merges a table of key-value pairs into the internal options table. Used internally to apply platform overrides.
*   **Parameters:** `options` (table) - A table containing configuration keys and values.
*   **Returns:** Nothing.

### `IsEnabled(option)`
*   **Description:** Checks if a specific configuration option is currently enabled (truthy).
*   **Parameters:** `option` (string) - The key name of the option to check.
*   **Returns:** `boolean` or `nil` - Returns the value associated with the key, or `nil` if not set.

### `Enable(option)`
*   **Description:** Sets a specific configuration option to `true`.
*   **Parameters:** `option` (string) - The key name of the option to enable.
*   **Returns:** Nothing.

### `Disable(option)`
*   **Description:** Removes a specific configuration option by setting its value to `nil`.
*   **Parameters:** `option` (string) - The key name of the option to disable.
*   **Returns:** Nothing.

### `__tostring()`
*   **Description:** Generates a string representation of all current configuration options for debugging or logging.
*   **Parameters:** None.
*   **Returns:** `string` - A formatted list of all keys and values in the options table.

## Events & listeners
None identified. This class does not interact with the event system.