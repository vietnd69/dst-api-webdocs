---
id: generickv
title: Generic Key-Value Store
description: Wrapper for TheInventory synchronization providing persistent key-value storage
sidebar_position: 4
slug: game-scripts/core-systems/generickv
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Generic Key-Value Store

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `generickv.lua` module provides a `GenericKV` class that acts as a wrapper for TheInventory synchronization steps. It offers persistent key-value storage functionality with automatic saving and loading capabilities. 

> ⚠️ **Important Note**: This module is designed for internal game use and TheInventory synchronization. Mods should use other saving methods as this storage system is not safe for mod data.

## Usage Example

```lua
-- Create a new GenericKV instance
local kv_store = GenericKV()

-- Load existing data
kv_store:Load()

-- Set a value
kv_store:SetKV("player_setting", "value")

-- Get a value
local setting = kv_store:GetKV("player_setting")

-- Apply online profile data
kv_store:ApplyOnlineProfileData()
```

## Class: GenericKV

### Constructor

#### GenericKV() {#constructor}

**Status:** `stable`

**Description:**
Creates a new GenericKV instance with empty key-value storage.

**Returns:**
- (GenericKV): New instance with initialized empty `kvs` table

**Properties:**
- `kvs` (table): Internal key-value storage table
- `save_enabled` (boolean): Whether saving is enabled
- `dirty` (boolean): Whether data has been modified
- `synced` (boolean): Whether data is synced with online profile
- `loaded` (boolean): Whether data has been loaded from disk

## Methods

### inst:GetKV(key) {#get-kv}

**Status:** `stable`

**Description:**
Retrieves a value from the key-value store.

**Parameters:**
- `key` (string): The key to look up

**Returns:**
- (string/nil): The stored value or nil if key doesn't exist

**Example:**
```lua
local kv = GenericKV()
local value = kv:GetKV("my_setting")
if value then
    print("Setting value:", value)
else
    print("Setting not found")
end
```

### inst:SetKV(key, value) {#set-kv}

**Status:** `stable`

**Description:**
Sets a key-value pair in the store. Only works when save is enabled and value is different from current value.

**Parameters:**
- `key` (string): The key to set
- `value` (string): The value to store (must be a string)

**Returns:**
- (boolean): True if the value was successfully set, false otherwise

**Example:**
```lua
local kv = GenericKV()
kv.save_enabled = true  -- Enable saving

local success = kv:SetKV("user_preference", "dark_mode")
if success then
    print("Value set successfully")
else
    print("Failed to set value")
end
```

**Version History:**
- Includes automatic TheInventory synchronization on non-dedicated servers
- Triggers automatic save when save_enabled is true

### inst:Save(force_save) {#save}

**Status:** `stable`

**Description:**
Saves the key-value data to persistent storage using JSON encoding.

**Parameters:**
- `force_save` (boolean): Whether to force save regardless of dirty state

**Returns:**
- None

**Example:**
```lua
local kv = GenericKV()
kv.save_enabled = true
kv:SetKV("setting", "value")
kv:Save(true)  -- Force save
```

**Technical Details:**
- Uses `TheSim:SetPersistentString()` with filename "generickv"
- Encodes data as JSON: `{kvs = self.kvs}`
- Clears dirty flag after successful save

### inst:Load() {#load}

**Status:** `stable`

**Description:**
Loads key-value data from persistent storage. Uses asynchronous loading with callback.

**Returns:**
- None

**Example:**
```lua
local kv = GenericKV()
kv:Load()
-- Data will be available after the async callback completes
```

**Technical Details:**
- Uses `TheSim:GetPersistentString()` with filename "generickv"
- Handles JSON decoding with error checking
- Sets `loaded` flag to true on successful load
- Prints error message if loading or parsing fails

### inst:ApplyOnlineProfileData() {#apply-online-profile-data}

**Status:** `stable`

**Description:**
Synchronizes local data with online profile data from TheInventory system.

**Returns:**
- (boolean): True if synchronization was successful, false otherwise

**Example:**
```lua
local kv = GenericKV()
if kv:ApplyOnlineProfileData() then
    print("Successfully synced with online profile")
else
    print("Sync not available or already completed")
end
```

**Synchronization Conditions:**
- Must not already be synced (`self.synced` is false)
- Must have offline skin support OR be in online mode
- Must have downloaded inventory data

**Technical Details:**
- Uses `TheInventory:GetLocalGenericKV()` to get online data
- Sets `synced` flag to true after successful sync
- Automatically saves to disk if no local save data exists

## Integration Points

### TheInventory Integration

The GenericKV system integrates with several game systems:

```lua
-- Check inventory support
if TheInventory:HasSupportForOfflineSkins() then
    -- Can sync offline
end

if TheInventory:HasDownloadedInventory() then
    -- Online data is available
end

-- Set values in TheInventory (non-dedicated servers only)
if not TheNet:IsDedicated() then
    TheInventory:SetGenericKVValue(key, value)
end
```

### Network Integration

```lua
-- Check if running on dedicated server
if TheNet:IsDedicated() then
    -- Skip TheInventory updates
end

-- Check online mode
if TheNet:IsOnlineMode() then
    -- Can use online features
end
```

## Data Format

### Persistent Storage Format

Data is stored as JSON in the following structure:

```json
{
  "kvs": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### Memory Structure

```lua
-- Internal kvs table structure
self.kvs = {
    ["setting_name"] = "setting_value",
    ["user_preference"] = "preference_value",
    ["cached_data"] = "cached_value"
}
```

## Common Usage Patterns

### Basic Key-Value Operations

```lua
local kv = GenericKV()
kv.save_enabled = true
kv:Load()

-- Set multiple values
kv:SetKV("theme", "dark")
kv:SetKV("language", "en")
kv:SetKV("volume", "0.8")

-- Read values with defaults
local theme = kv:GetKV("theme") or "light"
local language = kv:GetKV("language") or "en"
```

### Online Profile Synchronization

```lua
local kv = GenericKV()
kv:Load()

-- Try to sync with online profile
if kv:ApplyOnlineProfileData() then
    print("Using online profile data")
else
    print("Using local data")
end

-- Now safe to read/write values
kv.save_enabled = true
kv:SetKV("last_sync", tostring(os.time()))
```

### Error Handling

```lua
local kv = GenericKV()
kv:Load()

-- Wait for load to complete before using
-- Note: Load is asynchronous, so you may need to wait

local function try_set_value()
    if kv.loaded then
        kv.save_enabled = true
        local success = kv:SetKV("test_key", "test_value")
        if not success then
            print("Failed to set value - save not enabled or same value")
        end
    else
        print("Data not loaded yet")
    end
end
```

## Limitations and Warnings

### Mod Usage Warning

> ⚠️ **Critical**: Do not use GenericKV for mod data storage. This system is designed for TheInventory synchronization and is not safe for mod use.

### Value Type Restriction

```lua
-- Only strings are allowed as values
kv:SetKV("valid", "string_value")  -- ✓ Valid

-- These will cause assertion errors:
-- kv:SetKV("invalid", 123)        -- ✗ Number
-- kv:SetKV("invalid", {})         -- ✗ Table
-- kv:SetKV("invalid", true)       -- ✗ Boolean
```

### Save State Requirements

```lua
-- save_enabled must be true for SetKV to work
local kv = GenericKV()
kv:SetKV("test", "value")  -- Returns false - save not enabled

kv.save_enabled = true
kv:SetKV("test", "value")  -- Returns true - will save
```

## Related Modules

- [JSON](./json.md): JSON encoding/decoding functionality
- [TheInventory](../systems/inventory.md): Inventory synchronization system
- [Persistent Storage](../systems/persistence.md): Game save/load systems
