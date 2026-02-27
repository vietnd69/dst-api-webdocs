---
id: mermbrain
title: Mermbrain
description: Implements the decision-making logic for merms, managing movement, combat, tool acquisition, trade, home seeking, throne pursuit, and cooperative gardening or mining behavior in DST.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 9b4a7ea5
---

# Mermbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`MermBrain` is a brain component that controls the behavioral decision-making of merm NPCs in Don't Starve Together. It organizes a hierarchy of behavior nodes using a priority-based behavior tree (`BT`) to determine the merm's actions at any given moment. Core responsibilities include seeking and collecting tools, approaching and following leaders (including players), pursuing merm thrones, resting at home during night, answering calling offering pots, assisting leaders with digging or tilling, trading, healing, and reacting to danger via panic or running away. The brain integrates with several components—including `combat`, `inventory`, `follower`, `homeseeker`, `mermkingmanager`, and `trader`—to make context-aware decisions based on game state, environment, and entity interactions.

## Dependencies & Tags
- **Components used:** `burnable`, `childspawner`, `combat`, `container`, `eater`, `equippable`, `follower`, `homeseeker`, `inventory`, `inventoryitem`, `knownlocations`, `mermkingmanager`, `playercontroller`, `timer`, `tool`, `trader`.
- **Tags:** `mermthrone`, `merm_toolshed`, `merm_toolshed_upgraded`, `merm_tool`, `merm_tool_upgraded`, `mermprince`, `shadowminion`, `lunarminion`, `NPC_contestant`, `DIG_workable`, `tree`, `carnivalgame_part`, `event_trigger`, `waxedplant`, `merm_soil_blocker`, `farm_debris`, `NOBLOCK`, `edible_VEGGIE`, `INLIMBO`, `outofreach`, `scarytoprey`, `burnt`, `merm`.
- **Keys stored on `inst` (temporary state):** `digtile`, `stump_target`, `yotb_post_to_mark`, `yotb_prize_to_collect`, `answerpotcall`, `yotb_contest_target`.

## Properties
None. This component has no explicit properties beyond the behavior tree (`self.bt`) and inherited `Brain` fields. State and logic are entirely encapsulated within the behavior tree node definitions and helper functions.

## Main Functions

### `MermBrain:OnStart()`
* **Description:** Initializes the behavior tree (`self.bt`) with all priority-ordered behavior nodes. This function is called when the brain is attached to an instance (`inst`) and starts controlling behavior. It constructs a priority node tree that evaluates different tasks in order based on conditions (e.g., combat, throne seeking, home return, leadership following).
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` with a constructed `BT` instance.

## Helper Functions (Core Logic Gatekeepers & Actions)
The brain relies on numerous helper functions to evaluate conditions and generate actions. They are not part of the class but are critical for node behavior:

### `GetLeader(inst)`
* **Description:** Returns the current leader of the merm, if any, using `follower:GetLeader()`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Entity or `nil`.

### `GetHealerFn(inst)`
* **Description:** Scans nearby players to find one attempting to heal this merm via `ACTIONS.HEAL`. Only considers players who are also the merm’s leader or fellow merms, and only if not currently targeted by this merm in combat.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Player entity performing the heal action, or `nil`.

### `KeepHealerFn(inst, target)`
* **Description:** Verifies that a given target is still valid for keeping the healing face action active. Ensures the target is the leader or a merm, not currently targeted, and still attempting to heal.
* **Parameters:** `inst` (Entity), `target` (Entity).
* **Returns:** Boolean.

### `GetTraderFn(inst)`
* **Description:** Finds a nearby player attempting to trade with this merm using `trader:IsTryingToTradeWithMe()`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Player entity attempting trade, or `nil`.

### `KeepTraderFn(inst, target)`
* **Description:** Confirms that `target` is still trying to trade with this merm.
* **Parameters:** `inst` (Entity), `target` (Entity).
* **Returns:** Boolean.

### `GetFaceTargetFn(inst)`
* **Description:** Returns a target to face (e.g., nearest player or the merm’s leader), unless a “dontfacetime” timer exists. Starts a “facetime” timer if applicable.
* **Parameters:** `inst` (Entity).
* **Returns:** Entity or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Ensures the face target remains valid (same leader or close within `SEE_PLAYER_DIST`), and stops the “facetime” timer if invalid.
* **Parameters:** `inst` (Entity), `target` (Entity).
* **Returns:** Boolean.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the merm’s current combat target for use in running away (e.g., to dodge melee swings).
* **Parameters:** `inst` (Entity).
* **Returns:** Entity (combat target), or `nil`.

### `EatFoodAction(inst)`
* **Description:** Attempts to eat food if not waking. Prioritizes food in inventory; otherwise searches for edible food within `SEE_FOOD_DIST` that is safe (not near scary things, on valid ground).
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `IsThroneValid(inst)`
* **Description:** Checks if the merm’s associated throne is valid (exists, not burning, not burnt, and `mermkingmanager:ShouldGoToThrone()` returns `true`).
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `ShouldGoToThrone(inst)`
* **Description:** Checks if this merm should attempt to go to its throne (or a nearby throne if not assigned yet), provided no combat target exists.
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `GetThronePosition(inst)`
* **Description:** Returns the position of the merm’s current throne (if assigned).
* **Parameters:** `inst` (Entity).
* **Returns:** Vector3 or `nil`.

### `NeedsTool(inst)`
* **Description:** Determines if the merm lacks a hand-equippable tool. Checks equipped item and inventory.
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `GetClosestToolShed(inst, dist)`
* **Description:** Finds the closest valid tool shed (`merm_toolshed` or `merm_toolshed_upgraded`) within `dist` that can supply tools. Prefers upgraded sheds.
* **Parameters:** `inst` (Entity), `dist` (Number, optional, default: `FIND_SHED_RANGE`).
* **Returns:** Entity or `nil`.

### `GetClosestToolShedPosition(inst, dist)`
* **Description:** Returns the position adjacent to the closest valid tool shed.
* **Parameters:** `inst` (Entity), `dist` (Number).
* **Returns:** Vector3 or `nil`.

### `NeedsToolAndFoundTool(inst)`
* **Description:** Checks if the merm needs a tool *and* there is a nearby tool shed available.
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `CollectTool(inst)`
* **Description:** Triggers the “merm_use_building” event if a tool shed is nearby and the merm needs a tool.
* **Parameters:** `inst` (Entity).
* **Returns:** None.

### `PickupTool(inst)`
* **Description:** Attempts to pick up a tool (`merm_tool` or `merm_tool_upgraded`) on the ground if no tool is held or in inventory. Prioritizes upgraded tools.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `HasDigTool(inst)`
* **Description:** Checks if the currently equipped item is a tool capable of performing the `DIG` action.
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `GoHomeAction(inst)`
* **Description:** Returns an `ACTIONS.GOHOME` action if the merm has a valid, non-burning home and no combat target.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `ShouldGoHome(inst)`
* **Description:** Returns `true` if it is night and the merm’s home has more than one merm outside, or if the merm has no home at all (and is not following a leader).
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `IsHomeOnFire(inst)`
* **Description:** Checks if the merm’s home is currently on fire.
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the known location “home” if the merm has no leader; otherwise `nil`.
* **Parameters:** `inst` (Entity).
* **Returns:** Vector3 or `nil`.

### `CurrentContestTarget(inst)`
* **Description:** Returns the current target in a contest (e.g., a post or prize), based on `inst.npc_stage.current_contest_target`.
* **Parameters:** `inst` (Entity).
* **Returns:** Entity or stage object.

### `MarkPost(inst)`
* **Description:** Attempts to perform `ACTIONS.MARK` on `inst.yotb_post_to_mark`.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `CollectPrize(inst)`
* **Description:** Attempts to pick up `inst.yotb_prize_to_collect` if it is on ground level.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` or `nil`.

### `TargetFollowDistFn(inst)`
* **Description:** Computes a dynamic follow distance for `Follow` behavior. Higher loyalty reduces max distance; platform (e.g., boat) reduces range further.
* **Parameters:** `inst` (Entity).
* **Returns:** Number (distance).

### `collectdigsites(inst, digsites, tile)`
* **Description:** Adds viable dig positions to a list `digsites` within a farming tile, provided soil exists, no blockers, and tilling is possible.
* **Parameters:** `inst` (Entity), `digsites` (Table), `tile` (Table of tile coords).
* **Returns:** `digsites` (modified table).

### `findtillpos(inst)`
* **Description:** Finds a random tilling position near the merm (or `inst.digtile` if set) in farmland tiles.
* **Parameters:** `inst` (Entity).
* **Returns:** Vector3 or `nil`.

### `findTillTarget(inst, finddist)`
* **Description:** Wrapper returning `findtillpos(inst)`.
* **Parameters:** `inst` (Entity), `finddist` (Number).
* **Returns:** Vector3 or `nil`.

### `findDigTarget(inst, finddist)`
* **Description:** Finds the nearest entity with `FARM_DEBRIS_TAGS`.
* **Parameters:** `inst` (Entity), `finddist` (Number).
* **Returns:** Entity or `nil`.

### `TillAction(inst, leaderdist, finddist)`
* **Description:** Creates a tilling action at a valid `findtillpos` using the equipped tool.
* **Parameters:** `inst` (Entity), `leaderdist`, `finddist` (Numbers).
* **Returns:** `BufferedAction` or `nil`.

### `DigAction(inst, leaderdist, finddist)`
* **Description:** Finds a nearby farm debris or stump for the merm to dig.
* **Parameters:** `inst` (Entity), `leaderdist`, `finddist` (Numbers).
* **Returns:** `BufferedAction` or `nil`.

### `dig_clump_starter(inst, finddist)`
* **Description:** Returns target for starting clump digging: stump or found dig/till target, if leader is already digging/tilling.
* **Parameters:** `inst` (Entity), `finddist` (Number).
* **Returns:** Entity or `nil`.

### `dig_clump_keepgoing(inst, leaderdist, finddist)`
* **Description:** Returns `true` if the merm should continue clump digging (still has `stump_target` or leader is nearby).
* **Parameters:** `inst` (Entity), `leaderdist`, `finddist` (Numbers).
* **Returns:** Boolean.

### `dig_clump_finder(inst, leaderdist, finddist)`
* **Description:** Attempts to find a dig or till action to resume.
* **Parameters:** `inst` (Entity), `leaderdist`, `finddist` (Numbers).
* **Returns:** `BufferedAction` or `nil`.

### `dig_stump_starter(inst, finddist)`
* **Description:** Returns stump target if present, or nearest `DIG_TAGS` entity.
* **Parameters:** `inst` (Entity), `finddist` (Number).
* **Returns:** Entity or `nil`.

### `dig_stump_keepgoing(inst, leaderdist, finddist)`
* **Description:** Returns `true` if continuing stump digging (has `stump_target` or leader is nearby).
* **Parameters:** `inst` (Entity), `leaderdist`, `finddist` (Numbers).
* **Returns:** Boolean.

### `dig_stump_finder(inst, leaderdist, finddist)`
* **Description:** Finds a stump or diggable entity for the merm.
* **Parameters:** `inst` (Entity), `leaderdist`, `finddist` (Numbers).
* **Returns:** `BufferedAction` or `nil`.

### `shouldanswercall(inst)`
* **Description:** Checks if the merm should answer an offering pot call (not a lunar/shadow minion, not following a leader, and a non-empty offering pot exists and has a valid caller).
* **Parameters:** `inst` (Entity).
* **Returns:** Boolean.

### `Getcalledofferingpot(inst)`
* **Description:** Returns the position adjacent to the offering pot the merm should stand at.
* **Parameters:** `inst` (Entity).
* **Returns:** Vector3 or `nil`.

### `answercall(inst)`
* **Description:** Instructs the stored `answerpotcall` pot to process the merm’s answer.
* **Parameters:** `inst` (Entity).
* **Returns:** None.

## Events & Listeners
- **Listens to:** `onremove` (on candidate removal, via `MermKingManager`), `death` (on candidate removal, via `MermKingManager`).
- **Pushes:** `merm_use_building` (when `CollectTool` is invoked), `onarrivedatthrone` (when reaching throne), internal `chatterstring` events via `ChattyNode` (e.g., `"MERM_TALK_CONTEST_PANIC"`, `"MERM_TALK_PANICBOSS"`).