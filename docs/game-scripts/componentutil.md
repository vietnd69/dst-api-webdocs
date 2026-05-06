---
id: componentutil
title: Componentutil
description: A comprehensive utility module providing helper functions for entity state validation, tile transition handling, bridge deployment, combat effects, lightning mechanics, luck calculations, and mutation logic across multiple game systems.
tags: [utility, entities, combat, environment, luck]
sidebar_position: 10

last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: 31ded6c4
system_scope: entity
---

# Componentutil

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`componentutil.lua` is a standalone utility module that exports a comprehensive collection of helper functions used throughout the game's systems. It provides entity state checking utilities (`IsEntityDead`, `IsEntityElectricImmune`), tile transition handlers for ocean and void boundaries, vine bridge deployment validation, Charlie residue management, and rose point fuel configurations. The module also includes combat-related utilities for electrocution logic, lightning strikes, impact sound determination, and combat FX sizing. Additional functions handle inventory operations, luck-based chance calculations, lunar mutation logic, corpse transformation, socketable item helpers, and various spatial queries for migration portals and passable ground tests. This file is required by multiple components and systems that need shared utility functionality without duplicating code.

## Usage example
```lua
require "componentutil"

-- Check if an entity is dead or in ghost state
local isDead = IsEntityDeadOrGhost(inst)

-- Calculate luck-based chance for an entity
local chance = GetEntityLuckChance(inst, 0.5, LuckFormulas.CriticalStrike)

-- Get impact sound based on creature size
local sound = GetCreatureImpactSound(inst)

-- Check if entity has a set bonus equipped
local hasBonus = EntityHasSetBonus(inst, "setname")
```

## Dependencies & tags

**External dependencies:**
- `components/raindome` -- Required to load global functions for rain dome queries
- `components/temperatureoverrider` -- Required to load global functions for temperature queries
- `worldtiledefs` -- Required as GroundTiles for turf name lookup
- `TheSim` -- Used for FindEntities queries
- `TheWorld` -- Used for ismastersim check and Map component access
- `TILE_SCALE` -- Global constant for tile dimension calculations
- `TUNING` -- Accessed for ROPEBRIDGE_LENGTH_TILES constant
- `TileGroupManager` -- Used for tile type checking (IsOceanTile, IsInvalidTile, IsLandTile, etc.)
- `GROUND_INVISIBLETILES` -- Table for checking invisible tile types
- `WORLD_TILES` -- Used for FARMING_SOIL tile comparison
- `MAX_PHYSICS_RADIUS` -- Default search radius for entity queries
- `TWOPI` -- Constant for random angle calculation
- `Vector3` -- Used for position vector creation
- `Point` -- Used for position point creation
- `ConcatArrays` -- Used to combine tag arrays
- `Launch2` -- Called to launch items away from boat
- `Remap` -- Used to calculate launch delay based on distance
- `DestroyEntity` -- Called to destroy entities on tile change
- `FindRandomPointOnShoreFromOcean` -- Called to find shore teleport point
- `ThePlayer` -- Pushed refreshaxisalignedplacementintervals event when exists
- `STRINGS` -- Accessed for UI.OPTIONS axis-aligned placement text labels
- `FOODTYPE` -- Referenced for MEAT foodtype in inventory checker
- `FUELTYPE` -- Iterated for lightning exclude tags generation
- `ShardPortals` -- Iterated to find migration portal by worldid and portalid
- `FRAMES` -- Used for frame-based task timing in fuel presentation
- `PI2` -- Used for random angle calculation in fuel spawn positioning
- `SpawnPrefab` -- Called for FX, fuel, and lightning spawn
- `FindWalkableOffset` -- Called to find valid spawn offset near migration portal
- `TryLuckRoll` -- Called with LuckFormulas.ResidueUpgradeFuel for skill upgrade chance
- `FunctionOrValue` -- Called to resolve lunar mutation chance from entity or default
- `DataGrid` -- Create grid data structures in GetHermitCrabOccupiedGrid
- `EQUIPSLOTS` -- Access HEAD and BODY slot constants in EntityHasSetBonus
- `SPECIAL_EVENTS` -- Used in SpawnPerd formula to check for Year of the Gobbler event
- `IsSpecialEventActive` -- Called to check if special events are active
- `TWOTHIRDS` -- Constant used in luck formula calculations

**Components used:**
- `health` -- Accessed via inst.replica.health for death checking
- `inventory` -- Checked for insulation via IsInsulated()
- `inventoryitem` -- InheritWorldWetnessAtXZ and SetLanded called for item handling
- `walkableplatform` -- platform_radius accessed for boat placement
- `amphibiouscreature` -- Checked for nil to exclude from drowning logic
- `drownable` -- Checked for drowning handling on tile changes
- `roseinspectableuser` -- ForceDecayResidue and GoOnCooldown called for Charlie residue
- `stategraph` -- Accessed via inst.sg for abyss_fall state check
- `roseinspectable` -- Added to inst for residue activation callbacks
- `vinebridgemanager` -- Accessed via TheWorld.components for queueing vine bridge creation/destruction
- `rider` -- Checked for IsRiding in close inspector validation
- `edible` -- Checked for foodtype in meat inventory checker
- `pickable` -- Checked for product in food source detection
- `burnable` -- Called Ignite for lightning-induced burning
- `worldmigrator` -- Accessed for portal migration and ActivatedByOther call
- `playerspawner` -- Called GetAnySpawnPoint for default migration location
- `locomotor` -- Checked in close inspector target validation
- `setbonus` -- Check setname property in EntityHasSetBonus
- `joustsource` -- Check source component in CreatingJoustingData
- `container` -- Check container component in storeincontainer helper
- `riftspawner` -- Access via TheWorld.components.riftspawner in CanLunarRiftMutateFromCorpse
- `corpsepersistmanager` -- Access via TheWorld.components.corpsepersistmanager in CanEntityBecomeCorpse
- `luckuser` -- Accessed via inst.components.luckuser to get entity luck value
- `socketable` -- Added and configured for socketable items
- `socketholder` -- Checked and used for socket validation and insertion
- `useabletargeteditem` -- Configured with custom onusefn for socket holder interactions
- `itemmimic` -- Checked to determine if item is a mimic
- `socket_shadow_mimicry` -- Checked on user to determine mimic revelation
- `player_classified` -- Accessed to set playluckeffect netvar for visual feedback

**Tags:**
- `playerghost` -- check
- `electricdamageimmune` -- check
- `virtualocean` -- check
- `INLIMBO` -- check
- `ignorewalkableplatforms` -- check
- `activeprojectile` -- check
- `flying` -- check
- `FX` -- check
- `DECOR` -- check
- `herd` -- check
- `walkableplatform` -- check
- `bird` -- check
- `structure` -- check
- `wall` -- check
- `balloon` -- check
- `groundspike` -- check
- `smashable` -- check
- `veggie` -- check
- `deck_of_cards` -- check
- `soulless` -- check
- `chess` -- check
- `shadow` -- check
- `shadowcreature` -- check
- `shadowminion` -- check
- `shadowchesspiece` -- check
- `ignorewalkableplatformdrowning` -- check
- `player` -- check
- `cave` -- check
- `character` -- check
- `locomotor` -- check
- `smallcreature` -- check
- `smallcreaturecorpse` -- check
- `small` -- check
- `epic` -- check
- `epiccorpse` -- check
- `largecreature` -- check
- `largecreaturecorpse` -- check
- `large` -- check
- `creaturecorpse` -- check
- `lightningblocker` -- check
- `fence` -- check
- `plant` -- check
- `_inventoryitem` -- check
- `bush` -- check
- `pickable` -- check
- `teeteringplatform` -- check
- `hidesmeats` -- check
- `closeinspector` -- check
- `player_damagescale` -- check
- `grass` -- check
- `stone` -- check
- `marble` -- check
- `fence_electric` -- check
- `clay` -- check
- `hive` -- check
- `eyeturret` -- check
- `houndmound` -- check
- `ghost` -- check
- `insect` -- check
- `spider` -- check
- `mech` -- check
- `brightmare` -- check
- `brightmareboss` -- check
- `mound` -- check
- `tree` -- check
- `wooden` -- check
- `hedge` -- check
- `shell` -- check
- `rocky` -- check
- `fossil` -- check
- `blocker` -- check
- `forcefield` -- check
- `sanity` -- check
- `lunarplant` -- check
- `dreadstone` -- check
- `metal` -- check
- `wood` -- check
- `fur` -- check
- `cloth` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LuckFormulas` | table | --- | Table of luck calculation formula functions (CriticalStrike, LightningStrike, SpawnPerd, etc.) |
| `ROSEPOINT_CONFIGURATIONS` | table | --- | Table of rose point configuration objects with contextname, checkfn, callbackfn |
| `AXISALIGNMENT_VALUES` | table | --- | Table of axis-aligned placement options with text and data fields |
| `PICKABLE_FOOD_PRODUCTS` | table | --- | Table mapping pickable product names to true for food source detection |
| `NON_LIFEFORM_TARGET_TAGS` | table | --- | Array of tags for targets that are not considered lifeforms |
| `SOULLESS_TARGET_TAGS` | table | --- | Array of tags for soulless targets (concatenated with NON_LIFEFORM_TARGET_TAGS) |
| `DesiredMaxTakeCountFunctions` | table | --- | Table mapping prefab names to max take count callback functions |
| `WAGPUNK_ARENA_COLLISION_DATA` | table | --- | Array of collision data tables with x, z, rotation, sfxlooper fields |
| `CLOSEINSPECTORUTIL` | table | --- | Table with utility functions for close inspection validation (IsValidTarget, IsValidPos, CanCloseInspect) |

## Main functions

### `IsEntityDead(inst, require_health)`
* **Description:** Checks if an entity is dead by examining its health replica. Returns true if health replica is nil and require_health is true, or if health:IsDead() returns true.
* **Parameters:**
  - `inst` -- Entity instance to check for death state
  - `require_health` -- Boolean - if true, entity is considered dead if it lacks health replica
* **Returns:** boolean - true if entity is dead, false otherwise
* **Error states:** Errors if inst.replica is nil (no guard present)

### `IsEntityDeadOrGhost(inst, require_health)`
* **Description:** Checks if an entity is dead or a player ghost. Returns true immediately if entity has playerghost tag, otherwise delegates to IsEntityDead.
* **Parameters:**
  - `inst` -- Entity instance to check
  - `require_health` -- Boolean passed to IsEntityDead for health replica requirement
* **Returns:** boolean - true if entity is dead or a player ghost

### `IsEntityElectricImmune(inst)`
* **Description:** Checks if an entity is immune to electric damage by testing for electricdamageimmune tag or insulated inventory.
* **Parameters:**
  - `inst` -- Entity instance to check for electric immunity
* **Returns:** boolean - true if entity is electric immune

### `GetStackSize(inst)`
* **Description:** Returns the stack size of an entity via its stackable replica, or 1 if no stackable component exists.
* **Parameters:**
  - `inst` -- Entity instance to get stack size from
* **Returns:** number - stack size or 1 if no stackable replica

### `HandleDugGround(dug_ground, x, y, z)`
* **Description:** Spawns turf loot when ground is dug, inheriting world wetness and applying physics velocity. Spawns sinkhole spawn fx if no turf defined.
* **Parameters:**
  - `dug_ground` -- Ground tile type that was dug
  - `x` -- X coordinate for spawn position
  - `y` -- Y coordinate for spawn position
  - `z` -- Z coordinate for spawn position
* **Returns:** None

### `FindVirtualOceanEntity(x, y, z, r)`
* **Description:** Finds virtual ocean entities within radius that have virtualocean tag but not INLIMBO tag, verifying entity is within physics radius.
* **Parameters:**
  - `x` -- X coordinate to search from
  - `y` -- Y coordinate to search from
  - `z` -- Z coordinate to search from
  - `r` -- Search radius (defaults to MAX_PHYSICS_RADIUS if nil)
* **Returns:** Entity instance or nil if none found

### `PushAwayItemsOnBoatPlace(inst)`
* **Description:** Pushes away items and entities when a boat is placed, launching them with delay based on distance. Handles birds specially with flyaway event.
* **Parameters:**
  - `inst` -- Boat entity instance being placed
* **Returns:** None
* **Error states:** Errors if inst.components.walkableplatform is nil (no guard present)

### `TempTile_HandleTileChange_Ocean(x, y, z)`
* **Description:** Handles entities when tile changes to ocean - pushes onsink event and destroys entities not on adjacent land/dock tiles.
* **Parameters:**
  - `x` -- X coordinate of tile change
  - `y` -- Y coordinate of tile change
  - `z` -- Z coordinate of tile change
* **Returns:** None

### `TempTile_HandleTileChange_Ocean_Warn(x, y, z)`
* **Description:** Warns entities before ocean tile change - pushes abandon_ship and onpresink events for players on visual ground.
* **Parameters:**
  - `x` -- X coordinate of tile change
  - `y` -- Y coordinate of tile change
  - `z` -- Z coordinate of tile change
* **Returns:** None

### `TempTile_HandleTileChange_Void(x, y, z)`
* **Description:** Handles entities when tile changes to void - pushes onfallinvoid event and destroys entities that cannot fall into abyss.
* **Parameters:**
  - `x` -- X coordinate of tile change
  - `y` -- Y coordinate of tile change
  - `z` -- Z coordinate of tile change
* **Returns:** None

### `TempTile_HandleTileChange_Void_Warn(x, y, z)`
* **Description:** Warns entities before void tile change - pushes onprefallinvoid event for entities on visual ground.
* **Parameters:**
  - `x` -- X coordinate of tile change
  - `y` -- Y coordinate of tile change
  - `z` -- Z coordinate of tile change
* **Returns:** None

### `TempTile_HandleTileChange(x, y, z, tile)`
* **Description:** Dispatches tile change handling to ocean or void handlers based on tile type.
* **Parameters:**
  - `x` -- X coordinate of tile change
  - `y` -- Y coordinate of tile change
  - `z` -- Z coordinate of tile change
  - `tile` -- Tile type being changed to
* **Returns:** None

### `TempTile_HandleTileChange_Warn(x, y, z, tile)`
* **Description:** Dispatches tile change warning to ocean or void warning handlers based on tile type.
* **Parameters:**
  - `x` -- X coordinate of tile change
  - `y` -- Y coordinate of tile change
  - `z` -- Z coordinate of tile change
  - `tile` -- Tile type being changed to
* **Returns:** None



### `Bridge_DeployCheck_Helper(inst, pt, options)`
* **Description:** Main bridge deployment validation function - transforms player position and validates tile raytrace for bridge construction.
* **Parameters:**
  - `inst` -- Entity instance deploying bridge
  - `pt` -- Position point for deployment
  - `options` -- Optional table with maxlength, isvalidtileforbridgeatpointfn, candeploybridgeatpointfn, deployskipfirstlandtile, requiredworldcomponent
* **Returns:** boolean success, spots table or false

### `DecayCharlieResidueAndGoOnCooldownIfItExists(inst)`
* **Description:** Forces Charlie residue decay and puts roseinspectableuser on cooldown if component exists.
* **Parameters:**
  - `inst` -- Entity instance with potential roseinspectableuser component
* **Returns:** None



### `MakeRoseTarget_CreateFuel(inst)`
* **Description:** Adds roseinspectable component with standard fuel activation callback and forced cooldown on activate.
* **Parameters:**
  - `inst` -- Entity instance to add roseinspectable component
* **Returns:** nil

### `MakeRoseTarget_CreateFuel_IncreasedHorror(inst)`
* **Description:** Adds roseinspectable component with increased horror fuel activation callback and forced cooldown on activate.
* **Parameters:**
  - `inst` -- Entity instance to add roseinspectable component
* **Returns:** nil



### `CLOSEINSPECTORUTIL.IsValidTarget(doer, target)`
* **Description:** Validates if target is eligible for close inspection by checking mass, locomotor, inventoryitem, and character tags differently on master sim vs client.
* **Parameters:**
  - `doer` -- Player entity performing inspection
  - `target` -- Target entity to validate
* **Returns:** boolean -- true if target is valid for close inspection

### `CLOSEINSPECTORUTIL.IsValidPos(doer, pos)`
* **Description:** Checks if position is valid for close inspection by iterating ROSEPOINT_CONFIGURATIONS and checking cooldown state.
* **Parameters:**
  - `doer` -- Player entity
  - `pos` -- Position to validate
* **Returns:** boolean -- true if position is valid

### `CLOSEINSPECTORUTIL.CanCloseInspect(doer, targetorpos)`
* **Description:** Main validation function checking if player has closeinspector equipment, is not riding, and target/position is valid.
* **Parameters:**
  - `doer` -- Player entity attempting inspection
  - `targetorpos` -- Entity or position to inspect
* **Returns:** boolean -- true if close inspection is permitted



### `HasMeatInInventoryFor(inst)`
* **Description:** Checks if entity inventory contains meat items, returns false if hidesmeats tag is equipped.
* **Parameters:**
  - `inst` -- Entity with inventory component
* **Returns:** boolean -- true if meat found in inventory

### `SetDesiredMaxTakeCountFunction(prefab, callback)`
* **Description:** Registers a callback function for controlling max take count logic for items entering player inventory.
* **Parameters:**
  - `prefab` -- Prefab name string
  - `callback` -- Function to set as max take count handler
* **Returns:** nil

### `GetDesiredMaxTakeCountFunction(prefab)`
* **Description:** Retrieves registered max take count callback function for a prefab.
* **Parameters:**
  - `prefab` -- Prefab name string
* **Returns:** function or nil -- registered callback or nil if not found

### `IsFoodSourcePickable(inst)`
* **Description:** Checks if entity has pickable component with product listed in PICKABLE_FOOD_PRODUCTS table.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if entity is a food source pickable

### `GetWobyCourierChestPosition(inst)`
* **Description:** Retrieves stored chest position coordinates from woby classified component, returns nil if no chest set.
* **Parameters:**
  - `inst` -- Woby entity with woby_commands_classified
* **Returns:** number, number or nil, nil -- x and z coordinates or nil pair

### `UpdateAxisAlignmentValues(intervals)`
* **Description:** Updates TUNING axis-aligned placement values and pushes refresh event to ThePlayer if exists.
* **Parameters:**
  - `intervals` -- Number of axis-aligned placement intervals
* **Returns:** nil

### `CycleAxisAlignmentValues()`
* **Description:** Cycles through AXISALIGNMENT_VALUES to next interval setting, wraps to first if at end.
* **Parameters:** None
* **Returns:** nil

### `ClearSpotForRequiredPrefabAtXZ(x, z, r)`
* **Description:** Finds and destroys entities within radius that lack INLIMBO, NOCLICK, FX, or irreplaceable tags.
* **Parameters:**
  - `x` -- X coordinate
  - `z` -- Z coordinate
  - `r` -- Radius offset for clearance
* **Returns:** nil

### `IsSmallCreature(inst)`
* **Description:** Checks if entity has smallcreature, smallcreaturecorpse, or small tag.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if entity is small creature

### `IsEpicCreature(inst)`
* **Description:** Checks if entity has epic or epiccorpse tag.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if entity is epic creature

### `IsLargeCreature(inst)`
* **Description:** Checks if entity has largecreature, largecreaturecorpse, or large tag.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if entity is large creature

### `GetCombatFxSize(ent)`
* **Description:** Calculates combat FX radius, size category, and height based on creature size tags and physics radius.
* **Parameters:**
  - `ent` -- Entity instance for FX sizing
* **Returns:** number, string, string or nil -- radius, size category, height level

### `GetElectrocuteFxAnim(sz, ht)`
* **Description:** Returns electrocute FX animation name formatted with size and optional height.
* **Parameters:**
  - `sz` -- Size category string
  - `ht` -- Height level string or nil
* **Returns:** string -- animation name like shock_small_low or shock_large

### `CanEntityBeElectrocuted(inst)`
* **Description:** Checks if entity stategraph supports electrocution based on electrocute state, burn_on_electrocute memory, and noelectrocute flag.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if entity can be electrocuted

### `CalcEntityElectrocuteDuration(inst, override)`
* **Description:** Calculates electrocute duration from entity override, stategraph memory, or TUNING defaults with optional override clamping.
* **Parameters:**
  - `inst` -- Entity instance
  - `override` -- Optional override duration value
* **Returns:** number -- calculated duration in seconds

### `SpawnElectricHitSparks(inst, target, flash)`
* **Description:** Spawns electric hit sparks FX prefab aligned to target, uses electricimmune variant if target is immune.
* **Parameters:**
  - `inst` -- Source entity
  - `target` -- Target entity for FX alignment
  - `flash` -- Flash parameter for FX
* **Returns:** nil

### `LightningStrikeAttack(inst)`
* **Description:** Applies lightning damage to entity health based on wetness multiplier and pushes electrocute event immediately.
* **Parameters:**
  - `inst` -- Entity to strike with lightning
* **Returns:** boolean -- true if attack succeeded, false if immune

### `StrikeLightningAtPoint(strike_prefab, hit_player, x, y, z)`
* **Description:** Strikes lightning at position, applies electrocution or burning to entities in radius based on tags and immunity.
* **Parameters:**
  - `strike_prefab` -- Lightning prefab name
  - `hit_player` -- Boolean indicating if player was hit
  - `x` -- X coordinate or Vector3
  - `y` -- Y coordinate (nil if x is Vector3)
  - `z` -- Z coordinate (nil if x is Vector3)
* **Returns:** nil



### `GetMigrationPortalFromMigrationData(migrationdata)`
* **Description:** Finds migration portal entity from ShardPortals matching migration data world and portal IDs.
* **Parameters:**
  - `migrationdata` -- Table with worldid and portalid
* **Returns:** Entity or nil -- portal entity if found

### `GetMigrationPortalLocation(ent, migrationdata, portaloverride)`
* **Description:** Calculates spawn location for migrating entity using portal, explicit coordinates, or default playerspawner point.
* **Parameters:**
  - `ent` -- Entity being migrated
  - `migrationdata` -- Migration data table
  - `portaloverride` -- Optional portal entity override
* **Returns:** number, number, number -- x, y, z spawn coordinates (y is always 0)

### `GetActionPassableTestFnAt(x, y, z)`
* **Description:** Returns appropriate passable test function based on platform type, arena, or vault location at position.
* **Parameters:**
  - `x` -- X coordinate
  - `y` -- Y coordinate
  - `z` -- Z coordinate
* **Returns:** function, boolean -- test function and special area flag

### `GetActionPassableTestFn(inst)`
* **Description:** Gets action passable test function for entity current position.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** function -- passable test function

### `IsFlyingPermittedFromPointToPoint(fx, fy, fz, tx, ty, tz)`
* **Description:** Checks if flying is permitted between two points considering arena barrier and vault restrictions.
* **Parameters:**
  - `fx` -- From X coordinate
  - `fy` -- From Y coordinate
  - `fz` -- From Z coordinate
  - `tx` -- To X coordinate
  - `ty` -- To Y coordinate
  - `tz` -- To Z coordinate
* **Returns:** boolean -- true if flying is permitted

### `IsFlyingPermittedFromPoint(fx, fy, fz)`
* **Description:** Checks if flying is permitted from a single point considering vault adjacency restrictions.
* **Parameters:**
  - `fx` -- X coordinate
  - `fy` -- Y coordinate
  - `fz` -- Z coordinate
* **Returns:** boolean -- true if flying is permitted

### `IsTeleportingPermittedFromPointToPoint(fx, fy, fz, tx, ty, tz)`
* **Description:** Checks if teleporting is permitted between two points considering arena barrier and vault restrictions.
* **Parameters:**
  - `fx` -- From X coordinate
  - `fy` -- From Y coordinate
  - `fz` -- From Z coordinate
  - `tx` -- To X coordinate
  - `ty` -- To Y coordinate
  - `tz` -- To Z coordinate
* **Returns:** boolean -- true if teleporting is permitted

### `IsTeleportLinkingPermittedFromPoint(fx, fy, fz)`
* **Description:** Checks if teleport linking is permitted from a point considering arena barrier and vault restrictions.
* **Parameters:**
  - `fx` -- X coordinate
  - `fy` -- Y coordinate
  - `fz` -- Z coordinate
* **Returns:** boolean -- true if teleport linking is permitted

### `EntityHasCorpse(inst)`
* **Description:** Checks if entity stategraph has corpse state and lacks nocorpse memory flag.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if entity has corpse

### `CanEntityBeGestaltMutated(inst)`
* **Description:** Checks if entity can undergo gestalt lunar rift mutation based on state, memory flags, and TUNING.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if gestalt mutation is possible

### `CanEntityBeNonGestaltMutated(inst)`
* **Description:** Checks if entity can undergo non-gestalt pre-rift mutation based on state, memory flags, and TUNING.
* **Parameters:**
  - `inst` -- Entity instance to check
* **Returns:** boolean -- true if non-gestalt mutation is possible

### `GetLunarPreRiftMutationChance(inst)`
* **Description:** Calculates pre-rift lunar mutation chance from entity override or TUNING multiplied by lunacy area modifier.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** number -- mutation chance value

### `GetLunarRiftMutationChance(inst)`
* **Description:** Returns gestalt possession chance from entity or defaults to 1.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** number -- mutation chance value



### `CanLunarPreRiftMutateFromCorpse(inst)`
* **Description:** Determines if an entity corpse can mutate via lunar pre-rift mechanics, checking mutation eligibility, tuning settings, water status, burn status, and cached results before performing a luck roll.
* **Parameters:**
  - `inst` -- Entity instance to check for lunar pre-rift mutation eligibility
* **Returns:** boolean indicating mutation eligibility

### `CanLunarRiftMutateFromCorpse(inst)`
* **Description:** Determines if an entity corpse can mutate via lunar rift mechanics, checking gestalt mutation eligibility, tuning settings, rift portal status, ocean position, burn status, and cached results before performing a luck roll.
* **Parameters:**
  - `inst` -- Entity instance to check for lunar rift mutation eligibility
* **Returns:** boolean indicating mutation eligibility

### `CanEntityBecomeCorpse(inst)`
* **Description:** Determines if an entity can become a corpse by checking corpse eligibility, force corpse flag, burn status, corpse persist manager retention, and lunar mutation possibilities.
* **Parameters:**
  - `inst` -- Entity instance to check for corpse conversion eligibility
* **Returns:** boolean indicating corpse conversion eligibility

### `TryEntityToCorpse(inst, corpseprefab)`
* **Description:** Converts an entity to a corpse prefab if eligible, copying position, rotation, scale, animation build/bank, death loot, and corpse data. Handles lunar mutation states and removes burnable component if needed.
* **Parameters:**
  - `inst` -- Entity instance to convert to corpse
  - `corpseprefab` -- Prefab name for the corpse to spawn
* **Returns:** Corpse entity instance or nil if conversion failed

### `CanApplyPlayerDamageMod(target)`
* **Description:** Checks if a target entity should receive player damage modification by verifying it is a player or has the player_damagescale tag.
* **Parameters:**
  - `target` -- Target entity to check for player damage modification
* **Returns:** boolean indicating if damage mod applies

### `PlayerDamageMod(target, damage, mod)`
* **Description:** Applies player damage modification multiplier if target is eligible, otherwise returns base damage unchanged.
* **Parameters:**
  - `target` -- Target entity receiving damage
  - `damage` -- Base damage value
  - `mod` -- Damage modification multiplier
* **Returns:** Modified damage value or original damage

### `GetArmorImpactSound(inventory, weaponmod)`
* **Description:** Returns armor impact sound path based on armor tags in priority order (forcefield, sanity, lunarplant, dreadstone, metal, marble, shell, wood, grass, fur, cloth).
* **Parameters:**
  - `inventory` -- Inventory component to check armor tags
  - `weaponmod` -- Weapon modifier string (default: 'dull')
* **Returns:** Sound path string or nil if no matching armor tag

### `GetWallImpactSound(inst, weaponmod)`
* **Description:** Returns wall impact sound path based on wall tags (grass, stone, marble, fence_electric) with wood_wall as fallback.
* **Parameters:**
  - `inst` -- Wall entity instance to check tags
  - `weaponmod` -- Weapon modifier string (default: 'dull')
* **Returns:** Sound path string

### `GetObjectImpactSound(inst, weaponmod)`
* **Description:** Returns object impact sound path based on object tags (clay, stone) with object as fallback.
* **Parameters:**
  - `inst` -- Object entity instance to check tags
  - `weaponmod` -- Weapon modifier string (default: 'dull')
* **Returns:** Sound path string

### `GetCreatureImpactSound(inst, weaponmod)`
* **Description:** Returns creature impact sound path based on creature type tags and size modifiers (sml, lrg, med, wet). Checks tags in priority order including hive, ghost, insect, mech, shadow, tree, veggie, shell, rocky.
* **Parameters:**
  - `inst` -- Creature entity instance to check tags
  - `weaponmod` -- Weapon modifier string (default: 'dull')
* **Returns:** Sound path string



### `ConvertTopologyIdToData(idname)`
* **Description:** Converts a topology ID string into structured data with task_id, layout_id, index_id, and room_id fields. Handles special START case and StaticLayoutIsland format.
* **Parameters:**
  - `idname` -- Topology ID name to convert
* **Returns:** Table with topology data fields

### `GetPlayerDeathDescription(inst, viewer)`
* **Description:** Returns formatted death description string for player corpses, graves, and skeletons. Handles player killer name, death cause translation, and viewer-based cause variations.
* **Parameters:**
  - `inst` -- Dead player entity instance
  - `viewer` -- Viewer entity or character name
* **Returns:** Formatted description string or nil

### `GetTopologyDataAtPoint(x, y, z)`
* **Description:** Retrieves topology data at world coordinates, supporting Vector3, (x, z), or (x, y, z) parameter formats.
* **Parameters:**
  - `x` -- X coordinate or Vector3
  - `y` -- Y coordinate (0 if x is Vector3)
  - `z` -- Z coordinate
* **Returns:** Table with topology data from ConvertTopologyIdToData

### `GetTopologyDataAtInst(inst)`
* **Description:** Retrieves topology data at an entity's world position using GetTopologyDataAtPoint.
* **Parameters:**
  - `inst` -- Entity instance to get topology data for
* **Returns:** Table with topology data

### `MakeComponentAnInventoryItemSource(cmp, owner)`
* **Description:** Sets up a component to track inventory item ownership and container storage. Registers event listeners for onputininventory, ondropped, and onremove events. Manages itemsource_owner and itemsource_container references.
* **Parameters:**
  - `cmp` -- Component to make an inventory item source
  - `owner` -- Owner entity (default: cmp.inst)
* **Returns:** None

### `RemoveComponentInventoryItemSource(cmp, owner)`
* **Description:** Removes inventory item source tracking from a component by removing event listeners and clearing itemsource references.
* **Parameters:**
  - `cmp` -- Component to remove inventory item source from
  - `owner` -- Owner entity (default: cmp.inst)
* **Returns:** None



### `GetHermitCrabOccupiedGrid(x, z)`
* **Description:** Calculates the occupation space grid for hermit crab decoration, considering shoreline tiles and land tiles up to MAX_TILES limit. Uses flood-fill algorithm to find valid decoration areas.
* **Parameters:**
  - `x` -- X world coordinate
  - `z` -- Z world coordinate
* **Returns:** DataGrid with occupied tile data

### `IsInValidHermitCrabDecorArea(inst)`
* **Description:** Checks if an entity is in a valid hermit crab decoration area by excluding HermitcrabIsland, MonkeyIsland, and MoonIsland topology regions.
* **Parameters:**
  - `inst` -- Entity instance to check decoration area validity
* **Returns:** boolean indicating valid decoration area

### `IsEntityGestaltProtected(inst)`
* **Description:** Checks if an entity has gestalt protection via equipped inventory item with gestaltprotection tag or hermitcrabtea_moon_tree_blossom_buff debuff.
* **Parameters:**
  - `inst` -- Entity instance to check gestalt protection
* **Returns:** boolean indicating gestalt protection status

### `IsPointCoveredByBlocker(x, y, z, extra_radius)`
* **Description:** Checks if a point is covered by any entity with the blocker tag within the search radius. Returns true if covered, nil if not covered.
* **Parameters:**
  - `x` -- X world coordinate
  - `y` -- Y world coordinate
  - `z` -- Z world coordinate
  - `extra_radius` -- Additional radius for blocker search (default: 0)
* **Returns:** true if point is covered by blocker, nil if not covered

### `EntityHasSetBonus(inst, setname)`
* **Description:** Checks if an entity has matching set bonus on both head and body equipment slots.
* **Parameters:**
  - `inst` -- Entity instance to check set bonus
  - `setname` -- Set bonus name to verify
* **Returns:** boolean indicating set bonus match

### `CreatingJoustingData(inst)`
* **Description:** Creates jousting data table with direction angle and source reference from buffered action target and lance object.
* **Parameters:**
  - `inst` -- Entity instance creating jousting data
* **Returns:** Jousting data table with dir and source fields



### `GetEntityLuck(inst)`
* **Description:** Returns the luck value from an entity's luckuser component, or 0 if the component does not exist.
* **Parameters:**
  - `inst` -- Entity instance to check for luckuser component
* **Returns:** number -- luck value or 0

### `GetLuckChance(luck, chance, formula)`
* **Description:** Calculates modified chance based on luck value and specified formula.
* **Parameters:**
  - `luck` -- Luck value to apply to the chance calculation
  - `chance` -- Base chance value before luck modification
  - `formula` -- Luck formula function to apply (e.g., CommonChanceUnluckMultAndLuckHyperbolic)
* **Returns:** number -- modified chance value or original chance if formula returns nil

### `GetEntityLuckChance(inst, chance, formula)`
* **Description:** Gets an entity's luck value and applies it to calculate modified chance using the specified formula.
* **Parameters:**
  - `inst` -- Entity instance to get luck from
  - `chance` -- Base chance value before luck modification
  - `formula` -- Luck formula function to apply
* **Returns:** number -- modified chance value or original chance

### `GetEntitiesLuckChance(instances, chance, formula)`
* **Description:** Sums luck values from multiple entities and applies the total to calculate modified chance.
* **Parameters:**
  - `instances` -- Table of entity instances to sum luck from
  - `chance` -- Base chance value before luck modification
  - `formula` -- Luck formula function to apply
* **Returns:** number -- modified chance value or original chance

### `GetEntityLuckWeightedTable(inst, weighted_table)`
* **Description:** Returns a new weighted table adjusted by entity luck, redistributing value from heavily weighted items to lower weighted ones.
* **Parameters:**
  - `inst` -- Entity instance to get luck from
  - `weighted_table` -- Weighted table to modify based on luck
* **Returns:** None (function is incomplete - source contains only a comment describing intended behavior, no return statement)

### `DoLuckyEffect(inst, is_lucky)`
* **Description:** Triggers a network variable update on player_classified to reflect luck effect state for visual feedback.
* **Parameters:**
  - `inst` -- Entity instance (typically a player)
  - `is_lucky` -- Boolean indicating if the entity is currently lucky
* **Returns:** None

### `TryLuckRoll(inst, chance, formula)`
* **Description:** Performs a luck-influenced random roll. If inst is provided, applies entity luck to modify chance before rolling.
* **Parameters:**
  - `inst` -- Entity instance to get luck from (optional)
  - `chance` -- Base chance value for the roll
  - `formula` -- Luck formula function to apply
* **Returns:** boolean -- true if roll succeeds, false otherwise



### `ShouldItemMimicBeRevealedFor(item, user)`
* **Description:** Determines if an item mimic should be revealed based on whether the item has itemmimic component and the user lacks socket_shadow_mimicry component.
* **Parameters:**
  - `item` -- Item entity to check for itemmimic component
  - `user` -- User entity to check for socket_shadow_mimicry component
* **Returns:** boolean -- true if mimic should be revealed

## Internal Helper Functions

The following functions are defined as local within the module and are not accessible from external code. They are documented here for reference.

### `Bridge_DeployCheck_ShouldStopAtTile(tile)`
* **Description:** Internal helper - returns true if tile is temporary tile and not farming soil.
* **Parameters:**
  - `tile` -- Tile type to check
* **Returns:** boolean
* **Error states:** None

### `Bridge_DeployCheck_CanStartAtTile(tile)`
* **Description:** Internal helper - returns true if tile is land tile and should not stop bridge deployment.
* **Parameters:**
  - `tile` -- Tile type to check
* **Returns:** boolean
* **Error states:** None

### `Bridge_DeployCheck_HandleOverhangs(sx, sz, TILE_SCALE, _map)`
* **Description:** Internal helper - adjusts position if on tile overhang by reflecting over tile border.
* **Parameters:**
  - `sx` -- Starting X position
  - `sz` -- Starting Z position
  - `TILE_SCALE` -- Tile scale constant
  - `_map` -- World map component
* **Returns:** rsx, rsz, dirx, dirz - adjusted coordinates and direction
* **Error states:** None

### `Bridge_DeployCheck_HandleGround(sx, sz, TILE_SCALE, _map, isvalidtileforbridgeatpointfn)`
* **Description:** Internal helper - handles ground tile bridge deployment with diamond and rectangle direction checks.
* **Parameters:**
  - `sx` -- Starting X position
  - `sz` -- Starting Z position
  - `TILE_SCALE` -- Tile scale constant
  - `_map` -- World map component
  - `isvalidtileforbridgeatpointfn` -- Function to validate tile for bridge placement
* **Returns:** dirx, dirz - direction vectors or nil if too far inland
* **Error states:** None

### `IsValidTileForBridgeAtPoint_Fallback(_map, x, y, z)`
* **Description:** Internal fallback function - checks if tile is valid for vine bridge at point.
* **Parameters:**
  - `_map` -- World map component
  - `x` -- X position to check
  - `y` -- Y position to check
  - `z` -- Z position to check
* **Returns:** boolean
* **Error states:** None

### `CanDeployBridgeAtPoint_Fallback(_map, x, y, z)`
* **Description:** Internal fallback function - checks if vine bridge can be deployed at point.
* **Parameters:**
  - `_map` -- World map component
  - `x` -- X position to check
  - `y` -- Y position to check
  - `z` -- Z position to check
* **Returns:** boolean
* **Error states:** None

### `Bridge_Deploy_Raytrace(sx, sz, dirx, dirz, maxlength, _map, candeploybridgeatpointfn, inst)`
* **Description:** Internal helper - raytraces in direction to find land, collecting valid bridge spots.
* **Parameters:**
  - `sx` -- Starting X position
  - `sz` -- Starting Z position
  - `dirx` -- Direction X vector
  - `dirz` -- Direction Z vector
  - `maxlength` -- Maximum raytrace length
  - `_map` -- World map component
  - `candeploybridgeatpointfn` -- Function to check if bridge can deploy at point
  - `inst` -- Entity instance deploying bridge
* **Returns:** boolean success, spots table with direction or false
* **Error states:** None

### `Bridge_Deploy_GetBestRayTrace(sx, sz, maxlength, _map, candeploybridgeatpointfn, inst)`
* **Description:** Internal helper - calculates best ray trace direction from point by testing all four cardinal directions.
* **Parameters:**
  - `sx` -- Starting X position
  - `sz` -- Starting Z position
  - `maxlength` -- Maximum raytrace length
  - `_map` -- World map component
  - `candeploybridgeatpointfn` -- Function to check if bridge can deploy at point
  - `inst` -- Entity instance deploying bridge
* **Returns:** boolean success, spots table or false
* **Error states:** None

### `OnFuelPresentation3(inst)`
* **Description:** Returns entity to scene and triggers inventory item drop with physics if inventoryitem component exists.
* **Parameters:**
  - `inst` -- Entity instance to return to scene and drop inventory item
* **Returns:** nil
* **Error states:** None

### `OnFuelPresentation2(inst, x, z, upgraded)`
* **Description:** Spawns shadow puff FX at position and schedules OnFuelPresentation3 after 3 frames.
* **Parameters:**
  - `inst` -- Entity instance
  - `x` -- X coordinate for FX spawn
  - `z` -- Z coordinate for FX spawn
  - `upgraded` -- Boolean indicating if fuel is upgraded
* **Returns:** nil
* **Error states:** None

### `OnFuelPresentation1(inst, x, z, upgraded)`
* **Description:** Spawns charlie snap FX at position and schedules OnFuelPresentation2 after 25 frames.
* **Parameters:**
  - `inst` -- Entity instance
  - `x` -- X coordinate for FX spawn
  - `z` -- Z coordinate for FX spawn
  - `upgraded` -- Boolean indicating if fuel is upgraded
* **Returns:** nil
* **Error states:** None

### `OnResidueActivated_Fuel_Internal(inst, doer, odds)`
* **Description:** Internal function that spawns horrorfuel or nightmarefuel based on skill tree upgrade check and random position offset.
* **Parameters:**
  - `inst` -- Entity instance activating residue
  - `doer` -- Player entity performing the activation
  - `odds` -- Luck odds for upgrade chance
* **Returns:** nil
* **Error states:** None

### `OnResidueActivated_Fuel(inst, doer)`
* **Description:** Wrapper calling OnResidueActivated_Fuel_Internal with standard upgrade chance from TUNING.
* **Parameters:**
  - `inst` -- Entity instance
  - `doer` -- Player entity performing activation
* **Returns:** nil
* **Error states:** None

### `OnResidueActivated_Fuel_IncreasedHorror(inst, doer)`
* **Description:** Wrapper calling OnResidueActivated_Fuel_Internal with increased horror upgrade chance from TUNING.
* **Parameters:**
  - `inst` -- Entity instance
  - `doer` -- Player entity performing activation
* **Returns:** nil
* **Error states:** None

### `IsValidTileForVineBridgeAtPoint_Wrapper(_map, x, y, z)`
* **Description:** Wrapper function calling map:IsValidTileForVineBridgeAtPoint for vine bridge deployment validation.
* **Parameters:**
  - `_map` -- Map component or object
  - `x` -- X coordinate
  - `y` -- Y coordinate
  - `z` -- Z coordinate
* **Returns:** boolean -- result from map validation
* **Error states:** None

### `CanDeployVineBridgeAtPoint_Wrapper(_map, x, y, z)`
* **Description:** Wrapper function calling map:CanDeployVineBridgeAtPoint for vine bridge deployment check.
* **Parameters:**
  - `_map` -- Map component or object
  - `x` -- X coordinate
  - `y` -- Y coordinate
  - `z` -- Z coordinate
* **Returns:** boolean -- result from map validation
* **Error states:** None

### `RosePoint_VineBridge_Check(inst, pt)`
* **Description:** Checks if vine bridge can be deployed at position using Bridge_DeployCheck_Helper with rose point options.
* **Parameters:**
  - `inst` -- Entity instance
  - `pt` -- Position vector to check
* **Returns:** boolean -- true if deployment is valid
* **Error states:** None

### `RosePoint_VineBridge_Do(inst, pt, spots)`
* **Description:** Queues vine bridge creation and destruction at multiple spots with timed FX and shake effects.
* **Parameters:**
  - `inst` -- Entity instance
  - `pt` -- Position vector
  - `spots` -- Table of spot positions with direction
* **Returns:** boolean -- always returns true
* **Error states:** None

### `HasMeatInInventoryFor_Checker(item)`
* **Description:** Checker function verifying item has edible component with MEAT foodtype and lacks smallcreature tag.
* **Parameters:**
  - `item` -- Inventory item entity to check
* **Returns:** boolean -- true if item is valid meat
* **Error states:** None

### `NoHoles(pt)`
* **Description:** Checks if position is not near a map hole for migration spawn validation.
* **Parameters:**
  - `pt` -- Position vector to check
* **Returns:** boolean -- true if position is safe from holes
* **Error states:** None

### `GetCauseOfDeath(inst)`
* **Description:** Local helper function that retrieves the cause of death entity from the health component if valid.
* **Parameters:**
  - `inst` -- Entity instance to check for cause of death
* **Returns:** Entity instance or nil if no valid cause of death
* **Error states:** None

### `SplitTopologyId(s)`
* **Description:** Local helper function that splits a topology ID string by '/' and ':' delimiters into an array of components.
* **Parameters:**
  - `s` -- Topology ID string to split
* **Returns:** Array of string components
* **Error states:** None

### `GetAngleTowardsLand(x, y)`
* **Description:** Local helper function that calculates the angle towards land from a given tile position by checking surrounding tiles.
* **Parameters:**
  - `x` -- X tile coordinate
  - `y` -- Y tile coordinate
* **Returns:** Angle in radians
* **Error states:** None

### `CommonChanceLuckAdditive(mult)`
* **Description:** Local factory function that returns a luck calculation function using additive luck formula for positive luck values.
* **Parameters:**
  - `mult` -- Luck multiplier value
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `CommonChanceUnluckMultAndLuckHyperbolic(reciprocal, mult)`
* **Description:** Local factory function that returns a luck calculation function using multiplicative unluck and hyperbolic luck formulas.
* **Parameters:**
  - `reciprocal` -- Reciprocal value for hyperbolic calculation
  - `mult` -- Luck multiplier value (default: 1)
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `CommonChanceLuckHyperbolic(mult_max, reciprocal, subtract)`
* **Description:** Local factory function that returns a luck calculation function using hyperbolic luck formula for positive luck values.
* **Parameters:**
  - `mult_max` -- Maximum multiplier value
  - `reciprocal` -- Reciprocal value for hyperbolic calculation
  - `subtract` -- Subtract value for luck offset (default: 0)
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `CommonChanceUnluckHyperbolicAndLuckMult(reciprocal, mult)`
* **Description:** Local factory function that returns a luck calculation function using hyperbolic unluck and multiplicative luck formulas.
* **Parameters:**
  - `reciprocal` -- Reciprocal value for hyperbolic calculation
  - `mult` -- Luck multiplier value (default: 1)
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `CommonChanceUnluckHyperbolicAndLuckAdditive(reciprocal, mult)`
* **Description:** Local factory function that returns a luck calculation function using hyperbolic unluck and additive luck formulas.
* **Parameters:**
  - `reciprocal` -- Reciprocal value for hyperbolic calculation
  - `mult` -- Luck multiplier value (default: 1)
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `CommonChanceUnluckHyperbolicAndLuckHyperbolic(mult_max, asymptote, subtract, reciprocal)`
* **Description:** Local factory function that returns a luck calculation function using hyperbolic formulas for both unluck and luck.
* **Parameters:**
  - `mult_max` -- Maximum multiplier value
  - `asymptote` -- Asymptote value for hyperbolic calculation
  - `subtract` -- Subtract value for luck offset (default: 0)
  - `reciprocal` -- Reciprocal value for hyperbolic calculation
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `CommonChanceLuckHyperbolicLower(reciprocal)`
* **Description:** Local factory function that returns a luck calculation function using lower hyperbolic luck formula for positive luck values.
* **Parameters:**
  - `reciprocal` -- Reciprocal value for hyperbolic calculation
* **Returns:** Function that calculates chance with luck
* **Error states:** None

### `UseableTargetedItem_ValidTarget_SocketHolder(inst, target, doer, ...)`
* **Description:** Local validation function that checks if a socketable item can be socketed into a target socketholder component.
* **Parameters:**
  - `inst` -- The socketable item being used
  - `target` -- The target entity (potential socket holder)
  - `doer` -- The entity performing the action
  - `...` -- Additional variadic arguments
* **Returns:** boolean -- result of CanTryToSocket or chained validation
* **Error states:** None

### `MakeItemSocketable_Client(inst, socketname)`
* **Description:** Client-side setup that adds socketable component and overrides UseableTargetedItem_ValidTarget to support socket holder validation.
* **Parameters:**
  - `inst` -- Entity instance to make socketable
  - `socketname` -- Name identifier for the socket type
* **Returns:** None
* **Error states:** None

### `OnPotentialSocketHolderUsed(inst, target, doer, ...)`
* **Description:** Local callback that attempts to socket an item into a socketholder, falling back to original useabletargeteditem onusefn if socketing is not applicable.
* **Parameters:**
  - `inst` -- The socketable item being used
  - `target` -- The target socketholder entity
  - `doer` -- The entity performing the action
  - `...` -- Additional variadic arguments
* **Returns:** boolean, string -- success status and optional fail reason
* **Error states:** None

### `MakeItemSocketable_Server(inst)`
* **Description:** Server-side setup that configures useabletargeteditem component to use socket holder usage callback.
* **Parameters:**
  - `inst` -- Entity instance to make socketable on server
* **Returns:** None
* **Error states:** None

### `MakeInstSocketHolder_Client(inst, socketnames)`
* **Description:** Client-side setup that adds socketholder component and configures socket positions based on input type (table, string, or number).
* **Parameters:**
  - `inst` -- Entity instance to add socketholder to
  - `socketnames` -- Table of socket names, single string, or number for max sockets
* **Returns:** None
* **Error states:** None

## Events & listeners

**Listens to:**
- `onputininventory` — Listened in MakeComponentAnInventoryItemSource to track container ownership changes
- `ondropped` — Listened in MakeComponentAnInventoryItemSource to track item drop events
- `onremove` — Listened in MakeComponentAnInventoryItemSource to track entity removal

**Pushes:**
- `onsink` — Pushed when tile changes to ocean, includes boat and shore_pt data
- `abandon_ship` — Pushed as warning before ocean tile change
- `onpresink` — Pushed to players before ocean tile change
- `onfallinvoid` — Pushed when tile changes to void, includes teleport_pt data
- `onprefallinvoid` — Pushed as warning before void tile change
- `flyaway` — Pushed to bird entities when boat is placed
- `refreshaxisalignedplacementintervals` — Pushed to ThePlayer when axis alignment values are updated
- `electrocute` — Pushed immediately to entity during LightningStrikeAttack
- `migration_activate_other` — Pushed via worldmigrator:ActivatedByOther during portal migration