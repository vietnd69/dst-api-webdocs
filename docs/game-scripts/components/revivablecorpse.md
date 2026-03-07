---
id: revivablecorpse
title: Revivablecorpse
description: Manages whether an entity can be revived from its corpse state and controls revive behavior, including health restoration and speed modifiers based on reviver tags.
tags: [combat, death, ai, network]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d6e989bc
system_scope: entity
---

# RevivableCorpse

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RevivableCorpse` enables and controls the revival of entities from their corpse state. It supports both master simulation (server-side logic for revival mechanics) and client-side usage (e.g., UI feedback for local player). The component checks if revival is permissible via a customizable predicate function, applies tag-based speed multipliers, and triggers a `respawnfromcorpse` event upon revival. It manages the `corpse` tag and maintains per-reviver revive speed multipliers.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("player")
inst:AddComponent("revivablecorpse")

-- Define custom revive eligibility (e.g., only if reviver is a pig)
inst.components.revivablecorpse:SetCanBeRevivedByFn(function(corpse, reviver)
    return reviver:HasTag("pig")
end)

-- Set revive health to full
inst.components.revivablecorpse:SetReviveHealthPercent(1.0)

-- Apply a 1.5x revive speed bonus for beefalo revivers
inst.components.revivablecorpse:SetReviveSpeedMultForTag("beefalo", 1.5)

-- Trigger revival
inst.components.revivablecorpse:Revive(some_reviver)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `corpse` (server-side via `SetCorpse(true)`), removes `corpse` (via `SetCorpse(false)`), checks `corpse` and reviver tags for revival logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity owning this component. |
| `ismastersim` | boolean | — | Whether the component is running in master simulation (server) context. |
| `canberevivedbyfn` | function or `nil` | `nil` | Optional predicate function `(corpse, reviver) → boolean` to determine revive eligibility. |
| `revive_health_percet` | number | `0.5` | Health percentage to restore upon revival (server-side only). |
| `revivespeedmult` | number | `1` | Base revive speed multiplier (server-side only). |
| `tagmults` | table or `nil` | `nil` | Map of `{ tag = multiplier }` for per-tag speed bonuses (server-side only). |

## Main functions
### `SetCanBeRevivedByFn(fn)`
*   **Description:** Sets the custom function used to determine whether a given reviver can revive this corpse. If `nil`, revival is allowed for any reviver (subject to the `corpse` tag).  
*   **Parameters:** `fn` (function or `nil`) – A function `(corpse: Entity, reviver: Entity) → boolean`.  
*   **Returns:** Nothing.  
*   **Error states:** N/A.

### `CanBeRevivedBy(reviver)`
*   **Description:** Checks if the entity can be revived by a given reviver.  
*   **Parameters:** `reviver` (Entity) – The potential reviver.  
*   **Returns:** `boolean` – `true` if `inst` has the `corpse` tag and either `canberevivedbyfn` is `nil` or it returns `true`; `false` otherwise.  
*   **Error states:** N/A.

### `SetReviveSpeedMult(mult)`
*   **Description:** Sets the base revive speed multiplier (server-side only).  
*   **Parameters:** `mult` (number) – The speed multiplier to apply.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `ismastersim` is `false`.

### `SetReviveSpeedMultForTag(tag, mult)`
*   **Description:** Configures a tag-specific revive speed multiplier. Supports additive or multiplicative bonuses (e.g., for a specific reviver type).  
*   **Parameters:**  
    * `tag` (string) – The reviver tag to match.  
    * `mult` (number or `nil`) – The multiplier to apply if `reviver:HasTag(tag)`. Pass `nil` or `1` to remove an entry.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `ismastersim` is `false`.

### `GetReviveSpeedMult(reviver)`
*   **Description:** Computes the total revive speed multiplier for a given reviver by combining the base multiplier with any tag-specific bonuses.  
*   **Parameters:** `reviver` (Entity) – The reviver whose revive speed should be calculated.  
*   **Returns:** `number` – The computed multiplier (e.g., `1.0 * 1.5 = 1.5` if a tag matches).  
*   **Error states:** If `tagmults` is `nil`, returns only `revivespeedmult`.

### `SetCorpse(corpse)`
*   **Description:** Sets or removes the `corpse` tag on the entity (server-side only), controlling revival eligibility.  
*   **Parameters:** `corpse` (boolean) – If `true`, adds the `corpse` tag; if `false`, removes it.  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `ismastersim` is `false`.

### `Revive(reviver)`
*   **Description:** Triggers the respawn process by firing the `respawnfromcorpse` event on the entity (server-side only).  
*   **Parameters:** `reviver` (Entity) – The reviver entity (passed in the event data as `source` and `user`).  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `ismastersim` is `false`.

### `SetReviveHealthPercent(percent)`
*   **Description:** Sets the fraction of health restored upon revival (server-side only).  
*   **Parameters:** `percent` (number) – A value between `0` and `1` (e.g., `0.5` for 50% health).  
*   **Returns:** Nothing.  
*   **Error states:** No effect if `ismastersim` is `false`.

### `GetReviveHealthPercent()`
*   **Description:** Returns the currently configured health restoration fraction (server-side only).  
*   **Parameters:** None.  
*   **Returns:** `number` – The health percentage (e.g., `0.5`).  
*   **Error states:** Returns `nil` if `ismastersim` is `false`.

## Events & listeners
- **Pushes:** `respawnfromcorpse` – Fired during `Revive()` with `{ source = reviver, user = reviver }`. Usually handled by the `respawner` component or custom respawn logic.
