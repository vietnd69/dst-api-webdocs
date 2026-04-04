---
id: debugcommands
title: Debugcommands
description: This module defines a comprehensive suite of debug console commands for spawning entities, manipulating world states, testing game mechanics, configuring components, managing events, and exporting entity data for testing purposes in Don't Starve Together.
tags: [debug, console, testing, utilities, development]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: ed4ea1a2
system_scope: world
---

# Debugcommands

> Based on game build **714014** | Last updated: 2026-03-21

## Overview

The `debugcommands` module provides an extensive collection of console commands and helper functions designed for developers and testers working with Don't Starve Together. This component serves as the primary interface for debugging game systems, spawning test entities, manipulating world state, verifying UI components, and exporting data for analysis. Commands cover entity spawning (prefabs, layouts, static structures), component manipulation (health, sanity, domestication, skills), world system control (weather, season, moon phase, moonstorms), event testing (Lava Arena, Year of the Catcoon, achievements), and data export utilities (scrapbook generation, hash collision testing, topology visualization). Most functions operate on the master simulation and require console access. The module integrates with numerous game components including `riftspawner`, `moonstormmanager`, `domesticatable`, `skinner`, `combat`, `inventory`, and `workable` to enable comprehensive testing scenarios.

## Usage example

```lua
-- Spawn a grid of test entities at console position
d_spawnlist({"beefalo", "spider", "tree"}, 3)

-- Set player skin mode and clothing
d_skin_mode("normal_skin")
d_clothing("winter_hat")

-- Start a moonstorm at current position
d_startmoonstorm()

-- Test combat DPS on selected entity
d_testdps(10, ConsoleWorldEntityUnderMouse())

-- Generate scrapbook data for all prefabs
d_createscrapbookdata(true)

-- Unlock all achievements for testing
d_unlockallachievements()
```

## Dependencies & tags

**External dependencies:**
- `scrapbook_prefabs` -- Required at start of chunk
- `wx78_moduledefs` -- Required in d_allcircuits for module definitions
- `prefabs/skilltree_defs` -- Required in skill tree functions for definitions
- `screens/thankyoupopup` -- Required in d_test_thank_you
- `skin_gifts` -- Required in d_test_thank_you for gift types
- `screens/skinsitempopup` -- Required in d_test_skins_popup
- `screens/giftitempopup` -- Required in d_test_skins_gift
- `screens/redux/itemboxopenerpopup` -- Required in d_test_mystery_box
- `TheWorld` -- Used for world components, events, and map access
- `TheSim` -- Used for persistent string and entity finding
- `TheFrontEnd` -- Used for pushing UI screens
- `TheInventory` -- Used for getting full inventory in d_cycle_clothing
- `TheGenericKV` -- Used in d_unlockaffinities
- `AllRecipes` -- Iterated in d_playeritems
- `Prefabs` -- Lookup table for prefab validation
- `TUNING` -- Used for lunar hail cooldown
- `STRINGS` -- Used for skill tree string lookup
- `TileGroupManager` -- Used for tile filtering in explore functions
- `TENDENCY` -- Used in d_domesticatedbeefalo
- `ConsoleWorldPosition` -- Global function for getting spawn position
- `ConsoleCommandPlayer` -- Global function for getting player entity
- `c_spawn` -- Console command for spawning
- `c_give` -- Console command for giving items
- `c_announce` -- Console command for announcements
- `SpawnPrefab` -- Global function for spawning prefabs
- `Vector3` -- Used for position calculations
- `TheItems` -- Report event progress for achievements
- `TheNet` -- GetUserID for achievement reporting
- `ConsoleWorldEntityUnderMouse` -- Get entity under cursor for hiding
- `WORLD_TILES` -- Lookup tile IDs in d_ground
- `TILE_SCALE` -- Scale coordinates in layout spawning
- `NODE_TYPE` -- Set node type in topology
- `SpawnSaveRecord` -- Spawn layout entities
- `Ents` -- Pass to LoadPostPass
- `FunctionOrValue` -- Resolve data function
- `PickSomeWithDups` -- Select random hat/weapon in d_islandstart
- `GetAllWinterOrnamentPrefabs` -- Get list of ornaments
- `EventAchievements` -- Get active achievement IDs
- `worldtiledefs` -- Required for turf definitions
- `map/object_layout` -- Required for layout spawning logic
- `prefabs/oceanfishdef` -- Required for fish definitions
- `json` -- Encode achievement data
- `c_mat` -- Console material command
- `c_select` -- Console select command
- `DebugSpawn` -- Debug spawn function
- `prefabs/farm_plant_defs` -- Required to access PLANT_DEFS for farm related spawns
- `prefabs/fertilizer_nutrient_defs` -- Required to access SORTED_FERTILIZERS
- `cooking` -- Required to access recipe data and recipe_cards
- `prefabs/pillow_defs` -- Required to iterate pillow materials
- `TheInput` -- Used to get world position for spawning
- `TheCookbook` -- Used to learn food stats and add recipes
- `ALL_HAT_PREFAB_NAMES` -- Used to list all hat prefabs
- `PROTOTYPER_DEFS` -- Used to list all crafting stations
- `GLOBAL` -- Accessed for console commands like c_spawn, c_remove, c_select
- `techtree` -- Required to check recipe tech levels
- `prefabs/waxed_plant_common` -- Required to wax plants
- `ThePlayer` -- Accessed for position, HUD, and components
- `AllPlayers` -- Accessed to get first player for sound testing

**Components used:**
- `riftspawner` -- Accessed via TheWorld.components.riftspawner for rift management
- `sharkboimanager` -- Accessed via TheWorld.components.sharkboimanager for ocean arena
- `ropebridgemanager` -- Accessed via TheWorld.components.ropebridgemanager for bridge destruction
- `rabbitkingmanager` -- Accessed via TheWorld.components.rabbitkingmanager for rabbit king creation
- `skilltreeupdater` -- Accessed via player.components.skilltreeupdater for skill reset
- `weather` -- Accessed via TheWorld.net.components.weather for lunar hail
- `domesticatable` -- Accessed on beefalo for domestication stats
- `rideable` -- Accessed on beefalo for saddle equipping
- `health` -- Accessed on walls for setting percent
- `builder` -- Accessed on player for unlocking recipes
- `scenariorunner` -- Added and configured on spawned entities
- `skinner` -- Accessed on player for skin/clothing changes
- `inventoryitem` -- Accessed on items for landing state during teleport
- `walkableplatform` -- Accessed on boat for player snapping
- `knownlocations` -- Accessed on creature for home location
- `combat` -- Accessed on creature for target setting
- `follower` -- Accessed on spiders for leader setting
- `stackable` -- Accessed on items for stack size
- `workable` -- Accessed in d_stalkersetup to modify work left
- `repairable` -- Accessed in d_stalkersetup to trigger onrepaired
- `hideandseekhider` -- Accessed in d_hidekitcoon and d_allcustomhidingspots to force hiding
- `lavaarenaevent` -- Accessed in d_lavaarena_speech to get Boarlord
- `specialeventsetup` -- Accessed in d_hidekitcoons to setup event
- `hunter` -- Accessed in d_hunt to force hunt
- `sanity` -- Accessed in d_islandstart to set percent
- `petleash` -- Accessed in d_waxwellworker and d_waxwellprotector to spawn pet
- `yotc_racestats` -- Accessed in d_ratracer to set stats
- `inventory` -- Accessed in d_ratracer to give item
- `cyclable` -- Used to set step on singing shells
- `growable` -- Used to advance growth stages on plants
- `moonstormmanager` -- Used to start/stop moonstorms on TheWorld
- `named` -- Used to set names on recipe cards
- `finiteuses` -- Read to dump item durability
- `perishable` -- Read to dump item spoil time
- `edible` -- Read to dump food values
- `weapon` -- Read to dump weapon damage
- `planardamage` -- Read to dump planar damage
- `armor` -- Read to dump armor stats
- `lunarthrall_plantspawner` -- Used to spawn moon plant on target
- `activatable` -- Checked in scrapbook data generation
- `burnable` -- Checked for canlight and ignorefuel
- `centipedebody` -- Set num_torso in d_spawncentipede
- `childspawner` -- Accessed for dependency calculation
- `equippable` -- Accessed for dapperness and equipslot
- `erasablepaper` -- Accessed for erased_prefab
- `fishable` -- Checked for scrapbook data
- `floater` -- Accessed in d_tweak_floater
- `forgerepair` -- Accessed for repairmaterial
- `forgerepairable` -- Accessed for repairmaterial
- `fuel` -- Accessed for fueltype and fuelvalue
- `fueled` -- Accessed for maxfuel and rate
- `harvestable` -- Checked for scrapbook data
- `inspectable` -- Accessed for nameoverride
- `insulator` -- Accessed for GetInsulation
- `locomotor` -- Used to Stop or WalkForward
- `lootdropper` -- Accessed for GetAllPossibleLoot
- `migrationmanager` -- Accessed on TheWorld for debug data
- `mutatedbuzzardcircler` -- Used to SetCircleTarget and Start
- `oar` -- Accessed for force and max_velocity
- `oceanfishingtackle` -- Accessed for casting_data and lure_data
- `periodicspawner` -- Accessed for dependency calculation
- `pickable` -- Checked for scrapbook data
- `planardefense` -- Accessed for basedefense
- `prototyper` -- Accessed for trees
- `saddler` -- Accessed for bonusdamage
- `sanityaura` -- Accessed for aura
- `shadowthrall_mimics` -- Accessed on TheWorld
- `snowmandecor` -- Checked for scrapbook data
- `spawner` -- Accessed for dependency calculation
- `spellbook` -- Used to SelectSpell
- `stewer` -- Checked for scrapbook data
- `tool` -- Accessed for actions
- `trader` -- Used to AcceptGift
- `upgradeable` -- Accessed for upgradetype
- `upgrader` -- Accessed for upgradetype
- `unwrappable` -- Used to WrapItems
- `vaultroom` -- Used to LoadRoom
- `wagpunk_arena_manager` -- Used to DebugSkipState
- `waterproofer` -- Accessed for GetEffectiveness
- `waxable` -- Checked for NeedsSpray

**Tags:**
- `cave` -- check
- `boat` -- check
- `_inventoryitem` -- check
- `FX` -- check
- `NOCLICK` -- check
- `DECOR` -- check
- `INLIMBO` -- check
- `_combat` -- check
- `player` -- check
- `CLASSIFIED` -- add
- `shadow_aligned` -- check
- `lunar_aligned` -- check
- `shadowthrall_centipede` -- check
- `wall` -- check
- `smallepic` -- check
- `haunted` -- check
- `bird` -- check
- `pig` -- check
- `merm` -- check
- `hound` -- check
- `chess` -- check
- `oceanfish` -- check
- `farm_plant` -- check
- `spider` -- check
- `tree` -- check
- `structure` -- check
- `hat` -- check
- `book` -- check
- `campfire` -- check
- `lightbattery` -- check
- `NPCcanaggro` -- check
- `epic` -- check
- `heavy` -- check
- `shadow` -- check
- `brightmare` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `d_spawnlist(list, spacing, fn)`
* **Description:** Spawns a grid of entities from a list at the console world position.
* **Parameters:**
  - `list` -- Table of prefab names or tables containing prefab, count, and init function
  - `spacing` -- Number, distance between spawned entities (default 2)
  - `fn` -- Function, optional callback executed on each spawned instance
* **Returns:** Table of created entity instances

### `d_playeritems()`
* **Description:** Spawns all craftable items associated with player builder tags in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_allmutators()`
* **Description:** Gives the player all mutator items (warrior, dropper, hider, etc.).
* **Parameters:** None
* **Returns:** nil

### `d_allcircuits()`
* **Description:** Spawns all WX-78 module circuits in a grid at the console position.
* **Parameters:** None
* **Returns:** nil

### `d_allheavy()`
* **Description:** Spawns a collection of heavy physics objects in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_spiders()`
* **Description:** Spawns various spider types and sets them to follow the player.
* **Parameters:** None
* **Returns:** nil

### `d_particles()`
* **Description:** Spawns emitting FX prefabs and attaches labels, orbiting them around a center point.
* **Parameters:** None
* **Returns:** nil

### `d_decodedata(path)`
* **Description:** Loads a persistent string from the sim and saves it as a decoded version.
* **Parameters:**
  - `path` -- String, file path to decode persistent string data
* **Returns:** nil
* **Error states:** Prints error if load fails

### `d_riftspawns()`
* **Description:** Announces rift opening, pushes world event, and spawns 200 rifts after 10 seconds.
* **Parameters:** None
* **Returns:** nil

### `d_lunarrift()`
* **Description:** Enables lunar rifts and spawns one at the console position tile center.
* **Parameters:** None
* **Returns:** nil

### `d_shadowrift()`
* **Description:** Enables shadow rifts and spawns one at the console position tile center.
* **Parameters:** None
* **Returns:** nil

### `d_oceanarena()`
* **Description:** Triggers the sharkboimanager to find and place an ocean arena over time.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Announces error if sharkboimanager is missing

### `d_exploreX(filterfn, precision)`
* **Description:** Iterates map tiles and reveals areas for the player based on a filter function.
* **Parameters:**
  - `filterfn` -- Function, takes tile, tx, ty and returns boolean
  - `precision` -- Number, grid step size (default 5)
* **Returns:** nil
* **Error states:** Announces if not playing as a character

### `d_exploreland()`
* **Description:** Reveals all land tiles on the map for the player.
* **Parameters:** None
* **Returns:** nil

### `d_exploreocean()`
* **Description:** Reveals all ocean tiles on the map for the player.
* **Parameters:** None
* **Returns:** nil

### `d_explore_printunseentiles()`
* **Description:** Prints coordinates of unseen land tiles to the console.
* **Parameters:** None
* **Returns:** nil

### `d_teleportboat(x, y, z)`
* **Description:** Teleports the player's current boat to a position, handling physics and items.
* **Parameters:**
  - `x` -- Number, optional target x coordinate
  - `y` -- Number, optional target y coordinate
  - `z` -- Number, optional target z coordinate
* **Returns:** nil
* **Error states:** Returns if not on a boat or exit is blocked

### `d_breakropebridges(delaytime)`
* **Description:** Destroys all rope bridges on the map, optionally with a delay sequence.
* **Parameters:**
  - `delaytime` -- Number, optional delay time for destruction
* **Returns:** nil
* **Error states:** Returns if ropebridgemanager is missing

### `d_rabbitking(kind)`
* **Description:** Creates a Rabbit King entity for the player via the rabbitkingmanager.
* **Parameters:**
  - `kind` -- String, optional rabbit king variant kind
* **Returns:** nil
* **Error states:** Returns if not master sim or manager missing

### `d_fullmoon()`
* **Description:** Sets the moon phase to full on the master simulation.
* **Parameters:** None
* **Returns:** nil

### `d_newmoon()`
* **Description:** Sets the moon phase to new on the master simulation.
* **Parameters:** None
* **Returns:** nil

### `d_unlockaffinities()`
* **Description:** Sets KV flags for Fuelweaver and Celestial Champion killed to unlock affinities.
* **Parameters:** None
* **Returns:** nil

### `d_resetskilltree()`
* **Description:** Deactivates all player skills and adds max XP to the skill tree updater.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns if not master sim or no player

### `d_reloadskilltreedefs()`
* **Description:** Triggers a debug rebuild of skill tree definitions.
* **Parameters:** None
* **Returns:** nil

### `d_printskilltreestringsforcharacter(character)`
* **Description:** Prints missing skill tree localization strings for a character to the console.
* **Parameters:**
  - `character` -- String, prefab name (default console player)
* **Returns:** nil

### `d_togglelunarhail()`
* **Description:** Toggles lunar rifts and triggers weather long update for lunar hail event.
* **Parameters:** None
* **Returns:** nil

### `d_allsongs()`
* **Description:** Gives the player all battlesong items.
* **Parameters:** None
* **Returns:** nil

### `d_allstscostumes()`
* **Description:** Gives the player all STS costume masks and bodies.
* **Parameters:** None
* **Returns:** nil

### `d_domesticatedbeefalo(tendency, saddle)`
* **Description:** Spawns a beefalo, maximizes domestication stats, and equips a saddle.
* **Parameters:**
  - `tendency` -- String, tendency key for domestication
  - `saddle` -- String, prefab name for saddle (default saddle_basic)
* **Returns:** nil

### `d_domestication(domestication, obedience)`
* **Description:** Sets the domestication and obedience of the selected entity to specific values.
* **Parameters:**
  - `domestication` -- Number, target domestication value
  - `obedience` -- Number, target obedience value
* **Returns:** nil
* **Error states:** Prints error if selected ent not domesticatable

### `d_testwalls()`
* **Description:** Spawns walls of various materials with varying health percentages.
* **Parameters:** None
* **Returns:** nil

### `d_testruins()`
* **Description:** Unlocks recipes for the player and gives a set of ruin exploration items.
* **Parameters:** None
* **Returns:** nil

### `d_combatgear()`
* **Description:** Gives the player basic combat armor and weapons.
* **Parameters:** None
* **Returns:** nil

### `d_teststate(state)`
* **Description:** Forces the selected entity's stategraph to go to a specific state.
* **Parameters:**
  - `state` -- String, state graph state name
* **Returns:** nil

### `d_anim(animname, loop)`
* **Description:** Plays an animation on the debug entity.
* **Parameters:**
  - `animname` -- String, animation name to play
  - `loop` -- Boolean, whether to loop the animation
* **Returns:** nil
* **Error states:** Prints error if no DebugEntity selected

### `d_light(c1, c2, c3)`
* **Description:** Sets the ambient light colour in the simulation.
* **Parameters:**
  - `c1` -- Number, color component
  - `c2` -- Number, color component (default c1)
  - `c3` -- Number, color component (default c1)
* **Returns:** nil

### `d_combatsimulator(prefab, count, force)`
* **Description:** Spawns combat entities and optionally sets them to target nearby combatants.
* **Parameters:**
  - `prefab` -- String, prefab name to spawn
  - `count` -- Number, number of entities to spawn (default 1)
  - `force` -- Boolean, whether to force aggro on nearby combat entities
* **Returns:** nil

### `d_spawn_ds(prefab, scenario)`
* **Description:** Spawns an entity, attaches a scenario runner, and executes a scenario script.
* **Parameters:**
  - `prefab` -- String, prefab to spawn
  - `scenario` -- String, scenario script name
* **Returns:** nil
* **Error states:** Prints error if no entity selected

### `d_test_thank_you(param)`
* **Description:** Pushes the ThankYouPopup screen with a skin gift item.
* **Parameters:**
  - `param` -- String, item name for the popup
* **Returns:** nil

### `d_test_skins_popup(param)`
* **Description:** Pushes the SkinsItemPopUp screen for a specific item.
* **Parameters:**
  - `param` -- String, item name for the popup
* **Returns:** nil

### `d_test_skins_announce(param)`
* **Description:** Triggers a networking skin announcement for an item.
* **Parameters:**
  - `param` -- String, item name for the announcement
* **Returns:** nil

### `d_test_skins_gift(param)`
* **Description:** Pushes the GiftItemPopUp screen for the player.
* **Parameters:**
  - `param` -- String, item name for the gift popup
* **Returns:** nil

### `d_test_mystery_box(params)`
* **Description:** Pushes the ItemBoxOpenerPopup screen for a mystery box.
* **Parameters:**
  - `params` -- Table, optional configuration for the box opener popup
* **Returns:** nil

### `d_print_skin_info()`
* **Description:** Prints skin name and usability strings for a set of test items.
* **Parameters:** None
* **Returns:** nil

### `d_skin_mode(mode)`
* **Description:** Sets the console player's skinner component to a specific skin mode.
* **Parameters:**
  - `mode` -- String, skin mode type
* **Returns:** nil

### `d_skin_name(name)`
* **Description:** Sets the console player's skinner component to a specific skin name.
* **Parameters:**
  - `name` -- String, skin name to apply
* **Returns:** nil

### `d_clothing(name)`
* **Description:** Sets the console player's clothing to a specific item.
* **Parameters:**
  - `name` -- String, clothing item name
* **Returns:** nil

### `d_clothing_clear(type)`
* **Description:** Clears the console player's clothing for a specific type.
* **Parameters:**
  - `type` -- String, clothing type to clear
* **Returns:** nil

### `d_cycle_clothing()`
* **Description:** Cycles through the player's inventory clothing items every 10 seconds.
* **Parameters:** None
* **Returns:** nil

### `d_sinkhole()`
* **Description:** Spawns an antlion sinkhole and triggers its collapse event.
* **Parameters:** None
* **Returns:** nil

### `d_stalkersetup()`
* **Description:** Spawns a fossil stalker mound, repairs it fully, and gives shadow heart and atrium key items.
* **Parameters:** None
* **Returns:** nil

### `d_resetruins()`
* **Description:** Pushes the resetruins event to TheWorld.
* **Parameters:** None
* **Returns:** nil

### `d_getwidget()`
* **Description:** Returns the currently selected debug widget target from TheFrontEnd.
* **Parameters:** None
* **Returns:** Widget

### `d_halloween()`
* **Description:** Spawns all trinket and halloweencandy prefabs in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_potions()`
* **Description:** Spawns all halloween potion prefabs in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_weirdfloaters()`
* **Description:** Spawns a predefined list of floatable item prefabs in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_wintersfeast()`
* **Description:** Spawns all winter ornament prefabs in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_wintersfood()`
* **Description:** Spawns all winter food prefabs in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_madsciencemats()`
* **Description:** Gives all halloween experiment materials to the player.
* **Parameters:** None
* **Returns:** nil

### `d_showalleventservers()`
* **Description:** Toggles the _showalleventservers flag on TheFrontEnd.
* **Parameters:** None
* **Returns:** nil

### `d_lavaarena_skip()`
* **Description:** Pushes the ms_lavaarena_endofstage event to skip the current stage.
* **Parameters:** None
* **Returns:** nil

### `d_lavaarena_speech(dialog, banter_line)`
* **Description:** Makes the Boarlord entity speak specific dialog lines during the Lava Arena event.
* **Parameters:**
  - `dialog` -- String key for STRINGS table or table of lines
  - `banter_line` -- Index for banter line selection if dialog is a table
* **Returns:** nil

### `d_unlockallachievements()`
* **Description:** Reports event progress to TheItems to unlock all active achievements.
* **Parameters:** None
* **Returns:** nil

### `d_unlockfoodachievements()`
* **Description:** Reports event progress to TheItems to unlock all food-related achievements.
* **Parameters:** None
* **Returns:** nil

### `d_reportevent(other_ku)`
* **Description:** Reports specific event progress data to TheItems for testing.
* **Parameters:**
  - `other_ku` -- Optional Klei User ID for secondary player stats
* **Returns:** nil

### `d_ground(ground, pt)`
* **Description:** Sets the map tile at the specified coordinates to the specified ground type.
* **Parameters:**
  - `ground` -- Tile ID or string name of the ground tile
  - `pt` -- Vector3 position, defaults to ConsoleWorldPosition
* **Returns:** nil

### `d_portalfx()`
* **Description:** Pushes the ms_newplayercharacterspawned event for ThePlayer.
* **Parameters:** None
* **Returns:** nil

### `d_walls(width, height)`
* **Description:** Spawns wood walls in a rectangular formation around the player.
* **Parameters:**
  - `width` -- Width of the wall rectangle, defaults to 10
  - `height` -- Height of the wall rectangle, defaults to width
* **Returns:** nil

### `d_hidekitcoon()`
* **Description:** Spawns a kitcoon and forces it to hide in the entity under the mouse cursor.
* **Parameters:** None
* **Returns:** nil

### `d_hidekitcoons()`
* **Description:** Initializes the Year of the Catcoon special event setup.
* **Parameters:** None
* **Returns:** nil

### `d_allkitcoons()`
* **Description:** Spawns all kitcoon biome variants using d_spawnlist.
* **Parameters:** None
* **Returns:** nil

### `d_allcustomhidingspots()`
* **Description:** Spawns custom hiding spots and associates kitcoons with them.
* **Parameters:** None
* **Returns:** nil

### `d_hunt()`
* **Description:** Triggers the DebugForceHunt function on the world's hunter component.
* **Parameters:** None
* **Returns:** nil

### `d_islandstart()`
* **Description:** Gives the player a set of starter survival items and randomizes sanity.
* **Parameters:** None
* **Returns:** nil

### `d_waxwellworker()`
* **Description:** Spawns a shadow worker pet for the player and records spawn location.
* **Parameters:** None
* **Returns:** nil

### `d_waxwellprotector()`
* **Description:** Spawns a shadow protector pet for the player and records spawn location.
* **Parameters:** None
* **Returns:** nil

### `d_boatitems()`
* **Description:** Spawns all boat construction item prefabs.
* **Parameters:** None
* **Returns:** nil

### `d_giveturfs()`
* **Description:** Gives the player all turf items defined in worldtiledefs.
* **Parameters:** None
* **Returns:** nil

### `d_turfs()`
* **Description:** Spawns all turf items defined in worldtiledefs.
* **Parameters:** None
* **Returns:** nil

### `_SpawnLayout_AddFn(prefab, points_x, points_y, current_pos_idx, entitiesOut, width, height, prefab_list, prefab_data, rand_offset)`
* **Description:** Local helper function to spawn entities for a layout definition.
* **Parameters:**
  - `prefab` -- Prefab name to spawn
  - `points_x` -- Array of x coordinates
  - `points_y` -- Array of y coordinates
  - `current_pos_idx` -- Current index in coordinate arrays
  - `entitiesOut` -- Table to store spawned entities
  - `width` -- Layout width
  - `height` -- Layout height
  - `prefab_list` -- List of prefabs
  - `prefab_data` -- Data table for spawn record
  - `rand_offset` -- Boolean for random offset
* **Returns:** nil

### `AddTopologyData(topology, left, top, width, height, room_id, tags)`
* **Description:** Adds a node to the topology data structure.
* **Parameters:**
  - `topology` -- Topology table
  - `left` -- Left coordinate
  - `top` -- Top coordinate
  - `width` -- Room width
  - `height` -- Room height
  - `room_id` -- Identifier for the room
  - `tags` -- Table of tags for the node
* **Returns:** index

### `AddTileNodeIdsForArea(world_map, node_index, left, top, width, height)`
* **Description:** Sets the tile node ID for a rectangular area on the map.
* **Parameters:**
  - `world_map` -- World map component
  - `node_index` -- Index of the topology node
  - `left` -- Left coordinate
  - `top` -- Top coordinate
  - `width` -- Area width
  - `height` -- Area height
* **Returns:** nil

### `d_spawnlayout(name, data)`
* **Description:** Spawns a static layout at the player's position, optionally updating topology.
* **Parameters:**
  - `name` -- Name of the layout definition
  - `data` -- Optional table containing id, tags, and density settings
* **Returns:** nil

### `d_allfish()`
* **Description:** Spawns all fish prefabs defined in oceanfishdef.
* **Parameters:** None
* **Returns:** nil

### `d_fishing()`
* **Description:** Spawns all ocean fishing related items (rods, lures, bobbers).
* **Parameters:** None
* **Returns:** nil

### `d_tables()`
* **Description:** Spawns multiple winter feast tables in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_gofishing()`
* **Description:** Gives the player fishing rod and various bobbers and lures.
* **Parameters:** None
* **Returns:** nil

### `d_radius(radius, num, lifetime)`
* **Description:** Spawns flint items in a circle that remove themselves after a delay.
* **Parameters:**
  - `radius` -- Radius of the circle, defaults to 4
  - `num` -- Number of items, defaults to max(5, radius*2)
  - `lifetime` -- Time in seconds before removal, defaults to 10
* **Returns:** nil

### `d_ratracer(speed, stamina, direction, reaction)`
* **Description:** Spawns a carrat and sets its YOTC race stats to specified values.
* **Parameters:**
  - `speed` -- Speed stat value
  - `stamina` -- Stamina stat value
  - `direction` -- Direction stat value
  - `reaction` -- Reaction stat value
* **Returns:** nil

### `d_ratracers()`
* **Description:** Spawns multiple carrats with varying race stats and colors, giving them to the main character.
* **Parameters:** None
* **Returns:** nil

### `d_setup_placeholders(reuse, out_file_name)`
* **Description:** Generates speech placeholder files by iterating through speech tables and writing to a file.
* **Parameters:**
  - `reuse` -- table, speech table to reuse or populate
  - `out_file_name` -- string, path to the output file
* **Returns:** nil

### `d_allshells()`
* **Description:** Spawns singing shells of different sizes in a grid pattern at the input position.
* **Parameters:** None
* **Returns:** nil

### `d_fish(swim, r, g, b)`
* **Description:** Spawns ocean fish, optionally removes their brain, sets position, removes NOCLICK tag, and sets color.
* **Parameters:**
  - `swim` -- boolean, whether to keep brain (swim behavior)
  - `r` -- number, red color component
  - `g` -- number, green color component
  - `b` -- number, blue color component
* **Returns:** nil

### `d_farmplants(grow_stage, oversized)`
* **Description:** Spawns farm plants based on plant definitions, advancing growth stages and setting oversized flag.
* **Parameters:**
  - `grow_stage` -- number, growth stage to advance
  - `oversized` -- boolean, force oversized growth
* **Returns:** nil

### `d_plant(plant, num_wide, grow_stage, spacing)`
* **Description:** Spawns a specific plant prefab in a grid pattern, optionally advancing growth stages.
* **Parameters:**
  - `plant` -- string, prefab name
  - `num_wide` -- number, grid size
  - `grow_stage` -- number, growth stage
  - `spacing` -- number, distance between plants
* **Returns:** nil

### `d_seeds()`
* **Description:** Spawns all seed prefabs defined in farm plant definitions.
* **Parameters:** None
* **Returns:** nil

### `d_fertilizers()`
* **Description:** Spawns all fertilizer prefabs defined in nutrient definitions.
* **Parameters:** None
* **Returns:** nil

### `d_oversized()`
* **Description:** Spawns all oversized produce prefabs defined in farm plant definitions.
* **Parameters:** None
* **Returns:** nil

### `d_startmoonstorm()`
* **Description:** Starts a moonstorm at the console world position node.
* **Parameters:** None
* **Returns:** nil

### `d_stopmoonstorm()`
* **Description:** Stops the current moonstorm.
* **Parameters:** None
* **Returns:** nil

### `d_moonaltars()`
* **Description:** Spawns various moon altars around the input position.
* **Parameters:** None
* **Returns:** nil

### `d_cookbook()`
* **Description:** Iterates through cooking recipes and adds them to TheCookbook with dummy ingredients.
* **Parameters:** None
* **Returns:** nil

### `d_statues(material)`
* **Description:** Spawns chess piece statues of various types with specified material.
* **Parameters:**
  - `material` -- string or number, material type for statues
* **Returns:** nil

### `d_craftingstations()`
* **Description:** Spawns all prototyper crafting stations.
* **Parameters:** None
* **Returns:** nil

### `d_removeentitywithnetworkid(networkid, x, y, z)`
* **Description:** Finds and removes an entity matching the given network ID within a radius.
* **Parameters:**
  - `networkid` -- number, network ID of entity to remove
  - `x` -- number, search center x
  - `y` -- number, search center y
  - `z` -- number, search center z
* **Returns:** nil

### `d_recipecards()`
* **Description:** Spawns cooking recipe cards with names set via the named component.
* **Parameters:** None
* **Returns:** nil

### `d_spawnfilelist(filename, spacing)`
* **Description:** Reads a file from persistent storage and spawns prefabs listed within it.
* **Parameters:**
  - `filename` -- string, name of file containing prefab list
  - `spacing` -- number, spacing between spawned items
* **Returns:** nil

### `d_spawnallhats()`
* **Description:** Spawns all hat prefabs defined in ALL_HAT_PREFAB_NAMES.
* **Parameters:** None
* **Returns:** nil

### `spawn_mannequin_and_equip_item(item)`
* **Description:** Helper function to spawn a mannequin and equip a given item on it.
* **Parameters:**
  - `item` -- Entity, item to equip on mannequin
* **Returns:** nil

### `d_spawnallhats_onstands()`
* **Description:** Spawns all hats on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_spawnallarmor_onstands()`
* **Description:** Spawns all armor and vest prefabs on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_spawnallhandequipment_onstands()`
* **Description:** Spawns all hand equipment prefabs on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_allpillows()`
* **Description:** Spawns all pillow prefabs defined in pillow_defs.
* **Parameters:** None
* **Returns:** nil

### `d_allpillows_onstands()`
* **Description:** Spawns all pillow prefabs on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_spawnequipment_onstand(...)`
* **Description:** Spawns a mannequin at console position and equips provided items on it.
* **Parameters:**
  - `...` -- vararg, list of prefab names to spawn
* **Returns:** nil

### `d_daywalker(chain)`
* **Description:** Spawns a daywalker and surrounding pillars, optionally setting prisoners.
* **Parameters:**
  - `chain` -- boolean, whether to chain pillars to daywalker
* **Returns:** nil

### `d_moonplant()`
* **Description:** Spawns a moon plant on the currently selected entity.
* **Parameters:** None
* **Returns:** nil

### `d_punchingbags()`
* **Description:** Spawns various punching bag prefabs.
* **Parameters:** None
* **Returns:** nil

### `d_skilltreestats()`
* **Description:** Prints skill tree statistics for all characters to the console.
* **Parameters:** None
* **Returns:** nil

### `d_dumpCreatureTXT()`
* **Description:** Iterates through prefabs, spawns them, and writes health and damage stats to creatures.txt.
* **Parameters:** None
* **Returns:** nil

### `d_dumpItemsTXT()`
* **Description:** Iterates through prefabs, spawns them, and writes inventory item data to items.txt.
* **Parameters:** None
* **Returns:** nil

### `d_structuresTXT()`
* **Description:** Writes structure prefab data to a text file named structures.txt.
* **Parameters:** None
* **Returns:** nil

### `Scrapbook_AddInfo(tbl, key, value)`
* **Description:** Helper function to add formatted key-value info to the scrapbook data table.
* **Parameters:**
  - `tbl` -- table, the scrapbook data table to insert into
  - `key` -- string, the property name
  - `value` -- string, number, boolean or table, the property value
* **Returns:** nil
* **Error states:** Returns early if value is nil

### `Scrapbook_WriteToFile(buffer)`
* **Description:** Writes the generated scrapbook data to scripts/screens/redux/scrapbookdata.lua.
* **Parameters:**
  - `buffer` -- table, the scrapbook data buffer to write
* **Returns:** nil

### `Scrapbook_IsOnCraftingFilter(filter, entry)`
* **Description:** Checks if a prefab entry belongs to a specific crafting filter.
* **Parameters:**
  - `filter` -- string, the crafting filter name
  - `entry` -- string, the prefab entry to check
* **Returns:** boolean

### `Scrapbook_DefineSubCategory(t)`
* **Description:** Determines the scrapbook sub-category for a given entity based on tags and components.
* **Parameters:**
  - `t` -- Entity, the prefab instance to categorize
* **Returns:** string

### `Scrapbook_DefineName(t)`
* **Description:** Determines the display name for a scrapbook entry.
* **Parameters:**
  - `t` -- Entity, the prefab instance
* **Returns:** string

### `Scrapbook_DefineType(t, entry)`
* **Description:** Determines the scrapbook thing type (creature, food, item, etc.) for an entity.
* **Parameters:**
  - `t` -- Entity, the prefab instance
  - `entry` -- string, the prefab name
* **Returns:** string

### `Scrapbook_DefineAnimation(t)`
* **Description:** Determines the animation name to use for the scrapbook icon.
* **Parameters:**
  - `t` -- Entity, the prefab instance
* **Returns:** string

### `Scrapbook_GetSanityAura(inst)`
* **Description:** Retrieves the sanity aura value from an entity.
* **Parameters:**
  - `inst` -- Entity, the instance to check
* **Returns:** number or nil

### `Scrapbook_GetSkillOwner(skill)`
* **Description:** Finds the character owner of a specific skill tree skill.
* **Parameters:**
  - `skill` -- string, the skill name
* **Returns:** string

### `d_printscrapbookrepairmaterialsdata()`
* **Description:** Prints repair material data for scrapbook debugging.
* **Parameters:** None
* **Returns:** nil

### `d_createscrapbookdata(print_missing_icons)`
* **Description:** Main function to generate scrapbook data for all prefabs, handling season/weather overrides.
* **Parameters:**
  - `print_missing_icons` -- boolean, optional flag to print missing icon warnings
* **Returns:** nil
* **Error states:** Aborts if prefab is invalid or missing AnimState

### `d_unlockscrapbook()`
* **Description:** Unlocks all scrapbook entries via debug function.
* **Parameters:** None
* **Returns:** nil

### `d_erasescrapbookentrydata(entry)`
* **Description:** Erases storage data for a specific scrapbook entry.
* **Parameters:**
  - `entry` -- string, the scrapbook entry name
* **Returns:** nil
* **Error states:** Returns early if entry is invalid

### `d_waxplant(plant)`
* **Description:** Applies wax to a plant entity.
* **Parameters:**
  - `plant` -- Entity, optional plant instance, defaults to entity under mouse
* **Returns:** nil

### `d_checkmissingscrapbookentries()`
* **Description:** Checks for prefabs that have names but missing scrapbook entries.
* **Parameters:** None
* **Returns:** nil

### `_testhash(word, results)`
* **Description:** Helper to test hash collisions.
* **Parameters:**
  - `word` -- string, the word to hash
  - `results` -- table, table to store hash results
* **Returns:** boolean

### `_getbins(bitswanted, results)`
* **Description:** Calculates hash distribution bins.
* **Parameters:**
  - `bitswanted` -- number, number of bits for bin mask
  - `results` -- table, hash results table
* **Returns:** table

### `_printbins(bins, total, collisions)`
* **Description:** Prints hash bin statistics.
* **Parameters:**
  - `bins` -- table, bin counts
  - `total` -- number, total items
  - `collisions` -- number, collision count
* **Returns:** nil

### `d_testhashes_random(bitswanted, tests)`
* **Description:** Tests hash collisions on random strings.
* **Parameters:**
  - `bitswanted` -- number, bits for mask
  - `tests` -- number, number of random tests
* **Returns:** nil

### `d_testhashes_prefabs(bitswanted)`
* **Description:** Tests hash collisions on existing prefabs.
* **Parameters:**
  - `bitswanted` -- number, bits for mask
* **Returns:** nil

### `d_testworldstatetags()`
* **Description:** Tests world state tag decoding and printing.
* **Parameters:** None
* **Returns:** nil

### `worldtopology_createent(worldtopologyvisuals, x, z, icon, labelstr)`
* **Description:** Creates a classified entity for visualizing world topology.
* **Parameters:**
  - `worldtopologyvisuals` -- table, list to store visual entities
  - `x` -- number, x position
  - `z` -- number, z position
  - `icon` -- string, minimap icon
  - `labelstr` -- string, optional label text
* **Returns:** Entity

### `d_gotoworldtopologyindex(nodexindex)`
* **Description:** Teleports the player to a specific world topology node.
* **Parameters:**
  - `nodexindex` -- number, the node index to teleport to
* **Returns:** nil
* **Error states:** Returns early if World or Player is missing

### `d_drawworldtopology()`
* **Description:** Draws visual markers for world topology nodes and connections.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if World is missing

### `d_drawworldroute(routename)`
* **Description:** Draws visual markers for a specific world route.
* **Parameters:**
  - `routename` -- string, the name of the route to draw
* **Returns:** nil
* **Error states:** Returns early if World or route is missing

### `GetAvgCenterOfTask(task_name, manager)`
* **Description:** Calculates the average center position of a migration task.
* **Parameters:**
  - `task_name` -- string, the task name to search
  - `manager` -- Component, optional migration manager
* **Returns:** Vector3
* **Error states:** Returns Vector3(0,0,0) if no nodes found

### `d_drawworldbirdmigration()`
* **Description:** Draws visual markers for bird migration paths.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if World or migration map is missing

### `d_printworldroutetime(routename, speed, bonus)`
* **Description:** Prints estimated travel time for a world route.
* **Parameters:**
  - `routename` -- string, the route name
  - `speed` -- number, travel speed
  - `bonus` -- number, speed bonus
* **Returns:** nil
* **Error states:** Returns early if World or route is missing

### `d_wagpunkarena_nexttask()`
* **Description:** Skips the current state in the Wagpunk arena manager.
* **Parameters:** None
* **Returns:** nil

### `d_require(file)`
* **Description:** Reloads a Lua file by clearing package cache.
* **Parameters:**
  - `file` -- string, the file path to reload
* **Returns:** nil

### `d_mapstatistics(count_cutoff, item_cutoff, density_cutoff)`
* **Description:** Prints statistics about prefab counts and tile density on the map.
* **Parameters:**
  - `count_cutoff` -- number, minimum count to print prefabs
  - `item_cutoff` -- number, minimum count to print items
  - `density_cutoff` -- number, minimum density to print spots
* **Returns:** nil

### `_DamageListenerFn(inst, data)`
* **Description:** Callback function to accumulate damage for DPS testing.
* **Parameters:**
  - `inst` -- Entity, the entity taking damage
  - `data` -- table, event data containing damage amount
* **Returns:** nil

### `d_testdps(time, target)`
* **Description:** Tests damage per second on a target entity over a set time.
* **Parameters:**
  - `time` -- number, duration of the test in seconds
  - `target` -- Entity, optional target, defaults to entity under mouse
* **Returns:** nil

### `d_timeddebugprefab(x, y, z, lifetime, prefab)`
* **Description:** Spawns a prefab that automatically removes itself after a lifetime.
* **Parameters:**
  - `x` -- number, x position
  - `y` -- number, y position
  - `z` -- number, z position
  - `lifetime` -- number, seconds before removal
  - `prefab` -- string, prefab name to spawn
* **Returns:** Entity

### `d_prizepouch(prefab, nugget_count)`
* **Description:** Spawns a prize pouch containing wrapped gold nuggets.
* **Parameters:**
  - `prefab` -- string, pouch prefab name
  - `nugget_count` -- number, number of gold nuggets to wrap
* **Returns:** nil

### `d_boatracepointers()`
* **Description:** Spawns boat race checkpoint indicators.
* **Parameters:** None
* **Returns:** nil

### `d_testsound(soundpath, loopname, volume)`
* **Description:** Plays a test sound on the selected entity or player.
* **Parameters:**
  - `soundpath` -- string, path to the sound
  - `loopname` -- string, sound loop name
  - `volume` -- number, volume level
* **Returns:** nil

### `d_stopsound(loopname)`
* **Description:** Stops a playing sound loop.
* **Parameters:**
  - `loopname` -- string, sound loop name to stop
* **Returns:** nil

### `d_spell(spellnum, item)`
* **Description:** Casts a spell from a spellbook item.
* **Parameters:**
  - `spellnum` -- number, spell index
  - `item` -- Entity, optional spellbook item
* **Returns:** nil

### `d_itemwithshadowmimic(item_prefab)`
* **Description:** Spawns an item and adds the itemmimic component.
* **Parameters:**
  - `item_prefab` -- string, prefab name of the item
* **Returns:** nil
* **Error states:** Returns early if shadowthrall_mimics component is missing

### `d_shadowparasite(host_prefab)`
* **Description:** Spawns a host entity and equips it with a shadow parasite hat.
* **Parameters:**
  - `host_prefab` -- string, prefab name of the host
* **Returns:** nil

### `d_tweak_floater(size, offset, scale, swap_bank, float_index, swap_data)`
* **Description:** Modifies the floater component of the selected entity.
* **Parameters:**
  - `size` -- string, floater size
  - `offset` -- number, vertical offset
  - `scale` -- number, scale factor
  - `swap_bank` -- string, bank to swap
  - `float_index` -- number, float index
  - `swap_data` -- table, swap data
* **Returns:** nil

### `d_startlunarhail()`
* **Description:** Triggers the lunar hail event on the world.
* **Parameters:** None
* **Returns:** nil

### `d_testbirdattack()`
* **Description:** Spawns a mutated bird to attack the player.
* **Parameters:** None
* **Returns:** nil

### `d_testbirdclearhail()`
* **Description:** Spawns a mutated bird to clear lunar buildup from the selected entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if no entity selected

### `d_spawncentipede(num)`
* **Description:** Spawns a shadowthrall centipede with specified torso count.
* **Parameters:**
  - `num` -- number, number of torso segments
* **Returns:** nil

### `d_movementon()`
* **Description:** Enables forward movement on the selected entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if no entity selected

### `d_followplayer()`
* **Description:** Makes the selected entity face and follow the player periodically.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if no entity selected

### `d_stopcentipedemovement()`
* **Description:** Stops movement for all shadowthrall centipedes.
* **Parameters:** None
* **Returns:** nil

### `d_lightworld()`
* **Description:** Toggles world ambient lighting override.
* **Parameters:** None
* **Returns:** nil

### `d_activatearchives()`
* **Description:** Activates archive switches by giving them an opal gem.
* **Parameters:** None
* **Returns:** nil

### `d_vaultroom(id)`
* **Description:** Loads a specific vault room on the first found vaultroom entity.
* **Parameters:**
  - `id` -- string, the room ID to load
* **Returns:** nil

### `d_spawnvaultactors()`
* **Description:** Spawns Wilson actors with ancient masks at the charlie stage.
* **Parameters:** None
* **Returns:** nil

### `d_debug_arc_attack_hitbox(arc_span, forward_offset, arc_radius, lifetime)`
* **Description:** Debugs an arc attack hitbox on the selected entity.
* **Parameters:**
  - `arc_span` -- number, arc span
  - `forward_offset` -- number, forward offset
  - `arc_radius` -- number, arc radius
  - `lifetime` -- number, debug lifetime
* **Returns:** nil

### `d_lunarmutation(corpseprefab, buildid)`
* **Description:** Spawns a non-gestalt lunar mutation corpse.
* **Parameters:**
  - `corpseprefab` -- string, corpse prefab name
  - `buildid` -- string, optional build ID
* **Returns:** nil

### `d_gestaltmutation(corpseprefab, buildid)`
* **Description:** Spawns a gestalt mutation corpse.
* **Parameters:**
  - `corpseprefab` -- string, corpse prefab name
  - `buildid` -- string, optional build ID
* **Returns:** nil

### `d_mutatedbuzzardcircler()`
* **Description:** Spawns a circling buzzard targeting the player.
* **Parameters:** None
* **Returns:** Entity

### `d_placegridgroupoutline()`
* **Description:** Places a grid group outline at the input position.
* **Parameters:** None
* **Returns:** nil

### `d_removegridgroupoutline()`
* **Description:** Removes a grid group outline at the input position.
* **Parameters:** None
* **Returns:** nil

### `d_tiles()`
* **Description:** Sets map tiles around the input position to impassable and turf.
* **Parameters:** None
* **Returns:** nil

### `d_getmigrationpopulation(migrator_type)`
* **Description:** Returns the population data for a specific migrator type.
* **Parameters:**
  - `migrator_type` -- string, the migrator type name
* **Returns:** table
* **Error states:** Returns nil if type not found

## Events & listeners

**Listens to:**
- `onremove` -- Listened in d_combatsimulator to respawn creature
- `droppedtarget` -- Listened in d_combatsimulator to re-acquire target
- `attacked` -- Listened to in d_testdps to accumulate damage count

**Pushes:**
- `shadowrift_opened` -- Pushed in d_riftspawns if world is cave
- `lunarrift_opened` -- Pushed in d_riftspawns if world is not cave
- `ms_setmoonphase` -- Pushed in d_fullmoon and d_newmoon to set moon phase
- `startcollapse` -- Pushed in d_sinkhole on spawned antlion_sinkhole
- `resetruins` -- Pushed by d_resetruins to reset ruins state
- `ms_lavaarena_endofstage` -- Pushed by d_lavaarena_skip to end lava arena stage
- `lavaarena_talk` -- Pushed by d_lavaarena_speech to trigger Boarlord dialog
- `ms_newplayercharacterspawned` -- Pushed by d_portalfx to trigger spawn effects
- `ms_setseason` -- Pushed in d_createscrapbookdata to force autumn season
- `ms_forceprecipitation` -- Pushed in d_createscrapbookdata to stop rain
- `overrideambientlighting` -- Pushed in d_lightworld to toggle lighting
- `ms_startlunarhail` -- Pushed in d_startlunarhail to start event