---
id: hermitcrab
title: Hermitcrab
description: This prefab defines the Hermit Crab (Pearl) NPC with friendship progression, trading mechanics, island decoration complaints, reward distribution, fishing activities, seasonal behaviors, and tea shop interactions.
tags: [npc, friendship, trading, decoration, fishing]
sidebar_position: 10

last_updated: 2026-04-04
build_version: 718694
change_status: stable
category_type: prefabs
source_hash: f34fdb95
system_scope: entity
---

# Hermitcrab

> Based on game build **718694** | Last updated: 2026-04-04

## Overview

This module defines configuration data and resources for Pearl, a non-player character who lives on a small island and interacts with players through a friendship progression system. The module exports static tables including `assets` (animation and sound resources), `prefabs` (related prefab names), `SHOP_LEVELS` (shop tier identifiers), and `TASKS` (enumerated task IDs for friendship quests). External systems access this data by importing the module via `require()`.

Players can increase their friendship level by completing tasks such as decorating the island, planting flowers, building furniture, and removing unwanted structures. As friendship levels increase, players unlock shop tiers with new recipes, receive reward bundles containing shells and seasonal items, and gain access to special crafting stations. Actual gameplay logic for task evaluation, state management, and NPC interactions is implemented in separate component and entity scripts.
## Usage example

```lua
-- Check if Hermit Crab should accept an offered item
local should_accept = inst.components.trader.test(inst, player, item)

-- Complete a friendship task when player builds a chair
inst:PushEvent("CHEVO_makechair", { doer = player })

-- Get current friend level for dialogue selection
local friend_level = inst.components.friendlevels:GetLevel()
local level_string = getgeneralfriendlevel(inst)

-- Enable shop tier when friend level increases
EnableShop(inst, 3)

-- Register Hermit Crab with world message bottle manager
RegisterToBottleManager(inst)
```

## Dependencies & tags

**External dependencies:**
- `STRINGS` -- Accesses localization strings (HERMITCRAB dialogue, NAMES)
- `TUNING` -- Accesses game balance constants (HERMITCRAB timings, insulation thresholds, speeds)
- `TheWorld` -- Accesses world state and components (wagpunk_arena_manager, messagebottlemanager, worldmeteorshower)
- `Vector3` -- Defines talker colors and offsets
- `EQUIPSLOTS` -- Checks equipment slots (BODY, HANDS)
- `SEASONS` -- Checks insulation type (WINTER)
- `SHOP_LEVELS` -- Used to index prototyper trees based on shop level
- `SPECIAL_EVENTS` -- Event constant for WINTERS_FEAST
- `IsSpecialEventActive` -- Checks if specific event is active
- `TASKS` -- Used as keys for friendlytasks table and reward logic
- `FOODTYPE` -- Checks for MEAT foodtype
- `SpawnPrefab` -- Spawns reward items and fishing bobbers
- `CHATPRIORITIES` -- Sets chat priority for comments
- `GetRandomIndexFromString` -- Selects random chat index
- `TALKER_COLOR_LOW` -- Used for talker color setting
- `TALKER_COLOR_MED` -- Used for talker color setting
- `TALKER_COLOR_HIGH` -- Used for talker color setting
- `TALKINGFONT_HERMIT` -- Used for talker font setting
- `FOODGROUP` -- Used for diet configuration (OMNI)

**Components used:**
- `timer` -- Methods: `TimerExists`, `SetTimeLeft`, `StartTimer`, `GetTimeLeft`, `StopTimer`
- `talker` -- Properties: `colour`, `offset`, `name_colour`, `chaticon`, `lineduration`, `fontsize`, `font`, `ontalk`; Methods: `MakeChatter`
- `inventory` -- Methods: `EquipHasTag`, `HasItemWithTag`, `GetEquippedItem`, `FindItem`, `GiveItem`, `DropItem`, `Equip`, `Unequip`, `GetItemSlot`, `GetItemInSlot`
- `lootdropper` -- Methods: `FlingItem`
- `npc_talker` -- Properties: `default_chatpriority`; Methods: `Chatter`, `resetqueue`
- `friendlevels` -- Properties: `level`, `friendlytasks`, `queuedrewards`, `specifictaskreward`; Methods: `CompleteTask`, `DoRewards`, `GetLevel`, `GetMaxLevel`, `SetDefaultRewards`, `SetLevelRewards`, `SetFriendlyTasks`
- `craftingstation` -- Methods: `LearnItem`, `KnowsItem`
- `prototyper` -- Properties: `onactivate`, `onturnon`, `trees`
- `entitytracker` -- Methods: `TrackEntity`, `GetEntity`
- `weighable` (on items) -- Methods: `GetWeightPercent`, `GetWeight`
- `insulator` (on items) -- Methods: `GetInsulation`, `GetType`
- `equippable` (on items) -- Properties: `equipslot`, `isequipped`
- `edible` (on items) -- Properties: `foodtype`
- `container` -- Methods: `GetItemInSlot`, `GiveItem`
- `homeseeker` -- Properties: `home`
- `pearldecorationscore` (on home) -- Properties: `inst`
- `unwrappable` -- Methods: `WrapItems`
- `dryingrack` -- Methods: `GetContainer`
- `dryer` -- Properties: `product`
- `pickable` -- Methods: `IsBarren`
- `locomotor` -- Properties: `runspeed`, `walkspeed`; Methods: `Clear`
- `stuckdetection` -- Methods: `Reset`, `SetTimeToStuck`
- `oceanfishingrod` (on items) -- Checked via component existence
- `health` -- Methods: `IsDead`
- `inventoryitem` -- Methods: `IsHeldBy`
- `builder` -- Methods: `KnowsRecipe`
- `pointofinterest` -- Methods: `SetHeight`
- `eater` -- Methods: `SetDiet`, `SetCanEatHorrible`, `SetCanEatRaw`, `SetStrongStomach`
- `trader` -- Methods: `SetAcceptTest`, `SetOnAccept`; Properties: `onrefuse`, `deleteitemonaccept`
- `teleportedoverride` -- Methods: `SetDestPositionFn`
- `inspectable` -- Properties: `getstatus`
- `leader` -- Methods: `SetForceLeash`
- `petleash` -- Methods: `SetMaxPets`
- `sg` -- Methods: `HasStateTag`

**Tags:**
- `highfriendlevel` -- add/check
- `oceanfish` -- check
- `umbrella` -- check
- `mapscroll` -- check
- `uncomfortable_chair` -- check
- `irreplaceable` -- remove
- `hermitcrab_lure_marker` -- add
- `planted` -- check
- `character` -- add
- `trader` -- add
- `hermitcrab` -- add
- `NOBLOCK` -- add
- `NOCLICK` -- add
- `hermitcrab_marker` -- add
- `ignorewalkableplatforms` -- add
- `ignorewalkableplatformdrowning` -- add
- `hermitcrab_marker_fishing` -- add
## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |
## Main functions

## Events & listeners

**Listens to:**
- `home_upgraded` -- Triggers friendship task completion when the house is upgraded
- `CHEVO_growfrombutterfly` -- Checks for flower planting task completion
- `CHEVO_makechair` -- Checks for chair crafting task completion and gives blueprints
- `CHEVO_starteddrying` -- Checks for meat rack drying task completion
- `CHEVO_fertilized` -- Checks for berry bush planting task completion
- `CHEVO_heavyobject_winched` -- Checks for junk removal task completion
- `CHEVO_lureplantdied` -- Checks for lureplant removal task completion
- `friend_level_changed` -- Updates world meteor shower odds based on friend level
- `pearldecorationscore_evaluatescores` -- Triggers decoration comments based on score evaluation
- `ms_hermitcrab_relocated` -- Resets decoration comment tracking on relocation
- `timerdone` -- Stops fishing when the fishing timer completes
- `newfishingtarget` -- Sets hookfish flag when a fish is targeted
- `talkercolordirty` -- Updates talker color on client
- `friend_task_complete` -- Handles friend task completion
- `enterlimbo` -- Stops timers and resets state
- `exitlimbo` -- Restarts timers and talker queue
- `onsatinchair` -- Completes chair making task
- `dancingplayer` -- Handles player dancing event from world
- `moonfissurevent` -- Handles moon fissure event from world
- `onremove` -- Clears marker reference when marker is removed
- `clocksegschanged` -- Updates clock segments data
- `teleport_move` -- Removes comment data
- `teleported` -- Removes comment data
- `adopted_critter` -- Triggers OnAdoptCritter
- `critter_doemote` -- Triggers OnCritterEmote
- `newstate` -- Triggers OnNewState

**Pushes:**
- `use_pocket_scale` -- Pushed when a fish is weighed in OnAcceptItem
- `eat_food` -- Pushed when food is eaten in OnAcceptItem
- `dance` -- Pushed when a player dances nearby and friendship is high
- `enter_teashop` -- Pushed when the Hermit Crab enters the tea shop
- `ms_register_hermitcrab` -- Registers hermit crab instance with world
- `ms_register_pearl_entity` -- Registers pearl entity with world
- `ms_register_hermitcrab_marker` -- Registers hermit crab marker with world
