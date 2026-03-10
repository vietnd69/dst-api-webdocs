---
id: servercreationscreen
title: Servercreationscreen
description: Manages the server creation and configuration UI, including save slot selection, tab navigation, game mode/world settings input, mod management, and server launch.
tags: [ui, networking, worldgen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: dfeda866
system_scope: ui
---

# Servercreationscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ServerCreationScreen` is a UI screen that provides the full interface for configuring and launching a new or resumed server in Don't Starve Together. It handles save slot selection, settings (name, privacy, game mode, max players), world customization (seasons, biome weights), mod enabling/disabling, snapshot management, and ban list configuration. It orchestrates tab switching, focus management, input handling (keyboard/controller), and triggers the server startup sequence via `TheNet` and `TheSystemService` after validation.

## Usage example
```lua
-- This screen is instantiated by the frontend framework during navigation.
-- Example of manual activation (not typical for normal mod usage):
TheFrontEnd:PushScreen(ServerCreationScreen(prev_screen))
```

## Dependencies & tags
**Components used:** None (UI-only screen, does not attach components to entities)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prev_screen` | screen reference | `nil` | The screen that spawned this one; used for portal ownership transfer and cancellation. |
| `dirty` | boolean | `false` | Indicates whether any settings have been modified since the last save/load. |
| `saveslot` | number | `-1` | Currently selected save slot index. |
| `slot_character_cache`, `slot_day_cache` | table | `{}` | Caches for save slot avatar and day/season info to avoid repeated I/O. |
| `server_settings_tab`, `world_tab`, `mods_tab`, `snapshot_tab`, `bans_tab` | widgets | `nil` | Tab instances hosting the respective configuration UI sections. |
| `save_slots` | widget array | `nil` | Array of navigation buttons representing each save slot. |
| `active_tab` | string | `nil` | Name of the currently visible tab (`"settings"`, `"world"`, `"mods"`, `"snapshot"`, `"bans"`). |

## Main functions
### `UpdateTitle(slotnum, fromTextEntered)`
* **Description:** Updates the portrait, server name, and day/season display in the title area for the specified save slot. Reads persistent world data to determine the current day and season.
* **Parameters:** 
  * `slotnum` (number) - The save slot index to update.
  * `fromTextEntered` (boolean) - If true, skips portrait updates (e.g., when only editing the server name).
* **Returns:** Nothing.
* **Error states:** If world data cannot be read, defaults to `"Server Day 1"`.

### `UpdateTabs(slotnum, prevslot, fromDelete)`
* **Description:** Syncs all tabs with the newly selected save slot. Saves state from the previous slot before loading data for the new one.
* **Parameters:** 
  * `slotnum` (number) - New save slot index.
  * `prevslot` (number) - Previous save slot index (can be `nil`).
  * `fromDelete` (boolean) - True if this update is triggered by a delete operation.
* **Returns:** Nothing.

### `Create(warnedOffline, warnedDisabledMods, warnedOutOfDateMods)`
* **Description:** Validates and begins the server launch process. Performs multiple safety checks (offline mode, disabled mods, outdated mods) and shows modal warnings before proceeding.
* **Parameters:** 
  * `warnedOffline`, `warnedDisabledMods`, `warnedOutOfDateMods` (boolean) - Internal flags to skip repeated warnings in recursive calls.
* **Returns:** Nothing.
* **Error states:** If no empty slot is available when needed, displays a full-slot dialog and returns early.

### `ValidateSettings()`
* **Description:** Validates all configuration fields across tabs. Checks server name, game mode, intention, clan settings, and season durations.
* **Parameters:** None.
* **Returns:** `true` if all settings are valid; `false` otherwise (and displays an inline error dialog).
* **Error states:** Displays specific error dialogs for invalid fields and leaves focus on the problematic tab.

### `DeleteSlot(slot, cb)`
* **Description:** Prompts for confirmation before deleting the specified save slot and its data.
* **Parameters:** 
  * `slot` (number) - The save slot index to delete.
  * `cb` (function) - Optional callback after deletion completes.
* **Returns:** Nothing.

### `Cancel()`
* **Description:** Handles screen exit on Cancel input. If `dirty` is `true`, prompts to confirm discarding changes.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTab(tabName, direction)`
* **Description:** Switches the active configuration tab. Supports both named switching and directional navigation (`direction` is `1` for right, `-1` for left).
* **Parameters:** 
  * `tabName` (string) - One of `"settings"`, `"world"`, `"mods"`, `"snapshot"`, `"bans"`.
  * `direction` (number) - `1` (next tab) or `-1` (previous tab).
* **Returns:** Nothing.

### `OnClickSlot(slotnum, goToSettings)`
* **Description:** Activates a save slot (via navigation buttons). Updates the current `saveslot`, refreshes UI state in all tabs, and optionally sets the active tab to `"settings"`.
* **Parameters:** 
  * `slotnum` (number) - The save slot index to select.
  * `goToSettings` (boolean) - If true, switches to the settings tab after selection.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles controller input shortcuts: `CANCEL` to go back, `MENU_BACK` to delete (if slot exists), `MENU_START` to create/resume, `L2`/`R2` to change tabs.
* **Parameters:** 
  * `control` (control enum) - The input control pressed.
  * `down` (boolean) - `true` if the control was pressed; `false` on release.
* **Returns:** `true` if the control was handled; `false` otherwise.

### `GetGameMode()`
* **Description:** Returns the currently selected game mode from the settings tab.
* **Parameters:** None.
* **Returns:** (string) One of the `GAME_MODE_*` constants.

### `GetHelpText()`
* **Description:** Constructs a localized string of controller button hints for the current screen context.
* **Parameters:** None.
* **Returns:** (string) Concatenated button descriptions.

## Events & listeners
- **Listens to:** None (UI screen does not register entity events).
- **Pushes:** None (does not fire custom events; relies on frontend navigation).