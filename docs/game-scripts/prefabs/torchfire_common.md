---
id: torchfire_common
title: Torchfire Common
description: Provides utilities for creating and managing torchlight entities with animated fire effects, networked light range controls, and parented light synchronization.
tags: [fx, light, network, prefab]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b584a191
system_scope: fx
---

# Torchfire Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`torchfire_common` is a utility module that defines a factory function (`MakeTorchFire`) for generating torch-related prefabs. It handles creation of a visual fire entity with associated sound, transform, and light components, plus support for networked light range adjustments. The entity is non-persistent (`persists = false`), tagged as `FX`, and includes mechanisms to attach and detach its internal light to parent entities (e.g., player characters), ensuring correct lighting behavior across client and server.

## Usage example
```lua
-- Example usage in a torch prefab definition
local common_postinit = function(inst)
    -- Add custom animations or logic if needed
end

return MakeTorchFire(
    "torchfire",
    nil, -- customassets
    nil, -- customprefabs
    common_postinit,
    nil, -- master_postinit
    { hasanimstate = true, sfx_torchloop = "dontstarve/wilson/torch_LP" }
)
```

## Dependencies & tags
**Components used:** None identified (uses only core engine methods like `CreateEntity()`, `inst:AddTag()`, and network utilities `net_tinybyte`).  
**Tags:** Adds `FX` to all created instances and conditionally adds/removes `playerlight` on the internal `_light` entity based on the parent.

## Properties
No public properties.

## Main functions
### `MakeTorchFire(name, customassets, customprefabs, common_postinit, master_postinit, overridedata)`
* **Description:** Factory function that returns a `Prefab` for a torchfire entity. It configures the entity with sound, transform, network, and light components, and sets up internal helper methods like `SetLightRange` and `AttachLightTo`.
* **Parameters:**
  * `name` (string) – Prefab name (e.g., `"torchfire"`).
  * `customassets` (table or nil) – Optional array of additional asset definitions.
  * `customprefabs` (table or nil) – Optional array of dependent prefabs.
  * `common_postinit` (function or nil) – Callback applied on both client and server after base initialization.
  * `master_postinit` (function or nil) – Callback applied only on the master simulation (server) after full setup.
  * `overridedata` (table or nil) – Optional configuration with keys: `hasanimstate` (boolean), `sfx_torchloop` (string).
* **Returns:** `Prefab` – A prefabricated entity definition ready for registration.
* **Error states:** None — all parameters are optional and safely handled.

### `SetLightRange(inst, value)`
* **Description:** Updates the torch’s light radius and falloff based on the `value` (index into `TUNING.TORCH_RADIUS` and `TUNING.TORCH_FALLOFF`). Only callable on the master (server).
* **Parameters:** `inst` (entity) – Torch instance; `value` (number) – Index of the tuning array to use.
* **Returns:** Nothing.
* **Error states:** No-op if `value` equals the current `_lightrange` value.

### `AttachLightTo(inst, target)`
* **Description:** Reparents the internal `_light` entity to the `target` entity and updates its `playerlight` tag based on whether the target has the `"player"` tag.
* **Parameters:** `inst` (entity) – Torch instance; `target` (entity) – Entity to which the light will be attached.
* **Returns:** Nothing.

### `CreateLight()`
* **Description:** Internal helper that creates a non-persistent FX entity configured with light settings matching `TUNING.TORCH_RADIUS` and `TUNING.TORCH_FALLOFF`. Used to initialize `inst._light`.
* **Parameters:** None.
* **Returns:** `Entity` – A configured light entity with intensity `0.75` and RGB colour `(180, 195, 150)` normalized to `[0,1]`.

## Events & listeners
- **Listens to:** `lightrangedirty` – Triggered on the client when the server updates the `torch._lightrange` network variable; updates local light radius and falloff.
- **Pushes:** No events directly; but triggers network updates via `inst._lightrange:set(value)` (which internally fires `"lightrangedirty"`).