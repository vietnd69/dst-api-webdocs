---
id: craftingmenu_skinselector
title: Craftingmenu Skinselector
description: Manages skin selection UI for crafting recipes, displaying available skins and syncing selection with the crafting menu.
tags: [crafting, ui, inventory, skins]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 94bda5b5
system_scope: ui
---

# Craftingmenu Skinselector

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkinSelector` is a UI widget responsible for rendering and managing the skin selection interface within the crafting menu. It displays a spinner control to switch between different visual skins for a crafted item, based on owned unlockables and event availability. It integrates with `TheInventory` to query skin ownership and uses `RecipeTile.sSetImageFromRecipe` to update the preview image when the selection changes.

## Usage example
```lua
local SkinSelector = require "widgets/redux/craftingmenu_skinselector"
local selector = SkinSelector(recipe, owner, nil)
selector:SetPosition(x, y)
root:AddChild(selector)
-- Selection can be changed via spinner controls or programmatically:
selector:SelectSkin("my_custom_skin")
if selector:HasSkins() then
    -- Use selector:GetItem() to get the currently selected skin item
    local selected_skin = selector:GetItem()
end
```

## Dependencies & tags
**Components used:** None (widget only; uses global systems `TheInventory`, `Profile`, `TheNet`, `SKINS_EVENTLOCK`, `PREFAB_SKINS`, `HIDE_SKIN_DECORATIONS`, `DEFAULT_SKIN_COLOR`, `BROWN`, `UIFONT`, `STRINGS.UI.CRAFTING.DEFAULT`, `VIRTUAL_CONTROL_INV_ACTION_LEFT`, `VIRTUAL_CONTROL_INV_ACTION_RIGHT`, `GetSkinName`, `GetColorForItem`, `GetSkinInvIconName`, `IsSpecialEventActive`)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `recipe` | table | `nil` | The recipe being configured (contains product, imagefn, etc.) |
| `owner` | entity | `nil` | Owner entity (not actively used beyond storage) |
| `skins_list` | table | `nil` | List of owned skin data (includes item name, timestamp, skin_custom) |
| `skins_options` | table | `nil` | List of spinner option structures (text, image, colour, new_indicator) |
| `spinner` | Spinner | `nil` | Main UI spinner widget |
| `spinner_bg` | Image | `nil` | Background image behind spinner |
| `line_top` | Image | `nil` | Top horizontal separator line |
| `line_bottom` | Image | `nil` | Bottom horizontal separator line |
| `new_tag` | Image | `nil` | "NEW" label shown for newly acquired skins |
| `focus_forward` | Widget | `self.spinner` | Forward focus to the spinner for controller navigation |
| `spinner_has_named_skins` | boolean | `false` | Whether any skins have custom names |
| `onlyskins` | boolean | `false` | Flag set if only skins (no default) are allowed for this recipe |

## Main functions
### `GetItem()`
* **Description:** Returns the currently selected skin item name, or `nil` if default or invalid.
* **Parameters:** None.
* **Returns:** `string` (skin item prefab name) or `nil`.
* **Error states:** Returns `nil` when `self.onlyskins` is `false` and the selected index is `1` (default).

### `GetIndexForSkin(skin)`
* **Description:** Maps a skin item name to its 1-based spinner index.
* **Parameters:** `skin` (string) – the skin prefab name to find.
* **Returns:** `number` – spinner index (offset by 1 unless `self.onlyskins` is `true`), or `1` if not found.

### `SelectSkin(skin_name)`
* **Description:** Sets the spinner to the index corresponding to the given skin name.
* **Parameters:** `skin_name` (string or `nil`) – skin prefab name; `nil` selects the first/default option.
* **Returns:** Nothing.

### `HasSkins()`
* **Description:** Indicates whether multiple skin options are available for selection.
* **Parameters:** None.
* **Returns:** `boolean` – `true` if more than one option exists in `self.skins_options`.

### `GetSkinsList()`
* **Description:** Queries inventory and PREFAB_SKINS to build a list of currently owned skins for the recipe's product.
* **Parameters:** None.
* **Returns:** `table` – list of `{ type, item, timestamp, skin_custom? }` entries for owned skins that meet unlock/event conditions.
* **Error states:** May return an empty list if no skins are owned, locked, or unsupported.

### `GetSkinOptions()`
* **Description:** Builds the full spinner options list, including default and all unlocked skins.
* **Parameters:** None.
* **Returns:** `table` – list of `{ text, data, colour, image?, new_indicator? }` option tables.
* **Error states:** May include only the default option if no skins are unlocked or event-locked.

### `OnControl(control, down)`
* **Description:** Forwards controller input to the internal spinner.
* **Parameters:** 
  * `control` (number) – virtual control ID.
  * `down` (boolean) – whether the control was pressed.
* **Returns:** `boolean` – `true` if input was consumed by spinner, else `false`.

### `RefreshControllers(controller_mode)`
* **Description:** Updates spinner controller bindings based on input mode (keyboard/gamepad).
* **Parameters:** `controller_mode` (number) – active controller mode constant.
* **Returns:** Nothing.

## Events & listeners
* **Listens to:** None.
* **Pushes:** None.