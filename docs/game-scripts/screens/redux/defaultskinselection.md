---
id: defaultskinselection
title: Defaultskinselection
description: Displays a UI popup allowing players to select default item skins for a character, saving selections to their user profile.
tags: [ui, skin, profile, selection]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 2355b6f6
system_scope: ui
---

# Defaultskinselection

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`DefaultSkinSelectionPopup` is a UI screen component that presents an interactive list of character starting inventory items with skin selection spinners. It reads available skins from `PREFAB_SKINS`, caches user selections per item in `user_profile`, and applies item-specific visuals (e.g., icons and names) based on the selected skin. This component is used during character creation or loadout configuration to let players set their preferred default skin for each item.

## Usage example
```lua
local popup = DefaultSkinSelectionPopup(user_profile, character)
TheFrontEnd:PushScreen(popup)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `user_profile` | table | — | The user profile object used to persist skin selections (`SetLastUsedSkinForItem` / `GetLastUsedSkinForItem`). |
| `character` | string | — | The character prefab name whose starting inventory is being configured. |
| `spinnerdata` | table | `{}` | Cached data per item, including skin options, item name, and current/last-selected skin. |
| `dialog` | widget | — | The main window container (`TEMPLATES.CurlyWindow`) displaying the UI content. |
| `scroll_list` | widget | — | The scrolling grid container housing item skin selector rows. |

## Main functions
### `GetSkinsList(item)`
*   **Description:** Retrieves a list of owned skin prefabs applicable to the given item, based on `PREFAB_SKINS` and inventory ownership.
*   **Parameters:** `item` (string) — the base item prefab name.
*   **Returns:** table — list of skin item prefabs (e.g., `{ "item_skeleton", "item_samurai" }`), filtered by ownership and `PREFAB_SKINS_SHOULD_NOT_SELECT`.
*   **Error states:** Returns an empty table if `PREFAB_SKINS[item]` is nil or no skins are owned.

### `GetSkinOptions(item)`
*   **Description:** Constructs the list of options for a spinner (e.g., "Default" plus all owned skins), including visual metadata (text, color, atlas, texture) for display.
*   **Parameters:** `item` (string) — the base item prefab name.
*   **Returns:** table — array of option tables, each containing: `text` (string), `colour` (color), `data` (table with `xml`, `tex`, `item`, `skin_item`).
*   **Error states:** Returns at least one option ("Default") even if no skins are owned.

### `:OnControl(control, down)`
*   **Description:** Handles controller input for the popup (e.g., navigation, cancel).
*   **Parameters:**  
  `control` (Control) — the control being pressed.  
  `down` (boolean) — whether the control is pressed (`true`) or released (`false`).  
*   **Returns:** boolean — `true` if the control was handled, otherwise `false`.

### `:GetHelpText()`
*   **Description:** Returns the help text string for the current context, typically controller button hints.
*   **Parameters:** None.  
*   **Returns:** string — localized help text.

### `:_Cancel()`
*   **Description:** Saves any changed skin selections to the `user_profile` and closes the popup.
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified