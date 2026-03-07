---
id: fx
title: Fx
description: Generates and returns a list of Prefab instances for client-side visual and audio effects, supporting dynamic assets, animation, tinting, sound, and custom behaviors.
tags: [fx, client, visual, audio, prefab]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4a5b7da2
system_scope: fx
---

# Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fx.lua` is a meta-prefab generator that produces multiple `Prefab` instances for client-side visual and audio effects. It is not a component itself, but rather a module that constructs prefabs using the `MakeFx` function. Each effect is defined by a table `t` containing configuration keys such as `build`, `anim`, `sound`, `tint`, and `fn`. Effects are non-persisting (`persists = false`), non-networked (except for the temporary controller entity), and automatically removed after animation completes or after a fixed delay.

The module depends on `inspectable.lua` to optionally override the name/description of an effect entity, and it constructs assets dynamically (either static or dynamic `.zip`/`.dyn` assets depending on `build_is_skin`). It is typically used internally by the game to generate shared effect prefabs like `fx/spark`, `fx/swoosh`, or `fx/fog`.

## Usage example
This module is not meant for direct end-user modder usage — it is used internally to generate effect prefabs. However, a modder may reference or extend the effect definitions in their own `fx` table. The result of requiring this file is a list of prefabs ready for use in prefabs/ folders or during worldgen:
```lua
local fx = require("fx")
-- fx is now a list of Prefab instances, e.g., unpack(fx) returns them as separate arguments
```

## Dependencies & tags
**Components used:** `inspectable` (added conditionally if `nameoverride` or `description` is provided)
**Tags:** Adds `FX` to the generated effect entities and to the temporary controller entity.

## Properties
No public properties are exposed — this is a module returning prefabs, not a class or component.

## Main functions
### `PlaySound(inst, sound)`
* **Description:** Helper function that plays a sound on an entity’s `SoundEmitter`.
* **Parameters:**  
  - `inst` (Entity) — the entity instance with a `SoundEmitter` component.  
  - `sound` (string) — the soundbank filename to play.  
* **Returns:** Nothing.

### `MakeFx(t)`
* **Description:** Returns a `Prefab` instance for a single effect, built using the configuration table `t`.
* **Parameters:**  
  - `t` (table) — Effect configuration containing keys like `name`, `build`, `anim`, `bank`, `sound`, `tint`, `fn`, `twofaced`, etc.  
* **Returns:** `Prefab` — a fully configured prefab object.
* **Error states:** No explicit error handling — relies on correct `t` structure. Missing required keys may cause runtime errors during effect spawn (e.g., nil `anim` or `build`).

### `fn()` (internal function passed to `Prefab` constructor)
* **Description:** Main prefab factory function. Creates a lightweight controller entity that spawns the actual client-only effect via `startfx`.
* **Parameters:** None (invoked by prefab system with no arguments).
* **Returns:** `Entity` — the temporary controller instance.
* **Details:**  
  - On dedicated servers, the effect is *not* spawned (`TheNet:IsDedicated()` returns `true`).
  - The controller entity is pruned after 1 second (for server-side cleanup), but client-side effects are removed earlier on animation completion.
  - Adds appropriate facing (2-, 4-, 6-, or 8-faced) or two-faced/eight-faced/six-faced based on flags (`t.twofaced`, `t.eightfaced`, etc.).

## Events & listeners
- **Listens to:**  
  - `animover` — removes the effect entity when the animation finishes (if `t.animqueue` is not set).  
  - `animqueueover` — removes the effect entity when the animation queue finishes (if `t.animqueue` is set).  
- **Pushes:**  
  - `fx_spawned` — pushed to `TheWorld` when the effect entity is spawned, with the effect entity instance as the event payload.

Note: The controller entity (`fn`) does not listen to or push events; only spawned effects do.