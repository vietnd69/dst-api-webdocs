---
id: abigailbrain
title: Abigailbrain
description: Controls Abigail's AI behavior by evaluating context-aware priorities for dancing, combat, following, haunting, and playful interactions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 025c19d9
---

# Abigailbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Abigailbrain` component defines the complete AI behavior tree for the Abigail ghost character in Don't Starve Together. It determines Abigail's actions based on the current game context—including leadership status, combat state, presence of trading partners,minigames, babysitters, and other ghosts—using a priority-based behavior tree. Behavior branches are evaluated dynamically and adapt to Abigail's mode (defensive or aggressive), transparency state, and current目标任务. It interacts closely with follower, combat, trader, minigame_participator, and timer components to coordinate socially aware and context-sensitive responses.

## Dependencies & Tags
- **Components used:**  
  `combat`, `follower`, `trader`, `minigame_participator`, `timer`, `playercontroller` (via `GetRemoteInteraction`), `talker` (indirectly via `combat:GiveUp`), `transform`
- **Tags:**  
  This brain does not directly manage tags on its instance. However, it checks tags on others: `busy` (excluded from playmates), `ghostkid`, `graveghost` (valid playmates), and internally uses stategraph tags like `swoop`, `dancing`, `busy`.
- **Stategraph tags observed:** `swoop`, `dancing`, `busy`

## Properties
No public properties are initialized directly in the constructor. The component relies on instance-specific state stored on `self.inst` (e.g., `is_defensive`, `_haunt_target`, `playfultarget`, `_is_transparent`, `_playerlink`, `ghost_babysitter`) and modifiable via prefabs and stategraph transitions.

## Main Functions
### `AbigailBrain:OnStart()`
* **Description:** Initializes the behavior tree for Abigail by constructing nested priority and while-nodes that define behavior order and conditions. The root node prioritizes state-based guards (e.g., not in `swoop` state), followed by dancing, minigame watching, transparency handling, haunting, and then context-dependent defensive/aggressive modes. Each mode combines tactical behaviors such as `Follow`, `ChaseAndAttack`, `Wander`, `RunAway`, and `FaceEntity`.
* **Parameters:** None. Uses `self.inst` to construct behavior nodes.
* **Returns:** None. Stores the compiled behavior tree in `self.bt`.

### Helper Functions (Internal)
The following functions are used exclusively within the brain's node definitions:

#### `GetLeader(inst)`
* **Description:** Retrieves Abigail's leader via the `follower` component.
* **Parameters:** `inst` — entity instance to query.
* **Returns:** Leader instance or `nil`.

#### `GetLeaderPos(inst)`
* **Description:** Returns the world position of Abigail's leader, if any.
* **Parameters:** `inst` — entity instance.
* **Returns:** World position (`x, y, z`) or `nil`.

#### `DanceParty(inst)`
* **Description:** Pushes a `"dance"` event to trigger Abigail's dancing animation/sfx.
* **Parameters:** `inst` — entity instance.
* **Returns:** None.

#### `HauntAction(inst)`
* **Description:** Constructs a `BufferedAction` to haunt the current `_haunt_target`, with success/failure callbacks for cleanup and a validity check ensuring the target is not in limbo.
* **Parameters:** `inst` — entity instance.
* **Returns:** `BufferedAction` instance configured for haunting.

#### `PlayWithPlaymate(self)`
* **Description:** Informs the game Abigail is playing with a ghost (pushes `"start_playwithghost"` event), resets the `"played_recently"` timer, and clears the `playfultarget` reference.
* **Parameters:** `self` — the brain instance.
* **Returns:** None.

#### `FindPlaymate(self)`
* **Description:** Attempts to locate or retain a nearby ghost playmate based on proximity to leader and recent-play cooldowns. Uses `FindEntity` with tag filters (`ghostkid`, `graveghost` included; `busy` excluded).
* **Parameters:** `self` — the brain instance.
* **Returns:** Boolean indicating if a playmate was found or retained.

#### `ShouldDanceParty(inst)`
* **Description:** Returns true if Abigail's leader is currently dancing (checked via stategraph tag `"dancing"`).
* **Parameters:** `inst` — entity instance.
* **Returns:** Boolean.

#### `GetTraderFn(inst)`
* **Description:** Checks if the leader is attempting to trade with Abigail.
* **Parameters:** `inst` — entity instance.
* **Returns:** Leader instance if trading intent detected; otherwise `nil`.

#### `KeepTraderFn(inst, target)`
* **Description:** Confirms if a given `target` is still attempting to trade with Abigail.
* **Parameters:**  
  `inst` — Abigail's instance.  
  `target` — entity instance to check.
* **Returns:** Boolean.

#### `ShouldWatchMinigame(inst)`
* **Description:** Returns true if Abigail should watch a minigame: leader exists, is a minigame participator, and either no combat target exists or the combat target is also a minigame participator.
* **Parameters:** `inst` — entity instance.
* **Returns:** Boolean.

#### `WatchingMinigame(inst)`
* **Description:** Returns the minigame component instance Abigail should watch, if any.
* **Parameters:** `inst` — entity instance.
* **Returns:** Minigame component instance or `nil`.

#### `DefensiveCanFight(inst)`
* **Description:** Determines if Abigail can currently fight while in defensive mode, based on combat target presence, `auratest`, and proximity constraints. May give up the target if conditions fail.
* **Parameters:** `inst` — entity instance.
* **Returns:** Boolean.

#### `AggressiveCanFight(inst)`
* **Description:** Determines if Abigail can currently fight while in aggressive mode, based on playerlink proximity and combat target constraints. May give up the target if conditions fail.
* **Parameters:** `inst` — entity instance.
* **Returns:** Boolean.

#### `GetBabysitterPos(inst)`
* **Description:** Returns the babysitter ghost's position if present, Abigail is not busy, and not in limbo.
* **Parameters:** `inst` — entity instance.
* **Returns:** World position (`x, y, z`) or `nil`.

#### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target as the target to run away from.
* **Parameters:** `inst` — entity instance.
* **Returns:** Combat target instance (usually the active enemy).

## Events & Listeners
- **Listens to:** None (the brain itself does not register event listeners).
- **Pushes:**  
  `"dance"` — pushed by `DanceParty`.  
  `"start_playwithghost"` — pushed by `PlayWithPlaymate`.  
  `"giveuptarget"` — triggered indirectly via `combat:GiveUp` when `DefensiveCanFight` or `AggressiveCanFight` calls `combat:GiveUp`.