---
id: kramped
title: Kramped
description: Manages Krampus spawning logic by tracking player naughtiness and spawning Krampus entities when naughtiness thresholds are exceeded.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 7d9939fc
---

# Kramped

## Overview
The `kramped` component is a world-scoped system responsible for monitoring player behavior that contributes to naughtiness (such as killing certain creatures) and spawning Krampus entities when predefined thresholds are met. It tracks per-player naughtiness state, handles naughtiness decay over time, and coordinates Krampus spawning with spawn location validation and difficulty scaling based on world age.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` (runs exclusively on the master server).
- Listens to world events: `ms_playerjoined`, `ms_playerleft`, `ms_forcenaughtiness`.
- Attaches event listeners to players for `killed` (on successful player kills of eligible targets).
- No static tags are added or removed from the entity.
- Dependencies on other components: none explicitly declared on `self.inst`, but uses `TUNING.KRAMPUS_*` values.

## Properties
| Property | Type | Default Value | Description |
|---------|------|---------------|-------------|
| `inst` | `Entity` | `inst` (constructor argument) | Reference to the root entity this component is attached to (typically the world root). |
| `_activeplayers` | `table` | `{}` (empty) | Private table mapping player entities to per-player naughtiness state data. |

*Note: `_activeplayers` is not public but is the central data store; no other public instance variables are exposed.*

## Main Functions

### `DoWarningSound(player)`
* **Description:** Schedules a warning sound/spawn effect for the player when their naughtiness is close to exceeding the threshold (score < 20). The warning level (1–3) depends on how close the player is to threshold.  
* **Parameters:**
  * `player` (`Entity`): The player to warn.

### `OnUpdate(dt)`
* **Description:** Called periodically; decrements naughtiness decay timer and reduces action count by 1 whenever decay timer completes. This implements the gradual reduction of naughtiness over time.  
* **Parameters:**
  * `dt` (`number`): Delta time since last update.

### `GetDebugString()`
* **Description:** Returns a multi-line debug string summarizing naughtiness state (actions, threshold, decay timer) for each active player. Used in debug overlays.  
* **Returns:** `string` — Debug information per player.

## Events & Listeners

- **Listens to:**
  - `ms_playerjoined` → `OnPlayerJoined`  
  - `ms_playerleft` → `OnPlayerLeft`  
  - `ms_forcenaughtiness` → `OnForceNaughtiness`  
  - `killed` (on individual players) → `OnKilledOther`  

- **Triggers:**
  - Spawns `"krampus"` prefab via `SpawnPrefab("krampus")` when thresholds are exceeded or forced.
  - Spawns `"krampuswarning_lvl1"`, `"krampuswarning_lvl2"`, or `"krampuswarning_lvl3"` prefabs near the player (as visual/audio warnings) when approaching threshold.  
  *(Note: The component itself does not push formal events; it triggers entity spawning and internal function calls.)*