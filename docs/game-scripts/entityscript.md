---
id: entityscript
title: Entityscript
description: The core entity management system for DST that handles entity lifecycle, components, behavior, persistence, network synchronization, and world interaction.
tags: [entity, lifecycle, components, persistence, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 58d6dc8a
system_scope: entity
---

# Entityscript

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`EntityScript` is the central runtime wrapper for all entities in Don't Starve Together. It manages the Entity Component System (ECS) by registering, instantiating, and coordinating components; handles entity lifecycle including spawn, save/load, limbo transitions, and removal; provides utilities for world interaction (positioning, lighting, terrain), behavior (stategraphs, brains, events), networking (replica sync, action propagation), and display (naming, skins, inventory overrides). It serves as the glue between engine-level systems (physics, world map, network), game systems (components, actions), and modded logic.

## Usage example
```lua
local ent = TheSim:FindEntity(prefab, function(e) return e:HasTag("monster") end)
if ent then
    local script = EntityScript(ent)
    script:AddComponent("health")
    script:AddComponent("locomotor")
    script:SetStateGraph("SGmycharacter")
    script:SetBrain(MyBrainFunction)
    script:ListenForEvent("death", function() print("Entity died!") end)
    script:StartUpdatingComponent(script.components.health)
    print("Entity is wet:", script:GetIsWet())
    print("Entity name:", script:GetDisplayName())
end
```

## Dependencies & tags
**Components used:** hull, walkableplatform, worldstate, debuffable, health, deathloothandler, lootdropper, LightWatcher, inventoryitem, moisture, temp_moisture, player_classified  
**Tags:** INLIMBO, terraformblocker, groundtargetblocker, player, smolder, diseased, rotten, withered, waxedplant, wet, broken, deadcreature, moistureimmunity, rainimmunity, swimming, likewateroffducksback, acidrainimmune, critter, `<actionid>_tool`, `trait_<k>`, small_livestock, stale, spoiled, frozen, sickness, add_component_if_missing

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| entity | Entity | — | Raw engine entity instance |
| components | table | `{}` | Component registry mapping name → component instance |
| lower_components_shadow | table | `{}` | Lowercase component name map for duplicate detection |
| GUID | string | — | Unique entity identifier from entity |
| spawntime | number | `GetTime()` at spawn | Spawn timestamp used by `GetTimeAlive()` |
| sleepstatepending | boolean | `true` | True until sleep state is received over network |
| persists | boolean | `true` | Flag determining if entity persists to save |
| inlimbo | boolean | `false` | Whether entity is currently in limbo state |
| name | string | `nil` | Entity display name (from STRINGS) |
| data | table | `nil` | Entity-specific data table (reserved) |
| actioncomponents | table | `{}` | Action-related component registry |
| inherentactions | table | `nil` | Map of ACTION constants (or IDs) to true |
| inherentsceneaction | Action | `nil` | Inherent scene action |
| inherentscenealtaction | Action | `nil` | Inherent alternate scene action |
| event_listeners | table | `nil` | Registered event listeners map |
| event_listening | table | `nil` | Inverse event → entities map |
| worldstatewatching | table | `nil` | World state variable → list of callbacks |
| pendingtasks | table | `nil` | Scheduler task registry keyed by GUID |
| platformfollowers | table | `nil` | Map of child entities following a platform |
| actionreplica | table | `nil` | Network-replicated action component |
| replica | table | `{ _ = {}, inst = self }` | Replica container with metatable for component proxy access |

## Main functions
### `EntityScript:LoadComponent(name)`
* **Description:** Loads and caches a component module, monkey-patching it with world state helper methods.
* **Parameters:** `name` — component name string.
* **Returns:** The loaded component module.

### `EntityScript:LoadStateGraph(name)`
* **Description:** Loads and caches a stategraph module; asserts loaded function is non-nil.
* **Parameters:** `name` — stategraph name string.
* **Returns:** The loaded stategraph function.

### `EntityScript:event_server_data(eventname, path)`
* **Description:** Loads and caches event-server-specific Lua files (e.g., `network_event_server/components/...`) and patches components with world state helpers.
* **Parameters:** `eventname` — event folder prefix string; `path` — relative path string (e.g., `"components/..."`).
* **Returns:** The required module.

### `EntityScript:SerializeAction(action)`
* **Description:** Maps an ACTION constant to its 1-based index; returns `0` if nil or not found.
* **Parameters:** `action` — ACTION constant table.
* **Returns:** `id` — integer or `0`.

### `EntityScript:DeserializeAction(actionid)`
* **Description:** Maps a 1-based index to the ACTION constant; returns `nil` if invalid.
* **Parameters:** `actionid` — integer ID.
* **Returns:** ACTION constant or `nil`.

### `EntityScript:GetSaveRecord()`
* **Description:** Builds save data record for this entity (position, skin, persistence data).
* **Parameters:** None.
* **Returns:** `record` (table), `references` (table). NaN/inf positions are clamped to 0; platform-relative position computed via `WorldToLocalSpace`; platform UID via `walkableplatform:GetUID()`.

### `EntityScript:Hide()`
* **Description:** Hides the entity visually.
* **Parameters:** None.
* **Returns:** None.

### `EntityScript:Show()`
* **Description:** Shows the entity visually.
* **Parameters:** None.
* **Returns:** None.

### `EntityScript:StackableSkinHack(target)`
* **Description:** Compares `AnimState:GetSkinBuild()` for equality; returns true if either is nil or builds match.
* **Parameters:** `target` — another EntityScript instance.
* **Returns:** Boolean.

### `EntityScript:IsInLimbo()`
* **Description:** Returns current limbo state.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:ForceOutOfLimbo(state)`
* **Description:** Overrides limbo behavior to force entity in/out of limbo regardless of default rules.
* **Parameters:** `state` — boolean or `nil`.
* **Returns:** None.

### `EntityScript:RemoveFromScene()`
* **Description:** Moves entity into limbo: adds `INLIMBO` tag, disables physics, animation, light, shadow, minimap, brain, stategraph.
* **Parameters:** None.
* **Returns:** None.
* **Pushes:** `"enterlimbo"`.

### `EntityScript:ReturnToScene()`
* **Description:** Reverses limbo effects: removes tag, re-enables physics/etc., resumes brain/SG if not asleep.
* **Parameters:** None.
* **Returns:** None.
* **Pushes:** `"exitlimbo"`.

### `EntityScript:PutBackOnGround(radius)`
* **Description:** Attempts to place entity back on solid ground. Checks current position first; otherwise searches nearby land or ocean within radius.
* **Parameters:** `radius` — optional radius (default `8`) for searching.
* **Returns:** `true` if successfully placed, `false` otherwise.

### `EntityScript:GetPersistData()`
* **Description:** Serializes persistent data for the entity by collecting `OnSave` results from components and entity.
* **Parameters:** None.
* **Returns:** `data, references` — two tables: component/entity data and list of entity ID references. Returns `nil` if both tables empty.

### `EntityScript:LoadPostPass(newents, savedata)`
* **Description:** Performs post-load initialization using saved data. Calls `LoadPostPass` on components and entity itself if defined.
* **Parameters:**  
  `newents` — map of new entity instances (for reference resolution),  
  `savedata` — saved data table.
* **Returns:** None.

### `EntityScript:SetPersistData(data, newents)`
* **Description:** Loads persistent data onto entity and components. Includes backward compatibility logic for `add_component_if_missing`. Calls `OnPreLoad`, component `OnLoad`, and entity `OnLoad`.
* **Parameters:**  
  `data` — saved data table,  
  `newents` — map of new entity instances.
* **Returns:** None.

### `EntityScript:GetBasicDisplayName()`
* **Description:** Returns first available: `displaynamefn()`, `STRINGS.NAMES[nameoverride]`, filtered `name`, or `self.name`.
* **Parameters:** None.
* **Returns:** String.

### `EntityScript:GetAdjectivedName()`
* **Description:** Applies adjective prefixes based on tags (e.g., `smolder`, `diseased`, `rotten`, `withered`, `broken`, `deadcreature`, `wet`, `acidrainimmune`) and item type (tool/clothing/food/fuel/wet_prefix).
* **Parameters:** None.
* **Returns:** String.

### `EntityScript:GetDisplayName()`
* **Description:** Concatenates `GetAdjectivedName()` with optional `STRINGS.NAME_DETAIL_EXTENTION[prefab]`.
* **Parameters:** None.
* **Returns:** String.

### `EntityScript:GetWetMultiplier()`
* **Description:** Returns 0, 1, or moisture percent based on tags and components (`temp_moisture`, `moisture`, `inventoryitem`).
* **Parameters:** None.
* **Returns:** Float or `nil` (not available on client without components).

### `EntityScript:GetIsWet()`
* **Description:** Client-safe version of `GetWetMultiplier`; uses `replica.inventoryitem`/`replica.moisture` or world state fallback.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:IsAcidSizzling()`
* **Description:** Checks if entity is currently sizzling from acid via `replica.inventoryitem:IsAcidSizzling()` or `player_classified.isacidsizzling:value()`.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:GetSkinBuild()`, `EntityScript:GetSkinName()`
* **Description:** Returns cached skin build name or skin name respectively.
* **Parameters:** None.
* **Returns:** String.

### `EntityScript:SetPrefabName(name)`, `EntityScript:SetPrefabNameOverride(nameoverride)`
* **Description:** Sets `self.prefab`, `self.name` (from STRINGS), and optional display override.
* **Parameters:** `name`, `nameoverride`.
* **Returns:** None.

### `EntityScript:SetDeployExtraSpacing(spacing)`, `EntityScript:SetDeploySmartRadius(radius)`, `EntityScript:SetTerraformExtraSpacing(spacing)`, `EntityScript:SetGroundTargetBlockerRadius(radius)`
* **Description:** Registers spacing constraints with `TheWorld.Map` and adds/removes tags (`terraformblocker`, `groundtargetblocker`).
* **Parameters:** `spacing`/`radius`.
* **Returns:** None.

### `EntityScript:SpawnChild(name)`
* **Description:** Spawns and returns a child entity.
* **Parameters:** `name` — prefab name.
* **Returns:** Spawned instance.

### `EntityScript:RemoveChild(child)`
* **Description:** Detaches and removes child entity.
* **Parameters:** `child` — child entity.
* **Returns:** None.

### `EntityScript:AddChild(child)`
* **Description:** Attaches child entity to parent.
* **Parameters:** `child` — child entity.
* **Returns:** None.

### `EntityScript:GetPlatformFollowers()`
* **Description:** Returns list of platform-following children (mastersim only).
* **Parameters:** None.
* **Returns:** `self.platformfollowers` or `nil`.

### `EntityScript:AddInherentAction(act)`, `EntityScript:RemoveInherentAction(act)`
* **Description:** Adds/removes action from `self.inherentactions` and serializes to replica.
* **Parameters:** `act` — ACTION constant.
* **Returns:** None.

### `EntityScript:GetTimeAlive()`
* **Description:** Returns time since spawn: `GetTime() - self.spawntime`.
* **Parameters:** None.
* **Returns:** Float.

### `EntityScript:StartUpdatingComponent(cmp, do_static_update)`
* **Description:** Registers component for dynamic or static update; populates `NewUpdatingEnts`/`NewStaticUpdatingEnts` on first registration.
* **Parameters:** `cmp` — component instance; `do_static_update` — boolean.
* **Returns:** None.

### `EntityScript:StopUpdatingComponent(cmp)`, `EntityScript:StopUpdatingComponent_Deferred(cmp)`
* **Description:** Marks component for deferred update removal or removes immediately.
* **Parameters:** `cmp`.
* **Returns:** None.

### `EntityScript:GetComponentName(cmp)`
* **Description:** Reverse lookup of component instance in `self.components`.
* **Parameters:** `cmp` — component instance.
* **Returns:** String key or `"component"`.

### `EntityScript:AddTag(tag)`, `EntityScript:RemoveTag(tag)`, `EntityScript:AddOrRemoveTag(tag, condition)`, `EntityScript:HasTag(tag)`
* **Description:** Delegates to `self.entity` equivalents.
* **Parameters:** `tag`, `condition`.
* **Returns:** `HasTag` returns Boolean.

### `EntityScript:HasTags(...)`, `EntityScript:HasOneOfTags(...)`
* **Description:** Wraps `HasAllTags`/`HasAnyTag`; supports table or variadic input.
* **Parameters:** `...` — one or more tags or a table.
* **Returns:** Boolean.

### `EntityScript:AddComponent(name)`
* **Description:** Loads and instantiates component, runs `ComponentPostInit`, registers and replicates it.
* **Parameters:** `name` — component name.
* **Returns:** Loaded component instance.
* **Error states:** Logs and returns existing component if already added; errors if not found.

### `EntityScript:RemoveComponent(name)`
* **Description:** Removes component, stops updates, calls `OnRemoveFromEntity`, unreplicates and unregisters actions.
* **Parameters:** `name`.
* **Returns:** None.

### `EntityScript:SetClientSideInventoryImageOverride(flagname, srcinventoryimage, destinventoryimage, destatlas)`
* **Description:** Registers client-side remapping of inventory images for a given flag.
* **Parameters:**  
  `flagname` — string identifier for flag,  
  `srcinventoryimage` — original image name (string/hash),  
  `destinventoryimage` — replacement image name,  
  `destatlas` — optional replacement atlas name.
* **Returns:** None.

### `EntityScript:HasClientSideInventoryImageOverrides()`
* **Description:** Checks if any image override mappings exist.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:GetClientSideInventoryImageOverride(imagenamehash)`
* **Description:** Returns override mapping for a specific image hash if enabled.
* **Parameters:** `imagenamehash` — hash of source image name.
* **Returns:** `{image = ..., atlas = ...}` or `nil`.

### `EntityScript:SetClientSideInventoryImageOverrideFlag(name, value)`
* **Description:** Toggles a client-side image override flag; updates global `ClientSideInventoryImageFlags`.
* **Parameters:**  
  `name` — flag name (string),  
  `value` — boolean; normalized to `true`/`nil`.
* **Returns:** None.

### `EntityScript:IsInLight()`
* **Description:** Checks if entity is in a lit area using `LightWatcher` if present, otherwise `TheSim:GetLightAtPoint`.
* **Parameters:** None.
* **Returns:** Boolean. Uses thresholds: `lightThresh = 0.1`, `darkThresh = 0.05`.

### `EntityScript:IsLightGreaterThan(lightThresh)`
* **Description:** Checks if current light level exceeds threshold.
* **Parameters:** `lightThresh` — float.
* **Returns:** Boolean.

### `EntityScript:DebuffsEnabled()`
* **Description:** Returns true if `debuffable` component missing or enabled.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:HasDebuff(name)`
* **Description:** Checks if entity has a specific debuff.
* **Parameters:** `name` — debuff name string.
* **Returns:** Boolean.

### `EntityScript:GetDebuff(name)`
* **Description:** Retrieves debuff data for a specific name.
* **Parameters:** `name` — debuff name string.
* **Returns:** Debuff data table or `nil`.

### `EntityScript:AddDebuff(name, prefab, data, skip_test, pre_buff_fn, buffer)`
* **Description:** Adds a debuff, auto-adding `debuffable` component if needed. Respects state and optional hooks.
* **Parameters:**  
  `name` — debuff name string,  
  `prefab` — prefab string or entity reference,  
  `data` — optional parameters table,  
  `skip_test` — boolean to bypass state checks,  
  `pre_buff_fn` — optional callback before applying,  
  `buffer` — optional buffer data.
* **Returns:** Boolean (`true` if applied).

### `EntityScript:RemoveDebuff(name)`
* **Description:** Removes a debuff if `debuffable` component exists.
* **Parameters:** `name` — debuff name.
* **Returns:** None.

### `EntityScript:SetDeathLootLevel(num)`
* **Description:** Sets loot level for death loot; creates `deathloothandler` if missing.
* **Parameters:** `num` — integer loot level.
* **Returns:** None.

### `EntityScript:GetDeathLootLevel()`
* **Description:** Returns current death loot level.
* **Parameters:** None.
* **Returns:** Integer or `0` if no handler.

### `EntityScript:DropDeathLoot()`
* **Description:** Drops loot upon death; stores in corpse if `is_corpsing`, otherwise to ground.
* **Parameters:** None.
* **Returns:** None.

### `EntityScript:GetDeathLoot()`
* **Description:** Retrieves stored death loot (e.g., from a corpse).
* **Parameters:** None.
* **Returns:** Loot table (list of items) or `nil`.

### `EntityScript:LongUpdate(dt)`
* **Description:** Periodically called for long-interval updates. Invokes `OnLongUpdate` on entity and components.
* **Parameters:** `dt` — delta time float.
* **Returns:** None.

### `EntityScript:GetAdjective()`
* **Description:** Returns adjective for HUD, based on custom function, critter traits, livestock status, or state tags (`stale`, `spoiled`, `frozen`, `sickness`).
* **Parameters:** None.
* **Returns:** String or `nil`.

### `EntityScript:SetInherentSceneAction(action)`
* **Description:** Sets inherent scene action and syncs to replica.
* **Parameters:** `action` — action table.
* **Returns:** None.

### `EntityScript:SetInherentSceneAltAction(action)`
* **Description:** Sets inherent alternate scene action and syncs to replica.
* **Parameters:** `action` — action table.
* **Returns:** None.

### `EntityScript:StartWallUpdatingComponent(cmp)`, `EntityScript:StopWallUpdatingComponent(cmp)`
* **Description:** Manages wall update registrations via `wallupdatecomponents` tables.
* **Parameters:** `cmp` — component instance.
* **Returns:** None.

### `EntityScript:StartUpdatingComponent(cmp, do_static_update)`, `EntityScript:StopUpdatingComponent(cmp)`
* **Description:** Registers/stops component for dynamic/static update.
* **Parameters:** `cmp`, `do_static_update`.
* **Returns:** None.

### `EntityScript:GetBrainString()`, `EntityScript:GetDebugString()`
* **Description:** Builds debug strings for brain, components, events, and tasks.
* **Parameters:** None.
* **Returns:** String.

### `EntityScript:KillTasks()`, `EntityScript:StartThread(fn)`
* **Description:** Helper wrappers for thread/task management using `self.GUID` as ID.
* **Parameters:** `fn` — function.
* **Returns:** `StartThread` returns thread.

### `EntityScript:RunScript(name)`
* **Description:** Loads and executes a script via `LoadScript`.
* **Parameters:** `name` — script path string.
* **Returns:** None.

### `EntityScript:RestartBrain(reason)`, `EntityScript:StopBrain(reason)`
* **Description:** Controls brain state via `self._brainstopped` map.
* **Parameters:** `reason` — string.
* **Returns:** None.

### `EntityScript:SetBrain(brainfn)`
* **Description:** Sets brain function and instantiates brain if not disabled (limbo/asleep).
* **Parameters:** `brainfn` — function returning brain table.
* **Returns:** None.

### `EntityScript:_DisableBrain_Internal()`, `EntityScript:_EnableBrain_Internal()`
* **Description:** Internal brain disable/enable for scene transitions.
* **Parameters:** None.
* **Returns:** None.

### `EntityScript:SetStateGraph(name)`, `EntityScript:ClearStateGraph()`
* **Description:** Instantiates and starts/stop a StateGraph.
* **Parameters:** `name` — stategraph name string.
* **Returns:** `SetStateGraph` returns SG instance.

### `EntityScript:ListenForEvent(event, fn, source)`
* **Description:** Registers bidirectional event listener.
* **Parameters:** `event`, `fn`, `source` (defaults to `self`).
* **Returns:** None.

### `EntityScript:RemoveEventCallback(event, fn, source)`
* **Description:** Removes a specific event listener.
* **Parameters:** As above.
* **Returns:** None.

### `EntityScript:RemoveAllEventCallbacks()`
* **Description:** Clears all event listener registrations.
* **Parameters:** None.
* **Returns:** None.

### `EntityScript:WatchWorldState(var, fn)`, `EntityScript:StopWatchingWorldState(var, fn)`, `EntityScript:StopAllWatchingWorldStates()`
* **Description:** Wrapper around entity-level watcher + `worldstate:AddWatcher`.
* **Parameters:** `var`, `fn`.
* **Returns:** None.

### `EntityScript:PushEvent_Internal(event, data, immediate)`, `EntityScript:PushEvent(event, data)`, `EntityScript:PushEventImmediate(event, data)`
* **Description:** Invokes listeners, stategraph, brain. Immediate mode triggers SG handling directly.
* **Parameters:** `event`, `data`, `immediate`.
* **Returns:** None.

### `EntityScript:SetPhysicsRadiusOverride(radius)`, `EntityScript:GetPhysicsRadius(default)`
* **Description:** Overrides or reads physics radius (fallback to `Physics:GetRadius()`).
* **Parameters:** `radius`, `default`.
* **Returns:** Float.

### `EntityScript:GetBoatIntersectingPhysics()`
* **Description:** Checks for boat collisions within combined physics radius.
* **Parameters:** None.
* **Returns:** Boat entity or `nil`.

### `EntityScript:GetPosition()`, `EntityScript:GetRotation()`
* **Description:** Returns world position (as `Point`) and rotation.
* **Parameters:** None.
* **Returns:** Point, number.

### `EntityScript:GetAngleToPoint(x, y, z)`
* **Description:** Computes angle to point or Vector3 in degrees.
* **Parameters:** Coordinates or single Vector3/Point.
* **Returns:** Angle in degrees.

### `EntityScript:GetPositionAdjacentTo(target, distance)`
* **Description:** Returns point at `distance` from `target` along line from self to target.
* **Parameters:** `target`, `distance`.
* **Returns:** Vector3 or `nil`.

### `EntityScript:ForceFacePoint(x, y, z)`, `EntityScript:FacePoint(x, y, z)`
* **Description:** Sets rotation to face point; `ForceFacePoint` ignores state tags, `FacePoint` does not.
* **Parameters:** Coordinates.
* **Returns:** None.

### `EntityScript:GetDistanceSqToInst(inst)`
* **Description:** Returns horizontal squared distance to another entity.
* **Parameters:** `inst`.
* **Returns:** Float.

### `EntityScript:IsNear(otherinst, dist)`
* **Description:** `GetDistanceSqToInst < dist²`.
* **Parameters:** `otherinst`, `dist`.
* **Returns:** Boolean.

### `EntityScript:GetDistanceSqToPoint(x, y, z)`
* **Description:** Horizontal squared distance to point.
* **Parameters:** Coordinates.
* **Returns:** Float.

### `EntityScript:IsNearPlayer(range, isalive)`, `EntityScript:GetNearestPlayer(isalive)`, `EntityScript:GetDistanceSqToClosestPlayer(isalive)`
* **Description:** Helpers for player proximity checks.
* **Parameters:** `range`, `isalive`.
* **Returns:** Boolean, entity, or distance.

### `EntityScript:FaceAwayFromPoint(dest, force)`
* **Description:** Rotates entity away from point, respects state tags.
* **Parameters:** `dest` — vector; `force`.
* **Returns:** None.

### `EntityScript:IsEntityInFrontConeSlice(otherinst, wholearcangle_degrees, max_dist, circle_dist)`
* **Description:** Checks if `otherinst` lies within horizontal cone and optional distance constraints.
* **Parameters:** As listed.
* **Returns:** Boolean.

### `EntityScript:IsAsleep()`
* **Description:** `not self.entity:IsAwake()`.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:CancelAllPendingTasks()`
* **Description:** Cancels all pending scheduler tasks.
* **Parameters:** None.
* **Returns:** None.

### `EntityScript:DoStaticPeriodicTask(...)`, `EntityScript:DoStaticTaskInTime(...)`, `EntityScript:DoPeriodicTask(...)`, `EntityScript:DoTaskInTime(...)`, `EntityScript:PushEventInTime(...)`
* **Description:** Scheduler helpers that register tasks in `self.pendingtasks` and attach `onfinish`.
* **Parameters:** `time`, `fn`, `initialdelay`, `...`.
* **Returns:** Task reference.

### `EntityScript:GetTaskInfo(time)`, `EntityScript:TimeRemainingInTask(taskinfo)`
* **Description:** Utility for timing; `TimeRemainingInTask` returns float ≥ 1.
* **Parameters:** `time`, `taskinfo`.
* **Returns:** Float.

### `EntityScript:ResumeTask(time, fn, ...)`
* **Description:** Shorthand for `DoTaskInTime` + `GetTaskInfo`.
* **Parameters:** As above.
* **Returns:** `task`, `taskinfo`.

### `EntityScript:ClearBufferedAction()`, `EntityScript:PreviewBufferedAction(bufferedaction)`, `EntityScript:PerformPreviewBufferedAction()`
* **Description:** Manages buffered action preview.
* **Parameters:** `bufferedaction`.
* **Returns:** None.

### `EntityScript:PushBufferedAction(bufferedaction)`
* **Description:** Tests and starts a buffered action; manages stategraph/SG interaction.
* **Parameters:** `bufferedaction`.
* **Returns:** None.

### `EntityScript:PerformBufferedAction()`
* **Description:** Executes buffered action; calls theme music event, handles success/fail.
* **Parameters:** None.
* **Returns:** Boolean (success) or `nil`.

### `EntityScript:GetBufferedAction()`
* **Description:** Returns `self.bufferedaction` or `locomotor.bufferedaction`.
* **Parameters:** None.
* **Returns:** Buffered action or `nil`.

### `EntityScript:OnBuilt(builder)`
* **Description:** Calls `OnBuilt(builder)` on all components and `self.OnBuiltFn`.
* **Parameters:** `builder`.
* **Returns:** None.

### `EntityScript:Remove()`
* **Description:** Full entity teardown: hierarchy, updates, listeners, tasks, components, replica.
* **Parameters:** None.
* **Returns:** None.
* **Pushes:** `"onremove"`.

### `EntityScript:IsValid()`
* **Description:** Returns `self.entity:IsValid()`.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:CanInteractWith(inst)`
* **Description:** Returns true if `inst` has no parent or its parent is `self`.
* **Parameters:** `inst`.
* **Returns:** Boolean.

### `EntityScript:OnUsedAsItem(action, doer, target)`
* **Description:** Delegates to component `OnUsedAsItem` handlers.
* **Parameters:** As listed.
* **Returns:** None.

### `EntityScript:CanDoAction(action)`
* **Description:** Checks inherent actions, tag-based tools (`<actionid>_tool`), and inventory items.
* **Parameters:** `action`.
* **Returns:** Boolean.

### `EntityScript:IsOnValidGround()`
* **Description:** `TheWorld.Map:IsVisualGroundAtPoint(...)`.
* **Parameters:** None.
* **Returns:** Boolean.

### `EntityScript:IsOnPassablePoint(include_water, floating_platforms_are_not_passable)`
* **Description:** `TheWorld.Map:IsPassableAtPoint(...)`.
* **Parameters:** Booleans.
* **Returns:** Boolean.

### `EntityScript:IsOnOcean(allow_boats)`
* **Description:** `TheWorld.Map:IsOceanAtPoint(...)`.
* **Parameters:** `allow_boats`.
* **Returns:** Boolean.

### `EntityScript:GetCurrentPlatform()`
* **Description:** Returns `self.platform` or parent's platform.
* **Parameters:** None.
* **Returns:** Platform entity or `nil`.

### `EntityScript:GetCurrentTileType()`
* **Description:** Approximate tile type resolution considering tile overlap (including ocean tiles).
* **Parameters:** None.
* **Returns:** Tile ID and info table.

## Events & listeners
**Listens to:**  
`actioncomponentsdirty`, `inherentactionsdirty`, `inherentsceneactiondirty`, `inherentscenealtactiondirty`, `modactioncomponentsdirty<modname>` — sync network action data on non-mastersim.

**Pushes:**  
`enterlimbo`, `exitlimbo`, `onremove`, `actionfailed`, `performaction`, `startaction`, `play_theme_music` — internal lifecycle and action events;  
`clientsideinventoryflagschanged` — pushed when an inventory image override flag is updated and `ThePlayer` exists.