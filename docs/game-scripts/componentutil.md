---
id: componentutil
title: Componentutil
description: Provides utility functions for entity state checking, tile change handling, bridge deployment, rose residue management, luck-based probability calculations, corpse conversion, impact sound selection, topology parsing, inventory tracking, and world migration logic.
tags: [utility, entities, combat, world, inventory]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 78c2d24e
system_scope: utility
---

# Componentutil

> Based on game build **714014** | Last updated: 2026-03-21

## Overview

The `componentutil` module is a comprehensive utility library that provides helper functions across multiple game systems. It handles entity state validation (death, ghost status, electric immunity), tile change management for ocean and void transitions, bridge deployment validation and execution, rose-inspectable residue and fuel creation, luck-based probability calculations with configurable formulas, corpse creation and lunar mutation logic, combat impact sound selection, topology data parsing, inventory item source tracking, hermit crab decoration area validation, set bonus verification, jousting data initialization, world migration portal location computation, and passable area testing. This component serves as a central utility hub that other components and systems depend on for common operations.

## Usage example

```lua
local ComponentUtil = require("componentutil")

-- Check if entity is dead or ghost
if ComponentUtil.IsEntityDeadOrGhost(player, true) then
    return
end

-- Apply luck-based chance modification
local base_chance = 0.5
local modified_chance = ComponentUtil.GetEntityLuckChance(player, base_chance, LuckFormulas.CommonChanceLuckAdditive(1))

-- Perform luck roll
if ComponentUtil.TryLuckRoll(player, modified_chance, LuckFormulas.CommonChanceLuckAdditive(1)) then
    SpawnPrefab("horrorfuel")
end

-- Check set bonus on entity
if ComponentUtil.EntityHasSetBonus(player, "shadowdagger") then
    player.components.skilltreeupdater:ActivateBonus("shadow_set")
end
```

## Dependencies & tags

**External dependencies:**
- `components/raindome` -- Loaded to register global functions used by RainDome component
- `components/temperatureoverrider` -- Loaded to register global functions used by TemperatureOverrider component
- `worldtiledefs` -- Required as GroundTiles; provides tile and turf definitions
- `TheWorld` -- Used as _world in multiple tile change handlers to access Map, ismastersim, and global state
- `TheSim` -- Used in FindEntities calls across multiple functions
- `TUNING` -- Used for default bridge maxlength and tuning constants
- `TILE_SCALE` -- Used in geometry calculations for tile handling
- `TWOPI` -- Used in PushAwayItemsOnBoatPlace for random angle calculation
- `MAX_PHYSICS_RADIUS` -- Used as default radius in FindVirtualOceanEntity
- `GROUND_INVISIBLETILES` -- Used in Bridge_Deploy_Raytrace to check for invisible tile adjacency
- `WORLD_TILES` -- Used in Bridge_DeployCheck_ShouldStopAtTile to exclude FARMING_SOIL
- `TileGroupManager` -- Used to query tile types
- `Vector3` -- Used to wrap shore/teleport points in TempTile handlers
- `Point` -- Used to construct offset points in bridge ray tracing
- `FindRandomPointOnShoreFromOcean` -- Used in temp ocean/void tile handlers
- `DestroyEntity` -- Used in TempTile handlers to fully destroy entities
- `Remap` -- Used in PushAwayItemsOnBoatPlace to map distance to launch delay
- `ConcatArrays` -- Used to construct SOULLESS_TARGET_TAGS
- `ThePlayer` -- Used to notify axis-aligned interval refreshes
- `STRINGS` -- Used for UI option labels in axis-aligned placement cycling
- `FRAMES` -- Used for frame-based delays
- `PI2` -- Used in random angle generation
- `FindWalkableOffset` -- Used in GetMigrationPortalLocation
- `SpawnPrefab` -- Used to spawn FX prefabs
- `Bridge_DeployCheck_Helper` -- Used in RosePoint_VineBridge_Check
- `TryLuckRoll` -- Used in OnResidueActivated_Fuel_Internal
- `LuckFormulas` -- Used for upgrade odds formulas
- `ShardPortals` -- Used in GetMigrationPortalFromMigrationData
- `WOBYCOURIER_NO_CHEST_COORD` -- Used in GetWobyCourierChestPosition
- `FOODTYPE` -- Used in HasMeatInInventoryFor_Checker
- `FUELTYPE` -- Used to build LIGHTNING_EXCLUDE_TAGS
- `AXISALIGNMENT_VALUES` -- Used for axis-aligned cycling
- `DataGrid` -- Instantiated in GetHermitCrabOccupiedGrid
- `EQUIPSLOTS` -- Used to access HEAD and BODY slot indices
- `GetGenderStrings` -- Used in GetPlayerDeathDescription
- `GetDescription` -- Used in GetPlayerDeathDescription
- `GetPhysicsRadius` -- Called on blockers for IsPointCoveredByBlocker
- `TheWorld.Map` -- Accessed for tile land queries and topology lookup
- `Math.atan2` -- Used in directional calculations
- `SPECIAL_EVENTS` -- Referenced in SpawnPerd to check active event

**Components used:**
- `inventory` -- Used for insulation check (IsInsulated) in IsEntityElectricImmune
- `inventoryitem` -- Used in HandleDugGround and TempTile handlers to inherit moisture and set landed state
- `walkableplatform` -- Used in PushAwayItemsOnBoatPlace to get platform_radius
- `amphibiouscreature` -- Checked and used in temp tile handlers to detect water-favoring entities
- `drownable` -- Checked and used in temp tile handlers to manage drowning/void-falling logic
- `stackable` -- Referenced via replica in GetStackSize
- `health` -- Referenced via replica in IsEntityDead
- `roseinspectableuser` -- Used in Decay* functions to handle residue and cooldown
- `skilltreeupdater` -- Used to check charlie upgrades and roll luck
- `vinebridgemanager` -- Required for RosePoint_VineBridge_Do and ROSEPOINT_CONFIGURATIONS
- `locomotor` -- Checked by CLOSEINSPECTORUTIL.IsValidTarget on both server and client
- `rider` -- Used by CLOSEINSPECTORUTIL.CanCloseInspect to check IsRiding on server
- `burnable` -- Used in StrikeLightningAtPoint to ignite flammable entities
- `edible` -- Used in HasMeatInInventoryFor_Checker to verify foodtype
- `roseinspectable` -- Attached and configured in MakeRoseTarget functions
- `worldmigrator` -- Used to get portal destination and activated by other
- `playerspawner` -- Used in GetMigrationPortalLocation to get default spawn point
- `riftspawner` -- Accessed via TheWorld.components.riftspawner to check lunar portal state
- `corpsepersistmanager` -- Accessed via TheWorld.components.corpsepersistmanager for corpse persistence rules
- `container` -- Referenced inside MakeComponentAnInventoryItemSource to verify container validity
- `setbonus` -- Accessed on head and body items to verify matching setname
- `luckuser` -- Used via inst.components.luckuser:GetLuck() in GetEntityLuck

**Tags:**
- `playerghost` -- check
- `electricdamageimmune` -- check
- `ignorewalkableplatforms` -- check
- `activeprojectile` -- check
- `flying` -- check
- `FX` -- check
- `DECOR` -- check
- `INLIMBO` -- check
- `herd` -- check
- `walkableplatform` -- check
- `bird` -- check
- `player` -- check
- `fireimmune` -- check
- `controlled_burner` -- check
- `character` -- check
- `locomotor` -- check
- `closeinspector` -- check
- `hidesmeats` -- check
- `smallcreature` -- check
- `NOCLICK` -- check
- `irreplaceable` -- check
- `epic` -- check
- `epiccorpse` -- check
- `largecreature` -- check
- `largecreaturecorpse` -- check
- `creaturecorpse` -- check
- `small` -- check
- `lightningblocker` -- check
- `teeteringplatform` -- check
- `noelectrocute` -- check
- `large` -- check
- `forcefield` -- check
- `sanity` -- check
- `lunarplant` -- check
- `dreadstone` -- check
- `metal` -- check
- `marble` -- check
- `shell` -- check
- `wood` -- check
- `grass` -- check
- `fur` -- check
- `cloth` -- check
- `player_damagescale` -- check
- `gestaltprotection` -- check
- `blocker` -- check
- `stone` -- check
- `clay` -- check
- `fence_electric` -- check
- `hive` -- check
- `eyeturret` -- check
- `houndmound` -- check
- `ghost` -- check
- `insect` -- check
- `spider` -- check
- `chess` -- check
- `mech` -- check
- `brightmare` -- check
- `brightmareboss` -- check
- `mound` -- check
- `shadow` -- check
- `shadowminion` -- check
- `shadowchesspiece` -- check
- `tree` -- check
- `wooden` -- check
- `veggie` -- check
- `hedge` -- check
- `rocky` -- check
- `fossil` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions

### `IsEntityDead(inst, require_health)`
* **Description:** Determines if an entity is dead by checking its health replica's IsDead() method or presence.
* **Parameters:**
  - `inst` -- Entity to check; must have health replica if require_health is true
  - `require_health` -- boolean; if true, returns true if entity lacks health replica
* **Returns:** boolean: true if dead (or missing health when required), false otherwise

### `IsEntityDeadOrGhost(inst, require_health)`
* **Description:** Checks if an entity is dead or is a ghost (playerghost tag).
* **Parameters:**
  - `inst` -- Entity to check
  - `require_health` -- boolean; passed to IsEntityDead
* **Returns:** boolean: true if dead or ghost, false otherwise

### `IsEntityElectricImmune(inst)`
* **Description:** Determines if an entity is immune to electric damage via tag or inventory insulation.
* **Parameters:**
  - `inst` -- Entity to check
* **Returns:** boolean: true if immune, false otherwise

### `GetStackSize(inst)`
* **Description:** Returns the current stack size of an entity via its stackable replica, defaulting to 1.
* **Parameters:**
  - `inst` -- Entity to check for stackable component
* **Returns:** number: stack size

### `HandleDugGround(dug_ground, x, y, z)`
* **Description:** Spawns a turf prefab if the dug_ground tile has a defined turf, or spawns a sinkhole FX otherwise.
* **Parameters:**
  - `dug_ground` -- string or table; tile name or info used to look up turf
  - `x` -- number; X world coordinate
  - `y` -- number; Y world coordinate
  - `z` -- number; Z world coordinate
* **Returns:** nil

### `FindVirtualOceanEntity(x, y, z, r)`
* **Description:** Finds the first virtual ocean entity within the given radius where the point lies inside its physics radius.
* **Parameters:**
  - `x` -- number; X center coordinate
  - `y` -- number; Y center coordinate (usually 0)
  - `z` -- number; Z center coordinate
  - `r` -- number or nil; search radius (defaults to MAX_PHYSICS_RADIUS)
* **Returns:** Entity or nil

### `PushAwayItemsOnBoatPlace(inst)`
* **Description:** Pushes away items and entities standing on the platform when a boat is deployed, using delayed physics launches.
* **Parameters:**
  - `inst` -- Entity (boat) that just placed; must have walkableplatform component
* **Returns:** nil

### `TempTile_HandleTileChange_Ocean(x, y, z)`
* **Description:** Handles entities on an ocean tile when the tile changes to ocean, triggering drown/walk-off logic and launching items.
* **Parameters:**
  - `x` -- number; tile X coordinate
  - `y` -- number; tile Y coordinate
  - `z` -- number; tile Z coordinate
* **Returns:** nil

### `TempTile_HandleTileChange_Ocean_Warn(x, y, z)`
* **Description:** Sends 'abandon_ship' and 'onpresink' events to players on temporary tiles before actual tile removal.
* **Parameters:**
  - `x` -- number; tile X coordinate
  - `y` -- number; tile Y coordinate
  - `z` -- number; tile Z coordinate
* **Returns:** nil

### `TempTile_HandleTileChange_Void(x, y, z)`
* **Description:** Handles entities on an invalid (void) tile when removed, triggering void-fall logic and teleporting drowning entities.
* **Parameters:**
  - `x` -- number; tile X coordinate
  - `y` -- number; tile Y coordinate
  - `z` -- number; tile Z coordinate
* **Returns:** nil

### `TempTile_HandleTileChange_Void_Warn(x, y, z)`
* **Description:** Sends 'onprefallinvoid' events to entities on temporary void tiles before removal.
* **Parameters:**
  - `x` -- number; tile X coordinate
  - `y` -- number; tile Y coordinate
  - `z` -- number; tile Z coordinate
* **Returns:** nil

### `TempTile_HandleTileChange(x, y, z, tile)`
* **Description:** Dispatches to ocean or void handlers based on tile group type.
* **Parameters:**
  - `x` -- number; tile X coordinate
  - `y` -- number; tile Y coordinate
  - `z` -- number; tile Z coordinate
  - `tile` -- string; tile identifier
* **Returns:** nil

### `TempTile_HandleTileChange_Warn(x, y, z, tile)`
* **Description:** Dispatches to warning handlers for ocean or void tiles before removal.
* **Parameters:**
  - `x` -- number; tile X coordinate
  - `y` -- number; tile Y coordinate
  - `z` -- number; tile Z coordinate
  - `tile` -- string; tile identifier
* **Returns:** nil

### `Bridge_DeployCheck_Helper(inst, pt, options)`
* **Description:** Validates bridge placement by raytracing from a tile center point to find valid land targets.
* **Parameters:**
  - `inst` -- Entity attempting bridge deployment
  - `pt` -- Point (x,y,z) to test deployment
  - `options` -- table or nil; optional overrides for max length, tile validation, etc.
* **Returns:** boolean, spots table or false

### `DecayCharlieResidueAndGoOnCooldownIfItExists(inst)`
* **Description:** Immediately decays rose residue and sets cooldown if component exists.
* **Parameters:**
  - `inst` -- Entity that may have roseinspectableuser component
* **Returns:** nil

### `DecayCharlieResidueIfItExists(inst)`
* **Description:** Immediately decays rose residue if component exists, without setting cooldown.
* **Parameters:**
  - `inst` -- Entity that may have roseinspectableuser component
* **Returns:** nil

### `OnFuelPresentation3(inst)`
* **Description:** Returns the inst to scene and drops it as an inventory item.
* **Parameters:**
  - `inst` -- Entity instance that triggered the fuel presentation; used to return to scene and drop item
* **Returns:** nil

### `OnFuelPresentation2(inst, x, z, upgraded)`
* **Description:** Spawns a shadow_puff or shadow_puff_solid FX at (x,0,z) and schedules OnFuelPresentation3 after 3 frames.
* **Parameters:**
  - `inst` -- Entity instance; passed for timing context
  - `x` -- X coordinate for shadow_puff spawn
  - `z` -- Z coordinate for shadow_puff spawn
  - `upgraded` -- Boolean indicating if the fuel is upgraded (horrorfuel vs nightmarefuel)
* **Returns:** nil

### `OnFuelPresentation1(inst, x, z, upgraded)`
* **Description:** Spawns charlie_snap or charlie_snap_solid FX at (x,2,z) and schedules OnFuelPresentation2 after 25 frames.
* **Parameters:**
  - `inst` -- Entity instance; passed for timing context
  - `x` -- X coordinate for charlie_snap spawn
  - `z` -- Z coordinate for charlie_snap spawn
  - `upgraded` -- Boolean indicating if the fuel is upgraded
* **Returns:** nil

### `OnResidueActivated_Fuel_Internal(inst, doer, odds)`
* **Description:** Calculates if upgraded fuel should spawn using skilltreeupdater and luck; spawns nightmarefuel or horrorfuel offset from inst position; schedules FX chain.
* **Parameters:**
  - `inst` -- Target entity where fuel is spawned (residue target)
  - `doer` -- Doer entity (typically player); used to check skilltreeupdater and LuckRoll
  - `odds` -- Float probability threshold used in TryLuckRoll to decide upgrade
* **Returns:** nil

### `OnResidueActivated_Fuel(inst, doer)`
* **Description:** Wrapper calling OnResidueActivated_Fuel_Internal with standard upgrade odds from TUNING.
* **Parameters:**
  - `inst` -- Target entity where fuel is spawned
  - `doer` -- Doer entity (player); used for skill/lottery checks
* **Returns:** nil

### `OnResidueActivated_Fuel_IncreasedHorror(inst, doer)`
* **Description:** Wrapper calling OnResidueActivated_Fuel_Internal with increased upgrade odds from TUNING.
* **Parameters:**
  - `inst` -- Target entity where fuel is spawned
  - `doer` -- Doer entity (player); used for skill/lottery checks
* **Returns:** nil

### `MakeRoseTarget_CreateFuel(inst)`
* **Description:** Attaches the roseinspectable component and sets OnResidueActivated to create standard nightmare/horror fuel.
* **Parameters:**
  - `inst` -- Entity instance to attach roseinspectable component and configure fuel hook
* **Returns:** nil

### `MakeRoseTarget_CreateFuel_IncreasedHorror(inst)`
* **Description:** Attaches the roseinspectable component and sets OnResidueActivated to create increased-horror fuel variant.
* **Parameters:**
  - `inst` -- Entity instance to attach roseinspectable component and configure increased horror fuel hook
* **Returns:** nil

### `IsValidTileForVineBridgeAtPoint_Wrapper(_map, x, y, z)`
* **Description:** Wrapper to call _map:IsValidTileForVineBridgeAtPoint.
* **Parameters:**
  - `_map` -- Map table with vine bridge checks
  - `x` -- X coordinate
  - `y` -- Y coordinate (height)
  - `z` -- Z coordinate
* **Returns:** Boolean result of map query

### `CanDeployVineBridgeAtPoint_Wrapper(_map, x, y, z)`
* **Description:** Wrapper to call _map:CanDeployVineBridgeAtPoint.
* **Parameters:**
  - `_map` -- Map table with vine bridge checks
  - `x` -- X coordinate
  - `y` -- Y coordinate (height)
  - `z` -- Z coordinate
* **Returns:** Boolean result of map query

### `RosePoint_VineBridge_Check(inst, pt)`
* **Description:** Calls Bridge_DeployCheck_Helper with vine bridge options.
* **Parameters:**
  - `inst` -- Entity instance performing the check
  - `pt` -- Point Vector3 to test for vine bridge placement
* **Returns:** Boolean indicating if placement is valid

### `RosePoint_VineBridge_Do(inst, pt, spots)`
* **Description:** Queues creation and destruction of vine bridges for each spot using vinebridgemanager.
* **Parameters:**
  - `inst` -- Entity instance performing the deployment
  - `pt` -- Point Vector3 (unused in this function body)
  - `spots` -- Array of points with x,y,z and direction; each spot schedules vine bridge creation and destruction
* **Returns:** true

### `HasMeatInInventoryFor_Checker(item)`
* **Description:** Predicate to verify item is edible meat and not a smallcreature.
* **Parameters:**
  - `item` -- Inventory item entity to check
* **Returns:** Boolean

### `HasMeatInInventoryFor(inst)`
* **Description:** Returns true if inst has edible meat in inventory and isn't hiding meat (hidesmeats tag).
* **Parameters:**
  - `inst` -- Entity instance (typically player) to check inventory of
* **Returns:** Boolean

### `SetDesiredMaxTakeCountFunction(prefab, callback)`
* **Description:** Registers a custom count function for items being taken into a player inventory.
* **Parameters:**
  - `prefab` -- String prefab name
  - `callback` -- Function accepting (doer, target) and returning desired count
* **Returns:** nil

### `GetDesiredMaxTakeCountFunction(prefab)`
* **Description:** Retrieves a previously registered custom take count function.
* **Parameters:**
  - `prefab` -- String prefab name
* **Returns:** Function or nil

### `IsFoodSourcePickable(inst)`
* **Description:** Returns true if inst is a pickable and its product is in the whitelist of food products.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** Boolean

### `GetWobyCourierChestPosition(inst)`
* **Description:** Returns stored chest coordinates or nil if not set or invalid.
* **Parameters:**
  - `inst` -- Entity instance with woby_commands_classified
* **Returns:** Number, Number or nil, nil

### `UpdateAxisAlignmentValues(intervals)`
* **Description:** Updates axis-aligned placement tuning and notifies local player of refresh.
* **Parameters:**
  - `intervals` -- Float interval used for axis-aligned placement grid; updated in TUNING
* **Returns:** nil

### `CycleAxisAlignmentValues()`
* **Description:** Cycles through AXISALIGNMENT_VALUES table, updates TUNING, and notifies client.
* **Parameters:** None
* **Returns:** nil

### `GetMigrationPortalFromMigrationData(migrationdata)`
* **Description:** Finds and returns a portal entity matching worldid/portalid from ShardPortals.
* **Parameters:**
  - `migrationdata` -- Table with worldid and portalid fields
* **Returns:** Entity or nil

### `GetMigrationPortalLocation(ent, migrationdata, portaloverride)`
* **Description:** Computes spawn location near a portal, at saved coords, or default spawn point.
* **Parameters:**
  - `ent` -- Entity being migrated
  - `migrationdata` -- Migration data containing worldid, portalid, or destination coordinates
  - `portaloverride` -- Optional portal entity to use instead of lookup
* **Returns:** Number, Number, Number

### `ClearSpotForRequiredPrefabAtXZ(x, z, r)`
* **Description:** Finds and destroys entities at position that prevent placement, ignoring entities with CLEARSPOT_CANT_TAGS.
* **Parameters:**
  - `x` -- X coordinate center
  - `z` -- Z coordinate center
  - `r` -- Additional radius padding
* **Returns:** nil

### `GetCombatFxSize(ent)`
* **Description:** Returns radius, size string, and height string appropriate for combat/FX (small/med/large, low/high).
* **Parameters:**
  - `ent` -- Entity to size FX for
* **Returns:** Number, String, String?

### `GetElectrocuteFxAnim(sz, ht)`
* **Description:** Returns animation name based on size and height (e.g., shock_small_low).
* **Parameters:**
  - `sz` -- Size string (tiny/small/med/large)
  - `ht` -- Height string (low/high) or nil
* **Returns:** String

### `CanEntityBeElectrocuted(inst)`
* **Description:** Returns true if the entity's stategraph supports electrocution and it is not marked noelectrocute.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Boolean

### `CalcEntityElectrocuteDuration(inst, override)`
* **Description:** Returns electrocution duration considering per-entity, burn_on_electrocute, and override.
* **Parameters:**
  - `inst` -- Entity instance
  - `override` -- Optional numeric override duration
* **Returns:** Number

### `SpawnElectricHitSparks(inst, target, flash)`
* **Description:** Spawns electrichitsparks or electricimmune variant aligned to target.
* **Parameters:**
  - `inst` -- Source entity (may be nil)
  - `target` -- Target entity (may be nil)
  - `flash` -- Boolean indicating if flash effect is needed
* **Returns:** nil
* **Error states:** Early return if inst or target invalid

### `LightningStrikeAttack(inst)`
* **Description:** Applies lightning damage based on wetness, and triggers electrocute stategraph event; returns false if immune.
* **Parameters:**
  - `inst` -- Entity struck by lightning
* **Returns:** Boolean: true if damage applied, false if immune
* **Error states:** Returns false if immune or already in noelectrocute state

### `StrikeLightningAtPoint(strike_prefab, hit_player, x, y, z)`
* **Description:** Performs AOE lightning strike at point: electrocutes eligible entities, ignites flammable objects.
* **Parameters:**
  - `strike_prefab` -- Lightning prefab name; if 'lightning', AOE is applied
  - `hit_player` -- Boolean indicating if the primary target is a player
  - `x` -- X center
  - `y` -- Y center
  - `z` -- Z center
* **Returns:** nil
* **Error states:** No AOE applied if strike_prefab is not 'lightning'

### `GetActionPassableTestFnAt(x, y, z)`
* **Description:** Returns an appropriate passability test function (e.g., for platform, arena, vault) or default map passable.
* **Parameters:**
  - `x` -- X coordinate
  - `y` -- Y coordinate
  - `z` -- Z coordinate
* **Returns:** Function, Boolean

### `GetActionPassableTestFn(inst)`
* **Description:** Convenience wrapper to call GetActionPassableTestFnAt at inst's position.
* **Parameters:**
  - `inst` -- Entity instance; uses its world position
* **Returns:** Function, Boolean

### `EntityHasCorpse(inst)`
* **Description:** Returns true if entity has corpse state and nocorpse flag is not set.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Boolean

### `CanEntityBeGestaltMutated(inst)`
* **Description:** Returns true if entity can undergo gestalt mutation based on stategraph and tuning.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Boolean

### `CanEntityBeNonGestaltMutated(inst)`
* **Description:** Returns true if entity can undergo non-gestalt lunar mutation.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Boolean

### `GetLunarPreRiftMutationChance(inst)`
* **Description:** Returns base mutation chance multiplied by lunacy area modifier.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Number

### `GetLunarRiftMutationChance(inst)`
* **Description:** Returns gestalt_possession_chance or 1.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Number

### `CanLunarPreRiftMutateFromCorpse(inst)`
* **Description:** Runs full pre-ritual mutation checks and caches result; returns true if mutation succeeds.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** Boolean
* **Error states:** Returns false if in water, burning, or luck roll fails; uses cached result if available

### `CanLunarRiftMutateFromCorpse(inst)`
* **Description:** Determines if an entity can mutate into a lunar rift gestalt corpse based on Tuning, rift state, burn status, and luck roll.
* **Parameters:**
  - `inst` -- Entity to check for rift mutation; must pass EntityHasCorpse and be burnable/non-burning, not on ocean, and valid for gestalt mutation
* **Returns:** boolean: true if rift mutation is possible, false otherwise
* **Error states:** Returns early false for invalid candidates, burning entities, ocean positions, or if cached result exists; uses cached result if present.

### `CanEntityBecomeCorpse(inst)`
* **Description:** Checks whether an entity can become a corpse, considering forced corpses, burnable status, persistence rules, and lunar mutations.
* **Parameters:**
  - `inst` -- Entity to check for corpse conversion eligibility
* **Returns:** boolean: true if entity can become a corpse, false otherwise
* **Error states:** Returns false early if EntityHasCorpse fails or entity is burning.

### `TryEntityToCorpse(inst, corpseprefab)`
* **Description:** Converts an entity into a corpse prefab if eligible, preserving position, rotation, scale, animations, loot, and save data; removes burnable component if original lacked it.
* **Parameters:**
  - `inst` -- Source entity to convert into a corpse
  - `corpseprefab` -- Prefab name of the corpse to spawn
* **Returns:** Entity or nil: spawned corpse or nil if conversion not possible
* **Error states:** Returns nil if CanEntityBecomeCorpse fails.

### `CanApplyPlayerDamageMod(target)`
* **Description:** Checks if the target is a player or has the player_damagescale tag.
* **Parameters:**
  - `target` -- Target entity to evaluate for damage scaling
* **Returns:** boolean
* **Error states:** Returns false if target is nil.

### `PlayerDamageMod(target, damage, mod)`
* **Description:** Applies a damage multiplier to the target if eligible, otherwise returns raw damage.
* **Parameters:**
  - `target` -- Entity receiving damage
  - `damage` -- Raw damage value
  - `mod` -- Multiplier applied if CanApplyPlayerDamageMod(target) is true
* **Returns:** number: modified damage or original damage
* **Error states:** Returns original damage if target cannot be modified.

### `GetArmorImpactSound(inventory, weaponmod)`
* **Description:** Selects an armor impact sound based on the highest-priority armor tag found in the inventory's armor slots.
* **Parameters:**
  - `inventory` -- Inventory component used to query armor tags
  - `weaponmod` -- Weapon impact modifier (e.g., 'dull', 'sharp'), defaults to 'dull'
* **Returns:** string or nil: path to sound file or nil if no matching armor tag found
* **Error states:** Returns nil if no armor with a known tag is equipped.

### `GetWallImpactSound(inst, weaponmod)`
* **Description:** Returns a wall impact sound based on wall tags: grass, stone, marble, fence_electric, or default wood.
* **Parameters:**
  - `inst` -- Wall entity being hit
  - `weaponmod` -- Weapon impact modifier, defaults to 'dull'
* **Returns:** string: path to impact sound
* **Error states:** Defaults to wood if none of the tags match.

### `GetObjectImpactSound(inst, weaponmod)`
* **Description:** Returns an object impact sound based on clay or stone tags, defaulting to generic object.
* **Parameters:**
  - `inst` -- Object entity being hit
  - `weaponmod` -- Weapon impact modifier, defaults to 'dull'
* **Returns:** string: path to impact sound
* **Error states:** Falls back to 'object_' if no tag matches.

### `GetCreatureImpactSound(inst, weaponmod)`
* **Description:** Returns a creature impact sound based on tags, size, wetness, and optional override_combat_impact_sound.
* **Parameters:**
  - `inst` -- Creature entity being hit
  - `weaponmod` -- Weapon impact modifier, defaults to 'dull'
* **Returns:** string: path to impact sound
* **Error states:** Defaults to 'flesh_' and size prefix if no tag match.

### `SplitTopologyId(s)`
* **Description:** Splits a topology ID string on ':' or '/' delimiters into a list of components.
* **Parameters:**
  - `s` -- Topology ID string in format 'task/index/room' or 'StaticLayoutIsland/layout'
* **Returns:** table: array of string segments

### `ConvertTopologyIdToData(idname)`
* **Description:** Parses a topology ID string into structured data: layout_id, task_id, index_id, and room_id.
* **Parameters:**
  - `idname` -- Topology ID string
* **Returns:** table: mapping of topology components to keys; returns empty table if idname is nil
* **Error states:** Returns `{task_id = 'START'}` for 'START' input; layout-only IDs parsed differently.

### `GetPlayerDeathDescription(inst, viewer)`
* **Description:** Generates a localized death description string for a player corpse using saved metadata and viewer context.
* **Parameters:**
  - `inst` -- Corpse instance with char, playername, pkname, and cause fields
  - `viewer` -- Entity or string identifier of the viewer (e.g., 'waxwell', 'waxwell', or 'waxwell')
* **Returns:** string or nil: formatted death description string or nil if invalid
* **Error states:** Returns nil if inst.char is nil or viewer is a playerghost; normalizes unknown/moose causes and temporary translations.

### `GetTopologyDataAtPoint(x, y, z)`
* **Description:** Retrieves topology ID at world coordinates, then parses it into structured data.
* **Parameters:**
  - `x` -- X coordinate or Vector3
  - `y` -- Y coordinate (defaults to 0 if z missing)
  - `z` -- Z coordinate (optional)
* **Returns:** table: result of ConvertTopologyIdToData for the found ID
* **Error states:** Returns empty table if GetTopologyIDAtPoint returns nil.

### `GetTopologyDataAtInst(inst)`
* **Description:** Calls GetTopologyDataAtPoint using the entity's world position.
* **Parameters:**
  - `inst` -- Entity with Transform component to query position from
* **Returns:** table: structured topology data

### `MakeComponentAnInventoryItemSource(cmp, owner)`
* **Description:** Attaches item source tracking callbacks to the component for onputininventory, ondropped, and onremove events.
* **Parameters:**
  - `cmp` -- Component table to extend with item source tracking methods
  - `owner` -- Owner entity for initial state; defaults to cmp.inst
* **Returns:** nil

### `RemoveComponentInventoryItemSource(cmp, owner)`
* **Description:** Removes item source event callbacks and resets tracked fields on the component.
* **Parameters:**
  - `cmp` -- Component with previously attached item source callbacks
  - `owner` -- Owner entity used during MakeComponentAnInventoryItemSource
* **Returns:** nil

### `GetHermitCrabOccupiedGrid(x, z)`
* **Description:** Calculates up to MAX_TILES ocean tiles around a point, excluding shore-surrounded tiles and limited to MAX_SHORELINE_TILES shoreline iterations.
* **Parameters:**
  - `x` -- Center X tile coordinate of pearl placement
  - `z` -- Center Z tile coordinate of pearl placement
* **Returns:** DataGrid: grid of tiles considered occupied for hermit crab decoration scoring
* **Error states:** May return fewer than MAX_TILES if less valid tiles exist.

### `IsInValidHermitCrabDecorArea(inst)`
* **Description:** Verifies the entity is not on HermitcrabIsland, MonkeyIsland, or Moon Island layouts.
* **Parameters:**
  - `inst` -- Entity to test; must have a position within the world map
* **Returns:** boolean: true if decor area is valid, false otherwise
* **Error states:** Returns false for known invalid layouts; relies on GetTopologyDataAtInst.

### `IsEntityGestaltProtected(inst)`
* **Description:** Checks for gestaltprotection equipment in head/body slots or active 'hermitcrabtea_moon_tree_blossom_buff' debuff.
* **Parameters:**
  - `inst` -- Entity to check for gestalt protection
* **Returns:** boolean
* **Error states:** Returns false if inventory component is missing or no protection found.

### `IsPointCoveredByBlocker(x, y, z, extra_radius)`
* **Description:** Finds any entity with the blocker tag within the specified radius and checks if it covers the point.
* **Parameters:**
  - `x` -- X world coordinate
  - `y` -- Y world coordinate (unused; always 0)
  - `z` -- Z world coordinate
  - `extra_radius` -- Additional radius margin; defaults to 0
* **Returns:** boolean or nil: true if covered, otherwise nil

### `EntityHasSetBonus(inst, setname)`
* **Description:** Verifies that both head and body inventory slots contain items with matching setbonus.setname.
* **Parameters:**
  - `inst` -- Entity to check for set bonus items
  - `setname` -- Expected set name shared by head and body items
* **Returns:** boolean
* **Error states:** Returns false if inventory is missing, equipment slots are nil, or setbonus components are absent.

### `CreatingJoustingData(inst)`
* **Description:** Initializes jousting data structure with direction and joustsource source item if available.
* **Parameters:**
  - `inst` -- Entity performing jousting action
* **Returns:** table: joustdata with dir and optional source
* **Error states:** Defaults direction to inst's rotation if no target is valid.

### `CommonChanceLuckAdditive(mult)`
* **Description:** Returns a function that adds luck*mult to chance only when luck > 0.
* **Parameters:**
  - `mult` -- Multiplier applied to positive luck for additive bonus
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if `luck <= 0.`

### `CommonChanceUnluckMultAndLuckHyperbolic(reciprocal, mult)`
* **Description:** Returns a function that multiplies chance by a hyperbolic expression for positive luck, or by (1+|luck|*mult) for negative luck.
* **Parameters:**
  - `reciprocal` -- Reciprocal constant for hyperbolic luck curve
  - `mult` -- Multiplier applied to negative luck for multiplicative penalty
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if luck == 0.

### `CommonChanceLuckHyperbolic(mult_max, reciprocal, subtract)`
* **Description:** Returns a function that applies a hyperbolic curve for positive luck.
* **Parameters:**
  - `mult_max` -- Upper bound multiplier in hyperbolic formula
  - `reciprocal` -- Reciprocal constant
  - `subtract` -- Offset subtracted from luck before computation
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if `luck <= 0.`

### `CommonChanceUnluckHyperbolicAndLuckMult(reciprocal, mult)`
* **Description:** Returns a function that uses a hyperbolic penalty for negative luck and linear growth for positive luck.
* **Parameters:**
  - `reciprocal` -- Reciprocal constant for negative luck multiplier
  - `mult` -- Multiplier applied to positive luck
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if luck == 0.

### `CommonChanceUnluckHyperbolicAndLuckAdditive(reciprocal, mult)`
* **Description:** Returns a function that uses a hyperbolic penalty for negative luck and additive bonus for positive luck.
* **Parameters:**
  - `reciprocal` -- Reciprocal constant for negative luck curve
  - `mult` -- Additive multiplier for positive luck
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if luck == 0.

### `CommonChanceUnluckHyperbolicAndLuckHyperbolic(mult_max, asymptote, subtract, reciprocal)`
* **Description:** Returns a function using hyperbolic penalties for negative and positive luck with shared offset.
* **Parameters:**
  - `mult_max` -- Maximum multiplier for negative luck
  - `asymptote` -- Asymptote constant for negative luck hyperbolic
  - `subtract` -- Offset for both luck polarities
  - `reciprocal` -- Reciprocal constant for positive luck hyperbolic
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if luck == 0.

### `CommonChanceLuckHyperbolicLower(reciprocal)`
* **Description:** Returns a function that applies a lower-bounded hyperbolic curve only for positive luck.
* **Parameters:**
  - `reciprocal` -- Reciprocal constant for hyperbolic formula
* **Returns:** function(inst, chance, luck): modified chance
* **Error states:** Returns original chance if `luck <= 0.`

### `GetEntityLuck(inst)`
* **Description:** Retrieves the effective luck value of an entity by calling GetLuck() on its luckuser component, or 0 if no luckuser exists.
* **Parameters:**
  - `inst` -- Entity: the instance to query for luck component
* **Returns:** number: the entity's luck value (may be negative or positive)

### `GetLuckChance(luck, chance, formula)`
* **Description:** Applies a given luck formula to a base chance using a provided luck value, returning the modified chance or the original chance if formula returns nil.
* **Parameters:**
  - `luck` -- number: raw luck value (e.g., sum across entities)
  - `chance` -- number: base chance to modify
  - `formula` -- function: a formula function accepting (inst?, chance, luck) and returning a modified chance
* **Returns:** number: effective chance after applying formula, or original chance

### `GetEntityLuckChance(inst, chance, formula)`
* **Description:** Computes chance modification for a single entity by retrieving its luck via GetEntityLuck and passing it to the formula.
* **Parameters:**
  - `inst` -- Entity: entity whose luck is used to modify chance
  - `chance` -- number: base chance to modify
  - `formula` -- function: a formula function accepting (inst?, chance, luck) and returning a modified chance
* **Returns:** number: effective chance after applying formula, or original chance

### `GetEntitiesLuckChance(instances, chance, formula)`
* **Description:** Sums luck values across multiple entities and applies the formula to compute a combined modified chance.
* **Parameters:**
  - `instances` -- table: list or map of entities whose luck values are summed
  - `chance` -- number: base chance to modify
  - `formula` -- function: a formula function accepting (inst?, chance, luck) and returning a modified chance
* **Returns:** number: effective chance after applying formula, or original chance

### `TryLuckRoll(inst, chance, formula)`
* **Description:** Performs a probabilistic luck roll: compares a random number against base or luck-modified chance. When inst is provided, may trigger lucky/unlucky visual effects via DoLuckyEffect (commented out currently).
* **Parameters:**
  - `inst` -- Entity? (optional): entity whose luck modifies the roll; can be nil
  - `chance` -- number: base probability of success (0–1)
  - `formula` -- function: luck formula function used to adjust chance
* **Returns:** boolean: true if roll succeeds, false otherwise
* **Error states:** Effect triggering (DoLuckyEffect) is commented out; success condition logic partially obfuscated.

### `DoLuckyEffect(inst, is_lucky)`
* **Description:** Queues a visual luck effect on the player's client by forcing the playluckeffect netvar dirty and setting it to is_lucky. Only affects entities with a player_classified component.
* **Parameters:**
  - `inst` -- Entity: player entity whose client-side netvar is updated
  - `is_lucky` -- boolean: whether the effect is lucky (true) or unlucky (false)
* **Returns:** nil

## Events & listeners

**Listens to:**
- `onputininventory` -- Called when the component's owner entity is placed into an inventory (used for tracking item source owner)
- `ondropped` -- Called when the component's owner entity is dropped from inventory (used for cleanup)
- `onremove` -- Called when the component's owner entity is removed (used for cleanup)

**Pushes:**
- `on_no_longer_landed` -- Pushed by inventoryitem:SetLanded when entity leaves landed state
- `on_landed` -- Pushed by inventoryitem:SetLanded when entity enters landed state
- `flyaway` -- Pushed to birds in PushAwayItemsOnBoatPlace to trigger flight
- `onsink` -- Pushed to entities during ocean tile changes
- `abandon_ship` -- Pushed to entities during ocean temp tile removal
- `onpresink` -- Pushed to players before ocean tile sink
- `onfallinvoid` -- Pushed to entities during void temp tile removal
- `onprefallinvoid` -- Pushed before void tile removal
- `healthdelta` -- Pushed by Health:DoDelta to notify listeners of health changes
- `ondropped` -- Pushed by InventoryItem:OnDropped after dropping item
- `migration_activate_other` -- Pushed by WorldMigrator:ActivatedByOther when activated by another entity
- `electrocute` -- Pushed immediately by LightningStrikeAttack to trigger electrocute stategraph
- `refreshaxisalignedplacementintervals` -- Pushed by local player when axis-aligned placement intervals are updated