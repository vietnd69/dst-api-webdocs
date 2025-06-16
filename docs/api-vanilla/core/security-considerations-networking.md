---
id: security-considerations-networking
title: Security Considerations in Networking
sidebar_position: 10
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Security Considerations in Networking

When developing networked mods for Don't Starve Together, security is a critical consideration to protect players and servers from exploits and malicious behavior. This guide covers best practices for secure networking in DST mods.

## Understanding the Security Model

Don't Starve Together uses a client-server architecture where:

- The **server** is authoritative and maintains the "true" game state
- **Clients** send requests to the server for actions they want to perform
- The server must validate all client requests before executing them

This model helps prevent cheating and exploits, but only if implemented correctly in your mods.

## Common Security Vulnerabilities

### 1. Trusting Client Data

```lua
-- INSECURE: Blindly trusting client data
AddModRPCHandler("MyMod", "GiveItem", function(player, item_name, quantity)
    -- Directly using client-provided values without validation
    local item = SpawnPrefab(item_name)
    item.components.stackable:SetStackSize(quantity)
    player.components.inventory:GiveItem(item)
end)
```

### 2. Missing Permission Checks

```lua
-- INSECURE: No permission validation
AddModRPCHandler("MyMod", "DeleteEntity", function(player, target_entity)
    -- No checks if player should be allowed to delete this entity
    local entity = Ents[target_entity]
    if entity then
        entity:Remove()
    end
end)
```

### 3. Insufficient Rate Limiting

```lua
-- INSECURE: No rate limiting
AddModRPCHandler("MyMod", "SpawnEffect", function(player, effect_type)
    -- Could be spammed to create lag
    SpawnPrefab(effect_type)
end)
```

## Security Best Practices

### 1. Validate All Client Input

Always validate data received from clients:

```lua
-- SECURE: Proper input validation
AddModRPCHandler("MyMod", "GiveItem", function(player, item_name, quantity)
    -- Validate item name against whitelist
    local allowed_items = {"log", "rocks", "cutgrass"}
    if not table.contains(allowed_items, item_name) then
        return
    end
    
    -- Validate quantity is reasonable
    if type(quantity) ~= "number" or quantity <= 0 or quantity > 40 then
        return
    end
    
    -- Proceed with validated data
    local item = SpawnPrefab(item_name)
    item.components.stackable:SetStackSize(quantity)
    player.components.inventory:GiveItem(item)
end)
```

### 2. Check Player Permissions

Verify that players have appropriate permissions:

```lua
-- SECURE: Permission checking
AddModRPCHandler("MyMod", "ModifyTerrain", function(player, x, z, terrain_type)
    -- Check if player is admin
    if not TheNet:GetIsServerAdmin(player.userid) then
        return
    end
    
    -- Check if coordinates are valid
    if not IsValidCoordinate(x, z) then
        return
    end
    
    -- Proceed with terrain modification
    TheWorld.Map:SetTile(x, z, terrain_type)
end)
```

### 3. Implement Rate Limiting

Prevent spam attacks with rate limiting:

```lua
-- SECURE: Rate limiting implementation
local player_action_times = {}

AddModRPCHandler("MyMod", "CastSpell", function(player, spell_type)
    local userid = player.userid
    local current_time = GetTime()
    
    -- Check if player has cast recently
    if player_action_times[userid] and 
       current_time - player_action_times[userid] < SPELL_COOLDOWN then
        return -- Too soon, ignore request
    end
    
    -- Update last cast time
    player_action_times[userid] = current_time
    
    -- Proceed with spell casting
    CastSpell(player, spell_type)
end)
```

### 4. Validate Entity References

Always verify entity references from clients:

```lua
-- SECURE: Entity reference validation
AddModRPCHandler("MyMod", "InteractWith", function(player, target_entity)
    -- Get target entity
    local target = Ents[target_entity]
    if target == nil then
        return -- Entity doesn't exist
    end
    
    -- Check distance to prevent interaction through walls/across map
    if player:GetDistanceSqToInst(target) > MAX_INTERACTION_DISTANCE_SQ then
        return -- Too far away
    end
    
    -- Check if target is valid for interaction
    if not CanInteractWith(player, target) then
        return -- Not allowed to interact
    end
    
    -- Proceed with interaction
    DoInteraction(player, target)
end)
```

### 5. Protect Sensitive Operations

Some operations should only be performed by the server:

```lua
-- SECURE: Server-side only operations
if TheWorld.ismastersim then
    -- This code only runs on the server
    function ApplyGlobalEffect(effect_type)
        -- Sensitive operation that affects all players
    end
    
    -- Expose a controlled interface for clients
    AddModRPCHandler("MyMod", "RequestGlobalEffect", function(player, effect_type)
        -- Validate player permissions
        if not TheNet:GetIsServerAdmin(player.userid) then
            return
        end
        
        -- Validate effect type
        if not IsValidEffectType(effect_type) then
            return
        end
        
        -- Call the protected function
        ApplyGlobalEffect(effect_type)
    end)
end
```

## Server-Side Verification Patterns

### 1. Position and Movement Validation

```lua
-- Validate player movement requests
AddModRPCHandler("MyMod", "TeleportRequest", function(player, x, y, z)
    -- Check if teleportation is allowed
    if not player:HasTag("teleporter") then
        return
    end
    
    -- Check if destination is valid
    if not IsValidTeleportDestination(x, y, z) then
        return
    end
    
    -- Check if within allowed range
    local px, py, pz = player.Transform:GetWorldPosition()
    local dist_sq = distsq(px, pz, x, z)
    if dist_sq > MAX_TELEPORT_DISTANCE_SQ then
        return -- Too far
    end
    
    -- Teleport the player
    player.Transform:SetPosition(x, y, z)
end)
```

### 2. Resource and Economy Protection

```lua
-- Secure trading system
AddModRPCHandler("MyMod", "PurchaseItem", function(player, item_name)
    -- Check if item exists
    if not PURCHASABLE_ITEMS[item_name] then
        return
    end
    
    local cost = PURCHASABLE_ITEMS[item_name].cost
    
    -- Verify player has enough currency
    if not player.components.modcurrency or 
       player.components.modcurrency:GetCurrency() < cost then
        return -- Not enough currency
    end
    
    -- Deduct currency and give item (server-side operations)
    player.components.modcurrency:DoDelta(-cost)
    local item = SpawnPrefab(item_name)
    player.components.inventory:GiveItem(item)
end)
```

## Securing Server to Client Communication

While the server is authoritative, you should also consider security when sending data to clients:

### 1. Avoid Sending Sensitive Information

```lua
-- SECURE: Only send necessary information
function SendPlayerInfo(target_player, player_data)
    -- Don't send admin status or other sensitive details to non-admins
    if not TheNet:GetIsServerAdmin(target_player.userid) then
        -- Create a filtered version with only non-sensitive info
        local filtered_data = {
            name = player_data.name,
            character = player_data.character,
            position = player_data.position
            -- Omit sensitive fields like admin status, IP, etc.
        }
        SendModRPCToClient(MOD_RPC.MyMod.ReceivePlayerInfo, target_player, json.encode(filtered_data))
    else
        -- Admin can see everything
        SendModRPCToClient(MOD_RPC.MyMod.ReceivePlayerInfo, target_player, json.encode(player_data))
    end
end
```

### 2. Prevent Information Leakage

```lua
-- SECURE: Visibility checking before sending data
function UpdateEntityVisibility(entity, nearby_players)
    local x, y, z = entity.Transform:GetWorldPosition()
    
    for _, player in ipairs(AllPlayers) do
        local px, py, pz = player.Transform:GetWorldPosition()
        local dist_sq = distsq(x, z, px, pz)
        
        -- Only send updates about entities the player should be able to see
        if dist_sq <= VISIBILITY_RANGE_SQ and HasLineOfSight(entity, player) then
            SendModRPCToClient(MOD_RPC.MyMod.UpdateEntityState, player, entity.GUID, entity.state)
        end
    end
end
```

## Testing for Security Vulnerabilities

Regularly test your mod for security issues:

1. **Try to cheat**: Attempt to exploit your own mod using modified clients
2. **Fuzz test inputs**: Send invalid or unexpected data to your RPCs
3. **Test rate limits**: Try to overwhelm your mod with rapid requests
4. **Check permissions**: Verify non-admin players can't perform admin actions

## Common Pitfalls to Avoid

1. **Trusting client timestamps**: Always use server time for timing-sensitive operations
2. **Direct entity manipulation**: Never let clients directly modify entity state
3. **Excessive broadcasting**: Don't send unnecessary data to all clients
4. **Hardcoded secrets**: Don't include API keys or passwords in your mod code
5. **Missing validation**: Always validate ALL client input, no exceptions

## Security Checklist

Before releasing your mod, verify:

- [ ] All client inputs are validated
- [ ] Entity references are verified before use
- [ ] Distance checks prevent interaction through walls/across map
- [ ] Rate limiting prevents spam attacks
- [ ] Permission checks restrict sensitive operations
- [ ] No sensitive data is leaked to clients

## See also

- [RPC System](rpc-system.md) - For secure communication between client and server
- [Client-Server Synchronization](client-server-synchronization.md) - For proper state synchronization
- [Handling Latency and Network Drops](handling-latency-network-drops.md) - For resilient networking
- [Network Bandwidth Optimization](network-bandwidth-optimization.md) - For optimizing network usage 
