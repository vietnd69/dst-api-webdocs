---
id: strafer
title: Strafer
description: Manages strafing state and input handling for entities with locomotion, synchronizing facing direction and strafing status between client and server.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: e3433b47
---

# Strafer

## Overview
The `Strafer` component handles the logic for strafing movement—managing when an entity begins or stops strafing, computing the target facing direction from input (keyboard or controller), and updating the `Locomotor` component accordingly. It supports both server-side authoritative behavior (on mastersim) and client-side prediction (on non-mastersim), and coordinates with the RPC system to synchronize direction updates across network peers.

## Dependencies & Tags
- **Components Required:** `playercontroller`, `locomotor` (optional, used for non-mastersim clients)
- **Events Listened To:** `startstrafing`, `stopstrafing`
- **Tags Used:** `busy` (checked via `self.inst.sg:HasStateTag("busy")`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | Indicates whether this instance is the authoritative simulation. |
| `playercontroller` | `Component?` | `inst.components.playercontroller` | Reference to the `playercontroller` component (may be `nil` on non-player entities). |
| `aiming` | `boolean` | `false` | Tracks whether the entity is currently aiming/strafering. |
| `lastdir` | `number?` | `nil` | Stores the last known facing direction (in degrees) to avoid redundant RPCs. |

## Main Functions

### `Strafer:IsAiming()`
* **Description:** Returns whether the entity is currently in strafing/aiming state.
* **Parameters:** None  
* **Returns:** `boolean` — `true` if strafing is active, otherwise `false`.

### `Strafer:OnRemoveFromEntity()`
* **Description:** Cleanup logic when the component is removed from the entity. Stops listening for events and ensures strafing mode is disabled on the `locomotor` (if applicable).  
* **Parameters:** None

### `Strafer:OnUpdate(dt)`
* **Description:** Computes and applies the current strafing direction every frame while `aiming` is `true`. Checks input sources (keyboard or controller), calculates direction relative to camera or world space, and updates the `locomotor` (if present). On non-mastersim, sends direction updates to the server via RPC. Aborts if input is disabled or the entity is in a "busy" state.  
* **Parameters:**  
  - `dt` (`number`) — Delta time since the last update.

## Events & Listeners
- Listens for `"startstrafing"` → triggers `OnStartStrafing`
- Listens for `"stopstrafing"` → triggers `OnStopStrafing`
- On instantiation, checks `inst.player_classified.isstrafing:value()` and resumes strafing if true.