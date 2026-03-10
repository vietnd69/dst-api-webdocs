---
id: fileutil
title: Fileutil
description: Provides utility functions for checking and erasing persistent string files, commonly used for save data or configuration cleanup.
tags: [save, file, util, persistence]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 23fe08f8
system_scope: world
---

# Fileutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`fileutil` provides two static utility functions—`EraseFiles` and `CheckFiles`—for managing persistent string files used by the game for saving or configuration purposes. These functions handle asynchronous file operations, including platform-specific behavior for console platforms (e.g., PS4) and platform-independent checks via `TheSim`. They support batch operations and allow callers to provide callbacks with aggregated success status and results.

## Usage example
```lua
local files_to_delete = {"save1", "save2", "config_backup"}
local files_to_check = {"old_save", "temp_data"}

EraseFiles(function(success, deleted_files)
    if success then
        print("Deleted files:", #deleted_files)
    else
        print("Some deletions failed")
    end
end, files_to_delete)

CheckFiles(function(status)
    for file, exists in pairs(status) do
        print("File", file, exists and "exists" or "does not exist")
    end
end, files_to_check)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `EraseFiles(cb, files)`
* **Description:** Attempts to erase a list of persistent string files. If a file does not exist, it is treated as successfully erased. Completion is signaled by invoking the callback with overall success status and a list of files actually deleted.
* **Parameters:** 
  * `cb` (function?) - Optional callback invoked with `(success: boolean, deleted_files: table)` when all operations complete.
  * `files` (table) - List (array) of file identifiers (strings) to erase.
* **Returns:** Nothing.

### `CheckFiles(cb, files)`
* **Description:** Checks whether a list of persistent string files exist and reports the status for each. Completion is signaled by invoking the callback with a table mapping file identifiers to boolean existence status.
* **Parameters:** 
  * `cb` (function?) - Optional callback invoked with `(file_status: table)` when all checks complete. Each key in `file_status` is a file identifier; each value is `true` if the file exists, `false` otherwise.
  * `files` (table) - List (array) of file identifiers (strings) to check.
* **Returns:** Nothing.

## Events & listeners
None identified