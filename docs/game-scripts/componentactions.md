---
id: componentactions
title: Componentactions
description: Central system for managing and dispatching context-sensitive actions (e.g., INVENTORY, EQUIPPED, POINT) based on components, tags, and user input.
tags: [entity, inventory, actions, component, input]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: b7084665
system_scope: entity
---

# Componentactions

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `componentactions.lua` file implements a flexible Entity Component System (ECS) extension that enables dynamic, context-sensitive actions on entities based on their attached components and the user's input mode (e.g., INVENTORY, EQUIPPED, POINT). It provides registration and dispatch mechanisms for action collectors (functions that populate an `actions` table with valid actions), validation of actions (via ISVALID handlers), and support for both core game and modded components. Entities expose their action capability via `CollectActions(actiontype, ...)` and `IsActionValid(action, right)`, while mods can register custom action handlers via `AddComponentAction`.

## Usage example
```lua
-- Register a custom action collector for a component named "mycomponent"
local function MyComponentActionCollector(inst, doer, actions, right)
    if doer:HasTag("player") and inst:HasTag("mytag") then
        table.insert(actions, ACTIONS.MYACTION)
    end
end

AddComponentAction("INVENTORY", "mycomponent", MyComponentActionCollector, "MyMod")

-- On an entity instance, collect and validate actions
local actions = {}
self.inst:CollectActions("INVENTORY", doer, actions, false)
for _, action in ipairs(actions) do
    if self.inst:IsActionValid(action, false) then
        -- Handle action
    end
end
```

## Dependencies & tags
**Components used:**
- `aoetargeting`
- `attuner`
- `boatringdata`
- `constructionbuilderuidata`
- `container_proxy`
- `containerinstallableitem`
- `floater`
- `playercontroller`
- `pumpkincarvable`
- `pumpkinhatcarvable`
- `revivablecorpse`
- `singinginspiration`
- `skilltreeupdater`
- `spellbook`
- `plantregistry` (via `ThePlantRegistry`)

**Tags:**
- `"inactive"`, `"engineering"`, `"activatable_forceright"`
- `"anchor_raised"`, `"anchor_transitioning"`
- `"attuned"`
- `"boat"`, `"overriderowaction"`, `"paired"`, `"fire"`, `"burnt"`, `"occupied"`, `"ammoloaded"`, `"turnedoff"`, `"rotating"`
- `"bathingpool"`
- `"battery"`, `"batteryuser"`
- `"bundle"`, `"openedby"`, `"bundle_raised"`, `"bundle_lowered"`
- `"cancatch"`, `"catchable"`, `"projectile"`, `"fishinghook"`, `"fishing_idle"`
- `"channelable"`, `"channeled"`
- `"combat"`, `"dead"`
- `"container_proxy"`, `"bundle"`
- `"critter"`, `"woby"`, `"hitcher"`, `"hitcher_locked"`, `"noabandon"`, `"fedbyall"`, `"handfed"`
- `"crop"`, `"readyforharvest"`, `"withered"`
- `"cancycle"`
- `"deckcontainer"`, `"playingcard"`
- `"dried"`
- `"electrically_linked"`, `"fully_electrically_linked"`
- `"farmplantstress"`, `"weedplantstress"`, `"tendable_farmplant"`
- `"fertilizer"`, `"self_fertilizable"`
- `"grabbable"` (deprecated)
- `"groomer"`, `"hitcher"`
- `"harvestable"`
- `"hauntable"`, `"haunted"`, `"catchable"`
- `"heavy"`, `"heavylift_lmb"`, `"heavyobstacleusetarget"`, `"can_use_heavy"`
- `"inventoryitemholder_take"`, `"takeitem"`
- `"kitcoonden"`
- `"lock"`, `"unlockable"`
- `"machine"`, `"cooldown"`, `"fueldepleted"`, `"alwayson"`, `"emergency"`, `"enabled"`, `"groundonlymachine"`, `"turnedon"`
- `"madsciencelab"`, `"readytocook"`, `"container_full"`, `"container_opened"`
- `"magiciantool"`
- `"markable"`, `"markable_proxy"`
- `"mast"`, `"sailraised"`, `"saillowered"`, `"sail_transitioning"`, `"is_furling"`
- `"mightygym"`, `"hasstrongman"`, `"loaded"`, `"strongman"`, `"player"`
- `"mine"`, `"minesprung"`, `"mine_not_reusable"`
- `"ghostgestalter"`, `"wendy_lunar_3"`
- `"occupiable"`, `"occupied"`
- `"oceantrawler"`, `"trawler_fish_escaped"`, `"trawler_lowered"`
- `"pinnable"`, `"pinned"`
- `"pickable"`, `"intense"`, `"searchable"`
- `"plantresearchable"`, `"fertilizerresearchable"`, `"researchstage"`, `"fertilizerkey"`
- `"portablestructure"`, `"portable_campfire"`, `"portable_campfire_user"`, `"mastercookware"`, `"masterchef"`, `"portableengineer"`, `"groundonlymachine"`, `"fueldepleted"`, `"enabled"`, `"cooldown"`
- `"prototyper"`
- `"pushable"`
- `"tappable"`, `"tapped_harvestable"`, `"CHOP_tool"`
- `"questing"`, `"questowner"`, `"CanBeActivatedBy_Client"`
- `"repairable_sculpture"`, `"work_sculpture"`, `"repairable_moon_altar"`, `"work_moon_altar"`
- `"revivablecorpse"`, `"corpse"`
- `"rideable"`, `"hitched"`, `"dogrider_only"`, `"dogrider"`, `"woby"`
- `"rider"`, `"mount"`
- `"shelf"`, `"takeshelfitem"`
- `"sittable"`, `"cansit"`
- `"sleepingbag"`, `"hassleeper"`, `"insomniac"`, `"spiderden"`, `"spiderwhisperer"`, `"player"`
- `"snowmandecoratable"`, `"waxedplant"`, `"heavy"`
- `"spellbook"`, `"usingmagiciantool"`, `"usingmagictool"`, `"spellbook_open"`
- `"steeringwheel"`, `"occupied"`
- `"stewer"`, `"donecooking"`, `"readytocook"`, `"professionalcookware"`, `"professionalchef"`, `"mastercookware"`
- `"stageactingprop"`, `"play_in_progress"`, `"stageactor"`
- `"storytellingprop"`, `"portable_campfire"`, `"storyteller"`, `"portable_campfire_user"`
- `"talkable"`, `"maxwellnottalking"`
- `"teleporter"`, `"townportal"`, `"vault_teleporter"`, `"channeling"`
- `"trap"`, `"trapsprung"`
- `"trophyscale_"`, `"weighable_"`, `"trophycanbetaken"`, `"burnt"`, `"fire"`
- `"unwrappable"`
- `"walkingplank"`, `"interactable"`, `"plank_extended"`, `"on_walkable_plank"`
- `"wardrobe"`, `"dressable"`
- `"writeable"`
- `"wobycourier"`, `"whistleaction"`, `"portable_campfire"`, `"portable_campfire_user"`
- `"worldmigrator"`, `"migrator"`
- `"yotb_sewer"`, `"readytosew"`
- `"yotb_stager"`, `"yotb_conteststartable"`, `"has_prize"`, `"yotc_conteststartable"`
- `"yotc_racecompetitor"`, `"has_prize"`, `"has_no_prize"`
- `"yotc_racestart"`, `"race_on"`
- `"equippable"`
- `"healerbuffs"`
- `"inuse"`, `"cannotuse"`
- `"useabletargeteditem_inventorydisable"`, `"inuse_targeted"`
- `"maxwellnottalking"`
- `"ghostfriend_notsummoned"`, `"ghostfriend_summoned"`
- `"pocketwatch_inactive"`, `"pocketwatchcaster"`, `"pocketwatch_castfrominventory"`, `"pocketwatch_mountedcast"`
- `"accepts_oceanfishingtackle"`
- `"engineering"`, `"handyperson"`
- `"castfrominventory"`, `"crushitemcast"`
- `"LunarBuildup"`
- `"bearded"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
### `CanCastFishingNetAtPoint(thrower, target_x, target_z)`
* **Description:** Determines if a fishing net can be cast at a given world point by verifying the point lies on ocean (real or virtual) and is at least `min_throw_distance` away from the thrower.
* **Parameters:**  
  - `thrower`: Entity expected to have a `Transform` component, representing the actor casting the net.  
  - `target_x`: X-coordinate (world space).  
  - `target_z`: Z-coordinate (world space; Y is ignored).  
* **Returns:** `true` if distance and ocean conditions are satisfied; otherwise `false`.

### `Row(inst, doer, pos, actions)`
* **Description:** Appends rowing actions to `actions` for a player on a boat, accounting for controller vs keyboard input and platform changes.
* **Parameters:**  
  - `inst`: Unused (retained for interface consistency).  
  - `doer`: Player or entity attempting to row.  
  - `pos`: World position of the cursor or aiming point.  
  - `actions`: Mutable table into which `ROW` actions are appended.  
* **Returns:** `nil`. Modifies `actions` in-place.

### `PlantRegistryResearch(inst, doer, actions)`
* **Description:** Appends plant registry research or plant stress assessment actions if the doer is wielding a plant inspector or is plantkin and the target has researchable or stress tags.
* **Parameters:**  
  - `inst`: Target entity (typically a plant or fertilizer).  
  - `doer`: Player entity performing the check.  
  - `actions`: Mutable actions table.  
* **Returns:** `nil`.

### `GetFishingAction(doer, fishing_target)`
* **Description:** Selects the correct ocean fishing action based on the `doer`’s state and `fishing_target`’s properties (e.g., catchable, projectile).
* **Parameters:**  
  - `doer`: Player entity in `fishing_idle` state.  
  - `fishing_target`: Entity with `fishinghook`, `catchable`, or `projectile` tags.  
* **Returns:** One of `ACTIONS.OCEAN_FISHING_STOP`, `ACTIONS.OCEAN_FISHING_CATCH`, `ACTIONS.OCEAN_FISHING_REEL`, or `nil`.

### `CheckRowOverride(doer, target)`
* **Description:** Checks whether a nearby object (e.g., an `oceantrawler`) overrides standard rowing behavior via proximity.
* **Parameters:**  
  - `doer`: Player or entity.  
  - `target`: Candidate override object with `overriderowaction` tag.  
* **Returns:** `true` if the target’s radius covers the doer (via `boatringdata:GetRadius()` and `TUNING.OVERRIDE_ROW_ACTION_DISTANCE`); otherwise `false`.

### `IsValidScytheTarget(target)`
* **Description:** Checks whether `target` is scythe-compatible.
* **Parameters:**  
  - `target`: Entity to test.  
* **Returns:** `true` if `target:HasOneOfTags(SCYTHE_ONEOFTAGS)`; otherwise `false`.

### `AddComponentAction(actiontype, component, fn, modname)`
* **Description:** Registers a mod-defined action handler for a given action type and component. Adds the component to mod-specific tracking tables and validates mod sync.
* **Parameters:**  
  - `actiontype`: Key in `COMPONENT_ACTIONS` (e.g., `"INVENTORY"`, `"EQUIPPED"`, `"POINT"`).  
  - `component`: Name of the component (string) whose action is being registered.  
  - `fn`: Collector function accepting `(inst, doer, actions, right)` or equivalent parameters per `actiontype`.  
  - `modname`: Mod name used for synchronization diagnostics.  
* **Returns:** `nil`. Throws diagnostic warning if mod sync is broken.

### `EntityScript:RegisterComponentActions(name)`
* **Description:** Registers the entity to respond to actions handled by a given component, updating `self.actioncomponents` and `self.modactioncomponents`.
* **Parameters:**  
  - `name`: Component name (string).  
* **Returns:** `nil`. Silent no-op if `ACTION_COMPONENT_IDS[name]` does not exist.

### `EntityScript:UnregisterComponentActions(name)`
* **Description:** Removes the entity from a given component’s action list.
* **Parameters:**  
  - `name`: Component name.  
* **Returns:** `nil`.

### `EntityScript:CollectActions(actiontype, ...)`
* **Description:** Invokes all action collectors registered for `actiontype` on this entity, including modded ones.
* **Parameters:**  
  - `actiontype`: Key in `COMPONENT_ACTIONS` (e.g., `"INVENTORY"`).  
  - `...`: Arguments passed to each collector (e.g., `doer`, `actions`, `right`).  
* **Returns:** `nil`. Prints warning if `actiontype` is unknown.

### `EntityScript:IsActionValid(action, right)`
* **Description:** Checks if `action` is valid for this entity by delegating to registered `ISVALID` handlers.
* **Parameters:**  
  - `action`: Action object (must contain `.id`, `.rmb` keys).  
  - `right`: Boolean (`true` for right-click context).  
* **Returns:** `true` if any registered ISVALID handler returns `true`; otherwise `false`.

### `EntityScript:HasActionComponent(name)`
* **Description:** Checks whether `name` is registered as an action component for this entity.
* **Parameters:**  
  - `name`: Component name.  
* **Returns:** `true` if registered; otherwise `false`.

### `inventoryitem(inst, doer, target, actions, right)`
* **Description:** Collection function that populates `actions` based on the doer’s held or equipped item and target context. Handles storage, gifting, equipping, loadings, mounting, repair, cooking, harvesting, etc. This is the core dispatcher for item-related actions and is invoked per item tag/component when an item is used.
* **Parameters:**  
  - `inst`: Item being used (held/equipped).  
  - `doer`: Entity (typically player) using the item.  
  - `target`: Entity being acted upon.  
  - `actions`: Mutable actions table.  
  - `right`: Boolean (`true` = right-click).  
* **Returns:** `nil`.

### `inventoryitem_point(inst, doer, target, pos, actions, right)`
* **Description:** Version of `inventoryitem` for actions triggered at a point (`POINT` type). Used for dropping, deploying, casting fishing nets, till soil, etc.
* **Parameters:** Same as `inventoryitem`, plus `pos` (world position).  
* **Returns:** `nil`.

### `inventoryitem_equipped(inst, doer, target, actions, right)`
* **Description:** Version of `inventoryitem` for actions triggered on equipped items (`EQUIPPED` type). Handles charging, channeling, using in-hand tools, rowing, etc.
* **Parameters:** Same as `inventoryitem`, but contextually used with equipped items.  
* **Returns:** `nil`.

## Events & listeners
No events are defined or listened to in this file. It is purely an action registration and dispatch system. Event-driven behavior is handled in other files (e.g., `stategraphs`, `components`, `actions.lua`).