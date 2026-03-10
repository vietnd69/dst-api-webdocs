---
id: actions
title: Actions
description: Defines the core action system that handles player interactions with entities, items, and the world through keyboard, mouse, and controller inputs.
tags: [interaction, input, player, combat, inventory]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 82eee1ae
system_scope: player
---

# Actions

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The actions system implements the fundamental interaction layer for the Entity Component System, mapping user inputs (keyboard/mouse/controller) to functional operations across the game world. Each action is defined as a structured object with a name, priority, execution function, validation logic, range checks, and contextual string generators. The system integrates deeply with components like `combat`, `inventory`, `workable`, `builder`, `fueled`, `repairable`, `fertilizable`, `deployable`, `trap`, `craftingstation`, and `locator`, as well as subsystems for fishing, ocean navigation, construction, and map-based interactions. Actions support range constraints, state-dependent validity, special cases for ghosts, riding, or encumbrance, and provide feedback through UI strings and events.

## Usage example
```lua
-- Register a custom action for harvesting a custom resource
ACTIONS.CUSTOM_HARVEST = {
    priority = 2,
    strfn = function(act) return act.target.prefab == "my_resource" and "HARVEST" or nil end,
    fn = function(act)
        if act.target.components.myharvester then
            return act.target.components.myharvester:Harvest(act.doer)
        end
    end,
    validfn = function(act)
        return act.target ~= nil and act.target:HasTag("harvestable") and
               act.target.components.myharvester ~= nil and
               act.target.components.health and not act.target.components.health:IsDead()
    end,
    rangecheckfn = MakeRangeCheckFn(4),
}

-- Example: harvesting a crop with a tool
local act = {
    doer = player,
    target = crop_entity,
    invobject = hoe,
    action = ACTIONS.CUSTOM_HARVEST,
    GetActionPoint = function() return Vector3(0,0,0) end,
}
local success = ACTIONS.CUSTOM_HARVEST.fn(act)
```

## Dependencies & tags
**Components used:** activatable, anchor, aoespell, appraisable, attunable, attuner, bait, balloonmaker, bathbomb, bathbombable, bathingpool, battery, batteryuser, beard, bedazzler, blinkstaff, boatcannon, boatcannonuser, boatleak, boatmagnet, boatmagnetbeacon, boatrotator, book, bottler, brushable, builder, bundler, burnable, carnivalgamefeedable, cattoy, channelable, channelcastable, channelcaster, childspawner, clientpickupsoundsuppressor, closeinspector, combat, complexprojectile, compostingbin, constructionbuilder, constructionbuilderuidata, constructionplans, constructionsite, container, container_proxy, containerinstallableitem, cookable, cooker, craftingstation, crewmember, crittertraits, crop, curseditem, cyclable, deckcontainer, deployable, drawable, drawingtool, dryer, dryingrack, dumbbelllifter, eater, edible, electricconnector, embarker, entitytracker, equippable, erasablepaper, expertsailor, fan, farmplantable, farmplantstress, farmplanttendable, farmtiller, fencerotator, fertilizable, fertilizer, fertilizerresearchable, fillable, finiteuses, fishingnet, fishingrod, follower, followerherder, forgerepair, forgerepairable, freezable, fueled, fueler, furnituredecortaker, gestaltcage, ghostgestalter, ghostlybond, ghostlyelixir, ghostlyelixirable, grabbable, gravediggable, gravedigger, groomer, grower, guardian, halloweenpotionmoon, harvestable, hauntable, healer, health, heavyobstacleusetarget, helmsplitter, hideandseekhidingspot, hideout, hitchable, hitcher, incinerator, inspectable, instrument, inventory, inventoryitem, inventoryitemholder, itemmimic, itemtyperestrictions, itemweigher, joustsource, joustuser, kitcoon, kitcoonden, klaussacklock, knownlocations, lighter, lock, locomotor, lootdropper, lunarhailbuildup, machine, magician, maprecorder, mapspotrevealer, markable, markable_proxy, mast, maxhealer, maxwelltalker, mightygym, mine, moonstormstaticcatcher, moontrader, multithruster, murderable, nabbag, npc_talker, oar, occupiable, occupier, oceanfishable, oceanfishingrod, oceanthrowable, oceantrawler, papereraser, perishable, petleash, pickable, pinnable, plantresearchable, playbill, playbill_lecturn, playercontroller, playingcard, playingcardsmanager, pocketwatch, pocketwatch_dismantler, pollinator, poppable, portablestructure, preservative, projectile, pumpkincarvable, pumpkinhatcarvable, pushable, quagmire_altar, quagmire_cookwaretrader, quagmire_fertilizable, quagmire_installable, quagmire_installations, quagmire_plantable, quagmire_replatable, quagmire_replater, quagmire_saltable, quagmire_saltextractor, quagmire_saltpond, quagmire_slaughtertool, quagmire_stewer, quagmire_tappable, quagmire_tapper, quagmire_tiller, questowner, reader, recipescanner, remoteteleporter, repairable, repairer, repellent, revivablecorpse, rideable, rider, roseinspectableuser, sanity, scrapbookable, searchable, sewing, shaveable, shaver, shelf, simplebook, singable, singinginspiration, sittable, skilltreeupdater, sleepingbag, slingshotmodder, slingshotmods, snowmandecoratable, soul, souleater, spawner, spellbook, spellcaster, spidermutator, spooked, stackable, stageactingprop, stageactor, steeringwheel, steeringwheeluser, stewer, storyteller, strongman, summoningitem, tackler, tacklesketch, talkable, talker, teacher, teleporter, terraformer, thief, toggleableitem, tool, trader, trap, treegrowthsolution, trophyscale, unwrappable, upgradeable, upgrademodule, upgrademoduleowner, upgrademoduleremover, upgrader, useableitem, useabletargeteditem, vase, walkingplank, wardrobe, wateryprotection, waxable, weighable, winch, workable, worker, workmultiplier, worldmigrator, writeable, yotb_sewer, yotb_skinunlocker, yotb_stagemanager, yotb_stager, yotc_racecompetitor, yotc_raceprizemanager, yotc_racestart

**Tags:** burnt, anchor_lowered, anchor_transitioning, burnableignorefuel, INLIMBO, deployable, deployedplant, fire, stokeablefire, canbepicked, stuck, no_force_grow, stump, fueldepleted, hasemergencymode, pet_treat, has_aggressive_follower, near_kitcoonden, can_be_bathbombed, is_sail_raised, silt, has_silt, farm_debris, farm_plant, deployable_farmplant, deployable_groundtile, deployable_wall, deployable_plant, deployable_water, waterplant, deployable_mast, deployable_custom, decoratable, deployable_mast, deployable_custom, unwrappable, canpeek, pickapart, offerconstructionsite, constructionsite, repairconstructionsite, rebuildconstructionsite, repairable_moon_altar, repairable_vitae, spicer, deployable_farmplant, deployedfarmplant, soul, mine, trap, reloaditem_ammo, deployable_farmplant, deployedplant, farming, deployable_groundtile, deployable_wall, deployable_plant, deployable_water, waterplant, deployable_mast, deployable_custom, deployable_farmplant, deployedfarmplant, farming, deployable_groundtile, deployable_wall, deployable_plant, deployable_water, waterplant, deployable_mast, deployable_custom

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| priority | number | 0 | Priority level used for action selection when multiple actions apply. |
| fn | function | `function() return false end` | Main action execution function; returns `true` on success or `(success, reason)` tuple. |
| strfn | function | nil | Optional function to compute action label string based on action context. |
| instant | boolean | false | Indicates if the action is instant (e.g., no movement required). |
| rmb | boolean | nil | If set, restricts the action to right mouse button only; used for tools. |
| distance | number | nil | Maximum world distance the target must be within to trigger the action. |
| mindistance | number | nil | Minimum world distance required for the action to be valid. |
| arrivedist | number | nil | Distance threshold at which the doer is considered to have "arrived" at the target. |
| ghost_exclusive | boolean | false | When true, the action is only available when the player is a ghost. |
| ghost_valid | boolean | nil | Indicates if the action is valid while in ghost state; defaults to `ghost_exclusive` or `data.ghost_valid`. |
| mount_valid | boolean | false | Indicates if the action is valid while the doer is riding. |
| encumbered_valid | boolean | false | Indicates if the action is valid while the doer is encumbered. |
| floating_valid | boolean | false | Indicates if the action is valid while the doer is floating (e.g., on water). |
| canforce | function | nil | Optional function that forces action validity despite constraint checks. |
| rangecheckfn | function | nil | Custom function used to validate range; only set if `canforce` is present. |
| mod_name | string | nil | Optional mod identifier for the action. |
| silent_fail | string or nil | nil | Suppresses specific failure messages when set. |
| silent_generic_fail | boolean | nil | Suppresses generic failure messages when set. |
| paused_valid | boolean | false | Indicates if the action is valid while the game is paused. |
| actionmeter | component reference | nil | Reference to action meter component for UI feedback. |
| customarrivecheck | function | nil | Custom function to validate arrival state at target. |
| is_relative_to_platform | boolean | nil | Indicates whether position checks are relative to a platform (e.g., boat). |
| disable_platform_hopping | boolean | nil | Prevents changing platforms during the action. |
| skip_locomotor_facing | boolean | nil | Skips locomotor-based facing checks. |
| do_not_locomote | boolean | nil | Skips locomotion entirely during the action. |
| extra_arrive_dist | number | nil | Additional buffer distance added to arrive checks. |
| tile_placer | component reference | nil | Reference to tile placer component for placement UI. |
| show_tile_placer_fn | function | nil | Function used to display tile placer UI. |
| theme_music | string | nil | Identifier for theme music associated with the action. |
| theme_music_fn | function | nil | Client-side function to determine theme music dynamically. |
| pre_action_cb | function | nil | Callback executed before action starts. |
| invalid_hold_action | boolean | nil | Flag for handling invalid hold state. |
| show_primary_input_left | boolean | nil | UI hint indicating primary input should be shown on the left. |
| show_secondary_input_right | boolean | nil | UI hint indicating secondary input should be shown on the right. |
| map_action | boolean | nil | Restricts the action to map-based interactions. |
| closes_map | boolean | nil | Immediately closes minimap on action activation. |
| map_only | boolean | nil | Restricts the action to map view only. |
| map_works_on_unexplored | boolean | nil | Bypasses visibility checks when used from the map. |
| stroverridefn | function | nil | Function to override the action string display. |
| extra_arrive_dist | number | nil | Extra buffer distance added to arrive checks. |
| stroverridefn | function | nil | Function to override the action string display. |

## Main functions
### `MakeRangeCheckFn(range)`
* **Description:** Returns a closure that checks if a target entity is within a specified range of the doer using `IsNear`.
* **Parameters:** `range` — numeric radius for proximity check.
* **Returns:** Function `(doer, target)` returning boolean (true if within range, false otherwise or if target is nil).

### `DefaultRangeCheck(doer, target)`
* **Description:** Pre-instantiated range check function with fixed range = 4.
* **Parameters:** `doer` — entity performing the action. `target` — entity being targeted.
* **Returns:** Boolean (true if within 4 world units, false otherwise or if target is nil).

### `PickRangeCheck(doer, target)`
* **Description:** Checks distance between doer and target with dynamic range adjustment based on weapon attack range for targets tagged as pickable.
* **Parameters:** `doer` — entity performing the action. `target` — entity being targeted (must be valid).
* **Returns:** Boolean (true if distance `squared <= target` radius squared, false otherwise).

### `ExtraPickRange(doer, dest, bufferedaction)`
* **Description:** Computes extra pick range for water tiles or based on buffered action's target tags.
* **Parameters:** `doer` — entity. `dest` — optional destination Vector3. `bufferedaction` — optional buffered action object.
* **Returns:** Numeric extra range (0, 0.75, or weapon range value).

### `PhysicsPaddedRangeCheck(doer, target)`
* **Description:** Checks proximity with padding added to target's physics radius (currently unused per comment).
* **Parameters:** `doer` — entity. `target` — entity.
* **Returns:** Boolean (true if within padded distance, false otherwise).

### `CheckFishingOceanRange(doer, dest)`
* **Description:** Determines if fishing action should be allowed at destination point in ocean environment.
* **Parameters:** `doer` — entity. `dest` — destination Vector3.
* **Returns:** Boolean (true if fishing is permitted, fallback to true if not on ground/platform).

### `CheckRowRange(doer, dest)`
* **Description:** Determines if rowing action is possible at destination (forbidden if platform present).
* **Parameters:** `doer` — entity. `dest` — destination Vector3.
* **Returns:** Boolean (true if rowing allowed — i.e., no platform at target point).

### `CheckIsOnPlatform(doer, dest)`
* **Description:** Verifies whether the doer is currently on a platform (e.g., boat).
* **Parameters:** `doer` — entity. `dest` — ignored in function body.
* **Returns:** Boolean (true if `GetCurrentPlatform()` returns non-nil).

### `CheckOceanFishingCastRange(doer, dest)`
* **Description:** Checks whether a cast target point for ocean fishing is valid by testing if the line of sight from the doer to the target intersects solid ground or a platform before reaching the target. It performs a raycast-like check using a point slightly offset from the doer toward the target.
* **Parameters:** `doer` — entity performing the action (typically a player). `dest` — the target point (Vector3) to cast the fishing line to.
* **Returns:** `true` if the cast is unobstructed (either the test point is on a platform or not on visual ground), `false` otherwise.

### `CheckTileWithinRange(doer, dest)`
* **Description:** Checks whether the target tile is within a small range (TILE_SCALE * 0.5) of the doer’s current position.
* **Parameters:** `doer` — entity whose position is the reference. `dest` — the target tile point (Vector3).
* **Returns:** `true` if the tile center is within the small radius, `false` otherwise.

### `ShowPourWaterTilePlacer(right_mouse_action)`
* **Description:** Determines whether the pour water tile placer UI should be shown, specifically when hovering over a `farm_plant` and checking if the tile is farmable soil.
* **Parameters:** `right_mouse_action` — the action data structure, typically from a right-click, containing `target` and possibly other fields.
* **Returns:** `true` if the target is a `farm_plant` and the tile at its position is farmable soil; otherwise `false`.

### `ExtraPickupRange(doer, dest)`
* **Description:** Adds an additional pickup range bonus when the destination point is on ocean water (but not passable, i.e., deep water).
* **Parameters:** `doer` — entity attempting pickup. `dest` — the target point (Vector3).
* **Returns:** `0.75` if the target is on ocean water and not passable, otherwise `0`.

### `ExtraDeployDist(doer, dest, bufferedaction)`
* **Description:** Calculates additional deployment distance when deploying projectiles or moving between water/land/void boundaries. Used to increase deploy range for certain cross-medium deployments.
* **Parameters:** `doer` — the deploying entity. `dest` — the deployment target point (Vector3). `bufferedaction` — optional action data structure that may contain the item being deployed (`invobject`).
* **Returns:** Additional distance (0, 1, or more) depending on deployment scenario (e.g., +1 for cross-medium, or radius + 1 for `usedeployspacingasoffset` items), otherwise `0`.

### `ExtraDropDist(doer, dest, bufferedaction)`
* **Description:** Calculates extra drop distance for items when dropped, particularly handling water surface drops and physics radius adjustments.
* **Parameters:** `doer` — the entity performing the action. `dest` — destination point for the drop. `bufferedaction` — the buffered action containing inventory object.
* **Returns:** Numeric distance value (0, 0.5, 1.75, or physics_radius + 0.5).

### `ExtraPourWaterDist(doer, dest, bufferedaction)`
* **Description:** Returns fixed extra distance for pouring water actions.
* **Parameters:** Same signature as other extra distance functions (not used).
* **Returns:** `1.5`.

### `ExtraHealRange(doer, dest, bufferedaction)`
* **Description:** Adjusts healing range for targets with overridden physics radius (e.g., Brightshades).
* **Parameters:** Same signature as other extra distance functions.
* **Returns:** Absolute difference between actual and overridden physics radius, or `0` if no adjustment needed.

### `ArriveAnywhere()`
* **Description:** Simple function that always returns true, likely used as a default arrive validation.
* **Parameters:** None.
* **Returns:** true.

### `ExtraWobyForagingDist(doer, dest, bufferedaction)`
* **Description:** Calculates extra distance for Woby foraging based on creature size.
* **Parameters:** `doer` — the entity performing the action (checked for "largecreature" tag).
* **Returns:** `0.5` for normal creatures, `1.5` for large creatures.

### `SetClientRequestedAction(actioncode, mod_name)`
* **Description:** Sets the global CLIENT_REQUESTED_ACTION by looking up action code in either mod-specific or base action tables.
* **Parameters:** `actioncode` — string identifier for the action. `mod_name` — optional mod identifier; if provided, looks in MOD_ACTIONS_BY_ACTION_CODE, otherwise in ACTIONS_BY_ACTION_CODE.
* **Returns:** None (sets global variable).

### `ClearClientRequestedAction()`
* **Description:** Clears the global CLIENT_REQUESTED_ACTION variable.
* **Parameters:** None.
* **Returns:** None (sets global variable to nil).

### `IsItemInReadOnlyContainer(item)`
* **Description:** Helper function to determine if an item is inside a read-only container.
* **Parameters:** `item` — the item entity to check.
* **Returns:** Boolean (`true` if item is owned by a container that has `readonlycontainer = true`, otherwise `false`).

### `DoToolWork(act, workaction)`
* **Description:** Performs work on a target entity using an item or character's work capabilities, applying multipliers, recoil logic, and final work subtraction. Calls `WorkedBy_Internal` directly after pre-processing.
* **Parameters:** `act` — action table containing `target`, `doer`, `invobject`, and other metadata. `workaction` — the action type (e.g., `ACTIONS.CHOP`) to validate and perform.
* **Returns:** `true` on successful work, or `false, reason` if work cannot be performed (e.g., item mimic or `"tooltooweak"`).

### `ValidToolWork(act, workaction)`
* **Description:** Validates whether the target supports the given work action and the tool is not restricted for use by the doer. Used in `validfn` for actions to determine visibility/enabled state of UI actions.
* **Parameters:** `act` — action table. `workaction` — action type (e.g., `ACTIONS.MINE`).
* **Returns:** Boolean indicating if the work is valid to be performed.

### `ACTIONS.EAT.fn(act)`
* **Description:** Handles the eat action, attempting to eat an edible item, consume a soul, or set a fishing rod from a target oceanfishable.
* **Parameters:** `act` — action table containing `doer`, `target`, `invobject`.
* **Returns:** Result of the underlying component method (`eater:Eat`, `souleater:EatSoul`, `oceanfishable:SetRod`) or `nil` if conditions not met.

### `ACTIONS.STEAL.fn(act)`
* **Description:** Handles stealing from a target (inventory/container) or dropping items from a dryer. Includes range check and handles `dryer:DropItem()` as a fallback.
* **Parameters:** `act` — action table.
* **Returns:** Result of `thief:StealItem` or `dryer:DropItem()`; `nil` if out of range or no valid steal/drop target.

### `ACTIONS.MAKEBALLOON.fn(act)`
* **Description:** Spawns a balloon if the doer has `balloonomancer` tag and enough sanity; consumes `TUNING.SANITY_TINY` sanity.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success, `false` if sanity insufficient or conditions not met.

### `ACTIONS.EQUIP.fn(act)`
* **Description:** Equip an item into the doer's inventory.
* **Parameters:** `act` — action table.
* **Returns:** Result of `inventory:Equip`; `nil` if no inventory component.

### `ACTIONS.UNEQUIP.strfn(act)`
* **Description:** Stringification function for unequip action; returns reason string if unequip is blocked (e.g., heavy item, non-item equips, no slots).
* **Parameters:** `act` — action table.
* **Returns:** `"HEAVY"` or `nil`.

### `ACTIONS.UNEQUIP.fn(act)`
* **Description:** Unequip item: either puts into inventory or drops (depending on item’s `cangoincontainer` and game mode). Respects `ShouldPreventUnequipping()`.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success; `nil` if item prevents unequip or no inventory.

### `ACTIONS.PICKUP.strfn(act)`
* **Description:** Stringification function for pickup action; returns reason if pickup is blocked (heavy item).
* **Parameters:** `act` — action table.
* **Returns:** `"HEAVY"` or `nil`.

### `ACTIONS.PICKUP.fn(act)`
* **Description:** Handles the pickup action logic for items. Validates whether an entity can be picked up by the doer based on inventory, tags, state, restrictions, and item-specific conditions (e.g., cursed items, heavy lifting, spider loyalty), and then performs the pickup by giving the item to the doer’s inventory or equipping it.
* **Parameters:** `act` — action context object containing `doer` (the actor performing the action) and `target` (the item/entity to be picked up).
* **Returns:** `true` on successful pickup. `false, reason` string on failure (e.g., `"restriction"`, `"INUSE"`, `"NOTMINE_YOTC"`, `"NO_HEAVY_LIFTING"`, `"NOTMINE_SPIDER"`, `"FULL_OF_CURSES"`).

### `ACTIONS.EMPTY_CONTAINER.fn(act)`
* **Description:** Invokes the `onwork` callback of a workable component if present on the target container, effectively allowing custom logic (e.g., emptying contents with a side effect) without actually dropping items.
* **Parameters:** `act` — action context object (`doer`, `target`).
* **Returns:** `true` after triggering `onwork`, regardless of container emptiness.

### `ACTIONS.REPAIR.strfn(act)`
* **Description:** Returns a localization string key (e.g., `"SOCKET"` or `"REFRESH"`) for the repair action tooltip depending on the target’s tags. Used to provide context-sensitive repair UI text.
* **Parameters:** `act` — action context object (only `act.target` is used).
* **Returns:** `nil` if target doesn’t match any repairable tag. `"SOCKET"` if `target:HasTag("repairable_moon_altar")`. `"REFRESH"` if `target:HasTag("repairable_vitae")`.

### `ACTIONS.REPAIR.fn(act)`
* **Description:** Handles the repair action when a player attempts to repair a target entity. Determines the repair material based on context (e.g., heavy lifting with body slot item vs. handheld item) and delegates to either `repairable:Repair()` or `forgerepairable:Repair()`.
* **Parameters:** `act` — action table containing `target`, `doer`, `invobject`, and other contextual fields.
* **Returns:** Boolean or `nil` — result of the underlying repair component call.

### `ACTIONS.SEW.strfn(act)`
* **Description:** Generates a string label (e.g., `"PATCH"`) for the Sew action based on the held item's tags. Used for UI labeling.
* **Parameters:** `act` — action table, particularly uses `act.invobject`.
* **Returns:** String `"PATCH"` if the held item has tag `"tape"`, otherwise `nil`.

### `ACTIONS.SEW.fn(act)`
* **Description:** Executes the sew action — delegates to `sewing:DoSewing()` if all required conditions are met (valid target, holding valid object, target has `fueled`, and object has `sewing`).
* **Parameters:** `act` — action table (`target`, `doer`, `invobject`).
* **Returns:** Boolean — result of `sewing:DoSewing()` (true on success), or `nil` if preconditions fail.

### `ACTIONS.RUMMAGE.fn(act)`
* **Description:** Handles the "rummage" action, which opens or closes containers (including via container_proxy), enforces access restrictions (e.g., master chef, merm-only, soul jar skill), drops items on open if configured, and emits open/close events.
* **Parameters:** `act` — action table containing `target`, `invobject`, `doer`, and other context fields.
* **Returns:** `true` on success (or silent fail for edge cases, e.g., opening in darkness). `false, reason` string on failure (e.g., `"RESTRICTED"`, `"NOTMASTERCHEF"`, `"NOTAMERM"`, `"NOTSOULJARHANDLER"`, `"INUSE"`).

### `ACTIONS.RUMMAGE.strfn(act)`
* **Description:** Returns the action string for the RUMMAGE action (e.g., "CLOSE", "DECORATE", "PEEK") based on the target and doer state. Used to populate UI labels.
* **Parameters:** `act` — the action object containing `target`, `invobject`, `doer`, and related context.
* **Returns:** `"CLOSE"` if target is an opened container or container proxy owned by `doer`. `"DECORATE"` if target has tag `"decoratable"`. `"PEEK"` if target has tag `"unwrappable"`. `nil` if none apply.

### `ACTIONS.DROP.fn(act)`
* **Description:** Executes the DROP action: attempts to drop the held item from the doer’s inventory. Respects unequip restrictions and drop flags (wholestack, random direction, floater).
* **Parameters:** `act` — the action object, with fields `invobject`, `doer`, `options.wholestack`, and `:GetActionPoint()`.
* **Returns:** The return value of `inventory:DropItem(...)` (truthy/falsy), or `nil` if doer has no inventory component.

### `ACTIONS.DROP.strfn(act)`
* **Description:** Returns the action string for DROP depending on special item tags or properties (e.g., "SETTRAP", "FREESOUL").
* **Parameters:** `act` — action object with `invobject` and context.
* **Returns:** `"SETTRAP"` if `invobject` has tag `"trap"`. `"SETMINE"` if tag `"mine"`. `"FREESOUL"` if tag `"soul"`. `"PLACELANTERN"` if prefab is `"pumpkin_lantern"`. `"PLAYERFLOATER"` if tag `"playerfloater"` and item is equipped. Result of `GetDropActionPoint()` if defined. `nil` otherwise.

### `ShouldLOOKATStopLocomotor(act)`
* **Description:** Helper function to determine if `LOOKAT` action should stop the doer’s locomotion (e.g., during walking).
* **Parameters:** `act` — action object with `doer` and `sg`.
* **Returns:** `false` if doer is in `directwalking` mode or stategraph has `"overridelocomote"` tag. `true` otherwise.

### `ACTIONS.LOOKAT.strfn(act)`
* **Description:** Returns action string for `LOOKAT` depending on context: closing inspection or reading ancient text.
* **Parameters:** `act` — action object with `doer`, `target`, `invobject`.
* **Returns:** `"CLOSEINSPECT"` if no item held and `CLOSEINSPECTORUTIL.CanCloseInspect(...)` is true. `"READ"` if `target` has `"ancient_text"` tag, `doer` has `"ancient_reader"` equip. `nil` otherwise.

### `ACTIONS.LOOKAT.fn(act)`
* **Description:** Handles the "look at" action. First attempts close inspection via equipped items with `closeinspector` component. If that fails or isn’t applicable, falls back to getting description from `inspectable` component on the target object.
* **Parameters:** `act` — the action table containing fields like `invobject`, `doer`, `target`, `GetActionPoint()`, etc.
* **Returns:** `true, nil` on successful description display; `success, reason` from `CloseInspectTarget` or `CloseInspectPoint` calls; `nil` if no inspectable component found.

### `ACTIONS_MAP_REMAP[ACTIONS.ACTIVATE.code] = function(act, targetpos)`
* **Description:** Handles remapping of the ACTIVATE action specifically for map-based interactions. It attempts to route map-based activation towards a `charlieresidue` target, especially for wormhole use cases.
* **Parameters:** `act` — the action object; `targetpos` — the target world position.
* **Returns:** Returns a `BufferedAction` if a valid wormhole target is found via `charlieresidue`, else `nil`.

### `ACTIONS.READ.fn = function(act)`
* **Description:** Executes the read action on a target item. Delegates to `reader:Read` or `simplebook:Read`.
* **Parameters:** `act` — action object with `target`, `invobject`, and `doer` fields.
* **Returns:** Returns `success`, `reason` from `reader:Read`, or `true` for `simplebook:Read`. Returns `nil` if no valid handler is found.

### `ACTIONS.ROW_FAIL.fn = function(act)`
* **Description:** Simulates a rowing failure when an oar is equipped but the action times out or misfires. Triggers failure speech and pushes a `working` event for oar wear-out logic.
* **Parameters:** `act` — action object containing `doer`.
* **Returns:** `true`.

### `row(act)`
* **Description:** Core helper function for rowing logic. Checks whether the doer has an oar equipped or is a crewmember, then calls appropriate `oar:Row` or `crewmember:Row`.
* **Parameters:** `act` — action object with `doer`, and possibly `target` or action point.
* **Returns:** `true` on successful invocation, `false` if no oar and no crewmember.

### `ACTIONS.ROW.fn = function(act)`
* **Description:** Public entry point for ROW action (keyboard/mouse).
* **Parameters:** `act` — action object.
* **Returns:** Result of `row(act)`.

### `ACTIONS.ROW_CONTROLLER.fn = function(act)`
* **Description:** Public entry point for ROW action (controller).
* **Parameters:** `act` — action object.
* **Returns:** Result of `row(act)`.

### `ACTIONS.BOARDPLATFORM.fn = function(act)`
* **Description:** Placeholder action for boarding platforms (e.g., boats, rafts). Does nothing but succeed.
* **Parameters:** `act` — action object.
* **Returns:** `true`.

### `ACTIONS.OCEAN_FISHING_POND.fn(act)`
* **Description:** Checks if the target is a virtual ocean, used to validate ocean fishing actions.
* **Parameters:** `act` — action object containing `target` (entity) and `doer` (actor).
* **Returns:** `true` if target has tag `"virtualocean"`; `false, "WRONGGEAR"` otherwise.

### `ACTIONS.OCEAN_FISHING_CAST.fn(act)`
* **Description:** Casts the ocean fishing rod at the action point or target position.
* **Parameters:** `act` — action object; extracts `invobject` (fishing rod) or equipped hand item, and `pos` (cast point).
* **Returns:** Result of `rod.components.oceanfishingrod:Cast(doer, pos)`, or `nil` if rod or component missing.

### `ACTIONS.OCEAN_FISHING_REEL.strfn(act)`
* **Description:** Returns UI string for reel action based on target state.
* **Parameters:** `act` — action object; retrieves equipped rod and its target.
* **Returns:** `"SETHOOK"` if rod target is valid and has tag `"partiallyhooked"`; `nil` otherwise.

### `ACTIONS.OCEAN_FISHING_REEL.fn(act)`
* **Description:** Reels in the ocean fishing line.
* **Parameters:** `act` — action object; extracts equipped rod.
* **Returns:** Result of `rod.components.oceanfishingrod:Reel()`, or `nil` if rod or component missing.

### `ACTIONS.OCEAN_FISHING_STOP.fn(act)`
* **Description:** Stops ocean fishing and transitions player state.
* **Parameters:** `act` — action object; extracts equipped rod.
* **Returns:** `true` unconditionally after transitioning and stopping.

### `ACTIONS.OCEAN_FISHING_CATCH.fn(act)`
* **Description:** Initiates fish catch animation and logic.
* **Parameters:** `act` — action object; extracts equipped rod.
* **Returns:** `true` unconditionally after transitioning and calling `CatchFish()`.

### `ACTIONS.CHANGE_TACKLE.strfn(act)`
* **Description:** Determines UI string for changing tackle based on item state.
* **Parameters:** `act` — action object; checks `invobject` and equipped item.
* **Returns:** `"REMOVE"` if item is held in container slot; `"AMMO"` if item has tag `"reloaditem_ammo"`; otherwise `nil`.

### `ACTIONS.CHANGE_TACKLE.fn(act)`
* **Description:** Swaps or moves an item (tackle) from one container (typically a slingshot's ammo slot) to another location—either back to the player's inventory or to another slot within the same container.
* **Parameters:** `act` — action table containing: `doer` (entity performing the action), `invobject` (item being moved), and potentially other action metadata.
* **Returns:** `true` if the operation succeeds, `false` otherwise.

### `ACTIONS.TALKTO.fn`
* **Description:** Handles talking to a target entity (e.g., Maxwell or other talkable). If the target is Maxwell and not already talking, initiates its speech sequence.
* **Parameters:** `act` — action data table containing `doer`, `target`, `invobject`, etc.
* **Returns:** `true` if `target.components.talkable` exists and speech logic runs; otherwise `nil`.

### `ACTIONS.INTERACT_WITH.strfn`
* **Description:** Provides a string key for `INTERACT_WITH` action when the target is a farm plant.
* **Parameters:** `act` — action data table.
* **Returns:** `"FARM_PLANT"` if `act.target` has tag `"farm_plant"`, otherwise `nil`.

### `ACTIONS.INTERACT_WITH.fn`
* **Description:** Handles interacting with a farm plant using `farmplanttendable` component. Tends to the plant and optionally triggers a player announcement.
* **Parameters:** `act`.
* **Returns:** `true` if `TendTo()` succeeds; otherwise `nil`.

### `ACTIONS.INTERACT_WITH.theme_music_fn`
* **Description:** Returns theme music identifier for farm plant interactions.
* **Parameters:** `act`.
* **Returns:** `"farming"` if `act.target` has tag `"farm_plant"`, otherwise `nil`.

### `ACTIONS.ATTACKPLANT.fn`
* **Description:** Simulates stressing a farm plant (e.g., neglect/harsh treatment), marking it as stressed and tendable.
* **Parameters:** `act`.
* **Returns:** `true` if `farmplantstress` component exists; otherwise `nil`.

### `ACTIONS.TELLSTORY.stroverridefn`
* **Description:** Overrides the display string for `TELLSTORY` action, returning the base string literal instead of a dynamic target-aware variant.
* **Parameters:** `act`.
* **Returns:** `STRINGS.ACTIONS.TELLSTORY` (a static string).

### `ACTIONS.TELLSTORY.fn`
* **Description:** Triggers storytelling using the `storyteller` component. Uses `target` or `invobject` as the story prop.
* **Parameters:** `act`.
* **Returns:** Result of `TellStory()` (e.g., `true`, `false`, or `false, "reason"`); otherwise `nil` if storyteller component is missing.

### `ACTIONS.PERFORM.fn`
* **Description:** Initiates a performance at a stage prop if the actor and prop are valid.
* **Parameters:** `act`.
* **Returns:** Result of `DoPerformance()` (e.g., `true`/`false`); otherwise `nil`.

### `ACTIONS.BAIT.fn`
* **Description:** Baits a trap by removing bait item from inventory and setting it on the trap.
* **Parameters:** `act`.
* **Returns:** `true`.

### `ACTIONS.DEPLOY.fn`
* **Description:** Deploys an item (e.g., deployable structures or projectiles) at a position. Handles inventory/container removal and physics launch for projectiles.
* **Parameters:** `act`.
* **Returns:** `true` on success; `false, reason` on failure (e.g., cannot deploy, deploy failed); or `nil` if no valid `deployable` item.

### `ACTIONS.DEPLOY.strfn(act)`
* **Description:** Determines the deployment string key for an inventory item based on its tags (e.g., `"usedeploystring"`, `"projectile"`, `"groundtile"`). Returns `nil` if no matching tag.
* **Parameters:** `act` — action table containing `act.invobject` (the item being deployed).
* **Returns:** String key (e.g., `"DEPLOY"`, `"WALL"`, `"FERTILIZE_GROUND"`), or `nil`.

### `ACTIONS.DEPLOY.theme_music_fn(act)`
* **Description:** Returns `"farming"` theme music if the item has tag `"deployedfarmplant"`, otherwise `nil`.
* **Parameters:** `act` — action table (same as above).
* **Returns:** `"farming"` or `nil`.

### `ACTIONS.DEPLOY_TILEARRIVE.fn`
* **Description:** Reference alias to `ACTIONS.DEPLOY.fn`.
* **Parameters:** Inherited from `ACTIONS.DEPLOY.fn`.
* **Returns:** Same as `ACTIONS.DEPLOY.fn`.

### `ACTIONS.DEPLOY_TILEARRIVE.stroverridefn(act)`
* **Description:** Constructs the localized action string by calling `ACTIONS.DEPLOY.strfn` and indexing into `STRINGS.ACTIONS.DEPLOY`.
* **Parameters:** `act` — action table.
* **Returns:** Localized string (e.g., `"Deploy"`), or `STRINGS.ACTIONS.DEPLOY.GENERIC`.

### `ACTIONS.DEPLOY_FLOATING.fn`
* **Description:** Reference alias to `ACTIONS.DEPLOY.fn`.
* **Parameters:** Inherited from `ACTIONS.DEPLOY.fn`.
* **Returns:** Same as `ACTIONS.DEPLOY.fn`.

### `ACTIONS.DEPLOY_FLOATING.stroverridefn(act)`
* **Description:** Same as `DEPLOY_TILEARRIVE.stroverridefn`, but for floating deployment modes.
* **Parameters:** `act` — action table.
* **Returns:** Localized string for deploy/floating actions.

### `ACTIONS.TOGGLE_DEPLOY_MODE.strfn`
* **Description:** Reference alias to `ACTIONS.DEPLOY.strfn`.
* **Parameters:** Inherited from `ACTIONS.DEPLOY.strfn`.
* **Returns:** Same as `ACTIONS.DEPLOY.strfn`.

### `ACTIONS.SUMMONGUARDIAN.fn(act)`
* **Description:** Calls the `guardian:Call()` method on the target entity if both `doer` and `target` exist and the target has the `"guardian"` component.
* **Parameters:** `act` — action table with `act.doer`, `act.target`.
* **Returns:** Implicitly `nil` (no explicit return).

### `ACTIONS.CHECKTRAP.fn(act)`
* **Description:** Harvests a trap if the target has the `"trap"` component.
* **Parameters:** `act` — action table with `act.doer`, `act.target`.
* **Returns:** `true` if trap exists; otherwise, implicit `nil`.

### `ACTIONS.CHOP.fn(act)`
* **Description:** Executes the CHOP action. Calls `DoToolWork`, then triggers spook FX on the doer if they have the `spooked` component and the target is valid.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success or `false, work_fail_reason` if `DoToolWork` fails with a reason.

### `ACTIONS.CHOP.validfn(act)`
* **Description:** Validates CHOP action by calling `ValidToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** Boolean indicating if CHOP is valid for the target.

### `ACTIONS.MINE.fn(act)`
* **Description:** Executes the MINE action. Calls `DoToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success or `false, work_fail_reason`.

### `ACTIONS.MINE.validfn(act)`
* **Description:** Validates MINE action by calling `ValidToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** Boolean indicating if MINE is valid.

### `ACTIONS.HAMMER.fn(act)`
* **Description:** Executes the HAMMER action. Calls `DoToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success or `false, work_fail_reason`.

### `ACTIONS.HAMMER.validfn(act)`
* **Description:** Validates HAMMER action by calling `ValidToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** Boolean indicating if HAMMER is valid.

### `ACTIONS.DIG.fn(act)`
* **Description:** Executes the DIG action. Calls `DoToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success or `false, work_fail_reason`.

### `ACTIONS.DIG.validfn(act)`
* **Description:** Validates DIG action by calling `ValidToolWork`.
* **Parameters:** `act` — action table.
* **Returns:** Boolean indicating if DIG is valid.

### `ACTIONS.DIG.theme_music_fn(act)`
* **Description:** Determines whether to play farming-themed music when digging, based on the target being farm debris or a farm plant.
* **Parameters:** `act` — the action object containing target and other context.
* **Returns:** `"farming"` if the target has tag `"farm_debris"` or `"farm_plant"` and `act.target ~= nil`; otherwise `nil`.

### `ACTIONS.FERTILIZE.fn(act)`
* **Description:** Applies fertilizer to various agricultural entities (crops, grower soil, pickable plants, quagmire fertilizables) or the doer themselves if fertilizable.
* **Parameters:** `act` — action object with fields `invobject` (fertilizer item), `doer`, and `target`.
* **Returns:** `true` if fertilizer was successfully applied; otherwise `false`.

### `ACTIONS.SMOTHER.fn(act)`
* **Description:** Smothers a smoldering fire using the inventory item (or doer as smotherer).
* **Parameters:** `act` — action object with `target` (fire entity) and `invobject`.
* **Returns:** `true` if smothering succeeded.

### `ACTIONS.MANUALEXTINGUISH.fn(act)`
* **Description:** Extinguishes an active fire using a frozen item as a coolant/ extinguisher.
* **Parameters:** `act` — action object with `invobject` (frozen item) and `target` (burning entity).
* **Returns:** `true` if extinguish succeeded.

### `ACTIONS.NET.fn(act)`
* **Description:** Allows a workable entity to be "netted", typically for capturing; may replicate via `nabbag` if applicable.
* **Parameters:** `act` — action object with `target`, `doer`, and `invobject`.
* **Returns:** `true` (always) — does not fail even if work was not applied.

### `ACTIONS.CATCH.fn(act)`
* **Description:** Placeholder catch action — no logic implemented.
* **Parameters:** `act` — action object (unused).
* **Returns:** `true`.

### `ACTIONS.FISH_OCEAN.fn(act)`
* **Description:** Ocean fishing action — currently returns failure indicating depth issue.
* **Parameters:** `act` — action object (unused).
* **Returns:** `false`, `"TOODEEP"`.

### `ACTIONS.FISH.fn(act)`
* **Description:** Starts fishing using an equipped fishing rod.
* **Parameters:** `act` — action object with `invobject` (fishing rod) and `target`.
* **Returns:** `true`.

### `ACTIONS.REEL.fn(act)`
* **Description:** Handles reel action during fishing, including hooking fish or stopping if no fish.
* **Parameters:** `act` — action object with `invobject` (fishing rod).
* **Returns:** `true` (always).

### `ACTIONS.REEL.strfn(act)`
* **Description:** Determines the UI string/action label for the Reel action based on the fishing state and target.
* **Parameters:** `act` — the action object containing `invobject`, `target`, and `doer`.
* **Returns:** `"REEL"` if a fish is hooked. `"HOOK"` if the player has the `nibble` tag. `"CANCEL"` otherwise. `nil` if conditions not met.

### `ACTIONS.PICK.strfn(act)`
* **Description:** Returns the appropriate string key for the Pick action based on target tags.
* **Parameters:** `act` — the action object containing `target`.
* **Returns:** `"HARVEST"` if target has `pickable_harvest_str`. `"RUMMAGE"` if target has `pickable_rummage_str`. `"SEARCH"` if target has `pickable_search_str`. `nil` otherwise.

### `ACTIONS.PICK.fn(act)`
* **Description:** Executes the Pick action by delegating to `pickable:Pick()` or `searchable:Search()`.
* **Parameters:** `act` — the action object with `target` and `doer`.
* **Returns:** `false, "STUCK"` if the target is stuck. `true` after successful pick or search. `nil` implicitly if `act.target` is nil.

### `ACTIONS.PICK.validfn(act)`
* **Description:** Validates whether the Pick action can be performed on the target.
* **Parameters:** `act` — the action object with `target`.
* **Returns:** `true` if `act.target` exists and has valid `pickable:CanBePicked()` or `searchable.canbesearched`. `false` otherwise.

### `ACTIONS.PICK.theme_music_fn(act)`
* **Description:** Determines the theme music to play during the Pick action.
* **Parameters:** `act` — the action object with `target`.
* **Returns:** `"farming"` if target has `farm_plant` tag. `nil` otherwise.

### `ACTIONS.ATTACK.fn(act)`
* **Description:** Executes the Attack action, handling specialized combat states (prop attack, thrusting, helm splitting) and calling `combat:DoAttack()`.
* **Parameters:** `act` — the action object with `doer` and `target`.
* **Returns:** `true` after handling specialized attacks or `DoAttack`.

### `ACTIONS.ATTACK.strfn(act)`
* **Description:** Returns the UI string for the Attack action based on weapon/target properties.
* **Parameters:** `act` — the action object with `target` and `invobject` (weapon).
* **Returns:** `"PROP"` if weapon is a prop weapon. `"RANGEDSMOTHER"` if weapon can extinguish target. `"RANGEDLIGHT"` if weapon can light target. `"WHACK"` if target is `whackable` and weapon is a hammer. `"SMASHABLE"` if target is `smashable`. `nil` otherwise.

### `ACTIONS.COOK.stroverridefn(act)`
* **Description:** Overrides the COOK action label if the target has a spicer component.
* **Parameters:** `act` — the action object with `target`.
* **Returns:** `STRINGS.ACTIONS.SPICE` if target has `spicer` tag. `nil` otherwise.

### `ACTIONS.COOK.fn(act)`
* **Description:** Handles the cooking action, supporting multiple cooking mechanisms: `cooker` (e.g., campfire), `stewer` (e.g., crock pot), and `cooker` as a tool used on a `cookable` target (e.g., roasting a pig on a spit).
* **Parameters:** `act` — action object containing `doer`, `target`, `invobject`, and `target` components.
* **Returns:** `true` on successful cooking, `false` or `{false, reason}` on failure (e.g., `"TOOFAR"`, `"INUSE"`).

### `ACTIONS.ACTIVATE_CONTAINER.fn(act)`
* **Description:** Activates a container if it has a custom `cookbuttonfn`, supporting interactive cooking UI triggers (e.g., opening a crock pot).
* **Parameters:** `act` — action object containing `doer` and `target`.
* **Returns:** `true` on success, `false` with `"INUSE"` if container is already open by another player.

### `ACTIONS.FILL.fn(act)`
* **Description:** Handles filling an item with water. Determines which object is the water source and which is the target, validates the action, and calls `fillable:Fill()` if possible. Also supports ocean water filling if `acceptsoceanwater` is true and the action point is at ocean.
* **Parameters:** `act` — action context object containing `target`, `invobject`, `doer`, and `GetActionPoint()` method.
* **Returns:** `true` on success, `false` (optionally with reason string) on failure.

### `ACTIONS.FILL_OCEAN.stroverridefn(act)`
* **Description:** Returns the string key for ocean fill action description, always `STRINGS.ACTIONS.FILL`.
* **Parameters:** `act` — action context object.
* **Returns:** `STRINGS.ACTIONS.FILL`.

### `ACTIONS.DRY.fn(act)`
* **Description:** Handles drying an item using a dryer component. Removes the item from doer's inventory, attempts to start drying on the target, and emits a custom event `CHEVO_starteddrying` on success.
* **Parameters:** `act` — action context object.
* **Returns:** `true` on success, `false` if drying can't be started (and item is returned to inventory).

### `ACTIONS.ADDFUEL.fn(act)`
* **Description:** Adds fuel to a fueled component. Handles two paths: inventory item removal and direct fueler component usage. Attempts to add fuel via `fueled:TakeFuelItem()`, and on failure, attempts to re-stack partial uses.
* **Parameters:** `act` — action context object.
* **Returns:** `true` on success, implicitly `nil`/`false` on failure (no explicit return in all branches).

### `ACTIONS.GIVE.strfn(act)`
* **Description:** Returns the appropriate string override key for GIVE action depending on target tags (e.g., `SOCKET`, `SHOW`, `REPAIR`, `CELESTIAL`). Used to customize UI text per target type.
* **Parameters:** `act` — action context object.
* **Returns:** String key (`"SOCKET"`, `"SHOW"`, `"REPAIR"`, `"CELESTIAL"`) or `nil` if no matching tag found.

### `ACTIONS.GIVE.stroverridefn(act)`
* **Description:** Overrides the string displayed for the GIVE action based on specific entity tags and item types (e.g., Ghostly Elixir, Winter's Feast Table, Quagmire altar items).
* **Parameters:** `act` — action object containing `act.target`, `act.invobject`, and `act.doer` fields.
* **Returns:** Localized string (e.g., `STRINGS.ACTIONS.GIVE.APPLY`, `STRINGS.ACTIONS.GIVE.QUAGMIRE_ALTAR.GENERIC`), or `nil` if no override matches.

### `ShouldBlockGiving(act)`
* **Description:** Determines if giving an item to a target should be blocked due to container restriction rules (specifically for pocket-only items).
* **Parameters:** `act` — action object (same structure as above).
* **Returns:** `true` if giving should be blocked; `false` otherwise.

### `ACTIONS.GIVE.fn(act)`
* **Description:** Handles giving an item (`act.invobject`) to a target entity (`act.target`). Implements special-case logic for several trader-like components and decorative interactions.
* **Parameters:** `act`: Action object containing `doer` (entity performing the action), `target` (entity receiving), `invobject` (item being given), and other metadata.
* **Returns:** `true` on success; `false, reason` on failure with an optional reason string.

### `ACTIONS.GIVETOPLAYER.fn(act)`
* **Description:** Specialized version of `ACTIONS.GIVE` targeting an *opened* trader container (or playerghost), giving a single stack of the item.
* **Parameters:** Same as `ACTIONS.GIVE`.
* **Returns:** `true` on success; `false, "FULL"` if target container cannot accept the item; `false, reason` if trader component validation fails.

### `ACTIONS.GIVEALLTOPLAYER.fn(act)`
* **Description:** Attempts to give the *entire stack* of `act.invobject` to an *opened* trader container. Uses `CanAcceptCount` to determine how many can be accepted.
* **Parameters:** Same as `ACTIONS.GIVE`.
* **Returns:** `true` on success; `false, "FULL"` if target cannot accept any quantity of the item; `false, reason` if trader validation fails.

### `ACTIONS.FEEDPLAYER.fn(act)`
* **Description:** Handles feeding a player character. Checks if the target can eat the item (including pvp settings, monster meat tolerance, spoilage tolerance) and if they prefer to eat it. If yes, removes the food from the feeder's inventory, places it as a child entity on the target, and transitions the target to an eating state.
* **Parameters:** `act` — action object containing `doer`, `target`, `invobject`, and other metadata.
* **Returns:** `true` if the action logic was processed (even if the target refused to eat), or `nil` (implicit) if preconditions fail.

### `ACTIONS.DECORATEVASE.fn(act)`
* **Description:** Attempts to decorate a vase with an item. Validates that target has a vase component and is enabled, then delegates to `vase:Decorate`.
* **Parameters:** `act` — action object.
* **Returns:** `true` if `vase:Decorate` is called, or `nil` if conditions not met.

### `ACTIONS.CARNIVALGAME_FEED.fn(act)`
* **Description:** Feeds a carnival game entity with an item. Checks if the game is still accepting entries and delegates to `carnivalgamefeedable:DoFeed`.
* **Parameters:** `act` — action object.
* **Returns:** Return value of `carnivalgamefeedable:DoFeed`, or `false, "TOO_LATE"` if the game is disabled.

### `ACTIONS.STORE.fn(act)`
* **Description:** Handles the logic for storing an item (e.g., placing into a container, bundler, or occupiable entity). It supports container-to-container transfers, handles restricted containers, special tags like `"mastercookware"` or `"mermonly"`, soul jar interactions, and construction builder proxies. Falls back to occupancy if item is not container-compatible.
* **Parameters:** `act`: An action table containing `act.target` (destination), `act.doer` (actor), `act.invobject` (item to store), and other action metadata.
* **Returns:** `true` on successful store. `false, "INUSE"` if target container is already in use and cannot open. `false, "NOTALLOWED"` if container rejects the item. `false, "RESTRICTED"` if target container is restricted to specific players. `false, "NOTMASTERCHEF"` if trying to use master cookware without the masterchef tag. `false, "NOTAMERM"` if trying to use a merm-only container as non-merm. `false, "NOTSOULJARHANDLER"` if attempting to use a soul jar without the skill unlocked.

### `ACTIONS.BUNDLESTORE.strfn(act)`
* **Description:** Determines if a bundle store action is available for a target. Returns `"CONSTRUCT"` if the doer is interacting with a construction builder UI associated with the target container or target.
* **Parameters:** `act`: Action object containing `target`, `doer`, and other action metadata.
* **Returns:** `"CONSTRUCT"` if conditions match, otherwise `nil`.

### `ACTIONS.STORE.strfn(act)`
* **Description:** Determines the type of store action based on target prefab/tags. Handles stewer, birdcage, and decoratable targets.
* **Parameters:** `act`: Action object.
* **Returns:** `"SPICE"` if stewer has `"spicer"` tag, `"COOK"` for normal stewer, `"IMPRISON"` for `birdcage`, `"DECORATE"` for `"decoratable"` tag, otherwise `nil`.

### `ACTIONS.BUILD.fn(act)`
* **Description:** Delegates to builder component's `DoBuild` function to build a structure.
* **Parameters:** `act`: Action object with `recipe`, `GetActionPoint()`, `rotation`, and `skin`.
* **Returns:** Result of `builder:DoBuild(...)` (truthy/falsy), or `nil` if no builder component.

### `ACTIONS.PLANT.strfn(act)`
* **Description:** Returns `"PLANTER"` if target has `"winter_treestand"` tag, otherwise `nil`.
* **Parameters:** `act`: Action object.
* **Returns:** `"PLANTER"` or `nil`.

### `ACTIONS.PLANT.fn(act)`
* **Description:** Attempts to plant a seed from inventory into a target container (`grower`, `winter_treestand`).
* **Parameters:** `act`: Action object with `doer`, `invobject` (seed), and `target`.
* **Returns:** `true` on successful planting or event push, otherwise `nil` (and returns seed to inventory).

### `ACTIONS.HARVEST.fn(act)`
* **Description:** Unified harvest handler supporting multiple components: crop, harvestable, stewer, dryer, dryingrack, occupiable, and quagmire_tappable.
* **Parameters:** `act`: Action object with `target`, `doer`, `invobject`.
* **Returns:** Truthy result of the respective harvest function, `true` on item transfer, or `nil` if no applicable component or failure.

### `ACTIONS.HARVEST.strfn(act)`
* **Description:** Returns extra status strings for harvest action UI.
* **Parameters:** `act`: Action object.
* **Returns:** `"FREE"` for `birdcage`, `"WITHERED"` for withered crop targets, otherwise `nil`.

### `ACTIONS.LIGHT.fn(act)`
* **Description:** Uses an item as a lighter to ignite a target.
* **Parameters:** `act`: Action object with `invobject` (lighter), `target`, `doer`.
* **Returns:** `true` if lighter used successfully, otherwise `nil`.

### `DoCharlieResidueMapAction(act, target, charlieresidue, residue_context)`
* **Description:** Handles teleportation logic when a character uses a Charlie residue target that is a wormhole or tentacle pillar hole. Finds the matching teleport exit, sets up the "jumpin" state with appropriate teleporter and exit references, and manages residue decay or cooldown.
* **Parameters:** `act` — The action table containing `doer`, `target`, and `GetActionPoint()` data. `target` — The original target entity (usually the Charlie residue). `charlieresidue` — The Charlie residue entity being activated. `residue_context` — One of `CHARLIERESIDUE_MAP_ACTIONS` constants determining behavior.
* **Returns:** `true` if teleportation state was entered successfully; `false` otherwise (including cooldown init).

### `ACTIONS.SLEEPIN.fn(act)`
* **Description:** Handles the sleep-in action for a player. Checks if the action target or inventory object is a sleeping bag and triggers sleeping.
* **Parameters:** `act` — action object containing `doer` (the actor), `target` (the target entity), and `invobject` (the held item).
* **Returns:** `true` if sleeping was initiated; `nil` otherwise (implicit failure).

### `ACTIONS.HITCHUP.fn(act)`
* **Description:** Attempts to hitch a beefalo to a target using a bell held by the player. Validates the bell, beefalo, range, and mood state.
* **Parameters:** `act` — action object.
* **Returns:** `true` on success; `false, "NEEDBEEF"`, `"NEEDBEEF_CLOSER"`, or `"INMOOD"` on failure.

### `ACTIONS.UNHITCH.fn(act)`
* **Description:** Unhitches an entity that has a hitcher component but lacks the hitcher tag.
* **Parameters:** `act` — action object.
* **Returns:** `true` on success; `nil` if unhitching condition not met.

### `ACTIONS.HITCH.fn(act)`
* **Description:** Initiates hitching by setting `hitchingspot` to nil and calling `SetHitched` on the target if it has a hitcher component.
* **Parameters:** `act` — action object.
* **Returns:** Implicit `nil` (no explicit return).

### `ACTIONS.MARK.strfn(act)`
* **Description:** Determines the action string label for mark/unmark by checking if the target is already marked by the doer.
* **Parameters:** `act` — action object.
* **Returns:** `"UNMARK"` if already marked; `nil` otherwise.

### `ACTIONS.MARK.fn(act)`
* **Description:** Marks or unmarks a target entity via markable or markable_proxy component.
* **Parameters:** `act` — action object.
* **Returns:** `true` on success; `false, "NOT_PARTICIPANT"` or `"ALREADY_MARKED"` on failure.

### `ACTIONS.CHANGEIN.strfn(act)`
* **Description:** Returns action label string for dress-up if target has the dressable tag.
* **Parameters:** `act` — action object.
* **Returns:** `"DRESSUP"` if target has dressable tag; `nil` otherwise.

### `ACTIONS.CHANGEIN.fn(act)`
* **Description:** Handles dressing up by invoking wardrobe or groomer component to begin changing.
* **Parameters:** `act` — action object.
* **Returns:** `true` on success; `false, reason` if changing cannot begin.

### `ACTIONS.SHAVE.strfn(act)`
* **Description:** Returns action label string `"SELF"` for self-shave when no target is provided or target is doer and controller is attached.
* **Parameters:** `act` — action object.
* **Returns:** `"SELF"` or `nil`.

### `ACTIONS.SHAVE.fn(act)`
* **Description:** Performs a shaving action using an item on a target or the doer themselves. Delegates to either the `beard` or `shaveable` component of the target.
* **Parameters:** `act` — Action object containing `invobject` (shaving tool), `target` (entity to shave), and `doer` (entity performing the action).
* **Returns:** Returns result of `beard:Shave()` or `shaveable:Shave()`, typically a boolean and optional reason string.

### `ACTIONS.PLAY.strfn(act)`
* **Description:** Returns a string identifier for the PLAY action depending on the object used (specifically for coach whistle). Used for UI/anim selection.
* **Parameters:** `act` — Action object containing `invobject` and `doer`.
* **Returns:** String: `"TWEET"`, `"COACH_ON"`, `"COACH_OFF"`, or nil.

### `ACTIONS.PLAY.fn(act)`
* **Description:** Performs the PLAY action using an instrument item.
* **Parameters:** `act` — Action object containing `invobject` (instrument) and `doer`.
* **Returns:** Result of `instrument:Play(doer)` call, typically `true`.

### `ACTIONS.POLLINATE.fn(act)`
* **Description:** Performs pollination or flower creation using the pollinator component on the doer.
* **Parameters:** `act` — Action object containing `doer` and optionally `target` (flower).
* **Returns:** Returns result of `pollinator:Pollinate(target)` or `pollinator:CreateFlower()`; nil if doer lacks pollinator component.

### `ACTIONS.TERRAFORM.fn(act)`
* **Description:** Performs terraforming using a tool with terraformer component on a specified point.
* **Parameters:** `act` — Action object containing `invobject` (terraforming tool) and `doer`.
* **Returns:** Returns result of `terraformer:Terraform(pt, doer)` call; nil if tool missing or lacks terraformer component.

### `ACTIONS.EXTINGUISH.fn(act)`
* **Description:** Extinguishes a burning target or reduces fuel in a fueled component.
* **Parameters:** `act` — Action object containing `target`.
* **Returns:** `true` if successfully extinguished or fuel adjusted; `nil` if target is not burning or lacks required components.

### `ACTIONS.STOKEFIRE.fn(act)`
* **Description:** Stoking a controlled fire if the target is stokeable and doer has `controlled_burner` tag.
* **Parameters:** `act` — Action object containing `target` and `doer`.
* **Returns:** `true` if successful stoke; `false` if fire is not stokeable; `nil` if target is not burning or doer lacks tag.

### `ACTIONS.LAYEGG.fn(act)`
* **Description:** Forces a pickable target to regenerate (e.g., to enable laying eggs again).
* **Parameters:** `act` — Action object containing `target`.
* **Returns:** Result of `pickable:Regen()`; nil if target is missing or already pickable.

### `ACTIONS.INVESTIGATE.fn(act)`
* **Description:** Investigates a remembered location and clears the location; triggers retargeting for combat.
* **Parameters:** `act` — Action object containing `doer`.
* **Returns:** `true` if location was remembered; nil if no "investigate" location was stored.

### `ACTIONS.COMMENT.fn(act)`
* **Description:** Triggers speech for the doer using either `npc_talker` or `talker` components based on availability, and clears `comment_data` afterward. Handles chatter vs direct speech.
* **Parameters:** `act`: Action object containing `doer`, `target`, and `pos`.
* **Returns:** Implicitly returns `nil`. Does not return a value.

### `ACTIONS.GOHOME.fn(act)`
* **Description:** Moves the doer to a home location by delegating to `spawner`, `childspawner`, or `hideout` components on the target, or emits an event and removes the doer. Supports positional-only homing.
* **Parameters:** `act`: Action object containing `doer`, `target`, and `pos`.
* **Returns:** Returns result of `GoHome(...)` call if applicable. `true` if doer is removed after emitting `onwenthome`. `nil` if no homing logic is triggered.

### `ACTIONS.JUMPIN.strfn(act)`
* **Description:** Returns a localization key ("HAUNT") if the doer is a ghost, otherwise returns `nil`.
* **Parameters:** `act`: Action object containing `doer`.
* **Returns:** `"HAUNT"` or `nil`.

### `ACTIONS.JUMPIN.fn(act)`
* **Description:** Handles the `jumpin_pre` → `jumpin` state transition for teleportation, or reverts to `idle` if conditions fail.
* **Parameters:** `act`: Action object containing `doer` and `target`.
* **Returns:** Implicitly returns `nil`.
* **Error states:** Returns `nil` (no state change) if doer is not in `jumpin_pre` state, or if teleporter target is inactive/missing.

### `ACTIONS.JUMPIN_MAP.stroverridefn(act)`
* **Description:** Returns localization key for map-based wormhole jumps.
* **Parameters:** `act`: Action object (unused).
* **Returns:** `STRINGS.ACTIONS.JUMPIN.MAP_WORMHOLE`.

### `ACTIONS.JUMPIN_MAP.fn(act)`
* **Description:** Action function for the JUMPIN_MAP action. Verifies the doer is in the correct state, processes Charlie residue teleportation logic if applicable, or directly triggers teleportation via jumpin state.
* **Parameters:** `act` — Action table with `doer`, `target`, `invobject`, and state information.
* **Returns:** `true` on successful teleport state entry; implicitly returns `nil` (falsy) otherwise.

### `ACTIONS.TELEPORT.strfn(act)`
* **Description:** Provides the string localization key for the TELEPORT action UI label.
* **Parameters:** `act` — Action table (used only to check `act.target` for existence).
* **Returns:** `"TOWNPORTAL"` string key if `act.target` exists; `nil` otherwise.

### `ACTIONS.TELEPORT.fn(act)`
* **Description:** Action function for teleporting via a town portal item or target. Enters the "entertownportal" state when a valid teleporter object is found in inventory or as target.
* **Parameters:** `act` — Action table with `doer`, `target`, `invobject`, and state information.
* **Returns:** `true` on successful entry into entertownportal state; implicitly returns `nil` otherwise.

### `ACTIONS.RESETMINE.fn(act)`
* **Description:** Resets a mine component on the target entity if present.
* **Parameters:** `act` — an action table containing at least `target` and possibly `doer`.
* **Returns:** `true` if reset succeeded, otherwise `nil` (implicit) or `false` (if no mine component).

### `ACTIONS.ACTIVATE.fn(act)`
* **Description:** Attempts to activate an activatable target, provided it is not smoldering or burning.
* **Parameters:** `act` — action table with `target`, `doer`, and possibly other fields.
* **Returns:** `success` (boolean or `nil` for legacy compatibility), `msg` (optional failure reason string).

### `ACTIONS.ACTIVATE.strfn(act)`
* **Description:** Returns a custom activation verb string if the target defines one.
* **Parameters:** `act` — action table.
* **Returns:** String from `act.target:GetActivateVerb(act.doer)` or `nil`.

### `ACTIONS.ACTIVATE.stroverridefn(act)`
* **Description:** Returns an override activation verb string if defined on the target.
* **Parameters:** `act` — action table.
* **Returns:** String from `act.target:OverrideActivateVerb(act.doer)` or `nil`.

### `ACTIONS.OPEN_CRAFTING.strfn(act)`
* **Description:** Returns the action string from `PROTOTYPER_DEFS` for the target prefab.
* **Parameters:** `act` — action table.
* **Returns:** String from `PROTOTYPER_DEFS[target.prefab].action_str` or `nil`.

### `ACTIONS.OPEN_CRAFTING.fn(act)`
* **Description:** Invokes `UsePrototyper` on the builder component of the doer.
* **Parameters:** `act` — action table with `doer` and `target`.
* **Returns:** `true`/`false`, `msg` from `UsePrototyper`, or `false` if no builder component.

### `ACTIONS.CAST_POCKETWATCH.strfn(act)`
* **Description:** Returns a custom verb string for pocket watch casting actions.
* **Parameters:** `act` — action table with `invobject` and `doer`.
* **Returns:** String from `FunctionOrValue` using `GetActionVerb_CAST_POCKETWATCH` or `nil`.

### `ACTIONS.CAST_POCKETWATCH.fn(act)`
* **Description:** Casts a spell from a pocket watch item if the doer is a pocket watch caster.
* **Parameters:** `act` — action table with `invobject`, `doer`, and `target`; `act:GetActionPoint()` used for target position.
* **Returns:** Result of `act.invobject.components.pocketwatch:CastSpell(...)`, or `nil`.

### `ACTIONS.HAUNT.fn(act)`
* **Description:** Triggers haunting logic on a valid hauntable target if conditions are met.
* **Parameters:** `act` — action table with `target` and `doer`.
* **Returns:** `true` if haunting was initiated, `nil` otherwise.

### `ACTIONS.MURDER.fn(act)`
* **Description:** Handles the murder action, removing the target, playing sound, generating loot, transferring inventory, and pushing events.
* **Parameters:** `act` — action table containing `invobject`, `target`, `doer`.
* **Returns:** `true` on success, or `nil` if no valid target/components.

### `ACTIONS.HEAL.strfn(act)`
* **Description:** Returns the appropriate string label for the heal action UI, handling self-heal cases and special `cannotheal` targets.
* **Parameters:** `act` — action table with `target` and `doer`.
* **Returns:** `"USEONSELF"` if target is self and controller attached; `"USE"` if targeting another; `nil` otherwise; or `"SELF"` for self-heal.

### `ACTIONS.HEAL.fn(act)`
* **Description:** Executes the heal action using a healer or maxhealer item on the target.
* **Parameters:** `act` — action table containing `invobject`, `target`, `doer`.
* **Returns:** Result of `healer:Heal()` or `maxhealer:Heal()`, or `nil` if conditions not met.

### `ACTIONS.UNLOCK.fn(act)`
* **Description:** Unlocks a locked target entity using a key item.
* **Parameters:** `act` — action table with `target`, `invobject`, `doer`.
* **Returns:** `true` on success (even if already unlocked, since comment suggests alternate lock path is commented out).

### `ACTIONS.USEKLAUSSACKKEY.fn(act)`
* **Description:** Uses a Klaus Sack key on the target.
* **Parameters:** `act` — action table with `target`, `invobject`, `doer`.
* **Returns:** `true` on success; `false, reason` if key usage fails.

### `ACTIONS.TEACH.strfn(act)`
* **Description:** Determines the UI label string for the teach action based on item tags.
* **Parameters:** `act` — action table with `invobject`.
* **Returns:** `"NOTES"`, `"SCRAPBOOK"`, `"READ"`, `"SCAN"`, or `nil` depending on `invobject` tags.

### `ACTIONS.TEACH.fn(act)`
* **Description:** Handles the "teach" action—uses the item in `invobject` to teach a skill or recipe to `target` (defaults to `doer`).
* **Parameters:** `act`: Action table with fields `invobject`, `target`, and `doer`.
* **Returns:** Returns `true` on success, or `(success, reason)` if `maprecorder:TeachMap` or `mapspotrevealer:RevealMap` returns extra info. Also calls `postreveal` callback if present.

### `ACTIONS.TURNON.fn(act)`
* **Description:** Turns on a machine (`machine` component) via `TurnOn`.
* **Parameters:** `act`: Action table with `target` or `invobject` as the machine entity.
* **Returns:** `true` on success.

### `ACTIONS.TURNOFF.strfn(act)`
* **Description:** Provides a label string for the "turnoff" action when the target has the `"hasemergencymode"` tag.
* **Parameters:** `act`: Action table with `target`.
* **Returns:** `"EMERGENCY"` if `target` has `"hasemergencymode"` tag, otherwise `nil`.

### `ACTIONS.TURNOFF.fn(act)`
* **Description:** Turns off a machine (`machine` component) via `TurnOff`.
* **Parameters:** `act`: Action table with `target` or `invobject` as the machine entity.
* **Returns:** `true` on success.

### `ACTIONS.USEITEM.fn(act)`
* **Description:** Handles using a held item—supports `toggleableitem`, `useableitem`, and state-memory guard.
* **Parameters:** `act`: Action table with `invobject` and `doer`.
* **Returns:** Result of `ToggleItem` or `StartUsingItem`, or `nil`.

### `ACTIONS.USEITEMON.strfn(act)`
* **Description:** Provides a label string for the "use item on" action.
* **Parameters:** `act`: Action table with `invobject`.
* **Returns:** Uppercase `invobject.prefab` if present, else `"GENERIC"`.

### `ACTIONS.USEITEMON.pre_action_cb(act)`
* **Description:** Pre-action hook to close the controller inventory UI if open.
* **Parameters:** `act`: Action table with `doer` and `HUD`.
* **Returns:** `nil`. Side-effect only.

### `ACTIONS.USEITEMON.fn(act)`
* **Description:** Handles using a held item on a target—supports `useabletargeteditem`.
* **Parameters:** `act`: Action table with `invobject`, `target`, and `doer`.
* **Returns:** `true` on success, or `(success, reason)` if `StartUsingItem` returns a failure reason.

### `ACTIONS.STOPUSINGITEM.strfn(act)`
* **Description:** Provides a label string for the "stop using item" action.
* **Parameters:** `act`: Action table with `invobject`.
* **Returns:** Uppercase `invobject.prefab` if present, else `"GENERIC"`.

### `ACTIONS.STOPUSINGITEM.fn(act)`
* **Description:** Stops using a targeted item via `StopUsingItem`.
* **Parameters:** `act`: Action table with `invobject`.
* **Returns:** `true` on success.

### `ACTIONS.TAKEITEM.fn(act)`
* **Description:** Handles the action of taking a specific item from a target entity, such as a shelf or inventory item holder.
* **Parameters:** `act` — action table containing `target`, `doer`, and other action metadata.
* **Returns:** `true` on success, otherwise `nil` or `false`.

### `ACTIONS.TAKEITEM.strfn(act)`
* **Description:** Returns a string key used for localized action label, based on target prefab (e.g., `"BIRDCAGE"` or `"GENERIC"`).
* **Parameters:** `act` — action table.
* **Returns:** String key (`"BIRDCAGE"` if target is `"birdcage"`, else `"GENERIC"`), or `nil`.

### `ACTIONS.TAKEITEM.stroverridefn(act)`
* **Description:** Generates a dynamic display string for the TAKEITEM action, including item name and stack size where applicable.
* **Parameters:** `act` — action table.
* **Returns:** Localized formatted string with item name/stack count, or `nil`.

### `ACTIONS.TAKESINGLEITEM.fn(act)`
* **Description:** Takes a single item from an `inventoryitemholder`, even if the item is part of a stack.
* **Parameters:** `act` — action table.
* **Returns:** Result of `inventoryitemholder:TakeItem(act.doer, false)`, i.e., `true`/`false`, or `nil` if no component present.

### `ACTIONS.TAKESINGLEITEM.stroverridefn(act)`
* **Description:** Returns a fixed localized string for the TAKESINGLEITEM action.
* **Parameters:** `act` — action table (unused).
* **Returns:** `STRINGS.ACTIONS.TAKESINGLEITEM` string.

### `ACTIONS.CASTSPELL.strfn(act)`
* **Description:** Returns the `spelltype` of the item used to cast the spell (from `act.invobject`).
* **Parameters:** `act` — action table.
* **Returns:** `act.invobject.spelltype` if present, else `nil`.

### `ACTIONS.CASTSPELL.fn(act)`
* **Description:** Handles casting a spell via a spellcaster item (staff). Validates item state, rider/heavy-lifting restrictions, and casts the spell if possible.
* **Parameters:** `act` — action table with `invobject`, `doer`, `target`, and action point.
* **Returns:** `true` on successful cast, `false` or `false, reason` if cast is blocked.

### `ACTIONS.DIRECTCOURIER_MAP.maponly_checkvalidpos_fn(act)`
* **Description:** Validates if a target position is suitable for sending a direct courier via map. Computes nearest valid map icon (player or chest) within radius and checks player-specific constraints (e.g., minimum distance to other players).
* **Parameters:** `act` — Action table containing doer, action point, etc.
* **Returns:** `true, nil, act_posx, act_posz, mapent` on success; `false, "NOTARGET"` if no valid target found.

### `ACTIONS.DIRECTCOURIER_MAP.stroverridefn(act)`
* **Description:** Constructs the UI display string for the DIRECTCOURIER_MAP action, depending on whether the target is a chest or a named player map icon.
* **Parameters:** `act` — Action table (same as above).
* **Returns:** Formatted string using `STRINGS.ACTIONS.DIRECTCOURIER_MAP.SEND` with target name if `mapent` is a named map icon; `STRINGS.ACTIONS.DIRECTCOURIER_MAP.CHEST` if targeting the woby courier chest; `nil` if validation fails.

### `ACTIONS.DIRECTCOURIER_MAP.fn(act)`
* **Description:** Executes the actual courier send action: validates target, checks player controller and woby commands state, computes platform offset, and sends the courier command.
* **Parameters:** `act` — Action table.
* **Returns:** `true` on success; `false` otherwise.

### `TryToSoulhop(act, act_pos, consumeall)`
* **Description:** Helper function to determine if a soul hop (portal jump) action can be performed. Checks action context, state, and availability of the `TryToPortalHop` method.
* **Parameters:** `act` — Action table (contains doer and related data). `act_pos` — Position vector. `consumeall` — Boolean indicating whether to consume all available hops.
* **Returns:** Boolean result of calling `doer:TryToPortalHop(...)`.

### `ACTIONS.BLINK.strfn(act)`
* **Description:** Overrides the display string for the BLINK action, returning `"FREESOUL"` or `"SOUL"` when the doer has the soulstealer tag and active soulhop charges.
* **Parameters:** `act` — Action table (contains invobject and doer).
* **Returns:** `"FREESOUL"` if free soulhop count > 0; `"SOUL"` if at least one soul hop remains; `nil` otherwise.

### `ACTIONS.BLINK.fn(act)`
* **Description:** Handles the `BLINK` action. Attempts to use a blink staff if available; if not, attempts soulhop if the doer can soulhop.
* **Parameters:** `act`: The action table containing `invobject` (item involved), `doer` (actor entity), `GetActionPoint()` (target position).
* **Returns:** `false, "ITEMMIMIC"` if item is mimic; otherwise `true` on successful soulhop or `blinkstaff:Blink(...)`, otherwise returns result of `blinkstaff:Blink`.

### `ACTIONS.BLINK_MAP.stroverridefn(act)`
* **Description:** Generates a dynamic string override for BLINK_MAP action when using soul hopping.
* **Parameters:** `act`: The action table; checks `invobject`, `doer`, and `distancecount`.
* **Returns:** Localized string formatted with soul count if conditions met (no item, doer is soulstealer); otherwise `nil`.

### `ActionCanMapSoulhop(act)` (local function)
* **Description:** Checks whether the doer can perform soulhop for the action.
* **Parameters:** `act`: Action table; checks `invobject`, `doer.CanSoulhop`, and `distancecount`.
* **Returns:** Result of `doer:CanSoulhop(distancecount)` if applicable; otherwise `false`.

### `ACTIONS.BLINK_MAP.fn(act)`
* **Description:** Handles the `BLINK_MAP` action, currently only for soulhop (infinite range).
* **Parameters:** `act`: Same structure as above.
* **Returns:** `true` on successful soulhop and state transition to `"portal_jumpin"` with `from_map = true`; `nil`/`false` otherwise.

### `ACTIONS_MAP_REMAP[ACTIONS.BLINK.code](act, targetpos)`
* **Description:** Maps the raw BLINK action into a soul-hop-style map blink action for Wortox. Calculates hop costs, applies skill-based modifiers (like Lifted Spirits), handles aim-assist logic when the cursor is over water (via fogrevealer/boat logic), and constructs a new `BufferedAction` with soulhop-specific metadata.
* **Parameters:** `act` — the original action; `targetpos` — target world position.
* **Returns:** A modified `BufferedAction` (if valid) or `nil` (on failure, e.g., no valid map tile, invalid revealer, or fails `ActionCanMapSoulhop` check).

### `ACTIONS.CASTSUMMON.fn(act)`
* **Description:** Attempts to summon a ghost via the GhostlyBond component using a summoning item.
* **Parameters:** `act` — an action table containing `invobject`, `doer`, and `target` fields.
* **Returns:** Result of `ghostlybond:Summon()` call, or `nil` if preconditions fail.

### `ACTIONS.CASTUNSUMMON.fn(act)`
* **Description:** Attempts to recall a summoned ghost via the GhostlyBond component.
* **Parameters:** `act` — action table.
* **Returns:** Result of `ghostlybond:Recall(false)` call, or `nil` if preconditions fail.

### `ACTIONS.COMMUNEWITHSUMMONED.strfn(act)`
* **Description:** Returns UI string label based on whether the player has an aggressive follower.
* **Parameters:** `act` — action table with `doer` field.
* **Returns:** `"MAKE_DEFENSIVE"` if `doer` has `"has_aggressive_follower"` tag; otherwise `"MAKE_AGGRESSIVE"` or `nil`.

### `ACTIONS.COMMUNEWITHSUMMONED.fn(act)`
* **Description:** Toggles behavior of the summoned ghost via `ghostlybond:ChangeBehaviour()`.
* **Parameters:** `act` — action table.
* **Returns:** Result of `ghostlybond:ChangeBehaviour()`, or `nil` if preconditions fail.

### `ACTIONS.COMBINESTACK.fn(act)`
* **Description:** Combines two stackable items of the same type and skin if the target stack has room.
* **Parameters:** `act` — action table with `target` and `invobject` fields.
* **Returns:** `true` if stacking succeeded, else `nil`.

### `ACTIONS.TRAVEL.fn(act)`
* **Description:** Triggers travel via the target entity's `travel_action_fn`.
* **Parameters:** `act` — action table with `target` and `doer` fields.
* **Returns:** `true` if `travel_action_fn` was called, else `nil`.

### `ACTIONS.UNPIN.fn(act)`
* **Description:** Unpins a pinned entity by clearing its stuck state.
* **Parameters:** `act` — action table with `target` and `doer` fields.
* **Returns:** `true` after pushing the `"unpinned"` event, or `nil` if target is not stuck.

### `ACTIONS.STEALMOLEBAIT.fn(act)`
* **Description:** Steals mole bait from a mole’s selected target.
* **Parameters:** `act` — action table with `doer` and `target` fields.
* **Returns:** `true` after setting `selectedasmoletarget` to `nil` and pushing `"onstolen"` event, or `nil` if `doer` is not `"mole"` or `target` is missing.

### `ACTIONS.MAKEMOLEHILL.fn(act)`
* **Description:** Spawns a molehill or molebathill childed to the mole/molebat and clears `needs_home_time`.
* **Parameters:** `act` — action table with `doer` field.
* **Returns:** `true` after spawning hill and childing, or `nil` if `doer` is missing or not mole/molebat.

### `ACTIONS.MOLEPEEK.fn(act)`
* **Description:** Triggers a peek action for the mole entity.
* **Parameters:** `act` — action table with `doer` field.
* **Returns:** `true` after pushing `"peek"` event, or `nil` if `doer` is missing.

### `ACTIONS.FEED.strfn(act)`
* **Description:** Returns `"TREAT"` string if the item is a pet treat; otherwise `nil`.
* **Parameters:** `act` — action table with `invobject` field.
* **Returns:** `"TREAT"` if `invobject` is non-nil and has `"pet_treat"` tag; otherwise `nil`.

### `ACTIONS.FEED.fn(act)`
* **Description:** Attempts to feed an item to a target entity. Handles two paths: feeding via `trader` component (gift acceptance) or `eater` component (direct consumption). If feeding causes the eater to die, it handles victim death logic including loot generation and cause-of-death tracking.
* **Parameters:** `act` — the action object containing `invobject` (item to feed), `target` (recipient), and `doer` (actor performing the action).
* **Returns:** `true` on success; `false, reason` on failure. May also return `true` after performing kill/loot logic.

### `ACTIONS.HAIRBALL.fn(act)`
* **Description:** Checks if the action is being performed by a catcoon (valid for hairball action).
* **Parameters:** `act` — action object (not used beyond checking `act.doer`).
* **Returns:** `true` if `act.doer` is a catcoon; otherwise implicitly returns `nil` (not `false`).

### `ACTIONS.CATPLAYGROUND.fn(act)`
* **Description:** Action handler for catcoon interactions with objects on the ground. Attempts to play with `cattoy`, `poppable`, attack weak targets, pick up items, or activate activatable objects, with probabilistic success based on tuning values.
* **Parameters:** `act` — action table containing fields `doer`, `target`, and optionally `invobject`.
* **Returns:** `true` on successful execution path; `false` or error reason implicitly in some branches.

### `ACTIONS.CATPLAYAIR.fn(act)`
* **Description:** Action handler for catcoon aerial interactions (e.g., swiping at objects). Similar logic to `CATPLAYGROUND` but may interact differently with `cattoy` and registers `last_play_air_time`.
* **Parameters:** `act` — same as above.
* **Returns:** `true` on successful execution path; no explicit return for all paths.

### `ACTIONS.ERASE_PAPER.fn(act)`
* **Description:** Erases a paper using a `papereraser` tool. Verifies required components and heat/fire constraints before delegating erasure.
* **Parameters:** `act` — action table with `invobject`, `target`, and `doer`.
* **Returns:** Result of `act.target.components.papereraser:DoErase(...)`, which returns a boolean (`true` on success, `false` otherwise).

### `ACTIONS.FAN.fn(act)`
* **Description:** Uses a fan item on a target (defaults to the doer if no target). Blocks use on item mimics.
* **Parameters:** `act` — action table with `invobject` (the fan), `target`, and `doer`.
* **Returns:** Result of `act.invobject.components.fan:Fan(...)`, or `"ITEMMIMIC"` string if the item is an item mimic.

### `ACTIONS.TOSS.fn(act)`
* **Description:** Handles the "toss" action. It retrieves the projectile from either `act.invobject` or the doer’s equipped hand, validates tossability (e.g., not restricted, not preventing unequipping, not a mimic), drops it from inventory, then launches it as a complex projectile toward `act.target` or action point.
* **Parameters:** `act`: The action table containing `doer`, `invobject`, and action context (e.g., `target`, `GetActionPoint()`).
* **Returns:** `true` on success, `false` with `"ITEMMIMIC"` reason if item is a mimic, or `nil` on validation failure or inventory/drop issues.

### `ActionCanMapToss(act)`
* **Description:** Helper function to check whether an item can be tossed on the map via the `CanTossOnMap` method on the item.
* **Parameters:** `act`: Action table.
* **Returns:** Boolean result of `act.invobject:CanTossOnMap(act.doer)` or `false` if either `act.doer` or `act.invobject` is missing.

### `ACTIONS.TOSS_MAP.fn(act)`
* **Description:** Launches a toss action targeting a map point (ocean or visual ground). Sets `act.from_map = true` then delegates to `ACTIONS.TOSS.fn`.
* **Parameters:** `act`: Action table.
* **Returns:** Result of `ACTIONS.TOSS.fn(act)` or `nil`.

### `ACTIONS_MAP_REMAP[ACTIONS.TOSS.code](act, targetpos)`
* **Description:** Remaps a TOSS action to ensure target point respects distance constraints (`map_remap_min_dist`, `map_remap_max_dist`) and lies on valid ocean tile. If valid, creates a buffered TOSS_MAP action at the adjusted point.
* **Parameters:** `act`: Original action. `targetpos`: Desired target position (Vector3).
* **Returns:** New buffered `BufferedAction` for `TOSS_MAP`, or `nil` if invalid.

### `ACTIONS.WATER_TOSS.fn`
* **Description:** Simply points to `ACTIONS.TOSS.fn`. No further logic.
* **Parameters:** None directly defined here; inherits from `TOSS.fn(act)`.
* **Returns:** Same as `TOSS.fn`.

### `ACTIONS.UPGRADE.fn(act)`
* **Description:** Performs an upgrade action: checks if `invobject` (upgrader) and `target` (upgradeable) are present and compatible, then calls `CanUpgrade()` and `Upgrade()` on the target component.
* **Parameters:** `act`: Action table with `doer`, `invobject`, and `target`.
* **Returns:** `true` on success, `false` with `reason` if upgrade conditions fail, or `nil` if required components or items are missing.

### `ACTIONS.UPGRADE.strfn(act)`
* **Description:** Generates a string label for the UPGRADE action, specifically checking if the target has the `WATERPLANT_upgradeable` tag.
* **Parameters:** `act` — the action context object containing `target`, `doer`, etc.
* **Returns:** `"WATERPLANT"` if target has tag `WATERPLANT_upgradeable`; `nil` otherwise.

### `ACTIONS.NUZZLE.fn(act)`
* **Description:** Verifies that the target exists for the NUZZLE action (custom affection interaction).
* **Parameters:** `act` — action context; uses `act.target`.
* **Returns:** `true` if `act.target` exists (always succeeds if target is present).

### `ACTIONS.WRITE.fn(act)`
* **Description:** Initiates writing on a target (e.g., a parchment) via the `writeable` component.
* **Parameters:** `act` — action context (`doer`, `target`).
* **Returns:** `true` if writing started; `false, "INUSE"` if already being written.

### `ACTIONS.ATTUNE.fn(act)`
* **Description:** Attunes a target item to the doer using the `attunable` component.
* **Parameters:** `act` — action context (`doer`, `target`).
* **Returns:** Result of `act.target.components.attunable:LinkToPlayer(act.doer)` (boolean, optional reason string).

### `ACTIONS.MIGRATE.fn(act)`
* **Description:** Activates a world migration portal via the `worldmigrator` component.
* **Parameters:** `act` — action context (`doer`, `target`).
* **Returns:** Result of `worldmigrator:Activate(act.doer)` (boolean, optional fail reason string `"NODESTINATION"`).

### `ACTIONS.REMOTERESURRECT.fn(act)`
* **Description:** Triggers respawn from ghost state using an attuned remote resurrector or grave-stone resurrector.
* **Parameters:** `act` — action context (`doer`).
* **Returns:** `true` if respawn event pushed; `nil` if no valid target or conditions not met.

### `ACTIONS.REVIVE_CORPSE.fn(act)`
* **Description:** Revives a corpse if conditions are met (via `revivablecorpse` component).
* **Parameters:** `act` — action context (`doer`, `target`).
* **Returns:** `true` unconditionally (silent failure if conditions not met).

### `ACTIONS.MOUNT.fn(act)`
* **Description:** Mounts a creature or vehicle; performs multiple validity checks before mounting.
* **Parameters:** `act` — action context (`doer`, `target`).
* **Returns:** `true` on mount success; `false, "TARGETINCOMBAT"`, `"INUSE"`, or `nil` (implicit) on failure.

### `ACTIONS.DISMOUNT.fn(act)`
* **Description:** Dismounts the doer if currently riding.
* **Parameters:** `act` — action context (`doer`, `target`, must be same).
* **Returns:** `true` on successful dismount; `nil` otherwise.

### `ACTIONS.SADDLE.fn(act)`
* **Description:** Handles the action of saddling a rideable entity. Checks for combat status, death, item mimicry, and then applies the saddle via the `rideable` component.
* **Parameters:** `act` — the action table containing `doer`, `target`, `invobject`.
* **Returns:** `false` with reason `"TARGETINCOMBAT"` or `nil`, `"ITEMMIMIC"` if validation fails; `true` on success.

### `ACTIONS.UNSADDLE.fn(act)`
* **Description:** Removes the saddle from a rideable entity by calling `SetSaddle` with `nil`. Otherwise mirrors `SADDLE` validation.
* **Parameters:** `act` — the action table.
* **Returns:** `false` with reason `"TARGETINCOMBAT"` or `nil`, `"ITEMMIMIC"` on failure; `true` on success.

### `ACTIONS.BRUSH.fn(act)`
* **Description:** Performs brushing of a target entity (e.g., petting/bearding) using the `brushable` component.
* **Parameters:** `act` — the action table.
* **Returns:** `false` with reason `"TARGETINCOMBAT"` or `nil`, `"ITEMMIMIC"` on failure; `true` on success.

### `ACTIONS.ABANDON.fn`
* **Description:** Handles abandoning a pet/follower. Uses `petleash:DespawnPet` for critters or `follower:StopFollowing` for followers (must be leader). Supports orphanage check for critters.
* **Parameters:** `act` — the action table.
* **Returns:** `false` if critter abandoned without orphanage access and no orphanage nearby; `true` on success.

### `ACTIONS.PET.fn(act)`
* **Description:** Pets a target entity, triggering `crittertraits:OnPet` and `on_petted` events for appropriate entities.
* **Parameters:** `act` — the action table.
* **Returns:** `true` unconditionally if `target` is valid (no validation returns).

### `ACTIONS.RETURN_FOLLOWER.fn(act)`
* **Description:** Returns a follower to its owner’s kitcoon den (if available) by calling `kitcoonden:AddKitcoon`. Requires the `near_kitcoonden` tag and a valid den within range.
* **Parameters:** `act` — the action table.
* **Returns:** `true` if added to den; `false` otherwise.

### `ACTIONS.HIDEANSEEK_FIND.fn(act)`
* **Description:** Searches a hiding spot (e.g., for Hide and Seek minigame) using `hideandseekhidingspot:SearchHidingSpot`.
* **Parameters:** `act` — the action table; uses `target` or `invobject` as the hiding spot.
* **Returns:** `true` if calling `SearchHidingSpot` succeeded; `false` (implicit) if `targ` or component missing.

### `ACTIONS.DRAW.fn`
* **Description:** Handles the draw action, drawing an image onto a target using a drawing tool.
* **Parameters:** `act` — action object containing `invobject` (drawing tool), `target` (drawable entity), `doer`.
* **Returns:** true on success, false with reason "NOIMAGE" if no image is found.

### `ACTIONS.STARTCHANNELING.fn`
* **Description:** Initiates channeling on a target (typically a pump) via the channelable component.
* **Parameters:** `act` — action object.
* **Returns:** result of `StartChanneling` call (truthy value), nil if target nil or no channelable component.

### `ACTIONS.STOPCHANNELLING.fn`
* **Description:** Stops channeling on a target.
* **Parameters:** `act` — action object.
* **Returns:** true unconditionally.

### `ACTIONS.START_CHANNELCAST.fn`
* **Description:** Starts channel-casting using either an equipped item or the off-hand (item nil), via the channelcaster component.
* **Parameters:** `act` — action object with `doer`, `invobject`.
* **Returns:** result of `StartChanneling`, false with reason "ITEMMIMIC" if item is mimic.

### `ACTIONS.STOP_CHANNELCAST.fn`
* **Description:** Stops channel-casting on a specific item.
* **Parameters:** `act` — action object.
* **Returns:** true unconditionally.

### `ACTIONS.BUNDLE.fn`
* **Description:** Starts bundling a target (item or entity) using the doer’s bundler component.
* **Parameters:** `act` — action object.
* **Returns:** result of `StartBundling`, or true if bundling in dark (silent fail).

### `ACTIONS.WRAPBUNDLE.fn`
* **Description:** Finishes wrapping a bundle (container) using bundler.
* **Parameters:** `act` — action object.
* **Returns:** result of `FinishBundling`, true on completion or error.

### `ACTIONS.UNWRAP.fn`
* **Description:** Unwraps an item (unwrapable component) via its `Unwrap` method.
* **Parameters:** `act` — action object.
* **Returns:** true unconditionally.

### `ACTIONS.PEEKBUNDLE.fn(act)`
* **Description:** Attempts to peek inside a wrapped bundle container. Only if the bundle is unwrapppable, has `"canpeek"` tag, is not smoldering or on fire, and the doer can start bundling. Also returns active action item to inventory if needed before peaking.
* **Parameters:** `act`: Action table containing `target`, `invobject`, and `doer`.
* **Returns:** Result of `target.components.unwrappable:PeekInContainer(act.doer)` (boolean).

### `ACTIONS.BREAK.strfn(act)`
* **Description:** Determines string label for BREAK action. Returns `"PICKAPART"` only if target or inventory object has `"pickapart"` tag.
* **Parameters:** `act`: Action table. Uses `act.target` or `act.invobject` as target.
* **Returns:** `"PICKAPART"` or `nil`.

### `ACTIONS.CONSTRUCT.stroverridefn(act)`
* **Description:** Returns a custom name for the CONSTRUCT action, using either construction name from inventory object or target.
* **Parameters:** `act`: Action table. Uses `act.invobject` or `act.target`.
* **Returns:** Formatted string like `"{name}"` from `STRINGS.ACTIONS.CONSTRUCT.GENERIC_FMT`, or `nil`.

### `ACTIONS.CONSTRUCT.strfn(act)`
* **Description:** Determines string label for CONSTRUCT action based on target tags and presence of inventory object.
* **Parameters:** `act`: Action table. Checks `act.invobject`, `act.target`, and target tags: `"offerconstructionsite"`, `"constructionsite"`, `"repairconstructionsite"`, `"rebuildconstructionsite"`.
* **Returns:** One of `"OFFER"`, `"STORE"`, `"OFFER_TO"`, `"REPAIR"`, `"REBUILD"`, or `nil`.

### `ACTIONS.CONSTRUCT.fn(act)`
* **Description:** Handles the construction action, initiating building or offering repair/expand/rebuild UI.
* **Parameters:** `act` — action table containing `doer`, `target`, `invobject` (item in hand), etc.
* **Returns:** Boolean (success) and optional `reason` string; silent failure (`true`) for controller spam or UI visibility checks.

### `ACTIONS.STOPCONSTRUCTION.stroverridefn(act)`
* **Description:** Returns a custom tooltip string for STOPCONSTRUCTION when the target has a `constructionname`.
* **Parameters:** `act` — action table.
* **Returns:** String or `nil`.

### `ACTIONS.STOPCONSTRUCTION.strfn(act)`
* **Description:** Selects which string key to use for STOPCONSTRUCTION based on tags on target.
* **Parameters:** `act` — action table.
* **Returns:** `"OFFER"`, `"REPAIR"`, `"REBUILD"` or `nil`.

### `ACTIONS.STOPCONSTRUCTION.fn(act)`
* **Description:** Stops any ongoing construction.
* **Parameters:** `act` — action table.
* **Returns:** `true` unconditionally.

### `ACTIONS.APPLYCONSTRUCTION.strfn(act)`
* **Description:** Selects which string key to use for APPLYCONSTRUCTION based on tags on target.
* **Parameters:** `act` — action table.
* **Returns:** `"OFFER"`, `"REPAIR"`, `"REBUILD"` or `nil`.

### `ACTIONS.APPLYCONSTRUCTION.fn(act)`
* **Description:** Attempts to finalize construction (e.g., placing ingredients into a construction site container).
* **Parameters:** `act` — action table.
* **Returns:** Boolean (success) — returns result of `FinishConstruction()` if container has items; otherwise returns `true` on empty check or failure message.

### `ACTIONS.APPLYPRESERVATIVE.fn(act)`
* **Description:** Applies preservative effect to a target item, increasing its shelf life by modifying `perishable.percent`. The effect is scaled by stack size and `percent_increase`, and consumes the preservative item.
* **Parameters:** `act`: Action object with `target`, `invobject`, `doer` fields (standard DST action structure).
* **Returns:** `true` on success, `false` otherwise.

### `COMPARE_WEIGHABLE_TEST(target, weighable)`
* **Description:** Helper function to validate that `target` and `weighable` share a compatible trophy scale type (e.g., both `"trophyscale_meat"` and `"weighable_meat"`).
* **Parameters:** `target`: Entity being compared on the trophy scale. `weighable`: Item being weighed (or equipped heavy item).
* **Returns:** `true` if tags match any `TROPHYSCALE_TYPES`, `false` otherwise.

### `ACTIONS.COMPARE_WEIGHABLE.fn(act)`
* **Description:** Initiates weight comparison on a trophy scale using an item or equipped heavy item. Calls `trophyscale:Compare()` to update trophy if the item is heavier.
* **Parameters:** `act`: Action object (`target` is trophy scale, `invobject` is item to weigh; defaults to heavy body slot if `invobject` is nil).
* **Returns:** Return value of `trophyscale:Compare()` (`true`, `false, "TYPENAME_TOO_SMALL"`), or `false` if preconditions fail.

### `ACTIONS.WEIGH_ITEM.fn(act)`
* **Description:** Weighs an item using a weigher (either target or invobject), invoking `itemweigher:DoWeighIn()`.
* **Parameters:** `act`: Action object (`target` and `invobject` can hold weigher/weighable roles).
* **Returns:** Return value of `itemweigher:DoWeighIn()`, or `false` if weigher/weighable not found or weigher is burnt/fire.

### `ACTIONS.START_CARRAT_RACE.fn(act)`
* **Description:** Starts a carrat race if the race start controller allows and racers exist. Plays race start string with delay if present.
* **Parameters:** `act`: Action object (`target` is race start entity).
* **Returns:** `true` on success, `false, "NO_RACERS"` if no racers, or `false` if conditions fail.

### `ACTIONS.TILL.fn(act)`
* **Description:** Tills soil using a farm tiller (e.g., hoe) or Quagmire-specific tiller. Calls respective `till()` function with action point.
* **Parameters:** `act`: Action object (`invobject` must be tiller, `target` is ignored; action point derived from `act:GetActionPoint()`).
* **Returns:** Return value of `farmtiller:Till()` or `quagmire_tiller:Till()`, or `false` if `invobject` is itemmimic.

### `ACTIONS.PLANTSOIL.fn(act)`
* **Description:** Attempts to plant a seed onto a soil tile. Removes the seed from the player's inventory, checks for Quagmire-specific or standard farm plantable components, and plants accordingly.
* **Parameters:** `act` — action table containing `invobject`, `doer`, `target`.
* **Returns:** `true` on successful planting; `nil` or implicit `false` otherwise.

### `ACTIONS.INSTALL.fn(act)`
* **Description:** Attempts to install an item (e.g., Quagmire gadget) onto a compatible target structure. Supports Quagmire installables and salt extractors.
* **Parameters:** `act` — action table.
* **Returns:** `true` on successful installation; `nil` otherwise.

### `ACTIONS.TAPTREE.fn(act)`
* **Description:** Toggles tap state on a tree. Uninstalls tap if already tapped; installs tap if target is tappable and tapper tool is held.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success; `nil` otherwise.

### `ACTIONS.TAPTREE.strfn(act)`
* **Description:** Returns action string for tapping a tree: "UNTAP" if target not tappable, otherwise `nil`.
* **Parameters:** `act` — action table (uses `act.target`).
* **Returns:** `"UNTAP"` string or `nil`.

### `ACTIONS.SLAUGHTER.stroverridefn(act)`
* **Description:** Returns custom string for slaughter action if held tool defines one (via `GetSlaughterActionString` method).
* **Parameters:** `act` — action table.
* **Returns:** Custom action string from `invobject`, or `nil`.

### `ACTIONS.SLAUGHTER.fn(act)`
* **Description:** Slaughters a target entity using a Quagmire slaughter tool.
* **Parameters:** `act` — action table.
* **Returns:** `true` on successful slaughter; `false` with `"TOOFAR"` if out of range, or `nil`.

### `ACTIONS.REPLATE.stroverridefn(act)`
* **Description:** Generates custom action string for replating action using Quagmire replatable entity name.
* **Parameters:** `act` — action table.
* **Returns:** Formatted string like `"Replate <Dish>"` if valid replatable entity found; `nil`.

### `ACTIONS.BATHBOMB.fn(act)`
* **Description:** Attempts to use a bath bomb on a bathbombable target. Validates both components, calls the target's OnBathBombed method, and removes the bath bomb item.
* **Parameters:** `act` — the action table containing doer, target, and invobject.
* **Returns:** `true` on success; implicit `nil` otherwise.

### `ACTIONS.RAISE_SAIL.fn(act)`
* **Description:** Unfurleds (fully raises) a sail by calling mast component's UnfurlSail.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success; implicit `nil` if target or mast component missing.

### `ACTIONS.RAISE_SAIL.stroverridefn(act)`
* **Description:** Returns the localized string for the RAISE_SAIL action.
* **Parameters:** `act` — action table.
* **Returns:** `STRINGS.ACTIONS.RAISE_SAIL`.

### `ACTIONS.LOWER_SAIL.fn(act)`
* **Description:** Placeholder function that returns `true`; no actual sail-lowering logic implemented here (comment indicates naming is inverted).
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.LOWER_SAIL.stroverridefn(act)`
* **Description:** Returns the localized string for the LOWER_SAIL action.
* **Parameters:** `act` — action table.
* **Returns:** `STRINGS.ACTIONS.LOWER_SAIL`.

### `ACTIONS.LOWER_SAIL_BOOST.fn(act)`
* **Description:** Applies boost to lowering a sail by calling mast component's AddSailFurler with calculated strength modifier based on expert sailor stats and master crewman tag.
* **Parameters:** `act` — action table.
* **Returns:** `true` on success; implicit `nil` if target, mast, or `is_sail_raised` condition not met.

### `GetLowerSailStr(act)`
* **Description:** Helper function returning the appropriate localized string index for LOWER_SAIL_BOOST based on `switchtoho` tag.
* **Parameters:** `act` — action table.
* **Returns:** String index: `STRINGS.ACTIONS.LOWER_SAIL_BOOST[1]` or `[2]`.

### `ACTIONS.LOWER_SAIL_BOOST.stroverridefn(act)`
* **Description:** Wraps `GetLowerSailStr` to provide localized string for the boost action.
* **Parameters:** `act` — action table.
* **Returns:** Localized string.

### `ACTIONS.LOWER_SAIL_FAIL.fn(act)`
* **Description:** No-op function that simply returns `true`.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.LOWER_SAIL_FAIL.stroverridefn(act)`
* **Description:** Returns the same localized string as the boost/normal lowering actions.
* **Parameters:** `act` — action table.
* **Returns:** Localized string via `GetLowerSailStr`.

### `ACTIONS.RAISE_ANCHOR.fn(act)`
* **Description:** Calls `AddAnchorRaiser` on the anchor component of the target.
* **Parameters:** `act` — action table.
* **Returns:** Return value of `AddAnchorRaiser` (boolean).

### `ACTIONS.LOWER_ANCHOR.fn(act)`
* **Description:** Calls `StartLoweringAnchor` on the target's anchor component.
* **Parameters:** `act` — action table.
* **Returns:** Return value of `StartLoweringAnchor` (boolean).

### `ACTIONS.MOUNT_PLANK.fn(act)`
* **Description:** Calls `MountPlank` on the walking plank component.
* **Parameters:** `act` — action table.
* **Returns:** Boolean return of `MountPlank`.

### `ACTIONS.DISMOUNT_PLANK.fn(act)`
* **Description:** Calls `DismountPlank` on the walking plank component.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.ABANDON_SHIP.fn(act)`
* **Description:** Calls `AbandonShip` on the walking plank component.
* **Parameters:** `act` — action table.
* **Returns:** Boolean return of `AbandonShip`.

### `ACTIONS.EXTEND_PLANK.fn(act)`
* **Description:** Calls `Extend` on the walking plank component.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.RETRACT_PLANK.fn(act)`
* **Description:** Calls `Retract` on the walking plank component.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.REPAIR_LEAK.fn(act)`
* **Description:** Calls `boatleak:Repair` with the item object if all required conditions are met.
* **Parameters:** `act` — action table.
* **Returns:** Return value of `boatleak:Repair` (boolean).

### `ACTIONS.STEER_BOAT.pre_action_cb(act)`
* **Description:** Ensures spell wheel is closed before steering action begins.
* **Parameters:** `act` — action table.
* **Returns:** None.

### `ACTIONS.STEER_BOAT.fn(act)`
* **Description:** Assigns the target entity (e.g., steering wheel) to the doer as their steering wheel for boat control.
* **Parameters:** `act` — action table containing `doer`, `target`, and optionally `invobject`.
* **Returns:** `true` if assignment succeeded; `nil` otherwise.

### `ACTIONS.SET_HEADING.fn(act)`
* **Description:** Instructs the doer’s steering wheel user to steer the boat toward the action point.
* **Parameters:** `act` — action table.
* **Returns:** Result of `act.doer.components.steeringwheeluser:Steer(x, z)` (boolean); `false` if doer lacks `steeringwheeluser`.

### `ACTIONS.STOP_STEERING_BOAT.fn(act)`
* **Description:** Clears the doer’s assigned steering wheel, stopping boat steering.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.CAST_NET.fn(act)`
* **Description:** Casts the fishing net held by the doer toward the action point or target position.
* **Parameters:** `act` — action table.
* **Returns:** `true` if casting succeeded; `false, "ITEMMIMIC"` if item is a mimic; `false` otherwise.

### `ACTIONS.ROTATE_BOAT_CLOCKWISE.fn(act)`
* **Description:** Sets the boat’s rotation direction to clockwise.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.ROTATE_BOAT_COUNTERCLOCKWISE.fn(act)`
* **Description:** Sets the boat’s rotation direction to counterclockwise.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.ROTATE_BOAT_COUNTERCLOCKWISE.stroverridefn(act)`
* **Description:** Returns localized string for the action label.
* **Parameters:** `act` — action table (unused).
* **Returns:** String from `STRINGS.ACTIONS.ROTATE_BOAT_COUNTERCLOCKWISE`.

### `ACTIONS.ROTATE_BOAT_STOP.fn(act)`
* **Description:** Sets the boat’s rotation direction to stopped (0).
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.ROTATE_BOAT_STOP.stroverridefn(act)`
* **Description:** Returns localized string for the action label.
* **Parameters:** `act` — action table (unused).
* **Returns:** String from `STRINGS.ACTIONS.ROTATE_BOAT_STOP`.

### `ACTIONS.BOAT_MAGNET_ACTIVATE.fn(act)`
* **Description:** Activates the boat magnet’s search mode by transitioning to `"search_pre"` state.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.BOAT_MAGNET_DEACTIVATE.fn(act)`
* **Description:** Deactivates the boat magnet by unpairing it from its beacon.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.BOAT_MAGNET_BEACON_TURN_ON.fn(act)`
* **Description:** Turns on the boat magnet beacon. Uses `act.target` or `act.invobject`.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `ACTIONS.BOAT_MAGNET_BEACON_TURN_OFF.fn(act)`
* **Description:** Turns off the boat magnet beacon. Uses `act.target` or `act.invobject`.
* **Parameters:** `act` — action table.
* **Returns:** `true`.

### `IsBoatCannonAmmo(item)`
* **Description:** Helper to check if an item qualifies as boat cannon ammo.
* **Parameters:** `item` — entity to check.
* **Returns:** `true` if `item.projectileprefab ~= nil` and item has tag `"boatcannon_ammo"`; `false` otherwise.

### `ACTIONS.BOAT_CANNON_LOAD_AMMO.fn`
* **Description:** Handles loading ammo into a boat cannon. Attempts to find ammo either from the doer’s active item or inventory (via `IsBoatCannonAmmo`), loads it via `boatcannon:LoadAmmo`, removes the ammo item, and gives feedback.
* **Parameters:** `act` — action structure containing `target`, `doer`, and `invobject` fields.
* **Returns:** `true` on success or if no action taken; `nil` implicitly on early exit paths.

### `ACTIONS.BOAT_CANNON_START_AIMING.pre_action_cb`
* **Description:** Cleanup callback executed before action starts; closes the spell wheel if HUD is present.
* **Parameters:** `act` — action structure.
* **Returns:** `nil`.

### `ACTIONS.BOAT_CANNON_START_AIMING.fn`
* **Description:** Assigns the specified target as the doer’s cannon for aiming, if criteria are met (target has `boatcannon`, not already assigned, not burning, and doer has `boatcannonuser`).
* **Parameters:** `act` — action structure.
* **Returns:** `true` on success, otherwise `nil`.

### `ACTIONS.BOAT_CANNON_SHOOT.fn`
* **Description:** Triggers a cannon to fire: either via `boatcannonuser` state machine or directly on the cannon instance. Clears the cannon association and transitions doer state if applicable.
* **Parameters:** `act` — action structure.
* **Returns:** `true` unconditionally (always succeeds).

### `ACTIONS.BOAT_CANNON_STOP_AIMING.fn`
* **Description:** Clears the doer’s currently assigned cannon via `boatcannonuser:SetCannon(nil)`.
* **Parameters:** `act` — action structure.
* **Returns:** `true` unconditionally.

### `ACTIONS.OCEAN_TRAWLER_LOWER.fn`
* **Description:** Lowers the ocean trawler net by calling `oceantrawler:Lower()`.
* **Parameters:** `act` — action structure.
* **Returns:** `true` unconditionally (no explicit success/failure propagation).

### `ACTIONS.OCEAN_TRAWLER_RAISE.fn`
* **Description:** Raises the ocean trawler net by calling `oceantrawler:Raise()`.
* **Parameters:** `act` — action structure.
* **Returns:** `true` unconditionally.

### `ACTIONS.OCEAN_TRAWLER_FIX.fn`
* **Description:** Fixes the ocean trawler by calling `oceantrawler:Fix()`, and provides feedback via talker.
* **Parameters:** `act` — action structure.
* **Returns:** `true` unconditionally.

### `ACTIONS.GIVE_TACKLESKETCH.fn`
* **Description:** Teaches a tacklesketch to a crafting station if target accepts it: checks for `craftingstation`, not burnt, not burning, and whether the sketch prefab is already known. Calls `tacklesketch:Teach` if valid.
* **Parameters:** `act` — action structure with `invobject`, `target`, and related components.
* **Returns:** `true` on success, `false` on failure, or `"DUPLICATE"` as a reason if the sketch is already known.

### `ACTIONS.REMOVEFROM_TROPHYSCALE.fn(act)`
* **Description:** Handles removing an item from a trophy scale. Checks if the target is valid for removal (not burnt, not on fire, has the component and tag), optionally runs a test function for permission, and calls `TakeItem`.
* **Parameters:** `act`: Action table containing `target`, `doer`, `invobject` fields; used for context of the action.
* **Returns:** Boolean success flag and optional message string (e.g., `false, "REASON"`), or the result of `TakeItem`.

## Events & listeners
### Events
- `onactivated` — Pushed when an activatable target is activated; includes `doer` data.
- `raising_anchor` — Pushed when an anchor begins raising.
- `lowering_anchor` — Pushed when an anchor begins lowering.
- `ammoloaded` / `ammounloaded` — Pushed on boat cannon ammo state change.
- `onextinguish` — Pushed when a fire is extinguished.
- `brushed` — Pushed when a brushable entity is brushed; includes `doer` and `numprizes` data.
- `onopenother` — Pushed on master container when another entity opens it; includes `doer` and `other`.
- `onclose` — Pushed when a container is closed; includes `doer`.
- `onopen` — Pushed when a container is opened.
- `oncookitem` — Pushed after an item is cooked; includes original item and new cooked item.
- `onclose` — Pushed when a container is closed.
- `oneat` — Pushed after an item is eaten; includes `food` and `feeder`.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `lock`/`unlock` events — Pushed on lock state changes.
- `locomote` — Pushed when locomotion starts or stops.
- `deployitem` — Pushed when an item is deployed; includes `prefab`.
- `itemplanted` — Pushed when an item is planted; includes `doer` and `pos`.
- `harvestsomething` — Pushed on harvesting; includes `object`.
- `haunted` — Pushed after haunting logic runs.
- `healthdelta` — Pushed when health changes; includes old/new percent, overtime, cause, afflicter, amount.
- `on light` — Pushed when an entity is lit.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
- `onlighterlight` — Pushed when an entity is lit by a lighter.
-