---
id: networkclientrpc
title: Network Client RPC
description: Remote procedure call system for client-server communication
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Network Client RPC

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `networkclientrpc` module provides the Remote Procedure Call (RPC) system for communication between clients and server in Don't Starve Together. It handles player actions, inventory management, movement, and other client requests that need server validation and processing.

## Usage Example

```lua
-- Send an RPC from client to server
SendRPCToServer(RPC.LeftClick, action_id, x, z, target, released, controlmods)

-- Handle RPC on server (handled automatically by the system)
-- The RPC_HANDLERS table contains all registered handlers

-- Send RPC from server to client
SendRPCToClient(CLIENT_RPC.ShowPopup, player_userid, popup_code, show, ...)
```

## Validation Functions

### checkbool(val) {#checkbool}

**Status:** `stable`

**Description:**
Validates that a value is nil or boolean type.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is nil or boolean

### checknumber(val) {#checknumber}

**Status:** `stable`

**Description:**
Validates that a value is a number type.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is a number

### checkuint(val) {#checkuint}

**Status:** `stable`

**Description:**
Validates that a value is an unsigned integer (no decimal digits).

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is a number without decimal digits

### checkstring(val) {#checkstring}

**Status:** `stable`

**Description:**
Validates that a value is a string type.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is a string

### checkentity(val) {#checkentity}

**Status:** `stable`

**Description:**
Validates that a value is an entity (table type).

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is a table

## Optional Validation Functions

### optbool(val) {#optbool}

**Status:** `stable`

**Description:**
Alias for checkbool - validates optional boolean parameter.

### optnumber(val) {#optnumber}

**Status:** `stable`

**Description:**
Validates that a value is nil or number type.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is nil or number

### optuint(val) {#optuint}

**Status:** `stable`

**Description:**
Validates that a value is nil or unsigned integer.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is nil or unsigned integer

### optstring(val) {#optstring}

**Status:** `stable`

**Description:**
Validates that a value is nil or string type.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is nil or string

### optentity(val) {#optentity}

**Status:** `stable`

**Description:**
Validates that a value is nil or entity (table) type.

**Parameters:**
- `val` (any): Value to check

**Returns:**
- (boolean): True if val is nil or table

## Core RPC Functions

### SendRPCToServer(code, ...) {#send-rpc-to-server}

**Status:** `stable`

**Description:**
Sends an RPC from client to server with the specified code and parameters.

**Parameters:**
- `code` (number): RPC code from the RPC table
- `...` (varies): Parameters for the RPC

**Example:**
```lua
-- Send left click action
SendRPCToServer(RPC.LeftClick, ACTIONS.PICK.code, x, z, target)

-- Send movement command
SendRPCToServer(RPC.DirectWalking, dir_x, dir_z)
```

### SendRPCToClient(code, ...) {#send-rpc-to-client}

**Status:** `stable`

**Description:**
Sends an RPC from server to client(s). Users parameter can be nil (all clients), userid, or table of userids.

**Parameters:**
- `code` (number): Client RPC code from the CLIENT_RPC table
- `...` (varies): Parameters including users and RPC data

**Example:**
```lua
-- Send popup to all clients
SendRPCToClient(CLIENT_RPC.ShowPopup, nil, popup_code, true, data)

-- Send to specific user
SendRPCToClient(CLIENT_RPC.LearnRecipe, userid, recipe_name, ingredients)
```

### SendRPCToShard(code, ...) {#send-rpc-to-shard}

**Status:** `stable`

**Description:**
Sends an RPC between shards. Shards parameter can be nil (all shards), shardid, or table of shardids.

**Parameters:**
- `code` (number): Shard RPC code from the SHARD_RPC table
- `...` (varies): Parameters including shards and RPC data

## Player Action RPCs

### LeftClick {#rpc-leftclick}

**Status:** `stable`

**Description:**
Handles left mouse click actions from clients.

**Parameters:**
- `player` (entity): Player entity performing the action
- `action` (number): Action code
- `x` (number): World X coordinate
- `z` (number): World Z coordinate
- `target` (entity): Target entity (optional)
- `isreleased` (boolean): Whether mouse button was released (optional)
- `controlmods` (number): Control modifier flags (optional)
- `noforce` (boolean): Whether to skip force checks (optional)
- `mod_name` (string): Mod name if from mod (optional)
- `platform` (entity): Platform entity for relative positioning (optional)
- `platform_relative` (boolean): Whether coordinates are platform-relative
- `spellbook` (entity): Spellbook entity (optional)
- `spell_id` (number): Spell ID (optional)

### RightClick {#rpc-rightclick}

**Status:** `stable`

**Description:**
Handles right mouse click actions from clients.

**Parameters:**
- `player` (entity): Player entity performing the action
- `action` (number): Action code
- `x` (number): World X coordinate
- `z` (number): World Z coordinate
- `target` (entity): Target entity (optional)
- `rotation` (number): Rotation angle (optional)
- `isreleased` (boolean): Whether mouse button was released (optional)
- `controlmods` (number): Control modifier flags (optional)
- `noforce` (boolean): Whether to skip force checks (optional)
- `mod_name` (string): Mod name if from mod (optional)
- `platform` (entity): Platform entity for relative positioning (optional)
- `platform_relative` (boolean): Whether coordinates are platform-relative

### AttackButton {#rpc-attackbutton}

**Status:** `stable`

**Description:**
Handles attack button presses from clients.

**Parameters:**
- `player` (entity): Player entity performing the attack
- `target` (entity): Target entity (optional)
- `forceattack` (boolean): Whether to force attack (optional)
- `noforce` (boolean): Whether to skip force checks (optional)
- `isleftmouse` (boolean): Whether left mouse button was used (optional)
- `isreleased` (boolean): Whether button was released (optional)

## Movement RPCs

### DirectWalking {#rpc-directwalking}

**Status:** `stable`

**Description:**
Handles direct movement input from clients using direction vectors.

**Parameters:**
- `player` (entity): Player entity
- `x` (number): Direction X component [-1 to 1]
- `z` (number): Direction Z component [-1 to 1]

**Validation:**
- Vector magnitude must be ≤ 1.01

### DragWalking {#rpc-dragwalking}

**Status:** `stable`

**Description:**
Handles movement by dragging to a world position.

**Parameters:**
- `player` (entity): Player entity
- `x` (number): World X coordinate
- `z` (number): World Z coordinate
- `platform` (entity): Platform entity (optional)
- `platform_relative` (boolean): Whether coordinates are platform-relative

### PredictWalking {#rpc-predictwalking}

**Status:** `stable`

**Description:**
Handles predictive movement for client-side prediction.

**Parameters:**
- `player` (entity): Player entity
- `x` (number): Target X coordinate
- `z` (number): Target Z coordinate
- `isdirectwalking` (boolean): Whether using direct walking
- `isstart` (boolean): Whether starting movement
- `platform` (entity): Platform entity (optional)
- `platform_relative` (boolean): Whether coordinates are platform-relative
- `overridemovetime` (number): Override for move time (optional)

## Inventory Management RPCs

### SwapActiveItemWithSlot {#rpc-swapactiveitemwithslot}

**Status:** `stable`

**Description:**
Swaps the active item with an item in an inventory slot.

**Parameters:**
- `player` (entity): Player entity
- `slot` (number): Inventory slot number
- `container` (entity): Container entity (optional, nil for player inventory)

### PutOneOfActiveItemInSlot {#rpc-putoneofactiveiteminstot}

**Status:** `stable`

**Description:**
Places one unit of the active item into an inventory slot.

**Parameters:**
- `player` (entity): Player entity
- `slot` (number): Inventory slot number
- `container` (entity): Container entity (optional)

### TakeActiveItemFromAllOfSlot {#rpc-takeactiveitemfromallofslot}

**Status:** `stable`

**Description:**
Takes all items from an inventory slot into the active item.

**Parameters:**
- `player` (entity): Player entity
- `slot` (number): Inventory slot number
- `container` (entity): Container entity (optional)

## Recipe and Crafting RPCs

### MakeRecipeFromMenu {#rpc-makerecipefrommenu}

**Status:** `stable`

**Description:**
Crafts a recipe from the crafting menu.

**Parameters:**
- `player` (entity): Player entity
- `recipe` (number): Recipe RPC ID
- `skin_index` (number): Skin index for crafted item (optional)

### MakeRecipeAtPoint {#rpc-makerecipeatpoint}

**Status:** `stable`

**Description:**
Places a crafted structure at a specific world position.

**Parameters:**
- `player` (entity): Player entity
- `recipe` (number): Recipe RPC ID
- `x` (number): World X coordinate
- `z` (number): World Z coordinate
- `rot` (number): Rotation angle [-360 to 360]
- `skin_index` (number): Skin index (optional)
- `platform` (entity): Platform entity (optional)
- `platform_relative` (boolean): Whether coordinates are platform-relative

## Mod RPC System

### AddModRPCHandler(namespace, name, fn) {#add-mod-rpc-handler}

**Status:** `stable`

**Description:**
Registers a new mod RPC handler for server-side processing.

**Parameters:**
- `namespace` (string): Mod namespace
- `name` (string): RPC name
- `fn` (function): Handler function

**Example:**
```lua
AddModRPCHandler("mymod", "custom_action", function(player, data)
    -- Handle custom mod action
    print("Custom action from player:", player.name)
end)
```

### AddClientModRPCHandler(namespace, name, fn) {#add-client-mod-rpc-handler}

**Status:** `stable`

**Description:**
Registers a new mod RPC handler for client-side processing.

**Parameters:**
- `namespace` (string): Mod namespace
- `name` (string): RPC name
- `fn` (function): Handler function

### AddShardModRPCHandler(namespace, name, fn) {#add-shard-mod-rpc-handler}

**Status:** `stable`

**Description:**
Registers a new mod RPC handler for shard-to-shard communication.

**Parameters:**
- `namespace` (string): Mod namespace
- `name` (string): RPC name
- `fn` (function): Handler function

### SendModRPCToServer(id_table, ...) {#send-mod-rpc-to-server}

**Status:** `stable`

**Description:**
Sends a mod RPC from client to server.

**Parameters:**
- `id_table` (table): RPC identifier table with namespace and id
- `...` (varies): RPC parameters

**Example:**
```lua
local rpc_id = MOD_RPC["mymod"]["custom_action"]
SendModRPCToServer(rpc_id, "hello", 123)
```

## RPC Queue Management

### HandleRPCQueue() {#handle-rpc-queue}

**Status:** `stable`

**Description:**
Processes the RPC queue, enforcing rate limits and proper sequencing. Called automatically by the game loop.

**Rate Limiting:**
- Base limit: 20 RPCs per logic tick
- Additional 5 RPCs per tick for each mod RPC added
- Players exceeding limits are rate-limited and logged

### TickRPCQueue() {#tick-rpc-queue}

**Status:** `stable`

**Description:**
Resets RPC timing for the next tick. Called automatically by the game loop.

## UserID RPCs

### MarkUserIDRPC(namespace, name) {#mark-userid-rpc}

**Status:** `stable`

**Description:**
Marks an RPC to use UserID instead of player entity for cases where player entity might not exist.

**Parameters:**
- `namespace` (string): Mod namespace (optional)
- `name` (string): RPC name

**Usage:**
```lua
-- For vanilla RPC
MarkUserIDRPC("GetChatHistory")

-- For mod RPC
MarkUserIDRPC("mymod", "pre_spawn_action")
```

## Security and Validation

### Position Validation

All position-based RPCs validate that coordinates are within acceptable range (64 units) from the player's position to prevent cheating.

### Parameter Validation

Each RPC handler validates all parameters using the check* and opt* functions. Invalid RPCs are logged and rejected.

### Rate Limiting

The system implements rate limiting to prevent RPC flooding:
- Base rate: 20 RPCs per tick per player
- Mod RPCs add 5 additional RPCs per tick
- Exceeding limits triggers logging and temporary blocking

## Error Handling

### Invalid RPC Handling

```lua
-- Invalid RPCs trigger this function
printinvalid("RPCName", player)
-- Logs the invalid RPC and optionally asserts in dev branch
```

### Platform Position Errors

```lua
-- Failed platform position conversion
printinvalidplatform("RPCName", player, action, x, z, platform, platform_relative)
-- Logs platform conversion failures
```

## Best Practices

1. **Validation**: Always validate RPC parameters using the provided check functions
2. **Rate Limiting**: Be mindful of RPC frequency to avoid hitting rate limits
3. **Position Checks**: Ensure position-based actions are within reasonable range
4. **Mod Namespacing**: Use unique namespaces for mod RPCs to avoid conflicts
5. **Error Handling**: Implement proper error handling in RPC handlers

## Related Modules

- [Network Variables](./netvars.md): Network variable system for state synchronization
- [Networking](./networking.md): Core networking functions and server management
- [Player Controller](../components/playercontroller.md): Player input and action processing
- [Inventory](../components/inventory.md): Inventory management system
