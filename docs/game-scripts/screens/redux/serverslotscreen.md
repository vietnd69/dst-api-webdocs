---
id: serverslotscreen
title: Serverslotscreen
description: Manages the server selection screen UI, displaying existing save slots, filtering/sorting options, and handling user interactions for joining or creating new game instances.
tags: [ui, server, save, filtering]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: a9d91524
system_scope: ui
---

# Serverslotscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ServerSlotScreen` is a screen widget that presents a scrollable list of existing game save slots (server instances), along with filtering, sorting, and navigation controls. It is responsible for displaying save slot metadata (character portrait, day/season, preset), handling user selection for joining a world, and managing transitions to new-game creation flows. It integrates with `ShardSaveGameIndex` for save data retrieval and works closely with various Redux UI components for layout and interaction.

## Usage example
```lua
-- Push the server slot screen with fallback to previous screen (e.g., main menu)
TheFrontEnd:PushScreen(ServerSlotScreen(prev_screen))

-- Example filter and refresh:
screen:RefreshSaveFilter(function(slot, character)
    return character == "waxwell"
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slot_cache` | table | `{}` | Cache storing per-slot character portrait and text metadata to avoid repeated expensive calls. |
| `savefilescrollitems` | table | `{}` | List of `{server_slot = N}` entries used to populate the scroll list, sorted per user preference. |
| `filterfn` | function | `function(savename) return true end` | Predicate function used to determine which save slots are displayed. |
| `server_scroll_list` | ScrollingGrid | `nil` | Main widget holding scrollable list of save slots. |
| `savefilterbar` | SaveFilterBar | `nil` | Widget containing filter/search/sort controls. |
| `kit_puppet` | KitcoonPuppet | `nil` | Animated puppet (Kitcoon) displayed on screen. |

## Main functions
### `UpdateSaveFiles(force_update)`
* **Description:** Refreshes the list of valid save slots, filters and sorts them according to `Profile:GetServerSortMode()`, updates the scroll list widget, and toggles the “no servers” message.
* **Parameters:** `force_update` (boolean) — If `true`, skips early return even if data appears unchanged.
* **Returns:** Nothing.

### `GetCharacterPortrait(slot)`
* **Description:** Returns the character portrait atlas and character name for a given save slot, using internal caching.
* **Parameters:** `slot` (number) — Save slot index.
* **Returns:** `atlas` (string), `character` (string)

### `GetDayAndSeasonText(slot)`
* **Description:** Returns cached day and season text (e.g., “Day 12 – Summer”) for a given slot.
* **Parameters:** `slot` (number) — Save slot index.
* **Returns:** `text` (string)

### `GetPresetText(slot)`
* **Description:** Returns cached world preset description text for a given slot.
* **Parameters:** `slot` (number) — Save slot index.
* **Returns:** `text` (string)

### `OnCreateNewSlot()`
* **Description:** Initiates transition to `PlaystyleSelectScreen` to create a new game slot.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBansButton()`
* **Description:** Opens the `BansPopup` screen to view current server ban list.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Performs a fade-out, pops this screen, and fades back in.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshSaveFilter(filterfn)`
* **Description:** Replaces the current filter function and triggers an immediate `UpdateSaveFiles` call.
* **Parameters:** `filterfn` (function) — Function `(slot: number, character: string) -> boolean` to filter which slots appear.
* **Returns:** Nothing.

### `ClearSlotCache(slot)`
* **Description:** Removes cached data for a specific slot, forcing recalculation on next access.
* **Parameters:** `slot` (number) — Save slot index.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Starts save-slot update timer, initializes filter UI state, and enables puppet animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Called when the screen becomes inactive. Cancels background save-file update tasks and disables puppet animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized control help text for this screen (e.g., “Esc Back” and “F1 Create New Game”).
* **Parameters:** None.
* **Returns:** `help_text` (string)

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified