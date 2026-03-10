---
id: subscreener
title: Subscreener
description: Manages navigation between sub-menus in a Redux-based UI screen by coordinating button selection, screen visibility, and focus movement.
tags: [ui, navigation, subscreen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 99b90f95
system_scope: ui
---

# Subscreener

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Subscreener` is a UI helper component that orchestrates multi-level menu navigation in Redux-style screens. It manages a set of sub-screens, each associated with a menu button, and handles selection, visibility toggling, focus routing, and title updates. It relies on `TEMPLATES` to create standard button widgets and uses `MOVE_LEFT`, `MOVE_RIGHT`, `MOVE_UP`, and `MOVE_DOWN` constants (imported via `util`) to define directional focus transitions.

## Usage example
```lua
local subscreener = Subscreener(owner, menu_ctor, sub_screens)
subscreener:MenuButton("Settings", "settings", "Configure game settings")
subscreener:MenuButton("Inventory", "inventory", "Manage items")
subscreener:MenuContainer(my_menu_ctor, menu_items)
```

## Dependencies & tags
**Components used:** None (`inst` is not used; this is not an entity component). Uses external widgets (`TEMPLATES.MenuButton`, `TEMPLATES.WardrobeButton`, etc.) and utility functions (`circular_index`).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `screen` | widget | `owner` passed to constructor | The parent screen instance. |
| `buttons` | table | `{}` | Maps keys to button widgets. |
| `titles` | table | `{}` | Maps keys to button display text. |
| `sub_screens` | table | `sub_screens` passed to constructor | Table of sub-screen objects, indexed by keys. |
| `menu` | menu/container | returned by `menu_ctor` | The primary menu container (e.g., list or grid). |
| `menu_container` | widget | `nil` | Optional extended menu container (set by `MenuContainer`). |
| `active_key` | any | `nil` | Key of the currently active sub-screen. |
| `ordered_keys` | table | computed in constructor | List of button keys sorted by their position in `menu.items`. |
| `post_menu_selection_fn` | function | `nil` | Optional callback after selection. |

## Main functions
### `MenuButton(text, key, tooltip_text, tooltip_widget)`
* **Description:** Creates and registers a standard menu button using `TEMPLATES.MenuButton`. Adds the button to internal `buttons` and `titles` tables.
* **Parameters:**
  * `text` (string) – Display label.
  * `key` (any) – Unique identifier used to link button to a sub-screen.
  * `tooltip_text` (string?, optional) – Tooltip string.
  * `tooltip_widget` (widget?, optional) – Custom tooltip widget.
* **Returns:** `widget` – The created button instance.
* **Error states:** Overwrites existing entry in `buttons`/`titles` if `key` is reused.

### `WardrobeButton(text, key, tooltip_text, tooltip_widget)`
* **Description:** Creates and registers a wardrobe-styled menu button using `TEMPLATES.WardrobeButton`.
* **Parameters:** Same as `MenuButton`.
* **Returns:** `widget` – The created button instance.

### `WardrobeButtonMinimal(key)`
* **Description:** Creates and registers a minimal wardrobe button (no text label) using `TEMPLATES.WardrobeButtonMinimal`.
* **Parameters:** `key` (any) – Unique identifier.
* **Returns:** `widget` – The created button instance.

### `MenuContainer(menu_ctor, menu_items)`
* **Description:** Initializes a menu container using the provided `menu_ctor` and `menu_items`, automatically wiring button callbacks and focus navigation. Populates `buttons` and `titles` from `menu_items`.
* **Parameters:**
  * `menu_ctor` (function) – Constructor function returning a menu widget. Must accept `menu_items` as argument.
  * `menu_items` (table) – Array of menu item tables; each must contain `text` and `key`.
* **Returns:** `widget` – The constructed `menu_container`.
* **Error states:** Asserts that `item.cb` is `nil` for all `menu_items`, as callbacks are overridden.

### `SetPostMenuSelectionAction(fn)`
* **Description:** Sets an optional callback to run after a menu button is selected.
* **Parameters:** `fn` (function) – Callback accepting one argument (`selection` key).
* **Returns:** Nothing.

### `OnMenuButtonSelected(selection)`
* **Description:** Activates a sub-screen in response to a button selection. Updates active key, hides other sub-screens, shows the selected one, updates screen title, sets button focus, and triggers focus hookups.
* **Parameters:** `selection` (any) – Key corresponding to the selected button/sub-screen.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; assumes `sub_screens[selection]` and `buttons[selection]` exist.

### `GetActiveSubscreenFn()`
* **Description:** Returns a function that yields the currently active sub-screen.
* **Parameters:** None.
* **Returns:** `function` – A zero-arity function returning `self.sub_screens[self.active_key]`.

### `GetKeyRelativeToCurrent(increment)`
* **Description:** Computes the key of the button at a relative position (e.g., next/previous) in the ordered menu.
* **Parameters:** `increment` (number) – Integer offset (e.g., `1` for next, `-1` for previous).
* **Returns:** `any` – Key at the computed index; wraps using `circular_index`.
* **Error states:** Returns `nil` if `ordered_keys` is empty or `circular_index` fails.

## Events & listeners
None identified.