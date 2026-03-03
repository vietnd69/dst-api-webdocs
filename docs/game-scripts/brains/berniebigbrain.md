---
id: berniebigbrain
title: Berniebigbrain
description: Manages AI behavior for Bernie the bee, including leader following, combat targeting, and activation/deactivation logic.
tags: [ai, brain, combat, follow]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 23be2eca
system_scope: brain
---

# Berniebigbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BernieBigBrain` is an AI behavior tree implementation that controls Bernie (a bee companion) in DST. It dynamically selects a leader from eligible players (`bernieowner` tag) based on sanity thresholds, hot-headedness, or being "crazy" (e.g., under lunacy effects). It prioritizes combat when a valid target exists, otherwise follows the leader using walk/run logic depending on proximity, and deactivates when inactive for a period or after shrinking.

The component interacts with the `combat` component to track targets and combat timing, and uses `sanity:GetPercent()` to assess player sanity for leader selection.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain = require("brains/berniebigbrain")(inst)
inst:AddTag("bernieowner") -- for leader registration, though Bernie is the dependent entity
inst:ListenForEvent("onLeaderChanged", function(inst, data) print("New leader:", data.leader and data.leader:GetDebugName()) end)
```

## Dependencies & tags
**Components used:** `combat`, `sanity`  
**Tags:** Checks `bernieowner` on players; sets `running` state tag based on follow mode.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_leader` | `Entity?` | `nil` | The current leader entity (a player with `bernieowner` tag). |
| `_isincombat` | `boolean` | `false` | Whether Bernie is currently in combat mode. |

## Main functions
### `OnStart()`
* **Description:** Initializes and attaches the behavior tree. Registers an event listener for `onremove` to clear leader references. Constructs a priority-based behavior tree with states for deactivation, combat, walking/running follow, face leader, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStop()`
* **Description:** Cleans up event listeners and clears the leader reference when the AI is stopped (e.g., on entity removal or brain replacement).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` – triggers `SetLeader(self, nil)` to unregister from the leader's bigbernies collection.
- **Pushes:**  
  - `onLeaderChanged` – fired internally via `self.inst:onLeaderChanged(leader)` when the leader is set (non-`nil` only).
