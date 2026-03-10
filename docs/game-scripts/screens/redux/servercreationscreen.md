---
id: servercreationscreen
title: Servercreationscreen
description: Manages the UI for creating and configuring dedicated or hosted multiplayer servers in Don't Starve Together.
tags: [ui, network, server, worldgen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: fda72b13
system_scope: ui
---

# Servercreationscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`ServerCreationScreen` is the primary UI screen for hosting or resuming a multiplayer server. It aggregates configuration tabs for server settings, world generation, mods, and snapshots, collects user input, validates settings, and initiates server startup via `TheSystemService:StartDedicatedServers`. It manages tab navigation, save-slot data persistence, and mod-related workflows (including update and dependency warnings). It is constructed with a reference to the previous screen and a save slot index.

## Usage example
This component is instantiated internally by the game engine and is not added to entities. Usage occurs through screen transitions:
```lua
-- Start the server creation screen for a given save slot
TheFrontEnd:PushScreen(ServerCreationScreen(prev_screen, save_slot))
```

## Dependencies & tags
**Components used:** None (this is a `Screen`, not a component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `server_slot_screen` | Screen | `nil` | Reference to the screen that launched this screen (typically a save slot menu). |
| `save_slot` | number | `0` | The save slot index (negative = temporary/autosave; positive = user slot; negative beyond `CLOUD_SAVES_SAVE_OFFSET` = cloud save). |
| `current_level_locations` | table | `SERVER_LEVEL_LOCATIONS` | Array of world location identifiers (e.g., `{"FOREST", "CAVES"}`). |
| `default_world_location` | string | First entry in `SERVER_LEVEL_LOCATIONS` | Default location for primary world tab. |
| `mods_enabled` | boolean | `not IsConsole()` | Whether mod configuration is available (disabled on console platforms). |
| `dirty` | boolean | `false` | Indicates unsaved changes. |
| `kit_puppet` | KitcoonPuppet | Created | Visual puppet displayed in the UI. |
| `world_tabs` | table | `{}` | Indexed list of `WorldSettingsTab` instances (one per world location). |
| `server_settings_tab` | ServerSettingsTab | Created | Tab for server name, mode, privacy, players, etc. |
| `mods_tab` | ModsTab | Created (if enabled) | Tab for mod management. |
| `snapshot_tab` | SnapshotTab | Created | Tab for loading snapshot data. |
| `tabscreener` | Subscreener | Created | Manages tab navigation and sub-screen switching. |

## Main functions
### `Create(warnedOffline, warnedDisabledMods, warnedOutOfDateMods)`
* **Description:** Initiates server creation after validation and conditional warnings (offline mode, disabled/out-of-date mods). Collects world and server options, saves mod configuration, and calls `TheSystemService:StartDedicatedServers`. Handles popups for warnings and redirects to launch UI if needed.
* **Parameters:**
  * `warnedOffline` (boolean or `nil`) – If `true`, skips offline mode warning popup.
  * `warnedDisabledMods` (boolean or `nil`) – If `true`, skips disabled-mods warning popup.
  * `warnedOutOfDateMods` (boolean or `nil`) – If `true`, skips out-of-date-mods warning popup.
* **Returns:** Nothing (async flow via callbacks/popups).
* **Error states:** Returns early if `ValidateSettings()` fails. Does not create server if any warning popup is shown.

### `ValidateSettings()`
* **Description:** Validates server configuration: host type, server name, clan settings, password, and season duration consistency across world tabs. Displays popup errors for invalid data and focuses the corresponding tab.
* **Parameters:** None.
* **Returns:** `true` if all settings are valid; otherwise `false`.
* **Error states:** Shows specific `PopupDialogScreen` messages for invalid fields and returns `false`.

### `SetDataOnTabs()`
* **Description:** Populates all tabs (server settings, world, mods, snapshot) with data from the current save slot.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdateSaveSlot(new_save_slot)`
* **Description:** Updates the active save slot and propagates the change to all tabs to reload slot-specific data.
* **Parameters:** `new_save_slot` (number) – New slot index.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when the screen becomes active. Enables subcomponents (mods tab, kitcoon puppet) and restores last focus.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Called when the screen becomes inactive. Disables subcomponents.
* **Parameters:** None.
* **Returns:** Nothing.

### `Cancel()`
* **Description:** Handles exiting the screen. Prompts to save, discard, or cancel if changes are dirty; otherwise fades out and pops the screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `SaveChanges()`
* **Description:** Persists dirty changes (server data, world options, enabled mods) to the current save slot and clears the dirty flag.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if the screen is clean or the slot is empty.

### `SetTab(tabName, direction)`
* **Description:** Switches the active tab, either by name or relative direction (`-1`/`1` for left/right).
* **Parameters:**
  * `tabName` (string or `nil`) – Tab key (e.g., `"settings"`, `"mods"`, `"FOREST"`).
  * `direction` (number or `nil`) – Relative direction (`-1` = previous, `1` = next).
* **Returns:** Nothing.

### `GetGameMode()`
* **Description:** Returns the currently selected game mode from `server_settings_tab`.
* **Parameters:** None.
* **Returns:** (string) Game mode identifier (e.g., `"SURVIVAL"`, `"SURVIVAL_CLASSIC"`).

### `GetContentHeight()`
* **Description:** Returns the fixed height of the main dialog panel.
* **Parameters:** None.
* **Returns:** (number) `dialog_size_y` (`570`).

### `CanResume()`
* **Description:** Determines if the current save slot contains existing game data.
* **Parameters:** None.
* **Returns:** (boolean) `true` if the slot is not empty.

### `OnControl(control, down)`
* **Description:** Handles controller input: `CONTROL_CANCEL` for cancel, `CONTROL_MENU_START` for create/resume, `L2`/`R2` for tab navigation.
* **Parameters:**
  * `control` (string) – Control constant (e.g., `CONTROL_CANCEL`, `CONTROL_MENU_START`).
  * `down` (boolean) – Whether the control is pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; otherwise `false`.

## Events & listeners
**Listens to:** None identified (no `inst:ListenForEvent` calls in source).  
**Pushes:** None identified (no `inst:PushEvent` calls in source).