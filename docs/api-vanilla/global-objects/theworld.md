---
id: theworld
title: TheWorld
sidebar_position: 2
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# TheWorld

TheWorld is the main global object representing the game world in Don't Starve Together. It provides access to the world state, terrain information, components, and event management.

## World State and Properties

```lua
-- Check if this is the master simulation (server)
local is_master = TheWorld.ismastersim

-- Check if the world is a cave
local is_cave = TheWorld:HasTag("cave")

-- Get the current phase of the day
local phase = TheWorld.state.phase -- Returns "day", "dusk", or "night"

-- Get the current season
local season = TheWorld.state.season -- Returns "autumn", "winter", "spring", or "summer"

-- Get the current weather
local is_raining = TheWorld.state.israining
local is_snowing = TheWorld.state.issnowing
local is_windy = TheWorld.state.iswindy

-- Get the current moon phase
local moon_phase = TheWorld.state.moonphase -- 0 to 8, where 0 is new moon and 4 is full moon
```

## Map and Terrain

```lua
-- Get the world map
local map = TheWorld.Map

-- Check if a point is on land
local is_on_land = TheWorld.Map:IsAboveGroundAtPoint(x, y, z)

-- Check if a point is in the ocean
local is_in_ocean = TheWorld.Map:IsOceanAtPoint(x, y, z)

-- Get the tile at a point
local tile_type = TheWorld.Map:GetTileAtPoint(x, y, z) -- Returns WORLD_TILES enum value

-- Check if terrain can be modified at a point
local can_terraform = TheWorld.Map:CanTerraformAtPoint(x, y, z)

-- Check if the soil can be tilled at a point
local can_till = TheWorld.Map:CanTillSoilAtPoint(x, y, z)

-- Get a platform (boat) at a point
local boat = TheWorld.Map:GetPlatformAtPoint(x, z)
```

## World Components

TheWorld contains many components that manage different aspects of the game. Here are some important ones:

```lua
-- Seasons component
local seasons = TheWorld.components.seasons
local days_left = seasons:GetDaysLeftInSeason()
local total_days = seasons:GetSeasonLength()

-- Weather components
local precipitation = TheWorld.components.precipitation
local wetness_rate = precipitation:GetWetnessRate()

-- Time component
local time = TheWorld.components.worldstate.data.time -- Current time of day (0-1)
local cycles = TheWorld.components.worldstate.data.cycles -- Number of days passed

-- Monster spawners
local hounds = TheWorld.components.hounded
hounds:ForceActivePhase() -- Trigger a hound attack

-- Special spawners for giants
local deerclops = TheWorld.components.deerclopsspawner
local bearger = TheWorld.components.beargerspawner
local malbatross = TheWorld.components.malbatrossspawner

-- Special environment components
local moonstorms = TheWorld.components.moonstorms -- Lunar island storms
local sandstorms = TheWorld.components.sandstorms -- Desert sandstorms
```

## Event System

TheWorld uses an event system to communicate between different parts of the game:

```lua
-- Listen for events
TheWorld:ListenForEvent("phase_changed", function(world, data)
    print("Phase changed to: " .. data.newphase)
end)

-- Push events
TheWorld:PushEvent("ms_playerleft", {player = player}) -- Notify world that a player left

-- Common events
-- "cycle_changed" - Day number changed
-- "phase_changed" - Day/dusk/night changed
-- "season_changed" - Season changed
-- "ms_save" - World is being saved
-- "ms_simunpaused" - Simulation unpaused
-- "ms_simpaused" - Simulation paused
-- "ms_playerjoined" - Player joined the game
-- "ms_playerleft" - Player left the game
```

## Task Scheduling

TheWorld provides task scheduling functions:

```lua
-- Do something after a delay
TheWorld:DoTaskInTime(5, function()
    print("This happens after 5 seconds")
end)

-- Do something periodically
local task = TheWorld:DoPeriodicTask(10, function()
    print("This happens every 10 seconds")
end)

-- Cancel a task
task:Cancel()
```

## World Save/Load

```lua
-- Trigger a world save
TheWorld:PushEvent("ms_save")

-- Dump world state information
local world_state = TheWorld.components.worldstate:Dump()
```

## World Topology

```lua
-- Access world topology (nodes and connections)
local nodes = TheWorld.topology.nodes
local ids = TheWorld.topology.ids -- Node names/IDs
local edges = TheWorld.topology.edges -- Connections between nodes

-- Find a specific room by name
local found_node = nil
for i, id in ipairs(TheWorld.topology.ids) do
    if id:find("CaveEntrance") then
        found_node = i
        break
    end
end
```

## Important Considerations

1. **Server vs. Client**: Some world components are only available on the server
2. **Ismastersim**: Always check `TheWorld.ismastersim` before modifying world state
3. **Performance**: Events and tasks have performance implications, use them judiciously
4. **Component Access**: Not all components are guaranteed to exist in all world types
5. **World Types**: Behavior may differ between forest worlds and caves

## Common Use Cases

- **Environmental Conditions**: Checking weather, time, and season
- **Map Manipulation**: Checking terrain type and modifying the world
- **Game Logic**: Scheduling events and responding to game state changes
- **Monster Spawning**: Triggering or controlling monster spawns
- **Mod Integration**: Using the event system to integrate with other mods 
