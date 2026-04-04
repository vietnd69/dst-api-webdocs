---
id: beeguard
title: Beeguard
description: Defines the Bee Guard creature prefab with combat, follower, and loyalty mechanics for both hostile and friendly states.
tags: [combat, ai, creature, bee, follower]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abd7f8c2
system_scope: entity
---

# Beeguard

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`Beeguard` is a prefab entity representing the Bee Guard creature in Don't Starve Together. It operates as a flying insect combat unit that can switch between hostile and friendly states depending on its commander (either a player or the Bee Queen). The prefab integrates multiple components for combat behavior, follower mechanics, sleep/wake cycles, and army coordination. It supports special puffy transformation states when focusing targets and shares aggro with other bee units.

## Usage example
```lua
local beeguard = SpawnPrefab("beeguard")
beeguard:AddComponent("follower")
beeguard.components.follower:SetLeader(player)
beeguard:MakeFriendly(player.userid)
beeguard:FocusTarget(target)
beeguard:StartFindingPlayerQueenTasks()
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `sleeper`, `locomotor`, `health`, `entitytracker`, `knownlocations`, `lootdropper`, `stuckdetection`, `inspectable`, `freezable`, `burnable`, `commander`

**Tags:** Adds `insect`, `bee`, `monster`, `hostile`, `scarytoprey`, `flying`, `ignorewalkableplatformdrowning`, `NOBLOCK`, `companion`, `notaunt`. Removes `hostile`, `NOBLOCK`, `companion` when switching to hostile state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buzzing` | boolean | `true` | Whether the bee is currently playing buzz sound. |
| `sounds` | table | `normalsounds` | Sound configuration table for attack, buzz, hit, death. |
| `_friendid` | string/nil | `nil` | User ID of the friendly player commander if applicable. |
| `_focustarget` | entity/nil | `nil` | Current focus target for special puffy attack mode. |
| `_friendref` | entity/nil | `nil` | Reference to the friend entity for event listening. |
| `_sleeptask` | task/nil | `nil` | Scheduled task for sleep-related cleanup. |
| `_findqueentask` | task/nil | `nil` | Periodic task for finding player queen. |
| `_fleetask` | task/nil | `nil` | Task for fleeing behavior timeout. |
| `hit_recovery` | number | `1` | Hit recovery time value. |

## Main functions
### `EnableBuzz(enable)`
*   **Description:** Toggles the buzzing sound effect on or off. Plays or kills the buzz sound channel based on enable state and sleep status.
*   **Parameters:** `enable` (boolean) - whether to enable buzzing.
*   **Returns:** Nothing.

### `IsFriendly()`
*   **Description:** Checks if the beeguard is in friendly mode by testing if `_friendid` is set.
*   **Parameters:** None.
*   **Returns:** boolean - `true` if friendly, `false` if hostile.

### `MakeFriendly(userid)`
*   **Description:** Converts the beeguard to friendly mode for a specific player. Removes `hostile` tag and adds `NOBLOCK` and `companion` tags.
*   **Parameters:** `userid` (string) - the player's user ID.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `_friendid` is already set.

### `MakeHostile()`
*   **Description:** Converts the beeguard back to hostile mode. Clears `_friendid`, adds `hostile` tag, removes `NOBLOCK` and `companion` tags.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `_friendid` is already `nil`.

### `GetQueen()`
*   **Description:** Retrieves the commander entity (queen) from entity tracker or friend reference.
*   **Parameters:** None.
*   **Returns:** entity or `nil` - the queen commander entity if found.

### `AddToArmy(queen)`
*   **Description:** Registers the beeguard as a soldier under a commander. Adds follower component if queen is a player, removes if not. Adds soldier to commander's army.
*   **Parameters:** `queen` (entity) - the commander entity.
*   **Returns:** Nothing.

### `StartFindingPlayerQueenTasks()`
*   **Description:** Starts periodic tasks to find the player queen and sets up flee timeout. Only works if beeguard is friendly.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `IsFriendly()` returns `false`.

### `FocusTarget(target)`
*   **Description:** Sets a focus target and triggers puffy transformation mode with increased speed and damage. Clears focus to return to normal mode. Spawns visual poof effects.
*   **Parameters:** `target` (entity or `nil`) - the target to focus on.
*   **Returns:** Nothing.

### `OnEntitySleep()`
*   **Description:** Handles sleep state entry. Cancels sleep task, schedules removal after 10 seconds if not friendly and not dead, kills buzz sound.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Handles wake state entry. Cancels sleep task, restarts buzz sound if buzzing flag is set.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave(data)`
*   **Description:** Saves the friend ID to persistent data for load restoration.
*   **Parameters:** `data` (table) - save data table to populate.
*   **Returns:** Nothing.

### `OnLoad(data)`
*   **Description:** Restores friendly state from saved data by calling `MakeFriendly` if friendid exists.
*   **Parameters:** `data` (table) - loaded save data table.
*   **Returns:** Nothing.

### `OnLoadPostPass()`
*   **Description:** Post-load initialization. Adds to army if queen exists, otherwise starts finding queen tasks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSpawnedGuard(queen)`
*   **Description:** Called when guard spawns. Transitions to spawnin state and adds as soldier to queen's commander component.
*   **Parameters:** `queen` (entity) - the queen commander.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `gotcommander` - triggers `OnGotCommander` when assigned a new commander.
- **Listens to:** `lostcommander` - triggers `OnLostCommander` when commander is lost.
- **Listens to:** `attacked` - triggers `OnAttacked` to set combat target and share aggro.
- **Listens to:** `onattackother` - triggers `OnAttackOther` to reset stuck detection and check for bee armor.
- **Listens to:** `newcombattarget` - triggers `OnNewTarget` to check for Bee Queen target switching.
- **Pushes:** `flee` - fired when flee timeout expires.