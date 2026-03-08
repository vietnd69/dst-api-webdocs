---
id: SGwilson
title: Sgwilson
description: Manages the player character's state graph, coordinating animations, physics, component interactions, and input handling for movement, combat, actions, and transformations.
tags: [player, stategraph, animation, combat, locomotion]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 75e007f3
system_scope: player
---

# Sgwilson

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
SGwilson is the primary stategraph for the player character (Wilson), defining a comprehensive set of states that govern movement, combat, interaction, transformation, and animations. It integrates with numerous components—such as locomotor, combat, inventory, health, temperature, hunger, sanity, rider, and many more—to manage transitions, handle events, schedule timed actions, and play animations. The stategraph supports complex mechanics including galloping, heavy lifting, channeling, parrying, swimming, teleportation, transformation, and multiplayer synchronization, using state memory, tags, and event callbacks to maintain context and control flow.

## Usage example
```lua
-- Example: Initiating a gallop attack while mounted
local player = TheEntity
if player.components.rider and player.components.rider:IsRiding() then
    -- Equip a weapon with the "gallopstick" tag
    local weapon = SpawnPrefab("gallopstick")
    player.components.inventory:Equip(weapon, EQUIPSLOTS.HANDS)

    -- Trigger gallop state (handled by SGwilson internally via locomote events)
    player.sg:GoToState("run_start")
end

-- Example: Using pocket rummage and ensuring cleanup on exit
player.sg.statemem.pocket_rummage_item = mycontainer
player:PushEvent("keep_pocket_rummage")
-- Later, during exit, SGwilson calls CheckPocketRummageMem() and ClosePocketRummageMem()
```

## Dependencies & tags
**Components used:** activatable, anchor, aoecharging, aoetargeting, aoeweapon_leap, aoeweapon_lunge, bathingpool, beard, bloomer, boatcannonuser, bundler, burnable, channelable, colouradder, colourtweener, combat, constructionbuilder, container, cursable, drownable, dumbbelllifter, eater, edible, embarker, equippable, fader, fan, finiteuses, firebug, fishingrod, freezable, fueled, gestaltcage, ghostlybond, giftreceiver, grogginess, groomer, grue, health, hunger, instrument, inventory, inventoryitem, joustuser, locomotor, lunarhailbuildup, magician, mast, mightiness, mightygym, moisture, moonstormstaticcatcher, oceanfishable, oceanfishingrod, parryweapon, perishable, pickable, pinnable, planardamage, playercontroller, playerfloater, playerspeedmult, playervision, pocketwatch, pushable, reader, recallmark, remoteteleporter, revivablecorpse, rider, sanity, searchable, shaver, shaver, sittable, skilltreeupdater, skinner, sleeper, sleepingbag, sleepingbaguser, slingshotmods, slipperyfeet, soul, souleater, spellbook, steeringwheeluser, strongman, tackler, talker, teleporter, temperature, tool, walkingplankuser, wardrobe, weapon, weighable, wereness, wintersfeasttable, workable.

**Tags:** mime, groggy, woby, wereplayer, weremoose, weregoose, gallopstick, wonkey, nodangle, noslip, teetering, minigameitem, smallcreature, yeehaw, fullhelm_hat, nabbag, abigail_flower, quickeat, sloweat, fooddrink, pyromaniac, quagmire_fasthands, handyperson, scientist, engineering, fishing_idle, repairshortaction, slowfertilize, noquickpick, farmplantfastpicker, woodiequickpicker, jostlepick, quickpick, jostlesearch, quicksearch, inventoryitemholder_take, heavy, portablestorage, graveplanter, complexprojectile, floating, moonportal, quagmire_portal_key, quagmire_altar, give_dolongaction, flute, horn, bell, whistle, gnarwail_horn, guitar, cointosscast, crushitemcast, quickcast, veryquickcast, mermbuffcast, book, willow_ember, remotecontrol, slingshot, aoeweapon_lunge, aoeweapon_leap, superjump, parryweapon, blowdart, thrown, pillow, propweapon, multithruster, helmsplitter, special_action_toss, keep_equip_toss, soulstealer, canrepeatcast, recall_unmarked, pocketwatch_warp_casting, pocketwatch_portal, quickfeed, forced, lucy, heavybody, heavyarmor, ingym, bedroll, tent, waking, sleeping, acting, is_furling, tranquilizer, groundspike, electrocute, nointerrupt, canelectrocute, transform, dismounting, devoured, suspended, idle, moving, channeling, dead, heavy, file_load, floating, ridingwoby, canwobysprint, moosegroggy, goosegroggy.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| self.inactive | boolean | true | Marks if the activatable component is inactive. |
| self.quickaction | boolean | false | Indicates if the activatable supports quick actions. |
| self.standingaction | boolean | false | Indicates if the activatable supports standing actions. |
| self.sound | string | path | Path to sound effect used by aoeweapon_lunge. |
| self.bondlevel | number | 1 | Current level of the ghostly bond component. |
| self.foodtype | FOODTYPE | FOODTYPE.GENERIC | Type of food for edible component. |
| self.equipslot | EQUIPSLOTS | EQUIPSLOTS.HANDS | Equipment slot for equippable component. |
| self.current | number | self.max | Current hunger amount. |
| self.burnratemodifiers | SourceModifierList | SourceModifierList(self.inst) | Modifiers affecting hunger burn rate. |
| self.current_feasters | table | {} | List of players feasting at the table. |
| self.knockedout | boolean | false | Indicates if the grogginess component has knocked out the player. |
| self.embark_speed | number | 10 | Movement speed during embark. |
| self.embarkable | entity | nil | Target platform during embark. |
| self.dumbbell | entity | dumbbell | Currently lifted dumbbell in dumbbelllifter component. |
| self.held | boolean | nil | State of held tool in magician component. |
| self.equip | boolean | nil | State of equipped tool in magician component. |
| self.item | entity | nil | Current tool item in magician component. |
| self.target | entity | nil | Combat target or fishing target. |
| self.min_attack_period | number | 4 | Minimum time between attacks. |
| self.playerstunlock | boolean | stunlock | Determines if combat attack can stun the player. |
| self.overridesymbol | any | symbol | Symbol override in fan component. |
| self.should_play_left_turn_anim | boolean | false | Steering wheel left-turn animation flag. |
| self.gym | entity | gym | Reference to current gym in strongman component. |
| self.isclientcontrollerattached | boolean | false | Flag for client-side controller attachment in playercontroller. |
| self.lastheldaction | any | nil | Last action held in playercontroller. |
| self.remote_authority | boolean | IsConsole() | Authority flag for console remote play. |
| self.remote_predicting | boolean | false | Prediction state in playercontroller. |
| self.is_map_enabled | boolean | false | Flag for map control availability. |

## Main functions
### `GetLocalAnalogXY(inst)`
* **Description:** Retrieves the local analog stick input (x and y direction) for movement, accounting for controller deadzone.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `xdir, ydir` (numbers) if input exceeds deadzone, otherwise `nil`.

### `GetLocalAnalogDir(inst)`
* **Description:** Computes normalized movement direction vector relative to camera (right/down vectors).
* **Parameters:** `inst` — the player entity instance.
* **Returns:** Normalized `Vector3` direction if analog input present; otherwise `nil`.

### `IsLocalAnalogTriggered(inst)`
* **Description:** Checks if any analog movement input is active.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** `true` if analog input detected (`GetLocalAnalogXY` not `nil`), else `false`.

### `GetIceStaffProjectileSound(inst, equip)`
* **Description:** Returns the appropriate sound path for ice staff projectiles based on coldness level.
* **Parameters:**
  * `inst` — the player entity instance.
  * `equip` — the equipped item expected to have `icestaff_coldness` property.
* **Returns:** Sound path string (e.g., `"dontstarve/wilson/attack_deepfreezestaff"`).

### `GetRoyaltyTarget(inst)`
* **Description:** Finds the closest visible player wearing `regal`-tagged equipment, with special handling for `regaljoker` interactions.
* **Parameters:** `inst` — the player entity instance (the one looking for royalty to interact with).
* **Returns:** `royalty` — another player instance satisfying royalty criteria, or `nil`.

### `ClearRegalJokerTask(inst)`
* **Description:** Helper to reset the `regaljokertask` task reference on `inst`.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** None.

### `ClearRefuseBowTask(inst)`
* **Description:** Helper to reset the `refusestobowtoroyaltytask` task reference on `inst`.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** None.

### `DoEquipmentFoleySounds(inst)`
* **Description:** Plays foley sounds for all equipped items with `foleysound` property.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** None.

### `DoFoleySounds(inst)`
* **Description:** Plays foley sounds: equipment foley first, then overrides if present, then fallback foley.
* **Parameters:** `inst` — the player entity instance.
* **Returns:** None.

### `DoMountedFoleySounds(inst)`
* **Description:** Plays equipment foley sounds, then if the player is riding and has a saddle with `mounted_foleysound` defined, plays that sound.
* **Parameters:** `inst` — the player entity.
* **Returns:** None.

### `DoRunSounds(inst)`
* **Description:** Plays footstep sounds while running, varying volume based on `inst.sg.mem.footsteps` counter.
* **Parameters:** `inst` — the player entity.
* **Returns:** None.

### `PlayMooseFootstep(inst, volume, ispredicted)`
* **Description:** Plays moose-specific footstep sound and a generic footstep. Always uses full volume for moose step.
* **Parameters:**
  - `inst` — player entity.
  - `volume` — unused in moose step, present for interface compatibility.
  - `ispredicted` — boolean, passed to `SoundEmitter:PlaySound`.
* **Returns:** None.

### `DoMooseRunSounds(inst)`
* **Description:** Plays moose footstep sound and runs `DoRunSounds`.
* **Parameters:** `inst` — player entity.
* **Returns:** None.

### `DoGooseStepFX(inst)`
* **Description:** If over water, spawns a `weregoose_splash_med` + random suffix FX prefab parented to the player.
* **Parameters:** `inst` — player entity.
* **Returns:** None.

### `DoGooseWalkFX(inst)`
* **Description:** If over water, spawns a `weregoose_splash_less` + random suffix FX prefab parented to the player.
* **Parameters:** `inst` — player entity.
* **Returns:** None.

### `DoGooseRunFX(inst)`
* **Description:** If over water, spawns `weregoose_splash` FX; otherwise spawns `weregoose_feathers` + random suffix FX, parented to the player.
* **Parameters:** `inst` — player entity.
* **Returns:** None.

### `DoHurtSound(inst)`
* **Description:** Plays hurt sound, either from `inst.hurtsoundoverride`, or a default path (unless mime tag is present).
* **Parameters:** `inst` — player entity.
* **Returns:** None.

### `DoYawnSound(inst)`
* **Description:** Plays yawn sound from `inst.yawnsoundoverride` or default path (unless mime tag is present).
* **Parameters:** `inst` — player entity.
* **Returns:** None.

### `DoTalkSound(inst)`
* **Description:** Plays talk loop sound from `inst.talksoundoverride` or default path (unless mime tag is present).
* **Parameters:** `inst` — player entity.
* **Returns:** `true` on success (sound played), `nil` if mime.

### `StopTalkSound(inst, instant)`
* **Description:** Kills talk sound; optionally plays end sound if not instant and a sound is playing.
* **Parameters:**
  - `inst` — player entity.
  - `instant` — if true, skips `endtalksound`.
* **Returns:** None.

### `CancelTalk_Override(inst, instant)`
* **Description:** Cancels in-progress talk task and stops talk sound.
* **Parameters:**
  - `inst` — player entity.
  - `instant` — passed to `StopTalkSound`.
* **Returns:** None.

### `OnTalk_Override(inst)`
* **Description:** Cancels any existing talk, plays talk sound, and schedules next talk cancellation.
* **Parameters:** `inst` — player entity.
* **Returns:** `true` always.

### `OnDoneTalking_Override(inst)`
* **Description:** Overrides the default behavior when talking is done; cancels any active talk and returns true.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true`.

### `DoMountSound(inst, mount, sound, ispredicted)`
* **Description:** Plays a sound from a mounted entity if available.
* **Parameters:**
  - `inst` — the entity playing the sound.
  - `mount` — the mount entity whose sound table is used.
  - `sound` — key into `mount.sounds` table.
  - `ispredicted` — flag for predicted sound playback (client-side).
* **Returns:** None.

### `DoEatSound(inst, overrideexisting)`
* **Description:** Plays eating/sipping sound if `doeatingsfx` flag is set and optionally if "eating" sound is not already playing.
* **Parameters:**
  - `inst` — the entity instance.
  - `overrideexisting` — if true, plays sound even if "eating" is already playing.
* **Returns:** None.

### `ClearStatusAilments(inst)`
* **Description:** Clears legacy status ailments (frozen, stuck/pinned) on the instance that may not be handled consistently by the stategraph.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `ForceStopHeavyLifting(inst)`
* **Description:** Forces the player to drop the heavy item they are lifting (typically via inventory BODY slot).
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `SetSleeperSleepState(inst)`
* **Description:** Configures the instance to enter sleeping state by applying buffs/immunities, disabling components, and updating UI/action states.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `SetSleeperAwakeState(inst)`
* **Description:** Reverses effects of `SetSleeperSleepState` — re-enables components and UI, removes sleep immunities.
* **Parameters:** `inst` — the entity instance.
* **Returns:** None.

### `DoEmoteFX(inst, prefab)`
* **Description:** Spawns a prefab as an emote effect, parents it to the entity, and attaches it to follow the entity's "emotefx" symbol. Handles special positioning when riding.
* **Parameters:**
  - `inst`: The entity instance performing the emote.
  - `prefab`: The name of the prefab to spawn for the effect.
* **Returns:** Nothing.

### `DoForcedEmoteSound(inst, soundpath)`
* **Description:** Plays a sound path directly using the entity's `SoundEmitter`, ignoring any emote sound overrides or MIME logic.
* **Parameters:**
  - `inst`: The entity instance.
  - `soundpath`: The exact sound path string to play.
* **Returns:** Nothing.

### `DoEmoteSound(inst, soundoverride, loop)`
* **Description:** Plays an emote sound, with support for sound overrides, loop control, MIME silence, and character-specific paths.
* **Parameters:**
  - `inst`: The entity instance.
  - `soundoverride`: Optional custom sound name to play (e.g., `"emote_laugh"`).
  - `loop`: Boolean flag to enable looping when combined with `soundoverride`.
* **Returns:** Nothing.

### `ToggleOffPhysics(inst)`
* **Description:** Disables collision physics for the entity except for ground collisions. Marks state in `sg.statemem`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Nothing.

### `ToggleOffPhysicsExceptWorld(inst)`
* **Description:** Disables collision physics except for world (non-solid) collisions. Marks state in `sg.statemem`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Nothing.

### `ToggleOnPhysics(inst)`
* **Description:** Re-enables full physics collisions for the entity (ground, obstacles, characters, etc.). Clears `sg.statemem.isphysicstoggle`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Nothing.

### `StartTeleporting(inst)`
* **Description:** Prepares the entity for teleportation: sets invincibility, disables controller and visibility, hides shadow.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Nothing.

### `DoneTeleporting(inst)`
* **Description:** Reverses `StartTeleporting`: removes invincibility, re-enables controller and visibility, restores shadow.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Nothing.

### `UpdateActionMeter(inst)`
* **Description:** Updates the client-side action meter display value based on time spent in state. Calculates `min(255, floor(timeinstate * 10 + 2.5))`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** Nothing.

### `StartActionMeter(inst, duration)`
* **Description:** Starts visual and networked action meter UI. Initializes periodic update task.
* **Parameters:**
  - `inst`: The entity instance.
  - `duration`: Float duration (in seconds) of the action meter.
* **Returns:** Nothing.

### `StopActionMeter(inst, flash)`
* **Description:** Stops and hides the action meter UI, cancels periodic update task. Sets meter state to 1 if `flash`, else 0.
* **Parameters:**
  - `inst`: The entity instance.
  - `flash`: Boolean flag indicating whether to flash (cancel with visual cue).
* **Returns:** Nothing.

### `GetUnequipState(inst, data)`
* **Description:** Determines the appropriate unequip animation state name based on conditions (wereplayer, equipped slot, slip state, item validity).
* **Parameters:**
  - `inst`: The entity instance.
  - `data`: Table containing:
    - `eslot`: Equipment slot being unequipped from.
    - `slip`: Boolean indicating if item was slipped on.
    - `item`: The item being unequipped.
* **Returns:**
  - `state_name`: String (e.g., `"item_in"`, `"tool_slip"`, `"toolbroke"`).
  - `data.item`: The item reference.

### `ConfigureRunState(inst)`
* **Description:** Analyzes the current state of the entity (`inst`) to determine the appropriate movement context (e.g., riding, heavy lifting, channel casting, wereform, environmental effects) and configures `inst.sg.statemem` and state tags accordingly.
* **Parameters:**
  - `inst`: The entity whose state graph and memory are being configured.
* **Returns:** `nil`.

### `GetRunStateAnim(inst)`
* **Description:** Returns the appropriate animation bank string for the run/walk state based on `inst.sg.statemem` flags previously set by `ConfigureRunState`.
* **Parameters:**
  - `inst`: The entity whose animation state is to be selected.
* **Returns:** A string representing the animation bank (e.g., `"heavy_walk"`, `"run_woby"`, `"run"`). Falls back to `"run"` if none match.

### `OnRemoveCleanupTargetFX(inst)`
* **Description:** Cleans up a target FX entity stored in `inst.sg.statemem.targetfx` when it is removed or destroyed.
* **Parameters:**
  - `inst`: The entity whose state graph stores the `targetfx` reference.
* **Returns:** `nil`.

### `IsWeaponEquipped(inst, weapon)`
* **Description:** Checks if `weapon` is equipped and held by `inst`.
* **Parameters:**
  - `inst`: Entity (typically player) to check.
  - `weapon`: Item entity to validate.
* **Returns:** Boolean — true if `weapon` is equipped (`equippable:IsEquipped()`) and held (`inventoryitem:IsHeldBy(inst)`), and not nil.

### `ValidateMultiThruster(inst)`
* **Description:** Validates that the current weapon in state memory is equipped and has a `multithruster` component.
* **Parameters:**
  - `inst`: Entity (player) whose weapon state is being validated.
* **Returns:** Boolean — true if `inst.sg.statemem.weapon` is equipped and has `multithruster` component.

### `ValidateHelmSplitter(inst)`
* **Description:** Validates that the current weapon in state memory is equipped and has a `helmsplitter` component.
* **Parameters:**
  - `inst`: Entity (player) whose weapon state is being validated.
* **Returns:** Boolean — true if `inst.sg.statemem.weapon` is equipped and has `helmsplitter` component.

### `DoThrust(inst, nosound)`
* **Description:** Triggers thruster attack if valid multi-thruster weapon is equipped. Optionally plays attack sound.
* **Parameters:**
  - `inst`: Entity (player) performing the attack.
  - `nosound`: Boolean flag to suppress sound playback.
* **Returns:** Void. Calls `multithruster:DoThrust()` and optionally plays `"dontstarve/wilson/attack_weapon"`.

### `DoHelmSplit(inst)`
* **Description:** Triggers helm split attack if valid helm-splitting weapon is equipped.
* **Parameters:**
  - `inst`: Entity (player) performing the helm split.
* **Returns:** Void. Calls `helmsplitter:DoHelmSplit()` if validated.

### `IsMinigameItem(inst)`
* **Description:** Checks if `inst` has the `"minigameitem"` tag.
* **Parameters:**
  - `inst`: Entity to check.
* **Returns:** Boolean — true if `inst` has tag `"minigameitem"`.

### `DoWortoxPortalTint(inst, val)`
* **Description:** Applies dynamic tinting to Wortox based on portal intensity and allegiance (shadow/lunar).
* **Parameters:**
  - `inst`: Entity (Wortox) to tint.
  - `val`: Tint intensity (0–1 scale).
* **Returns:** Void.

### `DoMimeAnimations(inst)`
* **Description:** Plays 1–3 random `"mime{1..13}"` animations for mime-themed character.
* **Parameters:**
  - `inst`: Entity playing animations.
* **Returns:** Void.

### `SetPocketRummageMem(inst, item)`
* **Description:** Stores `item` in `inst.sg.mem.pocket_rummage_item`.
* **Parameters:**
  - `inst`: Entity.
  - `item`: Item entity to memoize.
* **Returns:** Void.

### `OwnsPocketRummageContainer(inst, item)`
* **Description:** Checks if `inst` (or its mount) owns `item` or is `item`.
* **Parameters:**
  - `inst`: Entity.
  - `item`: Item entity.
* **Returns:** Boolean — true if `item`'s grand owner is `inst`, its mount, or `item == mount`.

### `IsHoldingPocketRummageActionItem(holder, item)`
* **Description:** Checks if `holder` directly holds `item` or owns a linked container parented to `holder`.
* **Parameters:**
  - `holder`: Entity (e.g., player).
  - `item`: Item entity.
* **Returns:** Boolean — true if `owner == holder` or if owner has no inventoryitem but is parented to `holder`.

### `ClosePocketRummageMem(inst, item)`
* **Description:** Closes `pocket_rummage_item` container if present and owned, and clears memory.
* **Parameters:**
  - `inst`: Entity.
  - `item`: Optional item to close (defaults to `inst.sg.mem.pocket_rummage_item`).
* **Returns:** Void.

### `CheckPocketRummageMem(inst)`
* **Description:** Called when exiting a `"keep_pocket_rummage"` state; validates whether the pocket rummaged item is still valid.
* **Parameters:** `inst` — the player entity.
* **Returns:** None.

### `TryResumePocketRummage(inst)`
* **Description:** Attempts to resume pocket rummaging if the item is still valid (container open, owned by `inst`).
* **Parameters:** `inst` — the player entity.
* **Returns:** `true` if successful, `false` otherwise.

### `HandleInstrumentAssets(inst, build, symbol)`
* **Description:** Applies asset overrides (build, symbol, sound) for an instrument item held or buffered.
* **Parameters:**
  - `inst` — the player entity.
  - `build` — base build to fall back to.
  - `symbol` — base symbol to fall back to.
* **Returns:** `inv_obj` — the held/buffered item with `instrument` component, or `nil`.

### `find_abigail_flower(item)`
* **Description:** Predicate used to locate Abigail flower items (e.g., in inventory searches).
* **Parameters:** `item` — an entity to test.
* **Returns:** `true` if `item` has tag `"abigail_flower"`, otherwise `false`.

### `find_lucy(item)`
* **Description:** Predicate used to locate Lucy (the fishing rod) items.
* **Parameters:** `item` — an entity to test.
* **Returns:** `true` if `item.prefab == "lucy"`, otherwise `false`.

### `TryReturnItemToFeeder(inst)`
* **Description:** On feeding completion, restores a non-persistent feeder item back to the feeder's inventory if feasible.
* **Parameters:** `inst` — the eater entity.
* **Returns:** None.

### `IsPlayerFloater(item)`
* **Description:** Predicate to detect if an item is a player floater (e.g., balloon).
* **Parameters:** `item` — an entity to test.
* **Returns:** `true` if item is a player floater, otherwise `false`.

### `FindPlayerFloater(inst)`
* **Description:** Scans open inventory for a player floater item.
* **Parameters:** `inst` — the player entity.
* **Returns:** Found floater item or `nil`.

### `GetGallopStick(inst)`
* **Description:** Retrieves the equipped gallop stick (if any) from the player's hands.
* **Parameters:**
  - `inst` — The entity instance (player).
* **Returns:** The equipped item if it has the `"gallopstick"` tag, otherwise `nil`.

### `DoDamageToGallopStick(inst, val)`
* **Description:** Applies a fuel delta (`val`) to the equipped gallop stick (if it exists and has `fueled` component).
* **Parameters:**
  - `inst` — The entity instance (player).
  - `val` — Numeric value passed to `fueled:DoDelta()`.
* **Returns:** Nothing.

### `TryGallopCollideUpdate(inst)`
* **Description:** Handles collision detection and resolution during a gallop.
* **Parameters:**
  - `inst` — The entity instance (player) performing the gallop.
* **Returns:** `true` if a valid target was collided with; `false` otherwise.

### `GetRockingChairStateAnim(inst, chair)`
* **Description:** Returns the appropriate animation name for a rocking chair interaction.
* **Parameters:**
  - `inst`: The character entity (player) performing the action.
  - `chair`: The rocking chair entity being interacted with.
* **Returns:** String animation name: `"rocking_hat"`, `"rocking_smile"`, or `"rocking"`.

## Events & listeners
**Listens to:**
- `locomote` — Handles movement state transitions (`run_start`, `run_stop`, `idle`, `acting_run_stop`), exits gym (`ingym`), wakes from bedroll/tent via `sleepingbag.DoWakeUp()`.
- `blocked` — On block while in `shell` state, transitions to `shell_hit`.
- `coach` — Enters `coach` state if idle, or speaks via `talker.Say`.
- `attacked` — Handles damage interaction based on state tags, stimuli, components.
- `snared`, `startled`, `repelled`, `knockback`, `souloverload`, `mindcontrolled`, `devoured`, `suspended`, `feetslipped`, `set_heading`, `consumehealthcost`, `equip`, `unequip`, `death`, `ontalk`, `silentcloseinspect`, `powerup_wurt`, `powerdown_wurt`, `powerup`, `powerdown`, `wx78_spark`, `becomeyounger_wanda`, `becomeolder_wanda`, `onsink`, `onfallinvoid`, `transform_wereplayer`, `transform_person`, `toolbroke`, `armorbroke`, `fishingcancel`, `knockedout`, `yawn`, `emote`, `pinned`, `freeze`, `wonteatfood`, `ms_opengift`, `dismount`, `bucked`, `feedmount`, `oceanfishing_stoppedfishing`, `spooked`, `feastinterrupted`, `singsong`, `yotb_learnblueprint`, `hideandseek_start`, `perform_do_next_line`, `acting`, `startstageacting`, `monkeycursehit`, `pillowfight_ended`, `ms_closeportablestorage`, `woby_showrack`, `recoil_off`, `predict_gallop_trip`, `OnHop`, `OnElectrocute`, `OnCorpseChomped`, `animover`, `animqueueover`, `donetalking`, `startlongaction`, `ms_closepopup`, `stopworkout`, `intro`, `fishingcollect`, `onremovechanneler`, `onunpin`, `onremoveoccupier`, `firingnibble`, `fishingstrain`, `fishingcatch`, `fishingloserod`, `queue_post_eat_state`, `firedamage`, `ms_doneopengift`, `ms_endpumpkincarving`, `ms_closepopups`, `ms_endsnowmandecorating`, `ms_endplayingbalatro`, `ms_slingshotmodsclosed`, `stopliftingdumbbell`, `channel_finished`, `cancel_channel_longaction`, `fail_fx`, `fired`, `dropitem`, `gotosleep`, `dismounted`, `becomeunsittable`, `becomesittable`, `magicianstopped`, `onignite`, `onextinguish`, `onclose`, `oneat`, `oneatsoul`, `unfreeze`, `moisturedelta`, `percentusedchange`, `ms_giftopened`, `start_embark_movement`, `onhop`, `feetslipped`, `startchanneling`, `stopchanneling`, `makeplayerghost`, `playerdied`, `stopraisinganchor`, `lowering_anchor`, `stopfurling`, `stopconstruction`, `onclosewardrobe`, `onclosepopup`, `onstartteleport`, `onstopteleport`, `onremoveteleportee`, `actionfailed`, `cancel_channel_longaction`, `fail_fx`.

**Pushes:**
- `ms_closepopups`, `ms_closepopup`, `attacked`, `knockback`, `feasterstarted`, `wonteatfood`, `onextinguish`, `onignite`, `onremove`, `stopfurling`, `stopchanneling`, `colourtweener_start`, `colourtweener_end`, `invincibletoggle`, `feedincontainer`, `feedmount`, `oneat`, `oneatsoul`, `fishingcollect`, `unfreeze`, `moisturedelta`, `percentusedchange`, `ms_giftopened`, `gotosleep`, `dismounted`, `becomeunsittable`, `becomesittable`, `stoppushing`, `magicianstopped`, `onclose`, `dropitem`, `onunpin`, `onstopconstruction`, `stopconstruction`, `onclosewardrobe`, `onclosepopup`, `onstartteleport`, `onstopteleport`, `onremoveteleportee`, `start_embark_movement`, `onhop`, `locomote`, `feetslipped`, `startchanneling`, `stopchanneling`, `makeplayerghost`, `playerdied`, `animover`, `startlongaction`, `stopraisinganchor`, `actionfailed`, `cancel_channel_longaction`, `fail_fx`, `equip`, `unequip`, `animqueueover`, `performaction`, `catch`, `cancelcatch`, `stopfurling`, `stop_steering_boat`.