---
id: cozy_bunnymanbrain
title: Cozy Bunnymanbrain
description: Controls the AI decision-making logic for the Cozy Rabbit, including pillow-fight minigame participation, carrot-spin minigame management, sleep cycles, Cheer behaviors, and panic responses.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 66cf2101
---

# Cozy Bunnymanbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain implements the behavior tree for the Cozy Rabbit entity, enabling complex interactions during the YOTR (Year of the Rabbit) event. It orchestrates minigame participation (pillow-fight and carrot-spin), home/pillow management, idle reactions (cheering, questioning, hiding), and panic behaviors triggered by being haunted, on fire, or during hide events. The brain coordinates with multiple components—including `combat`, `inventory`, `minigame_participator`, `sleeper`, and `knownlocations`—to maintain coherent state-driven behavior across dynamic game conditions.

## Dependencies & Tags

- **Components used:**
  - `combat` (SetTarget, DropTarget)
  - `entitytracker` (TrackEntity, GetEntity, ForgetEntity)
  - `hauntable` (panic property)
  - `health` (takingfiredamage property)
  - `homeseeker` (GetHome)
  - `inventory` (FindItem, GetEquippedItem, GetItemByName, GiveItem)
  - `inventoryitem` (owner property)
  - `knownlocations` (GetLocation)
  - `minigame` (GetIsIntro, GetIsOutro)
  - `minigame_participator` (CurrentMinigameType, GetMinigame)
  - `minigame_spectator` (none used directly)
  - `sleeper` (IsAsleep)
  - `timer` (StartTimer, StopTimer, TimerExists)
  - `trader` (IsTryingToTradeWithMe)

- **Tags:**
  - None explicitly added/removed by this brain. Entities typically gain tags like `rabbit`, `pigman`, `minigame_participator`, and `minigame_spectator` elsewhere.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.needspillow` | boolean | nil | Indicates the rabbit needs to retrieve its floor pillow (set by `shouldgobacktocave` when floor pillow is removed from world). |
| `inst.isleaveing` | boolean | nil | Set to true when the rabbit should return to the cave; blocks pillow-related actions until resolved. |
| `inst.gamehost` | boolean | nil | Set to true if this rabbit is hosting a carrot-spin minigame. |
| `inst.carrotgamestatus` | string | nil | Tracks state in carrot-spin: `"home"`, `"start"`, `"startcheer"`, `"drop"`, `"return"`, `"wait"`, `"declare"`, `"winnercheer"`, `"prizedeliver"`, `"prizedelivered"`, `"givenuggets"`. |
| `inst.fightprizes` | array | nil | List of prize tables (`{winner, prize}`) to drop after a pillow fight; processed in order. |
| `inst.sayspoilsport` | boolean | nil | Indicates this rabbit should react as spoilsport if goop remains uneaten. |
| `inst.shouldhide` | boolean | nil | Triggers hiding behavior when set. |
| `inst.shouldquestion` | boolean | nil | If true during idle, triggers question event. |

## Main Functions

### `plantpillow(inst)`
* **Description:** Plans an action to drop the rabbit's held pillow at its pillow spot (`pillowSpot` location) if conditions allow (not busy, sleeping, hiding, or already at home).  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction` for `ACTIONS.DROP`, or `nil` if preconditions not met.

### `gotopillowlocation(inst)`
* **Description:** Plans an action to walk to the pillow drop location (`pillowSpot`) if the rabbit has a pillow and is not busy or sleeping.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction` for `ACTIONS.WALKTO`, or `nil`.

### `shouldgobacktocave(inst)`
* **Description:** Evaluates whether the rabbit should return to the cave because its floor pillow is no longer placed in the world (e.g., picked up or removed). If so, sets `inst.isleaveing` to true and pushes `"gobacktocave"` event.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `nil` — Always returns `nil`, but may push an event or set flags.

### `shouldcheer(inst)`
* **Description:** If the rabbit is idle, it may push `"cheer"` (with `COZY_RABBIT_CHEER` or `COZY_RABBIT_MOON` text on full moon) or `"question"` events based on random chance. Also sets `inst.shouldquestion` when triggered.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `nil`.

### `shouldgotopillowforsleep(inst)`
* **Description:** If it is daytime and the rabbit has a floor pillow at its location, plans an action to walk to the pillow to prepare for sleeping. Drops current combat target.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction` for `ACTIONS.WALKTO`, or `nil`.

### `randompillowswing(inst)`
* **Description:** If in the arena, attempts to randomly swing a pillow at another nearby rabbit not in the minigame. Sets target, starts a 10-second cooldown, and clears target after swing succeeds/fails.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction` for `ACTIONS.ATTACK`, or `nil`.

### `checkforcarrotgame(inst)`
* **Description:** Determines whether the rabbit should host a carrot-spin minigame. Hosts if it holds a carrot or randomly (5% chance) during night, and no game is in progress. Sets `inst.gamehost = true`, `inst.carrotgamestatus = "home"`, and starts cooldowns.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `true` (if hosting), or `nil` (if not).

### `carrotgamemanager(inst)`
* **Description:** Manages the full lifecycle of a hosted carrot-spin minigame: walking to home, spinning, dropping carrot, detecting winner by angle, declaring winner, delivering prize (Hareball/Goop), and rewarding winner (Gold Nugget or Lucky Gold Nugget). Updates `inst.carrotgamestatus` to progress states.  
* **Parameters:** `inst` — The rabbit entity (must be game host).  
* **Returns:** `BufferedAction` at relevant states, or `nil`.

### `carrotgameplayer(inst)`
* **Description:** Handles non-host rabbit participation in the carrot-spin minigame: walking to home, cheering at start, cheering winner, or reacting at end (`COZY_RABBIT_YAY`).  
* **Parameters:** `inst` — The rabbit entity (non-host participant).  
* **Returns:** `BufferedAction`, or `nil`.

### `shouldeatcarrot(inst)`
* **Description:** If the rabbit has collected a carrot (tracked via `entitytracker`) and it has no owner, plans `ACTIONS.EAT`. Otherwise forgets the carrot.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction` for `ACTIONS.EAT`, or `nil`.

### `eatgoop(inst)`
* **Description:** If `inst.gooptoeat` exists and is not owned, plans `ACTIONS.EAT` on it.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction` for `ACTIONS.EAT`, or `nil`.

### `getpillow(inst)`
* **Description:** Attempts to pick up the floor pillow if the rabbit needs it (`inst.needspillow`) and it is on the ground. Plans `ACTIONS.WALKTO` or `ACTIONS.PICKUP` accordingly.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction`, or `nil`.

### `shouldgotoarena(inst)`
* **Description:** If the rabbit has its pillow equipped, not busy, and no pillowfight location set, pushes `"digtolocation"` with the arena entity to begin entering the arena.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `nil`.

### `shoulddigbacktopillowring(inst)`
* **Description:** If `inst._return_to_pillow_spot` is set, pushes `"digtolocation"` with the original pillow spot position.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `nil`.

### `dropprizeforplayer(inst)`
* **Description:** Plans `ACTIONS.DROP` for the first prize in `inst.fightprizes`, placing it near the winner. Removes the prize after drop via success action.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `BufferedAction`, or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Returns closest player within `START_FACE_DIST` if not busy, not asleep, not holding carrot, and no `facetime_delay` timer active. Starts `facetime` (5s) and `facetime_delay` (15s) timers.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `Entity` or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Validates whether face targeting should continue: both valid, within `KEEP_FACE_DIST`, `facetime` timer active, and not ghost/notarget.  
* **Parameters:**  
  - `inst` — The rabbit entity.  
  - `target` — The entity being faced.  
* **Returns:** `boolean`.

### `GetSpinFaceTargetFn(inst)`
* **Description:** Returns the nearest rabbit currently in `carrotgamestatus` ("start", "drop", etc.).  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `Entity` or `nil`.

### `KeepSpinFaceTargetFn(inst, target)`
* **Description:** Returns true if target is valid and has `carrotgamestatus` truthy.  
* **Parameters:**  
  - `inst` — The rabbit entity.  
  - `target` — The spinning rabbit.  
* **Returns:** `boolean`.

### `PanicChat(inst)`
* **Description:** Returns a string from `RABBIT_PANICHAUNT`, `RABBIT_PANICFIRE`, or `COZY_RABBIT_PANICHIT` depending on hauntable panic, fire damage, or hide timer. Used for `ChattyNode` during panic.  
* **Parameters:** `inst` — The rabbit entity.  
* **Returns:** `string` or `nil`.

## Events & Listeners

- **Listens to:**
  - `"onremove"` — Registers cleanup for `entitytracker` entries (via `TrackEntity` helper).
  - `"onpickup"` — Listened on the tracked carrot to trigger `OnAttacked` if another entity picks it up.
  - `"oneaten"` — Listened on the goop (`Hareball`) to detect if the correct winner eats it, and to call `gookeaten`.

- **Pushes:**
  - `"droppedtarget"` — From `combat:DropTarget` when target changes.
  - `"question"`, `"cheer"`, `"dance"`, `"disappoint"` — Via `inst:PushEvent("cheer", data)` for behavioral responses.
  - `"gobacktocave"` — When rabbit should return to the cave.
  - `"digtolocation"` — To signal intent to dig to arena or pillow ring location.
  - `"hide"` — When `trytohide` is triggered.
  - `"raiseobject"` — Before starting pillow-fight minigame swing.
  - `"setupprizes"` — When prizes (e.g., Gold Nuggets) are ready to be awarded.

- **No events are pushed by the brain directly outside of action functions or event callbacks.**

- **No events are listened to via `inst:ListenForEvent` outside of carrot/goop tracking and minigame states.**