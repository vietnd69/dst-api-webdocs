---
id: entityreplica
title: Entity Replica System
description: Network component replication system for client-server synchronization in Don't Starve Together
sidebar_position: 5
slug: game-scripts/core-systems/entityreplica
last_updated: 2025-01-27
build_version: 676042
change_status: stable
---

# Entity Replica System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-01-27 | stable | Current version |

## Overview

The Entity Replica system extends EntityScript with network functionality that enables component data synchronization between server (master simulation) and clients. This system provides controlled access to server-side component data on clients while maintaining authoritative server-side game logic and security.

## Usage Example

```lua
-- On server: Component automatically creates replica when added
inst:AddComponent("health")
inst:AddComponent("inventory")

-- On client: Access replica data
local health_replica = inst.replica.health
if health_replica then
    local current_health = health_replica:GetCurrent()
    local max_health = health_replica:GetMax()
end
```

## Replicatable Components

### REPLICATABLE_COMPONENTS {#replicatable-components}

**Type:** `table`

**Status:** `stable`

**Description:** Table defining which components can be replicated to clients.

**Available Components:**
- `builder`: Building and crafting capabilities
- `combat`: Combat stats and targeting
- `container`: Container contents and state
- `constructionsite`: Construction progress
- `equippable`: Equipment slot and restrictions
- `fishingrod`: Fishing rod state
- `follower`: Following behavior and target
- `health`: Health values and state
- `hunger`: Hunger values and rates
- `inventory`: Inventory contents and state
- `inventoryitem`: Item properties and state
- `moisture`: Wetness and drying
- `named`: Custom entity names
- `oceanfishingrod`: Ocean fishing rod state
- `rider`: Mount/riding state
- `sanity`: Sanity values and rates
- `sheltered`: Shelter protection state
- `stackable`: Stack size and limits
- `writeable`: Text content for signs/books

## Core Functions

### inst:ValidateReplicaComponent(name, cmp) {#validate-replica-component}

**Status:** `stable`

**Description:**
Validates that a replica component is accessible and the entity has the appropriate replication tag.

**Parameters:**
- `name` (string): Name of the replica component
- `cmp` (Component): The replica component instance

**Returns:**
- (Component or nil): The component if valid, nil otherwise

**Example:**
```lua
local health_replica = inst.replica.health
local validated = inst:ValidateReplicaComponent("health", health_replica)
if validated then
    print("Health replica is valid")
end
```

**Version History:**
- Available since initial implementation

### inst:ReplicateComponent(name) {#replicate-component}

**Status:** `stable`

**Description:**
Sets up replication for a component, creating the client-side replica and managing replication tags.

**Parameters:**
- `name` (string): Name of the component to replicate

**Example:**
```lua
-- Automatically called when adding components
inst:AddComponent("health") -- Calls ReplicateComponent internally

-- Manual replication (rarely needed)
inst:ReplicateComponent("health")
```

**Implementation Details:**
- Checks if component is in REPLICATABLE_COMPONENTS table
- Adds "_componentname" tag on server
- Loads and creates replica component instance
- Handles tag state management for unreplication

### inst:UnreplicateComponent(name) {#unreplicate-component}

**Status:** `stable`

**Description:**
Removes replication for a component, typically called when components are removed.

**Parameters:**
- `name` (string): Name of the component to stop replicating

**Example:**
```lua
-- Automatically called when removing components
inst:RemoveComponent("health") -- Calls UnreplicateComponent internally
```

**Implementation Details:**
- Removes "_componentname" tag
- Adds "__componentname" tag to mark as unreplicated
- Only executes on master simulation

### inst:PrereplicateComponent(name) {#prereplicate-component}

**Status:** `stable`

**Description:**
Sets up component for replication and immediately marks it as unreplicated. Used for initialization sequences.

**Parameters:**
- `name` (string): Name of the component to prereplicate

**Example:**
```lua
-- Used during entity initialization
inst:PrereplicateComponent("health")
```

### inst:ReplicateEntity() {#replicate-entity}

**Status:** `stable`

**Description:**
Replicates all eligible components for an entity. Called on clients after initial tag deserialization.

**Example:**
```lua
-- Automatically called during entity network setup
-- Manually trigger full replication (rarely needed)
inst:ReplicateEntity()
```

**Implementation Details:**
- Iterates through all REPLICATABLE_COMPONENTS
- Checks for "_componentname" or "__componentname" tags
- Calls ReplicateComponent for each eligible component
- Triggers OnEntityReplicated callback if defined

### inst:TryAttachClassifiedToReplicaComponent(classified, name) {#try-attach-classified}

**Status:** `stable`

**Description:**
Attempts to attach a classified data object to a replica component for additional data synchronization.

**Parameters:**
- `classified` (object): Classified data object to attach
- `name` (string): Name of the replica component

**Returns:**
- (boolean): True if attachment was successful

**Example:**
```lua
-- Attach player-specific classified data
local success = inst:TryAttachClassifiedToReplicaComponent(player_classified, "health")
if success then
    print("Classified data attached to health replica")
end
```

## Mod Support

### AddReplicableComponent(name) {#add-replicable-component}

**Status:** `stable`

**Description:**
Allows mods to register new components as replicatable.

**Parameters:**
- `name` (string): Name of the component to make replicatable

**Example:**
```lua
-- In mod code: Make custom component replicatable
AddReplicableComponent("mycustomcomponent")

-- Now the component can be replicated
inst:AddComponent("mycustomcomponent")
-- Replica will be available as inst.replica.mycustomcomponent
```

## Tag System

### Replication Tags

The replica system uses specific tags to manage replication state:

| Tag Pattern | Purpose | When Added |
|-------------|---------|------------|
| `_componentname` | Component is actively replicated | During ReplicateComponent |
| `__componentname` | Component was unreplicated | During UnreplicateComponent |

**Example:**
```lua
-- Check replication status via tags
if inst:HasTag("_health") then
    print("Health component is replicated")
end

if inst:HasTag("__health") then
    print("Health component was unreplicated")
end
```

## Network Synchronization

### Automatic Replication

```lua
-- Server: Adding component automatically sets up replication
local inst = CreateEntity()
inst:AddComponent("health")
-- Health replica will be available on clients

-- Client: Access replicated data
inst:ListenForEvent("healthdelta", function(inst, data)
    local replica = inst.replica.health
    if replica then
        UpdateHealthUI(replica:GetPercent())
    end
end)
```

### Manual Replication Control

```lua
-- Advanced: Manual replication management
function SetupCustomReplication(inst)
    -- Prereplicate for initialization
    inst:PrereplicateComponent("inventory")
    
    -- Later enable full replication
    inst:ReplicateComponent("inventory")
    
    -- Custom callback after replication
    inst.OnEntityReplicated = function(inst)
        print("Entity fully replicated")
        inst:PushEvent("replication_complete")
    end
end
```

## Common Usage Patterns

### Safe Replica Access

```lua
-- Always check replica existence
local function GetHealthPercent(inst)
    local health_replica = inst.replica.health
    return health_replica and health_replica:GetPercent() or 0
end

-- Use with UI updates
local function UpdateHealthBar(inst)
    local health_replica = inst.replica.health
    if health_replica then
        local percent = health_replica:GetPercent()
        self.health_bar:SetPercent(percent)
    end
end
```

### Event-Driven Updates

```lua
-- Listen for replica changes
inst:ListenForEvent("inventorydirty", function(inst)
    local inventory_replica = inst.replica.inventory
    if inventory_replica then
        RefreshInventoryDisplay()
    end
end)

-- Batch UI updates
local pending_updates = {}
inst:ListenForEvent("healthdelta", function(inst)
    pending_updates.health = true
end)

-- Update UI once per frame
local function OnUpdate()
    if pending_updates.health then
        UpdateHealthDisplay()
        pending_updates.health = nil
    end
end
```

### Component Validation

```lua
-- Robust component checking
local function HasValidReplica(inst, component_name)
    local replica = inst.replica[component_name]
    return replica and inst:ValidateReplicaComponent(component_name, replica)
end

-- Usage
if HasValidReplica(inst, "inventory") then
    local active_item = inst.replica.inventory:GetActiveItem()
end
```

## Performance Considerations

### Memory Management

- Replica components are automatically cleaned up when entities are removed
- Proxy objects are cached to reduce allocation overhead
- Tag-based validation minimizes unnecessary component access

### Network Efficiency

- Only changed data is synchronized between server and clients
- Batch updates reduce network message overhead
- Client prediction reduces perceived input lag

## Debugging

### Replica State Inspection

```lua
-- Check replica availability
local function DebugReplicaState(inst)
    print("=== Replica Debug for", inst, "===")
    
    for name, _ in pairs(REPLICATABLE_COMPONENTS) do
        local has_tag = inst:HasTag("_"..name)
        local has_unreplicated_tag = inst:HasTag("__"..name)
        local replica = inst.replica[name]
        
        print(string.format("%s: tag=%s, unreplicated=%s, replica=%s",
            name, tostring(has_tag), tostring(has_unreplicated_tag), tostring(replica ~= nil)))
    end
end
```

### Common Issues

**Replica is nil:**
- Component may not be replicatable
- Entity may not be fully initialized
- Check for proper component addition on server

**Stale replica data:**
- Network lag may cause temporary desync
- Use events for immediate UI updates
- Consider client-side prediction where appropriate

## Events

### "replication_complete"

**Status:** `stable`

**Description:**
Custom event that can be triggered after entity replication is complete.

**Example:**
```lua
inst:ListenForEvent("replication_complete", function(inst)
    print("All replica components are ready")
    InitializeUI(inst)
end)
```

## Related Modules

- [EntityScript](./entityscript.md): Core entity functionality and component system
- [EntityScript Proxy](./entityscriptproxy.md): Proxy system for entity wrapping
- [Components Overview](./index.md): Individual component functionality
- [Networking](./networking.md): Network synchronization details
