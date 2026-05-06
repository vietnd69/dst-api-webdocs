---
id: entityscript
title: Entityscript
description: Core entity wrapper class that manages component lifecycle, network replication, event handling, task scheduling, and entity state synchronization for all game entities.
tags: [entity, core, components, lifecycle, network]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: root
source_hash: eb3345c7
system_scope: entity
---

# Entityscript

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`entityscript.lua` defines the `EntityScript` class, which serves as the foundational wrapper for all entities in Don't Starve Together. This class manages the complete entity lifecycle including component attachment and removal (e.g., `inventory`, `health`, `locomotor`, `debuffable`), network replication synchronization, event listening and pushing, task scheduling, brain and stategraph control, and persistence data handling. Every entity in the game inherits this class, making it the central hub for entity behavior, state management, and cross-network communication between server and clients.

## Usage example
```lua
-- EntityScript is automatically attached to all entities via the engine
-- Access entityscript methods through the entity instance directly

local inst = SpawnPrefab("torches")

-- Add and remove tags
inst:AddTag("custom_tag")
inst:RemoveTag("custom_tag")
inst:HasTag("player")

-- Component management
inst:AddComponent("health")
inst:AddComponent("inventoryitem")
inst:RemoveComponent("health")

-- Event handling
inst:ListenForEvent("onremove", function() print("Entity removed") end)
inst:PushEvent("custom_event", { data = "value" })

-- Task scheduling
inst:DoTaskInTime(5, function() print("Delayed task") end)
inst:DoPeriodicTask(10, function() print("Repeating task") end)

-- Position and rotation
local pos = inst:GetPosition()
local rot = inst:GetRotation()
inst:FacePoint(pos.x, pos.y, pos.z)

-- Limbo state management
inst:RemoveFromScene()
inst:ReturnToScene()
```

## Dependencies & tags
**External dependencies:**
- `class` -- Required for Class() constructor system
- `entityreplica` -- Required for network replica component methods
- `componentactions` -- Required for action registration methods
- `entityscriptproxy` -- Required module for entity script proxy functionality

**Components used:**
- `walkableplatform` -- Accessed for GetUID in platform-relative position saving
- `worldstate` -- Accessed via TheWorld.components.worldstate for AddWatcher/RemoveWatcher
- `inventoryitem` -- Checked for wetness and acid state via replica or direct access
- `temp_moisture` -- Checked as fallback for moisture percentage
- `moisture` -- Checked as fallback for moisture percentage
- `hull` -- Accessed via boat.components.hull:GetRadius() for boat intersection
- `playercontroller` -- Called RemoteBufferedAction in PerformPreviewBufferedAction
- `locomotor` -- Accessed for bufferedaction fallback
- `debuffable` -- Used for debuff management functions
- `deathloothandler` -- Used for death loot handling functions
- `lootdropper` -- Used in DropDeathLoot to generate and drop loot
- `health` -- Checked for is_corpsing state
- `lightwatcher` -- Used for light level checking
- `physics` -- Accessed for radius and position data
- `equippable` -- Accessed for equip slot information

**Tags:**
- `INLIMBO` -- add/remove when entity enters/exits limbo state
- `player` -- check for player-specific behavior
- `smolder` -- check for smoldering state
- `diseased` -- check for disease state
- `rotten` -- check for rotten state
- `withered` -- check for withered state
- `waxedplant` -- check for waxed plant state
- `wet` -- check for wet state
- `moistureimmunity` -- check for moisture immunity
- `rainimmunity` -- check for rain immunity
- `swimming` -- check for swimming state
- `likewateroffducksback` -- check for water immunity
- `broken` -- check for broken state
- `deadcreature` -- check for dead creature state
- `acidrainimmune` -- check for acid rain immunity
- `terraformblocker` -- add/remove for terraform spacing
- `groundtargetblocker` -- add/remove for ground target blocking
- `idle` -- check for idle state
- `critter` -- check for critter state
- `trait_*` -- check for various trait tags
- `small_livestock` -- check for small livestock state
- `sickness` -- check for sickness state
- `stale` -- check for stale state
- `spoiled` -- check for spoiled state
- `frozen` -- check for frozen state
- `*_tool` -- check for tool type tags

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `entity` | Entity | parameter value | The underlying entity instance that this EntityScript wraps. |
| `components` | table | `{}` | Table storing all components attached to this entity, keyed by component name. |
| `lower_components_shadow` | table | `{}` | Shadow table for case-insensitive component name lookups to prevent duplicate additions. |
| `GUID` | number | `entity:GetGUID()` | Unique identifier for this entity instance. |
| `spawntime` | number | `GetTime()` | Game time when this entity was spawned, used for age calculations. |
| `sleepstatepending` | boolean | `true` | Flag indicating whether initial sleep state has been received from engine. |
| `persists` | boolean | `true` | Whether this entity should be saved in world state. |
| `inlimbo` | boolean | `false` | Whether the entity is currently in limbo state (removed from active scene). |
| `name` | string | `nil` | Custom name override for this entity. |
| `data` | table | `nil` | Generic data storage table for entity-specific information. |
| `listeners` | table | `nil` | Event listener registration table. |
| `updatecomponents` | table | `nil` | Table of components that receive OnUpdate calls each frame. |
| `updatestaticcomponents` | table | `nil` | Table of components that receive static updates. |
| `actioncomponents` | table | `{}` | Components that provide player actions for this entity. |
| `inherentactions` | table | `nil` | Actions this entity can perform inherently without components. |
| `inherentsceneaction` | any | `nil` | Default scene action for this entity. |
| `inherentscenealtaction` | any | `nil` | Alternate scene action for this entity. |
| `event_listeners` | table | `nil` | Internal event listener tracking. |
| `event_listening` | table | `nil` | Events this entity is currently listening to. |
| `worldstatewatching` | table | `nil` | World state variables this entity is watching for changes. |
| `pendingtasks` | table | `nil` | Scheduled tasks pending execution. |
| `children` | table | `nil` | Child entities attached to this entity. |
| `platformfollowers` | table | `nil` | Entities following this entity's platform movement. |
| `actionreplica` | table | `nil` | Network replica container for action-related state synchronization. |
| `replica` | table | `{ _ = {}, inst = self }` | Container for network-replicated component proxies with custom metatable accessor. |

## Main functions

### `event_server_data(eventname, path)`
* **Description:** Module-level utility function (not an EntityScript method) that loads and caches event server files, attaching component watcher methods if path starts with components/.
* **Parameters:**
  - `eventname` -- Event name used to construct the path prefix.
  - `path` -- Relative path within the event server directory.
* **Returns:** Event server file module table
* **Error states:** Errors if requireeventfile fails to load the specified path.

### `Entity:AddNetwork()`
* **Description:** Monkey-patched Entity class method (not EntityScript) that initializes actionreplica netvars and registers client-side dirty event listeners for network synchronization. Defined in entityscript.lua but applies to Entity class.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** Errors if ModManager:GetServerModsNames() is unavailable or if net_bytearray/net_byte constructors fail.

### `EntityScript:GetSaveRecord()`
* **Description:** Generates a save record containing prefab name, position (world or platform-relative), age, skin data, and persist data for world serialization.
* **Parameters:** None
* **Returns:** record (table), references (table or nil)
* **Error states:** Errors in non-PRODUCTION configuration if position values are NaN/inf; may print error in production.

### `EntityScript:Hide()`
* **Description:** Hides the entity's visual representation without removing from scene.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** Errors if self.entity:Hide is unavailable.

### `EntityScript:Show()`
* **Description:** Shows the entity's visual representation.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** Errors if self.entity:Show is unavailable.

### `EntityScript:StackableSkinHack(target)`
* **Description:** Compares skin builds between this entity and target for stacking compatibility. Returns true if either entity lacks an AnimState.
* **Parameters:** `target` -- Target entity to compare skin build with.
* **Returns:** boolean (true if skin builds match or AnimState is nil)
* **Error states:** None - returns true early if either AnimState is nil.

### `EntityScript:IsInLimbo()`
* **Description:** Returns whether entity is currently in limbo state (faster than tag check, valid only on mastersim).
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

### `EntityScript:ForceOutOfLimbo(state)`
* **Description:** Forces entity out of limbo state regardless of normal conditions, storing override in forcedoutoflimbo.
* **Parameters:** `state` -- Boolean to force out of limbo, or nil to clear override.
* **Returns:** `nil`
* **Error states:** Errors if self.entity:SetInLimbo is unavailable.

### `EntityScript:RemoveFromScene()`
* **Description:** Removes entity from active scene by adding INLIMBO tag, hiding, disabling brain/physics/light/anim/shadow/minimap, and pushing enterlimbo event.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None

### `EntityScript:ReturnToScene()`
* **Description:** Returns entity to active scene by removing INLIMBO tag, showing, re-enabling components, restarting brain/stategraph, and pushing exitlimbo event.
* **Parameters:** None
* **Returns:** `nil`
* **Error states:** None

### `EntityScript:__tostring()`
* **Description:** Returns string representation showing GUID, prefab name, and limbo status.
* **Parameters:** None
* **Returns:** string
* **Error states:** None

### `EntityScript:AddInherentAction(act)`
* **Description:** Adds an action to inherentactions table and serializes to network replica.
* **Parameters:** `act` -- Action table from ACTIONS to add as inherent.
* **Returns:** `nil`
* **Error states:** None

### `EntityScript:RemoveInherentAction(act)`
* **Description:** Removes an action from inherentactions table, cleans up if empty, and serializes to network replica.
* **Parameters:** `act` -- Action table to remove from inherentactions.
* **Returns:** `nil`
* **Error states:** None

### `EntityScript:GetTimeAlive()`
* **Description:** Returns the time in seconds since this entity was spawned.
* **Parameters:** None
* **Returns:** number (seconds)
* **Error states:** Errors if GetTime() global is unavailable.

### `EntityScript:StartUpdatingComponent(cmp, do_static_update)`
* **Description:** Registers a component for per-frame OnUpdate calls, adding entity to updating ents tables if not already updating.
* **Parameters:**
  - `cmp` -- Component instance to start updating.
  - `do_static_update` -- Boolean to also add to static update list.
* **Returns:** `nil`
* **Error states:** Returns early if entity is not valid; errors if global updating ents tables are unavailable.

### `EntityScript:StopUpdatingComponent(cmp)`
* **Description:** Marks a component for deferred removal from update lists via StopUpdatingComponents table.
* **Parameters:** `cmp` -- Component instance to stop updating.
* **Returns:** `nil`
* **Error states:** None

### `EntityScript:StopUpdatingComponent_Deferred(cmp)`
* **Description:** Actually removes component from update lists and cleans up entity from updating ents tables if no components remain.
* **Parameters:** `cmp` -- Component instance to remove from update lists.
* **Returns:** `nil`
* **Error states:** Errors if global updating ents tables are unavailable when cleanup is needed.

### `EntityScript:StartWallUpdatingComponent(cmp)`
* **Description:** Registers a component for wall-specific update calls, adding entity to wall updating ents tables.
* **Parameters:** `cmp` -- Component instance to start wall updating.
* **Returns:** `nil`
* **Error states:** Returns early if entity is not valid; errors if global wall updating ents tables are unavailable.

### `EntityScript:StopWallUpdatingComponent(cmp)`
* **Description:** Removes component from wall update list and cleans up entity from wall updating ents tables if empty.
* **Parameters:** `cmp` -- Component instance to stop wall updating.
* **Returns:** `nil`
* **Error states:** Errors if global wall updating ents tables are unavailable when cleanup is needed.

### `EntityScript:GetComponentName(cmp)`
* **Description:** Returns the component name string for a given component instance by searching self.components.
* **Parameters:** `cmp` -- Component instance to find name for.
* **Returns:** string (component name) or 'component' if not found
* **Error states:** None

### `EntityScript:AddTag(tag)`
* **Description:** Adds a tag to the underlying entity via self.entity:AddTag.
* **Parameters:** `tag` -- Tag string to add to entity.
* **Returns:** `nil`
* **Error states:** Errors if self.entity:AddTag is unavailable.

### `EntityScript:RemoveTag(tag)`
* **Description:** Removes a tag from the underlying entity via self.entity:RemoveTag.
* **Parameters:** `tag` -- Tag string to remove from entity.
* **Returns:** `nil`
* **Error states:** Errors if self.entity:RemoveTag is unavailable.

### `EntityScript:AddOrRemoveTag(tag, condition)`
* **Description:** Conditionally adds or removes a tag based on boolean condition.
* **Parameters:**
  - `tag` -- Tag string to add or remove.
  - `condition` -- Boolean - if true adds tag, if false removes tag.
* **Returns:** `nil`
* **Error states:** Errors if self.entity:AddTag or self.entity:RemoveTag is unavailable.

### `EntityScript:HasTag(tag)`
* **Description:** Checks if entity has a specific tag via self.entity:HasTag.
* **Parameters:** `tag` -- Tag string to check for.
* **Returns:** boolean
* **Error states:** Errors if self.entity:HasTag is unavailable.

### `EntityScript:HasTags(...)`
* **Description:** Checks if entity has all specified tags, accepting either a table or varargs.
* **Parameters:** `...` -- Variable arguments - either a table of tags or multiple tag strings.
* **Returns:** boolean
* **Error states:** Errors if self.entity:HasAllTags is unavailable.

### `EntityScript:HasOneOfTags(...)`
* **Description:** Checks if entity has any of the specified tags, accepting either a table or varargs.
* **Parameters:** `...` -- Variable arguments - either a table of tags or multiple tag strings.
* **Returns:** boolean
* **Error states:** Errors if self.entity:HasAnyTag is unavailable.

### `EntityScript:AddComponent(name)`
* **Description:** Loads component module, instantiates it with self, stores in components table, registers actions, and runs mod post-init functions.
* **Parameters:** `name` -- Component name string to add to this entity.
* **Returns:** Component instance
* **Error states:** Errors if component does not exist or LoadComponent returns nil; may error if ReplicateComponent or RegisterComponentActions unavailable.

### `EntityScript:RemoveComponent(name)`
* **Description:** Stops updating, removes from components table, calls OnRemoveFromEntity if present, and unregisters replication and actions.
* **Parameters:** `name` -- Component name string to remove from this entity.
* **Returns:** `nil`
* **Error states:** None - silently returns if component does not exist.

### `EntityScript:GetBasicDisplayName()`
* **Description:** Returns the base display name from displaynamefn, nameoverride, filtered name, or self.name in priority order.
* **Parameters:** None
* **Returns:** string or nil
* **Error states:** Errors if STRINGS.NAMES or ApplyLocalWordFilter is unavailable when needed.

### `EntityScript:GetAdjectivedName()`
* **Description:** Returns display name with adjective prefixes based on entity tags (smolder, diseased, rotten, withered, wet, broken, deadcreature, etc.).
* **Parameters:** None
* **Returns:** string
* **Error states:** Errors if STRINGS tables, ConstructAdjectivedName, FOODTYPE, FUELTYPE, or EQUIPSLOTS are unavailable.

### `EntityScript:GetDisplayName()`
* **Description:** Returns full display name with optional prefab-specific detail extension from STRINGS.NAME_DETAIL_EXTENTION.
* **Parameters:** None
* **Returns:** string
* **Error states:** Errors if STRINGS.NAME_DETAIL_EXTENTION is unavailable when prefab has extension.

### `EntityScript:GetWetMultiplier()`
* **Description:** Returns moisture multiplier (0-1) based on wet tags, moistureimmunity, inventoryitem wetness, or world rain state.
* **Parameters:** None
* **Returns:** number (0 or 1) or nil
* **Error states:** Errors if TheWorld.state, components.inventoryitem/temp_moisture/moisture, or tag checks are unavailable.

### `EntityScript:GetIsWet()`
* **Description:** Returns boolean indicating if entity is wet, checking tags, replica components, or world rain state (client-safe).
* **Parameters:** None
* **Returns:** boolean
* **Error states:** Errors if replica.inventoryitem/moisture or TheWorld.state is unavailable when needed.

### `EntityScript:IsAcidSizzling()`
* **Description:** Returns boolean indicating if entity is affected by acid rain, checking immunity tag, replica, or player_classified (client-safe).
* **Parameters:** None
* **Returns:** boolean
* **Error states:** Errors if replica.inventoryitem or player_classified.isacidsizzling is unavailable when needed.

### `EntityScript:GetSkinBuild()`
* **Description:** Returns cached skin build name, computing via GetBuildForItem if not already cached.
* **Parameters:** None
* **Returns:** string
* **Error states:** Errors if GetBuildForItem is unavailable and skin_build_name is nil.

### `EntityScript:GetSkinName()`
* **Description:** Returns override_skinname if set, otherwise returns skinname.
* **Parameters:** None
* **Returns:** string or nil
* **Error states:** None

### `EntityScript:SetPrefabName(name)`
* **Description:** Sets the prefab name on both EntityScript and underlying entity, updating self.name from STRINGS.NAMES if not already set.
* **Parameters:** `name` -- New prefab name string to set.
* **Returns:** `nil`
* **Error states:** Errors if self.entity:SetPrefabName or STRINGS.NAMES is unavailable.

### `EntityScript:SetPrefabNameOverride(nameoverride)`
* **Description:** Sets nameoverride to change display name/description without changing actual prefab (e.g., spiderhole_rock uses spiderhole strings).
* **Parameters:** `nameoverride` -- Prefab name to use for display name and description lookup.
* **Returns:** `nil`
* **Error states:** None

### `EntityScript:SetDeployExtraSpacing(spacing)`
* **Description:** Sets deploy_extra_spacing and registers with TheWorld.Map if spacing is not nil.
* **Parameters:** `spacing` -- Extra spacing value for deployment, or nil to clear.
* **Returns:** `nil`
* **Error states:** Errors if TheWorld.Map:RegisterDeployExtraSpacing is unavailable when spacing is not nil.

### `EntityScript:SetDeploySmartRadius(radius)`
* **Description:** Sets the smart radius for deploy spacing and registers it with TheWorld.Map if radius is provided.
* **Parameters:** `radius` -- number -- smart radius value for deploy spacing calculation
* **Returns:** None
* **Error states:** None

### `EntityScript:SetTerraformExtraSpacing(spacing)`
* **Description:** Sets extra terraform spacing and adds or removes the terraformblocker tag accordingly. Registers spacing with TheWorld.Map.
* **Parameters:** `spacing` -- number or nil -- extra spacing around entity that cannot be terraformed
* **Returns:** None
* **Error states:** None

### `EntityScript:SetGroundTargetBlockerRadius(radius)`
* **Description:** Sets ground target blocker radius and adds or removes the groundtargetblocker tag. Registers with TheWorld.Map.
* **Parameters:** `radius` -- number or nil -- radius for ground target blocking
* **Returns:** None
* **Error states:** None

### `EntityScript:SpawnChild(name)`
* **Description:** Spawns a child entity either from registered prefabs table or directly by prefab name, then adds it as a child.
* **Parameters:** `name` -- string -- prefab name or registered child key to spawn
* **Returns:** Entity instance of spawned child
* **Error states:** Asserts if prefabs table exists but name not found, or if SpawnPrefab fails

### `EntityScript:RemoveChild(child)`
* **Description:** Removes a child entity by clearing parent reference and removing from children table.
* **Parameters:** `child` -- Entity -- child entity to remove
* **Returns:** None
* **Error states:** None

### `EntityScript:AddChild(child)`
* **Description:** Adds an entity as a child, removing it from any existing parent first.
* **Parameters:** `child` -- Entity -- entity to add as child
* **Returns:** None
* **Error states:** None

### `EntityScript:RemovePlatformFollower(child)`
* **Description:** Removes a platform follower if it belongs to this entity, clears platform reference, and calls OnRemovePlatformFollower callback if defined.
* **Parameters:** `child` -- Entity -- platform follower to remove
* **Returns:** None
* **Error states:** None

### `EntityScript:AddPlatformFollower(child)`
* **Description:** Adds an entity as a platform follower, removing it from any existing platform first, and calls OnAddPlatformFollower callback if defined.
* **Parameters:** `child` -- Entity -- entity to add as platform follower
* **Returns:** None
* **Error states:** None

### `EntityScript:GetPlatformFollowers()`
* **Description:** Returns the table of platform followers. Only works on master sim.
* **Parameters:** None
* **Returns:** table of platform follower entities or nil
* **Error states:** None

### `EntityScript:GetBrainString()`
* **Description:** Returns a debug string representation of the entity's brain if one exists.
* **Parameters:** None
* **Returns:** string -- brain debug info or empty string
* **Error states:** None

### `EntityScript:GetDebugString()`
* **Description:** Returns comprehensive debug information including entity validity, age, buffered action, stategraph, and component debug strings.
* **Parameters:** None
* **Returns:** string -- debug information
* **Error states:** None

### `EntityScript:KillTasks()`
* **Description:** Kills all threads associated with this entity's GUID.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:StartThread(fn)`
* **Description:** Starts a new thread/coroutine associated with this entity's GUID.
* **Parameters:** `fn` -- function -- coroutine function to start
* **Returns:** thread reference
* **Error states:** None

### `EntityScript:RunScript(name)`
* **Description:** Loads and executes a script file, passing self as parameter.
* **Parameters:** `name` -- string -- script file name to load and run
* **Returns:** None
* **Error states:** Errors if LoadScript fails to return a valid function

### `EntityScript:RestartBrain(reason)`
* **Description:** Restarts the brain if it was stopped for the given reason and no other stop reasons remain.
* **Parameters:** `reason` -- string or nil -- reason identifier for brain restart
* **Returns:** None
* **Error states:** None

### `EntityScript:StopBrain(reason)`
* **Description:** Stops the brain with a reason identifier. Brain can be restarted when all reasons are cleared.
* **Parameters:** `reason` -- string or nil -- reason identifier for stopping brain
* **Returns:** None
* **Error states:** None

### `EntityScript:SetBrain(brainfn)`
* **Description:** Sets the brain function and initializes the brain if not disabled due to sleep, limbo, or construction state.
* **Parameters:** `brainfn` -- function or nil -- brain constructor function
* **Returns:** None
* **Error states:** None

### `EntityScript:_DisableBrain_Internal()`
* **Description:** Internal function to disable brain when entity sleeps or is removed from scene. Should only be called from OnEntitySleep or RemoveFromScene.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:_EnableBrain_Internal()`
* **Description:** Internal function to re-enable brain when entity wakes or returns to scene. Should only be called from OnEntityWake or ReturnToScene.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:SetStateGraph(name)`
* **Description:** Loads and sets a stategraph for this entity, removing any existing stategraph first.
* **Parameters:**
  - `name` -- string -- stategraph name to load
* **Returns:** StateGraphInstance or nil
* **Error states:** Asserts if LoadStateGraph returns nil

### `EntityScript:ClearStateGraph()`
* **Description:** Removes and clears the current stategraph from this entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:ListenForEvent(event, fn, source)`
* **Description:** Registers an event listener on source entity, storing bidirectional references for cleanup.
* **Parameters:**
  - `event` -- string -- event name to listen for
  - `fn` -- function -- callback function when event fires
  - `source` -- Entity or nil -- source entity to listen on (defaults to self)
* **Returns:** None
* **Error states:** None

### `EntityScript:RemoveEventCallback(event, fn, source)`
* **Description:** Removes a specific event callback from the listener tables.
* **Parameters:**
  - `event` -- string -- event name
  - `fn` -- function -- callback function to remove
  - `source` -- Entity or nil -- source entity (defaults to self)
* **Returns:** None
* **Error states:** Asserts if fn is not a function type

### `EntityScript:RemoveAllEventCallbacks()`
* **Description:** Removes all event callbacks, cleaning up both listening and broadcast references.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:WatchWorldState(var, fn)`
* **Description:** Registers a watcher on a world state variable through TheWorld.components.worldstate.
* **Parameters:**
  - `var` -- string -- world state variable name
  - `fn` -- function -- callback when variable changes
* **Returns:** None
* **Error states:** None

### `EntityScript:StopWatchingWorldState(var, fn)`
* **Description:** Removes a specific world state watcher.
* **Parameters:**
  - `var` -- string -- world state variable name
  - `fn` -- function -- callback to remove
* **Returns:** None
* **Error states:** None

### `EntityScript:StopAllWatchingWorldStates()`
* **Description:** Removes all world state watchers for this entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:PushEvent_Internal(event, data, immediate)`
* **Description:** Internal event pushing that notifies listeners, stategraph, and brain.
* **Parameters:**
  - `event` -- string -- event name to push
  - `data` -- table or nil -- event data
  - `immediate` -- boolean -- whether to handle immediately
* **Returns:** None
* **Error states:** None

### `EntityScript:PushEvent(event, data)`
* **Description:** Pushes an event to all listeners with normal timing.
* **Parameters:**
  - `event` -- string -- event name
  - `data` -- table or nil -- event data
* **Returns:** None
* **Error states:** None

### `EntityScript:PushEventImmediate(event, data)`
* **Description:** Pushes an event to all listeners with immediate handling.
* **Parameters:**
  - `event` -- string -- event name
  - `data` -- table or nil -- event data
* **Returns:** None
* **Error states:** None

### `EntityScript:SetPhysicsRadiusOverride(radius)`
* **Description:** Sets an override value for the entity's physics radius.
* **Parameters:**
  - `radius` -- number -- physics radius override value
* **Returns:** None
* **Error states:** None

### `EntityScript:GetPhysicsRadius(default)`
* **Description:** Returns physics radius from override, Physics component, or default value.
* **Parameters:**
  - `default` -- number -- default radius if no override or Physics component
* **Returns:** number -- physics radius
* **Error states:** None

### `EntityScript:GetBoatIntersectingPhysics()`
* **Description:** Finds and returns a boat entity that intersects with this entity's physics radius.
* **Parameters:** None
* **Returns:** Entity boat instance or nil
* **Error states:** None

### `EntityScript:GetPosition()`
* **Description:** Returns the entity's world position as a Point.
* **Parameters:** None
* **Returns:** Point -- entity position
* **Error states:** None

### `EntityScript:GetRotation()`
* **Description:** Returns the entity's current rotation angle.
* **Parameters:** None
* **Returns:** number -- rotation angle
* **Error states:** None

### `EntityScript:GetAngleToPoint(x, y, z)`
* **Description:** Calculates the angle from entity position to a target point.
* **Parameters:**
  - `x` -- number or Point/Vector3 -- x coordinate or position object
  - `y` -- number or nil -- y coordinate
  - `z` -- number or nil -- z coordinate
* **Returns:** number -- angle in radians
* **Error states:** None

### `EntityScript:GetPositionAdjacentTo(target, distance)`
* **Description:** Returns a position adjacent to target entity at specified distance.
* **Parameters:**
  - `target` -- Entity -- target entity
  - `distance` -- number -- distance from target
* **Returns:** Vector3 -- adjacent position or nil if target is nil
* **Error states:** None

### `EntityScript:ForceFacePoint(x, y, z)`
* **Description:** Forces the entity to face a point immediately.
* **Parameters:**
  - `x` -- number -- x coordinate
  - `y` -- number -- y coordinate
  - `z` -- number -- z coordinate
* **Returns:** None
* **Error states:** None

### `EntityScript:FacePoint(x, y, z)`
* **Description:** Makes entity face a point unless stategraph has busy tag.
* **Parameters:**
  - `x` -- number -- x coordinate
  - `y` -- number -- y coordinate
  - `z` -- number -- z coordinate
* **Returns:** None
* **Error states:** None

### `EntityScript:GetDistanceSqToInst(inst)`
* **Description:** Returns squared horizontal distance to another entity.
* **Parameters:**
  - `inst` -- Entity -- target entity
* **Returns:** number -- squared distance
* **Error states:** Asserts if self or inst is not valid

### `EntityScript:IsNear(otherinst, dist)`
* **Description:** Checks if another entity is within specified distance.
* **Parameters:**
  - `otherinst` -- Entity -- other entity to check
  - `dist` -- number -- distance threshold
* **Returns:** boolean -- true if within distance
* **Error states:** None

### `EntityScript:GetDistanceSqToPoint(x, y, z)`
* **Description:** Returns squared horizontal distance to a point.
* **Parameters:**
  - `x` -- number or Point/Vector3 -- x coordinate or position object
  - `y` -- number or nil -- y coordinate
  - `z` -- number or nil -- z coordinate
* **Returns:** number -- squared distance
* **Error states:** None

### `EntityScript:IsNearPlayer(range, isalive)`
* **Description:** Checks if any player is within range of this entity.
* **Parameters:**
  - `range` -- number -- range to check
  - `isalive` -- boolean or nil -- whether to check only alive players
* **Returns:** boolean -- true if player in range
* **Error states:** None

### `EntityScript:GetNearestPlayer(isalive)`
* **Description:** Finds the closest player to this entity.
* **Parameters:**
  - `isalive` -- boolean or nil -- whether to find only alive players
* **Returns:** Entity player or nil
* **Error states:** None

### `EntityScript:GetDistanceSqToClosestPlayer(isalive)`
* **Description:** Returns squared distance to the closest player.
* **Parameters:**
  - `isalive` -- boolean or nil -- whether to check only alive players
* **Returns:** number -- squared distance or math.huge
* **Error states:** None

### `EntityScript:FaceAwayFromPoint(dest, force)`
* **Description:** Makes entity face away from a destination point.
* **Parameters:**
  - `dest` -- table with x/z -- destination point
  - `force` -- boolean -- whether to ignore busy state
* **Returns:** None
* **Error states:** None

### `EntityScript:IsEntityInFrontConeSlice(otherinst, wholearcangle_degrees, max_dist, circle_dist)`
* **Description:** Checks if an entity is within a front-facing cone slice.
* **Parameters:**
  - `otherinst` -- Entity -- entity to check
  - `wholearcangle_degrees` -- number -- cone angle in degrees
  - `max_dist` -- number or nil -- maximum distance
  - `circle_dist` -- number or nil -- circle distance for close range
* **Returns:** boolean -- true if within cone
* **Error states:** None

### `EntityScript:IsAsleep()`
* **Description:** Checks if the entity is currently asleep.
* **Parameters:** None
* **Returns:** boolean -- true if asleep
* **Error states:** None

### `EntityScript:CancelAllPendingTasks()`
* **Description:** Cancels all pending scheduled tasks for this entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:DoStaticPeriodicTask(time, fn, initialdelay, ...)`
* **Description:** Schedules a periodic task using staticScheduler.
* **Parameters:**
  - `time` -- number -- period in seconds
  - `fn` -- function -- callback function
  - `initialdelay` -- number or nil -- initial delay before first execution
  - `...` -- varargs -- additional arguments passed to fn
* **Returns:** task reference
* **Error states:** None

### `EntityScript:DoStaticTaskInTime(time, fn, ...)`
* **Description:** Schedules a one-time task using staticScheduler.
* **Parameters:**
  - `time` -- number -- delay in seconds
  - `fn` -- function -- callback function
  - `...` -- varargs -- additional arguments passed to fn
* **Returns:** task reference
* **Error states:** None

### `EntityScript:DoPeriodicTask(time, fn, initialdelay, ...)`
* **Description:** Schedules a periodic task using scheduler.
* **Parameters:**
  - `time` -- number -- period in seconds
  - `fn` -- function -- callback function
  - `initialdelay` -- number or nil -- initial delay
  - `...` -- varargs -- additional arguments passed to fn
* **Returns:** task reference
* **Error states:** None

### `EntityScript:DoTaskInTime(time, fn, ...)`
* **Description:** Schedules a one-time task using scheduler.
* **Parameters:**
  - `time` -- number -- delay in seconds
  - `fn` -- function -- callback function
  - `...` -- varargs -- additional arguments passed to fn
* **Returns:** task reference
* **Error states:** None

### `EntityScript:PushEventInTime(time, eventname, data)`
* **Description:** Schedules an event to be pushed after a delay.
* **Parameters:**
  - `time` -- number -- delay in seconds
  - `eventname` -- string -- event name to push
  - `data` -- table or nil -- event data
* **Returns:** task reference
* **Error states:** None

### `EntityScript:GetTaskInfo(time)`
* **Description:** Creates task info object with start time and duration.
* **Parameters:**
  - `time` -- number -- task duration
* **Returns:** table -- taskinfo with start and time fields
* **Error states:** None

### `EntityScript:TimeRemainingInTask(taskinfo)`
* **Description:** Calculates remaining time in a task.
* **Parameters:**
  - `taskinfo` -- table -- task info from GetTaskInfo
* **Returns:** number -- time remaining (minimum 1)
* **Error states:** None

### `EntityScript:ResumeTask(time, fn, ...)`
* **Description:** Creates a task and returns both task reference and task info.
* **Parameters:**
  - `time` -- number -- delay in seconds
  - `fn` -- function -- callback function
  - `...` -- varargs -- additional arguments
* **Returns:** task reference, taskinfo table
* **Error states:** None

### `EntityScript:ClearBufferedAction()`
* **Description:** Clears the current buffered action by failing it.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:PreviewBufferedAction(bufferedaction)`
* **Description:** Previews a buffered action, checking for duplicates and stategraph compatibility.
* **Parameters:**
  - `bufferedaction` -- BufferedAction -- action to preview
* **Returns:** None
* **Error states:** None

### `EntityScript:PerformPreviewBufferedAction()`
* **Description:** Performs the preview of a buffered action via playercontroller if available.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:PushBufferedAction(bufferedaction)`
* **Description:** Pushes a buffered action for execution, handling walkto, instant, and normal actions differently.
* **Parameters:**
  - `bufferedaction` -- BufferedAction -- action to push
* **Returns:** None
* **Error states:** None

### `EntityScript:PerformBufferedAction()`
* **Description:** Executes the buffered action on the entity. Faces the action target if valid, pushes performaction event, optionally plays theme music, and handles success/failure states.
* **Parameters:** None
* **Returns:** true if action succeeded, nil otherwise
* **Error states:** None

### `EntityScript:GetBufferedAction()`
* **Description:** Returns the entity's buffered action, or falls back to locomotor component's bufferedaction if available.
* **Parameters:** None
* **Returns:** BufferedAction instance or nil
* **Error states:** None

### `EntityScript:OnBuilt(builder)`
* **Description:** Called when the entity is built. Iterates all components and calls their OnBuilt method, then calls custom OnBuiltFn if defined.
* **Parameters:**
  - `builder` -- Entity instance that built this entity
* **Returns:** None
* **Error states:** None

### `EntityScript:Remove()`
* **Description:** Removes the entity from the world. Cleans up parent/platform relationships, pushes onremove event, stops all watchers and tasks, calls OnRemoveEntity on all components and replicas, clears updating entity registries, removes children and platform followers, and retires the entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EntityScript:IsValid()`
* **Description:** Checks if the underlying entity is still valid in the simulation.
* **Parameters:** None
* **Returns:** boolean - true if entity is valid
* **Error states:** None

### `EntityScript:CanInteractWith(inst)`
* **Description:** Determines if this entity can interact with another entity. Returns false if inst is invalid, true if inst has no parent or if this entity is inst's parent.
* **Parameters:**
  - `inst` -- Entity instance to check interaction validity with
* **Returns:** boolean
* **Error states:** None

### `EntityScript:OnUsedAsItem(action, doer, target)`
* **Description:** Called when this entity is used as an item. Iterates all components and calls their OnUsedAsItem method.
* **Parameters:**
  - `action` -- The action being performed
  - `doer` -- Entity performing the action
  - `target` -- Target entity of the action
* **Returns:** None
* **Error states:** None

### `EntityScript:CanDoAction(action)`
* **Description:** Checks if the entity can perform the given action. Checks inherentactions table, action-specific tool tags, and active/equipped inventory items.
* **Parameters:**
  - `action` -- Action to check capability for
* **Returns:** boolean - true if action can be performed
* **Error states:** None

### `EntityScript:IsOnValidGround()`
* **Description:** Checks if the entity is on valid ground using TheWorld.Map:IsVisualGroundAtPoint. Does not support boats.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

### `EntityScript:IsOnPassablePoint(include_water, floating_platforms_are_not_passable)`
* **Description:** Checks if the entity's position is on a passable point using TheWorld.Map:IsPassableAtPoint.
* **Parameters:**
  - `include_water` -- boolean - whether to consider water as passable (default false)
  - `floating_platforms_are_not_passable` -- boolean - whether floating platforms should be considered not passable (default false)
* **Returns:** boolean
* **Error states:** None

### `EntityScript:IsOnOcean(allow_boats)`
* **Description:** Checks if the entity is on ocean using TheWorld.Map:IsOceanAtPoint.
* **Parameters:**
  - `allow_boats` -- boolean - whether boat entities should be considered on ocean
* **Returns:** boolean
* **Error states:** None

### `EntityScript:GetCurrentPlatform()`
* **Description:** Returns the current platform the entity is on. On server, checks parent platform or self.platform. On client, checks entity parent or entity platform.
* **Parameters:** None
* **Returns:** Platform entity or nil
* **Error states:** None

### `EntityScript:GetCurrentTileType()`
* **Description:** Returns the current tile type and tile info at the entity's position. Approximates tile by checking neighboring tiles if not on land tile.
* **Parameters:** None
* **Returns:** tile_id, tile_info_table or nil
* **Error states:** None

### `EntityScript:PutBackOnGround(radius)`
* **Description:** Attempts to relocate the entity to valid ground. Returns true if already on passable point or successfully teleported, false if no suitable location found.
* **Parameters:**
  - `radius` -- number - search radius for valid ground (default 8)
* **Returns:** boolean
* **Error states:** None

### `EntityScript:GetPersistData()`
* **Description:** Collects persistence data from all components with OnSave method and custom OnSave function. Returns data table and references array.
* **Parameters:** None
* **Returns:** data_table, references_array or nil if empty
* **Error states:** None

### `EntityScript:LoadPostPass(newents, savedata)`
* **Description:** Loads post-pass data for components with LoadPostPass method, then calls custom OnLoadPostPass if defined.
* **Parameters:**
  - `newents` -- Table mapping old entity references to new entities
  - `savedata` -- Saved data table from GetPersistData
* **Returns:** None
* **Error states:** None

### `EntityScript:SetPersistData(data, newents)`
* **Description:** Restores entity state from saved data. Adds missing components if flagged, calls OnPreLoad, then loads component data via OnLoad, and calls custom OnLoad.
* **Parameters:**
  - `data` -- Saved data table containing component data
  - `newents` -- Table mapping old entity references to new entities
* **Returns:** None
* **Error states:** None

### `EntityScript:GetAdjective()`
* **Description:** Returns a descriptive adjective string for the entity based on tags (critter traits, livestock status, stale/spoiled/frozen states) or custom displayadjectivefn.
* **Parameters:** None
* **Returns:** string or nil
* **Error states:** None

### `EntityScript:SetInherentSceneAction(action)`
* **Description:** Sets the inherent scene action and replicates it via actionreplica if available.
* **Parameters:**
  - `action` -- Action table to set as inherent scene action
* **Returns:** None
* **Error states:** None

### `EntityScript:SetInherentSceneAltAction(action)`
* **Description:** Sets the alternative inherent scene action and replicates it via actionreplica if available.
* **Parameters:**
  - `action` -- Action table to set as alternative inherent scene action
* **Returns:** None
* **Error states:** None

### `EntityScript:LongUpdate(dt)`
* **Description:** Called periodically for long-running updates. Calls custom OnLongUpdate then iterates all components calling their LongUpdate method.
* **Parameters:**
  - `dt` -- number - delta time since last long update
* **Returns:** None
* **Error states:** None

### `EntityScript:SetClientSideInventoryImageOverride(flagname, srcinventoryimage, destinventoryimage, destatlas)`
* **Description:** Sets up client-side inventory image remapping. Pushes clientsideinventoryflagschanged event to ThePlayer if flag is active.
* **Parameters:**
  - `flagname` -- string - name of the override flag
  - `srcinventoryimage` -- string - source inventory image name
  - `destinventoryimage` -- string - destination inventory image name
  - `destatlas` -- string - destination atlas name (optional)
* **Returns:** None
* **Error states:** None

### `EntityScript:HasClientSideInventoryImageOverrides()`
* **Description:** Checks if the entity has any client-side inventory image overrides configured.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

### `EntityScript:GetClientSideInventoryImageOverride(imagenamehash)`
* **Description:** Returns the image override data for a given image hash if the corresponding flag is active.
* **Parameters:**
  - `imagenamehash` -- number - hashed inventory image name to look up
* **Returns:** table with image and atlas fields, or nil
* **Error states:** None

### `EntityScript:SetClientSideInventoryImageOverrideFlag(name, value)`
* **Description:** Sets a client-side inventory image override flag. Pushes clientsideinventoryflagschanged event to ThePlayer if value changed.
* **Parameters:**
  - `name` -- string - flag name
  - `value` -- boolean - flag value (nil treated as false)
* **Returns:** None
* **Error states:** None

### `EntityScript:IsInLight()`
* **Description:** Checks if the entity is in light. Uses LightWatcher component if available, otherwise uses TheSim:GetLightAtPoint with cached thresholds.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** Errors if self.Transform is nil and LightWatcher is absent (nil dereference on self.Transform:GetWorldPosition() — no guard present in source).

### `EntityScript:IsLightGreaterThan(lightThresh)`
* **Description:** Checks if light level at entity position exceeds the given threshold. Uses LightWatcher if available, otherwise TheSim:GetLightAtPoint.
* **Parameters:**
  - `lightThresh` -- number - light threshold to compare against
* **Returns:** boolean
* **Error states:** Errors if `self.Transform` is nil when LightWatcher is absent (nil dereference on `self.Transform:GetWorldPosition()` — no guard in else branch).

### `EntityScript:DebuffsEnabled()`
* **Description:** Checks if debuffs are enabled for this entity. Returns true if debuffable component is missing or enabled.
* **Parameters:** None
* **Returns:** boolean
* **Error states:** None

### `EntityScript:HasDebuff(name)`
* **Description:** Checks if the entity has a specific debuff via the debuffable component.
* **Parameters:**
  - `name` -- string - debuff name to check
* **Returns:** boolean
* **Error states:** None

### `EntityScript:GetDebuff(name)`
* **Description:** Returns the debuff data for a specific debuff name via the debuffable component.
* **Parameters:**
  - `name` -- string - debuff name to retrieve
* **Returns:** debuff data table or nil
* **Error states:** None

### `EntityScript:AddDebuff(name, prefab, data, skip_test, pre_buff_fn, buffer)`
* **Description:** Adds a debuff to the entity. Adds debuffable component if missing. Only applies if debuffs enabled and entity not dead/ghost (unless skip_test).
* **Parameters:**
  - `name` -- string - debuff name
  - `prefab` -- string - prefab name for the debuff
  - `data` -- table - debuff data
  - `skip_test` -- boolean - whether to skip enable/dead checks
  - `pre_buff_fn` -- function - callback before applying buff
  - `buffer` -- table - buffer data
* **Returns:** boolean - true if debuff was added
* **Error states:** None

### `EntityScript:RemoveDebuff(name)`
* **Description:** Removes a debuff from the entity via the debuffable component.
* **Parameters:**
  - `name` -- string - debuff name to remove
* **Returns:** None
* **Error states:** None

### `EntityScript:SetDeathLootLevel(num)`
* **Description:** Sets the death loot level. Adds deathloothandler component if missing.
* **Parameters:**
  - `num` -- number - death loot level to set
* **Returns:** None
* **Error states:** None

### `EntityScript:GetDeathLootLevel()`
* **Description:** Returns the current death loot level from the deathloothandler component.
* **Parameters:** None
* **Returns:** number (default 0 if no handler)
* **Error states:** None

### `EntityScript:DropDeathLoot()`
* **Description:** Drops death loot. Sets loot level to 1, then either stores loot in deathloothandler if corpsing or drops via lootdropper.
* **Parameters:** None
* **Returns:** None
* **Error states:** Crashes if `health` component is missing (accesses `self.components.health.is_corpsing` without nil check). Crashes if `Transform` component is missing (`self:GetPosition()`).

### `EntityScript:GetDeathLoot()`
* **Description:** Returns the death loot from the deathloothandler component.
* **Parameters:** None
* **Returns:** loot table or nil
* **Error states:** None

## Events & listeners
**Listens to:**
- `actioncomponentsdirty` -- Fired when actioncomponents netvar changes on client, triggers deserialization.
- `inherentactionsdirty` -- Fired when inherentactions netvar changes on client, triggers deserialization.
- `inherentsceneactiondirty` -- Fired when inherentsceneaction netvar changes on client, triggers deserialization.
- `inherentscenealtactiondirty` -- Fired when inherentscenealtaction netvar changes on client, triggers deserialization.
- `modactioncomponentsdirty{modname}` -- Fired when mod-specific actioncomponents netvar changes on client, triggers deserialization per mod.

**Pushes:**
- `enterlimbo` -- Pushed when entity is removed from scene via RemoveFromScene.
- `exitlimbo` -- Pushed when entity returns to scene via ReturnToScene.
- `actionfailed` -- Pushed when buffered action fails TestForStart
- `performaction` -- Pushed when action is performed immediately or via stategraph
- `startaction` -- Pushed when action starts without stategraph
- `play_theme_music` -- Pushed when action has theme music, includes theme data
- `onremove` -- Pushed when entity is being removed from the world
- `clientsideinventoryflagschanged` -- Pushed to ThePlayer when inventory image override flags change