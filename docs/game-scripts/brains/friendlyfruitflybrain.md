---
id: friendlyfruitflybrain
title: Friendlyfruitflybrain
description: Controls the AI behavior of friendly fruit fly entities, managing tasks like following a leader, wandering, and interacting with farm plants.
tags: [ai, locomotion, behavior, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 231d928d
system_scope: brain
---

# Friendlyfruitflybrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FriendlyFruitFlyBrain` defines the behavior tree for friendly fruit fly entities. It inherits from `Brain` and orchestrates high-level behaviors such as following a leader (via the `follower` component), wandering within a radius, facing the leader, and seeking out farm plants to interact with. It relies on reusable behavior nodes from `behaviours/` and common AI utilities from `brains/braincommon.lua`.

## Usage example
```lua
local inst = CreateEntity()
-- Ensure 'follower' component is present for leader tracking
inst:AddComponent("follower")
inst:AddBrain("friendlyfruitflybrain")
```

## Dependencies & tags
**Components used:** `follower`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root node, defining the priority-ordered behavior sequence for the entity.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May behave unpredictably if required components (e.g., `follower`) are absent; `GetLeader()` returns `nil` in such cases, causing fallback behavior.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
