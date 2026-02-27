---
id: killerbeebrain
title: Killerbeebrain
description: Implements the AI behavior tree for the killer bee entity, governing movement, combat, and navigation including fleeing from danger, attacking targets, returning to hive home, and wandering.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: aa3f8047
---

# Killerbeebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`KillerBeeBrain` is a behavior tree-based AI controller assigned to the killer bee entity. It manages high-level decision-making through a priority node structure, coordinating combat, evasion, navigation, and wander behaviors. It leverages shared behavior modules (`ChaseAndAttack`, `RunAway`, `Wander`, `DoAction`) and integrates with the `Combat` component for target detection and timing, as well as the `KnownLocations` component to remember and navigate back to its home location. It extends the base `Brain` class and defines behavior upon activation (`OnStart`) and initialization completion (`OnInitializationComplete`).

## Dependencies & Tags
- **Components used:**  
  - `combat` (reads: `HasTarget`, `InCooldown`, `target`)  
  - `knownlocations` (reads: `GetLocation("home")`; writes: `RememberLocation("home", pos)`)  
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MAX_CHASE_DIST` | number | 25 | Maximum distance (in tiles) the killer bee will chase its target. |
| `MAX_CHASE_TIME` | number | 10 | Maximum duration (in seconds) the killer bee will continue chasing. |
| `RUN_AWAY_DIST` | number | 3 | Distance threshold at which the killer bee begins fleeing from its combat target. |
| `STOP_RUN_AWAY_DIST` | number | 6 | Distance threshold at which the killer bee stops fleeing and resumes behavior. |
| `inst` | Entity | — | The entity instance the brain controls (inherited from `Brain`). |
| `bt` | BT | — | Behavior tree instance created during `OnStart`; stores the root node. |

## Main Functions

### `KillerBeeBrain:OnStart()`
* **Description:** Initializes and assigns the root behavior tree node. It constructs a priority-based tree where actions are evaluated in order of priority: panic triggers, combat (attack during cooldown window or dodge during attack cooldown), returning home, and wandering. This function is called automatically when the brain is started.
* **Parameters:** None.
* **Returns:** None.

### `KillerBeeBrain:OnInitializationComplete()`
* **Description:** Records the killer bee’s starting position as its "home" location using the `KnownLocations` component. This location is used later by the `Wander` and `DoAction` ("go home") behaviors for navigation.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None.