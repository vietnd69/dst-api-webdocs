---
id: hunter
title: Hunter
description: Manages dynamic monster hunting sequences triggered by players investigating dirt piles, including track generation, beast selection, and spawn logic based on world state and active shrines.
tags: [world, combat, quest]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2ae3722c
system_scope: world
---

# Hunter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `hunter` component orchestrates the game's monster-hunting mechanic, which activates when players investigate dirt piles. It maintains a pool of active hunts, tracks player availability, spawns animal tracks, determines beast types (e.g., koalefant, warg, claywarg), and handles spawn logic. The component monitors player presence, shrines (`wargshrine`, `snakeshrine`), lunar rift mutations, and seasonal events to dynamically adjust hunt difficulty and outcomes. It runs exclusively on the master simulation (`TheWorld.ismastersim`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hunter")
-- hunts are automatically started when players join the world
-- to debug, force a hunt:
inst.components.hunter:DebugForceHunt()
-- inspect hunt state for debugging:
print(inst.components.hunter:GetDebugString())
```

## Dependencies & tags
**Components used:** `areaaware` (via `TheWorld` context), `lunarriftmutationsmanager`, `riftspawner`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the entity (typically `TheWorld`) that owns this component. |
| `_activeplayers` | `table` | `{}` | List of player entities eligible for hunts. |
| `_activehunts` | `table` | `{}` | List of active hunt objects (see `CreateNewHunt`). |
| `_wargshrines` | `SourceModifierList` | — | Tracks active warg shrines (via `wargshrineactivated`/`deactivated` events). |
| `_snakeshrines` | `SourceModifierList` | — | Tracks active snake shrines (via `ms_snakeshrineactivated`/`deactivated` events). |

## Main functions
### `OnDirtInvestigated(pt, doer)`
* **Description:** Called when a player investigates a dirt pile. If the pile belongs to an active hunt, it spawns the next track, may spawn the next dirt pile, or spawns the hunted beast if all tracks are done.
* **Parameters:**  
  `pt` (`Vector3`): World position of the investigated dirt pile.  
  `doer` (`Entity`): The player entity investigating the dirt pile.
* **Returns:** Nothing.
* **Error states:** No matching hunt found for the dirt pile → returns silently. Spawn failures (e.g., invalid position) → triggers `ResetHunt`.

### `IsWargShrineActive()`
* **Description:** Returns whether warg shrines are active *and* the YOTV event is enabled.
* **Parameters:** None.
* **Returns:** `boolean`.

### `IsSnakeShrineActive()`
* **Description:** Returns whether snake shrines are active *and* the YOTS event is enabled.
* **Parameters:** None.
* **Returns:** `boolean`.

### `LongUpdate(dt)`
* **Description:** Adjusts cooldown timers when physics time is altered (e.g., fast-forwarding). Updates cooldown tasks to reflect elapsed time.
* **Parameters:** `dt` (`number`) — Delta time (positive or negative) to apply to active hunt cooldowns.
* **Returns:** Nothing.

### `DebugForceHunt()`
* **Description:** Skips cooldown and forces a new hunt to start immediately. Used for debugging.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string describing the state of all active hunts (cooldown time remaining, track progress, monster ambush info, score). Useful for debugging.
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
- **Listens to:**  
  `ms_playerjoined` — Adds new player to `_activeplayers` and starts a hunt if slots are available.  
  `ms_playerleft` — Removes player from `_activeplayers`.  
  `wargshrineactivated` — Marks a warg shrine as active.  
  `wargshrinedeactivated` — Deactivates warg shrine tracking.  
  `ms_snakeshrineactivated` — Marks a snake shrine as active.  
  `ms_snakeshrinedeactivated` — Deactivates snake shrine tracking.  
  `onremove` (on `dirtpile`) — Clears `lastdirt` reference and triggers `ResetHunt` when a dirt pile is removed.

- **Pushes:**  
  On player: `huntlosttrail`, `huntstartfork`, `huntwrongfork`, `huntbeastnearby`, `huntsuccessfulfork`  
  On beast: `spawnedforhunt` (with `beast`, `pt`, `action`, `score`)
