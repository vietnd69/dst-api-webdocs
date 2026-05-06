---
id: mermbrain
title: Mermbrain
description: AI behaviour tree for merm entities, managing combat, trading, tool collection, throne seeking, and follower behaviours based on environmental state and player proximity.
tags: [brain, ai, merm, behaviour-tree, npc]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: brains
source_hash: c4f970ff
system_scope: brain
---

# Mermbrain

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`MermBrain` is the AI behaviour tree for merm prefabs. It orchestrates complex decision-making including panic responses to threats, tool collection from toolsheds, throne seeking for king candidacy, trading with players, following leaders, eating food, and returning home. The brain prioritises survival behaviours (panic, flee) over utility behaviours (trading, tool collection) over idle behaviours (wandering). Brains are paused when the entity is far from any player and resume automatically on player proximity. Brain trees are attached via `RunBrain(inst, MermBrain)`.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/mermbrain")
RunBrain(inst, brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end
```

## Dependencies & tags
**External dependencies:**
- `behaviours/wander` -- Wander behaviour node factory
- `behaviours/runaway` -- RunAway behaviour node factory
- `behaviours/doaction` -- DoAction behaviour node factory
- `behaviours/panic` -- Panic behaviour node factory
- `behaviours/follow` -- Follow behaviour node factory
- `brains/braincommon` -- Shared brain utility functions and nodes

**Components used:**
- `follower` -- GetLeader(), GetLoyaltyPercent() for leader tracking and follow distance
- `combat` -- TargetIs(), InCooldown(), target for combat state checks
- `inventory` -- FindItem(), GetEquippedItem() for tool and food management
- `eater` -- CanEat() for food validation
- `timer` -- TimerExists(), StartTimer(), StopTimer() for face timing
- `homeseeker` -- home property for home position
- `knownlocations` -- GetLocation() for stored home position
- `trader` -- IsTryingToTradeWithMe() for trade detection
- `equippable` -- equipslot for hand equipment checks
- `tool` -- CanDoAction() for tool validation
- `container` -- IsEmpty() for offering pot checks
- `burnable` -- IsBurning() for fire detection on home/throne
- `childspawner` -- CountChildrenOutside() for home occupancy checks
- `playercontroller` -- GetRemoteInteraction() for remote action detection

**Tags:**
- `merm` -- checked for ally identification in healing/trading
- `mermthrone` -- searched for throne seeking behaviour
- `merm_toolshed`, `merm_toolshed_upgraded` -- toolshed location tags
- `merm_tool`, `merm_tool_upgraded` -- tool pickup tags
- `edible_VEGGIE` -- food type filter for eating
- `INLIMBO`, `outofreach` -- exclusion tags for food targeting
- `scarytoprey` -- threat detection for food area safety
- `lunarminion`, `shadowminion` -- exclusion from offering pot calls
- `NPC_contestant` -- contest mode behaviour branch
- `burnt` -- exclusion for burnt home/throne
- `offering_pot` -- offering pot detection for call response

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SEE_PLAYER_DIST` | constant (local) | `5` | Range in tiles within which merms begin facing players. |
| `SEE_FOOD_DIST` | constant (local) | `10` | Maximum search radius for edible food items. |
| `MAX_WANDER_DIST` | constant (local) | `15` | Maximum wander radius from home position when idle. |
| `MAX_CHASE_TIME` | constant (local) | `10` | Maximum chase duration in seconds during combat. |
| `MAX_CHASE_DIST` | constant (local) | `20` | Maximum chase distance during combat before giving up. |
| `RUN_AWAY_DIST` | constant (local) | `5` | Distance threshold to trigger runaway behaviour from combat target. |
| `STOP_RUN_AWAY_DIST` | constant (local) | `8` | Distance at which runaway behaviour stops fleeing. |
| `MIN_FOLLOW_DIST` | constant (local) | `3` | Minimum follow distance from leader. |
| `MAX_FOLLOW_DIST` | constant (local) | `15` | Base maximum follow distance from leader (modulated by loyalty). |
| `SEE_THRONE_DISTANCE` | constant (local) | `50` | Maximum search radius for merm throne when seeking king candidacy. |
| `FACETIME_BASE` | constant (local) | `2` | Base duration in seconds for face timer. |
| `FACETIME_RAND` | constant (local) | `2` | Random addition to face timer duration (0-2 seconds). |
| `FIND_SHED_RANGE` | constant (local) | `15` | Search radius for finding toolsheds. |
| `TRADE_DIST` | constant (local) | `20` | Maximum distance for detecting player trade attempts. |
| `EATFOOD_MUST_TAGS` | constant (local) | `{ "edible_VEGGIE" }` | Must-have tags for food targeting in EatFoodAction. |
| `EATFOOD_CANT_TAGS` | constant (local) | `{ "INLIMBO", "outofreach" }` | Exclusion tags for food targeting in EatFoodAction. |
| `SCARY_TAGS` | constant (local) | `{ "scarytoprey" }` | Threat detection tags for food area safety in EatFoodAction. |
| `GOTOTHRONE_TAGS` | constant (local) | `{ "mermthrone" }` | Search tags for throne seeking in ShouldGoToThrone. |
| `TOOLSHED_ONEOF_TAGS` | constant (local) | `{ "merm_toolshed", "merm_toolshed_upgraded" }` | Search tags for toolshed location in GetClosestToolShed. |
| `MERM_TOOL_CANT_TAGS` | constant (local) | `{ "INLIMBO" }` | Exclusion tags for tool pickup in PickupTool. |
| `MERM_TOOL_ONEOF_TAGS` | constant (local) | `{ "merm_tool", "merm_tool_upgraded" }` | Search tags for tool pickup in PickupTool. |
| `OFFERINGPOT_MUST_TAGS` | constant (local) | `{ "offering_pot" }` | Search tags for offering pot detection in shouldanswercall. |

## Main functions

### `OnStart()` (Brain method)
* **Description:** Constructs the root PriorityNode behaviour tree with nested nodes for panic, combat, tool collection, throne seeking, trading, following, and wandering. Called once when the brain is attached and on resume after pause. The tree prioritises survival (panic, flee) over utility (trading, tools) over idle (wander).
* **Parameters:** `self` -- the brain instance (implicit via method syntax)
* **Returns:** None (assigns `self.bt` with the behaviour tree)
* **Error states:** Errors if required components (timer, combat, follower, homeseeker, knownlocations) are missing on inst — no nil guards present before component method calls in behaviour tree nodes.

### `GetLeader(inst)` (local)
* **Description:** Returns the leader entity if the merm has a follower component with an assigned leader. Used throughout the brain to determine if the merm should follow or act independently.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Leader entity instance or `nil` if no leader exists
* **Error states:** None — guards `inst.components.follower` access with nil check.

### `GetHealerFn(inst)` (local)
* **Description:** Searches for players within `TRADE_DIST` who are attempting to heal the merm. Returns the first valid healer candidate who is either the leader or another merm, and is not currently a combat target.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Player entity instance or `nil` if no healer found
* **Error states:** Errors if `inst.Transform` is nil (entity not properly initialised). Errors if `inst.components.combat` is nil (no nil guard before :TargetIs() call).

### `KeepHealerFn(inst, target)` (local)
* **Description:** Validation function for the FaceEntity node. Returns true if the target is still attempting to heal the merm (via buffered action or remote interaction). Used to maintain face orientation toward healer.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `target` -- candidate healer entity
* **Returns:** boolean
* **Error states:** Errors if `inst.components.combat` is nil (no nil guard before :TargetIs() call).

### `GetTraderFn(inst)` (local)
* **Description:** Searches for players within `TRADE_DIST` who are attempting to trade with the merm. Returns the first valid trader candidate.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Player entity instance or `nil` if no trader found
* **Error states:** Errors if `inst.Transform` is nil or `inst.components.trader` is nil (no nil guard before :IsTryingToTradeWithMe() call).

### `KeepTraderFn(inst, target)` (local)
* **Description:** Validation function for FaceEntity nodes during trading. Returns true if the target is still attempting to trade with the merm.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `target` -- candidate trader entity
* **Returns:** boolean
* **Error states:** Errors if `inst.components.trader` is nil.

### `GetFaceTargetFn(inst)` (local)
* **Description:** Determines the entity the merm should face. Returns the leader if present, otherwise the closest player within `SEE_PLAYER_DIST`. Starts a "facetime" timer when a face target is found (unless "dontfacetime" timer exists).
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Entity instance to face or `nil`
* **Error states:** Errors if `inst.components.timer` is nil.

### `KeepFaceTargetFn(inst, target)` (local)
* **Description:** Validation function for FaceEntity nodes. Returns true if the target is still valid to face (leader match or within `SEE_PLAYER_DIST`). Stops the "facetime" timer if the target is no longer valid.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `target` -- current face target entity
* **Returns:** boolean
* **Error states:** Errors if `inst.components.timer` is nil.

### `GetRunAwayTarget(inst)` (local)
* **Description:** Returns the current combat target for the RunAway behaviour node. Used when the merm needs to flee from its attacker during combat cooldown.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Combat target entity or `nil`
* **Error states:** Errors if `inst.components.combat` is nil.

### `EatFoodAction(inst)` (local)
* **Description:** Creates a BufferedAction for eating food. First checks inventory for edible items or moonglass pieces. If no inventory food and no leader, searches nearby for edible items excluding scary threats. Returns nil if entity is in "waking" state.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** BufferedAction instance or `nil`
* **Error states:** Errors if `inst.sg` is nil (no guard before `inst.sg:HasStateTag` call).

### `IsThroneValid(inst)` (local)
* **Description:** Validates whether a throne is available and safe for the merm to approach for king candidacy. Checks throne exists, is valid, not burning, not burnt, and ShouldGoToThrone returns true.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** None

### `ShouldGoToThrone(inst)` (local)
* **Description:** Determines if the merm should seek a throne. Returns true if a throne exists within `SEE_THRONE_DISTANCE` and MermKingManager approves the candidacy.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** None

### `GetThronePosition(inst)` (local)
* **Description:** Returns the world position of the merm's assigned throne for the Leash behaviour node.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Vector3 position table or `nil`
* **Error states:** None

### `IsHandEquip(item)` (local)
* **Description:** Checks if an item has an equippable component equipped in the HANDS slot. Used by NeedsTool and PickupTool to identify hand tools in inventory.
* **Parameters:** `item` -- entity instance to check
* **Returns:** boolean
* **Error states:** None — guards item.components.equippable access with nil check.

### `NeedsTool(inst)` (local)
* **Description:** Checks if the merm needs a hand tool. Returns true if no tool is equipped in HANDS slot and no tool exists in inventory.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** None

### `GetClosestToolShed(inst, dist)` (local)
* **Description:** Finds the closest toolshed within range. Prioritises upgraded toolsheds over regular ones. Only returns sheds that CanSupply().
* **Parameters:**
  - `inst` -- entity owning the brain
  - `dist` -- search radius (default `FIND_SHED_RANGE`)
* **Returns:** Toolshed entity instance or `nil`
* **Error states:** Errors if `inst.Transform` is nil.

### `GetClosestToolShedPosition(inst, dist)` (local)
* **Description:** Returns a position adjacent to the closest toolshed for the Leash behaviour node.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `dist` -- search radius (default `FIND_SHED_RANGE`)
* **Returns:** Vector3 position table or `nil`
* **Error states:** Errors if `inst.Transform` is nil — GetClosestToolShed() called without guard accesses Transform:GetWorldPosition() without nil check.

### `NeedsToolAndFoundTool(inst)` (local)
* **Description:** Compound check for the IfNode. Returns true if the merm needs a tool AND a toolshed exists within range.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** Errors if `inst.Transform` is nil — GetClosestToolShed() called without guard accesses Transform:GetWorldPosition() without nil check.

### `CollectTool(inst)` (local)
* **Description:** Pushes "merm_use_building" event when the merm is near a toolshed (within 2.5 units) and needs a tool.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** None
* **Error states:** Errors if `inst.Transform` is nil — GetClosestToolShed() called without guard accesses Transform:GetWorldPosition() without nil check.

### `PickupTool(inst)` (local)
* **Description:** Creates a BufferedAction to pickup a tool from the ground. Prioritises upgraded tools. Returns nil if entity is in "busy" state or no tools found.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** BufferedAction instance or `nil`
* **Error states:** Errors if `inst.sg` or `inst.Transform` is nil.

### `HasDigTool(inst)` (local)
* **Description:** Checks if the merm has a digging tool equipped in the HANDS slot. Used to enable gardening and stump digging behaviours.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** None

### `GoHomeAction(inst)` (local)
* **Description:** Creates a BufferedAction for the GOHOME action. Returns nil if combat target exists, home is invalid, home is burning, or home is burnt.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** BufferedAction instance or `nil`
* **Error states:** None

### `ShouldGoHome(inst)` (local)
* **Description:** Determines if the merm should return home. Returns false if not daytime or if merm has a leader. Also checks if home childspawner has multiple children outside (one merm should stay outside).
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** None

### `IsHomeOnFire(inst)` (local)
* **Description:** Checks if the merm's home is currently burning. Used to trigger panic behaviour.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** None

### `GetNoLeaderHomePos(inst)` (local)
* **Description:** Returns the home position for the Wander node when the merm has no leader. Returns nil if merm has a leader.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Vector3 position table or `nil`
* **Error states:** Errors if `inst.components.knownlocations` is nil.

### `CurrentContestTarget(inst)` (local)
* **Description:** Returns the current contest target for NPC contestants. Used during YOTB contest mode.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Contest target entity or the stage itself
* **Error states:** Errors if `inst.npc_stage` is nil.

### `MarkPost(inst)` (local)
* **Description:** Creates a BufferedAction to mark a YOTB post if `yotb_post_to_mark` is set.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** BufferedAction instance or `nil`
* **Error states:** None — guards `inst.yotb_post_to_mark` with nil check.

### `CollectPrize(inst)` (local)
* **Description:** Creates a BufferedAction to collect a YOTB prize if `yotb_prize_to_collect` is set and valid (on ground, not in limbo).
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** BufferedAction instance or `nil`
* **Error states:** Errors if `inst.yotb_prize_to_collect.Transform` is nil (parent object guarded but Transform property not checked before access).

### `TargetFollowDistFn(inst)` (local)
* **Description:** Calculates dynamic follow distance based on follower loyalty and boat status. Higher loyalty = further follow distance. Boat presence reduces max range by 80%.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** number (follow distance in units)
* **Error states:** None — the function guards inst.components.follower access with nil check and defaults to 0.5 loyalty.

### `shouldanswercall(inst)` (local)
* **Description:** Checks if the merm should respond to an offering pot call. Returns false if merm is lunarminion, shadowminion, or has a leader. Searches for offering pots with valid merm_caller and non-empty container.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** boolean
* **Error states:** Errors if `inst.Transform` is nil.

### `Getcalledofferingpot(inst)` (local)
* **Description:** Returns a position adjacent to the offering pot for the Leash behaviour node when answering a call.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Vector3 position table or `nil`
* **Error states:** None — guards `inst.answerpotcall` with nil and IsValid checks.

### `answercall(inst)` (local)
* **Description:** Calls AnswerCall() on the offering pot when the merm arrives.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** None
* **Error states:** None — guards `inst.answerpotcall` with nil and IsValid checks.

## Events & listeners
- **Pushes:** `merm_use_building` — fired in `CollectTool()` when the merm collects a tool from a toolshed; data includes `{ target = shed }`.
- **Pushes:** `onarrivedatthrone` — fired when the merm successfully arrives at a valid throne position during throne-seeking behaviour.
- **Listens to:** None — brain trees react to component state changes through behaviour tree nodes rather than direct event subscriptions. Event handling is managed by the host stategraph or component listeners.