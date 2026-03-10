---
id: serverlistingscreen
title: Serverlistingscreen
description: Manages the server browsing UI, including filtering, sorting, listing, and joining of online and LAN servers with dynamic filter management and server metadata display.
tags: [ui, networking, filtering, server, screen]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 0f5657c9
system_scope: network
---
# Serverlistingscreen

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `ServerListingScreen` component provides the complete user interface for browsing, filtering, and selecting servers in Don't Starve Together. It handles both online and LAN server discovery, supports multiple filter types (playstyle, world progression, game mode, season, etc.), sorts and groups listings, processes server metadata (mods, tags, player lists, world generation), and enables server joining or reporting. Built as a subclass of `Screen`, it manages UI lifecycle, focus navigation, and periodic refreshing of server data via `TheNet`, with persistent settings stored to `Profile` and filtering logic enforced through customizable rules.

## Usage example
```lua
-- Instantiation and setup
local screen = ServerListingScreen(
    THEEPOCH + 5, -- Optional event_id
    false,        -- should_save
    { forced_settings = { playstyle = "survival" } }, -- forced_settings
    function() print("Cancelled") end -- cb
)
TheFrontEnd:PushScreen(screen)
-- User interaction (keyboard/controller) triggers filtering, selection, and joining
```

## Dependencies & tags
**Components used:**
- Screen (base class)
- ServerPreferences (profanity filtering, name/description hiding, filter persistence)
- TheNet (server search, query, details download, report, profile view)
- TheFrontEnd (screen push/pop, focus management)
- Profile (playstyle, filters, world progression filters persistence)
- WorldProgressionFilterPicker (widget)
- PlaystylePicker (widget)

**Tags:** None found.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.event_id` | string \| nil | nil | Optional event identifier for screen lifecycle tracking |
| `self.playstyle_defs` | table | built by BuildPlaystyleDefs() | Table of available playstyle definitions |
| `self.should_save` | boolean | false | Whether settings should be persisted to profile |
| `self.forced_settings` | table | {} | Table of forced server-listing settings (e.g., fixed playstyle) |
| `self.server_playstyle` | table | {} | Current playstyle filter state |
| `self.session_mapping` | table | {} | Session-to-player-data mapping cache |
| `self.cb` | function \| nil | nil | Optional callback invoked on screen cancel |
| `self.offlinemode` | boolean | false | Whether offline/LAN mode is enforced |
| `self.tickperiod` | number | 0.5 | Refresh interval in seconds for periodic server polling |
| `self.task` | TimerTask \| nil | nil | Timer task for periodic server list refresh |
| `self.unjoinable_servers` | number | 0 | Counter of unjoinable servers in the current list |
| `self.view_online` | boolean | true | Whether currently viewing online tab (vs LAN) |
| `self.selected_index_actual` | number | -1 | Unfiltered server list index of selected server |
| `self.selected_server` | table \| nil | nil | Currently selected server data entry |
| `self.viewed_servers` | table | {} | Filtered and sorted list of server entries |
| `self.servers` | table | {} | Full raw server list from TheNet |
| `self.filters` | table | {} | Active filter definitions for UI controls |
| `self.sessions` | table | {} | Cached session player data |
| `self.sort_column` | string \| nil | nil | ID of the active sort column (e.g., "ping", "players") |
| `self.worldprogressionfilters` | table | {} | World progression filter definitions |
| `self.worldprogressionfilters_overlay` | Widget \| nil | nil | World progression filter picker widget instance |
| `self.searchbox` | Widget \| nil | nil | Reference to the search input widget |
| `self.connection_spinner` | Widget \| nil | nil | Spinner widget for Online/LAN mode selection |
| `self.filters_shown` | boolean | false | Whether the filter sidebar is currently visible |
| `self.servers_scroll_list` | Widget \| nil | nil | Scrollable grid of server list rows |
| `self.grid_root` | Widget \| nil | nil | Root container for server list rows |
| `self.heading`, `self.content_root`, `self.server_details_additional` | Widget \| nil | nil | UI layout reference widgets |

## Main functions
### `BuildPlaystyleDefs()`
* **Description:** Constructs a table of playstyle definitions by combining the base `PLAYSTYLE_ANY` entry with definitions retrieved from `Levels.GetPlaystyles()`.
* **Parameters:** None.
* **Returns:** Table — a list of playstyle entries, each with an `id` and `text` field, where index 1 is always `PLAYSTYLE_ANY`.

### `GetBetaInfoId(tags)`
* **Description:** Checks if the server’s `tags` string matches any known beta version mismatch identifier in the global `BETA_INFO` array.
* **Parameters:** `tags` — comma-separated string of server tags.
* **Returns:** Number — the 1-based index of the matching `BETA_INFO` entry, or `0` if no match is found.

### `ShouldAllowSave(filters, forced_settings)`
* **Description:** Determines whether user-set filters and settings should be persisted to the profile based on whether any filters are marked as forced.
* **Parameters:** `filters` — list of active filter definitions (may include `is_forced`); `forced_settings` — table of externally enforced settings.
* **Returns:** Boolean — `true` only if `forced_settings` is nil and no filter has `is_forced = true`.

### `ServerListingScreen:_SetTab(tab)`
* **Description:** Switches between the "LAN" and "online" server tabs, updates internal state, triggers server search, and controls the visibility of the playstyle filter overlay.
* **Parameters:** `tab` — string, one of `"LAN"` or `"online"`.
* **Returns:** None.

### `ServerListingScreen:_GetServerPlaystyle()`
* **Description:** Retrieves the currently active playstyle filter ID, respecting forced settings before profile persistence.
* **Parameters:** None.
* **Returns:** string \| nil — the playstyle ID (e.g., `"survival"`) or `nil` if none set.

### `ServerListingScreen:SetServerPlaystyle(playstyle_id)`
* **Description:** Updates the current playstyle filter, saves it to profile (if allowed), updates the UI button label, and re-runs server filtering.
* **Parameters:** `playstyle_id` — string or nil.
* **Returns:** None.

### `ServerListingScreen:UpdateWorldProgressionFiltersButtonText()`
* **Description:** Updates the text displayed on the "World Progression Filters" button based on the number and nature of currently active filters.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:_GetWorldProgressionFilters()`
* **Description:** Fetches the current world progression filters from either `forced_settings` or saved profile data.
* **Parameters:** None.
* **Returns:** Table — the world progression filter configuration (e.g., `{ seasons = {"summer"}, game_modes = {"survival"}`).

### `ServerListingScreen:SetWorldProgressionFilters(filters)`
* **Description:** Saves the provided world progression filters to the user profile if settings saving is allowed.
* **Parameters:** `filters` — table of world progression filter values.
* **Returns:** None.

### `ServerListingScreen:ShowPlaystylePicker()`
* **Description:** Controls visibility of the playstyle picker, world progression filter picker, and server details grid based on the current tab (online/LAN), selected playstyle, and filter state.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:UpdateServerInformation(show)`
* **Description:** Shows or hides the server details panel depending on `show` and the current filter state (`filters_shown`).
* **Parameters:** `show` — boolean — if true, shows details; otherwise, hides them.
* **Returns:** None.

### `ServerListingScreen:ToggleShowFilters(forcehide)`
* **Description:** Toggles the visibility of the filter sidebar and server details panel, manages widget focus, and updates internal `filters_shown` state.
* **Parameters:** `forcehide` — boolean — if true, forces filters to hide regardless of current state.
* **Returns:** None.

### `ServerListingScreen:OnBecomeActive()`
* **Description:** Called when the screen becomes active: invokes superclass method, enables the screen, and starts the periodic server refresh task.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:OnBecomeInactive()`
* **Description:** Called when the screen is no longer active: invokes superclass method and cancels the periodic refresh task.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:OnDestroy()`
* **Description:** Called on screen destruction: invokes superclass cleanup. Contains commented-out ownership transfer logic.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:Join(warnedOffline, warnedLanguage, warnedPaused)`
* **Description:** Attempts to join the selected server with a sequence of warning modals: beta version mismatch, offline mode (if not already warned), language mismatch, and paused server detection.
* **Parameters:** `warnedOffline`, `warnedLanguage`, `warnedPaused` — booleans indicating which warnings have already been presented.
* **Returns:** None (side-effect: pushes modal screens or proceeds to `TheNet:JoinServer`).

### `ServerListingScreen:Report()`
* **Description:** Opens an input dialog to submit a server report for the selected server.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ViewServerMods()`
* **Description:** Displays a popup listing the server’s mods and their versions, with special handling for version mismatches, LAN servers, or loading states.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ViewServerTags()`
* **Description:** Displays server tags in a popup, excluding world state tags (e.g., `worldstate.*`), if any tags exist.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ViewServerGroup()`
* **Description:** Opens the network profile view for the server’s clan group, if the server is a clan-hosted one.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ViewServerWorld()`
* **Description:** Opens the world customization modal for the server if worldgen data is available and non-empty.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ViewServerPlayers()`
* **Description:** Displays a modal with the server’s active players and their colors if player data is available and successfully processed.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:OnToggleServerName()`
* **Description:** Toggles the hidden status (name or description) of the selected server and refreshes the list view to reflect the change (e.g., profanity filtering).
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ProcessServerGameData()`
* **Description:** Lazily processes the server’s `game_data` string (which contains game mode and season info) using sandboxed evaluation; caches the result to avoid reprocessing.
* **Parameters:** None.
* **Returns:** Table \| nil \| boolean — processed game data table, `nil` if no data, `false` if processing failed.

### `ServerListingScreen:ProcessServerWorldGenData()`
* **Description:** Lazily processes the server’s `world_gen_data` string, handling nested decoding and decompression; caches the result.
* **Parameters:** None.
* **Returns:** Table \| nil \| boolean — processed worldgen data, `nil` if no data, `false` on error.

### `ServerListingScreen:ProcessServerPlayersData()`
* **Description:** Lazily processes the server’s `players_data` string, converting color strings to `{r,g,b,a}` tables; caches the result.
* **Parameters:** None.
* **Returns:** Table \| nil \| boolean — processed players list, `nil` if no data, `false` on failure.

### `CompareTable(table_a, table_b)`
* **Description:** Recursively compares two tables for deep equality, including metatables. Supports nested structures and handles `nil`.
* **Parameters:** `table_a`, `table_b` — tables to compare.
* **Returns:** Boolean — `true` if equal, `false` otherwise.

### `ServerListingScreen:UpdateServerData(selected_index_actual)`
* **Description:** Refreshes the server details panel UI with data from the selected server, caching it to avoid redundant updates; respects `hide_name` setting and filters.
* **Parameters:** `selected_index_actual` — unfiltered index of the selected server in `self.servers`.
* **Returns:** None.

### `ServerListingScreen:ServerSelected(unfiltered_index)`
* **Description:** Handles server selection: downloads details if missing, updates `selected_server`, and refreshes the details panel.
* **Parameters:** `unfiltered_index` — server index in `self.servers`.
* **Returns:** None (resets selection if index is invalid or `nil`).

### `ServerListingScreen:StartPeriodicRefreshTask()`
* **Description:** Cancels any existing periodic task and starts a new timer to call `RefreshView` every `tickperiod` seconds.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:StopPeriodicRefreshTask()`
* **Description:** Cancels the current periodic refresh task.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:SearchForServers()`
* **Description:** Clears the current server list, sets `TheNet` to a searching state, and initiates either an online or LAN server search based on `self.view_online`.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:OnStartClickServerInList(unfiltered_index)`
* **Description:** Handles initial click on a server row: triggers `ServerSelected`.
* **Parameters:** `unfiltered_index` — server index in `self.servers`.
* **Returns:** None.

### `ServerListingScreen:OnFinishClickServerInList(unfiltered_index)`
* **Description:** Detects double-click to join: if the same server is clicked twice within `DOUBLE_CLICK_TIMEOUT`, initiates `Join()` without warnings.
* **Parameters:** `unfiltered_index` — server index in `self.servers`.
* **Returns:** None.

### `ServerListingScreen:RefreshView(skipPoll, keepScrollFocusPos)`
* **Description:** Updates the server list and details from `TheNet`; performs filtering and sorting if `viewed_servers` is dirty or `doneSearching` is true. Skips update if screen is fading.
* **Parameters:** `skipPoll` — boolean — if true, skips checking `TheNet:GetServerListingReadDirty()`. `keepScrollFocusPos` — boolean — reserved parameter (unused).
* **Returns:** None.

### `ServerListingScreen:SetRowColour(row_widget, colour)`
* **Description:** Applies the given `{r,g,b,a}` color to the server name, player count, and ping text in a list row.
* **Parameters:** `row_widget` — server row widget reference. `colour` — `{r,g,b,a}` table.
* **Returns:** None.

### `ServerListingScreen:MakeServerListWidgets()`
* **Description:** Constructs and populates the scrollable grid of server list rows with icons, dynamic labels, and hover data.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:_GuaranteeSelectedServerHighlighted()`
* **Description:** Ensures that the UI selection highlight matches the actual selected server (`self.selected_index_actual`) in the grid.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:CycleColumnSort()`
* **Description:** Cycles the sort column among valid options (e.g., "name", "players", "ping") depending on `SHOW_PINGS` configuration.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:SetSort(column)`
* **Description:** Sets the sort column, updates the spinner UI, and triggers sorting.
* **Parameters:** `column` — string — sort key ID (e.g., "ping").
* **Returns:** None.

### `ServerListingScreen:DoSorting()`
* **Description:** Sorts `self.viewed_servers` in-place based on the active `self.sort_column`, with secondary sorting by social/ping values.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:ProcessPlayerData(session)`
* **Description:** Processes player data for a given session string, caching it to avoid redundant sandboxing.
* **Parameters:** `session` — string — session identifier (from server data).
* **Returns:** None.

### `ServerListingScreen:IsValidWithFilters(server)`
* **Description:** Validates whether a server passes all active filters, including unjoinability checks, playstyle, game mode, season, connection type, search tokens, and world progression preferences.
* **Parameters:** `server` — table — server entry (with `name`, `mode`, `session`, `tags`, etc.).
* **Returns:** Boolean — `true` if server passes all filters, `false` otherwise.

### `ServerListingScreen:ResetFilters()`
* **Description:** Resets spinner-based filters (game mode, season, password) to defaults, clears search text, and triggers re-filtering. Skips forced filters and the connection spinner.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:DoFiltering(doneSearching, keepScrollFocusPos)`
* **Description:** Applies all filters to `self.servers`, rebuilds `self.viewed_servers`, updates the server count, sorts the list, and adjusts scroll position. Tokenizes the search query and toggles playstyle picker visibility.
* **Parameters:** `doneSearching` — boolean — indicates if search completion was reached. `keepScrollFocusPos` — reserved (unused).
* **Returns:** None.

### `ServerListingScreen:Cancel()`
* **Description:** Handles screen exit: stops server search, disables the screen, saves active filters and sort preference (if `should_save`), invokes callback `self.cb`, and navigates back via fade.
* **Parameters:** None.
* **Returns:** None.

### `CreateButtonFilter(self, name, text, buttontext, onclick)`
* **Description:** Helper to build a reusable filter UI group for buttons (playstyle and world progression). Creates a label + button in a group widget.
* **Parameters:** `self` — instance; `name` — filter ID or nil (special cases); `text` — label string; `buttontext` — unused; `onclick` — callback for button press.
* **Returns:** Widget — group containing background, label, and button.

### `CreateSpinnerFilter(self, name, text, spinnerOptions, numeric, onchanged)`
* **Description:** Helper to build spinner-based filter widgets (text or numeric). Configures onchange to trigger filtering and mark modifications.
* **Parameters:** `self` — instance; `name` — filter ID; `text` — label string; `spinnerOptions` — array of `{text,data}` or `{min,max}`; `numeric` — boolean; `onchanged` — optional custom handler.
* **Returns:** Widget — spinner group.

### `ServerListingScreen:MakeFiltersPanel(filter_data, details_height)`
* **Description:** Builds the entire filter sidebar UI: search box, spinner filters, playstyle/world progression buttons, reset button. Applies saved or forced filter values and handles tab-specific visibility.
* **Parameters:** `filter_data` — optional preset table (with `name`, `is_forced`, `data`). `details_height` — height (px) to size the filter scroll list.
* **Returns:** None.

### `ServerListingScreen:_MakeConnectionSpinner()`
* **Description:** Creates the Online/LAN connection mode spinner, overriding onchange to handle offline mode warnings and tab switching.
* **Parameters:** None.
* **Returns:** Widget — spinner group.

### `ServerListingScreen:MakeMenuButtons(left_col, right_col, nav_col)`
* **Description:** Initializes control widgets: sorting spinner, refresh button, join button, filter toggle buttons, and cancel/back button. controller buttons are conditionally hidden.
* **Parameters:** `left_col`, `right_col`, `nav_col` — unused legacy parameters.
* **Returns:** None.

### `ServerListingScreen:MakeDetailPanel(right_col, details_height)`
* **Description:** Constructs the right-side server details panel with name, description, status checkboxes, and dynamic buttons (mods, tags, players, world, group).
* **Parameters:** `right_col`, `details_height` — layout coordinates and panel height.
* **Returns:** None.

### `ServerListingScreen:_MakeServerListHeader()`
* **Description:** Builds the top header row with title ("Server List") and dynamic server count label.
* **Parameters:** None.
* **Returns:** None.

### `ServerListingScreen:OnControl(control, down)`
* **Description:** Handles global keyboard/controller input: search editing, cancel, join (double-click), filter toggle, refresh, and sort cycling.
* **Parameters:** `control` — `CONTROL_` constant (e.g., `CONTROL_CANCEL`). `down` — boolean — only `true` triggers actions.
* **Returns:** Boolean — `true` if event handled, `false` otherwise.

### `ServerListingScreen:CurrentCenterFocus()`
* **Description:** Returns the widget receiving center-focus navigation (e.g., controller select). Prioritizes overlays > server list > spinner.
* **Parameters:** None.
* **Returns:** Widget \| nil.

### `ServerListingScreen:CurrentRightFocus()`
* **Description:** Returns the widget receiving right-focus navigation (e.g., controller right). Prioritizes filter list > details panel buttons.
* **Parameters:** None.
* **Returns:** Widget \| nil.

### `ServerListingScreen:GetHelpText()`
* **Description:** Generates localized help text (button labels + actions) based on screen state (online/LAN, selected server, refresh status).
* **Parameters:** None.
* **Returns:** String — concatenated help instructions.

### `OnServerListingUpdated(row_id)`
* **Description:** Callback when a server listing updates (e.g., player count): updates the selected server in `self.servers` if the `row_id` matches and it is currently selected.
* **Parameters:** `row_id` — string — unique identifier of the updated listing.
* **Returns:** None.

## Events & listeners
- **Listens to:** No explicit event listeners (`inst:ListenForEvent`) registered in the source.
- **Pushes:** No events are explicitly pushed (`inst:PushEvent`) in the source.