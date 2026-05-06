---
id: wortox
title: Wortox
description: Defines the Wortox character prefab with soul collection mechanics, portal hopping abilities, inclination system, overload management, buff and debuff systems including soul echo and panflute, decoy functionality, and extensive event-driven gameplay systems.
tags: [character, souls, teleportation, buffs, combat]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 197c6222
system_scope: player
---

# Wortox

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
The `wortox.lua` prefab file defines the Wortox character, a demonic imp with unique soul-based mechanics. This file establishes the core character initialization through `common_postinit` and `master_postinit` functions, configuring health, hunger, and sanity stats alongside specialized components like `souleater` and `reticule` for blink targeting. Wortox collects souls from deceased entities within range, manages soul overload states with visual FX warnings, and consumes souls for healing and sanity restoration based on moral inclination. The prefab also defines buff entities (`wortox_soulecho_buff`, `wortox_forget_debuff`, `wortox_panflute_buff`), their FX prefabs (`wortox_soulecho_buff_fx`, `wortox_panflute_buff_fx`, `wortox_overloading_fx`), and the `wortox_decoy` prefab for tactical distraction with thorns and explosion capabilities. Extensive event listeners track entity deaths, inventory changes, skill activations, and teleportation states to maintain soul counts and trigger appropriate gameplay responses.

## Usage example
```lua
local wortox = SpawnPrefab("wortox")

-- Check if Wortox can perform a soul hop with available souls
local souls, count = wortox:GetSouls()
if wortox:CanSoulhop(1) then
    wortox:TryToPortalHop(1, false)
end

-- Recalculate inclination after skill change
wortox:RecalculateInclination()

-- Create a decoy for tactical distraction
local decoy = SpawnPrefab("wortox_decoy")
decoy:SetOwner(wortox)
```

## Dependencies & tags
**External dependencies:**
- `prefabs/player_common` -- Required for MakePlayerCharacter function
- `prefabs/wortox_soul_common` -- Required for HasSoul, SpawnSoulsAt, GetNumSouls, GiveSouls functions
- `prefabs/player_common_extensions` -- Required for PlayerCommonExtensions
- `prefabs/skilltree_defs` -- Required for CUSTOM_FUNCTIONS.wortox in RecalculateInclination and OnSkillTreeInitialized
- `TUNING` -- Accessed for WORTOX_SOULEXTRACT_RANGE, SKILLS bonuses, WORTOX_MAX_SOULS, SANITY values, CALORIES_MED, and other constants
- `TheWorld` -- Map:IsPassableAtPoint(), Map:IsGroundTargetBlocked(), and event listening for entity_droploot, entity_death, starvedtrapsouls
- `SpawnPrefab` -- Called to spawn wortox_overloading_fx prefab
- `ControllerReticle_Blink_GetPosition` -- Called in ReticuleTargetFn for blink target position
- `IsTeleportingPermittedFromPointToPoint` -- Called in CanBlinkTo and CanBlinkFromWithMap for teleport validation
- `ACTIONS` -- ACTIONS.BLINK returned in GetPointSpecialActions
- `FRAMES` -- Used in CheckSoulsRemovedAfterAnim for animation timing
- `TheNet` -- GetServerGameMode for starting inventory, IsDedicated for FX spawning
- `TheSim` -- GetTickTime called for particle emission rate calculations
- `STRINGS` -- NAMES.WORTOX_DECOY_FMT for display name formatting, DESCRIBE for inspection text
- `PlayerCommonExtensions` -- SetupBaseSymbolVisibility for animation symbol setup
- `wortox_soul_common` -- SoulDamageTest to validate soul damage interactions
- `GLOBAL` -- subfmt, GetTime, SpawnPrefab, math.min, string.format, ipairs, pairs
- `COMBAT_MUSTHAVE_TAGS` -- Tag filter for FindEntities combat target search
- `COMBAT_CANTHAVE_TAGS` -- Tag filter for FindEntities combat target exclusion
- `PLAYER_CAMERA_SEE_DISTANCE_SQ` -- Distance check for combat target redirection

**Components used:**
- `health` -- IsDead() called to check if entities are dead for soul spawning
- `skilltreeupdater` -- IsActivated() and CountSkillTag() called for skill-based bonuses and inclination calculation
- `inventory` -- FindItems(), ForEachItemSlot(), GetActiveItem(), DropItem(), ConsumeByName(), ForEachItem() called for soul management
- `rechargeable` -- Discharge(), SetPercent(), IsCharged() called for soul cooldown mechanics
- `stackable` -- StackSize() and Get() called for soul stack handling
- `inventoryitem` -- OnDropped() called when dropping soul items
- `sanity` -- DoDelta() called for sanity changes on soul eat and overload
- `combat` -- hiteffectsymbol accessed for FX attachment
- `playeractionpicker` -- pointspecialactionsfn set for blink action
- `hunger` -- DoDelta() called when eating souls
- `replica` -- inventory:Has() and rider:IsRiding() checked for soulhop validation
- `container` -- FindItems() called on soul jars to count contained souls
- `lootdropper` -- forcewortoxsouls checked in OnEntityDeath
- `reticule` -- Configured with targetfn, ease, twinstick settings for aiming
- `eater` -- SetAbsorptionModifiers called to configure food absorption rates
- `foodaffinity` -- AddPrefabAffinity called for pomegranate items
- `souleater` -- Added to entity, SetOnEatSoulFn configured for soul eating behavior
- `timer` -- StartTimer, GetTimeLeft, SetTimeLeft used for buff duration tracking
- `debuff` -- Added to buff entities, SetAttachedFn/SetDetachedFn/SetExtendedFn configured
- `skinner` -- HasSpinnableTail checked for idle animation selection
- `locomotor` -- SetExternalSpeedMultiplier/RemoveExternalSpeedMultiplier for soul echo speed buff
- `follower` -- SetLeader for combat target inheritance, noleashing, keepdeadleader, keepleaderduringminigame, neverexpire flags
- `colouradder` -- Added for visual effects
- `inspectable` -- getspecialdescription callback for inspection text
- `explosiveresist` -- GetResistance and OnExplosiveDamage for explosion damage calculation
- `transform` -- GetWorldPosition, SetRotation, SetFourFaced
- `animstate` -- AddOverrideBuild, SetBank, SetBuild, PlayAnimation
- `soundemitter` -- Added for sound playback
- `dynamicshadow` -- SetSize for shadow rendering
- `network` -- Added for network replication

**Tags:**
- `monster` -- add
- `playermonster` -- add
- `nosouljar` -- add
- `playerghost` -- check
- `doing` -- check
- `soulstealer` -- add
- `souleater` -- add
- `CLASSIFIED` -- add
- `FX` -- add
- `hostile` -- check
- `pig` -- check
- `catcoon` -- check
- `decoy` -- add
- `soulless` -- add
- `scarytoprey` -- add
- `player` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `decoylured` | table | `{}` | Table tracking entities lured by the decoy |
| `_ownername` | net_string | `net_string(inst.GUID, 'wortox_decoy._ownername')` | Networked string storing the decoy owner's display name |
| `persists` | boolean | `false` | Whether the decoy entity persists through save/load |
| `decoyowner` | Entity | `nil` | Reference to the player/entity that owns this decoy |
| `decoythorns` | boolean | `nil` | Flag indicating if decoy has thorns ability enabled |
| `decoyexplodes` | boolean | `nil` | Flag indicating if decoy explodes on death |
| `decoythornstarget` | Entity | `nil` | Current target for thorns damage reflection |
| `wortox_inclination` | string/nil | `nil` | Current moral inclination state (nice/naughty/nil) |
| `_freesoulhop_counter` | number | `0` | Counter for free soul hops accumulated |
| `_soulhop_cost` | number | `0` | Total soul cost for current portal hop sequence |
| `soulcount` | number | `0` | Current total soul count including jars |
| `wortox_needstreeinit` | boolean | `true` | Flag indicating skill tree initialization pending |
| `starting_inventory` | table | `start_inv[gameMode]` | Starting inventory items based on game mode |
| `_souloverloadtask` | task | `nil` | Scheduled task for soul overload handling |
| `finishportalhoptask` | task | `nil` | Scheduled task for finishing portal hop |
| `_checksoulstask` | task | `nil` | Scheduled task for checking soul count changes |
| `nosoultask` | task | `nil` | Task reference on victim entities to prevent multiple soul spawns per corpse |
| `wortox_souloverload_stoppertask` | task | `nil` | Scheduled task for stopping overload FX and forcing overload check |
| `wortox_souloverload_fx` | Entity | `nil` | FX entity reference for soul overload visual warning effect |
| `finishportalhoptaskmaxtime` | number | `nil` | Maximum duration for the portal hop finish task |
| `bufffx` | Entity | `nil` | FX entity reference for soul echo buff visual effect |
| `wortox_panflute_buff_count` | number | `nil` | Counter tracking active panflute buff instances on player |
| `wortox_decoy_inst` | Entity | `nil` | Reference to the decoy entity owned by this player |

## Main functions

### `IsValidVictim(victim, explosive)`
* **Description:** Checks if a victim entity has a soul and is either dead or died from an explosive source.
* **Parameters:**
  - `victim` -- Entity instance to check for soul availability
  - `explosive` -- Boolean indicating if death was caused by explosion
* **Returns:** Boolean true if victim has soul and meets death conditions
* **Error states:** None

### `OnRestoreSoul(victim)`
* **Description:** Callback function that clears the nosoultask reference on a victim entity after soul spawn delay.
* **Parameters:**
  - `victim` -- Entity instance whose nosoultask is being cleared
* **Returns:** None
* **Error states:** None

### `OnEntityDropLoot(inst, data)`
* **Description:** Handles soul spawning when entities drop loot, checking range and skill bonuses for wortox_thief_1. Returns early if victim is nil, has nosoultask, or is invalid.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data containing inst reference and explosive flag
* **Returns:** None
* **Error states:** None

### `OnEntityDeath(inst, data)`
* **Description:** Marks the victim with _soulsource and triggers soul spawning if lootdropper allows or conditions are met.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with inst, afflicter, explosive, and corpsing flags
* **Returns:** None
* **Error states:** None

### `OnStarvedTrapSouls(inst, data)`
* **Description:** Spawns souls from starved traps when Wortox is within range, applying skill bonus to extraction range. Returns early if trap is nil, has nosoultask, invalid, or numsouls is less than 1.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with trap reference and numsouls count
* **Returns:** None
* **Error states:** None

### `OnMurdered(inst, data)`
* **Description:** Gives souls to Wortox when a valid victim is murdered and not incinerated. Returns early if incinerated or victim conditions not met.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with victim, incinerated flag, and stackmult
* **Returns:** None
* **Error states:** None

### `OnHarvestTrapSouls(inst, data)`
* **Description:** Gives souls to Wortox when trap souls are harvested.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with numsouls count and optional pos
* **Returns:** None
* **Error states:** None

### `OnRespawnedFromGhost(inst)`
* **Description:** Registers event listeners on TheWorld for entity_droploot, entity_death, and starvedtrapsouls when Wortox respawns from ghost.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `TryToOnRespawnedFromGhost(inst)`
* **Description:** Calls OnRespawnedFromGhost if Wortox is not dead and does not have playerghost tag.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `OnBecameGhost(inst)`
* **Description:** Removes event listeners on TheWorld when Wortox becomes a ghost.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `IsSoul(item)`
* **Description:** Checks if an item prefab is wortox_soul.
* **Parameters:**
  - `item` -- Entity instance to check
* **Returns:** Boolean true if item prefab is wortox_soul
* **Error states:** None

### `IsSoulJar(item)`
* **Description:** Checks if an item prefab is wortox_souljar.
* **Parameters:**
  - `item` -- Entity instance to check
* **Returns:** Boolean true if item prefab is wortox_souljar
* **Error states:** None

### `PutSoulOnCooldown(item, cooldowntime, overridepercent)`
* **Description:** Discharges a soul's rechargeable component and optionally sets charge percent, or adds nosouljar tag if no rechargeable. Returns early if item is not a soul.
* **Parameters:**
  - `item` -- Soul entity instance
  - `cooldowntime` -- Duration in seconds for cooldown
  - `overridepercent` -- Optional charge percentage override
* **Returns:** None
* **Error states:** None

### `RemoveSoulCooldown(item)`
* **Description:** Sets soul rechargeable percent to 1 or removes nosouljar tag. Returns early if item is not a soul.
* **Parameters:**
  - `item` -- Soul entity instance
* **Returns:** None
* **Error states:** None

### `GetStackSize(item)`
* **Description:** Returns the stack size of an item or 1 if no stackable component.
* **Parameters:**
  - `item` -- Entity instance with optional stackable component
* **Returns:** Number representing stack size
* **Error states:** None

### `SortByStackSize(l, r)`
* **Description:** Comparison function for sorting items by stack size ascending.
* **Parameters:**
  - `l` -- Left item for comparison
  - `r` -- Right item for comparison
* **Returns:** Boolean true if left stack size is less than right
* **Error states:** None

### `GetSouls(inst)`
* **Description:** Finds all soul items in inventory and calculates total count including stack sizes.
* **Parameters:**
  - `inst` -- Wortox player instance with inventory
* **Returns:** Table of soul entities and total count number
* **Error states:** Errors if `inst` has no `inventory` component (nil dereference on `inst.components.inventory` — no guard present in source).

### `DropSouls(inst, souls, dropcount)`
* **Description:** Drops specified count of souls from inventory at player position, handling partial stacks. Returns early if dropcount is 0 or less.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `souls` -- Table of soul entities to drop
  - `dropcount` -- Number of souls to drop
* **Returns:** None
* **Error states:** None

### `OnReroll(inst)`
* **Description:** Gets all souls and drops them all, used for reroll mechanics.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `RecalculateInclination(inst)`
* **Description:** Calculates new inclination based on skill tags and allegiance skills, updates monster tags and pushes inclination_changed event.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `ClearSoulOverloadTask(inst)`
* **Description:** Clears the _souloverloadtask reference.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `OnSkillTreeInitialized(inst)`
* **Description:** Clears wortox_needstreeinit flag and calls TryPanfluteTimerSetup from skilltree_defs.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `DestroyOverloadingFX(inst)`
* **Description:** Cancels overload stopper task and removes overload FX prefab if valid.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `ForceCheckOverload(inst)`
* **Description:** Destroys existing overload FX, sets force flag, gets souls, and checks for overload.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `CreateOverloadingFX(inst)`
* **Description:** Spawns overload FX prefab, attaches to player, schedules force check, and pushes souloverloadwarning event.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `CheckForOverload(inst, souls, count)`
* **Description:** Checks if soul count exceeds max (with skill bonuses), triggers overload with soul drop and sanity delta, or pushes warning events.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `souls` -- Table of soul entities
  - `count` -- Total soul count
* **Returns:** None
* **Error states:** None

### `HandleLeftoversShouldDropFn(inst, item)`
* **Description:** Checks for overload if item is a soul, returns true for drop handling.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `item` -- Item entity being checked
* **Returns:** Boolean true
* **Error states:** None

### `CheckSoulsAdded(inst)`
* **Description:** Reschedules if tree init pending, applies cooldown to charged souls during portal hop, and checks for overload.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `CheckSoulsRemoved(inst)`
* **Description:** Reschedules if tree init pending, checks overload if soul jars left inventory, finishes portal hop if count is 0, and pushes wisecracker events.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `CheckSoulsRemovedAfterAnim(inst, anim)`
* **Description:** Schedules CheckSoulsRemoved after current animation completes if animation matches, otherwise calls immediately.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `anim` -- Animation name to check
* **Returns:** None
* **Error states:** None

### `DoCheckSoulsAdded(inst)`
* **Description:** Cancels existing check task and schedules CheckSoulsAdded immediately.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `OnGotNewItem(inst, data)`
* **Description:** Triggers soul check if new item is wortox_soul or wortox_souljar.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with item reference
* **Returns:** None
* **Error states:** None

### `OnNewActiveItem(inst, data)`
* **Description:** Triggers soul check if new active item is wortox_soul or wortox_souljar.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with item reference
* **Returns:** None
* **Error states:** None

### `OnStackSizeChange(inst, data)`
* **Description:** Triggers soul check if stack size increased for soul or souljar items.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with item, oldstacksize, and stacksize
* **Returns:** None
* **Error states:** None

### `OnDropItem(inst, data)`
* **Description:** Calls ModifyStats on dropped soul items, schedules soul check after animation if in doing state. Returns early if wortox_ignoresoulcounts is true.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `data` -- Event data with item reference
* **Returns:** None
* **Error states:** None

### `IsNotBlocked(pt)`
* **Description:** Checks if a point is passable and not ground-target blocked on TheWorld.Map.
* **Parameters:**
  - `pt` -- Vector position to check
* **Returns:** Boolean true if point is valid for teleport
* **Error states:** None

### `CanBlinkTo(inst, pt)`
* **Description:** Checks if blink teleport is permitted from current position to target point.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `pt` -- Target position vector
* **Returns:** Boolean true if blink is allowed
* **Error states:** None

### `CanBlinkFromWithMap(inst, pt)`
* **Description:** Checks if teleport is permitted from given point (used for map actions).
* **Parameters:**
  - `inst` -- Wortox player instance
  - `pt` -- Source position vector
* **Returns:** Boolean true if teleport is allowed
* **Error states:** None

### `ReticuleTargetFn(inst)`
* **Description:** Returns blink target position using ControllerReticle_Blink_GetPosition with IsNotBlocked filter.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** Position vector or nil
* **Error states:** None

### `CanSoulhop(inst, souls)`
* **Description:** Checks if player has required souls in replica inventory and is not riding.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `souls` -- Number of souls required (default 1)
* **Returns:** Boolean true if soulhop is permitted
* **Error states:** None

### `GetPointSpecialActions(inst, pos, useitem, right)`
* **Description:** Returns BLINK action if right-click, no item, blink is valid, and soulhop is available.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `pos` -- Target position
  - `useitem` -- Item being used (nil for blink)
  - `right` -- Boolean for right-click action
* **Returns:** Table containing ACTIONS.BLINK or empty table
* **Error states:** None

### `OnSetOwner(inst)`
* **Description:** Sets playeractionpicker.pointspecialactionsfn to GetPointSpecialActions.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `OnEatSoul(inst, soul)`
* **Description:** Applies hunger delta and sanity delta based on inclination, schedules soul check after eat animation.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `soul` -- Soul entity being eaten
* **Returns:** None
* **Error states:** None

### `OnSoulHop(inst)`
* **Description:** Cancels existing check task and schedules soul check after portal jumpout animation.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `SetNetvar(inst)`
* **Description:** Sets player_classified.freesoulhops netvar with _freesoulhop_counter value.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** Asserts if _freesoulhop_counter is out of range 0-7

### `ClearSoulhopCounter(inst)`
* **Description:** Resets _freesoulhop_counter and _soulhop_cost to 0 and updates netvar.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `FinishPortalHop(inst)`
* **Description:** Cancels portal hop task, consumes souls if counter greater than 0, removes debuff, and checks souls added.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** None
* **Error states:** None

### `GetHopsPerSoul(inst)`
* **Description:** Returns hops per soul value with skill bonus if wortox_liftedspirits_3 is activated.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** Number of hops per soul
* **Error states:** None

### `GetSoulEchoCooldownTime(inst)`
* **Description:** Returns soul echo cooldown time with skill multiplier if wortox_liftedspirits_2 is activated.
* **Parameters:**
  - `inst` -- Wortox player instance
* **Returns:** Cooldown time in seconds
* **Error states:** None

### `TryToPortalHop(inst, souls, consumeall)`
* **Description:** Attempts portal hop by consuming souls, applies cooldown or debuff based on hops per soul and skills, and updates netvar.
* **Parameters:**
  - `inst` -- Wortox player instance
  - `souls` -- Number of souls to consume (default 1)
  - `consumeall` -- Boolean to consume all souls immediately
* **Returns:** Boolean true if hop succeeded, false if inventory is nil or insufficient souls
* **Error states:** None

### `OnFreesoulhopsChanged(inst, data)`
* **Description:** Updates the entity's free soul hop counter when the freesoulhopschanged event fires.
* **Parameters:**
  - `inst` -- Entity instance receiving the event
  - `data` -- Event data table containing current free soul hop counter
* **Returns:** None
* **Error states:** None

### `CLIENT_Wortox_HostileTest(inst, target)`
* **Description:** Determines if a target is hostile to Wortox based on tags and inclination state. Checks HostileToPlayerTest method first, then hostile tag, then pig/catcoon tags if inclination is not nice.
* **Parameters:**
  - `inst` -- The Wortox player instance performing the test
  - `target` -- Target entity to test for hostility
* **Returns:** Boolean true if target is hostile, false otherwise
* **Error states:** None

### `common_postinit(inst)`
* **Description:** Common initialization for Wortox on both client and server. Sets up soul FX symbol overrides, adds monster/playermonster/soulstealer/souleater tags, initializes free soul hop counter, assigns soulhop functions, configures reticule component, and sets up client-side event listeners.
* **Parameters:**
  - `inst` -- Wortox entity instance being initialized
* **Returns:** None
* **Error states:** None

### `OnSave(inst, data)`
* **Description:** Saves Wortox's free soul hop counter and soul hop cost to the save data table.
* **Parameters:**
  - `inst` -- Entity instance being saved
  - `data` -- Save data table to populate
* **Returns:** None
* **Error states:** None

### `OnLoad(inst, data)`
* **Description:** Restores Wortox's free soul hop counter and soul hop cost from save data. Schedules SetNetvar task to sync network variables.
* **Parameters:**
  - `inst` -- Entity instance being loaded
  - `data` -- Save data table containing freehops and soulhopcost
* **Returns:** None
* **Error states:** None

### `customidleanimfn(inst)`
* **Description:** Returns the appropriate idle animation name based on Wortox's inclination (nice/naughty) and soul count. Checks skinner component for spinnable tail when inclination is nice.
* **Parameters:**
  - `inst` -- Wortox entity instance
* **Returns:** String animation name (idle_nice, idle_naughty, or idle_wortox)
* **Error states:** None

### `master_postinit(inst)`
* **Description:** Server-side initialization for Wortox. Sets up save/load handlers, soulhop functions, configures max health/hunger/sanity from TUNING, sets up eater absorption modifiers, adds food affinity for pomegranates, adds souleater component, configures inventory leftover handling, and registers extensive event listeners for gameplay mechanics.
* **Parameters:**
  - `inst` -- Wortox entity instance on master sim
* **Returns:** None
* **Error states:** None

### `OnAttached_soulecho(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when soul echo buff attaches to target. Sets parent entity, starts buff timer, listens for target death, applies external speed multiplier via locomotor component, and spawns buff FX.
* **Parameters:**
  - `inst` -- Soul echo buff entity instance
  - `target` -- Target entity receiving the buff
  - `followsymbol` -- Symbol to follow on target
  - `followoffset` -- Offset from follow symbol
  - `data` -- Buff data table containing duration
* **Returns:** None
* **Error states:** None

### `OnDetached_soulecho(inst, target)`
* **Description:** Called when soul echo buff detaches. Removes external speed multiplier from target's locomotor, removes buff FX, and removes the buff entity.
* **Parameters:**
  - `inst` -- Soul echo buff entity instance
  - `target` -- Target entity the buff was attached to
* **Returns:** None
* **Error states:** None

### `OnExtendedBuff_soulecho(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when soul echo buff duration is extended. Updates timer if new duration is longer than remaining time.
* **Parameters:**
  - `inst` -- Soul echo buff entity instance
  - `target` -- Target entity with the buff
  - `followsymbol` -- Symbol to follow on target
  - `followoffset` -- Offset from follow symbol
  - `data` -- Buff data table containing duration
* **Returns:** None
* **Error states:** None

### `OnTimerDone_soulecho(inst, data)`
* **Description:** Called when soul echo buff timer expires. Stops the debuff component if the buffover timer completed.
* **Parameters:**
  - `inst` -- Soul echo buff entity instance
  - `data` -- Timer done event data containing timer name
* **Returns:** None
* **Error states:** None

### `wortox_soulecho_fn()`
* **Description:** Prefab constructor for wortox_soulecho_buff. Creates a classified debuff entity with timer component on master sim only. Sets up attached/detached/extended callback functions for the debuff.
* **Parameters:** None
* **Returns:** Entity instance -- the soul echo buff entity
* **Error states:** None

### `InitEnvelope_soulecho_fx()`
* **Description:** Initializes colour and scale envelopes for soul echo FX particles. Sets up colour envelope fading from white to transparent and scale envelope shrinking over particle lifetime. Sets itself to nil after first run.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `soulecho_buff_fx_emit(effect, sphere_emitter, direction)`
* **Description:** Emits a single particle for the soul echo buff FX with randomized UV offset and velocity based on direction.
* **Parameters:**
  - `effect` -- VFX effect component
  - `sphere_emitter` -- Sphere emitter function for particle positions
  - `direction` -- Direction vector for particle velocity
* **Returns:** None
* **Error states:** None

### `soulecho_buff_fx_fn()`
* **Description:** Prefab constructor for wortox_soulecho_buff_fx. Creates a client-side FX entity with VFX effect, particle emission system, and envelope-based colour/scale animation. Returns early on dedicated servers.
* **Parameters:** None
* **Returns:** Entity instance -- the soul echo buff FX entity
* **Error states:** None

### `InitEnvelope_overloading_fx()`
* **Description:** Initializes colour and scale envelopes for overloading FX particles. Sets up colour envelope fading from white to transparent and scale envelope growing over particle lifetime. Sets itself to nil after first run.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `overloading_fx_emit(effect, sphere_emitter, direction)`
* **Description:** Emits a single particle for the overloading FX with randomized UV offset and velocity based on direction.
* **Parameters:**
  - `effect` -- VFX effect component
  - `sphere_emitter` -- Sphere emitter function for particle positions
  - `direction` -- Direction vector for particle velocity
* **Returns:** None
* **Error states:** None

### `overloading_fx_fn()`
* **Description:** Prefab constructor for overloading FX. Creates a client-side FX entity with VFX effect, follower component, and particle emission system. Returns early on dedicated servers.
* **Parameters:** None
* **Returns:** Entity instance -- the overloading FX entity
* **Error states:** None

### `OnKillBuff_forget(inst)`
* **Description:** Stops the forget debuff component, effectively ending the buff.
* **Parameters:**
  - `inst` -- Forget debuff entity instance
* **Returns:** None
* **Error states:** None

### `OnAttached_forget(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when forget debuff attaches. Sets parent entity, listens for target death and wakeup events, and applies SetShouldAvoidAggro to target's combat component if toforget is specified.
* **Parameters:**
  - `inst` -- Forget debuff entity instance
  - `target` -- Target entity receiving the debuff
  - `followsymbol` -- Symbol to follow on target
  - `followoffset` -- Offset from follow symbol
  - `data` -- Debuff data table containing toforget target
* **Returns:** None
* **Error states:** None

### `OnDetached_forget(inst, target)`
* **Description:** Called when forget debuff detaches. Removes the should avoid aggro status from target's combat component for the toforget entity, then removes the debuff entity.
* **Parameters:**
  - `inst` -- Forget debuff entity instance
  - `target` -- Target entity the debuff was attached to
* **Returns:** None
* **Error states:** None

### `OnExtendedBuff_forget(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when forget debuff duration is extended. Cancels existing buff task and schedules a new one with the panflute forget duration from TUNING.
* **Parameters:**
  - `inst` -- Forget debuff entity instance
  - `target` -- Target entity with the debuff
  - `followsymbol` -- Symbol to follow on target
  - `followoffset` -- Offset from follow symbol
  - `data` -- Debuff data table
* **Returns:** None
* **Error states:** None

### `wortox_forget_debuff_fn()`
* **Description:** Prefab constructor for wortox_forget_debuff. Creates a classified debuff entity on master sim only. Sets up attached/detached/extended callback functions for the debuff component.
* **Parameters:** None
* **Returns:** Entity instance -- the forget debuff entity
* **Error states:** None

### `SetPanfluteBuffIconFX(target)`
* **Description:** Sets the wortox_panflute_buff netvar to true on the target's player_classified component to show buff icon.
* **Parameters:**
  - `target` -- Target entity (player) to set buff icon on
* **Returns:** None
* **Error states:** None

### `ClearPanfluteBuffIconFX(target)`
* **Description:** Sets the wortox_panflute_buff netvar to false on the target's player_classified component to hide buff icon.
* **Parameters:**
  - `target` -- Target entity (player) to clear buff icon on
* **Returns:** None
* **Error states:** None

### `OnAttached_panflute(inst, target, followsymbol, followoffset, data)`
* **Description:** Called when panflute buff attaches. Sets parent entity, listens for target death, initializes buff count if needed, increments buff count, sets icon FX, and pushes wortox_panflute_playing_active event.
* **Parameters:**
  - `inst` -- Panflute buff entity instance
  - `target` -- Target entity receiving the buff
  - `followsymbol` -- Symbol to follow on target
  - `followoffset` -- Offset from follow symbol
  - `data` -- Buff data table
* **Returns:** None
* **Error states:** None

### `OnDetached_panflute(inst, target)`
* **Description:** Called when panflute buff detaches. Decrements buff count, clears icon FX and resets panflute timer if count reaches zero, pushes wortox_panflute_playing_used event, and removes the buff entity.
* **Parameters:**
  - `inst` -- Panflute buff entity instance
  - `target` -- Target entity the buff was attached to
* **Returns:** None
* **Error states:** None

### `wortox_panflute_buff_fn()`
* **Description:** Prefab constructor for wortox_panflute_buff. Creates a classified debuff entity on master sim only. Sets up attached/detached callback functions for the debuff component with keepondespawn enabled.
* **Parameters:** None
* **Returns:** Entity instance -- the panflute buff entity
* **Error states:** None

### `wortox_panflute_buff_fx_fn()`
* **Description:** Prefab constructor for wortox_panflute_buff_fx. Creates an FX entity with anim state playing heal animation with custom scale and delta time multiplier. Returns early on non-master sim.
* **Parameters:** None
* **Returns:** Entity instance -- the panflute buff FX entity
* **Error states:** None

### `BreakDecoysFor(decoyowner)`
* **Description:** Kills any existing decoy for the given owner by setting decoyexpired flag and calling health:Kill(). Clears the owner's wortox_decoy_inst reference.
* **Parameters:**
  - `decoyowner` -- Player entity that owns the decoy
* **Returns:** None
* **Error states:** None

### `SetOwner_decoy(inst, decoyowner)`
* **Description:** Sets the decoy owner, updates follower leadership, breaks old decoys, lures nearby enemies targeting the owner, applies skins from owner if player, and sets up duration and skill bonuses.
* **Parameters:**
  - `inst` -- The decoy entity instance
  - `decoyowner` -- The player or entity that will own this decoy
* **Returns:** None
* **Error states:** None

### `OnDeath_decoy(inst)`
* **Description:** Handles decoy death by clearing owner reference, adding nearby entities targeting the decoy or owner to lured list, and redirecting combat focus back to the owner.
* **Parameters:**
  - `inst` -- The decoy entity instance
* **Returns:** None
* **Error states:** None

### `OnAttacked_decoy(inst, data)`
* **Description:** Called when decoy is attacked; sets the attacker as the thorns target if soul damage test passes.
* **Parameters:**
  - `inst` -- The decoy entity instance
  - `data` -- Attack data table containing attacker reference
* **Returns:** None
* **Error states:** None

### `DoThorns_decoy(inst)`
* **Description:** Deals thorns damage to the stored thorns target, applying skill-based damage multipliers and soul count bonuses, spawning FX, and handling explosive resistance.
* **Parameters:**
  - `inst` -- The decoy entity instance
* **Returns:** None
* **Error states:** None

### `DoExplosion_decoy(inst)`
* **Description:** Handles decoy explosion by optionally triggering thorns first, then dealing area damage to lured or targeting entities within explode radius with skill-based damage scaling.
* **Parameters:**
  - `inst` -- The decoy entity instance
* **Returns:** None
* **Error states:** None

### `DoFizzle_decoy(inst)`
* **Description:** Handles decoy fizzle effect, triggering thorns damage if enabled.
* **Parameters:**
  - `inst` -- The decoy entity instance
* **Returns:** None
* **Error states:** None

### `DisplayNameFn_decoy(inst)`
* **Description:** Returns the formatted display name for the decoy using the owner's name from the networked string, or nil if no owner name is set.
* **Parameters:**
  - `inst` -- The decoy entity instance
* **Returns:** String or nil
* **Error states:** None

### `GetSpecialDescription_decoy(inst, viewer)`
* **Description:** Returns a special inspection description for the decoy including the owner's name, bypassing translations for player names; returns nil for player ghosts or if no owner name.
* **Parameters:**
  - `inst` -- The decoy entity instance
  - `viewer` -- The player entity inspecting the decoy
* **Returns:** String or nil
* **Error states:** None

### `wortox_decoy_fn()`
* **Description:** Prefab constructor function that creates the wortox_decoy entity with transform, animstate, sound, shadow, network components, adds decoy/soulless/scarytoprey tags, sets up follower/skinner/inspectable/health/combat components, and assigns decoy-specific functions.
* **Parameters:** None
* **Returns:** Entity instance
* **Error states:** None

## Events & listeners
**Listens to:**
- `entity_droploot` -- Listened on TheWorld in OnRespawnedFromGhost to spawn souls from entity loot drops
- `entity_death` -- Listened on TheWorld in OnRespawnedFromGhost to spawn souls when entities die
- `starvedtrapsouls` -- Listened on TheWorld in OnRespawnedFromGhost to spawn souls from starved traps
- `setowner` -- Triggers OnSetOwner callback when entity owner changes
- `freesoulhopschanged` -- Updates free soul hop counter on client
- `onactivateskill_client` -- Recalculates Wortox inclination on client when skill activates
- `ondeactivateskill_client` -- Recalculates Wortox inclination on client when skill deactivates
- `stacksizechange` -- Handles inventory stack size changes
- `gotnewitem` -- Handles acquiring new items
- `newactiveitem` -- Handles active item changes
- `dropitem` -- Handles item drop events
- `soulhop` -- Handles soul hop teleportation events
- `murdered` -- Handles player death events
- `harvesttrapsouls` -- Handles soul harvesting from traps
- `ms_respawnedfromghost` -- Handles respawning from ghost form
- `ms_becameghost` -- Handles becoming a ghost
- `ms_playerreroll` -- Handles player reroll events
- `onactivateskill_server` -- Recalculates Wortox inclination on server when skill activates
- `ondeactivateskill_server` -- Recalculates Wortox inclination on server when skill deactivates
- `ms_skilltreeinitialized` -- Triggers skill tree initialization handler
- `timerdone` -- Handles timer completion for soul echo buff
- `death` -- Stops debuff when target dies (soul echo, forget, panflute buffs)
- `onwakeup` -- Schedules forget buff expiry task when target wakes up
- `attacked` -- Listens for when the decoy is attacked to set thorns target

**Pushes:**
- `wortox_inclination_changed` -- Pushed in RecalculateInclination when inclination changes with old and new values
- `souloverloadwarning` -- Pushed in CreateOverloadingFX to trigger wisecracker warning
- `souloverload` -- Pushed in CheckForOverload when soul overload occurs for stategraph
- `soultoomany` -- Pushed in CheckForOverload when soul count exceeds wisecracker threshold
- `souloverloadavoided` -- Pushed in CheckForOverload when overload FX is destroyed
- `soultoofew` -- Pushed in CheckSoulsRemoved when soul count is low but not zero
- `soulempty` -- Pushed in CheckSoulsRemoved when soul count reaches zero
- `wortox_panflute_playing_active` -- Pushed when panflute buff attaches to trigger wisecracker dialogue
- `wortox_panflute_playing_used` -- Pushed when panflute buff count reaches zero to trigger wisecracker dialogue