---
id: pigtorch_flame
title: Pigtorch Flame
description: A visual and audio FX entity representing a pigtorch flame, using layered animation levels and integrated fire effects.
tags: [fx, lighting, sound, animation, prefab]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d6ada0c3
system_scope: fx
---

# Pigtorch Flame

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pigtorch_flame` is a lightweight FX prefab that renders a dynamic campfire-style flame visual using layered animations and sound emissions. It is not a standalone component but a prefab that optionally integrates with the `firefx` component on the master simulation to manage visual levels and lighting properties. This entity is intended for use as a child object attached to the pigtorch item, providing visual feedback for its flame state.

## Usage example
The prefab is instantiated internally by the game when the pigtorch is equipped. Modders typically do not instantiate it directly, but if needed:
```lua
local inst = Prefab("pigtorch_flame")
inst.Transform:SetPosition(x, y, z)
-- The `firefx` component and `firelevels` are applied only on the master instance
```

## Dependencies & tags
**Components used:** `firefx` (added conditionally on master only)  
**Tags:** Adds `FX`  
**Prefabs referenced:** `firefx_light`

## Properties
No public properties are defined in this file. Visual/audio behavior is configured via the `firelevels` table at top level and assigned to `inst.components.firefx.levels` on the master.

## Main functions
Not applicable — this is a Prefab definition, not a component with custom logic.

## Events & listeners
Not applicable — no event listeners or pushed events are defined in this file.

