---
id: componentactions
title: Componentactions
description: This file defines the COMPONENT_ACTIONS table mapping component names to action functions, along with helper functions for fishing, rowing, plant research, target validation, and entity action component management in Don't Starve Together.
tags: [actions, components, player, interaction, system]
sidebar_position: 10

last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: root
source_hash: 8c337571
system_scope: entity
---

# Componentactions

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`componentactions.lua` is a core system file that defines the global `COMPONENT_ACTIONS` table, which maps component names to action handler functions for all player interaction types in Don't Starve Together. Other systems access this module via `require 'componentactions'` to use the `COMPONENT_ACTIONS` table and helper functions. It provides the action resolution framework that the game uses to determine which actions are available when a player interacts with entities, items, or the environment. The system supports various action types and allows mod-specific action registration. Helper functions handle specialized contexts like fishing, rowing, plant research, and target validation. EntityScript methods `RegisterComponentActions`, `UnregisterComponentActions`, `CollectActions`, `IsActionValid`, and `HasActionComponent` allow entities to manage their available actions dynamically.
## Usage example
```lua
-- Modders can register custom component actions for existing action types
local function CustomAction(inst, doer, actions)
    if inst:HasTag("custom_interactable") then
        table.insert(actions, ACTIONS.INTERACT)
    end
end

-- Register the action handler (typically in modmain.lua)
AddComponentAction("INTERACT", "mycomponent", CustomAction, "mymod")

-- Component scripts register their action components on entities
-- This is called automatically when components are added to entities
-- Example: inventoryitem component registers actions in its OnAddedToEntity callback

-- Check if entity supports specific action components
local inst = ThePlayer
if inst:HasActionComponent("container") then
    -- Entity supports container interactions
    inst.components.container:Open()
end

-- Validate if an action is currently valid for an entity
-- Second parameter is boolean for right-click context (true = right-click, false = left-click)
if inst:IsActionValid(ACTIONS.HARVEST, true) then
    -- Action can be performed
end
```
## Dependencies & tags
**External dependencies:**
- `util` -- Required module for utility functions
- `vecutil` -- Required module for vector math operations (VecUtil_LengthSq, VecUtil_Normalize, VecUtil_Dist)
- `TheWorld` -- Accessed for Map:IsOceanAtPoint(), Map:GetPlatformAtPoint(), Map:IsVisualGroundAtPoint()
- `ThePlayer` -- Compared against doer to determine test_length for row action
- `TheNet` -- Called via TheNet:IsDedicated() to check server type
- `ThePlantRegistry` -- Called via :KnowsPlantStage() and :KnowsFertilizer() for research state
- `ACTIONS` -- Global actions table referenced for all action types (ROW, ATTACK, HARVEST, etc.)
- `CLIENT_REQUESTED_ACTION` -- Global variable for client-requested action state
- `TUNING` -- Accessed for TUNING.OVERRIDE_ROW_ACTION_DISTANCE and TUNING.KITCOON_NEAR_DEN_DIST constants
- `EQUIPSLOTS` -- Accessed for EQUIPSLOTS.HANDS and EQUIPSLOTS.BODY slot references
- `CONTROL_FORCE_STACK` -- Control constant for force stack input check
- `FindVirtualOceanEntity` -- Global function to find ocean entities at point
- `FindEntity` -- Global function to find entities by distance and tags
- `IsInValidHermitCrabDecorArea` -- Global function to check hermit crab decor area validity
- `IsFlyingPermittedFromPoint` -- Global function to check flight permission at position
- `IsEntityDead` -- Global function to check if entity is dead
- `TROPHYSCALE_TYPES` -- Table iterated for trophy scale type matching
- `FOODGROUP` -- Table iterated for food group eater type matching
- `FOODTYPE` -- Table iterated for food type eater matching
- `SPECIAL_EVENTS` -- References YOTB event constant
- `IsSpecialEventActive` -- Function called to check if YOTB event is active
- `PlantRegistryResearch` -- Function called for plant research interactions
- `FORGEMATERIALS` -- Iterated in forgerepair function for material tag matching
- `FUELTYPE` -- Iterated in fuel function for fuel type tag matching
- `LOCKTYPE` -- Iterated in key function for lock type matching
- `OCCUPANTTYPE` -- Iterated in occupier function for occupant type matching
- `MATERIALS` -- Iterated in repairer function for material type matching
- `TOOLACTIONS` -- Iterated in tool function for tool action types
- `UPGRADETYPES` -- Iterated in upgrader function for upgrade type matching
- `AllRecipes` -- Accessed in recipescanner function for recipe lookup
- `GetValidRecipe` -- Called in recipescanner function to validate recipes
- `FunctionOrValue` -- Called in recipescanner function for deconstruction check
- `GetGameModeProperty` -- Called in inventoryitem function for game mode property checks
- `TheInput` -- Referenced via connected playercontroller.lua for IsControlPressed
- `SPELLTYPES` -- Global table for spell type validation
- `GLOBAL` -- Implicit global context for helper functions like CanCastFishingNetAtPoint
- `orderedPairs` -- Used to iterate COMPONENT_ACTIONS table in RemapComponentActions
- `dumptable` -- Used in ModComponentWarning to print table contents
- `IsValidScytheTarget` -- Called by pickable ISVALID function
- `CONTROL_FORCE_INSPECT` -- Referenced in magiciantool function for control check
- `EntityScript` -- RegisterComponentActions method defined on EntityScript prototype
- `ACTION_COMPONENT_IDS` -- Global table mapping component names to numeric IDs for lookup
- `ACTION_COMPONENT_NAMES` -- Global table mapping component IDs back to names for collector/validator lookup
- `COMPONENT_ACTIONS` -- Global table containing action collectors and validators organized by action type
- `CheckModComponentIds` -- Function to retrieve mod-specific component ID mappings
- `CheckModComponentActions` -- Function to retrieve mod-specific action component tables
- `CheckModComponentNames` -- Function to retrieve mod-specific component name mappings

**Components used:**
- `attuner` -- Called via doer.components.attuner:IsAttunedTo() to check attunement state
- `boatringdata` -- Called via boat.components.boatringdata:GetRadius() and :IsRotating() for boat rotation state
- `constructionbuilderuidata` -- Called via doer.components.constructionbuilderuidata:GetContainer() to check container match
- `container_proxy` -- Called via inst.components.container_proxy:CanBeOpened() to check openability
- `floater` -- Called via inst.components.floater:IsFloating() to check if entity is floating
- `playercontroller` -- Called via doer.components.playercontroller.isclientcontrollerattached, :HasAOETargeting(), and :IsControlPressed()
- `skilltreeupdater` -- Called via doer.components.skilltreeupdater:IsActivated() to check skill activation
- `revivablecorpse` -- Calls CanBeRevivedBy method to check if corpse can be revived
- `spellbook` -- Calls CanBeUsedBy method to check if spellbook can be used
- `snowmandecoratable` -- Checks if equipped item has snowmandecoratable component
- `container` -- Accesses replica.container for inventory and opening state checks
- `inventory` -- Accesses replica.inventory for item checks and heavy lifting state
- `rider` -- Accesses replica.rider for mount state and riding checks
- `inventoryitem` -- Accesses replica.inventoryitem for ownership and held state
- `health` -- Checks CanHeal method for self-fertilization
- `fishingrod` -- Checks HasCaughtFish and GetTarget methods
- `pumpkincarvable` -- Checked via target.components.pumpkincarvable in pumpkincarver function
- `pumpkinhatcarvable` -- Checked via target.components.pumpkinhatcarvable in pumpkincarver function
- `constructionsite` -- Accessed via target.replica.constructionsite for build state checks
- `stackable` -- Accessed via inst.replica.stackable and target.replica.stackable for stack operations
- `equippable` -- Accessed via inst.replica.equippable and target.replica.equippable for equip restrictions
- `follower` -- Accessed via target.replica.follower for leader checks in summoningitem
- `builder` -- Accessed via target.replica.builder in teacher function
- `aoetargeting` -- Accessed via inst.components.aoetargeting for spell validation
- `combat` -- Accessed via replica.combat for targeting validation
- `oceanfishingrod` -- Accessed via replica.oceanfishingrod for fishing state
- `containerinstallableitem` -- Accessed via inst.components.containerinstallableitem:GetValidOpenContainer()
- `singinginspiration` -- Accessed via doer.components.singinginspiration:IsSongActive()
- `actionreplica` -- Accessed via self.actionreplica to sync network state when action components are unregistered

**Tags:**
- `boat` -- check
- `is_row_failing` -- check
- `is_rowing` -- check
- `plantinspector` -- check
- `plantkin` -- check
- `plantresearchable` -- check
- `fertilizerresearchable` -- check
- `farmplantstress` -- check
- `weedplantstress` -- check
- `fishing_idle` -- check
- `projectile` -- check
- `oceanfishing_catchable` -- check
- `fishinghook` -- check
- `overriderowaction` -- check
- `plant` -- check
- `lichen` -- check
- `oceanvine` -- check
- `kelp` -- check
- `kitcoonden` -- check
- `inactive` -- check
- `engineering` -- check
- `portableengineer` -- check
- `activatable_forceright` -- check
- `smolder` -- check
- `fire` -- check
- `burnt` -- check
- `anchor_raised` -- check
- `anchor_transitioning` -- check
- `battery` -- check
- `batteryuser` -- check
- `paired` -- check
- `turnedoff` -- check
- `occupied` -- check
- `ammoloaded` -- check
- `channelable` -- check
- `channeling` -- check
- `channeled` -- check
- `cancatch` -- check
- `bundle` -- check
- `oceantrawler` -- check
- `trawler_lowered` -- check
- `noabandon` -- check
- `readyforharvest` -- check
- `withered` -- check
- `cancycle` -- check
- `dried` -- check
- `fully_electrically_linked` -- check
- `is_electrically_linked` -- check
- `tendable_farmplant` -- check
- `mime` -- check
- `groomer` -- check
- `hitcher` -- check
- `harvestable` -- check
- `haunted` -- check
- `catchable` -- check
- `heavy` -- check
- `can_use_heavy` -- check
- `hitcher_locked` -- check
- `spider` -- check
- `spiderwhisperer` -- check
- `heavylift_lmb` -- check
- `inventoryitemholder_take` -- check
- `near_kitcoonden` -- check
- `unlockable` -- check
- `cooldown` -- check
- `fueldepleted` -- check
- `alwayson` -- check
- `emergency` -- check
- `enabled` -- check
- `groundonlymachine` -- check
- `turnedon` -- check
- `readytocook` -- check
- `usingmagiciantool` -- check
- `mapscout` -- check
- `markable` -- check
- `markable_proxy` -- check
- `sailraised` -- check
- `is_furling` -- check
- `saillowered` -- check
- `sail_transitioning` -- check
- `player` -- check
- `strongman` -- check
- `hasstrongman` -- check
- `loaded` -- check
- `minesprung` -- check
- `mine_not_reusable` -- check
- `reader` -- check
- `controlled_burner` -- check
- `stokeablefire` -- check
- `pickable` -- check
- `campfire` -- check
- `idle` -- check
- `moving` -- check
- `lighter` -- check
- `wendy_lunar_3` -- check
- `trawler_fish_escaped` -- check
- `pinned` -- check
- `intense` -- check
- `portable_campfire` -- check
- `portable_campfire_user` -- check
- `mastercookware` -- check
- `masterchef` -- check
- `rideable` -- check
- `hitched` -- check
- `dogrider_only` -- check
- `dogrider` -- check
- `woby` -- check
- `searchable` -- check
- `takeshelfitem` -- check
- `cansit` -- check
- `insomniac` -- check
- `hassleeper` -- check
- `spiderden` -- check
- `waxedplant` -- check
- `donecooking` -- check
- `stageactingprop` -- check
- `stageactor` -- check
- `play_in_progress` -- check
- `storytellingprop` -- check
- `storyteller` -- check
- `maxwellnottalking` -- check
- `teleporter` -- check
- `townportal` -- check
- `vault_teleporter` -- check
- `trapsprung` -- check
- `trophyscale_` -- check
- `weighable_` -- check
- `trophycanbetaken` -- check
- `unwrappable` -- check
- `on_walkable_plank` -- check
- `interactable` -- check
- `plank_extended` -- check
- `wardrobe` -- check
- `dressable` -- check
- `writeable` -- check
- `migrator` -- check
- `readyforfeast` -- check
- `has_whistle_action` -- check
- `yotb_conteststartable` -- check
- `has_prize` -- check
- `has_no_prize` -- check
- `race_on` -- check
- `readytosew` -- check
- `appraiser` -- check
- `canbait` -- check
- `bathbomb` -- check
- `bathbombable` -- check
- `bedazzleable` -- check
- `bedazzled` -- check
- `boat_patch` -- check
- `boat_leak` -- check
- `canbebottled` -- check
- `brushable` -- check
- `carnivalgame_canfeed` -- check
- `cooker` -- check
- `dangerouscooker` -- check
- `expertchef` -- check
- `cookable` -- check
- `playingcard` -- check
- `deckcontainer` -- check
- `drawable` -- check
- `candry` -- check
- `dryable` -- check
- `critter` -- check
- `handfed` -- check
- `wereplayer` -- check
- `strongstomach` -- check
- `monstermeat` -- check
- `spoiled` -- check
- `ignoresspoilage` -- check
- `badfood` -- check
- `unsafefood` -- check
- `possessedbody` -- check
- `small_livestock` -- check
- `compostingbin_accepts_items` -- check
- `papereraser` -- check
- `soil` -- check
- `NOCLICK` -- check
- `fertile` -- check
- `infertile` -- check
- `barren` -- check
- `fertilizable` -- check
- `self_fertilizable` -- check
- `watersource` -- check
- `fishable` -- check
- `notreadyforharvest` -- check
- `fishing` -- check
- `questing` -- check
- `corpse` -- check
- `forgerepair_` -- check
- `forgerepairable_` -- check
- `quagmire_stewable` -- check
- `quagmire_stewer` -- check
- `_fuel` -- check
- `_fueled` -- check
- `furnituredecortaker` -- check
- `elixir_drinker` -- check
- `gravediggable` -- check
- `gravedigger_user` -- check
- `DECOR` -- check
- `healerbuffs` -- check
- `no_container_store` -- check
- `playerghost` -- check
- `reviver` -- check
- `alltrader` -- check
- `ghost` -- check
- `boatcannon_ammo` -- check
- `boatcannon` -- check
- `inventoryitemholder_give` -- check
- `_lock` -- check
- `_key` -- check
- `klaussacklock` -- check
- `klaussackkey` -- check
- `canlight` -- check
- `burnableignorefuel` -- check
- `INLIMBO` -- check
- `moontrader` -- check
- `_occupiable` -- check
- `fullfertile` -- check
- `playbill_lecturn` -- check
- `pocketwatch_inactive` -- check
- `pocketwatchcaster` -- check
- `pocketwatch_mountedcast` -- check
- `clockmaker` -- check
- `pocketwatch` -- check
- `fresh` -- check
- `stale` -- check
- `deployable` -- check
- `smallcreature` -- check
- `installations` -- check
- `quagmire_altar` -- check
- `quagmire_replater` -- check
- `quagmire_replatable` -- check
- `quagmire_saltable` -- check
- `saltpond` -- check
- `canbeslaughtered` -- check
- `quagmire_cookwaretrader` -- check
- `tappable` -- check
- `repairable_` -- check
- `work_` -- check
- `health_` -- check
- `freshen_` -- check
- `finiteuses_` -- check
- `workrepairable` -- check
- `healthrepairable` -- check
- `finiteusesrepairable` -- check
- `saddleable` -- check
- `needssewing` -- check
- `bearded` -- check
- `canpeek` -- check
- `souleater` -- check
- `abigail` -- check
- `ghostfriend_summoned` -- check
- `tacklestation` -- check
- `trader` -- check
- `tree` -- check
- `monster` -- check
- `stump` -- check
- `leif` -- check
- `no_force_grow` -- check
- `saddled` -- check
- `_upgrader` -- check
- `_upgradeuser` -- check
- `_upgradeable` -- check
- `inuse_targeted` -- check
- `useabletargeteditem_mounted` -- check
- `vase` -- check
- `vasedecoration` -- check
- `fillable` -- check
- `waxable` -- check
- `needswaxspray` -- check
- `waxspray` -- check
- `LunarBuildup` -- check
- `MINE_tool` -- check
- `BURNABLE_fueled` -- check
- `BURNABLE_fuel` -- check
- `structure` -- check
- `winter_treestand` -- check
- `rangedweapon` -- check
- `outofammo` -- check
- `tranquilizer` -- check
- `sleeper` -- check
- `nolight` -- check
- `steeringboat` -- check
- `rotatingboat` -- check
- `complexprojectile_showoceanaction` -- check
- `tile_deploy` -- check
- `boatbuilder` -- check
- `fillable_showoceanaction` -- check
- `castonpointwater` -- check
- `castonpoint` -- check
- `crushitemcast` -- check
- `plow` -- check
- `nohighlight` -- check
- `rotatableobject` -- check
- `faced_chair` -- check
- `gestaltcapturable` -- check
- `moonstormstaticcapturable` -- check
- `_container` -- check
- `handyperson` -- check
- `nomagic` -- check
- `castontargets` -- check
- `castonrecipes` -- check
- `castonlocomotors` -- check
- `castonlocomotorspvp` -- check
- `castonworkable` -- check
- `CHOP_workable` -- check
- `DIG_workable` -- check
- `HAMMER_workable` -- check
- `MINE_workable` -- check
- `castoncombat` -- check
- `wall` -- check
- `mustforceattack` -- check
- `mole` -- check
- `hammer` -- check
- `edible` -- check
- `fertilizer` -- check
- `elixirbrewer` -- check
- `magician` -- check
- `lifting` -- check
- `accepts_oceanfishingtackle` -- check
- `pocketwatch_castfrominventory` -- check
- `battlesinger` -- check
- `castfrominventory` -- check
- `spellcaster` -- check
- `spelluser` -- check
- `ghostfriend_notsummoned` -- check
- `upgrademoduleowner` -- check
- `inspectingupgrademodules` -- check
- `equipped_and_inuse` -- check
- `inuse` -- check
- `cannotuse` -- check
- `useabletargeteditem_inventorydisable` -- check
- `useabletargateditem_canselftarget` -- check
- `targeter` -- check
- `workable` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SCYTHE_ONEOFTAGS` | table | `{"plant", "lichen", "oceanvine", "kelp"}` | Tags used for scythe targeting |
| `KITCOON_MUST_TAGS` | table | `{"kitcoonden"}` | Required tags for kitcoonden detection |
| `COMPONENT_ACTIONS` | table | `{}` | Component actions mapping |
| `ACTION_COMPONENT_NAMES` | table | `{}` | Mapping of action component names |
| `ACTION_COMPONENT_IDS` | table | `{}` | Mapping of action component IDs |
| `MOD_COMPONENT_ACTIONS` | table | `{}` | Mod component actions mapping |
| `MOD_ACTION_COMPONENT_NAMES` | table | `{}` | Mod action component names mapping |
| `MOD_ACTION_COMPONENT_IDS` | table | `{}` | Mod action component IDs mapping |
## Main functions
### `activatable(inst, doer, actions, right)`
* **Description:** Determines ACTIVATE action availability based on inactive tag, engineering/portableengineer tags, and fire/smolder state.
* **Parameters:**
  - `inst` -- Entity with activatable component
  - `doer` -- Player entity attempting activation
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `anchor(inst, doer, actions, right)`
* **Description:** Determines RAISE_ANCHOR or LOWER_ANCHOR actions based on anchor_raised and anchor_transitioning tags.
* **Parameters:**
  - `inst` -- Entity with anchor component
  - `doer` -- Player entity interacting with anchor
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `attunable(inst, doer, actions)`
* **Description:** Checks if doer has attuner component and is not already attuned to inst, then adds ATTUNE action.
* **Parameters:**
  - `inst` -- Entity with attunable component
  - `doer` -- Player entity attempting to attune
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `bathingpool(inst, doer, actions)`
* **Description:** Always adds SOAKIN action for bathing pool interaction.
* **Parameters:**
  - `inst` -- Entity with bathingpool component
  - `doer` -- Player entity attempting to bathe
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `battery(inst, doer, actions)`
* **Description:** Adds CHARGE_FROM action if inst has battery tag and doer has batteryuser tag.
* **Parameters:**
  - `inst` -- Entity with battery component
  - `doer` -- Player entity attempting to charge
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `boatmagnet(inst, doer, actions, right)`
* **Description:** Determines BOAT_MAGNET_ACTIVATE or BOAT_MAGNET_DEACTIVATE based on paired tag and fire/burnt state.
* **Parameters:**
  - `inst` -- Entity with boatmagnet component
  - `doer` -- Player entity interacting with magnet
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `boatmagnetbeacon(inst, doer, actions, right)`
* **Description:** Adds BOAT_MAGNET_BEACON_TURN_ON or BOAT_MAGNET_BEACON_TURN_OFF on right-click based on turnedoff and paired tags.
* **Parameters:**
  - `inst` -- Entity with boatmagnetbeacon component
  - `doer` -- Player entity interacting with beacon
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `boatcannon(inst, doer, actions, right)`
* **Description:** Determines BOAT_CANNON_START_AIMING if ammo loaded, or BOAT_CANNON_LOAD_AMMO on right-click.
* **Parameters:**
  - `inst` -- Entity with boatcannon component
  - `doer` -- Player entity operating cannon
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `boatrotator(inst, doer, actions, right)`
* **Description:** Checks boat platform and boatringdata component to determine ROTATE_BOAT_STOP, ROTATE_BOAT_CLOCKWISE, or ROTATE_BOAT_COUNTERCLOCKWISE actions.
* **Parameters:**
  - `inst` -- Entity with boatrotator component
  - `doer` -- Player entity rotating boat
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `book(inst, doer, actions)`
* **Description:** Adds READ action if doer has reader tag and book is not on fire or smoldering.
* **Parameters:**
  - `inst` -- Entity with book component
  - `doer` -- Player entity attempting to read
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `burnable(inst, doer, actions, right)`
* **Description:** Adds SMOTHER action if smoldering, or STOKEFIRE on right-click if doer has controlled_burner tag and inst has stokeablefire tag.
* **Parameters:**
  - `inst` -- Entity with burnable component
  - `doer` -- Player entity interacting with fire
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `bundlemaker(inst, doer, actions, right)`
* **Description:** Adds BUNDLE action on right-click.
* **Parameters:**
  - `inst` -- Entity with bundlemaker component
  - `doer` -- Player entity using bundlemaker
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `catcher(inst, doer, actions)`
* **Description:** Adds CATCH action if inst has cancatch tag.
* **Parameters:**
  - `inst` -- Entity with catcher component
  - `doer` -- Player entity attempting to catch
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `channelable(inst, doer, actions, right)`
* **Description:** Adds STOPCHANNELING if doer is channeling, or STARTCHANNELING if inst is not channeled (right-click only).
* **Parameters:**
  - `inst` -- Entity with channelable component
  - `doer` -- Player entity channeling
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `combat(inst, doer, actions, right)`
* **Description:** Adds ATTACK action on left-click if doer can attack, inst is not dead, and combat component allows attack.
* **Parameters:**
  - `inst` -- Entity with combat component
  - `doer` -- Player entity attacking
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `constructionsite(inst, doer, actions, right)`
* **Description:** Determines CONSTRUCT or STOPCONSTRUCTION action based on builder status and controller attachment. Returns early if pickable tag present on left-click.
* **Parameters:**
  - `inst` -- Entity with constructionsite component
  - `doer` -- Player entity building
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `container(inst, doer, actions, right)`
* **Description:** Handles bundle wrapping, APPLYCONSTRUCTION, or RUMMAGE actions based on container state, doer inventory, and rider status.
* **Parameters:**
  - `inst` -- Entity with container component
  - `doer` -- Player entity accessing container
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `container_proxy(inst, doer, actions)`
* **Description:** Adds RUMMAGE action if container can be opened, not burnt, doer has inventory, and doer is not riding.
* **Parameters:**
  - `inst` -- Entity with container_proxy component
  - `doer` -- Player entity accessing proxy container
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `crittertraits(inst, doer, actions, right)`
* **Description:** Handles PET, TRANSFER_CRITTER, or ABANDON actions based on follower relationship, tech trees, and location validity.
* **Parameters:**
  - `inst` -- Entity with crittertraits component
  - `doer` -- Player entity interacting with critter
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `crop(inst, doer, actions)`
* **Description:** Adds HARVEST action if crop is readyforharvest or withered and doer has inventory.
* **Parameters:**
  - `inst` -- Entity with crop component
  - `doer` -- Player entity harvesting
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `cyclable(inst, doer, actions, right)`
* **Description:** Adds CYCLE action on right-click if inst has cancycle tag.
* **Parameters:**
  - `inst` -- Entity with cyclable component
  - `doer` -- Player entity cycling
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `deckcontainer(inst, doer, actions, right)`
* **Description:** Adds DRAW_FROM_DECK action on right-click.
* **Parameters:**
  - `inst` -- Entity with deckcontainer component
  - `doer` -- Player entity drawing from deck
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `dryer(inst, doer, actions)`
* **Description:** Adds HARVEST action if inst has dried tag and is not burnt.
* **Parameters:**
  - `inst` -- Entity with dryer component
  - `doer` -- Player entity harvesting dried item
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `electricconnector(inst, doer, actions, right)`
* **Description:** Adds STARTELECTRICLINK on left-click if not fully linked, or ENDELECTRICLINK on right-click if currently linked.
* **Parameters:**
  - `inst` -- Entity with electricconnector component
  - `doer` -- Player entity managing electric link
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `farmplanttendable(inst, doer, actions, right)`
* **Description:** Adds INTERACT_WITH action if inst has tendable_farmplant tag, is not on fire/smoldering, and doer is not a mime.
* **Parameters:**
  - `inst` -- Entity with farmplanttendable component
  - `doer` -- Player entity tending plant
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `fertilizerresearchable(inst, doer, actions, right)`
* **Description:** Calls PlantRegistryResearch helper function on right-click.
* **Parameters:**
  - `inst` -- Entity with fertilizerresearchable component
  - `doer` -- Player entity researching fertilizer
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `grabbable(inst, doer, actions, right)`
* **Description:** Deprecated component. No actions added. Use inventoryitem.grabbableoverridetag instead.
* **Parameters:**
  - `inst` -- Entity with grabbable component
  - `doer` -- Player entity attempting to grab
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `groomer(inst, doer, actions, right)`
* **Description:** Adds CHANGEIN action on right-click if inst has groomer tag and is not fire/burnt/hitcher.
* **Parameters:**
  - `inst` -- Entity with groomer component
  - `doer` -- Player entity grooming
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `harvestable(inst, doer, actions)`
* **Description:** Adds HARVEST action if inst has harvestable tag.
* **Parameters:**
  - `inst` -- Entity with harvestable component
  - `doer` -- Player entity harvesting
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `hauntable(inst, doer, actions)`
* **Description:** Adds HAUNT action if inst does not have haunted or catchable tags.
* **Parameters:**
  - `inst` -- Entity with hauntable component
  - `doer` -- Player entity haunting
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `heavyobstacleusetarget(inst, doer, actions, right)`
* **Description:** Adds USE_HEAVY_OBSTACLE action on right-click if doer has heavy equipped item and inst has can_use_heavy tag.
* **Parameters:**
  - `inst` -- Entity with heavyobstacleusetarget component
  - `doer` -- Player entity using heavy obstacle
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `hideandseekhidingspot(inst, doer, actions, right)`
* **Description:** Adds HIDEANSEEK_FIND action on right-click.
* **Parameters:**
  - `inst` -- Entity with hideandseekhidingspot component
  - `doer` -- Player entity finding hiding spot
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `hitcher(inst, doer, actions, right)`
* **Description:** Adds HITCHUP action if inst has hitcher tag, or UNHITCH on left-click if not hitcher. Checks fire/burnt/hitcher_locked tags.
* **Parameters:**
  - `inst` -- Entity with hitcher component
  - `doer` -- Player entity hitching/unhitching
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `incinerator(inst, doer, actions, right)`
* **Description:** Adds INCINERATE action on right-click if container is not empty and opened by doer. Returns early if doer is riding.
* **Parameters:**
  - `inst` -- Entity with incinerator component
  - `doer` -- Player entity incinerating items
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `inspectable(inst, doer, actions, right)`
* **Description:** Adds LOOKAT action if inst is not doer, doer can examine, and doer is idle or channeling. Returns early on right-click if doer has AOETargeting.
* **Parameters:**
  - `inst` -- Entity with inspectable component
  - `doer` -- Player entity inspecting
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `inventoryitem(inst, doer, actions, right)`
* **Description:** Adds PICKUP action based on can be picked up state, inventory slots, fire/smolder/catchable tags, and spider/spiderwhisperer conditions.
* **Parameters:**
  - `inst` -- Entity with inventoryitem component
  - `doer` -- Player entity picking up item
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `inventoryitemholder(inst, doer, actions, right)`
* **Description:** Adds TAKEITEM or TAKESINGLEITEM action if inst has 'inventoryitemholder_take' tag and not 'fire'. Action depends on item stack state and CONTROL_FORCE_STACK input. Returns early if checks fail or no item present.
* **Parameters:**
  - `inst` -- Entity with inventoryitemholder component
  - `doer` -- Player entity taking item
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None
### `kitcoon(inst, doer, actions, right)`
* **Description:** Adds RETURN_FOLLOWER or ABANDON on right-click only if inst.replica.follower exists and leader matches doer; otherwise no action. Adds PET on left-click.
* **Parameters:**
  - `inst` -- Entity with kitcoon component
  - `doer` -- Player entity interacting with kitcoon
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `lock(inst, doer, actions)`
* **Description:** Adds UNLOCK action if inst has unlockable tag.
* **Parameters:**
  - `inst` -- Entity with lock component
  - `doer` -- Player entity unlocking
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `machine(inst, doer, actions, right)`
* **Description:** Adds TURNON or TURNOFF action on right-click based on turnedon tag. Checks cooldown, fueldepleted, alwayson, emergency, and enabled tags. Returns early (no action) if groundonlymachine tag with held/floating state, or if held item is unequipped equippable.
* **Parameters:**
  - `inst` -- Entity with machine component
  - `doer` -- Player entity operating machine
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `madsciencelab(inst, doer, actions, right)`
* **Description:** Adds COOK action on right-click if readytocook or container is full and opened by doer.
* **Parameters:**
  - `inst` -- Entity with madsciencelab component
  - `doer` -- Player entity cooking
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `magician(inst, doer, actions, right)`
* **Description:** Adds STOPUSINGMAGICTOOL action if inst equals doer and has usingmagiciantool tag.
* **Parameters:**
  - `inst` -- Entity with magician component
  - `doer` -- Player entity using magic tool
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `mapdeliverable(inst, doer, actions, right)`
* **Description:** Adds MAPDELIVER_MAP on left-click or STARTMAPDELIVER on right-click based on bufferedmapaction state and flight permission. Does nothing if inst has the 'mapscout' tag.
* **Parameters:**
  - `inst` -- Entity with mapdeliverable component
  - `doer` -- Player entity delivering map
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `markable(inst, doer, actions, right)`
* **Description:** Adds MARK action if inst has markable tag.
* **Parameters:**
  - `inst` -- Entity with markable component
  - `doer` -- Player entity marking
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `markable_proxy(inst, doer, actions, right)`
* **Description:** Adds MARK action if inst has markable_proxy tag.
* **Parameters:**
  - `inst` -- Entity with markable_proxy component
  - `doer` -- Player entity marking proxy
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `mast(inst, doer, actions, right)`
* **Description:** Adds LOWER_SAIL_BOOST, LOWER_SAIL_FAIL, or RAISE_SAIL based on sailraised/saillowered tags and doer animation state.
* **Parameters:**
  - `inst` -- Entity with mast component
  - `doer` -- Player entity raising/lowering sail
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `mightygym(inst, doer, actions, right)`
* **Description:** Adds UNLOAD_GYM on right-click if loaded, or ENTER_GYM otherwise. Requires doer to have player and strongman tags, and inst must not have the 'hasstrongman' tag.
* **Parameters:**
  - `inst` -- Entity with mightygym component
  - `doer` -- Player entity using gym
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `mine(inst, doer, actions, right)`
* **Description:** Adds RESETMINE action on right-click if inst has minesprung tag and not mine_not_reusable.
* **Parameters:**
  - `inst` -- Entity with mine component
  - `doer` -- Player entity resetting mine
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `ghostgestalter(inst, doer, actions, right)`
* **Description:** Adds MUTATE action if doer has wendy_lunar_3 skill activated and inst has activatable_forceright tag or not right-click.
* **Parameters:**
  - `inst` -- Entity with ghostgestalter component
  - `doer` -- Player entity mutating
  - `actions` -- Table to insert available actions into
  - `right` -- boolean -- true if right-click, false if left-click
* **Returns:** nil
* **Error states:** None

### `occupiable(inst, doer, actions)`
* **Description:** Adds HARVEST action if inst has occupied tag.
* **Parameters:**
  - `inst` -- Entity with occupiable component
  - `doer` -- Player entity harvesting occupiable
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `oceantrawler(inst, doer, actions, right)`
* **Description:** Adds OCEAN_TRAWLER_RAISE, OCEAN_TRAWLER_LOWER, or OCEAN_TRAWLER_FIX actions based on trawler state tags if inst does not have 'fire' or 'burnt' tags.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `pinnable(inst, doer, actions)`
* **Description:** Adds UNPIN action if doer is not pinned, inst is pinned, and inst is not doer.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `pickable(inst, doer, actions)`
* **Description:** Adds PICK action if inst has pickable tag and is not on fire or intense.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `plantresearchable(inst, doer, actions, right)`
* **Description:** Calls PlantRegistryResearch for left-click interactions only.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `portablestructure(inst, doer, actions, right)`
* **Description:** Adds DISMANTLE action for portable structures if container conditions are met and user has appropriate tags.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `projectile(inst, doer, actions)`
* **Description:** Adds CATCH action if inst is catchable and doer can catch.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `prototyper(inst, doer, actions, right)`
* **Description:** Adds OPEN_CRAFTING action for left-click if crafting is enabled.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `pushable(inst, doer, actions, right)`
* **Description:** Adds START_PUSHING action for right-click interactions.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `quagmire_tappable(inst, doer, actions, right)`
* **Description:** Adds HARVEST or TAPTREE actions if inst lacks 'tappable' and 'fire' tags. Right-click adds TAPTREE (or HARVEST with CHOP_tool if tapped_harvestable); left-click adds HARVEST if tapped_harvestable.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `questowner(inst, doer, actions, right)`
* **Description:** Adds ABANDON_QUEST or BEGIN_QUEST action based on questing tag and activation check.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `repairable(inst, doer, actions, right)`
* **Description:** Adds REPAIR action if doer is heavy lifting, not riding, and has appropriate equipped item.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `revivablecorpse(inst, doer, actions, right)`
* **Description:** Adds REVIVE_CORPSE action if revivablecorpse component allows revival by doer.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `rideable(inst, doer, actions, right)`
* **Description:** Adds MOUNT action for rideable entities with appropriate tag checks; woby excludes MOUNT except during heavy lifting when command wheel is disabled.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None
### `rider(inst, doer, actions)`
* **Description:** Adds RUMMAGE or DISMOUNT action based on mount container state when inst equals doer.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `searchable(inst, doer, actions)`
* **Description:** Adds PICK action if inst is searchable and not on fire or intense.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `shelf(inst, doer, actions)`
* **Description:** Adds TAKEITEM action if inst takes shelf items.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `sittable(inst, doer, actions, right)`
* **Description:** Adds SITON action if inst can be sat on and is not on fire.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `sleepingbag(inst, doer, actions)`
* **Description:** Adds SLEEPIN action for players without insomniac tag if inst lacks hassleeper tag (not already occupied); spiderden requires spiderwhisperer tag.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `snowmandecoratable(inst, doer, actions, right)`
* **Description:** Adds DECORATESNOWMAN action for right-click when heavy lifting with snowmandecoratable equipped item. Requires inst to not have 'waxedplant' tag.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `spellbook(inst, doer, actions, right)`
* **Description:** Adds CLOSESPELLBOOK or USESPELLBOOK action based on spellbook state and inventory conditions.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `steeringwheel(inst, doer, actions, right)`
* **Description:** Adds STEER_BOAT action if steering wheel is not occupied and not on fire.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `stewer(inst, doer, actions, right)`
* **Description:** Adds HARVEST or COOK action if inst is not burnt and doer is not riding, based on cooking state and container conditions.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `stageactingprop(inst, doer, actions, right)`
* **Description:** Adds PERFORM action for right-click if inst has 'stageactingprop' tag, doer is stage actor, and play not in progress.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `storytellingprop(inst, doer, actions, right)`
* **Description:** Adds TELLSTORY action when inst has 'storytellingprop' tag and doer has 'storyteller' tag. Click direction must match portable_campfire configuration.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `talkable(inst, doer, actions)`
* **Description:** Adds TALKTO action if inst has maxwellnottalking tag.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `teleporter(inst, doer, actions, right)`
* **Description:** Adds JUMPIN or TELEPORT action based on teleporter type and doer channeling state.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `trap(inst, doer, actions)`
* **Description:** Adds CHECKTRAP action if trap has sprung tag.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `trophyscale(inst, doer, actions, right)`
* **Description:** Adds COMPARE_WEIGHABLE or REMOVE_FROM_TROPHYSCALE action only on right-click based on trophy scale state and equipped item.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `unwrappable(inst, doer, actions, right)`
* **Description:** Adds UNWRAP action for right-click if inst is unwrappable.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `upgrademoduleowner(inst, doer, actions, right)`
* **Description:** Calls CollectUpgradeModuleActions on right-click if doer equals inst and playercontroller is not client-attached.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `walkingplank(inst, doer, actions, right)`
* **Description:** Adds ABANDON_SHIP, RETRACT_PLANK, EXTEND_PLANK, or MOUNT_PLANK actions based on plank state.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `wardrobe(inst, doer, actions, right)`
* **Description:** Adds CHANGEIN action for wardrobe if not on fire and dressable conditions met.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `writeable(inst, doer, actions)`
* **Description:** Adds WRITE action if inst is writeable.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `winch(inst, doer, actions, right)`
* **Description:** Adds UNLOAD_WINCH action for right-click if inst takes shelf items.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `wintersfeasttable(inst, doer, actions, right)`
* **Description:** Adds WINTERSFEAST_FEAST action for right-click if table is ready for feast and not on fire or burnt.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `wobycourier(inst, doer, actions, right)`
* **Description:** Adds WHISTLE action on right-click if doer equals inst, has whistle action, and playercontroller is not client-attached.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `worldmigrator(inst, doer, actions)`
* **Description:** Adds MIGRATE action if inst has migrator tag.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `yotb_sewer(inst, doer, actions, right)`
* **Description:** Adds YOTB_SEW action for right-click based on readytosew tag or container state.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `yotb_stager(inst, doer, actions, right)`
* **Description:** Adds YOTB_STARTCONTEST action when contest-startable tag is present and Year of the Beast event is active, or INTERACT_WITH action when prize tag is present.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `yotc_racecompetitor(inst, doer, actions, right)`
* **Description:** Adds PICKUP action if inst has prize or no_prize tag and is not dead.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `yotc_racestart(inst, doer, actions, right)`
* **Description:** Adds START_CARRAT_RACE action for right-click if not burnt, on fire, or race on.
* **Parameters:**
  - `inst` -- Entity instance being interacted with
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `appraisable(inst, doer, target, actions)`
* **Description:** Adds APPRAISE action if target has appraiser tag.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `bait(inst, doer, target, actions)`
* **Description:** Adds BAIT action if target can be baited.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `bathbomb(inst, doer, target, actions)`
* **Description:** Adds BATHBOMB action if inst is bathbomb and target is bathbombable.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `batteryuser(inst, doer, target, actions, right)`
* **Description:** Adds CHARGE_FROM action for right-click if inst is batteryuser and target is battery.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `bedazzler(inst, doer, target, actions)`
* **Description:** Adds BEDAZZLE action if doer is spiderwhisperer, target is bedazzleable spiderden, and target is not already bedazzled.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `boatpatch(inst, doer, target, actions)`
* **Description:** Adds REPAIR_LEAK action if inst is boat_patch and target has boat_leak tag.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `bottler(inst, doer, target, actions)`
* **Description:** Adds BOTTLE action if target can be bottled.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `brush(inst, doer, target, actions, right)`
* **Description:** Adds BRUSH action for left-click if target is brushable.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `carnivalgameitem(inst, doer, target, actions, right)`
* **Description:** Adds CARNIVALGAME_FEED action if target is carnivalgame_feedchicks_nest and can be fed.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `cookable(inst, doer, target, actions)`
* **Description:** Adds COOK action if target is cooker and not fuel depleted; expertchef tag bypasses dangerouscooker.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `constructionplans(inst, doer, target, actions)`
* **Description:** Adds CONSTRUCT action if inst has plans tag matching target prefab.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `cooker(inst, doer, target, actions)`
* **Description:** Adds COOK action if inst is not dangerouscooker (or doer is expertchef), target is cookable, inst is not fueldepleted, and target is not fire or catchable.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `deckcontainer(inst, doer, actions, right)`
* **Description:** Adds DRAW_FROM_DECK action when `right` is true.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None
### `drawingtool(inst, doer, target, actions)`
* **Description:** Adds DRAW action if target is drawable.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `dryable(inst, doer, target, actions)`
* **Description:** Adds DRY action if target can dry and inst is dryable and not burnt.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `edible(inst, doer, target, actions, right)`
* **Description:** Adds FEED, FEEDPLAYER, or ADDCOMPOSTABLE action based on food type, target eater type, and PVP settings.
* **Parameters:**
  - `inst` -- Entity instance being used (food item)
  - `doer` -- Player entity performing the action
  - `target` -- Target entity to feed
  - `actions` -- Table to insert available actions into
  - `right` -- Boolean indicating right-click interaction
* **Returns:** nil
* **Error states:** None

### `erasablepaper(inst, doer, target, actions)`
* **Description:** Adds ERASE_PAPER action if target is papereraser and not on fire or burnt.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `fan(inst, doer, target, actions)`
* **Description:** Adds FAN action unconditionally.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `farmplantable(inst, doer, target, actions)`
* **Description:** Adds PLANTSOIL action if target is soil and not NOCLICK.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `fertilizer(inst, doer, target, actions)`
* **Description:** Adds FERTILIZE action based on target growth state or self-fertilization conditions.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `fillable(inst, doer, target, actions)`
* **Description:** Adds FILL action if target is watersource.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `fishingrod(inst, doer, target, actions)`
* **Description:** Adds FISH or REEL action based on fishing rod state and target.
* **Parameters:**
  - `inst` -- Entity instance being used (fishing rod)
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `forcecompostable(inst, doer, target, actions)`
* **Description:** Adds ADDCOMPOSTABLE action if target accepts compostable items.
* **Parameters:**
  - `inst` -- Entity instance being used
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Table to insert available actions into
* **Returns:** nil
* **Error states:** None

### `forgerepair(inst, doer, target, actions, right)`
* **Description:** Determines if forge repair action is valid based on floater state, rider status, heavy lifting, and matching forge material tags.
* **Parameters:**
  - `inst` -- The item entity being used
  - `doer` -- The player entity performing the action
  - `target` -- The target entity being acted upon
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `fuel(inst, doer, target, actions)`
* **Description:** Checks if fueling action is valid based on rider status, container ownership, quagmire stewable tags, and matching fuel type tags.
* **Parameters:**
  - `inst` -- The fuel item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity to be fueled
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `furnituredecor(inst, doer, target, actions)`
* **Description:** Adds GIVE action if target has furnituredecortaker tag.
* **Parameters:**
  - `inst` -- The decoration item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target furniture entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `ghostlyelixir(inst, doer, target, actions)`
* **Description:** Adds APPLYELIXIR action if target has elixir_drinker tag.
* **Parameters:**
  - `inst` -- The elixir item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `gravedigger(inst, doer, target, actions)`
* **Description:** Adds GRAVEDIG action if target has gravediggable tag and doer has gravedigger_user tag.
* **Parameters:**
  - `inst` -- The digging tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target grave entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `halloweenpotionmoon(inst, doer, target, actions)`
* **Description:** Adds HALLOWEENMOONMUTATE action if target does not have DECOR tag.
* **Parameters:**
  - `inst` -- The potion item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `healer(inst, doer, target, actions)`
* **Description:** Adds HEAL action if target health can heal or inst has healerbuffs tag, with rider status checks for both doer and target.
* **Parameters:**
  - `inst` -- The healing item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity to heal
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `inventoryitem(inst, doer, actions, right)`
* **Description:** Determines if an inventory item can be picked up based on weight, fire state, creature tags, and container constraints. Only adds ACTIONS.PICKUP.
* **Parameters:**
  - `inst` -- The item entity
  - `doer` -- The player entity performing the action
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None### `itemweigher(inst, doer, target, actions)`
* **Description:** Adds WEIGH_ITEM action if inst has matching trophyscale tag and target has matching weighable tag with ownership check.
* **Parameters:**
  - `inst` -- The trophy item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target weighable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `key(inst, doer, target, actions)`
* **Description:** Adds UNLOCK action if target has matching lock tag and inst has matching key tag.
* **Parameters:**
  - `inst` -- The key item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target lock entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `klaussackkey(inst, doer, target, actions)`
* **Description:** Adds USEKLAUSSACKKEY action if target has klaussacklock tag, inst has klaussackkey tag, and rider/ownership conditions are met.
* **Parameters:**
  - `inst` -- The klaus sack key entity
  - `doer` -- The player entity performing the action
  - `target` -- The target klaus sack entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `lighter(inst, doer, target, actions)`
* **Description:** Adds LIGHT action if target has canlight tag and is not fuel depleted or in limbo.
* **Parameters:**
  - `inst` -- The lighter item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity to light
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `maprecorder(inst, doer, target, actions)`
* **Description:** Adds TEACH action if doer equals target and target has player tag.
* **Parameters:**
  - `inst` -- The map item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `maxhealer(inst, doer, target, actions)`
* **Description:** Adds HEAL action if target health can heal, with rider status checks for both doer and target.
* **Parameters:**
  - `inst` -- The healing item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity to heal
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `moonrelic(inst, doer, target, actions)`
* **Description:** Adds GIVE action if target has moontrader tag and doer is not riding.
* **Parameters:**
  - `inst` -- The moon relic item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target moon trader entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `occupier(inst, doer, target, actions)`
* **Description:** Adds STORE action if target has matching occupiable tag and inst has matching occupant tag, with rider status check.
* **Parameters:**
  - `inst` -- The occupier item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target occupiable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `oceanfishingrod(inst, doer, target, actions)`
* **Description:** Adds OCEAN_FISHING_POND action if target has fishable tag.
* **Parameters:**
  - `inst` -- The fishing rod entity
  - `doer` -- The player entity performing the action
  - `target` -- The target fishable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `plantable(inst, doer, target, actions)`
* **Description:** Adds PLANT action if target has fertile or fullfertile tag.
* **Parameters:**
  - `inst` -- The plantable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target fertile entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `playbill(inst, doer, target, actions)`
* **Description:** Adds GIVE action if target has playbill_lecturn tag.
* **Parameters:**
  - `inst` -- The playbill item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target lecturn entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `playingcard(inst, doer, target, actions)`
* **Description:** Adds ADD_CARD_TO_DECK action if target has playingcard or deckcontainer tag.
* **Parameters:**
  - `inst` -- The playing card entity
  - `doer` -- The player entity performing the action
  - `target` -- The target deck entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `pocketwatch(inst, doer, target, actions)`
* **Description:** Adds CAST_POCKETWATCH action if inst is inactive, doer is caster, target is valid, and rider conditions are met.
* **Parameters:**
  - `inst` -- The pocketwatch item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `pocketwatch_dismantler(inst, doer, target, actions)`
* **Description:** Adds DISMANTLE_POCKETWATCH action if doer has clockmaker tag and target has pocketwatch tag.
* **Parameters:**
  - `inst` -- The dismantler tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target pocketwatch entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `preservative(inst, doer, target, actions, right)`
* **Description:** Adds APPLYPRESERVATIVE action on right-click if target has freshness tags, is cookable, and lacks deployable or smallcreature tags.
* **Parameters:**
  - `inst` -- The preservative item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target cookable entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `pumpkincarver(inst, doer, target, actions)`
* **Description:** Adds CARVEPUMPKIN action if target has pumpkincarvable or pumpkinhatcarvable component with equippable and floater checks.
* **Parameters:**
  - `inst` -- The carving tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target pumpkin entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_installable(inst, doer, target, actions)`
* **Description:** Adds INSTALL action if target has installations tag.
* **Parameters:**
  - `inst` -- The installable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target installations entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_plantable(inst, doer, target, actions)`
* **Description:** Adds PLANTSOIL action if target has soil tag.
* **Parameters:**
  - `inst` -- The plantable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target soil entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_portalkey(inst, doer, target, actions)`
* **Description:** Adds GIVE action if target has quagmire_altar tag.
* **Parameters:**
  - `inst` -- The portal key entity
  - `doer` -- The player entity performing the action
  - `target` -- The target quagmire altar entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_replatable(inst, doer, target, actions)`
* **Description:** Adds REPLATE action if target has quagmire_replater tag.
* **Parameters:**
  - `inst` -- The replatable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target replater entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_replater(inst, doer, target, actions)`
* **Description:** Adds REPLATE action if target has quagmire_replatable tag.
* **Parameters:**
  - `inst` -- The replater item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target replatable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_salter(inst, doer, target, actions)`
* **Description:** Adds SALT action if target has quagmire_saltable tag.
* **Parameters:**
  - `inst` -- The salter item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target saltable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_saltextractor(inst, doer, target, actions)`
* **Description:** Adds INSTALL action if target has saltpond tag.
* **Parameters:**
  - `inst` -- The salt extractor entity
  - `doer` -- The player entity performing the action
  - `target` -- The target saltpond entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_slaughtertool(inst, doer, target, actions)`
* **Description:** Adds SLAUGHTER action if target has canbeslaughtered tag and is not dead.
* **Parameters:**
  - `inst` -- The slaughter tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target slaughterable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_stewable(inst, doer, target, actions)`
* **Description:** Adds GIVE action if target has quagmire_altar tag.
* **Parameters:**
  - `inst` -- The stewable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target quagmire altar entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_stewer(inst, doer, target, actions)`
* **Description:** Adds GIVE action if target has quagmire_cookwaretrader tag.
* **Parameters:**
  - `inst` -- The stewer item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target cookware trader entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `quagmire_tapper(inst, doer, target, actions)`
* **Description:** Adds TAPTREE action if target has tappable tag and inst lacks fire or burnt tags.
* **Parameters:**
  - `inst` -- The tapper item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target tappable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `recipescanner(inst, doer, target, actions, right)`
* **Description:** Adds TEACH action if target has valid recipe and is not locked or marked for no deconstruction.
* **Parameters:**
  - `inst` -- The scanner item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target scannable entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `repairer(inst, doer, target, actions, right)`
* **Description:** Adds REPAIR action on right-click based on matching material tags for work, health, freshen, or finiteuses repair types.
* **Parameters:**
  - `inst` -- The repair tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target repairable entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `saddler(inst, doer, target, actions)`
* **Description:** Adds SADDLE action if target has saddleable tag and lacks dogrider_only tag.
* **Parameters:**
  - `inst` -- The saddle item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target saddleable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `sewing(inst, doer, target, actions)`
* **Description:** Adds SEW action if target has needssewing tag and rider/ownership conditions are met.
* **Parameters:**
  - `inst` -- The sewing kit entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity needing sewing
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `shaver(inst, doer, target, actions)`
* **Description:** Adds SHAVE action for bearded targets or PEEKBUNDLE for unwrappable targets with fire/smolder checks.
* **Parameters:**
  - `inst` -- The razor/shaver entity
  - `doer` -- The player entity performing the action
  - `target` -- The target bearded or bundle entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `sleepingbag(inst, doer, actions)`
* **Description:** Adds SLEEPIN action if doer is a player without insomniac tag, inst is not already occupied (hassleeper), and spiderden restrictions are satisfied (either inst is not a spiderden or doer has spiderwhisperer tag).
* **Parameters:**
  - `inst` -- The sleeping bag entity
  - `doer` -- The player entity performing the action
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None
### `smotherer(inst, doer, target, actions)`
* **Description:** Adds SMOTHER action for smoldering targets or MANUALEXTINGUISH for fire targets if inst is frozen.
* **Parameters:**
  - `inst` -- The smothering item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target smoldering or fire entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `snowmandecor(inst, doer, target, actions)`
* **Description:** Adds DECORATESNOWMAN action if target has snowmandecoratable component, heavy tag, and lacks waxedplant tag with heavy lifting check.
* **Parameters:**
  - `inst` -- The decoration item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target snowman entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `snowmandecoratable(inst, doer, actions, right)`
* **Description:** Adds DECORATESNOWMAN action on right-click if inst lacks waxedplant tag, doer is heavy lifting, and equipped body item has snowmandecoratable component (for stacking large snowballs).
* **Parameters:**
  - `inst` -- The snowball entity
  - `doer` -- The player entity performing the action
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None
### `soul(inst, doer, target, actions)`
* **Description:** Adds EAT action if doer equals target and target has souleater tag.
* **Parameters:**
  - `inst` -- The soul item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target souleater entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `spidermutator(inst, doer, target, actions)`
* **Description:** Adds MUTATE_SPIDER action if target has spider tag and is not dead.
* **Parameters:**
  - `inst` -- The mutator item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target spider entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `stackable(inst, doer, target, actions)`
* **Description:** Adds COMBINESTACK action if target stackable is not full, can stack with inst, and is not held.
* **Parameters:**
  - `inst` -- The stackable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target stack entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `summoningitem(inst, doer, target, actions, right)`
* **Description:** Adds CASTUNSUMMON action if target is not in limbo, is follower of doer, doer has ghostfriend_summoned tag, and target is abigail.
* **Parameters:**
  - `inst` -- The summoning item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target abigail entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `tacklesketch(inst, doer, target, actions)`
* **Description:** Adds GIVE_TACKLESKETCH action if target has tacklestation tag and lacks fire or smolder tags.
* **Parameters:**
  - `inst` -- The tackle sketch entity
  - `doer` -- The player entity performing the action
  - `target` -- The target tacklestation entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `teacher(inst, doer, target, actions)`
* **Description:** Adds TEACH action if doer equals target and target has builder component.
* **Parameters:**
  - `inst` -- The teaching item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `tool(inst, doer, target, actions, right)`
* **Description:** Adds REMOVELUNARBUILDUP or matching tool actions based on target tags and tool action validity.
* **Parameters:**
  - `inst` -- The tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `tradable(inst, doer, target, actions, right)`
* **Description:** Adds GIVE action if target has trader tag and is not player/ghost/possessedbody with rider/ownership checks.
* **Parameters:**
  - `inst` -- The tradable item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target trader entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `treegrowthsolution(inst, doer, target, actions)`
* **Description:** Adds ADVANCE_TREE_GROWTH action if target is tree without monster, fire, burnt, stump, leif, or no_force_grow tags.
* **Parameters:**
  - `inst` -- The tree growth solution entity
  - `doer` -- The player entity performing the action
  - `target` -- The target tree entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `unsaddler(inst, doer, target, actions, right)`
* **Description:** Adds UNSADDLE action if not right-click and target has saddled tag.
* **Parameters:**
  - `inst` -- The unsaddle tool entity
  - `doer` -- The player entity performing the action
  - `target` -- The target saddled entity
  - `actions` -- Table to insert valid actions into
  - `right` -- Boolean indicating right-click action
* **Returns:** None
* **Error states:** None

### `upgrader(inst, doer, target, actions)`
* **Description:** Adds UPGRADE action if matching upgrade type tags exist on inst, doer, and target.
* **Parameters:**
  - `inst` -- The upgrader item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target upgradeable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `useabletargeteditem(inst, doer, target, actions)`
* **Description:** Adds USEITEMON action if target is valid per UseableTargetedItem_ValidTarget or prefab targeter tag, with mounted usage check.
* **Parameters:**
  - `inst` -- The useable targeted item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `vasedecoration(inst, doer, target, actions)`
* **Description:** Adds DECORATEVASE action if target has vase tag, inst has vasedecoration tag, and rider/ownership conditions are met.
* **Parameters:**
  - `inst` -- The vase decoration item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target vase entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `watersource(inst, doer, target, actions)`
* **Description:** Adds FILL action if target has fillable tag.
* **Parameters:**
  - `inst` -- The water source item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target fillable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `wax(inst, doer, target, actions)`
* **Description:** Adds WAX action if target has waxable tag and needswaxspray/waxspray tag states match.
* **Parameters:**
  - `inst` -- The wax item entity
  - `doer` -- The player entity performing the action
  - `target` -- The target waxable entity
  - `actions` -- Table to insert valid actions into
* **Returns:** None
* **Error states:** None

### `weapon(inst, doer, target, actions, right)`
* **Description:** Determines valid actions for weapon items, including storing in containers, attacking, or bundling based on target tags and rider state.
* **Parameters:**
  - `inst` -- The item entity being used.
  - `doer` -- The player entity performing the action.
  - `target` -- The target entity being interacted with.
  - `actions` -- Table to insert valid actions into.
  - `right` -- Boolean indicating right-click context.
* **Returns:** None
* **Error states:** None

### `weighable(inst, doer, target, actions)`
* **Description:** Checks for trophy scale tags to allow weighing actions on structures or owned inventory items.
* **Parameters:**
  - `inst` -- The item entity being used.
  - `doer` -- The player entity performing the action.
  - `target` -- The target entity being interacted with.
  - `actions` -- Table to insert valid actions into.
* **Returns:** None
* **Error states:** None

### `winter_treeseed(inst, doer, target, actions)`
* **Description:** Allows planting action if target is a winter tree stand and not burning.
* **Parameters:**
  - `inst` -- The item entity being used.
  - `doer` -- The player entity performing the action.
  - `target` -- The target entity being interacted with.
  - `actions` -- Table to insert valid actions into.
* **Returns:** None
* **Error states:** None

### `AddComponentAction(actiontype, component, fn, modname)`
* **Description:** Registers a new component action for mods, creating mod-specific lookup tables if needed.
* **Parameters:**
  - `actiontype` -- string action type category (e.g., INVENTORY, ISVALID)
  - `component` -- string component name to register action for
  - `fn` -- function callback that determines action availability
  - `modname` -- string name of the mod registering this action
* **Returns:** None
* **Error states:** None

### `EntityScript:RegisterComponentActions(name)`
* **Description:** Registers component actions on an entity by adding action component IDs to self.actioncomponents and syncing with actionreplica. Also handles mod-specific action components.
* **Parameters:**
  - `name` -- string component action name to register on this entity
* **Returns:** None
* **Error states:** None

### `EntityScript:UnregisterComponentActions(name)`
* **Description:** Removes a component action from the entity's action component list by name. Also handles mod action components and updates the action replica network state if present.
* **Parameters:**
  - `name` -- string - The name of the component action to unregister from the entity
* **Returns:** nil
* **Error states:** None
### `EntityScript:CollectActions(actiontype, ...)`
* **Description:** Collects actions for a given action type by iterating through registered action components and calling their collector functions. Also processes mod action components if present.
* **Parameters:**
  - `actiontype` -- string - The type of action to collect collectors for
  - `...` -- vararg - Additional arguments passed to action collector functions
* **Returns:** nil
* **Error states:** Prints error message to console and returns early if actiontype doesn't exist in COMPONENT_ACTIONS table (function exits immediately after print)
### `EntityScript:IsActionValid(action, right)`
* **Description:** Validates if an action is valid by checking action.rmb flag against right parameter and iterating through action component validators. Returns true if any validator approves the action.
* **Parameters:**
  - `action` -- table - The action object to validate
  - `right` -- boolean - Whether this is a right-mouse-button action context
* **Returns:** boolean - true if action is valid, false otherwise
* **Error states:** None
### `EntityScript:HasActionComponent(name)`
* **Description:** Checks if the entity has a specific action component registered by name. Searches both standard action components and mod action components.
* **Parameters:**
  - `name` -- string - The name of the component to check for registration
* **Returns:** boolean - true if component is found, false otherwise
* **Error states:** None
## Events & listeners
None identified.
