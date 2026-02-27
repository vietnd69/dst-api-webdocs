---
id: hunter
title: Hunter
description: Manages the world-level hunting mechanic that tracks and spawns game animals based on player activity and environmental conditions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 2ae3722c
---

# Hunter

## Overview
The `Hunter` component orchestrates the world-scoped hunting system in *Don't Starve Together*, which dynamically spawns animal tracks, lairs, and hunted beasts (e.g., koalefants, wargs) in response to player presence and actions. It coordinates dirt pile and track spawning, validates player eligibility, manages hunt cooldowns and state transitions, and respects modifiers such as Warg and Snake Shrines and seasonal/event-specific behaviors.

## Dependencies & Tags
- **Component Dependencies**: None explicitly added via `AddComponent`. Requires `TheWorld.components.lunarriftmutationsmanager` and `TheWorld.components.riftspawner` for conditional logic.
- **Tags Used**: Checks for `"nohunt"` and `"moonhunt"` tags via `components.areaaware`.
- **Listeners**: Responds to world events: `ms_playerjoined`, `ms_playerleft`, `wargshrineactivated`, `wargshrinedeactivated`, `ms_snakeshrineactivated`, `ms_snakeshrinedeactivated`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed in constructor) | The owning entity (typically the World root). |
| `_activeplayers` | `table` | `{}` | List of currently active players in the world. |
| `_activehunts` | `table` | `{}` | List of active hunt instances. Each hunt is a table containing internal state (see `CreateNewHunt`). |
| `_wargshrines` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks active Warg Shrines and their effect on hunting behavior. |
| `_snakeshrines` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks active Snake Shrines and their effect on hunting behavior. |

No additional public properties are initialized in `_ctor` or elsewhere.

## Main Functions

### `OnDirtInvestigated(pt, doer)`
* **Description:** Called when a player investigates a dirt pile (track). Triggers the next step in the hunt: spawns the next track segment, dirt pile, or hunted beast. Handles hunt progression, scoring, and transitions to cooldown or reset.
* **Parameters:**
  - `pt`: `Vector3` — Position of the investigated dirt pile.
  - `doer`: `Entity` — The player entity investigating the dirt pile.

### `IsWargShrineActive()`
* **Description:** Returns `true` if the Warg Shrine is currently active *and* the YOTV (Year of the Warg) special event is active.
* **Returns:** `boolean`

### `IsSnakeShrineActive()`
* **Description:** Returns `true` if the Snake Shrine is currently active *and* the YOTS (Year of the Snake) special event is active.
* **Returns:** `boolean`

### `LongUpdate(dt)`
* **Description:** Adjusts active hunt cooldown timers during world time scaling (e.g., paused or fast-forwarded time). Recalibrates scheduled tasks for cooldown completion.
* **Parameters:**
  - `dt`: `number` — Delta time since the last update.

### `DebugForceHunt()`
* **Description:** Forces a new hunt to begin immediately by clearing any existing hunt slots and starting a hunt with a 0.1s cooldown.
* **Side Effect:** May remove an existing hunt if the maximum hunt count is already reached.

### `GetDebugString()`
* **Description:** Returns a formatted string with debug information for all active hunts (cooldown remaining, track progress, monster/ambush markers, and final score).
* **Returns:** `string`

## Events & Listeners
- **Listens for:**
  - `"ms_playerjoined"` → triggers `OnPlayerJoined`
  - `"ms_playerleft"` → triggers `OnPlayerLeft`
  - `"wargshrineactivated"` → triggers `OnWargShrineActivated`
  - `"wargshrinedeactivated"` → triggers `OnWargShrineDeactivated`
  - `"ms_snakeshrineactivated"` → triggers `OnSnakeShrineActivated`
  - `"ms_snakeshrinedeactivated"` → triggers `OnSnakeShrineDeactivated`
- **Pushes events:**
  - Players receive `"huntlosttrail"`, `"huntstartfork"`, `"huntwrongfork"`, `"huntbeastnearby"`, and `"huntsuccessfulfork"` via `doer:PushEvent(...)`.
  - Spawned beasts receive `"spawnedforhunt"` with metadata (`{beast, pt, action, score}`).
  - Dirt piles register `"onremove"` callback (handled internally) to reset hunts when dirt is removed.