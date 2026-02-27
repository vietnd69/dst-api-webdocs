---
id: beebrain
title: Beebrain
description: Implements the decision-making logic for the Bee mob, controlling its movement, combat, and pollination behavior through a behavior tree.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 145db75c
---

# Beebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `BeeBrain` component implements the AI behavior tree for the Bee mob. It orchestrates high-level decision-making by evaluating environmental and state conditions (such as combat status, time of day, season, pollen load, and proximity to Bee Beacons or burning homes) and selecting appropriate behaviors. It inherits from `Brain` and uses a priority-based behavior tree constructed during `OnStart`. The brain interacts with several core components, including `combat`, `homeseeker`, `burnable`, `pollinator`, `knownlocations`, and various behavior modules (`chaseandattack`, `runaway`, `wander`, etc.).

## Dependencies & Tags
- **Components used:**
  - `combat`: accessed via `self.inst.components.combat:HasTarget()`, `self.inst.components.combat:InCooldown()`, and `self.inst.components.combat.target`
  - `homeseeker`: accessed via `self.inst.components.homeseeker.home` to check if the home is burning
  - `burnable`: accessed via `self.inst.components.homeseeker.home.components.burnable:IsBurning()`
  - `pollinator`: accessed via `self.inst.components.pollinator:HasCollectedEnough()`
  - `knownlocations`: accessed via `self.inst.components.knownlocations:RememberLocation("home", ...)` and `self.inst.components.knownlocations:GetLocation("home")`
- **Tags:** None are explicitly added or removed by this brain. Behavior tagging (e.g., `"beebeacon"`) is used only for entity lookup via `FindEntity`.

## Properties
The constructor initializes only a few internal properties used for timed operations and caching:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `beebeacontime` | `number` | `GetTime() + math.random()` | Timestamp used to throttle how often the bee scans for a Bee Beacon (refreshed every ~2-3 seconds). |

No other public properties are defined directly in the constructor.

## Main Functions
### `BeeBrain:OnStart()`
* **Description:** Builds and assigns the behavior tree root node (`self.bt`) by constructing a priority-ordered list of conditional behavior nodes. The tree evaluates conditions from highest to lowest priority and executes the first matching action.
* **Parameters:** None.
* **Returns:** None. Installs the constructed `BT` tree in `self.bt`.

### `BeeBrain:OnInitializationComplete()`
* **Description:** Records the bee’s current position as the “home” location using the `knownlocations` component. This is called once after the entity is fully initialized and ready for AI use.
* **Parameters:** None.
* **Returns:** None.

### `IsHomeOnFire(inst)`
* **Description:** Helper function (not a method) that checks whether the bee’s home entity exists and is currently burning. Used as a condition in the behavior tree.
* **Parameters:**
  - `inst`: The bee entity instance.
* **Returns:** `boolean` — `true` if the home exists, is valid, and is burning; otherwise `false`.

### `FindBeeBeacon(self)`
* **Description:** Caches and returns the nearest valid Bee Beacon within 30 world units. Uses throttling via `beebeacontime` to avoid frequent expensive searches (every 2–3 seconds). Invalidates the cached beacon if it becomes out-of-range or non–beebeacon-tagged.
* **Parameters:**
  - `self`: The brain instance (provides `self.inst`, `self.lastbeebeacon`, and `self.beebeacontime`).
* **Returns:** `GameObject?` — The found Bee Beacon entity, or `nil` if none exists or search is throttled.

### `GetBeeBeaconPos(self)`
* **Description:** Convenience wrapper that returns the world position of the nearest Bee Beacon, or `nil`.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `Vector3?` — The beacon’s `x,y,z` position, or `nil`.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target of the bee, used by the `RunAway` behavior.
* **Parameters:**
  - `inst`: The bee entity instance.
* **Returns:** `GameObject?` — The entity targeting the bee (`inst.components.combat.target`), or `nil` if no target.

## Events & Listeners
The `BeeBrain` component does not register any event listeners or push events. It relies solely on synchronous evaluation of conditions within the behavior tree nodes.