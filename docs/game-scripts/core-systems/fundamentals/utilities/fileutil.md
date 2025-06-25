---
id: fileutil
title: File Utilities
description: Utility functions for managing persistent file operations including deletion and existence checking
sidebar_position: 9
slug: core-systems-fileutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# File Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `fileutil.lua` module provides utility functions for managing persistent file operations in Don't Starve Together. It offers asynchronous functions for bulk file deletion and existence checking, with platform-specific optimizations and callback-based result handling.

## Usage Example

```lua
-- Check if multiple files exist
local files_to_check = {"save1.lua", "save2.lua", "config.lua"}
CheckFiles(function(status)
    for file, exists in pairs(status) do
        print(file .. " exists: " .. tostring(exists))
    end
end, files_to_check)

-- Erase multiple files
local files_to_delete = {"temp1.lua", "temp2.lua"}
EraseFiles(function(success, deleted)
    if success then
        print("All files deleted successfully")
        for _, file in ipairs(deleted) do
            print("Deleted: " .. file)
        end
    else
        print("Some files failed to delete")
    end
end, files_to_delete)
```

## Functions

### EraseFiles(cb, files) {#erase-files}

**Status:** `stable`

**Description:**
Asynchronously deletes multiple persistent files with platform-specific handling and provides callback results.

**Parameters:**
- `cb` (function): Callback function called when all operations complete
  - `success` (boolean): Whether all files were successfully deleted
  - `deleted_files` (table): Array of successfully deleted file names
- `files` (table): Array of file names to delete

**Returns:**
- None (asynchronous operation with callback)

**Platform Behavior:**
- **PS4**: Skips existence check and directly attempts deletion
- **Other platforms**: Checks file existence before attempting deletion

**Example:**
```lua
local files = {"save_backup.lua", "temp_data.lua"}
EraseFiles(function(overall_success, deleted_files)
    if overall_success then
        print("All " .. #deleted_files .. " files deleted successfully")
    else
        print("Some files failed to delete. Deleted: " .. #deleted_files)
    end
    
    for _, filename in ipairs(deleted_files) do
        print("Successfully deleted: " .. filename)
    end
end, files)
```

**Implementation Details:**
```lua
-- Internal callback handling
local function onerased(success, file)
    res[file] = nil
    if success then
        table.insert(deleted_files, file)
    else
        overall_success = false
    end
    
    if not next(res) then
        if cb then
            cb(overall_success, deleted_files)
        end
    end
end
```

### CheckFiles(cb, files) {#check-files}

**Status:** `stable`

**Description:**
Asynchronously checks the existence of multiple persistent files and returns their status via callback.

**Parameters:**
- `cb` (function): Callback function called when all checks complete
  - `file_status` (table): Map of filename to boolean existence status
- `files` (table): Array of file names to check

**Returns:**
- None (asynchronous operation with callback)

**Example:**
```lua
local files_to_verify = {"player_data.lua", "world_settings.lua", "mod_config.lua"}
CheckFiles(function(status)
    for filename, exists in pairs(status) do
        if exists then
            print(filename .. " found")
        else
            print(filename .. " missing")
        end
    end
end, files_to_verify)
```

**Implementation Details:**
```lua
-- Internal callback for each file check
local function onchecked(success, file)
    res[file] = nil
    file_status[file] = success
    
    if not next(res) then
        if cb then
            cb(file_status)
        end
    end
end
```

## Common Usage Patterns

### Batch File Management

```lua
-- Clean up temporary files
local temp_files = {"cache1.tmp", "cache2.tmp", "debug.log"}
EraseFiles(function(success, deleted)
    print("Cleanup complete. Deleted " .. #deleted .. " files")
end, temp_files)
```

### File Validation

```lua
-- Verify required files exist before proceeding
local required_files = {"config.lua", "save_data.lua"}
CheckFiles(function(status)
    local all_exist = true
    for file, exists in pairs(status) do
        if not exists then
            all_exist = false
            print("Missing required file: " .. file)
        end
    end
    
    if all_exist then
        print("All required files present")
        -- Proceed with initialization
    end
end, required_files)
```

### Conditional File Operations

```lua
-- Check then delete pattern
local files_to_process = {"old_save1.lua", "old_save2.lua"}
CheckFiles(function(status)
    local existing_files = {}
    for file, exists in pairs(status) do
        if exists then
            table.insert(existing_files, file)
        end
    end
    
    if #existing_files > 0 then
        EraseFiles(function(success, deleted)
            print("Deleted " .. #deleted .. " existing files")
        end, existing_files)
    end
end, files_to_process)
```

## Error Handling

Both functions handle errors gracefully:

- **Empty file lists**: Callbacks are executed immediately with appropriate empty results
- **Missing files**: `EraseFiles` treats missing files as successful deletions
- **Platform differences**: PS4 optimization skips unnecessary existence checks
- **Asynchronous safety**: Proper callback management ensures all operations complete

## Platform Considerations

### PS4 Platform
- Skips existence checks for better performance
- Directly attempts file deletion
- Uses `ErasePersistentString` directly

### Other Platforms
- Performs existence check before deletion attempts
- Uses `TheSim:CheckPersistentStringExists` for verification
- More conservative approach to prevent unnecessary operations

## Related Modules

- [TheSim](./thesim.md): Provides low-level file system operations
- [Persistence](./persistence.md): Higher-level save data management
- [SaveIndex](./saveindex.md): Save file indexing and management
