---
id: loadoutselect_hermitcrab
title: Loadoutselect Hermitcrab
description: Manages the loadout selection UI for the Hermitcrab character in the lobby screen, including skin preview, selection, and persistence.
tags: [ui, skin, loadout, hermitcrab]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b486f1f1
system_scope: ui
---

# Loadoutselect Hermitcrab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LoadoutSelect_hermitcrab` is a UI widget responsible for rendering and managing the character loadout interface specifically for the Hermitcrab character in the lobby. It displays a puppet preview with skins, provides access to the clothing explorer panel for selecting skins, handles currency display (doodads), and persists selected loadouts via the user profile. It interacts closely with `ClothingExplorerPanel`, `Subscreener`, and `Puppet` components to manage skin visualization and user interaction.

## Usage example
```lua
local LoadoutSelectHermitcrab = require "widgets/redux/loadoutselect_hermitcrab"
local widget = LoadoutSelectHermitcrab(user_profile, initial_skins, filter, owner_player)
self:AddChild(widget)
widget:SetDefaultMenuOption()
```

## Dependencies & tags
**Components used:** None (it is a widget, not an entity component; uses `Puppet`, `ClothingExplorerPanel`, `Subscreener`, and `TEMPLATES` internally).
**Tags:** none identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_player` | table / userdata | `nil` | Player instance that owns this loadout UI. |
| `user_profile` | table | `nil` | User profile object used to load/save skin selections. |
| `filter` | table | `nil` | Filter configuration passed to `ClothingExplorerPanel`. |
| `currentcharacter` | string | `"hermitcrab"` | Character identifier for this loadout panel. |
| `initial_skins` | table | `{}` | Initial skins to load before saved skins are retrieved. |
| `loadout_root` | Widget | `nil` | Root container widget for all loadout UI elements. |
| `puppet_root` | Widget | `nil` | Container for the puppet and visual decoration. |
| `glow`, `pearl_mirror`, `pearl_clothesrack`, `puppet_nameplate` | Image | `nil` | Decorative background images for the lobby. |
| `puppet` | Puppet | `nil` | Puppet instance used to render skin visuals. |
| `doodad_count` | Widget | `nil` | Doodad (currency) counter display, only present in online mode. |
| `subscreener` | Subscreener | `nil` | Menu controller for skin explorer tabs (present only if skins are allowed). |
| `selected_skins` | table | `{}` | Currently selected skins for saving to profile. |
| `preview_skins` | table | `{}` | Currently previewed skins (may include unowned items). |
| `button_base` | Widget | `nil` | Base skin selection button. |
| `menu` | Widget | `nil` | Standard menu widget containing skin selection buttons. |

## Main functions
### `SetDefaultMenuOption()`
*   **Description:** Sets the default active subscreen to `"base"` in the subscreener (if initialized).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_CycleView(reset)`
*   **Description:** Placeholder stub; intended for cycling between viewport views (e.g., front/side profile), but currently unimplemented.
*   **Parameters:** `reset` (boolean) — not used in current implementation.
*   **Returns:** Nothing.

### `_MakeMenu(subscreener)`
*   **Description:** Builds and returns the menu for the subscreener. Creates the `"base"` wardrobe button and initializes a `StandardMenu` with a single item.
*   **Parameters:** `subscreener` (Subscreener) — parent subscreener instance.
*   **Returns:** Widget — the created standard menu.

### `_SaveLoadout()`
*   **Description:** Persists the current `selected_skins` to `user_profile` for `hermitcrab` if skins are allowed (online or offline-skin-enabled).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ApplySkinPresets(skins)`
*   **Description:** Applies skin presets passed from an external source (e.g., lobby defaults). Ensures a base skin is set for vanilla characters, validates items, and refreshes the UI.
*   **Parameters:** `skins` (table) — skin mapping (e.g., `{base = "some_skin"}`).
*   **Returns:** Nothing.

### `_LoadSavedSkins()`
*   **Description:** Loads skin selections from `user_profile` or sets a default `hermitcrab_none` if skins are disabled. Copies `initial_skins` into `preview_skins` and `selected_skins`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_RefreshAfterSkinsLoad()`
*   **Description:** Refreshes the `ClothingExplorerPanel` inventory and applies skins to the puppet. Called after skins are loaded or updated.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_SelectSkin(item_type, item_key, is_selected, is_owned)`
*   **Description:** Handles skin selection in the explorer panel. Updates `preview_skins` (for previewing unowned items) and `selected_skins` (for owned, selected items), then updates the puppet and UI menu.
*   **Parameters:**
    *   `item_type` (string) — skin category (e.g., `"base"`).
    *   `item_key` (string) — skin identifier.
    *   `is_selected` (boolean) — whether the item is currently selected.
    *   `is_owned` (boolean) — whether the player owns the item.
*   **Returns:** Nothing.

### `_ApplySkins(skins, skip_change_emote)`
*   **Description:** Applies the provided `skins` to the `puppet`. Normalizes `"hermitcrab_none"` to `"hermitcrab_build"` for the base skin before passing to `Puppet:SetSkins()`.
*   **Parameters:**
    *   `skins` (table) — skin mapping (e.g., `{base = "skin_name"}`).
    *   `skip_change_emote` (boolean) — if true, suppresses emote changes (currently unused in the `Puppet` call).
*   **Returns:** Nothing.

### `_UpdateMenu(skins)`
*   **Description:** Updates the base skin button label to reflect the currently selected `"base"` skin in `skins`.
*   **Parameters:** `skins` (table) — skin mapping containing the `"base"` key.
*   **Returns:** Nothing.

### `RefreshInventory(animateDoodad)`
*   **Description:** Updates the doodad counter display with the current player currency amount.
*   **Parameters:** `animateDoodad` (boolean) — whether to animate the counter update.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Stub for frame-based updates (currently unused; puppet emote update is commented out).
*   **Parameters:** `dt` (number) — delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.