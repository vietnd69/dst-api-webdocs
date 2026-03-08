---
id: dressuppanel
title: Dressuppanel
description: Manages the UI panel for character clothing and skin customization in the lobby screen, supporting both offline and online modes.
tags: [ui, clothing, customization]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: ce01be4e
system_scope: ui
---

# Dressuppanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`DressupPanel` is a UI widget that provides a customizable character appearance panel for selecting skins and clothing items in the lobby. It supports two modes: offline (displaying static images with simplified controls) and online (with animated puppet preview and spinner-based UI). The component manages spinner widgets for base, body, hand, legs, and feet slots, syncs the puppet preview, and persists selections to the player profile.

## Usage example
```lua
local dressup_panel = DressupPanel(
    owner_screen,      -- the parent screen instance
    profile,           -- Profile component instance
    playerdata,        -- Player data (optional, used for restoring state)
    onChanged,         -- callback function triggered on selection change
    recent_item_types, -- list of recently acquired items
    recent_item_ids,   -- ignored in this implementation
    include_random_options -- boolean enabling random/skin options
)
dressup_panel:SetCurrentCharacter("wilson")
-- Selection changes automatically update the puppet preview
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_screen` | widget | `nil` | Parent screen context. |
| `profile` | Profile | `nil` | Profile object used for skin persistence and fetching options. |
| `playerdata` | table | `nil` | Optional player data for restoring state. |
| `currentcharacter` | string | `"wilson"` | Current character being customized. |
| `recent_item_types` | table | `{}` | List of recently acquired items for spinner defaults. |
| `onChanged` | function | `nil` | Callback invoked when a spinner selection changes. |
| `include_random_options` | boolean | `false` | Whether to include random/skin options in spinners. |
| `puppet` | Puppet widget | `nil` | Avatar preview widget (online mode only). |
| `base_spinner`, `body_spinner`, `hand_spinner`, `legs_spinner`, `feet_spinner` | spinner group widgets | `nil` | UI controls for each clothing slot. |

## Main functions
### `SetCurrentCharacter(character)`
* **Description:** Sets the character being customized, updating spinners and the puppet preview accordingly.
* **Parameters:** `character` (string) – the character prefab name (e.g., `"wilson"` or `"random"`).
* **Returns:** Nothing.

### `UpdatePuppet(skip_change_emote)`
* **Description:** Updates the puppet preview visibility and appearance based on the current character and spinner selections. For the `"random"` character, it hides the puppet and shows the random-avatar placeholder.
* **Parameters:** `skip_change_emote` (boolean, optional) – if true, prevents changing the puppet’s emote.
* **Returns:** Nothing.

### `SetPuppetSkins(skip_change_emote)`
* **Description:** Applies selected skins/clothing from spinners to the puppet. Handles both online and offline modes; offline uses nil base_skin and empty clothing list.
* **Parameters:** `skip_change_emote` (boolean, optional) – if true, prevents puppet emote changes.
* **Returns:** Nothing.

### `GetSkinOptionsForSlot(slot)`
* **Description:** Returns a sorted list of available skins for a given slot (e.g., `"body"`, `"legs"`), including a placeholder "none" option and optionally a `"random"` option. Marks newly acquired skins via `new_indicator`.
* **Parameters:** `slot` (string) – the clothing slot (e.g., `"body"`, `"feet"`).
* **Returns:** table – list of skin option tables, each containing `text`, `build`, `item`, `symbol`, `colour`, and `new_indicator`.

### `GetSkinsForGameStart()`
* **Description:** Compiles and returns the selected skins for the current session to be used at game start. Handles both online (spinner-driven) and offline (fallback default) scenarios, including `"random"` character resolution and persistence of previous selections when appropriate.
* **Returns:** table – skins table with keys: `base`, `body`, `hand`, `legs`, `feet`.

### `GetBaseSkin()`
* **Description:** Retrieves the currently selected base skin item and whether it is a random skin.
* **Returns:** `{ item: string, is_random: boolean }` or `nil` if spinners not initialized.

### `MakeSpinner(slot)`
* **Description:** Creates and configures a spinner widget for a specific clothing slot. Includes custom text, animations, and an optional "new" indicator badge. Registers an `OnChanged` callback to update the puppet preview and invoke `onChanged` when selection changes.
* **Parameters:** `slot` (string) – the slot name (e.g., `"body"`, `"feet"`).
* **Returns:** spinner group widget – contains `spinner` (AnimSpinner), `new_tag` (Image), and helper methods `GetItem()` and `GetIndexForSkin()`.

### `Reset(set_spinner_to_new_item)`
* **Description:** Reinitializes spinner options andselectedIndex values. Uses playerdata or profile defaults unless `set_spinner_to_new_item` is true, in which case it defaults to the first recently acquired item for each slot.
* **Parameters:** `set_spinner_to_new_item` (boolean) – if true, prioritizes recent items in spinner selection.
* **Returns:** Nothing.

### `SeparateAvatar()`
* **Description:** Reconfigures the panel layout for online mode by hiding the background frame and repositioning the puppet and spinners for a cleaner appearance.
* **Returns:** Nothing.

### `EnableSpinners()` / `DisableSpinners()`
* **Description:** Shows or hides all spinner groups and the main frame.
* **Parameters:** None.
* **Returns:** Nothing.

### `ScrollBack(control)` / `ScrollFwd(control)`
* **Description:** Handles repeated scrolling across all spinners when a control (e.g., keyboard/gamepad) is held. Plays a UI sound on value change and applies rate-limiting based on input type (mouse wheel, keyboard scroll, gamepad stick).
* **Parameters:** `control` (number) – control constant (e.g., `CONTROL_SCROLLBACK`).
* **Returns:** Nothing.

## Events & listeners
None identified.