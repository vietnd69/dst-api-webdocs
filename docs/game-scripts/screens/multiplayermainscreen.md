---
id: multiplayermainscreen
title: MultiplayerMainScreen
description: Manages the multiplayer main menu UI, including server browsing, character puppets, and navigation to sub-screens like options and skins.
tags: [ui, network, screen, player]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: e1148c94
system_scope: ui
---

# MultiplayerMainScreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MultiplayerMainScreen` renders the primary multiplayer menu interface in Don't Starve Together. It handles UI layout for character animating puppets, dynamic Message of the Day (MOTD) display, countdown timers for updates, and navigation to sub-screens (e.g., server creation, skins, options). It inherits from `Screen` and integrates with profile management, network operations, and event systems to coordinate frontend flow and state transitions.

## Usage example
The component is instantiated internally by `TheFrontEnd` and not created manually by mods. A typical usage flow in the game lifecycle is:
```lua
-- Internally invoked when entering multiplayer main menu
TheFrontEnd:PushScreen(MultiplayerMainScreen(prev_screen, profile, offline, session_data))
```

## Dependencies & tags
**Components used:** None (UI screen, not an ECS component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | table | — | Player profile instance, used for saved settings and loadouts. |
| `offline` | boolean | `false` | Whether the session is in offline mode. |
| `session_data` | table | `nil` | Session metadata passed from previous screen. |
| `prev_screen` | Screen | `nil` | The screen navigated from, used for portal ownership transfer. |
| `menu` | Menu | `nil` | Main menu widget (e.g., Browse, Create, Options). |
| `submenu` | Menu | `nil` | Submenu widget (e.g., Credits, Movie, Forums). |
| `debug_menu` | Menu | `nil` | Optional debug menu shown in dev builds. |
| `motd` | Widget | `nil` | Message of the Day display container. |
| `puppets` | table | `{}` | List of `SkinsAndEquipmentPuppet` instances for animated characters. |
| `countdown` | Countdown | — | Countdown widget for update releases. |
| `updatename` | Text | — | Text widget displaying the current game version. |

## Main functions
### `MultiplayerMainScreen:DoInit()`
*   **Description:** Initializes the screen layout, populates UI elements (MOTD, puppets, menus, countdown), and sets up focus navigation. Called during construction.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnShow()`
*   **Description:** Triggered when the screen becomes visible. Starts character puppet animations, snowfall effects, and per-character idle animations (`perds`). Ensures puppets are updated before display.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnHide()`
*   **Description:** Triggered when the screen is hidden. Stops puppet animations and idle effects, resets fade handling, and cleans up. Required for proper lifecycle.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnCreateServerButton()`
*   **Description:** Initiates server creation flow: saves profile, fades out, and pushes `ServerCreationScreen`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnBrowseServersButton()`
*   **Description:** Initiates server listing flow: saves filter settings, fades out, and pushes `ServerListingScreen`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnQuickJoinServersButton()`
*   **Description:** Initiates quick join flow by pushing `QuickJoinScreen` with default or filtered server search.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if new-user popup is triggered.

### `MultiplayerMainScreen:OnHistoryButton()`
*   **Description:** Navigates to `MorgueScreen` to view player history/deaths.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnSkinsButton()`
*   **Description:** Navigates to `SkinsScreen` for skin management.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnMovieButton()`
*   **Description:** Shows the intro movie (`movies/intro.ogv`) via `MovieDialog` and restores music/portal SFX upon completion.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnCreditsButton()`
*   **Description:** Shows the `CreditsScreen`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnModsButton()`
*   **Description:** Shows the `ModsScreen` for managing active mods.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnHostButton()`
*   **Description:** Attempts to start a local server in offline mode, loads the current save slot, and starts the instance.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnJoinButton()`
*   **Description:** Attempts to join the default server (`DEFAULT_JOIN_IP`) in offline mode.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:SetMOTD(motd_str, cache)`
*   **Description:** Parses and applies the Message of the Day (MOTD) JSON. Updates title, text, image, and button behavior. Caching handled via `cache` flag.
*   **Parameters:** `motd_str` (string) — JSON-encoded MOTD payload; `cache` (boolean) — whether to persist to disk.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if JSON parsing fails.

### `MultiplayerMainScreen:UpdateMOTD()`
*   **Description:** Loads cached MOTD and refreshes from the server. Calls `SetMOTD` for display logic.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:OnBecomeActive()`
*   **Description:** Handles screen activation. Restores focus, re-enables debug menu (if present), and starts workshop query if online.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:FinishedFadeIn()`
*   **Description:** Executes post-fade-in tasks: shows entitlement thank-you popup, and triggers language mod popup if needed.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `MultiplayerMainScreen:CheckNewUser(onnofn, no_button_text)`
*   **Description:** Checks if the new-user popup has been shown. If not, pushes a popup and handles navigation choices.
*   **Parameters:** `onnofn` (function) — callback when "No" is selected; `no_button_text` (string) — label for "No" button.
*   **Returns:** `true` if popup was shown, otherwise `false`.
*   **Error states:** Returns `false` if popup already shown.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are present; the class is screen-scoped, not entity-scoped).
- **Pushes:** None explicitly (`Stats.PushMetricsEvent` is called internally but is not an `inst:PushEvent` call).