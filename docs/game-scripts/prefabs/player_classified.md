---
id: player_classified
title: Player Classified
description: Networked data container that synchronizes player state between server and client for HUD, camera, and gameplay systems.
tags: [network, player, hud, synchronization]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: bd70f711
system_scope: player
---

# Player Classified

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`player_classified` is a hidden networked entity attached to each player that serves as the authoritative source for client-side HUD and gameplay state synchronization. It contains net variables for health, hunger, sanity, temperature, crafting, camera, and numerous other player systems. The prefab operates differently on server versus client: on the server it exposes interface functions for modifying state, while on the client it listens to dirty events and pushes updates to the parent player entity for HUD rendering and feedback.

This classified entity is never directly spawned by modders — it is automatically created and attached to player entities during player initialization. Modders interact with it indirectly through the parent player's components or by listening to events pushed from this classified data.

## Usage example
```lua
-- Access classified data from a player entity (server-side)
local player = ThePlayer
local classified = player.player_classified

-- Modify player state through classified interface
classified:SetGhostMode(true)
classified:ShowHUD(false)
classified:SetTemperature(25)

-- Listen to events pushed from classified (on player entity)
player:ListenForEvent("healthdelta", function(inst, data)
    print("Health changed from "..data.oldpercent.." to "..data.newpercent)
end)

-- Access net variable values (read-only on client)
local currentHealth = classified.currenthealth:value()
local isCraftingEnabled = classified.iscraftingenabled:value()
```

## Dependencies & tags
**External dependencies:**
- `techtree` -- technology tree definitions for crafting progression
- `prefabs/battlesongdefs` -- battle song definitions for inspiration system

**Components used:**
- `playercontroller` -- placement cancellation, pause prediction frames
- `playervision` -- ghost vision toggling
- `playerspeedmult` -- run speed calculation on dirty events
- `combat` -- attacked pulse events, danger detection
- `health` -- health percentage and fire damage state
- `hunger` -- hunger percentage and starving state
- `sanity` -- sanity percentage and insanity mode
- `builder` -- recipe unlocking, tech tree levels, crafting limits
- `rider` -- mount hurt state, run speed on mount
- `locomotor` -- external velocity vector, strafing state

**Tags:**
- `CLASSIFIED` -- added to the classified entity itself for identification

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `currenthealth` | net_ushortint | `100` | Current health value (networked) |
| `maxhealth` | net_ushortint | `100` | Maximum health value (networked) |
| `healthpenalty` | net_byte | `0` | Health penalty modifier |
| `istakingfiredamage` | net_bool | `false` | Whether player is taking fire damage |
| `istakingfiredamagelow` | net_bool | `false` | Whether fire damage is low intensity |
| `issleephealing` | net_bool | `false` | Whether player is healing while sleeping |
| `ishealthpulseup` | net_bool | `false` | Health pulse up indicator for HUD |
| `ishealthpulsedown` | net_bool | `false` | Health pulse down indicator for HUD |
| `lunarburnflags` | net_tinybyte | `0` | Lunar burn effect flags |
| `currenthunger` | net_ushortint | `100` | Current hunger value (networked) |
| `maxhunger` | net_ushortint | `100` | Maximum hunger value (networked) |
| `ishungerpulseup` | net_bool | `false` | Hunger pulse up indicator for HUD |
| `ishungerpulsedown` | net_bool | `false` | Hunger pulse down indicator for HUD |
| `currentsanity` | net_ushortint | `100` | Current sanity value (networked) |
| `maxsanity` | net_ushortint | `100` | Maximum sanity value (networked) |
| `sanitypenalty` | net_byte | `0` | Sanity penalty modifier |
| `sanityratescale` | net_tinybyte | `0` | Sanity rate scale modifier |
| `issanitypulseup` | net_bool | `false` | Sanity pulse up indicator for HUD |
| `issanitypulsedown` | net_bool | `false` | Sanity pulse down indicator for HUD |
| `issanityghostdrain` | net_bool | `false` | Whether ghost sanity drain is active |
| `currentwereness` | net_byte | `0` | Current wereness transformation percentage |
| `iswerenesspulseup` | net_bool | `false` | Wereness pulse up indicator |
| `iswerenesspulsedown` | net_bool | `false` | Wereness pulse down indicator |
| `werenessdrainrate` | net_smallbyte | `0` | Wereness drain rate |
| `currentinspiration` | net_byte | `0` | Current inspiration percentage |
| `inspirationdraining` | net_bool | `false` | Whether inspiration is currently draining |
| `inspirationsongs` | table | `{}` | Array of 3 net_tinybyte for battle song slots |
| `hasinspirationbuff` | net_bool | `false` | Whether inspiration buff is active |
| `inmightygym` | net_tinybyte | `0` | Mighty gym occupancy state (0 = not in gym, 1-8 = weight level) |
| `currentmightiness` | net_byte | `0` | Current mightiness percentage |
| `mightinessratescale` | net_tinybyte | `0` | Mightiness rate scale modifier |
| `freesoulhops` | net_tinybyte | `0` | Wortox free soulhop counter |
| `wortox_panflute_buff` | net_bool | `false` | Wortox panflute buff active state |
| `inspectacles_game` | net_tinybyte | `0` | Winona inspectacles game ID |
| `inspectacles_posx` | net_shortint | `0` | Winona inspectacles game X position |
| `inspectacles_posz` | net_shortint | `0` | Winona inspectacles game Z position |
| `roseglasses_cooldown` | net_bool | `false` | Winona rose glasses cooldown state |
| `oldager_yearpercent` | net_float | `0` | Oldager year percentage |
| `oldager_rate` | net_smallbyte | `0` | Oldager aging rate (use GetOldagerRate/SetOldagerRate) |
| `currenttemperaturedata` | net_byte | `pivot` | Encoded temperature value |
| `currenttemperature` | number | `TUNING.STARTING_TEMP` | Decoded temperature (client-side only) |
| `moisture` | net_ushortint | `0` | Current moisture value |
| `maxmoisture` | net_ushortint | `100` | Maximum moisture value |
| `moistureratescale` | net_tinybyte | `0` | Moisture rate scale modifier |
| `stormlevel` | net_tinybyte | `0` | Storm watcher storm level (0-7) |
| `stormtype` | net_tinybyte | `0` | Storm watcher storm type |
| `isinmiasma` | net_bool | `false` | Whether player is in miasma |
| `isacidsizzling` | net_bool | `false` | Whether acid rain is affecting player |
| `pausepredictionframes` | net_tinybyte | `0` | Frames to pause movement prediction |
| `iscontrollerenabled` | net_bool | `true` | Whether player controller is enabled |
| `voteselection` | net_tinybyte | `0` | Player voter selection |
| `votesquelched` | net_bool | `false` | Whether player votes are squelched |
| `ishudvisible` | net_bool | `true` | Whether HUD is visible |
| `ismapcontrolsvisible` | net_bool | `true` | Whether map controls are visible |
| `isactionsvisible` | net_bool | `true` | Whether action hints are visible |
| `cameradistance` | net_smallbyte | `0` | Camera distance setting |
| `iscamerazoomed` | net_bool | `false` | Whether camera is zoomed |
| `cameraextramaxdist` | net_smallbyte | `0` | Extra maximum camera distance |
| `camerasnap` | net_bool | `false` | Trigger camera snap |
| `camerashakemode` | net_tinybyte | `0` | Camera shake mode |
| `camerashaketime` | net_byte | `0` | Camera shake duration |
| `camerashakespeed` | net_byte | `0` | Camera shake speed |
| `camerashakescale` | net_byte | `0` | Camera shake scale |
| `isaerialcamera` | net_bool | `false` | Whether aerial camera mode is active |
| `minimapcenter` | net_bool | `false` | Trigger minimap center |
| `minimapclose` | net_bool | `false` | Trigger minimap close |
| `isfadein` | net_bool | `true` | Whether fade is fade-in or fade-out |
| `fadetime` | net_smallbyte | `0` | Fade duration (0-31 = black, 32+ = white) |
| `screenflash` | net_tinybyte | `0` | Screen flash intensity |
| `wormholetravelevent` | net_tinybyte | `0` | Wormhole travel type event |
| `houndwarningevent` | net_smallbyte | `0` | Hound warning level event |
| `craftedextraelixirevent` | net_smallbyte | `0` | Crafted extra elixir count |
| `techtrees` | table | `TECH.NONE` | Technology tree levels |
| `techtrees_no_temp` | table | `{}` | Technology tree levels without temp bonus |
| `ingredientmod` | net_tinybyte | `INGREDIENT_MOD[1]` | Current ingredient modifier |
| `isfreebuildmode` | net_bool | `false` | Whether free build mode is active |
| `current_prototyper` | net_entity | `nil` | Current prototyper entity |
| `recipes` | table | `{}` | Unlocked recipe net_bool entries |
| `bufferedbuilds` | table | `{}` | Buffered build net_bool entries |
| `craftinglimit_recipe` | table | `{}` | Crafting station limited recipes |
| `craftinglimit_amount` | table | `{}` | Crafting station limited amounts |
| `lastcombattarget` | net_entity | `nil` | Last combat target entity |
| `canattack` | net_bool | `true` | Whether player can attack |
| `minattackperiod` | net_float | `4` | Minimum attack period |
| `isattackedbydanger` | net_bool | `false` | Whether attacked by dangerous entity |
| `isattackredirected` | net_bool | `false` | Whether attack was redirected |
| `ridermount` | net_entity | `nil` | Current mount entity |
| `ridersaddle` | net_entity | `nil` | Current saddle entity |
| `isridermounthurt` | net_bool | `false` | Whether mount is hurt |
| `riderrunspeed` | net_float | `TUNING.BEEFALO_RUN_SPEED.DEFAULT` | Run speed on mount |
| `riderfasteronroad` | net_bool | `false` | Whether faster on road while mounted |
| `touchstonetrackerused` | net_smallbytearray | `{}` | Used touchstone tracker |
| `isperformactionsuccess` | net_bool | `false` | Whether last action succeeded |
| `isghostmode` | net_bool | `false` | Whether ghost mode is active |
| `actionmeter` | net_byte | `0` | Action meter state |
| `actionmetertime` | net_byte | `0` | Action meter time |
| `currentstate` | net_hash | `""` | Current stategraph state |
| `isoverrideattack` | net_bool | `false` | Whether attack is overridden |
| `runspeed` | net_float | `TUNING.WILSON_RUN_SPEED` | Base run speed |
| `externalspeedmultiplier` | net_float | `1` | External speed multiplier |
| `externalvelocityvectorx` | net_float | `0` | External velocity X component |
| `externalvelocityvectorz` | net_float | `0` | External velocity Z component |
| `busyremoteoverridelocomote` | net_bool | `false` | WASD remote override active |
| `busyremoteoverridelocomoteclick` | net_bool | `false` | Left click remote override active |
| `isstrafing` | net_bool | `false` | Whether player is strafing |
| `psm_basespeed` | net_float | `TUNING.WILSON_RUN_SPEED` | PlayerSpeedMult base speed |
| `psm_servermult` | net_float | `1` | PlayerSpeedMult server multiplier |
| `psm_cappedservermult` | net_float | `1` | PlayerSpeedMult capped server multiplier |
| `iscarefulwalking` | net_bool | `false` | Whether careful walking is active |
| `cannon` | net_entity | `nil` | Boat cannon user cannon entity |
| `ischannelcasting` | net_bool | `false` | Whether channel casting is active |
| `ischannelcastingitem` | net_bool | `false` | Whether channel casting item is active |
| `bathingpool` | net_entity | `nil` | Occupying bathing pool entity |
| `playinghorseshoesounds` | net_bool | `false` | Whether playing horseshoe sounds |
| `isdeathbypk` | net_bool | `false` | Whether death was by PK |
| `deathcause` | net_string | `""` | Death cause string |
| `hasyotbskin` | net_bool | `false` | Whether YOTB skin is active |
| `hasgift` | net_bool | `false` | Whether gift is received |
| `hasgiftmachine` | net_bool | `false` | Whether gift machine is active |

## Main functions
### `SetValue(inst, name, value)`
* **Description:** Sets a net variable value with range validation (0-65535). Used internally for server-side state modification.
* **Parameters:**
  - `inst` -- classified entity instance
  - `name` -- string name of the net variable
  - `value` -- number value to set (must be 0-65535)
* **Returns:** None
* **Error states:** Errors if `value` is outside 0-65535 range (assert failure).

### `SetDirty(netvar, val)`
* **Description:** Forces a net variable to be dirty regardless of whether the value changed. Used to trigger client-side events without actual state change.
* **Parameters:**
  - `netvar` -- net variable instance
  - `val` -- value to set
* **Returns:** None

### `PushPausePredictionFrames(inst, frames)`
* **Description:** Forces pause prediction frames netvar to be dirty to trigger client-side movement prediction cancellation event.
* **Parameters:**
  - `inst` -- classified entity instance
  - `frames` -- number of frames to pause prediction
* **Returns:** None

### `SetTemperature(inst, temperature)`
* **Description:** Encodes and sets temperature value using precision/coarse encoding scheme for network efficiency.
* **Parameters:**
  - `inst` -- classified entity instance
  - `temperature` -- number temperature value
* **Returns:** None

### `SetOldagerRate(inst, dps)`
* **Description:** Sets the oldager aging rate. Value is encoded as signed value in unsigned net_var (adds 30 offset).
* **Parameters:**
  - `inst` -- classified entity instance
  - `dps` -- number deaths per second rate (must be -30 to 30)
* **Returns:** None
* **Error states:** Errors if `dps` is outside -30 to 30 range (assert failure).

### `GetOldagerRate(inst)`
* **Description:** Gets the decoded oldager aging rate (subtracts 30 offset from stored value).
* **Parameters:** `inst` -- classified entity instance
* **Returns:** Number aging rate in dps

### `SetUsedTouchStones(inst, used)`
* **Description:** Sets the touchstone tracker used array.
* **Parameters:**
  - `inst` -- classified entity instance
  - `used` -- table/array of used touchstone data
* **Returns:** None

### `SetGhostMode(inst, isghostmode)`
* **Description:** Sets ghost mode state and immediately triggers the dirty handler (server override to avoid HUD flicker).
* **Parameters:**
  - `inst` -- classified entity instance
  - `isghostmode` -- boolean ghost mode state
* **Returns:** None

### `ShowActions(inst, show)`
* **Description:** Sets whether action hints are visible.
* **Parameters:**
  - `inst` -- classified entity instance
  - `show` -- boolean visibility state
* **Returns:** None

### `ShowCrafting(inst, show)`
* **Description:** Sets whether crafting is enabled and triggers the dirty handler immediately.
* **Parameters:**
  - `inst` -- classified entity instance
  - `show` -- boolean enabled state
* **Returns:** None

### `ShowHUD(inst, show)`
* **Description:** Sets HUD visibility and triggers the dirty handler immediately.
* **Parameters:**
  - `inst` -- classified entity instance
  - `show` -- boolean visibility state
* **Returns:** None

### `EnableMapControls(inst, enable)`
* **Description:** Sets map controls visibility and triggers the dirty handler immediately.
* **Parameters:**
  - `inst` -- classified entity instance
  - `enable` -- boolean enabled state
* **Returns:** None

### `SetBathingPoolCamera(inst, target)`
* **Description:** Sets the bathing pool camera focus target and updates focal point.
* **Parameters:**
  - `inst` -- classified entity instance
  - `target` -- entity to focus camera on
* **Returns:** None

### `OnEntityReplicated(inst)`
* **Description:** Client-side initialization function called when entity is replicated. Attaches classified to parent and registers component classified attachments.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** None
* **Error states:** Prints error if `inst._parent` is nil after GetParent() call.

### `BufferBuild(inst, recipename)`
* **Description:** Client-side function to buffer a build request. Removes ingredients, sends RPC to server, and triggers crafting refresh.
* **Parameters:**
  - `inst` -- classified entity instance
  - `recipename` -- string recipe name to buffer
* **Returns:** None

### `RefreshCrafting(inst)`
* **Description:** Triggers a crafting refresh event on the parent player entity.
* **Parameters:** `inst` -- classified entity instance
* **Returns:** None

### `FinishSeamlessPlayerSwap(parent)`
* **Description:** Re-initializes dirty states after seamless player swap completes. Removes its own event listener after execution.
* **Parameters:** `parent` -- parent player entity
* **Returns:** None

## Events & listeners
**Listens to (server/mastersim):**
- `forcehealthpulse` -- triggers health pulse dirty state
- `healthdelta` -- updates health pulse indicators
- `hungerdelta` -- updates hunger pulse indicators
- `sanitydelta` -- updates sanity pulse indicators and anim overrides
- `werenessdelta` -- updates wereness pulse indicators
- `attacked` -- sets attacked by danger and redirect flags
- `builditem` / `buildstructure` -- triggers build success event
- `consumehealthcost` -- triggers builder damaged event
- `learnrecipe` -- sends RPC to client and triggers learn recipe event
- `learnmap` -- triggers learn map event
- `repair` -- triggers repair success event
- `performaction` / `actionfailed` -- sets perform action success flag
- `carefulwalking` -- sets careful walking state
- `wormholetravel` -- sets wormhole travel event type
- `houndwarning` -- sets hound warning event level
- `makefriend` -- triggers make friend event
- `feedincontainer` -- triggers feed in container event
- `idplantseed` -- triggers identify plant seed event
- `play_theme_music` -- triggers farming music start
- `craftedextraelixir` -- sets crafted extra elixir count

**Listens to (client/local):**
- `healthdirty` -- pushes healthdelta and forcehealthpulse to parent
- `istakingfiredamagedirty` -- pushes startfiredamage/stopfiredamage to parent
- `istakingfiredamagelowdirty` -- pushes changefiredamage to parent
- `lunarburnflagsdirty` -- pushes startlunarburn/stoplunarburn to parent
- `combat.attackedpulse` -- pushes attacked event with danger/redirect flags
- `hungerdirty` -- pushes hungerdelta and startstarving/stopstarving to parent
- `sanitydirty` -- pushes sanitydelta to parent
- `werenessdirty` -- pushes werenessdelta to parent
- `inspirationdirty` -- pushes inspirationdelta to parent
- `inspirationsong1dirty` / `inspirationsong2dirty` / `inspirationsong3dirty` -- pushes inspirationsongchanged to parent
- `mightinessdirty` -- pushes mightinessdelta to parent
- `freesoulhopsdirty` -- pushes freesoulhopschanged to parent
- `temperaturedirty` -- pushes temperaturedelta and freezing/overheating events
- `moisturedirty` -- pushes moisturedelta to parent
- `techtreesdirty` -- updates tech tree tables and pushes techtreechange
- `recipesdirty` -- pushes unlockrecipe to parent
- `iscraftingenableddirty` -- shows/hides crafting UI and cancels placement
- `bufferedbuildsdirty` -- cancels and triggers crafting refresh
- `isperformactionsuccessdirty` -- clears buffered action and pushes performaction
- `pausepredictionframesdirty` -- schedules prediction cancellation task
- `isstrafingdirty` -- pushes startstrafing/stopstrafing to parent
- `iscarefulwalkingdirty` -- pushes carefulwalking to parent
- `externalvelocityvectordirty` -- sets motor velocity on parent physics
- `playerspeedmultdirty` -- calls ApplyRunSpeed_Internal on parent
- `isghostmodedirty` -- sets ghost vision and ghost mode on parent
- `actionmeterdirty` -- shows/hides ring meter on HUD
- `playerhuddirty` -- shows/hides HUD and map controls
- `playercamerashake` -- triggers camera shake
- `playerscreenflashdirty` -- triggers screen flash on world
- `attunedresurrectordirty` -- pushes attunedresurrector to parent
- `cannondirty` -- pushes aimingcannonchanged to parent
- `bathingpooldirty` -- updates focal point camera focus

**Listens to (common):**
- `gym_bell_start` -- triggers Startbell on parent
- `playworkcritsound` -- plays critical work sound if focal point matches
- `inmightygymdirty` -- pushes inmightygym to parent
- `stormleveldirty` -- pushes stormlevel to parent
- `isinmiasmadirty` -- pushes miasmalevel to parent
- `isacidsizzlingdirty` -- pushes isacidsizzling to parent
- `hasinspirationbuffdirty` -- pushes hasinspirationbuff to parent
- `builder.build` -- plays sound and pushes buildsuccess
- `builder.damaged` -- pushes damaged event
- `builder.opencraftingmenu` -- opens crafting menu on HUD
- `builder.learnrecipe` -- plays sound
- `inked` -- pushes inked event
- `MapExplorer.learnmap` -- plays sound
- `MapSpotRevealer.revealmapspot` -- shows map spot and plays sound
- `repair.repair` -- plays repair sound
- `giftsdirty` -- pushes giftreceiverupdate to parent
- `yotbskindirty` -- plays sound and pushes yotbskinupdate
- `ismounthurtdirty` -- pushes mounthurt to parent
- `playercameradirty` -- adjusts camera distance, zoom, and gains
- `playeraerialcameradirty` -- adjusts camera FOV and pitch range
- `playercameraextradistdirty` -- sets extra max camera distance
- `playercamerasnap` -- triggers camera snap
- `playerminimapcenter` -- resets minimap offset
- `playerminimapclose` -- hides map
- `playerfadedirty` -- triggers front end fade
- `wormholetraveldirty` -- plays wormhole travel sound based on type
- `houndwarningdirty` -- spawns hound warning sound prefab
- `leader.makefriend` -- plays make friend sound
- `eater.feedincontainer` -- plays feed sound
- `morguedirty` -- records death in morgue
- `houndwarningdirty` -- spawns hound warning sound
- `idplantseedevent` -- plays identify plant sound
- `startfarmingmusicevent` -- pushes playfarmingmusic to parent
- `ingredientmoddirty` -- triggers crafting refresh
- `inspectacles_gamedirty` -- pushes inspectaclesgamechanged to parent
- `roseglasses_cooldowndirty` -- pushes roseglassescooldownchanged to parent
- `wortoxpanflutebuffdirty` -- pushes item_buff_changed to parent
- `craftedextraelixirdirty` -- plays elixir bonus sound

**Pushes to parent player entity:**
- `healthdelta` -- health percentage change with overtime flag
- `forcehealthpulse` -- health pulse direction (up/down)
- `hungerdelta` -- hunger percentage change with overtime flag
- `startstarving` / `stopstarving` -- starving state transitions
- `sanitydelta` -- sanity percentage change with mode
- `werenessdelta` -- wereness percentage change
- `inspirationdelta` -- inspiration percentage and draining state
- `inspirationsongchanged` -- battle song slot change
- `mightinessdelta` -- mightiness percentage change
- `freesoulhopschanged` -- free soulhop counter change
- `temperaturedelta` -- temperature change
- `startfreezing` / `stopfreezing` -- freezing state transitions
- `startoverheating` / `stopoverheating` -- overheating state transitions
- `moisturedelta` -- moisture value change
- `techtreechange` -- tech tree level updates
- `unlockrecipe` -- recipe unlock notification
- `refreshcrafting` -- crafting UI refresh request
- `performaction` -- action success notification
- `cancelmovementprediction` -- movement prediction cancellation
- `startstrafing` / `stopstrafing` -- strafing state
- `carefulwalking` -- careful walking state
- `attunedresurrector` -- attuned resurrector entity
- `aimingcannonchanged` -- cannon aiming state
- `playfarmingmusic` -- farming music start request
- `yotbskinupdate` -- YOTB skin active state
- `giftreceiverupdate` -- gift receiver state
- `mounthurt` -- mount hurt state
- `inspectaclesgamechanged` -- inspectacles game state
- `roseglassescooldownchanged` -- rose glasses cooldown state
- `item_buff_changed` -- item buff change notification
- `stormlevel` -- storm level and type
- `miasmalevel` -- miasma level
- `isacidsizzling` -- acid sizzling state
- `buildsuccess` -- build completion
- `damaged` -- builder damage
- `inked` -- inked state
- `attacked` -- attack received with danger/redirect flags
- `startfiredamage` / `stopfiredamage` / `changefiredamage` -- fire damage state
- `startlunarburn` / `stoplunarburn` -- lunar burn state