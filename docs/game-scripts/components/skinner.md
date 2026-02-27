---
id: skinner
title: Skinner
description: Manages character appearance by applying skins and clothing via the animation system.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 4e221511
---

# Skinner

## Overview
The `Skinner` component manages the visual appearance of entities—primarily characters—in Don't Starve Together. It handles skin selection, clothing application, and dynamic adjustments to animation states based on skin type, character preferences, and equipped items. It integrates closely with the `AnimState` system to control symbol overrides, hide/show logic, render order, and build fallbacks, ensuring correct visual layering and compatibility across characters and mods.

## Dependencies & Tags
- `self.inst.AnimState` — Required for applying skins and clothing via `SetSkin`, `OverrideSkinSymbol`, and related methods.
- Adds tag `skinnable` to the entity implicitly (used elsewhere, e.g., beard compatibility).
- Interacts with:
  - `CLOTHING` global table (clothing definitions)
  - `CLOTHING_SYMBOLS`, `HIDE_SYMBOLS`, `SKIN_TYPES_THAT_RECEIVE_CLOTHING`, `BASE_*`, `ONE_PIECE_SKIRT` global tables and constants.
- Relies on components:
  - `beard` (optional; used for linked beard skins)
  - `network` (via `inst.Network:SetPlayerSkin`)
- Uses events:
  - `"unequipskinneditem"` and `"equipskinneditem"` when clothing is changed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *none* | Reference to the entity the component is attached to. |
| `skin_name` | `string` | `""` | The currently active base skin name (e.g., `"wolfgang_normal_skin"`). `"NON_PLAYER"` for non-player entities. |
| `clothing` | `table` | `{ body = "", hand = "", legs = "", feet = "" }` | Holds the currently equipped clothing items per slot (`body`, `hand`, `legs`, `feet`). |
| `skintype` | `string` | `"normal_skin"` | Current skin mode, used to select appropriate symbol overrides (e.g., `"wimpy_skin"`, `"mighty_skin"`, `"ghost_skin"`, `"stage_2"`, `"powerup"`, `"old_skin"`, `"NO_BASE"`). |
| `skin_data` | `table` | `nil` | Stores per-skin build overrides extracted from the skin prefab’s `skins` field. |
| `monkey_curse` | `string?` | `nil` | Optional monkey curse level (e.g., `"MONKEY_CURSE_1"`), which affects tail/foot/hand visibility. |

## Main Functions

### `SetSkinsOnAnim(anim_state, prefab, base_skin, clothing_names, monkey_curse, skintype, default_build)`
* **Description:** Applies the specified skin and clothing to the given `AnimState` by setting base skins, overriding symbols, managing hide/show logic, render order (via symbol exchanges), and special-case handling (e.g., Wolfgang’s body types, wormwood stages, skirts, boots). This is the core function responsible for the final appearance.
* **Parameters:**
  - `anim_state` (`AnimState`): The animation state to modify.
  - `prefab` (`string`): The prefab name of the entity (e.g., `"wolfgang"`, `"wormwood"`).
  - `base_skin` (`string`): The base skin build to use for unclothed parts.
  - `clothing_names` (`table`): Map of `{ body = ..., hand = ..., legs = ..., feet = ... }` with clothing asset names.
  - `monkey_curse` (`string?`): Monkey curse level, if any (applies monkey tail/hand/foot overrides).
  - `skintype` (`string`): Current skin mode, used to choose character/skin-specific overrides.
  - `default_build` (`string`): Fallback build name if no skin data is available.

### `HasSpinnableTail()`
* **Description:** Determines whether the character’s tail can be spun (e.g., for Wortox or clothing with `spinnable_tail = true`). Also handles overrides when clothing hides or replaces the tail.
* **Returns:** `boolean` — Whether the tail is spinnable.

### `GetSkinMode()`
* **Description:** Returns the current skin mode (`skintype`).
* **Returns:** `string`

### `SetSkinMode(skintype, default_build)`
* **Description:** Sets the skin mode (e.g., `"ghost_skin"`, `"normal_skin"`), rebuilds the `skin_data` lookup, and calls `SetSkinsOnAnim` to update appearance. Also syncs to the network via `SetPlayerSkin`.
* **Parameters:**
  - `skintype` (`string?`): Skin mode to switch to. Defaults to current `skintype` if omitted.
  - `default_build` (`string?`): Fallback build if `skin_data[skintype]` is missing.

### `SetupNonPlayerData()`
* **Description:** Initializes the component for non-player entities (e.g., NPCs) with `skin_name = "NON_PLAYER"` and sets skin mode to `"NO_BASE"`.

### `SetSkinName(skin_name, skip_beard_setup, skip_skins_set)`
* **Description:** Assigns a base skin by name (e.g., `"wolfgang_normal"`). Loads skin data from `Prefabs[skin_name].skins`, optionally configures linked beard, and optionally triggers a full skin rebuild.
* **Parameters:**
  - `skin_name` (`string`): Skin prefab name. Empty string defaults to `"{prefab}_none"`.
  - `skip_beard_setup` (`boolean?`): If true, skips beard linkage.
  - `skip_skins_set` (`boolean?`): If true, skips calling `SetSkinMode()`.

### `SetClothing(name)`
* **Description:** Equips a clothing item by name, validates it, and updates the internal clothing map. Automatically calls `SetSkinMode()` to re-render.
* **Parameters:**
  - `name` (`string`): Clothing asset name (must be valid per `IsValidClothing`).

### `GetClothing()`
* **Description:** Returns a table with the currently equipped base skin and clothing per slot.
* **Returns:**
  ```lua
  { base = ..., body = ..., hand = ..., legs = ..., feet = ... }
  ```

### `HideAllClothing(anim_state)`
* **Description:** Clears all clothing symbol overrides on the provided `anim_state` without clearing the internal clothing state.
* **Parameters:**
  - `anim_state` (`AnimState`): Animation state to modify.

### `ClearAllClothing()`
* **Description:** Removes all clothing (sets all slots to `""`) and rebuilds appearance via `SetSkinMode()`.

### `ClearClothing(type)`
* **Description:** Removes clothing from a specific slot (`body`, `hand`, `legs`, `feet`) and rebuilds appearance.
* **Parameters:**
  - `type` (`string`): Clothing slot to clear.

### `CopySkinsFromPlayer(player)`
* **Description:** Copies all skin/clothing state—including base skin, clothing, monkey curse, and skin mode—from another player. Handles character-specific overrides and syncs via `SetSkinsOnAnim`.
* **Parameters:**
  - `player` (`Entity`): The source player entity.

### `OnSave()`
* **Description:** Returns a serializable table containing current skin/clothing state for saving.
* **Returns:**
  ```lua
  { skin_name = ..., clothing = ..., monkey_curse = ..., skin_mode = ... }
  ```

### `OnLoad(data)`
* **Description:** Restores skin/clothing state from saved data. Validates clothing ownership (if in-game), handles legacy saves, and re-applies appearance via `SetSkinName`.
* **Parameters:**
  - `data` (`table`): Save data output from `OnSave()`.

## Events & Listeners
- **Emits Events:**
  - `"unequipskinneditem"` — pushed when unequipping clothing (during `SetClothing` and `Clear*`).
  - `"equipskinneditem"` — pushed when equipping clothing.
- **No event listeners** — the component does not listen for external events; it reacts internally to property/state changes.