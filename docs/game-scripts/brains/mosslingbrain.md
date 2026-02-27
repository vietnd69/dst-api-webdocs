---
id: mosslingbrain
title: Mosslingbrain
description: Controls the decision-making behavior of mossling entities, including foraging, stealing from structures, summoning guardians, and responding to threats.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 4fda1c78
---

# Mosslingbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`MosslingBrain` is a behavior tree-based brain component that governs the autonomous actions of mossling entities in Don't Starve Together. It coordinates behaviors such as foraging for food, harvesting or stealing from crops/stewers/dryers, summoning guardians when threatened, and fleeing or returning to base. The brain prioritizes actions dynamically using priority nodes and responds to changing game states like combat engagement, inventory status, and presence of a herd or guardian. It relies heavily on components like `combat`, `herdmember`, `inventory`, `eater`, `knownlocations`, and others to make decisions.

## Dependencies & Tags

- **Components used:**
  - `combat`: for target management and guard summoning triggers.
  - `crop`: to check if crops are ready for harvest (`IsReadyForHarvest`).
  - `dryer`: to check if drying racks are done (`IsDone`).
  - `eater`: to determine edible items and check `CanEat` on targets.
  - `guardian`: to check for active guardian and summoning conditions (`HasGuardian`, `SummonsAtMax`).
  - `herd`: via `herdmember` to access herd members and avoid duplicate task claims.
  - `herdmember`: to access the associated herd for guard summoning.
  - `inventory`: for self-feeding and checking if inventory is full (`IsFull`, `FindItem`).
  - `inventoryitem`: to verify items aren’t currently held (`IsHeld`).
  - `knownlocations`: to remember spawn point and locate herd base (`RememberLocation`, `GetLocation`).
  - `pickable`: to check if plants are harvestable (`CanBePicked`, `caninteractwith`, `product`).
  - `stewer`: to check if cook pots are ready (`IsDone`).

- **Tags:**
  - `"structure"`: added to `BASE_TAGS` and `STEAL_TAGS` (used internally for entity classification).
  - `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, `"outofreach"`: excluded via `NO_TAGS` during entity searches.
  - `"busy"`, `"wantstoeat"`: state tags checked in stategraph to influence behavior.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The entity instance the brain is attached to; used to access components and stategraph. |

*Note:* The constructor uses `Class(Brain, function(self, inst) ... end)` pattern. No additional instance properties are initialized within the constructor itself; properties are either inherited from `Brain` or lazily accessed via `self.inst.components.*`.

## Main Functions

### `MosslingBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node based on current and dynamic conditions. Constructs a priority-based behavior tree that evaluates conditions in order (panic triggers, home departure, attack mode, threat response, base-following).
* **Parameters:** None.
* **Returns:** `nil`.

### `MosslingBrain:OnInitializationComplete()`
* **Description:** Records the mossling’s initial spawn position as `"spawnpoint"` in its `knownlocations` component for navigation reference.
* **Parameters:** None.
* **Returns:** `nil`.

### `GoHome(inst)`
* **Description:** Utility function that returns a buffered `GOHOME` action if the mossling is configured to leave the herd (`shouldGoAway`) and has no active combat target.
* **Parameters:**
  - `inst` (`Entity`): The mossling entity instance.
* **Returns:** `BufferedAction` or `nil`.

### `TargetNotClaimed(inst, target)`
* **Description:** Checks if another mossling in the same herd has already claimed the same target for harvesting, to prevent duplicate actions.
* **Parameters:**
  - `inst` (`Entity`): The current mossling entity.
  - `target` (`Entity`): The potential target entity.
* **Returns:** `boolean` — `true` if no other mossling has claimed the target, `false` otherwise.

### `EatFoodAction(inst)`
* **Description:** Attempts to locate food for immediate consumption. Prioritizes food in the mossling’s own inventory. If not found, scans nearby entities for edible items (e.g., berries, carrots), ensuring they are matured, unheld, and unclaimed. Returns a `PICKUP` action to collect food if found.
* **Parameters:**
  - `inst` (`Entity`): The mossling entity instance.
* **Returns:** `BufferedAction` (for `EAT` or `PICKUP`) or `nil`.

### `StealFoodAction(inst)`
* **Description:** Searches for structures (e.g., crop plots, stew pots, drying racks) ready for harvesting, then harvests or picks them to acquire food. Prioritizes items in this order: stewers > dryers > crops > pickable plants (e.g., berries, carrots, mushrooms). Avoids claimed targets.
* **Parameters:**
  - `inst` (`Entity`): The mossling entity instance.
* **Returns:** `BufferedAction` (for `HARVEST` or `PICK`) or `nil`.

### `SummonGuardian(inst)`
* **Description:** Attempts to summon the herd’s guardian if the guardian is missing or not at summoning capacity (`guardian == nil` or `summons < threshold`), the mossling has a combat target, and is not busy.
* **Parameters:**
  - `inst` (`Entity`): The mossling entity instance.
* **Returns:** `BufferedAction` (for `SUMMONGUARDIAN`) or `nil`.

## Events & Listeners

The brain file itself does not register event listeners. However, it leverages the parent `Brain` class’s behavior tree execution, which internally interacts with the entity’s stategraph and event-driven systems (e.g., `OnUpdate` triggers). No explicit `inst:ListenForEvent` or `inst:PushEvent` calls are present in this file.

---