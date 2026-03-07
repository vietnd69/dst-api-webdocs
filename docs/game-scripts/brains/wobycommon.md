---
id: wobycommon
title: Wobycommon
description: Provides shared AI behavior logic and utility functions for Woby, a companion entity in Don't Starve Together, including fetching, foraging, ammo retrieval, courier, and minigame watching.
tags: [ai, companion, behavior, woby, minigame]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 23c95473
---

# Wobycommon

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`wobycommon.lua` is a shared utility module for the `woby` companion's AI behavior system. It defines reusable behavior functions and node factories used in Woby's state graphs and brain configurations. The module does not implement a component class itself but exposes helper functions that drive Woby’s interactions with players (particularly Walter), containers, items, and active minigames. It integrates heavily with components like `container`, `inventory`, `follower`, `skilltreeupdater`, and custom `woby_commands_classified` to determine eligibility and priority of actions such as item fetching, foraging, ammo retrieval, courier delivery, and sit/idle behaviors.

## Usage example

Below is an example of how this module is typically referenced in a state graph or brain file to construct behavior trees for Woby:

```lua
local WobyCommon = require("brains/wobycommon")

local function MakeStateGraph(inst)
    local sg = StateGraph("woby_common_sg")

    sg:AddState("Fetching", {
        OnEnter = function(inst)
            inst.sg:GoToState("Fetching")
        end,
        OnExit = function(inst)
            inst.sg:ClearStateTag("fetching")
        end,
    })

    sg:SetRoot("Fetching")
    return sg
end

local function OnPostInit(inst)
    -- Example: Attach behavior logic using WobyCommon node factories
    inst:AddBehaviourNode(WobyCommon.FetchingActionNode(inst))
    inst:AddBehaviourNode(WobyCommon.ForagerNode(inst))
    inst:AddBehaviourNode(WobyCommon.SitStillNode(inst))
end
```

## Dependencies & tags

**Components used:**  
`container`, `follower`, `inventory`, `inventoryitem`, `minigame`, `minigame_participator`, `playercontroller`, `skilltreeupdater`, `trap`, `trader`

**Tags:**  
No tags are added or removed by this module itself. It checks for `"outofreach"`, `"recoverableammo"`, `"largecreature"`, `"slingshot"` on items and `"walter_woby_itemfetcher"` / `"walter_woby_foraging"` in the skilltree.

## Properties

This module does not define a component class, so there are no persistent properties initialized. All functions are pure, stateless utilities or factory functions returning behavior nodes.

## Main functions

### `OwnerIsClose(inst, distance)`
* **Description:** Returns `true` if the owner (stored in `inst._playerlink`) is within the given `distance` of `inst`.
* **Parameters:**  
  - `inst`: The Woby entity instance.  
  - `distance` (number): Threshold distance for proximity check.
* **Returns:** `true` if `inst._playerlink` exists and is within range; otherwise `false`.
* **Error states:** Returns `false` if `inst._playerlink` is `nil` or invalid.

### `IsWheelOpen(inst)`
* **Description:** Checks if the player is currently interacting with Woby's command wheel.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if `inst.woby_commands_classified:IsClientWheelOpen()` returns `true`; otherwise `false`.
* **Error states:** Returns `false` if `woby_commands_classified` component is missing.

### `FindPickupableItem_ExtraFilter(inst, item, owner)`
* **Description:** Applies custom filtering rules for items eligible for pickup by Woby. Used as a predicate in `FindPickupableItem`.
* **Parameters:**  
  - `inst`: The Woby entity instance.  
  - `item`: The item being evaluated.  
  - `owner`: The owner entity (typically Walter).
* **Returns:** `true` if `item` meets all criteria; otherwise `false` or `nil`.
* **Error states:** Returns `false` early if:
  - `item` has `"outofreach"` tag (e.g., cave_hole items),
  - `item` lacks `inventoryitem` or is not landed (`is_landed ~= true`),
  - `item` is a trap,
  - `item` has physics active and collides with `inst`,
  - `item` is not on passable terrain or differs in platform,
  - `item` is within combat-runaway range (`COMBAT_TOO_CLOSE_DIST`) and Woby is fleeing.

### `DoPickUpAction(inst)`
* **Description:** Attempts to construct a `BufferedAction` to pick up the most suitable fetchable item for Woby. Prioritizes items by prefetch queue and distance.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A valid `BufferedAction` targeting the item and action `ACTIONS.WOBY_PICKUP`, or `nil` if no eligible item is found.
* **Error states:** Returns `nil` if `FindPickupableItem` fails to locate an item.

### `HasPickUpBehavior(inst)`
* **Description:** Determines if Woby has the Walter + Woby Item Fetcher skill active.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if `skilltreeupdater:IsActivated("walter_woby_itemfetcher")` is `true`; otherwise `false`.

### `IsAllowedToPickUp(inst)`
* **Description:** Checks if Woby is currently permitted to pick up items based on player command state.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if `inst.woby_commands_classified:ShouldPickup()` returns `true`; otherwise `false`.

### `FetchingActionNode(inst)`
* **Description:** Factory function returning a `WhileNode` that executes `DoPickUpAction` continuously while `IsAllowedToPickUp` and `HasPickUpBehavior` are both true.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `WhileNode` behavior tree node configured for item fetching.

### `IsAllowedToRetrieveAmmo(inst)`
* **Description:** Checks if Walter’s equipped hands item is a slingshot with recoverable ammo.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if the equipped `HANDS` item has `"slingshot"` tag and `container:HasItemWithTag("recoverableammo", 1)`; otherwise `false`.

### `GetRecoverableAmmoPickUpAction(inst)`
* **Description:** Constructs a `BufferedAction` to retrieve recoverable ammo from the slingshot container or ground.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `BufferedAction` for `ACTIONS.WOBY_PICKUP` on ammo, or `nil` if no ammo found.

### `ReturnRecoverableAmmoAction(inst)`
* **Description:** Attempts to return recoverable ammo in Woby’s inventory to Walter.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `BufferedAction` for `ACTIONS.GIVEALLTOPLAYER`, or `nil` if:
  - no ammo in inventory,
  - Walter’s inventory/trader cannot accept it,
  - Walter is not currently opening/trading with Woby.

### `RetrieveAmmoNode(inst)`
* **Description:** Behavior tree node that prioritizes returning ammo to Walter if close, otherwise fetching it, and falls back to returning if fetch fails.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `PriorityNode` behavior with logic:
  - If owner is near, try `ReturnRecoverableAmmoAction`.
  - Else if allowed to pick up, try `GetRecoverableAmmoPickUpAction`.
  - Fallback to `ReturnRecoverableAmmoAction`.

### `PickUpAmmoNode(inst)`
* **Description:** Simplified node that only fetches recoverable ammo (without giving back). Used when retrieval is disabled but fetching remains.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `WhileNode` executing `GetRecoverableAmmoPickUpAction` when conditions met.

### `DoForagerAction(inst)`
* **Description:** Attempts to forage using Woby’s configured forager target.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `BufferedAction` for `ACTIONS.WOBY_PICK`, or `nil` if no target.

### `HasForagingBehavior(inst)`
* **Description:** Checks if Woby has the Walter + Woby Foraging skill active.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if `skilltreeupdater:IsActivated("walter_woby_foraging")` is `true`.

### `IsAllowedToForager(inst)`
* **Description:** Checks if Woby is permitted to forage per current player command.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if `inst.woby_commands_classified:ShouldForage()` is `true`.

### `ForagerNode(inst)`
* **Description:** Returns a `WhileNode` to drive foraging behavior when enabled and permitted.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `WhileNode` that executes `DoForagerAction` under appropriate conditions.

### `ShouldSit(inst)`
* **Description:** Determines if Woby should be in a sitting state based on player command and delivery state.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `true` if `inst.woby_commands_classified:ShouldSit()` is `true` and `outfordelivery` is not active; otherwise `false`.

### `StartSitting(inst)`
* **Description:** Pushes `"start_sitting"` event to Woby if `ShouldSit` is `true`.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** Same as `ShouldSit`.

### `KeepSitting(inst)`
* **Description:** Maintains sitting state, adjusting for cowering (combat avoidance) and rotation. Pushes `"stop_sitting"` or `"start_sitting"` as needed.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** Boolean indicating whether Woby should continue sitting.

### `SitStillNode(inst)`
* **Description:** Returns a `StandStill` node for sitting behavior with dynamic start/keep logic.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `StandStill` node configured with `StartSitting` and `KeepSitting`.

### `CourierNode(inst)`
* **Description:** Behavior tree node that handles courier delivery: moving to destination, sitting within leash range, and storing items in a valid container.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `WhileNode` that:
  - Checks for courier data,
  - Enforces leash distance,
  - Attempts `StoreItemAction` with wait.

### `StoreItemAction(inst)`
* **Description:** Finds an item in Woby’s inventory and attempts to store it in a valid container using `WobyCourier_FindValidContainerForItem`.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `BufferedAction` for `ACTIONS.STORE`, or `nil` if no valid container found.

### `IsTryingToPerformAction(inst, performer, action)`
* **Description:** Checks if the `performer` (e.g., player) is actively attempting a specific action on `inst`.
* **Parameters:**  
  - `inst`: The Woby entity instance.  
  - `performer`: The entity performing the action.  
  - `action`: An `ACTIONS` enum value.
* **Returns:** `true` if the buffered or remote interaction action matches the given `action`.

### `TryingToInteractWithWoby(inst, performer)`
* **Description:** Checks if `performer` is attempting to feed, pet, rummage, store, or open the container on `inst`.
* **Parameters:**  
  - `inst`: The Woby entity instance.  
  - `performer`: The entity attempting interaction.
* **Returns:** `true` if any interaction action is in progress or container is open.

### `GetWalterInteractionFn(inst)`
* **Description:** Returns `inst._playerlink` if Walter is currently interacting with Woby.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** `inst._playerlink` if `TryingToInteractWithWoby` is `true`; otherwise `nil`.

### `KeepGenericInteractionFn(inst, target)`
* **Description:** Returns `true` if `target` is still interacting with `inst`.
* **Parameters:**  
  - `inst`: The Woby entity instance.  
  - `target`: The interacting entity.
* **Returns:** Same as `TryingToInteractWithWoby(inst, target)`.

### `WatchingMinigameNode(inst)`
* **Description:** Behavior tree node that makes Woby watch a minigame (e.g., Battle Boar) while respecting distances and player wheel interaction.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** A `WhileNode` with priority:
  - If wheel is open, face the minigame.
  - Otherwise, follow at minigame distances.
  - Run away if in combat cower mode.
  - Face minigame as fallback.

### `RecallNode(inst, follownode)`
* **Description:** Handles Woby’s recall logic: returns to owner if summoned, with timeouts and fallback recall cancellation.
* **Parameters:**  
  - `inst`: The Woby entity instance.  
  - `follownode`: Behavior node to run in parallel while recalled.
* **Returns:** A `WhileNode` with two fallback strategies:
  - Wait up to 10 seconds while following or staying near owner.
  - Or wait 1.25 seconds and auto-cancel recall.

### `IsWheelOpen(inst)`
* **Description:** Exposed at module scope for external reuse.
* **Parameters:**  
  - `inst`: The Woby entity instance.
* **Returns:** Boolean indicating if the command wheel is open.

## Events & listeners

This module does not register or push events directly. It invokes `inst:PushEvent` internally in `StartSitting` and `KeepSitting` (`"start_sitting"`, `"stop_sitting"`), but only as part of behavior node execution — not as standalone event handlers.