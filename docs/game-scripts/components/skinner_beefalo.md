---
id: skinner_beefalo
title: Skinner Beefalo
description: Manages equippable skin items (clothing) for beefalo entities and applies associated animation overrides.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 144d6ff8
---

# Skinner Beefalo

## Overview
This component handles the equipping, Unequipping, and visual representation of beefalo clothing/skins. It stores the currently equipped skin items by slot, provides methods to update and query them, and triggers animation overrides to render the equipped skins on the beefalo entity. It integrates with the animation system via `AnimState` to apply skin-specific symbol overrides and build overrides.

## Dependencies & Tags
- Requires the presence of an `AnimState` component on the entity (`inst.AnimState` must exist).
- Adds no component dependencies directly, but relies on external tables and functions:
  - `BEEFALO_CLOTHING` (lookup table for clothing definitions)
  - `BEEFALO_CLOTHING_SYMBOLS` (set of symbols potentially overridden by beefalo skins)
  - `BEEFALO_HIDE_SYMBOLS` (set of symbols to show by default)
  - `IsValidBeefaloClothing(name)`, `GetBuildForItem(name)`, `SetBeefaloSkinsOnAnim`, `SetBeefaloFaceSkinsOnAnim` (defined elsewhere)
- Emits the `"onclothingchanged"` event when clothing slots are modified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the parent entity (typically a beefalo). |
| `clothing` | `table` | `{ beef_body = "", beef_horn = "", beef_head = "", beef_feet = "", beef_tail = "", }` | Tracks currently equipped skin names indexed by slot type (`beef_body`, `beef_horn`, etc.). Empty strings indicate no skin equipped. |

## Main Functions
### `SetClothing(name)`
* **Description:** Equips a skin item to the appropriate slot based on `BEEFALO_CLOTHING[name].type`. Validates the item, updates the internal `clothing` table, triggers `"onclothingchanged"`, and re-applies all animation overrides.
* **Parameters:**  
  - `name` (`string`): The name of the clothing/skin item to equip (must be valid per `IsValidBeefaloClothing`).

### `GetClothing()`
* **Description:** Returns a copy of the current `clothing` table, mapping slot types to the names of equipped skins.
* **Parameters:** None.

### `IsClothingDifferent(newclothes)`
* **Description:** Compares the given `newclothes` table against the currently equipped clothing, returning `true` if any slot differs, `false` otherwise. Handles missing keys safely.
* **Parameters:**  
  - `newclothes` (`table`, optional): Table of clothing slot keys to skin names. Defaults to `{}` if omitted.

### `HideAllClothing(anim_state)`
* **Description:** Clears all skin symbol overrides (via `ClearOverrideSymbol`) for *all* currently equipped items on the given `AnimState`. Does not modify internal state or send events.
* **Parameters:**  
  - `anim_state` (`AnimState`): The animation state instance to clear overrides on.

### `ClearAllClothing()`
* **Description:** Resets all clothing slots to empty strings, fires `"onclothingchanged"` for each slot, and re-applies animation overrides. Effectively unequips all items.
* **Parameters:** None.

### `ClearClothing(type)`
* **Description:** Clears a specific clothing slot (e.g., `"beef_body"`), fires `"onclothingchanged"` for that slot, but does *not* re-apply animation overrides (assumes caller will do so).
* **Parameters:**  
  - `type` (`string`): The slot type to clear (e.g., `"beef_horn"`, `"beef_head"`).

### `ApplyTargetSkins(skins, player)`
* **Description:** Applies a full set of skins (via `AssignItemSkins`) from a `skins` table, then sequentially equips each item using `SetClothing`. Used when one entity skins another (e.g., via player action). Clears existing clothing first.
* **Parameters:**  
  - `skins` (`table`): Table with keys `beef_body`, `beef_feet`, `beef_horn`, `beef_tail`, `beef_head` containing skin item names. May include `nil` or empty strings.  
  - `player` (`Entity`): The player performing the operation; required to get `userid` for `AssignItemSkins`.

### `OnSave()`
* **Description:** Serializes the component's state for saving. Returns a table containing the `clothing` table.
* **Parameters:** None.

### `reloadclothing(clothing)`
* **Description:** Restores clothing state from a saved table (e.g., on world load or snapshot restore). Applies each item via `PushEvent("onclothingchanged")` and re-applies animation overrides.
* **Parameters:**  
  - `clothing` (`table` or `nil`): The clothing state to restore. If `nil`, no action is taken.

## Events & Listeners
- **Listens for:** None.
- **Emits:**
  - `"onclothingchanged"`: Triggered whenever a clothing slot is set, cleared, or reloaded. Payload: `{ type = "slot_name", name = "skin_name_or_empty_string" }`.