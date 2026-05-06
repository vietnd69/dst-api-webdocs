---
id: clockwork_common
title: Clockwork Common
description: Utility module providing shared helper functions for clockwork entity behavior including sleep cycles, combat targeting, befriending, health regeneration, and trader interactions.
tags: [clockwork, ai, utility, combat, behavior]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 82859c6e
system_scope: entity
---

# Clockwork Common

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`clockwork_common` is a utility module that exports shared helper functions for clockwork-type entities in Don't Starve Together. It provides behavior logic for sleep/wake cycles based on home position and threat detection, combat retargeting with ally checks, befriending mechanics through follower memory, health regeneration outside of combat, and trader interaction handling. This module is typically required by clockwork prefab files and stategraphs rather than added as a component.

## Usage example
```lua
local clockwork_common = require("prefabs/clockwork_common")

-- Initialize home position tracking
clockwork_common.InitHomePosition(inst)

-- Set up befriending functionality
clockwork_common.MakeBefriendable(inst)

-- Set up health regeneration outside combat
clockwork_common.MakeHealthRegen(inst)

-- Check if entity should sleep
if clockwork_common.ShouldSleep(inst) then
    -- entity can sleep
end
```

## Dependencies & tags
**External dependencies:**
- `behaviours/faceentity` -- used by WaitForTrader for entity facing behavior

**Components used:**
- `knownlocations` -- stores and retrieves home position via RememberLocation/GetLocation
- `combat` -- target management via SetTarget, DropTarget, CanTarget, HasTarget, GetLastAttackedTime, ShareTarget, TargetIs, IsAlly
- `follower` -- leader tracking via GetLeader, SetLeader
- `followermemory` -- remembered leader handling via RememberAndSetLeader, HasRememberedLeader, IsRememberedLeader, SetOnLeaderLostFn, SetOnReuniteLeaderFn, GetTrackingPlayer
- `health` -- regeneration via AddRegenSource, RemoveRegenSource, IsHurt, IsDead
- `burnable` -- sleep blocking via IsBurning
- `freezable` -- sleep blocking via IsFrozen
- `clockworktracker` -- clockwork entity limits via AddClockwork, CanAddClockwork
- `playercontroller` -- remote interaction detection via GetRemoteInteraction
- `leader` -- checked for doer capability
- `minigame_participator` -- checked for exclusion from befriending

**Tags:**
- `befriendable_clockwork` -- added by sgTrySetBefriendable, removed by sgTryClearBefriendable
- `chess` -- checked by IsWildChess and ally detection
- `chessfriend` -- checked during retargeting to exclude friendly chess entities
- `character` -- threat detection tag
- `monster` -- retargeting tag
- `INLIMBO` -- exclusion tag for threats and retargeting
- `notarget` -- AOE targeting exclusion
- `noattack` -- AOE targeting exclusion
- `_combat` -- retargeting requirement tag

## Properties
| None | | | No properties are defined. |

## Main functions
### `InitHomePosition(inst)`
* **Description:** Sets up event listeners for entity sleep/wake cycles to initialize and maintain the home position. Listens for `entitysleep` and `entitywake` events to call DoInitHomePosition, which records the current position as home.
* **Parameters:** `inst` -- entity instance with knownlocations component
* **Returns:** None
* **Error states:** Errors if `inst` lacks `knownlocations` component (nil dereference on `inst.components.knownlocations` -- no guard present).

### `GetHomePosition(inst)`
* **Description:** Returns the stored home position if the entity has no leader. Returns nil if the entity is following a leader or has no home position recorded.
* **Parameters:** `inst` -- entity instance with follower and knownlocations components
* **Returns:** Vector position table or `nil`
* **Error states:** Errors if `inst` lacks `follower` or `knownlocations` component (nil dereference -- no guard present).

### `ShouldSleep(inst)`
* **Description:** Determines if a clockwork entity should enter sleep state. Returns false if no home position exists, entity has combat target, is burning, is frozen, is too far from home, or threats are nearby.
* **Parameters:** `inst` -- entity instance
* **Returns:** `true` if entity can sleep, `false` otherwise
* **Error states:** Errors if `inst` lacks required components (combat, burnable, freezable, follower, followermemory, knownlocations) or Transform (nil dereference -- no guard present).

### `ShouldWake(inst)`
* **Description:** Returns the inverse of ShouldSleep. Determines if a sleeping entity should wake up based on threats, distance from home, or other conditions.
* **Parameters:** `inst` -- entity instance
* **Returns:** `true` if entity should wake, `false` otherwise
* **Error states:** Same as ShouldSleep -- errors if required components are missing.

### `IsAlly(inst, target)`
* **Description:** Checks if two entities are allies. Returns true if both are wild chess entities, if combat component marks them as allies, or if they share the same leader or remembered leader.
* **Parameters:**
  - `inst` -- source entity instance
  - `target` -- target entity to check alliance with
* **Returns:** `true` if allies, `false` otherwise
* **Error states:** Errors if either entity lacks required components (combat, follower, followermemory) -- no guard present.

### `Retarget(inst, range, extrafilterfn)`
* **Description:** Finds a new combat target within range. Returns nil if entity is too far from home, is not wild chess, or has a remembered leader. Filters out chess friends outside friendly range and allies.
* **Parameters:**
  - `inst` -- entity instance seeking target
  - `range` -- number search radius
  - `extrafilterfn` -- optional function(inst, guy) returning boolean for additional filtering
* **Returns:** Target entity or `nil`
* **Error states:** Errors if `inst` lacks required components (combat, follower, followermemory, knownlocations, Transform) -- no guard present.

### `FindAOETargetsAtXZ(inst, x, z, radius, fn)`
* **Description:** Finds all valid targets at a specific world position and calls the provided function for each. Excludes self, invisible entities, and allies. Includes current target and entities targeting this inst.
* **Parameters:**
  - `inst` -- source entity instance
  - `x` -- number world X coordinate
  - `z` -- number world Z coordinate
  - `radius` -- number search radius
  - `fn` -- function(v, inst) called for each valid target
* **Returns:** None
* **Error states:** Errors if `inst` lacks combat component or Transform -- no guard present.

### `KeepTarget(inst, target)`
* **Description:** Determines if a current combat target should be maintained. Returns false if target is too far from home position (or inst if no home), or if target became an ally mid-fight.
* **Parameters:**
  - `inst` -- entity instance
  - `target` -- current target entity
* **Returns:** `true` to keep target, `false` to drop
* **Error states:** Errors if `inst` lacks knownlocations component or target lacks Transform -- no guard present.

### `OnAttacked(inst, data)`
* **Description:** Handles attack events. Sets attacker as combat target. If wild chess, shares target with nearby wild chess entities that don't share the same leader. Ignores accidental hits between wild chess entities.
* **Parameters:**
  - `inst` -- entity instance that was attacked
  - `data` -- table containing attacker entity in data.attacker
* **Returns:** None
* **Error states:** None -- function guards against nil data and data.attacker with conditional check before accessing attacker.

### `OnNewCombatTarget(inst, data)`
* **Description:** Stores whether the new combat target was an ally at the time of targeting. Sets inst._targetwasally flag for KeepTarget logic.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- table containing target entity in data.target
* **Returns:** None
* **Error states:** None -- handles nil data gracefully.

### `MakeBefriendable(inst)`
* **Description:** Sets up befriending functionality for a clockwork entity. Adds followermemory component, sets reunion and leader lost callbacks, and exposes TryBefriendChess function on inst.
* **Parameters:** `inst` -- entity instance to make befriendable
* **Returns:** None
* **Error states:** Errors if `inst` lacks followermemory or follower component -- no guard present.

### `sgTrySetBefriendable(inst)`
* **Description:** Stategraph helper function that adds the `befriendable_clockwork` tag if inst.TryBefriendChess exists. Called from stategraph onenter handlers.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None -- checks for TryBefriendChess existence before adding tag.

### `sgTryClearBefriendable(inst)`
* **Description:** Stategraph helper function that removes the `befriendable_clockwork` tag if inst.TryBefriendChess exists and keepbefriendable state memory is not set. Called from stategraph onexit handlers.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None -- checks for TryBefriendChess existence before removing tag.

### `MakeHealthRegen(inst)`
* **Description:** Sets up health regeneration system that activates when out of combat and hurt. Listens for newcombattarget to stop regen and droppedtarget to restart regen.
* **Parameters:** `inst` -- entity instance with health component
* **Returns:** None
* **Error states:** Errors if `inst` lacks health component -- no guard present.

### `WaitForTrader(inst)`
* **Description:** Returns a PriorityNode behavior tree structure for trader interaction. Uses FaceEntity to face the nearest trading player within range. Handles trader switching logic.
* **Parameters:** `inst` -- entity instance with follower and combat components
* **Returns:** PriorityNode behavior tree node
* **Error states:** Errors if `inst` lacks required components (follower, combat, Transform, playercontroller on trading player) -- no guard present.

## Events & listeners
- **Listens to:** `entitysleep` -- triggers home position initialization
- **Listens to:** `entitywake` -- triggers home position initialization
- **Listens to:** `healthdelta` -- triggers health regeneration logic
- **Listens to:** `newcombattarget` -- stops health regeneration on combat entry
- **Listens to:** `droppedtarget` -- restarts health regeneration on combat exit
- **Pushes:** `makefriend` -- fired on doer when chess entity is befriended
- **Pushes:** `ms_maxclockworks` -- fired on doer when clockwork limit is reached