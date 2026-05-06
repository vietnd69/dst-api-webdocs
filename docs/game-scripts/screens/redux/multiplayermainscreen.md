---
id: multiplayermainscreen
title: MultiplayerMainScreen
description: Main menu screen for Don't Starve Together multiplayer mode, providing server browsing, hosting, player summary, and settings navigation with dynamic seasonal banners.
tags: [screen, ui, menu, multiplayer]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: screens
source_hash: 629ee693
system_scope: ui
---

# MultiplayerMainScreen

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`MultiplayerMainScreen` is the primary main menu screen for Don't Starve Together multiplayer mode, extending `Screen`. It displays dynamic seasonal/event banners, main navigation menu (browse, host, player summary, compendium, options, quit), sub-menu with utility links, and handles entitlement checks, music playback, and popup dialogs for new users or special events. The screen manages focus navigation between menu, MOTD panel, and sub-menu widgets.

## Usage example
```lua
local MultiplayerMainScreen = require("screens/redux/multiplayermainscreen")

-- Push the main menu screen onto the FrontEnd stack
local screen = MultiplayerMainScreen(prev_screen, profile, offline, session_data)
TheFrontEnd:PushScreen(screen)

-- Enable/disable banner sounds
screen:EnableBannerSounds(true)

-- Navigate to settings from external code
screen:Settings("AUDIO")
```

## Dependencies & tags
**External dependencies:**
- `widgets/screen` -- Screen base class
- `widgets/animbutton`, `widgets/imagebutton`, `widgets/menu`, `widgets/text`, `widgets/image`, `widgets/uianim`, `widgets/widget` -- UI widget primitives
- `widgets/redux/templates` -- Standard button, menu, and dialog factories
- `widgets/friendsmanager`, `widgets/onlinestatus`, `widgets/kitcoonpuppet` -- Specialized UI widgets
- `screens/redux/popupdialog`, `screens/redux/festivaleventscreen`, `screens/redux/modsscreen`, `screens/redux/optionsscreen`, `screens/redux/compendiumscreen`, `screens/redux/playersummaryscreen`, `screens/redux/quickjoinscreen`, `screens/redux/serverlistingscreen`, `screens/redux/serverslotscreen`, `screens/redux/purchasepackscreen` -- Navigation target screens
- `screens/thankyoupopup`, `screens/redux/itemboxopenerpopup` -- Popup dialogs
- `skin_gifts`, `stats` -- Utility modules for entitlements and statistics
- `os` -- System time functions

**Components used:** None (screen file, not a component).

**Tags:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `info_font` | string | `BODYTEXTFONT` | Font used for informational text elements. |
| `profile` | Profile | --- | Player profile object for save/load operations. |
| `offline` | boolean | --- | Whether the client is in offline mode. |
| `session_data` | table | --- | Session data passed from previous screen. |
| `log` | boolean | `true` | Logging enabled flag. |
| `prev_screen` | Screen | --- | Reference to the previous screen in the stack. |
| `default_focus` | Widget | --- | Widget to receive focus by default (set to `self.menu`). |
| `entitlements_checked` | boolean | `false` | Whether DLC entitlements have been checked this session. |
| `fixed_root` | Widget | --- | Root widget for fixed-position UI elements. |
| `letterbox` | Widget | --- | Foreground letterbox overlay widget. |
| `banner_root` | Widget | --- | Container for dynamic banner animations. |
| `sidebar` | Image | --- | Black sidebar background image. |
| `build_number` | Text | --- | Build version string display. |
| `logo` | Image | --- | Game logo image (varies by event). |
| `onlinestatus` | Widget | --- | Online status indicator widget. |
| `kit_puppet` | Widget | --- | Kitcoon puppet widget for seasonal decoration. |
| `motd_panel` | Widget | --- | MOTD panel or stats panel widget. |
| `userprogress` | Widget | --- | User progress widget (festival events only). |
| `banner_front` | Widget | `nil` | Optional foreground banner overlay. |
| `menu` | Widget | --- | Main menu widget containing primary buttons. |
| `submenu` | Widget | --- | Sub-menu widget with utility links. |
| `debug_menu` | Widget | `nil` | Debug menu (dev builds only). |
| `menu_root` | Widget | --- | Container widget for main menu. |
| `snowfall` | Widget | `nil` | Snowfall effect widget (Winter's Feast event). |
| `banner_snowfall` | Widget | `nil` | Banner snowfall effect widget. |
| `bannersoundsenabled` | boolean | --- | Whether banner sounds are enabled. |
| `musicstopped` | boolean | `nil` | Whether FE music is currently stopped. |
| `musictask` | task | `nil` | Scheduled task for music start delay. |
| `last_focus_widget` | Widget | `nil` | Last focused widget before screen transition. |
| `leaving` | boolean | `nil` | Flag indicating screen is transitioning away. |
| `filter_settings` | table | `nil` | Saved server filter settings. |
| `cached_entity_count` | number | `nil` | Cached entity count for leak detection (dev builds). |
| `IS_BETA` | constant (local) | `---` | True if `BRANCH` is "staging" or "dev". |
| `IS_DEV_BUILD` | constant (local) | `---` | True if `BRANCH` is "dev". |
| `SHOW_DST_DEBUG_HOST_JOIN` | constant (local) | `---` | True if `BRANCH` is "dev" (shows debug host/join menu). |
| `SHOW_QUICKJOIN` | constant (local) | `false` | Quick join feature flag (disabled by default). |

## Main functions
### `_ctor(prev_screen, profile, offline, session_data)`
* **Description:** Initialises the screen, calls `Screen._ctor(self, "MultiplayerMainScreen")`, sets up colour cube data and ambient colour, stores constructor parameters, calls `DoInit()`, sets default focus to menu, and applies online profile data via `TheGenericKV`.
* **Parameters:**
  - `prev_screen` -- previous screen in the FrontEnd stack
  - `profile` -- Profile object for player data
  - `offline` -- boolean indicating offline mode
  - `session_data` -- session data table from previous screen
* **Returns:** nil
* **Error states:** None — all parameters are stored without dereferencing.

### `GotoShop(filter_info)`
* **Description:** Navigates to the shop/purchase pack screen. Shows offline error dialog if not in online mode, otherwise stops music and fades to `PurchasePackScreen`.
* **Parameters:**
  - `filter_info` -- optional filter data for shop navigation
* **Returns:** nil
* **Error states:** None — guards offline mode with popup dialog.

### `getStatsPanel()`
* **Description:** Returns a `MainMenuStatsPanel` widget with a store callback that checks offline mode and navigates to `PurchasePackScreen` or shows error dialog.
* **Parameters:** None
* **Returns:** `MainMenuStatsPanel` widget instance
* **Error states:** None.

### `DoInit()`
* **Description:** Builds the complete screen UI: creates `fixed_root`, letterbox, banner (via `MakeBanner`), sidebar, build number text, logo (varies by festival event), main menu, sub-menu, online status widget, Kitcoon puppet, MOTD/stats panel, user progress widget (festival events), and optional front banner. Calls `DoFocusHookups()` and hides the screen initially.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — all widget creation is guarded by conditionals.

### `DoFocusHookups()`
* **Description:** Configures focus navigation between menu, sub-menu, MOTD panel, and debug menu. Sets `MOVE_UP`/`MOVE_DOWN`/`MOVE_LEFT`/`MOVE_RIGHT` focus change directions.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — checks `self.debug_menu` existence before configuring.

### `OnControl(control, down)`
* **Description:** Handles input control events. Calls base `Screen.OnControl`, then forwards to `motd_panel` if present. Returns true if input was handled.
* **Parameters:**
  - `control` -- CONTROL_* constant
  - `down` -- boolean (true on press, false on release)
* **Returns:** boolean — true if handled
* **Error states:** None — guards `self.motd_panel` existence.

### `EnableBannerSounds(enable)`
* **Description:** Sets the `bannersoundsenabled` flag to control whether banner sound effects play.
* **Parameters:**
  - `enable` -- boolean to enable/disable banner sounds
* **Returns:** nil
* **Error states:** None.

### `OnShow()`
* **Description:** Called when screen becomes visible. Calls base `OnShow`, starts snowfall effects if active (checking netbook/small texture mode), enables banner sounds, and unpauses file existence async checks.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — guards snowfall widgets with nil checks.

### `OnHide()`
* **Description:** Called when screen is hidden. Calls base `OnHide`, stops snowfall effects, and disables banner sounds.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnDestroy()`
* **Description:** Called when screen is destroyed. Calls `OnHide()` then base `OnDestroy()` for cleanup.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnRawKey(key, down)`
* **Description:** Handles raw keyboard input. Currently empty (no-op).
* **Parameters:**
  - `key` -- keyboard key code
  - `down` -- boolean (true on press, false on release)
* **Returns:** nil
* **Error states:** None.

### `_FadeToScreen(screen_ctor, data)`
* **Description:** Fades out, stores last focus widget, disables menu, sets `leaving` flag, then fades to a new screen constructed via `screen_ctor`. Used for transitions to screens with their own music.
* **Parameters:**
  - `screen_ctor` -- screen constructor function
  - `data` -- table of arguments to pass to screen constructor
* **Returns:** nil
* **Error states:** None.

### `StopMusic()`
* **Description:** Stops the front-end music (`FEMusic`). Sets `musicstopped` flag and cancels any pending music start task.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `StartMusic()`
* **Description:** Starts the front-end music with a 1.25 second delay if music is stopped and no task is pending. Sets fade parameter to 0 before scheduling.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `_GoToFestfivalEventScreen(fadeout_cb)`
* **Description:** Transitions to the festival event screen. Stops music if event has custom music, fades out, pushes `FestivalEventScreen`, fades in, and hides this screen. Calls `fadeout_cb` if provided during fade.
* **Parameters:**
  - `fadeout_cb` -- optional callback function called during fade-out
* **Returns:** nil
* **Error states:** None.

### `OnFestivalEventButton()`
* **Description:** Handles festival event button click. Shows offline error dialog if not online, or shows mods warning popup if mods are enabled (with options to disable mods and reset, continue with warning, or cancel). If no mods warning needed, transitions to festival event screen.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — all paths show appropriate dialogs or transitions.

### `OnCreateServerButton()`
* **Description:** Navigates to the server slot creation screen via `_GoToOnlineScreen`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `_GoToOnlineScreen(screen_ctor, data)`
* **Description:** Fades out, saves profile, pushes the specified online screen (server listing, server slot, etc.), fades in, and hides this screen. Used for online mode navigation.
* **Parameters:**
  - `screen_ctor` -- screen constructor function
  - `data` -- table of arguments for screen constructor
* **Returns:** nil
* **Error states:** None.

### `OnBrowseServersButton()`
* **Description:** Handles browse servers button click. Checks for new user popup first, loads or initialises filter settings (including SHOWLAN based on offline mode), then navigates to `ServerListingScreen`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — guards new user check and initialises filters if nil.

### `OnPlayerSummaryButton()`
* **Description:** Handles player summary button click. Shows offline error dialog if not online, otherwise stops music and fades to `PlayerSummaryScreen`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnCompendiumButton()`
* **Description:** Handles compendium button click. Fades to `CompendiumScreen`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnQuickJoinServersButton()`
* **Description:** Handles quick join button click. Checks for new user popup, stores last focus widget, disables menu, sets `leaving` flag, and pushes `QuickJoinScreen` popup (no fade).
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Settings(default_section)`
* **Description:** Navigates to the options/settings screen, optionally starting at a specific section.
* **Parameters:**
  - `default_section` -- optional string section name to open
* **Returns:** nil
* **Error states:** None.

### `OnModsButton()`
* **Description:** Handles mods button click. Fades to `ModsScreen`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `Quit()`
* **Description:** Shows quit confirmation dialog with Yes (calls `RequestShutdown()`) and No (pops dialog) options.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnHostButton()`
* **Description:** Handles host button click. Loads server mods, saves mod index, starts server in slot 1, disables DLC, and either deletes slot (with Shift/Ctrl held) or starts next instance with saved slot.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `TheNet:StartServer()` fails silently (no error handling for false return).

### `OnJoinButton()`
* **Description:** Handles join button click. Starts client connection to `DEFAULT_JOIN_IP`, disables DLC if successful, and shows loading screen.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — `start_worked` result is not checked for errors.

### `MakeMainMenu()`
* **Description:** Builds the main menu widget tree with buttons for browse, host, player summary, compendium, options, quit, and conditional buttons for shop (console), mods (if enabled), quick join (if enabled and online), and festival event (if active). Creates debug menu in dev builds.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — all conditional buttons check their respective flags.

### `MakeSubMenu()`
* **Description:** Builds the sub-menu widget with icon buttons for save location (non-Linux/SteamDeck), manage account (if Steam ticket), forums, and more games (non-Rail).
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnBecomeActive()`
* **Description:** Called when screen becomes active. Validates profile items, updates user progress if returning from collection/game, shows screen if not shown, adds `FriendsManager`, restores focus, enables debug menu, clears `leaving` flag, starts music, starts workshop query (if logged on), calls MOTD panel `OnBecomeActive`, enables kit puppet, and checks for entity leaks in dev builds.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — all widget calls are guarded with nil checks.

### `OnBecomeInactive()`
* **Description:** Called when screen becomes inactive. Disables the kit puppet.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `FinishedFadeIn()`
* **Description:** Called after screen fade-in completes. Checks for auth token, then handles new skin DLC entitlements popup, auto box item popup (mystery box opening), or daily gift/entitlement items popup. If no items, shows Steam language preference popup (if applicable).
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — guards auth token check and handles all popup paths.

### `HandleNewControlSchemePopup()`
* **Description:** Shows new control scheme popup dialog if a controller is attached and user hasn't seen the popup before. Offers to open settings to CONTROLSCHEME section or dismiss.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None.

### `OnUpdate(dt)`
* **Description:** Per-frame update handler. Calls `HandleNewControlSchemePopup()` and `CheckEntitlements()` (once per session).
* **Parameters:**
  - `dt` -- delta time in seconds
* **Returns:** nil
* **Error states:** None.

### `CheckNewUser(onnofn, no_button_text)`
* **Description:** Shows new user detection popup if user hasn't seen it before. Yes button creates server, No button calls the provided callback. Returns true if popup was shown.
* **Parameters:**
  - `onnofn` -- function to call if user selects No
  - `no_button_text` -- string for the No button label
* **Returns:** boolean — true if popup was shown, false if user already saw it
* **Error states:** None.

### `GetHelpText()`
* **Description:** Returns help text from MOTD panel if panel exists, has `GetHelpText` method, and is not focused. Otherwise returns empty string.
* **Parameters:** None
* **Returns:** string — help text or empty string
* **Error states:** None.

### `CheckEntitlements()`
* **Description:** Checks DLC entitlements against seen status. Gets owned entitlements via `TheItems:GetOwnedEntitlements()`, applies online profile data if `TheGenericKV` not synced, compares owned vs seen counts, and shows `ItemBoxOpenerPopup` for any new entitlements. Sets `entitlements_checked` to true when complete.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None — uses `pcall` for JSON decode and guards all entitlement checks.

## Events & listeners
None — screens consume input via `OnControl`, not engine event subscriptions.