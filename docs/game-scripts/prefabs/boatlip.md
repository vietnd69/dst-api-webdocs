---
id: boatlip
title: Boatlip
description: A visual, non-physical ground-decor entity used to animate boat lips at waterline transitions in DST.
tags: [visual, decoration, ocean]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b7c3cb65
system_scope: world
---

# Boatlip

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`boatlip` is a lightweight visual entity prefab used to render animated "lips" along the transition between water and land surfaces — typically along boat docks or shorelines. It is non-physical (`NOBLOCK`), purely decorative (`DECOR`), and runs independently of physics or simulation. Multiple variants exist to support different seasonal or event-specific visual themes (e.g., grass, ice, YOTD, ancient, otterden).

## Usage example
```lua
local inst = CreateEntity()
inst:Preset("boatlip_grass")
```
or for a specific variant:
```lua
local inst = Prefab("boatlip_ice")()
```

## Dependencies & tags
**Components used:** None (uses only low-level `Transform`, `AnimState`, `SoundEmitter`, and `Network` via `inst.entity:Add...()`).
**Tags:** Adds `NOBLOCK` and `DECOR`.

## Properties
No public properties.

## Main functions
Not applicable — this is a prefab factory, not a component. All configuration occurs during entity instantiation.

## Events & listeners
None identified.
