---
id: beefalo
title: Beefalo
description: This component initializes beefalo and beefalo_carry prefabs with assets, loot tables, and helper functions for managing state including domestication, riding, shaving, carrat interactions, bell ownership, mood visualization, combat retargeting, and shadow poop logic with save/load support.
tags: [prefabs, creatures, domestication, combat, riding]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: 4f40f95d
system_scope: prefab
---

# Beefalo

> Based on game build **714014** | Last updated: 2026-03-20

## Overview

The beefalo component defines the complete prefab implementation for beefalo entities in Don't Starve Together, including both the standard `beefalo` and minimal `beefalo_carry` variants. This component manages a complex state machine handling domestication progression, riding mechanics, shaving cycles, mood states, combat behavior, and carrat companion interactions. The beefalo integrates numerous components including domesticatable, rideable, brushable, beard, combat, follower, herdmember, and skinner_beefalo to enable its full feature set. Key systems include bell ownership for player taming, tendency calculation (Pudgy, Ornery, Rider), shadow poop spawning during special events, and comprehensive save/load persistence for all state data. The component also handles hitching post interactions, hunger-based begging behavior, buck timing based on rider skills, and dynamic animation build overrides based on mood, clothing, and domestication state.

## Usage example

```lua
-- Spawn a beefalo and check its domestication state
local beefalo = SpawnPrefab("beefalo")

-- Check if beefalo is domesticated
if beefalo.components.domesticatable:IsDomesticated() then
    print("Beefalo is domesticated")
end

-- Set beefalo as follower to a player
beefalo.components.follower:SetLeader(player)

-- Check mood state via herd
local mood = beefalo.components.herdmember:GetHerd()
if mood and mood.components.mood:IsInMood() then
    print("Beefalo herd is in mood")
end

-- Apply clothing skin
beefalo.components.skinner_beefalo:ClearAllClothing()

-- Unhitch if currently hitched
if beefalo.components.hitchable then
    beefalo.components.hitchable:Unhitch()
end
```

## Dependencies & tags

**External dependencies:**
- `brains/beefalobrain` -- Required for beefalo AI behavior
- `TheSim` -- Used to find entities in range
- `TUNING` -- Accessed for balance constants like distances and stats
- `SpawnPrefab` -- Used to instantiate carrat entity
- `SetSharedLootTable` -- Defines loot drops for beefalo
- `Asset` -- Declares animation and sound assets
- `FindEntity` -- Used to locate combat targets
- `SetBeefaloSkinsOnAnim` -- Applies clothing skins to animation
- `SetBeefaloFaceSkinsOnAnim` -- Applies face skins to animation
- `TENDENCY` -- Global table for domestication tendency types
- `GLOBAL` -- Used for global functions like SpawnPrefab, Remap, Launch2, and tables like TENDENCY, SPECIAL_EVENTS
- `TheWorld` -- Check ismastersim
- `CreateEntity` -- Create new entity
- `Prefab` -- Register prefab
- `Vector3` -- Handle positions
- `GetTime` -- Get current time
- `FRAMES` -- Animation frame constant
- `DEGREES` -- Angle conversion
- `FOODTYPE` -- Diet types
- `SPECIAL_EVENTS` -- Check event active
- `IsSpecialEventActive` -- Check event active
- `DefaultWakeTest` -- Default sleep test
- `DefaultSleepTest` -- Default sleep test
- `GetTaskRemaining` -- Get task time
- `fns` -- Table of shared functions
- `assets` -- Prefab assets
- `prefabs` -- Prefab dependencies
- `brain` -- AI brain
- `sounds` -- Sound table

**Components used:**
- `beard` -- Checked for shave test in canalterbuild
- `follower` -- Accessed for leader management in bell functions
- `rideable` -- Checked for rider and save state
- `burnable` -- Modified nocharring flag during bell ownership
- `knownlocations` -- ForgetLocation called during bell setup
- `writeable` -- BeginWriting called for bell user
- `herdmember` -- Used to get herd for mood checks
- `skinner_beefalo` -- Used to get clothing for anim overrides
- `combat` -- Used for target validation and sharing
- `eater` -- Used to check if carrat can eat entities
- `bait` -- Checked on entities for carrat exit logic
- `inventoryitem` -- Checked for held status and grand owner
- `health` -- Checked for dead status in CanShareTarget
- `domesticatable` -- Updated stats on attack
- `hitchable` -- Unhitched on attack if not hitchable
- `rider` -- Checked on target to exclude mounted beefalo
- `brushable` -- Set brushable status on shave
- `sleeper` -- Checked for sleep status to interrupt actions
- `named` -- Sets or clears entity name
- `trader` -- Sets acceptance test for items
- `locomotor` -- Sets run speed based on tendency
- `hunger` -- Checks percent, pause status, and delta
- `saltlicker` -- Set up uses per lick on revive
- `skilltreeupdater` -- Checks rider skills for buck time
- `minimapentity` -- Enabled or disabled based on domestication
- `transform` -- Gets world position
- `animstate` -- Applies build overrides
- `lootdropper` -- Set loot table
- `inspectable` -- Get status
- `leader` -- Add follower
- `periodicspawner` -- Spawn poop
- `timer` -- Added component
- `uniqueid` -- Added component
- `beefalometrics` -- Added component
- `drownable` -- Added component
- `colouradder` -- Added component
- `colourtweener` -- Tween colour on despawn
- `markable_proxy` -- Added component
- `planardamage` -- Added component
- `bloomer` -- Added component

**Tags:**
- `HasCarrat` -- add
- `baby` -- check
- `has_beard` -- check
- `domesticated` -- check
- `scarytoprey` -- add
- `beefalo` -- check
- `player` -- check
- `shadowbell` -- check
- `planted` -- check
- `_combat` -- check
- `INLIMBO` -- check
- `deadcreature` -- add
- `give_dolongaction` -- add
- `NOCLICK` -- add
- `nointerrupt` -- check
- `companion` -- add
- `notraptrigger` -- add
- `animal` -- add
- `largecreature` -- add
- `bearded` -- add
- `trader` -- add
- `herdmember` -- add
- `saddleable` -- add
- `domesticatable` -- add
- `saltlicker` -- add
- `hitched` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions

### `removecarrat(inst, carrat)`
* **Description:** Removes a carrat from the beefalo, resets color, and removes the HasCarrat tag.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `carrat` -- The carrat entity instance to remove
* **Returns:** `nil`

### `canalterbuild(inst, group)`
* **Description:** Checks if the beefalo build can be altered based on beard component shave test.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `group` -- Animation group identifier
* **Returns:** `boolean`

### `setcarratart(inst)`
* **Description:** Overrides animation symbols for carrat parts based on the beefalo's carrat color.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `addcarrat(inst, carrat)`
* **Description:** Adds a carrat to the beefalo, sets color, and applies art overrides.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `carrat` -- The carrat entity instance to add
* **Returns:** `nil`

### `createcarrat(inst)`
* **Description:** Spawns a new carrat prefab and sets its color to match the beefalo.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Entity`

### `testforcarratexit(inst)`
* **Description:** Searches for nearby edible bait entities to allow a carrat to exit and eat.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `fns.ClearBellOwner(inst)`
* **Description:** Clears the bell owner relationship, stops persistence, and resets domestication flags.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`
* **Error states:** Returns early if inst is marked for despawn

### `fns.GetBeefBellOwner(inst)`
* **Description:** Retrieves the grand owner of the bell attached to the beefalo via follower leader chain.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Entity` or `nil`

### `fns.SetBeefBellOwner(inst, bell, bell_user)`
* **Description:** Assigns a bell owner to the beefalo, sets persistence flags, and initiates writing if user exists.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `bell` -- The bell entity to attach
  - `bell_user` -- The player entity using the bell
* **Returns:** `boolean`, `string`
* **Error states:** Returns false if leader exists or bell is nil

### `ClearBuildOverrides(inst, animstate)`
* **Description:** Clears specific animation build overrides from the given animstate.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `animstate` -- The animation state to clear overrides on
* **Returns:** `nil`

### `getbasebuild(inst)`
* **Description:** Determines the base animation build name based on beefalo tags (baby, beard, domesticated).
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `string`

### `fns.GetMoodComponent(inst)`
* **Description:** Retrieves the mood component from the beefalo's herd if it exists.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Component` or `nil`

### `fns.GetIsInMood(inst)`
* **Description:** Checks if the beefalo's herd is currently in a mood state.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `boolean`

### `ApplyBuildOverrides(inst, animstate)`
* **Description:** Applies animation build overrides based on mood, clothing, and tendency.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `animstate` -- The animation state to apply overrides to
* **Returns:** `nil`

### `OnEnterMood(inst)`
* **Description:** Handles logic when beefalo enters a mood, adding tags and updating builds.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`
* **Error states:** Returns early if temp contest beefalo

### `OnLeaveMood(inst)`
* **Description:** Handles logic when beefalo leaves a mood, removing tags and updating builds.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `Retarget(inst)`
* **Description:** Finds a new combat target based on mood and combat validity checks.
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Entity` or `nil`

### `KeepTarget(inst, target)`
* **Description:** Determines if the beefalo should keep its current target based on herd proximity and mood.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `target` -- The current target entity
* **Returns:** `boolean`

### `OnNewTarget(inst, data)`
* **Description:** Clears follower leader if the new combat target is the current leader.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data containing target info
* **Returns:** `nil`

### `CanShareTarget(dude)`
* **Description:** Checks if an entity is valid to share aggro with (beefalo, alive, not player).
* **Parameters:**
  - `dude` -- The entity to check for target sharing eligibility
* **Returns:** `boolean`

### `OnAttacked(inst, data)`
* **Description:** Handles combat response, domestication stats, and target sharing when attacked.
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data containing attacker info
* **Returns:** `nil`

### `GetStatus(inst, viewer)`
* **Description:** Determines the status string of the beefalo based on leader, health, and domestication state
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `viewer` -- The player entity viewing the status
* **Returns:** `String` status code (e.g., DEAD, MYPARTNER, FOLLOWER, DOMESTICATED)
* **Error states:** Returns nil if no conditions match

### `fns.testforskins(inst)`
* **Description:** Checks if the beefalo has any clothing items equipped
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Boolean` true if wearing skins, false otherwise
* **Error states:** Returns false if skinner_beefalo component is missing

### `fns.UnSkin(inst)`
* **Description:** Removes all clothing from the beefalo, handling sleep and state interruptions
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`
* **Error states:** Returns early if skinner_beefalo component is missing or state is nointerrupt

### `OnResetBeard(inst)`
* **Description:** Resets beard growth, removes beard tag, and triggers shaved state
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `CanShaveTest(inst, shaver)`
* **Description:** Validates if the beefalo can be shaved based on health, sleep, and ownership
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `shaver` -- The player attempting to shave
* **Returns:** `Boolean` or false with error string
* **Error states:** Returns false if dead or awake

### `OnShaved(inst)`
* **Description:** Applies build overrides after shaving
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `OnHairGrowth(inst)`
* **Description:** Handles logic when hair growth bits reset, potentially bucking rider
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `fns.RemoveName(inst)`
* **Description:** Clears the beefalo's custom name
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `OnBrushed(inst, doer, numprizes)`
* **Description:** Applies domestication and obedience deltas when brushed
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `doer` -- The player brushing the beefalo
  - `numprizes` -- Number of wool items received
* **Returns:** `nil`
* **Error states:** Returns early if dead

### `Dead_AbleToAcceptTest(inst, item, giver, count)`
* **Description:** Determines if a dead beefalo can accept a revival item
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `item` -- The item being offered
  - `giver` -- The player offering the item
  - `count` -- Stack count of the item
* **Returns:** `Boolean` and tag string

### `ShouldAcceptItem(inst, item, giver, count)`
* **Description:** Checks if the beefalo should accept an item based on diet and combat state
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `item` -- The item being offered
  - `giver` -- The player offering the item
  - `count` -- Stack count of the item
* **Returns:** `Boolean`
* **Error states:** Returns false if custom accept test exists

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Attempts to eat the item if edible
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `giver` -- The player giving the item
  - `item` -- The item being given
* **Returns:** `nil`

### `OnRefuseItem(inst, giver, item)`
* **Description:** Handles refused items, potentially reviving if dead
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `giver` -- The player offering the item
  - `item` -- The item being offered
* **Returns:** `nil`
* **Error states:** Returns early if dead and item revives

### `OnDomesticated(inst, data)`
* **Description:** Sets domestication pending flag
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data table
* **Returns:** `nil`

### `DoDomestication(inst)`
* **Description:** Applies domestication state changes (herd, tendency, minimap)
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `OnFeral(inst, data)`
* **Description:** Handles transition to feral state, bucking rider
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data table
* **Returns:** `nil`

### `DoFeral(inst)`
* **Description:** Applies feral state changes (herd, tendency, minimap)
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `UpdateDomestication(inst)`
* **Description:** Toggles between domesticated and feral states based on component status
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `SetTendency(inst, changedomestication)`
* **Description:** Calculates and applies tendency (Pudgy, Ornery, Rider) and updates stats
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `changedomestication` -- String indicating domestication state change
* **Returns:** `nil`

### `GetBaseSkin(inst)`
* **Description:** Returns the base build name for the beefalo
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `String` build name

### `ShouldBeg(inst)`
* **Description:** Determines if the beefalo should beg for food based on hunger and mood
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Boolean`

### `CalculateBuckDelay(inst)`
* **Description:** Calculates the time delay before the beefalo bucks its rider
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Number` time delay

### `OnBuckTime(inst)`
* **Description:** Reschedules buck timer and triggers buck event
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `nil`

### `OnObedienceDelta(inst, data)`
* **Description:** Updates saddleable status and restarts buck timer on obedience gain
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data containing new and old obedience values
* **Returns:** `nil`

### `OnDeath(inst, data)`
* **Description:** Handles death logic, tags, component pausing, and Carrat spawning
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data containing cause of death
* **Returns:** `nil`

### `fns.OnRevived(inst, revive)`
* **Description:** Restores health, state, and components after revival
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `revive` -- Revival source or data
* **Returns:** `nil`

### `DomesticationTriggerFn(inst)`
* **Description:** Checks conditions to trigger domestication (hunger or riding)
* **Parameters:**
  - `inst` -- The beefalo entity instance
* **Returns:** `Boolean`

### `OnStarving(inst, dt)`
* **Description:** Applies obedience loss when starving
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `dt` -- Delta time
* **Returns:** `nil`

### `OnHungerDelta(inst, data)`
* **Description:** Adjusts tendency (Pudgy) based on hunger changes
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `data` -- Event data containing hunger change
* **Returns:** `nil`

### `OnEat(inst, food, feeder)`
* **Description:** Handles eating logic, domestication updates, and location memory
* **Parameters:**
  - `inst` -- The beefalo entity instance
  - `food` -- The food item being eaten
  - `feeder` -- The entity feeding the beefalo
* **Returns:** `nil`

### `OnDomesticationDelta(inst, data)`
* **Description:** Calls SetTendency on the instance when domestication delta occurs.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data
* **Returns:** `nil`

### `OnHealthDelta(inst, data)`
* **Description:** Pushes mountwounded event to rider if health drops below 20% while being ridden.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing oldpercent and newpercent
* **Returns:** `nil`

### `OnBeingRidden(inst, dt)`
* **Description:** Increases rider tendency based on time ridden.
* **Parameters:**
  - `inst` -- Entity instance
  - `dt` -- Delta time
* **Returns:** `nil`

### `OnRiderDoAttack(inst, data)`
* **Description:** Increases ornery tendency when rider attacks.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data
* **Returns:** `nil`

### `DoRiderSleep(inst, sleepiness, sleeptime)`
* **Description:** Applies sleepiness to the instance via sleeper component.
* **Parameters:**
  - `inst` -- Entity instance
  - `sleepiness` -- Amount of sleepiness
  - `sleeptime` -- Duration of sleep
* **Returns:** `nil`

### `OnRiderChanged(inst, data)`
* **Description:** Handles logic when rider changes, including bucking task, sleep tasks, and state transitions.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing newrider
* **Returns:** `nil`

### `PotentialRiderTest(inst, potential_rider)`
* **Description:** Tests if a potential rider is valid based on leader ownership.
* **Parameters:**
  - `inst` -- Entity instance
  - `potential_rider` -- Entity attempting to ride
* **Returns:** `boolean`

### `OnSaddleChanged(inst, data)`
* **Description:** Adds or removes companion and notraptrigger tags based on saddle presence.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing saddle
* **Returns:** `nil`

### `_OnRefuseRider(inst)`
* **Description:** Wakes up the sleeper if asleep and not dead.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `OnRefuseRider(inst, data)`
* **Description:** Schedules _OnRefuseRider to run next frame.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data
* **Returns:** `nil`

### `OnRiderSleep(inst, data)`
* **Description:** Stores rider sleep data if being ridden.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing sleepiness and sleeptime
* **Returns:** `nil`

### `dobeefalounhitch(inst)`
* **Description:** Unhitches the beefalo if hitchable and not canbehitched.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `OnHitchTo(inst, data)`
* **Description:** Sets hitchingspot and listens for events to unhitch.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing target
* **Returns:** `nil`

### `OnUnhitch(inst, data)`
* **Description:** Removes unhitch event listeners.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data
* **Returns:** `nil`

### `fns.OnNamedByWriteable(inst, new_name, writer)`
* **Description:** Sets the named component name if writeable.
* **Parameters:**
  - `inst` -- Entity instance
  - `new_name` -- New name for the entity
  - `writer` -- Writer entity
* **Returns:** `nil`

### `fns.OnWritingEnded(inst)`
* **Description:** Clears follower leader if writeable is no longer written.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `ShouldWakeUp(inst)`
* **Description:** Determines if beefalo should wake up based on leader distance.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `boolean`

### `fns.OnDespawnRequest(inst)`
* **Description:** Spawns fx and starts colour tween to remove instance.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `MountSleepTest(inst)`
* **Description:** Determines if beefalo can sleep based on riding status, tags, and leader distance.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `boolean`

### `ToggleDomesticationDecay(inst)`
* **Description:** Pauses domestication decay if salted or asleep.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `onwenthome(inst, data)`
* **Description:** Handles carrat boarding logic.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing doer
* **Returns:** `nil`

### `OnInit(inst)`
* **Description:** Updates domestication on init.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `CustomOnHaunt(inst)`
* **Description:** Tries to spawn via periodicspawner when haunted.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `boolean`

### `fns.OnSave(inst, data)`
* **Description:** Saves tendency, hascarrat, and carratcolor.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Save data table
* **Returns:** `nil`

### `fns.OnLoad(inst, data)`
* **Description:** Loads tendency and carrat data if event active.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Load data table
* **Returns:** `nil`

### `fns.OnLoadPostPass(inst, data)`
* **Description:** Removes has_beard tag if beard bits are 0.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Load data table
* **Returns:** `nil`

### `CanSpawnPoop(inst)`
* **Description:** Checks if poop can spawn based on health, hitchable, and rideable status.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `boolean`

### `GetDebugString(inst)`
* **Description:** Returns debug string with tendency and buck task remaining.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `string`

### `onclothingchanged(inst, data)`
* **Description:** Updates skin data when clothing changes.
* **Parameters:**
  - `inst` -- Entity instance
  - `data` -- Event data containing type and name
* **Returns:** `nil`

### `fns.OnShadowPoopTimeOver(inst)`
* **Description:** Handles shadow poop expiration, removal, or colour tween.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `fns.OnShadowPoopEnterLimbo(inst)`
* **Description:** Sets persists to true and cancels timeover task.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `nil`

### `PoopOnSpawned(inst, poop)`
* **Description:** Positions poop and sets up shadow bell logic if leader has shadowbell tag.
* **Parameters:**
  - `inst` -- Entity instance
  - `poop` -- Spawned poop entity
* **Returns:** `nil`

### `fns.ShouldKeepCorpse(inst)`
* **Description:** Checks if corpse should be kept based on leader shadowbell tag and rechargeable status.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** `boolean`

### `beefalo()`
* **Description:** Constructor function for the beefalo prefab, initializing all components and logic.
* **Parameters:** None
* **Returns:** `Entity`

### `beefalo_carry()`
* **Description:** Constructor function for the beefalo_carry prefab, initializing minimal components.
* **Parameters:** None
* **Returns:** `Entity`

## Events & listeners

**Listens to:**
- `onremove` -- Registered on bell entity to handle cleanup when bell is removed
- `death` -- Triggers unhitch or health logic
- `healthdelta` -- Informs rider of health changes
- `entermood` -- Triggers mood enter logic
- `leavemood` -- Triggers mood leave logic
- `newcombattarget` -- Triggers new target logic
- `attacked` -- Triggers attacked logic
- `saddlechanged` -- Triggers saddle change logic
- `refusedrider` -- Triggers refuse rider logic
- `saltchange` -- Toggles domestication decay
- `onwenthome` -- Handles carrat boarding
- `domesticated` -- Triggers domesticated logic
- `goneferal` -- Triggers feral logic
- `obediencedelta` -- Triggers obedience delta logic
- `domesticationdelta` -- Triggers domestication delta logic
- `beingridden` -- Triggers being ridden logic
- `riderchanged` -- Triggers rider changed logic
- `riderdoattackother` -- Triggers rider attack logic
- `hungerdelta` -- Triggers hunger delta logic
- `ridersleep` -- Triggers rider sleep logic
- `hitchto` -- Triggers hitch to logic
- `unhitch` -- Triggers unhitch logic
- `despawn` -- Triggers despawn request
- `stopfollowing` -- Clears bell owner
- `onclothingchanged` -- Updates clothing
- `animover` -- Triggers removal in shadow poop
- `entitysleep` -- Triggers removal in shadow poop
- `enterlimbo` -- Handles limbo entry for poop
- `gotosleep` -- Triggers unhitch
- `onignite` -- Triggers unhitch

**Pushes:**
- `eat` -- Pushed when the beefalo eats food, includes full status and food item
- `mountwounded` -- Pushed to rider when health drops below 20%
- `carratboarded` -- Pushed when carrat boards