---
id: quickjoinscreen
title: Quickjoinscreen
description: Manages automated server search and connection logic for quick join functionality in the multiplayer UI.
tags: [network, ui, multiplayer, server]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 714bde2a
system_scope: network
---

# Quickjoinscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`QuickJoinScreen` is a UI screen that performs automated discovery and filtering of multiplayer servers, then attempts to join the best available server based on scoring and client constraints. It extends `GenericWaitingPopup` and integrates with `TheNet` to handle network querying, filtering, and connection attempts. The component handles server filtering logic (e.g., friends-only, version compatibility, offline mode), manages retry attempts (`MAX_JOIN_ATTEMPTS`), and reports success or failure via metrics.

## Usage example
```lua
-- Typically invoked internally by the frontend when user selects "Quick Join"
local screen = QuickJoinScreen(prev_screen, offline_mode, session_mapping, event_id, score_fn, host_cb, browse_cb)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None directly (`inst.components.X` not used). Relies on global singletons: `TheNet`, `TheFrontEnd`, `TheInput`, `Stats`, `STRINGS`, `APPT_VERSION`, `BRANCH`, `PLATFORM`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `event_id` | string | `""` | Optional event identifier used to filter event-specific servers. |
| `string_table` | table | `STRINGS.UI.QUICKJOINSCREEN` or `STRINGS.UI.EVENT_QUICKJOINSCREEN` | Localized strings used in UI messages. |
| `offline` | boolean | — | Whether the client is in offline mode. Set at construction. |
| `log` | boolean | `true` | Enables logging; used for debugging. |
| `prev_screen` | Screen | — | Screen to return to on cancellation. |
| `scorefn` | function | `nil` | Callback function used to compute server score. |
| `tohostscreencb` | function | `nil` | Callback invoked when user chooses to host a new game from the error dialog. |
| `tobrowsescreencb` | function | `nil` | Callback invoked when user chooses to browse servers manually from the error dialog. |
| `status_msg` | Text | — | UI text widget showing connection status (e.g., `CONNECTING_TO_SERVER`). |
| `sessions` | table | `{}` | Cache mapping session GUIDs to processed player data. |
| `session_mapping` | table | `nil` | Lookup table mapping session GUIDs to raw session data strings. |
| `filtered_servers` | table | `{}` | List of servers that passed filters and scoring, sorted by score. |
| `servertojoin` | number or `MAX_JOIN_ATTEMPTS` | `nil` / `40` | Index of the next server to attempt in `filtered_servers`, or `MAX_JOIN_ATTEMPTS` if no servers matched. |
| `queuejoingame` | boolean | `false` | Flag indicating a join attempt is pending (to avoid recursion). |
| `startsearchtime` | number | — | Timestamp of when server search started. |
| `keepsearchingtimer` | number | — | Internal timer used to delay server selection. |

## Main functions
### `ProcessPlayerData(session)`
*   **Description:** Retrieves and caches player data associated with a given session GUID. It checks if the session data is preprocessed; otherwise, it runs the raw string in a sandbox and caches the result.
*   **Parameters:** `session` (string) — session GUID.
*   **Returns:** `boolean` — `true` if player data exists and is valid; `false` otherwise.

### `IsValidWithFilters(server)`
*   **Description:** Evaluates whether a server meets client-side filtering criteria (e.g., friends-only, version match, offline mode). Used to pre-filter the server list before scoring.
*   **Parameters:** `server` (table) — server listing object from `TheNet`.
*   **Returns:** `boolean` — `true` if the server passes all filters; `false` otherwise.

### `ShouldKeepSearching()`
*   **Description:** Determines whether the screen should continue waiting for server listings to populate.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if listings are not finalized (`TheNet:GetServerListingReadDirty()`, `IsSearchingServers()`, and elapsed time `< MAX_INITIAL_SEARCH_TIME`).

### `KeepSearching(searchtime)`
*   **Description:** Sets the internal timer to delay server selection by `searchtime` seconds. Used to wait for more server listings before proceeding.
*   **Parameters:** `searchtime` (number) — duration in seconds to continue searching.
*   **Returns:** Nothing.

### `TryPickServer()`
*   **Description:** Conducts filtering and scoring of discovered servers. If sufficient servers exist, sorts them by score/ping and queues the first for join. If no servers pass, displays an error dialog after `MAX_SEARCH_TIME`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TryNextServer(error, reason)`
*   **Description:** Attempts to join the next server in the filtered list after a failure. Logs the error, updates metrics on final failure, and shows the "no servers found" error dialog.
*   **Parameters:** `error` (any) — error code/message. `reason` (any) — human-readable reason.
*   **Returns:** Nothing.

### `JoinGame()`
*   **Description:** Initiates connection to the server identified by `self.servertojoin`. Invokes `TheNet:JoinServerResponse`, plays a sound, and updates the status UI.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Close()`
*   **Description:** Cancels any pending network activity and closes the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCancel()`
*   **Description:** Handles user-initiated cancellation (e.g., pressing Back). Reports metrics and closes the screen.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly (`inst:ListenForEvent` not used).
- **Pushes:** None explicitly (`inst:PushEvent` not used).