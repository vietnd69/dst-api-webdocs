---
id: lunarfissureburning
title: Lunarfissureburning
description: Applies periodic lunar burn damage to an entity and its mount while the entity stands over a fissure, managing visual FX and health state updates.
tags: [environment, combat, boss, fx]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2b76df55
system_scope: environment
---

# Lunarfissureburning

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LunarFissureBurning` is a component attached to entities (typically bosses like Alter Guardian in Phase 4) to simulate the lunar burn effect when standing over a fissure. It periodically inflicts damage to both the entity and its mount (if any), registers the burn with the `health` component, manages visual FX via `colouradder` and a particle FX prefab, and tracks state transitions (active burn → cooldown → removal). It integrates closely with `health`, `rider`, `grogginess`, `combat`, and `colouradder` components, and uses utility functions from `WagBossUtil`.

## Usage example
```lua
-- Typically added automatically during boss Phase 4 logic:
local inst = CreateEntity()
inst:AddComponent("lunarfissureburning")
-- The component begins updating automatically in its constructor.
-- It will apply damage while the entity is over a fissure and stop after 1 second in limbo or off-fissure.
```

## Dependencies & tags
**Components used:** `health`, `rider`, `grogginess`, `combat`, `colouradder`, `transform`
**Tags:** Does not add or remove tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cleartime` | number or nil | `0` | Accumulates delta time while off-fissure; if it exceeds `1`, the component removes itself. When `nil`, the entity is actively burning. |
| `fx` |PrefabInstance or nil| `nil` | Reference to the `alterguardian_lunar_fissure_burn_fx` prefab instance, if spawned. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleanup function called when the component is removed from its entity. Unregisters the lunar burn source from `health` (if active) and destroys the FX prefab.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetFxEnabled(enable)`
*   **Description:** Toggles the visual FX (show/hide) and adjusts the FX size based on the entity’s (or its mount’s) physical radius and tags. Also manages colour addition/removal through `colouradder`.
*   **Parameters:** `enable` (boolean) – whether to enable (true) or disable (false) the FX.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called every frame. Determines if the entity is currently over a fissure using `WagBossUtil`. If over a fissure, it applies damage every tick and pulses damage at a reduced interval (`lastlunarburnpulsetick`). Also maximizes grogginess. If not over a fissure, it enters a 1-second cooldown (via `cleartime`), then removes itself if no longer relevant.
*   **Parameters:** `dt` (number) – delta time since last frame.
*   **Returns:** Nothing.
*   **Error states:** Skips damage if the entity is in limbo, has the `notarget` tag, has state tags like `"flight"`/`"invisible"`/`"noattack"`, is dead, or its `combat` component reports it cannot be attacked.

## Events & listeners
- **Listens to:** None directly (uses `inst:StartUpdatingComponent(self)` to schedule `OnUpdate`).
- **Pushes:** None directly; damage-related events (`healthdelta`, `startlunarburn`, `stoplunarburn`) are pushed via the `health` component when `DoDelta`, `RegisterLunarBurnSource`, and `UnregisterLunarBurnSource` are called.
