---
id: wanda
title: Wanda
description: Manages Wanda's dynamic aging system, which dynamically adjusts her health, hunger, sanity, combat stats, and appearance based on her current health percentage.
tags: [player, aging, combat, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: caf6c65e
system_scope: player
---

# Wanda

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wanda` prefab implements the core logic for Wanda’s unique aging mechanic in DST. As Wanda’s health fluctuates, she transitions between three age states: *young*, *normal*, and *old*. These transitions dynamically modify her physical appearance (skin), movement/build speed, Hammer effectiveness, Sanity gain multiplier, maximum health/hunger/sanity, and special behaviors (e.g., Pocket Watch recall, shadow item damage, and warp distance). It leverages the `oldager`, `positionalwarp`, `staffsanity`, `skinner`, and `combat` components to achieve this behavior.

Key dependencies include:
- `oldager`: Handles age-based damage calculation (aging is treated inversely to health).
- `positionalwarp`: Manages the Pocket Watch warp-back system with varying history cache sizes per age state.
- `skinner`: Updates Wanda’s character model based on `overrideskinmode`.
- `staffsanity`: Applies health-state-dependent Sanity modifiers.
- `combat`: Applies health-state-dependent damage multipliers and visual effects for shadow weapons.

## Usage example
This is not a reusable component. It is instantiated automatically via `MakePlayerCharacter("wanda", ...)` in `prefabs/player_common.lua`. However, modders may observe its behavior through events and component interactions.

```lua
-- Example of observing Wanda's age transitions (typically done in a mod)
local function onWandaAgeChange(inst, data)
    print("Wanda is now " .. (inst.age_state or "unknown"))
end

inst:ListenForEvent("becomeolder_wanda", onWandaAgeChange)
inst:ListenForEvent("becomeyounger_wanda", onWandaAgeChange)
```

## Dependencies & tags
**Components used:**  
`oldager`, `positionalwarp`, `staffsanity`, `skinner`, `combat`, `health`, `hunger`, `sanity`, `inventory`, `foodaffinity`, `talker`, `rider`

**Tags added:**  
`clockmaker`, `pocketwatchcaster`, `health_as_oldage`  
(in non-Lua Dedicated environments only: `quagmire_shopper` when in Quagmire mode)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `age_state` | string | `nil` → `"normal"` after spawn | Current age state: `"young"`, `"normal"`, or `"old"`. Set/changed by age-threshold logic. |
| `overrideskinmode` | string | `nil` | Temporary skin override; set to `"young_skin"`, `"normal_skin"`, or `"old_skin"` during state changes. |
| `talksoundoverride` | string \| `nil` | `nil` | Sound override for speech; set per age state (e.g., `"wanda2/characters/wanda/talk_old_LP"`). |
| `_no_healing` | boolean | `true` | Internal flag preventing standard healing; `health.canheal` is set to `false`. |

## Main functions
### `becomeold(inst, silent)`
* **Description:** Transitions Wanda into the *old* age state. Increases health (scaled), reduces movement/build speed, lowers Hammer effectiveness, applies old-age Sanity multiplier, sets talk sound override, and adjusts warp-back distance.
* **Parameters:**  
  `silent` (boolean) — If `true`, suppresses visual FX, sounds, and speech announcement.
* **Returns:** Nothing.
* **Error states:** Exits early if `inst.age_state == "old"`.

### `becomenormal(inst, silent)`
* **Description:** Transitions Wanda into the *normal* age state. Resets most stats to baseline, restores default talk sound, and resets warp distance.
* **Parameters:**  
  `silent` (boolean) — If `true`, suppresses FX and announcements.
* **Returns:** Nothing.
* **Error states:** Exits early if `inst.age_state == "normal"`.

### `becomeyoung(inst, silent)`
* **Description:** Transitions Wanda into the *young* age state. Increases health (scaled), improves build speed, restores default Hammer effectiveness, applies young-age Sanity multiplier, sets talk sound override, and adjusts warp distance.
* **Parameters:**  
  `silent` (boolean) — If `true`, suppresses FX and announcements.
* **Returns:** Nothing.
* **Error states:** Exits early if `inst.age_state == "young"`.

### `onhealthchange(inst, data, forcesilent)`
* **Description:** Core age-threshold callback. Monitors `health:GetPercent()` and triggers age-state transitions using thresholds defined in `TUNING.WANDA_AGE_THRESHOLD_*`. Ensures transitions only occur when appropriate and respects `silentmorph` and visibility flags.
* **Parameters:**  
  `data` (table) — Event data (unused directly).  
  `forcesilent` (boolean) — If `true`, overrides visibility to enforce silent transitions.
* **Returns:** Nothing.
* **Error states:** Exits early if `nomorph` state tag is present, the entity is dead, or `playerghost` tag exists.

### `GetEquippableDapperness(owner, equippable)`
* **Description:** Provides Shadow-item Sanity dapperness multiplier based on Wanda’s age state. Applies resistance scaling (e.g., `WANDA_SHADOW_RESISTANCE_OLD`) to items with the `shadow_item` tag.
* **Parameters:**  
  `owner` (Entity) — Wanda’s `inst`.  
  `equippable` (Entity) — The item being evaluated.
* **Returns:** `number` — Final dapperness value (scaled if shadow item, unchanged otherwise).

### `CustomCombatDamage(inst, target, weapon, multiplier, mount)`
* **Description:** Custom combat damage multiplier based on weapon type (`shadow_item`) and age state. Applies `WANDA_SHADOW_DAMAGE_*` for shadow weapons and `WANDA_REGULAR_DAMAGE_*` for others. Non-mounted combat only.
* **Parameters:**  
  `inst` (Entity) — Wanda’s `inst`.  
  `target`, `weapon`, `multiplier`, `mount` — Standard combat callback parameters.
* **Returns:** `number` — Damage multiplier (`1` for mounted combat, otherwise per-age scaling).

### `OnGetItem(inst, data)`
* **Description:** Hooks into `itemget`/`equip` events to mark Pocket Watch items as `keepondeath`, `keepondrown`, and `nosteal` (to visually attach them to her outfit).
* **Parameters:**  
  `data` (table) — Event data containing `item`.
* **Returns:** Nothing.

### `OnLoseItem(inst, data)`
* **Description:** Hooks into `itemlose`/`unequip` to revert Pocket Watch properties (`keepondeath`, `keepondrown`, `nosteal`).
* **Parameters:**  
  `data` (table) — Event data containing `item`.
* **Returns:** Nothing.

### `OnWarpBack(inst, data)`
* **Description:** Handles Pocket Watch recall logic. If `data.reset_warp` is `true`, resets the positional warp history; otherwise, rewinds to the last recorded history position. Triggers delayed speech after recall (if idle).
* **Parameters:**  
  `data` (table) — Event data; may contain `reset_warp`.
* **Returns:** Nothing.

### `UpdateSkinMode(inst, mode, delay)`
* **Description:** Delegates to `skinner:SetSkinMode(mode, "wilson")`. Supports delayed skin updates via task scheduling if `delay` is truthy; cancels pending tasks on re-entry.
* **Parameters:**  
  `mode` (string) — Skin mode: `"young_skin"`, `"normal_skin"`, `"old_skin"`.  
  `delay` (boolean) — Whether to delay update by ~15 frames.
* **Returns:** Nothing.

### `PlayAgingFx(inst, fx_name)`
* **Description:** Spawns and parents aging FX (`oldager_become_older_fx`, etc.), appending `_mount` suffix if Wanda is riding (via `rider:IsRiding()`).
* **Parameters:**  
  `inst` (Entity) — Wanda’s `inst`.  
  `fx_name` (string) — Base FX prefab name (e.g., `"oldager_become_younger_front_fx"`).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `healthdelta` — Triggers `onhealthchange` to monitor health-based age transitions.  
  `newstate` — Triggers `onnewstate` to resume age monitoring after exiting `nomorph` states.  
  `ms_becameghost` / `ms_respawnedfromghost` / `ms_playerseamlessswaped` — Manages transition between ghost/human states and initializes age logic.  
  `itemget`, `equip`, `itemlose`, `unequip` — Manages Pocket Watch properties.  
  `onwarpback` — Triggers `OnWarpBack` for recall behavior.  
  `show_warp_marker`, `hide_warp_marker` — Enables/disables the warp-back marker.  
- **Pushes:**  
  `becomeolder_wanda`, `becomeyounger_wanda` — Custom events fired during age transitions (usually with `inst.sg:PushEvent(...)`).