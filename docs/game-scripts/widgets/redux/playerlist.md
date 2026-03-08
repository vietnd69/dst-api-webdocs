---
id: playerlist
title: Playerlist
description: Renders a scrollable list of players in the lobby screen with interactive elements for profile viewing, muting, and performance indicators.
tags: [ui, network, player]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: f0e27107
system_scope: ui
---

# Playerlist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlayerList` is a UI widget responsible for displaying the player roster in the lobby screen. It dynamically builds a list of `PlayerInfoListing` child widgets, each representing a connected player with interactive controls (view profile, mute), badges (rank, character, admin), and performance indicators. It integrates with `TheNet` for network state and `TEMPLATES` for reusable UI patterns like scrolling grids.

## Usage example
```lua
local PlayerList = require "widgets/redux/playerlist"
local owner = TheNet:GetUserID()
local nextWidgets = { right = next_widget, down = next_widget }
local playerlist = PlayerList(owner, nextWidgets)
playerlist:Refresh()
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Checks `TheNet:GetServerIsClientHosted()`, `TheNet:IsNetIDPlatformValid()`, `IsAnyFestivalEventActive()`. Uses `PlayerBadge` internal flags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | number | `nil` | The local player's net user ID. |
| `proot` | Widget | `nil` | Root container widget for the player list UI. |
| `player_list` | Widget | `nil` | Container widget for list elements. |
| `title_banner` | Image | `nil` | Header banner image element. |
| `title` | Text | `nil` | Title text ("Player List"). |
| `players_number` | Text | `nil` | Displays current player count (e.g., "x/y"). |
| `scroll_list` | ScrollingGrid | `nil` | Scrolling container holding `PlayerInfoListing` widgets. |

## Main functions
### `GetDisplayName(clientrecord)`
* **Description:** Returns the display name for a player record. Designed to be overridden in mods for custom name formatting.
* **Parameters:** `clientrecord` (table) - Player data table containing at least a `name` field.
* **Returns:** String (the player's name).

### `BuildPlayerList(players, nextWidgets)`
* **Description:** Constructs or updates the full player list UI, including title, player count, and scrollable grid of `PlayerInfoListing` entries. If `players` is `nil`, retrieves the player table via `GetPlayerTable()`.
* **Parameters:**  
  `players` (table or `nil`) - Array of player data tables. If `nil`, defaults to `GetPlayerTable()`.  
  `nextWidgets` (table) - Focus navigation context (e.g., `{right = widget, down = widget}`).
* **Returns:** Nothing.

### `GetPlayerTable()`
* **Description:** Retrieves the current list of connected players from `TheNet`. Filters out the dedicated host in non-client-hosted servers.
* **Parameters:** None.
* **Returns:** Table - Array of player data tables.

### `Refresh(next_widgets)`
* **Description:** Updates the player list by refreshing data from the network and rebuilding the scroll list. Does not reconstruct UI elements if they already exist.
* **Parameters:** `next_widgets` (table) - Focus navigation context (unused in current implementation but passed to `BuildPlayerList`).
* **Returns:** Nothing.

### `UpdatePlayerListing(context, widget, data, index)`
* **Description:** Updates an existing `PlayerInfoListing` widget with new player data. Handles visibility of badges, mute state, profile button, and performance indicators.
* **Parameters:**  
  `context` (table) - Context object containing `playerlist` reference.  
  `widget` (PlayerInfoListing) - The widget instance to update.  
  `data` (table or `nil`) - Updated player data or `nil` for empty slot.  
  `index` (number) - Index in the list (unused in logic).
* **Returns:** Nothing.

### `PlayerInfoListing:DoInit(v, nextWidgets)`
* **Description:** Initializes the internal UI elements for a single player listing, including background, rank badge, character badge, admin badge, name, mute button, and profile button. Handles empty and dedicated host filtering.
* **Parameters:**  
  `v` (table or `nil`) - Player data record or `nil` for placeholder.  
  `nextWidgets` (table) - Focus navigation context.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.