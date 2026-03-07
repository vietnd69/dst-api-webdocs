---
id: poopcloud
title: Poopcloud
description: Spawns a short-lived, non-persistent visual effect (particle-style animation) that mimics a fecal cloud, typically used for comedic or contextual feedback.
tags: [fx, visual, ephemeral]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 29b2616f
system_scope: fx
---

# Poopcloud

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`poopcloud` is a lightweight, non-networked FX prefab used to display a single animated visual effect — a "poop cloud" — at the position of another entity (typically the source of an action like spawning or projectile impact). It does not persist across sessions, does not simulate physics or interact with game logic, and exists only on the client. The prefab is instantiated via `fn()` and internally spawns a separate entity (`PlayCloudAnim`) to render the animation.

## Usage example
```lua
-- Spawns the poop cloud effect at a target transform's position.
-- Typically invoked as a one-off visual feedback.
local cloud = SpawnPrefab("poopcloud")
cloud.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` tag to both the root prefab instance and the spawned animation entity.

## Properties
No public properties

## Main functions
This prefab is defined as a standard `Prefab` return, and its behavior is fully encapsulated in the `fn()` factory function. There are no exposed public methods on the returned entity.

### `fn()`
*   **Description:** Factory function that creates and configures the `poopcloud` prefab instance. Initializes a non-persistent, networked entity with FX tag, spawns the client-side animation only on non-dedicated servers, and sets a delayed self-removal on the master world.
*   **Parameters:** None.
*   **Returns:** `inst` (entity) — The created FX entity.
*   **Error states:** On dedicated servers, returns the root entity without spawning the animation; no crash or error occurs. Returns early if `TheNet:IsDedicated()` is true.

### `PlayCloudAnim(proxy)`
*   **Description:** Helper function invoked after a 0-second delay to spawn and animate the visual component. Creates a non-networked, non-persistent child entity (the "cloud") and positions it at the `proxy` entity's location.
*   **Parameters:** `proxy` (entity) — The entity whose GUID is used to inherit position via `Transform:SetFromProxy`.
*   **Returns:** Nothing.
*   **Error states:** None — `proxy` is expected to be valid.

## Events & listeners
- **Listens to:** `animover` — When the idle animation completes on the cloud entity, it triggers `inst.Remove`, ensuring cleanup after animation ends.
- **Pushes:** None identified