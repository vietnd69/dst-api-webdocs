---
id: singinginspiration
title: Singinginspiration
description: Manages a player character's inspiration resource, including gain, drain, active battle songs, and buff application to nearby allies.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 1b41402e
---

# SingingInspiration

## Overview
The `SingingInspiration` component manages the inspiration system for player characters (especially Wathgrithr), tracking the current inspiration value (0–max), handling inspiration gain from combat and riding, draining when inactive, managing active battle songs (including instant and periodic ones), and applying debuffs to friendly targets within range. It integrates with UI, network sync, and save/load systems.

## Dependencies & Tags
- `inst:AddComponent("health")` (indirectly via `death` event listener)
- `inst:AddComponent("combat")` (used via `self.inst.components.combat:CanTarget`)
- `inst:AddComponent("rider")` (checked in `DisplayFx`)
- `inst:AddComponent("leader")` / `inst:AddComponent("follower")` / `inst:AddComponent("domesticatable")` / `inst:AddComponent("saltlicker")` (used in `FindFriendlyTargetsToInspire`)
- `inst:AddComponent("rechargeable")` (used in `OnAddInstantSong`)
- `inst:AddComponent("skilltreeupdater")` (used for skill checks and CD tracking)
- `inst:AddComponent("inventory")` (used via `FindItems` in `FindFriendlyTargetsToInspire`)
- Adds no tags, but relies on many entity tags (`epic`, `critter`, `_combat`, `_health`, `INLIMBO`, `structure`, `prey`, `hostile`, `companion`, etc.).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `TUNING.INSPIRATION_MAX` | Maximum inspiration value |
| `current` | number | `0` | Current inspiration value |
| `active_songs` | table | `{}` | List of currently active `songdata` objects (battle songs) |
| `attach_radius` | number | `TUNING.BATTLESONG_ATTACH_RADIUS` | Radius (squared) for targeting allies when inspiring |
| `detach_radius` | number | `TUNING.BATTLESONG_DETACH_RADIUS` | Radius where allies lose the song effect (not directly used in this component) |
| `available_slots` | number | `0` | Number of song slots currently available based on inspiration percentage |
| `is_draining` | boolean | `false` | Whether inspiration is currently draining |
| `max_enemy_health` | number | `5000` | Used for inspiration gain scaling (unused in current codebase) |
| `inspiration_gain_bonus` | number | `750` | Unused multiplier for inspiration gain (not referenced) |
| `gainratemultipliers` | SourceModifierList | `SourceModifierList(self.inst)` | Modifier list applied to combat-based inspiration gain |
| `validvictimfn` | function | `nil` | Optional predicate for filtering valid victims in `OnHitOther` |
| `CalcAvailableSlotsForInspirationFn` | function | `nil` | Callback to compute available song slots from inspiration percentage |

## Main Functions

### `SingingInspiration:SetCalcAvailableSlotsForInspirationFn(fn)`
* **Description:** Sets the function used to compute how many song slots are available based on inspiration percentage.
* **Parameters:** `fn(inst, percent)` — a callback that takes the entity and current inspiration percentage (0–1) and returns an integer.

### `SingingInspiration:SetMaxInspiration(max)`
* **Description:** Updates the maximum inspiration cap.
* **Parameters:** `max` — new maximum inspiration value.

### `SingingInspiration:GetMaxInspiration()`
* **Description:** Returns the current maximum inspiration value.
* **Parameters:** None.

### `SingingInspiration:SetInspiration(value)`
* **Description:** Sets the current inspiration value directly (clamped to `[0, max]`) and triggers an update. Resets `last_attack_time`.
* **Parameters:** `value` — absolute inspiration amount.

### `SingingInspiration:GetPercent()`
* **Description:** Returns the inspiration as a percentage (0.0 to 1.0).
* **Parameters:** None.

### `SingingInspiration:SetPercent(percent)`
* **Description:** Sets the current inspiration as a fraction of max, and triggers an update.
* **Parameters:** `percent` — value in [0.0, 1.0].

### `SingingInspiration:GetDetachRadius()`
* **Description:** Returns the detach radius.
* **Parameters:** None.

### `SingingInspiration:IsSongActive(songdata)`
* **Description:** Checks whether a given battle song is currently active (based on name match).
* **Parameters:** `songdata` — a song definition table (expects a `NAME` field).

### `SingingInspiration:GetActiveSong(slot_num)`
* **Description:** Returns the `songdata` at the given slot (1-indexed).
* **Parameters:** `slot_num` — 1-based index of the slot.

### `SingingInspiration:IsSinging()`
* **Description:** Returns `true` if any battle songs are currently active.
* **Parameters:** None.

### `SingingInspiration:OnAttacked(data)`
* **Description:** Handles inspiration gain when the player is attacked. Gains inspiration proportional to damage taken, scaled by `(1 - current_percent)`.
* **Parameters:** `data` — event data containing `attacker` and `damageresolved`.

### `SingingInspiration:OnHitOther(data)`
* **Description:** Handles inspiration gain when the player hits a valid target. Gains inspiration proportional to damage dealt, scaled by `(1 - current_percent)` and bonuses (epic bonus, multiplier).
* **Parameters:** `data` — event data containing `target`, `damage`, and `damageresolved`.

### `SingingInspiration:OnRidingTick(dt)`
* **Description:** Gradually increases inspiration while riding (e.g., on a pig or beefalo), up to `TUNING.INSPIRATION_RIDING_GAIN_MAX`.
* **Parameters:** `dt` — delta time.

### `SingingInspiration:DoDelta(delta, forceupdate)`
* **Description:** Applies a delta to current inspiration (clamped), recomputes available song slots, removes overflowing songs, and triggers the `inspirationdelta` event. Starts/stops component updates if crossing 0 inspiration.
* **Parameters:**  
  - `delta` — amount to add to `current` (may be negative).  
  - `forceupdate` — if `true`, forces update even if crossing from 0.

### `SingingInspiration:CanAddSong(songdata, inst)`
* **Description:** Checks whether the player can add the given battle song. Enforces skill requirements, instant song thresholds, rechargeable item state, and slot availability.
* **Parameters:**  
  - `songdata` — song definition table.  
  - `inst` — optional item instance (e.g., for instant songs requiring a charged item).

### `SingingInspiration:DisplayFx()`
* **Description:** Spawns looping visual FX for active songs in a round-robin fashion, adjusting height/offset based on mount state. Recursively schedules itself.
* **Parameters:** None.

### `SingingInspiration:OnAddInstantSong(songdata, inst)`
* **Description:** Processes an instant battle song: deducts inspiration, handles CD/recharge item, and triggers `InstantInspire`.
* **Parameters:**  
  - `songdata` — song definition.  
  - `inst` — item instance (if any).

### `SingingInspiration:AddSong(songdata, skip_inspire, inst)`
* **Description:** Adds a battle song to the active list, starts its periodic application, triggers its FX, syncs it to the UI, and optionally invokes `Inspire()` once.
* **Parameters:**  
  - `songdata` — song definition.  
  - `skip_inspire` — if `true`, skips immediate buff application (used on load).  
  - `inst` — item instance (for instant songs).

### `SingingInspiration:PopSong()`
* **Description:** Removes the last added song from the active list, cancels related tasks if empty, and syncs removal to UI.
* **Parameters:** None.

### `SingingInspiration:FindFriendlyTargetsToInspire()`
* **Description:** Collects all friendly targets (players, domesticated creatures, followers of players, companions of items) within `attach_radius`, excluding those in combat with the player or dead.
* **Parameters:** None.

### `SingingInspiration:InstantInspire(songdata)`
* **Description:** Executes the `ONINSTANT` callback of a song for all valid hostile enemies within range (excluding friendly or special-tagged entities).
* **Parameters:** `songdata` — song definition.

### `SingingInspiration:Inspire()`
* **Description:** Applies all active songs (as debuffs) to each friendly target returned by `FindFriendlyTargetsToInspire`.
* **Parameters:** None.

### `SingingInspiration:SetValidVictimFn(fn)`
* **Description:** Sets an optional predicate used in `OnHitOther` to filter valid victims.
* **Parameters:** `fn(target)` — returns `true` if target should count for inspiration gain.

### `SingingInspiration:OnUpdate(dt)`
* **Description:** Called periodically while inspiration is active. Drains inspiration over time if no attacks occurred within `INSPIRATION_DRAIN_BUFFER_TIME`.
* **Parameters:** `dt` — delta time.

### `SingingInspiration:OnSave()`
* **Description:** Returns a serializable table with current inspiration and list of active song names (for save file).
* **Parameters:** None.

### `SingingInspiration:OnLoad(data)`
* **Description:** Loads inspiration state and re-adds active songs (skipping immediate inspire).
* **Parameters:** `data` — saved data table with `current` and `active_songs`.

### `SingingInspiration:GetDebugString()`
* **Description:** Returns a debug-friendly string with key values.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"onhitother"` → `self:OnHitOther(data)`
  - `"attacked"` → `self:OnAttacked(data)`
  - `"death"` → `self:SetInspiration(0)`
- **Emits:**
  - `"inspirationdelta"` — on inspiration change, with `{ newpercent, slots_available }`
  - `"inspirationsongchanged"` — on song addition/removal, with `{ songdata, slotnum }` or `{ slotnum }`