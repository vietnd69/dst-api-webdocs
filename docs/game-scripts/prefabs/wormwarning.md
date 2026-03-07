---
id: wormwarning
title: Wormwarning
description: Generates low-priority visual and audio warning entities that appear at increasing distances to indicate approaching worm hounds.
tags: [fx, audio, hounds, warning, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c0ef9436
system_scope: fx
---

# Wormwarning

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Wormwarning` is a prefab generator component that creates temporary visual/audio warning entities for approaching worm hounds. Each warning entity is spawned at a fixed distance from the player and plays a sound before self-destructing. The component defines multiple prefabs corresponding to decreasing warning distances, culminating in the final boss worm warning at the hound spawn distance. It is used exclusively for atmospheric feedback and does not affect gameplay logic or state.

## Usage example
```lua
-- Example: Spawning a level 3 worm warning at SPAWN_DIST + 10
local warning = Prefab("wormwarning_lvl3")()
warning.SoundEmitter:PlaySound("custom_warning_sound") -- override at runtime if needed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` tag to each spawned entity

## Properties
No public properties

## Main functions
### `PlayWarningSound(inst, radius, soundoveride)`
*   **Description:** Positions the warning entity in a circle around the focal point at the specified radius, plays the sound (default or override), and destroys the entity.
*   **Parameters:**
    *   `inst` (table) — The entity instance to configure and play.
    *   `radius` (number) — Distance from the focal point at which to spawn the warning.
    *   `soundoveride` (string?, optional) — Custom sound name; falls back to `"dontstarve/creatures/worm/distant"` if omitted.
*   **Returns:** Nothing.
*   **Error states:** None identified; silently falls back to default sound if `soundoveride` is `nil`.

### `makewarning(distance, soundoveride)`
*   **Description:** Returns a closure that instantiates a new warning entity, configures its components and position, schedules immediate execution of `PlayWarningSound`, and marks it as non-persistent.
*   **Parameters:**
    *   `distance` (number) — Radius at which the warning is spawned.
    *   `soundoveride` (string?, optional) — Optional sound override for the warning.
*   **Returns:** A function that, when called, returns a fully configured entity instance.
*   **Error states:** None identified.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified