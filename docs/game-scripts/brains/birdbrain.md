---
id: birdbrain
title: Birdbrain
description: Controls the flight behavior of bird-like entities by evaluating threat conditions and initiating a "fly away" action when necessary.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 7953d39d
---

# Birdbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Birdbrain` is a behavior tree-based AI brain component designed for bird-like entities. It determines when the entity should initiate flight (e.g., due to threats, environmental conditions, or external events) and executes the `flyaway` action. It uses a priority-based behavior tree (`BT`) with conditional nodes to evaluate real-time conditions such as panic state, time of day, fire damage, and proximity of hostile entities. The brain interacts with the `hauntable`, `health`, and `burnable` components to assess danger and adapt behavior accordingly.

## Dependencies & Tags
- **Components used:**
  - `hauntable`: Reads `panic` property.
  - `health`: Reads `takingfiredamage` property.
  - `burnable`: Reads `IsBurning()` method.
- **Tags checked:**
  - `lunar_aligned`: Used to determine mutation state.
- **Tags used in `FindEntity` (for threat detection):**
  - `SHOULDFLYAWAY_MUST_TAGS`: `"notarget"`, `"INLIMBO"` (must *not* be present on threat entities — used as `canttags` in `FindEntity`).
  - `SHOULDFLYAWAY_CANT_TAGS`: `"player"`, `"monster"`, `"scarytoprey"` (at least *one* must be present on a threat entity — used as `oneoftags` in `FindEntity`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.flyawaydistance` | `number` (expected) | Not defined in `Birdbrain` | Used by `FindEntity` to limit detection radius for threats. Must be defined on the instance elsewhere. |

## Main Functions

### `BirdBrain:OnStart()`
* **Description:** Initializes the behavior tree for the bird entity. Constructs a priority-based `BT` root node with four conditions that trigger the `flyaway` action: panic (from `hauntable`), `ShouldFlyAway` conditions, `"threatnear"` event, and `"gohome"` event. The behavior tree runs at a `.25` second interval.
* **Parameters:** None.
* **Returns:** `nil`.

### `ShouldFlyAway(inst)` (local function)
* **Description:** Evaluates whether the entity should fly away based on multiple criteria:
  - Entity is *not* in `sleeping`, `busy`, or `flight` states.
  - One or more of:
    - It is nighttime (`TheWorld.state.isnight`).
    - Lunar hail is active (`TheWorld.state.islunarhailing`).
    - Taking fire damage *and* not currently burning (to avoid double-counting fire-related threats).
    - A nearby entity exists that satisfies the threat criteria (via `FindEntity`).
* **Parameters:**
  - `inst` (`Entity`): The bird entity instance.
* **Returns:** `boolean` — `true` if the entity should fly away, `false` otherwise.

### `FlyAway(inst)` (local function)
* **Description:** Triggers the `flyaway` event on the instance to signal the start of flight behavior.
* **Parameters:**
  - `inst` (`Entity`): The bird entity instance.
* **Returns:** `nil`.

## Events & Listeners
- **Listens to:** `"threatnear"` (via `EventNode` in behavior tree), `"gohome"` (via `EventNode` in behavior tree).
- **Pushes:** `"flyaway"` (via `inst:PushEvent("flyaway")` when triggered by behavior nodes).