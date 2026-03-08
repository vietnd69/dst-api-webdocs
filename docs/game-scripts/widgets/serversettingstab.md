---
id: serversettingstab
title: Serversettingstab
description: Manages the server configuration UI tab for creating and editing dedicated servers in Don't Starve Together.
tags: [ui, server, settings]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 2ad9567f
system_scope: ui
---

# Serversettingstab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Serversettingstab` is a UI widget that presents and manages the input fields and controls for configuring server settings (e.g., name, description, password, game mode, max players, PvP, privacy, clan options). It is part of the server creation screen and integrates tightly with the `ServerCreationScreen` and various helper widgets (textboxes, spinners, radiobuttons). It handles loading existing server data, validating user input, and exposing server configuration data for saving or launching.

## Usage example
```lua
-- This widget is instantiated internally by the ServerCreationScreen and is not added manually.
-- Example of retrieving server data after configuration:
local slotdata = serversettingstab:GetServerData()
print(slotdata.name, slotdata.game_mode, slotdata.max_players)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not use `inst:AddTag`, `inst:RemoveTag`, or `inst:HasTag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `slotdata` | table | `{}` | Stores per-slot server configuration data. |
| `servercreationscreen` | ServerCreationScreen instance | `nil` | Reference to the parent screen that manages this tab. |
| `encode_user_path` | boolean | `true` | Internal flag indicating whether to encode user paths. |
| `page_widgets` | array of widgets | — | List of core UI controls (e.g., name, desc, game mode). |
| `clan_widgets` | array of widgets | — | Clan-specific controls, conditionally displayed. |

## Main functions
### `GetServerData()`
* **Description:** Aggregates and returns all current server configuration values as a table. Used when saving or launching the server.
* **Parameters:** None.
* **Returns:** table — A structured table containing: `intention`, `pvp`, `game_mode`, `online_mode`, `encode_user_path`, `use_cluster_path`, `max_players`, `name`, `password`, `description`, `privacy_type`, `clan`.
* **Error states:** None.

### `SetServerIntention(intention)`
* **Description:** Sets the server intention (e.g., cooperative, exploration) and updates UI state, including toggling between the intention overlay and `NewHostPicker` if needed.
* **Parameters:** `intention` (string or `nil`) — Intention key or `nil` to reset.
* **Returns:** Nothing.

### `UpdateDetails(slotnum, prevslot, fromDelete)`
* **Description:** Loads server settings from saved slot data or initializes defaults for a new slot. Handles both existing and empty slots.
* **Parameters:**  
  - `slotnum` (number) — Target slot index.  
  - `prevslot` (number, optional) — Previous slot for cloning data.  
  - `fromDelete` (boolean) — Whether this update follows slot deletion.
* **Returns:** Nothing.

### `RefreshPrivacyButtons()`
* **Description:** Updates privacy button availability based on online mode and max players (e.g., disables non-local privacy for solo servers).
* **Parameters:** None.
* **Returns:** Nothing.

### `VerifyValidServerName()`
* **Description:** Validates that the server name field is not empty.
* **Parameters:** None.
* **Returns:** boolean — `true` if name is non-empty.

### `VerifyValidServerIntention()`
* **Description:** Validates that a server intention has been selected.
* **Parameters:** None.
* **Returns:** boolean — `true` if intention is set.

### `GetServerIntention()`, `GetServerName()`, `GetServerDescription()`, `GetPassword()`, `GetGameMode()`, `GetMaxPlayers()`, `GetPVP()`, `GetPrivacyType()`, `GetClanInfo()`, `GetOnlineMode()`, `GetEncodeUserPath()`
* **Description:** Individual getters to retrieve the current value of a specific server setting.
* **Parameters:** None.
* **Returns:** Type depends on the getter — typically string, boolean, number, or table (e.g., `GetClanInfo()` returns `{id, only, admin}`).
* **Error states:** None.

### `DisplayClanControls(show)`
* **Description:** Shows or hides clan-specific controls (`clan_id`, `clan_only`, `clan_admins`) in the scroll list.
* **Parameters:** `show` (boolean) — Whether to show clan controls.
* **Returns:** Nothing.

### `SetEditingTextboxes(edit)`
* **Description:** Forces all text-based input fields into or out of editing mode (controls focus behavior).
* **Parameters:** `edit` (boolean) — `true` to enter editing mode, `false` to exit.
* **Returns:** Nothing.

## Events & listeners
This component does not register or fire events directly; it operates through callbacks (e.g., `OnTextInputted`, `SetOnChangedFn`) defined on its child widgets, which notify `servercreationscreen:MakeDirty()` to signal state changes.