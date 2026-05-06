---
id: player_common
title: Player Common
description: Defines the core player character prefab factory with all standard components, lifecycle management functions, HUD and camera controls, seamless swapping, and event handlers for combat, environment, and audio systems.
tags: [player, lifecycle, hud, combat, network]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 5020c9a8
system_scope: player
---

# Player Common

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`player_common.lua` defines the Player Prefab factory function `MakePlayerCharacter` for creating player character entities in Don't Starve Together. The file contains a local `fns` table with helper functions that are attached to player instances during construction, along with configuration constants such as `DEFAULT_PLAYER_COLOUR`, `DANGER_ONEOF_TAGS`, and `DANGER_NOPIG_ONEOF_TAGS`, plus an external module reference `BEEFALO_COSTUMES` from `yotb_costumes`. This module is used by character-specific prefab files (e.g., `wilson.lua`) to create complete player entities with all standard components, lifecycle management, HUD interface controls, character swapping, ghost mode handling, and event listeners for environmental hazards, combat actions, audio cues, and visual effects. Character-specific variations are applied through postinit extensions that build upon this shared base.

## Usage example
```lua
-- This file is used by character prefab files to create player entities
-- Example from wilson.lua:
return MakePlayerCharacter("wilson", customprefabs, customassets, common_postinit, master_postinit)

-- The functions defined in this file are attached to player instances:
local player = ThePlayer

-- Check if player is near danger (hounded waves)
local is_dangerous = player:IsNearDanger(true)

-- Enable/disable boat camera for player
player:EnableBoatCamera(true)

-- Enable loading protection during transitions
player:EnableLoadingProtection()

-- Call component functions on a player entity
player.components.health:SetMaxHealth(150)
player.components.sanity:SetMax(200)
```

## Dependencies & tags
**External dependencies:**
- `easing` -- used for camera shake falloff calculations
- `screens/playerhud` -- PlayerHud screen class for HUD activation
- `prefabs/player_common_extensions` -- ex_fns table with extended player functions
- `prefabs/skilltree_defs` -- skill tree definitions
- `util/sourcemodifierlist` -- SourceModifierList for camera distance bonuses
- `yotb_costumes` -- BEEFALO_COSTUMES table for Year of the Beefalo event

**Components used:**
- `health` -- manages health, invincibility, and penalty tracking
- `sanity` -- manages sanity state and lunacy enabling
- `inventory` -- manages item storage, equipping, and dropping
- `locomotor` -- manages movement, strafing, and prediction
- `combat` -- manages attack behavior and damage
- `burnable` -- manages burning and smoldering states
- `temperature` -- manages temperature state
- `moisture` -- manages wetness state
- `talker` -- manages speech and talker offset
- `frostybreather` -- manages frosty breath visual offset
- `player_classified` -- networked classified component for player state
- `debuffable` -- manages debuff application and removal
- `seamlessplayerswapper` -- manages character transformation swapping
- `attuner` -- manages attunement to resurrectors
- `leader` -- manages follower relationships
- `petleash` -- manages pet spawning and despawning
- `maprevealable` -- manages minimap icon and reveal
- `grogginess` -- manages grogginess speed modifiers
- `sandstormwatcher` -- manages sandstorm speed modifiers
- `moonstormwatcher` -- manages moonstorm speed modifiers
- `miasmawatcher` -- manages miasma speed modifiers
- `carefulwalker` -- manages careful walking speed modifiers
- `channelcaster` -- manages channel casting state
- `skinner` -- manages character skin modes
- `rider` -- manages mounting and dismounting
- `age` -- manages player age tracking
- `builder` -- manages recipe learning and building
- `trader` -- manages item acceptance and trading
- `playervision` -- manages night vision and colour cubes
- `areaaware` -- manages area tile watching
- `playerspeedmult` -- manages speed multipliers
- `embarker` -- manages embarkation speed
- `boatcannonuser` -- manages boat cannon classified reference
- `hudindicatable` -- manages HUD indicator tracking function
- `spawnfader` -- manages spawn fade effects
- `revivablecorpse` -- manages corpse revival (game mode dependent)
- `touchstonetracker` -- manages touchstone usage tracking
- `drownable` -- manages drowning state
- `sheltered` -- manages shelter state
- `stormwatcher` -- manages storm watching
- `acidlevel` -- manages acid level
- `bloomer` -- manages bloom effects
- `colouradder` -- manages colour effects
- `birdattractor` -- manages bird attraction
- `wisecracker` -- manages wisecrack dialogue
- `distancetracker` -- manages distance tracking
- `catcher` -- manages catching behavior
- `playerlightningtarget` -- manages lightning targeting
- `eater` -- manages eating behavior (game mode dependent)
- `foodaffinity` -- manages food affinity
- `grue` -- manages grue sounds
- `pinnable` -- manages pinnable state
- `workmultiplier` -- manages work speed multipliers
- `slipperyfeet` -- manages slippery feet behavior
- `sleepingbaguser` -- manages sleeping bag usage
- `colourtweener` -- manages colour tweening
- `cursable` -- manages curse application
- `stageactor` -- manages stage acting
- `experiencecollector` -- manages experience collection
- `joustuser` -- manages jousting behavior
- `luckuser` -- manages luck-based events
- `aura` -- manages aura effects
- `playeravatardata` -- manages avatar data
- `constructionbuilderuidata` -- manages construction builder UI data
- `inkable` -- manages ink effects
- `cookbookupdater` -- manages cookbook updates
- `plantregistryupdater` -- manages plant registry updates
- `skilltreeupdater` -- manages skill tree updates
- `walkableplatformplayer` -- manages walkable platform behavior
- `spellbookcooldowns` -- manages spellbook cooldowns
- `avengingghost` -- manages avenging ghost behavior
- `ghostlyelixirable` -- manages ghostly elixir behavior
- `healthsyncer` -- manages health sync (Lava Arena mode)
- `playerinspectable` -- manages player inspection popup
- `damagetyperesist` -- manages damage type resistance
- `damagetypebonus` -- manages damage type bonuses
- `planardamage` -- manages planar damage
- `planardefense` -- manages planar defense
- `wintertreegiftable` -- manages winter tree gifting (Winter's Feast event)
- `spooked` -- manages spooked state (Hallowed Nights event)
- `spectatorcorpse` -- manages spectator corpse (game mode dependent)
- `hudindicatorwatcher` -- manages HUD indicator watching
- `playerhearing` -- manages player hearing
- `raindomewatcher` -- manages rain dome watching
- `strafer` -- manages strafing behavior
- `vaultmusiclistener` -- manages vault music listening (caves)
- `playercontroller` -- manages player controller
- `playeractionpicker` -- manages player action picking
- `playervoter` -- manages player voting
- `playermetrics` -- manages player metrics

**Tags:**
- `player` -- added on entity creation
- `scarytoprey` -- added on entity creation
- `character` -- added on entity creation
- `lightningtarget` -- added on entity creation
- `waterplant_upgradeuser` -- added on entity creation
- `mast_upgradeuser` -- added on entity creation
- `chest_upgradeuser` -- added on entity creation
- `usesvegetarianequipment` -- added on entity creation
- `ghostlyelixirable` -- added on entity creation
- `trader` -- added in pristine state
- `debuffable` -- added in pristine state
- `stageactor` -- added in pristine state
- `_health` -- added/removed for replication optimization
- `_hunger` -- added/removed for replication optimization
- `_sanity` -- added/removed for replication optimization
- `_builder` -- added/removed for replication optimization
- `_combat` -- added/removed for replication optimization
- `_moisture` -- added/removed for replication optimization
- `_sheltered` -- added/removed for replication optimization
- `_rider` -- added/removed for replication optimization
- `notarget` -- added during loading protection
- `spawnprotection` -- added during loading protection
- `player_<userid>` -- added when user ID is assigned
- `globalmapicon_player` -- set via maprevealable component
- `noplayerindicator` -- checked for HUD tracking
- `hiding` -- checked for HUD tracking
- `monster` -- checked for danger detection
- `pig` -- checked for danger detection
- `companion` -- checked for danger detection
- `shadowcreature` -- checked for danger detection
- `prey` -- checked for battle cry strings
- `hostile` -- checked for battle cry strings
- `werepig` -- checked for battle cry strings
- `playerghost` -- checked for ghost mode and status
- `reviver` -- checked for revival items
- `noreviverhealthpenalty` -- checked for revival penalty
- `stronggrip` -- checked for wet tool dropping
- `stickygrip` -- checked for wet tool dropping
- `frozen` -- checked for fire melt events
- `structure` -- checked for fire starting
- `wildfireprotected` -- checked for fire starting
- `teeteringplatform` -- checked for teetering state
- `lunacyarea` -- checked for lunacy enabling
- `umbrella` -- checked for umbrella replacement
- `cave` -- checked for vault music listener
- `multiplayer_portal` -- checked for teleport on load
- `flying` -- checked for pet spawn effects
- `irreplaceable` -- checked for despawn dropping
- `NOCLICK` -- added during spawn fading
- `spiderwhisperer` -- checked for spider danger
- `spiderdisguise` -- checked for spider danger
- `spider` -- checked for spider danger
- `ghost` -- checked for aura damage
- `noauradamage` -- checked for aura damage
- `flying` -- checked for pet spawn effects
- `bedroll` -- checked for sleeping state
- `tent` -- checked for sleeping state

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `USE_MOVEMENT_PREDICTION` | boolean | `true` | Flag enabling movement prediction on clients |
| `DEFAULT_PLAYER_COLOUR` | table | `{1, 1, 1, 1}` | Default RGBA colour table for players |
| `DANGER_ONEOF_TAGS` | table | `{"monster", "pig", "_combat"}` | Tags used for danger detection |
| `DANGER_NOPIG_ONEOF_TAGS` | table | `{"monster", "_combat"}` | Tags for danger detection excluding pigs |
| `TALLER_TALKER_OFFSET` | Vector3 | `Vector3(0, -700, 0)` | Offset for taller character talkers (riding/ghost) |
| `DEFAULT_TALKER_OFFSET` | Vector3 | `Vector3(0, -400, 0)` | Offset for default talkers |
| `TALLER_FROSTYBREATHER_OFFSET` | Vector3 | `Vector3(.3, 3.75, 0)` | Offset for taller frosty breather (riding) |
| `DEFAULT_FROSTYBREATHER_OFFSET` | Vector3 | `Vector3(.3, 1.15, 0)` | Offset for default frosty breather |
| `BEEFALO_COSTUMES` | table | — | Table of Year of the Beefalo costume data from yotb_costumes |
| `max_range` | number | `TUNING.MAX_INDICATOR_RANGE * 1.5` | Maximum range for player indicator tracking |
| `BLACKOUT_COLOURCUBES` | table | — | Colour cube paths for blackout vision effect |
| `inst.playercolour` | table | `DEFAULT_PLAYER_COLOUR` | Player colour used if not set properly |
| `inst.ghostenabled` | boolean | `GetGhostEnabled()` | Whether ghost mode is enabled for this player |
| `inst.userid` | string | `""` | User ID assigned on ownership |
| `inst.name` | string | — | Player name from Network |
| `inst.isplayer` | boolean | `true` | Flag marking entity as a player |
| `inst.jointask` | task | — | Task for OnPlayerJoined callback |
| `inst.activatetask` | task | — | Task for ActivatePlayer callback |
| `inst._scalesource` | table | `nil` | Table tracking transform scale modifiers by source |
| `inst._animscalesource` | table | `nil` | Table tracking animation scale modifiers by source |
| `inst.cameradistancebonuses` | SourceModifierList | — | SourceModifierList for camera distance bonuses |
| `inst._isrezattuned` | boolean | — | Whether player is attuned to resurrector |
| `inst._sleepinghandsitem` | entity | `nil` | Temporarily unequipped hand item during sleep |
| `inst._sleepingactiveitem` | entity | `nil` | Temporarily hidden active item during sleep |
| `inst.last_death_position` | Vector3 | `nil` | Position where player last died |
| `inst.last_death_shardid` | string | `nil` | Shard ID where player last died |
| `inst.hasRevivedPlayer` | boolean | — | Whether player has revived another player |
| `inst.hasKilledPlayer` | boolean | — | Whether player has killed another player |
| `inst.hasAttackedPlayer` | boolean | — | Whether player has attacked another player |
| `inst.hasStartedFire` | boolean | — | Whether player has started a fire |
| `inst.migration` | table | `nil` | Migration data for shard transfers |
| `inst.migrationpets` | table | `nil` | Pets to migrate with player |
| `inst.wormlight` | entity | `nil` | Wormlight spell entity |
| `inst.HUD` | screen | — | Player HUD screen instance |
| `inst.player_classified` | entity | — | Classified component entity for networked state |
| `inst.ondetachclassified` | function | — | Callback for classified detachment |
| `inst._serverpauseddirtyfn` | function | — | Callback for server pause state changes |
| `inst._sharksoundparam` | net_float | — | Networked shark sound parameter |
| `inst._winters_feast_music` | net_event | — | Networked Winter's Feast music event |
| `inst._hermit_music` | net_event | — | Networked Hermit music event |
| `inst._underleafcanopy` | net_bool | — | Networked canopy zone state |
| `inst._lunarportalmax` | net_event | — | Networked lunar portal max event |
| `inst._shadowportalmax` | net_event | — | Networked shadow portal max event |
| `inst._skilltreeactivatedany` | net_event | — | Networked skill tree activation event |
| `inst._wormdigestionsound` | net_bool | — | Networked worm digestion sound state |
| `inst._parasiteoverlay` | net_bool | — | Networked parasite overlay state |
| `inst._blackout` | net_bool | — | Networked blackout vision state |
| `inst._buffsymbol` | net_hash | — | Networked health bar buff symbol |
| `inst._piratemusicstate` | net_bool | — | Networked pirate music state |
| `inst.yotb_skins_sets` | net_shortint | — | Networked YOTB skin set unlocks |
| `inst.skeleton_prefab` | string | `"skeleton_player"` | Prefab name for player skeleton |
| `inst.footstepoverridefn` | function | `ex_fns.FootstepOverrideFn` | Footstep sound override function |
| `inst.foleyoverridefn` | function | `ex_fns.FoleyOverrideFn` | Foley sound override function |
| `inst.foleysound` | string | `nil` | Character-specific foley sound |
| `inst.overrideskinmode` | string | `"normal_skin"` | Override skin mode for character states |
| `inst.overrideskinmodebuild` | string | — | Override skin mode build |
| `inst.deathclientobj` | table | `nil` | Death client object for networked death |
| `inst.deathcause` | string | `nil` | Cause of player death |
| `inst.deathpkname` | string | `nil` | Name of killer if killed by player |
| `inst.deathbypet` | boolean | `nil` | Whether death was caused by pet |
| `inst.isseamlessswapsource` | boolean | `nil` | Flag for seamless swap source player |
| `inst.isseamlessswaptarget` | boolean | `nil` | Flag for seamless swap target player |
| `inst.delayclientdespawn` | boolean | `nil` | Flag to delay client despawn during swap |
| `inst.delayclientdespawn_attempted` | boolean | `nil` | Flag marking despawn attempt on host |
| `inst.loadingprotection` | boolean | `nil` | Flag for loading protection state |
| `inst._PICKUPSOUNDS` | table | `PICKUPSOUNDS` | Deprecated pickup sounds table for mods |
| `inst.PostActivateHandshake` | function | `ex_fns.PostActivateHandshake` | Post-activation handshake function |
| `inst.OnPostActivateHandshake_Client` | function | `ex_fns.OnPostActivateHandshake_Client` | Client post-activation callback |
| `inst.OnPostActivateHandshake_Server` | function | `ex_fns.OnPostActivateHandshake_Server` | Server post-activation callback |
| `inst._PostActivateHandshakeState_Client` | number | `POSTACTIVATEHANDSHAKE.NONE` | Client handshake state |
| `inst._PostActivateHandshakeState_Server` | number | `POSTACTIVATEHANDSHAKE.NONE` | Server handshake state |
| `inst.SetClientAuthoritativeSetting` | function | `ex_fns.SetClientAuthoritativeSetting` | Sets client authoritative setting |
| `inst.SynchronizeOneClientAuthoritativeSetting` | function | `ex_fns.SynchronizeOneClientAuthoritativeSetting` | Synchronizes single client setting |
| `inst.ApplySkinOverrides` | function | `ApplySkinOverrides` | Applies skin mode overrides |
| `inst.SaveForReroll` | function | `SaveForReroll` | Saves data for character reroll |
| `inst.LoadForReroll` | function | `LoadForReroll` | Loads data for character reroll |
| `inst.OnSleepIn` | function | `OnSleepIn` | Callback when sleeping in bedroll/tent |
| `inst.OnWakeUp` | function | `OnWakeUp` | Callback when waking up |
| `inst._OnSave` | function | `OnSave` | Internal save callback (assigned from original OnSave) |
| `inst._OnPreLoad` | function | `OnPreLoad` | Internal pre-load callback (assigned from original OnPreLoad) |
| `inst._OnLoad` | function | `OnLoad` | Internal load callback (assigned from original OnLoad) |
| `inst._OnNewSpawn` | function | `OnNewSpawn` | Internal new spawn callback (assigned from original OnNewSpawn) |
| `inst._OnDespawn` | function | `OnDespawn` | Internal despawn callback (assigned from original OnDespawn) |
| `inst.OnSave` | function | `OnSave` | Overridden save function |
| `inst.OnPreLoad` | function | `OnPreLoad` | Overridden pre-load function |
| `inst.OnLoad` | function | `OnLoad` | Overridden load function |
| `inst.OnNewSpawn` | function | `OnNewSpawn` | Overridden new spawn function |
| `inst.OnDespawn` | function | `OnDespawn` | Overridden despawn function |
| `inst.ChangeToMonkey` | function | `ChangeToMonkey` | Transform to monkey character |
| `inst.ChangeFromMonkey` | function | `ChangeBackFromMonkey` | Transform back from monkey character |
| `inst.IsActing` | function | `ex_fns.IsActing` | Check if player is acting on stage |
| `inst.EnableLoadingProtection` | function | `fns.EnableLoadingProtection` | Enable loading protection |
| `inst.DisableLoadingProtection` | function | `fns.DisableLoadingProtection` | Disable loading protection |
| `inst.AttachClassified` | function | `AttachClassified` | Attach classified component |
| `inst.DetachClassified` | function | `DetachClassified` | Detach classified component |
| `inst.OnRemoveEntity` | function | `OnRemoveEntity` | Entity removal callback |
| `inst.CanExamine` | function | `nil` | Can be overridden for examination |
| `inst.ActionStringOverride` | function | `nil` | Can be overridden for action strings |
| `inst.CanUseTouchStone` | function | `CanUseTouchStone` | Check touchstone usability |
| `inst.GetTemperature` | function | `GetTemperature` | Get current temperature |
| `inst.IsFreezing` | function | `IsFreezing` | Check if freezing |
| `inst.IsOverheating` | function | `IsOverheating` | Check if overheating |
| `inst.GetMoisture` | function | `GetMoisture` | Get current moisture |
| `inst.GetMaxMoisture` | function | `GetMaxMoisture` | Get max moisture |
| `inst.GetMoistureRateScale` | function | `GetMoistureRateScale` | Get moisture rate scale |
| `inst.GetStormLevel` | function | `GetStormLevel` | Get storm level |
| `inst.IsInMiasma` | function | `fns.IsInMiasma` | Check if in miasma |
| `inst.IsInAnyStormOrCloud` | function | `fns.IsInAnyStormOrCloud` | Check if in storm or cloud |
| `inst.IsCarefulWalking` | function | `IsCarefulWalking` | Check if careful walking |
| `inst.IsChannelCasting` | function | `fns.IsChannelCasting` | Check if channel casting |
| `inst.IsChannelCastingItem` | function | `fns.IsChannelCastingItem` | Check if channel casting item |
| `inst.IsTeetering` | function | `fns.IsTeetering` | Check if teetering |
| `inst.EnableMovementPrediction` | function | `EnableMovementPrediction` | Enable/disable movement prediction |
| `inst.EnableBoatCamera` | function | `fns.EnableBoatCamera` | Enable/disable boat camera |
| `inst.EnableTargetLocking` | function | `ex_fns.EnableTargetLocking` | Enable target locking |
| `inst.ShakeCamera` | function | `fns.ShakeCamera` | Shake camera effect |
| `inst.SetGhostMode` | function | `SetGhostMode` | Set ghost mode state |
| `inst.IsActionsVisible` | function | `IsActionsVisible` | Check if actions visible |
| `inst.CanSeeTileOnMiniMap` | function | `ex_fns.CanSeeTileOnMiniMap` | Check tile visibility on minimap |
| `inst.CanSeePointOnMiniMap` | function | `ex_fns.CanSeePointOnMiniMap` | Check point visibility on minimap |
| `inst.GetSeeableTilePercent` | function | `ex_fns.GetSeeableTilePercent` | Get seeable tile percentage |
| `inst.MakeGenericCommander` | function | `ex_fns.MakeGenericCommander` | Make generic commander |
| `inst.CommandWheelAllowsGameplay` | function | `ex_fns.CommandWheelAllowsGameplay` | Check command wheel gameplay |
| `inst.IsHUDVisible` | function | `fns.IsHUDVisible` | Check if HUD visible |
| `inst.ShowActions` | function | `fns.ShowActions` | Show/hide actions |
| `inst.ShowCrafting` | function | `fns.ShowCrafting` | Show/hide crafting UI |
| `inst.ShowHUD` | function | `fns.ShowHUD` | Show/hide HUD |
| `inst.ShowPopUp` | function | `fns.ShowPopUp` | Show/hide popup |
| `inst.ResetMinimapOffset` | function | `fns.ResetMinimapOffset` | Reset minimap offset |
| `inst.CloseMinimap` | function | `fns.CloseMinimap` | Close minimap |
| `inst.SetCameraDistance` | function | `fns.SetCameraDistance` | Set camera distance |
| `inst.AddCameraExtraDistance` | function | `fns.AddCameraExtraDistance` | Add camera distance bonus |
| `inst.RemoveCameraExtraDistance` | function | `fns.RemoveCameraExtraDistance` | Remove camera distance bonus |
| `inst.SetCameraZoomed` | function | `fns.SetCameraZoomed` | Set camera zoomed state |
| `inst.SetAerialCamera` | function | `fns.SetAerialCamera` | Set aerial camera mode |
| `inst.SnapCamera` | function | `fns.SnapCamera` | Snap camera to default |
| `inst.ScreenFade` | function | `fns.ScreenFade` | Screen fade effect |
| `inst.ScreenFlash` | function | `fns.ScreenFlash` | Screen flash effect |
| `inst.SetBathingPoolCamera` | function | `fns.SetBathingPoolCamera` | Set bathing pool camera target |
| `inst.YOTB_unlockskinset` | function | `fns.YOTB_unlockskinset` | Unlock YOTB skin set |
| `inst.YOTB_issetunlocked` | function | `fns.YOTB_issetunlocked` | Check YOTB skin set unlocked |
| `inst.YOTB_isskinunlocked` | function | `fns.YOTB_isskinunlocked` | Check YOTB skin unlocked |
| `inst.IsNearDanger` | function | `fns.IsNearDanger` | Check if near danger |
| `inst.SetGymStartState` | function | `fns.SetGymStartState` | Set gym start state |
| `inst.SetGymStopState` | function | `fns.SetGymStopState` | Set gym stop state |
| `inst.SwapAllCharacteristics` | function | `fns.SwapAllCharacteristics` | Swap characteristics to new instance |
| `inst.ApplyScale` | function | `fns.ApplyScale` | Apply transform scale |
| `inst.ApplyAnimScale` | function | `fns.ApplyAnimScale` | Apply animation scale |
| `inst.TargetForceAttackOnly` | function | `fns.TargetForceAttackOnly` | Check if target requires force attack |
| `inst.additional_OnFollowerRemoved` | function | `nil` | Additional follower removed callback |
| `inst.additional_OnFollowerAdded` | function | `nil` | Additional follower added callback |
| `inst.CustomSetSkinMode` | function | `nil` | Custom skin mode setter (Wurt) |
| `inst.starting_inventory` | table | `nil` | Starting inventory items |

## Main functions

### `IsNearDanger(inst, hounded_ok)`
* **Description:** Checks if the player is near dangerous entities or conditions including hounds, burning/smoldering state, hostile monsters, pigs, and shadow creatures when sane. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance to check for nearby danger
  - `hounded_ok` -- Boolean indicating whether hound attacks should be ignored in danger calculation
* **Returns:** boolean -- true if danger is detected, false otherwise

### `TargetForceAttackOnly(inst, target)`
* **Description:** Determines if mouseover Attack command should be hidden unless Force Attacking, specifically for shadow creatures that are not hostile to the player. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `target` -- Target entity to test for force attack requirement
* **Returns:** boolean -- true if target should only be attackable via force attack

### `SetGymStartState(inst)`
* **Description:** Configures player entity for gym mode by setting no-faced transform, hiding inventory, closing popups, and showing actions. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance entering gym state
* **Returns:** None

### `SetGymStopState(inst)`
* **Description:** Restores player entity from gym mode by setting four-faced transform, showing inventory, and showing actions. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance leaving gym state
* **Returns:** None

### `YOTB_unlockskinset(inst, skinset)`
* **Description:** Unlocks a YOTB (Year of the Beefalo) skin set for the player if the event is active, sets the skin bit, announces the pattern, and pushes learn blueprint event. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `skinset` -- Skin set identifier to unlock
* **Returns:** None

### `YOTB_issetunlocked(inst, skinset)`
* **Description:** Checks if a specific YOTB skin set is unlocked for the player during the event. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `skinset` -- Skin set identifier to check
* **Returns:** boolean or nil -- true if the skin set bit matches, nil if YOTB event is not active

### `YOTB_isskinunlocked(inst, skin)`
* **Description:** Checks if a specific YOTB skin is unlocked by iterating through costume sets and checking set unlock status. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `skin` -- Specific skin identifier to check
* **Returns:** boolean or nil -- true if skin is found in an unlocked set, nil if YOTB event is not active

### `YOTB_getrandomset(inst)`
* **Description:** Assigns a random YOTB skin set to the player if no sets are currently unlocked. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** None

### `IsInMiasma(inst)`
* **Description:** Checks if the player is currently in a miasma cloud. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean or nil -- true if condition is met, nil if player_classified is not available

### `IsInAnyStormOrCloud(inst)`
* **Description:** Checks if the player is in any storm (sandstorm at full level) or miasma cloud. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean or nil -- true if condition is met, nil if player_classified is not available

### `IsChannelCasting(inst)`
* **Description:** Checks if the player is currently channel casting. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean or nil -- true if condition is met, nil if player_classified is not available

### `IsChannelCastingItem(inst)`
* **Description:** Checks if the player is currently channel casting an item. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean or nil -- true if condition is met, nil if player_classified is not available

### `OnStartChannelCastingItem(inst, item)`
* **Description:** Internal callback applied when starting channel casting, adjusting grogginess, sandstorm, moonstorm, miasma, and careful walking multipliers, then starts strafing. Returns early if item has channelcastable component with strafing enabled. Registered as channelcaster component callback.
* **Parameters:**
  - `inst` -- Player entity instance
  - `item` -- Item being channel cast
* **Returns:** None
* **Error states:** None

### `OnStopChannelCastingItem(inst)`
* **Description:** Internal callback to restore default speed modifiers when stopping channel casting and stops strafing. Registered as channelcaster component callback.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** None

### `IsTeetering(inst)`
* **Description:** Checks if the player is standing on a teetering platform. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean -- true if current platform has teeteringplatform tag

### `OnChangeArea(inst, area)`
* **Description:** Enables or disables lunacy based on whether the area has lunacyarea tag. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `area` -- Area entity with tags
* **Returns:** None

### `OnAlterNight(inst)`
* **Description:** Enables lunacy during alter night when both night and alterawake world states are active. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** None

### `OnStormLevelChanged(inst, data)`
* **Description:** Enables lunacy when moonstorm is active with level greater than 0. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Storm level change data with stormtype and level
* **Returns:** None

### `OnRiftMoonTile(inst, on_rift_moon)`
* **Description:** Enables lunacy when player is on rift moon tile. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `on_rift_moon` -- Boolean indicating if on rift moon tile
* **Returns:** None

### `OnFullMoonEnlightenment(inst, isfullmoon)`
* **Description:** Enables lunacy during full moon if lunar rifts are enabled via riftspawner component. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `isfullmoon` -- Boolean indicating if it is full moon
* **Returns:** None

### `OnItemRanOut(inst, data)`
* **Description:** Internal callback to auto-equip a replacement tool if the equipped item ran out and a matching item exists in inventory. Registered as itemranout event listener.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Item expiry data with equipslot and prefab
* **Returns:** None

### `OnUmbrellaRanOut(inst, data)`
* **Description:** Internal callback to auto-equip a replacement umbrella if the equipped umbrella ran out and another umbrella exists in inventory. Registered as umbrellaranout event listener.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Umbrella expiry data with equipslot
* **Returns:** None

### `ArmorBroke(inst, data)`
* **Description:** Internal callback to auto-equip a replacement armor if the equipped armor broke and a matching armor exists in inventory, respecting keeponfinished flag. Registered as armorbroke event listener.
* **Parameters:**
  - `inst` -- Player entity instance
  - `data` -- Armor break data with armor reference
* **Returns:** None

### `EnableBoatCamera(inst, enable)`
* **Description:** Pushes enableboatcamera event with enable state. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Entity instance
  - `enable` -- Boolean to enable or disable boat camera
* **Returns:** None

### `CommonSeamlessPlayerSwap(inst)`
* **Description:** Clears name and userid, removes player components if present, and pushes seamlessplayerswap event. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Entity instance being swapped
* **Returns:** None

### `CommonSeamlessPlayerSwapTarget(inst)`
* **Description:** Pushes seamlessplayerswaptarget event. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Entity instance that is swap target
* **Returns:** None

### `LocalSeamlessPlayerSwap(inst)`
* **Description:** Calls CommonSeamlessPlayerSwap, sets isseamlessswapsource flag, and enables delayclientdespawn flags. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Local entity instance being swapped
* **Returns:** None

### `LocalSeamlessPlayerSwapTarget(inst)`
* **Description:** Calls CommonSeamlessPlayerSwapTarget and sets isseamlessswaptarget flag. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Local entity instance that is swap target
* **Returns:** None

### `MasterSeamlessPlayerSwap(inst)`
* **Description:** Calls CommonSeamlessPlayerSwap and schedules entity removal after network tick changes to ensure client receives new spawn first. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Master simulation entity instance being swapped
* **Returns:** None

### `MasterSeamlessPlayerSwapTarget(inst)`
* **Description:** Calls CommonSeamlessPlayerSwapTarget. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Master simulation entity instance that is swap target
* **Returns:** None

### `EnableLoadingProtection(inst)`
* **Description:** Sets loadingprotection flag, adds notarget and spawnprotection tags, sets health invincible, and disables physics. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Entity instance to protect
* **Returns:** None

### `DisableLoadingProtection(inst)`
* **Description:** Clears loadingprotection flag, enables physics immediately, and schedules removal of notarget/spawnprotection tags and invincibility after 1.5 seconds. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Entity instance to remove protection from
* **Returns:** None

### `IsHUDVisible(inst)`
* **Description:** Returns whether the HUD is visible via player_classified netvar. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** boolean -- value of ishudvisible netvar
* **Error states:** Errors if inst.player_classified is nil (direct member access on nil with no guard)

### `ShowActions(inst, show)`
* **Description:** Shows or hides action buttons. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `show` -- boolean -- whether to show actions
* **Returns:** None

### `ShowCrafting(inst, show)`
* **Description:** Shows or hides crafting UI. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `show` -- boolean -- whether to show crafting UI
* **Returns:** None

### `ShowHUD(inst, show)`
* **Description:** Shows or hides the player HUD. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `show` -- boolean -- whether to show HUD
* **Returns:** None

### `ShowPopUp(inst, popup, show, ...)`
* **Description:** Shows a popup dialog to the client via RPC. Only executes on master sim when userid exists. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `popup` -- Popup table with code and mod_name fields
  - `show` -- boolean -- whether to show popup
  - `...` -- Additional arguments passed to RPC
* **Returns:** None

### `ResetMinimapOffset(inst)`
* **Description:** Forces minimap center netvar to be dirty. Should only be used when necessary. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** None

### `CloseMinimap(inst)`
* **Description:** Forces minimap close netvar to be dirty. Should only be used when necessary. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
* **Returns:** None

### `SetCameraDistance(inst, distance)`
* **Description:** Sets the camera distance via netvar. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `distance` -- number -- camera distance value, defaults to 0 if nil
* **Returns:** None

### `AddCameraExtraDistance(inst, source, distance, key)`
* **Description:** Adds a camera distance bonus modifier. Updates cameraextramaxdist netvar. Only executes on master sim when cameradistancebonuses exists. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `source` -- string -- source identifier for the modifier
  - `distance` -- number -- distance value to add
  - `key` -- string -- key for the modifier
* **Returns:** None

### `RemoveCameraExtraDistance(inst, source, key)`
* **Description:** Removes a camera distance bonus modifier. Updates cameraextramaxdist netvar. Only executes on master sim when cameradistancebonuses exists. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `source` -- string -- source identifier for the modifier
  - `key` -- string -- key for the modifier
* **Returns:** None

### `SetCameraZoomed(inst, iszoomed)`
* **Description:** Sets the camera zoomed state via netvar. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `iszoomed` -- boolean -- whether camera is zoomed
* **Returns:** None

### `SetAerialCamera(inst, isaerial)`
* **Description:** Sets the aerial camera mode via netvar. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `isaerial` -- boolean -- whether camera is in aerial mode
* **Returns:** None

### `SnapCamera(inst, resetrot)`
* **Description:** Snaps the camera by forcing camerasnap netvar to be dirty. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `resetrot` -- boolean -- whether to reset rotation
* **Returns:** None

### `ShakeCamera(inst, mode, duration, speed, scale, source_or_pt, maxDist)`
* **Description:** Shakes the camera with normalized values for network transmission. Applies distance-based falloff if source_or_pt and maxDist provided. Only executes shake on master sim, applies to TheCamera on client. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `mode` -- number -- shake mode identifier
  - `duration` -- number -- shake duration in seconds
  - `speed` -- number -- shake speed
  - `scale` -- number -- shake scale/intensity
  - `source_or_pt` -- entity or Vector3 -- source entity or position for distance calculation
  - `maxDist` -- number -- maximum distance for falloff calculation
* **Returns:** None

### `ScreenFade(inst, isfadein, time, iswhite)`
* **Description:** Triggers screen fade effect via netvars. Time is normalized for net_smallbyte with iswhite flag encoded. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `isfadein` -- boolean -- whether this is a fade in
  - `time` -- number -- fade duration, truncated to max 31
  - `iswhite` -- boolean -- whether fade is white (adds 32 to time value)
* **Returns:** None

### `ScreenFlash(inst, intensity)`
* **Description:** Triggers screen flash effect via netvar. Normalizes intensity for net_tinybyte. Pushes screenflash event if HUD exists. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `intensity` -- number -- flash intensity, normalized to 0-7 range
* **Returns:** None

### `SetBathingPoolCamera(inst, target)`
* **Description:** Sets the bathing pool camera target. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `target` -- entity -- target entity for bathing pool camera
* **Returns:** None

### `ApplyScale(inst, source, scale)`
* **Description:** Applies or removes transform scale from a source. Maintains _scalesource table for multiple sources and calculates cumulative scale. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `source` -- string -- source identifier for the scale modifier
  - `scale` -- number -- scale multiplier, 1 means no change
* **Returns:** None

### `ApplyAnimScale(inst, source, scale)`
* **Description:** Applies or removes animation state scale from a source. Maintains _animscalesource table for multiple sources and calculates cumulative scale. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `source` -- string -- source identifier for the anim scale modifier
  - `scale` -- number -- scale multiplier, 1 means no change
* **Returns:** None

### `OnDebuffAdded(inst, name, debuff)`
* **Description:** Internal callback called when a debuff is added. Sets buff symbol if debuff name is elixir_buff. Registered as debuffable component ondebuffadded handler.
* **Parameters:**
  - `inst` -- Player entity instance
  - `name` -- string -- debuff name
  - `debuff` -- table -- debuff data with prefab field
* **Returns:** None

### `OnDebuffRemoved(inst, name, debuff)`
* **Description:** Internal callback called when a debuff is removed. Clears buff symbol if debuff name is elixir_buff. Registered as debuffable component ondebuffremoved handler.
* **Parameters:**
  - `inst` -- Player entity instance
  - `name` -- string -- debuff name
  - `debuff` -- table -- debuff data
* **Returns:** None

### `SetSymbol(inst, symbol)`
* **Description:** Sets the buff symbol netvar if value changed. Only executes on master sim. Available on player entity instances created by this prefab.
* **Parameters:**
  - `inst` -- Player entity instance
  - `symbol` -- string or number -- symbol identifier
* **Returns:** None

### `SetInstanceFunctions(inst)`
* **Description:** Attaches various helper functions to the player instance for movement, camera, visibility, and state checks. Broken out separately due to Lua upvalue limits.
* **Parameters:**
  - `inst` -- Entity - The player instance to attach functions to
* **Returns:** None

### `ShouldTrackfn(inst, viewer)`
* **Description:** Determines if a player should be tracked by HUD indicators based on validity, tags, distance, frustum check, and line of sight.
* **Parameters:**
  - `inst` -- Entity - The entity being tracked
  - `viewer` -- Entity - The viewer entity checking visibility
* **Returns:** boolean - true if should track, false otherwise

### `OnChangeCanopyZone(inst, underleaves)`
* **Description:** Callback that updates the networked _underleafcanopy variable when canopy zone changes.
* **Parameters:**
  - `inst` -- Entity - The player instance
  - `underleaves` -- boolean - Whether player is under leaf canopy
* **Returns:** None

### `OnResetBeard(inst, ismonkey)`
* **Description:** Resets beard component bits based on monkey transformation state (0 for monkey, 3 for normal).
* **Parameters:**
  - `inst` -- Entity - The player instance
  - `ismonkey` -- boolean - Whether player is in monkey form
* **Returns:** None

### `SwapAllCharacteristics(inst, newinst)`
* **Description:** Transfers all components with TransferComponent method to new instance, copies death data if dead, and teleports new instance to source position. Used for monkey transformation.
* **Parameters:**
  - `inst` -- Entity - The source player instance
  - `newinst` -- Entity - The target player instance to transfer to
* **Returns:** None
* **Error states:** Errors if inst.components.health is nil when checking IsDead()

### `ChangeToMonkey(inst)`
* **Description:** Triggers monkey transformation via seamlessplayerswapper component if available.
* **Parameters:**
  - `inst` -- Entity - The player instance to transform
* **Returns:** None

### `ChangeBackFromMonkey(inst)`
* **Description:** Triggers transformation back to main character via seamlessplayerswapper component if available.
* **Parameters:**
  - `inst` -- Entity - The monkey instance to transform back
* **Returns:** None

### `OnPirateMusicStateDirty(inst)`
* **Description:** Pushes playpiratesmusic event to ThePlayer when pirate music state changes.
* **Parameters:**
  - `inst` -- Entity - The player instance
* **Returns:** None

### `onfinishseamlessplayerswap(inst, data)`
* **Description:** Plays transformation music when seamless player swap completes (wonkey transform or detransform).
* **Parameters:**
  - `inst` -- Entity - The player instance
  - `data` -- table - Event data containing oldprefab field
* **Returns:** None

### `OnFollowerRemoved(inst, follower)`
* **Description:** Calls additional_OnFollowerRemoved if defined on the instance.
* **Parameters:**
  - `inst` -- Entity - The leader player instance
  - `follower` -- Entity - The follower being removed
* **Returns:** None

### `OnFollowerAdded(inst, follower)`
* **Description:** Calls additional_OnFollowerAdded if defined on the instance.
* **Parameters:**
  - `inst` -- Entity - The leader player instance
  - `follower` -- Entity - The follower being added
* **Returns:** None

### `fn()`
* **Description:** Inner prefab creation function that builds the complete player entity with all components, assets, events, and network variables. Called when prefab is spawned.
* **Parameters:** None
* **Returns:** Entity - The created player instance

### `MakePlayerCharacter(name, customprefabs, customassets, common_postinit, master_postinit, starting_inventory)`
* **Description:** Factory function that creates the player character prefab with all standard components and configuration. Returns a Prefab object for registration.
* **Parameters:**
  - `name` -- string -- Character prefab name
  - `customprefabs` -- table -- Optional custom prefab dependencies
  - `customassets` -- table -- Optional custom assets
  - `common_postinit` -- function -- Optional common postinit callback
  - `master_postinit` -- function -- Optional master postinit callback
  - `starting_inventory` -- table -- Deprecated starting inventory (set via master_postinit)
* **Returns:** Prefab - The player character prefab object

## Events & listeners

**Listens to:**
- `gotnewitem` — Triggered when player receives a new item, plays pickup sound
- `equip` — Triggered when player equips an item, plays equip sound
- `itemranout` — Triggered when item runs out
- `umbrellaranout` — Triggered when umbrella runs out
- `armorbroke` — Triggered when armor breaks
- `picksomething` — Audio event for picking up items
- `dropitem` — Audio event for dropping items
- `actionfailed` — Speech event for failed actions
- `wonteatfood` — Speech event for refusing food
- `working` — Speech event for working with tools
- `onstartedfire` — Temperamental event for starting fire
- `onattackother` — PVP event for attacking others
- `onareaattackother` — PVP event for area attacks
- `killed` — PVP event for killing
- `learncookbookrecipe` — Cookbook event for learning recipes
- `learncookbookstats` — Cookbook event for learning stats
- `oneat` — Cookbook event for eating
- `learnplantstage` — Plant registry event for learning plant stages
- `learnfertilizer` — Plant registry event for learning fertilizers
- `takeoversizedpicture` — Plant registry event for oversized crop pictures
- `changearea` — Enlightenment event for area changes
- `stormlevel` — Enlightenment event for storm level changes
- `on_RIFT_MOON_tile` — Enlightenment event for rift moon tiles
- `on_LUNAR_MARSH_tile` — Enlightenment event for lunar marsh tiles
- `murdered` — Merm murder event for fish repel check
- `onstage` — Stageplay event for being on stage
- `startstageacting` — Stageplay event for starting acting
- `stopstageacting` — Stageplay event for stopping acting
- `ms_closepopups` — Generic popup close event
- `gotnewattunement` — Attunement event for gaining new attunement
- `attunementlost` — Attunement event for losing attunement
- `cancelmovementprediction` — Movement prediction cancellation event
- `serverpauseddirty` — Server pause state change event
- `onremove` — Entity removal event for classified detachment
- `setowner` — Triggers OnSetOwner callback when owner is set
- `local_seamlessplayerswap` — Triggers LocalSeamlessPlayerSwap for client-side swap
- `local_seamlessplayerswaptarget` — Triggers LocalSeamlessPlayerSwapTarget for client-side swap target
- `master_seamlessplayerswap` — Triggers MasterSeamlessPlayerSwap for server-side swap
- `master_seamlessplayerswaptarget` — Triggers MasterSeamlessPlayerSwapTarget for server-side swap target
- `localplayer._winters_feast_music` — Triggers OnWintersFeastMusic on non-dedicated clients
- `localplayer._lunarportalmax` — Triggers OnLunarPortalMax on non-dedicated clients
- `localplayer._shadowportalmax` — Triggers OnShadowPortalMax on non-dedicated clients
- `localplayer._hermit_music` — Triggers OnHermitMusic on non-dedicated clients
- `sharksounddirty` — Triggers OnSharkSound when shark sound parameter changes
- `wormdigestionsounddirty` — Triggers OnWormDigestionSound when worm digestion sound changes
- `finishseamlessplayerswap` — Triggers onfinishseamlessplayerswap when swap completes
- `piratemusicstatedirty` — Triggers OnPirateMusicStateDirty when pirate music state changes
- `parasiteoverlaydirty` — Triggers OnParasiteOverlayDirty when parasite overlay changes
- `healthbarbuffsymboldirty` — Triggers OnHealthbarBuffSymbolDirty when buff symbol changes
- `blackoutdirty` — Triggers OnBlackoutDirty when blackout state changes
- `death` — Triggers OnPlayerDeath callback
- `makeplayerghost` — Triggers OnMakePlayerGhost if ghost enabled
- `respawnfromghost` — Triggers OnRespawnFromGhost if ghost enabled
- `ghostdissipated` — Triggers OnPlayerDied if ghost enabled
- `respawnfromcorpse` — Triggers OnRespawnFromPlayerCorpse if revivablecorpse component exists
- `playerdied` — Triggers OnMakePlayerCorpse or OnPlayerDied depending on ghost settings
- `spooked` — Triggers OnSpooked during Hallowed Nights event
- `startfiredamage` — Triggers OnStartFireDamage when fire damage begins
- `stopfiredamage` — Triggers OnStopFireDamage when fire damage ends
- `burnt` — Triggers OnBurntHands when hands are burnt
- `onchangecanopyzone` — Triggers OnChangeCanopyZone when canopy zone changes

**Pushes:**
- `on_enter_might_gym` — Pushed when entering gym state
- `ms_closepopups` — Pushed to close popups when entering gym state
- `yotb_learnblueprint` — Pushed when YOTB skin set is unlocked
- `respawnfromghost` — Pushed when player respawns from ghost via reviver item
- `firemelt` — Pushed on frozen items when fire damage starts
- `stopfiremelt` — Pushed on frozen items when fire damage stops
- `playerdeactivated` — Pushed when player is deactivated
- `playeractivated` — Pushed when player is activated
- `finishseamlessplayerswap` — Pushed when seamless player swap completes
- `playerentered` — Pushed when player enters world
- `ms_playerjoined` — Master sim event for player joining
- `enablemovementprediction` — Pushed to enable/disable movement prediction
- `cancelmovementprediction` — Pushed to cancel movement prediction when entering ghost state
- `enableboatcamera` — Pushed to enable/disable boat camera
- `seamlessplayerswap` — Pushed for seamless player swap initiation
- `seamlessplayerswaptarget` — Pushed for seamless player swap target
- `playerexited` — Pushed when player exits world
- `ms_playerleft` — Master sim event for player leaving
- `player_despawn` — Pushed in OnDespawn when player is despawning
- `ms_newplayerspawned` — Pushed in OnNewSpawn when player spawns, passes inst as data
- `screenflash` — Pushed in fns.ScreenFlash when intensity >= 0 and HUD exists
- `isfeasting` — Pushed in OnWintersFeastMusic if inst is ThePlayer
- `startflareoverlay` — Pushed in OnLunarPortalMax and OnShadowPortalMax with optional color table
- `playhermitmusic` — Pushed in OnHermitMusic if inst is ThePlayer
- `playpiratesmusic` — Pushed in OnPirateMusicStateDirty if inst is ThePlayer
- `parasitethralllevel` — Pushed in OnParasiteOverlayDirty with _parasiteoverlay value
- `clienthealthbuffdirty` — Pushed in OnHealthbarBuffSymbolDirty with _buffsymbol value
- `newskillpointupdated` — Pushed when player initialization completes
- `ms_playerspawn` — Pushed to TheWorld when player spawns
- `invincibletoggle` — Pushed when health invincibility toggles
- `sanitydelta` — Pushed when sanity changes
- `gosane` — Pushed when player becomes sane
- `goinsane` — Pushed when player becomes insane
- `goenlightened` — Pushed when player becomes enlightened
- `dismounted` — Pushed when player dismounts
- `stopconstruction` — Pushed when construction stops
- `ondropped` — Pushed when inventory item is dropped
- `onownerdropped` — Pushed on container items when owner drops
- `startstrafing` — Pushed when strafing starts
- `stopstrafing` — Pushed when strafing stops
- `usereviver` — Pushed when reviver item is used
- `stopfiremelt` — Pushed on frozen items when fire damage stops