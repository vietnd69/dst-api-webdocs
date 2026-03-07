---
id: powdermonkeybrain
title: Powdermonkeybrain
description: AI brain controlling powder monkey characters, managing movement, looting, combat, and boat operations such as rowing, tinking, and cannon firing.
tags: [ai, entity, combat, inventory, movement]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e03a40b6
---

# Powdermonkeybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`powdermonkeybrain.lua` defines the decision-making logic for powder monkey entities in Don't Starve Together. It is implemented as a behavior tree (BT) using a priority-based node structure. The brain coordinates multiple roles: rowing the crew boat, tinking (repairing/maintaining boat systems like masts and anchors), stealing items, harvesting bananas, handing off bananas to the monkey queen, stashing loot at home, and engaging in combat when necessary. It dynamically selects actions based on the monkey's inventory state, current platform, combat status, and external crew state (e.g., `boatcrew.status`). The brain relies heavily on components such as `crewmember`, `inventory`, `combat`, `timer`, `knownlocations`, `homeseeker`, and `walkableplatform`.

## Usage example

```lua
local PowderMonkeyBrain = require "brains/powdermonkeybrain"
local inst = TheWorld.Map:GetEntityAt(x, y, z)
if inst and not inst:HasTag("player") then
    inst:AddComponent("brain")
    inst.components.brain:SetBrain(PowderMonkeyBrain)
    inst.components.brain:OnStart()
end
```

## Dependencies & tags
**Components used:** `brain`, `crewmember`, `inventory`, `combat`, `timer`, `knownlocations`, `homeseeker`, `walkableplatform`, `burnable`, `health`, `anchor`, `mast`, `container`, `pickable`, `sentientaxe`, `stackable`, `inventoryitem`, `piratespawner`.

**Tags:** `INLIMBO`, `catchable`, `fire`, `irreplaceable`, `heavy`, `outofreach`, `spider`, `_container`, `inverted`, `saillowered`, `sail_transitioning`, `anchor_raised`, `anchor_transitioning`, `sailraised`, `chest`, `bananabush`, `personal_possession`, `monkeyqueenbribe`, `boatcannon`, `boat`, `NOCLICK`, `knockbackdelayinteraction`, `minesprung`, `mineactive`, `nosteal`, `playerghost`, `busy`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.abandon` | boolean | `nil` | Set when the monkey should abandon the boat (based on loot count or boat destruction). |
| `inst.nothingtosteal` | boolean | `nil` | Set to `true` when no stealable items, chests, or valid combat targets are found. |
| `inst.itemtosteal` | Entity reference | `nil` | Stores the specific item entity selected for pickup during stealing. |
| `inst.tinkertarget` | Entity reference | `nil` | Stores the specific entity (mast/anchor) selected for tinking. |
| `inst.rowpos` | Vector3 | `nil` | Cached position to move to when rowing; used to avoid recalculating each frame. |
| `inst.no_looting_tags` | table of strings | `{ "INLIMBO", "catchable", "fire", "irreplaceable", "heavy", "outofreach", "spider" }` | Tags that prevent an entity from being considered for looting. |
| `inst.no_pickup_tags` | table of strings | copy of `NO_LOOTING_TAGS` + `"_container"` | Tags that prevent an entity from being picked up. |

## Main functions

### `findmaxwanderdistfn(inst)`
* **Description:** Calculates the maximum wander distance based on the boat's platform radius, subtracting a safety margin of `0.3`. Used by the `Wander` behavior to keep the monkey near the boat.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** number — The maximum wander distance (float).
* **Error states:** Returns `MAX_WANDER_DIST` (20) if the entity has no current platform or platform radius data.

### `findwanderpointfn(inst)`
* **Description:** Determines the center position of the current boat platform or the monkey's home location as a default wander center.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** Vector3 or nil — The world position used as the wander center, or nil if neither is available.

### `rowboat(inst)`
* **Description:** Creates a buffered action for the monkey to row the boat. Checks if the monkey is a valid crewmember, not busy, and if the boat has a valid target or heading. Attempts to find a valid rowing position near the boat edge.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to row the boat at a calculated position, or nil if rowing is not possible.

### `mastcheck(ent)`
* **Description:** Checks if an entity is a raised, non-inverted mast ready for hammering.
* **Parameters:** `ent` (Entity): The entity to check.
* **Returns:** boolean — `true` if mast is raised and not inverted, `false` otherwise.

### `reversemastcheck(ent)`
* **Description:** Checks if an entity is a lowered, inverted mast ready for raising.
* **Parameters:** `ent` (Entity): The entity to check.
* **Returns:** boolean — `true` if mast is lowered, inverted, and not transitioning, `false` otherwise.

### `anchorcheck(ent)`
* **Description:** Checks if an entity is a raised anchor ready for lowering.
* **Parameters:** `ent` (Entity): The entity to check.
* **Returns:** boolean — `true` if anchor is raised and not transitioning, `false` otherwise.

### `chestcheck(ent)`
* **Description:** Verifies that an entity is a non-empty, accessible chest.
* **Parameters:** `ent` (Entity): The entity to check.
* **Returns:** boolean — `true` if it is a chest with items and not out of reach, `false` otherwise.

### `Dotinker(inst)`
* **Description:** Scans for nearby masts or anchors on the crew boat and returns an action to tinker with the first valid target (lower anchor, raise sail, or hammer). Reserves the target via `boatcrew:reserveinkertarget`.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to perform on the target, or nil if no valid targets or monkey is busy/reaction-delayed.

### `shouldsteal(inst)`
* **Description:** Determines the next stealable item, chest, or combat target. Returns a pickup action for items (preferring bananas), an empty container action for chests, or a steal action for characters holding loot. Sets `inst.nothingtosteal` if no actions are possible.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to perform (PICKUP, EMPTY_CONTAINER, or STEAL), or nil if cannot steal.

### `shouldattack(inst)`
* **Description:** Returns `true` if the monkey should attack its combat target, unless it is in cooldown, has a buffered pickup action, is busy, or ordered to retreat and is not on the same platform as the target.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** boolean — `true` if attack is valid, `false` otherwise.

### `count_loot(inst)`
* **Description:** Counts non-personal items in the inventory, using stack size for stackable items.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** number — Total loot count.

### `DoAbandon(inst)`
* **Description:** Returns an `ABANDON` action if the monkey should leave the boat (based on loot count or dead boat). Calculates a position outside the boat boundary to drop the monkey.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to abandon the boat at a calculated position, or nil if not abandoning.

### `ReturnToBoat(inst)`
* **Description:** Used in the `Leash` behavior to guide the monkey back to its own boat during retreat.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** Entity or nil — The crew boat if in retreat state and valid, otherwise nil.

### `GoToHut(inst)`
* **Description:** Returns an action to walk to home if no combat target and home is not burning or burnt.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to `GOHOME`, or nil if conditions not met.

### `HarvestBanana(inst)`
* **Description:** Finds and harvests a banana bush if available, ready for picking.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to `PICK` a banana bush, or nil if none found.

### `bananahandoff(inst)`
* **Description:** Checks if the monkey holds a banana that can be given to the monkey queen (requires `piratespawner.queen` and queen not busy).
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to `GIVE` the banana, or nil if conditions not met.

### `stashhomeloot(inst)`
* **Description:** Returns an action to `GOHOME` with any storable item that isn't a banana or personal possession.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to `GOHOME`, or nil if no storable items or home invalid.

### `hastargetboat(inst, arc)`
* **Description:** Finds cannon-boat pairs where a cannon can target another boat. Cannons must be on the same boat or nearby, and the target boat must be within range.
* **Parameters:** `inst` (Entity): The powder monkey instance. `arc` (number or nil): Optional arc constraint (45 degrees if not crewmember).
* **Returns:** table or nil — `{cannon = entity, boat = entity}` if a valid pair is found, otherwise nil.

### `findcannonspot(inst, cannon, boat)`
* **Description:** Calculates a position near the cannon aligned with the target boat, used for moving to fire a cannon.
* **Parameters:** `inst` (Entity), `cannon` (Entity), `boat` (Entity).
* **Returns:** Vector3 or nil — Position near cannon to walk to, or nil if invalid.

### `gotocannon(inst)`
* **Description:** Returns an action to walk to a cannon position if a valid cannon-target pair exists.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to `WALKTO` the cannon spot, or nil.

### `monkeyinarc(inst, cannon, target)`
* **Description:** Determines if the monkey is in the firing arc (less than 90 degrees off) of a cannon targeting a boat.
* **Parameters:** `inst` (Entity), `cannon` (Entity), `target` (Entity).
* **Returns:** boolean — `true` if monkey is in arc, `false` otherwise.

### `firecannon(inst)`
* **Description:** Fires a cannon if the monkey is adjacent to it, a valid target boat exists, and the monkey is not in the cannon's firing arc (to avoid self-hit).
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** BufferedAction or nil — Action to `BOAT_CANNON_SHOOT`, or nil.

### `shouldrun(inst)`
* **Description:** Returns `true` if the monkey should run away, based on having a combat target and the `hit` timer active.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** boolean — `true` if running is triggered, `false` otherwise.

### `GetRunAwayTarget(inst)`
* **Description:** Used by `RunAway` to specify the entity to flee from.
* **Parameters:** `inst` (Entity): The powder monkey instance.
* **Returns:** Entity — The combat target.

### `PowderMonkeyBrain:OnStart()`
* **Description:** Initializes the behavior tree for the monkey. Constructs a priority node list that evaluates behaviors in order: panic triggers, abandoning, running, attacking, cannon operations, rowing, tinking, handoffs, stealing, homing at night, harvesting, and wandering. Sets `self.bt` to the constructed BT instance.
* **Parameters:** None.
* **Returns:** None. Modifies `self.bt`.

## Events & listeners
This brain does not directly register event listeners or push events. It reacts to external states (e.g., `self.components.health:IsDead()`, `self.components.timer:TimerExists("hit")`) and item/component properties, but no explicit event handlers are defined in the source code.