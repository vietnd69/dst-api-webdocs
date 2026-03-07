---
id: carnival_sparkle_bush
title: Carnival Sparkle Bush
description: Creates a non-persistent visual effect entity used to display sparkle particles for carnival-themed bushes.
tags: [fx, visual, particle]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 202c2dcd
system_scope: fx
---

# Carnival Sparkle Bush

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines a simple `Prefab` used to instantiate a non-persistent visual FX entity. The entity displays an animated sparkle effect with a fixed scale and idle animation loop, primarily intended to attach to or overlay carnival-themed bushes. It is instantiated on non-dedicated clients only and automatically destroyed when its associated proxy entity is removed.

## Usage example
This prefab is not intended for manual instantiation by mods. It is referenced internally by the game's FX system and spawned via `inst:DoTaskInTime(0, PlayAnim)` during the setup of carnival-related bush entities.

```lua
-- Internal usage only — do not manually instantiate.
-- The prefab is created and managed by the game, typically as a child FX of another entity.
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Adds `FX`; referenced entity (via proxy) uses `carnival_sparkle_bush` bank and build.

## Properties
No public properties. This is a prefabricated FX entity with no mod-accessible runtime state.

## Main functions
The file exports only a `Prefab` definition. No standalone functions or methods are exposed for direct use.

### `PlayAnim(proxy, anim, scale, flip)`
*   **Description:** Internal helper function used to create and configure the FX entity. Sets up the entity’s transform, animation state, scale, and ensures it is removed when the proxy entity is removed.
*   **Parameters:**  
    `proxy` (Entity) — The source entity whose transform the FX will mirror.  
    `anim` (string) — Unused parameter in current implementation (animation is hardcoded to `"idle"`).  
    `scale` (number) — Unused parameter (scale is hardcoded to `0.75`).  
    `flip` (boolean) — Unused parameter.  
*   **Returns:** Nothing. The function instantiates and returns the FX entity internally.
*   **Error states:** None. Assumes valid `proxy` entity.

## Events & listeners
- **Listens to:** `onremove` — On the FX entity, to trigger self-removal when the proxy entity is destroyed. Listeners are tied to the `proxy` instance.
