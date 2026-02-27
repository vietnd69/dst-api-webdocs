---
id: sharklistener
title: Sharklistener
description: Tracks nearby sharks and dynamically adjusts shark sound intensity for each player based on proximity.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 677a4395
---

# Sharklistener

## Overview
This component monitors sharks in the world and manages player-specific shark audio intensity by calculating the distance to the nearest shark within a 30-unit radius. It uses periodic updates to adjust a sound parameter on each player entity, fading the shark threat sound based on proximity or triggering a delayed fade-out after sharks have moved away.

## Dependencies & Tags
- Relies on the `inst` entity being valid and capable of listening to server-side events (`ms_playerjoined`, `ms_playerleft`, `sharkspawned`).
- Does not add or remove any tags on entities.
- Assumes tracked entities (players and sharks) have:
  - `GetDistanceSqToInst(other)` method (standard for `GOAPEntity`/`SimEntity`).
  - `IsValid()` method.
  - `HasTag(tag)` method (for sharks, checks `"walking"` tag).
- Assumes players expose `killtask` (a task handle) and `_sharksoundparam` (a sound parameter object with `.set(value)`).

## Properties
The component initializes no public properties beyond `self.inst` in the constructor. `_players` and `_sharks` are private tables used internally.

| Property | Type   | Default Value | Description |
|----------|--------|---------------|-------------|
| `inst`   | `Entity` | (passed to constructor) | The owning instance (typically the world root, `"TheWorld"`). |

*Note: All tracking tables (`_players`, `_sharks`) are private and not exposed as public properties.*

## Main Functions

### `GetDebugString()`
* **Description:** Returns a human-readable string indicating how many sharks are currently being tracked.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"ms_playerjoined"` → triggers `OnPlayerJoined`
  - `"ms_playerleft"` → triggers `OnPlayerLeft`
  - `"sharkspawned"` → triggers `StartTrackingShark`
  - `"onremove"` (on individual shark entities) → triggers `StopTrackingShark`
- **Periodic Task:**
  - Runs `processsharks` every 3 seconds (server-side only, as enforced by the commented-out master/sim check).
- **Pushes no custom events.**