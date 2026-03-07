---
id: sacred_chest
title: Sacred Chest
description: Manages the offering and unlocking logic for the Sacred Chest, handling both networked multi-player offering attempts and local single-player reward mechanisms.
tags: [inventory, event, boss, ruins]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 388fa146
system_scope: inventory
---

# Sacred Chest

> Based on game build **714004** | Last updated: 2026-03-07

## Overview
The `sacred_chest` prefab implements the Sacred Chest, a special interactable container in the Ruins that accepts specific item combinations (offerings) to yield rewards. In single-player mode, it processes local offerings immediately; in online multiplayer, it reports the offering to the host for validation and resolution. It uses the `container`, `hauntable`, `timer`, `inspectable`, and `talker` components to manage state, sound, animation, and player interaction. The chest locks during offering attempts and either unlocks with a reward, unlocks empty (no reward), or rejects the offering outright.

## Usage example
```lua
local chest = SpawnPrefab("sacred_chest")
chest.Transform:SetPosition(x, y, z)
-- The chest is interacted with via standard container UI; no direct API calls are needed.
-- Offering items into its container triggers automatic processing.
```

## Dependencies & tags
**Components used:** `container`, `hauntable`, `timer`, `inspectable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`  
**Tags:** Adds `chest`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lockstarttime` | number | `nil` | Timestamp marking when the chest was locked; used to compute remaining lock duration. |

## Main functions
### `CheckOffering(items)`
* **Description:** Validates the list of item prefabs against known offering recipes. Returns the reward item prefab name if the offering matches, otherwise `nil`.
* **Parameters:** `items` (table) — array of item prefabs in the container slots.
* **Returns:** string or `nil` — the reward item prefab name if matched, otherwise `nil`.

### `UnlockChest(inst, param, doer)`
* **Description:** Handles the unlocking sequence after an offering decision is received. `param` determines the outcome: `1` or `2` = rejection, `3` = reward, others = empty rejection.
* **Parameters:** 
  * `inst` (Entity) — the sacred chest instance.
  * `param` (number) — outcome code (`1`, `2`, or `3`).
  * `doer` (Entity or `nil`) — the player who initiated the offering.
* **Returns:** Nothing.
* **Error states:** If `param` is not `1`, `2`, or `3`, defaults to rejection behavior.

### `LockChest(inst)`
* **Description:** Locks the chest, playing the "hit" animation and starting a looping sound. Records the lock start time.
* **Parameters:** `inst` (Entity) — the sacred chest instance.
* **Returns:** Nothing.

### `DoNetworkOffering(inst, doer)`
* **Description:** Initiates the multiplayer offering workflow: validates offering completeness, locks the chest, gathers player data, and reports the offering to the server for adjudication.
* **Parameters:** 
  * `inst` (Entity) — the sacred chest instance.
  * `doer` (Entity or `nil`) — the player who opened the chest while it was full.
* **Returns:** Nothing.
* **Error states:** Exits early if not in online mode, container is empty, or `doer` is invalid.

### `DoLocalOffering(inst, doer)`
* **Description:** Processes offerings in single-player: checks against known recipes, rewards if matched, and returns success status.
* **Parameters:** 
  * `inst` (Entity) — the sacred chest instance.
  * `doer` (Entity or `nil`) — the player who opened the chest (unused but present for API consistency).
* **Returns:** boolean — `true` if a valid offering was processed, `false` otherwise.

### `OnLocalOffering(inst)`
* **Description:** Finalizes a successful local offering: opens the chest, plays sound, and schedules post-processing.
* **Parameters:** `inst` (Entity) — the sacred chest instance.
* **Returns:** Nothing.

### `OnLocalOfferingPst(inst)`
* **Description:** Runs after local offering delay: drops contents (emptying the chest), closes the chest, and re-enables opening.
* **Parameters:** `inst` (Entity) — the sacred chest instance.
* **Returns:** Nothing.

### `getstatus(inst)`
* **Description:** Returns the status string `"LOCKED"` if the chest is currently locked, otherwise `nil`.
* **Parameters:** `inst` (Entity) — the sacred chest instance.
* **Returns:** string or `nil` — `"LOCKED"` if locked, `nil` otherwise.

### `OnLoadPostPass(inst)`
* **Description:** Restores timer state after deserialization: resumes or cancels local offering timers as needed.
* **Parameters:** `inst` (Entity) — the sacred chest instance.
* **Returns:** Nothing.

### `OnTimerDone(inst, data)`
* **Description:** Callback triggered by timer completion; dispatches to appropriate state handler (`OnLocalOffering` or `OnLocalOfferingPst`).
* **Parameters:** 
  * `inst` (Entity) — the sacred chest instance.
  * `data` (table or `nil`) — timer data containing `name`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggers `OnTimerDone` when a timer completes.