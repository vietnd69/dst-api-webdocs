---
id: beeguard
title: Beeguard
description: Acts as a flying combat unit that serves as a loyal bodyguard, engaging enemies while following and protecting a designated leader (typically the Bee Queen).
tags: [combat, ai, boss, npc, flying]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: abd7f8c2
system_scope: entity
---

# Beeguard

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `beeguard` prefab represents a flying insectoid combatant in *Don't Starve Together* that functions as a loyal enforcer and bodyguard. It is typically summoned or spawned under the control of the Bee Queen. The prefab manages aggressive behavior, retargeting logic, and dynamic state changes (e.g., dashing mode), while integrating deeply with the `commander`, `combat`, `sleeper`, `locomotor`, and `entitytracker` components. It coordinates with its leader to maintain formation, share targets, and coordinate state transitions based on player-hostile or companion status.

## Usage example
The beeguard is not instantiated directly by modders. It is spawned internally by the game (e.g., by the Bee Queen or via the Book of Beekeeping events) using the `Prefabs` system:

```lua
-- Example: Spawning a beeguard as a soldier under a leader (e.g., queen)
local guard = SpawnPrefab("beeguard")
guard:AddToArmy(queen)
-- Guard now follows queen, uses queen’s commander component, and engages threats
```

## Dependencies & tags
**Components used:**  
- `lootdropper` (`AddChanceLoot`)
- `sleeper` (`SetResistance`, `SetSleepTest`, `SetWakeTest`)
- `locomotor` (`EnableGroundSpeedMultiplier`, `SetTriggersCreep`, `walkspeed`, `pathcaps`)
- `health` (`SetMaxHealth`, `IsDead`)
- `combat` (`SetDefaultDamage`, `SetAttackPeriod`, `SetRange`, `SetRetargetFunction`, `SetKeepTargetFunction`, `SetTarget`, `ShareTarget`, `HasTarget`, `CanTarget`, `TargetIs`, `playerdamagepercent`, `bonusdamagefn`, `hiteffectsymbol`, `battlecryenabled`)
- `stuckdetection` (`SetTimeToStuck`, `IsStuck`, `Reset`)
- `entitytracker` (`TrackEntity`, `ForgetEntity`, `GetEntity`)
- `knownlocations` (`RememberLocation`, `ForgetLocation`)
- `freezable` (`SetResistance`)
- `follower` (`SetLeader`, `StopFollowing`) — conditionally added
- `commander` (`AddSoldier`, `RemoveSoldier`) — accessed via queen
- `inventory` (`GetEquippedItem`) — read via target’s inventory for stunlock logic

**Tags added/removed:**  
- Always added on spawn: `insect`, `bee`, `monster`, `hostile`, `scarytoprey`, `flying`, `ignorewalkableplatformdrowning`, `__follower` (pristine, removed before replication), `notaunt` (temporary, when focus target is set)
- Added when made friendly (`MakeFriendly`): `NOBLOCK`, `companion`; removes `hostile`
- Removed when made friendly: `hostile`, `NOBLOCK`, `companion`
- Removed when made hostile: `NOBLOCK`, `companion`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buzzing` | boolean | `true` | Whether the buzzing sound is currently playing. Controlled by `EnableBuzz`. |
| `sounds` | table | `normalsounds` | Sound event mapping (e.g., `"attack"`, `"buzz"`, `"hit"`) — switches to `poofysounds` when dashing. |
| `_friendid` | number or `nil` | `nil` | Stores the numeric user ID of a friendly player leader (if applicable). |
| `_friendref` | `Inst` or `nil` | `nil` | Reference to the actual leader entity when associated with a player. |
| `_focustarget` | `Inst` or `nil` | `nil` | High-priority target that overrides normal combat targeting. |
| `_sleeptask` | `DoTask` or `nil` | `nil` | Task to remove the beeguard after sleeping for too long. |
| `_findqueentask` | `DoTask` or `nil` | `nil` | Periodic task (for friendly bees) to locate the queen’s entity. |
| `_fleetask` | `DoTask` or `nil` | `nil` | Task that cancels tracking after a linger timeout. |
| `_friendreflistener`, `_friendrefcallback` | function references | `nil` | Event listener and callback for tracking the queen’s existence. |

## Main functions
### `EnableBuzz(enable)`
* **Description:** Starts or stops the continuous buzzing sound. Only plays when the entity is awake.  
* **Parameters:**  
  - `enable` (boolean) — Whether to enable buzzing.
* **Returns:** Nothing.

### `IsFriendly()`
* **Description:** Returns whether this beeguard has been designated as friendly (i.e., `_friendid` is set).  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if `_friendid` is not `nil`.

### `MakeFriendly(userid)`
* **Description:** Marks the beeguard as friendly to a specific player, clearing hostile tags and adding `NOBLOCK`/`companion`.  
* **Parameters:**  
  - `userid` (number) — Numeric user ID of the player to follow.  
* **Returns:** Nothing.

### `MakeHostile()`
* **Description:** Reverts to hostile status if friendly, removing friendly tags and restoring `hostile`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `FocusTarget(target)`
* **Description:** Sets a high-priority focus target, triggering a dash mode (puffy build, higher speed/damage) or returning to default mode. Removes `notaunt` tag on clearing focus.  
* **Parameters:**  
  - `target` (`Inst` or `nil`) — Target to lock onto. If `nil`, reverts to default behavior.  
* **Returns:** Nothing.  
* **Error states:** May fail to revert to default if internal build or speed properties are not properly synchronized.

### `GetQueen()`
* **Description:** Retrieves the current queen this beeguard serves — either via `entitytracker` (for non-player queens) or `_friendref` (for player leaders).  
* **Parameters:** None.  
* **Returns:** `Inst` or `nil`.

### `AddToArmy(queen)`
* **Description:** Integrates the beeguard into the queen’s army: adds it as a soldier (via `commander`), and sets the queen as its leader if the queen is a player. Removes follower component if queen is non-player and not applicable.  
* **Parameters:**  
  - `queen` (`Inst`) — The queen entity.  
* **Returns:** Nothing.

### `RetargetFn()`
* **Description:** Core retargeting logic used by `combat:SetRetargetFunction`. Determines the next target based on:
  - Friendly bees: searches for valid enemies within range (excludes queen, must match tags).
  - Hostile bees: prioritizes focus target, stuck detection fallback, or nearest player within 15 tiles.  
* **Parameters:** None.  
* **Returns:** `Inst` or `nil`, optionally `true` (force retarget).  
* **Error states:** May return `nil` if no valid targets found.

### `KeepTargetFn(inst, target)`
* **Description:** Validates current target — returns `true` if target matches focus target or is within 40 units and valid.  
* **Parameters:**  
  - `inst` (`Inst`) — This entity instance.  
  - `target` (`Inst`) — Current target to validate.  
* **Returns:** `boolean`.

### `StartFindingPlayerQueenTasks()`
* **Description:** Starts periodic attempts to locate the queen for friendly bees, plus sets a timeout task to stop waiting and flee.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnSave(inst, data)`
* **Description:** Serializes friendly state into save data (only stores `friendid`).  
* **Parameters:**  
  - `inst` (`Inst`) — Entity instance.  
  - `data` (table) — Save data table (modified in-place).  
* **Returns:** Nothing.

### `OnLoad(inst, data)`
* **Description:** Restores friendly state using `friendid` on load.  
* **Parameters:**  
  - `inst` (`Inst`) — Entity instance.  
  - `data` (table) — Loaded save data.  
* **Returns:** Nothing.

### `OnSpawnedGuard(inst, queen)`
* **Description:** Called when a beeguard is spawned directly under a queen. Sets initial state graph state `"spawnin"` and adds guard to queen’s commander list.  
* **Parameters:**  
  - `inst` (`Inst`) — This beeguard.  
  - `queen` (`Inst`) — The spawning queen.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"gotcommander"` (`OnGotCommander`) — Triggered when assigned a new commander (queen); handles repositioning and army integration.  
  - `"lostcommander"` (`OnLostCommander`) — Triggered when commander is removed; cancels tracking, resets focus.  
  - `"attacked"` (`OnAttacked`) — Sets attacker as target and notifies nearby bees to assist (share target).  
  - `"onattackother"` (`OnAttackOther`) — Resets stuck detection; checks for bee-related armor on target to set player stunlock behavior.  
  - `"newcombattarget"` (`OnNewTarget`) — Triggers `CheckBeeQueen` to respond to queen switching (e.g., attacking rival queen).  
- **Pushes:**  
  - `"flee"` (`Flee`) — Fired when lingering time expires for friendly bees with no queen found.

EOF