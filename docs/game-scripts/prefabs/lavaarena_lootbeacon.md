---
id: lavaarena_lootbeacon
title: Lavaarena Lootbeacon
description: A visual FX-only entity used to signal loot beacon activation in the Lava Arena event.
tags: [fx, event, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fff73dec
system_scope: fx
---

# Lavaarena Lootbeacon

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lavaarena_lootbeacon` is a lightweight visual FX prefab that renders an animated pickup effect for loot during the Lava Arena event. It is instantiated only for visual feedback and has no gameplay logic or component dependencies beyond core transform, animation, sound, and network subsystems. It does not interact with game mechanics directly but is used to draw attention to active beacon locations.

## Usage example
```lua
-- Example spawn of the beacon FX at a given position (not a direct usage pattern)
local beacon = SpawnPrefab("lavaarena_lootbeacon")
if beacon ~= nil and beacon.Transform ~= nil then
    beacon.Transform:SetPosition(x, y, z)
    beacon:Show()
    beacon.AnimState:PlayAnimation("loop", true)
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `DECOR` and `NOCLICK`.

## Properties
No public properties.

## Main functions
Not applicable — this is a static prefab definition with no custom logic or public methods.

## Events & listeners
Not applicable — this prefab does not register or emit events directly.
