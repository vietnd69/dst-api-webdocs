---
id: nightsword_wizard_fx
title: Nightsword Wizard Fx
description: Generates visual FX (smoke and spark particles) synchronized with the Nightsword character's attack animation when not mounted.
tags: [fx, visual, combat, character]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 12040b96
system_scope: fx
---

# Nightsword Wizard Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`nightsword_wizard_fx` is a non-persistent FX prefab that emits smoke and spark particle effects during the Nightsword character's attack animation. It is spawned as a child entity and listens to its parent's animation state and mount status to determine when to emit particles. It does not run on dedicated servers and relies on the `rider` component to determine if the parent is mounted. Particle behavior is fully defined via envelopes managed by `EnvelopeManager`.

## Usage example
This prefab is not added manually by modders; it is instantiated internally by the Nightsword character's animation logic as a child entity. A typical instantiation looks like:

```lua
local fx = MakePrefabInstance("nightsword_wizard_fx")
fx.entity:SetParent(some_parent_entity)
```

The FX is automatically triggered during the parent's `"atk"` animation using a registered emitter callback.

## Dependencies & tags
**Components used:** `rider` (via `parent.components.rider:GetMount()`)
**Tags:** Adds `FX` tag to the instance.

## Properties
No public properties.

## Main functions
Not applicable — this file defines a Prefab constructor (`fn`) and helper functions for FX emission, but no user-facing methods.

### Constructor `fn()`
* **Description:** Creates and configures the FX entity, initializes particle emitters, and registers an `EmitterManager` callback to emit particles conditionally based on the parent's animation and mount status.
* **Parameters:** None.
* **Returns:** The FX entity (`inst`).
* **Error states:** Returns early on dedicated servers without initializing FX; skips `InitEnvelope()` if already initialized.

### `InitEnvelope()`
* **Description:** Initializes color and scale envelopes for smoke and spark particle effects. Runs only once (sets itself to `nil` after).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Has no effect if called after initial setup (idempotent via `InitEnvelope = nil`).

### `IntColour(r, g, b, a)`
* **Description:** Converts 8-bit color components to normalized `[0,1]` RGBA values for use in envelopes.
* **Parameters:**
  * `r`, `g`, `b`, `a` (number) — integer color channel values (0–255).
* **Returns:** `{r, g, b, a}` (table) — normalized color vector.

### `emit_smoke_fn(effect, sphere_emitter, adjust_vec)`
* **Description:** Adds a single smoke particle to the effect.
* **Parameters:**
  * `effect` (VFXEffect) — target FX effect.
  * `sphere_emitter` (function) — returns `(px, py, pz)` world coordinates.
  * `adjust_vec` (table?, optional) — offset vector `{x, y, z}` to apply to position.
* **Returns:** Nothing.

### `emit_spark_fn(effect, sphere_emitter, adjust_vec)`
* **Description:** Adds a single spark particle to the effect.
* **Parameters:**
  * `effect` (VFXEffect) — target FX effect.
  * `sphere_emitter` (function) — returns `(px, py, pz)` world coordinates.
  * `adjust_vec` (table?, optional) — offset vector `{x, y, z}` to apply to position.
* **Returns:** Nothing.

## Events & listeners
Not applicable — the component uses `EmitterManager` (a system-level service) for periodic callbacks rather than entity events. No `inst:ListenForEvent` or `inst:PushEvent` calls are present.