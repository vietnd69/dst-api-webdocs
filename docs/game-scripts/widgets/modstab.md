---
id: modstab
title: ModsTab
description: Manages the mod list UI in the server creation screen, including listing, enabling/disabling, configuring, updating, and displaying mod details for client and server mods.
tags: [ui, mods, configuration]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c0f39526
system_scope: ui
---

# ModsTab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ModsTab` is a UI widget responsible for rendering and managing the mod list in the server creation screen. It provides controls for switching between client and server mods, enabling/disabling mods, updating mods (via Workshop), configuring mod settings, viewing mod details (name, author, compatibility, description), and performing bulk actions like updating or cleaning all mods. It interfaces with `KnownModIndex`, `ModManager`, and `TheSim` to reflect real-time mod state and metadata. The component is instantiated by the server creation screen and hosts two scrollable lists (`options_scroll_list_client`, `options_scroll_list_server`) populated with mod list items.

## Usage example
```lua
local servercreationscreen = -- reference to the server creation screen instance
local modstab = ModsTab(servercreationscreen)

-- Initialize and start periodic Workshop updates
modstab:StartWorkshopUpdate()

-- Switch to client mods view
modstab:SetModsList("client")

-- Enable a mod at index 3 in the current list
modstab:EnableCurrent(3)

-- Configure the currently selected mod if possible
if modstab.modconfigable then
    modstab:ConfigureSelectedMod()
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `focusable` to buttons via `DoFocusHookups()`; uses internal focus chain (client/server buttons, scroll lists, action buttons). No tags added/removed on entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mods_page` | Widget | `nil` | Root container for the tab's UI elements. |
| `slotnum` | number | `-1` | Save slot index associated with this tab. |
| `servercreationscreen` | table | `nil` | Parent screen that owns this tab. |
| `currentmodtype` | string | `""` | `"client"` or `"server"` — the currently displayed mod list type. |
| `modnames_client`, `modnames_server` | table | `nil` | Lists of `{ modname, version }` tables for client/server mods. |
| `modnames_client_dl`, `modnames_server_dl` | table | `nil` | Lists of `{ modname, fancy_name }` for mods currently downloading. |
| `optionwidgets_client`, `optionwidgets_server` | table | `nil` | Arrays of mod list item widgets (from `TEMPLATES.ModListItem`/`ModDLListItem`). |
| `options_scroll_list_client`, `options_scroll_list_server` | ScrollableList | `nil` | Scrollable UI lists displaying client and server mods. |
| `currentmodname` | string | `nil` | Name of the currently selected mod. |
| `last_client_modname`, `last_server_modname` | string | `nil` | Last selected mod name for client/server lists. |
| `modconfigable` | boolean | `false` | Whether the configure button is enabled for the current mod. |
| `modupdateable` | boolean | `false` | Whether the update button is enabled for the current mod. |
| `updateallenabled` | boolean | `false` | Whether the "Update All" button is interactive (i.e., mods are out of date). |
| `infoprefabs` | table | `{}` | Prefabs loaded for mod icons to avoid reloading during refresh. |
| `nav_bar`, `mainmenu`, `detailpanel` | Widget | `nil` | UI containers for navigation, action buttons, and mod details. |
| `updateallbutton.out_of_date_image.count` | Text | `nil` | Subwidget displaying the count of out-of-date or downloading mods. |

## Main functions
### `DisableConfigButton(modWidget)`
*   **Description:** Disables the configure button and updates the associated mod list item to reflect that it has no configuration options.  
*   **Parameters:** `modWidget` (Widget, optional) — the list item widget for the current mod.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `EnableConfigButton(modWidget)`
*   **Description:** Enables the configure button if the mod has configuration options. Updates the mod list item's icon visibility.  
*   **Parameters:** `modWidget` (Widget, optional) — the list item widget for the current mod.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `DisableUpdateButton(mode, idx)`
*   **Description:** Disables the update button. Sets hover text based on `mode` (`"uptodate"` or `"updating"`).  
*   **Parameters:** `mode` (string) — reason for disabling (`"uptodate"` or `"updating"`). `idx` (number, optional) — index of the mod in the list (used to update item status).  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `EnableUpdateButton(idx)`
*   **Description:** Enables the update button if the mod is an out-of-date Workshop mod. Updates hover text and item status.  
*   **Parameters:** `idx` (number, optional) — index of the mod in the list.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `SetModsList(listtype)`
*   **Description:** Switches the displayed mod list between `"client"` and `"server"` types. Updates button selection state, shows/hides scroll lists, and displays details for the last-selected mod in the new list.  
*   **Parameters:** `listtype` (string) — `"client"` or `"server"`.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if the corresponding scroll list (`options_scroll_list_client` or `options_scroll_list_server`) has not been created yet.

### `CreateDetailPanel()`
*   **Description:** Initializes or clears the mod detail panel widget, populating it with labels for title, author, compatibility, description, warning message, and icon. If no mods exist for the current type, displays a "no mods" message and disables action buttons.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `UpdateForWorkshop(force_refresh)`
*   **Description:** Periodically queries Workshop for mod version information, compares current and known mod lists, reloads mod metadata, and rebuilds the mod list widgets and scrollable lists. Updates the "Update All" button state and mod status indicators. Requires lock on mod directory via `TheSim:TryLockModDir()`.  
*   **Parameters:** `force_refresh` (boolean) — if `true`, ignores change detection and refreshes UI unconditionally.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if directory lock cannot be acquired or no changes occurred.

### `GetBestModStatus(modname)`
*   **Description:** Determines the status string (`"WORKING_NORMALLY"`, `"DISABLED_ERROR"`, `"DISABLED_MANUAL"`) for a mod based on `KnownModIndex`.  
*   **Parameters:** `modname` (string) — the mod identifier.  
*   **Returns:** (string) — status code.  
*   **Error states:** None.

### `EnableCurrent(idx)`
*   **Description:** Toggles the enabled state of the mod at `idx` in the current list. Prompts for restart if required by the mod. Updates UI, mod state, and refreshes the parent screen.  
*   **Parameters:** `idx` (number) — index of the mod in the current list (`self.optionwidgets_client` or `self.optionwidgets_server`).  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `ShowModDetails(idx, client_mod)`
*   **Description:** Updates the detail panel with info (icon, title, author, description, compatibility, status) for the mod at `idx`. Highlights the selected mod in the list and updates action button states (config/update availability).  
*   **Parameters:** `idx` (number) — index in the current list. `client_mod` (boolean) — `true` if displaying client mods, `false` for server.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if list is empty or `modname` is `nil`.

### `OnConfirmEnable(restart, modname)`
*   **Description:** Handles enabling/disabling a mod, including unloading/loading via `ModManager`, saving via `KnownModIndex`, and showing compatibility or auto-download warnings for non-Workshop mods. Optionally quits to apply changes if `restart` is `true`.  
*   **Parameters:** `restart` (boolean) — whether to quit after toggling. `modname` (string) — the mod to toggle.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `OnDestroy()`
*   **Description:** Cleanup during widget destruction. Cancels periodic update tasks and unloads icon prefabs.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `OnBecomeActive()`
*   **Description:** Starts or resumes the periodic Workshop update task.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `ConfigureSelectedMod()`
*   **Description:** Opens the `ModConfigurationScreen` for the currently selected mod if configuration is available and the button is enabled.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if `modconfigable` is `false`.

### `UpdateSelectedMod()`
*   **Description:** Triggers Workshop update for the currently selected mod if the update button is enabled.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** Returns early if `modupdateable` is `false`.

### `UpdateAllButton(force)`
*   **Description:** Updates all out-of-date Workshop mods. If `force` is `true`, starts updates immediately. Otherwise, shows a confirmation dialog before proceeding.  
*   **Parameters:** `force` (boolean) — bypass confirmation dialog if `true`.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `CleanAllButton()`
*   **Description:** Shows a confirmation dialog for wiping all mods, then calls `TheSim:CleanAllMods()`, disables all mods, saves, and resets assets.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `SetSaveSlot(slotnum, fromDelete)`
*   **Description:** Associates the tab with a save slot, loads enabled server mods for that slot, and refreshes the mod list. Unloads all mods before switching slots.  
*   **Parameters:** `slotnum` (number) — the save slot index. `fromDelete` (boolean) — if `true`, skip early return when `slotnum` matches.  
*   **Returns:** Nothing.  
*   **Error states:** None.

### `Apply()`
*   **Description:** Saves enabled mods for the current slot, persists to disk via `SaveGameIndex`, and cancels update tasks. After calling, the tab is no longer functional until re-initialized.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** None.

## Events & listeners
- **Listens to:** None identified — events are handled via callbacks (e.g., button `function()` closures, `OnControl`, `OnGainFocus`) and direct function calls rather than `inst:ListenForEvent`.  
- **Pushes:** `none` — no custom events are pushed via `inst:PushEvent`.