---
id: ghostbrain
title: Ghostbrain
description: Manages the behavior tree for ghost entities, handling targeting of living characters and switching between following and wandering states.
tags: [ai, brain, combat, locomotion, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 40303f08
system_scope: brain
---

# Ghostbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ghostbrain` is a brain component that implements AI behavior for ghost entities in the game. It uses a behavior tree to prioritize following a valid living character within range, or wandering and eventually dissipating if no suitable target is found. It depends on the `health` and `combat` components to validate and interact with potential targets.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("health")
inst:AddComponent("combat")
inst:AddBrain("ghostbrain")
inst:AddTag("ghost")
inst:PushEvent("spawn")
```

## Dependencies & tags
**Components used:** `health`, `combat`  
**Tags checked:** `character`, `INLIMBO`, `noauradamage`, `ghostlyfriend`, `abigail`  
**Tags added/removed:** None identified  

## Properties
No public properties

## Main functions
### `GetFollowTarget(ghost)`
* **Description:** Searches for and returns a valid target for the ghost to follow. Clears the cached `followtarget` if it becomes invalid or out of range, then scans nearby entities for living characters.
* **Parameters:** `ghost` (Entity instance) — the ghost entity whose brain owns this function.
* **Returns:** The valid target entity (with required tags and alive status), or `nil` if no suitable target is found.
* **Error states:** Returns `nil` if no entities match the criteria, or if all matching entities are ghost-friendly and not actively targeting the ghost.

### `OnStart()`
* **Description:** Initializes the behavior tree for the ghost, setting up a priority node that first attempts to follow a target within range, or falls back to wandering and eventually triggers the `dissipate` state.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
