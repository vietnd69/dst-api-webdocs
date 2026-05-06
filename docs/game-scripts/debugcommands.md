---
id: debugcommands
title: Debugcommands
description: This file defines a comprehensive suite of debug console commands for Don't Starve Together that enables entity spawning, world manipulation, system testing, scrapbook data generation, and various development utilities for modders and developers.
tags: [debug, console, development, utilities, testing]
sidebar_position: 10

last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: root
source_hash: 2db391ca
system_scope: world
---

# Debugcommands

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`debugcommands.lua` provides an extensive collection of console command functions (prefixed with `d_`) that serve as development and debugging tools for Don't Starve Together. These commands cover entity spawning, world state manipulation, event testing, skin and clothing validation, scrapbook data generation, topology visualization, and system-specific debugging for features like fishing, farming, combat, and seasonal events. The file requires multiple external modules including prefab definitions, skill tree configurations, and screen interfaces to support its diverse functionality. These commands are primarily intended for development and testing purposes, allowing developers to quickly instantiate entities, modify world conditions, and verify game systems without manual gameplay.

## Usage example
```lua
-- Debug functions are global console commands, available directly in debug context
-- No module import required - these are built-in debug utilities

-- Spawn a list of entities at console position
d_spawnlist({"spider", "beefalo"}, 5)

-- Test skin functionality on current player
d_skin_mode("ghost_skin")
d_clothing("hat_winterhat")

-- Generate scrapbook data for debugging
d_createscrapbookdata()

-- Visualize world topology and migration routes
d_drawworldtopology()
d_drawworldbirdmigration()

-- Manipulate world events
d_startmoonstorm()
d_halloween()
```

## Dependencies & tags
**External dependencies:**
- `scrapbook_prefabs` -- scrapbook prefab definitions for data generation
- `wx78_moduledefs` -- WX-78 circuit module definitions
- `worldtiledefs` -- ground tile and turf definitions
- `map/object_layout` -- layout spawning and topology utilities
- `prefabs/oceanfishdef` -- ocean fish prefab definitions
- `prefabs/farm_plant_defs` -- farm plant and growth definitions
- `prefabs/fertilizer_nutrient_defs` -- fertilizer nutrient definitions
- `prefabs/pillow_defs` -- pillow prefab definitions
- `prefabs/skilltree_defs` -- skill tree definitions and metadata
- `cooking` -- cookbook and recipe card data
- `techtree` -- technology tree definitions
- `prefabs/waxed_plant_common` -- waxed plant utilities
- `screens/thankyoupopup` -- thank you popup screen for skin testing
- `screens/skinsitempopup` -- skins item popup screen
- `screens/giftitempopup` -- gift item popup screen
- `screens/redux/itemboxopenerpopup` -- mystery box opener popup
- `skin_gifts` -- skin gift type definitions

**Components used:**
- `riftspawner` -- spawn and highlight rifts via TheWorld.components.riftspawner
- `sharkboimanager` -- access shark boy manager via TheWorld.components.sharkboimanager
- `ropebridgemanager` -- access rope bridge manager via TheWorld.components.ropebridgemanager
- `rabbitkingmanager` -- access rabbit king manager via TheWorld.components.rabbitkingmanager
- `skilltreeupdater` -- update skill tree via player.components.skilltreeupdater
- `weather` -- access weather events via TheWorld.net.components.weather (network layer)
- `moonstormmanager` -- start/stop moonstorms via TheWorld.components.moonstormmanager
- `lunarthrall_plantspawner` -- spawn lunar thrall plants via TheWorld.components.lunarthrall_plantspawner
- `worldroutes` -- access world routes via TheWorld.components.worldroutes
- `migrationmanager` -- access migration populations via TheWorld.components.migrationmanager
- `wagpunk_arena_manager` -- debug skip state via TheWorld.components.wagpunk_arena_manager
- `shadowthrall_mimics` -- access shadow thrall mimics via TheWorld.components.shadowthrall_mimics
- `hunter` -- access hunter component via TheWorld.components.hunter
- `specialeventsetup` -- setup special events via TheWorld.components.specialeventsetup
- `skinner` -- set skin mode, name, and clothing via player.components.skinner
- `petleash` -- spawn pets via player.components.petleash
- `inventory` -- give items via player.components.inventory
- `sanity` -- set sanity percent via player.components.sanity
- `builder` -- unlock recipes via player.components.builder
- `domesticatable` -- set domestication values via beefalo.components.domesticatable
- `rideable` -- set saddle via beefalo.components.rideable
- `health` -- set health percent via wall.components.health
- `combat` -- set combat target via creature.components.combat
- `knownlocations` -- remember locations via creature.components.knownlocations
- `scenariorunner` -- run scenario scripts via inst.components.scenariorunner
- `follower` -- set leader via spider.components.follower
- `stackable` -- set stack size via inst.components.stackable
- `walkableplatform` -- get players on platform via boat.components.walkableplatform
- `inventoryitem` -- set landed state via ent.components.inventoryitem
- `hideandseekhider` -- hide kitcoons via kitcoon.components.hideandseekhider
- `growable` -- advance growth stages via plant.components.growable
- `cyclable` -- set step via shell.components.cyclable
- `yotc_racestats` -- set race stats via carrat.components.yotc_racestats
- `locomotor` -- walk/stop via centipede.components.locomotor
- `talker` -- ignore talking via player.components.talker
- `floater` -- tweak floater via inst.components.floater
- `spellbook` -- select spell via item.components.spellbook
- `centipedebody` -- set torso segments via controller.components.centipedebody
- `vaultroom` -- load/unload rooms via inst.components.vaultroom
- `trader` -- accept gifts via archive_switch.components.trader
- `mutatedbuzzardcircler` -- set circle target via buzzard.components.mutatedbuzzardcircler

**Tags:**
- `boat` -- check if player is on boat
- `cave` -- check world tag for rift spawning
- `NOCLICK` -- remove from fish entities
- `CLASSIFIED` -- add to topology visual entities
- `FX` -- check/exclude from scrapbook and teleport
- `smallcreature` -- check for creature classification
- `monster` -- check for creature classification
- `animal` -- check for creature classification
- `smallepic` -- check for scrapbook subcategory
- `haunted` -- check for scrapbook subcategory
- `singingshell` -- check for scrapbook subcategory
- `pig` -- check for scrapbook subcategory
- `merm` -- check for scrapbook subcategory
- `chess` -- check for scrapbook subcategory
- `oceanfish` -- check for scrapbook subcategory
- `wagstafftool` -- check for scrapbook subcategory
- `pocketwatch` -- check for scrapbook subcategory
- `groundtile` -- check for scrapbook subcategory
- `backpack` -- check for scrapbook subcategory
- `chest` -- check for scrapbook subcategory
- `battlesong` -- check for scrapbook subcategory
- `ghostlyelixir` -- check for scrapbook subcategory
- `farm_plant` -- check for scrapbook subcategory
- `spidermutator` -- check for scrapbook subcategory
- `slingshotammo` -- check for scrapbook subcategory
- `heavy` -- check for scrapbook subcategory
- `hat` -- check for scrapbook subcategory
- `book` -- check for scrapbook subcategory
- `winter_ornament` -- check for scrapbook subcategory
- `halloween_ornament` -- check for scrapbook subcategory
- `spider` -- check for scrapbook subcategory
- `insect` -- check for scrapbook subcategory
- `tree` -- check for scrapbook subcategory
- `structure` -- check for scrapbook subcategory
- `campfire` -- check for scrapbook subcategory
- `blueflame` -- check for campfire variant
- `lightbattery` -- check for scrapbook subcategory
- `NPCcanaggro` -- check for creature type
- `shadow_aligned` -- add to notes in scrapbook
- `lunar_aligned` -- add to notes in scrapbook
- `shadowthrall_centipede` -- check for stop movement
- `INLIMBO` -- exclude from scrapbook and teleport
- `DECOR` -- exclude from teleport
- `_inventoryitem` -- filter for teleport items
- `player` -- exclude from entity find
- `wall` -- check for scrapbook subcategory
- `wallbuilder` -- check for scrapbook subcategory
- `bird` -- check for scrapbook subcategory
- `buzzard` -- check for scrapbook subcategory
- `tallbird` -- check for scrapbook subcategory
- `hound` -- check for scrapbook subcategory
- `warg` -- check for scrapbook subcategory
- `brightmare` -- check for scrapbook subcategory
- `shadow` -- check for scrapbook subcategory
- `stalker` -- check for scrapbook subcategory
- `shadowthrall` -- check for scrapbook subcategory
- `shadowhand` -- check for scrapbook subcategory
- `epic` -- check for giant type
- `crabking` -- check for giant type
- `boatbumper` -- exclude from creature type
- `fence` -- exclude from creature type
- `ancienttree` -- exclude from tree subcategory
- `rock_tree` -- exclude from tree subcategory
- `leif` -- exclude from tree subcategory
- `manrabbit` -- exclude from pig subcategory

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| TELEPORTBOAT_ITEM_MUST_TAGS | table | `{"_inventoryitem"}` | Tags that items must have to be teleported by boat |
| TELEPORTBOAT_ITEM_CANT_TAGS | table | `{"FX", "NOCLICK", "DECOR", "INLIMBO"}` | Tags that prevent items from being teleported by boat |
| TELEPORTBOAT_BLOCKER_CANT_TAGS | table | `{"FX", "NOCLICK", "DECOR", "INLIMBO", "_inventoryitem"}` | Tags that prevent entities from blocking boat teleportation |
| COMBAT_TAGS | table | `{"_combat"}` | Tags used for combat-related entity filtering |
| TEST_ITEM_NAME | string | `"birdcage_pirate"` | Test prefab name for debugging |
| WAXED_PLANTS | table | (from require) | Waxed plant prefab data from waxed_plant_common |
| DARK | boolean | `true` | Flag for dark mode/state in d_lightworld |
| CREATING_SCRAPBOOK_DATA | boolean | `nil` | Flag indicating scrapbook data generation is in progress |
| IGNORE_PATTERN_checkmissingscrapbookentries | table | (pattern list) | Patterns to ignore when checking for missing scrapbook entries |
| SCRAPBOOK_IGNORE_UNLOCKABILITY | table | (prefab list) | Prefabs to ignore when checking scrapbook unlockability |
| SKIP_SPECIALINFO_CHECK | table | (info list) | Special info entries to skip validation checks |
| SCRAPBOOK_NAME_LOOKUP | table | (name mappings) | Maps prefabs to alternate scrapbook names |
| RECIPE_BUILDER_TAG_LOOKUP | table | (builder mappings) | Maps recipe builder tags to character names |
| scrapbook_finiteuses_useamount_modifiers | table | (modifier list) | Component names that modify finiteuses consumption rate |
| skiplist | table | (prefab skip list) | Prefab names to skip during dump operations (creatures, items, structures) |
| REPAIR_MATERIAL_DATA | table | (repair material mappings) | Maps repair materials to their corresponding repair item prefabs for scrapbook data |

## Main functions

### `d_spawnlist(list, spacing, fn)`
* **Description:** Spawns a grid of prefabs at console world position, arranging them in a square pattern with configurable spacing.
* **Parameters:**
  - `list` -- table, array of prefab names or tables with `{prefab, count, item_fn}` structure
  - `spacing` -- number, distance between spawned entities (default 2)
  - `fn` -- function, optional callback function called on each spawned instance
* **Returns:** table -- array of created entity instances

### `d_playeritems()`
* **Description:** Spawns all craftable items organized by builder tag at console position.
* **Parameters:** None
* **Returns:** nil

### `d_allmutators()`
* **Description:** Gives the player all mutator items (warrior, dropper, hider, spitter, moon, water).
* **Parameters:** None
* **Returns:** nil

### `d_allcircuits()`
* **Description:** Spawns all WX-78 module circuit prefabs in a grid pattern at console position.
* **Parameters:** None
* **Returns:** nil

### `d_allheavy()`
* **Description:** Spawns all heavy physics objects (boulders, sculptures, oversized items) in rows at console position.
* **Parameters:** None
* **Returns:** nil

### `d_spiders()`
* **Description:** Spawns all spider variants and sets them to follow the local player.
* **Parameters:** None
* **Returns:** nil

### `d_particles()`
* **Description:** Spawns particle effect prefabs in a grid pattern with labels, then rotates them in a circular pattern periodically.
* **Parameters:** None
* **Returns:** nil

### `d_decodedata(path)`
* **Description:** Loads a persistent string from sim storage and saves it as a decoded version.
* **Parameters:**
  - `path` -- string, file path to decode from persistent storage
* **Returns:** nil

### `d_riftspawns()`
* **Description:** Opens lunar or shadow rifts based on world type, then spawns 200 rifts after 10 seconds.
* **Parameters:** None
* **Returns:** nil

### `d_lunarrift()`
* **Description:** Enables lunar rifts and spawns one at console world position.
* **Parameters:** None
* **Returns:** nil

### `d_shadowrift()`
* **Description:** Enables shadow rifts and spawns one at console world position.
* **Parameters:** None
* **Returns:** nil

### `d_oceanarena()`
* **Description:** Triggers the Sharkboi ocean arena placement via sharkboimanager component.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if sharkboimanager component is missing from TheWorld

### `d_exploreland()`
* **Description:** Reveals all land tiles on the map for the current player.
* **Parameters:** None
* **Returns:** nil

### `d_exploreocean()`
* **Description:** Reveals all ocean tiles on the map for the current player.
* **Parameters:** None
* **Returns:** nil

### `d_explore_printunseentiles()`
* **Description:** Prints coordinates of unseen land tiles that the player cannot see on minimap.
* **Parameters:** None
* **Returns:** nil

### `d_teleportboat(x, y, z)`
* **Description:** Teleports the player's current boat to specified coordinates, handling item collision and platform entities.
* **Parameters:**
  - `x` -- number, optional target x position (uses console position if nil)
  - `y` -- number, optional target y position
  - `z` -- number, optional target z position
* **Returns:** nil
* **Error states:** Returns early if no player found or player is not on a boat; returns if exit position is blocked

### `d_breakropebridges(delaytime)`
* **Description:** Destroys all rope bridges on the map, optionally with delayed destruction animation.
* **Parameters:**
  - `delaytime` -- number, optional delay time for destruction animation
* **Returns:** nil
* **Error states:** Returns early if ropebridgemanager component is missing from TheWorld

### `d_rabbitking(kind)`
* **Description:** Spawns a Rabbit King boss for the current player via rabbitkingmanager.
* **Parameters:**
  - `kind` -- string, optional rabbit king variant kind (e.g., 'warrior', 'dropper')
* **Returns:** nil
* **Error states:** Returns early if no player, not on master sim, or rabbitkingmanager is missing

### `d_fullmoon()`
* **Description:** Sets the moon phase to full on master sim.
* **Parameters:** None
* **Returns:** nil

### `d_newmoon()`
* **Description:** Sets the moon phase to new on master sim.
* **Parameters:** None
* **Returns:** nil

### `d_unlockaffinities()`
* **Description:** Sets GenericKV flags to mark Fuelweaver and Celestial Champion as killed.
* **Parameters:** None
* **Returns:** nil

### `d_resetskilltree()`
* **Description:** Deactivates all skills for the current player and adds maximum skill XP.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Returns early if no player or not on master sim

### `d_reloadskilltreedefs()`
* **Description:** Triggers debug rebuild of skill tree definitions.
* **Parameters:** None
* **Returns:** nil

### `d_printskilltreestringsforcharacter(character)`
* **Description:** Prints missing skill tree localization strings for a character to console.
* **Parameters:**
  - `character` -- string, optional character prefab name (defaults to current player)
* **Returns:** nil

### `d_togglelunarhail()`
* **Description:** Enables lunar rifts and triggers lunar hail event via weather component.
* **Parameters:** None
* **Returns:** nil

### `d_allsongs()`
* **Description:** Gives the player all battlesong items.
* **Parameters:** None
* **Returns:** nil

### `d_allstscostumes()`
* **Description:** Gives the player all masquerade costumes (masks and bodies).
* **Parameters:** None
* **Returns:** nil

### `d_domesticatedbeefalo(tendency, saddle)`
* **Description:** Spawns a fully domesticated beefalo with specified tendency and saddle.
* **Parameters:**
  - `tendency` -- string, tendency type (ORANGE, DEFAULT, etc.)
  - `saddle` -- string, optional saddle prefab name (default 'saddle_basic')
* **Returns:** nil

### `d_domestication(domestication, obedience)`
* **Description:** Sets domestication and obedience values on the selected entity.
* **Parameters:**
  - `domestication` -- number, optional domestication value to set
  - `obedience` -- number, optional obedience value to set
* **Returns:** nil
* **Error states:** Prints warning if selected entity has no domesticatable component

### `d_testwalls()`
* **Description:** Spawns test walls of various materials at different health percentages near player.
* **Parameters:** None
* **Returns:** nil

### `d_testruins()`
* **Description:** Unlocks ruins tech recipes and gives player essential ruins exploration items.
* **Parameters:** None
* **Returns:** nil

### `d_combatgear()`
* **Description:** Gives the player basic combat gear (armor, hat, spear).
* **Parameters:** None
* **Returns:** nil

### `d_teststate(state)`
* **Description:** Forces the selected entity's stategraph to go to specified state.
* **Parameters:**
  - `state` -- string, stategraph state name to transition to
* **Returns:** nil

### `d_anim(animname, loop)`
* **Description:** Plays an animation on the debug entity.
* **Parameters:**
  - `animname` -- string, animation name to play
  - `loop` -- boolean, whether to loop the animation (default false)
* **Returns:** nil
* **Error states:** Prints message if no DebugEntity is selected

### `d_light(c1, c2, c3)`
* **Description:** Sets the ambient light color in the simulation.
* **Parameters:**
  - `c1` -- number, red color component (0-1)
  - `c2` -- number, green color component (defaults to c1)
  - `c3` -- number, blue color component (defaults to c1)
* **Returns:** nil

### `d_combatsimulator(prefab, count, force)`
* **Description:** Spawns creatures for combat testing with automatic target reassignment on drop.
* **Parameters:**
  - `prefab` -- string, prefab name to spawn for combat testing
  - `count` -- number, number of instances to spawn (default 1)
  - `force` -- boolean, whether to force combat targeting
* **Returns:** nil

### `d_spawn_ds(prefab, scenario)`
* **Description:** Spawns an entity and applies a scenario script via scenariorunner component.
* **Parameters:**
  - `prefab` -- string, prefab name to spawn
  - `scenario` -- string, scenario script name to apply
* **Returns:** nil
* **Error states:** Returns early if spawn fails

### `d_test_thank_you(param)`
* **Description:** Opens the ThankYouPopup screen for testing skin DLC entitlements.
* **Parameters:**
  - `param` -- string, optional item name for thank you popup (defaults to TEST_ITEM_NAME constant if not provided)
* **Returns:** nil

### `d_test_skins_popup(param)`
* **Description:** Opens the SkinsItemPopUp screen for testing.
* **Parameters:**
  - `param` -- string, optional item name for skins popup
* **Returns:** nil

### `d_test_skins_announce(param)`
* **Description:** Triggers a networking skin announcement for testing.
* **Parameters:**
  - `param` -- string, optional item name for skin announcement
* **Returns:** nil

### `d_test_skins_gift(param)`
* **Description:** Opens the GiftItemPopUp screen for testing.
* **Parameters:**
  - `param` -- string, optional item name for gift popup
* **Returns:** nil

### `d_test_mystery_box(params)`
* **Description:** Opens the ItemBoxOpenerPopup for testing mystery box opening.
* **Parameters:**
  - `params` -- table, optional params table with allow_cancel, box_build, skin_pack keys
* **Returns:** nil

### `d_print_skin_info()`
* **Description:** Prints skin name and usability info for test items to console.
* **Parameters:** None
* **Returns:** nil

### `d_skin_mode(mode)`
* **Description:** Sets the player's skin mode via skinner component.
* **Parameters:**
  - `mode` -- string, skin mode to set on player
* **Returns:** nil

### `d_skin_name(name)`
* **Description:** Sets the player's skin name via skinner component.
* **Parameters:**
  - `name` -- string, skin name to set on player
* **Returns:** nil

### `d_clothing(name)`
* **Description:** Sets clothing on the player via skinner component.
* **Parameters:**
  - `name` -- string, clothing item name to equip
* **Returns:** nil

### `d_clothing_clear(type)`
* **Description:** Clears clothing of specified type on the player via skinner component.
* **Parameters:**
  - `type` -- string, clothing type to clear
* **Returns:** nil

### `d_cycle_clothing()`
* **Description:** Cycles through all inventory items as clothing on the player every 10 seconds.
* **Parameters:** None
* **Returns:** nil

### `d_sinkhole()`
* **Description:** Spawns an antlion sinkhole and triggers its collapse event.
* **Parameters:** None
* **Returns:** nil

### `d_stalkersetup()`
* **Description:** Spawns a fossil_stalker prefab and simulates repair completion by calling onrepaired for each work unit, then gives shadowheart and atrium_key items.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if spawned mound has no workable or repairable component

### `d_resetruins()`
* **Description:** Pushes the resetruins event to TheWorld to reset ruins state.
* **Parameters:** None
* **Returns:** nil

### `d_getwidget()`
* **Description:** Returns the widget currently selected by the debug widget editor (WidgetDebug).
* **Parameters:** None
* **Returns:** Widget instance or nil if no widget selected

### `d_halloween()`
* **Description:** Spawns all trinket and halloweencandy prefabs in a grid pattern around console world position.
* **Parameters:** None
* **Returns:** nil

### `d_potions()`
* **Description:** Spawns all Halloween potion prefabs and livingtree_root in a grid pattern around console world position.
* **Parameters:** None
* **Returns:** nil

### `d_weirdfloaters()`
* **Description:** Spawns a large list of weapon and tool prefabs in a grid pattern around console world position.
* **Parameters:** None
* **Returns:** nil

### `d_wintersfeast()`
* **Description:** Spawns all Winter's Feast ornament prefabs in a grid pattern using GetAllWinterOrnamentPrefabs().
* **Parameters:** None
* **Returns:** nil

### `d_wintersfood()`
* **Description:** Spawns all winter_food prefabs in a grid pattern around console world position.
* **Parameters:** None
* **Returns:** nil

### `d_madsciencemats()`
* **Description:** Gives all Halloween experiment materials via c_mat command.
* **Parameters:** None
* **Returns:** nil

### `d_showalleventservers()`
* **Description:** Toggles TheFrontEnd._showalleventservers boolean to show or hide all event servers.
* **Parameters:** None
* **Returns:** nil

### `d_lavaarena_skip()`
* **Description:** Pushes ms_lavaarena_endofstage event to TheWorld to skip to end of Lava Arena stage.
* **Parameters:** None
* **Returns:** nil

### `d_lavaarena_speech(dialog, banter_line)`
* **Description:** Makes the Boarlord speak dialog lines from STRINGS table, supporting banter line selection.
* **Parameters:**
  - `dialog` -- string, dialog key from STRINGS table, may contain BANTER keyword
  - `banter_line` -- number, optional index for banter dialog array selection
* **Returns:** nil
* **Error states:** None if dialog key not found in STRINGS or Boarlord not present

### `d_unlockallachievements()`
* **Description:** Reports event progress to unlock all active achievements via TheItems:ReportEventProgress.
* **Parameters:** None
* **Returns:** nil

### `d_unlockfoodachievements()`
* **Description:** Reports event progress to unlock all food-related achievements (food_001 through food_069 and food_syrup).
* **Parameters:** None
* **Returns:** nil

### `d_reportevent(other_ku)`
* **Description:** Reports event progress with test achievements scotttestdaily_d1 and wintime_30.
* **Parameters:**
  - `other_ku` -- string, optional other player KU ID for multi-team report
* **Returns:** nil

### `d_ground(ground, pt)`
* **Description:** Sets ground tile type at specified position using TheWorld.Map:SetTile.
* **Parameters:**
  - `ground` -- string or number, tile type name or WORLD_TILES constant, defaults to QUAGMIRE_SOIL
  - `pt` -- Vector3, position to set tile at, defaults to ConsoleWorldPosition()
* **Returns:** nil

### `d_portalfx()`
* **Description:** Pushes ms_newplayercharacterspawned event to TheWorld with ThePlayer to trigger portal spawn effects.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `d_walls(width, height)`
* **Description:** Spawns wood walls in a rectangular pattern around console world position.
* **Parameters:**
  - `width` -- number, wall rectangle width, defaults to 10
  - `height` -- number, wall rectangle height, defaults to width
* **Returns:** nil

### `d_hidekitcoon()`
* **Description:** Spawns a kitcoon_deciduous and makes it hide at the entity under mouse cursor using hideandseekhider:GoHide.
* **Parameters:** None
* **Returns:** nil

### `d_hidekitcoons()`
* **Description:** Calls specialeventsetup:_SetupYearOfTheCatcoon to initialize Year of the Catcoon event.
* **Parameters:** None
* **Returns:** nil

### `d_allkitcoons()`
* **Description:** Spawns all kitcoon biome variants using d_spawnlist helper.
* **Parameters:** None
* **Returns:** nil

### `d_allcustomhidingspots()`
* **Description:** Spawns hiding spots from TUNING.KITCOON_HIDING_OFFSET keys with kitcoons attempting to hide at each.
* **Parameters:** None
* **Returns:** nil

### `d_hunt()`
* **Description:** Calls hunter:DebugForceHunt on TheWorld.components.hunter to force hunting mechanics.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `d_islandstart()`
* **Description:** Gives starting island survival items and sets player sanity to random 20-60%.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `d_waxwellworker()`
* **Description:** Spawns shadowworker pet at player position using petleash:SpawnPetAt and records spawn location.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if ConsoleCommandPlayer() returns nil (nil dereference on player.Transform) or player lacks petleash component (nil dereference on player.components.petleash — no guard present in source)

### `d_waxwellprotector()`
* **Description:** Spawns shadowprotector pet at player position using petleash:SpawnPetAt and records spawn location.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if ConsoleCommandPlayer() returns nil (nil dereference on player.Transform — no guard present) or if player has no petleash component (nil dereference on player.components.petleash)

### `d_boatitems()`
* **Description:** Spawns boat crafting items including boat_item, mast_item, anchor_item, steeringwheel_item, and oar.
* **Parameters:** None
* **Returns:** nil

### `d_giveturfs()`
* **Description:** Gives all turf items by iterating through worldtiledefs.turf table.
* **Parameters:** None
* **Returns:** nil

### `d_turfs()`
* **Description:** Spawns all turf items in a list using d_spawnlist helper with quantity 10 each.
* **Parameters:** None
* **Returns:** nil

### `d_spawnlayout(name, data)`
* **Description:** Spawns a predefined layout at console position, optionally creating topology nodes and populating prefab densities.
* **Parameters:**
  - `name` -- string, layout definition name
  - `data` -- table, optional layout data with id, tags, populate_prefab_densities
* **Returns:** nil
* **Error states:** Errors if layout definition not found (nil dereference on layout.ground — no guard present in source)

### `d_allfish()`
* **Description:** Spawns all fish prefabs from oceanfishdef plus fish meat variants in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_fishing()`
* **Description:** Spawns all ocean fishing items including bobbers, lures, and oceanfishingrod in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_tables()`
* **Description:** Spawns 28 table_winters_feast prefabs in a grid pattern.
* **Parameters:** None
* **Returns:** nil

### `d_gofishing()`
* **Description:** Gives ocean fishing rod and various bobbers and lures via c_give.
* **Parameters:** None
* **Returns:** nil

### `d_radius(radius, num, lifetime)`
* **Description:** Spawns flint items in a circle pattern that auto-remove after lifetime seconds.
* **Parameters:**
  - `radius` -- number, circle radius, defaults to 4
  - `num` -- number, number of items in circle, defaults to max(5, radius*2)
  - `lifetime` -- number, seconds before items auto-remove, defaults to 10
* **Returns:** nil

### `d_ratracer(speed, stamina, direction, reaction)`
* **Description:** Spawns a carrat with custom YOTC race stats and gives it to player inventory.
* **Parameters:**
  - `speed` -- number, rat speed stat, defaults to random
  - `stamina` -- number, rat stamina stat, defaults to random
  - `direction` -- number, rat direction stat, defaults to random
  - `reaction` -- number, rat reaction stat, defaults to random
* **Returns:** nil
* **Error states:** Errors if DebugSpawn("carrat") returns nil (nil dereference on rat._spread_stats_task — no guard present in source); errors if ConsoleCommandPlayer() returns nil (nil dereference on .components.inventory — no guard present in source)

### `d_ratracers()`
* **Description:** Spawns 8 carrats with varying YOTC race stats (speed, stamina, direction, reaction) set to max or 0, each with different colors, and gives them to the player.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if ConsoleCommandPlayer() returns nil and components.inventory is accessed

### `d_setup_placeholders(reuse, out_file_name)`
* **Description:** Defines a local helper function use_table that recursively processes speech table structures, filling missing string values with 'TODO'. The helper is defined and immediately invoked to process STRINGS.CHARACTERS.GENERIC.
* **Parameters:**
  - `reuse` -- table, speech table to populate with placeholders
  - `out_file_name` -- string, output file path for the generated Lua file
* **Returns:** nil
* **Error states:** None

### `d_allshells()`
* **Description:** Spawns 12 large, medium, and small singing shells in rows at the console world position, setting each cyclable component to steps 1-12.
* **Parameters:** None
* **Returns:** nil

### `d_fish(swim, r, g, b)`
* **Description:** Spawns 4 ocean fish at console position, optionally removes their brain, removes NOCLICK tag, and applies color tint to the last fish.
* **Parameters:**
  - `swim` -- boolean, if false, removes brain from fish
  - `r` -- number, red color component (0-255), defaults to 0
  - `g` -- number, green color component (0-255), defaults to 5
  - `b` -- number, blue color component (0-255), defaults to 5
* **Returns:** nil

### `d_farmplants(grow_stage, oversized)`
* **Description:** Spawns all farm plants that have oversized products, optionally advancing growth stages and forcing oversized state.
* **Parameters:**
  - `grow_stage` -- number, number of growth stages to apply
  - `oversized` -- boolean, if true, forces oversized growth
* **Returns:** nil

### `d_plant(plant, num_wide, grow_stage, spacing)`
* **Description:** Spawns plants in a square grid centered at console world position, optionally advancing growth stages over time.
* **Parameters:**
  - `plant` -- string, prefab name of the plant to spawn
  - `num_wide` -- number, number of plants per row/column in the grid
  - `grow_stage` -- number, number of growth stages to apply
  - `spacing` -- number, distance between plants, defaults to 1.25
* **Returns:** nil

### `d_seeds()`
* **Description:** Spawns all seed prefabs from farm plant definitions that have oversized products.
* **Parameters:** None
* **Returns:** nil

### `d_fertilizers()`
* **Description:** Spawns all sorted fertilizer prefabs from fertilizer nutrient definitions.
* **Parameters:** None
* **Returns:** nil

### `d_oversized()`
* **Description:** Spawns all oversized product prefabs from farm plant definitions.
* **Parameters:** None
* **Returns:** nil

### `d_startmoonstorm()`
* **Description:** Starts a moonstorm at the console world position's map node.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if TheWorld.components.moonstormmanager is nil

### `d_stopmoonstorm()`
* **Description:** Stops the current moonstorm.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if TheWorld.components.moonstormmanager is nil

### `d_moonaltars()`
* **Description:** Spawns moon altar, moon altar idol, moon altar astral, and moon altar cosmic at positions offset from console world position.
* **Parameters:** None
* **Returns:** nil

### `d_cookbook()`
* **Description:** Disables cookbook saving, then learns all food stats and adds sample recipes for all cookbook recipes.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if TheCookbook is nil

### `d_statues(material)`
* **Description:** Spawns all chess piece and boss statues with the specified material.
* **Parameters:**
  - `material` -- string or number, material type (marble, stone, moonglass) or index, defaults to marble
* **Returns:** nil

### `d_craftingstations()`
* **Description:** Spawns all prototyper/crafting station prefabs from PROTOTYPER_DEFS.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if PROTOTYPER_DEFS is nil

### `d_removeentitywithnetworkid(networkid, x, y, z)`
* **Description:** Finds and removes the entity with the matching network ID within a radius of 1 from the given position.
* **Parameters:**
  - `networkid` -- number, network ID of entity to remove
  - `x` -- number, search center X position
  - `y` -- number, search center Y position
  - `z` -- number, search center Z position
* **Returns:** nil

### `d_recipecards()`
* **Description:** Spawns cooking recipe cards with names set from the cooking module's recipe_cards data.
* **Parameters:** None
* **Returns:** nil

### `d_spawnfilelist(filename, spacing)`
* **Description:** Reads a persistent string file asynchronously and spawns prefabs listed in the file (one prefab name per line) via d_spawnlist callback after file loads.
* **Parameters:**
  - `filename` -- string, name of file to read (located in client_save directory)
  - `spacing` -- number, passed to d_spawnlist but has no effect on file contents due to asynchronous loading
* **Returns:** nil

### `d_spawnallhats()`
* **Description:** Spawns all hat prefabs from ALL_HAT_PREFAB_NAMES.
* **Parameters:** None
* **Returns:** table -- array of created entity instances
* **Error states:** Errors if ALL_HAT_PREFAB_NAMES is nil

### `d_spawnallhats_onstands()`
* **Description:** Spawns all hats on sewing mannequins, including the slurper.
* **Parameters:** None
* **Returns:** table -- array of created entity instances
* **Error states:** Errors if ALL_HAT_PREFAB_NAMES is nil

### `d_spawnallarmor_onstands()`
* **Description:** Spawns all armor and vest prefabs on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_spawnallhandequipment_onstands()`
* **Description:** Spawns all hand equipment (weapons, tools, staffs, etc.) on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_allpillows()`
* **Description:** Spawns all hand and body pillow prefabs from pillow_defs.
* **Parameters:** None
* **Returns:** nil

### `d_allpillows_onstands()`
* **Description:** Spawns all pillows on sewing mannequins.
* **Parameters:** None
* **Returns:** nil

### `d_spawnequipment_onstand(...)`
* **Description:** Spawns a sewing mannequin at console position and equips all provided item prefabs on it. Returns early if no arguments provided.
* **Parameters:**
  - `...` -- vararg, prefab names of items to equip on the mannequin
* **Returns:** nil
* **Error states:** None

### `d_daywalker(chain)`
* **Description:** Spawns a daywalker boss with 3 daywalker pillars arranged in a circle around it, optionally chaining them.
* **Parameters:**
  - `chain` -- boolean, if true, chains pillars to the daywalker as prisoners
* **Returns:** nil
* **Error states:** Crashes if c_spawn("daywalker") returns nil (nil dereference on daywalker.Transform with no guard)

### `d_moonplant()`
* **Description:** Spawns a lunarthrall plant on the currently selected entity.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Does nothing if no entity is selected

### `d_punchingbags()`
* **Description:** Spawns all three punching bag variants (normal, lunar, shadow).
* **Parameters:** None
* **Returns:** nil

### `d_skilltreestats()`
* **Description:** Prints skill tree statistics (skill count and lock count) for all characters to the console, sorted by skill count.
* **Parameters:** None
* **Returns:** nil

### `d_dumpCreatureTXT()`
* **Description:** Iterates through all prefabs, spawns each one, and writes prefab name, entity name, max health, and default damage to creatures.txt.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab returns nil (t:Remove() nil dereference) or Prefabs table is nil

### `d_dumpItemsTXT()`
* **Description:** Iterates through all prefabs with inventoryitem component and writes their prefab names to items.txt.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `d_structuresTXT()`
* **Description:** Exports a list of valid structure prefabs to a text file named 'structures.txt', filtering out skins, inventory items, and locomotor entities.
* **Parameters:** None
* **Returns:** nil

### `d_printscrapbookrepairmaterialsdata()`
* **Description:** Scans all prefabs to categorize repair materials, forge repair materials, and upgrader types, printing the data for manual inclusion.
* **Parameters:** None
* **Returns:** nil

### `d_createscrapbookdata(print_missing_icons)`
* **Description:** Generates the complete scrapbook dataset by spawning prefabs, analyzing components, and writing data files. Forces season and weather state during execution.
* **Parameters:**
  - `print_missing_icons` -- boolean, Optional flag to list missing icon atlases
* **Returns:** nil
* **Error states:** Aborts if prefab is invalid or lacks AnimState

### `d_unlockscrapbook()`
* **Description:** Debug command to unlock all scrapbook partitions for testing.
* **Parameters:** None
* **Returns:** nil

### `d_erasescrapbookentrydata(entry)`
* **Description:** Removes storage data for a specific scrapbook entry.
* **Parameters:**
  - `entry` -- string, The scrapbook entry name to erase
* **Returns:** nil
* **Error states:** Prints error if entry is invalid

### `d_waxplant(plant)`
* **Description:** Applies wax to a plant entity using the waxed plant common module.
* **Parameters:**
  - `plant` -- Entity, The plant entity to wax. Defaults to entity under mouse
* **Returns:** nil

### `d_checkmissingscrapbookentries()`
* **Description:** Checks STRINGS.NAMES against scrapbook prefabs to find named entries missing from the scrapbook.
* **Parameters:** None
* **Returns:** nil

### `d_testhashes_random(bitswanted, tests)`
* **Description:** Tests hash collision rates using randomly generated strings.
* **Parameters:**
  - `bitswanted` -- number, Bits for mask (default 4)
  - `tests` -- number, Number of random tests (default 10000)
* **Returns:** nil

### `d_testhashes_prefabs(bitswanted)`
* **Description:** Tests hash collision rates using all registered prefab names.
* **Parameters:**
  - `bitswanted` -- number, Bits for mask (default 4)
* **Returns:** nil

### `d_testworldstatetags()`
* **Description:** Tests WORLDSTATETAGS encoding and decoding with various tag sets.
* **Parameters:** None
* **Returns:** nil

### `d_gotoworldtopologyindex(nodexindex)`
* **Description:** Teleports the player to the center of a specific world topology node.
* **Parameters:**
  - `nodexindex` -- number, Index of the topology node
* **Returns:** nil

### `d_drawworldtopology()`
* **Description:** Toggles visualization of world topology nodes and connections on the minimap.
* **Parameters:** None
* **Returns:** nil

### `d_drawworldroute(routename)`
* **Description:** Toggles visualization of a specific world route path on the minimap.
* **Parameters:**
  - `routename` -- string, Name of the route to visualize
* **Returns:** nil

### `d_drawworldbirdmigration()`
* **Description:** Toggles visualization of bird migration paths and populations on the minimap.
* **Parameters:** None
* **Returns:** nil

### `d_printworldroutetime(routename, speed, bonus)`
* **Description:** Calculates and prints the time required to traverse a world route.
* **Parameters:**
  - `routename` -- string, Name of the route
  - `speed` -- number, Movement speed
  - `bonus` -- number, Speed bonus multiplier
* **Returns:** nil

### `d_wagpunkarena_nexttask()`
* **Description:** Forces the Wagpunk arena manager to skip to the next state.
* **Parameters:** None
* **Returns:** nil

### `d_require(file)`
* **Description:** Clears the package cache and requires a file, effectively reloading the module.
* **Parameters:**
  - `file` -- string, Module path to reload
* **Returns:** nil

### `d_mapstatistics(count_cutoff, item_cutoff, density_cutoff)`
* **Description:** Analyzes and prints statistics about entity counts, item distribution, and tile density on the map.
* **Parameters:**
  - `count_cutoff` -- number, Minimum count to print prefab stats
  - `item_cutoff` -- number, Minimum count to print item stats
  - `density_cutoff` -- number, Minimum density to print high density spots
* **Returns:** nil

### `d_testdps(time, target)`
* **Description:** Measures and prints the damage per second dealt to a target over a specified time.
* **Parameters:**
  - `time` -- number, Duration of the test in seconds
  - `target` -- Entity, Target entity. Defaults to entity under mouse
* **Returns:** nil

### `d_timeddebugprefab(x, y, z, lifetime, prefab)`
* **Description:** Spawns a prefab at a location that automatically removes itself after a lifetime.
* **Parameters:**
  - `x` -- number, X position
  - `y` -- number, Y position
  - `z` -- number, Z position
  - `lifetime` -- number, Time before removal
  - `prefab` -- string, Prefab name
* **Returns:** Entity

### `d_prizepouch(prefab, nugget_count)`
* **Description:** Spawns a prize pouch and wraps specified gold nuggets inside it using the unwrappable component.
* **Parameters:**
  - `prefab` -- string, Pouch prefab name
  - `nugget_count` -- number, Number of gold nuggets to wrap
* **Returns:** nil

### `d_boatracepointers()`
* **Description:** Spawns a list of boat race checkpoint indicators with animated symbols.
* **Parameters:** None
* **Returns:** nil

### `d_testsound(soundpath, loopname, volume)`
* **Description:** Plays a sound on the selected entity or player.
* **Parameters:**
  - `soundpath` -- string, Path to the sound file
  - `loopname` -- string, Name for the sound loop
  - `volume` -- number, Volume level
* **Returns:** nil

### `d_stopsound(loopname)`
* **Description:** Stops a playing sound loop on the selected entity or player.
* **Parameters:**
  - `loopname` -- string, Name of the sound loop to kill
* **Returns:** nil

### `d_spell(spellnum, item)`
* **Description:** Executes a specific spell from a spellbook item.
* **Parameters:**
  - `spellnum` -- number, Spell index
  - `item` -- Entity, Spellbook item. Defaults to selected
* **Returns:** nil

### `d_itemwithshadowmimic(item_prefab)`
* **Description:** Spawns an item and adds the itemmimic component to it.
* **Parameters:**
  - `item_prefab` -- string, Prefab of the item to mimic
* **Returns:** nil

### `d_shadowparasite(host_prefab)`
* **Description:** Spawns a host and equips it with a shadow thrall parasite hat.
* **Parameters:**
  - `host_prefab` -- string, Prefab of the host entity
* **Returns:** nil

### `d_tweak_floater(size, offset, scale, swap_bank, float_index, swap_data)`
* **Description:** Modifies the floater component of the selected entity and prints the MakeInventoryFloatable call.
* **Parameters:**
  - `size` -- string, Float size
  - `offset` -- number, Vertical offset
  - `scale` -- number, Scale factor
  - `swap_bank` -- string, Bank to swap
  - `float_index` -- number, Float index
  - `swap_data` -- table, Swap data
* **Returns:** nil

### `d_startlunarhail()`
* **Description:** Triggers the lunar hail event on the world.
* **Parameters:** None
* **Returns:** nil

### `d_testbirdattack()`
* **Description:** Spawns a mutated bird and forces it to swoop attack the player.
* **Parameters:** None
* **Returns:** nil

### `d_testbirdclearhail()`
* **Description:** Spawns a mutated bird and commands it to remove lunar buildup from the selected entity.
* **Parameters:** None
* **Returns:** nil

### `d_spawncentipede(num)`
* **Description:** Spawns a shadow thrall centipede controller with a specified number of torso segments.
* **Parameters:**
  - `num` -- number, Number of torso segments
* **Returns:** nil

### `d_movementon()`
* **Description:** Forces the selected entity to walk forward using its locomotor component.
* **Parameters:** None
* **Returns:** nil

### `d_followplayer()`
* **Description:** Makes the selected entity periodically face the player's position.
* **Parameters:** None
* **Returns:** nil

### `d_stopcentipedemovement()`
* **Description:** Stops the locomotor component of all shadow thrall centipede entities.
* **Parameters:** None
* **Returns:** nil

### `d_lightworld()`
* **Description:** Toggles ambient lighting override on the world between dark and normal.
* **Parameters:** None
* **Returns:** nil

### `d_activatearchives()`
* **Description:** Finds an archive switch and gives it an opal gem to activate it.
* **Parameters:** None
* **Returns:** nil

### `d_vaultroom(id)`
* **Description:** Unloads the current vault room and loads a specified room ID.
* **Parameters:**
  - `id` -- string, Room ID to load
* **Returns:** nil

### `d_spawnvaultactors()`
* **Description:** Spawns Wilson actors equipped with ancient masks at the charlie stage.
* **Parameters:** None
* **Returns:** nil

### `d_debug_arc_attack_hitbox(arc_span, forward_offset, arc_radius, lifetime)`
* **Description:** Visualizes an arc attack hitbox for the selected entity.
* **Parameters:**
  - `arc_span` -- number, Arc span
  - `forward_offset` -- number, Forward offset
  - `arc_radius` -- number, Arc radius
  - `lifetime` -- number, Debug lifetime
* **Returns:** nil

### `d_lunarmutation(corpseprefab, buildid)`
* **Description:** Spawns a corpse and sets it to non-gestalt mode with optional build overrides.
* **Parameters:**
  - `corpseprefab` -- string, Corpse prefab name
  - `buildid` -- string, Alternate build ID
* **Returns:** nil

### `d_gestaltmutation(corpseprefab, buildid)`
* **Description:** Spawns a corpse and sets it to gestalt mode with optional build overrides.
* **Parameters:**
  - `corpseprefab` -- string, Corpse prefab name
  - `buildid` -- string, Alternate build ID
* **Returns:** nil

### `d_mutatedbuzzardcircler()`
* **Description:** Spawns a circling buzzard and sets it to circle the player.
* **Parameters:** None
* **Returns:** nil

### `d_placegridgroupoutline()`
* **Description:** Places a grid placer group outline at the input world position.
* **Parameters:** None
* **Returns:** nil

### `d_removegridgroupoutline()`
* **Description:** Removes a grid placer group outline at the input world position.
* **Parameters:** None
* **Returns:** nil

### `d_tiles()`
* **Description:** Fills a grid of tiles around the input position with impassable and turf tiles for testing.
* **Parameters:** None
* **Returns:** nil

### `d_getmigrationpopulation(migrator_type)`
* **Description:** Returns the population data for a specific migrator type from the migration manager.
* **Parameters:**
  - `migrator_type` -- string, Type of migrator
* **Returns:** table or nil

### `d_hidehovertext()`
* **Description:** Forces the player HUD hover text and action hints to hide.
* **Parameters:** None
* **Returns:** nil

### `d_notalking()`
* **Description:** Makes all players ignore talking events from the 'd_notalking' source.
* **Parameters:** None
* **Returns:** nil

## Events & listeners

**Listens to:**
- `onremove` — Listened on spawned creatures in d_combatsimulator to respawn them
- `droppedtarget` — Listened in d_combatsimulator to reassign combat target when dropped
- `attacked` — Listened to in d_testdps to accumulate damage count

**Pushes:**
- `shadowrift_opened` — Pushed on TheWorld in d_riftspawns when in cave
- `lunarrift_opened` — Pushed on TheWorld in d_riftspawns when not in cave
- `ms_setmoonphase` — Pushed on TheWorld in d_fullmoon and d_newmoon to set moon phase
- `startcollapse` — Pushed on antlion_sinkhole in d_sinkhole
- `resetruins` — Pushed to TheWorld by d_resetruins to reset ruins state
- `ms_lavaarena_endofstage` — Pushed to TheWorld by d_lavaarena_skip with reason=debug triggered
- `ms_newplayercharacterspawned` — Pushed to TheWorld by d_portalfx with player=ThePlayer
- `lavaarena_talk` — Pushed to Boarlord by d_lavaarena_speech with text lines
- `ms_setseason` — Pushed in d_createscrapbookdata to force autumn season
- `ms_forceprecipitation` — Pushed in d_createscrapbookdata to stop rain
- `overrideambientlighting` — Pushed in d_lightworld to toggle lighting
- `ms_startlunarhail` — Pushed in d_startlunarhail to trigger event
- `domesticated` — Pushed by domesticatable component when beefalo becomes domesticated
- `saddlechanged` — Pushed when saddle is equipped or removed from rideable entity
- `leaderchanged` — Pushed when follower's leader changes
- `stacksizechange` — Pushed when stackable item stack size changes
- `trade` — Pushed when trader accepts a gift
- `wrappeditem` — Pushed when item is wrapped in unwrappable bundle
- `on_landed` / `on_no_longer_landed` — Pushed by inventoryitem when landing state changes