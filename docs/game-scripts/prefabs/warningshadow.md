---
id: warningshadow
title: Warningshadow
description: A visual effect prefab used to indicate warning zones, displaying a looping shadow animation.
tags: [fx, visual, warning]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0dac690
system_scope: fx
---

# Warningshadow

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`warningshadow` is a simple, non-persistent FX prefab that renders a looping shadow animation to serve as a visual warning indicator (e.g., during boss attacks or hazardous area warnings). It uses `AnimState` to play an idle animation and is tagged as `FX`. It exists only on the client in multiplayer and does not persist or synchronize with the server beyond instantiation.

## Usage example
```lua
local inst = Prefab("warningshadow")
inst = SpawnPrefab("warningshadow")
if inst then
    inst.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `Network`
**Tags:** Adds `FX`

## Properties
No public properties

## Main functions
Not applicable

## Events & listeners
None identified
