---
id: playerlist
title: Playerlist
description: Renders and manages the player list UI for the lobby screen, including player names, character badges, mute controls, and profile actions.
tags: [ui, lobby, player, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: f2729c13
system_scope: ui
---

# Playerlist

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlayerList` is a UI widget component responsible for displaying the list of connected players in the lobby screen. It constructs and manages scrollable rows representing each player, including visual elements such as character badges, admin icons, mute toggle buttons, and profile links. It integrates with `TheNet` to fetch player data and handle network-level actions like muting or viewing profiles.

## Usage example
```lua
local PlayerList = require "widgets/playerlist"
-- Typically instantiated by the lobby screen, not directly by mods
-- Example override for custom display name logic:
PlayerList.prototype.GetDisplayName = function(self, clientrecord)
    return clientrecord.name .. " [" .. (clientrecord.userid or "?") .. "]"
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks tags via `inst:HasTag("tag")` — None identified  
**Widgets used:** `Widget`, `Text`, `ImageButton`, `ScrollableList`, `PlayerBadge`, `Image`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `TheNet:GetUserID()` equivalent | The local player's user ID; used to determine UI behavior (e.g., disable self-mute). |
| `numPlayers` | number | `0` | Cached count of players; used to detect changes requiring full rebuild. |
| `player_widgets` | table of widgets | `{}` | Array of pre-allocated row widgets reused during refresh. |
| `scroll_list` | ScrollableList | `nil` | The scrollable container managing player rows. |
| `proot`, `player_list`, `row_root` | widgets | `nil` | Internal layout containers. |

## Main functions
### `GetDisplayName(clientrecord)`
*   **Description:** Returns the display name for a player record. Overridable by mods to customize player name formatting.
*   **Parameters:** `clientrecord` (table) — player data object with fields like `name`, `userid`, etc.
*   **Returns:** `string` — the player's display name (default: `clientrecord.name or ""`).

### `BuildPlayerList(players, nextWidgets)`
*   **Description:** Builds or rebuilds the entire player list UI. Initializes UI frames and layout if missing, then creates or updates `ScrollableList` rows.
*   **Parameters:**
    *   `players` (table or `nil`) — array of player data tables. If `nil`, fetches current players via `GetPlayerTable()`.
    *   `nextWidgets` (table) — focus navigation configuration (e.g., `right`, `down` widgets).
*   **Returns:** Nothing.

### `GetPlayerTable()`
*   **Description:** Retrieves the list of players from `TheNet`, handling special cases like hosted servers (excludes dedicated host).
*   **Parameters:** None.
*   **Returns:** `table` — array of player data tables. If no players or `TheNet` unavailable, returns `{}`.

### `Refresh(next_widgets)`
*   **Description:** Updates the player list UI efficiently without full rebuild when possible. Rebuilds only if player count changes or identity of players changes.
*   **Parameters:** `next_widgets` (table) — focus navigation configuration.
*   **Returns:** Nothing.

## Events & listeners
**Listens to:** None identified  
**Pushes:** None identified