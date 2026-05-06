---
id: actions
title: Actions
description: Defines the Action class constructor, helper range-check functions, global action codes, and populates the ACTIONS table with comprehensive player interaction definitions including combat, crafting, inventory management, boating, fishing, and event-specific actions.
tags: [actions, player, interaction, combat, inventory]
sidebar_position: 10

last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: root
source_hash: 28329a8e
system_scope: player
---

# Actions

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`actions.lua` is a data configuration file that defines all player interaction actions in Don't Starve Together. It constructs the global `ACTIONS` table containing action definitions with configurable properties for priority, distance, validity conditions, and execution logic. Each action entry includes execution functions (`fn`), string lookup functions (`strfn`), validation functions (`validfn`), and optional callbacks. Actions cover all player verbs including combat, crafting, inventory management, boating, fishing, farming, event-specific interactions, and character abilities. Range check helper functions validate action feasibility based on distance, platform state, and entity components. This file is loaded via `require()` and referenced by stategraphs, player controllers, input handling systems, and buffered action processors throughout the game.

## Usage example
```lua
-- Access the global ACTIONS table to reference an action code
local action = ACTIONS.CHOP

-- Set a client-requested action with an action code and mod name
-- This queues an action for the client to perform
SetClientRequestedAction(ACTIONS.CHOP, "my_mod")

-- Clear the client-requested action when done or when cancelling
-- This prevents the action from being executed
ClearClientRequestedAction()

-- Check action properties
print(action.priority) -- Prints the priority value
print(action.distance) -- Prints the interaction distance
```

## Dependencies & tags
**External dependencies:**
- `class` -- Required for Action class constructor
- `bufferedaction` -- Required for action buffering logic
- `debugtools` -- Required for debug stack traces
- `util` -- Required for utility functions like distsq
- `vecutil` -- Required for Vector3 operations
- `components/embarker` -- Required for platform checks

**Components used:**
- `combat` -- Accessed via doer.replica.combat for weapon attack range
- `inventoryitem` -- Accessed for deploy spacing and ownership checks
- `inventory` -- StealItem, DropItem, TransferInventory, GiveItem, Equip, Unequip
- `workable` -- onwork function for tool work actions
- `burnable` -- IsBurning checks for fire-related actions
- `edible` -- Checked for eating actions
- `eater` -- Eat function for food consumption
- `repairable` -- Repair function for repair actions
- `fueled` -- Checked for fuel and sewing targets
- `container` -- IsOpenedByOthers, readonlycontainer, DropEverything
- `deployable` -- Check deployment validity and deploy item
- `fishingrod` -- StartFishing, IsFishing, Reel, Hook, StopFishing
- `cooker` -- CanCook, CookItem for cooking actions
- `fillable` -- Fill from watersource targets
- `trader` -- AbleToAccept, AcceptGift for trading
- `spellcaster` -- CanCast, CastSpell for magic actions
- `rideable` -- IsBeingRidden, SetSaddle for mounting
- `health` -- IsDead checks for combat and murder
- `sanity` -- current, DoDelta for sanity changes
- `talker` -- Say strings during actions
- `inspectable` -- Get description of targets
- `stackable` -- Stack size and stacking logic
- `equippable` -- ShouldPreventUnequipping, IsRestricted
- `locomotor` -- Stop during lookat actions
- `builder` -- DoBuild for building actions
- `harvestable` -- Harvest for harvestable entities
- `pickable` -- Fertilize, CanBeFertilized, Pick, CanBePicked
- `sleepingbag` -- DoSleep for sleeping actions
- `hitcher` -- SetHitched, Unhitch for beefalo
- `markable` -- HasMarked, Mark for marking actions
- `shaveable` -- Shave for shaving actions
- `instrument` -- Play for playing instruments
- `pollinator` -- Pollinate, CreateFlower
- `terraformer` -- Terraform for terraforming
- `teleporter` -- IsActive for teleporter validation
- `activatable` -- CanActivate, DoActivate
- `hauntable` -- DoHaunt for haunting
- `lock` -- Unlock for lock actions
- `teacher` -- Teach for recipe teaching
- `machine` -- TurnOn, TurnOff
- `useableitem` -- StartUsingItem, StopUsingItem
- `spellbook` -- CastSpell, GetSpellName
- `blinkstaff` -- Blink for teleportation
- `ghostlybond` -- Summon, Recall, ChangeBehaviour
- `upgradeable` -- CanUpgrade, Upgrade
- `writeable` -- BeginWriting, IsWritten
- `attunable` -- LinkToPlayer for attuning
- `worldmigrator` -- Activate for world migration
- `revivablecorpse` -- CanBeRevivedBy, Revive
- `petleash` -- DespawnPet for pet management
- `channelable` -- StartChanneling, StopChanneling
- `bundler` -- StartBundling, FinishBundling
- `unwrappable` -- Unwrap, PeekInContainer
- `constructionbuilder` -- StartConstruction, StopConstruction
- `aoespell` -- CastSpell for area spells
- `boatcannon` -- LoadAmmo, IsAmmoLoaded
- `oceantrawler` -- Lower, Raise, Fix
- `questowner` -- BeginQuest, AbandonQuest
- `yotb_sewer` -- StartSewing, CanSew
- `mightygym` -- Enter, Exit, Unload for gym workouts
- `upgrademoduleowner` -- PushModule, PopOneModule
- `batteryuser` -- ChargeFrom for battery charging
- `magician` -- StartUsingTool, StopUsing
- `remoteteleporter` -- Activate, Teleport
- `incinerator` -- Incinerate targets
- `bottler` -- Bottle targets
- `snowmandecoratable` -- Decorate, Stack snowmen
- `pushable` -- StartPushing
- `gravediggable` -- DigUp graves
- `ghostgestalter` -- Mutate targets
- `slingshotmodder` -- StartModding, StopModding
- `deckcontainer` -- AddCard, RemoveCard for card games
- `gestaltcage` -- Capture target entities
- `moonstormstaticcatcher` -- Catch target entities
- `electricconnector` -- StartLinking, EndLinking, Disconnect
- `bathingpool` -- EnterPool for bathing
- `mapdeliverable` -- StartMapAction, SendToPoint, Stop

**Tags:**
- `jostlepick` -- check for jostle range
- `jostlerummage` -- check for container jostle
- `jostlesearch` -- check for search jostle
- `farm_plant` -- check for farm plant interactions
- `projectile` -- check for projectile items
- `heavy` -- check for heavy item handling
- `player` -- check for player entities
- `burnt` -- check for burnt state
- `fire` -- check for fire state
- `smolder` -- check for smoldering state
- `frozen` -- check for frozen state
- `withered` -- check for withered plants
- `trap` -- check for trap entities
- `mine` -- check for mine entities
- `soul` -- check for soul entities
- `playerghost` -- check for ghost players
- `teleporter` -- check for teleporter entities
- `wormhole` -- check for wormhole entities
- `deployable` -- check for deployable items
- `cookable` -- check for cookable items
- `tappable` -- check for tappable trees
- `boat_leak` -- check for boat leaks
- `race_on` -- check for active race state
- `soil` -- check for soil tiles
- `sewingmachine` -- check for sewing machines
- `batteryuser` -- check for battery users
- `pyromaniac` -- check for pyromaniac tag
- `handyperson` -- check for handyperson tag
- `wx_screeching` -- check for WX-78 screeching state
- `wx_shielding` -- check for WX-78 shielding state

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ACTIONS` | table | — | Global table containing all defined Action instances keyed by action name (e.g., `ACTIONS.CHOP`). |
| `ACTIONS_MAP_REMAP` | table | `{}` | Table mapping action codes to remap functions for map-based interactions. |
| `CLIENT_REQUESTED_ACTION` | Action or nil | `nil` | Global variable storing the currently requested action from the client. |
| `Action.priority` | number | `0` | Determines action selection order; higher values take precedence. |
| `Action.fn` | function | `function() return false end` | The execution function called when the action is performed. |
| `Action.strfn` | function or nil | `nil` | Function returning the localized string key for the action button. |
| `Action.instant` | boolean | `false` | If true, the action executes immediately without locomotion. |
| `Action.rmb` | boolean or nil | `nil` | If true, action is triggered by right mouse button (contextual). |
| `Action.distance` | number or nil | `nil` | Maximum interaction distance for the action. |
| `Action.mindistance` | number or nil | `nil` | Minimum interaction distance for the action. |
| `Action.arrivedist` | number or nil | `nil` | Distance threshold to consider the doer "arrived" at the target. |
| `Action.ghost_exclusive` | boolean | `false` | If true, only ghost players can perform this action. |
| `Action.ghost_valid` | boolean | `false` | If true, ghost players can perform this action (non-exclusive). |
| `Action.mount_valid` | boolean | `false` | If true, the action can be performed while riding a mount. |
| `Action.encumbered_valid` | boolean | `false` | If true, the action can be performed while encumbered (heavy lifting). |
| `Action.floating_valid` | boolean | `false` | If true, the action can be performed while floating in water. |
| `Action.canforce` | boolean or nil | `nil` | If true, forces the action to be valid even if range checks fail (handled in fn). |
| `Action.rangecheckfn` | function or nil | `nil` | Custom function to validate range between doer and target. |
| `Action.mod_name` | string or nil | `nil` | Name of the mod defining this action (if applicable). |
| `Action.silent_fail` | boolean or nil | `nil` | If true, action failures do not trigger error speech. |
| `Action.silent_generic_fail` | boolean or nil | `nil` | If true, generic failures do not trigger error speech. |
| `Action.paused_valid` | boolean | `false` | If true, the action can be performed while the game is paused. |
| `Action.actionmeter` | boolean or nil | `nil` | If true, displays an action meter UI during execution. |
| `Action.customarrivecheck` | function or nil | `nil` | Custom function to determine if the doer has arrived at the target. |
| `Action.is_relative_to_platform` | boolean or nil | `nil` | If true, distance checks are relative to the current platform. |
| `Action.disable_platform_hopping` | boolean or nil | `nil` | If true, prevents the doer from hopping platforms to reach the target. |
| `Action.skip_locomotor_facing` | boolean or nil | `nil` | If true, skips the locomotor facing animation before action. |
| `Action.do_not_locomote` | boolean or nil | `nil` | If true, prevents any locomotion towards the target. |
| `Action.extra_arrive_dist` | function or number or nil | `nil` | Additional distance added to the arrive check calculation. |
| `Action.tile_placer` | string or nil | `nil` | Name of the tile placer prefab for ground-targeted actions. |
| `Action.show_tile_placer_fn` | function or nil | `nil` | Function to determine if the tile placer should be shown. |
| `Action.theme_music` | string or nil | `nil` | Music track to play during the action. |
| `Action.theme_music_fn` | function or nil | `nil` | Function to determine the music track dynamically. |
| `Action.pre_action_cb` | function or nil | `nil` | Callback function run on client and server before action execution. |
| `Action.invalid_hold_action` | boolean or nil | `nil` | If true, action cannot be held down for repeated execution. |
| `Action.show_primary_input_left` | boolean or nil | `nil` | UI hint to show primary input on the left. |
| `Action.show_secondary_input_right` | boolean or nil | `nil` | UI hint to show secondary input on the right. |
| `Action.map_action` | boolean or nil | `nil` | If true, action is handled specifically from the map interface. |
| `Action.closes_map` | boolean or nil | `nil` | If true, closes the minimap immediately upon action start. |
| `Action.map_only` | boolean or nil | `nil` | If true, action only exists when initiated from the map. |
| `Action.map_works_on_unexplored` | boolean or nil | `nil` | If true, bypasses visibility checks for unexplored map areas. |
| `Action.map_works_on_impassable` | boolean or nil | `nil` | If true, allows selection of impassable tiles on the map. |

## Main functions

### `Action(data, instant, rmb, distance, ghost_valid, ghost_exclusive, canforce, rangecheckfn)`
*   **Description:** Constructor for creating a new Action definition. Supports legacy positional parameters but prefers a data table.
*   **Parameters:**
    -   `data` (table) -- Table containing action properties (priority, fn, distance, etc.).
    -   `instant` (boolean) -- [Legacy] If true, action is instant.
    -   `rmb` (boolean) -- [Legacy] If true, action is right-mouse triggered.
    -   `distance` (number) -- [Legacy] Interaction distance.
    -   `ghost_valid` (boolean) -- [Legacy] Valid for ghosts.
    -   `ghost_exclusive` (boolean) -- [Legacy] Exclusive to ghosts.
    -   `canforce` (boolean) -- [Legacy] Can force validity.
    -   `rangecheckfn` (function) -- [Legacy] Custom range check function.
*   **Returns:** Action instance populated with properties from `data` or legacy params.
*   **Error states:** Prints a warning to console if legacy positional parameters are used instead of a data table.

### `SetClientRequestedAction(actioncode, mod_name)`
*   **Description:** Sets the global `CLIENT_REQUESTED_ACTION` based on mod or default action tables.
*   **Parameters:**
    -   `actioncode` (number) -- The action code to set.
    -   `mod_name` (string) -- The mod name defining the action (optional).
*   **Returns:** None
*   **Error states:** None

### `ClearClientRequestedAction()`
*   **Description:** Clears the global `CLIENT_REQUESTED_ACTION` to nil.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `MakeRangeCheckFn(range)`
*   **Description:** Factory function that returns a standard range check function for a given distance.
*   **Parameters:**
    -   `range` (number) -- The maximum distance allowed.
*   **Returns:** Function `(doer, target)` that returns boolean indicating if target is within range.
*   **Error states:** None

### `PickRangeCheck(doer, target)`
*   **Description:** Custom range check for pickup actions, accounting for weapon attack range if jostle tags are present.
*   **Parameters:**
    -   `doer` (Entity) -- The entity performing the action.
    -   `target` (Entity) -- The target entity.
*   **Returns:** Boolean indicating if the target is within valid pickup range.
*   **Error states:** None

### `ExtraPickRange(doer, dest, bufferedaction)`
*   **Description:** Calculates extra range allowance for pickup actions, specifically for water tiles.
*   **Parameters:**
    -   `doer` (Entity) -- The entity performing the action.
    -   `dest` (Vector) -- The destination point.
    -   `bufferedaction` (BufferedAction) -- The buffered action context.
*   **Returns:** Number representing extra distance to add to range check.
*   **Error states:** None

### `PhysicsPaddedRangeCheck(doer, target)`
*   **Description:** Range check function that accounts for target physics radius. Currently unused in the codebase.
*   **Parameters:**
    -   `doer` (Entity) -- The entity performing the action.
    -   `target` (Entity) -- The target entity.
*   **Returns:** Boolean indicating if the target is within valid range.
*   **Error states:** Crashes if `doer` or `target` is nil (no nil guard before Transform:GetWorldPosition() calls).

### `CheckFishingOceanRange(doer, dest)`
*   **Description:** Validates range for ocean fishing, ensuring the cast point is valid relative to water/land.
*   **Parameters:**
    -   `doer` (Entity) -- The fisher entity.
    -   `dest` (Vector) -- The cast destination point.
*   **Returns:** Boolean indicating if the cast location is valid.
*   **Error states:** Crashes if `doer` or `dest` is nil (no nil guard before GetPosition()/GetPoint() calls).

### `CheckRowRange(doer, dest)`
*   **Description:** Validates range for rowing actions, ensuring the doer is not on a platform.
*   **Parameters:**
    -   `doer` (Entity) -- The rower entity.
    -   `dest` (Vector) -- The row destination point.
*   **Returns:** Boolean indicating if rowing is valid at this location.
*   **Error states:** Crashes if `doer` or `dest` is nil (no nil guard before GetPosition()/GetPoint() calls).

### `CheckOceanFishingCastRange(doer, dest)`
*   **Description:** Validates range for ocean fishing cast actions, checking ground/platform status.
*   **Parameters:**
    -   `doer` (Entity) -- The fisher entity.
    -   `dest` (Vector) -- The cast destination point.
*   **Returns:** Boolean indicating if the cast location is valid.
*   **Error states:** Crashes if `doer` or `dest` is nil (no nil guard before GetPosition()/GetPoint() calls).

### `CheckTileWithinRange(doer, dest)`
*   **Description:** Validates if a tile target is within one tile distance of the doer.
*   **Parameters:**
    -   `doer` (Entity) -- The entity performing the action.
    -   `dest` (Vector) -- The target tile point.
*   **Returns:** Boolean indicating if the tile is within range.
*   **Error states:** Crashes if `doer` or `dest` is nil (no nil guard before GetPosition()/GetPoint() calls).

### `ShowPourWaterTilePlacer(right_mouse_action)`
*   **Description:** Determines if the tile placer should be shown for pouring water actions.
*   **Parameters:**
    -   `right_mouse_action` (Action) -- The current right mouse action context.
*   **Returns:** Boolean indicating if the placer should be visible.
*   **Error states:** None

### `ExtraDeployDist(doer, dest, bufferedaction)`
*   **Description:** Calculates extra distance allowance for deploy actions based on ocean/land transitions and projectile tags.
*   **Parameters:**
    -   `doer` (Entity) -- The deployer entity.
    -   `dest` (Vector) -- The deployment destination.
    -   `bufferedaction` (BufferedAction) -- The buffered action context.
*   **Returns:** Number representing extra distance to add.
*   **Error states:** Crashes if `doer` or `dest` is nil (no nil guard before Transform:GetWorldPosition()/GetPoint() calls).

### `ExtraDropDist(doer, dest, bufferedaction)`
*   **Description:** Calculates extra distance allowance for drop actions, accounting for water and physics radius collisions.
*   **Parameters:**
    -   `doer` (Entity) -- The dropper entity.
    -   `dest` (Vector) -- The drop destination.
    -   `bufferedaction` (BufferedAction) -- The buffered action context.
*   **Returns:** Number representing extra distance to add.
*   **Error states:** Crashes if `doer` or `dest` is nil (no nil guard before GetPoint() calls).

### `ExtraHealRange(doer, dest, bufferedaction)`
*   **Description:** Adjusts heal range based on physics radius discrepancies for specific targets (e.g., Brightshades).
*   **Parameters:**
    -   `doer` (Entity) -- The healer entity.
    -   `dest` (Vector) -- The heal target point.
    -   `bufferedaction` (BufferedAction) -- The buffered action context.
*   **Returns:** Number representing extra distance to add.
*   **Error states:** Crashes if `bufferedaction.target` is nil or lacks Physics component (no nil guard before Physics:GetRadius() call).

### `ExtraWobyForagingDist(doer, dest, bufferedaction)`
*   **Description:** Calculates extra distance allowance for Woby foraging actions based on creature size.
*   **Parameters:**
    -   `doer` (Entity) -- The forager entity.
    -   `dest` (Vector) -- The forage destination.
    -   `bufferedaction` (BufferedAction) -- The buffered action context.
*   **Returns:** Number representing extra distance to add.
*   **Error states:** Crashes if `doer` is nil (no nil guard before HasTag() call).

## Events & listeners
**Listens to:**
None identified.

**Pushes:**
- `onpickupitem` -- Pushed by doer when an item is successfully picked up.
- `closecontainer` -- Pushed when a container is closed via rummage action.
- `opencontainer` -- Pushed when a container is opened via rummage action.
- `working` -- Pushed during row fail or row action to indicate activity.
- `talkedto` -- Pushed when a talkable entity is talked to.
- `CHEVO_fertilized` -- Pushed to TheWorld when fertilizing pickable.
- `murdered` -- Pushed by doer when cooking living ingredient.
- `killed` -- Pushed by doer when cooking combat-capable ingredient.
- `CHEVO_starteddrying` -- Pushed to TheWorld when starting drying.
- `recoil_off` -- Pushed immediately by doer on recoil.
- `tooltooweak` -- Pushed by doer when tool effectiveness is zero.
- `wonteatfood` -- Pushed when target prefers not to eat the food item in FEEDPLAYER action.
- `plantwintertreeseed` -- Pushed when planting seed in winter treestand that is not burning.
- `onstartedfire` -- Pushed on doer when lighting a target with lighter.
- `hitchto` -- Pushed on beefalo when hitching up a target.
- `onwenthome` -- Pushed on target or doer when going home via GOHOME action.
- `haunt` -- Pushed by doer when haunting a target.
- `unpinned` -- Pushed when UNPIN action succeeds.
- `onstolen` -- Pushed when STEALMOLEBAIT or CATPLAYGROUND steals bait.
- `peek` -- Pushed when MOLEPEEK action occurs.
- `on_petted` -- Pushed when PET action targets a kitcoon.
- `saddle` -- Pushed when SADDLE or UNSADDLE action occurs.
- `respawnfromghost` -- Pushed when REMOTERESURRECT action succeeds.
- `on_lower_sail_boost` -- Pushed by doer when lower sail boost action is successful.
- `on_planted` -- Pushed when a weed is planted on soil.
- `stopliftingdumbbell` -- Pushed when stopping dumbbell lifting.
- `lift_gym` -- Pushed when gym lift fails on client.
- `flipdeck` -- Pushed by invobject when flipping a deck.
- `controller_removing_module` -- Pushed to doer in REMOVEMODULE actions when controller is attached.
- `adopted_critter` -- Pushed to hermitcrab entity when a critter is successfully transferred.