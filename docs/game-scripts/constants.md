---
id: constants
title: Constants
description: This file defines global constant tables and configuration values for game systems including mathematical constants, rendering layers, input controls, event detection, festival configurations, color palettes, UI settings, world generation parameters, and various enumeration tables used throughout Don't Starve Together.
tags: [config, data, constants, ui, events]
sidebar_position: 10

last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: data_config
source_hash: f9cdea9b
system_scope: world
---

# Constants

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`constants.lua` is a data configuration file that defines global constant tables and helper functions used throughout the Don't Starve Together engine. It does not attach to entities as a component; instead, it is required by other modules to access shared configuration values. The file organizes constants into logical groups including ground tile IDs, special event and festival detection functions, color palettes with RGB normalization helpers, render layer definitions (LAYER_BACKDROP, LAYER_GROUND, LAYER_WORLD, etc.), animation sort orders, input key mappings, character lists, clothing configurations, control enums, and various UI and gameplay system enumerations. These constants ensure consistent behavior across all game systems and provide a single source of truth for values that may change between builds or platforms.
## Usage example
```lua
local CONSTANTS = require "constants"

-- Access ground tile IDs
local grass_id = CONSTANTS.GROUND.GRASS

-- Check if a festival event is active (use string literal for event name)
if CONSTANTS.IsFestivalEventActive("lavaarena") then
    print("Lava Arena is currently active")
end

-- Use RGB helper for color definitions
local custom_color = CONSTANTS.RGB(255, 128, 64)

-- Get active special event info
local event_count = CONSTANTS.GetActiveSpecialEventCount()
local first_event = CONSTANTS.GetFirstActiveSpecialEvent()
```
## Dependencies & tags
**External dependencies:**
- `techtree` -- Required module for TechTree technology definitions
- `prefabskins` -- Required to initialize PREFAB_SKINS global table mapping prefabs to skin variants
- `clothing` -- Required to initialize CLOTHING global table for character clothing skin configurations
- `beefalo_clothing` -- Required to initialize BEEFALO_CLOTHING global table for beefalo cosmetic skin configurations
- `misc_items` -- Required to initialize MISC_ITEMS global table for cosmetic items and profile data
- `emote_items` -- Required to initialize EMOTE_ITEMS global table for emote item configurations
- `item_blacklist` -- Required to initialize item display blacklist and skin decoration visibility tables
- `entitlementlookups` -- Required to initialize ENTITLEMENTLOOKUPS global table for platform-specific entitlement mappings

**Components used:** None identified

**Tags:** None identified
## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `IS_BETA` | boolean | `true` if BRANCH is "staging" or "dev" | Flag indicating if running on beta/staging/dev branch. |
| `SPECIAL_EVENT_SKIN_TAGS` | table | | Table of skin tags for special events. |
| `FESTIVAL_EVENT_SKIN_TAGS` | table | | Table of skin tags for festival events. |
| `FESTIVAL_EVENT_INFO` | table | | Festival event configuration data. |
| `CLOTHING.body_default1` | string | | Default body clothing skin prefab. |
| `CLOTHING.hand_default1` | string | | Default hand clothing skin prefab. |
| `CLOTHING.legs_default1` | string | | Default legs clothing skin prefab. |
| `CLOTHING.feet_default1` | string | | Default feet clothing skin prefab. |
| `MISC_ITEMS.beard_default1` | string | | Default beard skin prefab. |
| `BEEFALO_CLOTHING.beef_body_default1` | string | | Default beefalo body clothing skin prefab. |
| `BEEFALO_CLOTHING.beef_horn_default1` | string | | Default beefalo horn skin prefab. |
| `BEEFALO_CLOTHING.beef_head_default1` | string | | Default beefalo head skin prefab. |
| `BEEFALO_CLOTHING.beef_feet_default1` | string | | Default beefalo feet clothing skin prefab. |
| `BEEFALO_CLOTHING.beef_tail_default1` | string | | Default beefalo tail skin prefab. |
| `GROUND.OCEAN_REEF` | number | `GROUND.OCEAN_BRINEPOOL` | Ocean reef ground type alias. |
| `GROUND.OCEAN_REEF_SHORE` | number | `GROUND.OCEAN_BRINEPOOL_SHORE` | Ocean reef shore ground type alias. |
| `ANIM_ORIENTATION.Default` | number | `ANIM_ORIENTATION.BillBoard` | Default animation orientation setting. |
## Main functions
### `GetWorldTileMap()`
* **Description:** Constructs a unified map of world tile names to IDs by merging WORLD_TILES and GROUND tables, excluding duplicates and inverted tiles.
* **Parameters:** None
* **Returns:** table (world_tile_map)
* **Error states:** None

### `IsSpecialEventActive(event)`
* **Description:** Checks if a specific special event (holiday-specific) is currently active by comparing against WORLD_SPECIAL_EVENT or WORLD_EXTRA_EVENTS table.
* **Parameters:**
  - `event` -- Special event identifier to check against WORLD_SPECIAL_EVENT or WORLD_EXTRA_EVENTS
* **Returns:** boolean -- true if the event is active, false otherwise
* **Error states:** None

### `IsAnySpecialEventActive()`
* **Description:** Checks if any special event is currently active by testing if WORLD_SPECIAL_EVENT is not NONE or if WORLD_EXTRA_EVENTS has any entries.
* **Parameters:** None
* **Returns:** boolean -- true if any special event is active
* **Error states:** None

### `GetActiveSpecialEventCount()`
* **Description:** Returns the total count of active special events by counting WORLD_SPECIAL_EVENT (1 if not NONE) plus the size of WORLD_EXTRA_EVENTS table.
* **Parameters:** None
* **Returns:** number -- count of active special events
* **Error states:** None

### `GetFirstActiveSpecialEvent()`
* **Description:** Returns the first active special event, prioritizing WORLD_SPECIAL_EVENT if not NONE, otherwise returns the first key from WORLD_EXTRA_EVENTS using next().
* **Parameters:** None
* **Returns:** event identifier or nil if no events active
* **Error states:** None

### `GetAllActiveEvents(special_event, extra_events)`
* **Description:** Builds a table of all active events by combining special_event and extra_events parameters, then removes SPECIAL_EVENTS.NONE from the result.
* **Parameters:**
  - `special_event` -- Primary special event identifier or nil
  - `extra_events` -- Table of additional event identifiers or nil
* **Returns:** table -- dictionary with event identifiers as keys set to true
* **Error states:** None

### `IsAny_YearOfThe_EventActive()`
* **Description:** Checks if any Year of the `<creature>` event is active by iterating through WORLD_SPECIAL_EVENT and WORLD_EXTRA_EVENTS against IS_YEAR_OF_THE_SPECIAL_EVENTS table.
* **Parameters:** None
* **Returns:** boolean -- true if a Year of the event is active
* **Error states:** None

### `GetSpecialEventSkinTag()`
* **Description:** Returns the skin tag associated with the current WORLD_SPECIAL_EVENT from SPECIAL_EVENT_SKIN_TAGS table.
* **Parameters:** None
* **Returns:** string skin tag or nil if no tag defined
* **Error states:** None

### `IsFestivalEventActive(event)`
* **Description:** Checks if a specific intermittent scheduled festival event is currently active by comparing against WORLD_FESTIVAL_EVENT.
* **Parameters:**
  - `event` -- Festival event identifier to check against WORLD_FESTIVAL_EVENT
* **Returns:** boolean -- true if the festival event is active
* **Error states:** None

### `IsPreviousFestivalEvent(event)`
* **Description:** Checks if the given event exists in the PREVIOUS_FESTIVAL_EVENTS_ORDER list by iterating through and comparing id fields.
* **Parameters:**
  - `event` -- Festival event identifier to check against PREVIOUS_FESTIVAL_EVENTS_ORDER
* **Returns:** boolean -- true if event is a previous festival event
* **Error states:** None

### `IsAnyFestivalEventActive()`
* **Description:** Checks if any festival event is currently active by testing if WORLD_FESTIVAL_EVENT is not FESTIVAL_EVENTS.NONE.
* **Parameters:** None
* **Returns:** boolean -- true if any festival event is active
* **Error states:** None

### `GetFestivalEventSkinTag()`
* **Description:** Returns the skin tag associated with the current WORLD_FESTIVAL_EVENT from FESTIVAL_EVENT_SKIN_TAGS table.
* **Parameters:** None
* **Returns:** string skin tag or nil if no tag defined
* **Error states:** None

### `GetFestivalEventInfo()`
* **Description:** Returns the festival event info table for the current WORLD_FESTIVAL_EVENT from FESTIVAL_EVENT_INFO table.
* **Parameters:** None
* **Returns:** table with GAME_MODE, SERVER_NAME, FEMUSIC, STATS_FILE_PREFIX, LATEST_SEASON or nil
* **Error states:** None

### `GetFestivalEventSeasons(festival)`
* **Description:** Returns the LATEST_SEASON value for the given festival from FESTIVAL_EVENT_INFO, or 0 if the festival entry does not exist.
* **Parameters:**
  - `festival` -- Festival event identifier to look up in FESTIVAL_EVENT_INFO
* **Returns:** number -- latest season count or 0
* **Error states:** None

### `GetActiveFestivalEventServerName()`
* **Description:** Returns the server name for the active festival event by calling GetFestivalEventServerName with the current festival and its season.
* **Parameters:** None
* **Returns:** string server name or empty string
* **Error states:** None
### `GetActiveFestivalProductName()`
* **Description:** Returns the SERVER_NAME from FESTIVAL_EVENT_INFO for the current WORLD_FESTIVAL_EVENT, or empty string if no festival is active.
* **Parameters:** None
* **Returns:** string server name or empty string if no festival active
* **Error states:** None
### `GetFestivalEventServerName(festival, season)`
* **Description:** Returns the server name for a festival event. If season is 1, returns plain SERVER_NAME; otherwise appends `_s<season>` suffix using string.format.
* **Parameters:**
  - `festival` -- Festival event identifier
  - `season` -- Season number - affects naming format
* **Returns:** string server name or empty string
* **Error states:** None

### `GetActiveFestivalEventStatsFilePrefix()`
* **Description:** Returns the STATS_FILE_PREFIX from FESTIVAL_EVENT_INFO for the active festival event, or defaults to "stats" if no festival is active.
* **Parameters:** None
* **Returns:** string stats file prefix
* **Error states:** None

### `GetActiveFestivalEventAchievementStrings()`
* **Description:** Returns achievement strings from STRINGS.UI.ACHIEVEMENTS table using the uppercase festival name as key. Requires festival name spelling to match the string table.
* **Parameters:** None
* **Returns:** table of achievement strings or nil
* **Error states:** None

### `Server_IsTournamentActive()`
* **Description:** Returns false. Internal server use function.
* **Parameters:** None
* **Returns:** boolean -- always false
* **Error states:** None
### `Client_IsTournamentActive()`
* **Description:** Checks if tournament is active on client by calling Server_IsTournamentActive() and verifying IsSteam() returns true.
* **Parameters:** None
* **Returns:** boolean -- true only if server tournament is active and running on Steam
* **Error states:** None

### `RGB(r, g, b)`
* **Description:** Converts 0-255 RGB values to normalized 0-1 format with alpha channel set to 1.
* **Parameters:**
  - `r` -- number -- Red channel value (0-255)
  - `g` -- number -- Green channel value (0-255)
  - `b` -- number -- Blue channel value (0-255)
* **Returns:** table -- RGBA color array `{r/255, g/255, b/255, 1}`
* **Error states:** None
## Events & listeners
None.
