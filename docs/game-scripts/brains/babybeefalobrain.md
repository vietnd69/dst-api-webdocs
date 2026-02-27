---
id: babybeefalobrain
title: Babybeefalobrain
description: Defines the behavior tree for a baby beefalo entity, governing its movement and decision-making logic including fleeing, following its leader, and wandering within its herd.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 85c37c93
---

# Babybeefalobrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`BabyBeefaloBrain` is a brain component that implements the decision-making logic for baby beefalo entities. It constructs a priority-based behavior tree (`BT`) with ordered behavior nodes: `PanicTrigger`, `ElectricFencePanicTrigger`, `RunAway`, `Follow`, and `Wander`. The brain prioritizes escaping threats (such as electric fences or characters) over following the herd leader and wandering when no immediate danger exists. It relies on the `follower`, `knownlocations`, and `rider` components to determine valid targets and terrain constraints.

## Dependencies & Tags
- **Components used:**
  - `follower` — used via `self.inst.components.follower:GetLeader()`
  - `knownlocations` — used via `self.inst.components.knownlocations:GetLocation("herd")`
  - `rider` — used via `other.components.rider:GetMount()`
- **Tags:** None added, removed, or directly checked by this brain itself. The behavior functions (`RunAway`, `Follow`, `Wander`) utilize tags internally (e.g., `tags={"character"}` in `RunAway`), but this component does not manipulate tags on `self.inst`.

## Properties
No explicit properties are defined as public variables in the constructor. All configuration is provided as local constants at module scope.

## Main Functions
### `BabyBeefaloBrain:OnStart()`
* **Description:** Initializes and attaches the behavior tree (`self.bt`) for the baby beefalo. This method is called when the brain is first activated and begins processing behavior nodes in priority order.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
This component does not register or emit any events directly. It relies entirely on the behavior system (`behaviours/wander`, `behaviours/panic`, `behaviours/follow`, `behaviours/runaway`) to handle internal event interactions (e.g., triggering panic or movement completion).