---
id: skinner
title: Skinner
description: Manages character skin and clothing appearance for entities, including skin type switching, clothing application, and skin synchronization between players.
tags: [appearance, network, player, clothing]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 4e221511
system_scope: player
---

# Skinner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `skinner` component handles character visual appearance in the game, including base skin selection, clothing items (body, hand, legs, feet), and skin type modes (e.g., normal_skin, wimpy_skin, ghost_skin, powerup). It coordinates with `AnimState` to apply skin and clothing overrides and syncs appearance data over the network via `Network:SetPlayerSkin`. It integrates closely with the `beard` component to synchronize beard skins.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("skinner")
inst.components.skinner:SetSkinName("wx78_none")
inst.components.skinner:SetClothing("tundra_axe")
inst.components.skinner:SetSkinMode("normal_skin")
```

## Dependencies & tags
**Components used:** `beard` (calls `SetSkin` and checks `is_skinnable`), `Network`, `AnimState`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity instance | — | Reference to the entity owning this component. |
| `skin_name` | string | `""` | Name of the currently selected base skin prefab. |
| `clothing` | table | `{ body = "", hand = "", legs = "", feet = "" }` | Stores equipped clothing item names per slot. |
| `skintype` | string | `"normal_skin"` | Current skin mode (e.g., `"normal_skin"`, `"ghost_skin"`, `"powerup"`). |
| `skin_data` | table | `{}` | Skin definitions extracted from the selected skin prefab. |
| `monkey_curse` | string or `nil` | `nil` | Monkey curse state (e.g., `"MONKEY_CURSE_1"`). |

## Main functions
### `SetSkinName(skin_name, skip_beard_setup, skip_skins_set)`
* **Description:** Sets the base skin by name, loads associated skin data, optionally updates linked beard skin, and reapplies full appearance.
* **Parameters:**  
  `skin_name` (string) — Name of the skin prefab (e.g., `"wx78_none"`). If empty or invalid, defaults to `prefab.."_none"`.  
  `skip_beard_setup` (boolean, optional) — If `true`, skips beard skin synchronization.  
  `skip_skins_set` (boolean, optional) — If `true`, skips reapplying skin/mode via `SetSkinMode`.
* **Returns:** Nothing.
* **Error states:** Emits an `"ERROR!!! Invisible werebeaver is probably about to happen!!!"` message if no `normal_skin` entry is found in `skin_data`.

### `SetSkinMode(skintype, default_build)`
* **Description:** Switches the skin type mode (e.g., wimpy_skin, mighty_skin, ghost_skin) and reapplies all visual layers (base skin and clothing).
* **Parameters:**  
  `skintype` (string, optional) — Skin mode to apply. Defaults to current `self.skintype`.  
  `default_build` (string, optional) — Fallback build name when no skin data exists.
* **Returns:** Nothing.
* **Notes:** Also triggers `base_change_cb` if defined and calls `Network:SetPlayerSkin` to sync appearance.

### `SetClothing(name)`
* **Description:** Equips a named clothing item, determining its slot from `CLOTHING[name].type`.
* **Parameters:**  
  `name` (string) — Name of the clothing prefab to equip (e.g., `"tundra_axe"`).
* **Returns:** Nothing.
* **Error states:** Does nothing if `IsValidClothing(name)` returns `false`.

### `GetClothing()`
* **Description:** Returns a summary of current skin and clothing state.
* **Returns:**  
  ```lua
  {
      base = string, -- current skin_name
      body = string, -- body slot
      hand = string, -- hand slot
      legs = string, -- legs slot
      feet = string, -- feet slot
  }
  ```

### `SetSkinMode(skintype, default_build)`
* **Description:** Switches the skin type mode (e.g., wimpy_skin, mighty_skin, ghost_skin) and reapplies all visual layers (base skin and clothing).
* **Parameters:**  
  `skintype` (string, optional) — Skin mode to apply. Defaults to current `self.skintype`.  
  `default_build` (string, optional) — Fallback build name when no skin data exists.
* **Returns:** Nothing.
* **Notes:** Also triggers `base_change_cb` if defined and calls `Network:SetPlayerSkin` to sync appearance.

### `SetMonkeyCurse(monkey_curse)`
* **Description:** Sets or updates the monkey curse state and reapplies skin/appearance.
* **Parameters:**  
  `monkey_curse` (string or `nil`) — Monkey curse identifier (e.g., `"MONKEY_CURSE_3"`), or `nil` to clear.
* **Returns:** Nothing.

### `ClearMonkeyCurse()`
* **Description:** Clears the monkey curse state and reapplies skin/appearance.
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearAllClothing()`
* **Description:** Removes all clothing items from all slots and reapplies appearance.
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearClothing(type)`
* **Description:** Removes clothing from a specific slot (`"body"`, `"hand"`, `"legs"`, `"feet"`) and reapplies appearance.
* **Parameters:**  
  `type` (string) — Clothing slot to clear (e.g., `"body"`).
* **Returns:** Nothing.

### `HideAllClothing(anim_state)`
* **Description:** Removes all clothing symbol overrides from the provided `AnimState` without modifying internal clothing state.
* **Parameters:**  
  `anim_state` (table) — `AnimState` instance to modify.
* **Returns:** Nothing.

### `CopySkinsFromPlayer(player)`
* **Description:** Copies all visual skin and clothing data from another player entity to this one (e.g., for duplicates or previews).
* **Parameters:**  
  `player` (Entity) — Source entity with a `skinner` component.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes current skin and clothing state for persistence.
* **Returns:**  
  ```lua
  {
      skin_name = string,
      clothing = table,
      monkey_curse = string or nil,
      skin_mode = string
  }
  ```

### `OnLoad(data)`
* **Description:** Restores skin and clothing state from `OnSave` data. Validates ownership during gameplay.
* **Parameters:**  
  `data` (table) — Serialized skin/clothing state from `OnSave()`.
* **Returns:** Nothing.
* **Notes:** Skips validation during snapshot loading. Clears clothing if ownership is lost.

### `GetSkinMode()`
* **Description:** Returns the current skin mode (`skintype`).
* **Returns:** string — Current skin type (e.g., `"normal_skin"`).

### `HasSpinnableTail()`
* **Description:** Determines whether the entity’s tail is spinnable based on skin and clothing choices.
* **Parameters:** None.
* **Returns:** boolean — `true` if tail is spinnable, `false` otherwise.
* **Notes:** Includes heuristic checks for `wortox` prefabs and clothing symbols.

## Events & listeners
- **Pushes:**  
  - `"equipskinneditem"` — Fired when a new clothing item is equipped (includes item name).  
  - `"unequipskinneditem"` — Fired when clothing is unequipped (includes old item name).  
- **Listens to:** None identified.
