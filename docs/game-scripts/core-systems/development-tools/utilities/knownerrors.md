---
id: knownerrors
title: Known Errors
description: Structured error handling system for common game errors with user-friendly messages
sidebar_position: 3

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Known Errors

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `knownerrors` module provides a structured error handling system for common game errors. It defines user-friendly error messages with optional support URLs and provides a specialized assertion function that displays helpful error information to users instead of cryptic error codes.

## Usage Example

```lua
-- Use known_assert instead of regular assert for better error messages
known_assert(can_write_to_config, "CONFIG_DIR_WRITE_PERMISSION")

-- Check for specific error conditions
if not has_disk_space then
    known_assert(false, "CONFIG_DIR_DISK_SPACE")
end
```

## Constants

### DEBUG_MODE

**Value:** `BRANCH == "dev"`

**Status:** `stable`

**Description:** Determines whether developer-specific error messages are available. Set to true in development builds, false in production.

## Error Definitions

### ERRORS

**Type:** `table`

**Status:** `stable`

**Description:** Table containing all known error definitions with user-friendly messages and optional support URLs.

### Production Errors

#### CONFIG_DIR_WRITE_PERMISSION

**Message:** `"Unable to write to config directory.\nPlease make sure you have permissions for your Klei save folder."`

**Support URL:** `https://support.klei.com/hc/en-us/articles/360029882171`

**Description:** Triggered when the game cannot write to the configuration directory due to file permissions.

#### CONFIG_DIR_READ_PERMISSION

**Message:** `"Unable to read from config directory.\nPlease make sure you have read permissions for your Klei save folder."`

**Support URL:** `https://support.klei.com/hc/en-us/articles/360035294792`

**Description:** Triggered when the game cannot read from the configuration directory.

#### CONFIG_DIR_CLIENT_LOG_PERMISSION

**Message:** `"Unable to write to files in the config directory.\nPlease make sure you have permissions for your Klei save folder."`

**Support URL:** `https://support.klei.com/hc/en-us/articles/360029882171`

**Description:** Triggered when client logging fails due to write permissions in the config directory.

#### CUSTOM_COMMANDS_ERROR

**Message:** `"Error loading customcommands.lua."`

**Description:** Triggered when there's an error loading the custom commands file.

#### AGREEMENTS_WRITE_PERMISSION

**Message:** `"Unable to write to the agreements file.\nPlease make sure you have permissions for your Klei save folder."`

**Support URL:** `https://support.klei.com/hc/en-us/articles/360029881751`

**Description:** Triggered when the game cannot write to the user agreements file.

#### CONFIG_DIR_DISK_SPACE

**Message:** `"There is not enough available hard drive space to reliably save worlds. Please free up some hard drive space."`

**Description:** Triggered when insufficient disk space is available for saving game worlds.

### Developer-Only Errors

These errors are only available when `DEBUG_MODE` is true:

#### DEV_FAILED_TO_SPAWN_WORLD

**Message:** `"Failed to load world from save slot.\n\n Delete the save you loaded.\n If you used Host Game, delete your first saveslot."`

**Description:** Development error for world loading failures with specific troubleshooting steps.

#### DEV_FAILED_TO_LOAD_PREFAB

**Message:** `"Failed to load prefab from file.\n\n Run updateprefabs.bat to fix."`

**Description:** Development error for prefab loading failures with fix instructions.

## Functions

### known_assert(condition, key) {#known-assert}

**Status:** `stable`

**Description:**
Enhanced assertion function that displays user-friendly error messages for known error conditions. If the condition fails, it looks up the error message by key and displays it instead of a generic assertion failure.

**Parameters:**
- `condition` (any): The condition to test (truthy/falsy evaluation)
- `key` (string): Error key to look up in the ERRORS table

**Returns:**
- (any): The condition value if the assertion passes

**Side Effects:**
- Sets global `known_error_key` to the error key when an error occurs
- Calls `error()` with the user-friendly message or the key itself

**Example:**
```lua
-- Basic usage
local config_writable = CheckConfigWritePermissions()
known_assert(config_writable, "CONFIG_DIR_WRITE_PERMISSION")

-- With return value
local save_data = known_assert(LoadSaveData(), "CUSTOM_COMMANDS_ERROR")

-- Fallback to key as message
known_assert(some_condition, "UNKNOWN_ERROR_KEY") -- Shows "UNKNOWN_ERROR_KEY" as message
```

**Error Handling:**
- **Known Errors:** Displays `ERRORS[key].message` and sets `known_error_key`
- **Unknown Keys:** Uses the key itself as the error message
- **Stack Level:** Uses level 2 to report error at the caller's location

## Error Message Structure

Each error in the ERRORS table can contain:

```lua
ERRORS.ERROR_KEY = {
    message = "User-friendly error description",  -- Required
    url = "https://support.klei.com/...",         -- Optional support URL
}
```

### Message Format Guidelines

- **Clear Description:** Explain what went wrong in user-friendly terms
- **Actionable Steps:** Include specific steps users can take to resolve the issue
- **Newlines:** Use `\n` for proper formatting in multi-line messages
- **Permissions Focus:** Many errors relate to file system permissions

### Support URL Integration

Support URLs provide additional help resources:
- Link to Klei Entertainment's support documentation
- Provide detailed troubleshooting steps
- May include screenshots or video tutorials

## Global State

### known_error_key

**Type:** `string`

**Description:** Global variable set when `known_assert()` fails, containing the error key that was used. This allows other systems to identify which specific error occurred.

## Development vs Production Behavior

### Production Mode (DEBUG_MODE = false)
```lua
ERRORS = {
    CONFIG_DIR_WRITE_PERMISSION = { ... },
    CONFIG_DIR_READ_PERMISSION = { ... },
    -- Only production errors available
}
```

### Development Mode (DEBUG_MODE = true)
```lua
ERRORS = {
    CONFIG_DIR_WRITE_PERMISSION = { ... },
    CONFIG_DIR_READ_PERMISSION = { ... },
    -- Production errors plus:
    DEV_FAILED_TO_SPAWN_WORLD = { ... },
    DEV_FAILED_TO_LOAD_PREFAB = { ... },
}
```

## Common Usage Patterns

### File System Validation
```lua
-- Check config directory permissions
known_assert(CanWriteToConfigDir(), "CONFIG_DIR_WRITE_PERMISSION")
known_assert(CanReadFromConfigDir(), "CONFIG_DIR_READ_PERMISSION")

-- Verify disk space before saving
known_assert(HasSufficientDiskSpace(), "CONFIG_DIR_DISK_SPACE")
```

### Resource Loading
```lua
-- Custom commands loading
local success = pcall(LoadCustomCommands)
known_assert(success, "CUSTOM_COMMANDS_ERROR")

-- Agreement file handling
known_assert(CanWriteAgreements(), "AGREEMENTS_WRITE_PERMISSION")
```

### Development Debugging
```lua
if DEBUG_MODE then
    known_assert(world_loaded, "DEV_FAILED_TO_SPAWN_WORLD")
    known_assert(prefab_exists, "DEV_FAILED_TO_LOAD_PREFAB")
end
```

## Error Recovery Strategies

Different error types suggest different recovery approaches:

1. **Permission Errors:** Guide users to check file/folder permissions
2. **Disk Space Errors:** Prompt users to free up storage space
3. **Loading Errors:** Provide specific file or configuration fixes
4. **Development Errors:** Give developers clear troubleshooting steps

## Integration with Support System

The error system integrates with Klei's support infrastructure:

- **Consistent URLs:** Support URLs follow standard Klei help center format
- **Error Tracking:** `known_error_key` enables telemetry and support ticket correlation
- **User Experience:** Reduces confusion by providing actionable error messages

## Best Practices

### Error Key Naming
- Use descriptive, all-caps names with underscores
- Include the affected system (CONFIG_DIR, AGREEMENTS, etc.)
- Specify the type of issue (PERMISSION, DISK_SPACE, etc.)

### Message Content
- Start with what went wrong
- Explain the likely cause
- Provide specific steps to fix the issue
- Use clear, non-technical language when possible

### URL Management
- Keep support URLs current and functional
- Ensure URLs point to relevant help content
- Consider version-specific documentation needs

## Related Modules

- [builtinusercommands](./builtinusercommands.md): May trigger CUSTOM_COMMANDS_ERROR
- [config](./config.md): Uses permission-related errors
- [saveindex](./saveindex.md): May trigger disk space errors
- [fileutil](./fileutil.md): File system operations that may fail

## Debugging Support

The known errors system aids in debugging:

- **Error Categorization:** Groups related errors by system
- **Support Integration:** Links to relevant documentation
- **Development Mode:** Provides additional context for developers
- **Global Tracking:** `known_error_key` enables error correlation across systems
