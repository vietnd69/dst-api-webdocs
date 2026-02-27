---
id: brightmare_gestaltinvaderbrain
title: Brightmare Gestaltinvaderbrain
description: Defines the behavior tree for the Brightmare Gestalt Invader entity, handling target tracking, aggression logic, petrification timers, and skeleton breaking interactions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 516ac6ae
---

# Brightmare Gestaltinvaderbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component implements the behavior tree for the Brightmare Gestalt Invader entity in `Don't Starve Together`. It manages high-level AI decision-making, including tracking and attacking the designated "invade target" (typically a Wagstaff NPC), resetting aggression cooldowns after breaking skeletons, optionally spitting projectiles when tagged as a spitter, and responding to environment triggers like being teleported away. The brain uses custom utility functions and standard behaviors (`ChaseAndAttack`, `Leash`, `StandStill`, `AttackWall`, `Panic`) orchestrated via a priority-based behavior tree root.

## Dependencies & Tags
- **Components used:** `combat`, `entitytracker`, `health`, `timer`, `workable`
- **Tags:** `wagstaff_npc` (checked on target), `gestalt_invader_spitter` (checked on invader), `playerskeleton`, `HAMMER_workable` (used as workable tags in `BREAKSKELETONS_MUST_TAGS`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_losttime` | `number?` | `nil` | Stores the timestamp when the invader target was first considered lost; used to enforce a `LOST_TIME` delay before triggering death. |
| `_petrifytime` | `number?` | `nil` | Stores the deadline time (current time + random variance) before which the invader must reacquire a valid target; failure to do so resets the timer. |

## Main Functions
### `MoonBeastBrain:OnStart()`
* **Description:** Initializes and starts the behavior tree (`BT`) for the entity. Constructs the behavior root using a `PriorityNode` that evaluates conditions in order of priority, executing corresponding actions when their conditions evaluate to true. Includes logic for losing target, spitting, skeleton breaking, attacking the invade target, general aggression, and leash management.
* **Parameters:** None.
* **Returns:** `nil`.

### `GetInvadeTarget(inst)`
* **Description:** Helper to retrieve the current "invade target" entity from the `entitytracker` component.
* **Parameters:**
  - `inst`: The entity instance (usually the invader).
* **Returns:** The entity instance assigned as `"invadeTarget"` in `entitytracker`, or `nil` if not found.

### `LostInvadeTarget(self)`
* **Description:** Determines whether the invader has lost its target long enough to be considered lost (e.g., if teleported away). Returns true if the target is absent for more than `LOST_TIME` seconds (`5`). Sets `_losttime` on first detection of target absence.
* **Parameters:**
  - `self`: The brain instance (provides access to `_losttime` and the entity via `self.inst`).
* **Returns:** `true` if the target has been absent for `> 5` seconds; otherwise `false`.

### `LostMoonCharge(self)`
* **Description:** Determines whether the moon charge timer has expired, typically used to enforce a petrify/refreeze delay. Sets `_petrifytime` once when first triggered and evaluates against `GetTime()`.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `true` if the petrify deadline (`_petrifytime`) has passed and no target has been reacquired; otherwise `false`.

### `ShouldTargetInvadeTarget(inst)`
* **Description:** Returns true if the entity should target the invade target instead of pursuing default aggression. Conditions: target exists, target has tag `"wagstaff_npc"`, and more than `AGGRO_TIME` (`6`) seconds have passed since the entity's last attack (via `combat:GetLastAttackedTime()`).
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if the entity should prioritize attacking the invade target; otherwise `false`.

### `GetInvadeTargetPos(inst)`
* **Description:** Returns the world position of the current invade target, or `nil` if no target exists.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A vector position (`Vector`), or `nil`.

### `AttackInvadeTarget(inst)`
* **Description:** Placeholder function for invoking an `"workmoonbase"` event. Currently commented out in the source.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `nil`.

### `BreakSkeletons(inst)`
* **Description:** Searches for an adjacent skeleton (within `1.25` units) tagged as `playerskeleton` and `HAMMER_workable`, then forces it to be worked once by the entity via `workable:WorkedBy()`.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `nil`.

### `shouldspit(inst)`
* **Description:** Returns true if the entity is tagged `"gestalt_invader_spitter"` and currently has a combat target without an active `"spit_cooldown"` timer.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if spitting should be triggered; otherwise `false`.

### `spit(inst)`
* **Description:** Creates and returns a buffered action to `TOSS` the combat target, used to trigger a projectile attack.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** A `BufferedAction` instance.

### `shouldwaittospit(inst)`
* **Description:** Returns true if the entity is a spitter and its combat target is within a 4-unit squared distance (i.e., `<= 4 world units`), indicating it must wait before spitting.
* **Parameters:**
  - `inst`: The entity instance.
* **Returns:** `true` if waiting is required before spitting; otherwise `false`.

## Events & Listeners
- **Listens to:** None.
- **Pushes:** None.