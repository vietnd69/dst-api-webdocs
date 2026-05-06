---
id: SGwx78_possessedbody
title: Sgwx78 Possessedbody
description: Stategraph defining the behavior of WX-78's possessed body, including movement, combat, mining, eating, and special abilities.
tags: [player, movement, combat]
sidebar_position: 10
last_updated: 2026-05-06
build_version: 722832
change_status: stable
category_type: stategraphs
source_hash: d00b1fac
system_scope: player
---

# Sgwx78 Possessedbody

> Based on game build **722832** | Last updated: 2026-05-06

## Overview
`SGwx78_possessedbody` is the animation state machine for WX-78's possessed body. It uses components such as 'locomotor' for movement, 'health' for death handling, and 'inventory' for eating. It governs movement, combat, mining, eating, and special abilities (like frozen, stunned, and dance). Stategraphs are accessed via `StartStateGraph()` on the entity, not called as utility functions. Major state categories: locomotion (idle, run), combat (attack, hit), mining (chop, mine, dig), eating, death, and special states (frozen, stunned, dance).
## Usage example
```lua
-- In WX-78's prefab setup
inst:ListenForEvent("possessed", function(inst)
    inst:StartStateGraph("SGwx78_possessedbody")
    inst.sg:GoToState("spawn")
end)
```

## Dependencies & tags
**External dependencies:**
- `stategraphs/commonstates` -- Module containing common stategraph utilities (e.g., common states, events)
- `stategraphs/SGwx78_common` -- Module containing WX-78 specific stategraph utilities
- `prefabs/wx78_common` -- Module containing WX-78 specific prefab utilities

**Components used:**
- `inventory` -- Used for dropping items, getting equipped items, and inventory management (DropEverything, GetEquippedItem, GiveItem)
- `socketholder` -- Used for unsocketing items during death (UnsocketEverything)
- `follower` -- Used for retrieving leader entity (GetLeader)
- `locomotor` -- Used for movement control and state transitions (Stop, RunForward, Clear)
- `health` -- Used for checking death and invincibility states (IsDead, SetInvincible)
- `hunger` -- Used for checking hunger state and pausing/resuming (GetPercent, Pause, Resume)
- `sanity` -- Used for checking insanity mode and sanity level (IsInsanityMode, GetPercent)
- `talker` -- Used for voice management during spawn/despawn states (ShutUp, IgnoreAll, StopIgnoringAll)
- `burnable` -- Used for extinguishing fire during death/despawn states (Extinguish)
- `combat` -- Used for attack handling, cooldown management, and weapon access (GetWeapon, StartAttack, CancelAttack)
- `freezable` -- Used for checking frozen state during freeze transitions (IsFrozen, IsThawing)
- `pinnable` -- Used for unsticking during frozen state (IsStuck, Unstick)
- `drownable` -- Used for inventory drop during sinking and falling reason checks (DropInventory, GetFallingReason)
- `playercontroller` -- Used for remote pause prediction during eating (RemotePausePrediction)
- `eater` -- Used for eating food items (Eat)
- `souleater` -- Used for eating soul items (EatSoul)
- `embarker` -- Used for embark speed calculations (embark_speed field)
- `rider` -- Checked for riding state during eating (IsRiding)

**Tags:**
- `slowaction` -- added when doing long actions
- `wereplayer` -- checked (HasTag)
- `mime` -- checked (HasTag)
- `noquickpick` -- checked (HasTag)
- `fastpicker` -- checked (HasTag)
- `quagmire_fasthands` -- checked (HasTag)
- `quickeat` -- checked (HasTag)
- `sloweat` -- checked (HasTag)
- `fooddrink` -- checked (HasTag)
- `teeteringplatform` -- checked (HasTag)

## Properties

### Stategraph States
| State name | Tags | Description |
|------------|------|-------------|
| spawn | busy, notalking, noattack, nointerrupt | Initial state when the body is being powered on. |
| idle | idle, canrotate | Default resting state; loops idle animation. |
| funnyidle | idle, canrotate | Random idle animations based on hunger, sanity, or custom animations. |
| run_start | moving, running, canrotate | Transition to running state. |
| run | moving, running, canrotate | Running state. |
| run_stop | canrotate, idle | Transition from running to idle. |
| item_hat | idle, keepchannelcasting | State for equipping an item on the head. |
| item_in | idle, nodangle, keepchannelcasting | State for having an item equipped in the inventory. |
| item_out | idle, nodangle, keepchannelcasting | State for unequipping an item. |
| attack | attack, notalking, abouttoattack | Melee attack state. |
| blowdart | attack, notalking, abouttoattack | Blowdart attack state. |
| death | busy | Death state; plays death animation and transitions to backup body. |
| despawn | busy | Despawn state; powers off the body. |
| take | busy | Pickup state. |
| give | busy | Give/drop state. |
| hit | busy, keepchannelcasting | Hit state; plays hit animation. |
| frozen | busy, frozen, nodangle | Frozen state; plays frozen animation. |
| thaw | busy, thawing, nodangle | Thawing state; plays thawing animation. |
| stunned | busy, canrotate | Stunned state; plays sanity animation. |
| chop_start | prechop, working | Start chopping state. |
| chop | prechop, chopping, working | Chopping state. |
| mine_start | premine, working | Start mining state. |
| mine | premine, mining, working | Mining state. |
| mine_recoil | busy, recoil | Mine recoil state. |
| hammer_start | prehammer, working | Start hammering state. |
| hammer | prehammer, hammering, working | Hammering state. |
| attack_recoil | busy, recoil | Attack recoil state. |
| dig_start | predig, working | Start digging state. |
| dig | predig, digging, working | Digging state. |
| till_start | doing, busy | Start tilling state. |
| till | doing, busy, tilling | Tilling state. |
| dance | idle, dancing | Dance state. |
| dolongaction | doing, busy, nodangle | Long action state (e.g., building). |
| doshortaction | doing, busy | Short action state (e.g., picking up). |
| eat | busy, nodangle | Eat state for food. |
| quickeat | busy | Quick eat state for food. |
| refuseeat | busy | Refuse to eat state. |
| toolbroke | busy, pausepredict | Tool broke state. |
| armorbroke | busy, pausepredict | Armor broke state. |

### Constants
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `BLOWDART_TAGS` | table | `{"blowdart", "blowpipe"}` | Tags used for blowdart and blowpipe items. |
## Main functions
### `onenter (spawn)` (local)
* **Description:** Stops locomotor, plays idle animation, sets up chassis build override, sets health invincible, and shuts up talker if present.
* **Parameters:** `inst` -- entity instance, `data` -- optional spawn data
* **Returns:** nil
* **Error states:** Errors if `inst` has no `locomotor` component or no `health` component.
### `onexit (spawn)` (local)
* **Description:** Hides 'trapper' symbol, clears chassis build override, and stops ignoring talker events if present. Also sets health not invincible if state tag 'noattack' is present.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if inst has no health component
### `onenter (idle)` (local)
* **Description:** Sets up idle animation and timeout for random idle transitions.
* **Parameters:** `inst` -- entity instance, `pushanim` -- boolean to push or play animation
* **Returns:** nil
* **Error states:** None.
### `ontimeout (idle)` (local)
* **Description:** Transitions to funnyidle state after idle timeout.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None
### `onenter (funnyidle)` (local)
* **Description:** Plays custom idle animations based on hunger, sanity, or predefined conditions.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (run_start)` (local)
* **Description:** Starts running animation and movement.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onupdate (run_start)` (local)
* **Description:** Continues running movement during run_start state.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (run)` (local)
* **Description:** Sets up running animation and movement.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onupdate (run)` (local)
* **Description:** Continues running movement during run state.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** Errors if `inst` has no `locomotor` component.
### `ontimeout (run)` (local)
* **Description:** Maintains run state after timeout.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (run_stop)` (local)
* **Description:** Stops running movement and plays stop animation.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (item_hat)` (local)
* **Description:** Plays item hat animation when equipping headgear.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (item_in)` (local)
* **Description:** Plays item in animation for equipped items.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onexit (item_in)` (local)
* **Description:** Cleans up follow FX when exiting item_in state.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (item_out)` (local)
* **Description:** Plays item out animation when unequipping items.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (attack)` (local)
* **Description:** Sets up attack animation and cooldown based on equipped weapon. Plays weapon-specific sounds and handles projectile delays.
* **Parameters:** `inst` -- entity instance, `target` -- optional target entity
* **Returns:** nil
* **Error states:** None.
### `onupdate (attack)` (local)
* **Description:** Handles projectile delay logic for ranged attacks.
* **Parameters:** `inst` -- entity instance, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.
### `onenter (blowdart)` (local)
* **Description:** Sets up blowdart attack animation and cooldown. Handles projectile delays for chained attacks.
* **Parameters:** `inst` -- entity instance, `target` -- target entity
* **Returns:** nil
* **Error states:** None.
### `onupdate (blowdart)` (local)
* **Description:** Handles projectile delay logic for blowdart attacks.
* **Parameters:** `inst` -- entity instance, `dt` -- delta time
* **Returns:** nil
* **Error states:** None.
### `onenter (death)` (local)
* **Description:** Powers off the chassis, plays death sounds, and sets up gestalt animations.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (despawn)` (local)
* **Description:** Powers off the chassis for despawn sequence.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (take)` (local)
* **Description:** Plays pickup animation and triggers buffered action.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (give)` (local)
* **Description:** Plays give animation and triggers buffered action.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (hit)` (local)
* **Description:** Plays hit animation and sound. Sets stun duration based on frozen state.
* **Parameters:** `inst` -- entity instance, `frozen` -- optional freeze flag
* **Returns:** nil
* **Error states:** None.
### `onenter (frozen)` (local)
* **Description:** Sets frozen animation and sound. Checks thawing state and transitions appropriately.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (thaw)` (local)
* **Description:** Plays thawing animation and sound.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (stunned)` (local)
* **Description:** Plays sanity animation for stunned state.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (chop_start)` (local)
* **Description:** Starts chopping animation.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (chop)` (local)
* **Description:** Plays looping chop animation and triggers action.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (mine_start)` (local)
* **Description:** Starts mining animation.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (mine)` (local)
* **Description:** Plays looping mine animation and triggers action with FX.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (mine_recoil)` (local)
* **Description:** Plays recoil animation and applies physics for mine recoil.
* **Parameters:** `inst` -- entity instance, `data` -- recoil data
* **Returns:** nil
* **Error states:** None.
### `onenter (hammer_start)` (local)
* **Description:** Starts hammering animation.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (hammer)` (local)
* **Description:** Plays looping hammer animation and triggers action.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (attack_recoil)` (local)
* **Description:** Plays recoil animation and applies physics for attack recoil.
* **Parameters:** `inst` -- entity instance, `data` -- recoil data
* **Returns:** nil
* **Error states:** None.
### `onenter (dig_start)` (local)
* **Description:** Starts digging animation.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (dig)` (local)
* **Description:** Plays looping dig animation and triggers action.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (till_start)` (local)
* **Description:** Starts tilling animation (upside-down tool if applicable).
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (till)` (local)
* **Description:** Plays looping tilling animation and triggers action.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (dance)` (local)
* **Description:** Plays dance animation sequence from brain data.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (dolongaction)` (local)
* **Description:** Sets up long action animation and triggers action after delay.
* **Parameters:** `inst` -- entity instance, `timeout` -- optional timeout value
* **Returns:** nil
* **Error states:** None.
### `onenter (doshortaction)` (local)
* **Description:** Sets up short action animation and triggers action after delay.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (eat)` (local)
* **Description:** Sets up eating animation and pauses hunger. Handles food-specific logic.
* **Parameters:** `inst` -- entity instance, `foodinfo` -- food data
* **Returns:** nil
* **Error states:** None.
### `onenter (quickeat)` (local)
* **Description:** Sets up quick eating animation and pauses hunger.
* **Parameters:** `inst` -- entity instance, `foodinfo` -- food data
* **Returns:** nil
* **Error states:** None.
### `onenter (refuseeat)` (local)
* **Description:** Plays refusal animation for eating.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
### `onenter (toolbroke)` (local)
* **Description:** Plays tool break animation and spawns broken tool FX.
* **Parameters:** `inst` -- entity instance, `tool` -- broken tool item
* **Returns:** nil
* **Error states:** None.
### `onenter (armorbroke)` (local)
* **Description:** Plays armor break animation.
* **Parameters:** `inst` -- entity instance
* **Returns:** nil
* **Error states:** None.
## Events & listeners
- **Listens to:** None
- **Pushes:** `wonteatfood` -- pushed when refusing to eat food. Data: `{ food = ... }`
- **Pushes:** `startlongaction` -- pushed when starting a long action. Data: `inst`
