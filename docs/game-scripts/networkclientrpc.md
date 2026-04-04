---
id: networkclientrpc
title: Networkclientrpc
description: This component defines comprehensive RPC handler tables for server, client, and shard contexts, including input validation helpers, queue processing logic, and utilities for managing mod-specific RPC registration and transmission states.
tags: [networking, rpc, validation, multiplayer, server]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: root
source_hash: 0814ad6a
system_scope: network
---

# Networkclientrpc

> Based on game build **718694** | Last updated: 2026-04-04

## Overview

The `networkclientrpc` component is the central networking layer for Don't Starve Together's Remote Procedure Call (RPC) system. It manages all communication between clients, servers, and shards by defining handler tables, input validation utilities, and queue processing logic. This component ensures secure and validated transmission of player actions including movement, combat, inventory management, crafting, and skill tree updates. It provides separate handler registries for server-bound RPCs (player actions), client-bound RPCs (server notifications), and shard-bound RPCs (multi-shard synchronization). The system includes rate limiting, timeline validation, and mod RPC extension capabilities. Input validation functions guard against malformed data, while the queue processor handles pending RPCs each simulation tick. This component is critical for maintaining game state consistency across the network and preventing cheating through server-side validation of all client-initiated actions.

## Usage example

```lua
-- Register a custom mod RPC handler on the server
AddModRPCHandler("mymod", "CustomAction", function(player, data)
    if player and player.components.inventory then
        player.components.talker:Say("Action received!")
    end
end)

-- Send the mod RPC from client to server
local rpc_info = GetModRPC("mymod", "CustomAction")
if rpc_info then
    SendModRPCToServer(rpc_info, { action_type = "greet" })
end

-- Validate incoming parameters using built-in helpers
if checknumber(data.value) and checkstring(data.name) then
    -- Process valid data
end
```

## Dependencies & tags

**External dependencies:**
- `util` -- Required module for utility functions (provides `orderedPairs`, `distsq`, `VecUtil_Length`, `RunInSandboxSafe`)
- `worldsettings_overrides` -- Required module for syncing world settings
- `TheWorld` -- Used to push invalidrpc event
- `Vector3` -- Used to create position vectors for coordinates
- `BRANCH` -- Global variable checked for dev branch assertions
- `TheNet` -- Used to send RPCs to server, client, and shards
- `ThePlayer` -- Used to access components and push events in client handlers
- `TheSim` -- Used to ReskinEntity in ReskinWorldMigrator
- `TheSkillTree` -- Used to get skill names from IDs
- `TheGenericKV` -- Used to store accomplishment data
- `TheScrapbookPartitions` -- Used to teach scrapbook data
- `ShardPortals` -- Iterated to find worldmigrator entities
- `ChatHistory` -- Used to send and receive chat history
- `AllRecipes` -- Iterated to find recipe data by RPC ID
- `PREFAB_SKINS` -- Used to resolve skin indices for recipes
- `GetPopupFromPopupCode` -- Utility function to resolve popup handlers
- `GetString` -- Localization function to get announcement strings
- `Shard_SyncWorldSettings` -- Global function to sync world settings
- `Shard_SyncBossDefeated` -- Global function to sync boss state
- `Shard_SyncMermKingExists` -- Global function to sync Merm King state
- `Shard_SyncMermKingTrident` -- Global function to sync Merm King Trident state
- `Shard_SyncMermKingCrown` -- Global function to sync Merm King Crown state
- `Shard_SyncMermKingPauldron` -- Global function to sync Merm King Pauldron state
- `GetWorldStateTagObjectFromNamespace` -- Global function to get world state tag object
- `TheShard` -- Used to retrieve shard ID for shard RPC validation
- `Shard_IsWorldAvailable` -- Used to validate shard availability in HandleShardRPC

**Internal tables:**
- `RPC_HANDLERS` -- Table referenced to generate RPC codes and handle incoming RPCs
- `CLIENT_RPC_HANDLERS` -- Table defined and used for client-side RPC handling
- `SHARD_RPC_HANDLERS` -- Table defined and used for shard-side RPC handling
- `USERID_RPCS` -- Table used to check RPC sender permissions
- `MOD_RPC` / `MOD_RPC_HANDLERS` -- Tables for mod RPC registration
- `CLIENT_MOD_RPC` / `CLIENT_MOD_RPC_HANDLERS` -- Tables for client mod RPC registration
- `SHARD_MOD_RPC` / `SHARD_MOD_RPC_HANDLERS` -- Tables for shard mod RPC registration

**Components used:**
- `playercontroller` -- Accessed on player entity to handle remote input actions
- `inventory` -- Accessed on player entity to manage item slots and equipment
- `locomotor` -- Accessed on player entity to handle strafe facing
- `steeringwheeluser` -- Accessed on player entity to handle boat steering
- `container` -- Accessed on target entity to manage inventory slots
- `builder` -- Accessed via player.components.builder for recipe crafting
- `talker` -- Accessed via player.components.talker for announcements
- `giftreceiver` -- Accessed via player.components.giftreceiver for gift opening
- `skilltreeupdater` -- Accessed via player.components.skilltreeupdater for skill management
- `writeable` -- Accessed via target.components.writeable for text setting
- `cookbookupdater` -- Accessed via ThePlayer.components.cookbookupdater for recipe learning
- `plantregistryupdater` -- Accessed via ThePlayer.components.plantregistryupdater for plant data
- `shardtransactionsteps` -- Accessed via TheWorld.components.shardtransactionsteps for shard sync
- `worldmigrator` -- Accessed via v.components.worldmigrator for ID checking in ReskinWorldMigrator

**Tags:**
- None

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `checkbool(val)`
* **Description:** Validates if a value is nil or a boolean.
* **Parameters:**
  - `val` -- any type, value to check if nil or boolean
* **Returns:** boolean
* **Error states:** None

### `checknumber(val)`
* **Description:** Validates if a value is a number.
* **Parameters:**
  - `val` -- any type, value to check if number
* **Returns:** boolean
* **Error states:** None

### `checkuint(val)`
* **Description:** Validates if a value is a number and represents an unsigned integer.
* **Parameters:**
  - `val` -- any type, value to check if unsigned integer
* **Returns:** boolean
* **Error states:** None

### `checkstring(val)`
* **Description:** Validates if a value is a string.
* **Parameters:**
  - `val` -- any type, value to check if string
* **Returns:** boolean
* **Error states:** None

### `checkentity(val)`
* **Description:** Validates if a value is a table, typically representing an entity.
* **Parameters:**
  - `val` -- any type, value to check if table (entity)
* **Returns:** boolean
* **Error states:** None

### `optbool(val)`
* **Description:** Alias for checkbool, validates optional boolean.
* **Parameters:**
  - `val` -- any type, value to check if nil or boolean
* **Returns:** boolean
* **Error states:** None

### `optnumber(val)`
* **Description:** Validates if a value is nil or a number.
* **Parameters:**
  - `val` -- any type, value to check if nil or number
* **Returns:** boolean
* **Error states:** None

### `optuint(val)`
* **Description:** Validates if a value is nil or an unsigned integer.
* **Parameters:**
  - `val` -- any type, value to check if nil or unsigned integer
* **Returns:** boolean
* **Error states:** None

### `optstring(val)`
* **Description:** Validates if a value is nil or a string.
* **Parameters:**
  - `val` -- any type, value to check if nil or string
* **Returns:** boolean
* **Error states:** None

### `optentity(val)`
* **Description:** Validates if a value is nil or a table (entity).
* **Parameters:**
  - `val` -- any type, value to check if nil or table
* **Returns:** boolean
* **Error states:** None

### `printinvalid(rpcname, player)`
* **Description:** Logs invalid RPC attempts and pushes an event for mods.
* **Parameters:**
  - `rpcname` -- string, name of the RPC
  - `player` -- Entity, the player entity
* **Returns:** nil
* **Error states:** Asserts false in dev branch

### `printinvalidplatform(rpcname, player, action, relative_x, relative_z, platform, platform_relative)`
* **Description:** Logs debugging info when platform lookup fails in an RPC.
* **Parameters:**
  - `rpcname` -- string, name of the RPC
  - `player` -- Entity, the player entity
  - `action` -- any, action context
  - `relative_x` -- number, x offset
  - `relative_z` -- number, z offset
  - `platform` -- Entity, platform entity
  - `platform_relative` -- boolean, if position is relative
* **Returns:** nil
* **Error states:** None

### `IsRotationValid(rot)`
* **Description:** Checks if a rotation value is within valid finite bounds.
* **Parameters:**
  - `rot` -- number, rotation value
* **Returns:** boolean
* **Error states:** None

### `IsPointInRange(player, x, z)`
* **Description:** Checks if a point is within 4096 distance squared from the player.
* **Parameters:**
  - `player` -- Entity, the player entity
  - `x` -- number, target x coordinate
  - `z` -- number, target z coordinate
* **Returns:** boolean
* **Error states:** None

### `ConvertPlatformRelativePositionToAbsolutePosition(relative_x, relative_z, platform, platform_relative)`
* **Description:** Converts relative platform coordinates to absolute world coordinates.
* **Parameters:**
  - `relative_x` -- number, relative x
  - `relative_z` -- number, relative z
  - `platform` -- Entity, platform entity
  - `platform_relative` -- boolean, if conversion is needed
* **Returns:** number, number
* **Error states:** Returns nil if platform is missing when required

### `LeftClick(player, action, x, z, target, isreleased, controlmods, noforce, mod_name, platform, platform_relative, spellbook, spell_id)`
* **Description:** Handles remote left click actions from the client.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `target` -- Entity (Optional), target entity
  - `isreleased` -- boolean (Optional), mouse release state
  - `controlmods` -- number (Optional), control modifiers
  - `noforce` -- boolean (Optional), force flag
  - `mod_name` -- string (Optional), mod name
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative position flag
  - `spellbook` -- Entity (Optional), spellbook
  - `spell_id` -- number (Optional), spell ID
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `RightClick(player, action, x, z, target, rotation, isreleased, controlmods, noforce, mod_name, platform, platform_relative)`
* **Description:** Handles remote right click actions from the client.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `target` -- Entity (Optional), target entity
  - `rotation` -- number (Optional), rotation angle
  - `isreleased` -- boolean (Optional), mouse release state
  - `controlmods` -- number (Optional), control modifiers
  - `noforce` -- boolean (Optional), force flag
  - `mod_name` -- string (Optional), mod name
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative position flag
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `ActionButton(player, action, target, isreleased, noforce, mod_name)`
* **Description:** Handles remote action button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number (Optional), action type
  - `target` -- Entity (Optional), target entity
  - `isreleased` -- boolean (Optional), release state
  - `noforce` -- boolean (Optional), force flag
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `AttackButton(player, target, forceattack, noforce, isleftmouse, isreleased)`
* **Description:** Handles remote attack button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `target` -- Entity (Optional), target entity
  - `forceattack` -- boolean (Optional), force attack flag
  - `noforce` -- boolean (Optional), no force flag
  - `isleftmouse` -- boolean (Optional), left mouse flag
  - `isreleased` -- boolean (Optional), release state
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `InspectButton(player, target)`
* **Description:** Handles remote inspect button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `target` -- Entity, target entity
* **Returns:** nil
* **Error states:** Returns early if target is invalid

### `ResurrectButton(player)`
* **Description:** Handles remote resurrect button presses.
* **Parameters:**
  - `player` -- Entity, the player
* **Returns:** nil
* **Error states:** None

### `CharacterCommandWheelButton(player, target)`
* **Description:** Handles remote character command wheel button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `target` -- Entity, target entity
* **Returns:** nil
* **Error states:** Returns early if target is invalid

### `ControllerActionButton(player, action, target, isreleased, noforce, mod_name)`
* **Description:** Handles remote controller action button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `target` -- Entity, target entity
  - `isreleased` -- boolean (Optional), release state
  - `noforce` -- boolean (Optional), force flag
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `ControllerActionButtonPoint(player, action, x, z, isreleased, noforce, mod_name, platform, platform_relative, isspecial, spellbook, spell_id)`
* **Description:** Handles remote controller action button presses at a point.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `isreleased` -- boolean (Optional), release state
  - `noforce` -- boolean (Optional), force flag
  - `mod_name` -- string (Optional), mod name
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative flag
  - `isspecial` -- boolean (Optional), special action flag
  - `spellbook` -- Entity (Optional), spellbook
  - `spell_id` -- number (Optional), spell ID
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `ControllerActionButtonDeploy(player, invobject, x, z, rotation, isreleased, platform, platform_relative)`
* **Description:** Handles remote controller deploy actions.
* **Parameters:**
  - `player` -- Entity, the player
  - `invobject` -- Entity, inventory object
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `rotation` -- number (Optional), rotation
  - `isreleased` -- boolean (Optional), release state
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative flag
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `ControllerAltActionButton(player, action, target, isreleased, noforce, mod_name)`
* **Description:** Handles remote controller alt action button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `target` -- Entity, target entity
  - `isreleased` -- boolean (Optional), release state
  - `noforce` -- boolean (Optional), force flag
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `ControllerAltActionButtonPoint(player, action, x, z, isreleased, noforce, isspecial, mod_name, platform, platform_relative)`
* **Description:** Handles remote controller alt action button presses at a point.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `isreleased` -- boolean (Optional), release state
  - `noforce` -- boolean (Optional), force flag
  - `isspecial` -- boolean (Optional), special flag
  - `mod_name` -- string (Optional), mod name
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative flag
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `ControllerAttackButton(player, target, isreleased, noforce)`
* **Description:** Handles remote controller attack button presses.
* **Parameters:**
  - `player` -- Entity, the player
  - `target` -- Entity or boolean, target entity or true
  - `isreleased` -- boolean (Optional), release state
  - `noforce` -- boolean (Optional), force flag
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `StopControl(player, control)`
* **Description:** Handles remote stop control signals.
* **Parameters:**
  - `player` -- Entity, the player
  - `control` -- number, control ID
* **Returns:** nil
* **Error states:** Returns early if control is invalid

### `StopAllControls(player)`
* **Description:** Handles remote stop all controls signal.
* **Parameters:**
  - `player` -- Entity, the player
* **Returns:** nil
* **Error states:** None

### `DirectWalking(player, x, z)`
* **Description:** Handles remote direct walking input.
* **Parameters:**
  - `player` -- Entity, the player
  - `x` -- number, direction x
  - `z` -- number, direction z
* **Returns:** nil
* **Error states:** Returns early if out of range

### `DragWalking(player, x, z, platform, platform_relative)`
* **Description:** Handles remote drag walking input.
* **Parameters:**
  - `player` -- Entity, the player
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative flag
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `PredictWalking(player, x, z, isdirectwalking, isstart, platform, platform_relative, overridemovetime)`
* **Description:** Handles remote walking prediction input.
* **Parameters:**
  - `player` -- Entity, the player
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `isdirectwalking` -- boolean, direct walk flag
  - `isstart` -- boolean, start flag
  - `platform` -- Entity (Optional), platform
  - `platform_relative` -- boolean, relative flag
  - `overridemovetime` -- number (Optional), move time override
* **Returns:** nil
* **Error states:** Returns early if validation fails or out of range

### `PredictOverrideLocomote(player, dir)`
* **Description:** Handles remote locomotion override prediction.
* **Parameters:**
  - `player` -- Entity, the player
  - `dir` -- number, direction
* **Returns:** nil
* **Error states:** Returns early if dir is invalid

### `StrafeFacing(player, dir)`
* **Description:** Handles remote strafe facing changes.
* **Parameters:**
  - `player` -- Entity, the player
  - `dir` -- number, direction
* **Returns:** nil
* **Error states:** Returns early if dir is invalid or player is busy

### `StartHop(player, x, z, platform, has_platform)`
* **Description:** Handles remote hop start actions.
* **Parameters:**
  - `player` -- Entity, the player
  - `x` -- number, x coordinate
  - `z` -- number, z coordinate
  - `platform` -- Entity (Optional), platform
  - `has_platform` -- boolean, platform existence flag
* **Returns:** nil
* **Error states:** Returns early if validation fails or platform mismatch

### `SteerBoat(player, dir_x, dir_z)`
* **Description:** Handles remote boat steering input.
* **Parameters:**
  - `player` -- Entity, the player
  - `dir_x` -- number, steer x
  - `dir_z` -- number, steer z
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `StopWalking(player)`
* **Description:** Handles remote stop walking signal.
* **Parameters:**
  - `player` -- Entity, the player
* **Returns:** nil
* **Error states:** None

### `DoWidgetButtonAction(player, action, target, mod_name)`
* **Description:** Handles remote widget button actions.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- any, deprecated action
  - `target` -- Entity (Optional), target entity
  - `mod_name` -- string, deprecated mod name
* **Returns:** nil
* **Error states:** Returns early if target invalid or container not opened by player

### `ReturnActiveItem(player)`
* **Description:** Handles returning active item to inventory.
* **Parameters:**
  - `player` -- Entity, the player
* **Returns:** nil
* **Error states:** None

### `PutOneOfActiveItemInSlot(player, slot, container)`
* **Description:** Handles putting one of active item into a slot.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `PutAllOfActiveItemInSlot(player, slot, container)`
* **Description:** Handles putting all of active item into a slot.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `TakeActiveItemFromHalfOfSlot(player, slot, container)`
* **Description:** Handles taking half of item from slot to active.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `TakeActiveItemFromCountOfSlot(player, slot, container, count)`
* **Description:** Handles taking specific count of item from slot to active.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
  - `count` -- number, item count
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `TakeActiveItemFromAllOfSlot(player, slot, container)`
* **Description:** Handles taking all items from slot to active.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `AddOneOfActiveItemToSlot(player, slot, container)`
* **Description:** Handles adding one of active item to slot.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `AddAllOfActiveItemToSlot(player, slot, container)`
* **Description:** Handles adding all of active item to slot.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `SwapActiveItemWithSlot(player, slot, container)`
* **Description:** Handles swapping active item with slot contents.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `SwapOneOfActiveItemWithSlot(player, slot, container)`
* **Description:** Handles swapping one of active item with slot contents. Note: Only works when container is provided; direct inventory swap (container=nil) is not implemented.
* **Parameters:**
  - `player` -- Entity, the player
  - `slot` -- number, slot index
  - `container` -- Entity (Optional), container entity
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `UseItemFromInvTile(player, action, item, controlmods, mod_name)`
* **Description:** Handles using an item from inventory tile.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `item` -- Entity, item entity
  - `controlmods` -- number (Optional), control modifiers
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `ControllerUseItemOnItemFromInvTile(player, action, item, active_item, mod_name)`
* **Description:** Handles controller use item on item from inventory tile.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `item` -- Entity, target item
  - `active_item` -- Entity, active item
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `ControllerUseItemOnSelfFromInvTile(player, action, item, mod_name)`
* **Description:** Handles controller use item on self from inventory tile.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `item` -- Entity, item entity
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `ControllerUseItemOnSceneFromInvTile(player, action, item, target, mod_name)`
* **Description:** Handles controller use item on scene from inventory tile.
* **Parameters:**
  - `player` -- Entity, the player
  - `action` -- number, action type
  - `item` -- Entity, item entity
  - `target` -- Entity (Optional), target entity
  - `mod_name` -- string (Optional), mod name
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `InspectItemFromInvTile(player, item)`
* **Description:** Handles inspecting an item from inventory tile.
* **Parameters:**
  - `player` -- Entity, the player
  - `item` -- Entity, item entity
* **Returns:** nil
* **Error states:** Returns early if item is invalid

### `DropItemFromInvTile(player, item, single)`
* **Description:** Handles dropping an item from inventory tile.
* **Parameters:**
  - `player` -- Entity, the player
  - `item` -- Entity, item entity
  - `single` -- boolean (Optional), drop single flag
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `CastSpellBookFromInv(player, item, spell_id)`
* **Description:** Handles casting a spell from inventory.
* **Parameters:**
  - `player` -- Entity, the player
  - `item` -- Entity, spellbook item
  - `spell_id` -- number, spell ID
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `EquipActiveItem(player)`
* **Description:** Handles equipping the active item.
* **Parameters:**
  - `player` -- Entity, the player
* **Returns:** nil
* **Error states:** None

### `EquipActionItem(player, item)`
* **Description:** Handles equipping an action item.
* **Parameters:**
  - `player` -- Entity, the player
  - `item` -- Entity (Optional), item entity
* **Returns:** nil
* **Error states:** Returns early if item is provided but invalid

### `SwapEquipWithActiveItem(player)`
* **Description:** Swaps the player's equipped item with their active held item via the inventory component.
* **Parameters:**
  - `player` -- Entity: The player entity performing the swap
* **Returns:** nil
* **Error states:** Returns early if inventory component is missing

### `TakeActiveItemFromEquipSlot(player, eslot)`
* **Description:** Takes an active item from a specific equipment slot.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `eslot` -- Number: The equipment slot ID
* **Returns:** nil
* **Error states:** Returns early if eslot is not a number or inventory is missing

### `MoveInvItemFromAllOfSlot(player, slot, destcontainer)`
* **Description:** Moves all items from a specific inventory slot to a destination container.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `slot` -- Number: The inventory slot index
  - `destcontainer` -- Entity: The destination container entity
* **Returns:** nil
* **Error states:** Returns early if slot or destcontainer validation fails

### `MoveInvItemFromHalfOfSlot(player, slot, destcontainer)`
* **Description:** Moves half of the items from a specific inventory slot to a destination container.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `slot` -- Number: The inventory slot index
  - `destcontainer` -- Entity: The destination container entity
* **Returns:** nil
* **Error states:** Returns early if slot or destcontainer validation fails

### `MoveInvItemFromCountOfSlot(player, slot, destcontainer, count)`
* **Description:** Moves a specific count of items from a slot to a destination container.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `slot` -- Number: The inventory slot index
  - `destcontainer` -- Entity: The destination container entity
  - `count` -- Number: The number of items to move
* **Returns:** nil
* **Error states:** Returns early if validation fails

### `MoveItemFromAllOfSlot(player, slot, srccontainer, destcontainer)`
* **Description:** Moves all items from a source container slot to a destination.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `slot` -- Number: The source container slot index
  - `srccontainer` -- Entity: The source container entity
  - `destcontainer` -- Entity: The destination container entity (optional)
* **Returns:** nil
* **Error states:** Returns early if validation fails or container is not opened by player

### `MoveItemFromHalfOfSlot(player, slot, srccontainer, destcontainer)`
* **Description:** Moves half of the items from a source container slot to a destination.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `slot` -- Number: The source container slot index
  - `srccontainer` -- Entity: The source container entity
  - `destcontainer` -- Entity: The destination container entity (optional)
* **Returns:** nil
* **Error states:** Returns early if validation fails or container is not opened by player

### `MoveItemFromCountOfSlot(player, slot, srccontainer, destcontainer, count)`
* **Description:** Moves a specific count of items from a source container slot to a destination.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `slot` -- Number: The source container slot index
  - `srccontainer` -- Entity: The source container entity
  - `destcontainer` -- Entity: The destination container entity (optional)
  - `count` -- Number: The number of items to move
* **Returns:** nil
* **Error states:** Returns early if validation fails or container is not opened by player

### `MakeRecipeFromMenu(player, recipe, skin_index)`
* **Description:** Crafts a recipe from the menu using the builder component.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `recipe` -- Number: The RPC ID of the recipe
  - `skin_index` -- Number (Optional): Skin index for the product
* **Returns:** nil
* **Error states:** Returns early if recipe ID is invalid or builder is missing

### `SetMovementPredictionEnabled(player, enabled)`
* **Description:** Toggles movement prediction on the player controller.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `enabled` -- Boolean: Whether to enable movement prediction
* **Returns:** nil
* **Error states:** Returns early if enabled is not a boolean

### `MakeRecipeAtPoint(player, recipe, x, z, rot, skin_index, platform, platform_relative)`
* **Description:** Crafts a recipe at a specific world position.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `recipe` -- Number: The RPC ID of the recipe
  - `x` -- Number: X coordinate
  - `z` -- Number: Z coordinate
  - `rot` -- Number: Rotation angle
  - `skin_index` -- Number (Optional): Skin index
  - `platform` -- Entity (Optional): Platform entity
  - `platform_relative` -- Boolean: Whether coordinates are relative to platform
* **Returns:** nil
* **Error states:** Returns early if parameters are invalid or position is out of range

### `BufferBuild(player, recipe)`
* **Description:** Buffers a build action for a recipe.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `recipe` -- Number: The RPC ID of the recipe
* **Returns:** nil
* **Error states:** Returns early if recipe ID is invalid

### `CannotBuild(player, reason)`
* **Description:** Notifies the player they cannot build via talker component.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `reason` -- String: The reason string key
* **Returns:** nil
* **Error states:** Returns early if reason is not a string

### `WakeUp(player)`
* **Description:** Wakes the player up from sleeping if conditions are met.
* **Parameters:**
  - `player` -- Entity: The player entity
* **Returns:** nil
* **Error states:** None

### `exitgym(player)`
* **Description:** Exits the gym state by pushing a locomote event.
* **Parameters:**
  - `player` -- Entity: The player entity
* **Returns:** nil
* **Error states:** None

### `SetWriteableText(player, target, text)`
* **Description:** Sets text on a writeable component.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `target` -- Entity: The writeable target entity
  - `text` -- String (Optional): Text to write
* **Returns:** nil
* **Error states:** Returns early if target is not an entity

### `ToggleController(player, isattached)`
* **Description:** Toggles the player controller attachment state.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `isattached` -- Boolean: Whether the controller is attached
* **Returns:** nil
* **Error states:** Returns early if isattached is not a boolean

### `OpenGift(player)`
* **Description:** Opens the next gift via the giftreceiver component.
* **Parameters:**
  - `player` -- Entity: The player entity
* **Returns:** nil
* **Error states:** None

### `ClosePopup(player, popupcode, mod_name, ...)`
* **Description:** Closes a popup dialog. The popup is closed regardless of validation result, but with different arguments depending on validation success.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `popupcode` -- Number: The popup code ID
  - `mod_name` -- String (Optional): Mod name
  - `...` -- Any: Additional arguments for validation
* **Returns:** nil
* **Error states:** Returns early if popup code is invalid; popup is closed even if validation fails

### `RecievePopupMessage(player, popupcode, mod_name, ...)`
* **Description:** Receives a popup message and sends it to the server.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `popupcode` -- Number: The popup code ID
  - `mod_name` -- String (Optional): Mod name
  - `...` -- Any: Message arguments
* **Returns:** nil
* **Error states:** Returns early if popup code is invalid

### `RepeatHeldAction(player)`
* **Description:** Repeats the currently held action via player controller.
* **Parameters:**
  - `player` -- Entity: The player entity
* **Returns:** nil
* **Error states:** None

### `ClearActionHold(player)`
* **Description:** Clears the action hold state via player controller.
* **Parameters:**
  - `player` -- Entity: The player entity
* **Returns:** nil
* **Error states:** None

### `GetChatHistory(player, last_message_hash, first_message_hash)`
* **Description:** Requests chat history from the server.
* **Parameters:**
  - `player` -- Entity/UserID: The player or user ID
  - `last_message_hash` -- Number: Hash of the last message
  - `first_message_hash` -- Number (Optional): Hash of the first message
* **Returns:** nil
* **Error states:** Returns early if hashes are invalid or history already sent

### `DoActionOnMap(player, actioncode, x, z, maptarget, mod_name)`
* **Description:** Performs an action on the map at specific coordinates.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `actioncode` -- Number: The action code
  - `x` -- Number: X coordinate
  - `z` -- Number: Z coordinate
  - `maptarget` -- Entity (Optional): Map target entity
  - `mod_name` -- String (Optional): Mod name
* **Returns:** nil
* **Error states:** Returns early if parameters are invalid

### `SetSkillActivatedState(player, skill_rpc_id, isunlocked)`
* **Description:** Sets the activation state of a skill via skilltreeupdater. Note: Deactivation (isunlocked=false) is currently not implemented on server side due to potential desync issues.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `skill_rpc_id` -- Number: The skill RPC ID
  - `isunlocked` -- Boolean: Whether the skill is unlocked
* **Returns:** nil
* **Error states:** Returns early if ID is invalid or skill does not exist

### `AddSkillXP(player, amount)`
* **Description:** Adds XP to the player's skill tree.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `amount` -- Number: The amount of XP to add
* **Returns:** nil
* **Error states:** Returns early if amount is not a number

### `PostActivateHandshake(player, state)`
* **Description:** Handles the post-activation handshake state.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `state` -- Number: The handshake state
* **Returns:** nil
* **Error states:** Returns early if state is not a uint

### `OnScrapbookDataTaught(player, inst, response)`
* **Description:** Handles scrapbook data being taught.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `inst` -- Entity: The scrapbook instance
  - `response` -- Any: The response data
* **Returns:** nil
* **Error states:** Returns early if inst is not an entity

### `SetClientAuthoritativeSetting(player, variable, value)`
* **Description:** Sets a client-authoritative setting on the player.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `variable` -- Any: The setting variable
  - `value` -- Any: The setting value
* **Returns:** nil
* **Error states:** None

### `AOECharging(player, rotation, startflag)`
* **Description:** Handles AOE charging state remotely.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `rotation` -- Number: The rotation angle
  - `startflag` -- Number (Optional): Start flag
* **Returns:** nil
* **Error states:** Returns early if rotation is invalid

### `DoubleTapAction(player, action, x, z, noforce, mod_name, platform, platform_relative)`
* **Description:** Handles a double-tap action at a specific location.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `action` -- Number: The action code
  - `x` -- Number: X coordinate
  - `z` -- Number: Z coordinate
  - `noforce` -- Boolean (Optional): Force flag
  - `mod_name` -- String (Optional): Mod name
  - `platform` -- Entity (Optional): Platform entity
  - `platform_relative` -- Boolean: Whether coordinates are relative
* **Returns:** nil
* **Error states:** Returns early if parameters are invalid or out of range

### `WobyCommand(player, cmd)`
* **Description:** Executes a Woby command if classified data exists.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `cmd` -- Number: The command ID
* **Returns:** nil
* **Error states:** Returns early if cmd is invalid or commands unavailable

### `InteractionTarget(player, action, target)`
* **Description:** Sets the interaction target remotely.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `action` -- Number (Optional): Action code
  - `target` -- Entity (Optional): Target entity
* **Returns:** nil
* **Error states:** Returns early if parameters are invalid

### `PredictGallopTrip(player, x, z, dir, speed, platform, platform_relative)`
* **Description:** Predicts a gallop trip and pushes an event.
* **Parameters:**
  - `player` -- Entity: The player entity
  - `x` -- Number: X coordinate
  - `z` -- Number: Z coordinate
  - `dir` -- Number: Direction
  - `speed` -- Number (Optional): Speed
  - `platform` -- Entity (Optional): Platform entity
  - `platform_relative` -- Boolean: Whether coordinates are relative
* **Returns:** nil
* **Error states:** Returns early if parameters are invalid or rotation invalid

### `ShowPopup(popupcode, mod_name, show, ...)`
* **Description:** Client-side handler to show a popup dialog.
* **Parameters:**
  - `popupcode` -- Number: The popup code ID
  - `mod_name` -- String (Optional): Mod name
  - `show` -- Boolean: Whether to show the popup
  - `...` -- Any: Additional arguments
* **Returns:** nil
* **Error states:** None

### `RecievePopupMessage(popupcode, mod_name, ...)`
* **Description:** Client-side handler to receive a popup message.
* **Parameters:**
  - `popupcode` -- Number: The popup code ID
  - `mod_name` -- String (Optional): Mod name
  - `...` -- Any: Message arguments
* **Returns:** nil
* **Error states:** None

### `LearnRecipe(product, ...)`
* **Description:** Client-side handler to learn a cookbook recipe.
* **Parameters:**
  - `product` -- String: The product prefab name
  - `...` -- Any: Ingredient list
* **Returns:** nil
* **Error states:** None

### `LearnFoodStats(product)`
* **Description:** Client-side handler to learn food stats.
* **Parameters:**
  - `product` -- String: The product prefab name
* **Returns:** nil
* **Error states:** None

### `LearnPlantStage(plant, stage)`
* **Description:** Client-side handler to learn a plant stage.
* **Parameters:**
  - `plant` -- String: The plant prefab name
  - `stage` -- Any: The growth stage
* **Returns:** nil
* **Error states:** None

### `LearnFertilizerStage(fertilizer)`
* **Description:** Client-side handler to learn fertilizer data.
* **Parameters:**
  - `fertilizer` -- String: The fertilizer prefab name
* **Returns:** nil
* **Error states:** None

### `TakeOversizedPicture(plant, weight, beardskin, beardlength)`
* **Description:** Client-side handler to record an oversized crop picture.
* **Parameters:**
  - `plant` -- String: The plant prefab name
  - `weight` -- Number: The weight of the crop
  - `beardskin` -- Any: Beard skin data
  - `beardlength` -- Any: Beard length data
* **Returns:** nil
* **Error states:** None

### `RecieveChatHistory(chat_history)`
* **Description:** Client-side handler to receive chat history.
* **Parameters:**
  - `chat_history` -- Table: The chat history data
* **Returns:** nil
* **Error states:** None

### `LearnBuilderRecipe(product)`
* **Description:** Client-side handler to learn a builder recipe via event.
* **Parameters:**
  - `product` -- String: The recipe product name
* **Returns:** nil
* **Error states:** None

### `UpdateAccomplishment(name)`
* **Description:** Client-side handler to update a generic KV accomplishment.
* **Parameters:**
  - `name` -- String: The accomplishment name
* **Returns:** nil
* **Error states:** None

### `UpdateCountAccomplishment(name, maxvalue)`
* **Description:** Client-side handler to increment a count accomplishment.
* **Parameters:**
  - `name` -- String: The accomplishment name
  - `maxvalue` -- Number (Optional): Max value cap
* **Returns:** nil
* **Error states:** Returns early if maxvalue reached

### `SetSkillActivatedState(skill_rpc_id, isunlocked)`
* **Description:** Client-side handler to set skill activation state.
* **Parameters:**
  - `skill_rpc_id` -- Number: The skill RPC ID
  - `isunlocked` -- Boolean: Whether the skill is unlocked
* **Returns:** nil
* **Error states:** Returns early if character prefab is nil or skill invalid

### `AddSkillXP(amount)`
* **Description:** Client-side handler to add skill XP.
* **Parameters:**
  - `amount` -- Number: The amount of XP to add
* **Returns:** nil
* **Error states:** None

### `PostActivateHandshake(state)`
* **Description:** Client-side handler for post-activate handshake.
* **Parameters:**
  - `state` -- Number: The handshake state
* **Returns:** nil
* **Error states:** None

### `TryToTeachScrapbookData(inst)`
* **Description:** Client-side handler to teach scrapbook data.
* **Parameters:**
  - `inst` -- Entity: The scrapbook instance
* **Returns:** nil
* **Error states:** None

### `ShardTransactionSteps(shardid, shardpayload_string)`
* **Description:** Shard-side handler to process transaction steps.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `shardpayload_string` -- String: The serialized payload
* **Returns:** nil
* **Error states:** None

### `PruneShardTransactionSteps(shardid, newfinalizedid)`
* **Description:** Shard-side handler to prune transaction steps.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `newfinalizedid` -- Any: The new finalized ID
* **Returns:** nil
* **Error states:** None

### `ReskinWorldMigrator(shardid, migrator, skin_theme, skin_id, sessionid)`
* **Description:** Shard-side handler to reskin a world migrator entity.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `migrator` -- Number: The migrator ID
  - `skin_theme` -- String: The skin theme
  - `skin_id` -- Any: The skin ID
  - `sessionid` -- Any: The session ID
* **Returns:** nil
* **Error states:** None

### `SyncWorldSettings(shardid, options_string)`
* **Description:** Shard-side handler to sync world settings.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `options_string` -- String: The serialized options
* **Returns:** nil
* **Error states:** None

### `ResyncWorldSettings(shardid)`
* **Description:** Shard-side handler to resync world settings.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
* **Returns:** nil
* **Error states:** None

### `SyncWorldStateTag(shardid, namespace, tag, enabled)`
* **Description:** Shard-side handler to sync a world state tag.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `namespace` -- String: The tag namespace
  - `tag` -- String: The tag name
  - `enabled` -- Boolean: Whether the tag is enabled
* **Returns:** nil
* **Error states:** None

### `SyncBossDefeated(shardid, bossprefab)`
* **Description:** Shard-side handler to sync boss defeated state.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `bossprefab` -- String: The boss prefab name
* **Returns:** nil
* **Error states:** None

### `SyncMermKingExists(shardid, exists)`
* **Description:** Shard-side handler to sync Merm King existence.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `exists` -- Boolean: Whether the king exists
* **Returns:** nil
* **Error states:** None

### `SyncMermKingTrident(shardid, exists)`
* **Description:** Shard-side handler to sync Merm King Trident state.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `exists` -- Boolean: Whether the trident exists
* **Returns:** nil
* **Error states:** None

### `SyncMermKingCrown(shardid, exists)`
* **Description:** Shard-side handler to sync Merm King Crown state.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `exists` -- Boolean: Whether the crown exists
* **Returns:** nil
* **Error states:** None

### `SyncMermKingPauldron(shardid, exists)`
* **Description:** Shard-side handler to sync Merm King Pauldron state.
* **Parameters:**
  - `shardid` -- Number/String: The shard ID
  - `exists` -- Boolean: Whether the pauldron exists
* **Returns:** nil
* **Error states:** None

### `SendRPCToServer(code, ...)`
* **Description:** Sends an RPC to the server via TheNet.
* **Parameters:**
  - `code` -- Number: The RPC code
  - `...` -- Any: RPC arguments
* **Returns:** nil
* **Error states:** Asserts if RPC code is invalid

### `SendRPCToClient(code, ...)`
* **Description:** Sends an RPC to clients via TheNet.
* **Parameters:**
  - `code` -- Number: The RPC code
  - `...` -- Any: RPC arguments including user list
* **Returns:** nil
* **Error states:** Asserts if RPC code is invalid

### `SendRPCToShard(code, ...)`
* **Description:** Sends an RPC to shards via TheNet.
* **Parameters:**
  - `code` -- Number: The RPC code
  - `...` -- Any: RPC arguments including shard list
* **Returns:** nil
* **Error states:** Asserts if RPC code is invalid

### `HandleRPC(sender, tick, code, data)`
* **Description:** Processes an incoming server-bound RPC with rate limiting.
* **Parameters:**
  - `sender` -- Entity/Table: The sender entity or userid table
  - `tick` -- Number: The simulation tick
  - `code` -- Number: The RPC code
  - `data` -- Table: The RPC data
* **Returns:** nil
* **Error states:** Logs error if sender is invalid or code unknown

### `HandleClientRPC(tick, code, data)`
* **Description:** Processes an incoming client-bound RPC.
* **Parameters:**
  - `tick` -- Number: The simulation tick
  - `code` -- Number: The RPC code
  - `data` -- Table: The RPC data
* **Returns:** nil
* **Error states:** Returns early if ThePlayer is nil

### `HandleShardRPC(sender, tick, code, data)`
* **Description:** Processes an incoming shard-bound RPC.
* **Parameters:**
  - `sender` -- Any: The sender shard ID
  - `tick` -- Number: The simulation tick
  - `code` -- Number: The RPC code
  - `data` -- Table: The RPC data
* **Returns:** nil
* **Error states:** Logs error if code is unknown

### `HandleRPCQueue()`
* **Description:** Processes pending RPC queues for server, client, and shard connections, handling rate limiting and timeline validation before invoking RPCs via TheNet.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `TickRPCQueue()`
* **Description:** Resets RPC timeline tables to prepare for the next simulation tick.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `__index_lower(t, k)`
* **Description:** Metatable __index function that performs case-insensitive key lookup by lowercasing the key.
* **Parameters:**
  - `t` -- table: The table being accessed
  - `k` -- string: The key being looked up
* **Returns:** value: The value associated with the lowercased key
* **Error states:** None

### `__newindex_lower(t, k, v)`
* **Description:** Metatable __newindex function that stores values using a lowercased key.
* **Parameters:**
  - `t` -- table: The table being modified
  - `k` -- string: The key being set
  - `v` -- any: The value to assign
* **Returns:** nil
* **Error states:** None

### `setmetadata(tab)`
* **Description:** Assigns a metatable to a table enabling case-insensitive key access.
* **Parameters:**
  - `tab` -- table: The table to assign the case-insensitive metatable
* **Returns:** nil
* **Error states:** None

### `AddModRPCHandler(namespace, name, fn)`
* **Description:** Registers a new mod RPC handler for server-side processing, updating rate limits.
* **Parameters:**
  - `namespace` -- string: The namespace for the mod RPC
  - `name` -- string: The unique name of the RPC within the namespace
  - `fn` -- function: The handler function to execute when the RPC is received
* **Returns:** nil
* **Error states:** None

### `AddClientModRPCHandler(namespace, name, fn)`
* **Description:** Registers a new mod RPC handler for client-side processing.
* **Parameters:**
  - `namespace` -- string: The namespace for the client mod RPC
  - `name` -- string: The unique name of the RPC
  - `fn` -- function: The handler function to execute on the client
* **Returns:** nil
* **Error states:** None

### `AddShardModRPCHandler(namespace, name, fn)`
* **Description:** Registers a new mod RPC handler for shard-side processing.
* **Parameters:**
  - `namespace` -- string: The namespace for the shard mod RPC
  - `name` -- string: The unique name of the RPC
  - `fn` -- function: The handler function to execute on the shard
* **Returns:** nil
* **Error states:** None

### `SendModRPCToServer(id_table, ...)`
* **Description:** Sends a mod RPC to the server after validating the handler exists.
* **Parameters:**
  - `id_table` -- table: The RPC ID table containing namespace and id
  - `...` -- varargs: Data arguments to pass to the RPC
* **Returns:** nil
* **Error states:** Asserts if the ID table or handler is invalid

### `SendModRPCToClient(id_table, ...)`
* **Description:** Sends a mod RPC to a client after validating the handler exists.
* **Parameters:**
  - `id_table` -- table: The RPC ID table containing namespace and id
  - `...` -- varargs: Data arguments to pass to the RPC
* **Returns:** nil
* **Error states:** Asserts if the ID table or handler is invalid

### `SendModRPCToShard(id_table, ...)`
* **Description:** Sends a mod RPC to a shard after validating the handler exists.
* **Parameters:**
  - `id_table` -- table: The RPC ID table containing namespace and id
  - `...` -- varargs: Data arguments to pass to the RPC
* **Returns:** nil
* **Error states:** Asserts if the ID table or handler is invalid

### `HandleModRPC(sender, tick, namespace, code, data)`
* **Description:** Processes incoming mod RPCs from clients, enforcing rate limits and user ID validation.
* **Parameters:**
  - `sender` -- Entity or UserID: The sender of the RPC
  - `tick` -- number: The simulation tick the RPC was sent
  - `namespace` -- string: The RPC namespace
  - `code` -- number: The RPC handler code ID
  - `data` -- table: The data payload
* **Returns:** nil
* **Error states:** Prints error if namespace, code, or sender is invalid

### `HandleClientModRPC(tick, namespace, code, data)`
* **Description:** Processes incoming client mod RPCs queued for local execution.
* **Parameters:**
  - `tick` -- number: The simulation tick the RPC was sent
  - `namespace` -- string: The RPC namespace
  - `code` -- number: The RPC handler code ID
  - `data` -- table: The data payload
* **Returns:** nil
* **Error states:** Prints error if namespace or code is invalid

### `HandleShardModRPC(sender, tick, namespace, code, data)`
* **Description:** Processes incoming shard mod RPCs queued for execution.
* **Parameters:**
  - `sender` -- Entity or ShardID: The sender of the RPC
  - `tick` -- number: The simulation tick the RPC was sent
  - `namespace` -- string: The RPC namespace
  - `code` -- number: The RPC handler code ID
  - `data` -- table: The data payload
* **Returns:** nil
* **Error states:** Prints error if namespace or code is invalid

### `GetModRPCHandler(namespace, name)`
* **Description:** Retrieves the registered handler function for a mod RPC.
* **Parameters:**
  - `namespace` -- string: The RPC namespace
  - `name` -- string: The RPC name
* **Returns:** function: The handler function
* **Error states:** None

### `GetClientModRPCHandler(namespace, name)`
* **Description:** Retrieves the registered handler function for a client mod RPC.
* **Parameters:**
  - `namespace` -- string: The RPC namespace
  - `name` -- string: The RPC name
* **Returns:** function: The handler function
* **Error states:** None

### `GetShardModRPCHandler(namespace, name)`
* **Description:** Retrieves the registered handler function for a shard mod RPC.
* **Parameters:**
  - `namespace` -- string: The RPC namespace
  - `name` -- string: The RPC name
* **Returns:** function: The handler function
* **Error states:** None

### `GetModRPC(namespace, name)`
* **Description:** Retrieves the RPC table entry for a mod RPC.
* **Parameters:**
  - `namespace` -- string: The RPC namespace
  - `name` -- string: The RPC name
* **Returns:** table: The RPC entry
* **Error states:** None

### `GetClientModRPC(namespace, name)`
* **Description:** Retrieves the RPC table entry for a client mod RPC.
* **Parameters:**
  - `namespace` -- string: The RPC namespace
  - `name` -- string: The RPC name
* **Returns:** table: The RPC entry
* **Error states:** None

### `GetShardModRPC(namespace, name)`
* **Description:** Retrieves the RPC table entry for a shard mod RPC.
* **Parameters:**
  - `namespace` -- string: The RPC namespace
  - `name` -- string: The RPC name
* **Returns:** table: The RPC entry
* **Error states:** None

### `MarkUserIDRPC(namespace, name)`
* **Description:** Marks an RPC as requiring user ID validation instead of entity validation.
* **Parameters:**
  - `namespace` -- string or nil: The RPC namespace
  - `name` -- string: The RPC name or namespace if namespace is nil
* **Returns:** nil
* **Error states:** None

### `DisableRPCSending()`
* **Description:** Disables RPC sending functions by replacing them with no-op functions, used during world reset or regeneration.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

## Events & listeners

**Events pushed:**
- `invalidrpc` -- Pushed when a player sends an invalid RPC
- `locomote` -- Pushed in WakeUp and exitgym to resume player movement
- `predict_gallop_trip` -- Pushed in PredictGallopTrip with trip data
- `LearnBuilderRecipe` -- Pushed in CLIENT_RPC_HANDLERS.LearnBuilderRecipe

**Events listened to:**
- None