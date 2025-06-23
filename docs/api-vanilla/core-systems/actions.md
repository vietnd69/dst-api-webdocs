---
id: actions
title: Actions
description: Player interaction and action system for Don't Starve Together
sidebar_position: 2
slug: /api-vanilla/core-systems/actions
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Actions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `actions.lua` module defines all possible player interactions in Don't Starve Together. It contains the `Action` class for defining interaction types and a comprehensive list of all available actions. Actions represent everything from basic movement and item usage to complex crafting and combat mechanics.

## Usage Example

```lua
-- Access an action
local action = ACTIONS.CHOP

-- Check action properties
print("Priority:", action.priority)
print("Distance:", action.distance)
print("Mount valid:", action.mount_valid)

-- Create a BufferedAction (usually done by the game)
local buffered_action = BufferedAction(player, tree, ACTIONS.CHOP, axe)

-- Execute action function
local success = action.fn(buffered_action)
```

## Classes/Components

### Action

**Status:** `stable`

**Description:**
Class that defines the template for an interaction type. Specifies conditions, requirements, and behavior for player actions.

**Version History:**
- Current implementation in build 676042

#### Constructor

```lua
Action = Class(function(self, data, instant, rmb, distance, ghost_valid, ghost_exclusive, canforce, rangecheckfn)
    -- Modern usage (table format recommended):
    local myAction = Action({
        priority = 2,
        rmb = true,
        distance = 3,
        mount_valid = true
    })
end)
```

> **Note**: Positional parameters are deprecated. Always use table format for new actions.

#### Properties

**Core Properties:**
- `priority` (number): Action priority (default: 0). Higher values take precedence
- `fn` (function): Execution function, returns `true` for success (default: returns `false`)
- `strfn` (function): Optional string variation function
- `instant` (boolean): Whether action happens instantly without animation (default: `false`)
- `rmb` (boolean): Whether action is triggered by right-mouse button (default: `nil`)

**Distance Properties:**
- `distance` (number): Maximum distance to perform action (default: `nil`)
- `mindistance` (number): Minimum distance required (default: `nil`) 
- `arrivedist` (number): Distance considered "arrived" at target (default: `nil`)
- `extra_arrive_dist` (function): Function to calculate additional arrival distance

**Validity Properties:**
- `ghost_valid` (boolean): Can be performed as ghost (default: `false`)
- `ghost_exclusive` (boolean): Can ONLY be performed as ghost (default: `false`)
- `mount_valid` (boolean): Can be performed while mounted (default: `false`)
- `encumbered_valid` (boolean): Can be performed while carrying heavy objects (default: `false`)
- `paused_valid` (boolean): Can be performed while game is paused (default: `false`)

**Interaction Properties:**
- `canforce` (boolean): Whether action can be forced (default: `nil`)
- `rangecheckfn` (function): Custom range check function (default: `nil`)
- `silent_fail` (boolean): Suppress failure notifications (default: `nil`)
- `invalid_hold_action` (boolean): Cannot be held/repeated (default: `nil`)

**Platform and Movement:**
- `is_relative_to_platform` (boolean): Position relative to boat/platform (default: `nil`)
- `disable_platform_hopping` (boolean): Disable platform hopping (default: `nil`)
- `skip_locomotor_facing` (boolean): Skip automatic facing behavior (default: `nil`)
- `do_not_locomote` (boolean): Prevent movement during action (default: `nil`)
- `customarrivecheck` (function): Custom arrival check function

**UI and Audio:**
- `actionmeter` (boolean): Show progress meter (default: `nil`)
- `theme_music` (string): Music to play during action (default: `nil`)
- `theme_music_fn` (function): Client-side function for theme music (default: `nil`)
- `tile_placer` (string): Type of tile placer to show (default: `nil`)
- `show_tile_placer_fn` (function): When to show tile placer (default: `nil`)

**Map Actions:**
- `map_action` (boolean): Only handled from map with translations (default: `nil`)
- `closes_map` (boolean): Immediately close minimap on action start (default: `nil`)
- `map_only` (boolean): Action only exists from map (default: `nil`)
- `map_works_on_unexplored` (boolean): Bypass visibility checks (default: `nil`)

**Callbacks:**
- `pre_action_cb` (function): Runs before action execution on client and server (default: `nil`)

## Functions

### MakeRangeCheckFn(range) {#make-range-check-fn}

**Status:** `stable`

**Description:**
Factory function that creates range check functions with specified distance.

**Parameters:**
- `range` (number): Maximum range for the check

**Returns:**
- (function): Range check function that tests if doer is near target

**Example:**
```lua
local CustomRangeCheck = MakeRangeCheckFn(5)
-- Returns function that checks if doer is within 5 units of target
```

**Version History:**
- Current implementation in build 676042

### PhysicsPaddedRangeCheck(doer, target) {#physics-padded-range-check}

**Status:** `stable`

**Description:**
Range check that accounts for target's physics radius plus padding.

**Parameters:**
- `doer` (Entity): Entity performing the action
- `target` (Entity): Target entity

**Returns:**
- (boolean): Whether target is within padded physics range

**Example:**
```lua
-- Used for actions on large objects
local in_range = PhysicsPaddedRangeCheck(player, large_structure)
```

**Version History:**
- Current implementation in build 676042

## Constants

### HIGH_ACTION_PRIORITY

**Value:** `10`

**Status:** `stable`

**Description:** Priority value for actions that should always dominate when available. Used for critical actions like map-based interactions.

### DefaultRangeCheck

**Value:** `MakeRangeCheckFn(4)`

**Status:** `stable`

**Description:** Standard range check function with 4 unit range.

## Core Actions

The module defines numerous action constants in the `ACTIONS` table. Key categories include:

### Basic Interactions

| Action | Priority | Distance | Mount Valid | Description |
|--------|----------|----------|-------------|-------------|
| `PICKUP` | 1 | - | ✓ | Pick up items from ground |
| `DROP` | -1 | - | ✓ | Drop items from inventory |
| `EQUIP` | 0 | - | ✓ | Equip items from inventory |
| `UNEQUIP` | -2 | - | ✓ | Unequip equipped items |
| `LOOKAT` | -3 | 3 | ✓ | Examine objects |
| `WALKTO` | -4 | - | ✓ | Move to position |
| `TALKTO` | 3 | - | ✓ | Talk to NPCs |
| `INTERACT_WITH` | 0 | 1.5 | ✓ | General interaction |

### Tool Actions

| Action | Priority | Distance | Hold Invalid | Description |
|--------|----------|----------|--------------|-------------|
| `CHOP` | 0 | 1.75 | ✓ | Chop trees with axe |
| `MINE` | 0 | - | ✓ | Mine rocks and minerals |
| `DIG` | - | - | ✓ | Dig objects (RMB) |
| `HAMMER` | 3 | - | ✓ | Hammer structures |
| `ATTACK` | 2 | - | ✓ | Attack creatures/objects |
| `NET` | 3 | - | - | Catch bugs with net |

### Fire and Light

| Action | Priority | Distance | Mount Valid | Description |
|--------|----------|----------|-------------|-------------|
| `LIGHT` | -4 | - | - | Light objects on fire |
| `EXTINGUISH` | 0 | - | - | Extinguish fires |
| `STOKEFIRE` | - | 8 | ✓ | Stoke fires (RMB) |
| `ADDFUEL` | 0 | - | ✓ | Add fuel to objects |
| `ADDWETFUEL` | 0 | - | ✓ | Add wet fuel to objects |

### Ocean Actions

| Action | Priority | Distance | Platform Related | Description |
|--------|----------|----------|------------------|-------------|
| `FISH_OCEAN` | - | - | ✓ | Ocean fishing (RMB) |
| `OCEAN_FISHING_CAST` | 3 | - | ✓ | Cast fishing line (RMB) |
| `OCEAN_FISHING_REEL` | 5 | - | - | Reel in fish (RMB) |
| `ROW` | 0 | - | ✓ | Row boat |

### High Priority Actions

Actions with `HIGH_ACTION_PRIORITY` (10):

| Action | Description |
|--------|-------------|
| `TOGGLE_DEPLOY_MODE` | Toggle deploy mode |
| `BLINK` | Teleportation |
| `BLINK_MAP` | Map-based teleportation |
| `JUMPIN_MAP` | Map-based wormhole travel |

## Action Execution Functions

Each action has an execution function (`action.fn`) that defines what happens when the action is performed. These functions receive a `BufferedAction` parameter and return `true` for success or `false` for failure.

### Example Action Functions

```lua
-- Simple action function
ACTIONS.PICKUP.fn = function(act)
    if act.doer.components.inventory then
        return act.doer.components.inventory:GiveItem(act.target)
    end
    return false
end

-- Action with component interaction
ACTIONS.CHOP.fn = function(act)
    if act.target.components.workable then
        return act.target.components.workable:WorkedBy(act.doer, act.invobject)
    end
    return false
end
```

## Range Check Functions

Several built-in range check functions are available:

### Custom Range Checks

```lua
-- Ocean fishing range check
local function CheckFishingOceanRange(doer, dest)
    local doer_pos = doer:GetPosition()
    local target_pos = Vector3(dest:GetPoint())
    local dir = target_pos - doer_pos
    local test_pt = doer_pos + dir:GetNormalized() * (doer:GetPhysicsRadius(0) + 0.25)
    
    if TheWorld.Map:IsVisualGroundAtPoint(test_pt.x, 0, test_pt.z) then
        return FindVirtualOceanEntity(test_pt.x, 0, test_pt.z) ~= nil
    else
        return true
    end
end

-- Tile placement range check
local function CheckTileWithinRange(doer, dest)
    local doer_pos = doer:GetPosition()
    local target_pos = Vector3(dest:GetPoint())
    local tile_x, tile_y, tile_z = TheWorld.Map:GetTileCenterPoint(target_pos.x, 0, target_pos.z)
    local dist = TILE_SCALE * 0.5
    return math.abs(tile_x - doer_pos.x) <= dist and math.abs(tile_z - doer_pos.z) <= dist
end
```

## Extra Distance Functions

Functions that calculate additional distance requirements:

### ExtraDeployDist(doer, dest, bufferedaction)

Calculates extra distance needed for deployment based on:
- Projectile items (+8 units)
- Cross-terrain deployment (+1 unit)
- Items with deploy spacing

### ExtraPickupRange(doer, dest)

Adds extra range for picking up items on water (+0.75 units).

### ExtraDropDist(doer, dest, bufferedaction)

Calculates extra distance for dropping items:
- On water (+1.75 units)
- Based on item physics radius

## Global Variables

### CLIENT_REQUESTED_ACTION

**Type:** `Action | nil`

**Status:** `stable`

**Description:** Stores the currently requested action from client, used for action synchronization.

### ACTIONS_MAP_REMAP

**Type:** `table`

**Status:** `stable`

**Description:** Maps normal actions to their map-based equivalents for map interface interactions.

## Module Functions

### SetClientRequestedAction(actioncode, mod_name)

Sets the client requested action for synchronization.

### ClearClientRequestedAction()

Clears the current client requested action.

## Implementation Details

### Action Priority System

- **Negative priorities (-4 to -1)**: Background actions (walk, look, drop)
- **Zero priority (0)**: Standard interactions  
- **Positive priorities (1-3)**: Important actions
- **High priority (10)**: Actions that should always dominate

### Distance Management

- Actions can specify `distance`, `mindistance`, and `arrivedist`
- Custom range checks via `rangecheckfn`
- Dynamic distance calculation via `extra_arrive_dist`

### Platform Integration

- Actions can be relative to platforms (`is_relative_to_platform`)
- Platform hopping can be disabled (`disable_platform_hopping`)
- Custom arrival checks for water/platform boundaries

### Map Actions

- Map-only actions (`map_only`) exist solely in map interface
- Map actions (`map_action`) have translations for map use
- Some actions close the map automatically (`closes_map`)

## Related Modules

- [Buffered Action](bufferedaction.md): Instance-specific action execution
- [Component Actions](componentactions.md): Component-based action definitions
- [State Graphs](../stategraphs/stategraph.md): Action animation and timing
- [Player Controller](playercontroller.md): Action input and execution handling 