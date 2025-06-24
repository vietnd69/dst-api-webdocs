---
id: modcompatability
title: Mod Compatibility
description: System for handling mod compatibility and version upgrades
sidebar_position: 103
slug: /core-systems/modcompatability
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Mod Compatibility

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `modcompatability` module provides functions for handling mod compatibility and upgrading mod data structures from older formats to newer versions. It primarily focuses on upgrading mod level data from version 1 to version 2 format.

## Usage Example

```lua
local modcompatability = require("modcompatability")

-- Upgrade mod level data from v1 to v2
local upgraded_level = modcompatability.UpgradeModLevelFromV1toV2(mod, level_data)
```

## Functions

### UpgradeModLevelFromV1toV2(mod, level) {#upgrade-mod-level-from-v1-to-v2}

**Status:** `stable`

**Description:**
Upgrades mod level data from version 1 format to version 2 format. This function handles the conversion of legacy mod level configurations to the modern format, ensuring compatibility with older mods.

**Parameters:**
- `mod` (string): The mod name being upgraded
- `level` (table): The level data table to upgrade

**Returns:**
- (table): The upgraded level data in version 2 format

**Example:**
```lua
local old_level = {
    id = "mymodlevel",
    overrides = {
        {"setting1", "value1"},
        {"setting2", "value2"}
    },
    set_pieces = { ... },  -- This will trigger an error
    -- location is missing, will trigger an error
}

local upgraded = modcompatability.UpgradeModLevelFromV1toV2("mymod", old_level)
-- upgraded.overrides will be converted to:
-- {
--     setting1 = "value1",
--     setting2 = "value2"
-- }
```

**Version History:**
- Current implementation since build 676042

## Upgrade Process

### Override Format Conversion

The function converts the old array-based override format to the new key-value format:

**Old Format (v1):**
```lua
level.overrides = {
    {"worldsettingspresets", "SURVIVAL_TOGETHER"},
    {"difficulty", "easy"}
}
```

**New Format (v2):**
```lua
level.overrides = {
    worldsettingspresets = "SURVIVAL_TOGETHER",
    difficulty = "easy"
}
```

### Location Validation

Version 2 requires levels to specify a location. If missing, the function will:
- Log an error message indicating the missing location
- Default the location to "forest"

### Deprecated Features

The function checks for and handles deprecated features:
- **set_pieces**: No longer supported at level scope, should be moved to Task Set
- **required_prefabs**: Currently commented out but was previously converted from array to count-based format

## Error Handling

The function uses `moderror()` to log compatibility issues:

1. **Override Format Errors**: When old array format is detected
2. **Set Pieces Error**: When deprecated set_pieces table is found
3. **Missing Location Error**: When required location field is missing

## Data Structure Changes

### Version Checking
- Checks `level.version` field
- Returns unchanged if version >= 2
- Processes upgrade if version < 2 or version is nil

### Deep Copy Protection
- Uses `deepcopy()` to avoid modifying original data
- Ensures safe transformation without side effects

## Integration

This module is typically used by:
- **Mod Loading System**: During mod initialization
- **Level Generation**: When processing mod-defined levels
- **Save System**: When loading older save files with mod data

## Related Modules

- [Mod Index](./modindex.md): Manages mod information and loading
- [Mod Utilities](./modutil.md): Provides mod development utilities
- [Mods](./mods.md): Core mod loading and management system
