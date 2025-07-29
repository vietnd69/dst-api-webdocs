---
id: ocean-util
title: Ocean Utilities
description: Utility functions for ocean mechanics, water depth, wave spawning, and entity sinking in Don't Starve Together
sidebar_position: 1

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Ocean Utilities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ocean_util` module provides a comprehensive set of utility functions for handling ocean mechanics in Don't Starve Together. It includes functions for tile type checking, water depth calculation, wave spawning, entity sinking mechanics, and flying creature management. These utilities are essential for ocean-related gameplay features and world interaction systems.

## Usage Example

```lua
-- Basic tile checking
local is_ocean = IsOceanTile(tile)
local is_land = IsLandTile(tile)

-- Get ocean depth at a position
local depth = GetOceanDepthAtPosition(x, y, z)
if depth and depth > 0 then
    print("Deep water detected: " .. depth)
end

-- Spawn attack waves around a position
local waves_spawned = SpawnAttackWaves(
    position,        -- center position
    rotation,        -- starting rotation
    spawn_radius,    -- radius from center
    5,              -- number of waves
    180,            -- total angle coverage
    8,              -- wave speed
    "wave_large",   -- wave prefab
    3,              -- idle time
    false           -- not instant active
)
```

## Tile Checking Functions

### IsOceanTile(tile) {#is-ocean-tile}

**Status:** `stable`

**Description:**
Checks if the specified tile is an ocean tile type.

**Parameters:**
- `tile` (WORLD_TILES): The tile constant to check

**Returns:**
- (boolean): `true` if the tile is an ocean tile, `false` otherwise

**Example:**
```lua
local tile = TheWorld.Map:GetTileAtPoint(x, y, z)
if IsOceanTile(tile) then
    print("Player is over water")
else
    print("Player is on land or other terrain")
end
```

### IsLandTile(tile) {#is-land-tile}

**Status:** `stable`

**Description:**
Checks if the specified tile is a land tile type (non-ocean).

**Parameters:**
- `tile` (WORLD_TILES): The tile constant to check

**Returns:**
- (boolean): `true` if the tile is a land tile, `false` otherwise

**Example:**
```lua
local tile = TheWorld.Map:GetTileAtPoint(x, y, z)
if IsLandTile(tile) then
    print("Safe to build structures here")
end
```

## Ocean Depth Functions

### GetOceanDepthAtPosition(x, y, z) {#get-ocean-depth-at-position}

**Status:** `stable`

**Description:**
Retrieves the ocean depth value at the specified world coordinates.

**Parameters:**
- `x` (number): World X coordinate
- `y` (number): World Y coordinate  
- `z` (number): World Z coordinate

**Returns:**
- (number|nil): Ocean depth value, or `nil` if position is not in ocean or invalid

**Example:**
```lua
local depth = GetOceanDepthAtPosition(100, 0, 200)
if depth then
    if depth > 10 then
        print("Deep ocean - submarines can navigate here")
    else
        print("Shallow water - boats can navigate here")
    end
else
    print("Not in ocean")
end
```

### GetOceanDepthAtPoint(pt) {#get-ocean-depth-at-point}

**Status:** `stable`

**Description:**
Convenience function to get ocean depth at a Vector3 point.

**Parameters:**
- `pt` (Vector3): Point with x, y, z coordinates

**Returns:**
- (number|nil): Ocean depth value, or `nil` if position is not in ocean or invalid

**Example:**
```lua
local player_pos = ThePlayer:GetPosition()
local depth = GetOceanDepthAtPoint(player_pos)
if depth and depth > 5 then
    -- Player is in moderately deep water
    SpawnPrefab("deep_water_creature").Transform:SetPosition(player_pos:Get())
end
```

## Wave Spawning Functions

### SpawnAttackWaves(position, rotation, spawn_radius, numWaves, totalAngle, waveSpeed, wavePrefab, idleTime, instantActive) {#spawn-attack-waves}

**Status:** `stable`

**Description:**
Spawns multiple attack waves in a pattern around a central position. Useful for boss attacks, spell effects, or environmental hazards.

**Parameters:**
- `position` (Vector3): Central position for wave spawning
- `rotation` (number, optional): Starting rotation angle in degrees (random if nil)
- `spawn_radius` (number, optional): Radius from center to spawn waves (default: 0)
- `numWaves` (number): Number of waves to spawn
- `totalAngle` (number, optional): Total angle coverage in degrees (default: 360)
- `waveSpeed` (number|table, optional): Wave speed or velocity table (default: 6)
- `wavePrefab` (string, optional): Wave prefab name (default: "wave_med")
- `idleTime` (number, optional): Time before wave becomes active (default: 5)
- `instantActive` (boolean, optional): Whether waves activate immediately (default: false)

**Returns:**
- (boolean): `true` if at least one wave was spawned, `false` if none spawned

**Example:**
```lua
-- Spawn a circular wave attack around boss
local boss_pos = boss:GetPosition()
local waves_created = SpawnAttackWaves(
    boss_pos,        -- center on boss
    0,               -- start at 0 degrees
    8,               -- spawn 8 units away
    8,               -- create 8 waves
    360,             -- full circle
    12,              -- fast wave speed
    "wave_large",    -- use large waves
    2,               -- 2 second delay
    false            -- not instant
)

if waves_created then
    boss:PushEvent("wave_attack_initiated")
end

-- Spawn directional wave attack
SpawnAttackWaves(
    caster_pos,      -- from caster
    target_angle,    -- aim at target
    5,               -- 5 units away
    3,               -- 3 waves
    60,              -- 60 degree spread
    {10, 0, 0},      -- velocity vector
    "wave_spell",    -- magic wave type
    0,               -- instant activation
    true             -- activate immediately
)
```

### SpawnAttackWave(position, rotation, waveSpeed, wavePrefab, idleTime, instantActive) {#spawn-attack-wave}

**Status:** `stable`

**Description:**
Spawns a single attack wave. Convenience wrapper for `SpawnAttackWaves` with `numWaves = 1`.

**Parameters:**
- `position` (Vector3): Position to spawn the wave
- `rotation` (number, optional): Wave rotation angle in degrees
- `waveSpeed` (number|table, optional): Wave speed or velocity (default: 6)
- `wavePrefab` (string, optional): Wave prefab name (default: "wave_med")
- `idleTime` (number, optional): Time before activation (default: 5)
- `instantActive` (boolean, optional): Immediate activation (default: false)

**Returns:**
- (boolean): `true` if wave was spawned, `false` otherwise

**Example:**
```lua
-- Spawn single wave toward player
local wave_spawned = SpawnAttackWave(
    enemy_pos,          -- from enemy position
    angle_to_player,    -- aimed at player
    15,                 -- fast speed
    "wave_boss",        -- boss wave type
    1,                  -- 1 second delay
    false               -- delayed activation
)
```

## Pathfinding Functions

### FindLandBetweenPoints(p0x, p0y, p1x, p1y) {#find-land-between-points}

**Status:** `stable`

**Description:**
Finds the first land tile along a line between two points using Bresenham-like algorithm. Useful for pathfinding from ocean to shore.

**Parameters:**
- `p0x` (number): Starting X coordinate
- `p0y` (number): Starting Y coordinate (treated as Z in world space)
- `p1x` (number): Ending X coordinate
- `p1y` (number): Ending Y coordinate (treated as Z in world space)

**Returns:**
- (Vector3|nil): Position of first land tile found, or `nil` if no land found

**Example:**
```lua
-- Find shore from ocean position
local ocean_x, ocean_z = 100, 200
local target_x, target_z = 50, 150

local shore_point = FindLandBetweenPoints(ocean_x, ocean_z, target_x, target_z)
if shore_point then
    print("Found shore at: " .. shore_point.x .. ", " .. shore_point.z)
    -- Move entity to shore
    entity.Transform:SetPosition(shore_point:Get())
else
    print("No land found between points")
end
```

### FindRandomPointOnShoreFromOcean(x, y, z, excludeclosest) {#find-random-point-on-shore-from-ocean}

**Status:** `stable`

**Description:**
Finds a random accessible shore point from an ocean position. Prioritizes nearby nodes and handles shallow water specially.

**Parameters:**
- `x` (number): Starting X coordinate in ocean
- `y` (number): Starting Y coordinate
- `z` (number): Starting Z coordinate in ocean
- `excludeclosest` (boolean, optional): Whether to exclude the closest shore point

**Returns:**
- (number, number, number|nil): Shore coordinates (x, y, z), or `nil` if no shore found

**Example:**
```lua
-- Teleport drowning player to random shore
local player_x, player_y, player_z = player.Transform:GetWorldPosition()

if IsOceanTile(TheWorld.Map:GetTileAtPoint(player_x, player_y, player_z)) then
    local shore_x, shore_y, shore_z = FindRandomPointOnShoreFromOcean(
        player_x, player_y, player_z, 
        true  -- exclude closest to add variety
    )
    
    if shore_x then
        player.Transform:SetPosition(shore_x, shore_y, shore_z)
        player:PushEvent("teleported_to_shore")
    end
end
```

## Flying Creature Management

### LandFlyingCreature(creature) {#land-flying-creature}

**Status:** `stable`

**Description:**
Transitions a flying creature to landed state, updating tags, collision, and triggering events.

**Parameters:**
- `creature` (Entity): The flying creature entity to land

**Example:**
```lua
-- Force bird to land when targeted by player
local function ForceBirdLanding(bird, player)
    if bird:HasTag("flying") then
        LandFlyingCreature(bird)
        bird.components.combat:SetTarget(player)
        
        -- Bird will now be affected by ground-based mechanics
        bird:DoTaskInTime(5, function()
            RaiseFlyingCreature(bird)  -- Take off after 5 seconds
        end)
    end
end
```

### RaiseFlyingCreature(creature) {#raise-flying-creature}

**Status:** `stable`

**Description:**
Transitions a creature to flying state, updating tags, collision, and triggering events.

**Parameters:**
- `creature` (Entity): The creature entity to make fly

**Example:**
```lua
-- Make creature fly when threatened
local function MakeCreatureFly(creature)
    if not creature:HasTag("flying") then
        RaiseFlyingCreature(creature)
        
        -- Flying creatures avoid ground obstacles
        creature.components.locomotor:SetExternalSpeedMultiplier(creature, "flying", 1.5)
    end
end
```

## Entity Sinking System

### ShouldEntitySink(entity, entity_sinks_in_water) {#should-entity-sink}

**Status:** `stable`

**Description:**
Determines if an entity should sink based on its position and water interaction rules.

**Parameters:**
- `entity` (Entity): Entity to check for sinking
- `entity_sinks_in_water` (boolean): Whether this entity type sinks in water

**Returns:**
- (boolean): `true` if entity should sink, `false` otherwise

**Example:**
```lua
-- Check if dropped item should sink
local function CheckItemSinking(item)
    local should_sink = ShouldEntitySink(item, true)
    if should_sink then
        print("Item will sink in water")
        SinkEntity(item)
    end
end
```

### GetSinkEntityFXPrefabs(entity, px, py, pz) {#get-sink-entity-fx-prefabs}

**Status:** `stable`

**Description:**
Gets appropriate visual effects for entity sinking based on tile type at position.

**Parameters:**
- `entity` (Entity): Entity that is sinking
- `px` (number): X position
- `py` (number): Y position  
- `pz` (number): Z position

**Returns:**
- (table): Array of FX prefab names
- (boolean): Whether fallback FX was used (out of bounds)

**Available FX Types:**
- **OCEAN**: `{"splash_sink"}` - Ocean tile sinking effects
- **VOID**: `{"fallingswish_clouds", "fallingswish_lines"}` - Void/impassable tile effects
- **FALLBACK**: `{"splash_ocean"}` - Default/legacy ocean effects

**Example:**
```lua
-- Custom entity sinking with specific effects
local function SinkEntityWithCustomFX(entity)
    local px, py, pz = entity.Transform:GetWorldPosition()
    local fx_prefabs, is_fallback = GetSinkEntityFXPrefabs(entity, px, py, pz)
    
    if is_fallback then
        print("Using fallback FX - entity may be out of bounds")
    end
    
    -- Spawn custom effects before standard ones
    SpawnPrefab("custom_sink_warning").Transform:SetPosition(px, py, pz)
    
    -- Spawn standard effects
    for _, fx_prefab in pairs(fx_prefabs) do
        local fx = SpawnPrefab(fx_prefab)
        fx.Transform:SetPosition(px, py, pz)
    end
    
    entity:Remove()
end
```

### SinkEntity(entity) {#sink-entity}

**Status:** `stable`

**Description:**
Handles complete entity sinking process including inventory dropping, FX spawning, and entity removal or relocation.

**Parameters:**
- `entity` (Entity): Entity to sink

**Special Handling:**
- **Irreplaceable items**: Entities with `"irreplaceable"` tag are moved to shore instead of removed
- **Shore-seeking items**: Entities with `"shoreonsink"` tag are moved to shore
- **Container entities**: All contents are dropped before sinking
- **FX spawning**: Appropriate visual effects are spawned based on tile type

**Example:**
```lua
-- Sink player's boat when destroyed
local function DestroyBoat(boat)
    -- Drop all passengers and cargo first
    if boat.components.container then
        boat.components.container:DropEverything()
    end
    
    -- Eject any riders
    if boat.components.rideable then
        boat.components.rideable:Buck()
    end
    
    -- Sink the boat (will spawn appropriate FX)
    SinkEntity(boat)
    
    -- Notify nearby players
    local x, y, z = boat.Transform:GetWorldPosition()
    local nearby_players = FindPlayersInRange(x, y, z, 20, true)
    for _, player in pairs(nearby_players) do
        player:PushEvent("boat_sunk", {boat = boat})
    end
end
```

## Utility Functions

### CanProbablyReachTargetFromShore(inst, target, max_distance) {#can-probably-reach-target-from-shore}

**Status:** `stable`

**Description:**
Estimates if an entity can reach a target from the shore within a maximum distance.

**Parameters:**
- `inst` (Entity): Entity attempting to reach target
- `target` (Entity): Target entity
- `max_distance` (number): Maximum distance to check

**Returns:**
- (boolean): `true` if target is probably reachable from shore, `false` otherwise

**Example:**
```lua
-- Check if enemy can chase player onto land
local function CanChaseToLand(sea_creature, player)
    local can_reach = CanProbablyReachTargetFromShore(sea_creature, player, 15)
    
    if can_reach then
        -- Sea creature can temporarily come ashore
        sea_creature.components.combat:SetTarget(player)
        sea_creature:AddTag("temporary_land_dweller")
        
        -- Return to water after some time
        sea_creature:DoTaskInTime(30, function()
            sea_creature:RemoveTag("temporary_land_dweller")
            -- Find water and return
        end)
    else
        print("Target too far inland - give up chase")
        sea_creature.components.combat:SetTarget(nil)
    end
    
    return can_reach
end
```

### TintByOceanTile(inst) {#tint-by-ocean-tile}

**Status:** `stable`

**Description:**
Applies color tinting to an entity based on the ocean tile it's positioned over. Removes entity if not over water.

**Parameters:**
- `inst` (Entity): Entity to tint based on ocean tile

**Example:**
```lua
-- Apply water-based tinting to wave effects
local function CreateTintedWave(prefab_name, position)
    local wave = SpawnPrefab(prefab_name)
    wave.Transform:SetPosition(position:Get())
    
    -- Tint wave based on water type (deep blue, shallow green, etc.)
    TintByOceanTile(wave)
    
    return wave
end

-- Custom tinting for special water effects
local function CreateMagicWater(position)
    local magic_water = SpawnPrefab("magic_water_effect")
    magic_water.Transform:SetPosition(position:Get())
    
    -- Apply base tinting first
    TintByOceanTile(magic_water)
    
    -- Then add magical overlay
    magic_water:DoTaskInTime(0.1, function()
        magic_water.AnimState:SetAddColour(0.5, 0, 0.5, 0)  -- Purple magical tint
    end)
end
```

## Integration Examples

### Ocean Traversal System

```lua
-- Complete ocean traversal and safety system
local OceanTraversalSystem = {}

function OceanTraversalSystem:CheckPlayerSafety(player)
    local x, y, z = player.Transform:GetWorldPosition()
    local tile = TheWorld.Map:GetTileAtPoint(x, y, z)
    
    if IsOceanTile(tile) then
        local depth = GetOceanDepthAtPosition(x, y, z)
        
        if depth and depth > 10 then
            -- Deep water - player needs boat or swimming ability
            if not player:HasTag("swimming") and not player:GetCurrentPlatform() then
                self:InitiateWaterRescue(player, x, y, z)
                return false
            end
        elseif depth and depth > 0 then
            -- Shallow water - slower movement but survivable
            player.components.locomotor:SetExternalSpeedMultiplier(player, "shallow_water", 0.5)
        end
    else
        -- On land - remove water speed penalty
        player.components.locomotor:RemoveExternalSpeedMultiplier(player, "shallow_water")
    end
    
    return true
end

function OceanTraversalSystem:InitiateWaterRescue(player, x, y, z)
    -- Find nearest shore
    local shore_x, shore_y, shore_z = FindRandomPointOnShoreFromOcean(x, y, z)
    
    if shore_x then
        -- Spawn rescue waves to push player to shore
        SpawnAttackWaves(
            Vector3(x, y, z),    -- from player position
            math.atan2(shore_z - z, shore_x - x) * RADIANS,  -- toward shore
            2,                   -- close to player
            1,                   -- single rescue wave
            0,                   -- direct line
            {5, 0, 0},          -- push toward shore
            "wave_rescue",      -- special rescue wave
            0,                  -- immediate
            true                -- instant active
        )
        
        player:PushEvent("water_rescue_initiated")
    else
        -- Emergency teleport if no shore found
        SinkEntity(player)  -- Will handle irreplaceable tag
    end
end

return OceanTraversalSystem
```

## Constants

The module references several constants defined elsewhere:

- **WAVE_SPAWN_DISTANCE**: `1.5` - Standard distance offset for wave spawning
- **TILE_SCALE**: Tile scaling factor for pathfinding calculations
- **SINKENTITY_PREFABS**: Table mapping tile types to appropriate FX prefabs

## Related Modules

- [Tile Group Manager](./constants.md): Manages tile type classification and properties
- [World Map](./map/): World tile and topology management
- [Physics](./physics.md): Collision and movement systems
- [Combat](../components/combat.md): Combat targeting and interaction
- [Prefabs](./prefabs.md): Entity spawning and management system

## Performance Considerations

- **Tile Checking**: Uses efficient TileGroupManager calls for tile type verification
- **Pathfinding**: FindLandBetweenPoints uses optimized line-drawing algorithm
- **Wave Spawning**: Batches multiple wave creation for performance
- **FX Management**: Selective FX spawning based on tile type reduces overhead
- **Entity Sinking**: Minimal processing for simple cases, more complex handling only for special tags
