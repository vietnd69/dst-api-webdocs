---
id: yotc_carrat_rug
title: Yotc Carrat Rug
description: Decorative floor item that plays idle and animation states upon placement or burning.
tags: [decor, flooritem, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cd49b0c9
system_scope: world
---

# Yotc Carrat Rug

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotc_carrat_rug` is a static decorative prefab that renders as a floor rug using the `carrat_rug` animation bank. It belongs to the `DECOR` and `NOCLICK` tag categories, indicating it serves a purely aesthetic purpose and cannot be interacted with via clicking. It plays a "place" animation when built, then defaults to an "idle" loop, and transitions to a "burnt" animation when destroyed by fire.

## Usage example
```lua
local rug = SpawnPrefab("yotc_carrat_rug")
if rug ~= nil then
    rug.Transform:SetPosition(x, y, z)
    rug:DoTaskInTime(0, function() rug:PushEvent("onbuilt") end)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `DECOR`, `NOCLICK`

## Properties
No public properties

## Main functions
Not applicable — this prefab uses standalone functions registered as event handlers and is instantiated via the `fn()` constructor returned by the `Prefab` factory.

## Events & listeners
- **Listens to:**  
  - `onbuilt` — triggers `onbuilt(inst)` to play "place" animation followed by "idle" loop  
  - `onburntup` — triggers `onburntup(inst)` to play "burnt" animation  
- **Pushes:** None  
