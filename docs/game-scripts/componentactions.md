---
id: componentactions
title: Componentactions
description: This component defines the core action system for Don't Starve Together, implementing component-based action handlers that determine valid player interactions with entities and world positions across INVENTORY, POINT, and EQUIPPED contexts, while providing modding support through action registration, collection, and validation methods.
tags: [actions, interactions, components, modding, player]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
system_scope: player
source_hash: b7084665
---

# Componentactions

> Based on game build **714014** | Last updated: 2026-03-21

## Overview

The `componentactions` component serves as the central action determination system in Don't Starve Together, responsible for computing which interactions are available to players based on entity states, component presence, tags, and contextual constraints. It implements a comprehensive framework of action handler functions that cover all major interaction types including combat, crafting, deployment, storage, cooking, healing, repairing, mounting, and specialized equipment actions. The component supports both built-in game actions and modded actions through a flexible registration system that maintains separate registries for vanilla and mod-provided handlers. Core query methods like `CollectActions`, `IsActionValid`, and `HasActionComponent` enable entities to dynamically determine available actions at runtime, while helper functions for rowing, fishing, scything, and plant research provide specialized interaction logic. The system respects network replication constraints, rider/mounting states, heavy-lifting restrictions, and game mode properties to ensure action validity across client and server environments.

## Usage example

```lua
-- Register a custom component action handler for mods
AddComponentAction("INVENTORY", "mycomponent", function(inst, doer, actions)
    if inst.components.mycomponent and inst.components.mycomponent:IsActive() then
        table.insert(actions, ACTIONS.USE_MY_COMPONENT)
    end
end, "mymod")

-- Check if an entity has a specific action component
if inst:HasActionComponent("inventory") then
    -- Entity supports inventory actions
end

-- Collect available actions for an entity
local actions = {}
inst:CollectActions("INVENTORY", inst, doer, actions, false)

-- Validate if an action is permitted
if inst:IsActionValid(action, right_click) then
    -- Action is valid for this entity
end
```

## Dependencies & tags

**External dependencies:**
- `vecutil` -- Provides VecUtil_LengthSq, VecUtil_Normalize, VecUtil_Dist
- `TheWorld` -- Used for map operations: IsOceanAtPoint, IsVisualGroundAtPoint, GetPlatformAtPoint
- `TheNet` -- Used to check if game is dedicated server
- `ThePlayer` -- Used to compare with doer to adjust test_length during rowing
- `ACTIONS` -- Enum-like table of action constants used throughout component actions
- `TUNING` -- Provides constants like OVERRIDE_ROW_ACTION_DISTANCE and KITCOON_NEAR_DEN_DIST
- `ThePlantRegistry` -- Used for plant/fertilizer knowledge checks
- `FindVirtualOceanEntity` -- Called by CanCastFishingNetAtPoint to detect virtual ocean
- `FindEntity` -- Used by Kitcoon handler to detect nearby dens
- `IsEntityDead` -- Used in SCENE.combat to determine if target can be attacked
- `IsInValidHermitCrabDecorArea` -- Used in crittertraits handler to validate decor placement area
- `TROPHYSCALE_TYPES` -- Global constant table used in trophyscale handler to iterate over scale types for comparison
- `FOODGROUP` -- Global constant table used in edible handler to match edible tags to eater tags by food group
- `FOODTYPE` -- Global constant table used in edible handler to match edible tags to eater tags by food type
- `EQUIPSLOTS` -- Global constant used to reference EQUIPSLOTS.BODY for item slot checks
- `SPECIAL_EVENTS` -- Global constant table used in yotb_stager to check if YOTB event is active via IsSpecialEventActive
- `LOCKTYPE` -- Used in key action to iterate lock types and match keys
- `OCCUPANTTYPE` -- Used in occupier to match occupant types to occupiable targets
- `MATERIALS` -- Used in repairer and forgerepair to match repair materials
- `FORGEMATERIALS` -- Used in forgerepair to check forgerepair_ tags on inst and target
- `UPGRADETYPES` -- Used in upgrader to match upgrade types and user/target tags
- `TOOLACTIONS` -- Used in tool action to iterate tool action types and match tags (e.g., 'axe_tool')
- `FUELTYPE` -- Used in fuel to iterate fuel types and match _fuel and _fueled tags
- `GetValidRecipe` -- Called to validate recipes for recipescanner action
- `AllRecipes` -- Used in recipescanner to look up recipes by prefab name
- `GetGameModeProperty` -- Used in inventoryitem and other actions to check game mode flags like non_item_equips
- `FunctionOrValue` -- Used in recipescanner to evaluate per-target no_deconstruction configuration
- `TheInput` -- Used in playercontroller.IsControlPressed for CONTROL_FORCE_STACK detection
- `CONTROL_FORCE_STACK` -- Referenced in inventoryitem to control GIVEALLTOPLAYER behavior
- `CONTROLS` -- Used to define control constants such as CONTROL_FORCE_STACK (via Controls table)
- `SPELLTYPES` -- Iterated for spellcaster tags
- `CLIENT_REQUESTED_ACTION` -- Compared for specific deployment actions
- `CheckRowOverride` -- Used to determine row override for oar actions
- `Row` -- Called to generate rowing action for oar
- `IsTeleportingPermittedFromPointToPoint` -- Called for blink staff teleport validity
- `CanCastFishingNetAtPoint` -- Called for fishing net/cast validity
- `GetFishingAction` -- Called to get contextual fishing action
- `orderedPairs` -- Used to iterate over COMPONENT_ACTIONS and MOD_COMPONENT_ACTIONS tables for remapping
- `COMPONENT_ACTIONS` -- Global table mapping action type names to component action tables
- `ACTION_COMPONENT_NAMES` -- Global table mapping built-in component names to IDs used for indexing
- `CheckModComponentActions` -- Function called to retrieve modded component action tables
- `CheckModComponentNames` -- Function called to retrieve modded component name-to-ID mapping
- `CheckModComponentIds` -- Function called to retrieve modded component IDs by name

**Components used:**
- `attuner` -- Used in SCENE.attunable to call IsAttunedTo on doer
- `boatringdata` -- Used in SCENE.boatrotator and CheckRowOverride to get radius and rotation state
- `constructionbuilderuidata` -- Used in SCENE.container to determine if builder is in use
- `container_proxy` -- Used in SCENE.container_proxy and SCENE.container via replica.container to check CanBeOpened
- `floater` -- Used in SCENE.machine to check if item is floating
- `playercontroller` -- Used in SCENE.ROW and many others to check isclientcontrollerattached, HasAOETargeting, and IsControlPressed
- `skilltreeupdater` -- Used in SCENE.ghostgestalter to check if skill is activated
- `revivablecorpse` -- Used in revivablecorpse action handler via inst.components.revivablecorpse:CanBeRevivedBy(doer)
- `spellbook` -- Used in spellbook action handler via inst.components.spellbook:CanBeUsedBy(doer)
- `rider` -- doer.replica.rider:IsRiding() used to restrict actions while mounted
- `inventoryitem` -- Used to check ownership (IsGrandOwner, IsHeld, IsEquipped) and tags (CanOnlyGoInPocket)
- `container` -- target.replica.container:CanBeOpened() and IsOpenedBy() used to allow storing into containers
- `health` -- target.replica.health:CanHeal() used in healer/maxhealer to validate healability
- `inventory` -- doer.replica.inventory:IsHeavyLifting() used to prevent actions while carrying heavy items
- `equippable` -- target.replica.equippable:IsEquipped() and:IsRestricted(doer) used to check equipping status and restrictions
- `stackable` -- target.replica.stackable:IsFull() and IsStack() used in stackable logic
- `follower` -- target.replica.follower:GetLeader() compared to doer in summoningitem logic
- `builder` -- target.replica.builder present for teacher action (doer==target)
- `pumpkincarvable` -- target.components.pumpkincarvable existence checks for carving (client-safe)
- `pumpkinhatcarvable` -- target.components.pumpkinhatcarvable existence checks for pumpkin hat carving
- `snowmandecoratable` -- target.components.snowmandecoratable existence checks for snowman decoration (client-safe)
- `constructionsite` -- Accessed via target.replica.constructionsite for build actions
- `combat` -- Checked via doer.replica.combat and target.replica.combat for targeting, ally, and attack validity
- `aoetargeting` -- Accessed via inst.components.aoetargeting to check enabled state and constraints
- `fishingrod` -- Accessed via inst.replica.fishingrod to check caught fish and target
- `oceanfishingrod` -- Accessed via inst.replica.oceanfishingrod for ocean fishing target and actions
- `containerinstallableitem` -- Calls GetValidOpenContainer on the item's component
- `singinginspiration` -- Calls IsSongActive to check if song is active

**Tags:**
- `inactive` -- check
- `engineering` -- check
- `portableengineer` -- check
- `activatable_forceright` -- check
- `smolder` -- check
- `fire` -- check
- `anchor_raised` -- check
- `anchor_transitioning` -- check
- `paired` -- check
- `turnedoff` -- check
- `ammoloaded` -- check
- `occupied` -- check
- `is_rowing` -- check
- `is_row_failing` -- check
- `overriderowaction` -- check
- `boat` -- check
- `fishing_idle` -- check
- `projectile` -- check
- `oceanfishing_catchable` -- check
- `fishinghook` -- check
- `plantresearchable` -- check
- `fertilizerresearchable` -- check
- `farmplantstress` -- check
- `weedplantstress` -- check
- `plantinspector` -- check
- `plantkin` -- check
- `reader` -- check
- `controlled_burner` -- check
- `stokeablefire` -- check
- `cancatch` -- check
- `channelable` -- check
- `channeled` -- check
- `burnt` -- check
- `battery` -- check
- `batteryuser` -- check
- `bathingpool` -- check
- `bundle` -- check
- `oceantrawler` -- check
- `trawler_lowered` -- check
- `rider` -- check
- `isriding` -- check
- `pickable` -- check
- `activatable` -- check
- `groundonlymachine` -- check
- `enabled` -- check
- `turnedon` -- check
- `cooldown` -- check
- `fueldepleted` -- check
- `alwayson` -- check
- `emergency` -- check
- `readytocook` -- check
- `minesprung` -- check
- `mine_not_reusable` -- check
- `usingmagiciantool` -- check
- `sailraised` -- check
- `saillowered` -- check
- `sail_transitioning` -- check
- `loaded` -- check
- `strongman` -- check
- `player` -- check
- `hasstrongman` -- check
- `hasoneoftags` -- check
- `catchable` -- check
- `lighter` -- check
- `spider` -- check
- `spiderwhisperer` -- check
- `heavy` -- check
- `heavylift_lmb` -- check
- `is_furling` -- check
- `near_kitcoonden` -- check
- `kitcoonden` -- check
- `unlockable` -- check
- `hastag` -- check
- `marked` -- check
- `hitcher` -- check
- `hitcher_locked` -- check
- `dried` -- check
- `readyforharvest` -- check
- `withered` -- check
- `cancycle` -- check
- `inventoryitemholder_take` -- check
- `tendable_farmplant` -- check
- `mime` -- check
- `fully_electrically_linked` -- check
- `is_electrically_linked` -- check
- `can_use_heavy` -- check
- `markable` -- check
- `markable_proxy` -- check
- `haunted` -- check
- `holdable` -- check
- `craftable` -- check
- `noabandon` -- check
- `trawler_fish_escaped` -- check
- `pinned` -- check
- `intense` -- check
- `portable_campfire` -- check
- `portable_campfire_user` -- check
- `mastercookware` -- check
- `masterchef` -- check
- `craftingenabled` -- check
- `hitched` -- check
- `dogrider_only` -- check
- `dogrider` -- check
- `woby` -- check
- `hassleeper` -- check
- `spiderden` -- check
- `wardrobe` -- check
- `dressable` -- check
- `readyforfeast` -- check
- `waxedplant` -- check
- `unwrappable` -- check
- `interactable` -- check
- `plank_extended` -- check
- `on_walkable_plank` -- check
- `stageactingprop` -- check
- `stageactor` -- check
- `play_in_progress` -- check
- `storytellingprop` -- check
- `storyteller` -- check
- `maxwellnottalking` -- check
- `teleporter` -- check
- `townportal` -- check
- `vault_teleporter` -- check
- `channeling` -- check
- `trapsprung` -- check
- `trophyscale_*` -- check
- `trophycanbetaken` -- check
- `wax` -- check
- `migrator` -- check
- `yotb_conteststartable` -- check
- `has_prize` -- check
- `has_no_prize` -- check
- `race_on` -- check
- `readytosew` -- check
- `cansit` -- check
- `donecooking` -- check
- `takeshelfitem` -- check
- `insomniac` -- check
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
- `edible_*` -- check
- `*_eater` -- check
- `wereplayer` -- check
- `strongstomach` -- check
- `ignoresspoilage` -- check
- `spoiled` -- check
- `badfood` -- check
- `unsafefood` -- check
- `compostingbin_accepts_items` -- check
- `papereraser` -- check
- `watersource` -- check
- `fishable` -- check
- `soil` -- check
- `NOCLICK` -- check
- `notreadyforharvest` -- check
- `fertile` -- check
- `infertile` -- check
- `barren` -- check
- `fertilizable` -- check
- `self_fertilizable` -- check
- `critter` -- check
- `handfed` -- check
- `small_livestock` -- check
- `fedbyall` -- check
- `follower` -- check
- `edible_ELEMENTAL` -- check
- `edible_GEARS` -- check
- `edible_INSECT` -- check
- `edible_BURNT` -- check
- `DECOR` -- check
- `furnituredecortaker` -- check
- `elixir_drinker` -- check
- `gravediggable` -- check
- `gravedigger_user` -- check
- `alltrader` -- check
- `playerghost` -- check
- `ghost` -- check
- `reviver` -- check
- `boatcannon` -- check
- `boatcannon_ammo` -- check
- `inventoryitemholder_give` -- check
- `INLIMBO` -- check
- `BURNABLE_fueled` -- check
- `BURNABLE_fuel` -- check
- `constructionsite` -- check
- `quagmire_stewable` -- check
- `quagmire_stewer` -- check
- `quagmire_cookwaretrader` -- check
- `vase` -- check
- `vasedecoration` -- check
- `waxable` -- check
- `waxspray` -- check
- `needssewing` -- check
- `saddleable` -- check
- `saddled` -- check
- `tacklestation` -- check
- `canpeek` -- check
- `bearded` -- check
- `moontrader` -- check
- `klaussacklock` -- check
- `klaussackkey` -- check
- `pocketwatch` -- check
- `clockmaker` -- check
- `pocketwatch_mountedcast` -- check
- `pocketwatchcaster` -- check
- `pocketwatch_inactive` -- check
- `souleater` -- check
- `canbeslaughtered` -- check
- `tappable` -- check
- `quagmire_altar` -- check
- `quagmire_replater` -- check
- `quagmire_replatable` -- check
- `quagmire_saltable` -- check
- `saltpond` -- check
- `installations` -- check
- `fullfertile` -- check
- `trader` -- check
- `tree` -- check
- `monster` -- check
- `stump` -- check
- `leif` -- check
- `no_force_grow` -- check
- `LunarBuildup` -- check
- `MINE_tool` -- check
- `fillable` -- check
- `outofammo` -- check
- `rangedweapon` -- check
- `tranquilizer` -- check
- `canlight` -- check
- `nolight` -- check
- `sleeper` -- check
- `container_proxy` -- check
- `structure` -- check
- `weighable_*` -- check
- `winter_treestand` -- check
- `rotatableobject` -- check
- `gestaltcapturable` -- check
- `burnableignorefuel` -- check
- `lifting` -- check
- `moonstormstaticcapturable` -- check
- `floater` -- check
- `nohighlight` -- check
- `steeringboat` -- check
- `rotatingboat` -- check
- `castonpoint` -- check
- `castonpointwater` -- check
- `castonrecipes` -- check
- `castonlocomotors` -- check
- `castonlocomotorspvp` -- check
- `castonworkable` -- check
- `castoncombat` -- check
- `crushitemcast` -- check
- `plow` -- check
- `fillable_showoceanaction` -- check
- `tile_deploy` -- check
- `deployable` -- check
- `special_action_toss` -- check
- `complexprojectile_showoceanaction` -- check
- `boatbuilder` -- check
- `nomagic` -- check
- `faced_chair` -- check
- `wall` -- check
- `mustforceattack` -- check
- `mole` -- check
- `hammer` -- check
- `needswaxspray` -- check
- `equippable` -- check
- `fertilizer` -- check
- `elixirbrewer` -- check
- `healerbuffs` -- check
- `ghostfriend_notsummoned` -- check
- `ghostfriend_summoned` -- check
- `castfrominventory` -- check
- `pocketwatch_castfrominventory` -- check
- `handyperson` -- check
- `slingshotmodscontainer` -- check
- `walter_slingshot_modding` -- check
- `readable` -- check
- `upgrademoduleowner` -- check
- `inuse` -- check
- `cannotuse` -- check
- `useabletargeteditem_inventorydisable` -- check
- `inuse_targeted` -- check
- `accepts_oceanfishingtackle` -- check
- `broadcasting` -- check
- `invenoryitem` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions

### `CanCastFishingNetAtPoint(thrower, target_x, target_z)`
* **Description:** Checks if a fishing net can be cast at the given point: requires it to be over ocean or virtual ocean and at least min_throw_distance away from the thrower.
* **Parameters:**
  - `thrower` -- Entity attempting to cast the net; used to get position
  - `target_x` -- World X-coordinate of the target point
  - `target_z` -- World Z-coordinate of the target point
* **Returns:** true if casting is valid, false otherwise

### `Row(inst, doer, pos, actions)`
* **Description:** Generates rowing actions (ROW, ROW_FAIL, ROW_CONTROLLER) based on platform type, player control state, and proximity to water or boat.
* **Parameters:**
  - `inst` -- Ignored; present for signature compatibility
  - `doer` -- Entity (typically player) attempting to row; checked for platform, boat tag, rowing state
  - `pos` -- World position (x,z) of interaction point, used when controller is detached
  - `actions` -- Mutable table into which compatible ACTION constants are inserted
* **Returns:** nil
* **Error states:** Early exit if doer not on a boat, or if controller is attached and position matches current platform.

### `PlantRegistryResearch(inst, doer, actions)`
* **Description:** Adds plant registry research and plant stress assessment actions if doer has required tools/tags and target is researchable.
* **Parameters:**
  - `inst` -- Target entity (plant or fertilizer); checked for research tags and registry keys
  - `doer` -- Entity performing the action; checked for plantinspector tag or plantkin, andCanExamine
  - `actions` -- Mutable table into which PLANTREGISTRY_RESEARCH or PLANTREGISTRY_RESEARCH_FAIL and ASSESSPLANTHAPPINESS actions may be inserted
* **Returns:** nil
* **Error states:** No action added if doer lacks plantinspector or plantkin tag, or if target not researchable.

### `GetFishingAction(doer, fishing_target)`
* **Description:** Returns the appropriate Ocean Fishing action (OCEAN_FISHING_CATCH, OCEAN_FISHING_REEL, or OCEAN_FISHING_STOP) based on doer state and target.
* **Parameters:**
  - `doer` -- Entity performing fishing; must have fishing_idle tag
  - `fishing_target` -- Fishing hook or catchable entity; checked for oceanfishing_catchable and fishinghook tags
* **Returns:** String action constant or nil if no valid action.
* **Error states:** Returns nil if doer not in fishing_idle state or target is projectile or not catchable.

### `CheckRowOverride(doer, target)`
* **Description:** Returns true if target has overriderowaction and is within OVERRIDE_ROW_ACTION_DISTANCE of the doer or boat, allowing the override action to supersede normal row.
* **Parameters:**
  - `doer` -- Entity attempting to row; used for position and platform lookup
  - `target` -- Potential override entity (e.g., ocean trawler) with overriderowaction tag
* **Returns:** true if row action should be overridden, false otherwise
* **Error states:** Returns false if doer not on a boat or no valid override target.

### `IsValidScytheTarget(target)`
* **Description:** Predicate to validate whether a target is harvestable by a scythe.
* **Parameters:**
  - `target` -- Entity to check; must have one of SCYTHE_ONEOFTAGS tags
* **Returns:** true if target has one of the required tags (plant, lichen, oceanvine, kelp), false otherwise

### `oceantrawler(inst, doer, actions, right)`
* **Description:** Adds actions to raise, lower, or fix an ocean trawler based on its current state and tag flags.
* **Parameters:**
  - `inst` -- Entity (target) being acted upon; must not be fire/burnt to be considered.
  - `doer` -- Entity (usually player) performing the action.
  - `actions` -- Table to append valid action objects (ACTIONS.OCEAN_TRAWLER_RAISE, OCEAN_TRAWLER_LOWER, OCEAN_TRAWLER_FIX).
  - `right` -- Boolean indicating if the action was triggered by a right-click (true) or left-click (false).
* **Returns:** nil

### `pinnable(inst, doer, actions)`
* **Description:** Adds UNPIN action if the target is pinned and the doer is not pinned and not the same entity.
* **Parameters:**
  - `inst` -- Entity (target) that may be pinned.
  - `doer` -- Entity performing the action; must not be pinned and the target must be pinned (but not the same as doer).
  - `actions` -- Table to append ACTIONS.UNPIN if conditions are met.
* **Returns:** nil

### `pickable(inst, doer, actions)`
* **Description:** Adds PICK action if the target is pickable and not on fire or intense.
* **Parameters:**
  - `inst` -- Entity that must have 'pickable' tag and not be fire/intense to be pickable.
  - `doer` -- Entity performing the action; not used for logic here but included per signature.
  - `actions` -- Table to append ACTIONS.PICK if conditions are met.
* **Returns:** nil

### `plantresearchable(inst, doer, actions, right)`
* **Description:** Invokes PlantRegistryResearch if the action is left-clicked (right=false); adds no direct action here.
* **Parameters:**
  - `inst` -- Entity (plant) to be researched if left-clicked.
  - `doer` -- Entity performing the action (e.g., player).
  - `actions` -- Table to append research action (if right is false).
  - `right` -- Boolean; function is a no-op if right-clicked; only left-click triggers research logic via PlantRegistryResearch.
* **Returns:** nil

### `portablestructure(inst, doer, actions, right)`
* **Description:** Adds DISMANTLE action for portable structures under specific restrictions involving campfires, cooking, engineering, and container state.
* **Parameters:**
  - `inst` -- Structure entity to dismantle; must be portable, not burning (unless campfire + portable_campfire_user), and satisfy further tag/owner conditions.
  - `doer` -- Entity performing the action; must meet required tags like masterchef/masterengineer if needed.
  - `actions` -- Table to append ACTIONS.DISMANTLE if all conditions pass and container (if any) is not already opened by doer.
  - `right` -- Boolean; function exits early if not right-clicked.
* **Returns:** nil

### `projectile(inst, doer, actions)`
* **Description:** Adds CATCH action if target is catchable and the doer can catch.
* **Parameters:**
  - `inst` -- Entity with catchable tag that can be caught.
  - `doer` -- Entity with cancatch tag who can catch projectiles.
  - `actions` -- Table to append ACTIONS.CATCH if conditions are met.
* **Returns:** nil

### `prototyper(inst, doer, actions, right)`
* **Description:** Adds OPEN_CRAFTING action for prototyper if right-clicked and crafting is not globally disabled for the doer.
* **Parameters:**
  - `inst` -- Prototyper entity to open crafting window.
  - `doer` -- Entity performing the action; crafting may be disabled globally per player class classification.
  - `actions` -- Table to append ACTIONS.OPEN_CRAFTING if right-click and crafting is enabled.
  - `right` -- Boolean; only right-clicks open the prototyper UI.
* **Returns:** nil

### `pushable(inst, doer, actions, right)`
* **Description:** Adds START_PUSHING action if the action is right-clicked.
* **Parameters:**
  - `inst` -- Entity that can be pushed (e.g., pushable structure).
  - `doer` -- Entity attempting to push; not used in logic here but required per signature.
  - `actions` -- Table to append ACTIONS.START_PUSHING if right-clicked.
  - `right` -- Boolean; function only adds action on right-click.
* **Returns:** nil

### `quagmire_tappable(inst, doer, actions, right)`
* **Description:** Adds TAPTREE or HARVEST actions for quagmire tappable trees depending on click side and equipped tool.
* **Parameters:**
  - `inst` -- Tappable tree entity; must have tappable tag and not be fire, and state flags track tapped/harvested states.
  - `doer` -- Entity performing the action; must be wielding a chop tool for harvest.
  - `actions` -- Table to append either TAPTREE (right) or HARVEST (left) depending on state and tool.
  - `right` -- Boolean; right-click uses TAPTREE, left-click may use HARVEST.
* **Returns:** nil

### `questowner(inst, doer, actions, right)`
* **Description:** Adds BEGIN_QUEST or ABANDON_QUEST actions for quest-related entities on right-click.
* **Parameters:**
  - `inst` -- Quest-giving entity (QuestOwner).
  - `doer` -- Entity (player) attempting to begin or abandon a quest; must satisfy CanBeActivatedBy_Client if present.
  - `actions` -- Table to append BEGIN_QUEST or ABANDON_QUEST depending on questing tag.
  - `right` -- Boolean; only right-clicks trigger quest actions.
* **Returns:** nil

### `repairable(inst, doer, actions, right)`
* **Description:** Adds REPAIR action if the doer meets heavy-lifting, non-riding conditions and wields a matching work_* item.
* **Parameters:**
  - `inst` -- Repairable entity (e.g., sculpture, moon altar) with specific repair tags.
  - `doer` -- Entity performing the repair; must be heavy lifting and not riding; must have appropriate work_* tag on equipped item.
  - `actions` -- Table to append ACTIONS.REPAIR if all conditions pass.
  - `right` -- Boolean; only right-clicks attempt repair.
* **Returns:** nil

### `revivablecorpse(inst, doer, actions, right)`
* **Description:** Adds REVIVE_CORPSE action if the corpse can be revived by the doer via the RevivableCorpse component.
* **Parameters:**
  - `inst` -- Corpse entity with RevivableCorpse component; must satisfy CanBeRevivedBy(doer).
  - `doer` -- Entity attempting to revive; passed to RevivableCorpse:CanBeRevivedBy for validation.
  - `actions` -- Table to append ACTIONS.REVIVE_CORPSE if revive is possible.
  - `right` -- Boolean; present in signature but not used for condition checks.
* **Returns:** nil

### `rideable(inst, doer, actions, right)`
* **Description:** Adds MOUNT action for rideable entities, with special case logic for woby.
* **Parameters:**
  - `inst` -- Rideable entity; must have rideable, not hitched, and optionally dogrider_only restriction; special handling for woby.
  - `doer` -- Entity mounting; must not be heavy lifting for woby (which uses command wheel instead), and not already riding.
  - `actions` -- Table to append ACTIONS.MOUNT if conditions pass.
  - `right` -- Boolean; only right-clicks attempt mounting.
* **Returns:** nil

### `rider(inst, doer, actions)`
* **Description:** If inst == doer, adds DISMOUNT if container is not opened, or RUMMAGE if the mount's container is opened.
* **Parameters:**
  - `inst` -- Entity that may be acting as rider; function acts only if inst == doer (the local entity).
  - `doer` -- Entity doing the action; must match inst for rider-specific logic to run.
  - `actions` -- Table to append either DISMOUNT or RUMMAGE depending on mount's container state.
* **Returns:** nil

### `searchable(inst, doer, actions)`
* **Description:** Adds PICK action for searchable entities that are not fire/intense.
* **Parameters:**
  - `inst` -- Entity with searchable tag; not valid if fire or intense.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.PICK if conditions are met.
* **Returns:** nil

### `shelf(inst, doer, actions)`
* **Description:** Adds TAKEITEM action for shelf entities that accept taking items.
* **Parameters:**
  - `inst` -- Shelf entity with takeshelfitem tag.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.TAKEITEM if takeshelfitem tag is present.
* **Returns:** nil

### `sittable(inst, doer, actions, right)`
* **Description:** Adds SITON action for sittable entities that are not fire.
* **Parameters:**
  - `inst` -- Sit-able entity with cansit tag; not valid if fire.
  - `doer` -- Entity attempting to sit; not used in logic here.
  - `actions` -- Table to append ACTIONS.SITON if cansit and not fire.
  - `right` -- Boolean; present in signature but not used in this handler.
* **Returns:** nil

### `sleepingbag(inst, doer, actions)`
* **Description:** Adds SLEEPIN action for players (non-insomniac) using sleeping bags that are not hassleeper.
* **Parameters:**
  - `inst` -- Sleeping bag entity; must not be hassleeper and optionally not spiderden (unless spiderwhisperer).
  - `doer` -- Player entity that is not insomniac; must be player and not insomniac, and the sleepingbag must not have hassleeper tag.
  - `actions` -- Table to append ACTIONS.SLEEPIN if conditions are met.
* **Returns:** nil

### `snowmandecoratable(inst, doer, actions, right)`
* **Description:** Adds DECORATESNOWMAN action for heavy lifting doers decorating snowmen with decoratable items.
* **Parameters:**
  - `inst` -- Snowman entity; must not be waxedplant, and doer must be heavy lifting and have snowmandecoratable component on equipped item.
  - `doer` -- Entity performing the action; must be heavy lifting and hold a decor item with snowmandecoratable component.
  - `actions` -- Table to append ACTIONS.DECORATESNOWMAN if conditions are met.
  - `right` -- Boolean; only right-clicks attempt decoration.
* **Returns:** nil

### `spellbook(inst, doer, actions, right)`
* **Description:** Adds USESPELLBOOK or CLOSESPELLBOOK actions for spellbook entities based on usage eligibility and HUD state.
* **Parameters:**
  - `inst` -- Spellbook entity; must not be inventory item, and must satisfy SpellBook:CanBeUsedBy(doer), with no opened container on mount.
  - `doer` -- Entity attempting to use the spellbook; must meet spellbook restrictions and have no active item in hand.
  - `actions` -- Table to append either USESPELLBOOK or CLOSESPELLBOOK depending on HUD state and usage conditions.
  - `right` -- Boolean; only right-clicks attempt spellbook usage/close.
* **Returns:** nil

### `steeringwheel(inst, doer, actions)`
* **Description:** Adds STEER_BOAT action if the steering wheel is not occupied or on fire.
* **Parameters:**
  - `inst` -- Steering wheel entity; must not be occupied or fire.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.STEER_BOAT if not occupied or fire.
* **Returns:** nil

### `stewer(inst, doer, actions, right)`
* **Description:** Adds COOK or HARVEST actions for stewer entities based on cooking progress and container state.
* **Parameters:**
  - `inst` -- Stewer entity (e.g., pot, cauldron); must not be burnt, and container state is checked for cooking readiness.
  - `doer` -- Entity performing the action; must not be riding for cooking actions.
  - `actions` -- Table to append COOK or HARVEST depending on cooking state and container conditions.
  - `right` -- Boolean; right-click needed for COOK action.
* **Returns:** nil

### `stageactingprop(inst, doer, actions, right)`
* **Description:** Adds PERFORM action for stageactingprop entities if the actor is present and no play is in progress.
* **Parameters:**
  - `inst` -- Stageactingprop entity with play_in_progress and stageactor tags checked.
  - `doer` -- Entity with stageactor tag performing the action.
  - `actions` -- Table to append ACTIONS.PERFORM if stageactingprop and not in progress.
  - `right` -- Boolean; only right-clicks attempt performance.
* **Returns:** nil

### `storytellingprop(inst, doer, actions, right)`
* **Description:** Adds TELLSTORY action for storytelling props when storyteller doer interacts correctly.
* **Parameters:**
  - `inst` -- Storytelling prop entity; must have storytellingprop and storyteller on doer; special logic for portable_campfire use.
  - `doer` -- Entity with storyteller tag; must match right/wantsleft logic to trigger action.
  - `actions` -- Table to append ACTIONS.TELLSTORY if conditions are met.
  - `right` -- Boolean; used in logic to differentiate portable_campfire stories.
* **Returns:** nil

### `talkable(inst, doer, actions)`
* **Description:** Adds TALKTO action for entities that have the maxwellnottalking tag.
* **Parameters:**
  - `inst` -- Talkable entity (e.g., maxwell) that must have maxwellnottalking tag to be talked to.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.TALKTO if maxwellnottalking tag is present.
* **Returns:** nil

### `teleporter(inst, doer, actions, right)`
* **Description:** Adds JUMPIN or TELEPORT actions for teleporter entities based on tag combination and doer state.
* **Parameters:**
  - `inst` -- Teleporter entity; must have teleporter tag and not be townportal/vault_teleporter unless right-click and not channeling.
  - `doer` -- Entity attempting to teleport; must not be channeling for teleport actions.
  - `actions` -- Table to append either JUMPIN or TELEPORT depending on tags and state.
  - `right` -- Boolean; required for TELEPORT but not for JUMPIN.
* **Returns:** nil

### `trap(inst, doer, actions)`
* **Description:** Adds CHECKTRAP action for traps that have sprung.
* **Parameters:**
  - `inst` -- Trap entity that must have trapsprung tag to be checked.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.CHECKTRAP if trapsprung tag is present.
* **Returns:** nil

### `trophyscale(inst, doer, actions, right)`
* **Description:** Adds COMPARE_WEIGHABLE or REMOVE_FROM_TROPHYSCALE actions for trophyscale entities depending on item and tags.
* **Parameters:**
  - `inst` -- Trophyscale entity; must have appropriate trophyscale_ or trophycanbetaken tags, and doer must be heavy lifting for weighable actions.
  - `doer` -- Entity performing the action; must be heavy lifting and wield a matching weighable item for compare weigh action; else may remove item if trophycanbetaken.
  - `actions` -- Table to append either COMPARE_WEIGHABLE or REMOVE_FROM_TROPHYSCALE depending on state.
  - `right` -- Boolean; required for both weighable and removal actions.
* **Returns:** nil

### `unwrappable(inst, doer, actions, right)`
* **Description:** Adds UNWRAP action for entities marked unwrappable on right-click.
* **Parameters:**
  - `inst` -- Unwrappable entity; must have unwrappable tag to be unwrapped.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.UNWRAP if unwrappable tag is present.
  - `right` -- Boolean; only right-clicks unwrap.
* **Returns:** nil

### `walkingplank(inst, doer, actions, right)`
* **Description:** Adds plank-related actions (EXTEND, RETRACT, MOUNT, ABANDON_SHIP) depending on plank state and doer tag.
* **Parameters:**
  - `inst` -- Walking plank entity with interactable, plank_extended, or on_walkable_plank tags used to determine action.
  - `doer` -- Entity attempting to interact; on_walkable_plank triggers ABANDON_SHIP, else plank state determines EXTEND/RETRACT or MOUNT.
  - `actions` -- Table to append EXTEND_PLANK, RETRACT_PLANK, MOUNT_PLANK, or ABANDON_SHIP based on plank and doer tags.
  - `right` -- Boolean; controls action direction (right = extend/retract, left = mount) except for ABANDON_SHIP.
* **Returns:** nil

### `wardrobe(inst, doer, actions, right)`
* **Description:** Adds CHANGEIN action for wardrobe entities that are not fire.
* **Parameters:**
  - `inst` -- Wardrobe entity; must have wardrobe tag, not fire, and optionally not dressable for left-click access.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.CHANGEIN if wardrobe and not fire.
  - `right` -- Boolean; influences dressable behavior but not strictly required.
* **Returns:** nil

### `writeable(inst, doer, actions)`
* **Description:** Adds WRITE action for entities marked writeable.
* **Parameters:**
  - `inst` -- Writeable entity; must have writeable tag to be written on.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.WRITE if writeable tag is present.
* **Returns:** nil

### `winch(inst, doer, actions, right)`
* **Description:** Adds UNLOAD_WINCH action for winches with takeshelfitem tag on right-click.
* **Parameters:**
  - `inst` -- Winch entity with takeshelfitem tag to trigger UNLOAD_WINCH action.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.UNLOAD_WINCH if takeshelfitem tag is present.
  - `right` -- Boolean; only right-clicks unload.
* **Returns:** nil

### `wintersfeasttable(inst, doer, actions, right)`
* **Description:** Adds WINTERSFEAST_FEAST action for winter's feast tables that are ready and not burning.
* **Parameters:**
  - `inst` -- WINTER'S FEAST table; must be readyforfeast and not fire/burnt.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.WINTERSFEAST_FEAST if conditions are met.
  - `right` -- Boolean; only right-clicks start feast.
* **Returns:** nil

### `wobycourier(inst, doer, actions, right)`
* **Description:** Adds WHISTLE action for woby entities under specific playercontroller and whistle conditions.
* **Parameters:**
  - `inst` -- Woby entity; must be the same as doer, have playercontroller, be not client-attached, and have whistle action.
  - `doer` -- Entity performing the action; must be inst (i.e., woby) and satisfy whistle-related checks.
  - `actions` -- Table to append ACTIONS.WHISTLE if all conditions are met.
  - `right` -- Boolean; only right-clicks trigger whistle.
* **Returns:** nil

### `worldmigrator(inst, doer, actions)`
* **Description:** Adds MIGRATE action for entities marked migrator.
* **Parameters:**
  - `inst` -- Entity with migrator tag to trigger migration action.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.MIGRATE if migrator tag is present.
* **Returns:** nil

### `yotb_sewer(inst, doer, actions, right)`
* **Description:** Adds YOTB_SEW action for sewer entities that are ready or have full opened containers.
* **Parameters:**
  - `inst` -- YOTB Sewer entity; must not be burnt, and not ridden; readytosew or full container with doer opening state triggers action.
  - `doer` -- Entity performing the action; must meet container opening conditions.
  - `actions` -- Table to append ACTIONS.YOTB_SEW if readytosew or container is full and opened by doer.
  - `right` -- Boolean; only right-clicks sew.
* **Returns:** nil

### `yotb_stager(inst, doer, actions, right)`
* **Description:** Adds YOTB_STARTCONTEST or INTERACT_WITH actions for YOTB stager entities based on tags.
* **Parameters:**
  - `inst` -- YOTB Stager entity; must have yotb_conteststartable tag (event active) or has_prize to trigger actions.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.YOTB_STARTCONTEST or ACTIONS.INTERACT_WITH depending on tags.
* **Returns:** nil

### `yotc_racecompetitor(inst, doer, actions, right)`
* **Description:** Adds PICKUP action for living race competitors with prize status.
* **Parameters:**
  - `inst` -- Race competitor entity; must have has_prize or has_no_prize and not be dead.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.PICKUP if has_prize/no_prize and alive.
* **Returns:** nil

### `yotc_racestart(inst, doer, actions, right)`
* **Description:** Adds START_CARRAT_RACE action for race start points that are not currently in use or burnt.
* **Parameters:**
  - `inst` -- Race start entity; must not be burnt, fire, or race_on to start the race.
  - `doer` -- Entity performing the action; not used in logic here.
  - `actions` -- Table to append ACTIONS.START_CARRAT_RACE if not in use or burnt.
* **Returns:** nil

### `apprisable(inst, doer, target, actions)`
* **Description:** Adds APPRAISE action for items used on targets with appraiser tag.
* **Parameters:**
  - `inst` -- Item being used; must have appraisable tag and target has appraiser tag to appraise.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Target entity that must have appraiser tag to be appraised.
  - `actions` -- Table to append ACTIONS.APPRAISE if target is appraisable.
* **Returns:** nil

### `bait(inst, doer, target, actions)`
* **Description:** Adds BAIT action for targets that have canbait tag.
* **Parameters:**
  - `inst` -- Item used as bait; not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity (e.g., fishing spot) with canbait tag that accepts bait.
  - `actions` -- Table to append ACTIONS.BAIT if target has canbait.
* **Returns:** nil

### `bathbomb(inst, doer, target, actions)`
* **Description:** Adds BATHBOMB action if inst is bathbomb and target is bathbombable.
* **Parameters:**
  - `inst` -- Item with bathbomb tag used to bathbomb target.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with bathbombable tag to receive bathbomb effect.
  - `actions` -- Table to append ACTIONS.BATHBOMB if both items have required tags.
* **Returns:** nil

### `batteryuser(inst, doer, target, actions, right)`
* **Description:** Adds CHARGE_FROM action for batteryuser items used on battery targets on right-click.
* **Parameters:**
  - `inst` -- Item with batteryuser tag that can use battery power.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with battery tag that can be charged from.
  - `actions` -- Table to append ACTIONS.CHARGE_FROM if both have batteryuser and battery tags.
  - `right` -- Boolean; only right-clicks charge.
* **Returns:** nil

### `bedazzler(inst, doer, target, actions)`
* **Description:** Adds BEDAZZLE action for spiderwhisperer doers using items on non-bedazzled spider dens.
* **Parameters:**
  - `inst` -- Item with bedazzler capability; not used in logic here but signature per USEITEM.
  - `doer` -- Entity with spiderwhisperer tag performing the action.
  - `target` -- Entity with spiderden, bedazzleable, and not bedazzled tags.
  - `actions` -- Table to append ACTIONS.BEDAZZLE if all spider den conditions are met.
* **Returns:** nil

### `boatpatch(inst, doer, target, actions)`
* **Description:** Adds REPAIR_LEAK action for boat_patch items used on boat_leak targets.
* **Parameters:**
  - `inst` -- Item with boat_patch tag used to patch leaks.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with boat_leak tag to be patched.
  - `actions` -- Table to append ACTIONS.REPAIR_LEAK if both have boat_patch and boat_leak tags.
* **Returns:** nil

### `bottler(inst, doer, target, actions)`
* **Description:** Adds BOTTLE action for targets that can be bottled.
* **Parameters:**
  - `inst` -- Bottler item; not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with canbebottled tag to be bottled.
  - `actions` -- Table to append ACTIONS.BOTTLE if target has canbebottled.
* **Returns:** nil

### `brush(inst, doer, target, actions, right)`
* **Description:** Adds BRUSH action for brushable targets on left-click.
* **Parameters:**
  - `inst` -- Brush item; not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with brushable tag that can be brushed.
  - `actions` -- Table to append ACTIONS.BRUSH if target is brushable and not right-clicked.
  - `right` -- Boolean; brush action only on left-click (right=false).
* **Returns:** nil

### `carnivalgameitem(inst, doer, target, actions, right)`
* **Description:** Adds CARNIVALGAME_FEED action for feeding chicks nest targets with appropriate items.
* **Parameters:**
  - `inst` -- Item used in carnival game; must match target to feed chicks nest.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with carnivalgame_canfeed tag and specific prefab 'carnivalgame_feedchicks_nest'.
* **Returns:** nil

### `cookable(inst, doer, target, actions)`
* **Description:** Adds COOK action for cookable targets on cooker entities, respecting fuel, rider, and chef tags.
* **Parameters:**
  - `inst` -- Cooker entity (e.g., campfire) used to cook target; must not be fueldepleted, and expert chef tag required for dangerouscooker.
  - `doer` -- Entity performing the action; must not be riding unless target is grandowner.
* **Returns:** nil

### `constructionplans(inst, doer, target, actions)`
* **Description:** Adds CONSTRUCT action if the item has construction plans matching the target's prefab.
* **Parameters:**
  - `inst` -- Item with construction plans (e.g., 'tent_plans') matching target's prefab.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity whose prefab matches the plans item (e.g., inst:HasTag('tent_plans') and target.prefab == 'tent').
* **Returns:** nil

### `cooker(inst, doer, target, actions)`
* **Description:** Adds COOK action for cookable targets when used with cooker entities, respecting fuel, rider, and ownership.
* **Parameters:**
  - `inst` -- Cooker entity (e.g., fire) used to cook target; must not be fueldepleted, and target must be cookable and not fire/catchable.
* **Returns:** nil

### `deckcontainer(inst, doer, target, actions)`
* **Description:** Adds ADD_CARD_TO_DECK action if the target accepts deck cards (e.g., for playing cards).
* **Parameters:**
  - `inst` -- Item with playingcard or deckcontainer tag to add to deck.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Target entity with playingcard or deckcontainer tag that accepts cards.
* **Returns:** nil

### `drawingtool(inst, doer, target, actions)`
* **Description:** Adds DRAW action for drawable targets using drawing tools.
* **Parameters:**
  - `inst` -- Drawing tool item used to draw on target; not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with drawable tag to be drawn on.
* **Returns:** nil

### `dryable(inst, doer, target, actions)`
* **Description:** Adds DRY action for dryable items used on candry targets, provided they are not burnt.
* **Parameters:**
  - `inst` -- Item with dryable tag used to dry target; must not be burnt.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with candry tag to be dried.
* **Returns:** nil

### `edible(inst, doer, target, actions, right)`
* **Description:** Adds FEED, FEEDPLAYER, or ADDCOMPOSTABLE actions depending on food type matching and game rules.
* **Parameters:**
  - `inst` -- Edible item with edible_* tags matched against target's eater tags, for feeding players, livestock, or composting.
  - `doer` -- Entity performing the action; must meet rider and PVP/food safety conditions for FEEDPLAYER.
* **Returns:** nil

### `erasablepaper(inst, doer, target, actions)`
* **Description:** Adds ERASE_PAPER action for erasable paper targets that are not fire or burnt.
* **Parameters:**
  - `inst` -- Item used to erase paper; not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with papereraser tag that is not fire or burnt.
* **Returns:** nil

### `fan(inst, doer, target, actions)`
* **Description:** Adds FAN action unconditionally when fan item is used.
* **Parameters:**
  - `inst` -- Fan item used to fan target; not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Target entity; not used in logic here (action always added).
* **Returns:** nil

### `farmplantable(inst, doer, target, actions)`
* **Description:** Adds PLANTSOIL action for farmplantable items used on soil targets.
* **Parameters:**
  - `inst` -- Farmable item (e.g., seed) to plant on target.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with soil tag that is not NOCLICK; must be plantable ground.
* **Returns:** nil

### `fertilizer(inst, doer, target, actions)`
* **Description:** Adds FERTILIZE action for various target types (crops, barren, fertile, etc.) or self if self_fertilizable.
* **Parameters:**
  - `inst` -- Fertilizer item; may have self_fertilizable tag for self-applying (e.g., doer == target).
  - `doer` -- Entity performing the action; must be riding-safe and satisfy self_fertilizable conditions.
* **Returns:** nil

### `fillable(inst, doer, target, actions)`
* **Description:** Adds FILL action for fillable items used on water source targets.
* **Parameters:**
  - `inst` -- Item with fillable tag (e.g., bucket) used to fill from target.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with watersource tag to provide water.
* **Returns:** nil

### `fishingrod(inst, doer, target, actions)`
* **Description:** Adds FISH or REEL action depending on fishing rod state and target match.
* **Parameters:**
  - `inst` -- Fishing rod item; must have fishable target, not already caught fish, and check target match or fishing state.
* **Returns:** nil

### `forcecompostable(inst, doer, target, actions)`
* **Description:** Adds ADDCOMPOSTABLE action for force compostable items used on compost bins.
* **Parameters:**
  - `inst` -- Force compostable item (e.g., certain organic waste); not used in logic here but signature per USEITEM.
  - `doer` -- Entity performing the action; not used in logic here.
  - `target` -- Entity with compostingbin_accepts_items tag to receive force compost.
* **Returns:** nil

### `forgerepair(inst, doer, target, actions, right)`
* **Description:** Checks if the target is repairable using the same material as the inst, and inserts ACTIONS.REPAIR if conditions (floater, rider, lifting) are met and a match is found.
* **Parameters:**
  - `inst` -- The entity owning this action handler (typically an item).
  - `doer` -- The entity performing the action (usually the player).
  - `target` -- The entity being acted upon.
  - `actions` -- Mutable table into which valid actions are inserted.
  - `right` -- Boolean indicating if the action was triggered by right-click; required for correctness in this function.
* **Returns:** nil
* **Error states:** Returns early if target is floating, or if doer is riding and target isn't owned by doer, or if doer is heavy-lifting.

### `fuel(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.ADDFUEL or ACTIONS.ADDWETFUEL if inst is a valid fuel type and target accepts it, with special handling for wet fuel and stew-related exclusions.
* **Parameters:**
  - `inst` -- The fuel item (e.g., torch, lantern).
  - `doer` -- The entity performing the fueling (usually the player).
  - `target` -- The entity that accepts fuel (e.g., campfire, lantern).
  - `actions` -- Mutable table into which valid actions are inserted.
* **Returns:** nil
* **Error states:** Returns early if doer is riding and target is not owned by doer; also skips if inst is spoiled_food and certain Quagmire stew conditions are met.

### `furnituredecor(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is a furniture decortaker.
* **Parameters:**
  - `inst` -- The decor item to give (e.g., painting, rug).
  - `doer` -- The player giving the decor.
  - `target` -- The furniture piece that accepts decor.
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `ghostlyelixir(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.APPLYELIXIR if target can drink elixirs.
* **Parameters:**
  - `inst` -- The elixir item.
  - `doer` -- The player using the elixir.
  - `target` -- The entity to receive the elixir (must be elixir_drinker).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `gravedigger(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GRAVEDIG if doer has the gravedigger_user tag and target is gravediggable.
* **Parameters:**
  - `inst` -- The grave-digging tool (e.g., shovel).
  - `doer` -- The player using the tool (must be gravedigger_user).
  - `target` -- The grave or ground to dig (must be gravediggable).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `halloweenpotionmoon(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.HALLOWEENMOONMUTATE if target is not a DECOR entity.
* **Parameters:**
  - `inst` -- The Halloween potion moon item.
  - `doer` -- The player using the potion.
  - `target` -- The target entity; should not have DECOR tag for mutation to occur.
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `healer(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.HEAL if target is healable and not being ridden (with special logic for mounted doer or owner checks).
* **Parameters:**
  - `inst` -- The healing item or tool (e.g., bandage, health elixir).
  - `doer` -- The player performing healing.
  - `target` -- The entity to heal; must have health component and be healable or have healerbuffs tag.
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Returns early if target is not healable or if mounted conditions fail ownership check.

### `inventoryitem(inst, doer, target, actions, right)`
* **Description:** Handles complex inventory interactions: storing, bundling, constructing, giving to players/ghosts, trading, boat cannon loading, and more—based on tags, container state, ownership, and game mode settings.
* **Parameters:**
  - `inst` -- The inventory item to store, give, or equip.
  - `doer` -- The player attempting the action.
  - `target` -- The target container, player, or holder entity.
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean indicating if right-click initiated action; affects GIVETOPLAYER logic.
* **Returns:** nil
* **Error states:** Multiple early returns: pocket-only items, non-grand-owner items, mounted storage restrictions, fuel/decon conflict, etc.

### `itemweigher(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.WEIGH_ITEM if inst matches a trophy scale type and target is weighable and owned by doer.
* **Parameters:**
  - `inst` -- The weighing scale (must have a tropyscale_`<type>` tag).
  - `doer` -- The player using the scale.
  - `target` -- The item to weigh (must have weighable_`<type>` tag and owner match).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `key(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.UNLOCK if target has a matching lock type and inst has the corresponding key type.
* **Parameters:**
  - `inst` -- The key item (must have a locktype_key tag).
  - `doer` -- The player unlocking the target.
  - `target` -- The locked entity (must have locktype_lock tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `klaussackkey(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.USEKLAUSSACKKEY if target is lockable and doer is not riding without proper ownership.
* **Parameters:**
  - `inst` -- The Klaussack key item.
  - `doer` -- The player using the key.
  - `target` -- The target with klaussacklock tag (e.g., Klaussack).
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Returns early if doer is riding and does not own target.

### `lighter(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.LIGHT if target can be lit and is not burnt/fueldepleted (unless exempt) or INLIMBO.
* **Parameters:**
  - `inst` -- The lighter item (e.g., flint, lighter).
  - `doer` -- The player using the lighter.
  - `target` -- The target to light (must have canlight tag and not be burnt/fueldepleted or fire).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `maprecorder(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.TEACH if doer and target are the same player.
* **Parameters:**
  - `inst` -- The map recorder item (e.g., blank map).
  - `doer` -- The player performing the action (must be same as target).
  - `target` -- The player entity to teach (must be a player).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `maxhealer(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.HEAL if target can be healed and owner/mounting conditions allow (similar logic to healer but only checks CanHeal).
* **Parameters:**
  - `inst` -- The max-heal item or tool.
  - `doer` -- The player performing the heal.
  - `target` -- The entity to heal (must have health component and be healable).
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Returns early if target is not healable or fails mounting ownership check.

### `moonrelic(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is moontrader and doer is not riding.
* **Parameters:**
  - `inst` -- The moon relic item (e.g., trinket).
  - `doer` -- The player offering the relic.
  - `target` -- The moon trader entity (must have moontrader tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Returns early if doer is riding.

### `occupier(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.STORE if target matches the occupier type, with rider/ownership restrictions for mounted use.
* **Parameters:**
  - `inst` -- The occupier item (e.g., seat, bed) with an OCCUPANTTYPE tag.
  - `doer` -- The player trying to place the occupier.
  - `target` -- The occupiable entity (e.g., chair with occupiable_`<type>` tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `oceanfishingrod(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.OCEAN_FISHING_POND if target has the fishable tag.
* **Parameters:**
  - `inst` -- The ocean fishing rod item.
  - `doer` -- The player fishing.
  - `target` -- The target area or entity to fish in (must have fishable tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `plantable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.PLANT if target is fertile or fully fertile.
* **Parameters:**
  - `inst` -- The seed or plant item to place.
  - `doer` -- The player planting.
  - `target` -- The fertile ground (must have fertile or fullfertile tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `playbill(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is a playbill_lecturn.
* **Parameters:**
  - `inst` -- The playbill item to give.
  - `doer` -- The player giving the playbill.
  - `target` -- The playbill_lecturn entity (e.g., a stand).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `playingcard(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.ADD_CARD_TO_DECK if target is a deck or card.
* **Parameters:**
  - `inst` -- The playing card to add.
  - `doer` -- The player adding the card.
  - `target` -- The deck container or another card (must have playingcard or deckcontainer tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `pocketwatch(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.CAST_POCKETWATCH if the watch is inactive, doer can cast, target is valid, and mounting is allowed or the watch allows mounted casting.
* **Parameters:**
  - `inst` -- The pocketwatch item (must be inactive and have CanTarget function).
  - `doer` -- The player casting (must have pocketwatchcaster tag).
  - `target` -- The valid target entity for the pocketwatch spell.
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Returns early if watch is active, doer can't cast, target fails validation, or mounting is restricted.

### `pocketwatch_dismantler(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.DISMANTLE_POCKETWATCH if doer is a clockmaker and target is a pocketwatch.
* **Parameters:**
  - `inst` -- The dismantler tool (must be held by a clockmaker).
  - `doer` -- The player dismantling (must have clockmaker tag).
  - `target` -- The pocketwatch to dismantle (must have pocketwatch tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `preservative(inst, doer, target, actions, right)`
* **Description:** Inserts ACTIONS.APPLYPRESERVATIVE if right-click, target is non-deployable/animal food with freshness tags.
* **Parameters:**
  - `inst` -- The preservative item (e.g., saltpeter).
  - `doer` -- The player applying the preservative.
  - `target` -- The item to preserve (must be fresh/stale/spoiled, cookable, not deployable or smallcreature).
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; must be true for preservative action to apply.
* **Returns:** nil
* **Error states:** Returns early unless right==true or target has health or invalid tags.

### `pumpkincarver(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.CARVEPUMPKIN if target is a pumpkincarvable entity or an unequipped, non-floating pumpkinhatcarvable entity.
* **Parameters:**
  - `inst` -- The carving tool (e.g., knife).
  - `doer` -- The player carving.
  - `target` -- The pumpkin or pumpkin hat (must have pumpkincarvable or pumpkinhatcarvable component).
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Does not insert action if pumpkinhat is equipped or floating.

### `quagmire_installable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.INSTALL if target has the installations tag.
* **Parameters:**
  - `inst` -- The installable item (e.g., machine part).
  - `doer` -- The player installing.
  - `target` -- The installations entity (must have installations tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_plantable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.PLANTSOIL if target has the soil tag.
* **Parameters:**
  - `inst` -- The seed or plant to place in soil.
  - `doer` -- The player planting.
  - `target` -- The soil tile (must have soil tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_portalkey(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is quagmire_altar.
* **Parameters:**
  - `inst` -- The portal key item.
  - `doer` -- The player using the key.
  - `target` -- The quagmire_altar (portal site).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_replatable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.REPLATE if target is a quagmire_replater.
* **Parameters:**
  - `inst` -- The replatable item (e.g., pattern).
  - `doer` -- The player replacing.
  - `target` -- The replater (must have qu
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_replater(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.REPLATE if target is quagmire_replatable.
* **Parameters:**
  - `inst` -- The replater item (e.g., item slot).
  - `doer` -- The player replacing.
  - `target` -- The replatable entity (must have quagmire_replatable tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_salter(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.SALT if target is quagmire_saltable.
* **Parameters:**
  - `inst` -- The salter item (e.g., salt heap).
  - `doer` -- The player salting.
  - `target` -- The entity to salt (must have quagmire_saltable tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_saltextractor(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.INSTALL if target is saltpond.
* **Parameters:**
  - `inst` -- The salt extractor tool or item.
  - `doer` -- The player installing/extracting.
  - `target` -- The saltpond entity (must have saltpond tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_slaughtertool(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.SLAUGHTER if target is alive and can be slaughtered.
* **Parameters:**
  - `inst` -- The slaughter tool (e.g., knife).
  - `doer` -- The player slaughtering.
  - `target` -- The entity to slaughter (must have canbeslaughtered tag and not be dead).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_stewable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is quagmire_altar.
* **Parameters:**
  - `inst` -- The stewable item (e.g., raw stew ingredient).
  - `doer` -- The player offering stew.
  - `target` -- The quagmire_altar (must have quagmire_altar tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_stewer(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is quagmire_cookwaretrader.
* **Parameters:**
  - `inst` -- The stew item or tool (not used directly here).
  - `doer` -- The player trading stew.
  - `target` -- The quagmire_cookwaretrader entity (must have quagmire_cookwaretrader tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `quagmire_tapper(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.TAPTREE if target is tappable and not fire/burnt.
* **Parameters:**
  - `inst` -- The tapper tool or item (e.g., spile).
  - `doer` -- The player tapping.
  - `target` -- The tappable tree (must have tappable tag and not be fire or burnt).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `recipescanner(inst, doer, target, actions, right)`
* **Description:** Inserts ACTIONS.TEACH if target has a valid, non-excluded recipe (not nounlock or no_deconstruction).
* **Parameters:**
  - `inst` -- The recipe scanner item.
  - `doer` -- The player scanning.
  - `target` -- The target with a SCANNABLE_RECIPENAME or valid recipe in AllRecipes.
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; not used in this chunk's function body.
* **Returns:** nil

### `repairer(inst, doer, target, actions, right)`
* **Description:** Inserts ACTIONS.REPAIR if target has matching repair tags and tool constraints (e.g., material match, rider/owner checks) are satisfied.
* **Parameters:**
  - `inst` -- The repair tool or material item (e.g., worktool, health material, freshen tool, finiteuses material).
  - `doer` -- The player repairing.
  - `target` -- The target with repairable_`<material>` tag (and optional work/health/freshen/finiteuses tags).
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; must be true for action.
* **Returns:** nil
* **Error states:** Returns early if right==false, or if doer is riding without ownership, or heavy-lifting.

### `saddler(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.SADDLE if target can be saddled and is not restricted to dog riders.
* **Parameters:**
  - `inst` -- The saddle item.
  - `doer` -- The player saddling.
  - `target` -- The animal (must have saddleable tag and not be dogrider_only).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `sewing(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.SEW if target needs sewing and doer is not riding without ownership.
* **Parameters:**
  - `inst` -- The sewing tool or needle item.
  - `doer` -- The player sewing.
  - `target` -- The item needing sewing (must have needssewing tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil
* **Error states:** Returns early if doer is riding and does not own target.

### `shaver(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.SHAVE for bearded targets (excluding non-spiderwhisperers from spider dens) or ACTIONS.PEEKBUNDLE for unwrappable bundles.
* **Parameters:**
  - `inst` -- The shaver tool (e.g., razor).
  - `doer` -- The player shaving.
  - `target` -- The entity with bearded tag (e.g., beard, bundle) or unwrappable+canpeek bundle.
* **Returns:** nil
* **Error states:** Returns early for bearded spider dens if doer is not spiderwhisperer, or for fire-smolder targets.

### `smotherer(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.SMOTHER for smolder targets or ACTIONS.MANUALEXTINGUISH for fire if inst is frozen and target is fire but not held.
* **Parameters:**
  - `inst` -- The smotherer item (e.g., blanket or frozen item).
  - `doer` -- The player smothering/extinguishing.
  - `target` -- The smoldering or fire entity; for manual extinguish, must be fire and not held.
* **Returns:** nil

### `snowmandecor(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.DECORATESNOWMAN if target is a snowman and doer is not heavy-lifting.
* **Parameters:**
  - `inst` -- The decoration item (e.g., carrot, coal).
  - `doer` -- The player decorating (must not be heavy-lifting).
  - `target` -- The snowman (must have snowmandecoratable component, heavy tag, not waxedplant).
* **Returns:** nil

### `snowmandecoratable(inst, doer, target, actions, right)`
* **Description:** Inserts ACTIONS.DECORATESNOWMAN if right-click and target has snowmandecoratable component (e.g., for stacking snowballs).
* **Parameters:**
  - `inst` -- The snowman decoration item.
  - `doer` -- The player stacking or decorating (must not be heavy-lifting).
  - `target` -- The snowman (must have snowmandecoratable component, not waxedplant; right must be true).
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; must be true to trigger decoration action (also used for stacking small throwable snowballs).
* **Returns:** nil

### `soul(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.EAT if doer and target are the same and target has souleater tag.
* **Parameters:**
  - `inst` -- The soul item (e.g., ghost orb).
  - `doer` -- The player soul-eating (must be same as target and have souleater tag).
  - `target` -- The soul (must be same as doer and have souleater tag).
  - `actions` -- Mutable table for actions.
* **Returns:** nil

### `spidermutator(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.MUTATE_SPIDER if target is a living spider.
* **Parameters:**
  - `inst` -- The mutator item (e.g., spider gland).
  - `doer` -- The player mutating.
  - `target` -- The spider (must have spider tag and not be dead).
* **Returns:** nil

### `stackable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.COMBINESTACK if stackable skin hack passes, target is not full, owned by doer, and not held.
* **Parameters:**
  - `inst` -- The stackable item attempting to combine (e.g., logs, rocks).
  - `doer` -- The player combining stacks (not used directly in this function).
  - `target` -- The target stack (must match prefab, be non-full, owned, and not held).
* **Returns:** nil

### `summoningitem(inst, doer, target, actions, right)`
* **Description:** Inserts ACTIONS.CASTUNSUMMON if target is Abigail, owned by doer, and doer is a ghostfriend_summoned player.
* **Parameters:**
  - `inst` -- The summoning item (e.g., Abigail's item).
  - `doer` -- The player casting (must have ghostfriend_summoned tag and be leader of target abigail).
  - `target` -- The summoned entity (must be Abigail, not in limbo, and owned by doer).
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; not used in this function body.
* **Returns:** nil

### `tacklesketch(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE_TACKLESKETCH if target is tacklestation and not burning.
* **Parameters:**
  - `inst` -- The tackle sketch item.
  - `doer` -- The player giving the sketch.
  - `target` -- The tackle station (must have tacklestation tag and not be fire/smolder).
* **Returns:** nil

### `teacher(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.TEACH if doer==target and target has builder component (e.g., learned recipe book).
* **Parameters:**
  - `inst` -- The book or note with recipes to teach (not used directly).
  - `doer` -- The player teaching (must be same as target and have builder component).
  - `target` -- The player to teach (must have builder component and be same as doer).
* **Returns:** nil

### `tool(inst, doer, target, actions, right)`
* **Description:** Inserts tool-specific actions (e.g., ACTIONS.MINE, ACTIONS.CHOP) based on tool tags and target's action validity; also handles Lunar buildup removal.
* **Parameters:**
  - `inst` -- The tool item (e.g., pickaxe, axe, hammer).
  - `doer` -- The player using the tool (must not be restricted).
  - `target` -- The entity to act upon (must not be INLIMBO).
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; used for tool action validation via target:IsActionValid(ACTIONS[k], right).
* **Returns:** nil
* **Error states:** Returns early for restricted equippable items or INLIMBO targets.

### `tradable(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.GIVE if target is a valid trader and doer is not riding without ownership.
* **Parameters:**
  - `inst` -- The tradable item (not used directly in this function body).
  - `doer` -- The player trading (must not be riding without ownership if target is not grand-owner).
  - `target` -- The trader entity (must have trader tag, not be player/ghost, and satisfy rider/owner constraints).
* **Returns:** nil
* **Error states:** Returns early if target is player/ghost, or if doer is riding without owning target.

### `treegrowthsolution(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.ADVANCE_TREE_GROWTH if target is a valid tree type.
* **Parameters:**
  - `inst` -- The tree growth solution item.
  - `doer` -- The player applying the solution.
  - `target` -- The tree (must have tree tag and not be monster/fire/burnt/stump/leif/no_force_grow).
* **Returns:** nil

### `unsaddler(inst, doer, target, actions, right)`
* **Description:** Inserts ACTIONS.UNSADDLE if target is saddled and action is left-click (right==false).
* **Parameters:**
  - `inst` -- The unsaddler tool (e.g., hand).
  - `doer` -- The player unsaddling.
  - `target` -- The saddled entity (must have saddled tag).
  - `actions` -- Mutable table for actions.
  - `right` -- Boolean; must be false for unsaddler action (i.e., left-click).
* **Returns:** nil

### `upgrader(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.UPGRADE if inst, doer, and target share matching upgrade type tags.
* **Parameters:**
  - `inst` -- The upgrade tool with upgrade type tags (e.g., tech_upgrader).
  - `doer` -- The player upgrading (must have upgrade user tag, e.g., tech_upgradeuser).
  - `target` -- The upgradeable entity (must have upgradeable tag, e.g., tech_upgradeable).
* **Returns:** nil

### `useabletargeteditem(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.USEITEMON if target is valid and mounting is allowed (or item is mounted-enabled).
* **Parameters:**
  - `inst` -- The item to use on target (must not be inuse_targeted and satisfy validity function or tag match).
  - `doer` -- The player using the item (must satisfy mounting constraints).
  - `target` -- The target entity; must satisfy UseableTargetedItem_ValidTarget or have matching _targeter tag.
* **Returns:** nil
* **Error states:** Returns early if item is inuse_targeted, target is invalid, or item does not allow mounted use and doer is riding.

### `vasedecoration(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.DECORATEVASE if target is a vase and doer satisfies rider/ownership constraints.
* **Parameters:**
  - `inst` -- The vase decoration item (must have vasedecoration tag).
  - `doer` -- The player decorating (must not be riding without ownership if target not owned).
  - `target` -- The vase (must have vase tag and satisfy rider/ownership checks).
* **Returns:** nil
* **Error states:** Returns early if doer is riding and does not own target.

### `watersource(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.FILL if target has the fillable tag.
* **Parameters:**
  - `inst` -- The water container (e.g., bucket, waterskin).
  - `doer` -- The player filling the container.
  - `target` -- The fillable entity (must have fillable tag, e.g., water source).
* **Returns:** nil

### `wax(inst, doer, target, actions)`
* **Description:** Inserts ACTIONS.WAX if target is waxable and waxspray needs match between inst and target.
* **Parameters:**
  - `inst` -- The wax item (e.g., wax spray or candle).
  - `doer` -- The player waxing.
  - `target` -- The entity to wax (must have waxable tag and needswaxspray status must match inst's waxspray tag).
* **Returns:** nil

### `weapon(inst, doer, target, actions, right)`
* **Description:** Determines if the held item can be stored in a container (including Chester), constructed on a workbench, or used to attack the target based on tags, container state, and game mode restrictions.
* **Parameters:**
  - `inst` -- Entity being used (typically held item)
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being interacted with
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click (true) or left-click (false)
* **Returns:** nil

### `weighable(inst, doer, target, actions)`
* **Description:** Adds COMPILE_WEIGHABLE or WEIGH_ITEM action if the target is a weighable structure or owned item matching a trophy scale type.
* **Parameters:**
  - `inst` -- Entity being used (typically trophy scale part)
  - `doer` -- Player entity performing the action
  - `target` -- Target entity being weighed (structure or item)
  - `actions` -- Mutable array of BufferedAction objects being populated
* **Returns:** nil
* **Error states:** Returns early after first match; ignores burnt structures.

### `winter_treeseed(inst, doer, target, actions)`
* **Description:** Adds PLANT action if target is a winter tree stand and not currently on fire.
* **Parameters:**
  - `inst` -- Entity being used (winter tree seed)
  - `doer` -- Player entity performing the action
  - `target` -- Target entity (winter tree stand)
  - `actions` -- Mutable array of BufferedAction objects being populated
* **Returns:** nil

### `aoespell(inst, doer, pos, actions, right, target)`
* **Description:** Adds CASTAOE action for right-click on valid AOE locations, respecting targeting state, riding, and map constraints.
* **Parameters:**
  - `inst` -- Entity being used (AOE spell item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked (not used directly here)
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click (true) or left-click (false)
  - `target` -- Unused in this handler
* **Returns:** nil
* **Error states:** Early return if already AOETargeting, no active item in inventory, or positioning invalid.

### `blinkstaff(inst, doer, pos, actions, right, target)`
* **Description:** Adds BLINK action for valid teleport points (above ground or platform, unblocked, not steering/rotating).
* **Parameters:**
  - `inst` -- Entity being used (blink staff)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil
* **Error states:** Early return if not right-click, position blocked, or boat control active.

### `complexprojectile(inst, doer, pos, actions, right, target)`
* **Description:** Adds TOSS action for right-click if valid for tossing, respecting ocean, blocked ground, boat control, and restrictions.
* **Parameters:**
  - `inst` -- Entity being used (complex projectile)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil
* **Error states:** Early return if right-click false, blocked, restricted, or deployable.

### `deployable(inst, doer, pos, actions, right, target)`
* **Description:** Adds DEPLOY, DEPLOY_TILEARRIVE, or DEPLOY_FLOATING actions based on deployment validity and item tags.
* **Parameters:**
  - `inst` -- Entity being used (deployable item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil
* **Error states:** Early return if not right-click, no inventoryitem, or CanDeploy fails.

### `farmtiller(inst, doer, pos, actions, right, target)`
* **Description:** Adds TILL action for right-click if soil at position is tinnable.
* **Parameters:**
  - `inst` -- Entity being used (tiller)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `fillable(inst, doer, pos, actions, right, target)`
* **Description:** Adds FILL_OCEAN action if item has tag fillable_showoceanaction and position is ocean.
* **Parameters:**
  - `inst` -- Entity being used (fillable item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `fishingnet(inst, doer, pos, actions, right, target)`
* **Description:** Adds CAST_NET action if right-click and fishing net can be cast at position.
* **Parameters:**
  - `inst` -- Entity being used (fishing net)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `fishingrod(inst, doer, pos, actions, right, target)`
* **Description:** Adds FISH_OCEAN action for right-click if fishing is possible at position.
* **Parameters:**
  - `inst` -- Entity being used (fishing rod)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `joustsource(inst, doer, pos, actions, right, target)`
* **Description:** Adds JOUST action if right-click, not riding, and position is above ground.
* **Parameters:**
  - `inst` -- Entity being used (joust source)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `inventoryitem(inst, doer, pos, actions, right, target)`
* **Description:** Adds DROP action for left-click if item is held, not prevented from unequipping, and not floater-held.
* **Parameters:**
  - `inst` -- Entity being used (inventory item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `oar(inst, doer, pos, actions, right, target)`
* **Description:** Calls Row() if right-click and no override, allowing rowing at position.
* **Parameters:**
  - `inst` -- Entity being used (oar)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `oceanfishingrod(inst, doer, pos, actions, right, target)`
* **Description:** Handles ocean fishing rod actions: casting (OCEAN_FISHING_CAST) if no target, or applying GetFishingAction (REEL, etc.) if target exists.
* **Parameters:**
  - `inst` -- Entity being used (ocean fishing rod)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `oceanthrowable(inst, doer, pos, actions, right, target)`
* **Description:** Adds OCEAN_TOSS action for right-click if ocean at position.
* **Parameters:**
  - `inst` -- Entity being used (ocean throwable)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `quagmire_tiller(inst, doer, pos, actions, right, target)`
* **Description:** Adds TILL action for right-click if soil at position can be tilled.
* **Parameters:**
  - `inst` -- Entity being used (quagmire tiller)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `spellcaster(inst, doer, pos, actions, right, target)`
* **Description:** Adds CASTSPELL action for right-click on valid target locations (above ground or ocean) based on spellcaster tags and constraints.
* **Parameters:**
  - `inst` -- Entity being used (spellcaster item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `terraformer(inst, doer, pos, actions, right, target)`
* **Description:** Adds TERRAFORM action for right-click if terrain modification (plow or general) is allowed at position.
* **Parameters:**
  - `inst` -- Entity being used (terraformer item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `wateryprotection(inst, doer, pos, actions, right, target)`
* **Description:** Adds POUR_WATER_GROUNDTILE action for right-click if tile is FARMING_SOIL.
* **Parameters:**
  - `inst` -- Entity being used (watery protection item)
  - `doer` -- Player entity performing the action
  - `pos` -- World position where action is invoked
  - `actions` -- Mutable array of BufferedAction objects being populated
  - `right` -- Boolean indicating right-click
  - `target` -- Unused
* **Returns:** nil

### `RemapComponentActions()`
* **Description:** Maps component names to numeric IDs for network efficiency by iterating over COMPONENT_ACTIONS.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Assertion fails if more than 255 unique components.

### `AddComponentAction(actiontype, component, fn, modname)`
* **Description:** Registers a mod-provided component action handler, maintaining separate per-mod registries.
* **Parameters:**
  - `actiontype` -- The action type key (e.g., 'INVENTORY', 'WEAPON')
  - `component` -- The component name
  - `fn` -- The callback function
  - `modname` -- The mod identifier
* **Returns:** nil

### `EntityScript:RegisterComponentActions(name)`
* **Description:** Registers a component's ID into the entity's actioncomponents and modactioncomponents arrays.
* **Parameters:**
  - `name` -- The component name to register
* **Returns:** nil

### `EntityScript:UnregisterComponentActions(name)`
* **Description:** Removes a component's ID from the entity's actioncomponents and modactioncomponents arrays.
* **Parameters:**
  - `name` -- The component name to unregister
* **Returns:** nil

### `CollectActions(actiontype, ...)`
* **Description:** Iterates over the entity's action components (both built-in and modded), retrieves the corresponding collector function for the given action type, and invokes it. Handles fallbacks for modded components via CheckModComponentActions and CheckModComponentNames.
* **Parameters:**
  - `actiontype` -- string identifier of the action type (e.g., "GATHER", "ATTACK") to collect components for; must exist in COMPONENT_ACTIONS
  - `...` -- variable arguments passed through to each collected collector function
* **Returns:** nil
* **Error states:** Prints an error and returns early if actiontype is not found in COMPONENT_ACTIONS.

### `IsActionValid(action, right)`
* **Description:** Determines if the given action is valid for this entity by checking rmb constraints and delegating to ISVALID validators registered in both built-in and modded action components. Returns true on first match.
* **Parameters:**
  - `action` -- Action table with at least an rmb boolean field (right mouse button requirement)
  - `right` -- boolean indicating whether the action was triggered via right mouse button
* **Returns:** boolean — true if any component's ISVALID validator returns true, otherwise false.
* **Error states:** Returns false if no validators match or if modded component lookups fail.

### `HasActionComponent(name)`
* **Description:** Checks whether the entity possesses a given action component by ID, first in the built-in list (actioncomponents) and then in modded lists (modactioncomponents).
* **Parameters:**
  - `name` -- string name of the action component (e.g., "inventory", "melee") to check for presence
* **Returns:** boolean — true if the component is present, otherwise false.
* **Error states:** Returns false if the component name is unrecognized (id is nil) or not found in either list.

## Events & listeners

- **Listens to:** None
- **Pushes:** None