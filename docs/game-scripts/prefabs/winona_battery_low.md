---
id: winona_battery_low
title: Winona Battery Low
description: Defines the Winona Battery Low prefab including the main battery structure, item version, and placer, with complete fuel management, circuit power distribution, skill tree integration, and deployment logic.
tags: [engineering, power, winona, structures, fuel]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 9aad0da3
system_scope: entity
---

# Winona Battery Low

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

This prefab file defines three prefabs: the Winona Battery Low structure (`winona_battery_low`), its corresponding inventory item (`winona_battery_low_item`), and the placer prefab (`winona_battery_low_item_placer`), forming a core component of Winona's engineering power system. The battery accepts multiple fuel types (chemical, horror, nightmare) with priority-based consumption, distributes power through the circuit network to connected devices, and integrates with Winona's skill tree for efficiency upgrades and shadow fuel handling. The structure supports deployment from inventory, hammer dismantling, burning behavior, and saves fuel state across world persistence.

## Usage example

```lua
-- Spawn the battery structure directly:
local battery = SpawnPrefab("winona_battery_low")
battery.Transform:SetPosition(10, 0, 10)

-- Or deploy from inventory item:
local item = SpawnPrefab("winona_battery_low_item")
ThePlayer.components.inventory:GiveItem(item)
-- Player can then deploy using the deployable component

-- Check battery status via inspection:
if battery.components.inspectable ~= nil then
    local status = battery.components.inspectable:getstatus()
    print("Battery status:", status)
end

-- Query fuel level:
if battery.components.fueled ~= nil then
    local percent = battery.components.fueled:GetPercent()
    print("Fuel remaining:", percent * 100 .. "%")
end
```

## Dependencies & tags

**External dependencies:**
- `prefabutil` -- required for MakePlacer factory function
- `TheNet` -- GetClientTable, GetServerIsClientHosted, IsDedicated for engineer online checks
- `TheWorld` -- ismastersim, Map:GetPlatformAtPoint for server checks and platform validation
- `TUNING` -- WINONA_BATTERY_LOW_SHADOW_FUEL_RATE_MULT, WINONA_BATTERY_LOW_FUEL_RATE_MULT, SKILLS.WINONA.BATTERY_EFFICIENCY_RATE_MULT, WINONA_BATTERY_LOW_MAX_FUEL_TIME, WINONA_BATTERY_MIN_LOAD, WINONA_BATTERY_RANGE, WINONA_ENGINEERING_FOOTPRINT, HUANT_TINY for balance constants
- `ACTIONS` -- HAMMER action for workable component
- `DEPLOYSPACING` -- PLACER_DEFAULT for deploy spacing
- `DEPLOYSPACING_RADIUS` -- index for smart deploy radius calculation
- `FRAMES` -- animation frame timing constant
- `FUELTYPE` -- CHEMICAL, NIGHTMARE, BURNABLE fuel type constants
- `ANIM_ORIENTATION` -- OnGround for placer animation orientation
- `LAYER` -- BACKGROUND for placer render layer
- `GLOBAL` -- math.random, math.ceil, math.min, math.max, math.floor, tostring, ipairs, pairs, distsq
- `CreateEntity` -- creates helper and placer entities
- `SpawnPrefab` -- spawns collapse_small FX, winona_battery_low_item, winona_battery_low
- `MakePlacer` -- creates winona_battery_low_item_placer prefab
- `MakeObstaclePhysics` -- sets physics for battery structure
- `MakeInventoryPhysics` -- sets physics for battery item
- `MakeInventoryFloatable` -- makes item floatable in water
- `MakeHauntableWork` -- adds hauntable work behavior
- `MakeMediumBurnable` -- adds burnable behavior to structure and item
- `MakeMediumPropagator` -- adds fire propagation to structure and item
- `DefaultBurntStructureFn` -- default burnt structure behavior
- `PreventCharacterCollisionsWithPlacedObjects` -- prevents collision issues after deployment

**Components used:**
- `battery` -- SetCanBeUsedFn, SetOnUsedFn, SetResolvePartialChargeMultFn for battery power consumption
- `burnable` -- Extinguish, IsBurning, SetOnBurntFn, ignorefuel for fire handling
- `circuitnode` -- ConnectTo, Disconnect, ForEachNode, SetFootprint, SetRange, SetOnConnectFn, SetOnDisconnectFn for power distribution
- `deployable` -- SetDeploySpacing, ondeploy, restrictedtag for item deployment
- `deployhelper` -- AddKeyFilter, AddRecipeFilter, StopHelper, onenablehelper, onstarthelper for placement visualization
- `fueled` -- DoDelta, GetCurrentSection, GetPercent, InitializeFuelLevel, IsEmpty, SetCanTakeFuelItemFn, SetDepletedFn, SetMultiplierFn, SetPercent, SetSectionCallback, SetSections, SetTakeFuelFn, SetTakeFuelItemFn, SetUpdateFn, StartConsuming, StopConsuming for fuel management
- `hauntable` -- SetHauntValue for ghost interaction
- `inspectable` -- getstatus for inspection text
- `inventoryitem` -- IsHeld to check if item is in inventory
- `lootdropper` -- DropLoot when battery is destroyed
- `placer` -- LinkEntity for placer visualization
- `portablestructure` -- SetOnDismantleFn for dismantling to item
- `skilltreeupdater` -- IsActivated for Winona skill checks
- `updatelooper` -- AddOnUpdateFn, RemoveOnUpdateFn for placer helper updates
- `workable` -- SetOnFinishCallback, SetOnWorkCallback, SetWorkAction, SetWorkLeft for hammer interaction

**Tags:**
- `structure` -- add
- `engineering` -- add
- `engineeringbattery` -- add
- `CLASSIFIED` -- add
- `NOCLICK` -- add
- `placer` -- add
- `portableitem` -- add
- `HAMMER_workable` -- check
- `burnt` -- check
- `handyperson` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | See source | Asset definitions for main battery structure (ANIM: winona_battery_low.zip, winona_battery_placement.zip) |
| `assets_item` | table | See source | Asset definitions for battery item (ANIM: winona_battery_low.zip) |
| `prefabs` | table | See source | Prefab dependencies for main battery (collapse_small, winona_battery_low_item) |
| `prefabs_item` | table | See source | Prefab dependencies for battery item (winona_battery_low) |
| `NUM_LEVELS` | number | 6 | Number of fuel sections/levels for battery visualization |
| `PERIOD` | number | 0.5 | Base period for battery power distribution task |
| `BATTERY_COST` | number | TUNING.WINONA_BATTERY_LOW_MAX_FUEL_TIME * 0.9 | Fuel cost threshold for battery usage |
| `PLACER_SCALE` | number | 1.5 | Scale multiplier for battery placer visualization |

## Main functions

### `CalcFuelRateRescale(inst)`
* **Description:** Returns fuel rate multiplier based on shadow fuel types. Returns TUNING.WINONA_BATTERY_LOW_SHADOW_FUEL_RATE_MULT if horror or nightmare level > 0, otherwise TUNING.WINONA_BATTERY_LOW_FUEL_RATE_MULT.
* **Parameters:**
  - `inst` -- entity instance to check horror/nightmare fuel levels
* **Returns:** number fuel rate multiplier
* **Error states:** None

### `CalcEfficiencyMult(inst)`
* **Description:** Returns efficiency multiplier from TUNING.SKILLS.WINONA.BATTERY_EFFICIENCY_RATE_MULT based on inst._efficiency level (0-3).
* **Parameters:**
  - `inst` -- entity instance with _efficiency property
* **Returns:** number efficiency multiplier or 1 if not found
* **Error states:** None

### `ApplyEfficiencyBonus(inst)`
* **Description:** Applies or removes efficiency modifier to fueled.rate_modifiers based on CalcEfficiencyMult result. Adds modifier if mult ~= 1, removes otherwise.
* **Parameters:**
  - `inst` -- entity instance to apply efficiency bonus to
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil

### `IsEngineerOnline(inst)`
* **Description:** Checks if the Winona engineer who owns this battery is still online by searching TheNet:GetClientTable() for matching userid and verifying prefab is winona.
* **Parameters:**
  - `inst` -- battery entity with _engineerid property
* **Returns:** boolean true if engineer online, false otherwise
* **Error states:** None

### `ConfigureSkillTreeUpgrades(inst, builder)`
* **Description:** Configures skill tree upgrades (noidledrain, efficiency levels 0-3, engineerid) based on builder's skilltreeupdater component. Returns true if configuration changed.
* **Parameters:**
  - `inst` -- battery entity to configure
  - `builder` -- player entity building/deploying the battery
* **Returns:** boolean true if dirty (configuration changed)
* **Error states:** None

### `DoAddBatteryPower(inst, node)`
* **Description:** Adds battery power to a connected node with PERIOD + random(2-6) * FRAMES delay.
* **Parameters:**
  - `inst` -- battery entity
  - `node` -- circuit node to add power to
* **Returns:** nil
* **Error states:** Errors if node:AddBatteryPower is not available

### `OnBatteryTask(inst)`
* **Description:** Periodic task callback that calls ForEachNode on circuitnode to distribute battery power to all connected nodes.
* **Parameters:**
  - `inst` -- battery entity running the periodic task
* **Returns:** nil
* **Error states:** Errors if inst.components.circuitnode is nil

### `StartBattery(inst)`
* **Description:** Starts the periodic battery power distribution task if not already running. Creates inst._batterytask with DoPeriodicTask.
* **Parameters:**
  - `inst` -- battery entity to start
* **Returns:** nil
* **Error states:** None

### `StopBattery(inst)`
* **Description:** Cancels and clears the battery power distribution task if running.
* **Parameters:**
  - `inst` -- battery entity to stop
* **Returns:** nil
* **Error states:** None

### `UpdateCircuitPower(inst)`
* **Description:** Calculates total load from connected circuit nodes and updates fueled.rate. Considers noidledrain skill and idle powerload states. Sets rate to 0 if not consuming.
* **Parameters:**
  - `inst` -- battery entity to update power for
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled or inst.components.circuitnode is nil

### `OnCircuitChanged(inst)`
* **Description:** Schedules UpdateCircuitPower to run after 0 time if circuittask is nil. Prevents duplicate scheduling.
* **Parameters:**
  - `inst` -- battery entity with circuit change
* **Returns:** nil
* **Error states:** None

### `NotifyCircuitChanged(inst, node)`
* **Description:** Pushes engineeringcircuitchanged event on the connected node to propagate circuit changes.
* **Parameters:**
  - `inst` -- battery entity
  - `node` -- connected circuit node
* **Returns:** nil
* **Error states:** Errors if node:PushEvent is not available

### `BroadcastCircuitChanged(inst)`
* **Description:** Notifies all connected circuit nodes of changes via NotifyCircuitChanged, then calls UpdateCircuitPower.
* **Parameters:**
  - `inst` -- battery entity to broadcast from
* **Returns:** nil
* **Error states:** Errors if inst.components.circuitnode is nil

### `OnConnectCircuit(inst)`
* **Description:** Called when battery connects to circuit. Starts battery task if fueled and consuming, then triggers OnCircuitChanged.
* **Parameters:**
  - `inst` -- battery entity connecting to circuit
* **Returns:** nil
* **Error states:** None

### `OnDisconnectCircuit(inst)`
* **Description:** Called when battery disconnects. Stops battery task if no longer connected, then triggers OnCircuitChanged.
* **Parameters:**
  - `inst` -- battery entity disconnecting from circuit
* **Returns:** nil
* **Error states:** Errors if inst.components.circuitnode is nil

### `CalcActualFuel(inst, user)`
* **Description:** Calculates actual fuel value considering horror, nightmare, and chemical levels with efficiency multipliers. Checks if user is handyperson or engineer is online.
* **Parameters:**
  - `inst` -- battery entity
  - `user` -- player using the battery
* **Returns:** number actual_fuel, number efficiency_mult or nil, number
* **Error states:** None

### `CanBeUsedAsBattery(inst, user, mult)`
* **Description:** Checks if battery has enough charge to be used. Compares actual_fuel against BATTERY_COST threshold with efficiency considerations.
* **Parameters:**
  - `inst` -- battery entity
  - `user` -- player attempting to use battery
  - `mult` -- optional multiplier for cost calculation
* **Returns:** boolean true if usable, or false, string 'NOT_ENOUGH_CHARGE'
* **Error states:** None

### `UseAsBattery(inst, user, mult)`
* **Description:** Consumes battery fuel for usage. Configures skill tree upgrades if engineer changed, then calls ConsumeBatteryAmount with BATTERY_COST.
* **Parameters:**
  - `inst` -- battery entity being used
  - `user` -- player using the battery
  - `mult` -- optional multiplier for fuel cost
* **Returns:** nil
* **Error states:** Errors if inst:ConsumeBatteryAmount is not available

### `ResolvePartialChargeMult(inst, user, mult)`
* **Description:** Calculates maximum charge multiplier possible given current fuel levels. Returns minimum of requested mult and available fuel ratio.
* **Parameters:**
  - `inst` -- battery entity
  - `user` -- player using battery
  - `mult` -- requested charge multiplier
* **Returns:** number resolved multiplier
* **Error states:** None

### `UpdateSoundLoop(inst, level)`
* **Description:** Updates sound loop intensity parameter based on fuel level. Intensity = 1 - level / NUM_LEVELS.
* **Parameters:**
  - `inst` -- battery entity
  - `level` -- fuel section level (0-6)
* **Returns:** nil
* **Error states:** None

### `StartSoundLoop(inst)`
* **Description:** Plays battery loop sound if not already playing. Also plays nightmare fuel sound if horror_level > 0.
* **Parameters:**
  - `inst` -- battery entity to start sound for
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil

### `StopSoundLoop(inst)`
* **Description:** Kills both loop and nm_loop sounds on the battery.
* **Parameters:**
  - `inst` -- battery entity to stop sound for
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil

### `OnEntityWake(inst)`
* **Description:** Called when entity wakes from sleep. Starts sound loop if fueled and consuming.
* **Parameters:**
  - `inst` -- battery entity waking up
* **Returns:** nil
* **Error states:** None

### `RefreshFuelTypeEffects(inst)`
* **Description:** Updates animation symbols and colors based on fuel type levels (chemical, horror, nightmare). Shows/hides HORROR symbols, sets meter colors, updates sound.
* **Parameters:**
  - `inst` -- battery entity to refresh effects for
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled or inst.AnimState is nil

### `ClearAllFuelLevels(inst)`
* **Description:** Sets chemical, nightmare, and horror levels to 0, then calls RefreshFuelTypeEffects.
* **Parameters:**
  - `inst` -- battery entity to clear fuel for
* **Returns:** nil
* **Error states:** None

### `AdjustLevelsByPriority(inst, hi, mid, low)`
* **Description:** Adjusts fuel levels to not exceed max fuel capacity, prioritizing hi > mid > low. Caps values when sum exceeds currentfuel.
* **Parameters:**
  - `inst` -- battery entity
  - `hi` -- highest priority fuel level property name
  - `mid` -- medium priority fuel level property name
  - `low` -- lowest priority fuel level property name
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil

### `CopyAllProperties(src, dest)`
* **Description:** Copies chemical, nightmare, and horror fuel levels from source to destination entity.
* **Parameters:**
  - `src` -- source entity to copy from
  - `dest` -- destination entity to copy to
* **Returns:** nil
* **Error states:** None

### `CheckElementalBattery(inst)`
* **Description:** Returns fuel type string based on current levels. Returns 'horror' if horror_level > 0, 'nightmare' if nightmare_level > 0, or nil.
* **Parameters:**
  - `inst` -- battery entity to check
* **Returns:** string 'horror' or 'nightmare', or nil
* **Error states:** None

### `ChangeToItem(inst)`
* **Description:** Spawns winona_battery_low_item at battery position, copies fuel percent and properties, plays collapse animation and sound, then removes original.
* **Parameters:**
  - `inst` -- battery structure to convert to item
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab fails

### `OnHitAnimOver(inst)`
* **Description:** Callback for animover event after hit animation. Plays idle_empty if fueled is empty, otherwise idle_charge loop.
* **Parameters:**
  - `inst` -- battery entity with animation ending
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled or inst.AnimState is nil

### `PlayHitAnim(inst)`
* **Description:** Plays hit animation and registers OnHitAnimOver callback for animover event.
* **Parameters:**
  - `inst` -- battery entity to play hit animation on
* **Returns:** nil
* **Error states:** Errors if inst.AnimState is nil

### `OnWorked(inst)`
* **Description:** Called during hammer work. Plays hit animation if accepting fuel, plays hit sound.
* **Parameters:**
  - `inst` -- battery entity being worked on
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil

### `OnWorkFinished(inst)`
* **Description:** Called when hammer work completes. Extinguishes if burning, drops loot, spawns collapse FX, removes entity.
* **Parameters:**
  - `inst` -- battery entity after work complete
* **Returns:** nil
* **Error states:** Errors if inst.components.burnable, lootdropper, or Transform is nil

### `OnWorkedBurnt(inst)`
* **Description:** Called when working on burnt battery. Drops loot, spawns collapse FX, removes entity.
* **Parameters:**
  - `inst` -- burnt battery entity being worked on
* **Returns:** nil
* **Error states:** Errors if inst.components.lootdropper or Transform is nil

### `OnBurnt(inst)`
* **Description:** Called when battery burns. Calls DefaultBurntStructureFn, stops sounds, clears fuel, removes fueled and portablestructure components, disconnects circuit, sets work callback to OnWorkedBurnt.
* **Parameters:**
  - `inst` -- battery entity being burnt
* **Returns:** nil
* **Error states:** Errors if multiple components are nil

### `OnDismantle(inst)`
* **Description:** Called when portable structure is dismantled. Converts to item via ChangeToItem, then removes entity.
* **Parameters:**
  - `inst` -- battery entity being dismantled
* **Returns:** nil
* **Error states:** None

### `GetStatus(inst)`
* **Description:** Returns inspection status string. Returns 'BURNT' if burnt tag, 'BURNING' if burning, 'OFF' if `level <= 0`, 'LOWPOWER' if `level <= 1`, or nil.
* **Parameters:**
  - `inst` -- battery entity to get status for
* **Returns:** string status or nil
* **Error states:** None

### `SetFuelEmpty(inst, silent)`
* **Description:** Clears all fuel levels, stops consuming, broadcasts circuit change, stops battery and sounds, hides meter symbols, plays down sound if not silent.
* **Parameters:**
  - `inst` -- battery entity to set empty
  - `silent` -- boolean to suppress sound effects
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled or AnimState is nil

### `OnFuelEmpty(inst)`
* **Description:** Called when fueled component is depleted. Calls SetFuelEmpty with silent = false.
* **Parameters:**
  - `inst` -- battery entity that ran out of fuel
* **Returns:** nil
* **Error states:** None

### `CanAddFuelItem(inst, item, doer)`
* **Description:** Checks if fuel item can be added. Blocks nightmare fuel unless doer has winona_shadow_1 or winona_shadow_2 skill activated.
* **Parameters:**
  - `inst` -- battery entity
  - `item` -- fuel item being added
  - `doer` -- player adding fuel
* **Returns:** boolean true if allowed
* **Error states:** None

### `OnAddFuelAdjustLevels(inst, item, fuelvalue, doer)`
* **Description:** Adjusts fuel levels based on fuel type priority. Chemical is default, horrorfuel goes to horror_level, other nightmare goes to nightmare_level. Calls AdjustLevelsByPriority.
* **Parameters:**
  - `inst` -- battery entity
  - `item` -- fuel item being added
  - `fuelvalue` -- amount of fuel being added
  - `doer` -- player adding fuel
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil

### `OnAddFuelItem(inst, item, fuelvalue, doer)`
* **Description:** Called before fuel item is destroyed. Configures skill upgrades, adjusts levels, refreshes effects, broadcasts circuit change if horror status changed.
* **Parameters:**
  - `inst` -- battery entity
  - `item` -- fuel item being added
  - `fuelvalue` -- fuel amount
  - `doer` -- player adding fuel
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil

### `OnAddFuel(inst)`
* **Description:** Called when fuel is added. Starts consuming if not already, broadcasts circuit change, starts battery if connected, starts sound loop, plays hit animation and up sound.
* **Parameters:**
  - `inst` -- battery entity receiving fuel
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled or circuitnode is nil

### `OnUpdateFueled(inst)`
* **Description:** Periodic fueled update callback. Adjusts fuel levels (consuming strongest first), refreshes effects, broadcasts if horror status changed.
* **Parameters:**
  - `inst` -- battery entity being updated
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil (called functions access it without guard)

### `OnFuelSectionChange(new, old, inst)`
* **Description:** Called when fuel section changes. Shows/hides meter symbols, sets light override and bloom, clears plug override, applies skin symbol, updates sound loop.
* **Parameters:**
  - `new` -- new fuel section level
  - `old` -- previous fuel section level
  - `inst` -- battery entity
* **Returns:** nil
* **Error states:** Errors if inst.AnimState is nil

### `ConsumeBatteryAmount(inst, cost, share, doer)`
* **Description:** Consumes specified fuel amount from battery. Prioritizes shadow fuel (horror/nightmare) first, then chemical. Calls DoDelta and OnUpdateFueled.
* **Parameters:**
  - `inst` -- battery entity
  - `cost` -- fuel cost table with fuel field
  - `share` -- share divisor for cost
  - `doer` -- player consuming fuel
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil

### `CalcFuelMultiplier(inst, fuel_obj)`
* **Description:** Returns 0.5 multiplier for NIGHTMARE fueltype, 1 for others.
* **Parameters:**
  - `inst` -- battery entity
  - `fuel_obj` -- fuel item being added
* **Returns:** number 0.5 or 1
* **Error states:** Errors if fuel_obj.components.fuel is nil

### `OnUsedIndirectly(inst, doer)`
* **Description:** Called when battery is used indirectly. Skips if engineer still online or same userid. Configures skill upgrades if engineer changed.
* **Parameters:**
  - `inst` -- battery entity
  - `doer` -- player using battery indirectly
* **Returns:** nil
* **Error states:** None

### `OnSave(inst, data)`
* **Description:** Saves battery state. Saves burnt flag if burning/burnt, otherwise saves nightmare/horror levels, noidledrain, efficiency, and engineerid.
* **Parameters:**
  - `inst` -- battery entity being saved
  - `data` -- save data table
* **Returns:** nil
* **Error states:** Errors if inst.components.burnable is nil

### `OnLoad(inst, data, ents)`
* **Description:** Loads battery state. Calls onburnt if burnt, otherwise restores fuel levels, adjusts priorities, refreshes effects, applies skill upgrades.
* **Parameters:**
  - `inst` -- battery entity being loaded
  - `data` -- saved data table
  - `ents` -- entity reference table
* **Returns:** nil
* **Error states:** Errors if inst.components.burnable or fueled is nil

### `OnInit(inst)`
* **Description:** Initializes battery after load. Clears inittask, connects circuitnode to engineeringbatterypowered tag.
* **Parameters:**
  - `inst` -- battery entity initializing
* **Returns:** nil
* **Error states:** Errors if inst.components.circuitnode is nil

### `OnLoadPostPass(inst)`
* **Description:** Called after load post-pass. Cancels inittask if exists and calls OnInit.
* **Parameters:**
  - `inst` -- battery entity in post-load pass
* **Returns:** nil
* **Error states:** None

### `OnBuilt3(inst)`
* **Description:** Final build callback. Removes NOCLICK tag, sets accepting true, plays appropriate idle animation, starts consuming and sounds if has fuel.
* **Parameters:**
  - `inst` -- battery entity after build animation
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled or AnimState is nil

### `OnBuilt2(inst)`
* **Description:** Second build callback. Starts/stops sounds based on fuel, connects circuitnode to engineeringbatterypowered.
* **Parameters:**
  - `inst` -- battery entity during build
* **Returns:** nil
* **Error states:** Errors if inst.components.circuitnode is nil (accessed via :ConnectTo without guard)

### `OnBuilt1(inst, section)`
* **Description:** First build callback. Plays section-specific sound for deploy animation, or up sound for place animation. Starts sound loop.
* **Parameters:**
  - `inst` -- battery entity
  - `section` -- fuel section level
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled, AnimState, or SoundEmitter is nil

### `DoBuiltOrDeployed(inst, doer, anim, sound, powerupframe, connectframe)`
* **Description:** Common build/deploy logic. Configures skills, applies bonus, plays animation, sets NOCLICK tag, stops consuming, schedules OnBuilt1 and OnBuilt2, hides excess meter symbols.
* **Parameters:**
  - `inst` -- battery entity
  - `doer` -- player building/deploying
  - `anim` -- animation name to play
  - `sound` -- sound path to play
  - `powerupframe` -- frame for powerup callback
  - `connectframe` -- frame for connect callback
* **Returns:** nil
* **Error states:** Errors if multiple components are nil

### `OnBuilt(inst, data)`
* **Description:** Called when battery is built from recipe. Calls DoBuiltOrDeployed with place animation parameters.
* **Parameters:**
  - `inst` -- battery entity being built
  - `data` -- build data with builder field
* **Returns:** nil
* **Error states:** None

### `OnDeployed(inst, item, deployer)`
* **Description:** Called when battery item is deployed. Copies fuel percent and properties from item, sets callbacks, calls DoBuiltOrDeployed with deploy animation.
* **Parameters:**
  - `inst` -- deployed battery entity
  - `item` -- item that was deployed
  - `deployer` -- player who deployed
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil or item.components.fueled is nil (both accessed without guards)

### `OnUpdatePlacerHelper(helperinst)`
* **Description:** Periodic update for placer helper. Removes itself if placer invalid, otherwise updates add colour based on range and platform match.
* **Parameters:**
  - `helperinst` -- helper entity for placer visualization
* **Returns:** nil
* **Error states:** Errors if helperinst.components.updatelooper or placerinst is nil

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
* **Description:** Called when deploy helper is enabled. Creates helper entity with anim, tags, and updater if enabled. Removes helper if disabled.
* **Parameters:**
  - `inst` -- battery entity
  - `enabled` -- boolean helper enabled state
  - `recipename` -- recipe being placed
  - `placerinst` -- placer entity
* **Returns:** nil
* **Error states:** Errors if inst:CreateEntity fails

### `OnStartHelper(inst)`
* **Description:** Called when deploy helper starts. Stops helper if currently in deploy or place animation.
* **Parameters:**
  - `inst` -- battery entity starting helper
* **Returns:** nil
* **Error states:** Errors if inst.AnimState or inst.components.deployhelper is nil

### `fn()`
* **Description:** Main prefab constructor for winona_battery_low structure. Creates entity with transform, anim, sound, minimap, network. Adds structure/engineering tags, sets up components (portablestructure, inspectable, fueled, lootdropper, workable, circuitnode, battery, burnable), registers events and callbacks.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None

### `placer_postinit_fn(inst)`
* **Description:** Post-init for battery placer. Creates child entity for battery visual, links via placer component, sets scale, sets deployhelper_key.
* **Parameters:**
  - `inst` -- placer entity
* **Returns:** nil
* **Error states:** Errors if inst.components.placer is nil

### `OnDeploy(inst, pt, deployer)`
* **Description:** Called when battery item is deployed. Spawns winona_battery_low structure at position, calls OnDeployed, prevents collisions, removes item.
* **Parameters:**
  - `inst` -- battery item being deployed
  - `pt` -- deployment position
  - `deployer` -- player deploying
* **Returns:** nil
* **Error states:** Errors if SpawnPrefab fails

### `CLIENT_PlayFuelSound(inst)`
* **Description:** Client-side fuel sound playback. Plays sound on TheFocalPoint if parent container is opened by ThePlayer.
* **Parameters:**
  - `inst` -- battery item entity on client
* **Returns:** nil
* **Error states:** Errors if parent or container is nil

### `SERVER_PlayFuelSound(inst)`
* **Description:** Server-side fuel sound playback. Plays sound directly if not held, otherwise pushes net_event and triggers client sound if not dedicated.
* **Parameters:**
  - `inst` -- battery item entity on server
* **Returns:** nil
* **Error states:** Errors if inst.SoundEmitter is nil

### `Item_OnSave(inst, data)`
* **Description:** Saves battery item state. Saves nightmare and horror fuel levels if > 0.
* **Parameters:**
  - `inst` -- battery item being saved
  - `data` -- save data table
* **Returns:** nil
* **Error states:** None

### `Item_OnLoad(inst, data, ents)`
* **Description:** Loads battery item state. Restores nightmare/horror levels, sets chemical to currentfuel, adjusts priorities.
* **Parameters:**
  - `inst` -- battery item being loaded
  - `data` -- saved data
  - `ents` -- entity reference table
* **Returns:** nil
* **Error states:** Errors if inst.components.fueled is nil

### `itemfn()`
* **Description:** Prefab constructor for winona_battery_low_item. Creates inventory item with transform, anim, sound, network. Adds portableitem tag, makes floatable. Sets up components (inspectable, inventoryitem, deployable, fueled, hauntable, burnable).
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None

## Events & listeners

**Listens to:**
- `onbuilt` -- triggers OnBuilt when battery is constructed
- `engineeringcircuitchanged` -- triggers OnCircuitChanged when circuit state changes
- `winona_batteryskillchanged` -- triggers skill reconfiguration when Winona's battery skills change
- `animover` -- triggers OnHitAnimOver after hit animation completes

**Pushes:**
- `engineeringcircuitchanged` -- pushed on connected nodes when circuit changes
- `percentusedchange` -- pushed by fueled component when fuel percent changes
- `onfueldsectionchanged` -- pushed by fueled component when fuel section changes