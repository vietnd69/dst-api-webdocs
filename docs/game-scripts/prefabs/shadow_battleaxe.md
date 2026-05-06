---
id: shadow_battleaxe
title: Shadow Battleaxe
description: A levelable shadow weapon prefab with life steal, talking AI, and visual FX systems that progresses through epic creature kills.
tags: [combat, weapon, shadow, prefab, leveling]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 2f487c84
system_scope: combat
---

# Shadow Battleaxe

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`shadow_battleaxe` is a complex weapon prefab that features a leveling system based on defeating epic creatures. The axe progresses through multiple levels, gaining increased damage, life steal, and unique dialogue. It includes a classified entity for server-authoritative logic, visual FX that follow the weapon, and integration with the Void Cloth armor set bonus. The weapon can break and be repaired through the Forge system, and it features a hunger component that depletes while equipped at higher levels.

## Usage example
```lua
-- Spawn the shadow battleaxe
local axe = SpawnPrefab("shadow_battleaxe")

-- Set level directly (normally happens through epic kills)
axe:SetLevel(3)

-- Check current state
print(axe.debugstringfn())

-- The axe levels up automatically when epic creatures are defeated
-- while tracked by the weapon's tracking system
```

## Dependencies & tags
**External dependencies:**
- `TUNING` -- damage values, level thresholds, hunger rates, talk intervals
- `STRINGS` -- dialogue strings for different levels and situations
- `ACTIONS` -- chop action for tool component
- `EQUIPSLOTS` -- head slot checking for set bonus

**Components used:**
- `equippable` -- equip/unequip callbacks, dapperness values
- `weapon` -- damage setting, on attack callback
- `tool` -- chopping action with efficiency
- `hunger` -- depletes while equipped at level 2+, starvation callback
- `floater` -- floating animation and visual effects
- `talker` -- dialogue display with custom colour and offset
- `inventoryitem` -- image name changes, drop/inventory callbacks
- `planardamage` -- base damage and set bonus damage
- `damagetypebonus` -- lunar aligned damage bonus
- `finiteuses` -- durability consumption on chop
- `shadowlevel` -- shadow level tracking
- `inspectable` -- name override when broken
- `highlightchild` -- FX highlighting owner
- `colouraddersync` -- FX colour synchronization

**Tags:**
- `sharp` -- added on creation
- `show_broken_ui` -- added on creation
- `weapon` -- added on creation
- `shadowlevel` -- added on creation
- `shadow_item` -- added on creation
- `broken` -- added when weapon breaks, removed on repair
- `FX` -- added to FX prefabs

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number | `1` | Current weapon level (1-4 based on TUNING thresholds) |
| `epic_kill_count` | number | `0` | Number of epic creatures defeated with this weapon |
| `_lifesteal` | number | `TUNING.SHADOW_BATTLEAXE.LEVEL[1].LIFE_STEAL` | Current life steal amount per hit |
| `_classified` | entity | `shadow_battleaxe_classified` | Server-authoritative classified entity |
| `_owner` | entity | `nil` | Current owner entity when equipped |
| `_fxowner` | entity | `nil` | Entity that FX follows |
| `_bonusenabled` | boolean | `false` | Whether Void Cloth set bonus is active |
| `_trackedentities` | table | `{}` | Table of tracked epic creature targets |
| `_talktime` | table | `{}` | Cooldown tracking for dialogue lines |
| `isbroken` | net_bool | `false` | Networked broken state |
| `fx` | entity | `shadow_battleaxe_fx` | Visual FX entity |
| `localsounds` | entity | `nil` | Local sound emitter (client only) |
| `scrapbook_planardamage` | table | `{min, max}` | Planar damage range for scrapbook |

## Main functions
### `SetLevel(level, loading)`
* **Description:** Sets the weapon to a specific level, updating damage, animations, hunger rate, and visual appearance. Triggers level-up sound effects.
* **Parameters:**
  - `level` -- target level number (1-4)
  - `loading` -- boolean, if true skips epic_kill_count clamping
* **Returns:** None
* **Error states:** None (returns early if level is invalid or unchanged)

### `TryLevelingUp()`
* **Description:** Checks if epic_kill_count meets the threshold for the next level and levels up if so.
* **Parameters:** None
* **Returns:** `true` if leveled up, `false` otherwise

### `SetBuffOwner(owner)`
* **Description:** Sets the owner for Void Cloth set bonus tracking. Listens for equip/unequip events on head slot to enable/disable set bonus.
* **Parameters:** `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None

### `_SetBuffEnabled(enabled)`
* **Description:** Enables or disables the Void Cloth set bonus damage. Called internally when owner equips/unequips Void Cloth hat.
* **Parameters:** `enabled` -- boolean
* **Returns:** None
* **Error states:** None

### `SetFxOwner(owner)`
* **Description:** Sets which entity the visual FX should follow. Attaches FX to owner when equipped, returns to weapon when unequipped.
* **Parameters:** `owner` -- player entity or nil
* **Returns:** None
* **Error states:** None

### `SetIsBroken(isbroken)`
* **Description:** Sets the broken state, disabling components and changing visuals when broken, restoring them when repaired.
* **Parameters:** `isbroken` -- boolean
* **Returns:** None
* **Error states:** None

### `TrackTarget(target)`
* **Description:** Starts tracking an epic creature target for kill credit. Listens for death and onremove events.
* **Parameters:** `target` -- entity to track
* **Returns:** None
* **Error states:** None

### `ForgetTarget(target)`
* **Description:** Stops tracking a specific target and removes event listeners.
* **Parameters:** `target` -- entity to stop tracking
* **Returns:** None
* **Error states:** None

### `ForgetAllTargets()`
* **Description:** Clears all tracked targets, called on unequip.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CheckForEpicCreatureKilled(target)`
* **Description:** Validates if target is an epic creature and increments kill count. Triggers level up if threshold met.
* **Parameters:** `target` -- defeated creature entity
* **Returns:** `true` if target was epic, `false` otherwise
* **Error states:** None

### `IsEpicCreature(target)`
* **Description:** Checks if target qualifies as an epic creature (has "epic" tag, not "smallepic", not in invalid list).
* **Parameters:** `target` -- entity to check
* **Returns:** boolean
* **Error states:** None

### `DoAttackEffects(owner, target)`
* **Description:** Spawns hit spark FX on attack with colour override.
* **Parameters:**
  - `owner` -- attacking player entity
  - `target` -- target entity
* **Returns:** Spawned spark FX entity

### `DoLifeSteal(owner, target)`
* **Description:** Heals owner based on life steal value if owner is hurt and target is a lifeform. Also drains sanity.
* **Parameters:**
  - `owner` -- player entity
  - `target` -- attacked entity
* **Returns:** None
* **Error states:** None

### `SayRegularChatLine(list, owner)`
* **Description:** Plays dialogue line with cooldown tracking. Supports different line categories (overtime, hungry, chopping, etc.).
* **Parameters:**
  - `list` -- dialogue category string or nil for overtime
  - `owner` -- player entity
* **Returns:** None
* **Error states:** None

### `SayEpicKilledLine(levelup, random)`
* **Description:** Plays special dialogue when epic creature is killed or weapon levels up.
* **Parameters:**
  - `levelup` -- boolean, if true plays level-up dialogue
  - `random` -- boolean, if true picks random line from list
* **Returns:** None
* **Error states:** None

### `ToggleTalking(turnon, owner)`
* **Description:** Enables or disables the overtime chat task that triggers periodic dialogue.
* **Parameters:**
  - `turnon` -- boolean
  - `owner` -- player entity (optional, defaults to _owner)
* **Returns:** None
* **Error states:** None

### `StartOvertimeChatTask(owner)`
* **Description:** Schedules the next overtime dialogue line after the configured interval.
* **Parameters:** `owner` -- player entity (optional)
* **Returns:** None
* **Error states:** None

### `AttachClassified(classified)`
* **Description:** Attaches the classified entity and sets up onremove listener for cleanup.
* **Parameters:** `classified` -- classified entity
* **Returns:** None
* **Error states:** None

### `DetachClassified()`
* **Description:** Detaches the classified entity and cleans up listeners.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnRemoveEntity()`
* **Description:** Cleanup function called when the weapon is removed. Removes classified entity appropriately based on sim type.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns debug information including level, boss defeats, life steal, and tracked entities.
* **Parameters:** None
* **Returns:** Formatted debug string
* **Error states:** None

### `SetFxLevel(level)`
* **Description:** (FX prefab) Sets the FX animation level and triggers level dirty event.
* **Parameters:** `level` -- level number
* **Returns:** None
* **Error states:** None

### `ToggleEquipped(equipped)`
* **Description:** (FX prefab) Toggles whether FX is in equipped state, spawning or removing follow frames.
* **Parameters:** `equipped` -- boolean
* **Returns:** None
* **Error states:** None

### `OnSave(data)`
* **Description:** Saves epic_kill_count to save data if greater than 0.
* **Parameters:** `data` -- save data table
* **Returns:** None
* **Error states:** None

### `OnLoad(data)`
* **Description:** Loads epic_kill_count from save data and restores weapon level based on kill count thresholds.
* **Parameters:** `data` -- save data table or nil
* **Returns:** None
* **Error states:** None

### `OnEntityWake()`
* **Description:** Resumes idle sound loop when entity wakes from limbo or sleep (if not already playing).
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnEntitySleep()`
* **Description:** Kills idle sound loop when entity enters limbo or sleep.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnDropped()`
* **Description:** Clears classified entity target when weapon is dropped from inventory.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnPutInInventory(owner)`
* **Description:** Sets classified entity target when weapon is put into owner's inventory.
* **Parameters:** `owner` -- player entity that owns the inventory
* **Returns:** None
* **Error states:** None

## Events & listeners
**Listens to:**
- `onremove` -- detaches classified entity on weapon removal
- `equip` -- checks for Void Cloth hat to enable set bonus
- `unequip` -- disables set bonus when head slot unequipped
- `working` -- triggers chopping dialogue and sound on owner work
- `death` -- checks if tracked epic creature died for kill credit
- `floater_stopfloating` -- restores idle animation after floating ends
- `ontalk` -- plays talk sound and shakes text widget
- `donetalking` -- kills talk sound and cancels shake task
- `exitlimbo` -- resumes idle sound loop
- `enterlimbo` -- kills idle sound loop
- `isbrokendirty` -- (client) updates broken visual state
- `equiptoggledirty` -- (FX) toggles FX follow frames
- `leveldirty` -- (FX) updates FX animation level

**Pushes:**
- `percentusedchange` -- via finiteuses component on durability change
- `imagechange` -- via inventoryitem when level changes
- `healthdelta` -- via health component on life steal
- `sanitydelta` -- via sanity component on life steal sanity loss