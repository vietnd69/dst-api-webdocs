---
id: skindebugscreen
title: Skindebugscreen
description: A debug UI screen for previewing and adjusting character clothing skin assets in real-time.
tags: [ui, debug, clothing]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 1e436b92
system_scope: ui
---

# Skindebugscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`SkinDebugScreen` is a specialized debug UI screen that allows developers to preview character skin assets (pants and shoes) in a puppet renderer and adjust their `legs_cuff_size` and `feet_cuff_size` properties interactively. It is not intended for production use and is only available during development or testing. It uses the `Puppet` widget to render the character and dynamically modifies the global `CLOTHING` table to reflect size changes.

## Usage example
This screen is instantiated internally by the game and is not meant to be created directly by mods. Its usage is limited to calling `TheFrontEnd:SetScreen(SkinDebugScreen(prev_screen, user_profile))` in debug builds.

```lua
-- Not intended for mod use. Example instantiation:
local screen = SkinDebugScreen(prev_screen, user_profile)
TheFrontEnd:SetScreen(screen)
```

## Dependencies & tags
**Components used:** None (screen-only UI component; no entity components used).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `prev_screen` | Screen? | `nil` | The screen to return to upon exit. |
| `user_profile` | UserProfile? | `nil` | User profile data (unused in current implementation). |
| `pants`, `shoes` | table[] | `{}`, `{}` | Lists of clothing items categorized as pants or shoes, each containing `id` and `type`. |
| `pants_index`, `shoes_index` | number | `1` | Current selection index in `pants` and `shoes` tables. |
| `pants_txt`, `shoes_txt` | Text | — | UI text widgets displaying selected clothing ID and cuff size. |
| `puppet` | Puppet | — | Puppet instance used to render the character preview. |
| `puppet_root` | Widget | — | Container widget for the puppet. |
| `control_menu`, `size_menu` | Menu | — | Menus for navigation and size adjustment controls. |
| `back_button` | Widget? | `nil` | Back button (if not on a controller). |
| `character` | string | `"wilson"` | Character being previewed. |
| `skintypes` | table | — | Available skin types for the character. |
| `view_index` | number | `1` | Current skin type view index. |
| `selected_skintype` | string | — | Type of skin currently applied to the puppet. |

## Main functions
### `DoInit()`
* **Description:** Initializes the screen UI, creates menus for navigation and size control, sets up the character puppet, populates pants/shoes lists from `CLOTHING`, and sorts them by cuff size.
* **Parameters:** None.
* **Returns:** Nothing.

### `UpdatePuppet()`
* **Description:** Updates the puppet with the currently selected pants and shoes, updates the on-screen text labels, and applies skin settings.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetShoes(forward)`
* **Description:** Selects the next or previous shoe item in the `shoes` list, with clamping to keep the index within bounds.
* **Parameters:** `forward` (boolean) — `true` to select the next item, `false` to select the previous.
* **Returns:** Nothing.

### `SetPants(forward)`
* **Description:** Selects the next or previous pants item in the `pants` list, with clamping to keep the index within bounds.
* **Parameters:** `forward` (boolean) — `true` to select the next item, `false` to select the previous.
* **Returns:** Nothing.

### `ResizeShoes(delta)`
* **Description:** Modifies the `feet_cuff_size` value for the currently selected shoe item in `CLOTHING` and updates the list order and puppet.
* **Parameters:** `delta` (number) — Amount to adjust `feet_cuff_size` (e.g., `+1` or `-1`).
* **Returns:** Nothing.

### `ResizePants(delta)`
* **Description:** Modifies the `legs_cuff_size` value for the currently selected pants item in `CLOTHING` and updates the list order and puppet.
* **Parameters:** `delta` (number) — Amount to adjust `legs_cuff_size` (e.g., `+1` or `-1`).
* **Returns:** Nothing.

### `SortClothesLists()`
* **Description:** Re-sorts both `pants` and `shoes` lists in descending order by their respective cuff sizes (`legs_cuff_size` or `feet_cuff_size`), breaking ties by descending `id` string. Maintains current selection position after sorting.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input; if `CONTROL_CANCEL` is released, triggers screen exit via `TheFrontEnd:FadeBack()`.
* **Parameters:** 
  * `control` (number) — Input control code.
  * `down` (boolean) — `true` if the control is pressed, `false` if released.
* **Returns:** `true` if input was handled, `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text indicating the button to press to exit the screen.
* **Parameters:** None.
* **Returns:** `string` — Localized help string (e.g., `"B Back"`).

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
