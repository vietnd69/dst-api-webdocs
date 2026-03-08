---
id: beefaloexplorerpanel
title: Beefaloexplorerpanel
description: A UI panel widget that allows players to browse, select, and manage beefalo clothing skins in the wardrobe screen.
tags: [ui, skin, inventory]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 62bf0869
system_scope: ui
---

# Beefaloexplorerpanel

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BeefaloExplorerPanel` is a UI widget that renders the beefalo clothing skin selection interface in the wardrobe screen. It manages a skin preview puppet, a category selector spinner, and an item explorer with filtering/sorting capabilities. It works with `ItemExplorer`, `FilterBar`, and `Puppet` components to provide interactive skin browsing and persistence via `user_profile`.

## Usage example
```lua
local BeefaloExplorerPanel = require "widgets/redux/beefaloexplorerpanel"
local panel = BeefaloExplorerPanel(owner_entity, user_profile)
panel:SetPosition(0, 0)
panel:OnShow() -- Activate and refresh the panel
```

## Dependencies & tags
**Components used:** None — this is a pure UI widget and does not use entity components via `inst.components.X`.
**Tags:** Adds no entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity that owns this panel (typically the player). |
| `user_profile` | UserProfile | `nil` | Profile object used to load/save saved skins. |
| `currentcharacter` | string | `"beefalo"` | The character tag for skin lookups. |
| `puppet` | Puppet | `nil` | Skin preview puppet instance. |
| `panel_selector` | Spinner | `nil` | Category spinner widget (head/horn/body/feet/tail). |
| `picker` | ItemExplorer | `nil` | Item explorer widget for the currently selected skin slot. |
| `filter_bar` | FilterBar | `nil` | Container for filters and search. |
| `selected_skins` | table | `{ beef_head = "beef_head_default1" }` | Map of skin keys by slot type (e.g., `beef_head`). |

## Main functions
### `_LoadSavedSkins()`
* **Description:** Loads the player's saved beefalo skins from `user_profile` and applies them to the puppet. Falls back to default skin if offline skins are unsupported.
* **Parameters:** None.
* **Returns:** Nothing.

### `SaveLoadout()`
* **Description:** Persists the current skin selections to `user_profile`.
* **Parameters:** None.
* **Returns:** Nothing.

### `:SetPanelIndex(index)`
* **Description:** Switches the `ItemExplorer` to display skins for a specific clothing slot (1–5) and initializes filter bar elements.
* **Parameters:** `index` (number) — 1: head, 2: horn, 3: body, 4: feet, 5: tail.
* **Returns:** Nothing.
* **Error states:** Returns early if the index matches the current picker index.

### `:TryToClickSelected()`
* **Description:** Automatically selects the currently saved skin in the picker's scroll list; falls back to the first `default1` skin if the saved skin is not present.
* **Parameters:** None.
* **Returns:** Nothing.

### `:Refresh()`
* **Description:** Re-applies filters and attempts to re-select the saved skin after a UI refresh (e.g., on panel show).
* **Parameters:** None.
* **Returns:** Nothing.

### `:OnShow()`
* **Description:** Hook called when the panel becomes visible; triggers `:Refresh()` and invokes base class logic.
* **Parameters:** None.
* **Returns:** Nothing.

### `:OnClickedItem(item_data, is_selected)`
* **Description:** Handles selection of a skin item in the explorer; delegates to `_SelectSkin`.
* **Parameters:**  
  `item_data` (table) — Skin item metadata including `item_key` and `is_owned`.  
  `is_selected` (boolean) — Whether the item is currently selected.  
* **Returns:** Nothing.

### `_SelectSkin(item_type, item_key, is_selected, is_owned)`
* **Description:** Updates `selected_skins` table with the chosen skin, applies it to the puppet, and saves the loadout.
* **Parameters:**  
  `item_type` (string) — Slot key (e.g., `"beef_head"`).  
  `item_key` (string) — Skin identifier.  
  `is_selected` (boolean) — Ignored.  
  `is_owned` (boolean) — Ignored.  
* **Returns:** Nothing.

### `:ApplySkinSet(skins)`
* **Description:** Replaces the entire `selected_skins` table with the provided set and applies them.
* **Parameters:** `skins` (table) — Full skin map (e.g., `{ beef_head = "x", ... }`).  
* **Returns:** Nothing.

### `_LoadSkinPresetsScreen()`
* **Description:** Opens the skin presets popup screen with the current loadout.
* **Parameters:** None.
* **Returns:** Nothing.

### `:GetHelpText()`
* **Description:** Returns controller-friendly help text for opening the skin presets menu (e.g., "A Skin Presets").
* **Parameters:** None.
* **Returns:** `string` — localized help text, or `""` if skins are unavailable.

### `:OnControl(control, down)`
* **Description:** Handles input (e.g., button press) to open the skin presets popup.
* **Parameters:**  
  `control` (Control) — Input control constant.  
  `down` (boolean) — Whether the control is pressed.  
* **Returns:** `boolean` — `true` if handled, `false` otherwise.

## Events & listeners
- **Listens to:** None — this widget handles events manually (e.g., via `OnShow`, `OnControl`, and spinner callbacks), not via `inst:ListenForEvent`.
- **Pushes:** None — no custom events are fired.