---
id: singinginspiration
title: Singinginspiration
description: Manages a player's inspiration resource and active battle songs, handling inspiration gain/loss, song activation, and buff application to nearby allies.
tags: [combat, buff, ai, audio]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1b41402e
system_scope: entity
---

# Singinginspiration

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SingingInspiration` manages the inspiration resource and active battle songs for a player entity, primarily used by the Wathgrithr character. It tracks current inspiration (a resource bounded by `INSPIRATION_MAX`), calculates inspiration gain based on combat actions (damaging enemies), and manages a list of currently active songs. Active songs apply debuffs to friendly targets within a radius (`attach_radius`). The component integrates with `combat`, `health`, `leader`, `follower`, `domesticatable`, `saltlicker`, `inventory`, `skilltreeupdater`, and `rechargeable` components to determine valid targets, song costs, and song eligibility.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("singinginspiration")

-- Set custom inspiration limit
inst.components.singinginspiration:SetMaxInspiration(2000)

-- Add a battle song (e.g., from song_defs)
local songdata = require("prefabs/battlesongdefs").song_defs["wathgrithr_battlesong_1"]
inst.components.singinginspiration:AddSong(songdata)

-- Check if a song is active
if inst.components.singinginspiration:IsSongActive(songdata) then
    print("Song is active!")
end

-- Manually update inspiration on riding
inst.components.singinginspiration:OnRidingTick(dt)
```

## Dependencies & tags
**Components used:** `combat`, `health`, `leader`, `follower`, `domesticatable`, `saltlicker`, `inventory`, `skilltreeupdater`, `rechargeable`, `rider`, `inventoryitem`  
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `TUNING.INSPIRATION_MAX` | Maximum inspiration value. |
| `current` | number | `0` | Current inspiration value. |
| `active_songs` | table (array) | `{}` | List of active battle song definitions. |
| `attach_radius` | number | `TUNING.BATTLESONG_ATTACH_RADIUS` | Radius around the player to which songs apply buffs. |
| `detach_radius` | number | `TUNING.BATTLESONG_DETACH_RADIUS` | Radius at which inspirations stop applying. |
| `available_slots` | number | `0` | Number of song slots currently available, computed dynamically. |
| `is_draining` | boolean | `false` | Whether inspiration is currently draining. |
| `gainratemultipliers` | SourceModifierList | — | Modifier list for inspiration gain rate. |
| `last_attack_time` | number | `nil` | Timestamp of the last attack that contributed to inspiration gain. |

## Main functions
### `SetInspiration(value)`
* **Description:** Sets the current inspiration value and triggers updates (e.g., event dispatch, start/stop component updates).
* **Parameters:** `value` (number) — The absolute inspiration amount to set (clamped to `[0, max]`).
* **Returns:** Nothing.

### `GetPercent()`
* **Description:** Returns the current inspiration as a fraction (0.0–1.0).
* **Parameters:** None.
* **Returns:** `number` — The current inspiration divided by `max`.

### `SetPercent(percent)`
* **Description:** Sets inspiration based on a percentage of `max`.
* **Parameters:** `percent` (number) — A value between `0` and `1`.
* **Returns:** Nothing.

### `IsSongActive(songdata)`
* **Description:** Checks if a specific song (by its `NAME` field) is currently active.
* **Parameters:** `songdata` (table) — A song definition table containing a `NAME` field.
* **Returns:** `boolean` — `true` if the song is active, otherwise `false`.

### `AddSong(songdata, skip_inspire, inst)`
* **Description:** Attempts to add a battle song. Validates via `CanAddSong`, applies costs (e.g., charging `rechargeable`, decrementing inspiration), and starts song upkeep tasks.
* **Parameters:**  
  `songdata` (table) — A song definition from `battlesongdefs.lua`.  
  `skip_inspire` (boolean, optional) — If `true`, does not immediately apply song buffs.  
  `inst` (Entity, optional) — Entity used for instant-song costs (e.g., rechargeable item).
* **Returns:** Nothing.

### `CanAddSong(songdata, inst)`
* **Description:** Validates whether a song can be added. Checks skill activation, song type (instant vs.持续), available slots, and charge state.
* **Parameters:**  
  `songdata` (table) — A song definition.  
  `inst` (Entity, optional) — Entity with `rechargeable` if relevant.
* **Returns:** `boolean` — `true` if the song can be added, otherwise `false`.

### `DoDelta(delta, forceupdate)`
* **Description:** Applies a delta to `current`, clamps it between `0` and `max`, recomputes `available_slots`, and dispatches `inspirationdelta` and `inspirationsongchanged` events as needed.
* **Parameters:**  
  `delta` (number) — Amount to add to `current` (can be negative).  
  `forceupdate` (boolean) — If `true`, forces `inspirationdelta` event even if `current` was `0`.
* **Returns:** Nothing.

### `OnAttacked(data)`
* **Description:** Handles inspiration gain when the player is attacked and takes damage. Gain is proportional to damage taken and `(1 - current_percent)`.
* **Parameters:** `data` (table) — Event data containing `attacker`, `damageresolved`.
* **Returns:** Nothing.

### `OnHitOther(data)`
* **Description:** Handles inspiration gain when the player hits a valid enemy. Gain is proportional to damage dealt, scaled by `gainratemultipliers`, and includes an `epic` enemy bonus.
* **Parameters:** `data` (table) — Event data containing `target`, `damage`, `damageresolved`.
* **Returns:** Nothing.

### `OnRidingTick(dt)`
* **Description:** Gains inspiration while riding (e.g., Beefalo), up to `INSPIRATION_RIDING_GAIN_MAX`.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `FindFriendlyTargetsToInspire()`
* **Description:** Collects all valid friendly entities (players, their followers, domesticated creatures, salt-licked creatures) within `attach_radius`.
* **Parameters:** None.
* **Returns:** `table` — Array of `Entity` objects eligible to receive debuffs.

### `Inspire()`
* **Description:** Applies all active songs’ debuffs to each entity returned by `FindFriendlyTargetsToInspire()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `InstantInspire(songdata)`
* **Description:** For instant songs, executes `songdata.ONINSTANT` on all valid nearby hostile entities (excludes friendly, structured, or non-combat targets).
* **Parameters:** `songdata` (table) — The instant song definition.
* **Returns:** Nothing.

### `PopSong()`
* **Description:** Removes the last active song from `active_songs`, cancels upkeep tasks if empty, and dispatches `inspirationsongchanged`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called periodically. If no recent attacks occurred (`last_attack_time` older than `INSPIRATION_DRAIN_BUFFER_TIME`), drains inspiration at `INSPIRATION_DRAIN_RATE`.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the component for save data, including `current` and list of active song `ITEM_NAME`s.
* **Parameters:** None.
* **Returns:** `table` — Save data table.

### `OnLoad(data)`
* **Description:** Restores `current` and re-adds songs after loading from save data.
* **Parameters:** `data` (table) — Saved component data.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-friendly string summarizing key values.
* **Parameters:** None.
* **Returns:** `string` — `"current: X, active_songs Y, available_slots Z"`.

### `SetCalcAvailableSlotsForInspirationFn(fn)`
* **Description:** Registers a custom function to compute `available_slots` from current inspiration percentage.
* **Parameters:** `fn` (function) — Function signature `(inst: Entity, percent: number) -> number`.
* **Returns:** Nothing.

### `SetValidVictimFn(fn)`
* **Description:** Sets a filter function (`fn(target: Entity) -> boolean`) used by `OnHitOther` to determine valid damage sources for gain.
* **Parameters:** `fn` (function) — Validation function for damage targets.
* **Returns:** Nothing.

### `IsSinging()`
* **Description:** Returns whether any songs are currently active.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `#active_songs > 0`.

### `GetActiveSong(slot_num)`
* **Description:** Returns the song definition at the given 1-based slot index.
* **Parameters:** `slot_num` (number) — Slot index (1 to `#active_songs`).
* **Returns:** `table?` — Song definition or `nil` if out of bounds.

### `GetDetachRadius()`
* **Description:** Returns the radius beyond which inspirations are removed from targets.
* **Parameters:** None.
* **Returns:** `number` — `detach_radius` value.

## Events & listeners
- **Listens to:**  
  `onhitother` — handled by `OnHitOther`, triggers inspiration gain on successful hits.  
  `attacked` — handled by `OnAttacked`, triggers inspiration gain when damaged.  
  `death` — handled by `SetInspiration(0)`, resets inspiration on death.

- **Pushes:**  
  `inspirationdelta` — dispatched when `current` changes, includes `newpercent` and `slots_available`.  
  `inspirationsongchanged` — dispatched when songs are added or removed, includes `songdata` (on add) or `slotnum` (on remove).
