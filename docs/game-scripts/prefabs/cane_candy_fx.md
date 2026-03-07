---
id: cane_candy_fx
title: Cane Candy Fx
description: Creates a temporary particle effect simulating sugar-cane candy sparks or glitter, typically used to visually represent candy-based magical effects.
tags: [fx, visual]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b1fdcd0
system_scope: fx
---

# Cane Candy Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cane_candy_fx` is a lightweight, non-persistent FX prefab that generates a short-lived visual effect resembling sparkling candy particles. It uses a VFX system with rotating, UV-animated particles and dynamic emission rates based on the entity's movement. It is intended for decorative visual feedback (e.g., during item usage or character ability animations) and only runs on non-dedicated clients.

## Usage example
```lua
-- Spawn the FX at a specific world position
local fx = SpawnPrefab("cane_candy_fx")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** Adds `FX` tag to the entity.

## Properties
No public properties.

## Main functions
This prefab is defined as a Prefab factory function and does not expose standalone methods. Its behavior is fully encapsulated in its construction function `fn()`.

### Construction (`fn`)
* **Description:** Instantiates the entity, configures its VFX system, initializes envelopes for color and scale, and registers an emitter to generate particles. Runs only on clients (not on dedicated servers).
* **Parameters:** None (used internally by `Prefab` constructor).
* **Returns:** `inst` — the constructed entity.
* **Error states:** Returns early on dedicated servers without initializing VFX.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
