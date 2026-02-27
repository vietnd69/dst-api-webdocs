---
id: moonbeastbrain
title: Moonbeastbrain
description: Controls the behavior tree of the Moon Beast, managing its targeting, petrification, and return-to-base logic during the Moon Base event.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e0f0890c
---

# Moonbeastbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `MoonBeastBrain` component implements the decision-making logic for the Moon Beast entity, a hostile creature summoned during the Moon Base event. It uses a behavior tree (`BT`) to orchestrate high-priority survival actions, petrification states, and the primary objective of attacking the Moon Base. The brain coordinates closely with the `entitytracker`, `health`, `combat`, and `workable` components to maintain awareness of the Moon Base's state and enforce appropriate behavioral transitions (e.g., dying if too far from the base, entering petrify mode if no moon charge is active, or prioritizing Moon Base work).

## Dependencies & Tags
- **Components used:**
  - `entitytracker`: To retrieve the Moon Base entity (`GetMoonBase` helper).
  - `health`: To kill the Moon Beast (`Kill()`).
  - `combat`: To reset attack cooldown (`ResetCooldown()`) and check last attack time (`GetLastAttackedTime()`).
  - `timer`: To check existence of the `"mooncharge"` timer (`TimerExists()`).
  - `workable`: To verify if the Moon Base is workable (`CanBeWorked()`) and to perform work (`WorkedBy()`).
- **Tags:** No tags are added, removed, or checked directly by this brain.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_losttime` | `number?` (Unix timestamp) | `nil` | Time when the Moon Beast first moved beyond `LOST_DIST` from the Moon Base; used to determine if the beast has been separated long enough to warrant death. |
| `_petrifytime` | `number?` (Unix timestamp) | `nil` | Timestamp when the Moon Beast should transition to the "Petrify" state (e.g., due to the `"mooncharge"` timer ending); set dynamically via `ForcePetrify()` or `LostMoonCharge()`. |

## Main Functions
### `MoonBeastBrain:ForcePetrify()`
* **Description:** Forces the Moon Beast to enter the petrify state immediately by setting `_petrifytime` to the current time plus a random variance.
* **Parameters:** None.
* **Returns:** `nil`.

### `MoonBeastBrain:OnStart()`
* **Description:** Constructs and assigns the behavior tree (`self.bt`) for the Moon Beast. Defines a priority-weighted root node with nested sequences and conditionals that govern behavior flow. Key stages include checking for separation from the Moon Base, lunar charge status, skeleton breaking, Moon Base targeting, and fallback aggression.
* **Parameters:** None.
* **Returns:** `nil`.

### Helper Functions
The following functions are defined as local closures within the constructor and are integral to behavior tree conditionals:

#### `GetMoonBase(inst)`
* **Description:** Retrieves the Moon Base entity via `entitytracker`.
* **Parameters:** `inst` (EntityInstance) — the Moon Beast instance.
* **Returns:** `Entity?` — The Moon Base entity or `nil` if not found.

#### `LostMoonBase(self)`
* **Description:** Determines if the Moon Beast has become too far from the Moon Base for too long. Returns `true` if separation exceeds `LOST_TIME` seconds. Resets `_losttime` if the Moon Beast returns to `LOST_DIST`.
* **Parameters:** `self` (MoonBeastBrain instance).
* **Returns:** `boolean` — `true` if the Moon Beast is lost beyond the allowed time threshold.

#### `LostMoonCharge(self)`
* **Description:** Checks if the `"mooncharge"` timer on the Moon Base has ended. If so, triggers petrify mode after a short delay. Sets `_petrifytime` if not already set.
* **Parameters:** `self` (MoonBeastBrain instance).
* **Returns:** `boolean` — `true` if the Moon Beast should be petrified (i.e., `mooncharge` timer does not exist and `_petrifytime` has elapsed).

#### `ShouldTargetMoonBase(inst)`
* **Description:** Evaluates whether the Moon Beast should target and work on the Moon Base. Requires the Moon Base to exist, be workable, have an active `"mooncharge"` timer, and the Moon Beast to not have recently attacked.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** `boolean`.

#### `GetMoonBasePos(inst)`
* **Description:** Returns the world position of the Moon Base if it exists.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** `Vector3?` — Position of the Moon Base or `nil`.

#### `WorkMoonBase(inst)`
* **Description:** Pushes a `"workmoonbase"` event with the Moon Base entity, signaling the entity's workable component (or event handlers) to perform work.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** `nil`.

#### `BreakSkeletons(inst)`
* **Description:** Scans for nearby skeletons (`playerskeleton` + `HAMMER_workable` tags) within a 1.25 unit radius and works them once with `WorkedBy()`, clearing obstacles near the Moon Beast.
* **Parameters:** `inst` (EntityInstance).
* **Returns:** `nil`.

## Events & Listeners
The component does **not** register listeners. However, it pushes the following events:
- `"moonpetrify"`: Fired when the petrify timer expires, initiating petrification.
- `"workmoonbase"`: Fired when the Moon Beast begins working on the Moon Base, containing `moonbase` in the event data.

---