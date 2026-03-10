---
id: playstyleselectscreen
title: Playstyleselectscreen
description: Displays a selection grid of game playstyles for host creation, enabling users to choose a world configuration before proceeding to server or cave setup.
tags: [ui, screen, playstyle, server]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 47d4a4ff
system_scope: ui
---

# Playstyleselectscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PlaystyleSelectScreen` is a UI screen that allows players to select a playstyle (e.g., Forest, Caves, RUIN, etc.) when hosting a new game in DST. It presents a grid of available playstyles defined via `Levels.GetPlaystyles()`, each with a descriptive label and icon. Upon selection, it forwards to either `ServerCreationScreen` (if caves state is remembered) or `CaveSelectScreen` (for the first-time cave selection flow). This screen integrates with the Redux UI system and uses standard button/grid widgets for keyboard/controller navigation.

## Usage example
This screen is instantiated internally by the frontend and is not typically created directly by mods. Typical internal usage by the game:
```lua
TheFrontEnd:PushScreen(PlaystyleSelectScreen(prev_screen, slot_index))
```

## Dependencies & tags
**Components used:** None (this is a UI screen, not an ECS component).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `parent_screen` | screen | `prev_screen` | The screen to return to upon close. |
| `slot_index` | number | Slot index for world persistence (unused in this snippet). |
| `kit_puppet` | KitcoonPuppet widget | `nil` initially | Animation puppet overlay at screen bottom. |
| `style_grid` | Grid widget | `nil` initially | Grid container for playstyle buttons. |
| `default_playstyle` | ImageButton | `nil` initially | Reference to the third button in the grid (default selection). |
| `selected` | ImageButton | `nil` initially | Currently focused playstyle button. |
| `description` | Text widget | `nil` initially | Multiline text field showing the selected playstyle's description. |

## Main functions
### `MakeStyleButton(playstyle_id)`
* **Description:** Constructs and returns a `Widget` containing an `ImageButton` representing a single playstyle option. Sets up button state callbacks (`OnSelect`, `OnUnselect`, `OnClick`) and assigns icons/text based on the playstyle definition.
* **Parameters:** `playstyle_id` (string or number) — Unique identifier for the playstyle, used with `Levels.GetPlaystyleDef(playstyle_id)` to fetch metadata.
* **Returns:** `Widget` — The button container widget with embedded `button` and `settings_desc` fields.
* **Error states:** No explicit error handling; uses fallback empty table `{}` if `GetPlaystyleDef` returns `nil`.

### `MakeStyleGrid()`
* **Description:** Builds a horizontally centered grid of `MakeStyleButton` instances using `Levels.GetPlaystyles()`. Configures focus behavior (gain/lose focus updates `selected` and `default_playstyle`) and positions the grid appropriately.
* **Parameters:** None.
* **Returns:** `Widget` — The root grid widget containing all playstyle buttons.
* **Error states:** Assumes `Levels.GetPlaystyles()` returns a non-empty list.

### `UpdateStyleInfo(w)`
* **Description:** Updates the `description` text field with the selected playstyle's description, truncating to three lines and wrapping within a 700px width.
* **Parameters:** `w` (Widget) — A widget returned by `MakeStyleButton`, expected to have a `settings_desc` field.
* **Returns:** Nothing.

### `Close()`
* **Description:** Handles screen dismissal by fading out, popping this screen, and fading back in.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input events, specifically `CONTROL_CANCEL` (typically Escape/B) to close the screen.
* **Parameters:**  
  * `control` (number) — Control ID (e.g., `CONTROL_CANCEL`).  
  * `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).  
* **Returns:** `true` if the event was handled (cancel pressed and released); otherwise `false`.
* **Error states:** Returns `true` only on release (`down == false`) for `CONTROL_CANCEL`; does nothing on press.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.