---
id: wortox_portal_fx
title: Wortox Portal Fx
description: Creates particle FX entities for Wortox's portal jump-in and jump-out animations.
tags: [fx, animation, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1b03ed5f
system_scope: fx
---

# Wortox Portal Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_portal_fx` defines two prefabs (`wortox_portal_jumpin_fx` and `wortox_portal_jumpout_fx`) that render animated particle effects for Wortox's portal-based teleportation. Each FX entity is self-contained, non-persistent, and automatically destroys itself shortly after its animation completes.

## Usage example
This component is not used directly by modders — it is consumed internally via prefabs:

```lua
-- Spawn jump-in effect (e.g., when Wortox enters a portal)
local fx = SpawnPrefab("wortox_portal_jumpin_fx")
fx.Transform:SetPosition(x, y, z)

-- Spawn jump-out effect (e.g., when Wortox exits a portal)
local fx = SpawnPrefab("wortox_portal_jumpout_fx")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
Not applicable — this file returns two prefab functions (`wortox_portal_jumpin_fx` and `wortox_portal_jumpout_fx`), not a reusable component.

## Events & listeners
- **Listens to:** `animover` — triggers self-removal after a 2-frame delay via `OnAnimOver`.
- **Pushes:** None identified