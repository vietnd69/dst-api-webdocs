---
id: sporebrain
title: Sporebrain
description: Manages the AI behavior tree for spore-based entities by combining wandering and follow logic to track nearby characters.
tags: [ai, brain, movement]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 306bf42b
---

# Sporebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`sporebrain` is a Brain component that defines the behavior tree for spore-based entities (e.g., Sporeling, Sporeling Queen). It prioritizes following nearby valid targets (players, characters, or monsters) within a defined range while periodically wandering around a home location. The brain uses the Behavior Tree (BT) system with two primary behaviors: `Follow` and `Wander`. It relies on the `knownlocations` component to retrieve the home location for wandering and uses `FindEntity` to locate suitable targets.

## Usage example

```lua
-- Add the sporebrain to an entity
inst:AddComponent("sporebrain")

-- The brain is automatically initialized when the entity is spawned
-- No further manual setup is required; the behavior tree runs automatically.
```

## Dependencies & tags

**Components used:** `knownlocations` (accessed via `self.inst.components.knownlocations:GetLocation("home")`).

**Tags:** The component checks for presence of any one of the following tags on potential follow targets: `"player"`, `"character"`, `"monster"`. It does not directly add or remove tags itself.

## Properties

No explicit public properties are initialized in the constructor. The component internally stores `inst.followobj`, `inst.bt`, and uses constants (`MAX_WANDER_DIST`, `MIN_FOLLOW_DIST`, etc.) defined at the script scope.

## Main functions

### `SporeBrain:OnStart()`
* **Description:** Initializes and starts the behavior tree for the spore entity. Constructs a priority node that first attempts to follow a nearby target, and if that is not viable, falls back to wandering around the home location.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** May fail silently if `FindEntity` returns `nil` (no valid target found) or if the home location is not registered in the `knownlocations` component.

### `FindObjectToFollow(inst)` (private)
* **Description:** A helper function that locates a valid entity to follow. It verifies the current `followobj` is valid and within range; otherwise, it searches within `MAX_FOLLOW_DIST` for an entity matching one of the required tags.
* **Parameters:**
  * `inst` (Entity): The entity instance for which to find a follow target.
* **Returns:** Entity or `nil` — the found entity or `nil` if no suitable target exists.
* **Error states:** Returns `nil` if no entity matching the required tags is found within range or if all previously found targets are invalid.

## Events & listeners
No event listeners are registered, and no events are pushed by this component.

---