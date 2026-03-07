---
id: bee
title: Bee
description: Implements the core logic for bees in the game, including both worker bees (pollinators) and killer bees (aggressive defenders).
tags: [entity, combat, ai, pollination, flying]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dc3f7247
system_scope: entity
---

# Bee

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `bee.lua` prefab implements two distinct bee types — `bee` (worker) and `killerbee` (aggressive variant) — using shared initialization logic via `commonfn()`. Worker bees are passive pollinators that attack only during Spring, while killer bees are inherently aggressive and defend hives or themselves. The prefab integrates multiple components for flight physics, combat, inventory handling, sleep/wake cycles, and hauntable behavior, with state-specific behavior driven by state graphs and brains (`SGbee`, `beebrain`, and `killerbeebrain`).

## Usage example
```lua
-- Creating a worker bee
local worker = Prefab("bee")
SpawnPrefab("bee")

-- Creating a killer bee
local killer = SpawnPrefab("killerbee")

-- Direct access to component APIs on a spawned bee instance
local inst = SpawnPrefab("bee")
inst.components.health:SetMaxHealth(50)
inst.components.combat:SetDefaultDamage(10)
inst.components.combat:SetRange(2, 3)
```

## Dependencies & tags
**Components used:**  
`locomotor`, `stackable`, `inventoryitem`, `lootdropper`, `workable`, `health`, `combat`, `sleeper`, `knownlocations`, `inspectable`, `tradable`, `pollinator`, `hauntable`

**Tags added:**  
`bee`, `insect`, `smallcreature`, `cattoyairborne`, `flying`, `ignorewalkableplatformdrowning`, and either `worker`/`pollinator` or `killer`/`scarytoprey` depending on variant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `buzzing` | boolean | `true` | Controls whether the bee emits its flight buzzing sound. |
| `sounds` | table | `workersounds` or `killersounds` | Sound bank used for this bee instance. |
| `incineratesound` | string | `sounds.death` | Sound played when the bee is incinerated. |

## Main functions
### `EnableBuzz(enable)`
*   **Description:** Starts or stops the buzzing flight sound based on `enable` and current state (e.g., not held, not asleep). Called internally when the bee wakes/sleeps or is dropped/picked up.
*   **Parameters:** `enable` (boolean) – whether to enable or disable buzzing.
*   **Returns:** Nothing.
*   **Error states:** Only plays sound if not held, not asleep, and not already playing the buzz sound.

### `OnDropped(inst)`
*   **Description:** Handles logic when a bee stack is dropped. Detaches children (if any), resets the state graph, resets work state, and splits the stack by dropping each individual bee if stackable.
*   **Parameters:** `inst` (Entity) – the bee entity being dropped.
*   **Returns:** Nothing.

### `OnPickedUp(inst)`
*   **Description:** Handles logic when a bee is picked up. Cancels buzzing, resets state graph to `idle`, and stops all sounds.
*   **Parameters:** `inst` (Entity) – the bee entity being picked up.
*   **Returns:** Nothing.

### `OnWake(inst)`
*   **Description:** Resumes buzzing sound upon waking from sleep if buzzing was previously enabled.
*   **Parameters:** `inst` (Entity) – the waking bee entity.
*   **Returns:** Nothing.

### `OnSleep(inst)`
*   **Description:** Stops buzzing sound when the bee falls asleep.
*   **Parameters:** `inst` (Entity) – the sleeping bee entity.
*   **Returns:** Nothing.

### `KillerRetarget(inst)`
*   **Description:** Computes a target for killer bees using `FindEntity`. Filters for valid combat targets that are not immune (e.g., wormwood bugs) and meet required/forbidden tag conditions.
*   **Parameters:** `inst` (Entity) – the killer bee entity performing retargeting.
*   **Returns:** `Entity` or `nil` – the nearest valid target within combat range, or `nil`.
*   **Error states:** Returns `nil` if no suitable target exists.

### `SpringBeeRetarget(inst)`
*   **Description:** Computes a target for worker bees *only* during Spring (using `TheWorld.state.isspring`). Otherwise returns `nil`.
*   **Parameters:** `inst` (Entity) – the worker bee entity.
*   **Returns:** `Entity` or `nil` – nearest valid target during Spring, `nil` otherwise.

## Events & listeners
- **Listens to:**  
  `attacked` – triggers `beecommon.OnAttacked` to handle defensive responses (e.g., spawning killer bees).  
  `worked` – triggers `beecommon.OnWorked` for hive/beebox interactions.  
  `spawnedfromhaunt` – triggers `OnSpawnedFromHaunt` to force killer bee panic behavior.  
  `detachchild` – fires internally when a bee is removed from a stack/hive.

- **Pushes:**  
  `imagechange` – via `inventoryitem:ChangeImageName`.  
  `ondropped` – after drop physics.  
  `detachchild` – when a child bee is separated.