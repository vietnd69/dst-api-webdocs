---
id: networkclientrpc
title: Networkclientrpc
description: Defines the complete network RPC system for Don't Starve Together, including server-bound, client-bound, and shard-to-shard RPC handlers with queue management and mod extension APIs.
tags: [network, rpc, multiplayer, modding]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: df7ccd78
system_scope: network
---

# Networkclientrpc

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`networkclientrpc.lua` provides the core Remote Procedure Call infrastructure for Don't Starve Together multiplayer communication. This utility module handles three RPC directions: client-to-server (player actions), server-to-client (notifications and state sync), and shard-to-shard (cluster communication). It includes parameter validation helpers (`checkbool`, `checknumber`, `checkstring`, etc.), RPC queue management with tick-based processing, and extension APIs for modders to register custom RPC handlers. The module integrates with `TheNet` for actual RPC transmission, `TheWorld` for shard transaction tracking, and various game systems like skill trees, scrapbook, and world settings for specific RPC payloads.

## Usage example
```lua
require "networkclientrpc"

-- Send an RPC to the server (client-side) using RPC code
SendRPCToServer(RPC.LeftClick, action, x, z, target, isreleased, controlmods, noforce, mod_name, platform, platform_relative, spellbook, spell_id)

-- Register a custom mod RPC handler (server-side)
AddModRPCHandler("mymod", "custom_action", function(player, data)
    -- Handle custom action from client
end)

-- Send a mod RPC to all clients (server-side)
if TheWorld.ismastersim then
    SendModRPCToClient(CLIENT_MOD_RPC["mymod"].custom_action, {value = 42})
end
```

## Dependencies & tags

**External dependencies:**
- `util` -- Required at top for utility functions
- `worldsettings_overrides` -- Required for SyncWorldSettings to apply world setting overrides
- `TheWorld` -- Accessed for components.shardtransactionsteps and PushEvent
- `TheNet` -- Called for all RPC sending (SendRPCToServer, SendRPCToClient, SendRPCToShard, CallRPC variants)
- `ThePlayer` -- Used in client RPC handlers as target entity
- `TheSim` -- Called in ReskinWorldMigrator for entity reskinning
- `TheShard` -- Called for GetShardId in shard RPC handling
- `TheGenericKV` -- Used in UpdateAccomplishment and UpdateCountAccomplishment for KV storage
- `TheSkillTree` -- Called to get skill name from RPC ID
- `TheScrapbookPartitions` -- Called in TryToTeachScrapbookData client RPC
- `ChatHistory` -- Called for chat history sending and receiving
- `AllRecipes` -- Iterated in MakeRecipeFromMenu, MakeRecipeAtPoint, BufferBuild to find recipe by rpc_id
- `PREFAB_SKINS` -- Accessed for skin index lookup in recipe crafting
- `ShardPortals` -- Iterated in ReskinWorldMigrator to find matching portal
- `GLOBAL` -- Implicit via string.format, print, tostring, type, pairs, ipairs, table.insert, unpack, assert, math, Vector3, VecUtil_Length, RunInSandboxSafe, IsTableEmpty, GetString, GetPopupFromPopupCode, GetWorldStateTagObjectFromNamespace, Shard_SyncWorldSettings, Shard_SyncBossDefeated, Shard_SyncMermKingExists, Shard_SyncMermKingTrident, Shard_SyncMermKingCrown, Shard_SyncMermKingPauldron, orderedPairs, BRANCH

**Components used:**
- `playercontroller` -- Called for most player input RPCs (OnRemoteLeftClick, OnRemoteRightClick, OnRemoteActionButton, etc.)
- `inventory` -- Called for inventory management RPCs (ReturnActiveItem, PutOneOfActiveItemInSlot, DropItemFromInvTile, etc.)
- `builder` -- Called for crafting RPCs (MakeRecipeFromMenu, MakeRecipeAtPoint, BufferBuild)
- `talker` -- Called in CannotBuild to announce build failure
- `giftreceiver` -- Called in OpenGift to open next gift
- `skilltreeupdater` -- Called for skill tree RPCs (ActivateSkill, AddSkillXP, IsActivated)
- `upgrademoduleowner` -- Called in UnplugModule for module unplugging
- `socketholder` -- Called in UnplugModule for socket unplugging
- `writeable` -- Called in SetWriteableText to write text
- `locomotor` -- Called in StrafeFacing for strafe direction changes
- `steeringwheeluser` -- Called in SteerBoat for boat steering
- `cookbookupdater` -- Called in client RPCs LearnRecipe, LearnFoodStats
- `plantregistryupdater` -- Called in client RPCs LearnPlantStage, LearnFertilizer, TakeOversizedPicture
- `shardtransactionsteps` -- Called in shard RPCs ShardTransactionSteps, PruneShardTransactionSteps
- `worldmigrator` -- Accessed via id in ReskinWorldMigrator to match portals

**Tags:**
None identified.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RPC_QUEUE_RATE_LIMIT` | number | 20 | Maximum RPCs per logic tick before rate limiting kicks in |
| `RPC_QUEUE_RATE_LIMIT_PER_MOD` | number | 5 | Additional RPC limit per mod RPC handler registered |
| `RPC` | table | - | RPC code mapping for server-bound player actions |
| `CLIENT_RPC` | table | - | RPC code mapping for server-to-client notifications |
| `SHARD_RPC` | table | - | RPC code mapping for shard-to-shard communication |
| `MOD_RPC` | table | - | Mod RPC code mapping for server-bound mod actions |
| `CLIENT_MOD_RPC` | table | - | Mod RPC code mapping for server-to-client mod notifications |
| `SHARD_MOD_RPC` | table | - | Mod RPC code mapping for shard-to-shard mod communication |

## Main functions

### `checkbool(val)`
* **Description:** Returns true if val is nil or a boolean type. Used for optional boolean parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `checknumber(val)`
* **Description:** Returns true if val is a number type. Used for required number parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `checkuint(val)`
* **Description:** Returns true if val is a number and contains no non-digit characters (unsigned integer check). Used for inventory slot validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `checkstring(val)`
* **Description:** Returns true if val is a string type. Used for required string parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `checkentity(val)`
* **Description:** Returns true if val is a table type (entity instances are tables). Used for required entity parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `optbool(val)`
* **Description:** Alias for checkbool. Returns true if val is nil or a boolean.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `optnumber(val)`
* **Description:** Returns true if val is nil or a number. Used for optional number parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `optuint(val)`
* **Description:** Returns true if val is nil or an unsigned integer. Used for optional slot/count validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `optstring(val)`
* **Description:** Returns true if val is nil or a string. Used for optional string parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `optentity(val)`
* **Description:** Returns true if val is nil or a table. Used for optional entity parameter validation.
* **Parameters:**
  - `val` -- any value to check
* **Returns:** boolean

### `printinvalid(rpcname, player)`
* **Description:** Logs invalid RPC attempts and pushes `invalidrpc` event for mod handling. Asserts in dev branch.
* **Parameters:**
  - `rpcname` -- string name of the RPC that failed validation
  - `player` -- player entity that sent the invalid RPC
* **Returns:** None

### `printinvalidplatform(rpcname, player, action, relative_x, relative_z, platform, platform_relative)`
* **Description:** Logs debug info when platform-relative position conversion fails. Only prints if platform_relative is true and platform is nil.
* **Parameters:**
  - `rpcname` -- RPC name
  - `player` -- player entity
  - `action` -- action number
  - `relative_x` -- X offset
  - `relative_z` -- Z offset
  - `platform` -- platform entity or nil
  - `platform_relative` -- boolean indicating platform-relative coordinates
* **Returns:** None

### `IsRotationValid(rot)`
* **Description:** Checks if rotation value is within valid numeric range (not infinity).
* **Parameters:**
  - `rot` -- number rotation value
* **Returns:** boolean

### `IsPointInRange(player, x, z)`
* **Description:** Checks if target position is within 64 units (4096 squared distance) of player position.
* **Parameters:**
  - `player` -- player entity
  - `x` -- target X position
  - `z` -- target Z position
* **Returns:** boolean
* **Error states:** Errors if player.Transform is nil

### `ConvertPlatformRelativePositionToAbsolutePosition(relative_x, relative_z, platform, platform_relative)`
* **Description:** Converts platform-relative coordinates to world-space absolute coordinates. Returns nil if platform_relative is true but platform is nil.
* **Parameters:**
  - `relative_x` -- X offset relative to platform
  - `relative_z` -- Z offset relative to platform
  - `platform` -- platform entity or nil
  - `platform_relative` -- boolean indicating if coordinates are platform-relative
* **Returns:** x, z (numbers) or nil

### `LeftClick(player, action, x, z, target, isreleased, controlmods, noforce, mod_name, platform, platform_relative, spellbook, spell_id)`
* **Description:** Handles remote left-click actions from client. Validates all parameters, converts platform-relative positions, checks range, and forwards to playercontroller:OnRemoteLeftClick. Returns early without action if validation fails or playercontroller is nil.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number or nil
  - `x` -- world X position
  - `z` -- world Z position
  - `target` -- target entity or nil
  - `isreleased` -- boolean mouse release state
  - `controlmods` -- control modifier flags
  - `noforce` -- boolean to skip force actions
  - `mod_name` -- mod namespace string
  - `platform` -- platform entity
  - `platform_relative` -- boolean for platform-relative coords
  - `spellbook` -- spellbook entity
  - `spell_id` -- spell ID number
* **Returns:** None
* **Error states:** None

### `RightClick(player, action, x, z, target, rotation, isreleased, controlmods, noforce, mod_name, platform, platform_relative)`
* **Description:** Handles remote right-click actions from client. Validates parameters, converts positions, checks range and rotation validity, forwards to playercontroller:OnRemoteRightClick. Returns early without action if validation fails or playercontroller is nil.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number or nil
  - `x` -- world X position
  - `z` -- world Z position
  - `target` -- target entity or nil
  - `rotation` -- placement rotation
  - `isreleased` -- boolean mouse release state
  - `controlmods` -- control modifier flags
  - `noforce` -- boolean to skip force actions
  - `mod_name` -- mod namespace string
  - `platform` -- platform entity
  - `platform_relative` -- boolean for platform-relative coords
* **Returns:** None
* **Error states:** None

### `ActionButton(player, action, target, isreleased, noforce, mod_name)`
* **Description:** Handles remote action button presses. Forwards to playercontroller:OnRemoteActionButton. Returns early without action if validation fails or playercontroller is nil.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `target` -- target entity
  - `isreleased` -- boolean release state
  - `noforce` -- boolean to skip force
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `AttackButton(player, target, forceattack, noforce, isleftmouse, isreleased)`
* **Description:** Handles remote attack button presses. Forwards to playercontroller:OnRemoteAttackButton. Returns early without action if validation fails or playercontroller is nil.
* **Parameters:**
  - `player` -- player entity
  - `target` -- attack target entity
  - `forceattack` -- boolean force attack flag
  - `noforce` -- boolean skip force flag
  - `isleftmouse` -- boolean left mouse button
  - `isreleased` -- boolean release state
* **Returns:** None
* **Error states:** None

### `InspectButton(player, target)`
* **Description:** Handles remote inspect button. Validates target is entity, forwards to playercontroller:OnRemoteInspectButton. Returns early without action if target is not entity or playercontroller is nil.
* **Parameters:**
  - `player` -- player entity
  - `target` -- entity to inspect
* **Returns:** None
* **Error states:** None

### `ResurrectButton(player)`
* **Description:** Handles remote resurrect button press. Forwards to playercontroller:OnRemoteResurrectButton.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `CharacterCommandWheelButton(player, target)`
* **Description:** Handles character command wheel button. Validates target, forwards to playercontroller:OnRemoteCharacterCommandWheelButton. Returns early without action if target is not entity.
* **Parameters:**
  - `player` -- player entity
  - `target` -- command wheel target entity
* **Returns:** None
* **Error states:** None

### `ControllerActionButton(player, action, target, isreleased, noforce, mod_name)`
* **Description:** Handles controller action button. Validates parameters (all nil or all valid), forwards to playercontroller:OnRemoteControllerActionButton. Returns early without action if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `target` -- target entity
  - `isreleased` -- boolean release state
  - `noforce` -- boolean skip force
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `ControllerActionButtonPoint(player, action, x, z, isreleased, noforce, mod_name, platform, platform_relative, isspecial, spellbook, spell_id)`
* **Description:** Handles controller action button at point. Converts platform-relative positions, checks range, forwards to playercontroller:OnRemoteControllerActionButtonPoint. Returns early without action if validation fails or position out of range.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `x` -- world X
  - `z` -- world Z
  - `isreleased` -- boolean release
  - `noforce` -- boolean skip force
  - `mod_name` -- mod namespace
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
  - `isspecial` -- boolean special action
  - `spellbook` -- spellbook entity
  - `spell_id` -- spell ID
* **Returns:** None
* **Error states:** None

### `ControllerActionButtonDeploy(player, invobject, x, z, rotation, isreleased, platform, platform_relative)`
* **Description:** Handles controller deploy action. Converts positions, validates range and rotation, forwards to playercontroller:OnRemoteControllerActionButtonDeploy. Returns early if validation fails or position out of range.
* **Parameters:**
  - `player` -- player entity
  - `invobject` -- inventory object entity
  - `x` -- world X
  - `z` -- world Z
  - `rotation` -- placement rotation
  - `isreleased` -- boolean release
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
* **Returns:** None
* **Error states:** None

### `ControllerAltActionButton(player, action, target, isreleased, noforce, mod_name)`
* **Description:** Handles controller alt action button. Validates parameters, forwards to playercontroller:OnRemoteControllerAltActionButton. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `target` -- target entity
  - `isreleased` -- boolean release
  - `noforce` -- boolean skip force
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `ControllerAltActionButtonPoint(player, action, x, z, isreleased, noforce, isspecial, mod_name, platform, platform_relative)`
* **Description:** Handles controller alt action at point. Converts positions, checks range, forwards to playercontroller:OnRemoteControllerAltActionButtonPoint. Returns early if validation fails or out of range.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `x` -- world X
  - `z` -- world Z
  - `isreleased` -- boolean release
  - `noforce` -- boolean skip force
  - `isspecial` -- boolean special
  - `mod_name` -- mod namespace
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
* **Returns:** None
* **Error states:** None

### `ControllerAttackButton(player, target, isreleased, noforce)`
* **Description:** Handles controller attack button. Target can be entity or true. Forwards to playercontroller:OnRemoteControllerAttackButton. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `target` -- attack target (entity or true for self)
  - `isreleased` -- boolean release
  - `noforce` -- boolean skip force
* **Returns:** None
* **Error states:** None

### `StopControl(player, control)`
* **Description:** Handles stopping a specific control input. Forwards to playercontroller:OnRemoteStopControl. Returns early if control is not a number.
* **Parameters:**
  - `player` -- player entity
  - `control` -- control number to stop
* **Returns:** None
* **Error states:** None

### `StopAllControls(player)`
* **Description:** Handles stopping all control inputs. Forwards to playercontroller:OnRemoteStopAllControls.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `DirectWalking(player, x, z)`
* **Description:** Handles direct walking input. x/z are direction vectors, not positions. Checks magnitude `< 1.01`. Forwards to playercontroller:OnRemoteDirectWalking. Returns early if x/z not numbers or out of range.
* **Parameters:**
  - `player` -- player entity
  - `x` -- direction X (not position)
  - `z` -- direction Z (not position)
* **Returns:** None
* **Error states:** None

### `DragWalking(player, x, z, platform, platform_relative)`
* **Description:** Handles drag walking input. Converts platform-relative positions, checks range, forwards to playercontroller:OnRemoteDragWalking. Returns early if validation fails or out of range.
* **Parameters:**
  - `player` -- player entity
  - `x` -- world X
  - `z` -- world Z
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
* **Returns:** None
* **Error states:** None

### `PredictWalking(player, x, z, isdirectwalking, isstart, platform, platform_relative, overridemovetime, isstop)`
* **Description:** Handles walking prediction. Complex validation: either all nil with isstart/isstop true, or all validated. Converts positions, checks range. Forwards to playercontroller:OnRemotePredictWalking. Returns early if validation fails or out of range.
* **Parameters:**
  - `player` -- player entity
  - `x` -- world X or nil
  - `z` -- world Z or nil
  - `isdirectwalking` -- boolean direct walk mode
  - `isstart` -- boolean start flag
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
  - `overridemovetime` -- override move time
  - `isstop` -- boolean stop flag
* **Returns:** None
* **Error states:** None

### `PredictOverrideLocomote(player, dir)`
* **Description:** Handles locomotion prediction override. Forwards to playercontroller:OnRemotePredictOverrideLocomote. Returns early if dir is not a number.
* **Parameters:**
  - `player` -- player entity
  - `dir` -- direction number
* **Returns:** None
* **Error states:** None

### `StrafeFacing(player, dir)`
* **Description:** Handles strafe facing changes. Checks player not in busy state. Calls locomotor:OnStrafeFacingChanged.
* **Parameters:**
  - `player` -- player entity
  - `dir` -- facing direction number
* **Returns:** None

### `StartHop(player, x, z, platform, has_platform)`
* **Description:** Handles hop initiation. Validates platform consistency (has_platform matches platform presence and walkableplatform component). Forwards to playercontroller:OnRemoteStartHop. Returns early if validation fails or platform mismatch.
* **Parameters:**
  - `player` -- player entity
  - `x` -- world X
  - `z` -- world Z
  - `platform` -- platform entity
  - `has_platform` -- boolean has platform flag
* **Returns:** None
* **Error states:** None

### `SteerBoat(player, dir_x, dir_z)`
* **Description:** Handles boat steering. Calls steeringwheeluser:SteerInDir if player has component. Returns early if dir_x/dir_z not numbers.
* **Parameters:**
  - `player` -- player entity
  - `dir_x` -- steer direction X
  - `dir_z` -- steer direction Z
* **Returns:** None
* **Error states:** None

### `StopWalking(player)`
* **Description:** Handles stop walking command. Forwards to playercontroller:OnRemoteStopWalking.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `DoWidgetButtonAction(player, action, target, mod_name)`
* **Description:** Handles widget button actions. Checks playercontroller enabled, not busy, container opened by player. Executes buttoninfo.fn if valid. Action and mod_name are deprecated but kept for mod compatibility. Returns early if target not entity or conditions not met.
* **Parameters:**
  - `player` -- player entity
  - `action` -- deprecated action number
  - `target` -- widget target entity
  - `mod_name` -- deprecated mod name
* **Returns:** None
* **Error states:** Errors if player.sg is nil (no nil guard before HasStateTag access)

### `ReturnActiveItem(player)`
* **Description:** Returns active item to inventory. Calls inventory:ReturnActiveItem.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `PutOneOfActiveItemInSlot(player, slot, container)`
* **Description:** Moves one of active item to slot. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `PutAllOfActiveItemInSlot(player, slot, container)`
* **Description:** Moves all of active item to slot. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromHalfOfSlot(player, slot, container)`
* **Description:** Takes half of item from slot to active item. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromCountOfSlot(player, slot, container, count)`
* **Description:** Takes specific count from slot to active item. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot/count not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
  - `count` -- count to take (uint)
* **Returns:** None
* **Error states:** None

### `TakeActiveItemFromAllOfSlot(player, slot, container)`
* **Description:** Takes all from slot to active item. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `AddOneOfActiveItemToSlot(player, slot, container)`
* **Description:** Adds one of active item to slot. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `AddAllOfActiveItemToSlot(player, slot, container)`
* **Description:** Adds all of active item to slot. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `SwapActiveItemWithSlot(player, slot, container)`
* **Description:** Swaps active item with slot contents. If container nil, uses player inventory. Otherwise uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `SwapOneOfActiveItemWithSlot(player, slot, container)`
* **Description:** Swaps one of active item with slot. Currently only implemented for container (player inventory version is TODO). Uses container if opened by player. Returns early if slot not uint or container not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- slot number (uint)
  - `container` -- container entity or nil
* **Returns:** None
* **Error states:** None

### `UseItemFromInvTile(player, action, item, controlmods, mod_name)`
* **Description:** Uses item from inventory tile. Decodes control mods, calls inventory:UseItemFromInvTile, clears control mods. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `item` -- item entity
  - `controlmods` -- control modifiers
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `ControllerUseItemOnItemFromInvTile(player, action, item, active_item, mod_name)`
* **Description:** Controller use item on item from inventory. Clears control mods, calls inventory:ControllerUseItemOnItemFromInvTile. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `item` -- target item entity
  - `active_item` -- active item entity
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `ControllerUseItemOnSelfFromInvTile(player, action, item, mod_name)`
* **Description:** Controller use item on self from inventory. Clears control mods, calls inventory:ControllerUseItemOnSelfFromInvTile. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `item` -- item entity
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `ControllerUseItemOnSceneFromInvTile(player, action, item, target, mod_name)`
* **Description:** Controller use item on scene from inventory. Clears control mods, calls inventory:ControllerUseItemOnSceneFromInvTile. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `item` -- item entity
  - `target` -- scene target entity
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `InspectItemFromInvTile(player, item)`
* **Description:** Inspects item from inventory tile. Calls inventory:InspectItemFromInvTile. Returns early if item not entity.
* **Parameters:**
  - `player` -- player entity
  - `item` -- item entity to inspect
* **Returns:** None
* **Error states:** None

### `DropItemFromInvTile(player, item, single)`
* **Description:** Drops item from inventory tile. Calls inventory:DropItemFromInvTile. Returns early if item not entity.
* **Parameters:**
  - `player` -- player entity
  - `item` -- item entity to drop
  - `single` -- boolean drop single vs stack
* **Returns:** None
* **Error states:** None

### `CastSpellBookFromInv(player, item, spell_id)`
* **Description:** Casts spell from spellbook in inventory. Calls inventory:CastSpellBookFromInv. Returns early if item not entity or spell_id not uint.
* **Parameters:**
  - `player` -- player entity
  - `item` -- spellbook item entity
  - `spell_id` -- spell ID (uint)
* **Returns:** None
* **Error states:** None

### `EquipActiveItem(player)`
* **Description:** Equips the active item. Calls inventory:EquipActiveItem.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `EquipActionItem(player, item)`
* **Description:** Equips specific item via action. Calls inventory:EquipActionItem. Returns early if item not entity.
* **Parameters:**
  - `player` -- player entity
  - `item` -- item entity to equip
* **Returns:** None
* **Error states:** None

### `SwapEquipWithActiveItem(player)`
* **Description:** Swaps equipped item with active item. Calls inventory:SwapEquipWithActiveItem.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `TakeActiveItemFromEquipSlot(player, eslot)`
* **Description:** Takes item from equip slot to active item. Calls inventory:TakeActiveItemFromEquipSlotID. Returns early if eslot not number.
* **Parameters:**
  - `player` -- player entity
  - `eslot` -- equip slot number
* **Returns:** None
* **Error states:** None

### `MoveInvItemFromAllOfSlot(player, slot, destcontainer)`
* **Description:** Moves all items from player inventory slot to destination container. Calls inventory:MoveItemFromAllOfSlot. Returns early if slot not uint or destcontainer not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- source slot (uint)
  - `destcontainer` -- destination container entity
* **Returns:** None
* **Error states:** None

### `MoveInvItemFromHalfOfSlot(player, slot, destcontainer)`
* **Description:** Moves half items from player inventory slot to destination container. Calls inventory:MoveItemFromHalfOfSlot. Returns early if slot not uint or destcontainer not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- source slot (uint)
  - `destcontainer` -- destination container entity
* **Returns:** None
* **Error states:** None

### `MoveInvItemFromCountOfSlot(player, slot, destcontainer, count)`
* **Description:** Moves specific count from player inventory slot to destination container. Calls inventory:MoveItemFromCountOfSlot. Returns early if slot/count not uint or destcontainer not entity.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- source slot (uint)
  - `destcontainer` -- destination container entity
  - `count` -- count to move (uint)
* **Returns:** None
* **Error states:** None

### `MoveItemFromAllOfSlot(player, slot, srccontainer, destcontainer)`
* **Description:** Moves all items from container slot. Checks container opened by player. Calls container:MoveItemFromAllOfSlot. Returns early if validation fails or container not opened by player.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- source slot (uint)
  - `srccontainer` -- source container entity
  - `destcontainer` -- destination container entity or nil
* **Returns:** None
* **Error states:** None

### `MoveItemFromHalfOfSlot(player, slot, srccontainer, destcontainer)`
* **Description:** Moves half items from container slot. Checks container opened by player. Calls container:MoveItemFromHalfOfSlot. Returns early if validation fails or container not opened by player.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- source slot (uint)
  - `srccontainer` -- source container entity
  - `destcontainer` -- destination container entity or nil
* **Returns:** None
* **Error states:** None

### `MoveItemFromCountOfSlot(player, slot, srccontainer, destcontainer, count)`
* **Description:** Moves specific count from container slot. Checks container opened by player. Calls container:MoveItemFromCountOfSlot. Returns early if validation fails or container not opened by player.
* **Parameters:**
  - `player` -- player entity
  - `slot` -- source slot (uint)
  - `srccontainer` -- source container entity
  - `destcontainer` -- destination container entity or nil
  - `count` -- count to move (uint)
* **Returns:** None
* **Error states:** None

### `MakeRecipeFromMenu(player, recipe, skin_index)`
* **Description:** Crafts recipe from menu. Looks up recipe by rpc_id in AllRecipes, calls builder:MakeRecipeFromMenu with optional skin. Returns early if recipe/skin_index not numbers or recipe not found.
* **Parameters:**
  - `player` -- player entity
  - `recipe` -- recipe RPC ID number
  - `skin_index` -- skin index number or nil
* **Returns:** None
* **Error states:** None

### `SetMovementPredictionEnabled(player, enabled)`
* **Description:** Toggles movement prediction. Calls playercontroller:OnRemoteToggleMovementPrediction. Returns early if enabled not boolean.
* **Parameters:**
  - `player` -- player entity
  - `enabled` -- boolean enable prediction
* **Returns:** None
* **Error states:** None

### `MakeRecipeAtPoint(player, recipe, x, z, rot, skin_index, platform, platform_relative)`
* **Description:** Crafts recipe at world position. Converts platform-relative positions, checks range and rotation. Looks up recipe by rpc_id, calls builder:MakeRecipeAtPoint. Returns early if validation fails or out of range.
* **Parameters:**
  - `player` -- player entity
  - `recipe` -- recipe RPC ID
  - `x` -- world X
  - `z` -- world Z
  - `rot` -- rotation
  - `skin_index` -- skin index or nil
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
* **Returns:** None
* **Error states:** None

### `BufferBuild(player, recipe)`
* **Description:** Buffers a build action. Looks up recipe by rpc_id in AllRecipes, calls builder:BufferBuild with recipe key. Returns early if recipe not number.
* **Parameters:**
  - `player` -- player entity
  - `recipe` -- recipe RPC ID number
* **Returns:** None
* **Error states:** None

### `CannotBuild(player, reason)`
* **Description:** Shows cannot build announcement. Gets localized string, says via talker component. Returns early if reason not string.
* **Parameters:**
  - `player` -- player entity
  - `reason` -- string reason code
* **Returns:** None
* **Error states:** None

### `WakeUp(player)`
* **Description:** Wakes player from sleeping. Checks playercontroller enabled, sleepingbag exists, sleeping state tag, bedroll/tent tags. Pushes `locomote` event.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None
* **Error states:** Errors if player.sg is nil (no nil guard before HasStateTag access)

### `exitgym(player)`
* **Description:** Exits gym mode. Checks playercontroller enabled, pushes `locomote` event.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `SetWriteableText(player, target, text)`
* **Description:** Sets text on writeable entity. Calls writeable:Write with player and text. Returns early if target not entity.
* **Parameters:**
  - `player` -- player entity
  - `target` -- writeable entity
  - `text` -- text string or nil
* **Returns:** None
* **Error states:** None

### `ToggleController(player, isattached)`
* **Description:** Toggles controller attachment state. Calls playercontroller:ToggleController. Returns early if isattached not boolean.
* **Parameters:**
  - `player` -- player entity
  - `isattached` -- boolean controller attached state
* **Returns:** None
* **Error states:** None

### `OpenGift(player)`
* **Description:** Opens next gift. Calls giftreceiver:OpenNextGift.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `ClosePopup(player, popupcode, mod_name, ...)`
* **Description:** Closes popup dialog. Gets popup from code, validates via validaterpcfn, calls popup:Close. Returns early if popupcode not uint or popup not found.
* **Parameters:**
  - `player` -- player entity that sent the RPC
  - `popupcode` -- popup code (uint)
  - `mod_name` -- mod namespace or nil
  - `...` -- variable arguments for validation
* **Returns:** None
* **Error states:** None

### `RecievePopupMessage(player, popupcode, mod_name, ...)`
* **Description:** Server-bound RPC: Receives popup message from client. Gets popup from code, calls popup:SendMessageToServer.
* **Parameters:**
  - `player` -- player entity
  - `popupcode` -- popup code (uint)
  - `mod_name` -- mod namespace or nil
  - `...` -- message arguments
* **Returns:** None
* **Error states:** None

### `RepeatHeldAction(player)`
* **Description:** Repeats currently held action. Calls playercontroller:RepeatHeldAction.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `ClearActionHold(player)`
* **Description:** Clears action hold state. Calls playercontroller:ClearActionHold.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None

### `GetChatHistory(player, last_message_hash, first_message_hash)`
* **Description:** Requests chat history. Sets sent_chat_history flag to prevent duplicate requests, calls ChatHistory:SendChatHistory. Returns early if hashes not uint.
* **Parameters:**
  - `player` -- player entity or userid
  - `last_message_hash` -- last message hash (uint)
  - `first_message_hash` -- first message hash (uint) or nil
* **Returns:** None
* **Error states:** None

### `DoActionOnMap(player, actioncode, x, z, maptarget, mod_name)`
* **Description:** Performs action on map. If actioncode provided, calls playercontroller:OnMapAction. If nil, pushes `cancelmaptarget` event on maptarget. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `actioncode` -- action code number or nil
  - `x` -- world X
  - `z` -- world Z
  - `maptarget` -- map target entity
  - `mod_name` -- mod namespace
* **Returns:** None
* **Error states:** None

### `SetSkillActivatedState(player, skill_rpc_id, isunlocked)`
* **Description:** Sets skill activation state. Gets skill name from TheSkillTree, calls skilltreeupdater:ActivateSkill if unlocked. DeactivateSkill is commented out for respec protection. Returns early if validation fails or skill not found.
* **Parameters:**
  - `player` -- player entity
  - `skill_rpc_id` -- skill RPC ID number
  - `isunlocked` -- boolean unlock state
* **Returns:** None
* **Error states:** None

### `AddSkillXP(player, amount)`
* **Description:** Adds skill XP. Calls skilltreeupdater:AddSkillXP. Returns early if amount not number.
* **Parameters:**
  - `player` -- player entity
  - `amount` -- XP amount number
* **Returns:** None
* **Error states:** None

### `PostActivateHandshake(player, state)`
* **Description:** Handles post-activate handshake. Calls player:OnPostActivateHandshake_Server. Returns early if state not uint.
* **Parameters:**
  - `player` -- player entity
  - `state` -- handshake state (uint)
* **Returns:** None
* **Error states:** None

### `OnScrapbookDataTaught(player, inst, response)`
* **Description:** Handles scrapbook data taught notification. Calls inst:OnScrapbookDataTaught if method exists. Returns early if inst not entity.
* **Parameters:**
  - `player` -- player entity
  - `inst` -- scrapbook instance entity
  - `response` -- response data
* **Returns:** None
* **Error states:** None

### `SetClientAuthoritativeSetting(player, variable, value)`
* **Description:** Sets client-authoritative setting. Calls player:SetClientAuthoritativeSetting. Validation happens in callback, not here.
* **Parameters:**
  - `player` -- player entity
  - `variable` -- setting variable name
  - `value` -- setting value
* **Returns:** None

### `AOECharging(player, rotation, startflag)`
* **Description:** Handles AOE charging input. Calls playercontroller:OnRemoteAOECharging. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `rotation` -- charging rotation number
  - `startflag` -- start flag (uint) or nil
* **Returns:** None
* **Error states:** None

### `DoubleTapAction(player, action, x, z, noforce, mod_name, platform, platform_relative)`
* **Description:** Handles double-tap action. Converts platform-relative positions, checks range, calls playercontroller:OnRemoteDoubleTapAction. Returns early if validation fails or out of range.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number
  - `x` -- world X
  - `z` -- world Z
  - `noforce` -- boolean skip force
  - `mod_name` -- mod namespace
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
* **Returns:** None
* **Error states:** None

### `WobyCommand(player, cmd)`
* **Description:** Executes Woby command. Checks woby_commands_classified exists, calls ExecuteCommand. Returns early if cmd not uint or woby_commands_classified missing.
* **Parameters:**
  - `player` -- player entity
  - `cmd` -- command ID (uint)
* **Returns:** None
* **Error states:** None

### `InteractionTarget(player, action, target)`
* **Description:** Handles interaction target selection. Calls playercontroller:OnRemoteInteractionTarget. Returns early if validation fails.
* **Parameters:**
  - `player` -- player entity
  - `action` -- action number or nil
  - `target` -- target entity or nil
* **Returns:** None
* **Error states:** None

### `PredictGallopTrip(player, x, z, dir, speed, platform, platform_relative)`
* **Description:** Predicts gallop trip for beefalo riding. Converts positions, validates rotation and speed, pushes `predict_gallop_trip` event immediately. Returns early if validation fails or out of range.
* **Parameters:**
  - `player` -- player entity
  - `x` -- world X
  - `z` -- world Z
  - `dir` -- direction number
  - `speed` -- speed number or nil
  - `platform` -- platform entity
  - `platform_relative` -- boolean platform-relative
* **Returns:** None
* **Error states:** None

### `UnplugModule(player, modulebartype_or_socketposition, moduleindex)`
* **Description:** Unplugs upgrade module or socket. If moduleindex provided, uses upgrademoduleowner with skill check. Otherwise uses socketholder with shadow socket skill check. Pushes `unplugmodule` event or calls TryToUnsocket. Returns early if validation fails or skill not activated.
* **Parameters:**
  - `player` -- player entity
  - `modulebartype_or_socketposition` -- module bar type or socket position number
  - `moduleindex` -- module index number or nil
* **Returns:** None
* **Error states:** None

### `StopUsingDrone(player)`
* **Description:** Stops using drone. Calls player:StopUsingDrone if method exists, otherwise logs invalid RPC.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None
* **Error states:** None

### `StopInspectingModules(player)`
* **Description:** Stops inspecting modules. Calls player:StopInspectingModules if method exists, otherwise logs invalid RPC.
* **Parameters:**
  - `player` -- player entity
* **Returns:** None
* **Error states:** None

### `ShowPopup(popupcode, mod_name, show, ...)`
* **Description:** Client RPC: Shows or hides popup. Gets popup from code, calls popup.fn with ThePlayer.
* **Parameters:**
  - `popupcode` -- popup code
  - `mod_name` -- mod namespace
  - `show` -- boolean show/hide
  - `...` -- popup arguments
* **Returns:** None

### `LearnRecipe(product, ...)`
* **Description:** Client RPC: Learns cookbook recipe. Gets ingredients from varargs, calls cookbookupdater:LearnRecipe.
* **Parameters:**
  - `product` -- recipe product name
  - `...` -- ingredient list
* **Returns:** None

### `LearnFoodStats(product)`
* **Description:** Client RPC: Learns food stats. Calls cookbookupdater:LearnFoodStats.
* **Parameters:**
  - `product` -- food product name
* **Returns:** None

### `LearnPlantStage(plant, stage)`
* **Description:** Client RPC: Learns plant growth stage. Calls plantregistryupdater:LearnPlantStage.
* **Parameters:**
  - `plant` -- plant prefab name
  - `stage` -- growth stage
* **Returns:** None

### `LearnFertilizerStage(fertilizer)`
* **Description:** Client RPC: Learns fertilizer. Calls plantregistryupdater:LearnFertilizer.
* **Parameters:**
  - `fertilizer` -- fertilizer prefab name
* **Returns:** None

### `TakeOversizedPicture(plant, weight, beardskin, beardlength)`
* **Description:** Client RPC: Takes oversized crop picture. Calls plantregistryupdater:TakeOversizedPicture.
* **Parameters:**
  - `plant` -- plant entity
  - `weight` -- crop weight
  - `beardskin` -- beard skin name
  - `beardlength` -- beard length
* **Returns:** None

### `RecieveChatHistory(chat_history)`
* **Description:** Client RPC: Receives chat history from server. Calls ChatHistory:RecieveChatHistory.
* **Parameters:**
  - `chat_history` -- chat history data table
* **Returns:** None

### `LearnBuilderRecipe(product)`
* **Description:** Client RPC: Learns builder recipe. Pushes `LearnBuilderRecipe` event on ThePlayer.
* **Parameters:**
  - `product` -- recipe product name
* **Returns:** None

### `UpdateAccomplishment(name)`
* **Description:** Client RPC: Sets accomplishment KV to `1`. Uses TheGenericKV:SetKV.
* **Parameters:**
  - `name` -- accomplishment key name
* **Returns:** None

### `UpdateCountAccomplishment(name, maxvalue)`
* **Description:** Client RPC: Increments count accomplishment. Gets current value, increments if below maxvalue. Uses TheGenericKV.
* **Parameters:**
  - `name` -- accomplishment key name
  - `maxvalue` -- maximum count value or nil
* **Returns:** None

### `SetSkillActivatedState(skill_rpc_id, isunlocked)`
* **Description:** Client RPC: Sets skill activation state. Gets skill name from TheSkillTree, calls skilltreeupdater:ActivateSkill if unlocked. DeactivateSkill is called if locked (unlike server version).
* **Parameters:**
  - `skill_rpc_id` -- skill RPC ID number
  - `isunlocked` -- boolean unlock state
* **Returns:** None

### `AddSkillXP(amount)`
* **Description:** Client RPC: Adds skill XP. Calls skilltreeupdater:AddSkillXP.
* **Parameters:**
  - `amount` -- XP amount number
* **Returns:** None

### `PostActivateHandshake(state)`
* **Description:** Client RPC: Handles post-activate handshake. Calls ThePlayer:OnPostActivateHandshake_Client.
* **Parameters:**
  - `state` -- handshake state
* **Returns:** None

### `RecievePopupMessage(popupcode, mod_name, ...)`
* **Description:** Client RPC: Receives popup message from server. Gets popup from code, calls popup:SendMessageToClient.
* **Parameters:**
  - `popupcode` -- popup code (uint)
  - `mod_name` -- mod namespace or nil
  - `...` -- message arguments
* **Returns:** None

### `TryToTeachScrapbookData(inst)`
* **Description:** Client RPC: Attempts to teach scrapbook data. Calls TheScrapbookPartitions:TryToTeachScrapbookData.
* **Parameters:**
  - `inst` -- scrapbook data instance
* **Returns:** None

### `ShardTransactionSteps(shardid, shardpayload_string)`
* **Description:** Shard RPC: Handles shard transaction steps. Deserializes payload via RunInSandboxSafe, validates shard ID match, calls shardtransactionsteps:OnShardTransactionSteps.
* **Parameters:**
  - `shardid` -- shard ID
  - `shardpayload_string` -- serialized payload string
* **Returns:** None

### `PruneShardTransactionSteps(shardid, newfinalizedid)`
* **Description:** Shard RPC: Prunes old shard transactions. Calls shardtransactionsteps:OnPruneShardTransactionSteps.
* **Parameters:**
  - `shardid` -- shard ID
  - `newfinalizedid` -- new finalized transaction ID
* **Returns:** None

### `ReskinWorldMigrator(shardid, migrator, skin_theme, skin_id, sessionid)`
* **Description:** Shard RPC: Reskins world migrator portal. Iterates ShardPortals, matches by worldmigrator.id, calls TheSim:ReskinEntity.
* **Parameters:**
  - `shardid` -- shard ID
  - `migrator` -- worldmigrator ID
  - `skin_theme` -- skin theme string
  - `skin_id` -- skin ID
  - `sessionid` -- session ID
* **Returns:** None

### `SyncWorldSettings(shardid, options_string)`
* **Description:** Shard RPC: Syncs world settings from master shard. Deserializes options, applies via WorldSettings_Overrides.Sync/Pre/Post functions.
* **Parameters:**
  - `shardid` -- shard ID
  - `options_string` -- serialized settings string
* **Returns:** None

### `ResyncWorldSettings(shardid)`
* **Description:** Shard RPC: Requests world settings resync. Calls Shard_SyncWorldSettings.
* **Parameters:**
  - `shardid` -- shard ID
* **Returns:** None

### `SyncWorldStateTag(shardid, namespace, tag, enabled)`
* **Description:** Shard RPC: Syncs world state tag. Gets tag object from namespace, calls SetTagEnabled.
* **Parameters:**
  - `shardid` -- shard ID
  - `namespace` -- world state tag namespace
  - `tag` -- tag name
  - `enabled` -- boolean enable state
* **Returns:** None

### `SyncBossDefeated(shardid, bossprefab)`
* **Description:** Shard RPC: Syncs boss defeated state. Calls Shard_SyncBossDefeated.
* **Parameters:**
  - `shardid` -- shard ID
  - `bossprefab` -- boss prefab name
* **Returns:** None

### `SyncMermKingExists(shardid, exists)`
* **Description:** Shard RPC: Syncs Merm King existence. Calls Shard_SyncMermKingExists.
* **Parameters:**
  - `shardid` -- shard ID
  - `exists` -- boolean exists state
* **Returns:** None

### `SyncMermKingTrident(shardid, exists)`
* **Description:** Shard RPC: Syncs Merm King trident state. Calls Shard_SyncMermKingTrident.
* **Parameters:**
  - `shardid` -- shard ID
  - `exists` -- boolean trident exists
* **Returns:** None

### `SyncMermKingCrown(shardid, exists)`
* **Description:** Shard RPC: Syncs Merm King crown state. Calls Shard_SyncMermKingCrown.
* **Parameters:**
  - `shardid` -- shard ID
  - `exists` -- boolean crown exists
* **Returns:** None

### `SyncMermKingPauldron(shardid, exists)`
* **Description:** Shard RPC: Syncs Merm King pauldron state. Calls Shard_SyncMermKingPauldron.
* **Parameters:**
  - `shardid` -- shard ID
  - `exists` -- boolean pauldron exists
* **Returns:** None

### `SendRPCToServer(code, ...)`
* **Description:** Sends RPC to server. Asserts RPC code exists in RPC_HANDLERS, calls TheNet:SendRPCToServer.
* **Parameters:**
  - `code` -- RPC code number
  - `...` -- RPC arguments
* **Returns:** None
* **Error states:** Asserts if code not in RPC_HANDLERS

### `SendRPCToClient(code, ...)`
* **Description:** Sends RPC to client(s). users parameter can be nil (all), userid (single), or table (list). Asserts code exists, calls TheNet:SendRPCToClient.
* **Parameters:**
  - `code` -- RPC code number
  - `...` -- RPC arguments
* **Returns:** None
* **Error states:** Asserts if code not in CLIENT_RPC_HANDLERS

### `SendRPCToShard(code, ...)`
* **Description:** Sends RPC to shard(s). shards parameter can be nil (all), shardid (single), or table (list). Asserts code exists, calls TheNet:SendRPCToShard.
* **Parameters:**
  - `code` -- RPC code number
  - `...` -- RPC arguments
* **Returns:** None
* **Error states:** Asserts if code not in SHARD_RPC_HANDLERS

### `HandleRPC(sender, tick, code, data)`
* **Description:** Handles incoming server-bound RPC. Validates sender type, applies rate limiting, queues RPC for execution.
* **Parameters:**
  - `sender` -- player entity or userid
  - `tick` -- simulation tick
  - `code` -- RPC code
  - `data` -- RPC data
* **Returns:** None

### `HandleClientRPC(tick, code, data)`
* **Description:** Handles incoming client-bound RPC. Returns early if ThePlayer nil, queues valid RPCs.
* **Parameters:**
  - `tick` -- simulation tick
  - `code` -- RPC code
  - `data` -- RPC data
* **Returns:** None

### `HandleShardRPC(sender, tick, code, data)`
* **Description:** Handles incoming shard-bound RPC. Queues valid RPCs for execution.
* **Parameters:**
  - `sender` -- sender shard ID
  - `tick` -- simulation tick
  - `code` -- RPC code
  - `data` -- RPC data
* **Returns:** None

### `HandleRPCQueue()`
* **Description:** Processes queued RPCs for server, client, and shard. Applies rate limiting, timeline checks, invokes via TheNet:CallRPC/CallClientRPC/CallShardRPC. Re-queues pending RPCs.
* **Parameters:** None
* **Returns:** None

### `TickRPCQueue()`
* **Description:** Resets RPC timeline trackers at start of new tick. Clears RPC_Timeline, RPC_Client_Timeline, RPC_Shard_Timeline.
* **Parameters:** None
* **Returns:** None

### `AddModRPCHandler(namespace, name, fn)`
* **Description:** Registers mod RPC handler. Creates namespace tables if needed, increments RPC_QUEUE_RATE_LIMIT, stores handler with metadata.
* **Parameters:**
  - `namespace` -- mod namespace string
  - `name` -- RPC name
  - `fn` -- handler function
* **Returns:** None

### `AddClientModRPCHandler(namespace, name, fn)`
* **Description:** Registers client mod RPC handler. Creates namespace tables if needed, stores handler with metadata.
* **Parameters:**
  - `namespace` -- mod namespace string
  - `name` -- RPC name
  - `fn` -- handler function
* **Returns:** None

### `AddShardModRPCHandler(namespace, name, fn)`
* **Description:** Registers shard mod RPC handler. Creates namespace tables if needed, stores handler with metadata.
* **Parameters:**
  - `namespace` -- mod namespace string
  - `name` -- RPC name
  - `fn` -- handler function
* **Returns:** None

### `SendModRPCToServer(id_table, ...)`
* **Description:** Sends mod RPC to server. Asserts id_table valid, calls TheNet:SendModRPCToServer.
* **Parameters:**
  - `id_table` -- mod RPC ID table with namespace and id
  - `...` -- RPC arguments
* **Returns:** None
* **Error states:** Asserts if id_table invalid

### `SendModRPCToClient(id_table, ...)`
* **Description:** Sends mod RPC to client. Asserts id_table valid, calls TheNet:SendModRPCToClient.
* **Parameters:**
  - `id_table` -- mod RPC ID table
  - `...` -- RPC arguments
* **Returns:** None
* **Error states:** Asserts if id_table invalid

### `SendModRPCToShard(id_table, ...)`
* **Description:** Sends mod RPC to shard. Asserts id_table valid, calls TheNet:SendModRPCToShard.
* **Parameters:**
  - `id_table` -- mod RPC ID table
  - `...` -- RPC arguments
* **Returns:** None
* **Error states:** Asserts if id_table invalid

### `HandleModRPC(sender, tick, namespace, code, data)`
* **Description:** Handles incoming mod RPC. Validates namespace, sender, applies rate limiting, queues for execution.
* **Parameters:**
  - `sender` -- player entity or userid
  - `tick` -- simulation tick
  - `namespace` -- mod namespace
  - `code` -- RPC code
  - `data` -- RPC data
* **Returns:** None

### `HandleClientModRPC(tick, namespace, code, data)`
* **Description:** Handles incoming client mod RPC. Validates namespace, queues for execution.
* **Parameters:**
  - `tick` -- simulation tick
  - `namespace` -- mod namespace
  - `code` -- RPC code
  - `data` -- RPC data
* **Returns:** None

### `HandleShardModRPC(sender, tick, namespace, code, data)`
* **Description:** Handles incoming shard mod RPC. Validates namespace, queues for execution.
* **Parameters:**
  - `sender` -- sender shard ID
  - `tick` -- simulation tick
  - `namespace` -- mod namespace
  - `code` -- RPC code
  - `data` -- RPC data
* **Returns:** None

### `GetModRPCHandler(namespace, name)`
* **Description:** Gets mod RPC handler function by namespace and name.
* **Parameters:**
  - `namespace` -- mod namespace
  - `name` -- RPC name
* **Returns:** function or nil

### `GetClientModRPCHandler(namespace, name)`
* **Description:** Gets client mod RPC handler function by namespace and name.
* **Parameters:**
  - `namespace` -- mod namespace
  - `name` -- RPC name
* **Returns:** function or nil

### `GetShardModRPCHandler(namespace, name)`
* **Description:** Gets shard mod RPC handler function by namespace and name.
* **Parameters:**
  - `namespace` -- mod namespace
  - `name` -- RPC name
* **Returns:** function or nil

### `GetModRPC(namespace, name)`
* **Description:** Gets mod RPC ID table by namespace and name.
* **Parameters:**
  - `namespace` -- mod namespace
  - `name` -- RPC name
* **Returns:** table or nil

### `GetClientModRPC(namespace, name)`
* **Description:** Gets client mod RPC ID table by namespace and name.
* **Parameters:**
  - `namespace` -- mod namespace
  - `name` -- RPC name
* **Returns:** table or nil

### `GetShardModRPC(namespace, name)`
* **Description:** Gets shard mod RPC ID table by namespace and name.
* **Parameters:**
  - `namespace` -- mod namespace
  - `name` -- RPC name
* **Returns:** table or nil

### `MarkUserIDRPC(namespace, name)`
* **Description:** Marks RPC as requiring userid sender (not player entity). If namespace nil, treats name as standard RPC name.
* **Parameters:**
  - `namespace` -- mod namespace or nil
  - `name` -- RPC name
* **Returns:** None

### `DisableRPCSending()`
* **Description:** Disables all RPC sending functions for world reset/regeneration. Replaces SendRPCToServer/Client/Shard with no-op functions.
* **Parameters:** None
* **Returns:** None

### `__index_lower(t, k)`
* **Description:** Metamethod for case-insensitive table indexing. Returns rawget(t, string.lower(k)).
* **Parameters:**
  - `t` -- table
  - `k` -- key
* **Returns:** value

### `__newindex_lower(t, k, v)`
* **Description:** Metamethod for case-insensitive table assignment. Sets rawset(t, string.lower(k), v).
* **Parameters:**
  - `t` -- table
  - `k` -- key
  - `v` -- value
* **Returns:** None

### `setmetadata(tab)`
* **Description:** Sets case-insensitive metatable on table using __index_lower and __newindex_lower.
* **Parameters:**
  - `tab` -- table to set metatable on
* **Returns:** None

## Events & listeners

**Pushes:**
- `invalidrpc` — Pushed when player sends invalid RPC; data: `{player, rpcname}`
- `locomote` — Pushed on player when waking from sleep or exiting gym
- `LearnBuilderRecipe` — Pushed on ThePlayer when client learns recipe; data: `{recipe}`
- `predict_gallop_trip` — Pushed immediately for beefalo gallop prediction; data: `{x, z, dir, speed}`
- `unplugmodule` — Pushed when module unplugged; data: module entity
- `cancelmaptarget` — Pushed on maptarget when DoActionOnMap called with nil actioncode