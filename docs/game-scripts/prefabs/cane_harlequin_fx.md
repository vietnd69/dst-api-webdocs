---
id: cane_harlequin_fx
title: Cane Harlequin Fx
description: Creates and manages a local-only confetti particle effect used for visual feedback, typically during harlequin cane-related animations.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 09b8b924
system_scope: fx
---

# Cane Harlequin Fx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cane_harlequin_fx` is a self-contained prefab that instantiates a localized particle system producing a multi-coloured, rotating confetti effect. It is used exclusively on the client and never persists or runs on dedicated servers. The effect uses custom colour and scale envelopes, combined with rotating UV frames and physics-enabled particles, to simulate an aesthetically pleasing spark or celebration burst.

The component does not provide runtime-modifiable behavior after instantiation — it is designed as a one-shot particle spawner attached to an entity (typically the cane wielder) via the `EmitterManager`.

## Usage example
```lua
-- Typically invoked internally by the game; not meant for direct modder use.
-- Example of spawning the effect manually (for testing or custom logic):
local fx = SpawnPrefab("cane_harlequin_fx")
fx.Transform:SetPosition(x, y, z) -- set position in world space
fx.persists = false -- ensure it doesn’t persist (default)
```

## Dependencies & tags
**Components used:** `transform`, `network`, `vfxeffect`
**Tags:** Adds `FX`; checks `dedicated` (via `TheNet:IsDedicated()`); uses `EmitterManager`.

## Properties
No public properties — this prefab is instantiated as a one-shot effect and does not expose tunable instance variables for external configuration.

## Main functions
No public methods — the entire logic resides in the constructor function `fn()` and helper functions (`InitEnvelope`, `emit_confetti_fn`, emitter callback). All methods operate internally during initialization and are not intended for external calls.

## Events & listeners
This prefab does not register or push any events. It interacts with the engine via:
- `EmitterManager:AddEmitter(inst, nil, callback)` — registers a per-frame emitter callback.
- `EnvelopeManager:AddColourEnvelope(...)` / `AddVector2Envelope(...)` — registers shared effect envelopes on first instantiation.

None of these are exposed as DST events for modding.

