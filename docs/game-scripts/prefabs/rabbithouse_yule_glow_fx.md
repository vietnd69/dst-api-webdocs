---
id: rabbithouse_yule_glow_fx
title: Rabbithouse Yule Glow Fx
description: Creates a non-persistent visual effect entity for rabbit house Yule-themed lighting.
tags: [fx, visual, lighting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e2b2abf
system_scope: fx
---

# Rabbithouse Yule Glow Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`rabbithouse_yule_glow_fx` is a lightweight prefab that spawns a visual light effect used during Yule-themed events. It is a non-persistent entity intended for transient lighting decoration—typically attached to or spawned near rabbit houses. It uses a dedicated animation bank and overrides the rendering light intensity, without any gameplay logic or component dependencies.

## Usage example
The prefab is typically instantiated via `SpawnPrefab("rabbithouse_yule_glow_fx")` or used internally by a larger prefab’s spawn logic. Example usage in a parent entity’s setup:
```lua
local glow = SpawnPrefab("rabbithouse_yule_glow_fx")
if glow then
    glow.Transform:SetPosition(x, y, z)
    self.inst:AddChild(glow)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` tag.

## Properties
No public properties.

## Main functions
### `glowfn()`
*   **Description:** Factory function that constructs and configures the effect entity. It is called internally when the prefab is spawned.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — a fully configured entity with transform, animstate, network, and `FX` tag.
*   **Error states:** None.

## Events & listeners
None identified.