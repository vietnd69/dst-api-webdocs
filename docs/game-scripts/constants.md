---
id: constants
title: Constants
description: Defines global constants and utility functions for special events, festivals, tile maps, and color conversions.
tags: [world, event, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 707f1cbb
system_scope: world
---

# Constants

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
This file defines top-level constants and helper functions for managing world-wide state, particularly around special events (e.g., HALLOWED_NIGHTS, YOT* creatures), festival events (e.g., LAVAARENA, QUAGMIRE), tile mapping, and color normalization. It provides no entity component or constructor logic; instead, it offers procedural APIs used elsewhere in the codebase to query active events, derive skin tags, and construct event-specific metadata (e.g., server names, stats prefixes, achievement strings).

## Usage example
```lua
if IsAnySpecialEventActive() then
    local tag = GetSpecialEventSkinTag() -- e.g., "COSTUME"
    inst:AddTag(tag)
end

if IsAnyFestivalEventActive() then
    local stats_prefix = GetActiveFestivalEventStatsFilePrefix()
    local server_name = GetActiveFestivalEventServerName()
end

local color = RGB(255, 128, 64) -- => { 1.0, 0.502, 0.251, 1.0 }
```

## Dependencies & tags
**Components used:** None directly (this is a pure constants/utilities file).  
**Tags:** `"COSTUME"` (via `SPECIAL_EVENT_SKIN_TAGS` for certain special events).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `WORLD_SPECIAL_EVENT` | string | `"none"` | Currently active main special event (e.g., `"hallowed_nights"`) |
| `WORLD_EXTRA_EVENTS` | table | `{}` | List of additional active special events |
| `WORLD_FESTIVAL_EVENT` | string | `"none"` | Currently active festival event (e.g., `"lavaarena"`) |
| `FESTIVAL_EVENT_INFO` | table | — | Map of festival names to metadata (SERVER_NAME, STATS_FILE_PREFIX, seasons) |
| `SPECIAL_EVENT_SKIN_TAGS` | table | — | Map of event names to skin tag strings (e.g., `"hallowed_nights" -> "COSTUME"`) |
| `FESTIVAL_EVENT_SKIN_TAGS` | table | `{}` | Currently unused; empty map |
| `SPECIAL_EVENTS` | table | — | Constants for special events (e.g., `NONE`, `HALLOWED_NIGHTS`, `YOTG`) |
| `FESTIVAL_EVENTS` | table | — | Constants for festival events (e.g., `NONE`, `LAVAARENA`, `QUAGMIRE`) |
| `WORLD_TILES` / `GROUND` | table | — | Internal tile/ground definitions used in tile mapping |

## Main functions
### `GetWorldTileMap()`
* **Description:** Constructs and returns a table mapping tile/ground names (strings) to their numeric IDs by combining `WORLD_TILES` and `GROUND` entries.
* **Parameters:** None.
* **Returns:** `{ [string] = number }` — a full name-to-ID mapping for all supported tiles and ground types.

### `IsSpecialEventActive(event)`
* **Description:** Checks if a given special event (e.g., `"hallowed_nights"`) is active.
* **Parameters:**  
  - `event`: Event name string (e.g., from `SPECIAL_EVENTS`).  
* **Returns:** `true` if `event` matches `WORLD_SPECIAL_EVENT` or appears in `WORLD_EXTRA_EVENTS`; otherwise `false`.

### `IsAnySpecialEventActive()`
* **Description:** Checks if any special event (main or extra) is active.
* **Parameters:** None.
* **Returns:** `true` if `WORLD_SPECIAL_EVENT ~= "none"` or `#WORLD_EXTRA_EVENTS > 0`; otherwise `false`.

### `GetActiveSpecialEventCount()`
* **Description:** Returns the total count of active special events (1 for the main event if present + extra events).
* **Parameters:** None.
* **Returns:** Integer (e.g., `0`, `1`, `2`, ...).

### `GetFirstActiveSpecialEvent()`
* **Description:** Returns the first active special event, prioritizing `WORLD_SPECIAL_EVENT`.
* **Parameters:** None.
* **Returns:** String event name, or `nil` if none active.

### `GetAllActiveEvents(special_event, extra_events)`
* **Description:** Merges provided event identifiers into a unified event set (like a Lua "set" with boolean values).
* **Parameters:**  
  - `special_event`: Optional string event name (e.g., `"hallowed_nights"`).  
  - `extra_events`: Optional table of extra event names.  
* **Returns:** `{ [string] = true }` — a set of active event names (excludes `"none"`).

### `IsAny_YearOfThe_EventActive()`
* **Description:** Checks if any Year-of-the-\<creature\> event is active (e.g., `YOTG`, `YOTV`).
* **Parameters:** None.
* **Returns:** `true` if `WORLD_SPECIAL_EVENT` or any entry in `WORLD_EXTRA_EVENTS` is a YOT* constant.

### `GetSpecialEventSkinTag()`
* **Description:** Returns the skin tag associated with the currently active special event (used for dynamic skin matching).
* **Parameters:** None.
* **Returns:** String tag (e.g., `"COSTUME"`), or `nil` if no match in `SPECIAL_EVENT_SKIN_TAGS`.

### `IsFestivalEventActive(event)`
* **Description:** Checks if a specific festival event is the currently active festival.
* **Parameters:**  
  - `event`: Festival name string (e.g., `"lavaarena"`).  
* **Returns:** `true` if `WORLD_FESTIVAL_EVENT == event`; otherwise `false`.

### `IsPreviousFestivalEvent(event)`
* **Description:** Checks if a festival event appears in the historical `PREVIOUS_FESTIVAL_EVENTS_ORDER`.
* **Parameters:**  
  - `event`: Festival name string.  
* **Returns:** `true` if found in `PREVIOUS_FESTIVAL_EVENTS_ORDER`; otherwise `false`.

### `IsAnyFestivalEventActive()`
* **Description:** Checks if a festival event is currently active.
* **Parameters:** None.
* **Returns:** `true` if `WORLD_FESTIVAL_EVENT ~= "none"`; otherwise `false`.

### `GetFestivalEventSkinTag()`
* **Description:** Returns the skin tag for the active festival (currently always `nil`).
* **Parameters:** None.
* **Returns:** `FESTIVAL_EVENT_SKIN_TAGS[WORLD_FESTIVAL_EVENT]` — currently always `nil`.

### `GetFestivalEventInfo()`
* **Description:** Returns metadata for the active festival event.
* **Parameters:** None.
* **Returns:** Table with keys like `SERVER_NAME`, `STATS_FILE_PREFIX`, `SEASON`, or `nil` if none active.

### `GetFestivalEventSeasons(festival)`
* **Description:** Returns the latest season number for a given festival.
* **Parameters:**  
  - `festival`: Festival name string (e.g., `"lavaarena"`).  
* **Returns:** Integer season count (e.g., `2`), or `0` if the festival is unknown.

### `GetActiveFestivalEventServerName()`
* **Description:** Returns the full server name string for the active festival, including season suffix (`_sN`) if applicable.
* **Parameters:** None.
* **Returns:** String like `"LavaArena_s2"` or `"Quagmire"`, or `""` if none active.

### `GetActiveFestivalProductName()`
* **Description:** Returns the human-readable product name for the active festival.
* **Parameters:** None.
* **Returns:** `FESTIVAL_EVENT_INFO[WORLD_FESTIVAL_EVENT].SERVER_NAME`, or `""` if none active.

### `GetFestivalEventServerName(festival, season)`
* **Description:** Generates the server name string for a specific festival and season.
* **Parameters:**  
  - `festival`: Festival name string.  
  - `season`: Integer season number (>= 1).  
* **Returns:** `"SERVER_NAME"` for `season == 1`, `"SERVER_NAME_s{season}"` for `season > 1`, or `""` if festival not found.

### `GetActiveFestivalEventStatsFilePrefix()`
* **Description:** Returns the stats file prefix for the active festival (used for saving/loading stats).
* **Parameters:** None.
* **Returns:** `FESTIVAL_EVENT_INFO[WORLD_FESTIVAL_EVENT].STATS_FILE_PREFIX`, or `"stats"` if none active.

### `GetActiveFestivalEventAchievementStrings()`
* **Description:** Returns the achievement string table for the active festival (used in UI/achievement display).
* **Parameters:** None.
* **Returns:** `STRINGS.UI.ACHIEVEMENTS[festival:upper()]` — a table of localized strings.

### `RGB(r, g, b)`
* **Description:** Converts 8-bit RGB values to normalized RGBA floats (0.0–1.0 range).
* **Parameters:**  
  - `r`, `g`, `b`: Integers in range `0`–`255`.  
* **Returns:** `{ r/255, g/255, b/255, 1 }` — a 4-element color table.

## Events & listeners
No events are defined or used in this file. It is a passive utility module with no event-driven behavior.