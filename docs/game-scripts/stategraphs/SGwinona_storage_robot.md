---
id: SGwinona_storage_robot
title: Sgwinona Storage Robot
description: Manages the state machine behavior of Winona’s storage robot, handling movement, power management, pickup/store actions, and sound transitions.
tags: [ai, locomotion, inventory, sound, power]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 3fae7dd8
system_scope: ai
---

# Sgwinona Storage Robot

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGwinona_storage_robot` defines the state graph for Winona’s storage robot, controlling its core behaviors: idle operation, power-on/power-off sequences, pickup, and storing items. It integrates with the `locomotor`, `fueled`, and `inventory` components to manage movement, fuel-based activation, and container interactions. The state graph is initialized with custom action handlers (`PICKUP`, `STORE`) and sound logic that dynamically manages idle/run loop playback.

## Usage example
```lua
local robot = Prefab("winona_storage_robot")
-- ... setup entity, add components ...
robot:AddStateGraph("winona_storage_robot")
-- The stategraph is automatically started by the engine upon entity spawn,
-- beginning in the "poweron" state, then transitioning to "idle".
```

## Dependencies & tags
**Components used:** `fueled`, `inventory`, `locomotor`  
**Tags:** State-specific tags: `idle`, `canrotate`, `busy`, `jumping`.  
**Action handlers used:** `ACTIONS.PICKUP`, `ACTIONS.STORE`.

## Properties
No public properties. This is a StateGraph definition, not a component with instance variables.

## Main functions
Not applicable — this file defines a stategraph, not a component with public methods.

## Events & listeners
- **Listens to:**  
  - `onfueldsectionchanged` — triggers transition to `"poweroff"` if fuel is empty and robot is not busy.  
  - `sleepmode` — triggers `"poweroff"` if not busy; otherwise queues sleep with `wantstosleep` flag.  
  - `animover` (state-specific) — handled in `"poweroff"`, `"pickup"`, and `"store"` states to detect animation completion and trigger state transitions.

- **Pushes:**  
  - `locomote` — fired by `LocoMotor:Stop()` calls during state transitions (`onenter` of several states).
  - `onDeactivateRobot` — triggered via `inst:OnDeactivateRobot()` after `"poweroff"` animation completes.

