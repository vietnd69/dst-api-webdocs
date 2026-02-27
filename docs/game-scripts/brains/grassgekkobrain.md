---
id: grassgekkobrain
title: Grassgekkobrain
description: Implements the behavior tree for grassgekko entities, managing movement, panic responses, and leash-based herd following.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d79b9791
---

# Grassgekkobrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `GrassgekkoBrain` component defines the behavioral logic for grassgekko entities in `Don't Starve Together`. It implements an AI behavior tree (`BT`) using a priority-based node structure to handle panic responses (e.g., fleeing from players or scary entities), wanders to a herd location, and respects leash constraints via the `leash` behavior. This component is attached to grassgekko entities and coordinates movement through DST's behavior system.

## Dependencies & Tags

- **Components used:**
  - `knownlocations`: Accessed via `self.inst.components.knownlocations:GetLocation("herd")` to retrieve the herd's current position for wandering.
- **Tags checked:**
  - `NO_TAGS = {"FX", "NOCLICK", "DECOR", "INLIMBO", "stump", "burnt"}` is passed to `RunAway` to exclude entities with these tags from triggering avoidance behavior.
- **Behaviors used:**
  - `wander`, `faceentity`, `runaway`, `leash` (referenced via `require` but only `Wander` and `RunAway` are used in the tree).
- **Brain utilities:**
  - `BrainCommon.PanicTrigger`, `BrainCommon.ElectricFencePanicTrigger` from `brains/braincommon.lua`.

## Properties

No explicit properties are initialized in the constructor or elsewhere in this file beyond standard `Brain` inheritance. All configuration is done via local constants.

## Main Functions

### `GrassgekkoBrain:OnStart()`
* **Description:** Initializes the behavior tree root node when the brain starts. Constructs a priority node that evaluates behaviors in order of urgency: panic triggers first, followed by `RunAway` for specific entity types, and finally a `Wander` action targeting the herd location.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners

This component does not register or fire any events directly. All event-driven behavior is encapsulated within the behavior tree nodes (`RunAway`, `Wander`, `BrainCommon.PanicTrigger`, etc.) and their underlying logic.