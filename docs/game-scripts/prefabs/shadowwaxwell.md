---
id: shadowwaxwell
title: Shadowwaxwell
description: Defines Shadow Waxwell minion prefabs, including combat, resource, and special variants along with spawning and despawn logic.
tags: [prefabs, minions, shadow, ai]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 0ce6a267
system_scope: entity
---

# Shadowwaxwell

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`shadowwaxwell.lua` registers the suite of prefabs used for Shadow Waxwell's summoned minions. It includes combat-oriented variants (Protector, Duelist), resource-gathering variants (Worker, Lumber, Miner, Digger), and special event variants (Dancer). The file handles entity initialization, component configuration, AI brain assignment, and lifecycle management such as oblivion seeking and despawn effects. It also defines helper builder prefabs for spawning minions via the `petleash` component.

## Usage example
```lua
-- Spawn a shadow protector minion
local protector = SpawnPrefab("shadowprotector")

-- Spawn a shadow worker minion
local worker = SpawnPrefab("shadowworker")

-- Spawn the despawn FX
local fx = SpawnPrefab("shadow_despawn")

-- Summon a minion via a builder (typically handled by petleash)
local builder = SpawnPrefab("shadowlumber_builder")
builder.pettype = "shadowlumber"
builder.OnBuiltFn(builder, player_inst)
```

## Dependencies & tags
**External dependencies:**
- `brains/shadowwaxwellbrain` -- assigns behavior tree to minions

**Components used:**
- `skinner` -- sets up non-player skin data
- `locomotor` -- configures movement speed and creep interaction
- `health` -- manages health, invincibility, and damage clamping
- `combat` -- handles targeting, damage, and attack periods
- `follower` -- manages leader attachment and leashing
- `timer` -- controls oblivion countdown
- `knownlocations` -- remembers spawn points
- `entitytracker` -- tracks spawn platforms
- `inventory` -- added to workers for tool holding
- `lootdropper` -- spawns loot on despawn if pet
- `petleash` -- used by builder prefabs to spawn minions

**Tags:**
- `shadowminion` -- added to all minion variants
- `scarytoprey` -- added to minions to affect prey behavior
- `NOBLOCK` -- prevents minions from blocking movement
- `FX` -- added to ripple and despawn effects
- `NOCLICK` -- prevents interaction with FX entities
- `CLASSIFIED` -- added to builder prefabs to hide them

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isprotector` | boolean | `false` | True if the instance is a shadow protector variant. |
| `despawnpetloot` | boolean | `false` | If true, drops loot when despawned as a pet. |
| `ripple_pool` | table | `{}` | Pool of ripple FX entities for movement effects. |
| `pettype` | string | `nil` | Prefab name of the minion to spawn (builder only). |
| `OnBuiltFn` | function | `nil` | Function called when builder is placed (builder only). |

## Main functions
### `MakeMinion(prefab, tool, hat, master_postinit)`
*   **Description:** Factory function that creates a Shadow Waxwell minion prefab. Configures assets, components, and behavior based on arguments.
*   **Parameters:**
    - `prefab` -- string name of the prefab to create
    - `tool` -- string or table of animation tool names (e.g., "swap_axe")
    - `hat` -- string animation hat name or nil
    - `master_postinit` -- function called after master initialization
*   **Returns:** Prefab object.
*   **Error states:** None

### `MakeBuilder(prefab)`
*   **Description:** Creates a helper builder prefab that spawns a specific minion type when built by a player with `petleash`.
*   **Parameters:** `prefab` -- string name of the minion prefab to spawn.
*   **Returns:** Prefab object for the builder (name appended with `_builder`).
*   **Error states:** None

### `protectorfn(inst)`
*   **Description:** Configures a minion instance as a Protector. Sets health clamping, combat retargeting near spawn point, and engagement listeners.
*   **Parameters:** `inst` -- entity instance.
*   **Returns:** None
*   **Error states:** Errors if `inst` lacks `health`, `combat`, or `follower` components (expected to be added prior in `MakeMinion`).

### `workerfn(inst)`
*   **Description:** Configures a minion instance as a Worker. Adds inventory component for tool holding and sets oblivion timer.
*   **Parameters:** `inst` -- entity instance.
*   **Returns:** None
*   **Error states:** Errors if `inst` lacks `inventory` or `combat` components.

### `dancerfn(inst)`
*   **Description:** Configures a minion instance as a Dancer. Disables combat target retention.
*   **Parameters:** `inst` -- entity instance.
*   **Returns:** None
*   **Error states:** Errors if `inst` lacks `combat` component.

### `SaveSpawnPoint(inst, dont_overwrite)`
*   **Description:** Records the current position or platform as the minion's spawn point.
*   **Parameters:**
    - `inst` -- entity instance
    - `dont_overwrite` -- boolean to prevent overwriting existing location
*   **Returns:** None
*   **Error states:** Errors if `inst` lacks `knownlocations` or `entitytracker` components.

### `GetSpawnPoint(inst)`
*   **Description:** Retrieves the recorded spawn point position, accounting for platform offsets.
*   **Parameters:** `inst` -- entity instance.
*   **Returns:** `Vector3` position or `nil`.
*   **Error states:** Errors if `inst` lacks `knownlocations` or `entitytracker` components.

## Events & listeners
- **Listens to:** `attacked` -- triggers retaliation or pet despawn logic.
- **Listens to:** `seekoblivion` -- initiates despawn sequence.
- **Listens to:** `death` -- drops aggro on leader.
- **Listens to:** `dancingplayerdata` -- updates dance state from world.
- **Listens to:** `timerdone` -- handles oblivion timer expiry.
- **Listens to:** `newcombattarget` -- starts health clamp engagement logic (Protector).
- **Listens to:** `droppedtarget` -- resets health clamp disengagement logic (Protector).
- **Listens to:** `animover` -- removes FX entities after animation completes.
- **Pushes:** `transfercombattarget` -- fired when leader is invalid to drop current target.