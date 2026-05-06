---
id: skinner
title: Skinner
description: Manages character skin appearance, clothing slots, and visual customization for player entities.
tags: [appearance, clothing, skins]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 07d95e9f
system_scope: entity
---

# Skinner

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`Skinner` manages all visual customization for character entities, including base skins, clothing items across four equipment slots (body, hand, legs, feet), and special states like monkey curse transformations. It coordinates with the `AnimState` to apply symbol overrides and build swaps, handles skin data loading from prefab definitions, and synchronizes appearance across the network. This component is essential for any player or skinnable NPC entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("skinner")

-- Set base skin
inst.components.skinner:SetSkinName("wilson_default", false, false)

-- Equip clothing items
inst.components.skinner:SetClothing("winter_hat")
inst.components.skinner:SetClothing("winter_coat")

-- Check current appearance
local clothing = inst.components.skinner:GetClothing()
print(clothing.body) -- prints equipped body clothing name

-- Handle monkey curse transformation
inst.components.skinner:SetMonkeyCurse("MONKEY_CURSE_1")
```

## Dependencies & tags
**External dependencies:**
- `CLOTHING` -- global table containing clothing item definitions and symbol overrides
- `SKIN_TYPES_THAT_RECEIVE_CLOTHING` -- list of skin types that can wear clothing
- `TheInventory:CheckClientOwnership()` -- validates player ownership of skins/clothing
- `Prefabs` -- accesses skin prefab data for skin_data population
- `AwardPlayerAchievement()` -- triggers achievements when equipping clothing

**Components used:**
- `beard` -- applies matching beard skin when `SetSkinName()` is called (if `is_skinnable`)
- `AnimState` -- applies all skin and clothing symbol overrides via `SetSkinsOnAnim()`
- `Network` -- replicates skin data to clients via `SetPlayerSkin()`

**Tags:**
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `skin_name` | string | `""` | The base skin prefab name for this entity. |
| `clothing` | table | `{body="", hand="", legs="", feet=""}` | Table holding equipped clothing item names per slot. |
| `skintype` | string | `"normal_skin"` | Current skin mode (e.g., `normal_skin`, `ghost_skin`, `wimpy_skin`). |
| `monkey_curse` | string/nil | `nil` | Active monkey curse level (`MONKEY_CURSE_1/2/3`) or nil. |
| `skin_data` | table | `{}` | Populated from skin prefab's `skins` table during `SetSkinName()`. |
| `base_change_cb` | function/nil | `nil` | Callback fired when base skin changes via `SetSkinMode()`. |

## Main functions
### `SetSkinsOnAnim(anim_state, prefab, base_skin, clothing_names, monkey_curse, skintype, default_build)`
* **Description:** Static helper function that applies all skin and clothing visual overrides to an `AnimState`. Handles symbol overrides, build swaps, cuff sizes, torso tucking, and special cases for Wolfgang forms, Wormwood stages, Wurt powerup, and Wanda age states.
* **Parameters:**
  - `anim_state` -- AnimState component to modify
  - `prefab` -- string prefab name of the character
  - `base_skin` -- string base skin build name
  - `clothing_names` -- table of clothing item names per slot
  - `monkey_curse` -- string curse level or nil
  - `skintype` -- string skin mode identifier
  - `default_build` -- string fallback build name
* **Returns:** None
* **Error states:** Errors if `anim_state` is nil or missing required methods (`SetSkin`, `OverrideSkinSymbol`, etc.).

### `HasSpinnableTail()`
* **Description:** Determines if the current skin and clothing configuration supports a spinnable tail animation. Checks base skin (Wortox), clothing overrides, and symbol replacements.
* **Parameters:** None
* **Returns:** `true` if tail should spin, `false` otherwise.
* **Error states:** None

### `GetSkinMode()`
* **Description:** Returns the current skin type/mode string.
* **Parameters:** None
* **Returns:** String skin mode (e.g., `"normal_skin"`, `"ghost_skin"`).
* **Error states:** None

### `SetSkinMode(skintype, default_build)`
* **Description:** Changes the skin mode and reapplies all visual overrides. Triggers `base_change_cb` if set and updates network replication. If skin_data is nil, automatically initializes it by calling SetSkinName() with prefab_none skin.
* **Parameters:**
  - `skintype` -- string skin mode (uses current `self.skintype` if nil)
  - `default_build` -- string fallback build name (optional)
* **Returns:** None
* **Error states:** None

### `SetupNonPlayerData()`
* **Description:** Configures this entity as a non-player character by setting `skin_name` to `"NON_PLAYER"` and skin mode to `"NO_BASE"`.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `IsNonPlayer()`
* **Description:** Checks if this entity is marked as a non-player via `SetupNonPlayerData()`.
* **Parameters:** None
* **Returns:** `true` if `skin_name == "NON_PLAYER"`, `false` otherwise.
* **Error states:** None

### `SetSkinName(skin_name, skip_beard_setup, skip_skins_set)`
* **Description:** Sets the base skin prefab name, populates `skin_data` from prefab definition, optionally applies matching beard skin, and triggers `SetSkinMode()`.
* **Parameters:**
  - `skin_name` -- string skin prefab name (uses `prefab_none` if empty)
  - `skip_beard_setup` -- boolean to skip beard component skin assignment
  - `skip_skins_set` -- boolean to skip calling `SetSkinMode()`
* **Returns:** None
* **Error states:** Prints error if `skin_data.normal_skin` is nil after loading (indicates missing skin data).

### `SetMonkeyCurse(monkey_curse)`
* **Description:** Sets the monkey curse level and reapplies skin mode to update visual overrides (monkey body parts).
* **Parameters:** `monkey_curse` -- string curse level (`MONKEY_CURSE_1/2/3`) or nil
* **Returns:** None
* **Error states:** None

### `GetMonkeyCurse()`
* **Description:** Returns the current monkey curse level.
* **Parameters:** None
* **Returns:** String curse level or `nil` if no curse active.
* **Error states:** None

### `ClearMonkeyCurse()`
* **Description:** Removes the monkey curse and reapplies skin mode.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetClothing(name)`
* **Description:** Equips a clothing item by determining its slot type from `CLOTHING` definition and calling internal setter.
* **Parameters:** `name` -- string clothing item prefab name
* **Returns:** None
* **Error states:** Silently ignores invalid clothing names (fails `IsValidClothing()` check).

### `GetClothing()`
* **Description:** Returns a table containing the base skin name and all equipped clothing slots.
* **Parameters:** None
* **Returns:** Table with keys `base`, `body`, `hand`, `legs`, `feet`.
* **Error states:** None

### `HideAllClothing(anim_state)`
* **Description:** Clears all clothing symbol overrides from the given `AnimState` without modifying internal clothing table.
* **Parameters:** `anim_state` -- AnimState component to modify
* **Returns:** None
* **Error states:** Errors if `anim_state` is nil or missing `ClearOverrideSymbol()` method.

### `ClearAllClothing()`
* **Description:** Removes all equipped clothing items from all slots and reapplies skin mode.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ClearClothing(type)`
* **Description:** Removes clothing from a specific slot and reapplies skin mode.
* **Parameters:** `type` -- string slot name (`body`, `hand`, `legs`, or `feet`)
* **Returns:** None
* **Error states:** None

### `CopySkinsFromPlayer(player, nocurses)`
* **Description:** Copies all skin and clothing data from another player entity, including monkey curse state. Used for character selection preview or skin transfer.
* **Parameters:**
  - `player` -- source player entity with `skinner` component
  - `nocurses` -- boolean to skip copying monkey curse (default copies curse)
* **Returns:** None
* **Error states:** Errors if `player` has no `skinner` component or `player.userid` is invalid for `AssignItemSkins()`.

### `OnSave()`
* **Description:** Returns save data table containing skin name, clothing, monkey curse, and skin mode for persistence.
* **Parameters:** None
* **Returns:** Table with keys `skin_name`, `clothing`, `monkey_curse`, `skin_mode`.
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores skin and clothing data from save. Validates clothing ownership if in-game and user is logged in. Handles `NON_PLAYER` skin name special case.
* **Parameters:** `data` -- table from `OnSave()` containing skin/clothing data
* **Returns:** None
* **Error states:** May clear clothing slots if `TheInventory:CheckClientOwnership()` fails during load (items traded away).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:**
  - `unequipskinneditem` -- fired when clothing is removed from a slot (parameter: clothing name)
  - `equipskinneditem` -- fired when clothing is equipped to a slot (parameter: clothing name)