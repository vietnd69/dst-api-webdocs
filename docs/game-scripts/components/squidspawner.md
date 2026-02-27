---
id: squidspawner
title: Squidspawner
description: Manages scheduled spawning of squid herds during nighttime and dusk phases based on player positions, fish proximity, and moon phase.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 776f8d45
---

# Squidspawner

## Overview
This component orchestrates the spawning of squid herds in response to world state (night/dusk, moon phase), player activity, and environmental factors like nearby fish and ocean trawlers. It runs exclusively on the master simulation and uses a recurring task to periodically evaluate potential spawn locations around active players. Spawning logic respects tunable probabilities, cooldowns, and spatial constraints (e.g., minimum fish count, avoidance of trawler zones).

## Dependencies & Tags
- **World Dependency:** Requires `TheWorld.ismastersim` (asserted on construction).
- **Tags Observed:** Uses `"squid"`, `"oceanfish"`, `"oceanfishable"`, and `"oceantrawler"` via `TheSim:FindEntities` for proximity checks.
- **No components added** to the owning entity (`inst`) — this is a functional component without `inst:AddComponent`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity to which this component is attached (typically the world root). |
| `_activeplayers` | `table[]` | `{}` | Private list of active players currently in the world. Populated at startup and updated via `ms_playerjoined`/`ms_playerleft` events. |
| `_worldstate` | `WorldState` | `TheWorld.state` | Private reference to the current world state (e.g., `isday`, `isnight`, `moonphase`). |

*Note:* No public properties beyond `inst` are exposed; `_activeplayers` and `_worldstate` are private.

## Main Functions

### `testforsquid(forcesquid)`
* **Description:** Evaluates spawning conditions for squid herds. Iterates over active players, checks squid/fish counts and ocean trawler proximity within a radius, computes a dynamic spawn chance influenced by moon phase and time of day, and attempts to spawn a squid herd if conditions are met.
* **Parameters:**  
  - `forcesquid` (boolean): If true, bypasses time-of-day checks and forces evaluation/spawning regardless of day/night.

### `GetOceanTrawlerChanceModifier(spawnpoint)`
* **Description:** Locates nearby ocean trawlers and returns their spawn chance modifier (from `Oceantrawler:GetOceanTrawlerSpawnChanceModifier`) if found; otherwise, returns `1` (neutral modifier).
* **Parameters:**  
  - `spawnpoint` (`Vector3`): The position to test for ocean trawler proximity.

### `do_squid_spawn_for_herd(herd, spawnpoint)`
* **Description:** Spawns a single squid at the specified position, registers it with the given herd, and sets its position.
* **Parameters:**  
  - `herd` (`Entity`): The `squidherd` entity to which the spawned squid will be added.  
  - `spawnpoint` (`Vector3`): The target world position for the new squid.

### `spawntask()`
* **Description:** The main scheduling function. Triggers `testforsquid()` during night or dusk. Reschedules itself using `TUNING.SEG_TIME + random delta` to create recurring spawn windows; cancels tasks during day.
* **Parameters:** None (attached to `inst` as `inst.spawntask`).

### `self:Debug_ForceTestForSquid()`
* **Description:** Public debug helper to force-override the time-of-day check in `testforsquid`, enabling manual squid spawning for testing.
* **Parameters:** None.

## Events & Listeners
- **Listens to `ms_playerjoined`** (via `TheWorld`): Calls `OnPlayerJoined` to add the new player to `_activeplayers`.
- **Listens to `ms_playerleft`** (via `TheWorld`): Calls `OnPlayerLeft` to remove the player from `_activeplayers`.
- **Watches `"phase"` world state**: Triggers `spawntask()` when the world phase (e.g., day, dusk, night) changes to re-evaluate scheduling.