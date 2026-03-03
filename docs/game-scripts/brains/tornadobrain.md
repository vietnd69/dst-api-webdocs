---
id: tornadobrain
title: Tornadobrain
description: Implements decision-making logic for a tornado entity, directing it to move toward or wander near a target location.
tags: [ai, movement, weather]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 11c7cb9b
system_scope: brain
---

# Tornadobrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Tornadobrain` is a brain component responsible for controlling the movement behavior of a tornado entity. It uses a behavior tree with a priority node to select between two primary actions: leashing toward a known target location (via `knownlocations:GetLocation("target")`) or wandering in the vicinity of that target. The brain inherits from `Brain` and is constructed using standard DST ECS conventions (`Class(Brain, ...)`).

The component relies exclusively on the `knownlocations` component to resolve the "target" location and the `behaviours/leash` and `behaviours/wander` modules to execute movement logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("knownlocations")  -- required for location resolution
inst:AddComponent("tornadobrain")
-- The brain will automatically initialize on OnStart (typically called by SG or SG logic)
```

## Dependencies & tags
**Components used:** `knownlocations`  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable — the brain does not expose public methods beyond inherited `Brain` functionality.

## Events & listeners
Not applicable — this brain does not register or push any events directly.
