---
id: playersummaryscreen
title: Playersummaryscreen
description: Displays a player's character roster, recent item acquisitions, and access to skin and shop-related screens in the frontend UI.
tags: [ui, frontend, inventory, character]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: a3ebfb0a
system_scope: ui
---

# Playersummaryscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PlayerSummaryScreen` is a frontend UI screen that presents a player’s unlocked characters (Posse), recent inventory acquisitions, and provides navigation to related screens such as Wardrobe, Mystery Box, Trading, and Purchase. It is instantiated via the `Screen` base class and manages dynamic content like puppets, menus, and item summaries with support for offline and online modes, as well as festival events.

The screen interacts with profile and inventory systems (`user_profile`, `TheInventory`, `GetInventorySkinsList()`), and conditionally refreshes skin DLC ownership on consoles via periodic tasks. It is typically opened from a main menu and returns to the previous screen on dismissal.

## Usage example
The screen is not added as a component to an entity; it is instantiated and pushed to the frontend as a top-level screen:

```lua
-- Example: Open the screen from another screen or system
TheFrontEnd:PushScreen(PlayerSummaryScreen(prev_screen, user_profile))
```

## Dependencies & tags
**Components used:** None (this is a screen, not an entity component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prev_screen` | screen | `nil` | Reference to the screen that opened this one. |
| `user_profile` | UserProfile | `nil` | The profile object containing player data (skins, last character, etc.). |
| `can_shop` | boolean | `not IsConsole()` | Whether the Purchase button is interactive or links to an external store. |
| `character_list` | table | Result of `GetFEVisibleCharacterList()` | List of characters visible in the Posse. |
| `posse` | table of Puppets | `{}` | Array of `Puppet` widgets representing unlocked characters. |
| `puppet` | PlayerAvatarPortrait | `nil` | Avatar portrait widget for the current/last-selected character. |
| `kit_puppet` | KitcoonPuppet | `nil` | Decorative puppet widget (Kitcoon). |
| `menu` | StandardMenu | `nil` | Main navigation menu widget. |
| `new_items` | Widget | `nil` | Container for the items summary section. |
| `refresh_task` | DoTaskInTime | `nil` | Deferred task used to re-check and update items. |
| `musicstopped` | boolean | `true` | Tracks whether background music is playing. |
| `musictask` | DoTaskInTime | `nil` | Delayed task for starting music. |
| `leaving` | boolean | `nil` | Indicates if the screen is transitioning out. |
| `waiting_for_inventory` | table of widgets | `{}` | List of menu buttons disabled until inventory is downloaded. |
| `tooltip` | ScreenTooltip | `nil` | Tooltip helper for menu items. |

## Main functions
### `DoInit()`
* **Description:** Initializes the screen layout, widgets, puppets, and UI structure upon construction. Sets up the letterbox, title, Posse, items summary, avatar portrait, and menu.
* **Parameters:** None.
* **Returns:** Nothing.

### `_BuildMenu()`
* **Description:** Constructs and returns the main navigation menu. Buttons include Skins, Mystery Box, Trading, Purchase, and Redeem (plus optional Debug button if `SKIN_DEBUGGING` is true). Menu items are conditionally enabled once inventory is downloaded.
* **Parameters:** None.
* **Returns:** `Widget` — the menu root container with all menu buttons.

### `_BuildItemsSummary()`
* **Description:** Builds the "New Items" section showing up to 6 recently acquired non-mystery-box items. Handles offline/offline modes, loading states, and refresh scheduling.
* **Parameters:** None.
* **Returns:** `Widget` — the container widget with the item list and refresh logic (`UpdateItems`, `ScheduleRefresh`).

### `_BuildPosse()`
* **Description:** Builds and positions the character Posse display: up to 18 puppets laid out in a grid. Each puppet is a `Puppet` widget, clickable to open the Wardrobe for that character.
* **Parameters:** None.
* **Returns:** Nothing — populates `self.posse` and `self.posse_root`.

### `_RefreshPuppets()`
* **Description:** Updates all Posse puppets and the main avatar portrait to reflect current skin, profile flair, and portrait selections. Assigns click handlers for wardrobe navigation.
* **Parameters:** None.
* **Returns:** Nothing.

### `_RefreshClientData()`
* **Description:** Triggers refreshes of puppets, item list, and menu button labels (to show "NEW" badges and counts). Enables `waiting_for_inventory` buttons after download completes.
* **Parameters:** None.
* **Returns:** Nothing.

### `_RefreshTitles()`
* **Description:** Updates menu button text for Skins, Mystery Box, and Purchase buttons to include counts or badges (e.g., "(2)", "(NEW)"). Adjusts font sizes if localized strings are too long.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSkinsButton()`
* **Description:** Navigates to the `CollectionScreen` for browsing skins.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnMysteryBoxButton()`
* **Description:** Navigates to `MysteryBoxScreen` if online; otherwise shows an offline popup. On console, forces a store page open if offline.
* **Parameters:** None.
* **Returns:** Nothing.

### `_FadeToScreen(screen_ctor, data)`
* **Description:** Handles screen transition by saving current focus, disabling the menu, and fading to the target screen. Uses `TheFrontEnd:FadeToScreen` with a factory function.
* **Parameters:**  
  * `screen_ctor` (function) — constructor for the screen to navigate to.  
  * `data` (table) — arguments to pass to the screen constructor (e.g., `{}`).  
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when this screen becomes active. Enables Kitcoon puppet, restores menu focus, refreshes client data, starts background music, and displays inventory failure popups if needed.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Called when this screen becomes inactive. Disables the Kitcoon puppet.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartMusic()`
* **Description:** Starts the frontend "FEMusic" track after a 1.25s delay, if not already playing or scheduled.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopMusic()`
* **Description:** Stops the music track and cancels pending music tasks.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Stops music and navigates back to the previous screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input; dismisses the screen on `CONTROL_CANCEL` (typically Back/Escape).
* **Parameters:**  
  * `control` (number) — input control ID.  
  * `down` (boolean) — whether the control was pressed (true) or released (false).  
* **Returns:** `boolean` — `true` if input was handled.

### `GetHelpText()`
* **Description:** Returns localized help text string (e.g., "Back – Cancel").
* **Parameters:** None.
* **Returns:** `string` — help text for the current controller.

### `OnUpdate(dt)`
* **Description:** Called every frame. Updates emotes for all Posse puppets to keep them animated.
* **Parameters:** `dt` (number) — delta time since last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified (screen uses periodic tasks, not event listeners).
- **Pushes:** None identified.