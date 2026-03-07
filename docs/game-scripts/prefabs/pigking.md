---
id: pigking
title: Pigking
description: Manages the Pig King's trading and wrestling minigame mechanics, including gold/nugget exchange, elite pig participation, area safety validation, and reward distribution.
tags: [npc, minigame, trade, combat, event]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 11d30932
system_scope: entity
---

# Pigking

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pigking` entity functions as an NPC trader and minigame host. It handles item trades for gold or candy rewards, coordinates the wrestling minigame (where players compete against elite pigs), manages game state (including area clearing and safety checks), and provides rewards upon successful completion. It integrates with the `trader`, `minigame`, `hauntable`, and `pointofinterest` components.

## Usage example
```lua
local pigking = SpawnPrefab("pigking")
pigking.components.trader.enabled = true
if pigking:IsMinigameActive() then
    pigking:CancelGame()
else
    pigking:StartMinigame()
end
```

## Dependencies & tags
**Components used:** `trader`, `minigame`, `hauntable`, `pointofinterest`, `inspectable`, `inventory`, `burnable`, `combat`, `minigame_participator`, `skinner`, `tradable`, `unwrappable`, `clock`, `focalpoint`  
**Tags added:** `trader`, `king`, `birdblocker`, `antlion_sinkhole_blocker`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_music` | `net_bool` | `false` | Networked flag controlling whether ambient music should play. |
| `_blockbuilding` | `net_bool` | `false` | Networked flag that blocks nearby building placement when true. |
| `_camerafocus` | `net_bool` | `false` | Networked flag controlling camera focus around Pig King. |
| `_minigame_elites` | table | `{}` | Stores references to elite pig entities participating in the current minigame. |
| `locked_obelisks` | table or `nil` | `nil` | List of sanity rock obelisks temporarily concealed during a minigame. |
| `MINIGAME_ITEM` | string | `"goldnugget"` or `"lucky_goldnugget"` | The minigame currency item, determined by active event (e.g., YOTP). |

## Main functions
### `StartMinigame(inst)`
* **Description:** Begins the wrestling minigame sequence. Resets score tracking, activates the `minigame` component, enters the "intro" state, spawns rounds of items, and starts music.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if a minigame is already active (`inst._minigametask ~= nil`).

### `CancelGame(inst)`
* **Description:** Immediately cancels an active minigame. Cancels pending tasks, deactivates the `minigame` component, stops music, removes event listeners, and re-enables building/trading.
* **Parameters:** None.
* **Returns:** Nothing.

### `IsMinigameActive(inst)`
* **Description:** Checks if a minigame is currently in progress.
* **Parameters:** None.
* **Returns:** `true` if a minigame is active (i.e., `inst._minigametask ~= nil`), otherwise `false`.

### `CanStartMinigame(inst, giver)`
* **Description:** Validates whether conditions are suitable to start the minigame. Checks time until night, area cleanliness, and combat safety.
* **Parameters:**  
  * `giver` (entity, optional) — The player attempting to initiate the minigame.  
* **Returns:** `true, nil` if ready to start; `false, "reason"` string (e.g., `"PIGKINGGAME_TOOLATE"`) if not ready.

### `GetMinigameScore(inst)`
* **Description:** Computes a score (1 to 4) for the completed minigame based on the percentage of gold pieces captured by players vs. elite pigs. Score thresholds are defined in `TUNING`.
* **Parameters:** None.
* **Returns:** `1` (bad), `2` (ok), `3` (good), or `4` (great).

### `LaunchRewards(inst, level, minigame_players)`
* **Description:** Spawns and launches reward items for participants based on the minigame score (`level`) and participants. Supports seasonal items like `redpouch_yotp` during YOTP events.
* **Parameters:**  
  * `level` (number) — Score result from `GetMinigameScore` (1–4).  
  * `minigame_players` (table) — Array of participating player entities.  

## Events & listeners
- **Listens to:**  
  * `pickupcheat` — Detects cheating during minigame (gold pickup by cheaters triggers elitepig retaliation).  
  * `musicdirty`, `blockbuildingdirty`, `camerafocusdirty` — Client-side sync events for property changes.  
- **Pushes:**  
  * `ms_cancelminigame` — Fired when a minigame is cancelled.  
  * `wrappeditem` — Event pushed on items inside `redpouch_yotp` when wrapped.  
  * `triggeredevent` — Sent to nearby players to initiate "pigking" music event.