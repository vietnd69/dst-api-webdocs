---
id: SGwilson_client
title: Sgwilson Client
description: Manages client-side state graph behavior for Wilson's player, including movement prediction, animation selection, sound playback, and channel-cast prediction logic.
tags: [player, locomotion, animation, audio, prediction]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 7b64023d
system_scope: player
---

# Sgwilson Client

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwilson_client.lua` defines the client-side state graph logic for the Wilson player character in Don't Starve Together. It handles locomotion prediction (running, sprinting, galloping, floating), animation state determination based on contextual flags (riding, wereforms, heavy lifting, etc.), sound playback for footsteps and equipment foley, and channel-cast animation/sound prediction to reduce perceived network latency. The state graph integrates tightly with the player component system, responding to events like `locomote`, `performaction`, and `sg_cancelmovementprediction`, and manages state memory (`sg.statemem`) to track transient conditions.

## Usage example
```lua
local SGwilson_client = require("stategraphs/SGwilson_client")

-- Example: manually trigger channel-cast prediction for testing
local inst = ThePlayer
local buffaction = { action = "START_CHANNELCAST", invobject = ThePlayer.components.inventory:GetEquippedItem(EQUIPSLOTS.HANDS) }
inst:PushEvent("performaction", { action = buffaction }) -- calls StartPreviewChannelCast via event handler

-- Example: Determine animation for current movement state
local anim = GetRunStateAnim(inst)
inst.AnimState:SetBuild(anim)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** `groggy`, `mightiness_mighty`, `wereplayer`, `weremoose`, `weregoose`, `woby`, `heavy`, `quiet`, `fullhelm_hat`, `nabbag`, `gallopstick`, `wonkey`, `sandstorm`, `teetering`, `carefulwalking`, `yeehaw`, `beaver`, `fasthealer`, `quagmire_fasthands`, `fastpicker`, `woodiequickpicker`, `hungrybuilder`, `fastbuilder`, `slowbuilder`, `pyromaniac`, `aspiring_bookworm`, `farmplantfastpicker`, `eating_quickeat`, `eating_sloweat`, `edible_MEAT`, `simplebook`, `moonportal`, `moonportalkey`, `quagmire_portal_key`, `quagmire_altar`, `give_dolongaction`, `quickfeed`, `INLIMBO`, `floating`, `busy`, `boathopping`, `overridelocomote`, `idle`, `running`, `canrotate`, `moving`, `sleeping`, `waking`, `nopredict`, `pausepredict`, `ingym`, `exiting_gym`, `server`, `previewing`, `prehammer`, `premine`, `prechop`, `prenet`, `predig`, `prefish`, `prenet`, `predig`, `working`, `prechanneling`, `channeling`, `is_using_steering_wheel`, `is_using_cannon`, `using_tophat`, `drowning`, `feasting`, `teetering`, `floating_predict_move`, `predict_horseshoesounds`, `nointerrupt`, `attack`, `notalking`, `abouttoattack`, `galloping`, `monkey`, `sprint_woby`, `canrepeatcast`, `ridingwoby`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|

## Main functions
### `GetIceStaffProjectileSound(inst, equip)`
* **Description:** Returns the appropriate sound path for Ice Staff projectiles based on `icestaff_coldness` level.  
* **Parameters:**  
  - `inst`: Entity instance (unused in body).  
  - `equip`: Equipment table containing `icestaff_coldness` (number).  
* **Returns:** String sound path: `"dontstarve/wilson/attack_icestaff"` (coldness ≤ 1), `"dontstarve/wilson/attack_deepfreezestaff"` (2), or `"dontstarve/wilson/attack_deepfreezestaff_lvl2"` (>2).  

### `DoEquipmentFoleySounds(inst)`
* **Description:** Plays foley sounds for all equipped items that define a `foleysound` property.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  
* **Error states:** Skips if `inst.replica.inventory` is nil.  

### `DoFoleySounds(inst)`
* **Description:** Plays equipment foley sounds; then checks for instance-level override foley or default `foleysound`. Returns early if override returns true.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `DoMountedFoleySounds(inst)`
* **Description:** Plays equipment foley sounds and, if mounted, plays saddle-mounted foley sound if defined.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  
* **Error states:** Skips if saddle or saddle’s `mounted_foleysound` is nil.  

### `DoRunSounds(inst)`
* **Description:** Conditionally plays footstep sounds with scaled volume based on `inst.sg.mem.footsteps`. Increments counter on partial step.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `PlayMooseFootstep(inst, volume, ispredicted)`
* **Description:** Plays moose-specific footstep sound at full volume, then calls `PlayFootstep(inst, volume, ispredicted)`.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `volume`: Number (audio volume).  
  - `ispredicted`: Boolean.  
* **Returns:** None  

### `DoMooseRunSounds(inst)`
* **Description:** Plays moose footstep sound (always full volume) and runs footstep logic.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `DoMountSound(inst, mount, sound)`
* **Description:** Plays a sound from `mount.sounds[sound]` if both mount and sound exist.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `mount`: Mount object (must have `.sounds` table).  
  - `sound`: Key into `mount.sounds`.  
* **Returns:** None  
* **Error states:** No-op if `mount == nil` or `mount.sounds == nil`.  

### `StopPreviewChannelCast(inst)`
* **Description:** Cancels channel-cast preview task, clears memory fields, unregisters action listener, and removes speed multiplier prediction.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  
* **Error states:** No-op if `inst.sg.mem.preview_channelcast_task` is nil.  

### `CheckPreviewChannelCastAction(inst)`
* **Description:** Callback invoked on `"performaction"`; stops channel-cast preview if actual channel-cast state no longer matches preview action.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `StartPreviewChannelCast(inst, buffaction)`
* **Description:** Sets up or cancels channel-cast prediction based on `buffaction.action`. Modifies locomotor speed multiplier, schedules automatic timeout cleanup.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `buffaction`: Action object with `.action` (`START_CHANNELCAST` / `STOP_CHANNELCAST`) and (optionally) `.invobject`.  
* **Returns:** None  
* **Error states:** Early return if action is neither `START_CHANNELCAST` nor `STOP_CHANNELCAST`, or if preview task already exists and action does not change prediction direction.  

### `IsChannelCasting(inst)`
* **Description:** Returns whether channel-casting is predicted true or false, based on `preview_channelcast_action`, otherwise falls back to server state. Intentionally avoids calling `inst:IsChannelCasting()` to preserve prediction accuracy.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** Boolean  

### `IsChannelCastingItem(inst)`
* **Description:** Returns whether the *item* being used is the channel-cast item, based on prediction memory or server state.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** Boolean  

### `ConfigureRunState(inst)`
* **Description:** Populates `inst.sg.statemem` with boolean flags indicating current movement/stance context (riding, heavy lifting, channel-casting, wereforms, etc.).  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  

### `GetRunStateAnim(inst)`
* **Description:** Returns anim name string based on precedence of `sg.statemem` flags (e.g., `heavy_walk`, `channelcast_walk`, `sand_walk`, `run`, etc.).  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** String  
* **Error states:** Defaults to `"run"` if no condition matches.  

### `ClearCachedServerState(inst)`
* **Description:** Resets local prediction state cache via `player_classified.currentstate:set_local(0)` if component exists. Used to avoid false positives in state prediction.  
* **Parameters:**  
  - `inst`: Entity instance.  
* **Returns:** None  
* **Error states:** No-op if `inst.player_classified` is nil.  

### `GetRockingChairStateAnim(inst, chair)`
* **Description:** Returns appropriate animation name for rocking chair interaction, considering `yeehaw` tag and equipped head item.  
* **Parameters:**  
  - `inst`: Entity instance.  
  - `chair`: Entity instance (rocking chair).  
* **Returns:** `"rocking_hat"`, `"rocking_smile"`, or `"rocking"`  

### `CommonHandlers.OnHop()`
* **Description:** Returns a pre-defined `EventHandler` table for handling `"onhop"` events. Imported from `commonstates`.  
* **Parameters:** None  
* **Returns:** `{ EventHandler(...) }` table  

## Events & listeners
- **Listens to:** `"sg_cancelmovementprediction"` — upon event, transitions to `"idle"` state with `"cancel"` argument  
- **Listens to:** `"sg_startfloating"` — if not already `"floating"`, transitions to `"float"` state  
- **Listens to:** `"locomote"` — handles movement prediction and state transitions (idle, run_start, run_stop) based on locomotion request. Includes rider/sleeping/gym-specific logic and prediction overrides  
- **Listens to:** `"performaction"` — registered dynamically in `StartPreviewChannelCast`; handled by `CheckPreviewChannelCastAction`  
- **Listens to:** `"animover"` — when an animation finishes; transitions to `run`, `idle`, or `run_monkey`  
- **Listens to:** `"gogglevision"` — toggled by goggles; exits `run`-related states if conditions like sandstorm or goggle vision change  
- **Listens to:** `"stormlevel"` — when sandstorm level changes; exits `run` if conditions allow (e.g., storm started, no goggles)  
- **Listens to:** `"miasmalevel"` — when miasma level changes; exits `run` if miasma begins  
- **Listens to:** `"carefulwalking"` — toggled by careful walking setting; exits `run` if careful walking toggles  
- **Listens to:** `"unequip"` — watches for unequipping a "gallopstick"; resets move timer to prevent cheating  
- **Listens to:** `"onactivateskill_client"` / `"ondeactivateskill_client"` — for `walter_woby_endurance`; updates predicted sprint speed  
- **Listens to:** `"sg_stopfloating"` — stops `float` state and goes to `idle`  
- **Listens to:** `"animqueueover"` — ends `attack`, `throw`, `blowdart` states  
- **Listens to:** `"preventlocomoteoverride"` — in `stop_using_tophat`; used to preserve override  
- **Listens to:** `actionhandlers` — not an event name itself; `actionhandlers` is passed to `StateGraph` constructor as final argument