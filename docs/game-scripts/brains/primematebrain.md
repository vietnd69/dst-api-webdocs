---
id: primematebrain
title: Primematebrain
description: Controls the AI behavior of the Prime Mate character, managing tasks such as boat movement, repairing leaks, combat, abandonment, and wandering while aboard a platform.
tags: [ai, boat, combat, cleanup, npc]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: eb8a480c
---

# Primematebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component governs the decision-making logic for the Prime Mate entity in Don't Starve Together. It orchestrates a behavior tree rooted around platform-aware tasks such as rowing, fixing boat leaks, engaging in combat, abandoning dead platforms, and wandering nearby. It integrates closely with components like `combat`, `crewmember`, `inventory`, `knownlocations`, `timer`, and `walkableplatform` to make context-sensitive decisions, especially when aboard a boat. The brain also includes logic to prevent undesirable interactions with specific item tags (`NO_LOOTING_TAGS`, `NO_PICKUP_TAGS`) and to prefer items with `PICKUP_ONEOF_TAGS`.

## Usage example

```lua
local myentity = Entity("myentity")
myentity:AddBrain("primematebrain")
```

The brain does not require manual configuration; it is automatically assigned and activated when the brain component is added to an entity.

## Dependencies & tags

**Components used:**  
- `boatleak` (`has_leaks` property)  
- `boatpatch`  
- `combat` (`GetAttackRange`, `target` property)  
- `crewmember` (`Shouldrow`, `boat` property)  
- `health` (`IsDead`)  
- `inventory` (`FindItem`)  
- `knownlocations` (`GetLocation`)  
- `timer` (`TimerExists`)  
- `walkableplatform` (`platform_radius` property)

**Tags:**  
- `NO_LOOTING_TAGS` and `NO_PICKUP_TAGS` define sets of item tags that should not be looted or picked up (e.g., `"INLIMBO"`, `"fire"`, `"_container"`).  
- `PICKUP_ONEOF_TAGS` specifies items that satisfy pickup requirements (e.g., `"_inventoryitem"`, `"pickable"`, `"readyforharvest"`).  
- `NO_TAGS` (local): exclusion filters used during entity searches (e.g., `"FX"`, `"DECOR"`, `"INLIMBO"`).

## Properties

No public properties are explicitly initialized in the constructor. The component inherits from `Brain` and relies on internal state management (e.g., `self.inst`, `self.bt`).

## Main functions

### `PrimemateBrain:OnStart()`
* **Description:** Initializes the brain’s behavior tree. This method is called automatically when the brain is started. It builds a priority-ordered behavior tree that prioritizes panic triggers, abandonment, leak repair, combat readiness, rowing, platform following, and wandering.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None; ensures behavior tree (`self.bt`) is constructed and assigned.

### `findmaxwanderdistfn(inst)`
* **Description:** Dynamically calculates the maximum wandering distance based on whether the entity is aboard a platform. If on a platform, it uses the platform’s radius minus one to avoid wandering off.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** A numeric distance (`number`).
* **Error states:** Falls back to `MAX_WANDER_DIST` (20) if the platform is unavailable or lacks a `walkableplatform` component.

### `findwanderpointfn(inst)`
* **Description:** Determines the center point for wandering. If the entity is on a platform, it uses the platform’s world position; otherwise, it defaults to the "home" location from `knownlocations`.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** A `Vector3` position for the wander target.
* **Error states:** Returns `nil` if the "home" location is not registered.

### `rowboat(inst)`
* **Description:** Attempts to generate a rowing action if the entity is crewing a boat and a rowing target position can be computed. The rowing position is cached on `inst.rowpos`.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** A `BufferedAction` if rowing is valid and a position is found; otherwise, `nil`.
* **Error states:**  
  - Returns `nil` if the entity lacks `crewmember` or `Shouldrow()` returns false.  
  - Returns `nil` if `FindWalkableOffset` fails to find a position.  
  - Position is only calculated once per call if missing.

### `shouldfix(inst)`
* **Description:** Checks whether the entity should attempt to repair a leak. This method prepares the repair state on `inst.fixboat` but does *not* perform the action itself.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** `true` if repair is applicable (item and leak found); otherwise, `nil`.
* **Error states:**  
  - Returns `nil` if the repair cooldown timer (`patch_boat_cooldown`) exists.  
  - Returns `nil` if no repair item or leak target is found.

### `fixboat(inst)`
* **Description:** Generates a buffered action to repair a detected leak using a `boatpatch` item.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** A `BufferedAction` if repair is possible; otherwise, `nil`.
* **Error states:** Same as `shouldfix`;此外 returns `nil` if the repair cooldown timer exists or the target leak/item is missing.

### `GetBoat(inst)`
* **Description:** Returns the entity’s current platform if one exists.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** The platform `Entity` or `nil`.
* **Error states:** None.

### `DoAbandon(inst)`
* **Description:** Attempts to generate an abandon-platform action if the platform is dead. Calculates a safe offset position on the platform’s edge.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** A `BufferedAction` for `ACTIONS.ABANDON` with a calculated position; otherwise, `nil`.
* **Error states:**  
  - Sets `inst.abandon = true` only if the platform is dead.  
  - Returns `nil` if the platform is valid but not dead or if position calculation fails.

### `cangettotarget(inst)`
* **Description:** Determines whether the entity can reach or attack its combat target while aboard a platform. Considers range, shared platforms, and platform size.
* **Parameters:**
  - `inst`: The entity instance (`Entity`).
* **Returns:** `true` if the target is reachable; otherwise, `nil`.
* **Error states:**  
  - Returns `true` immediately if the entity is *not* on a platform and has a combat target.  
  - Returns `nil` if the target is out of range or on a different platform.

## Events & listeners

No event listeners are registered within this brain. Event handling is delegated to behaviors (`ChaseAndAttack`, `Wander`, `Follow`, `DoAction`) and the `BrainCommon` utilities.

---