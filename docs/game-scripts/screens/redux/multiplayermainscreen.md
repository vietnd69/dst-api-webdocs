---
id: multiplayermainscreen
title: Multiplayermainscreen
description: Manages the main multiplayer screen UI, including menu navigation, banner rendering, screen transitions, and event-specific content.
tags: [ui, frontend, screen, navigation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 86065330
system_scope: ui
---

# Multiplayermainscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`MultiplayerMainScreen` is a UI screen component that serves as the central hub for multiplayer actions in Don't Starve Together. It provides menus for browsing servers, creating/hosting games, accessing player summaries, options, mods, and special event screens. It also handles dynamic banner rendering based on game state (e.g., special events, beta builds), snowfall effects, and entitlement item popups. It inherits from `Screen` and integrates deeply with frontend systems like profile management, networking, inventory, and front-end audio/video.

## Usage example
This component is instantiated internally by the frontend and not directly instantiated by mods. It is typically used as part of the screen stack via `TheFrontEnd:PushScreen(MultiplayerMainScreen(...))`. Mods may override or extend behavior via hooks or by creating screens that interact with its public methods.

```lua
-- Not a typical usage for mods; the screen is created internally as:
-- TheFrontEnd:PushScreen(MultiplayerMainScreen(prev_screen, profile, offline, session_data))
-- where:
--   prev_screen = the screen that invoked this one (e.g., login or options)
--   profile = the local player's Profile component
--   offline = boolean indicating offline mode
--   session_data = session metadata table
```

## Dependencies & tags
**Components used:** `Profile`, `TheInventory`, `TheNet`, `TheFrontEnd`, `TheGenericKV`, `TheSim`, `ShardSaveGameIndex`, `KnownModIndex`, `TheItems`, `TheInput`, `TheStats`, `TheAnimList`, `TheStats`, `PostProcessor`, `FriendsManager`, `OnlineStatus`, `KitcoonPuppet`, `MainMenuMotdPanel`, `MainMenuStatsPanel`, `ItemBoxOpenerPopup`, `ThankYouPopup`, `SkinGifts`, `Stats`

**Widgets/widgets used (via require):** `Screen`, `AnimButton`, `ImageButton`, `Menu`, `Text`, `Image`, `UIAnim`, `Widget`, `PopupDialogScreen`, `FestivalEventScreen`, `ModsScreen`, `OptionsScreen`, `CompendiumScreen`, `PlayerSummaryScreen`, `QuickJoinScreen`, `ServerListingScreen`, `ServerSlotScreen`, `PurchasePackScreen`, `KitcoonPuppet`

**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `profile` | `Profile` | `nil` | Player profile used for saved filters, user data, and account info. |
| `offline` | boolean | `nil` | Indicates whether the session is in offline mode. |
| `session_data` | table | `nil` | Session metadata passed from prior screen. |
| `prev_screen` | `Screen` | `nil` | Reference to the screen that launched this one. |
| `menu_root` | `Widget` | `nil` | Root widget containing the main menu. |
| `menu` | `Menu` | `nil` | Main menu widget for primary actions. |
| `submenu` | `Menu` | `nil` | Secondary menu with utility actions (e.g., open save folder, profile). |
| `motd_panel` | `Widget` / `nil` | `nil` | Panel used for MOTD or stats; may be `MainMenuMotdPanel` or `MainMenuStatsPanel`. |
| `userprogress` | `Widget` / `nil` | `nil` | Progress display shown during festivals. |
| `banner_root` | `Widget` | `nil` | Container for dynamic banner visuals. |
| `build_number` | `Text` | `nil` | Text widget displaying the current build number. |
| `logo` | `Image` | `nil` | Logo image widget (title art). |
| `kit_puppet` | `KitcoonPuppet` | `nil` | Animated Kitcoon puppet displayed in UI. |
| `snowfall` / `banner_snowfall` | `Widget` / `nil` | `nil` | Snowfall effect widgets (event-specific). |
| `leaving` | boolean / `nil` | `nil` | Flag indicating screen is transitioning out. |
| `last_focus_widget` | `Widget` / `nil` | `nil` | Last focused widget before leaving screen. |
| `filter_settings` | table / `nil` | `nil` | Saved filter settings used for server listings. |
| `musicstopped` | boolean | `false` | Tracks whether music is stopped. |
| `musictask` | `PeriodicTask` / `nil` | `nil` | Task responsible for restarting music after fade. |
| `bannersoundsenabled` | boolean | `false` | Whether banner-related sounds are active. |
| `shown` | boolean | `false` | Whether the screen has been shown at least once. |
| `entitlements_checked` | boolean | `false` | Whether entitlement items have been checked and displayed. |
| `debug_menu` | `Menu` / `nil` | `nil` | Optional menu for dev builds (debug-only). |

## Main functions
### `MakeBanner(self)`
* **Description:** Renders and returns a dynamic banner widget based on the current game state (e.g., special events, beta, or default). This is the primary banner for the main menu.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** `Widget` — the banner container with UIAnim and optional overlay text.
* **Error states:** Returns `nil` if banner creation fails; in practice, always returns a widget.

### `MakeBannerFront(self)`
* **Description:** Renders optional foreground banner elements (e.g., overlays) drawn on top of MOTD panels. Currently disabled for most cases — returns `nil`.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** `Widget` / `nil` — always `nil` in the current build.

### `GotoShop(self, filter_info)`
* **Description:** Navigates to the `PurchasePackScreen` (skin shop) if online mode is available; otherwise, shows an offline mode popup.
* **Parameters:** `filter_info` (table) — optional shop filter data (e.g., category).
* **Returns:** Nothing.

### `getStatsPanel(self)`
* **Description:** Returns a `MainMenuStatsPanel` instance, configured with a shop callback that opens the store (with offline fallback).
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** `MainMenuStatsPanel`.

### `DoInit(self)`
* **Description:** Initializes the screen UI: builds layout (sidebar, banner, logo, menus), snowfall, MOTD/stats panel, Kitcoon puppet, and sets up focus hookups. Called once in the constructor.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `DoFocusHookups(self)`
* **Description:** Configures focus navigation between main menu, sub-menu, MOTD panel, and debug menu (if present).
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnShow(self)`
* **Description:** Activated when the screen becomes visible. Starts snowfall, banner sounds, and disables pause file check. Automatically calls `Show()` internally.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnHide(self)`
* **Description:** Activated when the screen becomes hidden. Stops snowfall and banner sounds.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnDestroy(self)`
* **Description:** Cleanup called when screen is destroyed. Invokes `OnHide` then calls parent `OnDestroy`.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `EnableBannerSounds(self, enable)`
* **Description:** Enables or disables banner-specific sound effects.
* **Parameters:** `enable` (boolean) — whether to enable banner sounds.
* **Returns:** Nothing.

### `StopMusic(self)`
* **Description:** Stops the frontend music (`FEMusic`) and cancels any pending music restart task.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `StartMusic(self)`
* **Description:** Starts or schedules resumption of frontend music (`FEMusic`) after fading out during transitions.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnFestivalEventButton(self)`
* **Description:** Handles navigation to the active festival event screen, including offline mode popups and mod conflict warnings.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnCreateServerButton(self)`
* **Description:** Navigates to `ServerSlotScreen` for creating a new server game.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnBrowseServersButton(self)`
* **Description:** Navigates to `ServerListingScreen`, applying saved filters and offline mode settings.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnPlayerSummaryButton(self)`
* **Description:** Navigates to `PlayerSummaryScreen`, showing player stats and progress; opens shop popup if offline.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnCompendiumButton(self)`
* **Description:** Navigates to `CompendiumScreen`.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnQuickJoinServersButton(self)`
* **Description:** Shows the `QuickJoinScreen` popup (if enabled and no festival active).
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `Settings(self, default_section)`
* **Description:** Opens `OptionsScreen` with an optional default section (e.g., `"CONTROLSCHEME"`).
* **Parameters:** `default_section` (string) — optional section name.
* **Returns:** Nothing.

### `OnModsButton(self)`
* **Description:** Navigates to `ModsScreen` (mod manager).
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `Quit(self)`
* **Description:** Shows quit confirmation popup.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnHostButton(self)`
* **Description:** Starts a local server in offline mode, resetting or preserving world-gen options based on input keys.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnJoinButton(self)`
* **Description:** Attempts to connect to the default join IP address.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnBecomeActive(self)`
* **Description:** Called when the screen becomes active. Restores focus, starts music, enables Kitcoon, and performs entity leak checks (dev builds only).
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `OnBecomeInactive(self)`
* **Description:** Called when the screen becomes inactive. Disables the Kitcoon puppet.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `FinishedFadeIn(self)`
* **Description:** Post-fade actions upon appearing: shows skin DLC entitlement popups, box opener popups, daily gifts, or language assistance popups (Steam only).
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `CheckNewUser(self, onno_fn, no_button_text)`
* **Description:** Shows a first-time user popup and handles navigation flow (e.g., proceed to server creation or custom action).
* **Parameters:**  
  - `onno_fn` (function) — callback for "No" (proceed with original action).  
  - `no_button_text` (string) — label for the "No" button.
* **Returns:** `boolean` — `true` if popup was shown; `false` if user previously saw it.

### `CheckEntitlements(self)`
* **Description:** Checks for unopened entitlement items (e.g., DLC gifts), opens box popups, and persists state via `TheGenericKV`.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

### `HandleNewControlSchemePopup(self)`
* **Description:** Shows a one-time popup to guide users to set up controls when a controller is first attached.
* **Parameters:** `self` (table) — the screen instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly — all event handling is delegated to child widgets (e.g., `motd_panel`, `kit_puppet`).
- **Pushes:** None — screen actions use direct navigation (`TheFrontEnd:PushScreen`) rather than event dispatch.