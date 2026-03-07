---
id: lightflier
title: Lightflier
description: A flying insect prefabs that groups into formations around players, lights up dark areas, and drops lightbulbs when killed or picked up.
tags: [locomotion, ai, combat, formation, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: baeef4cb
system_scope: entity
---

# Lightflier

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lightflier` prefab is a flying creature that automatically forms and joins `formationleader` instances around players who hold lightfliers. It provides illumination, communicates danger via alerting formations, and returns home when sleeping. The component logic resides in its StateGraph and associated helper functions, with behavior orchestrated through `formationfollower` and `formationleader` components.

## Usage example
```lua
-- Typically created via SpawnPrefab("lightflier") rather than direct instantiation
local lightflier = SpawnPrefab("lightflier")
-- Lightfliers are not meant to be manually controlled; they self-organize
-- around players holding them in inventory or forming formations nearby
```

## Dependencies & tags
**Components used:** `locomotor`, `stackable`, `inventoryitem`, `tradable`, `workable`, `eater`, `sleeper`, `combat`, `health`, `lootdropper`, `inspectable`, `knownlocations`, `homeseeker`, `follower`, `formationfollower`, `hauntable`.  
**Tags added:** `lightflier`, `cavedweller`, `flying`, `ignorewalkableplatformdrowning`, `insect`, `smallcreature`, `lightbattery`, `lunar_aligned`, `NOBLOCK` (temporarily while in formation).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_offset` | table `{x, z}` | `nil` | Interpolated target position for formation leader update. |
| `_formation_distribution_toggle` | boolean | `nil` | State flag used to alternate formation member distribution. |
| `_find_target_task` | PeriodicTask | `nil` | Reference to the scheduled task for searching new formation targets. |
| `_time_since_formation_attacked` | number | `-TUNING.LIGHTFLIER.ON_ATTACKED_ALERT_DURATION` | Timestamp used to prevent rapid re-formation after an attack. |
| `_hometask` | Task | `nil` | Task scheduled to return the lightflier home during daytime sleep. |
| `buzzing` | boolean | `nil` | Indicates whether the looping flight sound is active. |

## Main functions
### `EnableBuzz(enable)`
*   **Description:** Controls the playback of the looping flight sound based on the entity's state (e.g., held, sleeping, or alive).
*   **Parameters:** `enable` (boolean) — whether to start or stop the sound.
*   **Returns:** Nothing.
*   **Error states:** No-op if the sound is already in the requested state.

### `MakeCurrentPositionHome(inst)`
*   **Description:** Records the current position as the `"home"` location in the `knownlocations` component.
*   **Parameters:** `inst` (Entity) — the lightflier entity.
*   **Returns:** Nothing.

### `OnLeaveFormation(inst, leader)`
*   **Description:** Handler executed when a lightflier exits a formation; sets walk speed, removes `NOBLOCK` tag, and may detach from the childspawner if too far from home.
*   **Parameters:** `inst` (Entity), `leader` (Entity) — the formation leader instance.
*   **Returns:** Nothing.

### `OnEnterFormation(inst, leader)`
*   **Description:** Handler executed when a lightflier enters a formation; stops movement and adds `NOBLOCK` tag.
*   **Parameters:** `inst` (Entity), `leader` (Entity) — the formation leader instance.
*   **Returns:** Nothing.

### `OnWorked(inst, worker)`
*   **Description:** Callback when the lightflier is netted; removes it from its parent's childspawner if present, and gives it to the worker.
*   **Parameters:** `inst` (Entity), `worker` (Entity) — the player who netted the lightflier.
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Stops target searching and formation-related updates when picked up.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Restores normal behavior when dropped: resets stack size, restarts target searching, enables buzzing, and records current location as home.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `AlertFormation(inst)`
*   **Description:** Alerts all members of the current formation of a threat (e.g., attack or haunt), then disbands the formation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `FindTarget(inst)`
*   **Description:** Attempts to find a nearby player to form a formation with; creates a new formation if one is found and valid.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GoToSleep(inst)`
*   **Description:** Stops buzzing when entering a sleep state.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnWakeUp(inst)`
*   **Description:** Restarts buzzing when waking up.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** Handles haunting by alerting the formation and waking the lightflier; optionally sets panic state.
*   **Parameters:** `inst` (Entity), `haunter` (Entity).
*   **Returns:** `true` if panic state was set; `false` otherwise.

### `OnIsDay(inst, isday)`
*   **Description:** Schedules or cancels the return-to-home task based on day/night state.
*   **Parameters:** `inst` (Entity), `isday` (boolean).
*   **Returns:** Nothing.

### `OnSleepGoHome(inst)`
*   **Description:** Attempts to return the lightflier to its home parent using the `childspawner` component.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Sets up world state listeners and pauses target searching during sleep.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnEntityWake(inst)`
*   **Description:** Cleans up sleep-related listeners and resumes target searching if not held.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `attacked` — triggers `AlertFormation`.  
  `teleported` — disbands any active formation.  
  `gotosleep` — calls `GoToSleep`.  
  `onwakeup` — calls `OnWakeUp`.  
  `enterlimbo` and `exitlimbo` — managed dynamically for day/night state tracking during sleep.  
  Haunting — handled via `MakeHauntablePanic`.
- **Pushes:**  
  `detachchild` — when lightflier disconnects from its parent due to excessive distance.  
  `ondropped` — fired when dropped (via `inventoryitem` handler).