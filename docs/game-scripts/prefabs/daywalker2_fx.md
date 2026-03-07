---
id: daywalker2_fx
title: Daywalker2 Fx
description: Creates a visual particle effect for the Daywalker2 boss's swipe attack animation.
tags: [fx, boss, animation, combat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 95130ace
system_scope: fx
---

# Daywalker2 Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines the `daywalker2_swipe_fx` prefab, which creates a transient visual effect used for the Daywalker2 boss's swipe attack. It is a client-side visual entity that plays a two-frame animation sequence (`atk1` followed optionally by `atk2`) and automatically removes itself after the animation completes. It does not possess physical properties or gameplay logic beyond rendering.

## Usage example
This prefab is not intended for direct manual instantiation by modders. It is created internally during Daywalker2 boss combat:
```lua
-- Usage within Daywalker2 prefab (not shown here; see SGdaywalker2 stategraph)
local fx = PostFMod("daywalker2_swipe_fx")
fx.Reverse() -- triggers second animation frame
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK`.

## Properties
No public properties.

## Main functions
### `swipe_Reverse(inst)`
* **Description:** Plays the second animation frame (`atk2`) on the effect entity.
* **Parameters:** `inst` (entity) — the effect entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove()` to clean up the entity after animation finishes.
- **Pushes:** None.