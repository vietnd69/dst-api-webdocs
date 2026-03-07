---
id: lavaarena_turtillus
title: Lavaarena Turtillus
description: A monster prefab for the Lava Arena event that tracks itself with the world’s mob tracker upon spawn.
tags: [combat, boss, arena, mob]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5904c073
system_scope: world
---

# Lavaarena Turtillus

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `lavaarena_turtillus` prefab defines a hostile monster entity used exclusively within the Lava Arena worldgen event. It is a non-playable character (NPC) with visual representation via animations and physics, and integrates with the `lavaarenamobtracker` to ensure it is tracked during arena events. It is added as a mob with tags marking it as a hostile arena participant. The prefab is instantiated using a standard `Prefab` constructor pattern and delegates post-initialization logic to a separate server-side `master_postinit` function via the event system.

## Usage example
This prefab is instantiated internally by the game engine during world generation or event startup and is not typically created manually by modders:
```lua
-- Internal instantiation (example only; not user code)
local turtillus = SpawnPrefab("turtillus")
-- Automatically registers with LavaArenaMobTracker if present
```

## Dependencies & tags
**Components used:** None explicitly added by this file. Relies on `LavaArenaMobTracker` component on `TheWorld` (accessed via `TheWorld.components.lavaarenamobtracker`).
**Tags:** Adds `LA_mob`, `monster`, `hostile`, and `fossilizable`.

## Properties
No public properties are defined in this file. Entity state is configured via `Transform`, `AnimState`, and physics overrides.

## Main functions
This file is a `Prefab` definition and does not expose custom methods beyond the standard prefab construction flow. The core logic resides in the anonymous function `fn()` passed to `Prefab(...)`.

### `fn()`
* **Description:** Constructs and initializes the entity instance for the `turtillus` prefab. Sets up transform, animation, sound, dynamic shadow, network sync, physics, and tags. Conditionally registers with `LavaArenaMobTracker` and defers master-server-side initialization.
* **Parameters:** None (called by the prefab system with no arguments).
* **Returns:** The fully initialized `inst` entity.
* **Error states:** Returns early without server-side post-init on non-master clients (`TheWorld.ismastersim == false`).

## Events & listeners
- **Listens to:** None directly in this file.
- **Pushes:** None directly in this file.
> Note: Server-side post-initialization logic (e.g., `event_server_data(...).master_postinit`) is invoked but the actual event listener registration occurs in the referenced external module — not here.

## Notes
- The `fossilizable` tag is added for optimization purposes related to the fossilization system, even though no `fossilizable` component is attached in this file.
- Physical size is scaled to `0.8` and physics radius overridden to `0.8` units; collision radius is set to `150`.
- Animations use the `"turtillus"` bank and `"lavaarena_turtillus_basic"` build; an override build `"fossilized"` is registered for visual state transitions.
- The `DynamicShadow` is configured with dimensions `2.5` (width) × `1.75` (height).