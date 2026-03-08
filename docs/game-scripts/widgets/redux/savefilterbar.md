---
id: savefilterbar
title: Savefilterbar
description: Renders and manages a filter bar UI for filtering and sorting server save slots in the server selection screen.
tags: [ui, filter, search, sorting]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 95ea20c9
system_scope: ui
---

# Savefilterbar

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SaveFilterBar` is a UI widget that provides filtering and sorting controls for the `ServerSlotScreen`. It displays a sort mode button and a search input field, and aggregates filter functions into a single predicate used to determine which save slots are visible. It is tied to the `Profile` system for persisting sort mode and uses `ShardSaveGameIndex` to access server metadata during filtering.

## Usage example
```lua
-- Typically instantiated internally by the server selection screen
-- Example of how to extend or interact with it in modded UI code:
local savefilterbar = Widget("savefilterbar")
-- Note: This component is usually constructed via the screen's own logic
-- Modders typically call its public methods after instantiation, e.g.:
savefilterbar:RefreshFilterState()
```

## Dependencies & tags
**Components used:** None.  
**Tags:** None.  
**External systems used:** `Profile`, `ShardSaveGameIndex`, `TheInput`, `IsConsole()`, `STRINGS.UI.SERVERCREATIONSCREEN`, `STRINGS.CHARACTER_NAMES`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `serverslotscreen` | table | — | Reference to the parent `ServerSlotScreen` instance, used to trigger save list refreshes. |
| `filters` | table | `{}` | Collection of predicate functions used to filter save slots. Keys are filter types (e.g., `"SEARCH"`), values are functions. |
| `no_refresh_saves` | boolean? | `nil` | Temporary flag to suppress auto-refreshes during bulk filter updates. |

## Main functions
### `BuildFocusFinder()`
* **Description:** Returns a focus-finding function that prioritizes the `server_scroll_list` (if populated) or falls back to the `SaveFilterBar` widget itself when navigating with keyboard/controller.
* **Parameters:** None.
* **Returns:** `function` — a function that returns either `self.serverslotscreen.server_scroll_list` or `self`.

### `RefreshFilterState()`
* **Description:** Updates the sort button to reflect the current sort mode from `Profile`, then constructs and applies the combined filter to the `serverslotscreen`'s save list. Prevents redundant refreshes via the `no_refresh_saves` flag.
* **Parameters:** None.
* **Returns:** Nothing.

### `AddSorter()`
* **Description:** Creates and configures a button for cycling through sort modes (`SORT_LASTPLAYED`, `SORT_MOSTDAYS`, `SORT_DATECREATED`). Updates `Profile` on selection and triggers a filter refresh.
* **Parameters:** None.
* **Returns:** `btn` — the constructed `IconButton` widget.

### `AddSearch()`
* **Description:** Creates and configures a search input field with text entry support, matching logic for server name, description, and character name. Adds a `"SEARCH"` filter function to `self.filters` and sets up focus/highlighting.
* **Parameters:** None.
* **Returns:** `searchbox` — the constructed `Widget` instance containing the text entry field.

### `_UpdatePositions()`
* **Description:** Positions and configures focus relationships between the sort button and search box, adjusting spacing for console vs. PC input.
* **Parameters:** None.
* **Returns:** Nothing.

### `_ConstructFilter()`
* **Description:** Combines all stored filter functions (`self.filters`) into a single predicate function. Returns `true` only if *all* filters return `true` for a given slot/character pair.
* **Parameters:** None.
* **Returns:** `function(slot, character)` — a predicate function used to filter save entries.

## Events & listeners
- **Listens to:** `nil` — this widget does not register any event listeners.
- **Pushes:** `nil` — this widget does not fire any custom events.