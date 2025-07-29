---
id: worldentities
title: World Entities
description: World entity injection system for ensuring required entities exist across all worlds and shards
sidebar_position: 4
slug: game-scripts/core-systems/worldentities
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# World Entities

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `worldentities` module provides a system for injecting unique entities that must exist for all worlds and shards in Don't Starve Together. It ensures critical game entities are present during world initialization, particularly pocket dimension containers that are required for proper game functionality.

## Usage Example

```lua
-- The worldentities system is typically used during world loading
local worldentities = require("worldentities")

-- Inject required entities into world save data
worldentities.AddWorldEntities(savedata)
```

## Functions

### AddWorldEntities(savedata) {#add-world-entities}

**Status:** `stable`

**Description:**
Injects unique entities that must exist for all worlds and shards into the save data before entity instantiation. This function ensures that critical entities like pocket dimension containers are present in every world.

**Parameters:**
- `savedata` (table): The world save data structure containing entity information

**Returns:**
- None (modifies savedata in place)

**Example:**
```lua
-- Called during world initialization
local function InitializeWorldEntities(world_savedata)
    worldentities.AddWorldEntities(world_savedata)
    -- world_savedata.ents now contains required entities
end
```

**Implementation Details:**
```lua
local function AddWorldEntities(savedata)
    local enttable = savedata.ents
    
    -- Inject pocket dimension containers
    local POCKETDIMENSIONCONTAINER_DEFS = require("prefabs/pocketdimensioncontainer_defs").POCKETDIMENSIONCONTAINER_DEFS
    for _, v in ipairs(POCKETDIMENSIONCONTAINER_DEFS) do
        local prefab = v.prefab
        local ents = enttable[prefab]
        if GetTableSize(ents) == 0 then
            -- Add entity with default position
            enttable[prefab] = {{x=0, z=0}}
        end
    end
end
```

## Entity Management

### Pocket Dimension Containers

**Purpose:** The primary function currently handles pocket dimension containers, ensuring one instance of each container type exists per world.

**Container Types:**
- Each pocket dimension container type defined in `pocketdimensioncontainer_defs` is guaranteed to exist
- Containers are positioned at origin (0,0) if not already present
- System prevents duplicate creation by checking existing entity count

### Entity Injection Process

1. **Validation Check**: Verifies if required entities already exist in the world
2. **Entity Creation**: Creates missing entities with default positioning data
3. **Save Integration**: Injects entity data directly into the save structure

## Data Structure

### Save Data Format

The function operates on save data with the following structure:

```lua
savedata = {
    ents = {
        [prefab_name] = {
            {x = position_x, z = position_z},
            -- Additional entity instances...
        },
        -- Other prefab types...
    },
    -- Other save data fields...
}
```

### Entity Position Data

**Default Position:** `{x = 0, z = 0}`

**Status:** `stable`

**Description:** Entities injected by this system receive default positioning at world origin. The actual positioning may be handled by other systems during entity instantiation.

## Integration Points

### World Loading Pipeline

The world entities system integrates with the world loading process:

```lua
-- Example integration during world initialization
local function LoadWorldData(world_save)
    -- Load base world data
    local savedata = LoadBaseSaveData(world_save)
    
    -- Inject required entities
    worldentities.AddWorldEntities(savedata)
    
    -- Continue with entity instantiation
    InstantiateWorldEntities(savedata.ents)
end
```

### Shard Synchronization

Ensures consistency across different world shards by guaranteeing required entities exist in all shards.

## Design Considerations

### Entity Uniqueness

- **One Per World**: System ensures exactly one instance of each required entity type
- **Existence Check**: Uses `GetTableSize(ents) == 0` to determine if entity already exists
- **No Duplicate Prevention**: Documentation notes that duplicate checking must be implemented separately

### Performance Optimization

- **Minimal Injection**: Only adds entities that don't already exist
- **Efficient Lookup**: Uses direct table access for entity existence checking
- **Default Positioning**: Uses simple coordinate structure to minimize data overhead

## Extension Guidelines

### Adding New Required Entities

To extend the system for additional entity types:

```lua
-- Example extension for new required entity types
local function AddWorldEntities(savedata)
    local enttable = savedata.ents
    
    -- Existing pocket dimension container logic...
    
    -- Add new required entity type
    local REQUIRED_ENTITIES = {"world_tree", "spawn_portal"}
    for _, prefab_name in ipairs(REQUIRED_ENTITIES) do
        local ents = enttable[prefab_name]
        if GetTableSize(ents) == 0 then
            enttable[prefab_name] = {{x=0, z=0}}
        end
    end
end
```

### Custom Position Logic

For entities requiring specific positioning:

```lua
-- Example with custom positioning
if GetTableSize(ents) == 0 then
    local position = CalculateOptimalPosition(prefab)
    enttable[prefab] = {{x=position.x, z=position.z}}
end
```

## Related Modules

- [Pocket Dimension Container Definitions](../prefabs/pocketdimensioncontainer_defs.md): Defines container types injected by this system
- [Save Index](./saveindex.md): Manages save data structure and loading
- [Shard Networking](./shardnetworking.md): Handles cross-shard entity synchronization
- [Prefab Util](./prefabutil.md): Provides utilities for entity and prefab management
