---
id: quickjoinscreen
title: Quickjoinscreen
description: Manages the UI and logic for automatically searching and joining an appropriate multiplayer server based on user-defined preferences and filtering criteria.
tags: [ui, network, multiplayer, server]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 5ab48133
system_scope: network
---

# Quickjoinscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`QuickJoinScreen` implements the automatic server browser UI for DST. It initiates a server search, applies client-side filters (e.g., friends-only, version compatibility, offline mode), scores remaining servers using a provided function, and attempts to connect to the highest-priority server(s) with fallback logic. It is a screen-level component (inherits from `Screen`) and interacts heavily with `TheNet` to manage server discovery and joining.

## Usage example
```lua
local QuickJoinScreen = require "screens/quickjoinscreen"
local prev_screen = TheFrontEnd:GetTopScreen()
TheFrontEnd:PushScreen(QuickJoinScreen(
    prev_screen,
    false, -- offline
    session_mapping,
    function(server) return server.score end,
    function() -- to host screen callback
        TheFrontEnd:PushScreen(HostScreen())
    end,
    function() -- to browse screen callback
        TheFrontEnd:PushScreen(ServerBrowserScreen())
    end
))
```

## Dependencies & tags
**Components used:** `TheNet`, `TheFrontEnd`, `TheInput`, `Stats`, `STRINGS.UI.QUICKJOINSCREEN`, `BRANCH`, `APP_VERSION`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `offline` | boolean | `nil` | Flag indicating whether to use offline mode (no online servers shown). |
| `prev_screen` | Widget | `nil` | The screen to return to if cancelled or no servers found. |
| `scorefn` | function | `nil` | Optional function to compute a numeric score for each server; used to prioritize join attempts. |
| `tohostscreencb` | function | `nil` | Callback invoked when no servers are found and user chooses to host. |
| `tobrowsescreencb` | function | `nil` | Callback invoked when no servers are found and user chooses to browse manually. |
| `proot` | Widget | `nil` | Root widget container for UI elements. |
| `cancel_btn` | ImageButton | `nil` | Cancel button widget. |
| `title` | Text | `nil` | Title text widget. |
| `text` | Text | `nil` | Body text widget (e.g., status message). |
| `progress` | Text | `nil` | Progress indicator (animated dots). |
| `progressstick` | number | `0` | Timer tick for progress animation. |
| `time` | number | `0` | Accumulated time since last UI update. |
| `keepsearchingtimer` | number | `0` | Countdown before attempting server selection. |
| `filtered_servers` | table | `nil` | List of servers passing all filters, scored and sorted. |
| `servertojoin` | number | `nil` | Index into `filtered_servers` for the next server to attempt. |
| `queuejoingame` | boolean | `nil` | Flag indicating a pending join attempt. |
| `sessions` | table | `{}` | Cache of processed session/player data to support `allow_new_players` filtering. |
| `session_mapping` | table | `nil` | Reference to external session metadata (used to pre-cache or validate player data). |
| `startsearchtime` | number | `GetStaticTime()` | Timestamp when the server search began. |

## Main functions
### `ProcessPlayerData(session)`
* **Description:** Retrieves or caches pre-processed player data associated with a given session ID, used to determine if a server is joinable under restrictive settings (`allow_new_players`).
* **Parameters:** `session` (string) — Session identifier to look up.
* **Returns:** `boolean` — `true` if player data exists and is valid; `false` otherwise.
* **Error states:** None.

### `KeepSearching(searchtime)`
* **Description:** Resets or extends the search continuation timer by `searchtime` seconds. Called after filtering results to allow more time for server listings to populate.
* **Parameters:** `searchtime` (number) — Seconds to continue searching.
* **Returns:** Nothing.

### `IsValidWithFilters(server)`
* **Description:** Applies a suite of client-side filters to determine whether a given server listing is eligible for join consideration. Filters include: friends-only, clan-only, version mismatch, offline mode compatibility, `allow_new_players` restriction, and reachability (online vs offline mode).
* **Parameters:** `server` (table) — Server listing object from `TheNet:GetServerListings()`.
* **Returns:** `boolean` — `true` if the server passes all filters; `false` otherwise.
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** Updates UI state (animated progress dots) and handles timed logic: continuing the search, filtering/sorting servers via `TryPickServer`, and initiating join attempts.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `ShouldKeepSearching()`
* **Description:** Checks if the search should continue based on readiness of server listings, ongoing search state, and the initial search timeout (`MAX_INITAIL_SEARCH_TIME`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if searching should continue; `false` otherwise.

### `TryPickServer()`
* **Description:** Initiates server filtering, scoring, and selection. Either extends the search timer, stops the search after filtering/sorting, or queues a join attempt to the top-scoring server. On failure to find any matching servers, displays an error dialog after `MAX_SEARCH_TIME`.
* **Parameters:** None.
* **Returns:** Nothing.

### `TryNextServer(error, reason)`
* **Description:** Handles server join failure: logs the error, advances to the next server in `filtered_servers`, or presents a "no servers found" dialog if all attempts are exhausted.
* **Parameters:**
  * `error` (string/nil) — Error code or message from the failed join attempt.
  * `reason` (string/nil) — Human-readable explanation of the failure.
* **Returns:** Nothing.

### `JoinGame()`
* **Description:** Attempts to join the server currently referenced by `servertojoin`. Updates the UI with the server name, retrieves the full server object, and calls `TheNet:JoinServerResponse`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Cleans up: stops searching, cancels any pending join, and pops this screen from the front-end stack.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns a localized string of the current screen’s primary control (e.g., "Esc Back").
* **Parameters:** None.
* **Returns:** `string` — Help text.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.