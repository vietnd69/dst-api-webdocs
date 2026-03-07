---
id: cane_rose_fx
title: Cane Rose Fx
description: Creates a visual particle effect simulating falling rose petals, used as a temporary aesthetic FX entity in the game world.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7deb8c8f
system_scope: fx
---

# Cane Rose Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cane_rose_fx` is a lightweightPrefab that generates a short-lived particle system effect resembling falling rose petals. It is instantiated as a dedicated FX entity (tagged `FX`), and is non-persistent (`persists = false`), meaning it will not be saved or replicated to clients on dedicated servers. It uses the VFX system to emit particles with custom shaders, colour envelopes, and scale envelopes, while dynamically adjusting emission rate based on entity movement.

## Usage example
```lua
-- Typically not instantiated manually; spawned via TheSim:SpawnPrefab("cane_rose_fx")
-- Emitted where roses appear (e.g., during Abigail-related events or cosmetic effects)
local fx = TheSim:SpawnPrefab("cane_rose_fx")
fx.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
### Constructor (`fn`)
* **Description:** Constructs and configures the FX entity, initializing the particle effect system and emitter manager callbacks. This is the prefab factory function passed to `Prefab()`.
* **Parameters:** None (called internally by the prefab system).
* **Returns:** The configured `inst` entity, or the same but unmodified entity on dedicated servers (no FX created).
* **Error states:** On dedicated servers, returns early without adding VFX or emitters.

## Events & listeners
None identified.