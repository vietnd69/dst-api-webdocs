---
id: debugcommands
title: Debugcommands
description: A collection of debug console commands for spawning entities, modifying game state, testing components, generating scrapbook data, and manipulating world topology.
tags: [debug, console, spawning, world, testing]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: ed4ea1a2
system_scope: player
---

# Debugcommands

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The debugcommands.lua file defines a comprehensive set of debug console functions used primarily for testing, development, and automation within Don't Starve Together. These commands facilitate rapid entity spawning (including grids, lists, and specialized prefabs), state manipulation (e.g., moon phase, season, skill trees), component inspection and modification (via components like skinner, domesticatable, health, etc.), scrapbook data generation, world topology visualization, migration testing, and achievement/event simulation. The functions operate on the active player, console-selected entities, or global world state, leveraging core debug utilities such as `c_spawn`, `c_sel`, `c_give`, `ConsoleCommandPlayer()`, and `ConsoleWorldPosition()`.

## Usage example
```lua
-- Spawn 20 spiders and make them follow the player
d_spiders()

-- Fully domesticated aggressive beefalo with saddle
d_domesticatedbeefalo("aggressive", "saddle_basic")

-- Unlock all scrapbook entries
d_unlockscrapbook()

-- Visualize world topology and migration routes
d_drawworldtopology()
d_drawworldbirdmigration()

-- Force a full moon and generate scrapbook data
d_fullmoon()
d_createscrapbookdata(true)
```

## Dependencies & tags
**Components used:** activatable, armor, builder, burnable, centipedebody, childspawner, combat, cyclable, domesticatable, edible, equippable, erasablepaper, finiteuses, fishable, floater, follower, forgerepair, forgerepairable, fuel, fueled, growable, harvestable, health, hideandseekhider, hunter, inspectable, insulator, inventory, inventoryitem, knownlocations, lavaarenaevent, locomotor, lootdropper, lunarthrall_plantspawner, migrationmanager, moonstormmanager, mutatedbuzzardcircler, named, oar, oceanfishingtackle, periodicspawner, perishable, petleash, pickable, planardamage, planardefense, pointofinterest, prototyper, rabbitkingmanager, repairable, repairer, rideable, riftspawner, ropebridgemanager, saddler, sanity, sanityaura, scenariorunner, shadowthrall_mimics, sharkboimanager, skilltreeupdater, skinner, snowmandecor, spawner, specialeventsetup, spellbook, stackable, stewer, tool, trader, unwrappable, upgradeable, upgrademodule, upgrader, vaultroom, wagpunk_arena_manager, walkableplatform, waterproofer, waxable, weapon, weather, workable, worldroutes, yotc_racestats
**Tags:** boat, FX, NOCLICK, DECOR, INLIMBO, _inventoryitem, player, _combat, CLASSIFIED, smallcreature, monster, animal, fire, bird, pig, merm, hound, warg, chess, oceanfish, wagstafftool, pocketwatch, groundtile, backpack, chest, battlesong, ghostlyelixir, farm_plant, spidermutator, slingshotammo, hat, structure, tree, ancienttree, rock_tree, livingtree, marsh_tree, oceantree, driftwood_tall, driftwood_small1, mushtree_tall_webbed, atrium_*, epic, crabking, shadow_aligned, lunar_aligned, brightmare, shadow, book, winter_ornament, halloween_ornament, insect, NPCcanaggro, wall, wallbuilder, smallepic, haunted, singingshell, manrabbit, teenbird, smallbird, malbatross, moose, mossling, penguin, perd, shadowminion, shadowchesspiece, stalker, stalkerminion, shadowthrall, shadowhand, brightmare_gestalt, brightmareboss, heavy, lightbattery, boatbumper, fence

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| n/a | n/a | n/a | No properties are defined in this file; all logic resides in function bodies. |

## Main functions

### `d_spawnlist(list, spacing, fn)`
* **Description:** Spawns prefabs from `list` in a grid layout centered on the console command player's position. Supports per-entity overrides via tables `{prefab, count, item_fn}` and optional per-instance callback `fn`. Returns array of spawned instances.
* **Parameters:** `list` (array), `spacing` (number, optional, default 2), `fn` (function, optional)
* **Returns:** Array of spawned entity instances

### `d_playeritems()`
* **Description:** Spawns all builder tag items (excluding placeable or builder prefabs) in a grid, organized by builder tag and sorted alphabetically.
* **Parameters:** None
* **Returns:** None

### `d_allmutators()`
* **Description:** Gives all known mutators to the player.
* **Parameters:** None
* **Returns:** None

### `d_allcircuits()`
* **Description:** Spawns all `wx78module_*` prefabs in a grid based on `wx78_moduledefs.module_definitions`.
* **Parameters:** None
* **Returns:** None

### `d_allheavy()`
* **Description:** Spawns predefined heavy objects in a staggered grid layout (6 per row).
* **Parameters:** None
* **Returns:** None

### `d_spiders()`
* **Description:** Spawns predefined spider types, sets them as followers of the player, and gives `"spider_water"`.
* **Parameters:** None
* **Returns:** None

### `d_particles()`
* **Description:** Spawns emissive particle prefabs in circular motion with labels. Particles without `pERSISTS` are updated in-place via `DoPeriodicTask`.
* **Parameters:** None
* **Returns:** None

### `d_decodedata(path)`
* **Description:** Loads a persistent string from disk, decodes it, and re-saves with `_decoded` suffix.
* **Parameters:** `path` (string)
* **Returns:** None

### `d_riftspawns()`
* **Description:** Simulates rift opening (10s delay), spawns 200 rifts, and highlights them.
* **Parameters:** None
* **Returns:** None

### `d_lunarrift()`
* **Description:** Enables lunar rifts and spawns one at console position.
* **Parameters:** None
* **Returns:** None

### `d_shadowrift()`
* **Description:** Enables shadow rifts and spawns one at console position.
* **Parameters:** None
* **Returns:** None

### `d_oceanarena()`
* **Description:** Enables ocean arena spawning by setting `TEMP_DEBUG_RATE = true` and calling `FindAndPlaceOceanArenaOverTime`.
* **Parameters:** None
* **Returns:** None

### `d_exploreX(filterfn, precision)`
* **Description:** Loops over map tiles (step `precision`) and reveals matching tiles for the player.
* **Parameters:** `filterfn` (function), `precision` (number, default 5)
* **Returns:** None

### `d_exploreland()`
* **Description:** Calls `d_exploreX` with `TileGroupManager:IsLandTile` filter.
* **Parameters:** None
* **Returns:** None

### `d_exploreocean()`
* **Description:** Calls `d_exploreX` with `TileGroupManager:IsOceanTile` filter.
* **Parameters:** None
* **Returns:** None

### `d_explore_printunseentiles()`
* **Description:** Calls `d_exploreX` with filter to print tile positions that are land, valid, and not visible on minimap.
* **Parameters:** None
* **Returns:** None

### `d_teleportboat(x, y, z)`
* **Description:** Teleports the current boat (if player is on one) to target coordinates, checking collisions and teleporting attached items.
* **Parameters:** `x`, `y`, `z` (numbers, optional; default console position)
* **Returns:** None

### `d_breakropebridges(delaytime)`
* **Description:** Destroys all rope bridges on the map (instantly or with delay).
* **Parameters:** `delaytime` (number, optional; nil for immediate)
* **Returns:** None

### `d_rabbitking(kind)`
* **Description:** Creates a Rabbit King of specified type for the player.
* **Parameters:** `kind` (string, optional; e.g., `"warrior"`)
* **Returns:** None

### `d_fullmoon()`
* **Description:** Sets moon phase to full (non-waxing) on master sim.
* **Parameters:** None
* **Returns:** None

### `d_newmoon()`
* **Description:** Sets moon phase to new (waxing) on master sim.
* **Parameters:** None
* **Returns:** None

### `d_unlockaffinities()`
* **Description:** Sets GKV flags to unlock all moon weapon affinities.
* **Parameters:** None
* **Returns:** None

### `d_resetskilltree()`
* **Description:** Deactivates all skill tree skills (up to 50 attempts), then gives max XP.
* **Parameters:** None
* **Returns:** None

### `d_reloadskilltreedefs()`
* **Description:** Calls `DEBUG_REBUILD()` on `prefabs/skilltree_defs`.
* **Parameters:** None
* **Returns:** None

### `d_printskilltreestringsforcharacter(character)`
* **Description:** Prints Lua strings needed for missing skill tree keys for given character.
* **Parameters:** `character` (string, optional; defaults to current player)
* **Returns:** None

### `d_togglelunarhail()`
* **Description:** Enables lunar rifts, triggers rift timer (hail), and manually advances weather cooldown.
* **Parameters:** None
* **Returns:** None

### `d_allsongs()`
* **Description:** Gives all available battle songs.
* **Parameters:** None
* **Returns:** None

### `d_allstscostumes()`
* **Description:** Gives all Stitches the Tailor costumes (masks and bodies).
* **Parameters:** None
* **Returns:** None

### `d_domesticatedbeefalo(tendency, saddle)`
* **Description:** Spawns a beefalo, fully domesticates it, sets a tendency, and equips a saddle.
* **Parameters:** `tendency` (string, optional), `saddle` (string, optional)
* **Returns:** None

### `d_domestication(domestication, obedience)`
* **Description:** Adjusts domestication and obedience of selected entity.
* **Parameters:** `domestication` (number, optional), `obedience` (number, optional)
* **Returns:** None

### `d_testwalls()`
* **Description:** Spawns walls of each material at increments of health (0–100%).
* **Parameters:** None
* **Returns:** None

### `d_testruins()`
* **Description:** Unlocks mid-tier tech, gives resources and starter gear.
* **Parameters:** None
* **Returns:** None

### `d_combatgear()`
* **Description:** Gives basic combat gear (wood armor, helmet, spear).
* **Parameters:** None
* **Returns:** None

### `d_teststate(state)`
* **Description:** Forces selected entity's stategraph to jump to `state`.
* **Parameters:** `state` (string)
* **Returns:** None

### `d_anim(animname, loop)`
* **Description:** Plays animation on selected debug entity.
* **Parameters:** `animname` (string), `loop` (boolean, optional)
* **Returns:** None

### `d_light(c1, c2, c3)`
* **Description:** Sets global ambient color.
* **Parameters:** `c1`, `c2`, `c3` (numbers; `c1` defaults for all)
* **Returns:** None

### `d_combatsimulator(prefab, count, force)`
* **Description:** Spawns entities in a battle loop; if `force`, auto-targets nearest combat tag entity.
* **Parameters:** `prefab` (string), `count` (number, default 1), `force` (boolean)
* **Returns:** None

### `d_spawn_ds(prefab, scenario)`
* **Description:** Spawns entity, clears existing scenario, then loads and runs new scenario via `scenariorunner`.
* **Parameters:** `prefab` (string), `scenario` (string)
* **Returns:** None

### `d_test_thank_you(param)`
* **Description:** Spawns the ThankYouPopup screen with a specified item.
* **Parameters:** `param` (string, optional; defaults to `"birdcage_pirate"`)
* **Returns:** nil

### `d_test_skins_popup(param)`
* **Description:** Pushes the `SkinsItemPopUp` screen with specified item and test data.
* **Parameters:** `param` (string, optional)
* **Returns:** nil

### `d_test_skins_announce(param)`
* **Description:** Triggers a networked skin announcement for "Peter" with fixed RGBA color.
* **Parameters:** `param` (string, optional)
* **Returns:** nil

### `d_test_skins_gift(param)`
* **Description:** Opens the `GiftItemPopUp` screen for the local player.
* **Parameters:** `param` (string, optional)
* **Returns:** nil

### `d_test_mystery_box(params)`
* **Description:** Opens the `ItemBoxOpenerPopup` for opening a mystery box.
* **Parameters:** `params` (table, optional)
* **Returns:** nil

### `d_print_skin_info()`
* **Description:** Prints formatted debug output of skin name and usable-on strings for hardcoded prefabs.
* **Parameters:** None
* **Returns:** nil

### `d_skin_mode(mode)`
* **Description:** Calls `SetSkinMode(mode)` on player's `skinner` component.
* **Parameters:** `mode` (string)
* **Returns:** nil

### `d_skin_name(name)`
* **Description:** Calls `SetSkinName(name)` on player's `skinner` component.
* **Parameters:** `name` (string)
* **Returns:** nil

### `d_clothing(name)`
* **Description:** Calls `SetClothing(name)` on player's `skinner` component.
* **Parameters:** `name` (string)
* **Returns:** nil

### `d_clothing_clear(type)`
* **Description:** Calls `ClearClothing(type)` on player's `skinner` component.
* **Parameters:** `type` (string)
* **Returns:** nil

### `d_cycle_clothing()`
* **Description:** Starts periodic task (every 10s) cycling inventory items as clothing (non-base, non-item types) using `c_clothing`.
* **Parameters:** None
* **Returns:** nil

### `d_sinkhole()`
* **Description:** Spawns antlion sinkhole and pushes `"startcollapse"` event.
* **Parameters:** None
* **Returns:** nil

### `d_stalkersetup()`
* **Description:** Spawns `fossil_stalker`, completes workable progress, and gives `"shadowheart"` and `"atrium_key"`.
* **Parameters:** None
* **Returns:** nil

### `d_resetruins()`
* **Description:** Pushes `"resetruins"` event to the world.
* **Parameters:** None
* **Returns:** nil

### `d_getwidget()`
* **Description:** Returns widget currently targeted by debug widget editor.
* **Parameters:** None
* **Returns:** widget (table)

### `d_halloween()`
* **Description:** Spawns trinkets and candies in grids centered on console position.
* **Parameters:** None
* **Returns:** nil

### `d_potions()`
* **Description:** Spawns all `halloweenpotion_*` and `livingtree_root` prefabs in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_weirdfloaters()`
* **Description:** Spawns floating items (e.g., `"umbrella"`, `"fishingrod"`) in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_wintersfeast()`
* **Description:** Spawns all ornament prefabs from `GetAllWinterOrnamentPrefabs()` in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_wintersfood()`
* **Description:** Spawns `winter_food1` through `winter_foodNUM_WINTERFOOD` in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_madsciencemats()`
* **Description:** Calls `c_mat` for five Halloween experiment material prefabs.
* **Parameters:** None
* **Returns:** nil

### `d_showalleventservers()`
* **Description:** Toggles `_showalleventservers` boolean flag on `TheFrontEnd`.
* **Parameters:** None
* **Returns:** nil

### `d_lavaarena_skip()`
* **Description:** Forces Lava Arena to skip current stage.
* **Parameters:** None
* **Returns:** nil

### `d_lavaarena_speech(dialog, banter_line)`
* **Description:** Plays speech or banter line on Boarlord using `lavaarena_talk` event.
* **Parameters:** `dialog` (string), `banter_line` (number, optional)
* **Returns:** nil

### `d_unlockallachievements()`
* **Description:** Sends synthetic achievement unlock report for all active achievements.
* **Parameters:** None
* **Returns:** nil

### `d_unlockfoodachievements()`
* **Description:** Sends synthetic report unlocking all food-related achievements.
* **Parameters:** None
* **Returns:** nil

### `d_reportevent(other_ku)`
* **Description:** Sends synthetic event report for two players with achievement unlocks.
* **Parameters:** `other_ku` (string, optional)
* **Returns:** nil

### `d_ground(ground, pt)`
* **Description:** Sets tile at console position (or `pt`) to specified ground.
* **Parameters:** `ground` (string or WORLD_TILES constant), `pt` (Vector3, optional)
* **Returns:** nil

### `d_portalfx()`
* **Description:** Pushes `"ms_newplayercharacterspawned"` event with local player.
* **Parameters:** None
* **Returns:** nil

### `d_walls(width, height)`
* **Description:** Spawns rectangular wood wall around console position.
* **Parameters:** `width` (number, default 10), `height` (number, default `width`)
* **Returns:** nil

### `d_hidekitcoon()`
* **Description:** Spawns `kitcoon_deciduous`, hides it at mouse entity; removes if hiding fails.
* **Parameters:** None
* **Returns:** nil

### `d_hidekitcoons()`
* **Description:** Triggers `_SetupYearOfTheCatcoon()` on `specialeventsetup`.
* **Parameters:** None
* **Returns:** nil

### `d_allkitcoons()`
* **Description:** Spawns all kitcoon variants and sets `_first_nuzzle = false`.
* **Parameters:** None
* **Returns:** nil

### `d_allcustomhidingspots()`
* **Description:** Spawns hiding spot prefabs and tries to hide `kitcoon_rocky`; marks failed spots red.
* **Parameters:** None
* **Returns:** nil

### `d_hunt()`
* **Description:** Calls `DebugForceHunt()` on `hunter` component if present.
* **Parameters:** None
* **Returns:** nil

### `d_islandstart()`
* **Description:** Gives starting inventory items and sets sanity randomly low.
* **Parameters:** None
* **Returns:** nil

### `d_waxwellworker()`
* **Description:** Spawns `shadowworker` pet at player location and records spawn in `knownlocations`.
* **Parameters:** None
* **Returns:** nil

### `d_waxwellprotector()`
* **Description:** Spawns `shadowprotector` pet at player location and records spawn in `knownlocations`.
* **Parameters:** None
* **Returns:** nil

### `d_boatitems()`
* **Description:** Spawns boat-related prefabs (e.g., `"boat_item"`, `"oar"`).
* **Parameters:** None
* **Returns:** nil

### `d_giveturfs()`
* **Description:** Gives all turf prefabs from `worldtiledefs.lua`.
* **Parameters:** None
* **Returns:** nil

### `d_turfs()`
* **Description:** Spawns 10 of each turf prefab in a grid.
* **Parameters:** None
* **Returns:** nil

### `d_spawnlayout(name, data)`
* **Description:** Loads and spawns a layout definition at console position.
* **Parameters:** `name` (string), `data` (table, optional)
* **Returns:** nil

### `d_allfish()`
* **Description:** Spawns all ocean fish prefabs in a grid; uses `"_inv"` suffix if position invalid.
* **Parameters:** None
* **Returns:** nil

### `d_fishing()`
* **Description:** Spawns fishing-related items in a grid.
* **Parameters:** None
* **Returns:** None

### `d_tables()`
* **Description:** Spawns `table_winters_feast` in a compact grid (spacing = 1).
* **Parameters:** None
* **Returns:** None

### `d_gofishing()`
* **Description:** Gives starter ocean fishing gear (rod, bobbers, lures).
* **Parameters:** None
* **Returns:** None

### `d_radius(radius, num, lifetime)`
* **Description:** Spawns `num` flint items in a circle of radius `radius`; scheduled for removal after `lifetime`.
* **Parameters:** `radius` (number, default 4), `num` (number, default max(5, radius*2)), `lifetime` (number, default 10)
* **Returns:** None

### `d_ratracer(speed, stamina, direction, reaction)`
* **Description:** Spawns Carrat, sets YOTC stats to provided or random values, cancels auto-spread task, gives to player.
* **Parameters:** `speed`, `stamina`, `direction`, `reaction` (numbers, optional)
* **Returns:** None

### `d_ratracers()`
* **Description:** Spawns 8 Carrats with distinct stats (max or zero) and colors.
* **Parameters:** None
* **Returns:** None

### `d_setup_placeholders(reuse, out_file_name)`
* **Description:** Recursively copies missing `STRINGS.CHARACTERS.GENERIC` entries, writes to file replacing with "TODO".
* **Parameters:** `reuse` (table, optional), `out_file_name` (string)
* **Returns:** None

### `d_allshells()`
* **Description:** Spawns 12 singing shells; sets cyclable step to index (1–12).
* **Parameters:** None
* **Returns:** None

### `d_fish(swim, r, g, b)`
* **Description:** Spawns four oceanfishes, optionally disables brain, removes `NOCLICK` tag, applies custom color.
* **Parameters:** `swim` (boolean, default true), `r`, `g`, `b` (numbers, optional)
* **Returns:** None

### `d_farmplants(grow_stage, oversized)`
* **Description:** Spawns oversized plant prefabs; applies growth steps and forces oversized mode.
* **Parameters:** `grow_stage` (number, optional), `oversized` (boolean, optional)
* **Returns:** None

### `d_plant(plant, num_wide, grow_stage, spacing)`
* **Description:** Spawns single `plant` in `num_wide × num_wide` grid; optional growth scheduling and spacing.
* **Parameters:** `plant` (string), `num_wide` (number), `grow_stage` (number, optional), `spacing` (number, default 1.25)
* **Returns:** None

### `d_seeds()`
* **Description:** Collects and spawns seeds from oversized plant definitions.
* **Parameters:** None
* **Returns:** None

### `d_fertilizers()`
* **Description:** Spawns all fertilizer prefabs from `SORTED_FERTILIZERS`.
* **Parameters:** None
* **Returns:** None

### `d_oversized()`
* **Description:** Spawns all oversized products defined in plant definitions.
* **Parameters:** None
* **Returns:** None

### `d_startmoonstorm()`
* **Description:** Starts moonstorm at world node ID under input position.
* **Parameters:** None
* **Returns:** None

### `d_stopmoonstorm()`
* **Description:** Stops currently active moonstorm.
* **Parameters:** None
* **Returns:** None

### `d_moonaltars()`
* **Description:** Spawns moon altars and additional altars with offset positioning and stage setup.
* **Parameters:** None
* **Returns:** None

### `d_cookbook()`
* **Description:** Learns all food stats and adds fixed recipes per recipe in `cooking.cookbook_recipes`.
* **Parameters:** None
* **Returns:** None

### `d_statues(material)`
* **Description:** Generates chesspiece prefabs for 37 statue types and spawns them.
* **Parameters:** `material` (string or number, optional; default `"marble"`)
* **Returns:** None

### `d_craftingstations()`
* **Description:** Spawns all prototyper station prefabs from `PROTOTYPER_DEFS`.
* **Parameters:** None
* **Returns:** None

### `d_removeentitywithnetworkid(networkid, x, y, z)`
* **Description:** Finds and removes entity within 1 unit of (`x,y,z`) matching `networkid`.
* **Parameters:** `networkid` (number), `x`, `y`, `z` (numbers)
* **Returns:** None

### `d_recipecards()`
* **Description:** Spawns cooking recipe cards with name override set to recipe name.
* **Parameters:** None
* **Returns:** None

### `d_spawnfilelist(filename, spacing)`
* **Description:** Reads persistent text file (one prefab per line) and spawns in a grid.
* **Parameters:** `filename` (string), `spacing` (number)
* **Returns:** None

### `d_spawnallhats()`
* **Description:** Spawns all hats from `ALL_HAT_PREFAB_NAMES`.
* **Parameters:** None
* **Returns:** None

### `spawn_mannequin_and_equip_item(item)`
* **Description:** Spawns sewing mannequin at `item`'s position and equips `item` on it.
* **Parameters:** `item` (entity)
* **Returns:** None

### `d_spawnallhats_onstands()`
* **Description:** Spawns slurper hat then all hats on individual mannequins.
* **Parameters:** None
* **Returns:** None

### `d_spawnallarmor_onstands()`
* **Description:** Spawns 43 armor prefabs, each on its own mannequin.
* **Parameters:** None
* **Returns:** None

### `d_spawnallhandequipment_onstands()`
* **Description:** Spawns 89 hand-held equipment prefabs, each on its own mannequin.
* **Parameters:** None
* **Returns:** None

### `d_allpillows()`
* **Description:** Spawns all pillow types from `prefabs/pillow_defs`.
* **Parameters:** None
* **Returns:** None

### `d_allpillows_onstands()`
* **Description:** Same as `d_allpillows`, but each pillow spawns on a mannequin.
* **Parameters:** None
* **Returns:** None

### `d_spawnequipment_onstand(...)`
* **Description:** Spawns mannequin at console position and equips given items.
* **Parameters:** `...` (variable list of prefab names)
* **Returns:** None

### `d_daywalker(chain)`
* **Description:** Spawns Daywalker and three pillars; optionally chains pillars.
* **Parameters:** `chain` (boolean)
* **Returns:** None

### `d_moonplant()`
* **Description:** Instructs `lunarthrall_plantspawner` to spawn moon plant at selected target.
* **Parameters:** None
* **Returns:** None

### `d_punchingbags()`
* **Description:** Spawns three punching bag prefabs.
* **Parameters:** None
* **Returns:** None

### `d_skilltreestats()`
* **Description:** Prints sorted list of skill trees with prefab name, total skill count, and lock count.
* **Parameters:** None
* **Returns:** None

### `d_dumpCreatureTXT()`
* **Description:** Writes `creatures.txt` with prefab, name, health, and damage for all creatures.
* **Parameters:** None
* **Returns:** None

### `d_dumpItemsTXT()`
* **Description:** Writes `items.txt` with prefabs of all items that are not skins.
* **Parameters:** None
* **Returns:** None

### `d_structuresTXT()`
* **Description:** Writes `structures.txt` with prefabs and names for structures.
* **Parameters:** None
* **Returns:** None

### `Scrapbook_AddInfo(tbl, key, value)`
* **Description:** Helper to add key-value pairs to scrapbook entry tables with automatic quoting.
* **Parameters:** `tbl` (table), `key` (string), `value` (any)
* **Returns:** None

### `Scrapbook_WriteToFile(buffer)`
* **Description:** Writes scrapbook data buffer to `"scripts/screens/redux/scrapbookdata.lua"`.
* **Parameters:** `buffer` (table)
* **Returns:** None

### `Scrapbook_IsOnCraftingFilter(filter, entry)`
* **Description:** Checks if entry is in crafting filter for given filter name.
* **Parameters:** `filter` (string), `entry` (string)
* **Returns:** Boolean

### `Scrapbook_DefineSubCategory(t)`
* **Description:** Determines scrapbook subcategory for entity based on tags and components.
* **Parameters:** `t` (entity instance)
* **Returns:** String subcategory or nil

### `Scrapbook_DefineName(t)`
* **Description:** Determines scrapbook name for entity.
* **Parameters:** `t` (entity instance)
* **Returns:** String name

### `Scrapbook_DefineType(t, entry)`
* **Description:** Determines scrapbook type (thing, creature, item, food, giant, POI).
* **Parameters:** `t` (entity instance), `entry` (string)
* **Returns:** String type

### `Scrapbook_DefineAnimation(t)`
* **Description:** Determines scrapbook animation for entity.
* **Parameters:** `t` (entity instance)
* **Returns:** String animation name or nil

### `Scrapbook_GetSanityAura(inst)`
* **Description:** Gets sanity aura value from `components.sanityaura`.
* **Parameters:** `inst` (entity instance)
* **Returns:** Number or nil

### `Scrapbook_GetSkillOwner(skill)`
* **Description:** Finds character prefab that owns a given skill.
* **Parameters:** `skill` (string)
* **Returns:** Character prefab string or nil

### `d_printscrapbookrepairmaterialsdata()`
* **Description:** Prints repair material data for prefabs in scrapbookprefabs.
* **Parameters:** None
* **Returns:** None

### `d_createscrapbookdata(print_missing_icons)`
* **Description:** Generates scrapbook data for all prefabs in scrapbookprefabs, writing to `scrapbookdata.lua`.
* **Parameters:** `print_missing_icons` (boolean, optional)
* **Returns:** None

### `d_unlockscrapbook()`
* **Description:** Unlocks all scrapbook entries.
* **Parameters:** None
* **Returns:** None

### `d_erasescrapbookentrydata(entry)`
* **Description:** Erases scrapbook entry data for given entry.
* **Parameters:** `entry` (string)
* **Returns:** None

### `d_waxplant(plant)`
* **Description:** Waxes a plant using beeswax_spray.
* **Parameters:** `plant` (entity, optional; defaults to console entity under mouse)
* **Returns:** None

### `d_checkmissingscrapbookentries()`
* **Description:** Prints NAME strings not in scrapbookprefabs.
* **Parameters:** None
* **Returns:** None

### `d_testhashes_random(bitswanted, tests)`
* **Description:** Tests hash distribution for random strings using bitmask bins.
* **Parameters:** `bitswanted` (number, max 8), `tests` (number, default 10000)
* **Returns:** None

### `d_testhashes_prefabs(bitswanted)`
* **Description:** Tests hash distribution for all Prefabs.
* **Parameters:** `bitswanted` (number, max 8)
* **Returns:** None

### `d_testworldstatetags()`
* **Description:** Tests WORLDSTATETAGS decode and debug print functionality.
* **Parameters:** None
* **Returns:** None

### `worldtopology_createent(...)`
* **Description:** Creates a debug entity for visualizing world topology.
* **Parameters:** `worldtopologyvisuals` (table), `x`, `z` (numbers), `icon` (string), `labelstr` (string, optional)
* **Returns:** Created entity instance

### `d_gotoworldtopologyindex(nodexindex)`
* **Description:** Teleports player to centroid of topology node by index.
* **Parameters:** `nodexindex` (number)
* **Returns:** None

### `d_drawworldtopology()`
* **Description:** Draws world topology visualization (nodes, edges).
* **Parameters:** None
* **Returns:** None

### `d_drawworldroute(routename)`
* **Description:** Draws a world route as debug entities.
* **Parameters:** `routename` (string)
* **Returns:** None

### `GetAvgCenterOfTask(task_name, manager)`
* **Description:** Calculates average centroid of nodes matching task_name.
* **Parameters:** `task_name` (string), `manager` (MigrationManager, optional)
* **Returns:** Vector3 average position

### `d_drawworldbirdmigration()`
* **Description:** Draws bird migration topology visualization.
* **Parameters:** None
* **Returns:** None

### `d_printworldroutetime(routename, speed, bonus)`
* **Description:** Prints route length and travel times (base and bonus speed).
* **Parameters:** `routename` (string), `speed` (number), `bonus` (number)
* **Returns:** None

### `d_wagpunkarena_nexttask()`
* **Description:** Skips current wagpunk arena manager state.
* **Parameters:** None
* **Returns:** None

### `d_require(file)`
* **Description:** Forces re-require of a file by clearing `package.loaded`.
* **Parameters:** `file` (string)
* **Returns:** None

### `d_mapstatistics(count_cutoff, item_cutoff, density_cutoff)`
* **Description:** Prints statistics about entities and items in the world.
* **Parameters:** `count_cutoff` (number, default 200), `item_cutoff` (number, default 200), `density_cutoff` (number, default 100)
* **Returns:** None

### `d_testdps(time, target)`
* **Description:** Tests damage per second on target over specified time.
* **Parameters:** `time` (number, default 5), `target` (entity, optional)
* **Returns:** None

### `d_timeddebugprefab(x, y, z, lifetime, prefab)`
* **Description:** Spawns debug prefab and removes it after `lifetime` seconds.
* **Parameters:** `x`, `y`, `z` (numbers), `lifetime` (number, default 7), `prefab` (string, default "log")
* **Returns:** Spawned entity instance

### `d_prizepouch(prefab, nugget_count)`
* **Description:** Spawns a pouch and optionally wraps gold nuggets in it.
* **Parameters:** `prefab` (string, default "redpouch"), `nugget_count` (number, default 0)
* **Returns:** None

### `d_boatracepointers()`
* **Description:** Spawns 8 boat race checkpoint indicators.
* **Parameters:** None
* **Returns:** None

### `d_testsound(soundpath, loopname, volume)`
* **Description:** Plays sound from selected entity, player, or first player.
* **Parameters:** `soundpath` (string), `loopname` (string, optional), `volume` (number, optional)
* **Returns:** None

### `d_stopsound(loopname)`
* **Description:** Stops a looping sound.
* **Parameters:** `loopname` (string)
* **Returns:** None

### `d_spell(spellnum, item)`
* **Description:** Selects and executes a spell from spellbook.
* **Parameters:** `spellnum` (number), `item` (entity, optional)
* **Returns:** None

### `d_itemwithshadowmimic(item_prefab)`
* **Description:** Spawns item and adds `itemmimic` component.
* **Parameters:** `item_prefab` (string)
* **Returns:** None

### `d_shadowparasite(host_prefab)`
* **Description:** Spawns host and equips `shadow_thrall_parasitehat`.
* **Parameters:** `host_prefab` (string, default "bunnyman")
* **Returns:** None

### `d_tweak_floater(size, offset, scale, swap_bank, float_index, swap_data)`
* **Description:** Tweaks floater component properties on selected entity.
* **Parameters:** `size`, `offset`, `scale`, `swap_bank`, `float_index`, `swap_data` (all optional)
* **Returns:** None

### `d_startlunarhail()`
* **Description:** Starts lunar hail event.
* **Parameters:** None
* **Returns:** None

### `d_testbirdattack()`
* **Description:** Spawns mutatedbird and makes it swoop attack at random position.
* **Parameters:** None
* **Returns:** None

### `d_testbirdclearhail()`
* **Description:** Spawns mutatedbird and gives buffered action to remove lunar buildup.
* **Parameters:** None
* **Returns:** None

### `d_spawncentipede(num)`
* **Description:** Spawns centipede controller and sets `num_torso`.
* **Parameters:** `num` (number, default 5)
* **Returns:** None

### `d_movementon()`
* **Description:** Starts walking forward for selected entity's locomotor.
* **Parameters:** None
* **Returns:** None

### `d_followplayer()`
* **Description:** Adds periodic task to selected entity to always face player.
* **Parameters:** None
* **Returns:** None

### `d_stopcentipedemovement()`
* **Description:** Stops all centipede entities' movement.
* **Parameters:** None
* **Returns:** None

### `d_lightworld()`
* **Description:** Toggles ambient lighting override.
* **Parameters:** None
* **Returns:** None

### `d_activatearchives()`
* **Description:** Finds and activates first enabled archive_switch with opal gift.
* **Parameters:** None
* **Returns:** None

### `d_vaultroom(id)`
* **Description:** Loads vault room at first classified entity with `vaultroom` component.
* **Parameters:** `id` (string)
* **Returns:** None

### `d_spawnvaultactors()`
* **Description:** Spawns two wilson instances at charlie_stage and equips ancient masks.
* **Parameters:** None
* **Returns:** None

### `d_debug_arc_attack_hitbox(arc_span, forward_offset, arc_radius, lifetime)`
* **Description:** Calls `DebugArcAttackHitBox` with selected entity and parameters.
* **Parameters:** `arc_span`, `forward_offset`, `arc_radius`, `lifetime` (numbers)
* **Returns:** None

### `d_lunarmutation(corpseprefab, buildid)`
* **Description:** Spawns corpse and sets it as non-gestalt; optionally sets alt build/bank.
* **Parameters:** `corpseprefab` (string), `buildid` (number, optional)
* **Returns:** None

### `d_gestaltmutation(corpseprefab, buildid)`
* **Description:** Spawns corpse and sets it as gestalt; optionally sets alt build/bank.
* **Parameters:** `corpseprefab` (string), `buildid` (number, optional)
* **Returns:** None

### `d_mutatedbuzzardcircler()`
* **Description:** Spawns circlingbuzzard_lunar and sets it to circle the player.
* **Parameters:** None
* **Returns:** Spawned buzzard entity

### `d_placegridgroupoutline()`
* **Description:** Places gridplacer group outline at mouse world position.
* **Parameters:** None
* **Returns:** None

### `d_removegridgroupoutline()`
* **Description:** Removes gridplacer group outline at mouse world position.
* **Parameters:** None
* **Returns:** None

### `d_tiles()`
* **Description:** Fills tile area with world tiles for testing.
* **Parameters:** None
* **Returns:** None

### `d_getmigrationpopulation(migrator_type)`
* **Description:** Gets migration populations for given migrator type.
* **Parameters:** `migrator_type` (string)
* **Returns:** Population table or nil

## Events & listeners
* **Listens to:** `onremove`, `droppedtarget`, `on_landed`, `on_no_longer_landed`, `wrappeditem`, `stacksizechange`, `trade`, `equipped`, `unequipped`, `locomote`, `domesticated`, `saddlechanged`, `leaderchanged`, `ms_setmoonphase`, `shadowrift_opened`, `lunarrift_opened`, `attacked`, `startcollapse`, `lavaarena_talk`, `overrideambientlighting`, `ms_setseason`, `ms_forceprecipitation`, `ms_lavaarena_endofstage`, `ms_newplayercharacterspawned`
* **Pushes:** `domesticated`, `saddlechanged`, `leaderchanged`, `ms_setmoonphase`, `shadowrift_opened`, `lunarrift_opened`, `wrappeditem`, `stacksizechange`, `trade`, `equipped`, `unequipped`, `locomote`, `on_landed`, `on_no_longer_landed`, `startcollapse`, `lavaarena_talk`, `overrideambientlighting`, `ms_setseason`, `ms_forceprecipitation`, `ms_lavaarena_endofstage`, `ms_newplayercharacterspawned`, `attacked`