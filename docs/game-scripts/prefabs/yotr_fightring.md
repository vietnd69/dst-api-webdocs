---
id: yotr_fightring
title: Yotr Fightring
description: A minigame arena component that facilitates a competitive pillowfight minigame with timed rounds, ring-out mechanics, and prize distribution.
tags: [minigame, combat, boss, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cea065e4
system_scope: world
---

# Yotr Fightring

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `yotr_fightring` prefab implements a specialized arena for the Pillowfight minigame. It coordinates fighters (both NPCs and players), enforces arena boundaries, manages minigame states (intro, playing, outro), handles cheating detection, and orchestrates prize distribution at round end. It integrates with multiple core systems: `minigame` for lifecycle management, `entitytracker` for fighter tracking, `focalpoint` for camera control during active rounds, and `workable`/`activatable` for the central bell that triggers rounds. The arena is surrounded by torches and includes a bell used to start and end rounds.

## Usage example
```lua
local arena = SpawnPrefab("yotr_fightring")
arena.Transform:SetPosition(x, 0, z)

-- Add participants manually (e.g., after teleporting them into position)
add_fightring_competitor(arena, player)

-- Activate a round by ringing the bell
local bell = SpawnPrefab("yotr_fightring_bell")
bell:SetParentRing(arena)
bell:PushEvent("work", { doer = player, workleft = 1 })
```

## Dependencies & tags
**Components used:**
- `minigame` — manages minigame state (intro/playing/outro), participants, and timers.
- `entitytracker` — tracks waiting fighters and current competitors.
- `focalpoint` — controls camera focus during active rounds (client).
- `activatable` — used on the bell to guard activation logic.
- `workable` — used on the bell to handle hammering for round triggers.
- `lootdropper` — drops arena prize items (e.g., kits) when bell is destroyed.
- `placer` — for the deploy kit's placement preview (client-side).

**Tags added to arena:**
- `birdblocker`, `antlion_sinkhole_blocker`, `yotr_arena`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_camerafocus` | `net_bool` | `false` | Controls whether camera focuses on the arena (networked). |
| `_camerafocus_dist_min` | number | `TUNING.BUNNY_RING_CAMERA_FOCUS_MIN` | Minimum camera distance when focused. |
| `_camerafocus_dist_max` | number | `TUNING.BUNNY_RING_CAMERA_FOCUS_MAX` | Maximum camera distance when focused. |
| `_pillowfightactive` | `net_bool` | `false` | Indicates if the minigame is currently active (networked, used for music). |
| `_npc_wait_index` | number | `1` | Index (1–8) used to queue NPC waiting positions. |
| `_minigame_timeout_task` | `task` | `nil` | Task that times out the round (defaults to `2*SECONDS_PER_GAME_MINUTE`). |
| `_minigame_prizeitem` | string | `"goldnugget"` or `"lucky_goldnugget"` | Prize item to drop (depends on event). |
| `_fightring_competitors` | table | `{}` | Internal map of competitor entities → `true`/`false` (legal vs ringed out). |
| `_torches` | table | `{}` | Array of torch prefabs placed around the ring. |
| `_bell` | `entity` | `nil` | Reference to the arena bell prefab. |
| `_cheating_occurred` | boolean | `nil` | Set to `true` if a competitor uses an invalid weapon or attacks out-of-turn. |
| `was_placed` | boolean | `false` | Indicates if arena was placed in world (controls spawn animations/sounds). |

## Main functions
### `IsCompeting(competitor)`
* **Description:** Checks whether `competitor` is currently participating in the active minigame (i.e., present in `_fightring_competitors` with value `true`).
* **Parameters:** `competitor` (entity) — the entity to check.
* **Returns:** boolean — `true` if the entity is a legal competitor.
* **Error states:** Returns `false` for entities not in the competitors table or those marked as ringed out.

### `FlagCheating()`
* **Description:** Marks that cheating has occurred (e.g., non-pillow weapon or unauthorized attacker). Prevents prize drops at round end.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `SetPillowFightActive(music_playing)`
* **Description:** Sets the minigame active flag and starts/stops the background music loop on clients.
* **Parameters:** `music_playing` (boolean) — whether music should play.
* **Returns:** Nothing.

### `_StartMinigame()`
* **Description:** Begins the active phase after the intro delay. Validates arena emptiness, collects competitors, notifies participants, and starts ring-out and reaction checks.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Exits early if fewer than 2 competitors or if the arena is not clear.

### `_EndMinigame(gamefailed)`
* **Description:** Ends the round cleanly: cancels loop tasks, informs competitors, triggers confetti and prize logic (if no cheating), and deactivates the minigame after a delay.
* **Parameters:** `gamefailed` (boolean) — if `true`, skips confetti and prize drops.
* **Returns:** Nothing.

### `OnRingActivated(doer)`
* **Description:** Entry point for starting a round via bell. Sets up timeouts, activates the `minigame` component, and schedules torch animations.
* **Parameters:** `doer` (entity) — the player/NPC who rang the bell.
* **Returns:** `true` on success.
* **Error states:** No-op if a round is already in progress.

### `AddFighterToWaitQueue(fighter)`
* **Description:** Registers a fighter to wait in a ring slot (1–8) while waiting for the round to start.
* **Parameters:** `fighter` (entity) — the fighter entity.
* **Returns:** number — the index (1–8) assigned to the fighter in the waiting queue.
* **Error states:** Reuses slots by overwriting prior fighters.

## Events & listeners
- **Listens to:**  
  - `pillowfight_fighterarrived` — triggers fighter arrival logic (teleportation, waiting position).  
  - `pillowfight_arenanotclear` — notifies waiting NPCs that the arena is blocked.  
  - `onplaced` — triggers arena placement animations and creates auxiliary objects (torches/bell).  
  - `onremove` — cleans up torches, bell, and registered fighters.  
  - `onremove` (competitor) — removes competitor from internal list.  
  - `attacked` (competitor) — detects cheating (non-pillow weapons or attackers outside the ring).  
  - `blocked` (competitor) — detects unauthorized blocking attempts.  
  - `camerafocusdirty` — syncs camera focus changes on clients.  
  - `musicplayingdirty` — starts/stops music loop on clients.

- **Pushes:**  
  - `pillowfight_arrivedatarena` — passes fighter position data on arrival.  
  - `pillowfight_startgame` — notifies all participants that the game has started.  
  - `pillowfight_ringout` — pushed on a competitor when they leave the arena bounds.  
  - `pillowfight_deactivated` — notifies participants the minigame ended.  
  - `pillowfight_ended` — final round result (with `won = true` for survivors).  
  - `pillowfight_arenanotclear` — notifies waiters when arena is blocked at round start.  
  - `cheating` — sent to competitors upon detecting cheating.  
  - `cheer` — occasionally triggered for reaction behavior.
