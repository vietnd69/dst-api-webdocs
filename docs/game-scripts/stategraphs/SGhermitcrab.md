---
id: SGhermitcrab
title: Sghermitcrab
description: Manages state transitions, animations, and AI behavior for the hermit crab entity in Don't Starve Together.
tags: [stategraph, ai, locomotion, animation, entity]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: bd28c4e0
system_scope: player
---

# Sghermitcrab

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGhermitcrab.lua` is a stategraph component that defines the complete behavioral state machine for the hermit crab entity. It handles animation state transitions (idle, walk, run, work, talk, fishing, dancing, sitting, tea-shop operations, hot springs, teleportation, emotes), locomotion control (including heavy-lifting and groggy movement), physics toggling, sound management (footsteps, hurt, talk, emote, FX), inventory interactions (equip/unequip, item re-equip on exhaustion), and event-driven state responses (freeze, blocked, emote, fishing events, state cleanup). The stategraph relies on multiple components (`locomotor`, `inventory`, `eater`, `npc_talker`, `freezable`, `pinnable`, `bathingpool`, `oceanfishingrod`, etc.) and tracks internal state via `inst.sg.mem` to maintain complex multi-frame workflows such as fishing, brewing, bundling, and sitting on furniture.

## Usage example
```lua
-- Example: Trigger hermit crab to equip an item and respond to movement intent
local hermitcrab = TheWorld:FindEntities(x, y, z, 1, nil, {"hermitcrab"})[1]
if hermitcrab and hermitcrab.components.inventory then
    hermitcrab.components.inventory:Equip(someitem, EQUIPSLOTS.HANDS)
    -- Force a walk state transition using locomote event
    hermitcrab:PushEvent("locomote", { intent = true, forced = false })
end

-- Example: Enter hot spring
hermitcrab:PushEvent("ms_enterbathingpool", { target = pool_entity, dest = pool_transform })
```

## Dependencies & tags
**Components used:**  
- `locomotor` — movement control (`Stop`, `Clear`, `WantsToMoveForward`, `SetMoveAnim`, `SetLocomoteState`)
- `inventory` — equipment management (`Equip`, `Unequip`, `GetEquippedItem`, `IsHeavyLifting`, `FindItem`, `DropItem`)
- `eater` — food consumption (`Eat`, `PrefersToEat`, `CanEat`)
- `souleater` — soul-eating logic
- `freezable` — freeze state handling (`Unfreeze`, `IsFrozen`, `IsThawing`)
- `pinnable` — stuck state handling (`Unstick`)
- `npc_talker` — NPC chatter (`Chatter`, `haslines`)
- `talker` — talk task management (checked before chatter)
- `friendlevels` — friend task completion in `talkto`
- `timer` — scheduling (`speak_time`, `complain_time`, `soaktime`, `sat_on_chair`)
- `bathingpool` — bath validation and radius checking
- `lootdropper` — fling target and item flinging
- `stuckdetection` — stuck detection during walking/soaking
- `oceanfishingrod`, `oceanfishinghook` — ocean fishing state tracking
- `bundler` — bundling state (`StopBundling`, `OnFinishBundling`)
- `grogginess` — grogginess accumulation (`AddGrogginess`)
- `colouradder` — tint control (`PushColour`, `PopColour`)
- `playercontroller` — action buffering and input handling

**Tags:**  
- `"heavy"`, `"groggy"`, `"fastpicker"`, `"quagmire_fasthands"`, `"minigameitem"`, `"quickfeed"`, `"quickeat"`, `"sloweat"`, `"band"`, `"regal"`, `"moonportal"`, `"moonportalkey"`, `"quagmire_altar"`, `"umbrella"`, `"busy"`, `"idle"`, `"moving"`, `"channeling"`, `"talking"`, `"nopredict"`, `"sleeping"`, `"shell"`, `"fishing_idle"`, `"teashop"`, `"wereplayer"`, `"frozen"`, `"dancing"`, `"sitting_on_chair"`, `"sitting"`, `"notalking"`, `"forcedangle"`, `"working"`, `"prechop"`, `"chopping"`, `"premine"`, `"mining"`, `"prehammer"`, `"hammering"`, `"predig"`, `"digging"`, `"prenet"`, `"netting"`, `"autopredict"`, `"prefish"`, `"npc_fishing"`, `"nibble"`, `"catchfish"`, `"pausepredict"`, `"mandatory"`, `"doing"`, `"nodangle"`, `"slowaction"`, `"attack"`, `"abouttoattack"`, `"running"`, `"giving"`, `"reeling"`, `"catchfish"`, `"nomorph"`, `"thawing"`, `"yawn"`, `"brewing"`, `"hit"`, `"soakin"`, `"jumping"`, `"sitting"`, `"ishome"`, `"canrotate"`, `"alert"`, `"forcedangle"`, `"busy"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sg.mem.footsteps` | number | 0 | Accumulated step count for dynamic footstep intervals |
| `sg.mem.heavy` | boolean | false | Flag indicating heavy load state |
| `sg.mem.groggy` | boolean | false | Flag indicating groggy state |
| `sg.mem.teleporting` | boolean | false | Flag indicating teleport in progress |
| `sg.mem.tea_shop_teleport` | boolean | false | Flag indicating tea shop teleport in progress |
| `sg.mem.target` | entity | nil | Current action target (e.g., workable, fishing hook) |
| `sg.mem.bowing` | boolean | false | Flag indicating active bow state |
| `sg.mem.iszoomed` | boolean | false | Flag for zoomed-in visual state |
| `sg.mem.dancinghat` | string | nil | Name of hat prefab triggering dancing emote |
| `sg.mem.finished` | boolean | false | Completion flag for certain actions |
| `sg.mem.bundling` | boolean | false | Flag indicating active bundling |
| `sg.mem.isstillfrozen` | boolean | false | Flag in frozen states to track thaw progress |
| `sg.mem.emotefxtask` | task | nil | Timer task for emote FX duration |
| `sg.mem.emotesoundtask` | task | nil | Timer task for emote sound duration |
| `sg.mem.hooklanded` | boolean | false | Ocean fishing hook landed state |
| `sg.mem.continue` | boolean | false | Flag for state continuation (e.g., fishing restart) |
| `sg.mem.escaped_str` | string | nil | Escape string for ocean fishing (e.g., "sneaky") |
| `sg.mem.speed`, `sg.mem.dspeed` | number | 0 | Movement speed tracking variables |
| `sg.mem.toolname` | string | nil | Name of current tool involved in breakage |
| `sg.mem.knockoutduration` | number | 0 | Knockout duration in seconds |
| `sg.mem.target_build` | string | nil | Build string for target (e.g., for fishing) |

## Main functions

### `IsItemMeat(item)`
* **Description:** Checks if an item is meat by verifying it has an `edible` component and its foodtype is `FOODTYPE.MEAT`.  
* **Parameters:** `item` — entity to check.  
* **Returns:** `true` if item is meat, `false` otherwise.  
* **Error states:** Returns `false` if `item.components.edible` is missing or `foodtype` is not `MEAT`.  

### `DoEquipmentFoleySounds(inst)`
* **Description:** Plays footstep/foley sounds for equipped items that have a `foleysound` defined. Iterates all equipment slots.  
* **Parameters:** `inst` — entity whose equipment slots to iterate.  
* **Returns:** `nil`.  
* **Error states:** Only plays if `v.foleysound ~= nil`; otherwise, skips slot.  

### `DoFoleySounds(inst)`
* **Description:** Plays instance-level fooley sound (`inst.foleysound`) if defined.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  
* **Error states:** Skips if `inst.foleysound == nil`.  

### `DoRunSounds(inst)`
* **Description:** Plays footstep sounds based on accumulated step count. Decreases interval between footsteps as step count increases (capped at 4 steps), then resets.  
* **Parameters:** `inst` — entity with `sg.mem.footsteps`.  
* **Returns:** `nil`.  
* **Error states:** Clamps step count to `4` max; requires `inst.sg.mem.footsteps` to be initialized.  

### `DoHurtSound(inst)`
* **Description:** Plays hurt sound using optional override or default path. Volume is customizable.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  
* **Error states:** Uses `inst.hurtsoundoverride` if present; otherwise falls back to `"hookline_2/characters/hermit/hurt"`. Volume from `inst.hurtsoundvolume`.  

### `DoTalkSound(inst)`
* **Description:** Plays talk sound using optional override or default path. Returns success status.  
* **Parameters:** `inst` — entity.  
* **Returns:** `true` always (does not indicate playback success).  
* **Error states:** Default path uses `"hookline_2/characters/hermit/talk"`.  

### `StopTalkSound(inst, instant)`
* **Description:** Stops current talk sound if playing. Optionally plays end sound before killing if `instant == false`.  
* **Parameters:** `inst` — entity; `instant` — boolean to skip end sound.  
* **Returns:** `nil`.  
* **Error states:** Only acts if `"talk"` sound is playing.  

### `ClearStatusAilments(inst)`
* **Description:** Cleans up legacy frozen/pinnable states that might interfere with state transitions (e.g., after unpinned).  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  
* **Error states:** Only acts if `freezable`/`pinnable` components exist and are in respective states. Calls `Unfreeze()` and `Unstick()`.  

### `ForceStopHeavyLifting(inst)`
* **Description:** Drops heavy item from body slot if inventory is in heavy lifting state.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  
* **Error states:** Only drops if `IsHeavyLifting()` returns `true`; uses `Unequip(EQUIPSLOTS.BODY)`.  

### `DoEmoteFX(inst, prefab)`
* **Description:** Spawns and parents FX prefab to emote symbol on entity.  
* **Parameters:** `inst` — entity; `prefab` — name of FX prefab.  
* **Returns:** `nil`.  
* **Error states:** Skips if `SpawnPrefab` returns `nil`.  

### `DoForcedEmoteSound(inst, soundpath)`
* **Description:** Plays arbitrary sound without overrides or looping support.  
* **Parameters:** `inst` — entity; `soundpath` — sound path string.  
* **Returns:** `nil`.  

### `DoEmoteSound(inst, soundoverride, loop)`
* **Description:** Plays emote sound with optional override suffix and looping support. Builds sound path from overrides or defaults.  
* **Parameters:** `inst` — entity; `soundoverride` — optional sound name suffix; `loop` — boolean.  
* **Returns:** `nil`.  
* **Error states:** Looping enabled only if `loop == true` and `soundoverride ~= nil`.  

### `ToggleOffPhysics(inst)`
* **Description:** Disables physics collision with non-ground objects. Sets `isphysicstoggle` state memory flag.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  

### `ToggleOnPhysics(inst)`
* **Description:** Re-enables physics collision with world, obstacles, characters, etc. Clears `isphysicstoggle` flag.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  

### `StartTeleporting(inst)`
* **Description:** Marks teleport in progress and hides entity/shadow.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  

### `DoneTeleporting(inst)`
* **Description:** Clears teleport flag and shows entity/shadow.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  

### `GetUnequipState(inst, data)`
* **Description:** Determines correct unequip animation state based on equipment slot, item state, and state tags.  
* **Parameters:** `inst` — entity; `data` — action data containing `eslot`, `slip`, `item`.  
* **Returns:** Two values:  
  1. String: state name (e.g., `"item_hat"`, `"item_in"`, `"tool_slip"`, `"toolbroke"`)  
  2. `data.item`  
* **Error states:** Falls through conditions in order; `toolbroke` is final fallback.  

### `ConfigureRunState(inst)`
* **Description:** Sets memory flags (`heavy`, `groggy`, `normal`) based on inventory load and entity tags.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  

### `GetRunStateAnim(inst)`
* **Description:** Returns animation name for run based on `inst.sg.statemem` flags.  
* **Parameters:** `inst` — entity.  
* **Returns:** `"heavy_walk"`, `"idle_walk"`, `"careful_walk"`, or `"run"`.  

### `GetWalkStateAnim(inst)`
* **Description:** Always returns `"walk"`.  
* **Parameters:** `inst` — entity.  
* **Returns:** `"walk"`.  

### `OnRemoveCleanupTargetFX(inst)`
* **Description:** Removes target FX and cleans up event listener to avoid leaks.  
* **Parameters:** `inst` — entity.  
* **Returns:** `nil`.  
* **Error states:** Only acts if `targetfx.KillFX` exists; otherwise calls `targetfx:Remove()`.  

### `DoPortalTint(inst, val)`
* **Description:** Applies or removes portal tint color to entity using `colouradder`.  
* **Parameters:** `inst` — entity; `val` — float in `[0,1]` controlling tint intensity.  
* **Returns:** `nil`.  
* **Error states:** Sets mult colour alpha to `1-val`; pops colour if `val <= 0`.  

### `CancelTalk_Override(inst, instant)`
* **Description:** Cancels pending talk task and stops talk sound.  
* **Parameters:** `inst` — entity; `instant` — boolean to skip end sound.  
* **Returns:** `nil`.  

### `OnTalk_Override(inst)`
* **Description:** Cancels existing talk task and schedules a new talk task.  
* **Parameters:** `inst` — entity.  
* **Returns:** `true`.  

### `OnDoneTalking_Override(inst)`
* **Description:** Cancels talk task but does not kill sound immediately.  
* **Parameters:** `inst` — entity.  
* **Returns:** `true`.  

## Events & listeners
**Listens to:**  
- `"freeze"` — transitions to `"frozen"` state  
- `"locomote"` — handles start/stop/cycle of walking/idle states based on movement intent; supports forced idle  
- `"blocked"` (only if `"shell"` state tag present) — transitions to `"shell_hit"`  
- `"snared"` — transitions to `"startle"` (pushanim = `true`)  
- `"repelled"` — transitions to `"repelled"` with data  
- `"equip"` — handles equip animations and heavy lifting transitions based on slot, item tag, state tags  
- `"unequip"` — handles unequip animations and heavy lifting cleanup  
- `"ontalk"` — transitions to `"talkto"` or `"talk_teashop"` if conditions met (not busy, no destination); also interrupts talk during bow/soaking  
- `"toolbroke"` — transitions to `"toolbroke"` with tool data  
- `"umbrellaranout"` — attempts to re-equip umbrella from inventory if lost  
- `"itemranout"` — attempts to re-equip same item prefab from inventory  
- `"armorbroke"` — transitions to `"armorbroke"` with armor data  
- `"fishingcancel"` — if NPC fishing and not busy, returns to `"fishing_pst"`  
- `"emote"` — transitions to `"emote"` with data if not busy, not sleeping, not heavy lifting, and (if validated) client-owns item  
- `"wonteatfood"` — transitions to `"refuseeat"`  
- `"oceanfishing_stoppedfishing"` — handles various ocean fishing stop reasons (line snapped, too far, too loose, bothered, got away, etc.), pushes `"continue"` and appropriate announcement  
- `"eat_food"` — transitions to `"eat"` if not busy  
- `"tossitem"` — transitions to `"tossitem"`  
- `"use_pocket_scale"` — transitions to `"use_pocket_scale"` with data  
- `"dance"` — transitions to `"funnyidle_clack_pre"` if not dancing  
- `"teleported"` — transitions to `"idle"`  
- `"enter_teashop"` — transitions to `"arrive_teashop"`  
- `"leave_teashop"` — transitions to `"leave_teashop"`  
- `"hermitcrab_startbrewing"` — transitions to `"brewing_teashop"` with product data  
- `"animover"` — triggers state transition when animation completes (used in many states, including idle variants, action states, talk/soak states)  
- `"animqueueover"` — triggers transition when animation queue completes (used in eat/talk/toolbroke/soaking/bundle/tossitem/emote states)  
- `"fishingnibble"` — transitions to `"fishing_nibble"` in the `"fishing"` state  
- `"fishingstrain"` — transitions to `"fishing_strain"` in `"fishing_nibble"`  
- `"fishingcatch"` — transitions to `"catchfish"` with a `build` argument in `"fishing_strain"`  
- `"fishingloserod"` — transitions to `"loserod"` in `"fishing_strain"`  
- `"donetalking"` — ends `talk`, `soakin` states and cancels pending talk task  
- `"catch"` — transitions to `"catch"` state  
- `"cancelcatch"` — cancels buffered action and transitions to `"idle"`  
- `"carefulwalking"` — conditionally transitions between `walk`/`run` states based on `data.careful` and memory flags  
- `"newfishingtarget"` — sets `hooklanded = true` and transitions to `"fishing_ocean_cast_pst"` animation  
- `"onthaw"` — in `"frozen"` state; sets `isstillfrozen = true` and transitions to `"thaw"`  
- `"unfreeze"` — in `"frozen"`, `"thaw"` states; forces immediate transition to `"hit"`  
- `"ms_enterbathingpool"` — transitions to `"soakin_jump"` when entering a bathing pool during pre-state  
- `"ms_leavebathingpool"` — handles server/external request to exit bath; triggers jumpout  
- `"performaction"` — handles DROP action while sitting by playing item hat animation  
- `"becomeunsittable"` — triggers jump off chair when chair becomes unsittable  
- `"onremove"` — triggers jump off chair if chair is removed  

**Pushes:**  
- `"wonteatfood"` — with `{ food = obj }` when eater refuses item (in `ACTIONS.EAT` handler)  
- `"ms_hermitcrab_wants_to_teleport"` — fired in `dancebusy` onenter when `teleporting` mem is set  
- `"hermitcrab_entered"` — fired on `teashop` target when hermit crab is teleported into position during `dancebusy_clack`  
- `"encumberedwalking"` — fired when `heavy` load footstep threshold is exceeded during walking/running  
- `"onsatinchair"` — fired when successfully seated in chair (during `sitting` onenter)  
- `"ms_sync_chair_rocking"` — sent to rocking chair during sit/enter animations to sync rocking  
- `"ms_closepopups"` — in `"frozen"`, `"thaw"` states; closes popups upon entering frozen/thaw states