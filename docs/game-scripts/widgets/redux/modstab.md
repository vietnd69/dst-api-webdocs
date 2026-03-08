---
id: modstab
title: Modstab
description: Manages the UI and logic for the mod management screen, including mod listing, filtering, enabling/disabling, dependency handling, and workshop updates.
tags: [ui, mods, workshop, networking, state]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 25750009
system_scope: ui
---

# Modstab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `ModsTab` widget is the core UI component for the mod management interface in Don't Starve Together. It manages display and editing of client and server mod lists, handles mod dependencies and dependents, tracks workshop update status, and coordinates background tasks (e.g., mod ordering refresh and workshop polling). It integrates with subscreens, filter bars, detail panels, and popup dialogs to provide a full mod configuration experience.

## Usage example
```lua
-- Initialize the ModsTab instance within a screen
local modstab = ModsTab({
    settings = TheModSettings,
    servercreationscreen = parent_screen,
})
modstab:OnBecomeActive() -- start background tasks and refresh
modstab:UpdateModsOrder(true) -- force refresh
-- later, after user interaction:
modstab:EnableCurrent(widget_idx) -- enable/disable a mod
modstab:Apply() -- persist changes
```

## Dependencies & tags
**Components used:** Widget, Subscreener, TopModsPanel, Menu, ModFilterBar, PopupDialogScreen, ModConfigurationScreen, ModsListPopup  
**Tags:** None

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.settings` | table | — | The mod settings object passed at construction. |
| `self.mods_page` | Widget | — | Root child widget for mod UI content. |
| `self.slotnum` | number | `-1` | Current save slot index. |
| `self.servercreationscreen` | table | — | Parent screen reference (`ServerCreationScreen` or `ModsScreen`). |
| `self.currentmodtype` | string | `""` | Active mod list type: `"client"`, `"server"`, or `"showcase"`. |
| `self.infoprefabs` | table | — | Maps mod names to prefab icon assets (`MODSCREEN_<modname>`). |
| `self.modnames_client`, `self.modnames_client_dl`, `self.modnames_server`, `self.modnames_server_dl` | array | — | Arrays of `{name, version}` objects for client/server and downloadable mods. |
| `self.downloading_mods_count` | number | `0` | Tracks active workshop downloads. |
| `self.optionwidgets_client`, `self.optionwidgets_server` | table | — | OptionWidget instances wrapping client/server mod entries. |
| `self.currentmodname` | string? | `nil` | Name of currently selected mod. |
| `self.last_client_modname`, `self.last_server_modname` | string? | `nil` | Last selected client/server mod names (navigation history). |
| `self.modconfigable`, `self.modupdateable`, `self.updateallenabled` | boolean | `false` | Button state flags. |
| `self.modfilterbar`, `self.subscreener`, `self.mods_scroll_list`, `self.detailpanel`, `self.selectedmodmenu`, `self.allmodsmenu`, `self.out_of_date_badge`, `self.controller_out_of_date`, `self.no_mods_popup`, `self.dependency_queue` | widget/table/nil | — | UI elements and deferred tasks. |
| `self.workshopupdatetask`, `self.modsorderupdatetask` | — | — | Pending periodic update tasks. |

## Main functions
### `OptionWidget:__index(k)`
* **Description:** Custom indexer for `OptionWidget`. Handles numeric access by returning elements from `self.normal` (up to `#self.normal`), then from `self.dl` for higher indices.
* **Parameters:** `k` — index/key being accessed.
* **Returns:** Value from `self.normal` or `self.dl` if `k` is a number; otherwise calls `metarawget(self, k)`.

### `OptionWidget:__newindex(k, v)`
* **Description:** Custom setter for `OptionWidget`. Ignores assignments where `k` is numeric.
* **Parameters:** `k` — key; `v` — value to assign.
* **Returns:** Nothing (assigns via `metarawget(self, k, v)` only if `k` is non-numeric).

### `OptionWidget:__len()`
* **Description:** Returns total length of both `self.normal` and `self.dl` tables.
* **Parameters:** None.
* **Returns:** `#self.normal + #self.dl`.

### `OptionWidget:__ipairs()`
* **Description:** Implements `ipairs`-style iteration over `self.normal` then `self.dl`.
* **Parameters:** None.
* **Returns:** A coroutine-based iterator yielding `(i + offset, value)` for each element across both tables.

### `ModsTab:DisableConfigButton()`
* **Description:** Disables the mod configuration button visually and functionally.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:EnableConfigButton()`
* **Description:** Enables the mod configuration button visually and functionally.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:DisableUpdateButton(mode)`
* **Description:** Disables the mod update button; includes hover text based on `mode`.
* **Parameters:** `mode` — `"uptodate"` or `"updatingmod"`; sets hover text accordingly.
* **Returns:** Nothing.

### `ModsTab:EnableUpdateButton()`
* **Description:** Enables the mod update button.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:_SetModsList(listtype, forcescroll)`
* **Description:** Switches the active mod list (`client`, `server`, or `showcase`) and refreshes the scroll list and detail panel.
* **Parameters:** `listtype` — target mod list type; `forcescroll` — whether to force scrolling to the selected item.
* **Returns:** Nothing.

### `ModsTab:IsModOutOfDate(modname, workshop_version)`
* **Description:** Checks if a mod is outdated by comparing workshop version with stored mod info.
* **Parameters:** `modname` — mod identifier; `workshop_version` — current workshop version.
* **Returns:** `true` if mod is workshop mod and version mismatches; otherwise `false`.

### `ModsTab:CreateModsScrollList()`
* **Description:** Creates and configures the scrollable grid of mod list items using `TEMPLATES.ScrollingGrid`.
* **Parameters:** None.
* **Returns:** Nothing (sets `self.mods_scroll_list`).

### `ModsTab:CreateDetailPanel()`
* **Description:** Creates and configures the mod details panel UI, including text fields and visibility logic for empty/full states.
* **Parameters:** None.
* **Returns:** Nothing (sets `self.detailpanel`).

### `ModsTab:_CancelTasks()`
* **Description:** Cancels active periodic update tasks (`workshopupdatetask`, `modsorderupdatetask`).
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:StartModsOrderUpdate()`
* **Description:** Starts a periodic task to refresh mod ordering using `UpdateModsOrder`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:StartWorkshopUpdate()`
* **Description:** Starts a periodic task to poll workshop for mod updates using `UpdateForWorkshop`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:UpdateModsOrder(force_refresh)`
* **Description:** Refreshes and sorts mod lists (`modnames_client`, `modnames_server`, and their `dl` variants), builds widgets for each, updates filter bar states, and refreshes UI.
* **Parameters:** `force_refresh` — boolean to bypass change-detection.
* **Returns:** Nothing.

### `ModsTab:UpdateForWorkshop(force_refresh)`
* **Description:** Queries workshop state (e.g., downloads), handles mod download lists (`modnames_*_dl`), and triggers UI updates or popup notifications.
* **Parameters:** `force_refresh` — boolean to bypass change-detection.
* **Returns:** Nothing.

### `ModsTab:RefreshModFilter(filter_fn)`
* **Description:** Updates the active filter function and forces a refresh of mod lists and UI.
* **Parameters:** `filter_fn` — function that returns `true` if mod should be shown.
* **Returns:** Nothing.

### `ModsTab:GetOutOfDateEnabledMods()`
* **Description:** Returns list of enabled server mods that are out of date.
* **Parameters:** None.
* **Returns:** Table of mod names.

### `ModsTab:OnConfirmEnable(restart, modname)`
* **Description:** Enables or disables a mod, handles dependency/dependent logic, warnings, and optional restart.
* **Parameters:** `restart` — if `true`, saves mods and quits; `modname` — mod identifier.
* **Returns:** Nothing.

### `ModsTab:EnableCurrent(widget_idx)`
* **Description:** Enables or disables the currently selected mod (by widget index); handles dependencies/dependents and restart prompts.
* **Parameters:** `widget_idx` — index in `self.optionwidgets_*` table.
* **Returns:** Nothing.

### `ModsTab:FavoriteCurrent(widget_idx)`
* **Description:** Toggles favorite status of the mod at `widget_idx`.
* **Parameters:** `widget_idx` — index in `self.optionwidgets_*` table.
* **Returns:** Nothing.

### `ModsTab:GetBestModStatus(modname)`
* **Description:** Returns status string for mod: `"WORKING_NORMALLY"`, `"DISABLED_ERROR"`, or `"DISABLED_MANUAL"`.
* **Parameters:** `modname` — mod identifier.
* **Returns:** String status.

### `ModsTab:ShowModDetails(widget_idx, client_mod)`
* **Description:** Displays detailed info for the mod at `widget_idx` (including name, author, description, compatibility, warnings).
* **Parameters:** `widget_idx` — index in `self.optionwidgets_*` table; `client_mod` — `true` if `client`, `false` for `server`.
* **Returns:** Nothing.

### `ModsTab:EnableModDependencies(mod_dependencies)`
* **Description:** Enables all mods in `mod_dependencies` that exist and are not already enabled.
* **Parameters:** `mod_dependencies` — array of mod names.
* **Returns:** Nothing.

### `ModsTab:DisableModDependents(mod_dependents)`
* **Description:** Disables all mods in `mod_dependents` that are enabled.
* **Parameters:** `mod_dependents` — array of mod names.
* **Returns:** Nothing.

### `ModsTab:DisplayModDependencies(modname, mod_dependencies)`
* **Description:** Shows a popup asking user whether to enable missing dependencies.
* **Parameters:** `modname` — mod name being enabled; `mod_dependencies` — array of missing dependency mod names.
* **Returns:** Nothing.

### `ModsTab:DisplayModDependents(modname, mod_dependents)`
* **Description:** Shows a popup asking user whether to disable dependent mods when disabling a mod.
* **Parameters:** `modname` — mod name being disabled; `mod_dependents` — array of dependent mod names.
* **Returns:** Nothing.

### `ModsTab:UnloadModInfoPrefabs()`
* **Description:** Unloads and unregisters all prefabs created for mod icons (`MODSCREEN_<modname>`).
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:ReloadModInfoPrefabs()`
* **Description:** Updates mod icon prefabs by reloading changed/added/removed mod assets.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:ModLinkCurrent()`
* **Description:** Launches external mod link for current mod or shows more mods if none selected.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:Cancel()`
* **Description:** Cancels all background tasks, unloads all frontend mods, restores cached save data, and unloads mod prefabs.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:Apply()`
* **Description:** Applies current mod configuration: saves mod state, disables menus, reloads UI if in `ModsScreen`, or saves save slot if in `ServerCreationScreen`.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:OnDestroy()`
* **Description:** Cancels tasks and unloads mod prefabs on screen/widget destruction.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:OnBecomeActive()`
* **Description:** Starts workshop and order update tasks, refreshes filter state, and processes any queued dependency prompts.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:OnBecomeInactive()`
* **Description:** Saves profile data (e.g., favorites) on screen inactivation.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:ConfigureSelectedMod()`
* **Description:** Opens mod configuration screen for currently selected mod (if allowed).
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:UpdateSelectedMod()`
* **Description:** Triggers workshop update for currently selected mod.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:CleanAllButton()`
* **Description:** Shows confirmation dialog before cleaning all mods; unloads and resets mod system on confirm.
* **Parameters:** None.
* **Returns:** Nothing.

### `ModsTab:UpdateAllButton(force)`
* **Description:** Updates all outdated workshop mods; shows confirmation unless `force` is `true`.
* **Parameters:** `force` — if `true`, skips confirmation dialog.
* **Returns:** Nothing.

### `ModsTab:UpdateSaveSlot(slotnum)`
* **Description:** Updates `self.slotnum` to the provided save slot index.
* **Parameters:** `slotnum` — integer slot index.
* **Returns:** Nothing.

### `ModsTab:SetDataForSlot(slotnum)`
* **Description:** Loads enabled server mods for a save slot, sets up dependencies, and refreshes mod lists.
* **Parameters:** `slotnum` — integer slot index.
* **Returns:** Nothing.

### `ModsTab:GetNumberOfModsEnabled()`
* **Description:** Returns count of enabled server mods.
* **Parameters:** None.
* **Returns:** Integer count.

### `ModsTab:DoFocusHookups()`
* **Description:** Configures keyboard/controller focus navigation between UI elements.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
**Listens to:** None  
**Pushes:** None  
No events are directly listened to or pushed by this component.