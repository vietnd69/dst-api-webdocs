---
id: chest_mimicbrain
title: Chest Mimicbrain
description: Controls the decision-making logic for the Chest Mimic entity, governing behaviors such as item gathering, transformation, hiding, wandering, and combat.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f9affd5c
---

# Chest Mimicbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component implements the behavior tree for the Chest Mimic entity, a hostile mob that simulates a chest until approached by a player, then reveals itself to attack. It coordinates interaction cooldowns, inventory-based hiding (via transformation), ground item collection, player chasing, and wandering behavior. It extends `Brain` and integrates with components including `inventory`, `eater`, `timer`, and `knownlocations` to determine appropriate actions.

## Dependencies & Tags
- **Components used:**
  - `inventory`: Checks capacity (`IsFull`) and item hold status (`inventoryitem:IsHeld`).
  - `eater`: Determines whether a found item is edible (`CanEat`).
  - `timer`: Manages interaction cooldown (`INTERACT_COOLDOWN_NAME`) and the "angry" timer.
  - `knownlocations`: Remembers and retrieves the spawn point (`RememberLocation`, `GetLocation`).
  - `braincommon`: Supplies shared behavior nodes like `PanicTrigger`.
  - Custom helpers: `FindWalkableOffset`, `FindEntity`, `FindGroundItemAction`, `TryToHide`, `BufferedAction`.
- **Tags:** Uses `busy` (via `HasStateTag`) to prevent re-entry during critical actions. No tags are added or removed by this brain itself.

## Properties
No public instance properties are initialized in the constructor. The brain stores behavior-related state via internal variables (`INTERACT_COOLDOWN_NAME`, `SEE_DIST`) and assigns `self.bt` after constructing the behavior tree in `OnStart`.

## Main Functions
### `Chest_MimicBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root. Constructs a priority-based behavior tree with the highest-priority node being `PanicTrigger`, followed by conditional and reactive logic including transformation attempts when inventory is full, item-finding and eating/picking up while not jumping, player chasing, and wandering.
* **Parameters:** None.
* **Returns:** `nil`.

### `Chest_MimicBrain:OnInitializationComplete()`
* **Description:** Records the Chest Mimic’s current position as the `"spawnpoint"` location in `knownlocations` after initialization finishes. This location is used later as a fallback target for wandering behavior.
* **Parameters:** None.
* **Returns:** `nil`.

## Supporting Functions
The following functions are defined locally in the file and used by the behavior tree:
### `TryToHide(inst)`
* **Description:** Attempts to transform the Chest Mimic back into a chest by moving to a nearby walkable position and performing the `ACTIONS.MOLEPEEK` action. Fails silently if the stategraph has the `"busy"` tag or no valid offset is found.
* **Parameters:** `inst` (Entity) — the Chest Mimic instance.
* **Returns:** `nil` on failure, or a `BufferedAction` configured to perform `ACTIONS.MOLEPEEK`.

### `FindGroundItemAction(inst)`
* **Description:** Searches for a suitable item on the ground (minimum age ≥ 1 second, has `inventoryitem` component, meets must/cannot tag constraints) within `SEE_DIST`. If found, creates a `BufferedAction` to either `ACTIONS.EAT` or `ACTIONS.PICKUP` depending on edibility. Sets up a success callback to start a cooldown timer and defines a `validfn` ensuring the target is still reachable and unheld.
* **Parameters:** `inst` (Entity) — the Chest Mimic instance.
* **Returns:** `nil` if the stategraph is busy, an interact cooldown exists, or inventory is full; otherwise returns a `BufferedAction`.

### `GetWanderPoint(inst)`
* **Description:** Determines a wander target: the nearest player’s position if one exists, otherwise the stored `"spawnpoint"`.
* **Parameters:** `inst` (Entity).
* **Returns:** `Vector3` position or `nil` if no target location is available.

## Events & Listeners
The brain does not register or emit any events directly. It relies on the behavior tree to trigger actions and stategraph transitions, and on stategraph `busy` tags for concurrency control.