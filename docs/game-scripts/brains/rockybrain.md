---
id: rockybrain
title: Rockybrain
description: AI brain controlling Rocky the Beefalo, managing combat behavior, shield usage, leadership loyalty, and movement strategies including wandering, chasing, and eating.
tags: [ai, combat, follower, beefalo, brain]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: ddb54202
---

# Rockybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`rockybrain` is the brain component for the Beefalo entity Rocky. It orchestrates high-level decision-making using a Behavior Tree (`BT`) to coordinate responses to combat, leadership, hunger, and environmental stimuli. Key responsibilities include:
- Executing shield-based defense in response to incoming damage and projectile attacks.
- Losing loyalty with a probability when scared, potentially abandoning the leader.
- Tracking and following a leader while maintaining optimal distance.
- Wandering toward the known "herd" location.
- Prioritizing combat engagement, eating, and entity facing behavior.

The brain relies heavily on external behavior modules (e.g., `chaseandattack`, `useshield`, `wander`) and integrates with components like `combat`, `follower`, `eater`, `inventory`, and `knownlocations`.

## Usage example

```lua
local inst = CreateEntity()
inst:AddComponent("rockybrain")
-- Rockybrain is a brain component and is automatically initialized on start/stop by the brain system.
-- Typical brain activation occurs via inst:PushEvent("becomeplayer") or similar state changes.
```

## Dependencies & tags

**Components used:**
- `combat`: calls `SetTarget`, checks for ally status.
- `eater`: calls `CanEat` to assess edible items.
- `follower`: calls `GetLeader`, `GetLoyaltyPercent`, `SetLeader`.
- `inventory`: calls `FindItem` to locate edible items in inventory.
- `inventoryitem`: checks `canbepickedup` for potential food items.
- `knownlocations`: calls `GetLocation("herd")` to determine wander destination.

**Tags:** None directly added or removed by this brain itself.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scareendtime` | number | `0` (initial) | Timestamp indicating when the current scare period ends; updated on `"epicscare"` events. |
| `scaredelay` | number or nil | `nil` | Delay timer used to space loyalty loss checks after a scare event. |
| `onepicscarefn` | function or nil | `nil` | Event callback registered to `"epicscare"` that extends `scareendtime`. |
| `bt` | BehaviorTree | `nil` | Behavior tree instance created in `OnStart` and used to drive decision making. |

## Main functions

### `RockyBrain:OnStart()`
* **Description:** Initializes the brain's Behavior Tree when the entity becomes active. Registers a listener for `"epicscare"` events and builds a priority-based behavior tree composed of multiple behavior nodes.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Uses defensive checks to avoid duplicate registration of the `"epicscare"` callback.

### `RockyBrain:OnStop()`
* **Description:** Cleans up the `"epicscare"` event listener and associated state (`scareendtime`, `onepicscarefn`) when the brain is deactivated.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the closest player within `START_FACE_DIST` (4 units) who is not tagged `"notarget"`. Used by `FaceEntity` behavior to determine which entity to face.
* **Parameters:**
  - `inst`: The entity instance whose brain is requesting the face target.
* **Returns:** `TheTarget` (entity) or `nil`.
* **Error states:** Returns `nil` if no valid target is found or if the closest target is tagged `"notarget"`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether the entity should continue facing a given target based on proximity (`KEEP_FACE_DIST`, 6 units) and absence of the `"notarget"` tag.
* **Parameters:**
  - `inst`: The entity instance.
  - `target`: The target entity to evaluate.
* **Returns:** `true` if still facing should be maintained; otherwise `false`.
* **Error states:** Returns `false` if `target` has `"notarget"` or exceeds `KEEP_FACE_DIST`.

### `CanPickup(item)`
* **Description:** Utility function that checks whether an item can be picked up. Ensures the item is pickable, sufficiently aged (at least 8 seconds old), and on valid ground.
* **Parameters:**
  - `item`: The entity to evaluate for pickup eligibility.
* **Returns:** `true` if the item is eligible for pickup; otherwise `false`.
* **Error states:** None.

### `EatFoodAction(inst)`
* **Description:** Constructs a buffered action for Rocky to either eat food from its inventory or pick up an edible item from the world if inventory is empty. Prioritizes existing inventory consumption before searching externally.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if:
  - The stategraph has the `"busy"` tag.
  - No food is in inventory (if `inventory`/`eater` components exist).
  - No eligible edible item is found within range (15 units) matching `EATFOOD_MUST_TAGS` and not in `EATFOOD_CANT_TAGS`.

### `ScaredLoseLoyalty(self)`
* **Description:** Checks whether Rocky should lose loyalty (i.e., lose its leader) after being scared. Only evaluates the loyalty loss chance after a delay (`3` seconds) from the last scare event. Uses `TryLuckRoll` with `LuckFormulas.LoseFollowerOnPanic` to determine outcome.
* **Parameters:**
  - `self`: The brain object (passed implicitly in Behavior Tree context).
* **Returns:** Nothing.
* **Error states:** Does not error, but may fail silently if:
  - `follower` component is missing.
  - Leader is `nil`.
  - Loyalty is already `0`.
  - Luck roll fails.

## Events & listeners

- **Listens to:** `"epicscare"` — Triggers `self.onepicscarefn`, which updates `scareendtime` to extend the scare duration window.
- **Pushes:** None. Events like `"leaderchanged"` are pushed internally by the `follower` component (not this brain), and this brain responds to them via component callbacks.

---