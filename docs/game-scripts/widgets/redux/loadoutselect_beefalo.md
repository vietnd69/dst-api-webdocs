---
id: loadoutselect_beefalo
title: Loadoutselect Beefalo
description: Manages the UI and logic for selecting, previewing, and applying skin loadouts for Beefalo characters in the lobby and character customization screens.
tags: [ui, skin, character, customization, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 7a194d57
system_scope: ui
---

# Loadoutselect Beefalo

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LoadoutSelect_beefalo` is a UI widget responsible for rendering the Beefalo skin customization interface. It manages the selection, preview, and saving of skins for Beefalo-equipped characters. It integrates with the `ClothingExplorerPanel`, `Subscreener`, and `BeefaloSkinPresetsPopup` to provide a structured, skin-slot-based workflow. The component validates skin availability against event restrictions (e.g., YOTB), updates the visual puppet representation via `Puppet`, and persists loadouts to the user profile. It only operates when offline skin support is enabled or the game is running in online mode.

## Usage example
```lua
local LoadoutSelect_beefalo = require("widgets/redux/loadoutselect_beefalo")

-- Typically instantiated internally by a larger UI container
local loadout_widget = LoadoutSelect_beefalo(
    user_profile,
    character_inst,
    initial_skins,
    filter_table,
    owner_player
)

-- Set the default tab on open (optional)
loadout_widget:SetDefaultMenuOption()
```

## Dependencies & tags
**Components used:** `user_profile` (for skin persistence), `TheInventory` (for currency display), `TheNet`, `TheFrontEnd`, `TheInput`, `character.replica.named`
**Tags:** Checks `user_profile` for skin ownership and event permissions; no tags are added to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner_player` | PlayerPlayer or nil | `nil` | The owning player entity, used for event permission checks (e.g., `yotb_skins_sets`). |
| `user_profile` | UserProfile | `nil` | User profile object to load and save skin loadouts. |
| `filter` | table | `nil` | Filters applied when displaying skins (e.g., `yotb_filter`). |
| `currentcharacter` | string | `""` | Prefab name of the current character (e.g., `"beefalo"`). |
| `currentcharacter_inst` | Entity | `nil` | The entity instance of the current character. |
| `initial_skins` | table | `{}` | Initial skins to use when loading (e.g., from a pending draft). |
| `selected_skins` | table | `{}` | Actual permanently selected skins, persisted to `user_profile`. |
| `preview_skins` | table | `{}` | Temporarily selected skins used for live preview. |
| `loadout_root` | Widget | `nil` | Root container for all UI elements. |
| `puppet` | Puppet | `nil` | Visual representation of the Beefalo with applied skins. |
| `subscreener` | Subscreener | `nil` | Menu manager for tabbed skin-slot selection. |
| `doodad_count` | DoodadCounter | `nil` | Displays current doodad (currency) balance. |
| `puppet_base_offset` | `{number, number}` | `{ -20, -60 }` | Default position offset for the puppet. |
| `puppet_default_scale` | number | `4.5` | Default scale factor for the puppet. |

## Main functions
### `SetDefaultMenuOption()`
* **Description:** Selects the default skin-slot tab (`beef_body`) when the widget opens.
* **Parameters:** None.
* **Returns:** Nothing.

### `:RefreshInventory(animateDoodad)`
* **Description:** Updates the doodad (currency) counter to reflect the latest inventory balance.
* **Parameters:** `animateDoodad` (boolean, optional) — whether to animate the counter change.
* **Returns:** Nothing.

### `:GetHelpText()`
* **Description:** Returns the localized help text displayed in the HUD for available controls (e.g., skin presets button).
* **Parameters:** None.
* **Returns:** `string` — Help text string, or empty string if skins are unavailable.

### `:OnUpdate(dt)`
* **Description:** Called every frame; currently unused (emote update logic is commented out).
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `:OnControl(control, down)`
* **Description:** Handles control inputs (keyboard/controller). Triggers the skin presets popup for the `CONTROL_SKIN_PRESETS` action when skins are allowed.
* **Parameters:** 
  * `control` (string) — Control constant (e.g., `"CONTROL_SKIN_PRESETS"`).
  * `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `boolean` — `true` if the event was handled, `false` otherwise.

### `:ApplySkinPresets(skins)`
* **Description:** Applies a full preset loadout, filling in default skins where missing, validating skins, and updating preview and selected states.
* **Parameters:** `skins` (table) — A table of skin slot → skin key mappings (e.g., `{ beef_body = "my_skin" }`).
* **Returns:** Nothing.
* **Error states:** Will assign fallback default skins for missing slots; no skins are applied if `ValidateItemsLocal` or `ValidatePreviewItems` reject the preset.

### `:YOTB_event_check(skin)`
* **Description:** Checks if a given skin is accessible under the current YOTB (Year of the Beefalo) event status.
* **Parameters:** `skin` (string) — Skin key to check.
* **Returns:** `boolean` — `true` if the skin is accessible, `false` if it belongs to an unowned YOTB costume set.

### `:SaveLoadout()`
* **Description:** Persists the current `selected_skins` to `user_profile` (if skins are allowed).
* **Parameters:** None.
* **Returns:** Nothing.

### `:LoadSkinPresetsScreen()`
* **Description:** Opens the `BeefaloSkinPresetsPopup` screen for loading and saving presets.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** 
  - Events triggered to `self.owner_player` are not explicitly shown, but skin presets callbacks invoke external functions (e.g., `ApplySkinPresets`).
- **Listens to:** 
  - None explicitly. The component relies on external systems (e.g., `Subscreener`, `ClothingExplorerPanel`) to handle internal events like selection changes.