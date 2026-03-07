---
id: monkeyisland_portal_fxloot
title: Monkeyisland Portal Fxloot
description: A visual particle effect prefab that spawns random ground-loot animations (e.g., grass, shell) during portal events in Monkey Island scenarios.
tags: [fx, loot, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 840f55fe
system_scope: fx
---

# Monkeyisland Portal Fxloot

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`monkeyisland_portal_fxloot` is a lightweight visual effect prefab used to simulate debris or loot items falling or scattering during Monkey Island portal interactions. It does not possess gameplay logic beyond animation playback and positional visibility. The effect runs briefly in the world, pauses its animation on spawn, plays a randomly selected animation from a set of common ground items, and is automatically removed when the animation completes. It is client-side safe and does not persist or replicate physics on dedicated servers.

## Usage example
This prefab is instantiated internally by the game (e.g., during Monkey Island event logic) and is not meant to be manually added by modders. A typical internal instantiation would resemble:

```lua
local fx = SpawnPrefab("monkeyisland_portal_fxloot")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`, `groundshadowhandler`, `inventoryphysics`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
The component does not define any functional methods beyond standard prefab behavior. The `fn()` function returns the configured entity and is not a component method but the prefab constructor.

## Events & listeners
- **Listens to:** `animover` – triggers `inst.Remove()` to destroy the entity once animation completes.
- **Pushes:** None.