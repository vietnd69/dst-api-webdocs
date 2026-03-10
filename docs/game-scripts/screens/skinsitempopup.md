---
id: skinsitempopup
title: Skinsitempopup
description: Renders a popup dialog displaying item skin information including name, description, rarity, and visual preview.
tags: [ui, skin]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 84813cc0
system_scope: ui
---

# Skinsitempopup

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SkinsItemPopUp` is a UI screen component that displays detailed information about a selected item skin in a modal dialog. It includes the player's name, skin name, description, rarity, and a dynamic visual preview using an animation. The screen uses standard DST UI primitives (buttons, text, images, anims) and integrates with the `TheFrontEnd` screen stack for navigation.

## Usage example
```lua
-- Example of opening the skins item popup
TheFrontEnd:PushScreen(SkinsItemPopUp("hat", "Wendy", {1, 0.8, 0.6, 1}))
```

## Dependencies & tags
**Components used:** None (pure UI screen with no entity components).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `black` | Image | `nil` | Full-screen dark overlay (tinted to 75% opacity black). |
| `proot` | Widget | `nil` | Root widget container for the dialog content. |
| `frame` | Template | `nil` | Curly window frame widget. |
| `bg` | Image | `nil` | Background fill panel. |
| `player_label` | Text | `nil` | Label showing the player's name with custom color. |
| `title` | Text | `nil` | Static title label (localized via `STRINGS.UI.ITEM_SCREEN.NORMAL_POPUP_TITLE`). |
| `skin_name` | Text | `nil` | Label displaying the skin's name (wrapped, left-aligned). |
| `skin_description` | Text | `nil` | Label displaying the skin's description (wrapped, left-aligned). |
| `rarity_label` | Text | `nil` | Label for rarity text (hidden by default). |
| `upper_horizontal_line` | Image | `nil` | Decorative horizontal line below player label/title. |
| `lower_horizontal_line` | Image | `nil` | Decorative horizontal line below description. |
| `spawn_portal` | UIAnim | `nil` | Animation element showing a preview of the skin. |
| `menu` | Menu | `nil` | Action menu containing the OK button. |
| `item_type` | string | `""` | Internal type identifier of the skin. |

## Main functions
### `SetItemDisplay()`
*   **Description:** Updates the UI content with the name, description, rarity, and visual preview for the currently assigned `item_type`. Should be called after initialization to populate the dialog.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Falls back to placeholder strings if `GetSkinName(item_type)` or `GetSkinDescription(item_type)` returns `nil`.

## Events & listeners
- **Listens to:** `CONTROL_CANCEL` (from `OnControl`) – closes the screen when the cancel control is released.
- **Pushes:** None.