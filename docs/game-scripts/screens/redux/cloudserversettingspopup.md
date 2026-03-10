---
id: cloudserversettingspopup
title: Cloudserversettingspopup
description: Manages the UI dialog for configuring settings for cloud server creation, including server name, description, password, privacy type, game mode, max players, and clan-specific options.
tags: [ui, server, cloud, settings, multiplayer]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 915e0ff4
system_scope: ui
---

# Cloudserversettingspopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CloudServerSettingsPopup` is a UI screen responsible for presenting and collecting configuration options required to spin up a cloud server. It enforces that cloud servers are non-PvP, dedicated, non-local, online, and multiplayer. The component provides text inputs, radio buttons, and spinners for fields like server name, description, password, privacy type, game mode, max players, and clan-specific settings (e.g., `clan_id`, `clan_only`). It validates user input before proceeding to `HostCloudServerPopup`, and supports dynamic UI updates (e.g., toggling clan controls based on selected privacy type or forcing certain settings via `forced_settings`).

## Usage example
```lua
local CloudServerSettingsPopup = require "screens/redux/cloudserversettingspopup"

TheFrontEnd:PushScreen(
    CloudServerSettingsPopup(
        previous_screen,      -- The screen to return to on cancel
        user_profile,         -- Optional: user profile for settings
        {                     -- Optional: forced settings (e.g., locked game mode)
            game_mode = "SURVIVAL",
            privacy_type = PRIVACY_TYPE.PUBLIC
        },
        function(server_settings) -- Optional dirty callback
            print("Server settings changed")
        end
    )
)
```

## Dependencies & tags
**Components used:** None (`inst.components.X` not used; this is a screen, not a component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forced_settings` | table | `{}` | Settings that are locked and not editable (e.g., `server_intention`, `game_mode`, `privacy_type`, `max_players`). |
| `dirty_cb` | function | `function() end` | Callback invoked when any setting is modified. |
| `dialog` | Widget (CurlyWindow) | — | Main container for the dialog UI. |
| `server_settings_page` | Widget | — | Container for scrollable list of settings widgets. |
| `scroll_list` | ScrollableList | — | Holds and orders UI fields vertically. |
| `server_intention` | LabelButton (optional) | `nil` | Button to select server intention (shown when not forced). |
| `server_name` | LabelTextbox | — | Input for server name (max `80` chars). |
| `server_desc` | LabelTextbox | — | Input for server description (max `254` chars). |
| `server_pw` | LabelTextbox | — | Input for server password (max `254` chars), masked by default. |
| `privacy_type` | Widget + RadioButtons (optional) | `nil` | Group with public/clan privacy options (clan not available on WIN32_RAIL). |
| `clan_id` | LabelTextbox | — | Input for clan ID (numeric, max `18` chars), only shown if privacy is CLAN. |
| `clan_only` | LabelSpinner | — | Toggle for "clan only" mode. |
| `game_mode` | LabelSpinner (optional) | `nil` | Dropdown to select game mode (if not forced). |
| `max_players` | LabelSpinner (optional) | `nil` | Spinner to set max players (2 to `TUNING.MAX_SERVER_SIZE`). |
| `intentions_overlay` | IntentionPicker | — | Picker widget for server intention, shown in place of scroll list when intention not set. |
| `newhost_overlay` | NewHostPicker | `nil` | Picker shown only once to help configure starting intention (e.g., "ALONE" defaults to cooperative). |

## Main functions
### `GetServerIntention()`
* **Description:** Returns the currently selected server intention (e.g., `"COOPERATIVE"`, `"SURVIVAL"`, `"SPOOKY"`), respecting `forced_settings`.
* **Parameters:** None.
* **Returns:** string or `nil` — The server intention constant, or `nil` if not set (and not forced).
* **Error states:** None.

### `GetServerName()`
* **Description:** Returns the current text in the server name field.
* **Parameters:** None.
* **Returns:** string — The entered server name.

### `GetServerDescription()`
* **Description:** Returns the current text in the server description field.
* **Parameters:** None.
* **Returns:** string — The entered server description.

### `GetPassword()`
* **Description:** Returns the current text in the server password field (raw string).
* **Parameters:** None.
* **Returns:** string — The entered password (or empty string if none).

### `GetGameMode()`
* **Description:** Returns the selected game mode, respecting `forced_settings`.
* **Parameters:** None.
* **Returns:** string — The game mode identifier (e.g., `"SURVIVAL"`).

### `GetMaxPlayers()`
* **Description:** Returns the selected max player count, respecting `forced_settings`.
* **Parameters:** None.
* **Returns:** number — The maximum number of players allowed.

### `GetPrivacyType()`
* **Description:** Returns the selected privacy type (`PRIVACY_TYPE.PUBLIC`, `.CLAN`, etc.).
* **Parameters:** None.
* **Returns:** string — The selected privacy type constant.

### `GetClanInfo()`
* **Description:** Returns an object containing clan-specific settings.
* **Parameters:** None.
* **Returns:** table with keys:
  * `id` (string): clan ID string.
  * `only` (boolean): whether the server is clan-only.
  * `admin` (boolean): always `false` (admin flag ignored for cloud servers).
* **Note:** Admin flag is commented out in source.

### `GetServerData()`
* **Description:** Aggregates all settings into a single data object ready for server creation.
* **Parameters:** None.
* **Returns:** table — Contains:
  * `intention`, `pvp` (always `false`), `game_mode`, `online_mode` (always `true`), `encode_user_path`, `use_legacy_session_path`, `max_players`, `name`, `password`, `description`, `privacy_type`, `clan`.
* **Note:** All values are concrete and validated.

### `ValidateSettings()`
* **Description:** Validates all user inputs. Displays error popups and returns `false` if any validation fails; otherwise returns `true`.
* **Parameters:** None.
* **Returns:** boolean — `true` if all settings are valid; `false` otherwise.
* **Error states:** May display one of four error popups for invalid intention, name, clan settings, or password (e.g., empty name, invalid clan ID, leading/trailing whitespace in password).

### `SetServerIntention(intention)`
* **Description:** Sets the server intention and updates the UI accordingly (e.g., shows/hides intention picker or scroll list).
* **Parameters:** `intention` (string or `nil`) — Intention constant (e.g., `"COOPERATIVE"`), or `nil` to clear.
* **Returns:** Nothing.
* **Error states:** Asserts if `forced_settings.server_intention` is set and differs from `intention`.

### `GetServerData()` (alias: `GetOnlineMode()`)
* **Description:** Returns `true` unconditionally (cloud servers are always online).
* **Parameters:** None.
* **Returns:** boolean — Always `true`.

### `GetEncodeUserPath()` / `GetUseClusterPath()` / `GetUseLegacySessionPath()`
* **Description:** Return path configuration flags for session save data.
* **Parameters:** None.
* **Returns:** boolean — `true`, `not use_legacy_session_path`, or `use_legacy_session_path`, respectively. All set to defaults (`true`, `true`, `nil` in constructor), not modifiable via UI.

### `OnBecomeActive()`
* **Description:** Called when this screen becomes active. Shows the dialog and focuses on the first text input if available.
* **Parameters:** None.
* **Returns:** Nothing.

### `DisplayClanControls(show)`
* **Description:** Shows or hides clan-specific fields (`clan_id`, `clan_only`) depending on selected privacy type.
* **Parameters:** `show` (boolean) — `true` to show (if privacy is `CLAN`), `false` to hide.
* **Returns:** Nothing.
* **Side effects:** Resizes dialog and scroll list, adjusts widget parents to ensure proper focus and layout.

### `UpdateDetails()`
* **Description:** Resets all fields to default values (e.g., from `TheNet`, `TUNING`, `ModManager`), clearing any user input.
* **Parameters:** None.
* **Returns:** Nothing.
* **Side effects:** Sets `max_players` to `TUNING.MAX_SERVER_SIZE`, server name using local username, clears password/description, sets privacy to `PUBLIC`, and resets intention to `nil`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).