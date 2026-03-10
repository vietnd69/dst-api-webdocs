---
id: knownerrors
title: Knownerrors
description: Centralized error definition and assertion helper for configuration and world-related failures in Don't Starve Together.
tags: [error, config, world, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: a503950e
system_scope: environment
---

# Knownerrors

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`knownerrors.lua` defines a global table `ERRORS` containing preformatted, human-readable error messages for known failure conditions—particularly those related to file system permissions, disk space, and world loading. It also provides the `known_assert()` helper function, which terminates execution with a standardized error message when a condition is not met. This module is used during initialization to provide clear, actionable feedback to users rather than generic Lua errors.

## Usage example
```lua
-- Ensure the config directory is writable before proceeding
known_assert(CreateDirectory("/path/to/config"), "CONFIG_DIR_WRITE_PERMISSION")

-- Validate a world save exists before loading
known_assert(SaveSlotExists(slot_id), "DEV_FAILED_TO_SPAWN_WORLD")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ERRORS` | table | (see below) | Global dictionary mapping error keys (e.g., `"CONFIG_DIR_WRITE_PERMISSION"`) to tables with `message` (string) and optionally `url` (string). |
| `DEBUG_MODE` | boolean | `false` | Set to `true` in dev builds; enables additional debug-only errors like `DEV_FAILED_TO_SPAWN_WORLD`. |

### `ERRORS` table keys
| Key | Message | URL (if present) |
|-----|---------|------------------|
| `CONFIG_DIR_WRITE_PERMISSION` | "Unable to write to config directory. Please make sure you have permissions for your Klei save folder." | `https://support.klei.com/hc/en-us/articles/360029882171` |
| `CONFIG_DIR_READ_PERMISSION` | "Unable to read from config directory. Please make sure you have read permissions for your Klei save folder." | `https://support.klei.com/hc/en-us/articles/360035294792` |
| `CONFIG_DIR_CLIENT_LOG_PERMISSION` | "Unable to write to files in the config directory. Please make sure you have permissions for your Klei save folder." | `https://support.klei.com/hc/en-us/articles/360029882171` |
| `CUSTOM_COMMANDS_ERROR` | "Error loading customcommands.lua." | — |
| `AGREEMENTS_WRITE_PERMISSION` | "Unable to write to the agreements file. Please make sure you have permissions for your Klei save folder." | `https://support.klei.com/hc/en-us/articles/360029881751` |
| `CONFIG_DIR_DISK_SPACE` | "There is not enough available hard drive space to reliably save worlds. Please free up some hard drive space." | — |
| `DEV_FAILED_TO_SPAWN_WORLD` *(debug only)* | "Failed to load world from save slot.\n\n Delete the save you loaded.\n If you used Host Game, delete your first saveslot." | — |
| `DEV_FAILED_TO_LOAD_PREFAB` *(debug only)* | "Failed to load prefab from file.\n\n Run updateprefabs.bat to fix." | — |

## Main functions
### `known_assert(condition, key)`
* **Description:** Checks if `condition` is truthy; if not, terminates the current call stack with the error message associated with `key` from the `ERRORS` table. If `condition` is truthy, returns the condition value.
* **Parameters:**
  * `condition` (any) — Any value; treated as false if `nil` or `false`.
  * `key` (string) — Key identifying the error in the `ERRORS` table (e.g., `"CONFIG_DIR_WRITE_PERMISSION"`).
* **Returns:** If `condition` is truthy, returns `condition`; otherwise, does not return (terminates).
* **Error states:** If `key` is not present in `ERRORS`, falls back to a generic `error(key, 2)` with the key string as the message. The `2` argument ensures the error is raised at the caller’s call site.

## Events & listeners
None identified