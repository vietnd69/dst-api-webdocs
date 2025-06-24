---
id: giantutils
title: Giant Utilities
description: Utility functions for giant creature movement and pathfinding behaviors
sidebar_position: 5
slug: api-vanilla/core-systems/giantutils
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Giant Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `giantutils.lua` module provides utility functions specifically designed for giant creatures in Don't Starve Together. It contains pathfinding and movement logic to help giant entities navigate away from their current position while respecting terrain constraints.

## Usage Example

```lua
-- Get a wander away point for a giant creature
local giant_pos = giant.Transform:GetWorldPosition()
local wander_point = GetWanderAwayPoint(giant_pos)

if wander_point then
    -- Move the giant to the new position
    giant.components.locomotor:GoToPoint(wander_point)
else
    -- No valid wander point found
    print("Could not find valid wander point")
end
```

## Constants

### WANDER_AWAY_DIST

**Value:** `100`

**Status:** `stable`

**Description:** The distance in world units that giants should wander away from their current position when seeking a new location.

## Functions

### GetWanderAwayPoint(pt) {#get-wander-away-point}

**Status:** `stable`

**Description:**
Finds a valid point for a giant creature to wander to, at a fixed distance away from the current position. The function attempts to find passable terrain that has a clear path from the starting point.

**Parameters:**
- `pt` (Vector3): The current position to wander away from

**Returns:**
- (Vector3/nil): A valid wander destination point, or nil if no suitable point found

**Example:**
```lua
-- Basic usage
local current_pos = Vector3(0, 0, 0)
local destination = GetWanderAwayPoint(current_pos)

if destination then
    print("Found wander point at:", destination.x, destination.z)
    -- Use destination for movement
else
    print("No valid wander point available")
end
```

**Algorithm Details:**
1. **Circular Search Pattern**: Uses a circle around the starting point with radius `WANDER_AWAY_DIST`
2. **Step Division**: Divides the circle into 12 equal steps (30-degree increments)
3. **Validation Checks**: For each potential point:
   - Checks if terrain is passable using `TheWorld.Map:IsPassableAtPoint()`
   - Verifies clear pathfinding route using `TheWorld.Pathfinder:IsClear()`
4. **Wall Ignoring**: Uses `ignorewalls = true` for pathfinding to allow giants to move through walls

**Technical Implementation:**
```lua
-- Pseudocode of the algorithm
local radius = WANDER_AWAY_DIST  -- 100 units
local steps = 12                 -- 30-degree increments
local theta = random_angle()     -- Random starting angle

for each step do
    local offset = Vector3(
        radius * cos(theta), 
        0, 
        -radius * sin(theta)
    )
    local test_point = starting_point + offset
    
    if is_passable(test_point) and has_clear_path(test_point) then
        return test_point
    end
    
    theta = theta - (360_degrees / steps)
end

return nil  -- No valid point found
```

## Pathfinding Considerations

### Terrain Validation

The function performs comprehensive terrain validation:

```lua
-- Passability check
local passable = ground.Map:IsPassableAtPoint(wx, wy, wz, false, true)

-- Parameters explained:
-- wx, wy, wz: World coordinates to test
-- false: Not ignoring walls for passability
-- true: Allowing water tiles (giants can often cross water)
```

### Path Clearance

```lua
-- Clear path verification
local clear_path = ground.Pathfinder:IsClear(
    start_x, start_y, start_z,      -- Starting position
    end_x, end_y, end_z,            -- Destination position
    { ignorewalls = true }          -- Configuration options
)
```

**Path Options:**
- `ignorewalls = true`: Allows giants to move through walls and obstacles that would block normal entities

## Usage Patterns

### Basic Giant Movement

```lua
-- Simple wander behavior for giants
local function WanderAway(giant)
    local current_pos = giant.Transform:GetWorldPosition()
    local wander_point = GetWanderAwayPoint(current_pos)
    
    if wander_point then
        if giant.components.locomotor then
            giant.components.locomotor:GoToPoint(wander_point)
            return true
        end
    end
    return false
end
```

### Fallback Behavior

```lua
-- Robust wander with fallback
local function TryWanderOrIdle(giant)
    local pos = giant.Transform:GetWorldPosition()
    local destination = GetWanderAwayPoint(pos)
    
    if destination then
        -- Found valid wander point
        giant.components.locomotor:GoToPoint(destination)
        giant.wander_time = GetTime() + math.random(10, 30)
    else
        -- No valid point, enter idle state
        giant.components.locomotor:Stop()
        giant.sg:GoToState("idle")
    end
end
```

### Defensive Positioning

```lua
-- Move away from threats or players
local function RetreatFromThreat(giant, threat_position)
    -- Use threat position as reference for wander direction
    local retreat_point = GetWanderAwayPoint(threat_position)
    
    if retreat_point then
        -- Ensure we're moving away from the threat
        local giant_pos = giant.Transform:GetWorldPosition()
        local threat_to_giant = giant_pos - threat_position
        local threat_to_retreat = retreat_point - threat_position
        
        -- Check if retreat point is in the right direction
        if threat_to_giant:Dot(threat_to_retreat) > 0 then
            giant.components.locomotor:GoToPoint(retreat_point)
            return true
        end
    end
    
    -- Fallback: move in opposite direction of threat
    return false
end
```

## Giant-Specific Considerations

### Movement Characteristics

Giants have unique movement properties that this utility accommodates:

```lua
-- Giants can ignore certain obstacles
local pathfinder_options = {
    ignorewalls = true,      -- Can break through walls
    ignorecreeps = true,     -- Not blocked by ground creep
    allowwater = true        -- Can wade through water
}
```

### Scale and Distance

The `WANDER_AWAY_DIST` value of 100 units is calibrated for giant creatures:

- **Large Movement Range**: Ensures giants don't get stuck in small areas
- **Terrain Clearance**: Provides enough distance to clear obstacles
- **Performance Balance**: Large enough for meaningful movement, small enough for quick pathfinding

## Error Handling

### No Valid Point Found

```lua
local function HandleWanderFailure(giant)
    local wander_point = GetWanderAwayPoint(giant.Transform:GetWorldPosition())
    
    if not wander_point then
        -- Possible reasons:
        -- 1. Surrounded by impassable terrain
        -- 2. On isolated island/platform
        -- 3. Pathfinder limitations
        
        -- Fallback strategies:
        giant.sg:GoToState("idle")
        -- or try smaller movement distances
        -- or enter special "stuck" behavior
    end
end
```

### Terrain Edge Cases

```lua
-- Giants near world edges or special terrain
local function SafeWander(giant)
    local pos = giant.Transform:GetWorldPosition()
    
    -- Check if we're near world boundaries
    local world_size = TheWorld.Map:GetSize()
    local margin = WANDER_AWAY_DIST + 20
    
    if pos.x < margin or pos.x > world_size - margin or
       pos.z < margin or pos.z > world_size - margin then
        -- Near edge, use more conservative movement
        return GetWanderAwayPoint(pos)  -- Still try, but expect failures
    end
    
    return GetWanderAwayPoint(pos)
end
```

## Performance Considerations

### Search Optimization

The function uses an efficient search pattern:

- **Fixed Step Count**: Only tests 12 positions maximum
- **Early Exit**: Returns immediately when valid point found
- **Circular Distribution**: Ensures even coverage around starting point

### Pathfinding Efficiency

```lua
-- Optimized for giant movement patterns
local pathfind_config = {
    ignorewalls = true,  -- Reduces pathfinding complexity
    maxdist = 100,       -- Limits search range
    quick_check = true   -- Fast validation for giants
}
```

## Integration with AI Systems

### Brain Integration

```lua
-- Use in giant brain behaviors
local function CreateWanderNode()
    return WhileNode(
        function(inst) 
            return not inst.components.combat:HasTarget() 
        end,
        "Wander",
        DoAction(inst, function()
            local pos = inst.Transform:GetWorldPosition()
            local wander_pos = GetWanderAwayPoint(pos)
            if wander_pos then
                return BufferedAction(inst, nil, ACTIONS.WALKTO, nil, wander_pos)
            end
        end)
    )
end
```

### State Graph Integration

```lua
-- Use in giant state graphs
local function wander_state()
    return State{
        name = "wander",
        tags = {"moving", "canrotate"},
        
        onenter = function(inst)
            local pos = inst.Transform:GetWorldPosition()
            local destination = GetWanderAwayPoint(pos)
            
            if destination then
                inst.components.locomotor:GoToPoint(destination)
            else
                inst.sg:GoToState("idle")
            end
        end,
        
        events = {
            EventHandler("locomotor_arrived", function(inst)
                inst.sg:GoToState("idle")
            end),
        }
    }
end
```

## Related Modules

- [Vector3](./vector3.md): 3D vector mathematics for position calculations
- [Pathfinder](./pathfinder.md): Pathfinding system for navigation
- [Map](./map.md): World map and terrain information
- [Locomotor Component](../components/locomotor.md): Entity movement component
- [Giant Brains](../brains/index.md): AI behavior systems for giant creatures
