---
id: spider_web_spit
title: Spider Web Spit
description: A projectile entity that deal damage on impact or after a short delay when acid-infused.
tags: [combat, projectile, environment, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cfbaccbd
system_scope: combat
---

# Spider Web Spit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spider_web_spit` is a lightweight projectile prefab used in combat, primarily launched by spiders. It moves forward until it collides with a target or travels out of range, then removes itself. When acid-infused, it delays removal and spawns a visual FX before self-destructing. The component integrates with the `projectile` system via standard API calls (`SetSpeed`, `SetOnHitFn`, `SetOnMissFn`, etc.) and does not persist across sessions.

## Usage example
```lua
-- Create a base spider web spit
local spit = SpawnPrefab("spider_web_spit")
spit.Transform:SetPosition(inst.Transform:GetWorldPosition())
spit.components.projectile:SetSpeed(25)
spit.components.projectile:Thrown()

-- Create an acid-infused version (automatically uses custom OnHit/OnMiss)
local acid_spit = SpawnPrefab("spider_web_spit_acidinfused")
acid_spit.Transform:SetPosition(inst.Transform:GetWorldPosition())
acid_spit.components.projectile:Thrown()
```

## Dependencies & tags
**Components used:** `projectile`, `transform`, `animstate`, `soundemitter`, `network`  
**Tags:** Adds `projectile`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persists` | boolean | `false` | Whether the entity saves with the world; set to `false` so spit doesn’t persist across sessions. |

## Main functions
### `fn()`
*   **Description:** Constructor for the base `spider_web_spit` prefab. Initializes physics, animation, sound, and network state. Attaches and configures the `projectile` component.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — fully configured entity for base spit.
*   **Error states:** Returns early on non-master sim clients; no-op in single-player or client-only contexts.

### `fn_acidinfused()`
*   **Description:** Constructor for the acid-infused variant. Extends `fn()`, updating projectile range and replacing OnHit/OnMiss handlers to trigger a delayed FX explosion.
*   **Parameters:** None.
*   **Returns:** `inst` (Entity) — acid-infused spit entity.
*   **Error states:** Returns early on non-master sim clients.

### `OnThrown(inst)`
*   **Description:** Handler attached via `SetOnThrownFn`; listens for the `entitysleep` event to remove the entity if it falls asleep (e.g., via freezing).
*   **Parameters:** `inst` (Entity) — the spit entity.
*   **Returns:** Nothing.
*   **Error states:** None identified.

### `AcidInfused_Explode(inst, fx_target)`
*   **Description:** Internal helper for acid variant; spawns `round_puff_fx_sm` at `fx_target`’s position, then removes the spit.
*   **Parameters:**  
    * `inst` (Entity) — the acid spit entity.  
    * `fx_target` (Entity) — target where FX should spawn (may be `inst` itself).
*   **Returns:** Nothing.
*   **Error states:** Skips FX spawn if `fx_target:IsValid()` is `false`.

### `AcidInfused_OnHit(inst, attacker, target)`
*   **Description:** OnHit handler for acid variant. Triggers `AcidInfused_Explode` using the hit target.
*   **Parameters:**  
    * `inst` (Entity) — the acid spit.  
    * `attacker` (Entity) — launching entity (not used in handler).  
    * `target` (Entity) — hit target.
*   **Returns:** Nothing.

### `AcidInfused_OnMiss(inst, attacker, target)`
*   **Description:** OnMiss handler for acid variant. Triggers `AcidInfused_Explode` using the spit’s own position.
*   **Parameters:**  
    * `inst` (Entity) — the acid spit.  
    * `attacker` (Entity) — launching entity (not used in handler).  
    * `target` (Entity) — intended target (not used in handler).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `entitysleep` (via `OnThrown` callback) — removes the entity if it sleeps during flight.
- **Pushes:** None.