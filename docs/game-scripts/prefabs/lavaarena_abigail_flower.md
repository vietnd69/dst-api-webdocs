---
id: lavaarena_abigail_flower
title: Lavaarena Abigail Flower
description: A non-interactive visual prop used exclusively during the Lava Arena event to represent Abigail's presence.
tags: [event, visual, environment, lavaarena]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a7bb0034
system_scope: environment
---

# Lavaarena Abigail Flower

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_abigail_flower` is a non-functional prefab asset that serves purely as a visual and atmospheric element during the Lava Arena event. It displays an animated flower model associated with Abigail, but contains no components, logic, or behavior beyond basic rendering. It is instantiated as a static visual prop in the world and is not involved in gameplay mechanics or AI.

## Usage example
```lua
-- This prefab is instantiated automatically by the event system; manual usage is not intended.
-- Example of spawning it in a custom map (not recommended outside event logic):
local flower = SpawnPrefab("lavaarena_abigail_flower")
flower.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `soundemitter`, `network`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
Not applicable. This is a simple prefab definition, not a component. It has no executable functions beyond the default `fn()` constructor.

## Events & listeners
Not applicable.