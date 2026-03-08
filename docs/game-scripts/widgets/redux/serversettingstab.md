---
id: serversettingstab
title: Serversettingstab
description: Manages the server configuration UI tab in the server creation screen, including server name, description, password, privacy, game mode, player count, and related settings.
tags: [ui, server, configuration]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6139deb2
system_scope: ui
---

# Serversettingstab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ServerSettingsTab` is a UI widget component responsible for rendering and managing all interactive controls in the server creation screen’s settings tab. It handles input for server name, description, password, privacy mode (Public/Friends/Local/Clan), game mode selection, maximum players, PvP status, save type, and clan-specific settings. It integrates with the `ServerSaveSlot` widget to persist settings and communicates state changes to the parent `servercreationscreen`. All settings are collected via `GetServerData()` and are ultimately used when creating or editing a server profile.

## Usage example
```lua
local ServerSettingsTab = require "widgets/redux/serversettingstab"
local tab = ServerSettingsTab(servercreationscreen_instance)
tab:SetDataForSlot(slot_index) -- Load settings from a specific slot
-- The widget automatically populates all fields and displays controls
-- Get current settings:
local data = tab:GetServerData()
```

## Dependencies & tags
**Components used:** None identified (this is a pure UI widget, no ECS components are accessed).  
**Tags:** Adds no entity tags; purely visual/state-driven.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `servercreationscreen` | table (reference) | `nil` | Parent screen that owns this tab; used to trigger dirty state and mode changes. |
| `slot` | number | `-1` | Index of the save slot currently being edited; used for data persistence. |
| `playstyle` | string/number | `PLAYSTYLE_DEFAULT` | The selected playstyle for the server (e.g., sandbox, challenge). |
| `encode_user_path` | boolean | `true` | Whether user-specific path encoding is enabled (internal use). |
| `use_legacy_session_path` | boolean | `false` | Whether legacy session path handling is used (internal use). |
| `_cached_privacy_setting` | number (PRIVACY_TYPE) | `nil` | Cached privacy type when temporarily overridden (e.g., during 1-player forcing). |
| `newhost_overlay` | NewHostPicker widget | `nil` | Temporary overlay displayed on first server creation. |

## Main functions
### `SetDataForSlot(slot)`
*   **Description:** Loads server settings from the specified save slot. If the slot is empty or new, initializes defaults; if populated, loads existing values. Also triggers the new-host picker on first run.
*   **Parameters:** `slot` (number) - The save slot index (`>= -1`). Negative values indicate a new slot.
*   **Returns:** Nothing.
*   **Error states:** If `slot` is invalid or save data is corrupted, only partial or default values are applied.

### `GetServerData()`
*   **Description:** Aggregates all current UI state into a single server configuration table suitable for saving or network use.
*   **Parameters:** None.
*   **Returns:** Table containing: `playstyle`, `pvp`, `game_mode`, `online_mode`, `encode_user_path`, `use_legacy_session_path`, `max_players`, `name`, `password`, `description`, `privacy_type`, and nested `clan` data (if applicable).

### `UpdateSlot()`
*   **Description:** Updates the attached `ServerSaveSlot` widget with current data without writing to disk (cheap operation).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateSaveSlot(slot)`
*   **Description:** Sets the active `slot` index for future operations (e.g., saving or updating).
*   **Parameters:** `slot` (number) - The new save slot index.
*   **Returns:** Nothing.

### `SetPlaystyle(playstyle)`
*   **Description:** Sets the `playstyle` property and triggers `UpdateSlot()` to reflect changes in the save slot preview.
*   **Parameters:** `playstyle` (string or number) - The playstyle identifier.
*   **Returns:** Nothing.

### `RefreshPrivacyButtons()`
*   **Description:** Enables/disables privacy options based on `online_mode` and `max_players`. When only one player is allowed, only LOCAL privacy is available.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisplayClanControls(show)`
*   **Description:** Shows or hides clan-specific fields (`clan_id`, `clan_only`, `clan_admins`) and updates their widget hierarchy between parent and scroll list.
*   **Parameters:** `show` (boolean) - Whether to display the clan controls.
*   **Returns:** Nothing.

### `SetOnlineWidgets(online)`
*   **Description:** Updates the `online_mode` spinner and refreshes privacy button availability.
*   **Parameters:** `online` (boolean) - Desired online mode value. If `nil`, sets current spinner value.
*   **Returns:** Nothing.

### `UpdateSaveType(is_cloud_save)`
*   **Description:** Updates the save type spinner and syncs the `ServerSaveSlot` to a new slot if save type changes.
*   **Parameters:** `is_cloud_save` (boolean) - Whether cloud saves are enabled.
*   **Returns:** Nothing.

### `SetCanEditSaveTypeWidgets(can_edit)`
*   **Description:** Enables or disables the save type spinner.
*   **Parameters:** `can_edit` (boolean) - Whether editing should be enabled.
*   **Returns:** Nothing.

### `SetSaveTypeWidgets(is_cloud_save)`
*   **Description:** Directly sets the selected value of the save type spinner without side effects.
*   **Parameters:** `is_cloud_save` (boolean) - Selected save type.
*   **Returns:** Nothing.

### `ShowNewHostPicker()`
*   **Description:** Shows an overlay the first time a user creates a server, prompting selection of Solo/Co-op. After selection, configures `max_players` and `privacy` accordingly.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `VerifyValidClanSettings()`
*   **Description:** Validates clan ID when privacy is set to CLAN.
*   **Parameters:** None.
*   **Returns:** `true` if clan ID is valid or not applicable; `false` otherwise.

### `VerifyValidServerName()`
*   **Description:** Ensures the server name is non-empty.
*   **Parameters:** None.
*   **Returns:** `true` if server name is non-empty; `false` otherwise.

### `VerifyValidNewHostType()`
*   **Description:** Confirms the user has completed the new-host picker flow.
*   **Parameters:** None.
*   **Returns:** `true` if picker has been shown; `false` otherwise.

### `VerifyValidPassword()`
*   **Description:** Checks that password is either empty or contains no leading/trailing whitespace.
*   **Parameters:** None.
*   **Returns:** `true` if password is valid; `false` otherwise.

### `SetEditingTextboxes(edit)`
*   **Description:** Programmatically sets whether all textboxes (`server_name`, `server_pw`, `server_desc`, `clan_id`) are in editing mode.
*   **Parameters:** `edit` (boolean) - `true` to enter editing mode, `false` to exit.
*   **Returns:** Nothing.

### Getters
| Function | Returns |
|----------|---------|
| `GetServerName()` | string |
| `GetServerDescription()` | string |
| `GetPassword()` | string |
| `GetGameMode()` | string/number (game mode ID) |
| `GetPlaystyle()` | string/number (playstyle ID) |
| `GetMaxPlayers()` | number |
| `GetPVP()` | boolean |
| `GetPrivacyType()` | number (PRIVACY_TYPE constant) |
| `GetClanInfo()` | table `{ id = string, only = boolean, admin = boolean }` |
| `GetOnlineMode()` | boolean |
| `GetEncodeUserPath()` | boolean |
| `GetUseLegacySessionPath()` | boolean |
| `GetUseClusterPath()` | boolean (inverse of `use_legacy_session_path`) |

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent()` calls found).
- **Pushes:** None identified (no `inst:PushEvent()` calls found).  
*(This component communicates changes via parent callback `servercreationscreen:MakeDirty()` rather than events.)*