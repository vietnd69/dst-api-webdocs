---
id: chesterbrain
title: Chesterbrain
description: Controls the AI behavior of Chester, the treasure-hunting monster, managing navigation, panic responses, and interaction with its leader entity.
tags: [ai, boss, navigation, panic]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d225140a
system_scope: brain
---

# Chesterbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ChesterBrain` implements the behavior tree for Chester, a boss entity that follows a designated leader (typically a player). It integrates common brain utilities (e.g., panic triggers), movement behaviors (`Follow`, `Wander`), and orientation (`FaceEntity`) to create responsive AI. It relies on the `follower` component to identify the leader and the `knownlocations` component to access the "home" location for wandering.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower") -- Required for leader tracking
inst:AddComponent("knownlocations") -- Required for "home" location
inst.brain = ChesterBrain(inst)
inst.brain:OnStart() -- Initialize behavior tree
```

## Dependencies & tags
**Components used:** `follower`, `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree (`BT`) by constructing a priority node hierarchy. This defines the priority-ordered tasks Chester performs: panic responses, following the leader, facing the leader, and wandering near "home".
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Requires the `follower` and `knownlocations` components to be attached to `self.inst`; missing components may cause runtime errors when behaviors attempt to access them.

## Events & listeners
None identified.
