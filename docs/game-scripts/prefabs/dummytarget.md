---
id: dummytarget
title: Dummytarget
description: Creates a non-player entity with fixed health, regenerative properties, and visual feedback for damage, primarily used for testing or as a target in specific game modes.
tags: [combat, test, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0d3da378
system_scope: entity
---

# Dummytarget

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`dummytarget` is a prefab factory function used to create target entities with controlled combat behavior. These entities are designed for testing or as designated targets in specific scenarios (e.g., *Lava Arena*). They feature fixed health, regenerative properties, and integrated visual/audio feedback when struck. The component relies on multiple core systems including `combat`, `health`, `debuffable`, and `label` to render damage numbers and animations.

## Usage example
```lua
-- Example of spawning a basic dummy target instance
local inst = Prefabs("dummytarget")()
inst.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `bloomer`, `colouradder`, `inspectable`, `combat`, `debuffable`, `health`, `planarentity` (conditionally)  
**Tags added:** `monster`, `lunar_aligned` (for lunar variant), `shadow_aligned` (for shadow variant)  
**Tags checked:** `lunar_aligned`, `shadow_aligned` (indirectly via postinit branching)

## Properties
No public properties are defined on the component itself. The constructor only instantiates prefabs with pre-configured components and behavior.

## Main functions
No public methods are defined or exposed directly by this file. The core logic is implemented in the factory function `MakeDummy`, which returns a `Prefab` instance — not a component.

### Constructor (`MakeDummy`)
*   **Description:** A factory function that returns a `Prefab` for creating `dummytarget` entities. It sets up the entity with transform, animation, sound, label, and combat-related components.
*   **Parameters:**
    *   `name` (string) — The prefab name (e.g., `"dummytarget"`).
    *   `common_postinit` (function or `nil`) — Optional postinit hook applied to all instances regardless of sim context.
    *   `master_postinit` (function or `nil`) — Optional postinit hook applied only on master simulation.
*   **Returns:** `Prefab` — A prefab definition with the entity factory function.
*   **Error states:** If `common_postinit` or `master_postinit` is passed, it is invoked unconditionally and must handle nil checks or undefined state gracefully.

## Events & listeners
- **Listens to:** `healthdelta` — Triggers visual feedback (damage number label, offset, hit animation) when health changes with non-positive delta.
- **Pushes:** None — This file does not fire any events itself. It registers for internal game events and triggers effects, but no custom events are emitted.
