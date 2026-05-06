---
id: merm
title: Merm
description: Defines the merm prefab factory system including common functions, guard variants, shadow merms, lunar merms, and their respective initialization logic with combat, follower, trader, and transformation behaviors.
tags: [npc, combat, ai, transformation, trading]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 0c81604c
system_scope: entity
---

# Merm

> Based on game build **722832** | Last updated: 2026-04-28

## Overview

The merm prefab file defines a comprehensive factory system for creating merm entities with multiple variants. Returns 6 prefabs: `merm`, `mermguard`, `merm_shadow`, `mermguard_shadow`, `merm_lunar`, `mermguard_lunar`. Each variant has distinct initialization logic handling combat behaviors, follower mechanics, trader interactions, and transformation states. Each variant has distinct initialization logic handling combat behaviors, follower mechanics, trader interactions, and transformation states. The system uses the `MakeMerm` factory function to construct prefabs with shared component setups while allowing variant-specific customization through `common_postinit` and `master_postinit` callbacks. Merms support dynamic upgrades based on merm king presence, loyalty-based hiring mechanics, and alignment-based transformations (shadow/lunar). The prefab attaches extensive component dependencies for combat, health, inventory, locomotion, and AI behaviors, with event-driven responses for attacks, item interactions, and loyalty changes.

## Usage example

```lua
-- Spawn variants from each category
local merm = SpawnPrefab("merm")              -- common merm
local guard = SpawnPrefab("mermguard")        -- merm guard
local shadow = SpawnPrefab("merm_shadow")     -- shadow merm
local lunar = SpawnPrefab("merm_lunar")       -- lunar merm

merm.Transform:SetPosition(100, 0, 100)

-- Hire a merm by giving it food (triggers trader component)
local player = ThePlayer
local food = player.components.inventory:FindItem(function(item)
    return item.components.edible ~= nil
end)
if food then
    player.components.inventory:GiveItem(food, merm)
end

-- Check merm guard status and loyalty
if guard:HasTag("mermguard") then
    local loyalty = guard.components.follower:GetLoyaltyPercent()
    print("Guard loyalty: " .. loyalty)
end

-- Listen for merm transformation events (note: 'mutated' fires on the new lunar entity, not the original which is removed)
lunar:ListenForEvent("mutated", function(inst, data)
    print("Merm transformed to lunar variant")
end)
```

## Dependencies & tags

**External dependencies:**
- `brains/mermbrain` -- Required and set as brain for common merms
- `brains/mermguardbrain` -- Required and set as brain for merm guards
- `TheWorld` -- Access components.mermkingmanager, Map:IsPointNearHole, ismastersim
- `TheSim` -- FindEntities for target sharing and merm discovery
- `TheNet` -- IsDedicated check for client-side logic
- `ThePlayer` -- HasTag check for mermfluent status
- `TUNING` -- MERM_* constants for damage, health, loyalty, speed, attack period
- `STRINGS` -- MERMNAMES, battle cry tables, MERM_PRINCE name
- `ACTIONS` -- CHOP action check in SuggestTreeTarget
- `SpawnPrefab` -- Spawn shadow/lunar merm variants, thorns FX, tentacle
- `CreateEntity` -- Create flame FX entities
- `Asset` -- Define animation and sound assets
- `SetSharedLootTable` -- Define merm_lunar_loot table
- `SGmerm` -- StateGraph set for all merm variants in common_master and guard_master
- `MakeMediumBurnableCharacter` -- Add burnable behavior to living merms
- `MakeMediumFreezableCharacter` -- Add freezable behavior to living merms
- `MakeCharacterPhysics` -- Set up physics body for merm
- `MakeHauntablePanic` -- Add hauntable panic behavior to common merms
- `FindEntity` -- Find invasion targets within range
- `SpringCombatMod` -- Modify combat ranges for spring
- `TryLuckRoll` -- Luck-based proc checks for triple attack and tentacle spawn
- `LuckFormulas` -- MermTripleAttack, ShadowTentacleSpawn formula references
- `FindWalkableOffset` -- Find valid spawn position for shadow tentacle
- `WORLD_TILES` -- SHADOW_MARSH tile type check
- `SPECIAL_EVENTS` -- YOTB event check for anim override
- `IsSpecialEventActive` -- Check if YOTB event is active
- `TALKINGFONT` -- Font for merm talker component
- `Vector3` -- Position calculations for item drops
- `TWOPI` -- Random angle calculations
- `FOODGROUP` -- VEGETARIAN diet setting
- `FOODTYPE` -- VEGGIE food affinity
- `EQUIPSLOTS` -- HEAD, HANDS slot references

**Components used:**
- `eater` -- SetDiet for vegetarian food, CanEat checks
- `sleeper` -- SetNocturnal, SetSleepTest, SetWakeTest, IsAsleep, WakeUp
- `named` -- possiblenames, PickNewName, SetName
- `locomotor` -- SetAllowPlatformHopping, SetTriggersCreep, runspeed, walkspeed, pathcaps
- `embarker` -- Added for boat hopping capability
- `drownable` -- Added for water drowning behavior
- `foodaffinity` -- AddFoodtypeAffinity, AddPrefabAffinity for veggie/kelp/durian bonuses
- `health` -- StartRegen, SetMaxHealth, IsDead, TransferComponent, GetPercent
- `combat` -- SetDefaultDamage, SetAttackPeriod, SetRetargetFunction, SetKeepTargetFunction, SetTarget, HasTarget, TargetIs, ShareTarget, CanTarget, GetBattleCryString
- `lootdropper` -- SetLoot, SetChanceLootTable
- `inventory` -- GetEquippedItem, DropItem, Equip, FindItem, GiveItem, Unequip, TransferComponent
- `inspectable` -- Added for inspection behavior
- `knownlocations` -- Added for location tracking
- `follower` -- SetCanBeRollCalledFn, OnChangedLeader, maxfollowtime, AddLoyaltyTime, GetLeader, GetLoyaltyPercent, neverexpire
- `mermcandidate` -- AddCalories for king candidate tracking
- `timer` -- StartTimer for face time management
- `trader` -- SetAcceptTest, SetAbleToAcceptTest, onaccept, onrefuse
- `homeseeker` -- GetHome, GetHomeDirectTravelTime, home property
- `childspawner` -- GoHome, TakeOwnership, TakeEmergencyOwnership, ReleaseAllChildren, childreninside
- `entitytracker` -- TrackEntity, GetEntity, ForgetEntity for corpse data
- `planardamage` -- SetBaseDamage, GetBaseDamage for lunar/shadow merms
- `talker` -- IgnoreAll, resolvechatterfn for merm chatter
- `skilltreeupdater` -- IsActivated for alignment skills checks
- `inventoryitem` -- GetGrandOwner for leader resolution
- `leader` -- AddFollower for hiring merms
- `debuffable` -- HasDebuff for trident buff check

**Tags:**
- `character` -- add
- `merm` -- add
- `wet` -- add
- `merm_npc` -- add
- `_named` -- add
- `mermguard` -- add
- `guard` -- add
- `shadowminion` -- add
- `shadow_aligned` -- add
- `lunarminion` -- add
- `lunar_aligned` -- add
- `FX` -- add
- `playermerm` -- check
- `mermdisguise` -- check
- `pig` -- check
- `wonkey` -- check
- `NPC_contestant` -- check
- `INLIMBO` -- check
- `shadowthrall_parasite_hosted` -- check
- `mermfluent` -- check
- `mermprince` -- check
- `busy` -- check
- `sleeping` -- check
- `moonglass_piece` -- check
- `fish` -- check
- `merm_tool` -- check
- `merm_tool_upgraded` -- check
- `mermarmorhat` -- check
- `mermarmorupgradedhat` -- check

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | (file-scope) | Animation and sound assets defined at file scope |
| `prefabs` | table | (file-scope) | Prefab dependencies list defined at file scope |
| `merm_loot` | table | {"pondfish", "froglegs"} | Loot table for common merms |
| `merm_guard_loot` | table | {"pondfish", "froglegs"} | Loot table for merm guards |
| `merm_shadow_loot` | table | {"nightmarefuel"} | Loot table for shadow merms |
| `sounds` | table | (file-scope) | Sound paths for common merm (attack, hit, death, talk, buff) |
| `sounds_guard` | table | (file-scope) | Sound paths for merm guards |
| `planarbuffed` | net_bool | false | Netvar toggling eye special effects on shadow/lunar merms; dirty event: `planarbuffeddirty` |
| `_equipschanged` | net_event | nil | Netvar triggering client-side equip updates on shadow merms |
| TUNING constants | various | -- | MERM_DAMAGE, MERM_HEALTH, MERM_GUARD_DAMAGE, MERM_GUARD_HEALTH, MERM_LOYALTY_MAXTIME, MERM_GUARD_LOYALTY_MAXTIME, MERM_ATTACK_PERIOD, MERM_GUARD_ATTACK_PERIOD, MERM_RUN_SPEED, MERM_GUARD_RUN_SPEED, MERM_WALK_SPEED, MERM_GUARD_WALK_SPEED, MERM_DEFEND_DIST, MERM_GUARD_DEFEND_DIST, MERM_SHARE_TARGET_DIST, MERM_GUARD_SHARE_TARGET_DIST, MERM_MAX_TARGET_SHARES, MERM_GUARD_MAX_TARGET_SHARES, MERM_LOYALTY_PER_HUNGER, MERM_GUARD_LOYALTY_PER_HUNGER, MERM_LOYALTY_MAXTIME_KINGBONUS, MERM_LOYALTY_PER_HUNGER_KINGBONUS, MERM_DAMAGE_KINGBONUS, MERM_HEALTH_KINGBONUS, MERM_GUARD_EXTRA_HEALTH, MERM_LUNAR_EXTRA_HEALTH, MERM_LUNAR_GUARD_EXTRA_HEALTH, MERM_LOW_LOYALTY_WARNING_PERCENT, MERMKING_TRIDENTBUFF_TRIPLEHIT_CHANCE, WURT_TERRAFORMING_SHADOW_PROCCHANCE, SPAWN_MUTATED_MERMS |


## Main functions

### `FindInvaderFn(guy, inst)`
* **Description:** Determines if an entity is a valid invasion target for merms by checking tags, leader relationships, and merm king presence.
* **Parameters:**
  - `guy` -- Entity instance to check for invader status
  - `inst` -- The merm entity instance
* **Returns:** Entity or nil if not a valid target
* **Error states:** None

### `RetargetFn(inst)`
* **Description:** Combat retarget function that finds nearby invaders within defend distance of home or self.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** Target entity or nil
* **Error states:** None

### `KeepTargetFn(inst, target)`
* **Description:** Determines if combat should maintain current target based on distance to home and combat validity.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `target` -- Current combat target entity
* **Returns:** boolean
* **Error states:** None

### `OnAttackedByDecidRoot(inst, attacker)`
* **Description:** Shares target with nearby merm helpers when attacked by a deciduous root, limited by max target shares.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `attacker` -- The deciduous root attacker entity
* **Returns:** nil
* **Error states:** None

### `IsNonPlayerMerm(this)`
* **Description:** Checks if entity is a non-player merm.
* **Parameters:**
  - `this` -- Entity instance to check
* **Returns:** boolean
* **Error states:** None

### `IsHost(dude)`
* **Description:** Checks if entity has shadowthrall parasite host tag.
* **Parameters:**
  - `dude` -- Entity instance to check
* **Returns:** boolean
* **Error states:** None

### `resolve_on_attacked(inst, attacker)`
* **Description:** Handles attack response including deciduous root special case, shadow thrall sharing, and general target sharing with nearby merms.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `attacker` -- The attacking entity
* **Returns:** nil
* **Error states:** None

### `OnAttacked(inst, data)`
* **Description:** Event handler for attacked event, resolves attack response if attacker exists and inst is valid.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Event data table containing attacker
* **Returns:** nil
* **Error states:** None

### `OnAttackDodged(inst, attacker)`
* **Description:** Event handler for attack dodged event, resolves attack response.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `attacker` -- The attacker entity
* **Returns:** nil
* **Error states:** None

### `MermSort(a, b)`
* **Description:** Sorts merms by loyalty percent, then by GUID for deterministic ordering.
* **Parameters:**
  - `a` -- First merm entity for comparison
  - `b` -- Second merm entity for comparison
* **Returns:** boolean
* **Error states:** None

### `GetOtherMerms(inst, radius, maxcount, giver)`
* **Description:** Finds nearby merms prioritized by loyalty status, excluding dead merms and filtering by lunar alignment.
* **Parameters:**
  - `inst` -- The source merm entity
  - `radius` -- Search radius for nearby merms
  - `maxcount` -- Maximum number of merms to return
  - `giver` -- The entity giving the hire item
* **Returns:** table of merm entities
* **Error states:** None

### `dohiremerms(inst, giver, item)`
* **Description:** Processes merm hiring logic including loyalty time calculation, king bonus, and cascading hire to nearby merms.
* **Parameters:**
  - `inst` -- The merm being hired
  - `giver` -- The entity hiring the merm
  - `item` -- The food item used for hiring
* **Returns:** nil
* **Error states:** None

### `IsAbleToAccept(inst, item, giver)`
* **Description:** Tests if merm can accept an item based on health state and busy/sleeping status.
* **Parameters:**
  - `inst` -- The merm entity
  - `item` -- Item being offered
  - `giver` -- Entity offering the item
* **Returns:** boolean, string reason or nil
* **Error states:** None

### `ShouldAcceptItem(inst, item, giver)`
* **Description:** Determines if merm should accept item based on guard status, alignment skills, and item type (edible, equippable, fish).
* **Parameters:**
  - `inst` -- The merm entity
  - `item` -- Item being offered
  - `giver` -- Entity offering the item
* **Returns:** boolean
* **Error states:** None

### `DoCheer_Act(inst)`
* **Description:** Pushes cheer event on the merm entity.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `DoCheer(inst)`
* **Description:** Schedules DoCheer_Act with random slight delay.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `DoDisapproval_Act(inst)`
* **Description:** Triggers disapproval state if not busy.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `DoDisapproval(inst)`
* **Description:** Schedules DoDisapproval_Act with random slight delay.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Handles item acceptance including hiring merms for edible items and equipping head slot items.
* **Parameters:**
  - `inst` -- The merm entity
  - `giver` -- Player or entity giving item
  - `item` -- Item being given
* **Returns:** nil
* **Error states:** None

### `OnRefuseItem(inst, item)`
* **Description:** Handles item refusal by triggering refuse state and waking if asleep.
* **Parameters:**
  - `inst` -- The merm entity
  - `item` -- Refused item
* **Returns:** nil
* **Error states:** None

### `SuggestTreeTarget(inst, data)`
* **Description:** Sets tree target for chopping if not currently performing chop action.
* **Parameters:**
  - `inst` -- The merm entity
  - `data` -- Event data containing tree target
* **Returns:** nil
* **Error states:** None

### `UpdateDamageAndHealth(inst)`
* **Description:** Updates combat damage and health max based on guard status, merm king presence, and lunar alignment.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `UpdateRoyalStatus(inst, scale)`
* **Description:** Updates damage/health and applies scale transform, triggers eye build update if applicable.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `scale` -- Scale multiplier for transform
* **Returns:** nil
* **Error states:** None

### `RoyalUpgrade(inst)`
* **Description:** Applies royal upgrade status with 1.05 scale if not dead.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `RoyalDowngrade(inst)`
* **Description:** Applies royal downgrade status with 1.0 scale if not dead.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `RoyalGuardUpgrade(inst)`
* **Description:** Applies royal guard upgrade with appropriate build based on lunar/shadow alignment.
* **Parameters:**
  - `inst` -- The merm guard entity instance
* **Returns:** nil
* **Error states:** None

### `RoyalGuardDowngrade(inst)`
* **Description:** Applies royal guard downgrade with small build based on lunar/shadow alignment.
* **Parameters:**
  - `inst` -- The merm guard entity instance
* **Returns:** nil
* **Error states:** None

### `ResolveMermChatter(inst, strid, strtbl)`
* **Description:** Resolves merm chatter string based on player merm fluency status.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `strid` -- String ID netvar
  - `strtbl` -- String table name netvar
* **Returns:** string or nil
* **Error states:** None

### `ShouldGuardSleep(inst)`
* **Description:** Sleep test function for guards, always returns false.
* **Parameters:**
  - `inst` -- The merm guard entity instance
* **Returns:** boolean (false)
* **Error states:** None

### `ShouldGuardWakeUp(inst)`
* **Description:** Wake test function for guards, always returns true.
* **Parameters:**
  - `inst` -- The merm guard entity instance
* **Returns:** boolean (true)
* **Error states:** None

### `ShouldSleep(inst)`
* **Description:** Sleep test function checking nocturnal status, follower state, and merm king candidate status.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** boolean
* **Error states:** None

### `ShouldWakeUp(inst)`
* **Description:** Wake test function checking nocturnal wake or merm king candidate status.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** boolean
* **Error states:** None

### `OnTimerDone(inst, data)`
* **Description:** Handles timer done event, starts dontfacetime timer when facetime expires.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Timer event data with name field
* **Returns:** nil
* **Error states:** None

### `OnRanHome(inst)`
* **Description:** Callback when merm reaches home, drops equipped items around home and returns to childspawner.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `CancelRunHomeTask(inst)`
* **Description:** Cancels pending run home task if exists.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `OnEntitySleepMerm(inst)`
* **Description:** Handles entity sleep event, cancels run home task and schedules teleport if wanted.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `OnMarkForTeleport(inst, data)`
* **Description:** Marks merm for teleport on loyalty loss with leader.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Event data with leader field
* **Returns:** nil
* **Error states:** None

### `OnUnmarkForTeleport(inst, data)`
* **Description:** Removes teleport mark on loyalty gain with leader.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Event data with leader field
* **Returns:** nil
* **Error states:** None

### `battlecry(combatcmp, target)`
* **Description:** Returns battle cry string table and random index based on guard status.
* **Parameters:**
  - `combatcmp` -- Combat component instance
  - `target` -- Combat target entity
* **Returns:** string table name, number index
* **Error states:** None

### `OnSave(inst, data)`
* **Description:** Saves wantstoteleport flag to save data.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Save data table
* **Returns:** nil
* **Error states:** None

### `spawn_shadow_merm(inst)`
* **Description:** Spawns shadow merm replacement at same position, transfers leader and target, takes ownership at home childspawner.
* **Parameters:**
  - `inst` -- The dying merm entity
* **Returns:** nil
* **Error states:** None

### `OnLoad(inst, data)`
* **Description:** Restores wantstoteleport flag from load data.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Load data table
* **Returns:** nil
* **Error states:** None

### `TestForShadowDeath(inst)`
* **Description:** Tests if shadow merm should spawn on death based on leader shadow allegiance skill.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `newcombattarget(inst, data)`
* **Description:** Unequips hand slot item when new combat target is acquired.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Event data
* **Returns:** nil
* **Error states:** None

### `droppedtarget(inst, data)`
* **Description:** Equips hand slot item from inventory when target is dropped.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Event data
* **Returns:** nil
* **Error states:** None

### `itemget(inst, data)`
* **Description:** Auto-equips merm tools or armor hats based on guard status and item tags.
* **Parameters:**
  - `inst` -- The merm entity instance
  - `data` -- Event data with item field
* **Returns:** nil
* **Error states:** None

### `ShadowMerm_OnItemEquipped(inst, data)`
* **Description:** Pushes equips changed net event and triggers client update if not dedicated server.
* **Parameters:**
  - `inst` -- The shadow merm entity
  - `data` -- Equip event data
* **Returns:** nil
* **Error states:** None

### `DoThorns(inst)`
* **Description:** Spawns thorns FX and plays cactus armor sound.
* **Parameters:**
  - `inst` -- The lunar merm entity
* **Returns:** nil
* **Error states:** None

### `DoLunarMutation(inst)`
* **Description:** Transforms merm to lunar variant, transfers health/inventory components, reassigns leader and home ownership.
* **Parameters:**
  - `inst` -- The merm entity to mutate
* **Returns:** lunar merm entity
* **Error states:** None

### `DoLunarRevert(inst)`
* **Description:** Transforms lunar merm back to normal variant, transfers components and reassigns ownership.
* **Parameters:**
  - `inst` -- The lunar merm entity to revert
* **Returns:** normal merm entity
* **Error states:** None

### `TestForLunarMutation(inst, item)`
* **Description:** Triggers lunar mutation if item has moonglass_piece tag, then removes item.
* **Parameters:**
  - `inst` -- The merm entity
  - `item` -- Item being tested
* **Returns:** nil
* **Error states:** None

### `living_merm_common_master(inst)`
* **Description:** Adds eater, sleeper, named components and makes burnable/freezable for living merms.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `CreateFlameFx(parent)`
* **Description:** Creates flame FX entity attached to parent with follower component and random animation frame.
* **Parameters:**
  - `parent` -- Parent entity for flame FX
* **Returns:** FX entity instance
* **Error states:** None

### `onunequip(inst, data)`
* **Description:** Hides ARM_carry_up animation when hand slot item is unequipped.
* **Parameters:**
  - `inst` -- The merm entity
  - `data` -- Unequip event data with item
* **Returns:** nil
* **Error states:** None

### `equip(inst, data)`
* **Description:** Shows ARM_carry_up and hides ARM_carry when hand slot item is equipped.
* **Parameters:**
  - `inst` -- The merm entity
  - `data` -- Equip event data with item
* **Returns:** nil
* **Error states:** None

### `updateeyebuild(inst)`
* **Description:** Adds or clears lunar eye override builds based on planar debuff and guard status.
* **Parameters:**
  - `inst` -- The merm entity instance
* **Returns:** nil
* **Error states:** None

### `CanBeRollCalledFn(inst, leader)`
* **Description:** Determines if merm can be roll called based on alignment skills, guard status, and leader tags.
* **Parameters:**
  - `inst` -- The merm entity
  - `leader` -- Potential leader entity
* **Returns:** boolean
* **Error states:** None

### `OnChangedLeader(inst, new_leader, prev_leader)`
* **Description:** Saves previous leader to _last_leader for corpse data restoration.
* **Parameters:**
  - `inst` -- The merm entity
  - `new_leader` -- New leader entity or nil
  - `prev_leader` -- Previous leader entity
* **Returns:** nil
* **Error states:** None

### `SaveCorpseData(inst, corpse)`
* **Description:** Saves merm name, tracks leader and home entities on corpse for restoration.
* **Parameters:**
  - `inst` -- The dying merm entity
  - `corpse` -- Corpse entity to save data to
* **Returns:** data table
* **Error states:** None

### `LoadCorpseData(inst, corpse)`
* **Description:** Restores merm name, reassigns leader and home ownership from corpse tracking.
* **Parameters:**
  - `inst` -- The restored merm entity
  - `corpse` -- Corpse entity with saved data
* **Returns:** nil
* **Error states:** None

### `MakeMerm(name, assets, prefabs, common_postinit, master_postinit, data)`
* **Description:** Factory function that creates merm prefab with fn() constructor attaching all components, events, and methods.
* **Parameters:**
  - `name` -- Prefab name string
  - `assets` -- Asset table
  - `prefabs` -- Prefab dependencies table
  - `common_postinit` -- Common initialization function
  - `master_postinit` -- Master-only initialization function
  - `data` -- Optional data table with unliving flag
* **Returns:** Prefab table
* **Error states:** None

### `OnEat(inst, data)`
* **Description:** Adds calories to merm candidate if merm king manager exists and inst is candidate.
* **Parameters:**
  - `inst` -- The merm entity
  - `data` -- Eat event data with food
* **Returns:** nil
* **Error states:** None

### `no_holes(pt)`
* **Description:** Tests if position is not near a hole on the world map.
* **Parameters:**
  - `pt` -- Position vector
* **Returns:** boolean
* **Error states:** None

### `guard_common(inst)`
* **Description:** Sets guard build, adds mermguard and guard tags, sets scale, assigns guard sounds.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `on_mermking_created_upgrade_guard(inst)`
* **Description:** Applies royal guard upgrade and pushes onmermkingcreated event.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `guard_on_mermking_created_anywhere(inst)`
* **Description:** Schedules guard upgrade with random delay when merm king is created anywhere.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `on_mermking_destroyed_downgrade_guard(inst)`
* **Description:** Applies royal guard downgrade and pushes onmermkingdestroyed event.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `guard_on_mermking_destroyed_anywhere(inst)`
* **Description:** Schedules guard downgrade with random delay when merm king is destroyed anywhere.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `on_guard_initialize(inst)`
* **Description:** Cancels existing initialize task and applies royal guard downgrade if no king exists.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `Guard_ShouldWaitForHelp(inst)`
* **Description:** Determines if guard should wait for help based on target existence, leader flee skill, and low health.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** boolean
* **Error states:** None

### `Guard_CanTripleAttack(inst)`
* **Description:** Checks if guard can triple attack based on trident buff debuff and leader luck roll.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** boolean
* **Error states:** None

### `OnAttackOther(inst, data)`
* **Description:** Spawns shadow tentacle on shadow marsh tile when leader has shadow terrain skill and luck roll succeeds.
* **Parameters:**
  - `inst` -- The merm entity
  - `data` -- Event data with target victim
* **Returns:** nil
* **Error states:** None

### `guard_master(inst)`
* **Description:** Master initialization for guards including scrapbook data, locomotor speeds, stategraph, brain, combat functions, and king events.
* **Parameters:**
  - `inst` -- The merm guard entity
* **Returns:** nil
* **Error states:** None

### `common_displaynamefn(inst)`
* **Description:** Returns merm prince display name if mermprince tag exists.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** string or nil
* **Error states:** None

### `common_common(inst)`
* **Description:** Sets sounds, build, and display name function for common merms.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `on_mermking_created_upgrade(inst)`
* **Description:** Applies royal upgrade and pushes onmermkingcreated event.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `on_mermking_created_anywhere(inst)`
* **Description:** Schedules royal upgrade with random delay when merm king is created anywhere.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `on_mermking_destroyed_downgrade(inst)`
* **Description:** Applies royal downgrade and pushes onmermkingdestroyed event.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `on_mermking_destroyed_anywhere(inst)`
* **Description:** Schedules royal downgrade with random delay when merm king is destroyed anywhere.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `common_master(inst)`
* **Description:** Master initialization for common merms including scrapbook data, locomotor speeds, stategraph, brain, combat, hauntable, loot, and king events.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `AddEyeSpecialEffect(inst)`
* **Description:** Creates and attaches flame FX to flameL and flameR symbols on entity.
* **Parameters:**
  - `inst` -- The shadow/lunar merm entity
* **Returns:** nil
* **Error states:** None

### `RemoveEyeSpecialEffect(inst)`
* **Description:** Removes flameL and flameR FX entities if they exist.
* **Parameters:**
  - `inst` -- The shadow/lunar merm entity
* **Returns:** nil
* **Error states:** None

### `planarbuffed_changed(inst)`
* **Description:** Adds or removes eye special effects based on planarbuffed netvar value.
* **Parameters:**
  - `inst` -- The merm entity
* **Returns:** nil
* **Error states:** None

### `ShadowMerm_OnLoseLoyalty(inst, data)`
* **Description:** Triggers shadow_loyaltyover state when shadow merm loses loyalty and is not dead.
* **Parameters:**
  - `inst` -- The shadow merm entity
  - `data` -- Event data with leader
* **Returns:** nil
* **Error states:** None

### `CLIENT_ShadowMerm_OnEquipsChanged(inst)`
* **Description:** Client-side handler that darkens highlight children with mult colour and point filtering.
* **Parameters:**
  - `inst` -- The shadow merm entity
* **Returns:** nil
* **Error states:** None

### `shadow_merm_common(inst)`
* **Description:** Common initialization for shadow merms including build, tags, netvars, and client event listeners.
* **Parameters:**
  - `inst` -- The shadow merm entity
* **Returns:** nil
* **Error states:** None

### `OnChangedLeaderShadow(inst, new_leader, prev_leader)`
* **Description:** Calls base OnChangedLeader and triggers hit_shadow state if new leader is nil and not dead.
* **Parameters:**
  - `inst` -- The shadow merm entity
  - `new_leader` -- New leader or nil
  - `prev_leader` -- Previous leader
* **Returns:** nil
* **Error states:** None

### `shadow_merm_master(inst)`
* **Description:** Master initialization for shadow merms including scrapbook data, locomotor creep settings, planardamage, talker ignore, and loyalty events.
* **Parameters:**
  - `inst` -- The shadow merm entity
* **Returns:** nil
* **Error states:** None

### `shadow_mermguard_common(inst)`
* **Description:** Common initialization for shadow merm guards including build, tags, netvars, and client event listeners.
* **Parameters:**
  - `inst` -- The shadow merm guard entity
* **Returns:** nil
* **Error states:** None

### `shadow_mermguard_master(inst)`
* **Description:** Master initialization for shadow merm guards including locomotor, combat, planardamage, loot, and loyalty events.
* **Parameters:**
  - `inst` -- The shadow merm guard entity
* **Returns:** nil
* **Error states:** None

### `OnChangedLeaderLunar(inst, new_leader, prev_leader)`
* **Description:** Calls base OnChangedLeader and triggers lunar revert if new leader is nil, valid, and not dead.
* **Parameters:**
  - `inst` -- The lunar merm entity
  - `new_leader` -- New leader or nil
  - `prev_leader` -- Previous leader
* **Returns:** nil
* **Error states:** None

### `lunar_merm_common(inst)`
* **Description:** Common initialization for lunar merms including build, netvars, client listeners, and lunar tags.
* **Parameters:**
  - `inst` -- The lunar merm entity
* **Returns:** nil
* **Error states:** None

### `lunar_merm_master(inst)`
* **Description:** Master initialization for lunar merms including combat, planardamage, talker ignore, loot table, eye build update, and state memory flags.
* **Parameters:**
  - `inst` -- The lunar merm entity
* **Returns:** nil
* **Error states:** None

### `lunar_mermguard_common(inst)`
* **Description:** Common initialization for lunar merm guards including build, netvars, client listeners, and lunar tags.
* **Parameters:**
  - `inst` -- The lunar merm guard entity
* **Returns:** nil
* **Error states:** None

### `lunar_mermguard_master(inst)`
* **Description:** Master initialization for lunar merm guards including sleeper removal, combat, planardamage, loot table, and state memory flags.
* **Parameters:**
  - `inst` -- The lunar merm guard entity
* **Returns:** nil
* **Error states:** None

### `fn()`
* **Description:** Prefab constructor function inside MakeMerm that creates entity, adds components, sets up events, and attaches methods. Returns inst on client, continues to master_postinit on server.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** None

## Events & listeners

**Listens to:**
- `timerdone` -- Triggers OnTimerDone to manage face time timers
- `attacked` -- Triggers OnAttacked to resolve attack response
- `attackdodged` -- Triggers OnAttackDodged to resolve attack response
- `suggest_tree_target` -- Triggers SuggestTreeTarget to set tree target for chopping
- `entitysleep` -- Triggers OnEntitySleepMerm to handle sleep teleport logic
- `entitywake` -- Triggers CancelRunHomeTask to cancel pending home run
- `loseloyalty` -- Triggers OnMarkForTeleport or ShadowMerm_OnLoseLoyalty based on merm type
- `stopfollowing` -- Triggers OnMarkForTeleport to mark for teleport
- `gainloyalty` -- Triggers OnUnmarkForTeleport to remove teleport mark
- `startfollowing` -- Triggers OnUnmarkForTeleport to remove teleport mark
- `droppedtarget` -- Triggers droppedtarget to equip hand item
- `newcombattarget` -- Triggers newcombattarget to unequip hand item
- `itemget` -- Triggers itemget to auto-equip tools or armor
- `unequip` -- Triggers onunequip to hide carry animation
- `equip` -- Triggers equip or ShadowMerm_OnItemEquipped to show carry animation or update equips
- `onmermkingcreated_anywhere` -- Triggers royal upgrade functions for merms and guards
- `onmermkingdestroyed_anywhere` -- Triggers royal downgrade functions for merms and guards
- `onattackother` -- Triggers OnAttackOther for shadow tentacle spawn chance
- `oneat` -- Triggers OnEat to add calories for merm candidates
- `merm_shadow._equipschanged` -- Client-only event for shadow merm equips change
- `planarbuffeddirty` -- Client-only dirty event for planar buffed netvar change

**Pushes:**
- `cheer` -- Pushed by DoCheer_Act when merm cheers
- `suggest_tree_target` -- Pushed to helpers when attacked by decid root
- `detachchild` -- Pushed before lunar/shadow transformation to release from childspawner
- `mutated` -- Pushed by lunar merm after transformation with oldbuild data
- `demutated` -- Pushed by reverted merm after lunar revert with oldbuild data
- `shadowmerm_spawn` -- Pushed by shadow merm after spawn
- `onmermkingcreated` -- Pushed after royal upgrade on king creation
- `onmermkingdestroyed` -- Pushed after royal downgrade on king destruction
- `makefriend` -- Pushed by leader when merm is hired