---
id: cane_ancient_fx
title: Cane Ancient Fx
description: Generates and manages localized visual shadow trail effects for the Cane Ancient character’s special abilities.
tags: [fx, visual, character]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3b03c772
system_scope: fx
---

# Cane Ancient Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cane_ancient_fx` is a utility prefab generator that creates temporary visual FX entities—specifically animated shadow trails—used during the Cane Ancient character’s ability animations. It defines multiple variations of FX prefabs (`cane_ancient_fx1`, `cane_ancient_fx2`, `cane_ancient_fx3`) and a master FX prefab (`cane_ancient_fx`) that randomly selects a variation at runtime. Each FX entity is non-persistent, non-networked (on dedicated servers), and self-destructs after ~1.5 seconds.

## Usage example
This component does not require direct usage by modders; it is automatically instantiated by the engine when Cane Ancient uses relevant abilities. Modders can reference its prefabs (e.g., `"cane_ancient_fx1"`) when spawning FX manually:
```lua
local fx = SpawnPrefab("cane_ancient_fx")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `net_smallbyte` (created via `net_smallbyte(inst.GUID, "shadow_trail._rand", "randdirty")`), `transform`, `animstate`, `network`  
**Tags:** Adds `FX`, `shadowtrail` to FX instances; `FX` is also added per-shadow entity.

## Properties
No public properties exposed to modders.

## Main functions
Not applicable — this is a prefab factory script, not a component with instance methods.

## Events & listeners
- **Listens to:**  
  - `randdirty` (master instance only): Triggers creation of a shadow FX with randomized scale/flip.  
  - `animover` (per-shadow entity): Automatically removes the shadow FX entity when its animation completes.  
- **Pushes:** None.
