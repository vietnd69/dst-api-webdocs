---
id: hostedbrain
title: Hostedbrain
description: Manages AI behavior for shadow thrall parasite hosts, coordinating coordinated attacks, formation positioning, and leash tracking using a behavior tree.
tags: [ai, combat, boss, parasite, formation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: b2631255
system_scope: brain
---

# Hostedbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HostedBrain` implements AI logic for hosted parasite entities (e.g., spiders acting as parasite hosts). It coordinates a formation-based attack pattern where multiple parasites coordinate targeting, prioritize synchronized attacks, and maintain distance from their target. It uses the behavior tree system and depends on the `combat` component to manage targeting and sharing of threats. The brain ensures only a limited number of parasites attack simultaneously to avoid overwhelming damage, while other members circle into position.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddBrain("hostedbrain")
```

## Dependencies & tags
**Components used:** `combat`
**Tags:** Checks for `shadowthrall_parasite_hosted`, avoids entities with `FX`, `NOCLICK`, `DECOR`, `INLIMBO`.

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree and registers event listeners for `attacked` and `onremove` events. Adds the entity to the global `PARASITES` set for coordination tracking.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Skips registration if the entity is no longer in `Ents` (e.g., if called while in inventory).

### `OnStop()`
*   **Description:** Cleans up state by removing the entity from `PARASITES`, clearing `reserved_target`, and unregistering event listeners.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` - triggers target suggestion and sharing of the attacker.
- **Listens to:** `onremove` - removes the entity from the `PARASITES` tracking table.
- **Pushes:** None.
