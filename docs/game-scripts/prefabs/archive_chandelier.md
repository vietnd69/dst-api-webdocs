---
id: archive_chandelier
title: Archive Chandelier
description: A lighting entity that dynamically controls light intensity, flame FX, and sound based on power state and player proximity in the Archive or Vault zones.
tags: [lighting, fx, audio, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7ef74afe
system_scope: environment
---

# Archive Chandelier

> Based on game build **7140014** | Last updated: 2026-03-04

## Overview
The `archive_chandelier` prefab represents a decorative yet functional lighting fixture used in the Archive and Vault biomes. It supports smooth lighting transitions, animated flame FX, and ambient sound that scale with light intensity. Its power state is determined either by player proximity (`archive_chandelier`) or vault occupancy (`vault_chandelier`). The component integrates with `playerprox`, `hideout`, and `vaultroommanager` to control spawning behavior and power logic.

## Usage example
```lua
local chand = Prefab("my_chandelier", function() ... end)
inst:AddTag("archive_chandelier")
inst:AddComponent("playerprox")
inst.components.playerprox:SetDist(20, 23)
inst.components.playerprox:SetOnPlayerNear(updatelight)
inst.components.playerprox:SetOnPlayerFar(updatelight)
inst.components.hideout = inst.entity:GetComponent("hideout")
if inst.components.hideout then
    inst.components.hideout:StartSpawning()
end
```

## Dependencies & tags
**Components used:** `playerprox`, `hideout`, `archivemanager`, `vaultroommanager`  
**Tags:** `NOCLICK`, `FX`, `archive_chandelier`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `light_params` | table (indexed by `ON`/`OFF`) | `LIGHT_PARAMS` or `LIGHT_PARAMS_VAULT` | Light configuration for each phase (radius, intensity, falloff, colour, time). |
| `flamedata` | table of strings | `FLAMEDATA` | Animation symbol names for flame FX entities. |
| `widthscale` | number | `1` | Multiplier for light radius. |
| `_lightphase` | net_tinybyte | `OFF` | Networked phase state (`ON` or `OFF`). |
| `_lightlerp` | net_tinybyte | `0` | Client-side progress of light interpolation (0–7). |
| `_currentlight` | table | `copy of endlight` | Current interpolated light parameters. |
| `_startlight` | table | empty initially | Starting parameters for interpolation. |
| `_endlight` | table | `light_params[OFF]` | Target parameters for interpolation. |
| `_lighttask` | task or nil | `nil` | Task used for updating light interpolation. |
| `vaultpowered` | boolean | `false` | Whether this chandelier uses vault power logic (vault_chandelier only). |
| `variation` | number | `1` | Visual variant for vault chandeliers (vault_chandelier only). |
| `sfxprop` | entity or nil | `nil` | Non-networked sound controller entity. |
| `level` | number | `0` | Current sound intensity level (internal to `sfxprop`). |

## Main functions
### `CreateFireFx()`
* **Description:** Creates and configures a non-networked FX entity for flame animation.  
* **Parameters:** None.  
* **Returns:** Entity — an `AnimState`, `Follower`, `Transform` entity with "NOCLICK" and "FX" tags.  
* **Error states:** None.

### `CreateSfxProp()`
* **Description:** Creates a non-networked entity responsible for ambient fire sound playback and volume control.  
* **Parameters:** None.  
* **Returns:** Entity — a `SoundEmitter` entity with `SetSoundLevel()` method and `level` property.  
* **Error states:** None.

### `pushparams(inst, params)`
* **Description:** Applies light parameters to the entity's `Light` component and triggers flame FX updates. Optionally updates sound intensity via `sfxprop`.  
* **Parameters:**  
  - `inst` (entity) — the chandelier instance.  
  - `params` (table) — light parameters with `radius`, `intensity`, `falloff`, `colour`, `time`.  
* **Returns:** Nothing.  
* **Error states:** Light enable/disable is skipped on dedicated servers.

### `OnUpdateLight(inst, dt)`
* **Description:** Interpolates light properties over time and updates FX (flames and light override). Called by `_lighttask`.  
* **Parameters:**  
  - `inst` (entity) — the chandelier instance.  
  - `dt` (number) — time delta.  
* **Returns:** Nothing.  
* **Error states:** None.

### `OnLightPhaseDirty(inst)`
* **Description:** Triggers a light phase transition (ON↔OFF) and starts interpolation if the new phase differs from current.  
* **Parameters:** `inst` (entity) — the chandelier instance.  
* **Returns:** boolean — `true` if phase was changed and transition started.  
* **Error states:** Returns `nil`/`false` if target params are invalid or unchanged.

### `updatelight(inst)`
* **Description:** Determines whether the chandelier is powered based on world context and updates `_lightphase` accordingly.  
* **Parameters:** `inst` (entity) — the chandelier instance.  
* **Returns:** Nothing.  
* **Error states:** None.

### `archive_master_postinit(inst)`
* **Description:** Initializes `playerprox` and power event listeners for archive chandeliers.  
* **Parameters:** `inst` (entity) — the chandelier instance.  
* **Returns:** Nothing.  
* **Error states:** None.

### `vault_master_postinit(inst)`
* **Description:** Enables vault-specific behavior: sets `vaultpowered=true`, exposes `SetVariation`, and adds vault player event listeners.  
* **Parameters:** `inst` (entity) — the chandelier instance.  
* **Returns:** Nothing.  
* **Error states:** None.

### `vault_SetVariation(inst, variation)`
* **Description:** Switches visual variant for vault chandeliers by playing different animations.  
* **Parameters:**  
  - `inst` (entity) — the chandelier instance.  
  - `variation` (number) — variant ID (`1` or `2`).  
* **Returns:** `inst` — allows chaining.  
* **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `lightphasedirty` (client-side) — triggers `OnLightPhaseDirty`.  
  - `arhivepoweron` / `arhivepoweroff` (archive) — triggers `updatelight`.  
  - `ms_vaultroom_vault_playerleft` / `ms_vaultroom_vault_playerentered` (vault) — triggers `updatelight`.  
- **Pushes:**  
  - `lightphasedirty` — fired by `OnLightPhaseDirty` when `_lightphase` changes.