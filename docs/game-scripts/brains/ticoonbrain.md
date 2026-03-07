---
id: ticoonbrain
title: Ticoonbrain
description: AI brain that controls a leader-following quest-related mob (Ticoon) during tracking sequences, coordinating wander, follow, and quest completion behaviors.
tags: [ai, quest, follow, tracking, boss]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 40987e47
---

# Ticoonbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `ticoonbrain` component implements the behavior tree (BT) for a quest-driven entity—commonly known as a "Ticoon"—that tracks a specific target entity named `"tracking"` via the `entitytracker` component. It manages three primary modes:  
- **Quest tracking phase**: When `questing` is `true`, the Ticoon searches for and approaches a tracked entity, emits a "Get Attention" event, and completes the quest upon arrival.  
- **Normal follow mode**: Outside of quests, the entity follows its leader within configurable distances and maintains orientation toward the leader.  
- **Emergency panic responses**: Includes standard panic triggers (e.g., fire, electricity) and escape/avoid behavior.

This brain tightly integrates with the `follower`, `entitytracker`, and `questowner` components to synchronize movement and quest progress with the game’s questing system.

## Usage example

```lua
local inst = Entity()
inst:AddComponent("follower")
inst:AddComponent("entitytracker")
inst:AddComponent("questowner")

inst:AddBrain("ticoonbrain")

-- Set up tracking target
local target = GetWorld():FindEntityByPrefab("kitcoon")
inst.components.entitytracker:AddEntity("tracking", target)
inst.components.questowner.questing = true

-- Trigger quest completion when Ticoon arrives
inst.components.questowner.on_complete_quest = function(qinst)
    print("Quest completed: Ticoon has arrived.")
end
```

## Dependencies & tags

**Components used:**
- `follower`: accessed via `inst.components.follower:GetLeader()`
- `entitytracker`: accessed via `inst.components.entitytracker:GetEntity("tracking")`
- `questowner`: accessed via `inst.components.questowner.questing` and `inst.components.questowner:CompleteQuest()`

**Tags:** None explicitly added, removed, or checked by this brain.

## Properties

No public instance properties are defined or initialized in the constructor. All configuration is inlined as local constants and function closures.

## Main functions

### `TicoonBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Sets up priority-based state handling for panic, tracking, following, and idle behaviors. The tree prioritizes urgent actions (panic, chase) first and defaults to following and facing the leader.
* **Parameters:** None (method of `TicoonBrain` class).
* **Returns:** None. Assigns `self.bt = BT(self.inst, root)` where `root` is the constructed `PriorityNode`.
* **Error states:** None known; assumes `inst.components` for `follower`, `entitytracker`, and `questowner` exist.

### Helper Functions (Internal)
The following local functions are used internally by the behavior tree:

#### `GetLeader(inst)`
* **Description:** Returns the leader entity via `follower:GetLeader()` if the component exists; otherwise `nil`.
* **Parameters:** `inst` — The entity instance (usually `self.inst`).
* **Returns:** Entity or `nil`.

#### `GetTrackingTarget(inst)`
* **Description:** Returns the tracked entity registered under `"tracking"` via `entitytracker:GetEntity("tracking")`.
* **Parameters:** `inst` — The entity instance.
* **Returns:** Entity or `nil`.

#### `GoToTrackingTarget(inst)`
* **Description:** Returns a buffered `WALKTO` action toward the tracked entity’s position if the tracking entity exists.
* **Parameters:** `inst` — The entity instance.
* **Returns:** An action object or `nil`.

#### `WaitForLeader(inst)`
* **Description:** Returns `true` if no leader is present, or if the leader is farther than `TRACKING_LEADER_START_WAITING_DIST` (6 units). Used to determine when the Ticoon should wait instead of wandering.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `boolean`.

#### `GetLeaderPos(inst)`
* **Description:** Returns the leader’s position if a leader exists; otherwise `nil`.
* **Parameters:** `inst` — The entity instance.
* **Returns:** Vector position (`x,y,z`) or `nil`.

#### `GetTrackingPos(inst)`
* **Description:** Returns the position of the `"tracking"` entity if available; otherwise `nil`.
* **Parameters:** `inst` — The entity instance.
* **Returns:** Vector position (`x,y,z`) or `nil`.

#### `KeepFaceTargetFn(inst, target)`
* **Description:** Used by `FaceEntity` behavior. Returns `true` only if the given `target` matches the current leader, ensuring the Ticoon only faces its leader (not random entities).
* **Parameters:**  
  - `inst`: The entity instance.  
  - `target`: Candidate target entity.
* **Returns:** `boolean`.

## Events & listeners

- **Listens to:**  
  This component does not register any event listeners directly (no `inst:ListenForEvent` calls appear in the file).

- **Pushes:**  
  - `"ticoon_getattention"` — Pushed when the Ticoon completes its search subsequence and seeks attention before proceeding to the tracking target.

- **Notes:**  
  The brain triggers quest completion logic via `questowner:CompleteQuest()`, which itself fires any registered `on_complete_quest` handler. This event is not pushed by the brain itself but by the `questowner` component.