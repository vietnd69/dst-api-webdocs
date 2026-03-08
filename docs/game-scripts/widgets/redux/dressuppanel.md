---
id: dressuppanel
title: Dressuppanel
description: Manages the UI panel for character skin customization, including spinner widgets for clothing slots, puppet preview rendering, and skin selection persistence.
tags: [ui, inventory, character, customization]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 90d81726
system_scope: ui
---

# Dressuppanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`DressupPanel` is a UI component that provides a character skin customization interface. It constructs and manages a set of `AnimSpinner` widgets for selecting base, body, hand, legs, and feet clothing options. It renders a character preview using a `Puppet` widget and synchronizes skin selections with the player profile. It supports both online and offline skin modes, adapting its layout and behavior based on available skin support. The panel integrates with `TheInventory`, `TheFrontEnd`, and the player profile system to manage and persist skin choices.

## Usage example
```lua
local DressupPanel = require "widgets/redux/dressuppanel"

local panel = DressupPanel(
    owner_screen,
    profile,
    playerdata,
    function() print("Skin changed") end,
    { "body" },  -- recent_item_types
    {},          -- recent_item_ids
    true         -- include_random_options
)
panel:SetCurrentCharacter("wilson")
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Uses tags internally via `TheInventory` and profile methods (e.g., event skin tags), but does not directly add/remove entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_screen` | widget | `nil` | Parent screen that owns this panel. |
| `profile` | Profile | `nil` | Profile object holding player skin data. |
| `playerdata` | table | `nil` | Player data table, may contain default skins. |
| `onChanged` | function | `nil` | Callback invoked when a skin is changed. |
| `recent_item_types` | table | `nil` | List of recently selected item types for focus. |
| `include_random_options` | boolean | `nil` | Whether to include "Random" and "Previous" skin options. |
| `currentcharacter` | string | `"wilson"` | Current character prefab name being customized. |
| `skins_list` | table | `{}` | Full list of available skins from inventory, sorted by type. |
| `clothing_options` | table | `{}` | Deduplicated clothing options for each slot, used for randomization. |
| `all_spinners` | table | `{}` | Array of all spinner widgets (`base`, `body`, `hand`, `legs`, `feet`). |
| `base_spinner`, `body_spinner`, `hand_spinner`, `legs_spinner`, `feet_spinner` | widget | `nil` | Individual spinner widgets for each clothing slot. |
| `puppet` | Puppet | `nil` | Character preview model. |
| `random_avatar` | Image | `nil` | Random avatar placeholder image (shown when character is `random`). |
| `repeat_time` | number | `nil` | Scroll repeat timer for focused spinner navigation. |

## Main functions
### `MakeSpinner(slot)`
* **Description:** Constructs and configures an `AnimSpinner` widget for a given clothing slot (`base`, `body`, `hand`, `legs`, `feet`). Sets up options, layout, glow effects, and the `new` indicator. Returns the spinner container widget.
* **Parameters:** `slot` (string) - clothing slot name.
* **Returns:** widget - Spinner group widget with `spinner`, `new_tag`, `glow`, and `GetItem()` function.
* **Error states:** None identified.

### `GetSkinOptionsForSlot(slot)`
* **Description:** Builds a list of available skin options for a given slot, including the default "none" option, sorted skins, and optionally random/previous options. Uses inventory data and profile timestamps to mark new items.
* **Parameters:** `slot` (string) - clothing slot name.
* **Returns:** table - Array of skin option tables, each containing `text`, `build`, `item`, `symbol`, `colour`, and `new_indicator`.

### `SetPuppetSkins(skip_change_emote)`
* **Description:** Updates the `puppet` preview to reflect the currently selected skins across all slots. Handles base skin and clothing items. Skips emote updates if `skip_change_emote` is `true`.
* **Parameters:** `skip_change_emote` (boolean) - Optional flag to skip emote changes.
* **Returns:** Nothing.

### `UpdatePuppet(skip_change_emote)`
* **Description:** Refreshes the puppet display. If `currentcharacter` is `"random"`, hides the puppet and shows the random avatar placeholder; otherwise, updates character and skins.
* **Parameters:** `skip_change_emote` (boolean) - Optional flag to skip emote updates.
* **Returns:** Nothing.

### `SetCurrentCharacter(character)`
* **Description:** Updates the `currentcharacter` and refreshes spinner options and puppet accordingly.
* **Parameters:** `character` (string) - Character prefab name.
* **Returns:** Nothing.

### `Reset(set_spinner_to_new_item)`
* **Description:** Resets all spinner selections to saved or default values based on profile data, recent items, or event skins. Triggers puppet update at the end.
* **Parameters:** `set_spinner_to_new_item` (boolean) - Whether to prioritize recent items for selection.
* **Returns:** Nothing.

### `GetSkinsForGameStart()`
* **Description:** Prepares the final skin selection for entering the game world. Resolves random selections and persists final values to profile. Returns a table `{base, body, hand, legs, feet}`.
* **Parameters:** None.
* **Returns:** table - Final skin assignments for the current character.

### `GetBaseSkin()`
* **Description:** Returns the currently selected base skin item and whether it is a random skin.
* **Parameters:** None.
* **Returns:** string, boolean - `item` and `is_random` (based on `base_spinner:GetItem()`).

### `SeparateAvatar()`
* **Description:** Modifies the layout to separate the puppet preview from the spinners for online/offline skin support. Adjusts positions, scales, and visibility of the background and spinners.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetClothingOptions()`
* **Description:** Populates `clothing_options` with deduplicated clothing lists for each slot, sourced from the profile.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnClose()`
* **Description:** Saves the current inventory modification timestamp as the dressup collection timestamp in the profile.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified. This component does not register or emit events directly via `inst:ListenForEvent` or `inst:PushEvent`. It uses callback functions (e.g., `onChanged`) and relies on UI framework events.