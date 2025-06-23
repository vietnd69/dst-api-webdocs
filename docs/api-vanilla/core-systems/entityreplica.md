---
title: Entity Replica System
description: Documentation of the Don't Starve Together entity replica system for client-server component synchronization
sidebar_position: 8
slug: /entityreplica
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Entity Replica System

The Entity Replica system in Don't Starve Together provides a mechanism for synchronizing entity component data between the server (master simulation) and clients. This system enables clients to access read-only versions of server-side component data for UI updates, predictions, and client-side logic without compromising game security.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 642130 | 2023-06-10 | added | Initial comprehensive replica system documentation |

## Overview

The replica system addresses the fundamental client-server architecture challenge in DST:
- **Server Authority**: All game logic and authoritative component data exists on the server
- **Client Needs**: Clients need access to certain component data for UI, predictions, and responsive gameplay
- **Security**: Direct access to server components would compromise game integrity

Replica components provide a controlled way to expose specific server data to clients while maintaining the authoritative server-side logic.

## Core Architecture

### Replica Container

Each entity has a `replica` container that holds all replica components:

```lua
-- In EntityScript constructor
self.replica = { _ = {}, inst = self }
setmetatable(self.replica, replica_mt)
```

### Replica Metatable

The replica system uses a custom metatable to validate and control access to replica components:

```lua
local replica_mt = {
    __index = function(t, k)
        return rawget(t, "inst"):ValidateReplicaComponent(k, rawget(t, "_")[k])
    end,
}
```

When accessing `entity.replica.componentname`, the metatable:
1. Calls `ValidateReplicaComponent` to ensure the component is valid
2. Returns the cached replica component or `nil` if invalid

## Key Methods

The replica system provides several methods for managing component replication:

### ValidateReplicaComponent

```lua
function EntityScript:ValidateReplicaComponent(name, component)
    -- Validates that a replica component is still valid
    -- Returns the component if valid, nil otherwise
end
```

Validates that a replica component is still accessible and the entity is in a valid state for replication.

### ReplicateComponent

```lua
function EntityScript:ReplicateComponent(name)
    -- Sets up replication for a server component to clients
    -- Called automatically when adding components that have replicas
end
```

Establishes the connection between a server-side component and its client-side replica.

### UnreplicateComponent

```lua
function EntityScript:UnreplicateComponent(name)
    -- Removes replication for a component
    -- Called when components are removed or entities are cleaned up
end
```

Cleans up replication data when components are removed or entities are destroyed.

### PrereplicateEntity

```lua
function EntityScript:PrereplicateEntity()
    -- Prepares an entity for replication setup
    -- Used during entity initialization on clients
end
```

Prepares the entity's replica system during the initial network synchronization.

### ReplicateEntity

```lua
function EntityScript:ReplicateEntity()
    -- Completes entity replication setup
    -- Finalizes all component replicas for an entity
end
```

Finalizes the replication setup after all components have been added and configured.

## Common Usage Patterns

### Accessing Replica Components

```lua
-- Check if replica exists before accessing
local inventory_replica = entity.replica.inventory
if inventory_replica then
    local active_item = inventory_replica:GetActiveItem()
    local equipped_tool = inventory_replica:GetEquippedItem(EQUIPSLOTS.HANDS)
end

-- Safe pattern for optional components
local health_replica = entity.replica.health
local current_health = health_replica and health_replica:GetCurrent() or 0
```

### Component-Specific Replicas

Many core components have replica counterparts:

| Server Component | Replica Component | Primary Use |
|------------------|-------------------|-------------|
| `inventory` | `inventory` | UI display, item queries |
| `health` | `health` | Health bars, death state |
| `hunger` | `hunger` | Hunger meter display |
| `sanity` | `sanity` | Sanity meter display |
| `equippable` | `equippable` | Equipment slot information |
| `stackable` | `stackable` | Stack size display |
| `perishable` | `perishable` | Spoilage timers |
| `combat` | `combat` | Combat UI, targeting |

### Client-Side Validation

```lua
-- Example: Checking if an item can be equipped (client-side)
local function CanEquipItem(player, item)
    local inventory_replica = player.replica.inventory
    local equippable_replica = item.replica.equippable
    
    if not inventory_replica or not equippable_replica then
        return false
    end
    
    local slot = equippable_replica:EquipSlot()
    return inventory_replica:CanAcceptCount(item, 1, slot)
end
```

## Network Synchronization

### Dirty State Management

Replica components automatically handle dirty state tracking:

```lua
-- Server-side: When component data changes
self.health:SetVal(new_health)  -- Marks replica as dirty

-- Client-side: Automatic updates
-- Client receives network update and replica reflects new value
local current_health = entity.replica.health:GetCurrent()
```

### Event-Driven Updates

Replica components often use events for immediate client updates:

```lua
-- Client listens for replica events
entity:ListenForEvent("healthdelta", function(entity, data)
    -- Update UI immediately when health changes
    UpdateHealthBar(entity.replica.health:GetPercent())
end)
```

## Best Practices

### 1. Always Check for Existence

```lua
-- Good: Check before accessing
local replica = entity.replica.componentname
if replica then
    local value = replica:GetSomeValue()
end

-- Bad: Direct access without checking
local value = entity.replica.componentname:GetSomeValue() -- May error!
```

### 2. Use Replicas for Read-Only Operations

```lua
-- Good: Using replica for display
local health_percent = entity.replica.health:GetPercent()
UpdateHealthBar(health_percent)

-- Bad: Trying to modify through replica (won't work)
entity.replica.health:SetPercent(1.0) -- This method doesn't exist!
```

### 3. Handle Network Lag

```lua
-- Account for potential network delays
local function GetDisplayHealth(entity)
    local replica = entity.replica.health
    if replica then
        return replica:GetCurrent()
    end
    -- Fallback for when replica isn't available yet
    return entity.components.health and entity.components.health.currenthealth or 0
end
```

### 4. Optimize UI Updates

```lua
-- Use events to update UI only when needed
entity:ListenForEvent("inventorydirty", function()
    RefreshInventoryUI()
end)

-- Avoid polling replica values every frame
-- Bad:
function OnUpdate()
    local health = entity.replica.health:GetCurrent() -- Called every frame!
    UpdateHealthDisplay(health)
end
```

## Performance Considerations

### Memory Management

Replica components are automatically cleaned up when entities are removed:

```lua
-- In EntityScript:Remove()
for k, v in pairs(rawget(self.replica, "_")) do
    if v and type(v) == "table" and v.OnRemoveEntity then
        v:OnRemoveEntity()
    end
end
```

### Network Efficiency

- Replica updates only send changed data
- Batched updates reduce network overhead
- Client prediction reduces perceived lag

## Related Systems

The replica system integrates with several other core systems:

### Component Actions

Components that provide actions automatically handle replica integration:

```lua
-- Component actions work with both server components and replicas
local actions = entity:CollectActions("SCENE", player)
```

### State Graphs

State graphs can access replica data for client-side state decisions:

```lua
-- In a state graph condition
local function HasLowHealth(inst)
    local health_replica = inst.replica.health
    return health_replica and health_replica:GetPercent() < 0.25
end
```

### UI Systems

Most UI elements rely heavily on replica data:

```lua
-- Widget updates using replica data
function HealthBadge:OnUpdate()
    local health_replica = self.owner.replica.health
    if health_replica then
        self:SetPercent(health_replica:GetPercent())
    end
end
```

## Troubleshooting

### Common Issues

**Replica is nil**: Entity may not be fully initialized or component doesn't have a replica

```lua
-- Wait for entity to be fully replicated
if entity:IsValid() and entity.replica.health then
    -- Safe to access
end
```

**Stale data**: Client may have outdated information due to network lag

```lua
-- Use events for immediate updates
entity:ListenForEvent("healthdelta", OnHealthChanged)
```

**Memory leaks**: Ensure proper cleanup of event listeners

```lua
-- Clean up listeners when UI is destroyed
widget:OnDestroy(function()
    entity:RemoveEventCallback("healthdelta", OnHealthChanged)
end)
```

### Debugging

```lua
-- Check replica state
print("Health replica exists:", entity.replica.health ~= nil)
print("Health value:", entity.replica.health and entity.replica.health:GetCurrent())

-- Compare server vs replica (on server)
if TheWorld.ismastersim then
    print("Server health:", entity.components.health.currenthealth)
    print("Replica health:", entity.replica.health:GetCurrent())
end
```

## See Also

- [Components System](components/) - Understanding the underlying component architecture
- [Networking](networking) - Network synchronization details
- [Entity Script](../getting-started#entity-script) - Core entity functionality
