---
id: pollyrogerbrain
title: Pollyrogerbrain
description: AI brain controlling Polly Rogers and Salt Dogs, handling leader following, ocean-based wandering, salt management, and panic responses.
tags: [ai, combat, npc, wander, panic]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 8dbfed5f
---

# Pollyrogerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree logic for Polly Rogers and Salt Dogs. It orchestrates actions such as following a leader, gathering items, wandering (specifically near ocean tiles for Salt Dogs), and reacting to hostile entities via panic responses. The brain integrates with the `Follower` component to track its leader and uses custom spatial logic to locate ocean-adjacent positions for Salt Dogs. It also manages salt-related state transitions via a `Counter` component.

## Usage example

```lua
inst:AddBrain("brains/pollyrogerbrain")
```

This brain is typically attached during entity prefabs initialization (e.g., for `polly_rogers` or `salty_dog`). No manual function calls are required; the brain activates automatically on `OnStart()`.

## Dependencies & tags

**Components used:**
- `follower` — accessed via `inst.components.follower:GetLeader()`
- `counter` — used only for `salty_dog` to read `"salty"` count via `counter:GetCount("salty")`

**Tags:**
- Checks state tags: `"busy"`
- Checks entity tags: `"hostile"`, `"NOCLICK"`, `"invisible"`, `"player"`
- Sets internal `nearbyoceanpoint` state (non-persistent, runtime-only)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the brain controls (assigned by base `Brain` class) |
| `bt` | `BT` | `nil` | Behavior tree root, assigned in `OnStart()` |

No custom instance properties are defined in the constructor; all relevant state (e.g., `nearbyoceanpoint`) is stored locally within `OnStart()`.

## Main functions

### `PollyRogerBrain:OnStart()`
* **Description:** Initializes the behavior tree and configures root-level priorities, including panic responses, leader-following, item gathering, and salt-aware wandering logic. Sets up the `root` node tree and assigns it to `self.bt`.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None explicitly documented.

### `closetoleader(inst)`
* **Description:** Helper function used in the behavior tree to determine if the entity is within optimal range of its leader. Returns `true` only if the entity is not `"busy"` and within `TUNING.POLLY_ROGERS_RANGE` distance squared.
* **Parameters:**
  - `inst` (`Entity`): The entity instance to evaluate.
* **Returns:** `true` if close to leader and not busy; otherwise `nil`.
* **Error states:** Returns `nil` if the entity is busy or lacks a `follower` component or leader.

### `FindNearbyOceanPos(inst)`
* **Description:** For Salt Dogs, computes a nearby ocean position in a circular pattern around the leader or self. Iterates outward from `MAX_FOLLOW_DIST` in steps of `-2`, checking octagonal offsets for ocean tiles.
* **Parameters:**
  - `inst` (`Entity`): The entity instance requesting the ocean position.
* **Returns:** `Vector3` of the first found ocean position, or `nil` if no ocean tile is found within range.
* **Error states:** Returns `nil` if no ocean is found in the search radius.

### `IsWanderOcean(pt)`
* **Description:** Predicate function to validate whether a candidate wander point is an ocean tile.
* **Parameters:**
  - `pt` (`Vector3`): The point to test.
* **Returns:** `true` if `TheWorld.Map:IsOceanAtPoint(pt.x, pt.y, pt.z)`; otherwise `false`.
* **Error states:** None.

## Events & listeners

**Listens to:** None explicitly declared (event handling is embedded in behavior tree nodes via helper functions like `PanicTrigger`, not via `inst:ListenForEvent`).

**Pushes:**
- `"saltshake"` — Pushed when a `salty_dog` is fully salted (`count >= TUNING.SALTY_DOG_MAX_SALT_COUNT`) while on land. Triggers visual/sfx effect via `self.inst:PushEvent("saltshake")`.

Events used internally by behavior tree primitives (e.g., `RunAway`, `Follow`, `Wander`) are handled by their respective implementations and not listed here.