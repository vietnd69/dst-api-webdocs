---
id: characterselect
title: Characterselect
description: Manages a scrollable grid of selectable character portraits and synchronizes them with a main portrait display, handling focus navigation and selection events in the character selection UI.
tags: [ui, character, selection, navigation, grid]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6f87c8c0
system_scope: ui
---

# Characterselect

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CharacterSelect` is a UI widget that presents a scrollable grid of character portrait widgets and maintains a focused/main portrait (via `OvalPortrait`) that updates in real time as the user navigates the grid. It integrates with the mod system and game net mode to filter available characters, supports custom character detail widgets, and handles focus/selection callbacks. It extends `Widget` and is typically used in screens like `CharacterDetailsPanel`.

## Usage example
```lua
local character_select = CharacterSelect(
    owner,                     -- parent widget (e.g., CharacterDetailsPanel)
    CharacterPortraitWidget,   -- constructor for grid cell widgets
    100,                       -- character_widget_size (pixels)
    GetCharacterDescription,   -- function to retrieve character description text
    "wilson",                  -- default selected character
    onPortraitHighlighted,     -- callback when a portrait gains focus
    onPortraitSelected,        -- callback when a portrait is selected
    {},                        -- additional (mod-added) characters
    { x = 10, y = 0 }         -- scrollbar_offset
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `characterselect` tag to owner via `Widget._ctor` (implied); does not directly add/remove tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | widget | *(none)* | The parent widget that owns this `CharacterSelect`. |
| `OnPortraitHighlighted` | function? | `nil` | Optional callback invoked when a grid portrait gains focus. Receives the character string ID as argument. |
| `OnPortraitSelected` | function? | `nil` | Optional callback invoked when a grid portrait is clicked. Receives the character string ID as argument. |
| `characters` | array of strings | *computed* | List of character IDs available for selection, filtered by game mode and mod exceptions. |
| `grid_columns` | number | `5` | Fixed number of columns in the scrolling character grid. |
| `character_grid` | ScrollingGrid widget | *computed* | The scrolling grid container housing portrait widgets. |
| `selectedportrait` | OvalPortrait or custom widget | *computed* | The main portrait widget displayed separately, synchronized with grid focus. |
| `focus_forward` | widget | `character_grid` | The widget that should receive focus when navigating forward from this component. |

## Main functions
### `GetCharacter()`
* **Description:** Returns the character ID currently displayed in the main portrait (i.e., the most recently focused or selected character).
* **Parameters:** None.
* **Returns:** `string?` — the character prefab name (e.g., `"wilson"`), or `nil` if no character is set.
* **Error states:** May return `nil` if `selectedportrait.currentcharacter` is unset.

### `RefocusCharacter(last_character)`
* **Description:** Attempts to restore focus to the grid cell corresponding to the specified character, if present in the grid. Used to re-navigate the grid after updates or restoration of state.
* **Parameters:** `last_character` (string) — the character ID to focus.
* **Returns:** Nothing.
* **Error states:** Returns early without action if `last_character` matches the currently selected character.

### `RefreshInventory()`
* **Description:** Iterates through all visible grid cells and invokes `RefreshInventory()` on any cell whose embedded portrait widget supports the method. Ensures inventory/character UI state is up to date.
* **Parameters:** None.
* **Returns:** Nothing.

### `_BuildCharactersList(additionalCharacters)`
* **Description:** (Internal) Constructs the ordered list of characters available for display, filtering based on game net mode (online/offline), character restrictions, and mod exceptions. Includes both default selectable characters and any `additionalCharacters` passed to the constructor.
* **Parameters:** `additionalCharacters` (array of strings) — extra character IDs (e.g., mod-added skins).
* **Returns:** `array of strings` — the filtered list of character IDs.

### `_BuildCharacterGrid(characters, character_widget_ctor, character_widget_size, scrollbar_offset)`
* **Description:** (Internal) Builds a `ScrollingGrid` populated with portrait widgets. Each cell instantiates a portrait widget using `character_widget_ctor`, and listens for focus and click events to update the main `selectedportrait`.
* **Parameters:**  
  `characters` (array of strings) — list of character IDs to display.  
  `character_widget_ctor` (function) — widget constructor function for individual grid cells.  
  `character_widget_size` (number) — base size (pixels) for each grid cell.  
  `scrollbar_offset` (table?) — optional scrollbar position offset.
* **Returns:** `ScrollingGrid` widget instance.

## Events & listeners
- **Listens to:** None identified (no `inst:ListenForEvent` calls in this widget; event interactions are handled via callbacks and internal widget hierarchy).
- **Pushes:** None identified (no `inst:PushEvent` calls in this widget).