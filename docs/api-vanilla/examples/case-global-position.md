---
id: case-global-position
title: Case Study - Global Position CompleteSync Mod
sidebar_position: 4
last_updated: 2023-07-06
---

# Case Study: Global Position CompleteSync Mod

This case study examines the implementation of the Global Position CompleteSync mod, which enhances multiplayer gameplay in Don't Starve Together by providing complete map synchronization and player position tracking.
- [Github](https://github.com/hellohawaii2/Global-Position-CompleteSync)
- [Steam Workshop](https://steamcommunity.com/sharedfiles/filedetails/?id=3138571948)

## Overview

The Global Position CompleteSync mod extends the original Global Positions functionality with comprehensive map synchronization between players. Unlike the basic position sharing, this mod ensures that:

1. New players joining a server can see areas previously explored by other players
2. Players moving between cave and surface worlds can see areas explored by others before they arrived
3. Map discoveries from special events (like reading a Message in a Bottle) are shared with all players
4. Players can place ping markers on the map for communication

## Key Components

### Component Architecture

The mod uses several key components to manage position tracking and map synchronization:

| Component | Purpose |
|-----------|---------|
| `globalposition` | Manages individual entity positions on the map |
| `globalpositions` | Central system that tracks all entities with position data |
| `shard_isgpsnewlyadded` | Handles cross-shard (world) communication for map updates |
| `smokeemitter` | Visual effect for entities visible on the map |

### UI Elements

The mod implements several custom UI widgets:

- `pingwheel`: Radial menu for selecting ping types
- `pingbadge`: Visual representation of pings on the map
- `maphoverer`: Tooltip system for map elements

### Network Architecture

The implementation uses classified objects for network synchronization, with carefully managed authority:

```lua
function GlobalPosition:OnUpdate(dt)
    local pos = self.inst:GetPosition()
    if self._x ~= pos.x or self._z ~= pos.z then
        self._x = pos.x
        self._z = pos.z
        self.classified.Transform:SetPosition(pos:Get())
    end
end
```

## Implementation Details

### Map Data Synchronization

The mod's core functionality is complete map synchronization across players and shards. This is achieved through:

1. A map buffer system that stores exploration data
2. Cross-shard RPC handlers for map data transfer
3. Player-join detection to trigger map synchronization for new players

```lua
local function player2player_via_buffer(world, player_from, player_to)
    save_to_buffer(world, player_from)
    learn_from_buffer(world, player_to)
end
```

### Performance Optimization

The mod includes optimizations to prevent lag when traversing between shards:

```lua
local STOPSAVEMAPEXPLORER = GetModConfigData("STOPSAVEMAPEXPLORER") and is_dedicated
if STOPSAVEMAPEXPLORER then
    -- Custom implementation of SerializeUserSession to avoid saving map data redundantly
    GLOBAL.SerializeUserSession = function (player, isnewspawn)
        -- Implementation details...
    end
end
```

### Ping System

The ping system allows players to mark locations on the map with different meanings:

1. Generic ping (rally point)
2. "Go here" ping
3. "Explore" ping 
4. "Danger" ping
5. "On my way" ping

Each ping type has custom visuals and can be placed using a radial menu accessible by Alt+clicking on the map.

## Integration with Game Systems

### Entity Component System

The mod leverages Don't Starve Together's entity component system by:

1. Adding components to entities that need position tracking
2. Using prefabs for visual representations on the map
3. Hooking into the game's event system for updates

### Minimap Integration

Integration with the game's minimap is achieved through:

```lua
function AddGlobalIcon(inst, isplayer, classified)
    if not (_GLOBALPOSITIONS_MAP_ICONS[inst.prefab] or inst.MiniMapEntity) then return end
    classified.icon = SpawnPrefab("globalmapicon_noproxy")
    classified.icon.MiniMapEntity:SetPriority(10)
    classified.icon.MiniMapEntity:SetRestriction("player")
    -- Additional configuration...
end
```

### Cross-Shard Communication

The mod handles communication between different world shards (surface/caves) using:

```lua
AddShardModRPCHandler(modname, "ShardIncreaseCounter", function()
    if GLOBAL.TheWorld.ismastershard then
        GLOBAL.TheWorld.shard.components.shard_isgpsnewlyadded:IncreaseCounter()
    else
        return
    end
end)
```

## Learning Points

### Effective Uses of Components

The mod demonstrates how to create and use components for:

- Tracking entity positions (`globalposition`)
- Managing shared state (`globalpositions`)
- Cross-shard communication (`shard_isgpsnewlyadded`)

### Network Optimization

The mod employs several techniques for network efficiency:

1. Using classified entities for network variables
2. Buffering map data to minimize network traffic
3. Conditional updates that only send data when needed

### UI Implementation

The custom UI elements showcase:

1. Creating interactive widgets (the ping wheel)
2. Following input from different control schemes (mouse/controller)
3. Creating tooltips and informational UI elements

## See Also

- [Component System](../core/component-system.md) - For understanding how components work
- [Network System](../core/network-system.md) - For details on network synchronization
- [Client-Server Synchronization](../core/client-server-synchronization.md) - For best practices in networking
- [Map API](../world/map.md) - For map-related functionality
- [UI System](../core/ui-system.md) - For creating UI elements

## Further Reading

- [Event System](../core/event-system.md) - For understanding event handling used in the mod
- [EntityScript](../entity-framework/entityscript.md) - For entity manipulation techniques
- [Custom UI Elements](../examples/custom-ui-elements.md) - For more examples of UI implementation
