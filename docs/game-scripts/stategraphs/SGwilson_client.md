---
id: SGwilson_client
title: Sgwilson Client
description: This stategraph defines client-side animation states, movement prediction, action handlers, and event listeners for the Wilson player character including combat, locomotion, special transformations, and channel casting mechanics.
tags: [stategraph, player, locomotion, actions, combat]
sidebar_position: 10

last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: 9dc57abe
system_scope: locomotion
---

# Sgwilson Client

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`SGwilson_client.lua` defines the client-side stategraph for the Wilson player character in Don't Starve Together. This stategraph manages all player animation states including idle, running, galloping, monkey movement, and Woby sprint states. It handles action states for chopping, mining, hammering, fishing, attacking, and spell casting. The stategraph includes special character transformation states for Wolfgang gym activities, WX78 drone/shield/screech mechanics, and Maxwell tophat usage. It also manages floating and boat states with associated event handlers, timelines, and transition logic. Client-side prediction is handled through RPC calls to the server for movement synchronization, with speed multipliers adjusted based on equipment, skills, and environmental conditions.

## Usage example
This stategraph is assigned automatically to Wilson players via the prefab definition. Stategraphs in DST are not instantiated directly by users — they are defined in Lua files and referenced by name in prefab registration.

```lua
-- Stategraph file (stategraphs/SGwilson_client.lua) returns StateGraph object
return StateGraph("wilson_client", states, events, "init", actionhandlers)

-- In prefab definition (e.g., prefabs/wilson.lua), the stategraph name is referenced
Prefab("wilson", function(inst)
    -- Components are added
    inst:AddComponent("locomotor")
    inst:AddComponent("playercontroller")
    inst:AddComponent("soundemitter")
    inst:AddComponent("animstate")
    
    -- Stategraph name is set via AddStateGraphTag or similar prefab registration
    -- The actual stategraph assignment happens through the prefab's stategraph field
end)

-- State transitions occur automatically via events and action handlers
-- No direct API calls to stategraph functions are needed
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- Required for common state definitions and hop/row states
- `easing` -- Required for animation easing functions
- `prefabs/player_common_extensions` -- Required for player common extension functions including gallop speed calculations
- `stategraphs/SGwx78_common` -- Required for WX78 spin pickable tags
- `prefabs/wx78_common` -- Required for WX78 CanSpinUsingItem function

**Components used:**
- `locomotor` -- RemovePredictExternalSpeedMultiplier and SetPredictExternalSpeedMultiplier for channel cast speed modification
- `playervision` -- HasGoggleVision to check storm/cloud visibility conditions
- `skilltreeupdater` -- IsActivated to check walter_woby_sprint skill activation
- `playercontroller` -- Called for RemotePredictOverrideLocomote(), RemotePredictWalking(), RemoteStopWalking(), GetPlatformRelativePosition(), IsAnyOfControlsPressed()
- `playerspeedmult` -- Called for SetPredictedSpeedMult(), RemovePredictedSpeedMult(), SetCappedPredictedSpeedMult(), RemoveCappedPredictedSpeedMult()
- `embarker` -- Accessed for embark_speed property and embarkable reference in hop states
- `soundemitter` -- Called for PlaySound(), PlaySoundWithParams(), KillSound(), PlayingSound()
- `animstate` -- Called for PlayAnimation(), PushAnimation(), SetFrame(), SetTime(), AnimDone(), IsCurrentAnimation(), GetCurrentAnimationFrame(), GetCurrentAnimationLength(), OverrideSymbol(), OverrideItemSkinSymbol(), Show(), Hide(), SetBank()
- `transform` -- Called for SetRotation(), GetRotation(), GetWorldPosition(), SetPredictedSixFaced(), SetPredictedEightFaced(), SetPredictedNoFaced(), ClearPredictedFacingModel()
- `physics` -- Called for Stop(), SetMotorVel(), Teleport(), GetMotorSpeed(), StopMoving()
- `entity` -- Called for CanPredictMovement(), SetIsPredictingMovement(), FlattenMovementPrediction(), ClearMovementPrediction()

**Replica components used:**
- `replica.inventory` -- GetEquips, IsHeavyLifting, EquipHasTag, GetEquippedItem for equipment and item state checks
- `replica.rider` -- GetSaddle, GetMount, IsRiding for mount state queries; rider.replica.container for mount container access
- `replica.combat` -- Accessed to retrieve the current weapon entity
- `replica.equippable` -- Accessed via action.invobject.replica.equippable to check equip slot
- `replica.container` -- Accessed on targets or mounts to check if opened by the inst

**Classified components used:**
- `player_classified` -- currentstate:set_local for clearing cached server state
- `woby_commands_classified` -- ShouldSprint for woby sprint capability check

**Stategraph memory:**
- `sg` -- State memory access for footsteps counter, preview_channelcast_task, statemem flags; inst.sg:HasStateTag() for state tag checks

**Action target components:**
- `socketable` -- Accessed via action.invobject.components.socketable to check socket name
- `snowmandecoratable` -- Accessed via action.invobject.components.snowmandecoratable to identify snowman decoration items
- `socketholder` -- Accessed via action.target.components.socketholder to validate socket target for module plugging

**Tags:**
- `groggy` -- check
- `woby` -- check
- `mightiness_mighty` -- check
- `wereplayer` -- check
- `weremoose` -- check
- `weregoose` -- check
- `wonkey` -- check
- `teetering` -- check
- `pyromaniac` -- check
- `quagmire_fasthands` -- check
- `aspiring_bookworm` -- check
- `farmplantfastpicker` -- check
- `woodiequickpicker` -- check
- `fastpicker` -- check
- `scientist` -- check
- `handyperson` -- check
- `hungrybuilder` -- check
- `fastbuilder` -- check
- `slowbuilder` -- check
- `expertchef` -- check
- `beaver` -- check
- `gnawing` -- check
- `prespin` -- check
- `prechop` -- check
- `premine` -- check
- `prehammer` -- check
- `predig` -- check
- `prenet` -- check
- `netting` -- check
- `fishing_idle` -- check
- `partiallyhooked` -- check
- `nabbag` -- check
- `slowfertilize` -- check
- `repairshortaction` -- check
- `simplebook` -- check
- `graveplanter` -- check
- `projectile` -- check
- `inventoryitemholder_take` -- check
- `noquickpick` -- check
- `farm_plant` -- check
- `pickable` -- check
- `quickpick` -- check
- `quickrummage` -- check
- `searchable` -- check
- `jostlesearch` -- check
- `quicksearch` -- check
- `jostlepick` -- check
- `jostlerummage` -- check
- `standingactivation` -- check
- `quickactivation` -- check
- `engineering` -- check
- `gallopstick` -- check
- `fullhelm_hat` -- check
- `yeehaw` -- check
- `heavy` -- check
- `portablestorage` -- check
- `fasthealer` -- check
- `quickeat` -- check
- `sloweat` -- check
- `fooddrink` -- check
- `moonportal` -- check
- `moonportalkey` -- check
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
- `willow_ember` -- check
- `remotecontrol` -- check
- `abigail_flower` -- check
- `slingshot` -- check
- `aoeweapon_lunge` -- check
- `aoeweapon_leap` -- check
- `superjump` -- check
- `parryweapon` -- check
- `blowdart` -- check
- `throw_line` -- check
- `recall_unmarked` -- check
- `pocketwatch_warp_casting` -- check
- `soulstealer` -- check
- `INLIMBO` -- check
- `keep_equip_toss` -- check
- `special_action_toss` -- check
- `constructionsite` -- check
- `use_channel_longaction` -- check
- `quagmire_farmhand` -- check
- `waxspray` -- check
- `slingshotmodkit` -- check
- `wx_remotecontroller` -- check
- `yotb_stage` -- check
- `plantkin` -- check
- `elixir_drinker` -- check
- `liftingdumbbell` -- check
- `wx_screeching` -- check
- `wx_shielding` -- check
- `unsummoning_spell` -- check
- `inspectingupgrademodules` -- check
- `socket_shadow` -- check
- `useabletargateditem_canselftarget` -- check
- `busy` -- check
- `idle` -- check
- `moving` -- check
- `running` -- add
- `canrotate` -- add
- `overridelocomote` -- add/remove/check
- `floating` -- add/check
- `floating_predict_move` -- add/remove/check
- `boathopping` -- check
- `ingym` -- check
- `exiting_gym` -- add
- `sleeping` -- check
- `waking` -- check
- `nopredict` -- check
- `pausepredict` -- check
- `monkey` -- add/check
- `monkey_predict_run` -- add
- `galloping` -- add/check
- `gallop_predict_run` -- add
- `sprint_woby` -- add/check
- `force_sprint_woby` -- check
- `working` -- add
- `preparrying` -- add
- `prefish` -- add
- `fishing` -- add/check
- `doing` -- add
- `reeling` -- add
- `giving` -- add
- `igniting` -- add
- `waxing` -- add
- `lifting_dumbbell` -- add
- `tent` -- add
- `attack` -- add/remove/check
- `notalking` -- add
- `abouttoattack` -- add/remove/check
- `propattack` -- add
- `feasting` -- add
- `nodragwalk` -- add
- `overrideattack` -- add
- `nopredict_client` -- add/remove
- `using_drone_remote` -- check
- `usingmagiciantool` -- check
- `usingmagiciantool_wasequipped` -- check
- `sitting_on_chair` -- check
- `limited_chair` -- check
- `rocking_chair` -- check
- `cansit` -- check
- `burnt` -- check
- `noswim` -- check
- `drowning` -- add
- `is_using_steering_wheel` -- add
- `is_using_cannon` -- add
- `channeling` -- add
- `prechanneling` -- add
- `aoecharging` -- add
- `readytocatch` -- add
- `nointerrupt` -- add
- `woodcutter` -- check
- `mime` -- check
- `canrepeatcast` -- check
- `shield` -- check
- `whip` -- check
- `pocketwatch` -- check
- `jab` -- check
- `lancejab` -- check
- `light` -- check
- `nopunch` -- check
- `punch` -- check
- `toolpunch` -- check
- `chop_attack` -- check
- `complexprojectile` -- check
- `rangedweapon` -- check
- `icestaff` -- check
- `firestaff` -- check
- `firepen` -- check
- `shadow` -- check
- `shadow_item` -- check
- `ammoloaded` -- check
- `channelingfan` -- check
- `upgrademoduleremover` -- check
- `DIG_tool` -- check
- `teeteringplatform` -- check

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions

## Key States

### State: `idle`
* **Tags:** `idle`, `canrotate`
* **Description:** Default idle state with prediction handling. Plays idle_loop animation or context-specific idles (riding, wereplayer, heavy lifting, channel casting, sandstorm, teetering). Handles timeout for clearing preview buffered actions.
* **Transitions:** Entered from init, run_stop, previewaction timeout, or when movement stops. Exits to run_start on locomote event when wants to move.
* **Error states:** None

### State: `run_start`
* **Tags:** `moving`, `running`, `canrotate`
* **Description:** Initial run state that configures run state memory and plays appropriate _pre animation. Handles special cases for galloping, monkey running, and Woby sprint transitions based on time moving.
* **Transitions:** Entered from idle on locomote. Exits to run on animover or to run_gallop/run_monkey/sprint_woby based on conditions.
* **Error states:** None

### State: `run`
* **Tags:** `moving`, `running`, `canrotate`
* **Description:** Main running state with looped animation. Contains extensive timeline events for footstep and foley sounds based on state (normal, careful, sandstorm, groggy, mounted, moose, goose, heavy lifting). Handles state transitions based on movement time and conditions.
* **Transitions:** Entered from run_start on animover. Loops via ontimeout. Exits to run_start variants when conditions change.
* **Error states:** None

### State: `run_stop`
* **Tags:** `canrotate`, `idle`
* **Description:** Run stopping state that plays appropriate _pst animation based on run state. Handles special cases for Woby sprint, monkey running, and galloping transitions.
* **Transitions:** Entered from run when movement stops. Exits to idle on animover.
* **Error states:** None

### State: `run_monkey` / `run_monkey_start`
* **Tags:** `moving`, `running`, `canrotate`, `monkey`, `monkey_predict_run`
* **Description:** Wonkey monkey running states with six-faced prediction model. Applies speed multiplier based on wonkey bonuses. Transitions based on time moving threshold.
* **Transitions:** run_monkey_start enters from run when time moving exceeds threshold. run_monkey loops via ontimeout.
* **Error states:** None

### State: `run_gallop` / `run_gallop_start`
* **Tags:** `moving`, `running`, `canrotate`, `galloping`, `gallop_predict_run`
* **Description:** Galloping states when using gallopstick. Applies capped predicted speed multiplier. Handles trip detection from rotation stress. Plays horseshoe sounds.
* **Transitions:** run_gallop_start enters from run when time moving exceeds threshold. run_gallop loops via ontimeout with state data preservation.
* **Error states:** None

### State: `sprint_woby` / `sprint_woby_start`
* **Tags:** `moving`, `running`, `canrotate`, `sprint_woby`
* **Description:** Woby sprint states for Walter riding Woby with skill activation. Applies sprint speed with endurance bonus. Enables sprint trail effect.
* **Transitions:** sprint_woby_start enters from run when time moving exceeds threshold and canwobysprint. sprint_woby loops via ontimeout.
* **Error states:** None

### State: `attack`
* **Tags:** `attack`, `notalking`, `abouttoattack`
* **Description:** Main combat attack state. Handles weapon-specific animations (melee, projectile, whip, pocketwatch, book, chop, jab, lancejab). Manages attack cooldowns and projectile delays. Faces attack target.
* **Transitions:** Entered from ATTACK action handler. Exits to idle on timeout or animqueueover. Handles chained attacks.
* **Error states:** None

### State: `throw`
* **Tags:** `attack`, `notalking`, `abouttoattack`
* **Description:** Throwing projectile attack state. Starts combat attack and plays throw animation. Faces throw target.
* **Transitions:** Entered from TOSS action. Exits to idle on timeout or animqueueover.
* **Error states:** None

### State: `blowdart`
* **Tags:** `attack`, `notalking`, `abouttoattack`
* **Description:** Blowdart attack state with chained attack support. Handles projectile delay timing. Faces blowdart target.
* **Transitions:** Entered from ATTACK with blowdart/pipe weapon. Exits to idle on timeout or animqueueover.
* **Error states:** None

### State: `slingshot_shoot`
* **Tags:** `attack`
* **Description:** Slingshot shooting state. Handles ammo loaded checks and retarget tracking. Faces slingshot target.
* **Transitions:** Entered from ATTACK with slingshot weapon. Exits to idle when ammo depleted or on timeout.
* **Error states:** None

### State: `fishing` / `fishing_pre`
* **Tags:** `prefish`, `fishing` (fishing_pre); `fishing` (fishing)
* **Description:** Fishing states for rod fishing. fishing_pre plays pre animation and waits for server confirmation. fishing is the active fishing state with prediction flattened.
* **Transitions:** fishing_pre entered from FISH action. Transitions to fishing on server match. Exits to idle on timeout.
* **Error states:** None

### State: `oceanfishing_cast` / `oceanfishing_reel` / `oceanfishing_sethook`
* **Tags:** `prefish`, `fishing` (cast); `fishing`, `doing`, `reeling`, `canrotate` (reel); `fishing`, `doing`, `busy` (sethook)
* **Description:** Ocean fishing states for casting, reeling, and setting hook. Reel state adjusts animation based on line tension (loose, good, tight).
* **Transitions:** Entered from OCEAN_FISHING actions. Exits to idle on timeout or server match.
* **Error states:** None

### State: `castspell` / `quickcastspell` / `veryquickcastspell` / `castspellmind`
* **Tags:** `doing`, `busy`, `canrotate`
* **Description:** Spell casting states with varying speeds. castspell uses staff animation, castspellmind uses pyrocast for mind-based spells. Quick variants use attack animations.
* **Transitions:** Entered from CASTSPELL/CASTAOE actions. Exits to idle on timeout.
* **Error states:** None

### State: `summon_abigail` / `unsummon_abigail` / `commune_with_abigail`
* **Tags:** `doing`, `busy`, `canrotate` (summon); `doing`, `busy` (unsummon/commune)
* **Description:** Wendy's Abigail flower states. Override flower symbol based on skin. summon uses wendy_channel, unsummon uses wendy_recall, commune uses wendy_commune animations.
* **Transitions:** Entered from CASTSUMMON/CASTUNSUMMON/COMMUNEWITHSUMMONED actions. Exits to idle on timeout.
* **Error states:** None

### State: `chop_start` / `mine_start` / `hammer_start` / `dig_start`
* **Tags:** `prechop`/`premine`/`prehammer`/`predig`, `working`
* **Description:** Resource gathering states. Play tool-specific pre animations (chop_pre, pickaxe_pre, shovel_pre) with lag fallback for prediction. Perform preview buffered action.
* **Transitions:** Entered from CHOP/MINE/HAMMER/DIG actions. Exits to idle on timeout or server match.
* **Error states:** None

### State: `give` / `doshortaction` / `domediumaction` / `dolongaction` / `dostandingaction`
* **Tags:** `giving` (give); `doing`, `busy` (action states)
* **Description:** Generic action states for various interactions. give plays give animation. dolongaction plays build animation with preview sound. dohungrybuild/domediumaction/dowoodiefastpick/dolongestaction redirect to dolongaction.
* **Transitions:** Entered from various action handlers. Exits to idle on timeout.
* **Error states:** None

### State: `eat` / `quickeat`
* **Tags:** `busy`
* **Description:** Eating states. eat plays eat_pre/eat_lag for slow food. quickeat plays quick_eat_pre or quick_drink_pre based on fooddrink tag.
* **Transitions:** Entered from EAT action. Exits to idle on timeout.
* **Error states:** None

### State: `sitting` / `start_sitting` / `stop_sitting` / `sit_jumpoff`
* **Tags:** `overridelocomote`, `canrotate` (sitting); `busy` (start/stop/jumpoff)
* **Description:** Sitting states for chairs. start_sitting plays sit_pre and transitions to sitting. sitting overrides locomote and handles rotation. stop_sitting plays sit_off. sit_jumpoff flattens prediction.
* **Transitions:** start_sitting entered from SITON action. sitting entered from start_sitting on server match. stop_sitting entered on locomote from sitting.
* **Error states:** None

### State: `float` / `float_action` / `float_eat` / `float_quickeat`
* **Tags:** `overridelocomote`, `canrotate`, `floating` (float); `doing`, `busy`, `floating` (float_action); `busy`, `floating` (float_eat/quickeat)
* **Description:** Floating states for when holding floater item. float handles swimming prediction with easing. float_action/float_eat/float_quickeat are floating variants of action states.
* **Transitions:** float entered from init or float_action timeout. Exits to idle when not holding floater.
* **Error states:** None

### State: `wx_using_drone` / `wx_start_using_drone`
* **Tags:** `doing`, `overridelocomote`, `nodragwalk`, `overrideattack` (using); `doing`, `busy` (start)
* **Description:** WX78 drone remote control states. Overrides locomote to control drone movement. Checks for wx_remotecontroller equipped item.
* **Transitions:** wx_start_using_drone entered from USEEQUIPPEDITEM. Transitions to wx_using_drone on server match.
* **Error states:** None

### State: `wx_screech_pre` / `wx_screech_pst` / `wx_shield_pre` / `wx_shield_pst`
* **Tags:** `doing`, `busy` (pre); `idle`, `canrotate` (pst)
* **Description:** WX78 screech and shield toggle states. pre states play activation animations. pst states play deactivation animations with inverted server match logic.
* **Transitions:** Entered from TOGGLEWXSCREECH/TOGGLEWXSHIELDING actions. Exits to idle on timeout.
* **Error states:** None

### State: `wx_spin_start`
* **Tags:** `prespin`, `working`, `busy`
* **Description:** WX78 spin attack state. Plays chop animation. Handles target facing. Removes busy tag when controls released. Exits early on movement input.
* **Transitions:** Entered from ATTACK/CHOP/MINE with spin module. Exits to idle on timeout or movement.
* **Error states:** None

### State: `start_plugging_module` / `plugging_module` / `stop_plugging_module`
* **Tags:** `doing`, `busy` (start); `doing`, `overridelocomote` (plugging); `busy` (stop)
* **Description:** WX78 upgrade module plugging states. plugging_module overrides locomote for inspection mode. Handles controller vs keyboard input for mode switching.
* **Transitions:** start_plugging_module entered from APPLYMODULE. Transitions to plugging_module on server match. stop_plugging_module entered on locomote.
* **Error states:** None

### State: `start_removing_module` / `removing_module` / `stop_removing_module`
* **Tags:** `doing`, `busy` (start); `doing`, `overridelocomote` (removing); `busy` (stop)
* **Description:** WX78 upgrade module removal states. Similar to plugging but uses useitem/wx_downgrade animations. Handles active item changes for mode switching.
* **Transitions:** start_removing_module entered from STARTREMOVINGMODULE. Transitions to removing_module on server match.
* **Error states:** None

### State: `start_using_tophat` / `using_tophat` / `stop_using_tophat`
* **Tags:** `doing`, `busy` (start); `doing`, `overridelocomote` (using); `idle`, `overridelocomote` (stop)
* **Description:** Maxwell tophat magic tool states. start_using_tophat checks if hat is equipped for animation variant. using_tophat overrides locomote. stop_using_tophat handles locomotion interruption.
* **Transitions:** Entered from USEMAGICTOOL/STOPUSINGMAGICTOOL actions. using_tophat entered on server match.
* **Error states:** None

### State: `channel_longaction` / `start_channelcast` / `stop_channelcast`
* **Tags:** `doing`, `canrotate`, `channeling` (channel_longaction); `idle`, `canrotate` (channelcast states)
* **Description:** Channel casting states. channel_longaction for long channel actions. start_channelcast/stop_channelcast are instant actions with preview animations for channel cast toggle.
* **Transitions:** Entered from STARTCHANNELING/START_CHANNELCAST/STOP_CHANNELCAST actions. Preview channel cast managed via StartPreviewChannelCast/StopPreviewChannelCast.
* **Error states:** None

### State: `parry_pre`
* **Tags:** `preparrying`, `busy`
* **Description:** Parry state for shield or weapon parrying. Plays shieldparry or parry animation based on shield tag. Loops parry_pre for shield.
* **Transitions:** Entered from ATTACK with parryweapon. Exits to idle on timeout.
* **Error states:** None

### State: `dojostleaction`
* **Tags:** `doing`, `busy`
* **Description:** Jostle action state for various melee interactions. Handles whip, pocketwatch, jab, lancejab weapons with specific animations. Sets predicted facing for lancejab.
* **Transitions:** Entered from PICK/RUMMAGE with jostle tags. Exits to idle on timeout.
* **Error states:** None

### State: `use_inventory_item_busy` / `use_inventory_item_dir_busy` / `action_uniqueitem_busy`
* **Tags:** `doing`, `busy`
* **Description:** Generic inventory item usage states. use_inventory_item_dir_busy includes directional facing. action_uniqueitem_busy used for unique item actions (flute, horn, bell, whistle, cookbook, beef bell).
* **Transitions:** Entered from various action handlers via forward_server_states. Exits to idle on timeout.
* **Error states:** None

### State: `longaction_busy`
* **Tags:** `doing`, `busy`
* **Description:** Generic long action state used for pumpkin carving, slingshot mods, pocket rummage. Plays build animation with preview sound.
* **Transitions:** Entered from various actions via forward_server_states. Exits to idle on timeout.
* **Error states:** None

### State: `mighty_gym_lift` / `mighty_gym_exit`
* **Tags:** `busy` (lift); `exiting_gym` (exit)
* **Description:** Wolfgang gym states. mighty_gym_lift plays lift animation. mighty_gym_exit flattens prediction and sends RPC to server.
* **Transitions:** mighty_gym_lift entered from gym success/fail states. mighty_gym_exit entered on locomote from ingym.
* **Error states:** None

### State: `pouncecapture_pre` / `divegrab_pre`
* **Tags:** `busy`
* **Description:** Rifts 5 capture states. pouncecapture_pre for pounce capture. divegrab_pre for dive grab action.
* **Transitions:** Entered from POUNCECAPTURE/DIVEGRAB actions. Exits to idle on timeout.
* **Error states:** None

### State: `soakin_pre`
* **Tags:** `busy`, `canrotate`
* **Description:** Winter 2025 soak action state. Plays jump animation for soaking action.
* **Transitions:** Entered from SOAKIN action. Exits to idle on timeout.
* **Error states:** None

### `CheckPreviewChannelCastAction(inst)`
* **Description:** Callback function that stops preview channel cast if channel casting state matches the preview action intent (equality check: both casting with START_CHANNELCAST action, or both not casting with different action).
* **Parameters:**
  - `inst` -- Entity instance to check channel casting state
* **Returns:** None
* **Error states:** Errors if `inst.sg.mem.preview_channelcast_action` is nil when accessing .action property (no guard before nested access).

### `StopPreviewChannelCast(inst)`
* **Description:** Cancels the preview channel cast task, clears preview action memory, removes the performaction event callback, and removes the locomotor speed multiplier modifier.
* **Parameters:**
  - `inst` -- Entity instance to stop preview channel cast on
* **Returns:** None
* **Error states:** None

### `StartPreviewChannelCast(inst, buffaction)`
* **Description:** Sets up preview channel cast with appropriate speed multiplier based on action type (START_CHANNELCAST or STOP_CHANNELCAST), registers performaction event listener, and schedules timeout task.
* **Parameters:**
  - `inst` -- Entity instance to start preview channel cast on
  - `buffaction` -- Buffered action containing action type and invobject information
* **Returns:** None
* **Error states:** Errors if `inst.components.locomotor` is nil when setting speed multiplier.

### `IsChannelCasting(inst)`
* **Description:** Checks if entity is channel casting using preview action memory for client-side prediction, falls back to server state if no preview action exists.
* **Parameters:**
  - `inst` -- Entity instance to check channel casting state
* **Returns:** `boolean` -- true if channel casting, false otherwise
* **Error states:** None.

### `IsChannelCastingItem(inst)`
* **Description:** Checks if channel casting item is equipped using preview action memory for client-side prediction, falls back to server state if no preview action exists.
* **Parameters:**
  - `inst` -- Entity instance to check channel casting item state
* **Returns:** `boolean` -- true if channel casting item equipped, false otherwise
* **Error states:** None.

### `ConfigureRunState(inst)`
* **Description:** Configures run state memory flags based on current entity state including riding, heavy lifting, channel casting, wereplayer forms, storm conditions, teetering, groggy, and careful walking states.
* **Parameters:**
  - `inst` -- Entity instance to configure run state for
* **Returns:** None
* **Error states:** Errors if `inst.replica.rider`, `inst.replica.inventory`, or `inst.components.playervision` is nil when accessed.

### `GetRunStateAnim(inst)`
* **Description:** Determines appropriate run animation name based on configured run state memory flags including heavy lifting, channel casting, sandstorm, teetering, groggy, careful walking, and riding states.
* **Parameters:**
  - `inst` -- Entity instance to get run animation for
* **Returns:** `string` -- Animation name (e.g., "heavy_walk_fast", "channelcast_walk", "run")
* **Error states:** None.

### `ClearCachedServerState(inst)`
* **Description:** Clears locally cached server state by setting player_classified currentstate to 0, used to avoid false positives when repeating same action state.
* **Parameters:**
  - `inst` -- Entity instance to clear cached server state for
* **Returns:** None
* **Error states:** None

### `GetRockingChairStateAnim(inst, chair)`
* **Description:** Gets rocking chair animation name based on chair tags and equipped head item (yeehaw tag with/without fullhelm_hat determines rocking_hat vs rocking_smile).
* **Parameters:**
  - `inst` -- Entity instance using rocking chair
  - `chair` -- Chair entity to check tags on
* **Returns:** `string` -- Animation name ("rocking_hat", "rocking_smile", or "rocking")
* **Error states:** Errors if `chair` is nil when checking HasTag.

### `GetIceStaffProjectileSound(inst, equip)`
* **Description:** Gets ice staff projectile sound based on icestaff_coldness value (lvl2 for >2, standard for >1, default otherwise).
* **Parameters:**
  - `inst` -- Entity instance (unused in function body)
  - `equip` -- Equipped item to check icestaff_coldness on
* **Returns:** `string` -- Sound path for ice staff projectile
* **Error states:** None

### `DoEquipmentFoleySounds(inst)`
* **Description:** Plays foley sounds for all equipped items that have foleysound property defined.
* **Parameters:**
  - `inst` -- Entity instance to play equipment foley sounds for
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil when playing equipment foley sounds (no nil guard present in source).

### `DoFoleySounds(inst)`
* **Description:** Plays equipment foley sounds and entity foley sound if foleyoverridefn doesn't intercept. Uses conditional guards for foleyoverridefn and foleysound properties.
* **Parameters:**
  - `inst` -- Entity instance to play foley sounds for
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil when playing foley sound (no nil guard present in source).

### `DoMountedFoleySounds(inst)`
* **Description:** Plays equipment foley sounds and mount saddle foley sound if riding with saddle that has mounted_foleysound.
* **Parameters:**
  - `inst` -- Entity instance to play mounted foley sounds for
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil when playing mounted foley sound (no nil guard present in source).

### `DoRunSounds(inst)`
* **Description:** Plays footstep sounds with volume based on footsteps counter (full volume after 3 footsteps, otherwise increments counter). Assumes run state has been entered first which initializes footsteps counter in run_start onenter.
* **Parameters:**
  - `inst` -- Entity instance to play run sounds for
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil or if sg.mem.footsteps is uninitialized (function assumes run_start onenter has executed first).

### `PlayMooseFootstep(inst, volume, ispredicted)`
* **Description:** Plays moose-specific footstep sound at full volume plus standard footstep with specified volume.
* **Parameters:**
  - `inst` -- Entity instance to play moose footstep for
  - `volume` -- Volume parameter for standard footstep
  - `ispredicted` -- Boolean for prediction flag
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil.

### `DoMooseRunSounds(inst)`
* **Description:** Plays moose footstep sound at full volume and standard run sounds.
* **Parameters:**
  - `inst` -- Entity instance to play moose run sounds for
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil.

### `DoMountSound(inst, mount, sound)`
* **Description:** Plays mount sound from mount's sounds table if mount and sounds exist.
* **Parameters:**
  - `inst` -- Entity instance to play mount sound for
  - `mount` -- Mount entity with sounds table
  - `sound` -- Sound key to play from mount.sounds
* **Returns:** None
* **Error states:** Errors if `inst.SoundEmitter` is nil when playing mount sound (no nil guard present in source).

## Events & listeners
**Listens to:**
- `performaction` -- Listened for in StartPreviewChannelCast to monitor action state changes during channel cast preview
- `sg_cancelmovementprediction` -- Used in idle, sitting, float, sit_jumpoff states to handle prediction cancellation
- `sg_startfloating` -- Triggers transition to float state when entity starts floating
- `sg_stopfloating` -- Triggers transition to idle state when entity stops floating
- `locomote` -- Used across run, run_monkey, run_gallop, sprint_woby, plugging_module, removing_module, sitting, float, stop_sitting, stop_sitting_pst, using_tophat states to handle movement input and state transitions
- `animover` -- Used in run_start, run_stop, run_monkey_start, dostorytelling, attack, slingshot_shoot, blowdart, stop_removing_module, float states to handle animation completion
- `animqueueover` -- Used in attack, throw, blowdart, stop_removing_module states to handle animation queue completion
- `gogglevision` -- Used in run, run_monkey_start, run_monkey, run_gallop_start, run_gallop states to handle goggle vision toggle affecting sandstorm state
- `stormlevel` -- Used in run, run_monkey_start, run_monkey, run_gallop_start, run_gallop states to handle storm level changes
- `miasmalevel` -- Used in run, run_monkey_start, run_monkey, run_gallop_start, run_gallop states to handle miasma level changes
- `carefulwalking` -- Used in run, run_monkey_start, run_monkey, run_gallop_start, run_gallop states to handle careful walking toggle
- `unequip` -- Used in run_gallop_start, run_gallop states to handle gallopstick unequip preventing speed cheat
- `onactivateskill_client` -- Used in sprint_woby_start, sprint_woby states to handle walter_woby_endurance skill activation
- `ondeactivateskill_client` -- Used in sprint_woby_start, sprint_woby states to handle walter_woby_endurance skill deactivation
- `newactiveitem` -- Used in plugging_module, removing_module states to handle active item changes for module operations
- `controller_removing_module` -- Used in plugging_module state to handle controller input for module removal
- `controller_plugging_module` -- Used in removing_module state to handle controller input for module plugging
**Pushes:**
- `locomote` -- Pushed by LocoMotor:Stop() in various states when stopping movement