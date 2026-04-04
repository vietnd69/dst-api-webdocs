---
id: bearger
title: Bearger
description: Defines the Bearger and Mutated Bearger boss prefabs, configuring their components, AI, and combat behaviors.
tags: [boss, prefab, combat, ai, seasonal]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 515f88fe
system_scope: entity
---

# Bearger

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `bearger.lua` file defines the `bearger` and `mutatedbearger` prefabs. These scripts instantiate the Bearger boss entities, attaching necessary components for combat, movement, hibernation, and loot dropping. The file handles both the standard version and the Lunar Rift mutated variant, configuring specific assets, sounds, and behavior trees for each. It manages seasonal hibernation logic, player aggression tracking, and special attack patterns like ground pounding.

## Usage example
```lua
-- Spawn a normal Bearger at the world center
local bearger = SpawnPrefab("bearger")
bearger.Transform:SetPosition(0, 0, 0)

-- Check if it is hibernating
if bearger:HasTag("hibernation") then
    -- It is sleeping
end

-- Access custom instance function
bearger:SetStandState("quad")
```

## Dependencies & tags
**Components used:** `sanityaura`, `health`, `combat`, `explosiveresist`, `shedder`, `lootdropper`, `inspectable`, `knownlocations`, `groundpounder`, `timer`, `drownable`, `locomotor`, `thief` (normal), `inventory` (normal), `eater` (normal), `sleeper` (normal), `planarentity` (mutated), `planardamage` (mutated).
**Tags:** Adds `epic`, `monster`, `hostile`, `bearger`, `scarytoprey`, `largecreature`. Conditional tags include `hibernation`, `asleep`, `lunar_aligned`, `gestaltmutant`, `bearger_blocker`, `noepicmusic`, `soulless`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `seenbase` | boolean/nil | `nil` | Tracks if the base has been seen by the AI brain. |
| `num_food_cherrypicked` | number | `0` | Counter for players stealing food or targets. |
| `StandState` | string | `"quad"` | Current stance state (`"quad"` or `"bi"`). |
| `recentlycharged` | table | `{}` | Tracks entities recently collided with to prevent double destruction. |
| `_activeplayers` | table | `{}` | List of player instances currently tracked for action conflicts. |
| `recovery_starthp` | number | `nil` | (Mutated) Health percent when recovery started. |
| `canrunningbutt` | boolean | `false` | (Mutated) Whether the running butt attack is available. |
| `_playingmusic` | boolean | `false` | (Mutated) Tracks if the mutation music is currently playing. |

## Main functions
### `SetStandState(state)`
*   **Description:** Sets the bearger's standing state configuration.
*   **Parameters:** `state` (string) - Either `"quad"` or `"bi"`.
*   **Returns:** Nothing.

### `IsStandState(state)`
*   **Description:** Checks if the bearger is currently in the specified stand state.
*   **Parameters:** `state` (string) - State to check against.
*   **Returns:** `boolean` - `true` if the state matches.

### `SwitchToEightFaced()`
*   **Description:** Switches the entity transform to use 8-faced rotation logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SwitchToFourFaced()`
*   **Description:** Switches the entity transform to use 4-faced rotation logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartButtRecovery(norunningbutt)`
*   **Description:** (Mutated only) Initiates the health recovery logic for the butt mechanic.
*   **Parameters:** `norunningbutt` (boolean) - Disables running butt attack during recovery if `true`.
*   **Returns:** Nothing.

### `IsButtRecovering()`
*   **Description:** (Mutated only) Checks if the bearger is currently in health recovery mode.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if recovery is active.

### `WorkEntities()`
*   **Description:** (Deprecated) Destroys workable entities in front of the bearger.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` - Sets combat target on hit.
- **Listens to:** `onhitother` - Handles weapon toss and item stealing logic.
- **Listens to:** `onwakeup` - Records spawn location.
- **Listens to:** `killed` - Drops target if victim matches current target.
- **Listens to:** `newcombattarget` - Tracks target for item drop forgiveness.
- **Listens to:** `droppedtarget` - Cleans up target drop listeners.
- **Listens to:** `death` - Triggers global boss killed event and stops shedding.
- **Listens to:** `onremove` - Triggers global boss removed event.
- **Listens to:** `ms_playerjoined` / `ms_playerleft` - Tracks active players for action conflicts.
- **Listens to:** `performaction` - Detects players targeting the same object as the bearger.
- **Listens to:** `dropitem` - Checks for food drops to potentially lose aggression.
- **Listens to:** `season` - Toggles hibernation tags based on winter/spring.
- **Listens to:** `healthdelta` (Mutated) - Monitors health for recovery completion.
- **Listens to:** `temp8faceddirty` (Mutated) - Syncs 8-faced transform state.
- **Pushes:** `beargerkilled` - Fired on death with the instance as data.
- **Pushes:** `beargerremoved` - Fired on entity removal with the instance as data.