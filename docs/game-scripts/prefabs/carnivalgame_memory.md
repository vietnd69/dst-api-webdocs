---
id: carnivalgame_memory
title: Carnivalgame Memory
description: Manages the memory mini-game station, including card layout, round logic, scoring, and reward spawning for the Carnival event.
tags: [minigame, event, scoring, reward]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c4f613f1
system_scope: world
---

# Carnivalgame Memory

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `carnivalgame_memory` prefab implements a memory-style minigame where players must select correct cards in increasing numbers per round. The station prefab (`carnivalgame_memory_station`) orchestrates game flow by spawning and managing memory cards (`carnivalgame_memory_card`), tracking picks per round, scoring points, and spawning rewards (prize tickets) upon success. It uses `objectspawner` to manage child cards, `minigame` to define crowd interaction radii, `activatable` to enable player interaction with cards, and `lootdropper` to spawn tickets.

## Usage example
```lua
-- Example: Deploy and activate the memory minigame station
local station = SpawnPrefab("carnivalgame_memory_station")
station.Transform:SetPosition(0, 0, 0)

-- Manually trigger the game (e.g., after player joins)
station.components.minigame:StartGame(player)

-- The station handles card spawning, rounds, scoring, and rewards internally
```

## Dependencies & tags
**Components used:** `minigame`, `objectspawner`, `lootdropper`, `placer` (via `CreateFloor`), `inspectable`, `activatable`  
**Tags:** Adds `carnivalgame_part` to cards, `CLASSIFIED`, `NOCLICK`, `DECOR` to non-interactive helper entities; checks `carnivalgame_part` during deployment validation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_round_num` | number | `0` | Current round index (starts at 0). |
| `_minigame_score` | number | — | Number of successful rounds completed (set during gameplay). |
| `_picked_cards` | table | `{}` | Tracks cards picked correctly this round; cleared at round end. |
| `_round_delay` | task ID | `nil` | Handle to delayed task launching the next round. |
| `_turnon_time` | number | `1` | Time offset for turn-on lighting logic. |
| `lightdelay_turnon` | number | `5 * FRAMES` | Delay before turn-on sound/light effect. |
| `lightdelay_turnoff` | number | `6 * FRAMES` | Delay before turn-off sound/light effect. |
| `OnActivateGame`, `OnStartPlaying`, etc. | function reference | see implementation | Minigame interface callbacks (required by `minigame` component). |

## Main functions
### `OnActivateGame(inst)`
* **Description:** Called when the minigame is activated (e.g., player joins). Turns on the station lights/sounds, initializes round state, and activates all cards.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `DoNextRound(inst)`
* **Description:** Starts the next round by setting card difficulty (number of cards to pick), assigning which cards are “good”, and marking all cards inactive for player input.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `DoEndOfRound(inst)`
* **Description:** Checks if the current round is complete (all required cards picked); if so, triggers next round. Does nothing if cards remain unpicked.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `OnStartPlaying(inst)`
* **Description:** Begins the game after the minigame transition. Resets round count and starts Round 1.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `SpawnRewards(inst)`
* **Description:** Spawns prize tickets (`carnival_prizeticket`) over time proportional to `_minigame_score`, plays spawn animation and looping sound, and returns the duration of reward spawning.
* **Parameters:** `inst` — the station entity.
* **Returns:** number — total delay in seconds until reward spawning completes.

### `OnStopPlaying(inst)`
* **Description:** Finalizes gameplay on player exit. Resets round tracking, turns off cards, and schedules reward spawning.
* **Parameters:** `inst` — the station entity.
* **Returns:** number — delay (`1`) before reward spawning begins.

### `OnDeactivateGame(inst)`
* **Description:** Shuts down the minigame UI/sound and turns off all cards for the next user.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `RemoveGameItems(inst)`
* **Description:** Placeholder stub; no-op in this implementation.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `OnRemoveGame(inst)`
* **Description:** Removes all spawned cards when the station is destroyed.
* **Parameters:** `inst` — the station entity.
* **Returns:** Nothing.

### `NewObject(inst, obj)`
* **Description:** Registers an event listener for when a new card (`obj`) is spawned. Listens for `carnivalgame_memory_cardrevealed` to process picks and advance rounds.
* **Parameters:** `inst` — the station entity; `obj` — the new card entity.
* **Returns:** Nothing.

### `card_OnPick(inst)`
* **Description:** Activated when a player picks a memory card. Fires `carnivalgame_memory_revealcard`, which triggers round-progress logic.
* **Parameters:** `inst` — the card entity.
* **Returns:** `true` (to indicate successful activation).

### `card_GetStatus(inst)`
* **Description:** Returns `"PLAYING"` if the card is not in the process of turning off, otherwise `nil`.
* **Parameters:** `inst` — the card entity.
* **Returns:** `string` or `nil`.

### `placerdecor(inst)`
* **Description:** Helper used by the placer prefab; creates static decorator cards at fixed positions during kit deployment.
* **Parameters:** `inst` — the kit/placer entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — triggers `OnBuilt` to set rotation and spawn cards.
- **Pushes:** `on_loot_dropped`, `loot_prefab_spawned` (via `lootdropper:SpawnLootPrefab`).
- **Card events:** `carnivalgame_memory_cardrevealed` — fired when a card is picked; `carnivalgame_memory_cardstartround` — fired to inform cards of round start; `carnivalgame_endofround` — fired at end of each round.
- **Station events:** `carnivalgame_turnon`/`carnivalgame_turnoff` — triggered on cards via `PushEvent` to toggle visual states.