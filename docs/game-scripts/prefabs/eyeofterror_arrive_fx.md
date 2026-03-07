---
id: eyeofterror_arrive_fx
title: Eyeofterror Arrive Fx
description: A temporary visual and lighting effect prefab that appears when the Eye of Terror arrives, animating a portal-like FX with dynamic lighting and sound.
tags: [fx, lighting, audio, boss, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cf7721f0
system_scope: fx
---

# Eyeofterror Arrive Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`eyeofterror_arrive_fx` is a one-shot FX prefab that represents the visual arrival of the Eye of Terror boss. It creates a portal-like animated entity with a self-modulating radius light and a colour-cycling hue effect, accompanied by a sound. The entity does not persist, has no physics or AI, and is automatically removed after ~120 frames (2 seconds in default frame rate). It is client-aware: on dedicated servers it only sets up the minimal network-replicated state.

## Usage example
This prefab is instantiated internally by the game engine and not typically added directly by modders. However, a typical usage pattern in DST prefabs looks like:

```lua
local fx = SpawnPrefab("eyeofterror_arrive_fx")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None — uses `entity:AddAnimState()`, `entity:AddLight()`, `entity:AddSoundEmitter()`, `entity:AddNetwork()` directly; no components added via `inst:AddComponent`.
**Tags:** Adds `FX`.

## Properties
No public properties are exposed on the instance. Internal state is held in private fields (`_lightframe`, `_islighton`, `_lighttask`, `_lightcolourtask`, `_lighttweener`) and stored in networked locals where needed.

## Main functions
Not applicable — this file defines a `Prefab` constructor function (`fn`) rather than a reusable component class.

## Events & listeners
- **Listens to:**
  - `"lightdirty"` — triggers light/animation updates (client-only).
  - `"animover"` — removes the entity when the animation completes.
- **Pushes:** None.
