---
id: archive_securitypulsebrain
title: Archive Securitypulsebrain
description: Controls AI behavior for archive security pulse entities, managing patrol movement toward power points and sequential waypoints.
tags: [ai, patrol, boss, environment, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: brain
source_hash: 3bfd00dc
system_scope: brain
---

# Archive Securitypulsebrain

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Archive_SecurityPulseBrain` is a behavior tree–based AI controller for archive security pulse entities in DST. It dictates patrol-style movement behavior, prioritizing movement toward functional power points within range, and falling back to sequential waypoint traversal when no valid power points exist. It relies on behavior nodes (`Follow`, `StandStill`, `WhileNode`) and uses custom helper functions (`findwaypoint`, `FindPowerPoint`) to guide entity locomotion. The brain integrates with the `health` component via `GetPercent()` to validate power point integrity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("health")
inst.components.brain:SetBrainClass("archive_securitypulsebrain")
inst.possession_range = 15
inst.patrol = true
```

## Dependencies & tags
**Components used:** `health` (via `FindPowerPoint` → `ent.components.health:GetPercent()`)  
**Tags:** Reads `security_powerpoint` and `archive_waypoint` tags on target entities; excludes entities with `INLIMBO` or `FX` tags during power point search.

## Properties
No public properties

## Main functions
This component does not expose any public functions beyond inherited `Brain` methods. Core logic resides in the constructor and `OnStart()` method.

## Events & listeners
This component does not register or fire any custom events.
