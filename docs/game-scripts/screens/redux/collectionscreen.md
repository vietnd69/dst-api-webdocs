---
id: collectionscreen
title: Collectionscreen
description: Manages the UI screen for accessing and navigating cosmetic collections, including skins, emotes, beards, beefalo gear, and profile flair, within the game's Redux UI framework.
tags: [ui, collections, inventory]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: abad0ed7
system_scope: ui
---

# Collectionscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`CollectionScreen` is a Redux-based UI screen that provides access to the player's cosmetic collection. It serves as a central hub for viewing and interacting with customizable content such as character skins, beards, emotes, emoji, beefalo gear, profile flair, portrait backgrounds, loaders, and inventory-based game items. It integrates with the `Subscreener` system to switch between different explorer panels and manages inventory state (doodads and KleiPoints) and character selection context.

## Usage example
```lua
-- Typically instantiated via TheFrontEnd when navigating to the collection menu.
-- Example of manual instantiation (not common in practice):
local collection_screen = CollectionScreen(prev_screen, user_profile)
TheFrontEnd:PushScreen(collection_screen)
```

## Dependencies & tags
**Components used:** None (this is a screen class, not an entity component)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prev_screen` | widget? | `nil` | The screen to return to upon closing. |
| `user_profile` | UserProfile | required | The profile object containing player collection and preference data. |
| `subscreener` | Subscreener | `nil` | Manages menu navigation and sub-screens (e.g., skins, gameitem, emotes). |
| `kit_puppet` | KitcoonPuppet? | `nil` | Decorative animated puppet display (Kitcoon). |
| `doodad_count` | DoodadCounter? | `nil` | UI widget displaying current doodad (in-game currency) count. |
| `points_count` | KleiPointsCounter? | `nil` | UI widget displaying Klei Points (Steam/Rail only). |
| `leaving` | boolean | `nil` | Internal flag used during screen transition to indicate exit state. |
| `last_focus_widget` | widget? | `nil` | Stores the focused widget before screen transition for focus restoration. |
| `sorry_popup` | PopupDialogScreen? | `nil` | Lazily instantiated error dialog if inventory access fails. |

## Main functions
### `DoInit()`
* **Description:** Initializes the screen layout, creates UI elements (background, title, counters, kit puppet), and sets up the `Subscreener` with all available explorer panels. This is called from the constructor after parent `Screen._ctor`.
* **Parameters:** None.
* **Returns:** Nothing.

### `MakeMenu(subscreener)`
* **Description:** Builds and returns the main navigation menu with buttons for each collection type (e.g., skins, emotes, beards). Called by `Subscreener` to construct the menu layout.
* **Parameters:** `subscreener` (Subscreener) — the parent subscreener instance providing menu button creation utilities.
* **Returns:** Widget — the constructed `StandardMenu` widget.

### `OnSkinsButton(hero)`
* **Description:** Handles the "Skins" menu selection by transitioning to the `WardrobeScreen` for the specified hero (character). Updates `user_profile` to remember the last selected character.
* **Parameters:** `hero` (string) — the character name (e.g., `"wilson"`, `"wx78"`).
* **Returns:** Nothing.

### `_FadeToScreen(screen_type, data)`
* **Description:** Initiates a screen transition with fade effect to another screen, preserving and later restoring the current focus widget.
* **Parameters:**  
  - `screen_type` (function) — constructor function for the target screen (e.g., `WardrobeScreen`).  
  - `data` (array) — arguments passed to the screen constructor.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Activated when the screen becomes visible. Handles inventory readiness checks (offline/online mode, inventory download status), shows apology popups if unavailable, enables the kit puppet, refreshes inventory displays, and restores focus if applicable.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Deactivates the screen when another takes focus. Disables the kit puppet animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshInventory(animateDoodads)`
* **Description:** Updates the displayed inventory counts (doodads and KleiPoints) to reflect current values. Also refreshes the skins explorer panel inventory.
* **Parameters:** `animateDoodads` (boolean?) — whether to animate the doodad count change (default behavior implies true if provided).
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input control events. Specifically processes the cancel control (`CONTROL_CANCEL`) to close the screen.
* **Parameters:**  
  - `control` (number) — the control ID (e.g., `CONTROL_CANCEL`).  
  - `down` (boolean) — true if the control is pressed down.
* **Returns:** `boolean` — `true` if the event was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text displayed in the UI, indicating how to navigate away (e.g., "Escape / Back").
* **Parameters:** None.
* **Returns:** string — localized instruction string.

### `_CloseScreen()`
* **Description:** Handles final cleanup before leaving the screen: records the inventory timestamp to the profile and fades back to the previous screen.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls observed).
- **Pushes:** None (no `inst:PushEvent` calls observed).