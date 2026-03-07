---
id: wormlight
title: Wormlight
description: Manages the lifecycle and visual effects of a consumable light source that transfers to a player or creature upon eating, providing light while it lasts before extinguishing.
tags: [light, consumable, spell, perishable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a79a1d9c
system_scope: entity
---

# Wormlight

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wormlight.lua` defines the `wormlight` and related prefabs that implement a consumable light source in DST. When eaten, it spawns a temporary light entity attached to the eater via a `spell` component. The light entity follows the eater (or their rider/inventory container) and modulates bloom effects on the target's animation. It manages a fade-out visual progression using a dedicated FX prefab and handles cleanup when the spell expires or the target dies. It also defines lesser and greater variants with differing durations and stats.

## Usage example
```lua
-- Example usage in a mod to spawn a standard wormlight item
local inst = SpawnPrefab("wormlight")
inst.Transform:SetPosition(x, y, z)
inst.components.inventoryitem:Pickup(some_entity)

-- When eaten, it automatically creates and attaches a light to the eater
-- No further action needed — the component handles light spawning and tracking
```

## Dependencies & tags
**Components used:** `bloomer`, `edible`, `fuel`, `inventoryitem`, `perishable`, `rideable`, `spell`, `stackable`, `inspectable`, `tradable`, `vasedecoration`  
**Tags:** `lightbattery`, `vasedecoration`, `light`, `FX`, `NOCLICK`

## Properties
No public properties are exposed in the constructor. All behavior is implemented via functions and component interaction.

## Main functions
### `create_light(eater, lightprefab)`
* **Description:** Spawns a light entity associated with a `spell` component and binds it to the eater. If an existing light of the same type exists, it resets and resumes the spell; if of a different type, it finishes the old one first.
* **Parameters:**  
  `eater` (entity instance) — the entity that ate the wormlight and will become the spell's target.  
  `lightprefab` (string) — name of the light prefab to spawn (`"wormlight_light"` or `"wormlight_light_lesser"`).
* **Returns:** Nothing.
* **Error states:** Returns early without creating light if `eater.wormlight` exists and matches the requested prefab, or if spawned light is invalid.

### `item_oneaten(inst, eater)` / `lesseritem_oneaten(inst, eater)`
* **Description:** Callbacks invoked when the item is eaten. Delegates to `create_light` with appropriate prefabs.
* **Parameters:**  
  `inst` (entity) — the eaten wormlight item.  
  `eater` (entity) — the entity consuming the item.
* **Returns:** Nothing.

### `item_commonfn(bank, build, masterfn)`
* **Description:** Shared constructor for wormlight items (`wormlight`, `wormlight_lesser`). Sets up transforms, animations, lighting, physics, and core components including `edible`, `fuel`, `perishable`, and `stackable`.
* **Parameters:**  
  `bank` (string) — anim bank name.  
  `build` (string) — anim build name.  
  `masterfn` (function, optional) — per-item customization hook.
* **Returns:** The created item entity instance.
* **Error states:** Returns a minimal entity on clients if `TheWorld.ismastersim` is `false`.

### `light_commonfn(duration, fxprefab)`
* **Description:** Shared constructor for light prefabs (`wormlight_light`, `wormlight_light_lesser`, `wormlight_light_greater`). Configures the `spell` component and spawns the FX helper. Manages tracking of owner hierarchy (including riders/inventory owners) to keep the light properly parented.
* **Parameters:**  
  `duration` (number) — total spell duration in seconds.  
  `fxprefab` (string) — FX prefab name to spawn (e.g., `"wormlight_light_fx"`).
* **Returns:** The created light entity instance.

### `lightfx_commonfn(duration)`
* **Description:** Shared constructor for the visual FX prefabs (`wormlight_light_fx`, etc.). Sets up networked frame tracking and light radius decay logic, and defines `setprogress` and `setdead` methods.
* **Parameters:**  
  `duration` (number) — total light fade duration in seconds.
* **Returns:** The FX entity instance.

### `setprogress(inst, percent)`
* **Description:** Sets the light fade progress (0 = fully bright, 1 = fully faded) and triggers a visual update.
* **Parameters:**  
  `inst` (entity) — the FX instance.  
  `percent` (number) — value between `0` and `1`.
* **Returns:** Nothing.

### `setdead(inst)`
* **Description:** Flags the light as dead and locks the current frame, halting decay animation.
* **Parameters:**  
  `inst` (entity) — the FX instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove` — on target entity, to finish the spell; on target entity, to remove light FX; on eater/inventory owner, to recompute owner chain.  
  - `death` — on target, to set FX to dead state.  
  - `ms_becameghost` — on players, to finish spell.  
  - `ms_overcharge` — on players with `electricdamageimmune`, to finish spell.  
  - `riderchanged`, `onputininventory`, `ondropped` — on owner entities, to update owner chain tracking.  
  - `lightdirty` — on client FX entities, to refresh light frame.

- **Pushes:**  
  - None directly; relies on spell lifecycle (`OnFinish`) and event callbacks for cleanup.