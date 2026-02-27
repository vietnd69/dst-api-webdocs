---
id: antlionbrain
title: Antlionbrain
description: Implements the behavior tree logic for the antlion entity, managing attack behavior, rock-eating recovery, and post-combat cooldowns.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 5d485f9a
---

# Antlionbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`AntlionBrain` is a behavior tree-based brain component for the antlion entity. It orchestrates high-priority rock-eating during healing, fallback low-priority rock-eating, combat engagement via `StandAndAttack`, and a post-combat cooldown sequence. It relies on the `combat`, `health`, and `worldsettingstimer` components to make decisions and control behavior timing.

## Dependencies & Tags
- **Components used:**
  - `health` (`IsHurt()`)
  - `combat` (`GetLastAttackedTime()`, `SetAttackPeriod()`)
  - `worldsettingstimer` (`ActiveTimerExists("wall_cd")`)
- **Tags:** None identified.

## Properties
No public properties are defined in the constructor. The component initializes only the behavior tree internally via `self.bt`.

## Main Functions
### `AntlionBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Constructs a priority-based behavior sequence: highest priority is rock-eating under specific high-need conditions, followed by `StandAndAttack`, then low-priority rock-eating, and finally a post-combat cooldown sequence that resets attack period and pauses combat.
* **Parameters:** None.
* **Returns:** None.

### `ShouldEatRocksHighPrio(inst)`
* **Description:** Returns `true` if the antlion should eat rocks with high priority — i.e., it is hurt *and* the `"wall_cd"` timer is active *and* the last attack occurred more than 6 seconds ago (suggesting the antlion is behind cover and safe to eat).
* **Parameters:** `inst` — the entity instance.
* **Returns:** `boolean`.

### `ShouldEatRocksLowPrio(inst)`
* **Description:** Returns `true` if the antlion should eat rocks with low priority — i.e., it is hurt but does not meet the stricter high-priority conditions.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `boolean`.

## Events & Listeners
- **Listens to:** None.
- **Pushes:**
  - `"eatrocks"` — when rock-eating actions are triggered.
  - `"antlionstopfighting"` — at the end of the post-combat cooldown sequence.