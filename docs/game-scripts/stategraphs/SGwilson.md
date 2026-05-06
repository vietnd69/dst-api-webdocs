---
id: SGwilson
title: Sgwilson
description: Defines the animation state machine for Wilson and shared player character states, handling locomotion, combat, tool use, transformations, death/rebirth, and character-specific abilities across all playable characters.
tags: [stategraph, player, animation, locomotion, combat]
sidebar_position: 10

last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 767891a7
system_scope: player
---

# Sgwilson

> Based on game build **722832** | Last updated: 2026-04-26

## Overview

SGwilson is the primary animation state machine for the Wilson player character and serves as the foundation for all playable characters in Don't Starve Together. This stategraph defines over 200 states covering locomotion (run, idle, mounted movement), combat (attack, parry, recoil, weapon-specific actions), tool use (chop, mine, hammer, dig, fishing, netting), and character transformations (werebeaver, weremoose, weregoose, wereplayer). It integrates character-specific mechanics including Wanda age transitions, Wortox portal teleportation, WX-78 module abilities, Wigfrid battle mechanics, and Wormwood plant interactions. The stategraph handles death and rebirth sequences (standard, gravestone, vine save), status effects (electrocute, grogginess, freeze), and UI interactions (wardrobe, cookbook, gift opening). Stategraphs are accessed via `StartStateGraph()` on entity creation, not called as utility functions. ActionHandlers map player ACTIONS to appropriate animation states based on equipped items, component checks, and tag conditions.

## Usage example

```lua
-- Access Wilson stategraph on a player entity
local player = ThePlayer
if player.sg ~= nil then
    -- Transition to a specific state
    player.sg:GoToState("idle")
    
    -- Check current state and tags
    if player.sg:HasStateTag("busy") then
        print("Player is busy, cannot interrupt")
    end
    
    -- Listen for stategraph events
    player:ListenForEvent("locomote", function(inst, data)
        print("Player locomotion state changed")
    end)
    
    -- Check if in combat state
    if player.sg.currentstate.name == "attack" then
        print("Player is attacking")
    end
end

```
## Dependencies & tags

**External dependencies:**
- `stategraphs/commonstates` -- Required for common state definitions
- `easing` -- Required for animation interpolation functions
- `prefabs/player_common_extensions` -- Required for shared player entity logic
- `stategraphs/SGwx78_common` -- Required for WX-78 common state definitions
- `prefabs/wx78_common` -- Required for WX-78 shared mechanics
- `TheInput` -- GetAnalogControlValue called for controller input
- `TheCamera` -- GetRightVec and GetDownVec called for direction calculation
- `TUNING` -- CONTROLLER_DEADZONE_RADIUS accessed for input threshold
- `AllPlayers` -- Iterated in GetRoyaltyTarget to find royalty players
- `TheNet` -- GetServerGameMode called for lavaarena/quagmire mode check
- `TheWorld` -- Referenced in commented-out IsNearDanger function for hounded component
- `GLOBAL` -- EQUIPSLOTS.BODY accessed in ForceStopHeavyLifting
- `SpawnPrefab` -- Called in DoGooseStepFX, DoGooseWalkFX, DoGooseRunFX
- `Launch2` -- Called in DropAllItemsForDeath for item physics
- `PlayFootstep` -- Called in DoRunSounds and PlayMooseFootstep
- `event_server_data` -- Used to override DoRunSounds for event server modes
- `COLLISION` -- Used in ToggleOffPhysics, ToggleOffPhysicsExceptWorld, ToggleOnPhysics for collision mask constants
- `EQUIPSLOTS` -- Used in GetUnequipState to check HANDS slot
- `WORTOX_SHADOW_MULT` -- Global constant used in DoWortoxPortalTint for shadow allegiance multiplier
- `WORTOX_LUNAR_OFFSET` -- Global constant used in DoWortoxPortalTint for lunar allegiance offset
- `TheSim` -- FindEntities called in TryGallopCollideUpdate to detect collision targets
- `ACTIONS` -- Referenced for BUILD, DROP, FEEDPLAYER, CHOP, MINE, REMOVELUNARBUILDUP, HAMMER, TERRAFORM, DIG, NET action types
- `checkbit` -- Used to check collision mask bits in TryGallopCollideUpdate
- `distsq` -- Used for distance squared calculations in collision detection
- `DEGREES` -- Used to convert rotation to angle in TryGallopCollideUpdate
- `MAX_PHYSICS_RADIUS` -- Used in entity search radius calculation
- `ActionHandler` -- Function used to define action-to-state mappings
- `GetValidRecipe` -- Called in BUILD handler to retrieve recipe data
- `FunctionOrValue` -- Called in BUILD handler to resolve recipe sg_state
- `SGWX78Common` -- Accessed for WX_SPIN_PICKABLE_TAGS in PICK handler
- `WX78Common` -- Accessed for CanSpinUsingItem in PICK and ATTACK handlers
- `FOODTYPE` -- Used to check food type in EAT handler
- `GetString` -- Retrieve ANNOUNCE_COACH string
- `GetTaskRemaining` -- Calculate parry time left
- `GetTime` -- Timestamp for stunlock calculation
- `FRAMES` -- Time threshold for electrocute
- `PLAYERSTUNLOCK` -- Stunlock frequency enums
- `DoHurtSound` -- Play hit sound effect
- `shallowcopy` -- Used to copy knockback data table.
- `Vector3` -- Used to create position vector for weregoose takeoff.
- `FindRandomPointOnShoreFromOcean` -- Used to find teleport point for weregoose.
- `TheInventory` -- CheckClientOwnership called in emote handler for validation
- `ClosePocketRummageMem` -- Called in ms_closeportablestorage handler
- `GetTickTime` -- Gets current tick time for animation sync
- `math2d` -- DistSq for network position validation
- `PlayerCommonExtensions` -- CalcGallopSpeedMult for speed calculation
- `ForceStopHeavyLifting` -- Stops heavy lifting across multiple states
- `ClearStatusAilments` -- Clears status effects before transformation
- `SetSleeperAwakeState` -- Sets sleeper component awake state on wakeup exit
- `SerializeUserSession` -- Serializes session data on resurrection
- `CommonHandlers` -- OnHop, OnElectrocute, OnCorpseChomped handler factories
- `weremoose_symbols` -- Local table of symbol names for weremoose animation overrides
- `StartElectrocuteForkOnTarget` -- Called in electrocute onenter if data provided
- `statue_symbols` -- Table used for symbol overrides in rebirth states
- `HUMAN_MEAT_ENABLED` -- Global flag checked to determine if humanmeat prefab should be dropped
- `DropAllItemsForDeath` -- Global function called to drop player items on death
- `DoMountSound` -- Global function called for mount death sound
- `DoGooseRunFX` -- Global function called for goose death effects
- `FindCharlieRezSpotFor` -- Finds resurrection spot in death_vinesave_pst ontimeout
- `DoGooseStepFX` -- Called in idle onupdate for goose step visual effects
- `Launch` -- Launches loot items from picked flowers
- `DEPLOYSPACING_RADIUS` -- Constant used for flower search radius
- `DEPLOYSPACING` -- LESS enum used for deploy spacing configuration
- `FLOWERS_MUST_TAGS` -- Tag filter for flower entity search
- `FLOWERS_CANT_TAGS` -- Exclusion tag filter for flower entity search
- `FALLINGREASON` -- OCEAN and VOID enums checked in drownable logic
- `OnTalk_Override` -- External event handler function for ontalk event in bow state
- `OnDoneTalking_Override` -- External event handler function for donetalking event in bow state
- `GetRoyaltyTarget` -- Function to find royalty target entity in ontimeout handler
- `ClearRefuseBowTask` -- Callback function for refuse bow task cleanup in bow timeline
- `ClearRegalJokerTask` -- Callback function for regal joker task cleanup in bow timeline
- `NO_REFUSEBOW_RESPONSE_TIME` -- Constant for refuse bow response timeout duration
- `NO_REGALJOKER_RESPONSE_TIME` -- Constant for regal joker response timeout duration
- `CancelTalk_Override` -- Helper function to cancel talk override on state exit
- `CanEntitySeeTarget` -- Global function to check line of sight to target.
- `PlayMiningFX` -- Global function to spawn mining visual effects.
- `CAMERASHAKE` -- Global table for camera shake types.
- `CONTROL_SECONDARY` -- Input control constant for RMB/controller alternate action
- `CONTROL_CONTROLLER_ALTACTION` -- Input control constant for controller alternate action
- `CONTROL_PRIMARY` -- Input control constant for LMB/controller primary action
- `CONTROL_ACTION` -- Input control constant for action button
- `CONTROL_CONTROLLER_ACTION` -- Input control constant for controller action button
- `GetUnequipState` -- Determines appropriate state for unequip transitions
- `IsWeaponEquipped` -- Checks if parry weapon is currently equipped
- `GetGameModeProperty` -- Checks no_hunger game mode property in eat onexit
- `DoEatSound` -- File-scope helper called in eat timeline and onenter
- `TryResumePocketRummage` -- File-scope helper called in eat timeline
- `TryReturnItemToFeeder` -- File-scope helper called in eat onexit
- `CheckPocketRummageMem` -- File-scope helper called in eat onexit
- `POPUPS` -- References GIFTITEM, WARDROBE, GROOMER popup types
- `DoTalkSound` -- Helper function to play talk sound effects
- `StopTalkSound` -- Helper function to stop talk sound effects
- `DoMimeAnimations` -- Called in mime state onenter.
- `GetRandomMinMax` -- Called in dohungrybuild for random talk delay generation
- `StartActionMeter` -- Called in dolongaction onenter to start action meter UI
- `StopActionMeter` -- Called in dolongaction ontimeout and onexit to stop action meter UI
- `find_lucy` -- Function passed to FindItem to locate lucy axe in carvewood state
- `HandleInstrumentAssets` -- Called to set up instrument animation assets for flute, horn, bell, whistle states
- `TimeEvent` -- Defines timeline callbacks within states.
- `EventHandler` -- Defines event listeners within states.
- `State` -- Constructor for state definitions.
- `subfmt` -- Format announcement strings
- `OnRemoveCleanupTargetFX` -- Cleanup function for target FX
- `GetIceStaffProjectileSound` -- Function called to get ice staff projectile sound path
- `MOOSE_AOE_MUST_TAGS` -- Tag filter for moose smash area attack
- `MOOSE_AOE_CANT_TAGS` -- Exclusion tag filter for moose smash area attack
- `ATTACK_PROP_MUST_TAGS` -- Tag filter for prop attack entity search
- `ATTACK_PROP_CANT_TAGS` -- Exclusion tag filter for prop attack entity search
- `ConfigureRunState` -- Local helper function to configure run state parameters
- `GetRunStateAnim` -- Local helper function to determine appropriate run animation based on transformation state
- `DoRunSounds` -- Local helper function to play running sound effects
- `DoFoleySounds` -- Local helper function to play footstep foley sounds
- `DoMountedFoleySounds` -- Local helper function to play mounted movement sounds
- `PlayMooseFootstep` -- Local helper function to trigger moose-specific footstep sound
- `StateGraph` -- Called at end to construct and return the stategraph with states, events, default state, and actionhandlers
- `CommonStates` -- AddRowStates and AddHopStates called to integrate common locomotion and hopping states
- `GymStates` -- AddGymStates called from SGwilson_gymstates module to add gym workout states
- `TheShard` -- GetShardId called in pocketwatch warpback for shard migration checks
- `VecUtil_DistSq` -- Called for distance calculations in pocketwatch warpback
- `Shard_IsWorldAvailable` -- Called to check if destination shard is available for migration
- `FindPlayerFloater` -- Called to find player floater item in water states
- `DoGooseWalkFX` -- Called for weregoose walking visual effects
- `DoMooseRunSounds` -- Called for weremoose running sounds
- `DoYawnSound` -- Called during yawn state
- `DoEmoteFX` -- Called for emote visual effects
- `DoEmoteSound` -- Called for emote sounds
- `DoForcedEmoteSound` -- Called for forced emote sounds
- `DoWortoxPortalTint` -- Called for Wortox portal tint effects
- `DoThrust` -- Called during multithrust state
- `DoHelmSplit` -- Called during helmsplitter state
- `SetSleeperSleepState` -- Called when entering sleep states
- `StartTeleporting` -- Called when teleportation begins
- `DoneTeleporting` -- Called when teleportation completes
- `ToggleOnPhysics` -- Called to restore physics collision
- `ToggleOffPhysics` -- Called to disable physics collision
- `ToggleOffPhysicsExceptWorld` -- Called to disable physics except world collision
- `ShakeAllCameras` -- Called for camera shake effects in combat states
- `GetActionPassableTestFnAt` -- Called to get passability test function for position validation
- `GetCreatureImpactSound` -- Called for creature impact sounds in corpse hit state
- `GetRockingChairStateAnim` -- Called to determine rocking chair animation state
- `HandleModuleRemoverAssets` -- Called in WX78 module removal states
- `CreatingJoustingData` -- Called to create jousting data structure
- `ReduceAngle` -- Called to normalize angle values
- `IsLocalAnalogTriggered` -- Called to check local analog input trigger
- `GetLocalAnalogDir` -- Called to get local analog direction input
- `DiffAngle` -- Called to calculate angle difference
- `SetPocketRummageMem` -- Called to set pocket rummage memory
- `OwnsPocketRummageContainer` -- Called to verify pocket rummage container ownership
- `ValidateMultiThruster` -- Called to validate multithruster before stopping
- `ValidateHelmSplitter` -- Called to validate helmsplitter before stopping
- `easing.outQuad` -- Called for swim speed easing calculation
- `GetActionFailString` -- Called to get action fail strings
- `find_abigail_flower` -- Called to find Abigail's flower in inventory for Wendy elixir states
- `EntityScript.is_instance` -- Called to check if data is entity instance in sitting states

**Components used:**
- `playercontroller` -- Checked for input enable state in GetLocalAnalogXY, disabled in SetSleeperSleepState
- `inventory` -- Accessed for equipslots in DoEquipmentFoleySounds, DropEverything in DropAllItemsForDeath, Hide in SetSleeperSleepState, IsHeavyLifting and Unequip in ForceStopHeavyLifting
- `socketholder` -- UnsocketEverything called in DropAllItemsForDeath
- `drownable` -- IsOverWater checked in DoGooseStepFX, DoGooseWalkFX, DoGooseRunFX
- `rider` -- GetSaddle called in DoMountedFoleySounds
- `freezable` -- IsFrozen and Unfreeze called in ClearStatusAilments
- `pinnable` -- IsStuck and Unstick called in ClearStatusAilments
- `grue` -- AddImmunity called in SetSleeperSleepState
- `talker` -- IgnoreAll called in SetSleeperSleepState
- `firebug` -- Disable called in SetSleeperSleepState
- `sanity` -- Referenced in commented-out IsNearDanger function
- `health` -- SetInvincible called in StartTeleporting and DoneTeleporting
- `mightiness` -- IsMighty called in ConfigureRunState
- `skilltreeupdater` -- IsActivated called in ConfigureRunState for walter_woby_sprint skill
- `playervision` -- HasGoggleVision called in ConfigureRunState
- `colouradder` -- PushColour and PopColour called in DoWortoxPortalTint
- `equippable` -- IsEquipped called in IsWeaponEquipped
- `inventoryitem` -- IsHeldBy called in IsWeaponEquipped, GetGrandOwner and owner accessed in OwnsPocketRummageContainer and IsHoldingPocketRummageActionItem
- `multithruster` -- DoThrust called in DoThrust, component checked in ValidateMultiThruster
- `helmsplitter` -- DoHelmSplit called in DoHelmSplit, component checked in ValidateHelmSplitter
- `container` -- Close called in ClosePocketRummageMem
- `instrument` -- GetAssetOverrides called on buffered action inventory object
- `playerfloater` -- Checked for existence on inventory items
- `fueled` -- DoDelta called on gallop stick
- `locomotor` -- GetRunSpeed called to calculate gallop speedboost
- `workable` -- CanBeWorked, GetWorkAction, WorkedBy called on collision targets
- `oceanfishingrod` -- Accessed to get target in fishing reel handler
- `oceanfishable` -- Checked on target in fishing reel handler
- `reader` -- Checked for IsAspiringBookworm in read handler
- `pickable` -- Checked for jostlepick, quickpick in pick handler
- `searchable` -- Checked for jostlesearch, quicksearch in pick handler
- `activatable` -- Checked on target in activate handler
- `eater` -- Checked for PrefersToEat in eat handler
- `souleater` -- Checked for existence in eat handler
- `combat` -- Checked for GetWeapon in attack handler
- `channelable` -- Checked for use_channel_longaction property in STARTCHANNELING handler
- `constructionsite` -- Checked for existence in CONSTRUCT handler
- `socketable` -- Checked for GetSocketName() method in USEITEMON handler
- `dumbbelllifter` -- Called IsLifting() method in LIFT_DUMBBELL handler
- `strongman` -- Accesses gym property
- `mightygym` -- CharacterExitGym called on gym instance
- `sleepingbag` -- DoWakeUp called on sleepingbag component
- `wereness` -- GetPercent called to check transformation readiness.
- `revivablecorpse` -- Checked for existence to determine death state path.
- `playerspeedmult` -- SetCappedPredictedSpeedMult, RemoveCappedPredictedSpeedMult for gallop speed
- `skinner` -- SetSkinMode for powerup/powerdown skin transitions
- `AnimState` -- PlayAnimation(), OverrideSymbol(), ClearOverrideSymbol(), AnimDone(), GetCurrentAnimationLength() for animation control
- `SoundEmitter` -- PlaySound() for transformation audio effects
- `Physics` -- Stop() to halt movement during transformation
- `Transform` -- GetWorldPosition() for FX spawn positioning
- `grogginess` -- ResetGrogginess called in electrocute onenter
- `bloomer` -- PushBloom and PopBloom for electrocute shader effect
- `burnable` -- Ignite called if plantkin is electrocuted
- `fader` -- Fade called in wendy_gravestone_rebirth timeline
- `cursable` -- Died() called to handle curse removal on death
- `shadowparasitemanager` -- SpawnHostedPlayer() called for hosted player death via TheWorld.components
- `temperature` -- IsFreezing and IsOverheating checked in idle onenter for temperature animations
- `hunger` -- GetPercent() called in funnyidle onenter to check hungry threshold
- `lunarhailbuildup` -- Check if lunar hail buildup is workable.
- `sg` -- Manage state tags and transitions.
- `parryweapon` -- OnPreParry() and TryParry() called during parry setup
- `fishingrod` -- WaitForFish(), Collect(), Release() called on equipped tool
- `giftreceiver` -- OnStartOpenGift() called when opening gift
- `wardrobe` -- CanBeginChanging() and BeginChanging() checked for wardrobe transitions
- `groomer` -- GetOccupant() and popuptype accessed for groomer popup
- `DynamicShadow` -- Enable
- `corpsereviver` -- GetReviverSpeedMult called to calculate revive speed multiplier
- `beard` -- ShouldTryToShave() called in shave state to validate shave action on beard component
- `shaveable` -- CanShave() called in shave state to validate shave action on shaveable component
- `shaver` -- Checked in shave state onenter to verify invobject has shaver component
- `ghostlybond` -- Accessed bondlevel property for speech string.
- `weighable` -- GetWeight and GetWeightPercent for announcements
- `spellbook` -- HasSpellFn to check book type
- `aoetargeting` -- SpawnTargetFXAt and CanRepeatCast for spell effects
- `deployable` -- deploytoss_symbol_override accessed for animation override
- `soundemitter` -- PlaySound() for attack and projectile sounds
- `animstate` -- PlayAnimation(), PushAnimation(), IsCurrentAnimation(), GetCurrentAnimationFrame(), Show(), Hide() for animation control
- `transform` -- SetPredictedEightFaced() for lancejab facing prediction
- `planardamage` -- AddBonus and RemoveBonus called for moose smash planar damage
- `planarentity` -- Checked on targets during moose smash to apply planar damage bonus
- `sleeper` -- GoToSleep called in sleep-related states
- `sleepingbaguser` -- ShouldSleep checked before sleeping
- `teleporter` -- Activate, RegisterTeleportee, UnregisterTeleportee, UseTemporaryExit called in teleportation states
- `remoteteleporter` -- CanActivate, OnStartTeleport, OnStopTeleport, Teleport_GetNearbyItems, SetNearbyItems called in remote teleport states
- `recallmark` -- IsMarkedForSameShard checked in pocketwatch portal states
- `pocketwatch` -- CanCast checked in pocketwatch cast states
- `aoeweapon_leap` -- DoLeap called in combat leap states
- `aoeweapon_lunge` -- DoLunge, sound accessed in combat lunge states
- `aoecharging` -- GetChargeTicks, IsEnabled, ReleaseChargedAttack, SetChargeTicks, SetChargingOwner called in slingshot charge states
- `finiteuses` -- GetUses checked for slingshot and tool states
- `tool` -- CanDoAction checked in till states
- `perishable` -- StartPerishing, StopPerishing called in item crafting states
- `colourtweener` -- StartTween, EndTween, IsTweening called in portal rebirth states
- `mast` -- AddSailFurler, RemoveSailFurler called in sail furling states
- `boatcannonuser` -- GetCannon, SetCannon called in cannon aiming states
- `steeringwheeluser` -- should_play_left_turn_anim accessed in boat steering states
- `anchor` -- RemoveAnchorRaiser called in anchor raising states
- `constructionbuilder` -- OnFinishConstruction, StopConstruction called in construction states
- `bundler` -- OnFinishBundling, StopBundling called in bundling states
- `fan` -- Channel, IsChanneling, overridesymbol accessed in fan use states
- `walkingplankuser` -- Dismount called in plank mount states
- `joustuser` -- CheckEdge, StartJoust, EndJoust called in jousting states
- `tackler` -- CheckCollision, CheckEdge called in tackle states
- `slingshotmods` -- CheckRequiredSkillsForPlayer, HasPartName called in slingshot states
- `embarker` -- GetEmbarkPosition, StartMoving, Cancel, embark_speed, embarkable accessed in hopping states
- `sittable` -- IsOccupied, IsOccupiedBy, SetOccupier called in sitting states
- `slipperyfeet` -- SetCurrent called in slipping states
- `upgrademoduleowner` -- StartInspecting, StopInspecting, FindAndPopModule called in WX78 module states
- `useableequippeditem` -- IsInUse, StopUsingItem called in drone control states
- `gestaltcage` -- OnTarget, OnUntarget called in pounce capture states
- `moonstormstaticcatcher` -- OnTarget, OnUntarget called in divegrab states
- `bathingpool` -- GetRadius, IsOccupant checked in soaking states
- `wintersfeasttable` -- current_feasters accessed in winter's feast eating states
- `pushable` -- GetPushingSpeed, ShouldStopForwardMotion, StopPushing, doer accessed in pushing states
- `magician` -- DropToolOnStop, StopUsing, equip, held, item accessed in tophat states
- `singinginspiration` -- IsSongActive, CanAddSong, and other methods accessed in Wigfrid singing states
- `soul` -- Referenced for soul-related effects

**Tags:**
- `playerghost` -- check
- `regal` -- check
- `regaljoker` -- check
- `mime` -- check
- `flying` -- check
- `shadow` -- check
- `ghost` -- check
- `FX` -- check
- `NOCLICK` -- check
- `DECOR` -- check
- `INLIMBO` -- check
- `wall` -- check
- `companion` -- check
- `flight` -- check
- `invisible` -- check
- `notarget` -- check
- `noattack` -- check
- `flower` -- check
- `_combat` -- check
- `monster` -- check
- `pig` -- check
- `player` -- check
- `spider` -- check
- `spiderwhisperer` -- check
- `spiderdisguise` -- check
- `shadowcreature` -- check
- `wereplayer` -- check
- `groggy` -- check
- `woby` -- check
- `weremoose` -- check
- `weregoose` -- check
- `wonkey` -- check
- `teetering` -- check
- `minigameitem` -- check
- `nodangle` -- add
- `noslip` -- add
- `abigail_flower` -- check
- `gallopstick` -- check
- `yeehaw` -- check
- `fullhelm_hat` -- check
- `beaver` -- check
- `nabbag` -- check
- `smallcreature` -- check
- `small` -- check
- `gnawing` -- check
- `prespin` -- check
- `spinning` -- check
- `prechop` -- check
- `chopping` -- check
- `premine` -- check
- `mining` -- check
- `prehammer` -- check
- `hammering` -- check
- `predig` -- check
- `digging` -- check
- `prenet` -- check
- `netting` -- check
- `partiallyhooked` -- check
- `fishing_idle` -- check
- `pyromaniac` -- check
- `quagmire_fasthands` -- check
- `repairshortaction` -- check
- `slowfertilize` -- check
- `graveplanter` -- check
- `engineering` -- check
- `scientist` -- check
- `handyperson` -- check
- `wx78_backupbody` -- check
- `noquickpick` -- check
- `farmplantfastpicker` -- check
- `farm_plant` -- check
- `woodiequickpicker` -- check
- `spin` -- check
- `fastpicker` -- check
- `inventoryitemholder_take` -- check
- `hungrybuilder` -- check
- `fastbuilder` -- check
- `slowbuilder` -- check
- `expertchef` -- check
- `heavy` -- check
- `portablestorage` -- check
- `fasthealer` -- check
- `quickeat` -- check
- `sloweat` -- check
- `fooddrink` -- check
- `moonportal` -- check
- `moonportalkey` -- check
- `quagmire_portal_key` -- check
- `quagmire_altar` -- check
- `give_dolongaction` -- check
- `flute` -- check
- `horn` -- check
- `bell` -- check
- `whistle` -- check
- `gnarwail_horn` -- check
- `guitar` -- check
- `cointosscast` -- check
- `crushitemcast` -- check
- `quickcast` -- check
- `veryquickcast` -- check
- `mermbuffcast` -- check
- `book` -- check
- `canrepeatcast` -- check
- `willow_ember` -- check
- `remotecontrol` -- check
- `slingshot` -- check
- `aoeweapon_lunge` -- check
- `aoeweapon_leap` -- check
- `superjump` -- check
- `parryweapon` -- check
- `blowdart` -- check
- `throw_line` -- check
- `recall_unmarked` -- check
- `pocketwatch_warp_casting` -- check
- `pocketwatch_portal` -- check
- `soulstealer` -- check
- `quickfeed` -- check
- `special_action_toss` -- check
- `keep_equip_toss` -- check
- `thrown` -- check
- `pillow` -- check
- `propweapon` -- check
- `multithruster` -- check
- `helmsplitter` -- check
- `blowpipe` -- check
- `quagmire_farmhand` -- check
- `plantkin` -- check
- `inspectingupgrademodules` -- check
- `wateringcan` -- check
- `waxspray` -- check
- `wx_remotecontroller` -- check
- `slingshotmodkit` -- check
- `useabletargateditem_canselftarget` -- check
- `socket_shadow` -- check
- `unsummoning_spell` -- check
- `yotb_stage` -- check
- `feasting` -- check
- `ingym` -- check
- `acting` -- check
- `is_furling` -- check
- `elixir_drinker` -- check
- `wx_screeching` -- check
- `wx_shielding` -- check
- `busy` -- check
- `overridelocomote` -- check
- `moving` -- check
- `bedroll` -- check
- `tent` -- check
- `waking` -- check
- `sleeping` -- check
- `shell` -- check
- `transform` -- check
- `dismounting` -- check
- `parrying` -- check
- `parryhit` -- check
- `devoured` -- check
- `suspended` -- check
- `nointerrupt` -- check
- `canelectrocute` -- check
- `groundspike` -- check
- `pushing` -- check
- `noelectrocute` -- check
- `electrocute` -- check
- `wxshielding` -- check
- `wxshieldhit` -- check
- `caninterrupt` -- check
- `nostunlock` -- check
- `idle` -- check
- `heavyarmor` -- check
- `heavybody` -- check
- `drowning` -- check
- `falling` -- check
- `jumping` -- check
- `running` -- check
- `is_turning_wheel` -- check
- `nocraftinginterrupt` -- check
- `channeling` -- check
- `dead` -- check
- `talking` -- check
- `notalking` -- check
- `floating` -- check
- `lifting_dumbbell` -- check
- `fishing` -- check
- `knockout` -- check
- `nopredict` -- check
- `nomorph` -- check
- `silentmorph` -- check
- `spook_protection` -- check
- `pausepredict` -- add
- `powerup` -- add
- `transformpre` -- add/remove/check
- `electricdamageimmune` -- check
- `canrotate` -- add
- `ignoretalking` -- check
- `keepchannelcasting` -- check
- `band` -- check
- `forcedangle` -- add
- `working` -- add
- `woodcutter` -- check
- `hiding` -- check
- `preparrying` -- check
- `shield` -- check
- `sign` -- check
- `autopredict` -- add
- `prefish` -- add
- `nibble` -- add
- `catchfish` -- add
- `keep_pocket_rummage` -- add
- `doing` -- add
- `inwardrobe` -- add
- `pumpkincarving` -- add
- `snowmandecorating` -- add
- `playingbalatro` -- add
- `moddingslingshot` -- add
- `shouldautopausecontrollerinventory` -- add
- `slowaction` -- add
- `whip` -- check
- `pocketwatch` -- check
- `shadow_item` -- check
- `jab` -- check
- `lancejab` -- check
- `punch` -- check
- `light` -- check
- `nopunch` -- check
- `playing` -- add
- `shaving` -- add
- `shadowmagic` -- check
- `attack` -- add
- `abouttoattack` -- add
- `readytocatch` -- add
- `weremoosecombo` -- check
- `rangedweapon` -- check
- `icestaff` -- check
- `firestaff` -- check
- `firepen` -- check
- `toolpunch` -- check
- `chop_attack` -- check
- `propattack` -- add
- `monkey` -- add
- `wonkey_run` -- add
- `sprint_woby` -- add
- `galloping` -- add
- `gallop_run` -- add
- `giving` -- add
- `igniting` -- add
- `waxing` -- add
- `on_walkable_plank` -- add
- `is_using_steering_wheel` -- add
- `is_using_cannon` -- add
- `aiming` -- add
- `reeling` -- add
- `knockback` -- add
- `ghostbuild` -- add
- `reviver_rebirth` -- add
- `frozen` -- add
- `thawing` -- add
- `pinned` -- add
- `yawn` -- add
- `prechanneling` -- add
- `tilling` -- add
- `aoecharging` -- add
- `thrusting` -- add
- `helmsplitting` -- add
- `tailslapping` -- add
- `sitting_on_chair` -- add
- `limited_sitting` -- add
- `pushing_walk` -- add
- `boathopping` -- add
- `swimming_floater` -- add
- `noswim` -- add
- `using_drone_remote` -- add
- `overrideattack` -- add
- `nodragwalk` -- add
- `self_fertilizing` -- add
- `jousting` -- add
- `woby_dash_fade` -- add
- `force_sprint_woby` -- add
- `iframeskeepaggro` -- add
- `corpse` -- add
- `hit` -- add
- `furl_fail` -- add
- `switchtoho` -- add
- `is_heaving` -- add
- `aoe` -- add
- `pocketwatchcaster` -- add

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ATTACK_PROP_MUST_TAGS` | table | `{ "_combat" }` | Tags required for attack property targets. |
| `ATTACK_PROP_CANT_TAGS` | table | `{ "flying", "shadow", "ghost", "FX", "NOCLICK", "DECOR", "INLIMBO", "playerghost" }` | Tags excluded from attack property targets. |
| `MOOSE_AOE_MUST_TAGS` | table | `{ "_combat" }` | Tags required for moose AOE targets. |
| `MOOSE_AOE_CANT_TAGS` | table | `{ "INLIMBO", "wall", "companion", "flight", "invisible", "notarget", "noattack" }` | Tags excluded from moose AOE targets. |
| `FLOWERS_MUST_TAGS` | table | `{ "flower" }` | Tags required for flower targets. |
| `FLOWERS_CANT_TAGS` | table | `{ "INLIMBO" }` | Tags excluded from flower targets. |
| `GALLOP_HIT_CANT_TAGS` | table | `{ "FX", "NOCLICK", "DECOR", "INLIMBO" }` | Tags excluded from gallop hit targets. |
| `WORTOX_SHADOW_MULT` | number | `0.6` | Damage multiplier for Wortox shadow attacks. |
| `WORTOX_LUNAR_OFFSET` | number | `0.1` | Lunar phase offset for Wortox calculations. |
| `NO_REGALJOKER_RESPONSE_TIME` | number | `6.0` | Response timeout for regal joker interactions. |
| `NO_REFUSEBOW_RESPONSE_TIME` | number | `6.0` | Response timeout for refuse bow interactions. |
| `DANGER_ONEOF_TAGS` | table | `{ "monster", "pig", "_combat" }` | Tags used for danger assessment (includes pigs). |
| `DANGER_NOPIG_ONEOF_TAGS` | table | `{ "monster", "_combat" }` | Tags used for danger assessment (excludes pigs). |
| `GALLOP_NO_WORK_ACTIONS` | table | *(see source)* | Actions excluded from gallop work behavior. |

## Main functions

### `onenter (init)`
* **Description:** Initializes state by transitioning to idle if locomotor component exists, otherwise corpse_idle.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (wakeup)`
* **Description:** Disables player controller, plays appropriate wakeup animation (bedroll_wakeup or wakeup). For touch stone resurrection, sets nopredict/silentmorph tags, removes nomorph, disables invincibility, shows HUD, and sets camera distance. Sets goodsleep statemem if data.goodsleep is true.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
  - `data` -- Optional data table, may contain goodsleep flag
* **Returns:** nil
* **Error states:** Errors if inst.components.playercontroller is accessed without nil check in some code paths.

### `onexit (wakeup)`
* **Description:** Calls SetSleeperAwakeState. For resurrection, shows HUD, resets camera distance, and serializes user session. If goodsleep statemem is set, triggers talker Say with ANNOUNCE_COZY_SLEEP string.
* **Parameters:** 
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.talker is nil when goodsleep is true - no nil guard before Say call.

### `onenter (powerup_wurt)`
* **Description:** Stops heavy lifting, stops physics, plays powerup animation, and pauses prediction via playercontroller.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (powerdown_wurt)`
* **Description:** Stops heavy lifting, stops physics, plays powerdown animation, and pauses prediction via playercontroller.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (powerup)`
* **Description:** Spawns wolfgang_mighty_fx at entity position, stops heavy lifting and physics, plays powerup animation, and pauses prediction. Sets up for potential dumbbell lifting transition on animover.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (powerup)`
* **Description:** Clears lifting_dumbbell statemem if still set, indicating interruption occurred.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (powerdown)`
* **Description:** Stops heavy lifting, stops physics, plays powerdown animation, and pauses prediction via playercontroller.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (becomeyounger_wanda)`
* **Description:** Stops heavy lifting and physics, plays wanda_young animation, and plays younger_transition sound at timeline 0.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (becomeolder_wanda)`
* **Description:** Stops heavy lifting and physics, plays wanda_old animation, and plays older_transition sound at timeline 0.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (transform_wereplayer)`
* **Description:** Clears status ailments, stops heavy lifting and physics, closes inventory, pushes ms_closepopups event, pauses prediction and disables player controller/map controls. If riding, plays fall_off animation and stores data for later dismount. Otherwise sets transforming flag and transitions to transform_were`{mode}` state.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
  - `data` -- Data table containing mode and cb for transformation target
* **Returns:** nil
* **Error states:** Errors if inst.components.playercontroller, inventory, or rider are nil - no nil guards before some component calls.

### `onexit (transform_wereplayer)`
* **Description:** If not transforming, performs actual dismount, reopens inventory if not dead, and re-enables player controller and map controls.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider, health, inventory, or playercontroller are nil - no nil guards before component access.

### `onenter (electrocute)`
* **Description:** Initializes electrocution state: clears ailments, stops locomotion, spawns shock FX, applies bloom shader, enables light, and potentially ignites the entity if it is a plant. Sets timeout based on animation length.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
  - `data` -- Optional data table containing attackdata, stimuli, or duration
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.bloomer are nil (no guard present).

### `onexit (electrocute)`
* **Description:** Cleans up shock FX, disables light, and removes bloom effect on state exit.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `ontimeout`
* **Description:** Timeout handler that transitions to "idle" state if the entity does not have the "transform" state tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil### `onenter (rebirth)`
* **Description:** Disables player controller, plays rebirth animation, applies statue skin symbols if source has skin build, sets invincibility, hides HUD, and adjusts camera distance.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
  - `source` -- Optional source entity for skin build data
* **Returns:** nil

### `onexit (rebirth)`
* **Description:** Clears symbol overrides, re-enables player controller, removes invincibility, shows HUD, resets camera, and serializes user session.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onenter (gravestone_rebirth)`
* **Description:** Disables player controller, overrides wormmovefx symbol, plays grave_spawn animation, sets invincibility, hides HUD, adjusts camera, and plays character-specific spawn sound based on were-form tags.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
  - `source` -- Optional source entity (unused in logic)
* **Returns:** nil

### `onexit (gravestone_rebirth)`
* **Description:** Re-enables player controller, removes invincibility, shows HUD, resets camera, and serializes user session.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onenter (wendy_gravestone_rebirth)`
* **Description:** Disables player controller, overrides symbols, plays wendy_resurrect animation, spawns rebirth FX, adds override build, sets invincibility, hides HUD, adjusts camera, and plays Abigail howl sound.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
  - `source` -- Optional source entity (unused in logic)
* **Returns:** nil

### `onexit (wendy_gravestone_rebirth)`
* **Description:** Clears override build, re-enables player controller, removes invincibility, shows HUD, resets camera, and serializes user session.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onenter (death)`
* **Description:** Handles player death entry: clears status ailments, stops locomotion, plays death animation based on transformation state (wereplayer, beaver, moose, goose), handles special cases (charlie_vinesave, wx78_backupbody_save, revivablecorpse), extinguishes fire, disables player controller, and clears buffered events.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional state transition data, may contain hosted or corpsing flags
* **Returns:** nil
* **Error states:** Errors if inst.deathcause is nil (assert failure). May error if inst.components.locomotor, inst.components.rider, inst.components.burnable, or inst.components.playercontroller is nil without guards.

### `onexit (death)`
* **Description:** Cleans up death state: clears wx_chassis_build override, resets camera distance, clears vine save flags. Contains assert(false) if leaving death state without revivablecorpse component (should never happen).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Asserts false if inst.components.revivablecorpse is nil when exiting death state (intentional crash for invalid state transition).

### `onenter (death_hosted)`
* **Description:** Handles hosted player death: adds shadow_thrall_parasite build override, clears status ailments, stops locomotion, plays parasite_death animation and possess_kill_player sound, extinguishes fire, disables player controller, drops all items, and clears buffered events.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.deathcause is nil (assert failure). May error if inst.components.locomotor, inst.components.burnable, inst.components.playercontroller, or inst.components.inventory is nil.

### `onenter (seamlessplayerswap_death)`
* **Description:** Handles death state entry for seamless player swap. Checks for revivablecorpse component to transition to corpse state, otherwise pushes makeplayerghost or playerdied event based on ghostenabled flag and ground passability.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (seamlessplayerswap_death)`
* **Description:** Asserts that entity should never leave this death state once entered. Triggers assertion failure if revivablecorpse component is nil.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Asserts false if left without revivablecorpse component — indicates invalid state transition.

### `onenter (death_vinesave_pst)`
* **Description:** Handles vine save death sequence. Clears status ailments, stops locomotor, dismounts rider, disables player controller, plays death animation, disables shadow, sets camera distance. Spawns flowers as loot, creates rose prefab with bounce animation, spawns petal FX with sound, and sets 3-second timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (death_vinesave_pst)`
* **Description:** Triggered after 3-second timeout. Finds Charlie resurrection spot, teleports entity, snaps camera, fades screen in, sets vinesaving flag, and transitions to respawn_vinesave state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (death_vinesave_pst)`
* **Description:** Re-enables shadow and shows entity. Removes NOCLICK tag from rose and sets persists to true. If not vinesaving, asserts failure, clears winona_death build override, sets invincible to false, re-enables player controller, and resets camera distance.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Asserts false if left without vinesaving flag set — indicates invalid state transition.

### `onenter (respawn_vinesave)`
* **Description:** Calls PlayerCommonExtensions.OnRespawnFromVineSave, disables player controller, plays rebirth animation, plays resurrect sound, sets invincible to true, hides HUD, and sets camera distance to 14.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (respawn_vinesave)`
* **Description:** Shows HUD, resets camera distance, re-enables player controller, sets invincible to false, clears winona_death build override, and serializes user session.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (idle)`
* **Description:** Handles idle state entry with extensive conditional logic. Stops locomotor, clears buffered actions, checks drownable for ocean/void falling, handles mounted state, checks for band equipment, processes queued talk timeout for talk/mime states. Builds animation list based on wereplayer/groggy/heavy lifting/channel casting/storm/teetering/sanity/temperature conditions. Plays or pushes animations and sets random timeout for funny animations.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `pushanim` -- boolean flag to push animation queue instead of playing immediately
* **Returns:** nil

### `onupdate (idle)`
* **Description:** Monitors goose idle animation frames. When frame 5 or 14 is reached during idle_loop animation, plays footstep sound and triggers goose step FX. Tracks frame to avoid duplicate triggers.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout`
* **Description:** Timeout handler that checks for royalty target via GetRoyaltyTarget and transitions to bow state if found, otherwise transitions to funnyidle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (funnyidle)`
* **Description:** Plays idle animations based on environmental and character state conditions. Checks temperature for cold shivering or overheating animations, hunger for hungry animation with sound, sanity mode for insanity/lunacy animations, groggy tag for groggy idle, or custom idle animations/states. Uses randomization for custom idle repeat logic.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.temperature, inst.components.hunger, or inst.components.sanity is nil - no nil guards before component access in condition checks.

### `onenter (wes_funnyidle)`
* **Description:** Plays Wes-specific idle animation (idle_wes). Timeline includes sound events for breathing and blowing at specific frame intervals.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (wx78_funnyidle)`
* **Description:** Plays WX-78 specific idle animation (idle_wx).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (waxwell_funnyidle)`
* **Description:** Plays Maxwell/Waxwell specific idle animation with 70% chance for idle_waxwell and 30% for idle2_waxwell.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (bow)`
* **Description:** Handles bowing animation toward royalty target. Stores target in statemem, forces entity to face target position, checks for regaljoker tag on target's equipped items, and determines bow animation variant based on isjoker and nobow flags.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `target` -- target entity to bow to
* **Returns:** nil
* **Error states:** Errors if target is provided but target.Transform or target.components.inventory is nil - no nil guards before nested property access.

### `onenter (bow_loop)`
* **Description:** Plays the bow_loop animation in a loop. Stores target and talktask in statemem if data is provided.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional data table containing target and talktask
* **Returns:** nil

### `onupdate (bow_loop)`
* **Description:** Checks if the target is still valid, near (within `6` units), and has regal equipment (but not regaljoker). Transitions to bow_pst if conditions are not met.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.sg.statemem.target.components.inventory is nil — no nil guard before accessing inventory component.

### `onexit (bow_loop)`
* **Description:** Cancels talk override when exiting the bow_loop state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (bow_pst)`
* **Description:** Plays the bow_pst animation and sets an 8-frame timeout before transitioning to bow_pst2.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (bow_pst)`
* **Description:** Transitions to bow_pst2 state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (mounted_idle)`
* **Description:** Checks for band armor equipment and transitions to enter_onemanband if found. Handles sandstorm visibility checks and plays appropriate idle animations. Sets timeout for random idle behavior if not in sandstorm.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `pushanim` -- boolean indicating whether to push or play animation
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory or inst.components.playervision is nil — no nil guards before component access.

### `ontimeout (mounted_idle)`
* **Description:** Checks mount validity and triggers various idle states based on mount type (woby), hunger state (starving), or random selection (shake, bellow, graze). Transitions to bow state if royalty target exists.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider, inst.components.hunger, or GetRoyaltyTarget() returns invalid data — no comprehensive nil guards.

### `onenter (graze)`
* **Description:** Plays graze_loop animation and sets random timeout between 1-6 seconds before returning to mounted_idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (graze)`
* **Description:** Transitions back to mounted_idle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

## Main functions

> **⚠️ Verification Notice:** The Lua source provided for this documentation review contains sleep-state code (SetSleeperAwakeState, goodsleep, gooseframe) that does not match the action states documented below (chop_start, mine_start, hammer, parry_pre, graze_empty, etc.). Error state claims and behavioral details cannot be fully verified without the correct stategraph source (likely player_stategraph.lua or common_actions stategraph). Treat error state documentation as unverified until correct source is provided.

### `onenter (parry_idle)`
* **Description:** Stops locomotor, sets isshield flag from data. If duration provided, schedules task to end parry after duration expires. Plays parry_loop animation. If pauseframes > 0, adds busy and pausepredict tags and calls RemotePausePrediction on playercontroller.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional table with duration, pauseframes, talktask, isshield fields
* **Returns:** nil
* **Error states:** None

### `ontimeout (graze_empty)`
* **Description:** Plays graze2_pst animation and transitions to mounted_idle with pushanim flag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (bellow)`
* **Description:** Plays bellow animation and triggers mount grunt sound via DoMountSound helper.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider is nil — no nil guard before GetMount() call.

### `onenter (shake)`
* **Description:** Plays shake animation.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (shake_woby)`
* **Description:** Checks if mount has woby tag before playing shake_woby animation. Falls back to mounted_idle if mount is invalid or not woby.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider is nil — no nil guard before GetMount() call.

### `onenter (alert_woby)`
* **Description:** Plays alert_woby animation sequence (pre, loop, pst) if mount has woby tag. Falls back to mounted_idle otherwise.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider is nil — no nil guard before GetMount() call.

### `onenter (bark_woby)`
* **Description:** Randomly plays bark1_woby animation (50% chance) if mount has woby tag. Falls back to mounted_idle otherwise.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider is nil — no nil guard before GetMount() call.

### `onenter (mount_eat)`
* **Description:** Stops locomotor, plays graze_loop animation, plays chew sound, and pauses prediction if playercontroller exists. Sets 9-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.rider is nil — no nil guards before component access.

### `ontimeout (mount_eat)`
* **Description:** Plays woby chuff sound if mount has woby tag, then transitions to idle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider is nil — no nil guard before GetMount() call.

### `onenter (chop_start)`
* **Description:** Stops locomotor, plays chop_pre or woodie_chop_pre animation based on woodcutter tag, and adds prechop tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onexit (parry_knockback)`
* **Description:** Stops physics if speed was set, clears combat redirectdamagefn if not parrying.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (chop)`
* **Description:** Removes the prechop tag when exiting the chop state.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (mine_start)`
* **Description:** Stops locomotion, plays pickaxe_pre animation, and adds premine tag.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil.

### `onexit (mine_start)`
* **Description:** Removes premine tag if mining did not commence.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (mine)`
* **Description:** Stores buffered action, plays pickaxe_loop animation, and adds premine tag.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (mine)`
* **Description:** Removes premine tag.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (mine_recoil)`
* **Description:** Stops locomotion, clears buffered action, plays recoil animation, spawns impact prefab, shakes camera, and sets physics motor velocity.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
  - `data` -- State data containing target info
* **Returns:** nil
* **Error states:** Errors if data.target is invalid when accessing GetPosition or recoil_effect_offset.

### `onupdate (mine_recoil)`
* **Description:** Applies decay to stored speed and updates physics motor velocity.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (mine_recoil)`
* **Description:** Stops physics movement.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (attack_recoil)`
* **Description:** Stops locomotion, clears buffered action, plays atk_recoil animation, spawns impact prefab, shakes camera, and sets physics motor velocity.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
  - `data` -- State data containing target info
* **Returns:** nil
* **Error states:** Errors if data.target is invalid when accessing GetPosition or recoil_effect_offset.

### `onupdate (attack_recoil)`
* **Description:** Applies decay to stored speed and updates physics motor velocity.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (attack_recoil)`
* **Description:** Stops physics movement.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (hammer_start)`
* **Description:** Stops locomotion, plays pickaxe_pre animation, and adds prehammer tag.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil.

### `onexit (hammer_start)`
* **Description:** Removes prehammer tag if hammering did not commence.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (hammer)`
* **Description:** Stores buffered action, plays pickaxe_loop animation, and adds prehammer tag.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (gnaw)`
* **Description:** Stops locomotion, stores buffered action, plays attack animations (atk_pre then atk), plays attack whoosh sound, and adds gnawing tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (gnaw)`
* **Description:** Removes the gnawing tag when exiting the state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (gnaw_recoil)`
* **Description:** Stops locomotion, clears buffered action, plays hit animation, shakes camera, and sets physics motor velocity to -6 for knockback effect.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional state transition data
* **Returns:** nil

### `onupdate (gnaw_recoil)`
* **Description:** Applies decaying knockback velocity by multiplying stored speed by 0.6 each update until speed is nil.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (gnaw_recoil)`
* **Description:** Stops physics when exiting the recoil state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (hide)`
* **Description:** Stops locomotion, plays hide animation then hide_idle, and plays hide bush Foley sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (hide)`
* **Description:** Calls CancelTalk_Override to clean up talking state when exiting hide.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (shell_enter)`
* **Description:** Stops locomotion, plays hideshell animation, and sets 23-frame timeout to transition to shell_idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (shell_enter)`
* **Description:** Transfers talktask from statemem to shell_idle state and transitions to shell_idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (shell_enter)`
* **Description:** Calls CancelTalk_Override to clean up talking state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (shell_idle)`
* **Description:** Stops locomotion, pushes hideshell_idle animation, and stores transferred talktask in statemem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `talktask` -- talk task transferred from shell_enter state
* **Returns:** nil

### `onexit (shell_idle)`
* **Description:** Calls CancelTalk_Override to clean up talking state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (shell_hit)`
* **Description:** Stops locomotion, clears buffered action, plays hitshell animation, plays hit sound, calls RemotePausePrediction for stun frames if playercontroller exists, and sets timeout for stun duration.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (shell_hit)`
* **Description:** Transitions to idle if unequipped was set during state, otherwise transitions to shell_idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (parry_pre)`
* **Description:** Detects if shield is equipped, stops locomotion, plays parry_pre animation then parry_loop, sets timeout to animation length, registers combat_parry event listener to set up parry state with redirectdamagefn, performs buffered action, then removes event callback.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil (redirectdamagefn assigned without guard)

### `ontimeout (parry_pre)`
* **Description:** Handles parry_pre state timeout. If parrying tag is active, transfers talk task to parry_idle state with duration and pauseframes. Otherwise plays parry post-animation and transitions to idle.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (parry_pre)`
* **Description:** Cancels talk override and clears combat redirectdamagefn if not parrying.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil — no nil guard before redirectdamagefn assignment.

### `onenter (parry_idle)`
* **Description:** Stops locomotor, sets isshield flag from data. If duration provided, schedules task to end parry after duration expires. Plays parry_loop animation. If pauseframes > 0, adds busy and pausepredict tags and calls RemotePausePrediction on playercontroller.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional table with duration, pauseframes, talktask, isshield fields
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.playercontroller is nil — no nil guards before method calls.

### `ontimeout (parry_idle)`
* **Description:** Removes busy and pausepredict tags, adds idle tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (parry_idle)`
* **Description:** Cancels pending task if exists, cancels talk override, clears combat redirectdamagefn if not parrying.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil — no nil guard before redirectdamagefn assignment.

### `onenter (parry_hit)`
* **Description:** Stops locomotor, clears buffered action, plays parryblock animation, plays hit sound. Sets stun timeout based on pushing flag (6 frames) or default (4 frames). Stores timeleft if provided.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- optional table with pushing, timeleft, isshield fields
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (parry_hit)`
* **Description:** If unequipped, transitions to idle. Otherwise sets parrying flag and transitions to parry_idle with calculated remaining duration.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (parry_hit)`
* **Description:** Clears combat redirectdamagefn if not parrying.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil — no nil guard before redirectdamagefn assignment.

### `onenter (parry_knockback)`
* **Description:** Stops locomotor, clears buffered action, plays parryblock animation and hit sound. Calculates knockback velocity based on distance to knocker and angle. Sets motor velocity with decay factor. Sets 6 frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `data` -- table with timeleft, knockbackdata containing radius, knocker, strengthmult
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor, inst.Physics, or inst.Transform is nil — no nil guards before method calls.

### `onupdate (parry_knockback)`
* **Description:** Decays speed by 0.75 multiplier each update and applies motor velocity for knockback effect.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (parry_knockback)`
* **Description:** If unequipped, transitions to idle. Otherwise sets parrying flag and transitions to parry_idle with calculated remaining duration.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (parry_knockback)`
* **Description:** Stops physics if speed was set, clears combat redirectdamagefn if not parrying.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil — no nil guard before redirectdamagefn assignment.

### `onenter (terraform)`
* **Description:** Stops locomotor, plays shovel_pre animation then pushes shovel_loop.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onenter (dig_start)`
* **Description:** Stops locomotor, plays shovel_pre animation, adds predig tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onexit (dig_start)`
* **Description:** Removes predig tag if not digging.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dig)`
* **Description:** Plays shovel_loop animation, stores buffered action in statemem, adds predig tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (dig)`
* **Description:** Removes predig tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (bugnet_start)`
* **Description:** Stops locomotor, plays bugnet_pre animation.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onenter (bugnet)`
* **Description:** Plays the bugnet animation and triggers the bugnet usage sound. Sets up timeline to perform buffered action and remove prenet tag.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onenter (fishing_ocean_pre)`
* **Description:** Performs the buffered fishing action and immediately transitions to idle state.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

`<`!-- NOTE: Content accuracy cannot be fully verified - provided Lua context appears to be from a different stategraph (sleep state) than the documented action states. Correct player_stategraph or common_actions stategraph source needed for verification. -->### `onenter`
* **Description:** Sets initial state based on locomotor component availability. Goes to "idle" if locomotor exists, otherwise "corpse_idle" for entities without locomotion.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** None

### `ontimeout`
* **Description:** Checks if entity has "transform" state tag. If not transforming, transitions to "idle" state with force push enabled.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit`
* **Description:** Calls SetSleeperAwakeState to restore awake state. Handles resurrection logic: if isresurrection flag is set (touch stone rez), shows HUD, restores camera distance, and serializes user session. If goodsleep flag is set, plays cozy sleep announcement via talker component.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.talker is nil and goodsleep flag is set (unguarded access in Say() call).

### `onupdate`
* **Description:** Tracks goose stepping animation frames when gooseframe state memory is set. When animation frame reaches 5 or 14 (and differs from stored frame), plays footstep sound and triggers goose step FX. Updates stored frame to current animation frame.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil
* **Error states:** None### `onexit` (sleep)
* **Description:** State: sleep. Handles state exit for sleep/resurrection. Wakes the sleeper, shows HUD and restores camera distance on touch stone resurrection, serializes user session, and announces cozy sleep if the sleep was beneficial.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.talker is nil (no nil guard before Say call).

### `onenter (carvewood)`
* **Description:** Transitions the entity to "idle" state if it has a locomotor component, otherwise transitions to "corpse_idle" state. Used for sleep/resurrection state handling.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (singsong)`
* **Description:** Kills singsong sound, stops talk sound if not interrupted, and calls ShutUp on talker component if available.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (unsaddle)`
* **Description:** Stops locomotor, plays unsaddle_pre then unsaddle animation, stores buffered action, and sets 21-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (unsaddle)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (unsaddle)`
* **Description:** Clears buffered action if it matches stored action and playercontroller lastheldaction does not match.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (heavylifting_start)`
* **Description:** Stops locomotor, clears buffered action, plays heavy_pickup_pst animation, and calls RemotePausePrediction on playercontroller if available.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onenter (heavylifting_mount_start)`
* **Description:** Stops locomotor movement, clears buffered action, checks if riding woby mount, plays heavy_mount animation, and calls RemotePausePrediction.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.rider is nil — no nil guards before component access.

### `onenter (heavylifting_stop)`
* **Description:** Stops locomotor, clears buffered action, plays pickup then pickup_pst animation, calls RemotePausePrediction with 6 stun frames, and sets timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (heavylifting_stop)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (heavylifting_item_hat)`
* **Description:** Stops locomotor, clears buffered action, plays heavy_item_hat then heavy_item_hat_pst animation, calls RemotePausePrediction, and sets 12-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (heavylifting_item_hat)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (heavylifting_drop)`
* **Description:** Stops locomotor, plays heavy_item_hat then heavy_item_hat_pst animation, stores buffered action, and sets 12-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (heavylifting_drop)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (heavylifting_drop)`
* **Description:** Clears buffered action if it matches stored action and playercontroller lastheldaction does not match.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dostandingaction)`
* **Description:** Stops locomotor, plays give then give_pst animation, stores buffered action, and sets 14-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (dostandingaction)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (dostandingaction)`
* **Description:** Clears buffered action if it matches stored action and playercontroller lastheldaction does not match.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (doequippedaction)`
* **Description:** Stops locomotor, plays give_equipped then give_equipped_pst animation, stores buffered action, and sets 14-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (doequippedaction)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (doequippedaction)`
* **Description:** Clears buffered action if it matches stored action and playercontroller lastheldaction does not match.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (doshortaction)`
* **Description:** Stops locomotor, plays atk_pre/atk animations if beaver tag present otherwise pickup/pickup_pst, stores action and silent flag, sets 10-frame timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `silent` -- boolean flag to suppress talker output during action
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.talker is nil — no nil guards before component access in timeline callback.

### `ontimeout (doshortaction)`
* **Description:** Transitions to idle state after timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (doshortaction)`
* **Description:** Clears buffered action if it matches stored action and playercontroller lastheldaction does not match, then calls CheckPocketRummageMem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dosilentshortaction)`
* **Description:** Transitions to doshortaction state with silent=true parameter.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dohungrybuild)`
* **Description:** Checks hunger percent against HUNGRY_THRESH, triggers hungry build talk announcements based on slow/fast build state and timing, then transitions to dolongaction with speed multiplier.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.hunger or inst.components.talker is nil — no nil guards before component access.

### `onenter (domediumaction)`
* **Description:** Transitions to dolongaction state with 0.5 speed multiplier.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (revivecorpse)`
* **Description:** Plays reviving announcement via talker component, retrieves buffered action target, and transitions to dolongaction state with timeout calculated from revive speed multipliers from both corpsereviver and revivablecorpse components.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.talker is nil (no guard before Say call). Errors if inst.components.corpsereviver or target.components.revivablecorpse accessed without nil checks in multiplier calculation.

### `onenter (dolongestaction)`
* **Description:** Transitions to dolongaction state with TUNING.LONGEST_ACTION_TIMEOUT as the timeout value.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (use_dumbbell_pre)`
* **Description:** Stops locomotor, performs buffered action, validates dumbbell entity, overrides dumbbell symbol on AnimState, and plays pre-lift animation based on mightiness state (wimpy/normal/mighty). Returns to idle if dumbbell is invalid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no guard before Stop call). Errors if inst.components.dumbbelllifter is nil (accesses .dumbbell property). Errors if inst.components.mightiness accessed without nil guard in some paths.

### `onexit (use_dumbbell_pre)`
* **Description:** Resumes mightiness draining and stops dumbbell lifting if the dumbbell animation was not completed (checked via statemem.dumbbell_anim_done).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.mightiness or inst.components.dumbbelllifter is nil (no nil guards before method calls).

### `onenter (use_dumbbell_loop)`
* **Description:** Plays looping dumbbell animation based on current mightiness state (skinny/normal/mighty variants).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.mightiness is nil (no guard before GetState call).

### `onexit (use_dumbbell_loop)`
* **Description:** Stops dumbbell lifting if the animation was not completed.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.dumbbelllifter is nil (no guard before StopLifting call).

### `onenter (use_dumbbell_pst)`
* **Description:** Stores current mightiness state in statemem, plays post-lift animation variant based on mightiness state (skinny/normal/mighty).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.mightiness is nil (no guard before GetState call).

### `onexit (use_dumbbell_pst)`
* **Description:** Stops dumbbell lifting, resumes mightiness draining, and clears the dumbbell symbol override on AnimState.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.dumbbelllifter or inst.components.mightiness is nil (no guards before method calls).

### `onenter (dolongaction)`
* **Description:** Sets timeout (adds slowaction tag if timeout `>` 1), stops locomotor, plays build animation loop, starts action meter if action has actionmeter, and pushes startlongaction event to target. Stores action in statemem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `timeout` -- duration for the long action, defaults to 1 if nil
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no guard before Stop call). Errors if inst.bufferedaction.target accessed without validity check before PushEvent.

### `ontimeout (dolongaction)`
* **Description:** Kills make sound, plays build post animation, stops action meter, removes busy tag, and performs the buffered action.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (dolongaction)`
* **Description:** Kills make sound, stops action meter if active, clears buffered action if it matches statemem.action and playercontroller lastheldaction differs, and checks pocket rummage memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.playercontroller accessed without nil guard in condition check.

### `onenter (graveurn_in)`
* **Description:** Stops locomotor and queues useitem_pre, graveurn_in, and useitem_pst animations sequentially.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `timeout` -- timeout parameter (unused in this state)
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no guard before Stop call).

### `onexit (graveurn_in)`
* **Description:** Clears buffered action if it matches statemem.action and playercontroller lastheldaction differs, and checks pocket rummage memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.playercontroller accessed without nil guard in condition check.

### `onenter (graveurn_out)`
* **Description:** Stops locomotor and queues useitem_pre, graveurn_out, and useitem_pst animations sequentially.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `timeout` -- timeout parameter (unused in this state)
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no guard before Stop call).

### `onexit (graveurn_out)`
* **Description:** Clears buffered action if it matches statemem.action and playercontroller lastheldaction differs, and checks pocket rummage memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.playercontroller accessed without nil guard in condition check.

### `onenter (carvewood_boards)`
* **Description:** Transitions immediately to the carvewood state with timeout parameter 1.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (carvewood)`
* **Description:** Stops locomotion, plays carving animations (useitem_pre, carving_pre, carving_loop), adds slowaction tag if timeout `>` 1, and overrides the lucy axe symbol with skin build if the equipped item has a skin.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
  - `timeout` -- Optional timeout duration, defaults to 1.5 seconds
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory or inst.components.locomotor is nil - no nil guard before accessing FindItem or Stop methods.

### `ontimeout (carvewood)`
* **Description:** Kills the carve sound, plays useitem_pst animation, removes busy tag, and performs the buffered action.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (carvewood)`
* **Description:** Clears the lucy axe symbol override, kills carve sound, clears buffered action if it matches statemem.action and playercontroller conditions are met, and checks pocket rummage memory.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (dojostleaction)`
* **Description:** Stops locomotion and plays different attack animations based on equipped item type: mount attack (riding), whip, pocketwatch (with shadow variant), jab, lancejab, weapon, light/nopunch items, beaver form, or default punch. Sets timeout based on weapon type cooldown and faces target if valid.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor, inst.components.rider, or inst.components.inventory is nil - no nil guards before accessing these components.

### `ontimeout (dojostleaction)`
* **Description:** Transitions to idle state with force parameter true.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (dojostleaction)`
* **Description:** Clears predicted facing model if predictedfacing flag is set, and clears buffered action if it matches statemem.action and playercontroller conditions are met.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (doswipeaction)`
* **Description:** Stops locomotion, plays atk_prop animations, and forces entity to face the buffered action target if valid.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil - no nil guard before Stop() call.

### `onexit (doswipeaction)`
* **Description:** Clears buffered action if it matches statemem.action and playercontroller conditions are met.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (blowdart)(inst)`
* **Description:** Checks if locomotor component exists and transitions to "idle" state, or "corpse_idle" if locomotor is missing.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None### `ontimeout (dochannelaction)`
* **Description:** Performs buffered action; if it fails, plays channel_pst animation and transitions to idle state.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onexit (dochannelaction)`
* **Description:** Clears buffered action if it matches statemem.action and playercontroller conditions are met, and calls CancelTalk_Override.
* **Parameters:**
  - `inst` -- Entity owning the stategraph
* **Returns:** nil

### `onenter (finishcontinuousaction)`
* **Description:** Stops locomotor, plays trap-making sound if not already playing, queues build_pre and build_loop animations, stores buffered action target in statemem, and sets 0.5 second timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (finishcontinuousaction)`
* **Description:** Performs buffered action, kills make sound, plays build_pst animation, and transitions to idle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (finishcontinuousaction)`
* **Description:** Kills make sound and pushes stopcontinuousaction event to stored target if present.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dodismountaction)`
* **Description:** Stops locomotor and plays dismount animation. Used for heavy pickup while mounted.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onexit (dodismountaction)`
* **Description:** Calls ActualDismount on rider component if keepmount flag is not set in statemem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.rider is nil — no nil guard before ActualDismount() call.

### `onenter (makeballoon)`
* **Description:** Stores buffered action, sets timeout, stops locomotor, plays balloon make and blowup sounds, and queues build_pre then build_loop animations.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `timeout` -- optional timeout value, defaults to 1
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (makeballoon)`
* **Description:** Kills make sound, plays build_pst animation, removes busy tag, and performs buffered action.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (makeballoon)`
* **Description:** Kills make sound, clears buffered action if it matches statemem action and playercontroller lastheldaction differs, then checks pocket rummage memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dostorytelling)`
* **Description:** Stores buffered action, stops locomotor, performs buffered action. If failed, marks not_interrupted and goes to idle. If mime tag present, sets mime flag and plays mime13 animation. Otherwise plays idle_walter_storytelling_pre animation.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onexit (dostorytelling)`
* **Description:** Clears buffered action if it matches statemem action and playercontroller lastheldaction differs. If not_interrupted flag is false, stops talk sound and calls ShutUp on talker component if present.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (dostorytelling_loop)`
* **Description:** Stops locomotor. If mime is true, sets mime flag and calls DoMimeAnimations. Else if skilltreeupdater has walter_camp_fire activated, plays storytelling animations based on current state. Otherwise plays random storytelling animation variant.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `mime` -- boolean indicating mime mode
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call. Errors if inst.components.skilltreeupdater:IsActivated is called without nil guard.

### `onexit (dostorytelling_loop)`
* **Description:** If not_interrupted flag is false, stops talk sound and calls ShutUp on talker component if present.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (shave)`
* **Description:** Stops locomotor. Validates shave action by checking bufferedaction invobject has shaver component, then checks target/doer for beard or shaveable component and calls ShouldTryToShave or CanShave. If validation fails, pushes actionfailed event, clears buffered action, and goes to idle. Otherwise plays shave sound and queues build animations with 1 second timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `ontimeout (shave)`
* **Description:** Performs buffered action, plays build_pst animation, and transitions to idle state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onexit (shave)`
* **Description:** Kills shave sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (enter_onemanband)(inst, pushanim)`
* **Description:** Stops locomotor. Plays or pushes idle_onemanband1_pre animation based on pushanim flag. If animation is current, plays onemanband sound and sets soundplayed flag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `pushanim` -- boolean to push animation instead of play
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onupdate (enter_onemanband)(inst)`
* **Description:** If sound not yet played and current animation is idle_onemanband1_pre, plays onemanband sound and sets soundplayed flag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (play_onemanband)(inst)`
* **Description:** Stops locomotor, plays idle_onemanband1_loop animation, and plays onemanband sound.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil — no nil guard before Stop() call.

### `onenter (idle_onemanband)(inst)`
* **Description:** Stops locomotion, plays one-man-band idle animation sequence (pst, pre, loop, pst), and plays the onemanband sound effect.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no guard before Stop() call).

### `onenter (play_flute)(inst)`
* **Description:** Stops locomotion, plays flute animation sequence, handles instrument assets via HandleInstrumentAssets, and returns the active action item to inventory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.inventory is nil (no guards before method calls).

### `onexit (play_flute)(inst)`
* **Description:** Kills the flute sound and clears the pan_flute01 symbol override from the animation state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (play_horn)(inst)`
* **Description:** Stops locomotion, plays horn animation sequence, handles instrument assets via HandleInstrumentAssets, and returns the active action item to inventory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.inventory is nil (no guards before method calls).

### `onexit (play_horn)(inst)`
* **Description:** Clears the horn01 symbol override from the animation state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (play_bell)(inst)`
* **Description:** Stops locomotion, plays bell animation sequence, handles instrument assets via HandleInstrumentAssets, and returns the active action item to inventory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.inventory is nil (no guards before method calls).

### `onexit (play_bell)(inst)`
* **Description:** Clears the bell01 symbol override from the animation state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (play_whistle)(inst)`
* **Description:** Stops locomotion, plays whistle animation sequence, handles hound whistle instrument assets, and returns the active action item to inventory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.inventory is nil (no guards before method calls).

### `onexit (play_whistle)(inst)`
* **Description:** Clears the hound_whistle01 symbol override from the animation state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (coach)(inst)`
* **Description:** Makes the entity say the ANNOUNCE_COACH string, plays the coach animation, triggers talk sound, and clears the queuetalk_timeout memory.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.talker is nil (no guard before Say() call).

### `onexit (coach)(inst)`
* **Description:** Calls StopTalkSound to end the talking sound effect.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (play_gnarwail_horn)(inst)`
* **Description:** Stops locomotion, plays hornblow animation sequence (pre then main).
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil (no guard before Stop() call).

### `onenter (use_beef_bell)(inst)`
* **Description:** Stops locomotion, plays cowbell animation sequence, retrieves the buffered action item, sets the sound memory, and overrides the cbell symbol based on item skin or default build.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.inventory is nil (no guards before method calls).

### `onexit (use_beef_bell)(inst)`
* **Description:** Clears the cbell symbol override from the animation state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (summon_abigail)(inst)`
* **Description:** Stops locomotion, plays summon animation, overrides flower skin symbol if buffered action exists, and stores action in state memory.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.AnimState is nil.

### `onexit (summon_abigail)(inst)`
* **Description:** Clears flower symbol override, removes spawned fx prefab, and clears buffered action if it matches state memory and playercontroller conditions.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil
* **Error states:** Errors if inst.AnimState is nil.

### `onenter (unsummon_abigail)(inst)`
* **Description:** Stops locomotion, plays recall animation, overrides flower skin symbol, stores action, and triggers talker say event.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.talker is nil.

### `onexit (unsummon_abigail)(inst)`
* **Description:** Removes spawned fx prefab, clears flower symbol override, and clears buffered action if conditions match.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil

### `onenter (commune_with_abigail)(inst)`
* **Description:** Stops locomotion, plays commune animation, plays whisper sound, overrides flower skin symbol, and stores action.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.SoundEmitter is nil.

### `onexit (commune_with_abigail)(inst)`
* **Description:** Kills whisper sound, clears flower symbol override, and clears buffered action if conditions match.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil

### `onenter (play_strum)(inst)`
* **Description:** Stops locomotion, plays strum animation, and overrides trident symbol.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.AnimState is nil.

### `onenter (channel_longaction)(inst, channelitem)`
* **Description:** Stops locomotion, plays give animation, stores channelitem in state memory or derives from buffered action and performs action.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
  - `channelitem` -- Optional target entity for channeling.
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil.

### `onexit (channel_longaction)(inst)`
* **Description:** Pushes channel_finished event on channelitem if channeling was not active.
* **Parameters:**
  - `inst` -- The entity instance owning the stategraph.
* **Returns:** nil

### `onenter (book_repeatcast)(inst)`
* **Description:** Transitions immediately to book state with repeatcast flag enabled.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onenter (book)(inst, repeatcast)`
* **Description:** Stops locomotion, plays pre-animation, returns active action item, spawns target FX or book FX, and transitions to book2 if repeatcast.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
  - `repeatcast` -- Boolean flag indicating if this is a repeat cast
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory or inst.bufferedaction is nil.

### `onexit (book)(inst)`
* **Description:** Removes book FX and target FX if the action was interrupted.
* **Parameters:**
  - `inst` -- Entity instance owning the stategraph
* **Returns:** nil

### `onenter (book_peruse)(inst)`
* **Description:** Stops locomotion, plays book peruse animations, and overrides book symbols based on skin or swap_build. Stores symbol override state in statemem for cleanup on exit.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.inventory or inst.components.locomotor is nil — no nil guard before component access.

### `onexit (book_peruse)(inst)`
* **Description:** Restores book_peruse symbol override to default if symbolsoverridden flag is set in statemem.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (blowdart)(inst)`
* **Description:** Checks combat cooldown, sets combat target, starts attack, stops locomotion, plays dart animation. Handles chained attacks by setting frame offset. Sets timeout based on chained state and min_attack_period. Faces target if valid. Calculates projectiledelay for projectile weapons.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat, inst.components.inventory, or inst.components.locomotor is nil — no nil guard before component access.

### `onupdate (blowdart)(inst, dt)`
* **Description:** Decrements projectiledelay counter each frame. When delay reaches zero or below, performs buffered action and removes abouttoattack tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
  - `dt` -- delta time since last update
* **Returns:** nil

### `ontimeout (blowdart)(inst)`
* **Description:** Removes attack state tag and adds idle state tag to transition state.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (run)(inst)`
* **Description:** Transitions the stategraph to "idle" if the entity has a locomotor component, otherwise transitions to "corpse_idle" for entities without locomotion capability.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onenter (throw_keep_equip)(inst)`
* **Description:** Stops locomotion, plays throw animation, faces the action point, and temporarily equips the throw object if it is a valid hands-slot equippable that is not restricted.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (throw)(inst)`
* **Description:** Checks combat cooldown, clears buffered action and returns to idle if on cooldown. Otherwise sets combat target, starts attack, stops locomotion, plays throw animation, sets timeout based on min_attack_period, and faces the target if valid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.combat is nil — no nil guard before combat method calls.

### `ontimeout (catch_pre)(inst)`
* **Description:** Transitions to idle state when timeout expires, if entity does not have transform state tag.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** None

### `onexit (throw)(inst)`
* **Description:** Handles state exit: wakes sleeper, processes resurrection (shows HUD, sets camera, serializes session) if isresurrection flag set, and announces cozy sleep if goodsleep flag set.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (catch_pre)(inst)`
* **Description:** Stops locomotion, plays catch_pre animation, and sets a 3-second timeout.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `ontimeout (catch_pre)(inst)`
* **Description:** Clears buffered action and transitions to idle state when catch_pre times out.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (catch)(inst)`
* **Description:** Stops locomotion, plays catch animation, plays boomerang catch sound, and pauses prediction via playercontroller if available.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (attack_pillow_pre)(inst)`
* **Description:** Stops locomotion, plays pillow attack pre-animation, pushes hold animation loop, faces buffered action target if valid, and sets timeout based on pillow lag length or 1.0 second default.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.components.inventory is nil - no nil guards present

### `ontimeout (attack_pillow_pre)(inst)`
* **Description:** Transitions to attack_pillow state when pre-attack timeout expires.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil

### `onenter (attack_pillow)(inst)`
* **Description:** Stops locomotion, plays pillow attack animation, plays whoosh sound, and pauses prediction if playercontroller component exists.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil - no nil guard present

### `onenter (attack_prop_pre)(inst)`
* **Description:** Stops locomotion, plays prop attack pre-animation, and faces buffered action target if valid.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil - no nil guard present

### `onenter (attack_prop)(inst)`
* **Description:** Stops locomotion, plays prop attack animation, plays whoosh sound, and pauses prediction if playercontroller component exists.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor is nil - no nil guard present

### `onenter (run)(inst)`
* **Description:** Configures run state, determines animation based on transformation state (teeter becomes teeter_loop, run/run_woby become loop variants), adds teetering state tag if applicable, plays looping animation, and sets timeout based on animation length.
* **Parameters:**
  - `inst` -- entity owning the stategraph
* **Returns:** nil
* **Error states:** Errors if inst.components.locomotor or inst.AnimState is nil - no nil guard before method access.

## Events & listeners

**Listens to:**
- `onremove` — Listened on targetfx entity in OnRemoveCleanupTargetFX to cleanup FX on removal
- `locomote` — Triggered when movement state changes
- `blocked` — Triggered when movement is blocked
- `coach` — Triggered by coach interaction
- `attacked` — Triggered when entity takes damage
- `snared` — Triggered when entity is snared
- `startled` — Triggered when entity is startled
- `repelled` — Triggered when entity is repelled
- `knockback` — Handles knockback reactions, checking for wereplayer, shielding, parrying, or heavy armor to determine state transition.
- `souloverload` — Triggers talk announcement and hit state on soul overload if not dead, sleeping, drowning, or falling.
- `mindcontrolled` — Transitions to mindcontrolled state if not busy or dead.
- `devoured` — Transitions to devoured state if not dead and attacker is valid.
- `suspended` — Transitions to suspended state if not dead, riding, and attacker is valid and alive.
- `feetslipped` — Transitions to slip state if running and not noslip.
- `set_heading` — Sets steering memory and transitions to steer_boat_turning state if not busy, dead, or turning wheel.
- `consumehealthcost` — Transitions to hit state on health cost consumption if not crafting-interrupted or dead.
- `equip` — Handles equipment changes, triggering heavy lifting, mount, catch, or item states based on slot and tags.
- `unequip` — Handles unequipment, triggering heavy lifting stop or item states based on slot and tags.
- `death` — Wakes up sleeping bag if active, then transitions to corpse or death state based on cause and revival status.
- `ontalk` — Triggers acting, talk, mime, or closeinspect states based on acting status, tags, and talk parameters.
- `silentcloseinspect` — Transitions to closeinspect state if idle and not talking, riding, lifting, or channeling.
- `powerup_wurt` — Transitions to powerup_wurt state if not dead.
- `powerdown_wurt` — Transitions to powerdown_wurt state if not dead.
- `powerup` — Stops dumbbell lifting if active and transitions to powerup state if not dead.
- `powerdown` — Transitions to powerdown state if not dead.
- `wx78_spark` — Transitions to hit state if not nointerrupt or floating.
- `becomeyounger_wanda` — Transitions to becomeyounger_wanda state if idle.
- `becomeolder_wanda` — Transitions to becomeolder_wanda state if idle.
- `onsink` — Transitions to sink or sink_fast state if not dead, drowning, floating, and drownable check passes.
- `onfallinvoid` — Transitions to weregoose_takeoff or abyss_fall state if not dead, falling, and fall-in-void check passes.
- `transform_wereplayer` — Transitions to transform_wereplayer state if not transforming, wereplayer, and wereness percent is greater than 0.
- `transform_person` — Transitions to transform mode person state if not transforming and is wereplayer.
- `toolbroke` — Transitions to toolbroke state if not nointerrupt.
- `armorbroke` — Transitions to armorbroke state if not nointerrupt tag
- `fishingcancel` — Transitions to fishing_pst state if fishing and not busy
- `knockedout` — Handles knockout state transitions, queues post-land state if jumping
- `yawn` — Transitions to yawn state if not dead, sleeping, frozen, or pinned
- `emote` — Transitions to emote state with multiple conditions for mount, transformation, and ownership validation
- `pinned` — Transitions to pinned_pre state if pinnable, or calls Unstick if already stuck
- `freeze` — Transitions to frozen state if not dead
- `wonteatfood` — Transitions to refuseeat state if not dead and not floating
- `ms_opengift` — Transitions to opengift state if not busy
- `dismount` — Transitions to dismount state if riding and not dismounting
- `bucked` — Transitions to falloff or bucked state based on gentle flag if riding
- `feedmount` — Transitions to mount_eat state if eater matches current mount
- `oceanfishing_stoppedfishing` — Handles ocean fishing stop with different states based on reason (linesnapped, toofaraway, linetooloose, badcast, gotaway)
- `spooked` — Transitions to spooked state if not busy, dead, riding, or wearing spook protection (Hallowed Nights)
- `feastinterrupted` — Transitions to idle state if feasting (Winter's Feast)
- `singsong` — Transitions to singsong state if not dead and not busy
- `yotb_learnblueprint` — Transitions to research state if not dead
- `hideandseek_start` — Transitions to hideandseek_counting state with multiple conditions for busy, sleeping, lifting, riding, and transformation tags
- `perform_do_next_line` — Handles acting states (mime, idle, action, talk) based on tags and data
- `acting` — Handles bow or curtsy acting if not dead
- `startstageacting` — Transitions to acting_idle state if not dead
- `monkeycursehit` — Handles curse receiving or removal with hit or hit_spike state transitions
- `pillowfight_ended` — Transitions to happy or angry emote based on win/loss result
- `ms_closeportablestorage` — Calls ClosePocketRummageMem for the storage item
- `woby_showrack` — Transitions to woby_rack_appear state if idle and riding
- `recoil_off` — Returns to stored recoilstate with target data
- `predict_gallop_trip` — Triggered when gallop stick trip prediction is needed for network reconciliation
- `animover` — Multiple states listen for animation completion to transition to idle or next state
- `animqueueover` — Triggers transition to idle when animation queue is done (electrocute state)
- `stormlevel` — Transitions to idle state when sandstorm level changes below threshold and not ignoring sandstorm
- `miasmalevel` — Transitions to idle state when miasma level changes below threshold and not ignoring sandstorm
- `stopchannelcast` — Ends channel casting animation and returns to idle when not actively channel casting
- `startteetering` — Triggers idle state when teetering begins if not already teetering and not ignoring sandstorm
- `stopteetering` — Plays teeter post animation and returns to idle when teetering stops
- `donetalking` — Handles talk completion during bow state via OnDoneTalking_Override handler
- `combat_parry` — Sets up parry state when parry event fires during parry_pre
- `fishingnibble` — Transitions to fishing_nibble state when fish nibbles (fishing).
- `fishingstrain` — Transitions to fishing_strain state when fish strains (fishing_nibble).
- `fishingcatch` — Transitions to catchfish state with build data when fish is caught (fishing_strain).
- `fishingloserod` — Transitions to loserod state when rod is lost (fishing_strain).
- `queue_post_eat_state` — Queues a post-eat state transition and optionally adds nointerrupt tag (eat).
- `firedamage` — Interrupts gift/wardrobe states on fire damage
- `ms_doneopengift` — Validates wardrobe transition after gift opening
- `ms_closepopup` — Closes cookbook or plant registry popup based on data
- `ms_endpumpkincarving` — Ends pumpkin carving state and transitions to idle
- `ms_endsnowmandecorating` — Ends snowman decorating state and transitions to idle.
- `ms_endplayingbalatro` — Ends Balatro playing state and transitions to idle.
- `ms_slingshotmodsclosed` — Closes slingshot mods state if moddingslingshot tag is present.
- `stopliftingdumbbell` — Triggers queue_stop flag or immediate idle transition during dumbbell lifting states
- `interruptcontinuousaction` — Triggers in finishcontinuousaction state to kill sound, play build_pst, and go to idle if target matches statemem target
- `catch` — Transitions from catch_pre to catch state when catch event fires.
- `cancelcatch` — Clears buffered action and returns to idle when catch is cancelled.
- `gogglevision` — Triggers state transitions based on goggle vision enabled/disabled state
- `carefulwalking` — Triggers state transitions based on careful walking toggle
- `stopfurling` — Triggers sail furling stop state
- `joust_collide` — Triggers joust collision state
- `on_washed_ashore` — Triggers washed ashore state after drowning
- `spitout` — Handles being spat out after being devoured or suspended
- `abouttospit` — Handles about to be spit event during suspended state
- `onthaw` — Triggers thaw state when frozen entity begins thawing
- `unfreeze` — Triggers hit state when frozen entity is unfrozen
- `onunpin` — Triggers breakfree state when unpinned
- `becomeunsittable` — Triggers jumpoff state when chair becomes unsittable
- `pushable_targetswap` — Updates target reference during pushing walk
- `ms_enterbathingpool` — Triggers soakin_jump state when entering bathing pool
- `ms_leavebathingpool` — Triggers soakin_jumpout state when leaving bathing pool
- `ms_overridelocomote_click` — Handles locomote click override during soaking
- `unplugmodule` — Triggers unplug_module state for WX78 module removal
- `socketholder_unsocket` — Triggers unplug_module state for socket unsocketing
- `stopinspectingmodule` — Triggers stop states for WX78 module inspection
- `newactiveitem` — Triggers state transitions when active item changes
- `controller_removing_module` — Triggers removing_module state from controller input
- `controller_plugging_module` — Triggers plugging_module state from controller input
- `magicianstopped` — Triggers idle state when magician tool use stops unexpectedly
- `performaction` — Handles perform action events during various states
- `attackbutton` — Handles attack button press during drone control
- `chargingreticulecancelled` — Triggers idle state when charging reticule is cancelled
- `chargingreticulereleased` — Triggers slingshot_special2 state when charging reticule is released
- `begin_retrieving` — Triggers cast_net_retrieving state
- `begin_final_pickup` — Triggers cast_net_release state
- `newfishingtarget` — Handles new fishing target acquisition
- `stop_steering_boat` — Triggers idle state when boat steering stops
- `playerstopturning` — Triggers steer_boat_turning_pst state
- `stopraisinganchor` — Triggers idle state when anchor raising stops
- `cometo` — Triggers wakeup state during knockout
- `vault_teleport` — Triggers vault_teleport state during channeling
- `actionfailed` — Handles action failure during various states
- `cancelhop` — Triggers hop_cancelhop state
- `onhop` — Triggers float_hop_pre state
- `feasterfinished` — Pushed when winter's feast eating finishes
- `dancingplayer` — Pushed to world when player starts dancing
- `dancingplayerdata` — Pushed to world with dance animation data
- `soulhop` — Pushed during Wortox soul hop
- `onwarpback` — Pushed after Wanda pocketwatch warpback completes
- `playersuspended` — Pushed to attacker when player is suspended
- `suspendedplayerdied` — Pushed to attacker when suspended player dies
- `knockbackdropped` — Pushed when item is dropped during knockback
- `superjumpstarted` — Pushed to weapon when superjump starts
- `superjumpcancelled` — Pushed to weapon when superjump is cancelled
- `dropallaggro` — Pushed during superjump to drop aggro
- `startghostbuildinstate` — Pushed when ghost build starts in rebirth state
- `stopghostbuildinstate` — Pushed when ghost build stops in rebirth state
- `invincibletoggle` — Pushed when health invincibility toggles
- `moisturedelta` — Pushed when moisture changes
- `encumberedwalking` — Pushed during heavy lifting walk cycle
- `gotosleep` — Pushed when entity goes to sleep
- `dismounted` — Pushed when entity dismounts
- `becomesittable` — Pushed when chair becomes sittable
- `startlongaction` — Pushed to anchor target when raising starts
- `stopconstruction` — Triggers idle state when construction stops
- `stopchanneling` — Handles channeling stop
- `teleportato_teleport` — Used for teleportato teleportation state
- `ms_playerdespawnandmigrate` — Pushed to world for shard migration
- `ms_sync_chair_rocking` — Pushed to chair for rocking chair sync
- `ondash_woby` — Pushed to mount during Woby dash
- `captured` — Pushed to target when captured by pounce or divegrab

**Pushes:**
- `ms_closepopups` — Pushed in SetSleeperSleepState when entity goes to sleep
- `attacked` — Pushed to collision target in TryGallopCollideUpdate with attacker and 0 damage
- `knockback` — PushedImmediate to collision target in TryGallopCollideUpdate with knocker, forcelanded, radius, and strengthmult
- `wonteatfood` — Pushed when eater/souleater component rejects food in ACTIONS.EAT handler.
- `feasterstarted` — Pushed to TheWorld when WINTERSFEAST_FEAST action is performed and inst does not have 'feasting' state tag
- `makeplayerghost` — Pushed when ghostenabled is true and player should become a ghost, includes skeleton flag
- `playerdied` — Pushed when player dies without ghost enabled, includes skeleton flag
- `startlongaction` — Pushed to buffered action target when dolongaction state begins
- `startcontinuousaction` — Pushed to target entity in startcontinuousaction onenter when buffered action has valid target
- `actionfailed` — Pushed in shave state onenter when shave validation fails, includes action and reason
- `stopcontinuousaction` — Pushed to target entity in finishcontinuousaction, dostorytelling, and dostorytelling_loop onexit handlers
- `fail_fx` — Pushed on book_fx entity when buffered action fails in book casting state
- `propsmashed` — Pushed to prop entity onexit with smash position data
- `performaction` — Pushed when action needs to be performed or re-performed
- `feasterfinished` — Pushed when winter's feast eating finishes
- `dancingplayer` — Pushed to world when player starts dancing
- `dancingplayerdata` — Pushed to world with dance animation data
- `soulhop` — Pushed during Wortox soul hop
- `onwarpback` — Pushed after Wanda pocketwatch warpback completes
- `onsink` — Pushed to mount when player sinks
- `playersuspended` — Pushed to attacker when player is suspended
- `suspendedplayerdied` — Pushed to attacker when suspended player dies
- `knockbackdropped` — Pushed when item is dropped during knockback
- `superjumpstarted` — Pushed to weapon when superjump starts
- `superjumpcancelled` — Pushed to weapon when superjump is cancelled
- `dropallaggro` — Pushed during superjump to drop aggro
- `startghostbuildinstate` — Pushed when ghost build starts in rebirth state
- `stopghostbuildinstate` — Pushed when ghost build stops in rebirth state
- `invincibletoggle` — Pushed when health invincibility toggles
- `moisturedelta` — Pushed when moisture changes
- `encumberedwalking` — Pushed during heavy lifting walk cycle
- `gotosleep` — Pushed when entity goes to sleep
- `unfreeze` — Pushed when entity is unfrozen
- `onunpin` — Pushed when entity is unpinned
- `dismounted` — Pushed when entity dismounts
- `becomesittable` — Pushed when chair becomes sittable
- `becomeunsittable` — Pushed when chair becomes unsittable
- `stopconstruction` — Pushed when construction stops
- `ms_sync_chair_rocking` — Pushed to chair for rocking chair sync
- `ondash_woby` — Pushed to mount during Woby dash
- `captured` — Pushed to target when captured by pounce or divegrab
- `locomote` — Pushed for locomotion events
- `starttravelsound` — Pushed to teleporter target when travel sound should start
- `feetslipped` — Pushed when slippery feet threshold is met
- `colourtweener_start` — Pushed when colour tween starts
- `colourtweener_end` — Pushed when colour tween ends
- `stopfurling` — Pushed when sail furling stops
- `joust_collide` — Pushed when joust collision occurs
- `ontalk` — Pushed when talking starts
- `donetalking` — Pushed when talking completes
- `animqueueover` — Pushed when animation queue completes
- `onburnt` — Listened to during sail furling for burnt mast
- `on_washed_ashore` — Pushed when washed ashore after drowning
