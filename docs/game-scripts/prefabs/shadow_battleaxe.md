---
id: shadow_battleaxe
title: Shadow Battleaxe
description: A leveled, sentient weapon that evolves through epic creature kills, providing life steal, planar damage, and dynamic chat behavior while requiring hunger management and durability tracking.
tags: [combat, consumable, dialogue, inventory, weapon]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abbafbee
system_scope: combat
---

# Shadow Battleaxe

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shadow_battleaxe` is a unique, hierarchical weapon prefab with dynamic behavior based on its current level and equipped state. It integrates with multiple systems: leveling via epic creature kills, life steal on damage, hunger consumption over time, planar and standard damage modification, and persistent state across sessions. It features a companion `shadow_battleaxe_classified` for localized speech and visuals. The weapon degrades over time (`finiteuses`), may become broken (losing functional components), and supports upgrades when repaired in a forge.

## Usage example
```lua
local axe = SpawnPrefab("shadow_battleaxe")
axe.entity:AddTransform()
axe.entity:AddAnimState()
axe.entity:AddSoundEmitter()
axe.entity:AddNetwork()

-- Initialize components via the built-in constructor
local inst = axe
inst:SetLevel(2, false) -- Set to level 2
inst:TryLevelingUp()    -- Attempt to level up based on kill count

-- Equip and unequip logic is triggered automatically via equippable component
inst.components.equippable:OnEquip(player)
inst.components.equippable:OnUnequip(player)
```

## Dependencies & tags
**Components used:** `equippable`, `weapon`, `tool`, `hunger`, `floater`, `inspectable`, `inventoryitem`, `planardamage`, `damagetypebonus`, `finiteuses`, `shadowlevel`, `talker`, `highlightchild`, `colouraddersync`  
**Tags added on creation:** `sharp`, `show_broken_ui`, `weapon`, `shadowlevel`, `shadow_item`, `broken` (when broken)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` | Current level (1–4), determines damage, life steal, chopping efficiency, and hunger rate. |
| `epic_kill_count` | number | `0` | Number of epic creature kills recorded; used to determine leveling. |
| `_lifesteal` | number | `TUNING.SHADOW_BATTLEAXE.LEVEL[1].LIFE_STEAL` | Amount of health restored per attack (based on current level). |
| `_owner` | `Entity?` | `nil` | Entity currently equipped (only relevant on master). |
| `_fxowner` | `Entity?` | `nil` | Entity whose transform symbol the FX follows. |
| `_classified` | `Entity?` | `nil` | Reference to `shadow_battleaxe_classified` instance used for speech and talking visuals. |
| `isbroken` | `net_bool` | `false` | Networked boolean indicating whether the weapon is broken. |
| `fx` | `Entity?` | `nil` | FX entity used for visual follow effects. |

## Main functions
### `SetLevel(level, loading)`
*   **Description:** Sets the axe's level and updates all level-specific parameters: damage, life steal, planar damage, chopping efficiency, hunger rate, chat lines, sound, and inventory image. May trigger level-up if thresholds are met (not invoked directly by this function unless `TryLevelingUp` is used).
*   **Parameters:**  
    * `level` (number) – Target level (1 to `#TUNING.SHADOW_BATTLEAXE.LEVEL_THRESHOLDS`). No-op if invalid or same as current.  
    * `loading` (boolean) – If `true`, skips clamping `epic_kill_count` to current level threshold (used during save/load).  
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `level < 1` or `level > max_levels`, or if `level == self.level`.

### `TryLevelingUp()`
*   **Description:** Checks whether `epic_kill_count` meets or exceeds the threshold for the next level and, if so, calls `SetLevel(level + 1, false)` to advance the weapon.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if a level-up occurred, otherwise `false`.

### `SetBuffOwner(owner)`
*   **Description:** Assigns an owner for voidcloth set bonus tracking. When the owner equips or unequips a `voidclothhat`, this component toggles the set bonus (increased damage and planar damage). If `owner` is `nil`, bonus is disabled.
*   **Parameters:**  
    * `owner` (`Entity?`) – Entity that may wear the companion hat.  
*   **Returns:** Nothing.

### `SetFxOwner(owner)`
*   **Description:** Manages attachment/detachment of the FX entity (`inst.fx`) to/from the owner's `swap_object` symbol, including parent hierarchy and highlighting logic. Used during equip/unequip cycles.
*   **Parameters:**  
    * `owner` (`Entity?`) – Entity to attach the FX to, or `nil` to detach and revert to `self`.  
*   **Returns:** Nothing.

### `DoAttackEffects(owner, target)`
*   **Description:** Spawns a `hitsparks_fx` entity with red color override and black blend enabled. Modding-friendly (returns the spawned spark for modification).
*   **Parameters:**  
    * `owner` (`Entity`) – Attacking entity.  
    * `target` (`Entity`) – Hit target.  
*   **Returns:** `Entity` (hitsparks_fx) — The spawned spark prefab.

### `CheckForEpicCreatureKilled(target)`
*   **Description:** Determines if `target` qualifies as an epic creature kill (non-smallepic, non-invalid epic prefab), increments `epic_kill_count`, and attempts to level up. Speaks the appropriate chat line.
*   **Parameters:**  
    * `target` (`Entity`) – Killed entity.  
*   **Returns:** `boolean` — `true` if target was an epic creature kill (even if max level reached).

### `DoLifeSteal(owner, target)`
*   **Description:** Heals the owner's health and reduces sanity proportionally if the target is not a lifeless entity and the owner is hurt. Healing amount is based on `_lifesteal`.
*   **Parameters:**  
    * `owner` (`Entity`) – Attacking entity.  
    * `target` (`Entity`) – Target being attacked.  
*   **Returns:** Nothing.
*   **Error states:** Early exit if `_lifesteal <= 0` or target is lifeless.

### `SayRegularChatLine(list, owner)`
*   **Description:** Plays a randomized chat line from the appropriate talk group (`list`) for the current level, respecting cooldowns, and optionally schedules an overtime chat task.
*   **Parameters:**  
    * `list` (string or `nil`) – Key from `STRINGS.SHADOW_BATTLEAXE_TALK` (e.g., `"chopping"`, `"hungry"`, `"overtime"`, or `nil` to auto-select via `GetOvertimeChatLine`).  
    * `owner` (`Entity?`) – Owner used for overtime context (woodcutter detection).  
*   **Returns:** Nothing.
*   **Error states:** Early exit if `_classified` is `nil` or if cooldown is still active.

### `ToggleTalking(turnon, owner)`
*   **Description:** Starts or cancels the recurring overtime chat task.
*   **Parameters:**  
    * `turnon` (boolean) – Whether to enable chatting.  
    * `owner` (`Entity?`) – Owner to pass to `StartOvertimeChatTask`.  
*   **Returns:** Nothing.

### `TrackTarget(target)`
*   **Description:** Begins tracking an epic target for death resolution. Registers listeners for `death` and `onremove` events and stores the kill timestamp.
*   **Parameters:**  
    * `target` (`Entity`) – Epic creature to track.  
*   **Returns:** Nothing.

### `ForgetTarget(target)`
*   **Description:** Stops tracking a target, removing event callbacks and deleting its entry.
*   **Parameters:**  
    * `target` (`Entity`) – Target to forget.  
*   **Returns:** Nothing.

### `OnBroken(inst)`
*   **Description:** Invoked on forge repair failure or manual break. Removes core components (`equippable`, `weapon`, `tool`, `hunger`), resets level to 1, sets broken state, and updates UI label to `"BROKEN_FORGEDITEM"`.
*   **Parameters:** `inst` (Entity) – This instance.  
*   **Returns:** Nothing.

### `OnRepaired(inst)`
*   **Description:** Invoked on successful forge repair. Restores removed components, resets broken state, updates level animation, and clears the broken label.
*   **Parameters:** `inst` (Entity) – This instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  * `"onremove"` — on classified (`_classified`) entity removal to clear `_classified` reference.  
  * `"working"` — on owner working (chopping wood) to trigger hunger gain and chat lines.  
  * `"equip"` / `"unequip"` — on owner equip/unequip events to detect voidcloth hat for set bonus.  
  * `"death"` — on tracked epic targets to register kills.  
  * `"onremove"` — on tracked epic targets for cleanup.  
  * `"floater_stopfloating"` — to restore idle animation after floating ends.  
  * `"enterlimbo"` / `"exitlimbo"` — to manage idle sound loops.  
  * `"isbrokendirty"` (client) — to update visual state.  
  * `"equiptoggledirty"` / `"leveldirty"` (client) — to update FX on network events.  
  * `"ontalk"` / `"donetalking"` (local sound entity) — for localized speech shake effects.  
- **Pushes:**  
  * `"percentusedchange"` — via `finiteuses` when uses change.  
  * `"imagechange"` — via `inventoryitem` when level changes image name.  
  * `"healthdelta"` — via `health` during life steal.  
  * `"sanitydelta"` — via `sanity` during life steal (sanity cost).