---
id: spawnlight_multiplayer
title: Spawnlight Multiplayer
description: A temporary visual FX entity that emits a pulsating light in multiplayer, synchronized across clients with server-authoritative timing and automatic cleanup after fading out.
tags: [fx, network, light, multiplayer]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 63c66d36
system_scope: fx
---

# Spawnlight Multiplayer

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spawnlight_multiplayer` is a short-lived FX entity designed for multiplayer-safe light effects. It creates a light with sinusoidally modulated radius, intensity, and falloff over time, while synchronizing the internal "time alive" counter between server and clients using a replicated float (`_pulsetime`). The light pulses for a fixed duration and then fades out, after which the entity is automatically removed. It is primarily used for visual feedback during entity spawning in multiplayer contexts.

## Usage example
```lua
-- Typically spawned via PrefabFiles or worldgen, not directly added as a component.
-- Example manual instantiation:
local inst = SpawnPrefab("spawnlight_multiplayer")
inst.Transform:SetPosition(x, y, z)
-- The light will auto-start pulsing and self-remove after fading
```

## Dependencies & tags
**Components used:** `transform`, `light`, `network`
**Tags:** Adds `NOCLICK`, `FX`, and `spawnlight`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_ismastersim` | boolean | `nil` (set at construction) | `true` if the entity is on the master (server) side; controls authoritative sync logic. |
| `_pulseoffs` | number | `0` | Offset used to phase the sine wave for smooth client-side animation sync. |
| `_fadek` | number | `1` | Current fade factor, ranging from `1` (fully bright) down to `0` (fully faded), updated via periodic subtraction of `FRAMES`. |
| `_pulsetime` | `net_float` | `net_float(GUID, ...)` | Replicated float storing the "time alive" counter, used to synchronize pulse phase across clients. |
| `_lastpulsesync` | number | `nil` (set on master) | Timestamp of the last full sync to clients (every `PULSE_SYNC_PERIOD = 30` seconds). |
| `_task` | task | `nil` | Reference to the periodic task driving `pulse_light`; set only on creation. |

## Main functions
### `pulse_light(inst)`
*   **Description:** Updates the light's visual parameters using a sine-based pulsation and handles fading decay. Runs periodically on both server and clients. On master sim, also manages network synchronization of `_pulsetime` and enables the light. On clients, only modulates light appearance.
*   **Parameters:** `inst` (entity) — the spawnlight instance.
*   **Returns:** Nothing.
*   **Error states:** The periodic task (`inst._task`) is cancelled and set to `nil` when `_fadek <= 0`, and the entity is scheduled for removal on master sim after a 1-second delay.

### `kill_light(inst)`
*   **Description:** Initiates fading when the world enters a new "cycles" state (e.g., end of world session). If `_fadek >= 1`, it triggers fading by scheduling `pulse_light` to run periodically.
*   **Parameters:** `inst` (entity) — the spawnlight instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if `_pulsetime` is already negative.

### `onpulsetimedirty(inst)`
*   **Description:** Client-side event handler triggered when the replicated `_pulsetime` value changes. Updates `_pulseoffs` to maintain smooth animation synchronization and kicks off fading if a negative `_pulsetime` indicates the light should fade.
*   **Parameters:** `inst` (entity) — the spawnlight instance.
*   **Returns:** Nothing.
*   **Error states:** Only schedules fading on client if `_fadek >= 1`; otherwise, only updates `_pulseoffs`.

## Events & listeners
- **Listens to:** `pulsetimedirty` — fires on clients when `_pulsetime` is updated by the server.
- **Pushes:** None — this entity does not fire custom events.