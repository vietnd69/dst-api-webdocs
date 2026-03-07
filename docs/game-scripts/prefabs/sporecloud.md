---
id: sporecloud
title: Sporecloud
description: A transient visual and gameplay effect that emits periodic aura damage and spoil effects over a radius, commonly used by the Toadstool creature.
tags: [fx, aura, environment, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ce4e56a5
system_scope: environment
---

# Sporecloud

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sporecloud` prefab represents a floating, glowing spore effect that functions as a transient environmental hazard. It applies periodic damage via the `aura` component and spoil effects on nearby food items via the `perishable` component. It also manages fading in/out animations, light effects, and particle overlays. The component is primarily used by the Toadstool mob and is non-persistent (`persists = false`), meaning it does not survive world saves or loading.

## Usage example
```lua
local cloud = SpawnPrefab("sporecloud")
cloud.Transform:SetPosition(x, y, z)
-- Automatically starts life cycle with fade-in, active period, and disperse
-- Optional: force immediate disperse
cloud.FinishImmediately()
-- Optional: force immediate full visibility
cloud.FadeInImmediately()
```

## Dependencies & tags
**Components used:** `combat`, `aura`, `perishable`, `timer`
**Tags added:** `FX`, `NOCLICK`, `notarget`, `sporecloud`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_state` | `net_tinybyte` | `0` | Networked state: `0` = init, `1` = active, `2` = disperse |
| `_fade` | `net_smallbyte` | `0` | Networked fade progress (0 to `2 * FADE_FRAMES + 1`) |
| `_fadetask` | task handle | `nil` | Task for updating fade animation |
| `_inittask` | task handle | `nil` | Task to run `InitFX` on spawn |
| `_spoiltask` | task handle | `nil` | Periodic task to spoil nearby items |
| `_basefx` | entity or `nil` | `nil` | Base animation entity (only on non-dedicated clients) |
| `_overlayfx` | table | `{}` | List of overlay FX entities |
| `_overlaytasks` | table | `{}` | Task handles for delayed overlay spawns |

## Main functions
### `FadeInImmediately()`
*   **Description:** Immediately sets the cloud to full visibility by setting fade state to `FADE_FRAMES` and triggering fade updates.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FinishImmediately()`
*   **Description:** Stops the disperse timer and triggers immediate cloud disintegration.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableCloud()`
*   **Description:** Disables the aura effect, cancels spoil task, and removes the `sporecloud` tag.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoDisperse(inst)`
*   **Description:** Handles the full disperse sequence: cancels timers, triggers fade-out, plays post-animation, kills loop sound, spawns overlay death animations, and removes the entity after a delay.
*   **Parameters:** `inst` (entity) — the sporecloud instance.
*   **Returns:** Nothing.

### `TryPerish(item)`
*   **Description:** Applies spoil damage to an item if it is in a valid context (not in limbo or in a closed container/storage).
*   **Parameters:** `item` (entity) — item with `perishable` component.
*   **Returns:** Nothing.

### `DoAreaSpoil(inst)`
*   **Description:** Finds and spoils all valid food items within the aura radius.
*   **Parameters:** `inst` (entity) — the sporecloud instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` (to transition from pre to loop animation), `statedirty` (client-side state sync), `fadedirty` (client-side fade sync), `timerdone` (to trigger disperse).
- **Pushes:** `statedirty`, `fadedirty` (via `net_tinybyte` / `net_smallbyte` triggers).