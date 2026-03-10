---
id: serverlistingscreen
title: Serverlistingscreen
description: A UI screen for browsing, filtering, and joining online or LAN servers in Don't Starve Together.
tags: [ui, network, server, filtering, listing]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 36870511
system_scope: ui
---

# Serverlistingscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview

The `ServerListingScreen` is a screen component responsible for displaying a list of available servers (both online and LAN), applying dynamic filters (intention, game mode, player count, version, etc.), sorting entries, and enabling server selection for joining, details viewing, or reporting. It integrates with `TheNet` for server discovery and listing management, `TheFrontEnd` for UI transitions and focus navigation, and persists user-selected filters using the profile system. The screen manages server metadata decoding, tab switching, periodic listing refresh, double-click joining, and modal overlays for world data, player lists, mods, and group profiles.

## Usage example

```lua
local ServerListingScreen = require("screens/serverlistingscreen")
local screen = ServerListingScreen(
    TheNet:GetSessionMapping(),
    TheNet:GetServerListings(),
    function(filters)
        -- Called on cancel; filters contain current filter state
        print("Cancelled with filters:", Dump(filters))
    end,
    false -- offlineMode
)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None directly — this is a UI screen class, not a component attached to entities.

**Tags:** None

**External modules and globals used:**
- `TheNet` — server listing, search, details download, reporting, disconnect, version check
- `TheFrontEnd` — screen management, fading, sound, focus, mouse tracking
- `TheInput` — input control handling, controller detection
- `Profile` — filter persistence (`GetValue`, `SetValue`, `SaveFilters`)
- `STRINGS.UI.SERVERLISTINGSCREEN.*` — localized UI strings
- `STRINGS.UI.HELP.*` — help text strings
- `BRANCH` — global branch identifier for version filter toggling
- `APP_VERSION` — server version comparison
- `INTENTIONS`, `BETA_INFO`, `DST_CHARACTERLIST`, `MODCHARACTERLIST`, `GetGameModesSpinnerData`, `GetGameModeString`, `GetGameModeDescriptionString`
- `TEMPLATES.*` — reusable UI templates (`IconButton`, `TabButton`, `NavBarButton`, `ServerDetailIcon`, `BackButton`)
- `Resolutions` (`RESOLUTION_X`, `RESOLUTION_Y`) — layout offsets
- `TUNING.MAX_SERVER_SIZE` — maximum player count spinner limit
- `RunInSandboxSafe`, `CompareTable`, `subfmt`, `GetStaticTime`, `table.contains`, `stringidsorter` — utility functions

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `server_intention` | `{ data: string, button: widget }` | `{}` | Stores current server intention and reference to intention button |
| `prev_screen` | `screen?` | `nil` | Reference to the screen that opened this one |
| `session_mapping` | `table` | `nil` | Session-to-server-ID mapping from `TheNet` |
| `cb` | `function(filters: table)` | `nil` | Callback invoked on screen close/cancel |
| `offlinemode` | `boolean` | `false` | Indicates if offline mode is active |
| `tickperiod` | `number` | `0.5` | Refresh interval in seconds for periodic updates |
| `task` | `task?` | `nil` | Handle to the periodic refresh task |
| `unjoinable_servers` | `number` | `0` | Count of servers filtered out by hard filters |
| `root` | `widget` | `nil` | Root scaling widget (`scaleroot`) |
| `view_online` | `boolean` | `true` | Current tab mode (`true`: online, `false`: LAN) |
| `menu_bg`, `server_list_frame`, `server_list`, etc. | `widget` | `nil` | UI hierarchy widgets |
| `intentions_overlay` | `IntentionPicker` | `nil` | Overlay widget for intention selection |
| `nav_bar` | `NavBarWithScreenTitle` | `nil` | Navigation bar with title |
| `table` | `widget` | `nil` | Main container table widget |
| `sort_ascending` | `boolean?` | `nil` | Current sort direction (`true`: ascending) |
| `sort_column` | `string?` | `nil` | Current sort column (`"NAME"`, `"DETAILS"`, `"PLAYERS"`, `"PING"`) |
| `selected_index_actual` | `number` | `-1` | Index into `TheNet` server list (0-based or `nil`) |
| `selected_server` | `table?` | `nil` | Server listing table of the currently selected server |
| `list_widgets` | `{ widget }` | `{}` | List of row widgets for visible server entries |
| `view_offset` | `number` | `0` | Scroll offset for server list |
| `viewed_servers` | `{ table }` | `{}` | Filtered and sorted list of servers currently displayed |
| `servers` | `{ table }` | `{}` | Raw server list from `TheNet` (before filtering) |
| `filters` | `{ [string]: any }` | `{}` | Cache of active filter values |
| `sessions` | `{ [string]: any? }` | `{}` | Cache of decoded player/session data |

## Main functions

### `GetBetaInfoId(tags)`
* **Description:** Finds the index of a server's beta version in `BETA_INFO` by checking if `tags` contains a known server tag.
* **Parameters:** `tags` — space-separated string of server tags.
* **Returns:** `i` — 1-based index if found, else `0`.
* **Error states:** None.

### `ServerListingScreen:Join(warnedOffline)`
* **Description:** Attempts to join the selected server; prompts for version mismatch or offline mode confirmation if needed.
* **Parameters:** `warnedOffline` — boolean indicating if offline warning has already been shown.
* **Returns:** `nil`.
* **Error states:** Asserts with `"Invalid server selection"` if `self.selected_server == nil`.

### `ServerListingScreen:Report()`
* **Description:** Opens an input dialog to submit a server report.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Uses `self.selected_index_actual` to derive `guid`; fails if no server selected.

### `ServerListingScreen:ViewServerMods()`
* **Description:** Displays server mod list via popup dialog.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Returns early if `self.selected_server == nil` or `not self.selected_server.mods_enabled`.

### `ServerListingScreen:ViewServerTags()`
* **Description:** Displays server tags in a popup dialog, forcing fallback font.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Returns early if `self.selected_server == nil` or `self.selected_server.tags == nil`.

### `ServerListingScreen:ViewServerGroup()`
* **Description:** Opens the network profile screen for the server’s associated clan/group.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Returns early if `self.selected_server.clan_server == nil` or `false`.

### `ServerListingScreen:ViewServerWorld()`
* **Description:** Pushes `ViewCustomizationModalScreen` with decoded world generation data.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Returns early if `ProcessServerWorldGenData()` returns `nil`.

### `ServerListingScreen:ViewServerPlayers()`
* **Description:** Pushes `ViewPlayersModalScreen` with decoded player session data.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Returns early if `ProcessServerPlayersData()` returns `nil`.

### `ServerListingScreen:ProcessServerGameData()`
* **Description:** Safely decodes `server.game_data` (string) and caches the result.
* **Parameters:** None (uses `self.selected_server`).
* **Returns:** Decoded game data table, or `nil` if decoding fails or `self.selected_server == nil`.

### `ServerListingScreen:ProcessServerWorldGenData()`
* **Description:** Safely decodes `server.world_gen_data` (string) and caches the result.
* **Parameters:** None.
* **Returns:** Decoded world gen table, or `nil` if decoding fails or `self.selected_server == nil`.

### `ServerListingScreen:ProcessServerPlayersData()`
* **Description:** Safely decodes `server.players_data` (string), converts player colour strings to `{r,g,b,1}`, and caches the result.
* **Parameters:** None.
* **Returns:** Array of player data tables, or `nil` if decoding fails or `self.selected_server == nil`.

### `CompareTable(table_a, table_b)`
* **Description:** Recursively compares two tables for deep equality.
* **Parameters:** `table_a`, `table_b` — tables to compare.
* **Returns:** `true` if equal, `false` otherwise.
* **Error states:** Handles `nil`, non-table types, and metatables.

### `ServerListingScreen:UpdateServerData(selected_index_actual)`
* **Description:** Updates the detail panel UI with information from the selected server.
* **Parameters:** `selected_index_actual` — index into `TheNet` server list.
* **Returns:** `nil`.
* **Error states:** Does nothing if selected server data has not changed (according to `CompareTable`).

### `ServerListingScreen:ServerSelected(new_index)`
* **Description:** Handles selection of a server by visible list index; triggers details download if needed and updates detail panel.
* **Parameters:** `new_index` — index in `viewed_servers`, or `nil` to clear selection.
* **Returns:** `nil`.
* **Error states:** Clears selection state if `new_index == nil`.

### `ServerListingScreen:StartPeriodicRefreshTask()`
* **Description:** Starts a periodic task (`tickperiod = 0.5`) to call `RefreshView(false, true)`.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Cancels any existing task before starting new one.

### `ServerListingScreen:StopPeriodicRefreshTask()`
* **Description:** Cancels the current periodic refresh task.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Safely handles `nil` task.

### `ServerListingScreen:ClearServerList()`
* **Description:** Clears all visible list row widgets and resets scroll position to top.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:SearchForServers()`
* **Description:** Initiates server search via `TheNet` (online or LAN), clears current list, and starts refresh task.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Clears `self.viewed_servers`, `self.servers`, and calls `ClearServerList`.

### `ServerListingScreen:OnStartClickServerInList(index)`
* **Description:** Handles start of click/down event for a list row.
* **Parameters:** `index` — relative row index in `list_widgets` (0-based).
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:OnFinishClickServerInList(index)`
* **Description:** Handles click release; detects double-click to join server.
* **Parameters:** `index` — relative row index in `list_widgets`.
* **Returns:** `nil`.
* **Error states:** Uses `GetStaticTime()` and `DOUBLE_CLICK_TIMEOUT` to detect double-click.

### `ServerListingScreen:RefreshView(skipPoll, keepScrollFocusPos)`
* **Description:** Updates server list with latest `TheNet` data, applies filters/sorting, and refreshes row widgets.
* **Parameters:**  
  `skipPoll` — skip polling `TheNet` if `true`  
  `keepScrollFocusPos` — preserve scroll position if `true`
* **Returns:** `nil`.
* **Error states:** Returns early if fading is in progress (`TheFrontEnd:GetFadeLevel() > 0`).

### `ServerListingScreen:SetRowColour(row_widget, colour)`
* **Description:** Sets text colour for `NAME`, `PLAYERS`, and `PING` widgets within a list row.
* **Parameters:**  
  `row_widget` — row widget table  
  `colour` — `{r,g,b,a}` colour table
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:MakeServerListWidgets()`
* **Description:** Constructs scrollable list and row widgets; populates the server list UI.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:GuaranteeSelectedServerHighlighted()`
* **Description:** Ensures the selected row is visually highlighted in the list.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:CycleColumnSort()`
* **Description:** Cycles sort column (NAME → DETAILS → PLAYERS → PING) and toggles sort direction.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Defaults to `"DETAILS"` if current sort column is unknown.

### `ServerListingScreen:SetSort(column)`
* **Description:** Sets sort column and direction; updates sort arrows in headers.
* **Parameters:** `column` — `"NAME"`, `"DETAILS"`, `"PLAYERS"`, or `"PING"`.
* **Returns:** `nil`.
* **Error states:** Toggles ascending if same column; otherwise sets `sort_ascending = true`.

### `ServerListingScreen:DoSorting()`
* **Description:** Sorts `self.viewed_servers` in-place based on `sort_column` and `sort_ascending`.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Returns early if `self.viewed_servers == nil`.

### `ServerListingScreen:ProcessPlayerData(session)`
* **Description:** Loads or decodes player session data for `session`, caches result in `self.sessions`.
* **Parameters:** `session` — session ID string.
* **Returns:** `nil` (caches result or `false` on failure).
* **Error states:** Leaves `false` in `self.sessions` if `RunInSandboxSafe` fails.

### `ServerListingScreen:IsValidWithFilters(server)`
* **Description:** Checks if a server passes all active filters (intention, game mode, season, PVP, players, mods, password, version, etc.).
* **Parameters:** `server` — server listing table.
* **Returns:** `true` if valid, `false` otherwise; increments `unjoinable_servers` for hard-filtered servers.
* **Error states:** Returns `false` for invalid input.

### `ServerListingScreen:ResetFilters()`
* **Description:** Resets spinner filters and search box to defaults; reapplies filtering.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:SetTab(tab)`
* **Description:** Switches tab between `"LAN"` and `"online"`; triggers corresponding server search.
* **Parameters:** `tab` — `"LAN"` or `"online"`.
* **Returns:** `nil`.
* **Error states:** Updates UI state and intention button text accordingly.

### `ServerListingScreen:SetServerIntention(intention)`
* **Description:** Updates the server intention value and profile; triggers filtering.
* **Parameters:** `intention` — `INTENTION.*` string (`"RELAXED"`, `"RULES_ENFORCING"`, etc.).
* **Returns:** `nil`.
* **Error states:** Sets `self.server_intention.data = intention`, updates profile, UI.

### `ServerListingScreen:ShowServerIntention()`
* **Description:** Manages visibility of intention overlay vs server list based on state.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Adjusts focus between overlay and server list.

### `ServerListingScreen:UpdateServerInformation(show)`
* **Description:** Toggles visibility of the server detail panel (name, description, toggles).
* **Parameters:** `show` — boolean to show/hide.
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:ToggleShowFilters(forcehide)`
* **Description:** Toggles visibility of the filters panel; manages button states and focus.
* **Parameters:** `forcehide` — force hide if `true`.
* **Returns:** `nil`.
* **Error states:** None.

### `ServerListingScreen:OnBecomeActive()`
* **Description:** Called when screen becomes active; enables input, starts periodic refresh.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Calls super and `StartPeriodicRefreshTask()`.

### `ServerListingScreen:OnBecomeInactive()`
* **Description:** Called when screen becomes inactive; disables input, stops periodic refresh.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Calls super and `StopPeriodicRefreshTask()`.

### `ServerListingScreen:OnDestroy()`
* **Description:** Cleans up; transfers portal ownership back and destroys screen.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** Calls super and transfers portal ownership.

### `ServerListingScreen:DoFiltering(doneSearching, keepScrollFocusPos)`
* **Description:** Applies active filters to `self.servers`, updates `viewed_servers`, resets `unjoinable_servers`, updates list title, and recalculates sort order. Maintains focus on previously selected server if possible.
* **Parameters:**  
  `doneSearching` — if `true`, skips early return when list hasn’t changed  
  `keepScrollFocusPos` — whether to preserve scroll position
* **Returns:** `nil`.
* **Error states:** Assumes `self.servers`, `self.filters`, and `self.viewed_servers` are initialized.

### `ServerListingScreen:Cancel()`
* **Description:** Stops server search, invokes callback with current filter state, fades out, pops screen, fades back in.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None.

### `CreateButtonFilter(self, name, text, buttontext, onclick)`
* **Description:** Creates a `SpinnerGroup` widget for simple toggle filters (e.g., intention).
* **Parameters:**  
  `self` — `ServerListingScreen` instance  
  `name` — filter identifier  
  `text` — label text  
  `buttontext` — button text  
  `onclick` — callback on click
* **Returns:** `group` — Widget `"SpinnerGroup"` with label, button, background.

### `CreateSpinnerFilter(self, name, text, spinnerOptions, numeric, onchanged)`
* **Description:** Creates a `SpinnerGroup` widget with a `Spinner` or `NumericSpinner` for dropdown-style filters.
* **Parameters:**  
  `self` — `ServerListingScreen` instance  
  `name` — filter identifier  
  `text` — label text  
  `spinnerOptions` — options table or `{min,max}`  
  `numeric` — use `NumericSpinner` if `true`  
  `onchanged` — optional callback on change
* **Returns:** `group` — Widget `"SpinnerGroup"` with label, spinner, background, and change indicator.

### `ServerListingScreen:MakeFiltersPanel(filter_data)`
* **Description:** Constructs the full filter panel UI with search box, intention button, and multiple spinner filters (game mode, season, PVP, mods, password, server type, character, friends, clan, slots, version).
* **Parameters:** `filter_data` — optional saved filter state to restore.
* **Returns:** `nil`.
* **Error states:** Assumes required constants and helper functions exist.

### `MakeImgButton(parent, xPos, yPos, text, onclick, style, image)`
* **Description:** Helper to create configured `ImageButton` instances with support for `large`, `tab`, `nav`, `icon` styles.
* **Parameters:**  
  `parent` — parent widget  
  `xPos`, `yPos` — position  
  `text` — label text  
  `onclick` — click callback  
  `style` — style string (`"large"`, `"tab"`, `"nav"`, `"icon"`)  
  `image` — icon filename (for `"icon"` style)
* **Returns:** Configured `ImageButton`.

### `ServerListingScreen:MakeMenuButtons(left_col, right_col, nav_col)`
* **Description:** Creates menu buttons (refresh, tabs, join, filters/details, cancel); configures layout, focus, and controller visibility.
* **Parameters:**  
  `left_col`, `right_col`, `nav_col` — X-coordinates for layout alignment
* **Returns:** `nil`.

### `ServerListingScreen:MakeDetailPanel(right_col)`
* **Description:** Constructs the server detail panel UI: name/desc, detail toggles (world/mods/tags/players/group), checkboxes (password, dedicated, PVP), game mode/season/day.
* **Parameters:** `right_col` — X-coordinate for panel placement.
* **Returns:** `nil`.

### `MakeHeader(self, parent, xPos, name, onclick)`
* **Description:** Creates a sortable column header widget with label, background, and direction arrow.
* **Parameters:**  
  `self` — `ServerListingScreen` instance  
  `parent` — parent widget  
  `xPos` — X-coordinate  
  `name` — column name string  
  `onclick` — callback when clicked
* **Returns:** `header` — Widget `"control"` with `text`, `bg`, `arrow` subwidgets.

### `ServerListingScreen:MakeColumnHeaders()`
* **Description:** Adds list title, server count label, and sortable headers (`NAME`, `DETAILS`, `PLAYERS`, `PING`).
* **Parameters:** None.
* **Returns:** `nil`.

### `ServerListingScreen:OnControl(control, down)`
* **Description:** Handles controller/input events: search box, cancel/join, filter toggle, focus navigation.
* **Parameters:**  
  `control` — `CONTROL_*` constant (e.g., `CONTROL_CANCEL`)  
  `down` — `true` for press, `false` for release
* **Returns:** `true` if handled, `false` otherwise.

### `ServerListingScreen:CurrentCenterFocus()`
* **Description:** Returns the widget that should receive center focus (intention overlay or server list).
* **Parameters:** None.
* **Returns:** Widget instance or `nil`.

### `ServerListingScreen:CurrentRightFocus()`
* **Description:** Returns the widget that should receive right focus (filters panel or detail panel toggle).
* **Parameters:** None.
* **Returns:** Widget instance or `nil`.

### `ServerListingScreen:CurrentLeftFocus()`
* **Description:** Returns the widget that should receive left focus (online or LAN tab button).
* **Parameters:** None.
* **Returns:** Widget (`online_button` or `lan_button`).

### `ServerListingScreen:GetHelpText()`
* **Description:** Constructs and returns localized help text for control bindings.
* **Parameters:** None.
* **Returns:** Help text string.

## Events & listeners

**Listens to:** None (no `inst:ListenForEvent` calls in source code).

**Pushes:** None (no `inst:PushEvent` calls in source code).

**Input Events Handled:** `OnControl(control, down)` covers all relevant input (keyboard/controller); screen lifecycle handled by `OnBecomeActive()`, `OnBecomeInactive()`, `OnDestroy()`.

**UI Events:** Server row selection (clicks), double-click join detection (`GetStaticTime()`, `DOUBLE_CLICK_TIMEOUT`); focus navigation via `CurrentCenterFocus()`, `CurrentLeftFocus()`, `CurrentRightFocus()`.