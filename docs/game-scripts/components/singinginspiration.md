---
id: singinginspiration
title: Singinginspiration
description: Manages the battle song inspiration system for Wathgrithr, tracking inspiration points and active song buffs.
tags: [combat, buff, wathgrithr]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 283570f9
system_scope: combat
---

# Singinginspiration

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`SingingInspiration` manages the battle song inspiration mechanic for Wathgrithr. It tracks inspiration points (0 to max), determines available song slots based on inspiration percentage, and applies song debuffs to friendly targets within range. Inspiration is gained through combat actions and drains over time when not actively fighting. The component integrates with `skilltreeupdater` for skill-gated songs, `rechargeable` for instant song cooldowns, and `player_classified` replica for client-side UI synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("singinginspiration")

-- Set custom inspiration max
inst.components.singinginspiration:SetMaxInspiration(1000)

-- Add a battle song
local songdata = require("prefabs/battlesongdefs").song_defs["battlesong_healing"]
inst.components.singinginspiration:AddSong(songdata)

-- Check current inspiration percentage
local percent = inst.components.singinginspiration:GetPercent()
```

## Dependencies & tags
**External dependencies:**
- `prefabs/battlesongdefs` -- provides song_defs table with battle song configurations
- `SourceModifierList` -- tracks inspiration gain rate multipliers via SetModifier/RemoveModifier/Get pattern

**Components used:**
- `player_classified` -- syncs inspiration state to clients via netvars
- `skilltreeupdater` -- checks if battle song skills are activated
- `rechargeable` -- manages instant song cooldowns on items
- `leader` -- finds follower entities to inspire
- `inventory` -- finds leader items in player inventory
- `health` -- checks if targets are alive
- `combat` -- validates target eligibility and ally status
- `rider` -- adjusts FX position when riding

**Tags:**
- `critter` -- check (exclude from follower collection)
- `epic` -- check (bonus multiplier in OnHitOther, exclude from instant targets)
- `prey` -- check (exclude unless also has 'hostile')
- `hostile` -- check (allows prey targeting)
- `_combat`, `_health` -- check (must-have tags for instant targets)
- `INLIMBO`, `structure`, `butterfly`, `wall`, `balloon`, `groundspike`, `smashable`, `companion` -- check (excluded from instant targets)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `TUNING.INSPIRATION_MAX` | Maximum inspiration points. Assignment triggers no watcher. |
| `current` | number | `0` | Current inspiration points. Assignment fires `on_current` watcher to sync replica. |
| `active_songs` | table | `{}` | Array of active battle song data tables. |
| `attach_radius` | number | `TUNING.BATTLESONG_ATTACH_RADIUS` | Radius for finding friendly targets to inspire. |
| `detach_radius` | number | `TUNING.BATTLESONG_DETACH_RADIUS` | Radius at which songs detach from targets. |
| `available_slots` | number | `0` | Number of song slots available based on inspiration percentage. |
| `is_draining` | boolean | `false` | Whether inspiration is currently draining. Assignment fires `on_is_draining` watcher. |
| `max_enemy_health` | number | `5000` | Health threshold for epic enemy bonus calculation. |
| `inspiration_gain_bonus` | number | `750` | Base bonus for inspiration gain calculations. |
| `gainratemultipliers` | SourceModifierList | base `1` | Tracks per-source inspiration gain rate multipliers. |
| `validvictimfn` | function | `nil` | Optional custom validation function for hit victims. Set via `SetValidVictimFn()`. |
| `CalcAvailableSlotsForInspirationFn` | function | `nil` | Callback to calculate available slots from inspiration percent. Set via `SetCalcAvailableSlotsForInspirationFn()`. |
| `last_attack_time` | number | `nil` | Timestamp of last attack for drain buffer calculation. |
| `display_fx_count` | number | `nil` | Index of next song FX to display. |
| `display_fx_task` | task | `nil` | Scheduled task for displaying song FX. |
| `inspire_refresh_task` | task | `nil` | Periodic task for reapplying song debuffs. |

## Main functions
### `SetCalcAvailableSlotsForInspirationFn(fn)`
* **Description:** Sets the callback function used to calculate available song slots from inspiration percentage.
* **Parameters:** `fn` -- function with signature `fn(inst, percent) → number`
* **Returns:** nil
* **Error states:** None

### `SetMaxInspiration(max)`
* **Description:** Sets the maximum inspiration points cap.
* **Parameters:** `max` -- number maximum inspiration value
* **Returns:** nil
* **Error states:** None

### `GetMaxInspiration()`
* **Description:** Returns the current maximum inspiration value.
* **Parameters:** None
* **Returns:** number or `0` if max is nil
* **Error states:** None

### `SetInspiration(value)`
* **Description:** Sets current inspiration to a specific value, updates last attack time, and triggers delta calculation.
* **Parameters:** `value` -- number inspiration points
* **Returns:** nil
* **Error states:** None

### `GetPercent()`
* **Description:** Returns current inspiration as a decimal percentage (0 to 1).
* **Parameters:** None
* **Returns:** number between 0 and 1
* **Error states:** None

### `SetPercent(percent)`
* **Description:** Sets current inspiration from a decimal percentage, updates last attack time, and triggers delta calculation.
* **Parameters:** `percent` -- number between 0 and 1
* **Returns:** nil
* **Error states:** None

### `GetDetachRadius()`
* **Description:** Returns the radius at which songs detach from targets.
* **Parameters:** None
* **Returns:** number
* **Error states:** None

### `IsSongActive(songdata)`
* **Description:** Checks if a specific song is currently active by comparing NAME fields.
* **Parameters:** `songdata` -- table with NAME field
* **Returns:** boolean `true` if song is active, `false` otherwise
* **Error states:** None

### `GetActiveSong(slot_num)`
* **Description:** Returns the song data at the specified slot index.
* **Parameters:** `slot_num` -- number slot index (1-based)
* **Returns:** song data table or `nil` if slot is empty
* **Error states:** None

### `IsSinging()`
* **Description:** Checks if any songs are currently active.
* **Parameters:** None
* **Returns:** boolean `true` if at least one song is active
* **Error states:** None

### `OnAttacked(data)`
* **Description:** Handles inspiration gain when the entity is attacked. Stops draining, updates last attack time, and adds inspiration based on damage received scaled by current inspiration deficit.
* **Parameters:** `data` -- event data table with `attacker` and `damageresolved` fields
* **Returns:** nil
* **Error states:** None

### `OnHitOther(data)`
* **Description:** Handles inspiration gain when the entity hits another entity. Validates target has health component and passes optional victim validation function. Applies epic enemy bonus multiplier if target has "epic" tag. Multiplies delta by gain rate multipliers from SourceModifierList.
* **Parameters:** `data` -- event data table with `target`, `damageresolved`, and `damage` fields
* **Returns:** nil
* **Error states:** None

### `OnRidingTick(dt)`
* **Description:** Gains inspiration while riding at a fixed rate up to the riding gain max. Cancels early if already at max.
* **Parameters:** `dt` -- number delta time in seconds
* **Returns:** nil
* **Error states:** None

### `DoDelta(delta, forceupdate)`
* **Description:** Applies an inspiration delta and recalculates available slots. Clamps current between 0 and max. Pushes `inspirationdelta` event. Pops songs if available slots decrease. Starts or stops component updating based on whether inspiration crosses zero threshold.
* **Parameters:**
  - `delta` -- number inspiration change (can be negative)
  - `forceupdate` -- boolean to force update even if no state change
* **Returns:** nil
* **Error states:** Errors if `self.CalcAvailableSlotsForInspirationFn` is nil when called

### `CanAddSong(songdata, inst)`
* **Description:** Validates whether a song can be added. Checks skill requirement via skilltreeupdater. For instant songs, checks inspiration threshold and rechargeable charge state. For regular songs, checks if there are available slots.
* **Parameters:**
  - `songdata` -- table with REQUIRE_SKILL, INSTANT, DELTA fields
  - `inst` -- entity instance or nil
* **Returns:** boolean `true` if song can be added
* **Error states:** None

### `DisplayFx()`
* **Description:** Spawns visual FX for active songs in rotation. Adjusts FX position offset when riding. Schedules next FX display via task. Cancels task if no active songs remain.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnAddInstantSong(songdata, inst)`
* **Description:** Handles instant song activation. Deducts inspiration delta unless instant song cooldown skill is activated. Sends RPC to update accomplishment counter. Discharges rechargeable component on the inst if present. Calls InstantInspire to apply song effect.
* **Parameters:**
  - `songdata` -- table with DELTA, COOLDOWN, ONINSTANT fields
  - `inst` -- entity instance or nil
* **Returns:** nil
* **Error states:** None

### `AddSong(songdata, skip_inspire, inst)`
* **Description:** Adds a song to the active songs list if validation passes. For instant songs, calls OnAddInstantSong. For regular songs, inserts into active_songs array, starts periodic inspire refresh task if not running, starts FX display task if not running, syncs to player_classified replica, and pushes `inspirationsongchanged` event.
* **Parameters:**
  - `songdata` -- battle song data table
  - `skip_inspire` -- boolean to skip immediate inspire application
  - `inst` -- entity instance for rechargeable check
* **Returns:** nil
* **Error states:** None

### `PopSong()`
* **Description:** Removes the last active song from the list. Cancels inspire refresh and FX display tasks if no songs remain. Syncs slot to player_classified replica (sets to 0). Pushes `inspirationsongchanged` event with slot number.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `FindFriendlyTargetsToInspire()`
* **Description:** Collects all valid targets to apply song debuffs. In non-PVP, collects all players in attach radius plus their followers. In PVP, only includes self. Filters out dead entities, critters, and entities targeting self. Also collects followers of leader items in player inventories.
* **Parameters:** None
* **Returns:** table of entity instances
* **Error states:** None

### `InstantInspire(songdata)`
* **Description:** Applies instant song effects to valid targets. Uses custom target function if defined in songdata, otherwise finds entities in attach radius with combat and health components. Filters out allies, prey (unless hostile), and entities with excluded tags (INLIMBO, epic, structure, etc.). Calls songdata.ONINSTANT function for each valid target.
* **Parameters:** `songdata` -- table with ONINSTANT, CUSTOMTARGETFN fields
* **Returns:** nil
* **Error states:** Errors if `combat` component is missing on self.inst

### `Inspire()`
* **Description:** Applies all active song debuffs to all friendly targets found via FindFriendlyTargetsToInspire.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetValidVictimFn(fn)`
* **Description:** Sets the custom validation function for hit victims in OnHitOther.
* **Parameters:** `fn` -- function with signature `fn(target) → boolean`
* **Returns:** nil
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Called periodically while component is updating. Checks if time since last attack exceeds drain buffer. Sets is_draining flag and applies drain rate delta if draining, otherwise sets is_draining to false.
* **Parameters:** `dt` -- number delta time in seconds
* **Returns:** nil
* **Error states:** None

### `OnSave()`
* **Description:** Returns save data table with current inspiration and active song item names.
* **Parameters:** None
* **Returns:** table with `current` and optionally `active_songs` fields
* **Error states:** None

### `OnLoad(data)`
* **Description:** Restores inspiration state from save data. Sets inspiration value and re-adds active songs from saved item names using song_defs lookup.
* **Parameters:** `data` -- table with `current` and optionally `active_songs` fields
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns debug string with current inspiration, active song count, and available slots.
* **Parameters:** None
* **Returns:** string
* **Error states:** None

### `on_current(self, current)` (local)
* **Description:** Property watcher callback fired when `self.current` is assigned. Converts current to percentage (0-255 range) and syncs to player_classified.currentinspiration netvar. Asserts percent is in valid range.
* **Parameters:**
  - `self` -- component instance
  - `current` -- number new current inspiration value
* **Returns:** nil
* **Error states:** Assert fails if percent is outside 0-255 range

### `on_is_draining(self, is_draining)` (local)
* **Description:** Property watcher callback fired when `self.is_draining` is assigned. Syncs value to player_classified.inspirationdraining netvar.
* **Parameters:**
  - `self` -- component instance
  - `is_draining` -- boolean new draining state
* **Returns:** nil
* **Error states:** None

## Events & listeners
- **Listens to:**
  - `onhitother` -- triggers OnHitOther; gains inspiration from dealing damage
  - `attacked` -- triggers OnAttacked; gains inspiration from taking damage
  - `death` -- triggers SetInspiration(0); resets inspiration on death
- **Pushes:**
  - `inspirationdelta` -- fired in DoDelta when inspiration changes. Data: `{ newpercent = number, slots_available = number }`
  - `inspirationsongchanged` -- fired in AddSong and PopSong. Data: `{ songdata = table, slotnum = number }` or `{ slotnum = number }`