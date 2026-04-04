---
id: constants
title: Constants
description: This module defines extensive global constant tables for game controls, tiles, events, crafting, UI, and classifications, while providing utility functions to query active event states and platform specifics.
tags: [core, utilities, events, configuration]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 912400af
system_scope: global
---

# Constants

> Based on game build **718694** | Last updated: 2026-04-04

## Overview
The `constants` module serves as the central repository for global enumerations, configuration tables, and constant values used throughout Don't Starve Together. It aggregates data for ground tiles, special events, festival seasons, crafting recipes, UI layers, and input mappings. Additionally, it loads external configuration modules for skins, clothing, and tech trees. Other systems access these values by calling `require("constants")`, which returns the module table containing all exported constants. This file is essential for accessing standardized values across scripts without hardcoding magic numbers or strings.

## Usage example
```lua
-- Require the utility module first
local Utils = require("utils")

-- Check if a specific festival event is active
if Utils.IsFestivalEventActive("winter_feast") then
    print("Winter Feast is currently active.")
end

-- Convert standard RGB values to normalized color table
local highlight_color = Utils.RGB(255, 215, 0)

-- Retrieve the count of active special events
local event_count = Utils.GetActiveSpecialEventCount()
```

## Dependencies & tags
**External dependencies:**
- `techtree` -- Required to access technology tree definitions.
- `prefabskins` -- Required to populate global skin tables.
- `clothing` -- Required to populate global clothing tables.
- `beefalo_clothing` -- Required to populate global beefalo clothing tables.
- `misc_items` -- Required to populate global miscellaneous item tables.
- `emote_items` -- Required to populate global emote item tables.
- `item_blacklist` -- Required to populate global item blacklist tables.
- `entitlementlookups` -- Required to populate global entitlement lookup tables.

**Components used:**
None

**Tags:**
None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CLOTHING` | table | | Clothing item constants table |
| `CLOTHING.body_default1` | string | | Default body clothing skin tag |
| `CLOTHING.hand_default1` | string | | Default hand clothing skin tag |
| `CLOTHING.legs_default1` | string | | Default legs clothing skin tag |
| `CLOTHING.feet_default1` | string | | Default feet clothing skin tag |
| `MISC_ITEMS` | table | | Miscellaneous item constants table |
| `MISC_ITEMS.beard_default1` | string | | Default beard skin tag |
| `BEEFALO_CLOTHING` | table | | Beefalo clothing constants table |
| `BEEFALO_CLOTHING.beef_body_default1` | string | | Default beefalo body clothing skin tag |
| `BEEFALO_CLOTHING.beef_horn_default1` | string | | Default beefalo horn clothing skin tag |
| `BEEFALO_CLOTHING.beef_head_default1` | string | | Default beefalo head clothing skin tag |
| `BEEFALO_CLOTHING.beef_feet_default1` | string | | Default beefalo feet clothing skin tag |
| `BEEFALO_CLOTHING.beef_tail_default1` | string | | Default beefalo tail clothing skin tag |
| `GROUND` | table | | Ground type constants table |
| `GROUND.OCEAN_REEF` | number | | Reef ocean ground type (alias of OCEAN_BRINEPOOL) |
| `GROUND.OCEAN_REEF_SHORE` | number | | Reef shore ground type (alias of OCEAN_BRINEPOOL_SHORE) |
| `ANIM_ORIENTATION` | table | | Animation orientation constants table |
| `ANIM_ORIENTATION.Default` | number | | Default animation orientation (alias of BillBoard) |

## Main functions

### `GetWorldTileMap()`
* **Description:** Constructs a mapping of tile names to IDs by merging WORLD_TILES and GROUND tables while avoiding duplicates.
* **Parameters:** None
* **Returns:** table
* **Error states:** None

### `IsSpecialEventActive(event)`
* **Description:** Checks if a specific special event is currently active.
* **Parameters:** `event` -- string, the special event identifier to check
* **Returns:** boolean, true if the event is active
* **Error states:** None

### `IsAnySpecialEventActive()`
* **Description:** Checks if any special event is currently active.
* **Returns:** boolean, true if any special event is active
* **Error states:** None
* **Parameters:** None

### `GetActiveSpecialEventCount()`
* **Description:** Returns the count of currently active special events.
* **Parameters:** None
* **Returns:** number, count of active events
* **Error states:** None

### `GetFirstActiveSpecialEvent()`
* **Description:** Returns the name of the first active special event.
* **Parameters:** None
* **Returns:** string or nil, event name or nil
* **Error states:** None

### `GetAllActiveEvents(special_event, extra_events)`
* **Description:** Returns a table of all active events including special and extra events.
* **Parameters:**
  - `special_event` -- string or nil, the main special event identifier
  - `extra_events` -- table or nil, table of extra event identifiers
* **Returns:** table, map of event names to true
* **Error states:** None

### `IsAny_YearOfThe_EventActive()`
* **Description:** Checks if any 'Year of the' creature event is active.
* **Parameters:** None
* **Returns:** boolean, true if a Year of the event is active
* **Error states:** None

### `GetSpecialEventSkinTag()`
* **Description:** Returns the skin tag associated with the current special event.
* **Parameters:** None
* **Returns:** string or nil, skin tag name
* **Error states:** None

### `IsFestivalEventActive(event)`
* **Description:** Checks if a specific festival event is currently active.
* **Parameters:** `event` -- string, the festival event identifier to check
* **Returns:** boolean, true if the festival event is active
* **Error states:** None

### `IsPreviousFestivalEvent(event)`
* **Description:** Checks if the event is in the list of previous festival events.
* **Parameters:** `event` -- string, the festival event identifier to check
* **Returns:** boolean, true if event was a previous festival
* **Error states:** None

### `IsAnyFestivalEventActive()`
* **Description:** Checks if any festival event is currently active.
* **Parameters:** None
* **Returns:** boolean, true if any festival event is active
* **Error states:** None

### `GetFestivalEventSkinTag()`
* **Description:** Returns the skin tag associated with the current festival event.
* **Parameters:** None
* **Returns:** string or nil, skin tag name
* **Error states:** None

### `GetFestivalEventInfo()`
* **Description:** Returns the info table for the current festival event.
* **Parameters:** None
* **Returns:** table or nil, festival info data
* **Error states:** None

### `GetFestivalEventSeasons(festival)`
* **Description:** Returns the latest season number for the specified festival.
* **Parameters:** `festival` -- string, the festival event identifier
* **Returns:** number, season number or 0
* **Error states:** None

### `GetActiveFestivalEventServerName()`
* **Description:** Returns the server name string for the active festival event.
* **Parameters:** None
* **Returns:** string, server name
* **Error states:** None

### `GetActiveFestivalProductName()`
* **Description:** Returns the product name for the active festival event.
* **Parameters:** None
* **Returns:** string, product name
* **Error states:** None

### `GetFestivalEventServerName(festival, season)`
* **Description:** Returns the formatted server name for a festival and season.
* **Parameters:**
  - `festival` -- string, the festival event identifier
  - `season` -- number, the season number
* **Returns:** string, formatted server name
* **Error states:** None

### `GetActiveFestivalEventStatsFilePrefix()`
* **Description:** Returns the stats file prefix for the active festival event.
* **Parameters:** None
* **Returns:** string, file prefix
* **Error states:** None

### `GetActiveFestivalEventAchievementStrings()`
* **Description:** Returns the achievement strings table for the active festival event.
* **Parameters:** None
* **Returns:** table or nil, achievement strings
* **Error states:** Crashes if called when no festival event is active (attempts to call :upper() on boolean false)

### `Server_IsTournamentActive()`
* **Description:** Checks if the tournament mode is active on the server.
* **Parameters:** None
* **Returns:** boolean, always false in this implementation
* **Error states:** None

### `Client_IsTournamentActive()`
* **Description:** Checks if the tournament mode is active on the client.
* **Parameters:** None
* **Returns:** boolean, true if server tournament active and on Steam
* **Error states:** None

### `RGB(r, g, b)`
* **Description:** Converts standard 0-255 RGB color values into a normalized 0-1 color table with alpha set to 1.
* **Parameters:**
  - `r` -- number, red channel value between 0 and 255
  - `g` -- number, green channel value between 0 and 255
  - `b` -- number, blue channel value between 0 and 255
* **Returns:** table, normalized color array `{r, g, b, 1}`
* **Error states:** None

## Events & listeners
* **Listens to:** None
* **Pushes:** None
