---
id: shatter
title: Shatter
description: Creates a one-shot local visual effect when a frozen object shatters, syncing shatter level via network and handling client-side animation playback.
tags: [fx, network, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8b9d9315
system_scope: fx
---

# Shatter

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `shatter` prefab manages visual effects for the shattering of frozen objects (e.g., ice blocks). It is a non-persistent entity that spawns a local FX entity containing the `shatterfx` component. On the server, it tracks the shatter level via network synchronization (`net_tinybyte`); on clients (non-dedicated servers), it listens for level changes and triggers the shatter animation once per shatter event. The prefab is designed for one-time use and auto-removes after spawning effects.

## Usage example
```lua
-- Typically instantiated internally when frozen objects break
-- Example of direct use (e.g., in a custom prefab's action):
local shatter_fx = SpawnPrefab("shatter")
if shatter_fx ~= nil then
    shatter_fx.components.shatterfx:SetLevel(3) -- "large" shatter
end
```

## Dependencies & tags
**Components used:** `shatterfx`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `FX` to spawned FX entity; checks `dedicated` server status via `TheNet:IsDedicated()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_level` | `net_tinybyte` | `nil` | Networked property representing the shatter level (0–4). |
| `_complete` | `boolean` | `false` | Flag preventing duplicate shatter effects per event (client-side only). |

## Main functions
### `PlayShatterAnim(proxy)`
*   **Description:** Spawns a transient FX entity, configures its animation and sound for shatter playback, and links it to the source entity via proxy. Called once per shatter event.
*   **Parameters:** `proxy` (Entity) — Reference to the entity whose shatter event triggered this effect.
*   **Returns:** Nothing. (Internally creates and returns a new FX entity.)
*   **Error states:** Does not return errors, but silently exits if parent transform cannot be resolved.

### `OnLevelDirty(inst)`
*   **Description:** Client-side handler that triggers `PlayShatterAnim` when the `_level` property changes and a shatter hasn’t already been played for this instance.
*   **Parameters:** `inst` (Entity) — The `shatter` prefab instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `_complete` is `true` or if `level <= 0`.

### `inst.components.shatterfx:SetLevel(level)` *(overridden in `fn`)*
*   **Description:** Server-side override that updates the networked `_level` value (instead of playing animation locally).
*   **Parameters:** `level` (number) — Integer from 1–5 corresponding to `tiny`, `small`, `medium`, `large`, `huge`.
*   **Returns:** Nothing.
*   **Error states:** delegates to `net_tinybyte:set`, which clamps values per protocol.

## Events & listeners
- **Listens to:** `leveldirty` — triggers `OnLevelDirty` on clients to play animation after network update.
- **Listens to:** `animover` — removes the FX entity once its animation completes (via `inst.Remove`).
- **Pushes:** None.