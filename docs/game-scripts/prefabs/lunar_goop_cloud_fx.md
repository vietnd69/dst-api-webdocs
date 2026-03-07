---
id: lunar_goop_cloud_fx
title: Lunar Goop Cloud Fx
description: Renders a short-lived smoke particle effect used for lunar goop cloud interactions.
tags: [fx, particle, cloud]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7b812ae0
system_scope: fx
---

# Lunar Goop Cloud Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunar_goop_cloud_fx` is a lightweight prefab that creates and manages a smoke particle effect for visual feedback during lunar goop cloud events. It uses the VFX effect system to emit rotating smoke particles with a custom color and scale envelope over a maximum lifetime of 1.5 seconds. The effect is non-persistent and only spawns on non-dedicated servers. It does not require or interact with any components beyond the base transform, network, and VFX effect system.

## Usage example
The prefab is instantiated automatically by the engine when referenced (e.g., via `SpawnPrefab("lunar_goop_cloud_fx")`). It is not intended to be added as a component to other entities.

```lua
-- Example usage: spawn the effect at a location
local fx = SpawnPrefab("lunar_goop_cloud_fx")
if fx ~= nil then
    fx.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `transform`, `network`, `vfxeffect`
**Tags:** Adds `FX`. Does not add or remove any other tags.

## Properties
No public properties

## Main functions
### Constructor `fn()`
* **Description:** Initializes the entity and configures its VFX effect with smoke particle settings and an emitter loop. Called once during prefab creation.
* **Parameters:** None.
* **Returns:** The `inst` entity, which may be a minimal object on dedicated servers (no VFX added).
* **Error states:** On dedicated servers (`TheNet:IsDedicated()` returns `true`), returns an entity with only transform and network components—no VFX is initialized.

### `emit_smoke_fn(effect, sphere_emitter)`
* **Description:** Internal helper used by the emitter loop to spawn one rotating smoke particle with randomized position, velocity, rotation, and lifetime.
* **Parameters:**  
  `effect` (VFXEffect component instance) — target effect manager for particle creation.  
  `sphere_emitter` (function) — callback returning `(px, py, pz)` coordinates within a sphere.
* **Returns:** Nothing.
* **Error states:** None. Performs only safe, non-failing operations.

### `IntColour(r, g, b, a)`
* **Description:** Internal helper to convert 0–255 RGB[A] color values to normalized 0.0–1.0 float arrays for envelope definition.
* **Parameters:**  
  `r`, `g`, `b`, `a` (integer) — color channel values (0–255).
* **Returns:** `{r/255, g/255, b/255, a/255}` (table of floats).
* **Error states:** None.

### `InitEnvelope()`
* **Description:** Registers colour and scale envelopes used for smoke particle rendering. Called once (and only once) before first use.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** After first invocation, the function reference is nulled (`InitEnvelope = nil`) to prevent re-registration.

## Events & listeners
None. This prefab does not listen to or push game events.