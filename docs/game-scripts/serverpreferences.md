---
id: serverpreferences
title: Serverpreferences
description: Manages server-specific preferences such as name/description filtering and profanity filtering, and persists user data across sessions.
tags: [network, preferences, server, filtering]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: components
source_hash: 9f90f1b0
system_scope: network
---

# Serverpreferences

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ServerPreferences` is a singleton-style class that manages user-configurable preferences for individual servers, including toggling visibility of server names/descriptions and handling profanity filtering. It persists user settings (e.g., whether a server's name/description is hidden) and profanity-filtered servers across sessions using `SavePersistentString`. It integrates with `TheNet`, `Profile`, `ProfanityFilter`, and `Stats` for server metadata, profanity detection, and telemetry.

## Usage example
```lua
-- Example: Hide a specific server's name/description and save preferences
local server_data = { name = "MyServer", description = "Fun lobby!" }
inst.components.serverpreferences:ToggleNameAndDescriptionFilter(server_data)

-- Example: Check if a server's name/description is currently hidden
if inst.components.serverpreferences:IsNameAndDescriptionHidden(server_data) then
    -- UI logic for hidden server
end

-- Example: Load and refresh stale entries
inst.components.serverpreferences:Load()
inst.components.serverpreferences:RefreshLastSeen(all_servers_list)
```

## Dependencies & tags
**Components used:** None (itself is a component-like module, instantiated globally as `TheWorld.components.serverpreferences` or equivalent).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persistdata` | table | `{}` | Stores per-server preference data (e.g., `hidename`, `lastseen`) keyed by server ID. |
| `profanityservers` | table | `{}` | Tracks server IDs where profanity-filtered name/description has been applied (boolean value: `true` = hidden). |
| `dirty` | boolean | `true` | Flag indicating whether `persistdata` has unsaved changes. |

## Main functions
### `Reset()`
* **Description:** Clears all stored preferences (`persistdata` and `profanityservers`) and marks the component as dirty for immediate save.
* **Parameters:** None.
* **Returns:** Nothing.

### `ToggleNameAndDescriptionFilter(server_data)`
* **Description:** Toggles the `hidename` flag for the given server. If the profanity filter is enabled, it uses `profanityservers`; otherwise, it modifies `persistdata`. Also records a telemetry event.
* **Parameters:**  
  `server_data` (nil|string|table) – Server identifier: `nil` (current server), a string (server name), or a table with `name` and `description` fields.
* **Returns:** Nothing.

### `IsNameAndDescriptionHidden(server_data)`
* **Description:** Checks whether the server's name/description is hidden due to user preference or profanity filtering.
* **Parameters:**  
  `server_data` (nil|string|table) – Server identifier (same format as `ToggleNameAndDescriptionFilter`).
* **Returns:** `boolean` – `true` if hidden, `false` otherwise.

### `RefreshLastSeen(server_list)`
* **Description:** Updates the `lastseen` timestamp for servers in the list that are older than 5 minutes and saves if any changes were made.
* **Parameters:**  
  `server_list` (table) – List of server objects to check.
* **Returns:** Nothing.

### `ClearProfanityFilteredServers()`
* **Description:** Clears the `profanityservers` cache (used to reset filtered servers).
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateProfanityFilteredServers(servers)`
* **Description:** Scans a list of servers for profanity in name/description (if enabled by `Profile`) and marks them as filtered in `profanityservers` if they fail the filter. Only sets servers owned by others as hidden (`not server.owner`).
* **Parameters:**  
  `servers` (table) – List of server objects to scan.
* **Returns:** Nothing.

### `UpdateProfanityFilteredServer(server)`
* **Description:** Similar to `UpdateProfanityFilteredServers`, but for a single server. If `server` is `nil`, uses the current server (`TheNet`).
* **Parameters:**  
  `server` (nil|table) – Server object to scan, or `nil` for current server.
* **Returns:** Nothing.

### `GetSaveName()`
* **Description:** Returns the filename used for persistence. Uses `"server_preferences"` unless in `dev` branch, in which case appends the branch name.
* **Parameters:** None.
* **Returns:** `string` – Save filename.

### `Save(callback)`
* **Description:** Encodes and saves `persistdata` to persistent storage if `dirty` is `true`. Also purges entries older than `USER_HISTORY_EXPIRY_TIME` before saving.
* **Parameters:**  
  `callback` (nil|function) – Optional function called with `(success)` when done.
* **Returns:** Nothing.

### `Load(callback)`
* **Description:** Initiates loading of saved data via `TheSim:GetPersistentString`.
* **Parameters:**  
  `callback` (nil|function) – Optional function called with `(success)` after `OnLoad` completes.
* **Returns:** Nothing.

### `OnLoad(str, callback)`
* **Description:** Processes raw loaded string: decodes JSON into `persistdata`, sets `dirty=false`, re-saves, and invokes callback.
* **Parameters:**  
  `str` (string|null) – Raw saved data (may be `nil` or empty).  
  `callback` (nil|function) – Optional function called with `(success)`.
* **Returns:** Nothing.

## Events & listeners
None.