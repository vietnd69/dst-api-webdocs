---
id: actions
title: Actions
description: This component defines the complete action system for Don't Starve Together, including action type registration, range validation helpers, distance adjustments for terrain and physics, and comprehensive player interaction handlers covering combat, crafting, exploration, boat mechanics, and special gameplay mechanics.
tags: [actions, player, interactions, combat, crafting]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 82eee1ae
system_scope: gameplay
---

# Actions

> Based on game build **714014** | Last updated: 2026-03-21

## Overview

The Actions component is the central system for defining and executing player interactions in Don't Starve Together. It registers all available actions (such as ATTACK, PICKUP, EAT, DEPLOY, COOK, and hundreds more) into ordered lookup tables, implements specific action handlers that interface with entity components, and provides range validation helpers with distance adjustments for terrain and physics considerations. Each action is defined with properties like priority, distance requirements, ghost validity, and custom range check functions. The component handles player verb interactions through the BufferedAction system, supporting both standard gameplay actions and special-purpose mechanics including boat operations, Quagmire event mechanics, Year of the Beast content, and magical tool usage. Actions are triggered via player input, context menus, or programmatic calls, and each action handler validates conditions before executing component methods on target entities.

## Usage example

```lua
-- Check if an action is valid for a target
local act = {
    doer = GetPlayer(),
    target = some_entity,
    invobject = GetPlayer().components.inventory:GetActiveItem(),
    action = ACTIONS.CHOP
}

if ACTIONS.CHOP.validfn(act) then
    -- Execute the chop action
    local success = ACTIONS.CHOP.fn(act)
    if success then
        print("Chop succeeded!")
    end
end

-- Create a custom action with range validation
local my_action = Action({
    priority = 5,
    distance = 3,
    rangecheckfn = MakeRangeCheckFn(3),
    fn = function(act)
        act.target.components.workable:WorkedBy(act.doer, 1)
        return true
    end
})
```

## Dependencies & tags

**External dependencies:**
- `class` -- requires Class constructor
- `util` -- requires module
- `vecutil` -- requires module for Vector3, distsq
- `TheWorld` -- used in multiple range/check functions via TheWorld.Map
- `FindVirtualOceanEntity` -- global function used in ocean fishing range checks
- `TILE_SCALE` -- global constant used in CheckTileWithinRange
- `ACTIONS` -- global table storing action definitions
- `STRINGS` -- Used to fetch localization strings for action names
- `TUNING` -- Used for balance constants like SANITY_TINY
- `Action` -- Function used to construct action objects
- `SpawnPrefab` -- used to spawn loot and entities
- `BufferedAction` -- used to create buffered actions
- `GetMapExplorer` -- used by maprecorder:TeachMap
- `weighted_random_choice` -- Used in PLANTWEED to select random weed
- `FunctionOrValue` -- Used in various string override functions
- `CanEntitySeeTarget` -- Used to check visibility before actions
- `AllRecipes` -- used for recipe lookup
- `GetDescription` -- Used to get descriptions for actions
- `TheSim` -- Used to find entities around a position
- `TheNet` -- Used to check PVP status
- `EQUIPSLOTS` -- Used to identify equipped item slots

**Components used:**
- `appraisable` -- Called via CanAppraise and Appraise in APPRAISE action handler
- `balloonmaker` -- Used in MAKEBALLOON action to spawn balloon at position
- `burnable` -- Checked in PICKUP action to prevent picking up burning items
- `container` -- Used in RUMMAGE, EMPTY_CONTAINER, and PICKUP actions
- `container_proxy` -- Handled in RUMMAGE to manage proxy container opening
- `curseditem` -- Used in PICKUP action to verify player has space for cursed items
- `dryer` -- Drops item from dryer in STEAL action fallback path
- `eater` -- Used in EAT action to handle eating edible items
- `edible` -- Required in EAT action; may be on target or invobject
- `entitytracker` -- Used in PICKUP action to check YOTC trainer ownership
- `equippable` -- Used in EQUIP, UNEQUIP, and PICKUP to manage equipment slots
- `follower` -- Used in PICKUP action to verify spider owner/leader relationship
- `forgerepairable` -- Used in REPAIR action to repair with specific materials
- `finiteuses` -- Referenced in SEW and repair handlers to consume uses
- `fueled` -- Required for SEW target and ForgeRepair repairs
- `health` -- Used in Eater:Eat to apply health changes
- `inventory` -- Core dependency for Equip, Unequip, GiveItem, DropItem
- `inventoryitem` -- Checks owner, canbepickedup, cangoincontainer
- `itemtyperestrictions` -- Used in PICKUP to restrict item pickup per character
- `oceanfishable` -- Used in EAT action for rod-target interaction
- `projectile` -- Checked in PICKUP to prevent picking up thrown items
- `repairable` -- Used in REPAIR action with repairer material
- `repairer` -- Required in REPAIR to provide repair material
- `rideable` -- Referenced in RUMMAGE and DROP handlers
- `rider` -- Used in RUMMAGE to get mount when doer is riding
- `sanity` -- Consumed in MAKEBALLOON action
- `sewing` -- Required for SEW action to perform repair
- `skilltreeupdater` -- Used in RUMMAGE to verify skill activation
- `soul` -- Required in EAT action as target for SoulEater
- `souleater` -- Used in EAT action to consume souls
- `stackable` -- Referenced in SEW and repair handlers
- `thief` -- Used in STEAL action to steal items
- `workable` -- Used in EMPTY_CONTAINER to call onwork callback
- `closeinspector` -- Used for inspecting targets with equipped items
- `locomotor` -- Stopped before close inspection and talk actions
- `inspectable` -- Provides descriptions for LOOKAT action
- `talker` -- Used for speech output from various actions
- `playercontroller` -- Controls directwalking flag and locomotor override
- `book` -- Reads books via reader component
- `simplebook` -- Reads simple books directly
- `reader` -- Reads books via OnRead or OnPeruse methods
- `crewmember` -- Used for rowing actions without oar
- `oar` -- Executes rowing and row failure logic
- `oceanfishingrod` -- Handles casting, reeling, catching ocean fishing
- `complexprojectile` -- Launches projectiles during deploy
- `deployable` -- Deploys items with placement logic
- `trap` -- Checks and harvests traps, sets bait
- `worker` -- Provides effectiveness multipliers for tool work
- `tool` -- Provides effectiveness multipliers for tool work
- `workmultiplier` -- Provides global and special work multipliers
- `spooked` -- Triggers spooking on successful chop actions
- `talkable` -- Handles talk interaction
- `maxwelltalker` -- Handles Maxwell-specific speech behavior
- `storyteller` -- Triggers story telling behavior
- `stageactor` -- Performs stage acting with props
- `stageactingprop` -- Provides performance capability
- `farmplantstress` -- Applies stress during ATTACKPLANT action
- `farmplanttendable` -- Tends to farm plants
- `guardian` -- Called for guardian summoning
- `itemmimic` -- Prevents tool work if item is mimic
- `perishable` -- Used for handling stack swaps and spoilage
- `crop` -- Called in FERTILIZE action to fertilize crops
- `grower` -- Called in FERTILIZE action to fertilize empty growers
- `pickable` -- Called in FERTILIZE and PICK actions
- `fertilizer` -- Used to apply fertilizer from invobject
- `grabbable` -- Checked in NET action to verify grabbability
- `nabbag` -- Called in NET action to replicate netting
- `fishingrod` -- Used in FISH and REEL actions
- `searchable` -- Called in PICK action to search containers
- `combat` -- Used in ATTACK action to get weapon and perform attack
- `cooker` -- Used in COOK action for container cooking
- `stewer` -- Used in COOK action for stewing logic
- `cookable` -- Used in COOK action for direct-item cooking
- `fillable` -- Used in FILL action to fill items with water
- `fueler` -- Used in ADDFUEL for direct fuel interaction
- `trader` -- Used in GIVE, GIVETOPLAYER, GIVEALLTOPLAYER actions
- `moontrader` -- Used in GIVE action for celestial traders
- `furnituredecortaker` -- Used in GIVE action to place decor
- `inventoryitemholder` -- Used in GIVE action for item holders
- `vase` -- Used in DECORATEVASE action
- `carnivalgamefeedable` -- Used in CARNIVALGAME_FEED action
- `constructionsite` -- Links builder and constructioninst
- `harvestable` -- Handles harvesting via Harvest method
- `occupiable` -- Manages occupation and harvesting
- `lighter` -- Lights targets in LIGHT action
- `sleepingbag` -- Handles sleeping in SLEEPIN action
- `hitcher` -- Handles hitching/unhitching
- `beard` -- Handles shaving in SHAVE action
- `shaveable` -- Handles shaving when beard missing
- `instrument` -- Handles playing instruments
- `pollinator` -- Handles pollination and flower creation
- `terraformer` -- Handles terraforming
- `knownlocations` -- Stores and retrieves investigation locations
- `npc_talker` -- Plays queued NPC speech
- `spawner` -- Handles entity returning home
- `childspawner` -- Handles child spawner GOHOME
- `hideout` -- Handles hideout GOHOME
- `teleporter` -- Checks teleporter validity
- `activatable` -- Checks and performs activation
- `markable` -- Handles marking/unmarking
- `markable_proxy` -- Handles marking via proxy
- `wardrobe` -- Handles wardrobe dressing
- `groomer` -- Handles grooming/dressing
- `builder` -- Handles building in BUILD and OPEN_CRAFTING
- `murderable` -- accessed for murdersound
- `lootdropper` -- accessed for GenerateLoot
- `lock` -- accessed for IsLocked, Lock, Unlock
- `klaussacklock` -- accessed for UseKey
- `scrapbookable` -- accessed for Teach
- `teacher` -- accessed for Teach
- `maprecorder` -- accessed for TeachMap
- `mapspotrevealer` -- accessed for RevealMap
- `recipescanner` -- accessed for Scan
- `machine` -- accessed for IsOn, TurnOn, TurnOff
- `toggleableitem` -- accessed for CanInteract, ToggleItem
- `useableitem` -- accessed for CanInteract, StartUsingItem
- `useabletargeteditem` -- accessed for CanInteract, StartUsingItem
- `shelf` -- accessed for TakeItem
- `spellcaster` -- accessed for CanCast, CastSpell
- `summoningitem` -- accessed for inst
- `ghostlybond` -- accessed for Summon, Recall, ChangeBehaviour
- `pinnable` -- accessed for IsStuck
- `pethealthbar` -- used via ghostlybond for SetPetSkin
- `freezable` -- IsFrozen in MOUNT
- `hitchable` -- GetHitch in MOUNT
- `attunable` -- LinkToPlayer in ATTUNE
- `worldmigrator` -- Activate in MIGRATE
- `attuner` -- GetAttunedTarget in REMOTERESURRECT
- `revivablecorpse` -- CanBeRevivedBy, Revive in REVIVE_CORPSE
- `petleash` -- DespawnPet in ABANDON
- `crittertraits` -- OnPet in PET
- `kitcoonden` -- AddKitcoon in RETURN_FOLLOWER
- `hideandseekhidingspot` -- SearchHidingSpot in HIDEANSEEK_FIND
- `papereraser` -- DoErase in ERASE_PAPER
- `erasablepaper` -- Used in ERASE_PAPER condition
- `fan` -- Fan in FAN
- `poppable` -- Pop in CATPLAYGROUND, CATPLAYAIR
- `brushable` -- Brush in BRUSH
- `upgrader` -- CanUpgrade in UPGRADE
- `upgradeable` -- CanUpgrade, Upgrade in UPGRADE
- `writeable` -- IsWritten, IsBeingWritten, BeginWriting in WRITE
- `bundler` -- CanStartBundling, IsBundling, StartBundling, FinishBundling
- `unwrappable` -- canbeunwrapped, Unwrap, PeekInContainer
- `channelcaster` -- StartChanneling in START_CHANNELCAST
- `channelcastable` -- IsAnyUserChanneling, IsUserChanneling, StopChanneling
- `channelable` -- StartChanneling, StopChanneling
- `drawingtool` -- GetImageToDraw, Draw in DRAW
- `drawable` -- CanDraw in DRAW
- `anchor` -- Used by RAISE_ANCHOR and LOWER_ANCHOR actions
- `aoespell` -- Used by CASTAOE action to validate and cast AoE spells
- `boatcannon` -- Used by BOAT_CANNON_LOAD_AMMO, BOAT_CANNON_SHOOT actions
- `boatcannonuser` -- Used by BOAT_CANNON_START_AIMING, BOAT_CANNON_STOP_AIMING
- `boatleak` -- Used by REPAIR_LEAK action to repair leaks
- `boatmagnet` -- Used by BOAT_MAGNET_ACTIVATE and BOAT_MAGNET_DEACTIVATE
- `boatmagnetbeacon` -- Used by BOAT_MAGNET_BEACON_TURN_ON and TURN_OFF
- `boatrotator` -- Used by ROTATE_BOAT actions to control rotation
- `constructionbuilder` -- Used by CONSTRUCT, STOPCONSTRUCTION, APPLYCONSTRUCTION
- `constructionplans` -- Used by CONSTRUCT action to start construction
- `expertsailor` -- Used by LOWER_SAIL_BOOST to determine sailor strength
- `farmplantable` -- Used by PLANTSOIL action to plant seeds
- `farmtiller` -- Used by TILL action to till soil
- `fishingnet` -- Used by CAST_NET action to cast nets
- `halloweenpotionmoon` -- Used by HALLOWEENMOONMUTATE to mutate targets
- `itemweigher` -- Used by WEIGH_ITEM action to weigh items
- `mast` -- Used by RAISE_SAIL, LOWER_SAIL_BOOST actions
- `oceantrawler` -- Used by OCEAN_TRAWLER_LOWER action
- `portablestructure` -- Used by DISMANTLE action
- `preservative` -- Used by APPLYPRESERVATIVE to apply preservation
- `quagmire_installable` -- Used by INSTALL action
- `quagmire_installations` -- Used by INSTALL action
- `quagmire_plantable` -- Used by PLANTSOIL action
- `quagmire_saltextractor` -- Used by INSTALL action
- `quagmire_slaughtertool` -- Used by SLAUGHTER action
- `quagmire_tiller` -- Used by TILL action
- `quagmire_tapper` -- Used by TAPTREE action
- `spellbook` -- Used by CASTAOE to get spell name
- `steeringwheel` -- Used by STEER_BOAT to check sailor availability
- `steeringwheeluser` -- Used by STEER_BOAT, SET_HEADING, STOP_STEERING_BOAT
- `tackler` -- Used by TACKLE action
- `trophyscale` -- Used by COMPARE_WEIGHABLE action
- `walkingplank` -- Used by MOUNT_PLANK, DISMOUNT_PLANK, ABANDON_SHIP
- `yotc_racestart` -- Used by START_CARRAT_RACE
- `yotc_raceprizemanager` -- Used by START_CARRAT_RACE to fetch race data
- `weighable` -- Used by COMPARE_WEIGHABLE action
- `craftingstation` -- Used in GIVE_TACKLESKETCH and REPLATE
- `cyclable` -- Used in CYCLE action to cycle states
- `oceanthrowable` -- Used in OCEAN_TOSS to add projectile behavior
- `questowner` -- Used in BEGIN_QUEST and ABANDON_QUEST actions
- `plantresearchable` -- Used in PLANTREGISTRY_RESEARCH to research plants
- `fertilizerresearchable` -- Used in PLANTREGISTRY_RESEARCH to research fertilizers
- `quagmire_replatable` -- Used in REPLATE to replate dishes
- `quagmire_saltable` -- Used in SALT to salt dishes
- `quagmire_replater` -- Used in REPLATE as the replacement item
- `wateryprotection` -- Used in POUR_WATER to spread protection
- `compostingbin` -- Used in ADDCOMPOSTABLE to add items
- `waxable` -- Used in WAX to apply wax
- `winch` -- Used in UNLOAD_WINCH with custom unloadfn
- `heavyobstacleusetarget` -- Used in USE_HEAVY_OBSTACLE
- `yotb_sewer` -- Used in YOTB_SEW to manage sewing
- `yotb_stagemanager` -- Used in YOTB_STARTCONTEST to manage contests
- `yotb_stager` -- Used in YOTB_STARTCONTEST to start contest
- `yotb_skinunlocker` -- Used in YOTB_UNLOCKSKIN to unlock skins
- `spidermutator` -- Used in MUTATE_SPIDER to mutate spiders
- `followerherder` -- Used in HERD_FOLLOWERS to herd followers
- `bedazzler` -- Used in BEDAZZLE to bedazzle entities
- `repellent` -- Used in REPEL to repel entities
- `treegrowthsolution` -- Used in ADVANCE_TREE_GROWTH to grow trees
- `pocketwatch_dismantler` -- Used in DISMANTLE_POCKETWATCH
- `dumbbelllifter` -- Used in LIFT_DUMBBELL to manage lifting
- `mightygym` -- Used in ENTER_GYM, LEAVE_GYM, and UNLOAD_GYM
- `strongman` -- Used in LEAVE_GYM to access current gym
- `upgrademoduleowner` -- Used in APPLYMODULE and REMOVEMODULES
- `upgrademodule` -- Used in APPLYMODULE to apply modules
- `upgrademoduleremover` -- Used in REMOVEMODULES to remove modules
- `batteryuser` -- Used in CHARGE_FROM to charge items
- `battery` -- Used in CHARGE_FROM as charge source
- `fencerotator` -- Used in ROTATE_FENCE to rotate fences
- `magician` -- Used in USEMAGICTOOL and STOPUSINGMAGICTOOL
- `sittable` -- Checked for occupancy and setting occupier in SITON
- `remoteteleporter` -- Used in remote teleport action
- `incinerator` -- Used in incinerate action to destroy contents
- `bottler` -- Used in bottle action to bottle target entity
- `pumpkincarvable` -- Used in carvepumpkin action
- `pumpkinhatcarvable` -- Alternative carver for pumpkins
- `snowmandecoratable` -- Used in decoratesnowman action
- `pushable` -- Used in startpushing action
- `gravediggable` -- Used in gravedig action
- `gravedigger` -- Used in gravedig action
- `ghostgestalter` -- Used in mutate action
- `deckcontainer` -- Used in drawfromdeck, flipdeck, addcardtodeck
- `playingcard` -- Used in drawfromdeck and addcardtodeck
- `playingcardsmanager` -- Used in drawfromdeck to spawn cards
- `gestaltcage` -- Used in pouncecapture action
- `moonstormstaticcatcher` -- Used in divegrab action
- `clientpickupsoundsuppressor` -- Used in container install
- `containerinstallableitem` -- Used in container install
- `slingshotmodder` -- Used in modslingshot and stopmodslingshot
- `slingshotmods` -- Used in modslingshot to check if slingshot can be opened
- `electricconnector` -- Used to start/end/disable electric fence linking
- `lunarhailbuildup` -- Used to remove lunar hail buildup
- `bathingpool` -- Used to make the doer enter the pool
- `joustuser` -- Used to check and trigger joust conditions
- `joustsource` -- Used to validate that the equipped item supports jousting

**Tags:**
- `balloonomancer` -- check
- `heavy` -- check
- `player` -- check
- `fooddrink` -- check
- `edible_<type>` -- check
- `badfood` -- check
- `spider` -- check
- `spiderwhisperer` -- check
- `merm` -- check
- `masterchef` -- check
- `portablestorage` -- check
- `mastercookware` -- check
- `mermonly` -- check
- `souljar` -- check
- `decoratable` -- check
- `unwrappable` -- check
- `needssewing` -- check
- `nosteal` -- check
- `pocketdimension_container` -- check
- `drop_inventory_onpickup` -- check
- `repairable_moon_altar` -- check
- `repairable_vitae` -- check
- `tape` -- check
- `forgerepair_<type>` -- check
- `trap` -- check
- `mine` -- check
- `soul` -- check
- `playerfloater` -- check
- `ancient_text` -- check
- `ancient_reader` -- check
- `virtualocean` -- check
- `partiallyhooked` -- check
- `usedeploystring` -- check
- `projectile` -- check
- `groundtile` -- check
- `wallbuilder` -- check
- `fencebuilder` -- check
- `gatebuilder` -- check
- `portableitem` -- check
- `boatbuilder` -- check
- `deploykititem` -- check
- `eyeturret` -- check
- `fertilizer` -- check
- `graveplanter` -- check
- `deployedfarmplant` -- check
- `farm_plant` -- check
- `reloaditem_ammo` -- check
- `farm_debris` -- check
- `CLASSIFIED` -- check
- `globalmapicon` -- check
- `wormholetrackericon` -- check
- `frozen` -- check
- `pickable_harvest_str` -- check
- `pickable_rummage_str` -- check
- `pickable_search_str` -- check
- `propweapon` -- check
- `whackable` -- check
- `hammer` -- check
- `smashable` -- check
- `spicer` -- check
- `watersource` -- check
- `quickeat` -- check
- `sloweat` -- check
- `strongstomach` -- check
- `monstermeat` -- check
- `ignoresspoilage` -- check
- `unsafefood` -- check
- `spoiled` -- check
- `ghostlyelixirable` -- check
- `ghostlyelixir` -- check
- `playbill_lecturn` -- check
- `gemsocket` -- check
- `trader_just_show` -- check
- `trader_repair` -- check
- `moontrader` -- check
- `wintersfeasttable` -- check
- `inventoryitemholder_give` -- check
- `furnituredecortaker` -- check
- `quagmire_stewer` -- check
- `quagmire_altar` -- check
- `playerghost` -- check
- `wereplayer` -- check
- `nibble` -- check
- `MEAT` -- check
- `foodtype` -- check
- `quagmire_portal_key` -- check
- `quagmire_food_` -- check
- `bundle` -- check
- `winter_treestand` -- check
- `stewer` -- check
- `birdcage` -- check
- `withered` -- check
- `hitcher` -- check
- `controlled_burner` -- check
- `stokeablefire` -- check
- `wolfgang_coach` -- check
- `mightiness_normal` -- check
- `coaching` -- check
- `coach_whistle` -- check
- `dressable` -- check
- `haunted` -- check
- `catchable` -- check
- `teleporter` -- check
- `pocketwatchcaster` -- check
- `wormhole` -- check
- `tentacle_pillar` -- check
- `cannotheal` -- check
- `drop_inventory_onmurder` -- check
- `burnt` -- check
- `scrapbook_note` -- check
- `scrapbook_data` -- check
- `mapspotrevealer` -- check
- `recipescanner` -- check
- `pet_treat` -- check
- `NOCLICK` -- check
- `hasemergencymode` -- check
- `soulstealer` -- check
- `has_aggressive_follower` -- check
- `crushitemcast` -- check
- `notarget` -- check
- `fire` -- check
- `canpeek` -- check
- `smolder` -- check
- `combatmount` -- check
- `dogrider_only` -- check
- `dogrider` -- check
- `pump` -- check
- `lighter` -- check
- `critterlab` -- check
- `pickapart` -- check
- `offerconstructionsite` -- check
- `constructionsite` -- check
- `repairconstructionsite` -- check
- `rebuildconstructionsite` -- check
- `KITCOON_NEAR_DEN_DIST` -- check
- `kitcoonden` -- check
- `OFFER` -- check
- `STORE` -- check
- `OFFER_TO` -- check
- `REPAIR` -- check
- `REBUILD` -- check
- `trophyscale_` -- check
- `weighable_` -- check
- `bathbomb` -- add
- `bathbombable` -- add
- `fresh` -- check
- `stale` -- check
- `cookable` -- check
- `deployable` -- check
- `canbeslaughtered` -- check
- `tappable` -- check
- `race_on` -- add
- `boat_leak` -- check
- `trophycanbetaken` -- check
- `singingshell` -- check
- `can_use_heavy` -- check
- `sewingmachine` -- check
- `soil` -- check
- `fertilizerresearchable` -- check
- `pyromaniac` -- check
- `handyperson` -- check
- `abigail_flower` -- check
- `fueldepleted` -- check
- `canbebottled` -- check
- `pushing_roll` -- check
- `elixir_drinker` -- check
- `super_elixir` -- check
- `slingshot` -- check
- `invisible` -- check
- `hermitcrab` -- check
- `character` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `priority` | number | `0` | Priority level for action selection; higher values take precedence. |
| `fn` | function | `function() return false end` | Callback function executed when the action is performed. |
| `strfn` | function | `nil` | Optional function returning localized string label for the action. |
| `instant` | boolean | `false` | If true, action completes instantly without movement or delay. |
| `rmb` | boolean | `nil` | If true, action is triggered by right mouse button (used mainly for tools). |
| `distance` | number | `nil` | Max distance the doer can be from the target to perform the action. |
| `mindistance` | number | `nil` | Minimum distance required between doer and target to perform the action. |
| `arrivedist` | number | `nil` | Distance threshold considered 'arrived' for target. |
| `ghost_exclusive` | boolean | `false` | If true, action is only available while ghost state and excludes other actions. |
| `ghost_valid` | boolean | `false` | If true, action can be performed while in ghost state. |
| `mount_valid` | boolean | `false` | If true, action can be performed while mounted on another entity. |
| `encumbered_valid` | boolean | `false` | If true, action can be performed while encumbered. |
| `floating_valid` | boolean | `false` | If true, action can be performed while floating (e.g., on water without boat). |
| `canforce` | boolean | `nil` | If true, action can be forced by UI even if contextually unsuitable. |
| `rangecheckfn` | function | `nil` | Custom function to validate range between doer and target. |
| `mod_name` | string | `nil` | Name of the mod defining the action (if any). |
| `silent_fail` | boolean | `nil` | If true, suppresses failure messages for this action. |
| `silent_generic_fail` | boolean | `nil` | If true, suppresses generic failure messages for this action. |
| `paused_valid` | boolean | `false` | If true, action is valid even while game is paused. |
| `actionmeter` | boolean | `nil` | If true, action uses the action meter progress bar. |
| `customarrivecheck` | function | `nil` | Function to determine if the doer has arrived at the destination. |
| `is_relative_to_platform` | boolean | `false` | If true, positions are interpreted relative to the current platform. |
| `disable_platform_hopping` | boolean | `false` | If true, prevents jumping between platforms during action. |
| `skip_locomotor_facing` | boolean | `false` | If true, skips facing adjustment before performing action. |
| `do_not_locomote` | boolean | `false` | If true, skips locomotion (movement) before action. |
| `extra_arrive_dist` | function | `nil` | Function returning additional distance needed to reach target. |
| `tile_placer` | string | `nil` | Name of the tile placer system used by this action. |
| `show_tile_placer_fn` | function | `nil` | Function used to determine if tile placer should be shown. |
| `theme_music` | string | `nil` | Name of the theme music to play when action is performed. |
| `theme_music_fn` | function | `nil` | Function returning theme music name (client-side). |
| `pre_action_cb` | function | `nil` | Callback function executed before action begins (client and server). |
| `invalid_hold_action` | boolean | `false` | If true, action is invalid while holding an item. |
| `show_primary_input_left` | boolean | `nil` | If true, shows primary input (left click) in UI. |
| `show_secondary_input_right` | boolean | `nil` | If true, shows secondary input (right click) in UI. |
| `map_action` | boolean | `false` | If true, action is intended for use on the minimap. |
| `closes_map` | boolean | `false` | If true, minimap closes immediately upon action start. |
| `map_only` | boolean | `false` | If true, action only exists while the minimap is open. |
| `map_works_on_unexplored` | boolean | `false` | If true, action bypasses unexplored area visibility restrictions. |
| `directwalking` | boolean | `false` | Property in PlayerController component; controls whether walking overrides locomotor behavior. |

## Main functions

### `MakeRangeCheckFn(range)`
* **Description:** Returns a range-check function that tests if doer is within given range of target using IsNear.
* **Parameters:**
  - `range` -- number, max distance threshold for near-check
* **Returns:** function(doer, target): boolean
* **Error states:** None

### `PickRangeCheck(doer, target)`
* **Description:** Computes distance between doer and target with weapon attack range and physics radius padding. Returns true if within range.
* **Parameters:**
  - `doer` -- Entity, the one performing the action
  - `target` -- Entity, the target of the action
* **Returns:** boolean or nil
* **Error states:** nil return if target is nil

### `ExtraPickRange(doer, dest, bufferedaction)`
* **Description:** Returns extra distance needed when target is on water (0.75) or modified by weapon range.
* **Parameters:**
  - `doer` -- Entity, the one performing the action
  - `dest` -- Entity or Vector3, destination point or target
  - `bufferedaction` -- Table, optional buffered action data
* **Returns:** number
* **Error states:** None

### `PhysicsPaddedRangeCheck(doer, target)`
* **Description:** Currently unused; computes range using target physics radius plus 4 units padding.
* **Parameters:**
  - `doer` -- Entity, the one performing the action
  - `target` -- Entity, the target of the action
* **Returns:** boolean or nil
* **Error states:** nil return if target is nil

### `CheckFishingOceanRange(doer, dest)`
* **Description:** Checks if a fishing cast point lies over valid ocean tiles or virtual ocean entities; returns true if valid.
* **Parameters:**
  - `doer` -- Entity, the fishing doer
  - `dest` -- Vector3, target destination point
* **Returns:** boolean
* **Error states:** None

### `CheckRowRange(doer, dest)`
* **Description:** Returns true if the destination point is NOT on a platform (i.e., on water).
* **Parameters:**
  - `doer` -- Entity, the rower
  - `dest` -- Vector3, destination point
* **Returns:** boolean
* **Error states:** None

### `CheckIsOnPlatform(doer, dest)`
* **Description:** Returns true if doer is currently on a platform (e.g., boat).
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination (unused in this function)
* **Returns:** boolean
* **Error states:** None

### `CheckOceanFishingCastRange(doer, dest)`
* **Description:** Similar to CheckFishingOceanRange but with cast radius (1.5 units); used for ocean fishing cast actions.
* **Parameters:**
  - `doer` -- Entity, the fishing doer
  - `dest` -- Vector3, target destination point
* **Returns:** boolean
* **Error states:** None

### `CheckTileWithinRange(doer, dest)`
* **Description:** Returns true if the tile center of dest is within a half-tile (TILE_SCALE*0.5) of the doer.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
* **Returns:** boolean
* **Error states:** None

### `ShowPourWaterTilePlacer(right_mouse_action)`
* **Description:** Returns true if pour water tile placer should be shown: i.e., hovering a farm_plant and its tile is farmable soil.
* **Parameters:**
  - `right_mouse_action` -- Table, optional buffered action from right mouse click
* **Returns:** boolean
* **Error states:** None

### `ExtraPickupRange(doer, dest)`
* **Description:** Returns 0.75 extra distance if target point is on water (not passable ocean tile), otherwise 0.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
* **Returns:** number
* **Error states:** None

### `ExtraDeployDist(doer, dest, bufferedaction)`
* **Description:** Returns extra distance for deploying items based on terrain (land/boat to ocean/void) and item flags like usedeployspacingasoffset.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
  - `bufferedaction` -- Table, optional buffered action data
* **Returns:** number
* **Error states:** None

### `ExtraDropDist(doer, dest, bufferedaction)`
* **Description:** Returns extra drop distance if destination is on water (1.75) or if item has positive physics radius and collides with doer.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
  - `bufferedaction` -- Table, optional buffered action data
* **Returns:** number
* **Error states:** None

### `ExtraPourWaterDist(doer, dest, bufferedaction)`
* **Description:** Returns fixed extra distance (1.5) for pouring water actions.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
  - `bufferedaction` -- Table, optional buffered action data
* **Returns:** number
* **Error states:** None

### `ExtraHealRange(doer, dest, bufferedaction)`
* **Description:** Returns extra range adjustment for healing when target has a lower physics radius override than actual radius.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
  - `bufferedaction` -- Table, optional buffered action data
* **Returns:** number
* **Error states:** None

### `ArriveAnywhere()`
* **Description:** Returns true unconditionally; used for actions that consider arrival valid regardless of location.
* **Parameters:** None
* **Returns:** true
* **Error states:** None

### `ExtraWobyForagingDist(doer, dest, bufferedaction)`
* **Description:** Returns 0.5 or 1.5 depending on whether doer has 'largecreature' tag.
* **Parameters:**
  - `doer` -- Entity, the actor
  - `dest` -- Vector3, destination point
  - `bufferedaction` -- Table, optional buffered action data
* **Returns:** number
* **Error states:** None

### `SetClientRequestedAction(actioncode, mod_name)`
* **Description:** Sets CLIENT_REQUESTED_ACTION global based on action code and optional mod name.
* **Parameters:**
  - `actioncode` -- string, action code identifier
  - `mod_name` -- string or nil, mod providing action; if nil, uses default ACTIONS_BY_ACTION_CODE
* **Returns:** nil
* **Error states:** None

### `ClearClientRequestedAction()`
* **Description:** Resets CLIENT_REQUESTED_ACTION global to nil.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `Action(data, instant, rmb, distance, ghost_valid, ghost_exclusive, canforce, rangecheckfn)`
* **Description:** Constructor for action objects; supports table-only or deprecated positional arguments.
* **Parameters:**
  - `data` -- Table or legacy positional params (deprecated), action configuration
  - `instant` -- boolean, deprecated positional param
  - `rmb` -- boolean, deprecated positional param
  - `distance` -- number, deprecated positional param
  - `ghost_valid` -- boolean, deprecated positional param
  - `ghost_exclusive` -- boolean, deprecated positional param
  - `canforce` -- boolean, deprecated positional param
  - `rangecheckfn` -- function, deprecated positional param
* **Returns:** table (Action instance)
* **Error states:** Prints warning if positional args used; sets defaults for missing fields

### `IsItemInReadOnlyContainer(item)`
* **Description:** Checks whether the given item is in a container marked as readonly by inspecting its ownership chain.
* **Parameters:**
  - `item` -- Entity: the item to check; used to verify if it is inside a readonly container via its inventoryitem.owner.container.readonlycontainer path.
* **Returns:** boolean: true if item is in a readonly container, false otherwise.
* **Error states:** None

### `ACTIONS.APPRAISE.fn(act)`
* **Description:** Handles the APPRAISE action by checking if the invobject can appraise the target and calling Appraise or returning early with reason.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, and invobject.
* **Returns:** boolean or false: returns true on success, false or 'NOTNOW' on failure.
* **Error states:** Returns false with 'NOTNOW' when CanAppraise returns failure reason 'NOTNOW'.

### `ACTIONS.EAT.strfn(act)`
* **Description:** Computes the display string for the EAT action, returning 'DRINK' if the item has tag 'fooddrink'.
* **Parameters:**
  - `act` -- Table: the action object containing invobject.
* **Returns:** string or nil: 'DRINK' or nil.
* **Error states:** None

### `ACTIONS.EAT.fn(act)`
* **Description:** Handles the EAT action by attempting to eat edible items, consume souls, or set rod from fishing rod to target.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, and invobject.
* **Returns:** boolean or nil: true on successful eat/soul eat/setRod, nil otherwise.
* **Error states:** Returns nil if required components or targets are missing.

### `ACTIONS.STEAL.fn(act)`
* **Description:** Handles the STEAL action by attempting to steal an item from a target's inventory, drop from a dryer, or fail silently if out of range.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, and attack flag.
* **Returns:** boolean or nil: true if item stolen, false or nil on failure.
* **Error states:** Returns nil if target moved out of range before execution.

### `ACTIONS.MAKEBALLOON.fn(act)`
* **Description:** Spawns a balloon near the doer if the doer has the 'balloonomancer' tag and consumes a small amount of sanity.
* **Parameters:**
  - `act` -- Table: the action object containing doer, invobject.
* **Returns:** boolean: true on success, false on insufficient sanity.
* **Error states:** Returns false if doer lacks tag or sanity too low.

### `ACTIONS.EQUIP.fn(act)`
* **Description:** Handles the EQUIP action by attempting to equip invobject onto the doer using inventory.Equip.
* **Parameters:**
  - `act` -- Table: the action object containing doer and invobject.
* **Returns:** boolean or nil: return value from inventory.Equip.
* **Error states:** Returns nil if inventory is missing.

### `ACTIONS.UNEQUIP.strfn(act)`
* **Description:** Computes the display string for the UNEQUIP action, returning 'HEAVY' for heavy items or game mode settings.
* **Parameters:**
  - `act` -- Table: the action object containing invobject and doer.
* **Returns:** string or nil: 'HEAVY' or nil.
* **Error states:** None

### `ACTIONS.UNEQUIP.fn(act)`
* **Description:** Handles the UNEQUIP action by unequipping an item, potentially giving it to inventory or dropping it.
* **Parameters:**
  - `act` -- Table: the action object containing doer and invobject.
* **Returns:** boolean or nil: true on success, nil if unequip prevented or missing components.
* **Error states:** Returns nil if equippable prevent unequipping or inventory missing.

### `ACTIONS.PICKUP.strfn(act)`
* **Description:** Computes the display string for the PICKUP action, returning 'HEAVY' for heavy items.
* **Parameters:**
  - `act` -- Table: the action object containing target.
* **Returns:** string or nil: 'HEAVY' or nil.
* **Error states:** None

### `ACTIONS.PICKUP.fn(act)`
* **Description:** Handles the PICKUP action by checking many conditions (tags, restrictions, inventory full, spider ownership, cursed items, container usage) before transferring item to inventory.
* **Parameters:**
  - `act` -- Table: the action object containing doer and target.
* **Returns:** boolean or false: true on success, false on various failure reasons (e.g., 'restriction', 'INUSE', 'NOTMINE_YOTC', etc.).
* **Error states:** Returns false with specific reasons such as 'restriction', 'INUSE', 'NOTMINE_SPIDER', 'FULL_OF_CURSES', 'NO_HEAVY_LIFTING', 'NOTMINE_YOTC'.

### `ACTIONS.EMPTY_CONTAINER.fn(act)`
* **Description:** Handles EMPTY_CONTAINER action by calling target.workable.onwork if both container and workable components exist.
* **Parameters:**
  - `act` -- Table: the action object containing doer and target.
* **Returns:** boolean: always returns true.
* **Error states:** None

### `ACTIONS.REPAIR.strfn(act)`
* **Description:** Computes the display string for the REPAIR action, returning 'SOCKET' or 'REFRESH' for specific tags.
* **Parameters:**
  - `act` -- Table: the action object containing target.
* **Returns:** string or nil: 'SOCKET', 'REFRESH', or nil.
* **Error states:** None

### `ACTIONS.REPAIR.fn(act)`
* **Description:** Handles the REPAIR action by trying repairable or forgerepairable components with appropriate repair materials.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, and invobject.
* **Returns:** boolean: result of repair call or nil if no repair components.
* **Error states:** Returns nil if no repair components found.

### `ACTIONS.SEW.strfn(act)`
* **Description:** Computes the display string for the SEW action, returning 'PATCH' if the item has tag 'tape'.
* **Parameters:**
  - `act` -- Table: the action object containing invobject.
* **Returns:** string or nil: 'PATCH' or nil.
* **Error states:** None

### `ACTIONS.SEW.fn(act)`
* **Description:** Handles the SEW action by calling DoSewing if target is fueled and invobject has sewing component.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, and invobject.
* **Returns:** boolean or nil: result of DoSewing or nil if missing components.
* **Error states:** Returns nil if required components are absent.

### `ACTIONS.RUMMAGE.fn(act)`
* **Description:** Handles the RUMMAGE action by opening or closing containers, handling restrictions, and optionally dropping containers per droponopen rules.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, invobject.
* **Returns:** boolean or false: true on success, false with reasons like 'INUSE', 'RESTRICTED', 'NOTMERM'.
* **Error states:** Returns false with reasons such as 'INUSE', 'RESTRICTED', 'NOTMASTERCHEF', 'NOTAMERM', 'NOTSOULJARHANDLER'.

### `ACTIONS.RUMMAGE.strfn(act)`
* **Description:** Computes the display string for the RUMMAGE action, returning 'CLOSE' if container is opened, or 'DECORATE'/'PEEK' based on tags.
* **Parameters:**
  - `act` -- Table: the action object containing doer, target, invobject.
* **Returns:** string or nil: 'CLOSE', 'DECORATE', 'PEEK', or nil.
* **Error states:** None

### `ACTIONS.DROP.fn(act)`
* **Description:** Handles the DROP action by calling inventory.DropItem with options for wholestack, random direction, and keepoverstacked.
* **Parameters:**
  - `act` -- Table: the action object containing doer and invobject.
* **Returns:** boolean or nil: return value of inventory.DropItem, or nil if inventory missing or equippable prevents dropping.
* **Error states:** Returns nil if invobject equippable prevents unequipping or inventory missing.

### `ACTIONS.DROP.strfn(act)`
* **Description:** Returns the display string key for the drop action based on the held item's tags or properties (trap, mine, soul, lantern, playerfloater, etc.).
* **Parameters:**
  - `act` -- action object containing doer, invobject, and other metadata
* **Returns:** string key or nil
* **Error states:** None

### `ShouldLOOKATStopLocomotor(act)`
* **Description:** Determines whether LOOKAT actions should stop the locomotor based on directwalking or overridelocomote state tags.
* **Parameters:**
  - `act` -- action object to inspect
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.LOOKAT.strfn(act)`
* **Description:** Returns the display string key for the lookat action, including 'CLOSEINSPECT' and 'READ' under specific conditions.
* **Parameters:**
  - `act` -- action object containing doer, target, and action point
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.LOOKAT.fn(act)`
* **Description:** Handles LOOKAT action: attempts to close inspect with equipped items or read inspectables (e.g., ancient texts with ancient_reader), stopping locomotor if needed.
* **Parameters:**
  - `act` -- action object with doer, target, and action point
* **Returns:** boolean success and optional reason string, or nil
* **Error states:** Returns early on close inspection failure or non-inspectable targets.

### `ACTIONS_MAP_REMAP[ACTIONS.ACTIVATE.code](act, targetpos)`
* **Description:** Remaps ACTIVATE action on map to JUMPIN_MAP if a wormhole is detected via charlieresidue inspection.
* **Parameters:**
  - `act` -- action object
  - `targetpos` -- target world position
* **Returns:** BufferedAction or nil
* **Error states:** Returns nil if doer is nil, charlieresidue missing, or no wormhole detected.

### `ACTIONS.READ.fn(act)`
* **Description:** Handles reading a book using the reader or simplebook component.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean success and optional reason, or nil
* **Error states:** Returns false/nil if target is invalid or components missing.

### `ACTIONS.ROW_FAIL.fn(act)`
* **Description:** Handles row fail action: calls RowFail on equipped oar, displays fail string, and pushes 'working' event.
* **Parameters:**
  - `act` -- action object
* **Returns:** true (always returns true to avoid skipping finite uses callback).
* **Error states:** Returns false early if no oar equipped.

### `row(act)`
* **Description:** Internal utility function for rowing actions; delegates to crewmember or oar components.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** Returns false if no oar or crewmember component.

### `ACTIONS.ROW.fn(act)`
* **Description:** Wraps the internal row function for the ROW action.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.ROW_CONTROLLER.fn(act)`
* **Description:** Wraps the internal row function for the ROW_CONTROLLER action.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.BOARDPLATFORM.fn(act)`
* **Description:** Boarding platform action — always succeeds.
* **Parameters:**
  - `act` -- action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.OCEAN_FISHING_POND.fn(act)`
* **Description:** Checks if target is a virtualocean to allow ocean fishing pond actions.
* **Parameters:**
  - `act` -- action object
* **Returns:** true/false, and optional reason string 'WRONGGEAR'
* **Error states:** Returns false, 'WRONGGEAR' if target not tagged 'virtualocean'.

### `ACTIONS.OCEAN_FISHING_CAST.fn(act)`
* **Description:** Casts ocean fishing rod at target position using the oceanfishingrod component.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean from rod:Cast or nil
* **Error states:** None

### `ACTIONS.OCEAN_FISHING_REEL.strfn(act)`
* **Description:** Returns 'SETHOOK' if the target of the fishing rod is tagged 'partiallyhooked'.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.OCEAN_FISHING_REEL.fn(act)`
* **Description:** Reels in ocean fishing rod using oceanfishingrod:Reel().
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean from rod:Reel() or nil
* **Error states:** None

### `ACTIONS.OCEAN_FISHING_STOP.fn(act)`
* **Description:** Stops ocean fishing by changing state to oceanfishing_stop and calling StopFishing.
* **Parameters:**
  - `act` -- action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.OCEAN_FISHING_CATCH.fn(act)`
* **Description:** Triggers catch animation and calls CatchFish() on oceanfishingrod component.
* **Parameters:**
  - `act` -- action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.CHANGE_TACKLE.strfn(act)`
* **Description:** Returns 'REMOVE' if item is inside container, or 'AMMO' if tagged 'reloaditem_ammo'.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.CHANGE_TACKLE.fn(act)`
* **Description:** Handles switching fishing tackle between inventory, equipped container slots, and stacks.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean success or false
* **Error states:** Returns false if containers/components missing or operations fail.

### `ACTIONS.TALKTO.fn(act)`
* **Description:** Triggers talkable or maxwelltalker component interactions, stopping locomotor and starting speech threads.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean true
* **Error states:** None

### `ACTIONS.INTERACT_WITH.strfn(act)`
* **Description:** Returns 'FARM_PLANT' if target is a farm_plant.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.INTERACT_WITH.fn(act)`
* **Description:** Tends to a farm plant using farmplanttendable component, announcing via talker.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean true or nil
* **Error states:** None

### `ACTIONS.INTERACT_WITH.theme_music_fn(act)`
* **Description:** Returns 'farming' theme if target is farm_plant.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.ATTACKPLANT.fn(act)`
* **Description:** Stresses a farm plant using farmplantstress and sets tendable true.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean true
* **Error states:** None

### `ACTIONS.TELLSTORY.stroverridefn(act)`
* **Description:** Overrides the display string for the tell story action to prevent target name from appearing.
* **Parameters:**
  - `act` -- action object
* **Returns:** string reference to STRINGS.ACTIONS.TELLSTORY
* **Error states:** None

### `ACTIONS.TELLSTORY.fn(act)`
* **Description:** Calls storyteller:TellStory on the doer with the target or invobject.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean or false+reason from storyteller component.
* **Error states:** None

### `ACTIONS.PERFORM.fn(act)`
* **Description:** Calls stageactingprop:DoPerformance if doer is stageactor and target is stageactingprop.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean from DoPerformance or nil
* **Error states:** Returns nil if components missing.

### `ACTIONS.BAIT.fn(act)`
* **Description:** Sets bait on trap by removing item from inventory and calling trap:SetBait.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean true
* **Error states:** None

### `ACTIONS.DEPLOY.fn(act)`
* **Description:** Deploys item using deployable or complexprojectile component, handling placement and inventory removal.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean or false+reason
* **Error states:** Returns false+reason on CanDeploy failure or deploy failure.

### `ACTIONS.DEPLOY.strfn(act)`
* **Description:** Returns the appropriate deployment string key based on item tags (DEPLOY, DEPLOY_TOSS, GROUNDTILE, FENCE, etc.).
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.DEPLOY.theme_music_fn(act)`
* **Description:** Returns 'farming' theme for items tagged 'deployedfarmplant'.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.DEPLOY_TILEARRIVE.fn(act)`
* **Description:** Alias for ACTIONS.DEPLOY.fn.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean or false+reason
* **Error states:** None

### `ACTIONS.DEPLOY_TILEARRIVE.stroverridefn(act)`
* **Description:** Returns the same string override as DEPLOY, derived from strfn.
* **Parameters:**
  - `act` -- action object
* **Returns:** string from STRINGS.ACTIONS.DEPLOY
* **Error states:** None

### `ACTIONS.DEPLOY_FLOATING.fn(act)`
* **Description:** Alias for ACTIONS.DEPLOY.fn.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean or false+reason
* **Error states:** None

### `ACTIONS.DEPLOY_FLOATING.stroverridefn(act)`
* **Description:** Returns the same string override as DEPLOY, derived from strfn.
* **Parameters:**
  - `act` -- action object
* **Returns:** string from STRINGS.ACTIONS.DEPLOY
* **Error states:** None

### `ACTIONS.TOGGLE_DEPLOY_MODE.strfn(act)`
* **Description:** Alias for ACTIONS.DEPLOY.strfn.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.SUMMONGUARDIAN.fn(act)`
* **Description:** Calls guardian:Call on target if both doer and target exist.
* **Parameters:**
  - `act` -- action object
* **Returns:** nil
* **Error states:** None

### `ACTIONS.CHECKTRAP.fn(act)`
* **Description:** Harvests trap using trap:Harvest on target.
* **Parameters:**
  - `act` -- action object
* **Returns:** true
* **Error states:** None

### `DoToolWork(act, workaction)`
* **Description:** Performs tool-based work on target with multiplier calculations, recoil, and special work resolution.
* **Parameters:**
  - `act` -- action object
  - `workaction` -- action type (CHOP, MINE, etc.)
* **Returns:** boolean true or false
* **Error states:** Returns false if restrictions, item mimic, or invalid workable state.

### `ValidToolWork(act, workaction)`
* **Description:** Pre-flight check for tool-based work to verify workable, action match, and equip restrictions.
* **Parameters:**
  - `act` -- action object
  - `workaction` -- action type
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.CHOP.fn(act)`
* **Description:** Chops target with DoToolWork; triggers spooked on success if applicable.
* **Parameters:**
  - `act` -- action object
* **Returns:** true, or false+reason if work fails.
* **Error states:** None

### `ACTIONS.CHOP.validfn(act)`
* **Description:** Returns true if CHOP is valid on target.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.MINE.fn(act)`
* **Description:** Mines target with DoToolWork.
* **Parameters:**
  - `act` -- action object
* **Returns:** true, or false+reason if work fails.
* **Error states:** None

### `ACTIONS.MINE.validfn(act)`
* **Description:** Returns true if MINE is valid on target.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.HAMMER.fn(act)`
* **Description:** Hammers target with DoToolWork.
* **Parameters:**
  - `act` -- action object
* **Returns:** true, or false+reason if work fails.
* **Error states:** None

### `ACTIONS.HAMMER.validfn(act)`
* **Description:** Returns true if HAMMER is valid on target.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.DIG.fn(act)`
* **Description:** Digs target with DoToolWork.
* **Parameters:**
  - `act` -- action object
* **Returns:** true, or false+reason if work fails.
* **Error states:** None

### `ACTIONS.DIG.validfn(act)`
* **Description:** Returns true if DIG is valid on target.
* **Parameters:**
  - `act` -- action object
* **Returns:** boolean
* **Error states:** None

### `ACTIONS.DIG.theme_music_fn(act)`
* **Description:** Returns 'farming' theme for targets tagged farm_debris or farm_plant.
* **Parameters:**
  - `act` -- action object
* **Returns:** string key or nil
* **Error states:** None

### `ACTIONS.FERTILIZE.fn(act)`
* **Description:** Attempts to apply fertilizer from invobject to a valid target (crop, grower, pickable, quagmire_fertilizable or self if no target). Triggers Cheevo event if applied to a pickable.
* **Parameters:**
  - `act` -- Action object containing doer, target, invobject; provides context for the fertilization attempt
* **Returns:** true if fertilizer was applied, false otherwise
* **Error states:** Returns false if no applicable fertilizer component, target not suitable, or target is already withered/harvested/matured

### `ACTIONS.SMOTHER.fn(act)`
* **Description:** Smothers a smoldering target by consuming either invobject or doer as the smotherer.
* **Parameters:**
  - `act` -- Action object with target entity and optional invobject used as smotherer
* **Returns:** true if smothering succeeded, false otherwise
* **Error states:** Returns nil if target has no burnable component or isn't smoldering

### `ACTIONS.MANUALEXTINGUISH.fn(act)`
* **Description:** Manually extinguishes a burning target using a frozen item as the extinguisher.
* **Parameters:**
  - `act` -- Action object with invobject (must be frozen) and burning target
* **Returns:** true if extinguishing succeeded, false otherwise
* **Error states:** Returns nil if target isn't burning or invobject isn't frozen

### `ACTIONS.NET.fn(act)`
* **Description:** Performs netting action on a workable entity; may replicate netting to multiple entities via nabbag component.
* **Parameters:**
  - `act` -- Action object with target (must be workable, grabbable, and have appropriate work action) and invobject
* **Returns:** true if netting action completed (even if no actual work performed)
* **Error states:** Returns false if target cannot be grabbed with current tool or target is dead

### `ACTIONS.CATCH.fn(act)`
* **Description:** Placeholder action for catching operations; always succeeds.
* **Parameters:**
  - `act` -- Action object (unused in this handler)
* **Returns:** true
* **Error states:** None

### `ACTIONS.FISH_OCEAN.fn(act)`
* **Description:** Handles ocean fishing attempts; prevents fishing in deep water.
* **Parameters:**
  - `act` -- Action object (unused)
* **Returns:** false, TOODEEP
* **Error states:** Always returns TOODEEP

### `ACTIONS.FISH.fn(act)`
* **Description:** Starts fishing using the fishing rod component of the held item.
* **Parameters:**
  - `act` -- Action object with invobject (fishing rod) and target (water source)
* **Returns:** true
* **Error states:** None

### `ACTIONS.REEL.fn(act)`
* **Description:** Reels in the fishing line based on current state: hooks fish if biting, reels if hooked, stops if nothing.
* **Parameters:**
  - `act` -- Action object with invobject (fishing rod) and target
* **Returns:** true
* **Error states:** None

### `ACTIONS.REEL.strfn(act)`
* **Description:** Returns appropriate action string (REEL/HOOK/CANCEL) based on current fishing state.
* **Parameters:**
  - `act` -- Action object with invobject (fishing rod) and target
* **Returns:** String: REEL, HOOK, or CANCEL
* **Error states:** Returns nil if target mismatch or invalid state

### `ACTIONS.PICK.strfn(act)`
* **Description:** Returns the appropriate string label (HARVEST/RUMMAGE/SEARCH) based on pickable tags.
* **Parameters:**
  - `act` -- Action object with target entity
* **Returns:** String or nil
* **Error states:** Returns nil if target is nil or no matching tags

### `ACTIONS.PICK.fn(act)`
* **Description:** Picks or searches a target: pickable.Pick() or searchable.Search(); blocks if stuck.
* **Parameters:**
  - `act` -- Action object with target entity and doer
* **Returns:** true/nil for pickable, result of searchable.Search for searchable, false with STUCK reason if stuck
* **Error states:** Returns false,STUCK if target is stuck; delegates errors from components

### `ACTIONS.PICK.validfn(act)`
* **Description:** Determines if the pick action is valid for the target.
* **Parameters:**
  - `act` -- Action object with target entity
* **Returns:** true if target is pickable or searchable and has appropriate flags
* **Error states:** Returns false if target is nil or neither component is applicable

### `ACTIONS.PICK.theme_music_fn(act)`
* **Description:** Returns 'farming' theme if target is a farm plant, otherwise nil.
* **Parameters:**
  - `act` -- Action object with target entity
* **Returns:** String 'farming' or nil
* **Error states:** None

### `ACTIONS.ATTACK.fn(act)`
* **Description:** Performs attack; handles prop attacks, thrusting/helmsplitting animations, and standard combat attack.
* **Parameters:**
  - `act` -- Action object with doer (attacker) and target
* **Returns:** true if attack succeeded
* **Error states:** None

### `ACTIONS.ATTACK.strfn(act)`
* **Description:** Returns appropriate string label for attack animations (PROP/RANGEDSMOTHER/RANGEDLIGHT/WHACK/SMASHABLE).
* **Parameters:**
  - `act` -- Action object with invobject (weapon) and target
* **Returns:** String label or nil
* **Error states:** Returns nil if no special conditions met

### `ACTIONS.COOK.stroverridefn(act)`
* **Description:** Overrides action string to SPICE if target is spicer.
* **Parameters:**
  - `act` -- Action object with target entity
* **Returns:** STRINGS.ACTIONS.SPICE or nil
* **Error states:** None

### `ACTIONS.COOK.fn(act)`
* **Description:** Handles cooking: delegated to cooker, stewer, or cookable components with appropriate context.
* **Parameters:**
  - `act` -- Action object with target (cooker/stewer/cookable container), invobject (ingredient), and doer
* **Returns:** true if cooking succeeded, false otherwise
* **Error states:** Returns false with reasons like INUSE, TOOFAR, or failure from underlying components

### `ACTIONS.ACTIVATE_CONTAINER.fn(act)`
* **Description:** Invokes target's cookbuttonfn if present and container not in use by others.
* **Parameters:**
  - `act` -- Action object with target container entity
* **Returns:** true if cookbuttonfn succeeded, false if in use or missing fn
* **Error states:** Returns false,INUSE if container is opened by others

### `ACTIONS.FILL.fn(act)`
* **Description:** Fills fillable item with water from a watersource or ocean at action point.
* **Parameters:**
  - `act` -- Action object with invobject and target; one must be a watersource
* **Returns:** true if filled, false with error string otherwise
* **Error states:** Returns false,TOODEEP if ocean filling attempted at deep water; returns false with error string from component

### `ACTIONS.FILL_OCEAN.stroverridefn(act)`
* **Description:** Returns default FILL string override for ocean filling.
* **Parameters:**
  - `act` -- Action object (unused)
* **Returns:** STRINGS.ACTIONS.FILL
* **Error states:** None

### `ACTIONS.DRY.fn(act)`
* **Description:** Starts drying process using a dryer component.
* **Parameters:**
  - `act` -- Action object with target (dryer) and invobject (dryable)
* **Returns:** true if started, false otherwise; pushes CHEVO_starteddrying event
* **Error states:** Returns false if dryer cannot dry or StartDrying fails

### `ACTIONS.ADDFUEL.fn(act)`
* **Description:** Adds fuel to a fueled target from inventory or via direct interaction.
* **Parameters:**
  - `act` -- Action object with target (fueled), invobject (fuel), and doer
* **Returns:** true if fuel taken successfully, false otherwise
* **Error states:** Returns false if fuel not accepted; may re-add fuel to inventory on partial consumption

### `ACTIONS.GIVE.strfn(act)`
* **Description:** Returns string label for giving (SOCKET/SHOW/REPAIR/CELESTIAL) based on target tags.
* **Parameters:**
  - `act` -- Action object with target entity
* **Returns:** String or nil
* **Error states:** Returns nil if no matching tags

### `ACTIONS.GIVE.stroverridefn(act)`
* **Description:** Returns dynamic localized string for gifting, handling ghostlyelixir, wintersfeasttable, quagmire_altar, etc.
* **Parameters:**
  - `act` -- Action object with target and invobject
* **Returns:** Formatted string or nil
* **Error states:** Returns nil if no special handling applies

### `ACTIONS.GIVE.fn(act)`
* **Description:** Handles giving items to various recipient types: lecturn, elixirable, trader, moontrader, furniture decortaker, etc.
* **Parameters:**
  - `act` -- Action object with target entity and invobject to give
* **Returns:** true if giving succeeded, false with reason otherwise
* **Error states:** Returns false with reasons: INUSE, FULL, not able to accept, blocked by ShouldBlockGiving

### `ACTIONS.GIVETOPLAYER.fn(act)`
* **Description:** Gives one item to a player-owned trader that is opened or ghost.
* **Parameters:**
  - `act` -- Action object with target (trader/player) and invobject
* **Returns:** true if accepted, false with reason otherwise
* **Error states:** Returns false,INUSE or FULL or other trader rejection reason

### `ACTIONS.GIVEALLTOPLAYER.fn(act)`
* **Description:** Gives the full stack of an item to an opened trader.
* **Parameters:**
  - `act` -- Action object with target (trader/player) and invobject
* **Returns:** true if accepted, false with reason otherwise
* **Error states:** Returns false,FULL or other trader rejection reason

### `ACTIONS.FEEDPLAYER.fn(act)`
* **Description:** Feeds an idle, non-busy player edible food, playing appropriate eat animation.
* **Parameters:**
  - `act` -- Action object with target (eater) and invobject (edible food)
* **Returns:** true if food eaten or eater refuses (action always succeeds); false if conditions not met
* **Error states:** Returns false if target state or tags prevent feeding; pushes won't eat food event if refused

### `ACTIONS.DECORATEVASE.fn(act)`
* **Description:** Decorates a vase if enabled with a valid flower item.
* **Parameters:**
  - `act` -- Action object with target (vase) and invobject (flower)
* **Returns:** true if decorated, false otherwise
* **Error states:** Returns false if vase not enabled or component missing

### `ACTIONS.CARNIVALGAME_FEED.fn(act)`
* **Description:** Feeds a carnival game feedable item if game is open.
* **Parameters:**
  - `act` -- Action object with target (carnivalgamefeedable) and invobject (item)
* **Returns:** Result of DoFeed or false with TOO_LATE
* **Error states:** Returns false,TOO_LATE if game closed; false if invalid item/target

### `ShouldBlockGiving(act)`
* **Description:** Checks if item is restricted from leaving the pocket or being placed in restricted containers.
* **Parameters:**
  - `act` -- Action object with invobject and target for gifting logic
* **Returns:** true if giving should be blocked, false otherwise
* **Error states:** None

### `ACTIONS.STORE.fn(act)`
* **Description:** Handles storing items into containers, handling proxies, restricted tags, construction builder slots, and special cases like soul jars and bundles; transfers items from doer's inventory to target container.
* **Parameters:**
  - `act` -- Action object containing doer, target, and invobject fields; represents the player-initiated action
* **Returns:** true on success, false with reason string on failure
* **Error states:** Fails with 'INUSE', 'NOTALLOWED', 'RESTRICTED', 'NOTMASTERCHEF', 'NOTAMERM', 'NOTSOULJARHANDLER' under various conditions; silent fail for forcedrop scenarios

### `ACTIONS.BUNDLESTORE.strfn(act)`
* **Description:** Returns 'CONSTRUCT' verb string when the action target matches the current construction builder container or target.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'CONSTRUCT' or nil
* **Error states:** None

### `ACTIONS.STORE.strfn(act)`
* **Description:** Returns context-specific verb strings (e.g., 'COOK', 'DECORATE', 'IMPRISON') based on target prefab and tags.
* **Parameters:**
  - `act` -- Action object
* **Returns:** verb string or nil
* **Error states:** None

### `ACTIONS.BUILD.fn(act)`
* **Description:** Delegates building to the doer's builder component using recipe, position, rotation, and skin data.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of DoBuild or nil
* **Error states:** None

### `ACTIONS.PLANT.strfn(act)`
* **Description:** Returns 'PLANTER' verb string if the target has the 'winter_treestand' tag.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'PLANTER' or nil
* **Error states:** None

### `ACTIONS.PLANT.fn(act)`
* **Description:** Removes seed from doer inventory and attempts planting via grower component or special winter tree logic; returns item on failure.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, nil on failure
* **Error states:** Falls through and gives item back if planting fails or grower missing

### `ACTIONS.HARVEST.fn(act)`
* **Description:** Handles harvesting via multiple components: crop, harvestable, stewer, dryer, dryingrack, occupiable, quagmire_tappable.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true or result from component-specific harvest method
* **Error states:** None

### `ACTIONS.HARVEST.strfn(act)`
* **Description:** Returns context verb strings like 'FREE' for birdcages or 'WITHERED' for withered crops.
* **Parameters:**
  - `act` -- Action object
* **Returns:** verb string or nil
* **Error states:** None

### `ACTIONS.LIGHT.fn(act)`
* **Description:** Ignites target via lighter component, fires 'onstartedfire' event on doer if present.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success
* **Error states:** Returns nil if invobject lacks lighter component

### `ACTIONS.SLEEPIN.fn(act)`
* **Description:** Uses sleepingbag component on the doer, checking either invobject or target for the component.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success
* **Error states:** Returns nil if no valid sleepingbag found

### `ACTIONS.HITCHUP.fn(act)`
* **Description:** Attempts to hitch a beefalo to a target after checking range, mood, and presence of beefalo bell.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, false with reason string on failure
* **Error states:** Fails with 'NEEDBEEF', 'NEEDBEEF_CLOSER', or 'INMOOD'

### `ACTIONS.UNHITCH.fn(act)`
* **Description:** Calls Unhitch on target's hitcher component if present and not already unhitched.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.HITCH.fn(act)`
* **Description:** Calls SetHitched on target hitcher component with the doer as target.
* **Parameters:**
  - `act` -- Action object
* **Returns:** None
* **Error states:** None

### `ACTIONS.MARK.strfn(act)`
* **Description:** Returns 'UNMARK' if target markable component already has the doer marked.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'UNMARK' or nil
* **Error states:** None

### `ACTIONS.MARK.fn(act)`
* **Description:** Attempts to mark or unmark target via markable or markable_proxy component.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, false with reason 'NOT_PARTICIPANT' or 'ALREADY_MARKED'
* **Error states:** Clears yotb_post_to_mark on success

### `ACTIONS.CHANGEIN.strfn(act)`
* **Description:** Returns 'DRESSUP' verb string if target has 'dressable' tag.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'DRESSUP' or nil
* **Error states:** None

### `ACTIONS.CHANGEIN.fn(act)`
* **Description:** Attempts to begin dressing/skin changing via wardrobe or groomer component; fails silently in darkness.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, false with reason on failure
* **Error states:** Fails silently if entity cannot see target

### `ACTIONS.SHAVE.strfn(act)`
* **Description:** Returns 'SELF' verb string if targeting self (or nil target) and a controller is attached.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'SELF' or nil
* **Error states:** None

### `ACTIONS.SHAVE.fn(act)`
* **Description:** Shaves either target or doer using the specified shaver item via beard or shaveable components.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of beard:Shave or shaveable:Shave
* **Error states:** Returns nil if missing components or invalid state

### `ACTIONS.PLAY.strfn(act)`
* **Description:** Returns context-specific verb strings for coach whistle actions (e.g., 'TWEET', 'COACH_ON', 'COACH_OFF').
* **Parameters:**
  - `act` -- Action object
* **Returns:** verb string or nil
* **Error states:** None

### `ACTIONS.PLAY.fn(act)`
* **Description:** Calls instrument:Play on invobject if present and has instrument component.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true (instrument:Play always returns true)
* **Error states:** None

### `ACTIONS.POLLINATE.fn(act)`
* **Description:** Pollinates target flower or creates a flower if no target is specified.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result from pollinator:Pollinate or pollinator:CreateFlower
* **Error states:** None

### `ACTIONS.TERRAFORM.fn(act)`
* **Description:** Uses terraformer component on invobject to terraform at action point.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, false if invalid terrain
* **Error states:** None

### `ACTIONS.EXTINGUISH.fn(act)`
* **Description:** Extinguishes burning targets or depletes fueled section for special extinguishable items.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success
* **Error states:** None

### `ACTIONS.STOKEFIRE.fn(act)`
* **Description:** Stokes a controlled burn if doer has 'controlled_burner' tag and target is stokeablefire.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, false otherwise
* **Error states:** Returns false if doer lacks 'controlled_burner' tag or target not stokeablefire

### `ACTIONS.LAYEGG.fn(act)`
* **Description:** Triggers Regen on pickable component if egg is not currently pickable.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of pickable:Regen
* **Error states:** None

### `ACTIONS.INVESTIGATE.fn(act)`
* **Description:** Remembers investigation location and attempts retargeting via combat component.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.COMMENT.fn(act)`
* **Description:** Plays queued comment data via npc_talker or talker components.
* **Parameters:**
  - `act` -- Action object
* **Returns:** None
* **Error states:** Early returns if comment_data is nil

### `ACTIONS.GOHOME.fn(act)`
* **Description:** Handles entity returning home via spawner, childspawner, or hideout components; or removes entity if no valid target.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result from component GoHome or true
* **Error states:** Removes entity silently if no valid target or pos

### `ACTIONS.JUMPIN.strfn(act)`
* **Description:** Returns 'HAUNT' verb string if doer is a playerghost.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'HAUNT' or nil
* **Error states:** None

### `ACTIONS.JUMPIN.fn(act)`
* **Description:** Enters jumpin state if doer is in jumpin_pre state and target is an active teleporter.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** Returns to idle state if conditions not met

### `ACTIONS.JUMPIN_MAP.stroverridefn(act)`
* **Description:** Returns STRINGS.ACTIONS.JUMPIN.MAP_WORMHOLE.
* **Parameters:**
  - `act` -- Action object
* **Returns:** string
* **Error states:** None

### `DoCharlieResidueMapAction(act, target, charlieresidue, residue_context)`
* **Description:** Handles special teleport logic via CharlieResidue map actions for wormholes and tentacle pillars.
* **Parameters:**
  - `act` -- Action object
  - `target` -- Target entity
  - `charlieresidue` -- CharlieResidue prefab instance
  - `residue_context` -- Context enum value from CHARLIERESIDUE_MAP_ACTIONS
* **Returns:** true on success, false otherwise
* **Error states:** Decays residue and returns false on failure

### `ACTIONS.JUMPIN_MAP.fn(act)`
* **Description:** Processes map-based jump-in actions including direct teleport and CharlieResidue handling.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true on success, false or nil otherwise
* **Error states:** Returns to idle state on failure

### `ACTIONS.TELEPORT.strfn(act)`
* **Description:** Returns 'TOWNPORTAL' verb string if target exists.
* **Parameters:**
  - `act` -- Action object
* **Returns:** 'TOWNPORTAL' or nil
* **Error states:** None

### `ACTIONS.TELEPORT.fn(act)`
* **Description:** Enters entertownportal state if teleporter item or target has teleporter tag.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.RESETMINE.fn(act)`
* **Description:** Calls Reset on target's mine component.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.ACTIVATE.fn(act)`
* **Description:** Attempts to activate target via activatable component, skipping if burning/smoldering.
* **Parameters:**
  - `act` -- Action object
* **Returns:** (success ~= false) and msg
* **Error states:** Fails with msg from CanActivate or DoActivate if present

### `ACTIONS.ACTIVATE.strfn(act)`
* **Description:** Calls target:GetActivateVerb(doer) if present.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of GetActivateVerb or nil
* **Error states:** None

### `ACTIONS.ACTIVATE.stroverridefn(act)`
* **Description:** Calls target:OverrideActivateVerb(doer) if present.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of OverrideActivateVerb or nil
* **Error states:** None

### `ACTIONS.OPEN_CRAFTING.strfn(act)`
* **Description:** Returns action_str from PROTOTYPER_DEFS[target.prefab] if available.
* **Parameters:**
  - `act` -- Action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.OPEN_CRAFTING.fn(act)`
* **Description:** Calls builder:UsePrototyper(target) if doer has builder component.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true or false with reason string
* **Error states:** Returns false if builder missing

### `ACTIONS.CAST_POCKETWATCH.strfn(act)`
* **Description:** Calls GetActionVerb_CAST_POCKETWATCH on invobject via FunctionOrValue.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of FunctionOrValue or nil
* **Error states:** None

### `ACTIONS.CAST_POCKETWATCH.fn(act)`
* **Description:** Calls pocketwatch:CastSpell on invobject if doer has 'pocketwatchcaster' tag.
* **Parameters:**
  - `act` -- Action object
* **Returns:** result of CastSpell or nil
* **Error states:** Returns nil if missing tag or invobject

### `ACTIONS.HAUNT.fn(act)`
* **Description:** Attempts to haunt target if valid and not already held/haunted.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles the MURDER action: removes the target from inventory, plays sound, spawns loot, transfers inventory if tagged, then removes the target entity.
* **Parameters:**
  - `act` -- Action table containing doer, target, invobject, and other action data
* **Returns:** true if successful, nil otherwise
* **Error states:** None

### `strfn(act)`
* **Description:** Returns the string key for the HEAL action: 'USEONSELF', 'USE', 'SELF', or nil depending on context and tags.
* **Parameters:**
  - `act` -- Action table containing doer and target
* **Returns:** string or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles the HEAL action: delegates to healer or maxhealer component on the target item.
* **Parameters:**
  - `act` -- Action table containing doer, target, and invobject
* **Returns:** result of healer:maxhealer:Heal(), or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles the UNLOCK action: unlocks target if locked, using invobject as key.
* **Parameters:**
  - `act` -- Action table containing target and invobject
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles USEKLAUSSACKKEY action: delegates to klaussacklock:UseKey() component on target.
* **Parameters:**
  - `act` -- Action table containing target and invobject
* **Returns:** true, or false with reason string
* **Error states:** None

### `strfn(act)`
* **Description:** Determines the string key for the TEACH action based on invobject tags: 'NOTES', 'SCRAPBOOK', 'READ', 'SCAN', or nil.
* **Parameters:**
  - `act` -- Action table containing invobject and target
* **Returns:** string or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles the TEACH action: delegates to scrapbookable, teacher, maprecorder, mapspotrevealer, or recipescanner components on the item.
* **Parameters:**
  - `act` -- Action table containing invobject and target
* **Returns:** true, or success+reason from maprecorder/mapspotrevealer/recipescanner
* **Error states:** None

### `fn(act)`
* **Description:** Handles the TURNON action: turns on machine component if present and currently off.
* **Parameters:**
  - `act` -- Action table containing target and invobject
* **Returns:** true
* **Error states:** None

### `strfn(act)`
* **Description:** Returns string 'EMERGENCY' if target has hasemergencymode tag and is provided.
* **Parameters:**
  - `act` -- Action table containing target
* **Returns:** 'EMERGENCY' or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles the TURNOFF action: turns off machine component if present and currently on.
* **Parameters:**
  - `act` -- Action table containing target and invobject
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles USEITEM action: toggles toggleableitem or starts using useableitem on the held item.
* **Parameters:**
  - `act` -- Action table containing invobject and doer
* **Returns:** result of component call, or nil
* **Error states:** None

### `strfn(act)`
* **Description:** Returns uppercase prefab name of invobject, or 'GENERIC'.
* **Parameters:**
  - `act` -- Action table containing invobject
* **Returns:** string
* **Error states:** None

### `pre_action_cb(act)`
* **Description:** Closes controller inventory HUD if open and controller attached.
* **Parameters:**
  - `act` -- Action table containing doer
* **Returns:** nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles USEITEMON action: starts using useabletargeteditem component on the held item against the target.
* **Parameters:**
  - `act` -- Action table containing invobject, target, and doer
* **Returns:** true, or false with reason
* **Error states:** None

### `strfn(act)`
* **Description:** Returns uppercase prefab name of invobject, or 'GENERIC'.
* **Parameters:**
  - `act` -- Action table containing invobject
* **Returns:** string
* **Error states:** None

### `fn(act)`
* **Description:** Handles STOPUSINGITEM action: stops using useabletargeteditem on the held item.
* **Parameters:**
  - `act` -- Action table containing invobject
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles TAKEITEM action: takes item from shelf or inventoryitemholder component on target.
* **Parameters:**
  - `act` -- Action table containing target and doer
* **Returns:** true
* **Error states:** None

### `strfn(act)`
* **Description:** Returns 'BIRDCAGE' if target is birdcage, otherwise 'GENERIC'.
* **Parameters:**
  - `act` -- Action table containing target
* **Returns:** string
* **Error states:** None

### `stroverridefn(act)`
* **Description:** Returns custom string for TAKEITEM action, including item name and stack count if applicable.
* **Parameters:**
  - `act` -- Action table containing target and doer
* **Returns:** string or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles TAKESINGLEITEM action: takes single item from inventoryitemholder on target (partial stack).
* **Parameters:**
  - `act` -- Action table containing target and doer
* **Returns:** true
* **Error states:** None

### `stroverridefn(act)`
* **Description:** Returns STRINGS.ACTIONS.TAKESINGLEITEM constant.
* **Parameters:**
  - `act` -- Action table (unused)
* **Returns:** string
* **Error states:** None

### `strfn(act)`
* **Description:** Returns spelltype from invobject if present.
* **Parameters:**
  - `act` -- Action table containing invobject
* **Returns:** string or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles CASTSPELL action: checks and casts spell from spellcaster component on staff or hand item, with mimic and rider checks.
* **Parameters:**
  - `act` -- Action table containing invobject, doer, target, and action point
* **Returns:** true, or false with reason
* **Error states:** None

### `maponly_checkvalidpos_fn(act)`
* **Description:** Finds nearest valid map target (chest or player with globalmapicon) within radius for DIRECTCOURIER_MAP action.
* **Parameters:**
  - `act` -- Action table containing doer and action point
* **Returns:** true, nil, x, z, mapent on success; false, 'NOTARGET' otherwise
* **Error states:** None

### `stroverridefn(act)`
* **Description:** Returns appropriate string for DIRECTCOURIER_MAP based on target (chest or named player).
* **Parameters:**
  - `act` -- Action table containing doer
* **Returns:** string or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles DIRECTCOURIER_MAP action: sends courier command to server targeting nearest chest or player.
* **Parameters:**
  - `act` -- Action table containing doer and action point
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles BLINK action: uses blinkstaff component or triggers soulhop if soulstealer and not holding blink staff.
* **Parameters:**
  - `act` -- Action table containing doer and action point
* **Returns:** true or result from blinkstaff:Blink(), false with reason
* **Error states:** None

### `stroverridefn(act)`
* **Description:** Returns formatted soul-hop string if doer is soulstealer.
* **Parameters:**
  - `act` -- Action table containing doer
* **Returns:** string or nil
* **Error states:** None

### `fn(act)`
* **Description:** Handles BLINK_MAP action: attempts soul hopping from map target.
* **Parameters:**
  - `act` -- Action table containing doer and action point
* **Returns:** true
* **Error states:** None

### `fn(act, targetpos)`
* **Description:** Remaps BLINK action to BLINK_MAP for map-based soul hopping, calculating souls required and applying skill/efficiency modifiers.
* **Parameters:**
  - `act` -- Action table
  - `targetpos` -- Vector3 target position
* **Returns:** new BufferedAction or nil if invalid
* **Error states:** None

### `fn(act)`
* **Description:** Handles CASTSUMMON action: uses ghostlybond:Summon() on doer with summoning item.
* **Parameters:**
  - `act` -- Action table containing invobject, doer
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles CASTUNSUMMON action: uses ghostlybond:Recall() on doer.
* **Parameters:**
  - `act` -- Action table containing invobject, doer
* **Returns:** result of ghostlybond:Recall()
* **Error states:** None

### `strfn(act)`
* **Description:** Returns string 'MAKE_DEFENSIVE' or 'MAKE_AGGRESSIVE' based on has_aggressive_follower tag.
* **Parameters:**
  - `act` -- Action table containing doer
* **Returns:** string
* **Error states:** None

### `fn(act)`
* **Description:** Handles COMMUNEWITHSUMMONED action: uses ghostlybond:ChangeBehaviour() on doer.
* **Parameters:**
  - `act` -- Action table containing invobject, doer
* **Returns:** result of ghostlybond:ChangeBehaviour()
* **Error states:** None

### `fn(act)`
* **Description:** Handles COMBINESTACK action: stacks invobject into target if compatible and target is not full.
* **Parameters:**
  - `act` -- Action table containing target and invobject
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles TRAVEL action: invokes travel_action_fn on target if present.
* **Parameters:**
  - `act` -- Action table containing target and doer
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles UNPIN action: pushes unpinned event if target is stuck.
* **Parameters:**
  - `act` -- Action table containing doer and target
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles STEALMOLEBAIT action: clears mole target and pushes onstolen event for mole thief.
* **Parameters:**
  - `act` -- Action table containing doer and target
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles MAKEMOLEHILL action: spawns molehill or molebathill at doer position for mole/molebat.
* **Parameters:**
  - `act` -- Action table containing doer
* **Returns:** true
* **Error states:** None

### `fn(act)`
* **Description:** Handles MOLEPEEK action: pushes peek event for doer.
* **Parameters:**
  - `act` -- Action table containing doer
* **Returns:** true
* **Error states:** None

### `strfn(act)`
* **Description:** Returns 'TREAT' if invobject has pet_treat tag, otherwise nil.
* **Parameters:**
  - `act` -- Action table containing invobject
* **Returns:** string or nil
* **Error states:** None

### `ActionCanMapToss(act)`
* **Description:** Checks if the current action can toss an item onto the map (e.g., into ocean)
* **Parameters:**
  - `act` -- action object containing doer, invobject, and action data
* **Returns:** bool
* **Error states:** None

### `ACTIONS.FEED.fn(act)`
* **Description:** Handles feeding logic: accepts gifts to traders, eats food by eatable targets, handles murder/loot if target dies from eating
* **Parameters:**
  - `act` -- action object with target, doer, invobject, etc.
* **Returns:** bool or false, reason
* **Error states:** nil if target cannot be determined; false with reason if mimic or eater rejection

### `ACTIONS.HAIRBALL.fn(act)`
* **Description:** Allows hairball action only if the doer is a catcoon
* **Parameters:**
  - `act` -- action object
* **Returns:** bool
* **Error states:** None

### `ACTIONS.CATPLAYGROUND.fn(act)`
* **Description:** Catcoon playground behavior: plays with cattoy, pops poppable, attacks weak targets, picks up items, activates activatable objects
* **Parameters:**
  - `act` -- action object with doer, target, invobject
* **Returns:** bool
* **Error states:** None

### `ACTIONS.CATPLAYAIR.fn(act)`
* **Description:** Airborne catcoon play: similar to CATPLAYGROUND but with different logic for top-down attacks and activation
* **Parameters:**
  - `act` -- action object with doer, target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.ERASE_PAPER.fn(act)`
* **Description:** Erases paper using an erasablepaper item on a papereraser, excluding fire/burnt targets
* **Parameters:**
  - `act` -- action object with invobject (eraser) and target (paper)
* **Returns:** bool result of DoErase
* **Error states:** None

### `ACTIONS.FAN.fn(act)`
* **Description:** Uses the fan component to fan either the target or the doer
* **Parameters:**
  - `act` -- action object with invobject (fan) and target
* **Returns:** bool or false, reason
* **Error states:** false if mimic; nil if no fan

### `ACTIONS.TOSS.fn(act)`
* **Description:** Drops a complexprojectile item and launches it toward target position, handling inventory and projectile constraints
* **Parameters:**
  - `act` -- action object
* **Returns:** bool or nil
* **Error states:** nil if no projectile, equippable restrictions, or mimic; false for mimic

### `ACTIONS.WATER_TOSS.fn(act)`
* **Description:** Alias for TOSS, used for water-related toss items
* **Parameters:**
  - `act` -- action object
* **Returns:** bool or nil
* **Error states:** None

### `ACTIONS.TOSS_MAP.stroverridefn(act)`
* **Description:** Override string for map toss action, using CanTossOnMap callback and TOSS string
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.TOSS_MAP.fn(act)`
* **Description:** Converts a TOSS action into a map-based toss if CanTossOnMap returns true
* **Parameters:**
  - `act` -- action object
* **Returns:** bool or nil
* **Error states:** None

### `ACTIONS_MAP_REMAP[ACTIONS.TOSS.code](act, targetpos)`
* **Description:** Remaps TOSS target position using min/max distance constraints and ensures target is on ocean tile
* **Parameters:**
  - `act` -- action object
  - `targetpos` -- Vector3 position of target
* **Returns:** BufferedAction or nil
* **Error states:** nil if not ocean or visual ground

### `ACTIONS.UPGRADE.fn(act)`
* **Description:** Attempts to upgrade a target using an upgrader item, respecting upgrade conditions
* **Parameters:**
  - `act` -- action object with invobject (upgrader) and target (upgradeable)
* **Returns:** bool or false, reason
* **Error states:** false if can't upgrade or condition fail

### `ACTIONS.UPGRADE.strfn(act)`
* **Description:** Returns 'WATERPLANT' if target has tag derived from UPGRADETYPES.WATERPLANT
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.NUZZLE.fn(act)`
* **Description:** Simple nuzzle action that always succeeds if target exists
* **Parameters:**
  - `act` -- action object
* **Returns:** bool
* **Error states:** None

### `ACTIONS.WRITE.fn(act)`
* **Description:** Begins writing on a writeable item if target is not already written and visible
* **Parameters:**
  - `act` -- action object with doer, target, and writeable target
* **Returns:** bool or false, reason
* **Error states:** false if already being written or not visible

### `ACTIONS.ATTUNE.fn(act)`
* **Description:** Links the doer to the target using the attunable component
* **Parameters:**
  - `act` -- action object with doer and attunable target
* **Returns:** bool, reason or result of LinkToPlayer
* **Error states:** None

### `ACTIONS.MIGRATE.fn(act)`
* **Description:** Activates migration using the worldmigrator component on the target
* **Parameters:**
  - `act` -- action object with doer and worldmigrator target
* **Returns:** bool
* **Error states:** false for NODESTINATION or missing component

### `ACTIONS.REMOTERESURRECT.fn(act)`
* **Description:** Resurrects remotely using an attuned remoteresurrector or gravestoneresurrector
* **Parameters:**
  - `act` -- action object with ghost doer
* **Returns:** bool or nil
* **Error states:** nil if no attuner or no target

### `ACTIONS.REVIVE_CORPSE.fn(act)`
* **Description:** Revives a corpse if it can be revived by the doer
* **Parameters:**
  - `act` -- action object with doer and revivablecorpse target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.MOUNT.fn(act)`
* **Description:** Checks conditions and mounts the target using rider component; validates saddle, combat, health, freezing, hitching, tags
* **Parameters:**
  - `act` -- action object with doer and rideable target
* **Returns:** bool or false, reason
* **Error states:** false for TARGETINCOMBAT, INUSE, or condition fails

### `ACTIONS.DISMOUNT.fn(act)`
* **Description:** Dismounts the doer if they are riding and match the target
* **Parameters:**
  - `act` -- action object
* **Returns:** bool
* **Error states:** None

### `ACTIONS.SADDLE.fn(act)`
* **Description:** Saddles a mount, removing saddle from inventory and applying via rideable component
* **Parameters:**
  - `act` -- action object with doer, target, and invobject (saddle)
* **Returns:** bool or false, reason
* **Error states:** false for TARGETINCOMBAT, dead, or mimic

### `ACTIONS.UNSADDLE.fn(act)`
* **Description:** Unsaddles a mount by setting rideable.saddle to nil
* **Parameters:**
  - `act` -- action object with doer and target
* **Returns:** bool or false, reason
* **Error states:** false for TARGETINCOMBAT, dead, or mimic

### `ACTIONS.BRUSH.fn(act)`
* **Description:** Brushes the target using the brushable component, if valid
* **Parameters:**
  - `act` -- action object with doer, target, and brush item
* **Returns:** bool or false, reason
* **Error states:** false for TARGETINCOMBAT, dead, or mimic

### `ACTIONS.ABANDON.fn(act)`
* **Description:** Abandons a pet (via petleash or follower component), enforcing orphanage tech or nearby location for critters
* **Parameters:**
  - `act` -- action object with doer and target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.PET.fn(act)`
* **Description:** Pets a critter or notifies kitcoon with on_petted event
* **Parameters:**
  - `act` -- action object with doer and target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.RETURN_FOLLOWER.fn(act)`
* **Description:** Returns a follower to a nearby kitcoon den if leader and in-range conditions are met
* **Parameters:**
  - `act` -- action object
* **Returns:** bool
* **Error states:** false if no den found

### `ACTIONS.HIDEANSEEK_FIND.fn(act)`
* **Description:** Searches a hiding spot using hideandseekhidingspot component
* **Parameters:**
  - `act` -- action object
* **Returns:** bool
* **Error states:** None

### `ACTIONS.DRAW.stroverridefn(act)`
* **Description:** Returns a custom string for drawing action using FindEntityToDraw and drawnameoverride
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.DRAW.fn(act)`
* **Description:** Draws an image on a target using drawingtool component if target can be drawn
* **Parameters:**
  - `act` -- action object with drawingtool and drawable components
* **Returns:** bool or false, reason
* **Error states:** false if NOIMAGE

### `ACTIONS.STARTCHANNELING.strfn(act)`
* **Description:** Returns 'PUMP' if target has 'pump' tag
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.STARTCHANNELING.fn(act)`
* **Description:** Starts channeling on target with the channelable component
* **Parameters:**
  - `act` -- action object with channelable target
* **Returns:** bool or nil
* **Error states:** None

### `ACTIONS.STOPCHANNELING.fn(act)`
* **Description:** Stops channeling on target
* **Parameters:**
  - `act` -- action object with channelable target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.START_CHANNELCAST.strfn(act)`
* **Description:** Returns 'LIGHTER' if invobject has 'lighter' tag
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.START_CHANNELCAST.fn(act)`
* **Description:** Starts channel casting using off-hand (no item) or equipped item, respecting mimic
* **Parameters:**
  - `act` -- action object with channelcaster and optionally channelcastable item
* **Returns:** bool
* **Error states:** false if mimic or invalid state

### `ACTIONS.STOP_CHANNELCAST.strfn(act)`
* **Description:** Same as START_CHANNELCAST.strfn
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.STOP_CHANNELCAST.fn(act)`
* **Description:** Stops channel casting on a channelcastable item used by doer, respecting mimic
* **Parameters:**
  - `act` -- action object with channelcastable item
* **Returns:** bool
* **Error states:** false if mimic

### `ACTIONS.BUNDLE.fn(act)`
* **Description:** Starts bundling using the bundler component on the doer
* **Parameters:**
  - `act` -- action object with bundler doer and bundlable target
* **Returns:** bool or nil
* **Error states:** nil if not visible (silent fail)

### `ACTIONS.WRAPBUNDLE.fn(act)`
* **Description:** Finishes bundling if the target bundle is not empty; shows message if empty
* **Parameters:**
  - `act` -- action object with bundler doer and bundling target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.UNWRAP.fn(act)`
* **Description:** Unwraps a target using the unwrappable component
* **Parameters:**
  - `act` -- action object with unwrappable target
* **Returns:** bool
* **Error states:** None

### `ACTIONS.PEEKBUNDLE.fn(act)`
* **Description:** Peeks inside a bundle by opening a peek container with items
* **Parameters:**
  - `act` -- action object with bundler doer, peekable unwrappable target
* **Returns:** bool or nil
* **Error states:** nil if invalid state (fire, no bundler, etc.)

### `ACTIONS.BREAK.strfn(act)`
* **Description:** Returns 'PICKAPART' if target has 'pickapart' tag
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.CONSTRUCT.stroverridefn(act)`
* **Description:** Generates dynamic string for generic construction based on constructionname field
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.CONSTRUCT.strfn(act)`
* **Description:** Determines construction type string based on tags on target and presence of item
* **Parameters:**
  - `act` -- action object
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.CONSTRUCT.fn(act)`
* **Description:** Handles the CONSTRUCT action, validating conditions, starting construction via constructionbuilder and constructionplans components, and storing inventory items into the construction container.
* **Parameters:**
  - `act` -- action object containing doer, target, invobject; handles construction start and item placement
* **Returns:** true on success, false + reason on failure
* **Error states:** Missing doer, target, constructionbuilder; construction already in progress; cannot see target; constructionplans start failure; container full/closed/locked; talker not available for error reporting

### `ACTIONS.STOPCONSTRUCTION.stroverridefn(act)`
* **Description:** Generates an override string for the STOPCONSTRUCTION action based on the construction site's name.
* **Parameters:**
  - `act` -- action object; extracts constructionname from target for string generation
* **Returns:** formatted string or nil
* **Error states:** Missing invobject, constructionname, or name string; fallback to nil

### `ACTIONS.STOPCONSTRUCTION.strfn(act)`
* **Description:** Returns the action string key (OFFER, REPAIR, REBUILD) based on target tags.
* **Parameters:**
  - `act` -- action object; checks target tags to determine action category
* **Returns:** string key or nil
* **Error states:** None of the construction site tags present; fallback to nil

### `ACTIONS.STOPCONSTRUCTION.fn(act)`
* **Description:** Stops the active construction process on the doer's construction builder.
* **Parameters:**
  - `act` -- action object; calls StopConstruction on doer's constructionbuilder
* **Returns:** true
* **Error states:** Missing doer or constructionbuilder component

### `ACTIONS.APPLYCONSTRUCTION.strfn(act)`
* **Description:** Returns the action string key (OFFER, REPAIR, REBUILD) based on target tags.
* **Parameters:**
  - `act` -- action object; checks target tags to determine action type
* **Returns:** string key or nil
* **Error states:** None of the construction site tags present; fallback to nil

### `ACTIONS.APPLYCONSTRUCTION.fn(act)`
* **Description:** Finishes construction if the target site is being constructed by doer and its container is non-empty; otherwise, reports failure.
* **Parameters:**
  - `act` -- action object; finishes construction if container is not empty
* **Returns:** true on success or if valid but not finishable; false on error
* **Error states:** Not currently constructing target; container empty or cooking/sleepingbag in use; talker not available for error message

### `ACTIONS.CASTAOE.stroverridefn(act)`
* **Description:** Returns the spell name from the held item's spellbook for display.
* **Parameters:**
  - `act` -- action object; retrieves spell name from spellbook component
* **Returns:** spell name string or nil
* **Error states:** Missing invobject or spellbook component

### `ACTIONS.CASTAOE.strfn(act)`
* **Description:** Returns the uppercase prefab name of the action object for string lookup.
* **Parameters:**
  - `act` -- action object; uses invobject's prefab name uppercase for string key
* **Returns:** string key or nil
* **Error states:** Missing invobject component

### `ACTIONS.CASTAOE.fn(act)`
* **Description:** Casts an AoE spell using the held item's aoespell component, after validating action point and mimics.
* **Parameters:**
  - `act` -- action object; checks CanCast and casts the spell
* **Returns:** spellfn result (success, reason) or false + reason
* **Error states:** Missing spellbook, invalid CanCast; itemmimic present; invalid action point

### `ACTIONS.SCYTHE.fn(act)`
* **Description:** Triggers scythe interaction on the target using the held item's DoScythe method.
* **Parameters:**
  - `act` -- action object; calls DoScythe on held item
* **Returns:** true on success, false + 'ITEMMIMIC' if mimic is active
* **Error states:** Missing invobject or DoScythe method; itemmimic present

### `ACTIONS.NABBAG.fn(act)`
* **Description:** Performs a nab action (loot collection) using the held item's nabbag component.
* **Parameters:**
  - `act` -- action object; calls DoNabFromAct on held item
* **Returns:** true/false from DoNabFromAct, or false
* **Error states:** Missing required components or itemmimic present

### `ACTIONS.DISMANTLE.fn(act)`
* **Description:** Dismantles a portable structure after verifying it is not burning (unless campfire), not in use, not cooking, and not locked.
* **Parameters:**
  - `act` -- action object; validates dismantle conditions and calls Dismantle
* **Returns:** true on success, false + reason string
* **Error states:** Missing target, portablestructure; burning unless campfire; container open/not empty/cooking; sleepingbag in use; candismantle returns false

### `ACTIONS.TACKLE.fn(act)`
* **Description:** Triggers a tackle attempt via the doer's tackler component.
* **Parameters:**
  - `act` -- action object; calls StartTackle on doer's tackler component
* **Returns:** result of StartTackle or nil
* **Error states:** Missing doer or tackler component

### `ACTIONS.HALLOWEENMOONMUTATE.fn(act)`
* **Description:** Applies a Halloween potion moon to mutate the target, skipping burning/smoldering/frozen/flying/non-passable targets.
* **Parameters:**
  - `act` -- action object; uses potionmoon to mutate target if conditions met
* **Returns:** true if used, false if conditions not met
* **Error states:** Missing potionmoon; invalid target (burning, smoldering, frozen, non-passable)

### `ACTIONS.APPLYPRESERVATIVE.strfn(act)`
* **Description:** Returns 'SALT' only for saltrock.
* **Parameters:**
  - `act` -- action object; returns 'SALT' only for saltrock
* **Returns:** 'SALT' or nil
* **Error states:** Missing invobject or not saltrock

### `ACTIONS.APPLYPRESERVATIVE.fn(act)`
* **Description:** Applies preservative effect to a perishable item by increasing its percent, consuming the preservative.
* **Parameters:**
  - `act` -- action object; applies percent increase to perishable based on stack size and preserve effect
* **Returns:** true if used, false if conditions not met
* **Error states:** Missing target, preservative; health component present; invalid tags; inventory removal failure

### `COMPARE_WEIGHABLE_TEST(target, weighable)`
* **Description:** Checks if target and weighable share a valid trophy scale type tag.
* **Parameters:**
  - `target` -- Entity to test against TROPHYSCALE_TYPES
  - `weighable` -- Entity to test weighable types against
* **Returns:** true if matching tag found, else false
* **Error states:** None

### `ACTIONS.COMPARE_WEIGHABLE.fn(act)`
* **Description:** Compares the weight of a weighable item (held or equipped heavy body slot) to a trophy scale, updating trophy if heavier.
* **Parameters:**
  - `act` -- action object; compares held or equipped weighable item against trophy scale
* **Returns:** true if heavier/new trophy, false + reason if lighter/same; nil if missing components
* **Error states:** Missing weighable, trophy_scale, or weighable components; fire/burnt tags; no matching type tag

### `ACTIONS.WEIGH_ITEM.fn(act)`
* **Description:** Determines which entity is the weigher and which is weighable, then performs weighing via itemweigher component.
* **Parameters:**
  - `act` -- action object; finds weigher and weighable entities, then calls DoWeighIn
* **Returns:** result of DoWeighIn or false
* **Error states:** Missing weigher or weighable components; fire/burnt tags on weigher

### `ACTIONS.START_CARRAT_RACE.fn(act)`
* **Description:** Starts a Carrat race using yotc_racestart, ensuring racers exist and no fire/burnt state.
* **Parameters:**
  - `act` -- action object; starts a race if race conditions are met
* **Returns:** true on success, false + reason
* **Error states:** Missing racestart component; CanInteract returns false; race_on tag; no racers or zero racers; fire/burnt

### `ACTIONS.TILL.fn(act)`
* **Description:** Tills the ground at action point using the held item's tilling component.
* **Parameters:**
  - `act` -- action object; tills ground using farmtiller or quagmire_tiller
* **Returns:** result of Till or false
* **Error states:** Missing invobject; itemmimic present; no tilling component

### `ACTIONS.PLANTSOIL.fn(act)`
* **Description:** Removes seed from inventory, plants on soil target, returns true if successful; else returns seed to inventory.
* **Parameters:**
  - `act` -- action object; plants a seed on soil using farmplantable or quagmire_plantable
* **Returns:** true if planted successfully, else false
* **Error states:** Missing seed, inventory, or soil target; planting component missing or failure

### `ACTIONS.INSTALL.fn(act)`
* **Description:** Installs a Quagmire prefab on target or installs salt using saltextractor component.
* **Parameters:**
  - `act` -- action object; installs Quagmire installable or salt extractor components
* **Returns:** true on install success, else false
* **Error states:** Missing invobject or target; missing installable/saltextractor or target components; spawn failure

### `ACTIONS.TAPTREE.fn(act)`
* **Description:** Uninstalls existing tap if tapped, or installs tap if invobject has tapper and target is tappable.
* **Parameters:**
  - `act` -- action object; installs or uninstalls tap on tappable tree
* **Returns:** true if tapped/uninstalled, else false
* **Error states:** Missing target or tappable component; no tap or tapper

### `ACTIONS.TAPTREE.strfn(act)`
* **Description:** Returns 'UNTAP' if target is not tappable (invert logic); otherwise nil.
* **Parameters:**
  - `act` -- action object; returns 'UNTAP' if target not tappable
* **Returns:** 'UNTAP' or nil
* **Error states:** None

### `ACTIONS.SLAUGHTER.stroverridefn(act)`
* **Description:** Returns a custom slaughter action string provided by the tool.
* **Parameters:**
  - `act` -- action object; calls GetSlaughterActionString on tool if available
* **Returns:** string or nil
* **Error states:** Missing tool or method; no custom string

### `ACTIONS.SLAUGHTER.fn(act)`
* **Description:** Validates target for slaughter, checks proximity, and calls Slaughter method on tool.
* **Parameters:**
  - `act` -- action object; slaughters target if valid and tool present
* **Returns:** true on success, false + reason
* **Error states:** Missing tool, target, or tool methods; target not valid/canbeslaughtered; too far; target not dead

### `ACTIONS.REPLATE.stroververridefn(act)`
* **Description:** Generates a formatted string for the REPLATE action based on replatable prefab name.
* **Parameters:**
  - `act` -- action object; generates REPLATE string for Quagmire dishes
* **Returns:** formatted string or nil
* **Error states:** No replatable instance found; missing underscore or name string

### `ACTIONS.BATHBOMB.fn(act)`
* **Description:** Applies bathbomb effect to a bathbombable entity, consuming the bathbomb item.
* **Parameters:**
  - `act` -- action object; applies bathbomb to bathbombable entity
* **Returns:** true on success, else false
* **Error states:** Missing bathbombable or bathbomb; can_be_bathbombed false

### `ACTIONS.RAISE_SAIL.fn(act)`
* **Description:** Unfurls the mast sail on the target if the mast component exists (note: action name is backwards).
* **Parameters:**
  - `act` -- action object; unfurls the mast sail
* **Returns:** true if mast found, else false
* **Error states:** Missing target or mast component

### `ACTIONS.RAISE_SAIL.stroverridefn(act)`
* **Description:** Returns the hardcoded string reference for RAISE_SAIL action.
* **Parameters:**
  - `act` -- action object; returns hardcoded string reference
* **Returns:** STRINGS.ACTIONS.RAISE_SAIL
* **Error states:** None

### `ACTIONS.LOWER_SAIL.fn(act)`
* **Description:** Placeholder for lowering sail (action name is backwards); always returns true.
* **Parameters:**
  - `act` -- action object; placeholder that always returns true
* **Returns:** true
* **Error states:** None

### `ACTIONS.LOWER_SAIL.stroverridefn(act)`
* **Description:** Returns the hardcoded string reference for LOWER_SAIL action.
* **Parameters:**
  - `act` -- action object; returns hardcoded string reference
* **Returns:** STRINGS.ACTIONS.LOWER_SAIL
* **Error states:** None

### `ACTIONS.LOWER_SAIL_BOOST.fn(act)`
* **Description:** Adds a sail furler to the mast with strength boosted by sailor expertise and master crewman multiplier.
* **Parameters:**
  - `act` -- action object; adds sail furler with boost based on sailor strength and master crewman tag
* **Returns:** true on success, else false
* **Error states:** Missing mast or sail not raised

### `ACTIONS.LOWER_SAIL_BOOST.stroverridefn(act)`
* **Description:** Selects string index based on 'switchtoho' tag and returns from STRINGS.ACTIONS.LOWER_SAIL_BOOST.
* **Parameters:**
  - `act` -- action object; uses GetLowerSailStr helper for string selection
* **Returns:** string from array
* **Error states:** None

### `GetLowerSailStr(act)`
* **Description:** Helper function returning a string index based on 'switchtoho' tag.
* **Parameters:**
  - `act` -- action object; determines string index
* **Returns:** integer index (1 or 2)
* **Error states:** None

### `ACTIONS.LOWER_SAIL_FAIL.fn(act)`
* **Description:** Placeholder for sail lowering failure; always returns true.
* **Parameters:**
  - `act` -- action object; placeholder that always returns true
* **Returns:** true
* **Error states:** None

### `ACTIONS.LOWER_SAIL_FAIL.stroverridefn(act)`
* **Description:** Returns string from STRINGS.ACTIONS.LOWER_SAIL_BOOST via GetLowerSailStr.
* **Parameters:**
  - `act` -- action object; uses GetLowerSailStr helper
* **Returns:** string
* **Error states:** None

### `ACTIONS.RAISE_ANCHOR.fn(act)`
* **Description:** Calls AddAnchorRaiser on anchor component, returning success boolean.
* **Parameters:**
  - `act` -- action object; adds anchor raiser to anchor component
* **Returns:** true/false
* **Error states:** Missing anchor component

### `ACTIONS.LOWER_ANCHOR.fn(act)`
* **Description:** Calls StartLoweringAnchor on anchor component.
* **Parameters:**
  - `act` -- action object; starts anchor lowering
* **Returns:** true/false
* **Error states:** Missing anchor component

### `ACTIONS.MOUNT_PLANK.fn(act)`
* **Description:** Attempts to mount the doer onto the plank entity.
* **Parameters:**
  - `act` -- action object; mounts doer onto walkingplank
* **Returns:** true if mount succeeded, else false
* **Error states:** Missing plank or plank component; mount already in use

### `ACTIONS.DISMOUNT_PLANK.fn(act)`
* **Description:** Calls DismountPlank on the plank component.
* **Parameters:**
  - `act` -- action object; dismounts doer from plank
* **Returns:** true
* **Error states:** Missing plank or plank component

### `ACTIONS.ABANDON_SHIP.fn(act)`
* **Description:** Abandons the ship by calling AbandonShip on the walkingplank component.
* **Parameters:**
  - `act` -- action object; abandons ship via walkingplank
* **Returns:** true if doer matches and dismount succeeds, else false
* **Error states:** Missing plank or plank component

### `ACTIONS.EXTEND_PLANK.fn(act)`
* **Description:** Extends the plank and fires start_extending event.
* **Parameters:**
  - `act` -- action object; extends the plank
* **Returns:** true
* **Error states:** Missing plank or plank component

### `ACTIONS.RETRACT_PLANK.fn(act)`
* **Description:** Retracts the plank and fires start_retracting event.
* **Parameters:**
  - `act` -- action object; retracts the plank
* **Returns:** true
* **Error states:** Missing plank or plank component

### `ACTIONS.REPAIR_LEAK.fn(act)`
* **Description:** Repairs a boat leak using the held patch item and boatleak component.
* **Parameters:**
  - `act` -- action object; repairs a boat leak using patch item
* **Returns:** true
* **Error states:** Missing patch, target, boatleak, or boat_leak tag

### `ACTIONS.STEER_BOAT.pre_action_cb(act)`
* **Description:** Pre-action callback to close the spell wheel before steering.
* **Parameters:**
  - `act` -- action object; closes spell wheel on HUD
* **Returns:** nil
* **Error states:** Missing HUD

### `ACTIONS.STEER_BOAT.fn(act)`
* **Description:** Attaches the doer as a sailor to the steering wheel and starts steering.
* **Parameters:**
  - `act` -- action object; sets doer as steering wheel user
* **Returns:** true if set successfully, else false
* **Error states:** Missing wheel, sailor, burnable, or steeringwheeluser; wheel in use or burning

### `ACTIONS.SET_HEADING.fn(act)`
* **Description:** Calls Steer on the doer's steeringwheeluser component to set the boat heading at action point.
* **Parameters:**
  - `act` -- action object; sets boat heading via steer call
* **Returns:** true if steer succeeded, else false
* **Error states:** Missing steeringwheeluser; no position; steer returns false

### `ACTIONS.STOP_STEERING_BOAT.fn(act)`
* **Description:** Detaches the doer from the steering wheel by passing nil to SetSteeringWheel.
* **Parameters:**
  - `act` -- action object; clears steering wheel user
* **Returns:** true
* **Error states:** Missing steeringwheeluser

### `ACTIONS.CAST_NET.fn(act)`
* **Description:** Calls CastNet on the fishing net component with either action point or target position.
* **Parameters:**
  - `act` -- action object; casts the fishing net at action point or target position
* **Returns:** true
* **Error states:** Missing net or net component; itemmimic present; no valid position

### `ACTIONS.ROTATE_BOAT_CLOCKWISE.fn(act)`
* **Description:** Rotates the boat clockwise by setting rotation direction on boatrotator.
* **Parameters:**
  - `act` -- action object; sets rotation direction to 1
* **Returns:** true
* **Error states:** Missing boatrotator

### `ACTIONS.ROTATE_BOAT_COUNTERCLOCKWISE.fn(act)`
* **Description:** Rotates the boat counterclockwise by setting rotation direction on boatrotator.
* **Parameters:**
  - `act` -- action object; sets rotation direction to -1
* **Returns:** true
* **Error states:** Missing boatrotator

### `ACTIONS.ROTATE_BOAT_COUNTERCLOCKWISE.stroverridefn(act)`
* **Description:** Returns the hardcoded string reference for ROTATE_BOAT_COUNTERCLOCKWISE action.
* **Parameters:**
  - `act` -- action object; returns hardcoded string reference
* **Returns:** STRINGS.ACTIONS.ROTATE_BOAT_COUNTERCLOCKWISE
* **Error states:** None

### `ACTIONS.ROTATE_BOAT_STOP.fn(act)`
* **Description:** Stops boat rotation by setting rotation direction to zero on boatrotator.
* **Parameters:**
  - `act` -- action object; sets rotation direction to 0
* **Returns:** true
* **Error states:** Missing boatrotator

### `ACTIONS.ROTATE_BOAT_STOP.stroverridefn(act)`
* **Description:** Returns the hardcoded string reference for ROTATE_BOAT_STOP action.
* **Parameters:**
  - `act` -- action object; returns hardcoded string reference
* **Returns:** STRINGS.ACTIONS.ROTATE_BOAT_STOP
* **Error states:** None

### `ACTIONS.BOAT_MAGNET_ACTIVATE.fn(act)`
* **Description:** Starts the magnet beacon search process by transitioning to 'search_pre' state.
* **Parameters:**
  - `act` -- action object; triggers magnet search state
* **Returns:** true
* **Error states:** Missing magnet component

### `ACTIONS.BOAT_MAGNET_DEACTIVATE.fn(act)`
* **Description:** Calls UnpairWithBeacon on the magnet component to disable pairing.
* **Parameters:**
  - `act` -- action object; unpairs beacon from magnet
* **Returns:** true
* **Error states:** Missing magnet component

### `ACTIONS.BOAT_MAGNET_BEACON_TURN_ON.fn(act)`
* **Description:** Enables the magnet beacon by calling TurnOnBeacon on the beacon component.
* **Parameters:**
  - `act` -- action object; turns on beacon via boatmagnetbeacon
* **Returns:** true
* **Error states:** Missing beacon or beacon component

### `ACTIONS.BOAT_MAGNET_BEACON_TURN_OFF.fn(act)`
* **Description:** Disables the magnet beacon by calling TurnOffBeacon on the beacon component.
* **Parameters:**
  - `act` -- action object; turns off beacon via boatmagnetbeacon
* **Returns:** true
* **Error states:** Missing beacon or beacon component

### `IsBoatCannonAmmo(item)`
* **Description:** Predicate to determine if an item is valid boat cannon ammo.
* **Parameters:**
  - `item` -- item entity; checks projectileprefab and boatcannon_ammo tag
* **Returns:** true if valid ammo, else false
* **Error states:** None

### `ACTIONS.BOAT_CANNON_LOAD_AMMO.fn(act)`
* **Description:** Finds and loads cannon ammo from active item or inventory, consumes ammo, and notifies via talker.
* **Parameters:**
  - `act` -- action object; loads ammo into boat cannon
* **Returns:** true on load success, else false
* **Error states:** Missing cannon, inventory; ammo loaded; no ammo found; talker failure

### `ACTIONS.BOAT_CANNON_START_AIMING.pre_action_cb(act)`
* **Description:** Pre-action callback to close the spell wheel before aiming cannon.
* **Parameters:**
  - `act` -- action object; closes spell wheel
* **Returns:** nil
* **Error states:** Missing HUD

### `ACTIONS.BOAT_CANNON_START_AIMING.fn(act)`
* **Description:** Attaches the doer as the cannon operator and begins aiming.
* **Parameters:**
  - `act` -- action object; sets doer as cannon user
* **Returns:** true if set successfully, else false
* **Error states:** Missing cannon, operator, burnable, or cannonuser; cannon in use or burning

### `ACTIONS.BOAT_CANNON_SHOOT.fn(act)`
* **Description:** Faces the cannon at the action point, triggers 'shoot' state, and clears operator state.
* **Parameters:**
  - `act` -- action object; shoots the cannon
* **Returns:** true
* **Error states:** Missing cannonuser or cannon; invalid state

### `ACTIONS.BOAT_CANNON_STOP_AIMING.fn(act)`
* **Description:** Detaches the doer from the cannon by setting steering wheel to nil.
* **Parameters:**
  - `act` -- action object; stops aiming cannon
* **Returns:** true
* **Error states:** Missing cannonuser

### `ACTIONS.OCEAN_TRAWLER_LOWER.fn(act)`
* **Description:** Calls Lower on the oceantrawler component to start trawling.
* **Parameters:**
  - `act` -- action object; lowers the ocean trawler net
* **Returns:** true
* **Error states:** Missing oceantrawler component

### `ACTIONS.OCEAN_TRAWLER_RAISE.fn(act)`
* **Description:** Calls the oceantrawler:Raise() method on the target entity if it has the component, used to raise the trawler net.
* **Parameters:**
  - `act` -- Action object containing doer, target, and action context
* **Returns:** true
* **Error states:** None

### `ACTIONS.OCEAN_TRAWLER_FIX.fn(act)`
* **Description:** Calls the oceantrawler:Fix() method on the target entity and announces the fix using the talker component.
* **Parameters:**
  - `act` -- Action object containing doer, target, and action context
* **Returns:** true
* **Error states:** None

### `ACTIONS.GIVE_TACKLESKETCH.fn(act)`
* **Description:** Teaches a tackle sketch recipe to a crafting station if not already known, checking for burn status and item mimicry.
* **Parameters:**
  - `act` -- Action object containing doer, target, and invobject (tackle sketch)
* **Returns:** true/false, reason
* **Error states:** Returns 'DUPLICATE' if crafting station already knows the recipe; 'ITEMMIMIC' if item is mimic; returns false if conditions not met

### `ACTIONS.REMOVE_FROM_TROPHYSCALE.fn(act)`
* **Description:** Removes and gives an item from the trophy scale if conditions are met, using optional takeitemtestfn validation.
* **Parameters:**
  - `act` -- Action object containing doer and target (trophy scale)
* **Returns:** true/false, reason
* **Error states:** Returns false if target is burnt or on fire, lacks trophiescale component, or doesn't have 'trophycanbetaken' tag

### `ACTIONS.CYCLE.strfn(act)`
* **Description:** Returns 'TUNE' string action label if target is a singingshell, otherwise nil.
* **Parameters:**
  - `act` -- Action object containing target (singingshell)
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.CYCLE.fn(act)`
* **Description:** Cycles through states on a cyclable entity if cancycle allows.
* **Parameters:**
  - `act` -- Action object containing doer and target (cyclable entity)
* **Returns:** true/false
* **Error states:** Returns false if cyclable component missing or cancycle returns false

### `ACTIONS.OCEAN_TOSS.fn(act)`
* **Description:** Drops an item from inventory, adds ocean projectile behavior, and launches it toward a target or action point.
* **Parameters:**
  - `act` -- Action object containing doer, invobject (item), and optional target
* **Returns:** true/false, reason
* **Error states:** Returns 'ITEMMIMIC' if item is mimic; false if item missing, inventory invalid, or launching fails

### `ACTIONS.WINTERSFEAST_FEAST.fn(act)`
* **Description:** Placeholder action handler; actual logic is handled in the stategraph.
* **Parameters:**
  - `act` -- Action object (not actually used in this function)
* **Returns:** true
* **Error states:** None

### `ACTIONS.BEGIN_QUEST.fn(act)`
* **Description:** Attempts to begin a quest on a quest owner entity, checking CanBeginQuest and calling BeginQuest.
* **Parameters:**
  - `act` -- Action object containing doer and target (quest owner)
* **Returns:** success (boolean), message (string or nil)
* **Error states:** Returns false if questowner component missing

### `ACTIONS.ABANDON_QUEST.fn(act)`
* **Description:** Attempts to abandon a quest on a quest owner if abandonment is allowed.
* **Parameters:**
  - `act` -- Action object containing doer and target (quest owner)
* **Returns:** success (boolean), message (string or nil)
* **Error states:** Returns false if questowner component missing or CanAbandonQuest returns false

### `ACTIONS.SING.fn(act)`
* **Description:** Attempts to add and sing a song if allowed by inspiration constraints and song data.
* **Parameters:**
  - `act` -- Action object containing doer, invobject (song item), and singinginspiration component
* **Returns:** true/false
* **Error states:** Returns false if singinginspiration component missing, songdata nil, or cannot add song

### `ACTIONS.SING_FAIL.fn(act)`
* **Description:** Stub for singing failure action, always returns true.
* **Parameters:**
  - `act` -- Action object
* **Returns:** true
* **Error states:** None

### `ACTIONS.SING_FAIL.stroverridefn(act)`
* **Description:** Returns the standard SING action string for failure case.
* **Parameters:**
  - `act` -- Action object
* **Returns:** STRINGS.ACTIONS.SING
* **Error states:** None

### `ACTIONS.REPLATE.fn(act)`
* **Description:** Replaces a dish on a plate with another dish type using Quagmire replating system, handling both ground and inventory cases.
* **Parameters:**
  - `act` -- Action object containing doer, target, and invobject (replater)
* **Returns:** true/false, reason
* **Error states:** Returns 'MISMATCH' or 'SAMEDISH' if dish type conflicts; false if missing components

### `ACTIONS.SALT.fn(act)`
* **Description:** Salts a food plate by replacing it with a new salted version, handling both inventory and ground cases.
* **Parameters:**
  - `act` -- Action object containing doer, target (food plate), and invobject (salt item)
* **Returns:** true/false
* **Error states:** Returns false if target missing quagmire_saltable component

### `ACTIONS.UNPATCH.fn(act)`
* **Description:** Unpatches a boat by restoring the leak state and optionally spawning repair materials.
* **Parameters:**
  - `act` -- Action object containing doer and target (leaky boat)
* **Returns:** true/false
* **Error states:** Returns false if target missing boatleak component

### `ACTIONS.POUR_WATER.fn(act)`
* **Description:** Spreads water protection on a target or ground point using wateryprotection component.
* **Parameters:**
  - `act` -- Action object containing doer and invobject (water source)
* **Returns:** true/false, reason
* **Error states:** Returns 'ITEMMIMIC' if item is mimic; 'OUT_OF_WATER' if uses exhausted

### `ACTIONS.POUR_WATER.strfn(act)`
* **Description:** Returns 'EXTINGUISH' action string if target is on fire or smoldering.
* **Parameters:**
  - `act` -- Action object containing target (fire/smolder entity)
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.PLANTREGISTRY_RESEARCH_FAIL.fn(act)`
* **Description:** Handles failed plant/fertilizer research attempts.
* **Parameters:**
  - `act` -- Action object containing target or invobject
* **Returns:** false, reason
* **Error states:** Returns 'ITEMMIMIC' or 'FERTILIZER' (fertilizer research only available via separate action)

### `ACTIONS.PLANTREGISTRY_RESEARCH.fn(act)`
* **Description:** Attempts to research a plant or fertilizer, announcing results via talker component.
* **Parameters:**
  - `act` -- Action object containing target or invobject (plant/fertilizer)
* **Returns:** true/false, reason
* **Error states:** Returns 'ITEMMIMIC' if item is mimic; false if no researchable components

### `ACTIONS.ASSESSPLANTHAPPINESS.stroverridefn(act)`
* **Description:** Returns a formatted string describing assessment of plant happiness.
* **Parameters:**
  - `act` -- Action object containing target or invobject (plant)
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.ASSESSPLANTHAPPINESS.fn(act)`
* **Description:** Assesses plant stress level and speaks a description using talker if available.
* **Parameters:**
  - `act` -- Action object containing doer and target or invobject (plant)
* **Returns:** true/false, reason
* **Error states:** Returns 'ITEMMIMIC' if item is mimic; false if target missing

### `ACTIONS.PLANTWEED.fn(act)`
* **Description:** Spawns a random weed type on a soil entity and removes the soil.
* **Parameters:**
  - `act` -- Action object containing target (soil) and invobject
* **Returns:** true
* **Error states:** None

### `ACTIONS.ADDCOMPOSTABLE.fn(act)`
* **Description:** Adds an item to the composting bin.
* **Parameters:**
  - `act` -- Action object containing doer, target (composting bin), and invobject (compostable item)
* **Returns:** result from AddCompostable() (boolean)
* **Error states:** None

### `ACTIONS.WAX.fn(act)`
* **Description:** Applies wax to a target using the waxable component.
* **Parameters:**
  - `act` -- Action object containing doer, target (waxable entity), and invobject (wax item)
* **Returns:** result, reason (boolean/string)
* **Error states:** Returns 'ITEMMIMIC' if item is mimic; false if target missing waxable component

### `ACTIONS.UNLOAD_WINCH.fn(act)`
* **Description:** Calls the custom unloadfn on a winch component if available.
* **Parameters:**
  - `act` -- Action object containing target (winch)
* **Returns:** result of unloadfn or false
* **Error states:** Returns false if winch or unloadfn missing

### `ACTIONS.USE_HEAVY_OBSTACLE.strfn(act)`
* **Description:** Returns the string key from target.use_heavy_obstacle_string_key for the action label.
* **Parameters:**
  - `act` -- Action object containing target (heavy obstacle)
* **Returns:** string or nil
* **Error states:** None

### `ACTIONS.USE_HEAVY_OBSTACLE.fn(act)`
* **Description:** Uses the heavy obstacle currently equipped by the doer on the target if conditions are met.
* **Parameters:**
  - `act` -- Action object containing doer and target (heavy obstacle)
* **Returns:** result from UseHeavyObstacle or false
* **Error states:** Returns false if no heavy item equipped, target lacks 'can_use_heavy' tag, or filter fails

### `ACTIONS.YOTB_SEW.fn(act)`
* **Description:** Starts or continues a sewing task on a sewing machine using the YOTB_sewer component.
* **Parameters:**
  - `act` -- Action object containing doer and target (sewing machine)
* **Returns:** true/false, reason
* **Error states:** Returns 'INUSE' if machine in use by another player; false if conditions not met

### `ACTIONS.YOTB_STARTCONTEST.fn(act)`
* **Description:** Starts a YOTB contest if conditions are met (not active, host visible, etc.).
* **Parameters:**
  - `act` -- Action object containing doer and target (host)
* **Returns:** true/false, reason
* **Error states:** Returns 'DOESNTWORK', 'ALREADYACTIVE', 'RIGHTTHERE', or 'NORESPONSE' based on contest state

### `ACTIONS.YOTB_UNLOCKSKIN.fn(act)`
* **Description:** Unlocks a skin using the Y
`<`/output>

## Events & listeners
This file is not event-driven.
