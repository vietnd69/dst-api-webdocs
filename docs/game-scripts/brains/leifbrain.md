---
id: leifbrain
title: Leifbrain
description: Implements the behavior tree for Leif, prioritizing wall attacks over chasing/attacking targets and wandering when no threat or target is present.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 45fb82e4
---

# Leifbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines the behavior tree logic for the Leif entity. It inherits from `Brain` and constructs a priority-based behavior tree during `OnStart`. The tree selects behaviors in the following order of precedence: `AttackWall`, `ChaseAndAttack`, and `Wander`. This ensures Leif prioritizes damaging walls (e.g., during boss encounters) before targeting players or creatures, and defaults to wandering when no actionable target is available.

## Dependencies & Tags
- **Components used:** None identified.
- **Tags:** None identified.

## Properties
No public properties are initialized or documented in the constructor.

## Main Functions
### `LeifBrain:OnStart()`
* **Description:** Initializes the behavior tree for Leif by constructing a priority node. It sets up the root behavior sequence using `AttackWall`, `ChaseAndAttack`, and `Wander` in descending priority order. Assigns the resulting tree to `self.bt`.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None.

---