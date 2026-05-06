---
id: wx78_possessedbodybrain
title: Wx78 Possessedbodybrain
description: AI brain for WX-78's possessed body, enabling it to assist a leader player by mirroring their actions, managing combat, and handling survival needs.
tags: [brain, ai, wx78, possessed-body]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: brains
source_hash: 188b021c
system_scope: brain
---

# Wx78 Possessedbodybrain

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78_PossessedBodyBrain` is the AI behaviour tree for WX-78's possessed body entity. It enables the possessed body to assist a leader player by mirroring their actions (chopping, mining, hammering, digging, tilling), engaging in combat when the leader attacks, and managing its own survival needs (eating, upgrading modules). The brain prioritises trader/feeder interactions, combat assistance, leader-following, and self-maintenance. Brains are paused when the entity is far from any player and resume automatically on player proximity. Brain trees are attached via `RunBrain(inst, Wx78_PossessedBodyBrain)`.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/wx78_possessedbodybrain")
inst:SetBrain(brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end
```

## Dependencies & tags
**External dependencies:**
- `behaviours/wander` -- imported but not referenced (unused import)
- `behaviours/faceentity` -- FaceEntity behaviour node factory
- `behaviours/chaseandattack` -- ChaseAndAttack behaviour node factory
- `behaviours/doaction` -- DoAction behaviour node factory
- `behaviours/leash` -- imported but not referenced (unused import)
- `behaviours/standstill` -- StandStill behaviour node factory
- `behaviours/runawaytodist` -- RunAwayToDist behaviour node factory
- `brains/braincommon` -- NodeAssistLeaderDoAction helper function

**Components used:**
- `trader` -- queried via `IsTryingToTradeWithMe` to detect trading players
- `eater` -- queried via `IsTryingToFeedMe`, `CanEat`, `CanProcessSpoiledItem` for feeding logic
- `follower` -- queried via `GetLeader` to identify the leader entity
- `inventory` -- queried via `GetEquippedItem`, `FindItem`, `ForEachItem`, `Equip` for tool/weapon management
- `tool` -- queried via `CanDoAction` to check tool capabilities
- `equippable` -- queried via `IsRestricted` to filter restricted items
- `playercontroller` -- queried via `GetRemoteInteraction` for remote action detection
- `combat` -- modified via `SetTarget`, queried via `GetAttackRange`, `target`, `lasttargetGUID`
- `health` -- queried via `GetPercent`, `GetMaxWithPenalty`, `currenthealth` for eating decisions
- `hunger` -- queried via `GetPercent`, `current`, `max` for eating decisions
- `sanity` -- queried via `GetPercent`, `GetMaxWithPenalty`, `current` for eating decisions
- `edible` -- queried via `GetHealth`, `GetHunger`, `GetSanity` for food value calculation
- `locomotor` -- queried via `WantsToMoveForward` to detect leader movement
- `weapon` -- queried via `GetDamage` for weapon selection

**Tags:**
- `busy` -- checked before triggering eat sequence (skip if entity is busy)
- `spinning` -- checked in `GetLeaderAction` for spin action detection

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MAX_CHASE_TIME` | constant (local) | `10` | Maximum chase duration in seconds for ChaseAndAttack behaviour. |
| `MAX_CHASE_DIST` | constant (local) | `50` | Maximum chase distance for ChaseAndAttack behaviour. |
| `TRADE_DIST` | constant (local) | `20` | Search radius in tiles for finding players attempting to trade or feed. |
| `FOLLOW_MIN_DIST` | constant (local) | `1` | Minimum follow distance from leader. |
| `FOLLOW_TARGET_DIST` | constant (local) | `6` | Target follow distance from leader. |
| `FOLLOW_MAX_DIST` | constant (local) | `9` | Maximum follow distance before catching up to leader. |
| `DROP_TARGET_KITE_DIST_SQ` | constant (local) | `196` | Squared distance threshold (14^2) for dropping combat target when kiting. |
| `MAX_KITE_DIST` | constant (local) | `10` | Maximum distance to maintain when kiting around leader. |
| `TOLERANCE_DIST` | constant (local) | `0.5` | Distance change tolerance before recalculating run distance. |
| `RUN_AFTER_KITE_DELAY` | constant (local) | `1` | Delay in seconds before following leader after kiting behaviour. |
| `UPDATE_RATE` | constant (local) | `0.1` | Behaviour tree update rate in seconds. |

## Main functions
### `OnStart()` (Brain method)
*   **Description:** Constructs the root PriorityNode of the behaviour tree. Priority order: trader/feeder interactions, combat assistance (when leader attacks), upgrade module actions, kiting behaviour (when leader moving but not attacking), leader action assistance (chop/mine/hammer/dig/till), following leader, eating food, facing leader, standing still. Called once when the brain is attached and on resume after pause.
*   **Parameters:** `self` -- the brain instance (implicit via method syntax)
*   **Returns:** None (assigns `self.bt` with the BehaviourTree)
*   **Error states:** None

### `OnStop()` (Brain method)
*   **Description:** Cleanup function called when the brain is stopped or detached. Currently empty implementation.
*   **Parameters:** `self` -- the brain instance (implicit via method syntax)
*   **Returns:** None
*   **Error states:** None.

### `GetTraderFn(inst)` (local)
*   **Description:** Helper passed to FaceEntity node. Searches for players within `TRADE_DIST` tiles who are attempting to trade with or feed the possessed body. Returns the first matching player found.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** Player entity or `nil` if no trading/feeding player found
*   **Error states:** None — guards component access internally.

### `KeepTraderFn(inst, target)` (local)
*   **Description:** Helper passed to FaceEntity node. Validates that the target player is still attempting to trade with or feed the possessed body. Returns true while the interaction continues.
*   **Parameters:**
    - `inst` -- entity owning the brain
    - `target` -- candidate trader/feeder entity
*   **Returns:** boolean
*   **Error states:** None — guards component access internally.

### `GetLeader(inst)` (local)
*   **Description:** Helper function to retrieve the leader entity from the follower component. Returns nil if the follower component is not present.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** Leader entity or `nil`
*   **Error states:** None — guards `inst.components.follower` access.

### `GetFaceLeaderFn(inst)` (local)
*   **Description:** Helper passed to FaceEntity node for facing the leader. Returns the current leader entity.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** Leader entity or `nil`
*   **Error states:** None.

### `KeepFaceLeaderFn(inst, target)` (local)
*   **Description:** Helper passed to FaceEntity node. Validates that the target is still the current leader. Returns true while target remains the leader.
*   **Parameters:**
    - `inst` -- entity owning the brain
    - `target` -- candidate face target entity
*   **Returns:** boolean
*   **Error states:** None.

### `GetTool(inst)` (local)
*   **Description:** Retrieves the currently equipped item in the HANDS equip slot. Returns nil if inventory component is missing or no item is equipped.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** Equipped item entity or `nil`
*   **Error states:** None — guards `inst.components.inventory` access.

### `CanToolDoAction(tool, action)` (local)
*   **Description:** Checks if a tool can perform a specific action. Tests both `tool.components.tool:CanDoAction()` and direct `tool:CanDoAction()` for compatibility with different tool types (e.g., till tools).
*   **Parameters:**
    - `tool` -- tool entity to check
    - `action` -- action enum to test against
*   **Returns:** boolean
*   **Error states:** None — guards `tool.components.tool` access.

### `HasToolForAction(inst, action, tryequip)` (local)
*   **Description:** Checks if the entity has a tool capable of performing the specified action. If `tryequip` is true and a suitable tool is found in inventory, automatically equips it. Searches inventory for non-restricted equippable items that can perform the action.
*   **Parameters:**
    - `inst` -- entity owning the brain
    - `action` -- action enum to find tool for
    - `tryequip` -- boolean, if true automatically equips found tool
*   **Returns:** boolean (true if tool is available/equipped)
*   **Error states:** None — guards component access internally.

### `GetLeaderAction(inst)` (local)
*   **Description:** Determines the leader's current action through multiple detection methods: buffered action, stategraph statemem action, spinning state with recent spin time, or remote interaction via playercontroller. Returns the action enum and target entity.
*   **Parameters:** `inst` -- leader entity to inspect
*   **Returns:** `action, target` -- action enum and target entity, or `nil, nil`
*   **Error states:** None — guards all component and stategraph access.

### `IsLeaderAttacking(inst)` (local)
*   **Description:** Checks if the leader is currently attacking. Tests both buffered action (ACTIONS.ATTACK) and combat component target presence.
*   **Parameters:** `inst` -- entity owning the brain (used to get leader)
*   **Returns:** boolean
*   **Error states:** None — guards leader and component access.

### `IsLeaderMoving(inst)` (local)
*   **Description:** Checks if the leader wants to move forward via the locomotor component.
*   **Parameters:** `inst` -- entity owning the brain (used to get leader)
*   **Returns:** boolean
*   **Error states:** None — guards leader and locomotor component access.

### `Create_Starter(action)` (local)
*   **Description:** Factory function that creates a starter condition function for leader action assistance. Returns a function that checks if the leader is performing the specified action and if the entity has the required tool (auto-equips if `tryequip` is true in HasToolForAction).
*   **Parameters:** `action` -- action enum to create starter for
*   **Returns:** Function `(inst, leaderdist, finddist) → boolean`
*   **Error states:** None.

### `Create_KeepGoing(action)` (local)
*   **Description:** Factory function that creates a keep-going condition function for leader action assistance. Returns a function that validates the leader is still performing the specified action.
*   **Parameters:** `action` -- action enum to create keep-going for
*   **Returns:** Function `(inst, leaderdist, finddist) → boolean`
*   **Error states:** None.

### `Create_FindNew(action)` (local)
*   **Description:** Factory function that creates a finder function for leader action assistance. Returns a BufferedAction for the entity to perform the same action on the leader's target.
*   **Parameters:** `action` -- action enum to create finder for
*   **Returns:** Function `(inst, leaderdist, finddist) → BufferedAction or nil`
*   **Error states:** None.

### `EquipBestWeapon(inst, target)` (local)
*   **Description:** Iterates through inventory to find the weapon with highest damage against the specified target. Equips the best weapon if it differs from the currently held weapon. Note: Does not account for damage type multipliers, only raw damage values.
*   **Parameters:**
    - `inst` -- entity owning the brain
    - `target` -- target entity to calculate damage against
*   **Returns:** None
*   **Error states:** None — guards inventory and weapon component access.

### `SetTargetOnLeaderTarget(inst)` (local)
*   **Description:** Sets the possessed body's combat target to match the leader's combat target. Also calls EquipBestWeapon to ensure optimal weapon is equipped. Checks both leader's buffered attack action and combat component target.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** None
*   **Error states:** None — guards leader and combat component access.

### `EatFoodAction(inst)` (local)
*   **Description:** Determines what food item to eat based on current stat percentages. If health, hunger, and sanity are all above 90%, searches inventory for food that provides healing (>= TUNING.HEALING_MEDSMALL), hunger, or sanity (>= TUNING.SANITY_SMALL) without overfilling stats. Also handles spoiled food processing if the entity is a spoiled processor. Returns a BufferedAction for eating or nil.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** BufferedAction or `nil`
*   **Error states:** None — guards all component access and checks `busy` state tag.

### `DoUpgradeModuleAction(inst)` (local)
*   **Description:** Collects available upgrade module actions and returns a BufferedAction for the first one. Includes a 5-second cooldown check via `inst.last_upgrade_module_action` to prevent spam. Skips if entity has `busy` state tag.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** BufferedAction or `nil`
*   **Error states:** None — guards state tag and cooldown check.

### `GetRunAwayTarget(inst)` (local)
*   **Description:** Returns the current combat target for runaway behaviour. Checks `combat.target` first, then falls back to resolving `combat.lasttargetGUID` from Ents. Validates target is not dead.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** Target entity or `nil`
*   **Error states:** None — guards combat component and Ents access.

### `LeaderInRangeOfTarget(inst)` (local)
*   **Description:** Validates that the leader is within acceptable distance of the combat target for kiting behaviour. If leader is too far (> `DROP_TARGET_KITE_DIST_SQ`), clears the combat target and returns false. Used as a condition for runaway kiting behaviour.
*   **Parameters:** `inst` -- entity owning the brain
*   **Returns:** boolean
*   **Error states:** None — guards leader and target access.

### `GetRunDist(inst, hunter)` (local)
*   **Description:** Calculates the run distance for kiting behaviour. Uses the maximum of attack range and leader-to-hunter distance (clamped to `MAX_KITE_DIST`). Implements caching with `TOLERANCE_DIST` threshold to avoid recalculating on every tick. Returns cached distance if change is within tolerance.
*   **Parameters:**
    - `inst` -- entity owning the brain
    - `hunter` -- the threatening entity to run from
*   **Returns:** number (distance in tiles)
*   **Error states:** None — guards component access and handles nil leader case.

## Events & listeners
None — brain trees react to component state, not engine events directly. Event handling is done in the brain's host stategraph or via component subscriptions.