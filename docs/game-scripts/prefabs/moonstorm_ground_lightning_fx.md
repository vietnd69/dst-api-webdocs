---
id: moonstorm_ground_lightning_fx
title: Moonstorm Ground Lightning Fx
description: Creates a visual and audio effect for a lightning strike during a moonstorm, with a chance to spawn a secondary follow-up effect nearby.
tags: [environment, fx, moonstorm]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: da8c315d
system_scope: fx
---

# Moonstorm Ground Lightning Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`moonstorm_ground_lightning_fx` is a visual effect prefab used to simulate lightning striking the ground during a moonstorm event. It spawns a static animation with sound, applies specific rendering properties (e.g., color tint, layering, bloom), and has a built-in delay that may trigger a secondary lightning effect nearby—dependent on player proximity and map node constraints. It is designed as a one-shot effect and does not persist across game sessions.

## Usage example
This prefab is not meant to be manually instantiated by modders. It is spawned internally by the `moonstorms` component when a moonstorm occurs.

```lua
-- Not applicable for external use; spawned via internal logic in moonstorms.lua
```

## Dependencies & tags
**Components used:** None directly. Interacts with `TheWorld.Map` and `TheWorld.net.components.moonstorms` (via `_moonstorm_nodes`).
**Tags:** Adds `fx`, `NOCLICK`.

## Properties
No public properties. All state is held internally and transiently (e.g., `inst.anglemod`, set on the entity only when spawned programmatically during `checkspawn`).

## Main functions
### `fn(pondtype)`
*   **Description:** Constructor function for the prefab. Initializes the entity with transform, animation, and sound components; plays a lightning strike animation; sets rendering properties; and schedules a delayed `checkspawn` call. The `pondtype` argument is accepted but unused.
*   **Parameters:** `pondtype` (any) – argument required by prefab signature, but not used.
*   **Returns:** `inst` (entity) – a fully configured entity instance ready for spawning.
*   **Error states:** None documented; silently exits early in `checkspawn` if `ThePlayer` is `nil`.

## Events & listeners
- **Listens to:** `animover` – removes the effect entity once its animation completes.
- **Pushes:** None.

## Notes
- The effect uses two possible animations: `"strike"` or `"strike2"`, selected randomly.
- It includes a 13-frame delay (≈0.217 seconds) before attempting to spawn a secondary lightning effect via `checkspawn`.
- The spawn logic for a follow-up effect checks:
  - The player is within 30 world units (squared distance < 900).
  - The ground point is valid (`IsVisualGroundAtPoint`).
  - The target map node is in the active `_moonstorm_nodes` list (from `moonstorms` component).
- The effect does **not** persist (`inst.persists = false`).