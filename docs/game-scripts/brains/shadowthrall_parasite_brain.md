---
id: shadowthrall_parasite_brain
title: Shadowthrall Parasite Brain
description: Controls AI behavior for the shadowthrall parasite entity, causing it to flee from players and shadow rifts and self-remove when no players are nearby.
tags: [ai, combat, boss, entity, network]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d1cce63d
---

# Shadowthrall Parasite Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavior tree for the shadowthrall parasite entity in Don't Starve Together. Its primary responsibility is to manage simple evasion logic: the parasite continuously moves away from nearby players or shadow rift portals, and automatically destroys itself if no players are within a given detection radius. It extends `Brain` and uses standard DST behavior tree patterns, incorporating the `RunAway` and `DoAction` behavior nodes to implement its logic. The component does not directly interact with other components but relies on global utility functions like `IsAnyPlayerInRange`, `FindClosestPlayerToInst`, and `TheSim:FindEntities`.

## Usage example

This component is not intended to be manually added or invoked by modders. It is automatically attached to the appropriate entity via the game’s prefab definition. A typical usage pattern inside the prefab file would look like:

```lua
inst:AddBrain("shadowthrall_parasite_brain")
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** `shadowrift_portal` (used in entity tag filtering via `TheSim:FindEntities`)

## Properties
No public properties are defined in the constructor or outside it. All state is managed through the behavior tree and local functions.

## Main functions
### `ShadowThrall_Parasite_Brain:OnStart()`
* **Description:** Initializes the entity’s behavior tree at brain startup. Sets up a priority node that evaluates two behaviors: first checking if the entity should be removed (via `TestForRemove`), and second, initiating flee movement toward a safe distance from the closest threat (via `RunAway`).
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented; assumes valid `inst` and proper behavior node definitions.

### `TestForRemove(inst)`
* **Description:** A standalone utility function used in the behavior tree. Checks whether any player is within the camera’s see distance (`PLAYER_CAMERA_SEE_DISTANCE`). If no players are nearby, it removes the entity from the world.
* **Parameters:** 
  * `inst` (Entity): The parasite entity being tested for removal.
* **Returns:** `nil`.
* **Error states:** May silently do nothing if the entity is not currently owned or its transform is invalid.

### `GetRunAwayTarget(inst)`
* **Description:** A standalone utility function used by the `RunAway` behavior to determine the nearest threat. It prioritizes a player if one is nearby (within `PLAYER_CAMERA_SEE_DISTANCE`), otherwise falls back to the first nearby shadow rift portal.
* **Parameters:** 
  * `inst` (Entity): The parasite entity requesting a target.
* **Returns:** Entity — the closest player or shadow rift portal, or `nil` if none found.
* **Error states:** May return `nil` if no players and no rift portals are found in the search radius.

## Events & listeners
None. This brain does not register or fire events. Behavior updates are driven by the behavior tree evaluation loop.

---