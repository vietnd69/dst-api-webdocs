---
id: fossil_spike2
title: Fossil Spike2
description: Handles the lifecycle and behavior of a fossil spike projectile, including launch, impact, area damage, and particle effects upon detonation.
tags: [combat, fx, projectile, stalker]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 95639710
system_scope: entity
---

# Fossil Spike2

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fossil_spike2` is a projectile prefab used by the Stalker enemy. It launches upward, animates, then impacts the ground where it deals damage to nearby entities, destroys collapsible structures (e.g. walls, spikes), picks some flora, kills smaller non-locomotive targets, and throws nearby items. After impact, it spawns a static FX base (`fossilspike2_base`) and fades out using erosion effects. This component is implemented in the `fn()` constructor of the prefab and is not a standalone component class, but rather a collection of functions and behaviors embedded in the entity definition.

## Usage example
The `fossil_spike2` prefab is automatically spawned by the Stalker AI and should not be manually created in most mods. However, modders can reuse its core behaviors via other prefabs by replicating the construction logic in `fn()`.

## Dependencies & tags
**Components used:** `combat`
**Tags added:** `notarget`, `fossilspike`, `FX`, `NOCLICK`

## Properties
No public properties. Internal state is stored directly on `inst` (e.g., `inst.shadowsize`, `inst.lightvalue`, `inst.soundlevel`, `inst.task`, `inst.killtask`, `inst.basefx`, `inst.killed`).

## Main functions
The following public methods are attached directly to the instance (`inst.RestartSpike`, `inst.KillSpike`):

### `RestartSpike(delay, variation, soundlevel)`
*   **Description:** Reschedules the spike’s launch animation with optional custom parameters. Typically called to restart the spike after pausing or interrupting it.
*   **Parameters:**
    *   `delay` (number?) - Optional delay in seconds before re-launching.
    *   `variation` (number?) - Optional spike visual variant (1–7). If `nil`, randomly selected. If out of range, wrapped cyclically.
    *   `soundlevel` (number?) - Optional sound volume level passed to `SoundEmitter:PlaySoundWithParams`.
*   **Returns:** Nothing.

### `KillSpike()`
*   **Description:** Immediately terminates the spike’s active lifecycle: cancels timers, spawns erosion ash at current position, adds `NOCLICK` tag, and triggers fade-out via `ErodeAway`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartSpike(inst, variation)`
*   **Description:** Internal initializer. Begins animation sequence (`appear`), sets up periodic shadow/light updates, and registers the `animover` callback to `OnImpact`. Typically called via task delay or `RestartSpike`.
*   **Parameters:**
    *   `inst` (Entity) - The spike entity.
    *   `variation` (number) - Visual variant ID (1–7) to override default bone symbol.
*   **Returns:** Nothing.

### `OnImpact(inst)`
*   **Description:** Called when the spike lands (`animover` event). Triggers sound, spawns base FX, sets up final timer for `KillSpike`, and executes area-of-effect logic via `DoDamage`.
*   **Parameters:** `inst` (Entity) — the spike entity.
*   **Returns:** Nothing.

### `DoDamage(inst)`
*   **Description:** Computes area of effect (radius `PHYSICS_RADIUS + DAMAGE_RADIUS_PADDING`) and executes damage logic on nearby entities:
    *   Collapsible workables (chop, dig, hammer, mine) are destroyed.
    *   Stumps are removed after destruction.
    *   Pickables (without `intense` tag) are picked.
    *   Combat-capable living targets are either killed (if non-locomotive and not epic) or attacked (via `DoAttack`).
    *   Inventory items with `mine` are deactivated; others are tossed upward using `SpikeLaunch`.
*   **Parameters:** `inst` (Entity) — the spike entity.
*   **Returns:** Nothing.

### `SpikeLaunch(inst, launcher, basespeed, startheight, startradius)`
*   **Description:** Applies physics velocity to an entity (`inst`) to simulate being launched from a source (`launcher`), with slight randomness to angle and speed.
*   **Parameters:**
    *   `inst` (Entity) — The item/launcher target to throw.
    *   `launcher` (Entity) — Source of launch for position reference.
    *   `basespeed` (number) — Base launch speed.
    *   `startheight` (number) — Initial vertical offset.
    *   `startradius` (number) — Radius to offset launch position from source.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnImpact` when the `appear` animation completes.
- **Pushes:** None directly. Delegates to other prefabs via `SpawnPrefab` (e.g., `erode_ash`, `fossilspike2_base`), which may push their own events.