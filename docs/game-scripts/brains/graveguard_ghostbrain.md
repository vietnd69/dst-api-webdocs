---
id: graveguard_ghostbrain
title: Graveguard Ghostbrain
description: Controls the behavioral decision-making and task execution of the Graveguard ghost, including following targets, interacting with other ghosts, wandering, and despawning.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 25c82fb7
---

# Graveguard Ghostbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `GraveGuardBrain` component defines the behavior tree for the Graveguard ghost entity in Don't Starve Together. It orchestrates high-level behaviors such as following a target character, playing with other ghosts (e.g., Abigail), wandering near the ghost's home location, and eventually despawning after a full game cycle. It extends the base `Brain` class and constructs a `BT` (Behavior Tree) instance in `OnStart`, delegating movement and decision logic to external behavior nodes (`Follow`, `Wander`, `Leash`, `StandStill`, etc.). The brain interacts with key components: `health` (to verify targets are alive), `knownlocations` (to locate the "home" point), and `timer` (to enforce play cooldowns).

## Dependencies & Tags
- **Components used:**
  - `health` — checks if targets are alive via `IsDead()`
  - `knownlocations` — retrieves the "home" location via `GetLocation("home")`
  - `timer` — checks for a "played_recently" timer via `TimerExists("played_recently")`
- **Tags used in filtering:**
  - `PLAYMATE_NO_TAGS`: `{"abigail", "busy"}`
  - `PLAYMATE_ONEOF_TAGS`: `{"ghost"}`
  - `TARGET_CANT_TAGS`: `{"INLIMBO", "noauradamage"}`
  - `TARGET_ONEOF_TAGS`: `{"character", "hostile", "monster", "smallcreature"}`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `playfultarget` | `Entity` | `nil` | Reference to the ghost currently being played with; set/cleared by `FindPlaymate` and `PlayWithPlaymate`. |
| `followtarget` | `Entity` | `nil` | The living target the ghost is currently following; updated by `GetFollowTarget`. |
| `bt` | `BehaviorTree` | `nil` | Behavior tree instance created in `OnStart`; stores the active root node. |

## Main Functions

### `GraveGuardBrain:OnStart()`
* **Description:** Initializes the behavior tree for the ghost. Constructs a priority-weighted root node that evaluates in order: (1) follow a valid target, (2) despawn if requested, (3) play with another ghost if conditions allow, and (4) wander near home until timing out and despawning.
* **Parameters:** None.
* **Returns:** None.

### `FindPlaymate(self)`
* **Description:** Determines whether the ghost can or should play with another ghost. Checks proximity to home, cooldown state (`played_recently` timer), and searches for a valid ghost within range using `FindEntity`. If a playmate is found and valid, it is stored in `self.playfultarget`.
* **Parameters:**
  - `self` (`GraveGuardBrain`): The brain instance.
* **Returns:** `true` if a valid playmate is found and selected; `false` otherwise.

### `PlayWithPlaymate(self)`
* **Description:** Triggers a `start_playwithghost` event with the current `playfultarget` and clears the playmate reference. Used after the ghost has completed its playful interaction sequence.
* **Parameters:**
  - `self` (`GraveGuardBrain`): The brain instance.
* **Returns:** None.

### `IsAlive(target)`
* **Description:** Helper function to verify if a target entity is alive and visible, used during target selection. Checks visibility, presence of a health component, and that the entity is not dead.
* **Parameters:**
  - `target` (`Entity`): The entity to evaluate.
* **Returns:** `true` if the target is visible, has a `health` component, and `health:IsDead()` is `false`; otherwise `false`.

### `GetFollowTarget(ghost)`
* **Description:** Updates and returns the ghost's current follow target. Clears the stored target if it becomes invalid (e.g., dead, hidden, too far). If no valid target exists, it searches for the nearest living character within 10 units that satisfies `_target_test` (e.g., not an ally under PvP rules). Updates `ghost.brain.followtarget` as a side effect.
* **Parameters:**
  - `ghost` (`Entity`): The ghost entity whose brain is performing the search.
* **Returns:** `Entity` or `nil` — the selected follow target, or `nil` if none found.

## Events & Listeners
- **Pushes:**
  - `"start_playwithghost"` — Fired by `PlayWithPlaymate` with payload `{target=self.playfultarget}` to signal a play interaction has started.