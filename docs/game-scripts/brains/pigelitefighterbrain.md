---
id: pigelitefighterbrain
title: Pigelitefighterbrain
description: AI brain that governs Pig King's elite fighter behavior, handling combat, leader following, panic states, and despawn logic via a behavior tree.
tags: [ai, combat, boss, pathfinding, panic]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: b2036563
---

# Pigelitefighterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Pigelitefighterbrain` is an AI brain component that controls the behavior of the Pig King's elite fighter. It uses a behavior tree (BT) to manage decision-making, integrating combat (`ChaseAndAttack`), following a leader, panic responses (from haunting or fire), avoidance of electric fences, and despawn logic. This brain inherits from `Brain` and overrides `OnStart()` to construct the behavior tree root node.

It depends on several components:
- `follower`: retrieves the leader entity via `GetLeader()` for proximity-based following.
- `hauntable`: checks `panic` status to trigger panicked behavior during hauntings.
- `health`: monitors `takingfiredamage` to initiate panic when on fire.

## Usage example
This brain is typically assigned to an entity during entity initialization via `inst:AddComponent("pigelitefighterbrain")`. It does not require manual function calls — it operates automatically by reacting to events and state changes.

```lua
inst:AddComponent("pigelitefighterbrain")
inst:AddComponent("follower")
inst:AddComponent("health")
inst:AddComponent("hauntable")
```

## Dependencies & tags
**Components used:** `follower`, `hauntable`, `health`
**Tags:** None identified (the brain itself does not add or remove tags; tag usage is internal to state graph interactions via `HasStateTag("jumping")`).

## Properties
The constructor does not define any instance-specific properties beyond the inherited `Brain` behavior. All state is managed internally through the behavior tree and local helper functions.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this brain controls (inherited from `Brain`). |
| `bt` | `BT` | `nil` (set in `OnStart`) | Behavior tree instance constructed during initialization. |

## Main functions

### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root. Constructs a priority-based tree with conditional branches for high-priority states (jumping, panic, fire, electric shock, despawn), followed by default combat and following behavior.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented; assumes all required components (`follower`, `hauntable`, `health`) are attached to `inst`.

## Events & listeners
- **Pushes:**
  - `"despawn"`: Fired in a loop when `_should_despawn` is true or when no leader is present and `GetLeader()` returns `nil`.

- **Listens to:** None (this component does not directly register event listeners; state changes are captured implicitly via `WhileNode` conditions polling component properties).