---
id: scarecrowpopupgridloadout
title: Scarecrowpopupgridloadout
description: Manages the UI popup for selecting and applying clothing skins to a scarecrow character in the wardrobe interface.
tags: [ui, inventory, skins, wardrobe]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: b51dbce6
system_scope: ui
---

# Scarecrowpopupgridloadout

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`GridScarecrowClothingPopupScreen` is a screen component that presents a clothing skin selection UI for scarecrow characters. It displays skin options via a `LoadoutSelect` widget, allows user input (keyboard/controller), and handles applying, canceling, or resetting skin choices. It initializes skin data from the owner scarecrow’s `playeravatardata` component and interacts with the wardrobe popup system to commit changes or discard them.

## Usage example
```lua
local popup = GridScarecrowClothingPopupScreen(owner_scarecrow, doer, profile)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** `playeravatardata` (via `GetData`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_scarecrow` | Entity | `nil` | The scarecrow entity whose skins are being edited. |
| `doer` | Entity | `nil` | The entity performing the action (e.g., player opening the wardrobe). |
| `profile` | Profile | `nil` | The skin loadout profile being edited. |
| `initial_skins` | table | `{}` | Skin values captured at popup initialization: `{base, body, feet, hand, legs}`. |
| `loadout` | LoadoutSelect | `nil` | Widget that displays and manages skin selection. |
| `menu` | Menu | `nil` | Widget for action buttons (Cancel/Set). |
| `timestamp` | number | `0` | Cache of the inventory’s last modified timestamp. |

## Main functions
### `OffsetServerPausedWidget(serverpausewidget)`
* **Description:** Adjusts the position of the server pause widget when this screen is active.
* **Parameters:** `serverpausewidget` (Entity) — the widget entity to offset.
* **Returns:** Nothing.

### `OnDestroy()`
* **Description:** Cleans up screen state: disables autopause, restores camera offset, and pops all screens tagged with `owned_by_wardrobe` until a non-wardrobe screen is reached.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Updates inventory display in sub-screens on activation and restores focus to the loadout widget for controller users.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTimestamp()`
* **Description:** Scans the full inventory list and returns the most recent `modified_time`.
* **Parameters:** None.
* **Returns:** `number` — the latest inventory modification timestamp.

### `DoFocusHookups()`
* **Description:** Configures left/right focus navigation between the loadout widget and menu buttons.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles key/controller input: `CONTROL_CANCEL` triggers cancel, `CONTROL_MENU_START` triggers set/apply.
* **Parameters:**
  * `control` (string) — the control constant (e.g., `CONTROL_CANCEL`).
  * `down` (boolean) — whether the button was pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the event was handled; `false` otherwise.

### `Cancel()`
* **Description:** Resets skin selections to their initial state and closes the screen.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Restores the loadout widget’s `selected_skins` to `initial_skins`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close(apply_skins)`
* **Description:** Closes the popup and optionally commits selected skins. Validates ownership and validity of each skin, substitutes defaults where invalid, and notifies the wardrobe popup via `POPUPS.WARDROBE:Close`. Updates the profile’s collection timestamp.
* **Parameters:**
  * `apply_skins` (boolean) — whether to apply the current skin selection (`true`) or abort (`false`).
* **Returns:** Nothing.

### `GetHelpText()`
* **Description:** Returns localized help text strings for controller controls (Cancel, Set).
* **Parameters:** None.
* **Returns:** `string` — concatenated control labels (e.g., `"X Cancel  A Set"`).

## Events & listeners
- **Pushes:** `OnDestroy` implicitly handles screen-popping logic; no custom events fired by this screen.
- **Listens to:** None identified.

