---
id: lightflier
title: Lightflier
description: A bioluminescent flying insect prefab that forms formations around players carrying lightbulbs and provides ambient light.
tags: [creature, insect, light, formation, caves]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 94a603ce
system_scope: entity
---

# Lightflier

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Lightflier` is a passive flying insect creature found in caves that emits ambient light and can form organized formations around players carrying lightbulbs. The prefab combines multiple components for movement, combat, inventory handling, and formation behavior. Lightfliers stack in inventory, can be caught with a bug net, and will seek out players holding lightbulbs to join their formation. They provide tactical value as portable light sources and can be harvested for lightbulbs.

## Usage example
```lua
-- Spawn a lightflier in the world
local lightflier = SpawnPrefab("lightflier")
lightflier.Transform:SetPosition(x, y, z)

-- Access components for modification
lightflier.components.health:SetMaxHealth(50)
lightflier.components.locomotor.walkspeed = 6

-- Enable/disable buzzing sound
lightflier:EnableBuzz(true)

-- Check formation status
if lightflier.components.formationfollower.formationleader ~= nil then
    -- Lightflier is part of a formation
end
```

## Dependencies & tags
**External dependencies:**
- `brains/lightflierbrain` -- AI behavior tree for autonomous actions

**Components used:**
- `locomotor` -- movement control and speed management
- `stackable` -- allows multiple lightfliers to stack in inventory
- `inventoryitem` -- enables pickup and inventory storage
- `tradable` -- allows trading between players
- `workable` -- enables catching with bug net (ACTIONS.NET)
- `eater` -- defines diet preferences (vegetables)
- `sleeper` -- sleep behavior with light watching
- `combat` -- handles attack responses and hit effects
- `health` -- manages health pool
- `lootdropper` -- drops lightbulb on death
- `inspectable` -- enables player inspection text
- `knownlocations` -- remembers home position
- `homeseeker` -- returns home when detached
- `follower` -- basic following behavior
- `formationfollower` -- formation membership and positioning

**Tags:**
- `lightflier` -- primary identification tag
- `cavedweller` -- cave-dwelling creature classification
- `flying` -- indicates aerial movement type
- `ignorewalkableplatformdrowning` -- immune to platform drowning
- `insect` -- creature type classification
- `smallcreature` -- size classification for targeting
- `lightbattery` -- interacts with light-based systems
- `lunar_aligned` -- lunar rift alignment
- `NOBLOCK` -- added when in formation, removed when leaving

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_time_since_formation_attacked` | number | `-TUNING.LIGHTFLIER.ON_ATTACKED_ALERT_DURATION` | Timestamp tracking when formation was last attacked |
| `_find_target_task` | task | `nil` | Periodic task handle for target searching |
| `_hometask` | task | `nil` | Delayed task handle for returning home at day |
| `buzzing` | boolean | `false` | Whether the buzzing sound is currently playing |
| `incineratesound` | string | `"grotto/creatures/light_bug/death"` | Sound played when burned to death |
| `scrapbook_deps` | table | `{"lightbulb"}` | Scrapbook dependency for unlock tracking |

## Main functions
### `EnableBuzz(enable)`
* **Description:** Controls the ambient buzzing sound loop. Plays or kills the "fly_LP" sound based on enable state, respecting inventory and sleep status.
* **Parameters:** `enable` -- boolean to enable or disable buzzing
* **Returns:** None
* **Error states:** None

### `MakeFormation(inst, target)`
* **Description:** Creates a formation leader prefab and assigns the lightflier as the first member following the target player. Sets formation parameters including size limits, radius, and rotation speed.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `target` -- player entity to follow (must have inventory with lightbulb)
* **Returns:** None
* **Error states:** Errors if `target` is nil or invalid when accessing `target._lightflier_formation`

### `FindTarget(inst)`
* **Description:** Searches for nearby players carrying lightbulbs to join their formation. Checks alert status to avoid forming immediately after being attacked.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `StartLookingForTarget(inst)`
* **Description:** Starts a periodic task that calls FindTarget at FIND_TARGET_FREQUENCY intervals. Cancels any existing search task first.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `StopLookingForTarget(inst)`
* **Description:** Cancels the periodic target search task if active. Clears the task reference.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnWorked(inst, worker)`
* **Description:** Callback when a player uses a bug net on the lightflier. Notifies childspawner if owned, and gives the lightflier to the worker's inventory.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `worker` -- player entity that performed the work action
* **Returns:** None
* **Error states:** None

### `OnAttacked(inst, attacker, damage)`
* **Description:** Response to being attacked. Alerts the formation (if member) causing all members to disband and enter alert cooldown.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `attacker` -- entity that dealt damage
  - `damage` -- amount of damage dealt
* **Returns:** None
* **Error states:** None

### `OnTeleported(inst)`
* **Description:** Response to teleportation. Disbands the formation if the lightflier is currently a formation member.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnSleepGoHome(inst)`
* **Description:** Returns the lightflier to its home childspawner when sleeping. Called via delayed task at daytime.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnIsDay(inst, isday)`
* **Description:** Watches world day state. Schedules home return task during daytime, cancels during nighttime.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `isday` -- boolean indicating current day state
* **Returns:** None
* **Error states:** None

### `OnHaunt(inst, haunter)`
* **Description:** Response to being haunted by a ghost player. Alerts formation, wakes from sleep, and may trigger panic behavior.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `haunter` -- ghost entity performing the haunt
* **Returns:** `true` if panic triggered, `false` otherwise
* **Error states:** None

### `OnEntitySleep(inst)`
* **Description:** Initialization callback when entity enters sleep/limbo. Sets up day state watching and stops target searching.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnEntityWake(inst)`
* **Description:** Initialization callback when entity exits sleep/limbo. Removes day state listeners and resumes target searching if not held.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnPutInInventory(inst)`
* **Description:** Callback when lightflier is placed in inventory. Stops target searching, formation updating, and buzzing sound.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnDropped(inst)`
* **Description:** Callback when lightflier is dropped from inventory. Resets state graph, handles stack splitting, and resumes target searching and buzzing.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `AlertFormation(inst)`
* **Description:** Triggers alert state on formation members. Sets attack alert timestamps and disbands the formation.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnLeaveFormation(inst, leader)`
* **Description:** Callback when lightflier leaves a formation. Checks distance to home and detaches from childspawner if too far. Removes NOBLOCK tag.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `leader` -- formation leader entity
* **Returns:** None
* **Error states:** None

### `OnEnterFormation(inst, leader)`
* **Description:** Callback when lightflier joins a formation. Stops locomotion and adds NOBLOCK tag.
* **Parameters:**
  - `inst` -- lightflier entity instance
  - `leader` -- formation leader entity
* **Returns:** None
* **Error states:** None

### `LeaderOnUpdate(inst)`
* **Description:** Update function for formation leader. Validates target distance and updates offset position with lerp smoothing. Disbands if target too far.
* **Parameters:** `inst` -- formation leader entity instance
* **Returns:** None
* **Error states:** None

### `LeaderValidateFormation(inst)`
* **Description:** Periodic validation for formation leader. Checks target validity, distributes members to other formations, and seeks new targets.
* **Parameters:** `inst` -- formation leader entity instance
* **Returns:** None
* **Error states:** None

### `FollowerOnUpdate(inst, targetpos)`
* **Description:** Update function for formation followers. Adjusts walk speed based on distance to target position and faces the target.
* **Parameters:**
  - `inst` -- follower entity instance
  - `targetpos` -- vector position to move toward
* **Returns:** None
* **Error states:** None

### `MakeCurrentPositionHome(inst)`
* **Description:** Records the current position as the home location in knownlocations component.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `SleepTest(inst)`
* **Description:** Sleep test function that always returns false. Lightfliers do not sleep naturally.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** `false`
* **Error states:** None

### `GoToSleep(inst)`
* **Description:** Callback when entering sleep state. Disables buzzing sound.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `OnWakeUp(inst)`
* **Description:** Callback when waking from sleep. Enables buzzing sound.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `StopWatchingDay(inst)`
* **Description:** Stops watching the world day state and cancels home task.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

### `StartWatchingDay(inst)`
* **Description:** Starts watching the world day state and triggers initial OnIsDay callback.
* **Parameters:** `inst` -- lightflier entity instance
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `attacked` -- triggers AlertFormation on damage
- **Listens to:** `teleported` -- disbands formation on teleport
- **Listens to:** `gotosleep` -- disables buzzing sound
- **Listens to:** `onwakeup` -- enables buzzing sound
- **Listens to:** `enterlimbo` -- stops day watching task
- **Listens to:** `exitlimbo` -- resumes day watching task
- **Pushes:** `detachchild` -- fired when leaving formation beyond home distance threshold