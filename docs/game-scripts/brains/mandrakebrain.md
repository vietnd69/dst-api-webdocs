---
id: mandrakebrain
title: Mandrakebrain
description: Defines the behavior tree for a mandrake entity, managing its panic responses, following behavior, and movement patterns.
tags: [ai, brain, movement]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: ba9cf6b0
system_scope: brain
---

# Mandrakebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MandrakeBrain` is the behavior tree definition for the mandrake entity. It implements a priority-based behavior tree that handles panic responses (e.g., from fire or electric fences), follows its leader when present, maintains proper orientation toward the leader, and defaults to wandering when neither panic nor leader presence demands action. It relies on external behavior modules (`Follow`, `Wander`) and common brain utilities (`BrainCommon`) to compose its logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrain("mandrakebrain")
-- Additional setup (e.g., adding follower component) must occur before brain activation
```

## Dependencies & tags
**Components used:** `follower`
**Tags:** None identified.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes the mandrake's behavior tree root node with a prioritized sequence of behaviors. It sets up the internal `self.bt` behavior tree instance.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not return errors; relies on `BrainCommon` and behavior module functions to construct valid nodes.

## Events & listeners
None identified.
