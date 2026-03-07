---
id: miasma_cloud_fx
title: Miasma Cloud Fx
description: Manages client-side visual particle effects (smoke and embers) for miasma clouds, including dynamic attachment/detachment based on camera distance and orientation.
tags: [fx, particle, client, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e3ddaa7d
system_scope: fx
---

# Miasma Cloud Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`miasma_cloud_fx` is a client-side prefab component responsible for rendering the visual particle effects of miasma clouds — specifically, the smoke and ember emissions. It does not govern gameplay logic but handles all rendering behavior for the miasma fog effect, including dynamic camera-based particle attachment/detachment, orientation-sensitive semicircle emission, and diminishing effects when near fire. It works in coordination with `miasmamanager` and `miasmawatcher` (via the master entity) but is purely visual.

## Usage example
```lua
-- This component is not added manually; it is instantiated via the Prefab system.
-- Example of triggering particle attachment on a miasma cloud entity:
inst.AttachParticles(true) -- Attach front/back cloud FX and fast-forward initial particles
-- Later, to detach:
inst.DetachParticles()
```

## Dependencies & tags
**Components used:** None directly (this is a client-only FX prefab).  
**Tags added:** `FX`, `miasma` (on the main `miasma_cloud` entity).  
**Tags added (FX prefabs):** `FX` on `miasma_cloud_fx` and `miasma_ember_fx`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `smoke_max_scale` | number | `0.8` | Max scale for smoke particle textures. |
| `ember_max_scale` | number | `0.7` | Max scale for ember particle textures. |
| `SMOKE_MAX_LIFETIME` | number | `5.0` | Base lifetime (seconds) of smoke particles. |
| `EMBER_MAX_LIFETIME` | number | `1.5` | Lifetime (seconds) of ember particles. |
| `FIRE_DECAY_MULTIPLIER` | number | `0.25` | Multiplier applied to smoke lifetime when near fire. |
| `MIASMA_RADIUS` | number | Calculated from `TUNING.MIASMA_SPACING` | Effective radius (in world units) for miasma influence detection. |

## Main functions
### `AttachParticles(do_fast_forward)`
* **Description:** Spawns and attaches two particle-emitting child FX entities (`_front_cloud_fx` and `_back_cloud_fx`) to display the miasma cloud. If `do_fast_forward` is `true`, it immediately emits particles and fast-forwards the effect to avoid pop-in.
* **Parameters:** `do_fast_forward` (boolean) — whether to spawn initial particles and fast-forward the effect.
* **Returns:** Nothing.
* **Error states:** No-op if particles are already attached (`inst._front_cloud_fx` exists).

### `DetachParticles()`
* **Description:** Removes the front and back smoke FX entities and their embers.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnInstantParticles()`
* **Description:** Emits 10 initial particles immediately (used for fast-forwarding or immediate visual response).
* **Parameters:** None.
* **Returns:** Nothing.

### `FastForwardParticles(fast_forward)`
* **Description:** Advances the VFX effect timeline by `fast_forward` seconds to skip the fade-in.
* **Parameters:** `fast_forward` (number) — seconds to fast-forward.
* **Returns:** Nothing.

### `ClearParticles()`
* **Description:** Clears all currently emitted particles from the VFX effect.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartAllWatchers()`
* **Description:** Begins the periodic task (`OnUpdate`) that checks which entities enter/exit the miasma radius and updates `miasmawatcher` components accordingly. Only called on the master simulation.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopAllWatchers()`
* **Description:** Cancels the periodic task and removes all entities from watcher lists, invoking `RemoveMiasmaSource` on each. Only called on the master simulation.
* **Parameters:** None.
* **Returns:** Nothing.

### `ClearWatcherTable(tbl)`
* **Description:** Clears all entries in a watcher table and invokes `RemoveMiasmaSource` for each valid entity.
* **Parameters:** `tbl` (table) — map of `{ [entity] = true }`.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` — triggers `OnRemove_Client` to remove the FX from `_MiasmaCloudEntities`.  
  - `"diminishingdirty"` — triggers `OnDiminishingDirty` to attach/detach ember effects based on fire proximity.  
- **Pushes (via `TheWorld`):**  
  - `"miasmacloudexists"` — fired with `true` when first miasma cloud spawns and `false` when the last one is removed.