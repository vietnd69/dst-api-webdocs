---
id: babybeefalobrain
title: Babybeefalobrain
description: Controls the AI decision-making behavior of baby beefalos using a behavior tree to prioritize panic, fleeing, following, and wandering actions.
tags: [ai, brain, locomotion, beast]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 85c37c93
system_scope: brain
---

# Babybeefalobrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BabyBeefaloBrain` is an AI brain component for baby beefalo entities. It implements behavior prioritization via a behavior tree (`BT`), delegating to common DST behaviors such as `Panic`, `RunAway`, `Follow`, and `Wander`. It integrates with the `follower`, `rider`, and `knownlocations` components to determine appropriate responses to environmental and social stimuli, such as leaders, mounted characters, and herd locations.

This brain does not define custom logic beyond configuring the behavior tree root node — all behavior logic is encapsulated in external behavior classes (e.g., `RunAway`, `Follow`) and trigger helpers from `BrainCommon`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("babybeefalobrain")
-- The brain is automatically initialized when the entity is spawned
-- and will begin selecting behaviors via its behavior tree.
```

## Dependencies & tags
**Components used:**  
`follower`, `rider`, `knownlocations`  
**Tags:**  
Checks `beefalo` (on mount candidate), `character` (on target for `RunAway`).  
No tags are added or removed by this brain itself.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. Called automatically when the brain component starts (e.g., on entity spawn or brain activation). Constructs a priority-based `PriorityNode` that evaluates behaviors in the order: panic triggers → fleeing → following → wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Fails silently if any required component (`follower`, `rider`, `knownlocations`) is missing — leading to incomplete or non-functional behavior (e.g., `nil` leader, unreachable herd location).

## Events & listeners
This brain does not register event listeners or push custom events. It relies entirely on the underlying `BT` (behavior tree) infrastructure and external behavior classes for reactive updates.
