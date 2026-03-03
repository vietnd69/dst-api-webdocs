---
id: acidinfusible
title: Acidinfusible
description: Applies and removes an acid infusion effect based on world rain state and entity rain immunity, adjusting combat stats, movement speed, and visual effects accordingly.
tags: [combat, environment, entity, effect, weather]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: af1499f6
system_scope: environment
---

# Acidinfusible

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Acidinfusible` manages the acid infusion state for an entity. The entity becomes infused when the world is in an acid rain state and the entity does not have rain immunity (unless configured otherwise). Infusion modifies outgoing damage, damage taken, and movement speed via the `combat` and `locomotor` components, while also spawning a child entity (`acidsmoke_fx`) for visual feedback. It responds dynamically to changes in world state and rain immunity status.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("acidinfusible")

-- Configure modifiers for when acid-infused
inst.components.acidinfusible:SetDamageMultiplier(1.5)
inst.components.acidinfusible:SetDamageTakenMultiplier(0.8)
inst.components.acidinfusible:SetSpeedMultiplier(0.9)

-- Optional: custom callbacks
inst.components.acidinfusible:SetOnInfuseFn(function(e) print(e .. " is infused") end)
inst.components.acidinfusible:SetOnUninfuseFn(function(e) print(e .. " is no longer infused") end)

-- Optionally disable rain immunity check (always follow world state)
inst.components.acidinfusible:SetUseRainImmunity(false)
```

## Dependencies & tags
**Components used:** `combat`, `locomotor`, `rainimmunity`, `replicaacidinfusible`
**Tags:** None added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `infused` | boolean | `false` | Whether the entity is currently acid-infused. |
| `userainimmunity` | boolean | `true` | Whether rain immunity should prevent acid infusion. |
| `fxlevel` | number | `1` |FX level for the spawned `acidsmoke_fx`. |
| `damagemult` | number or `nil` | `nil` | Damage multiplier applied when infused (via `combat.externaldamagemultipliers`). |
| `damagetakenmult` | number or `nil` | `nil` | Damage taken multiplier applied when infused (via `combat.externaldamagetakenmultipliers`). |
| `speedmult` | number or `nil` | `nil` | Speed multiplier applied when infused (via `locomotor`). |
| `on_infuse_fn` | function or `nil` | `nil` | Callback invoked when infusion begins. |
| `on_uninfuse_fn` | function or `nil` | `nil` | Callback invoked when infusion ends. |
| `_fx` | Entity or `nil` | `nil` | Internal reference to the spawned `acidsmoke_fx` child. |

## Main functions
### `SetDamageMultiplier(n)`
* **Description:** Sets the outgoing damage multiplier to apply when infused. Immediately updates the `combat` component if currently infused.
* **Parameters:** `n` (number or `nil`) — multiplier value; `nil` removes the modifier.
* **Returns:** Nothing.
* **Error states:** No-op if `combat` component is missing.

### `SetDamageTakenMultiplier(n)`
* **Description:** Sets the damage taken multiplier to apply when infused. Immediately updates the `combat` component if currently infused.
* **Parameters:** `n` (number or `nil`) — multiplier value; `nil` removes the modifier.
* **Returns:** Nothing.
* **Error states:** No-op if `combat` component is missing.

### `SetSpeedMultiplier(n)`
* **Description:** Sets the movement speed multiplier to apply when infused. Immediately updates the `locomotor` component if currently infused.
* **Parameters:** `n` (number or `nil`) — multiplier value; `nil` removes the modifier.
* **Returns:** Nothing.
* **Error states:** No-op if `locomotor` component is missing.

### `SetMultipliers(tuning)`
* **Description:** Convenience method to set all multipliers at once using a table. Accepts `DAMAGE`, `DAMAGE_TAKEN`, and `SPEED` keys. Passes `CLEARED_VALUES` (all `nil`) by default.
* **Parameters:** `tuning` (table or `nil`) — table with optional keys `DAMAGE`, `DAMAGE_TAKEN`, `SPEED`.
* **Returns:** Nothing.

### `SetOnInfuseFn(fn)`
* **Description:** Assigns a callback function invoked when the entity becomes infused.
* **Parameters:** `fn` (function or `nil`) — callback accepting `inst` as argument.
* **Returns:** Nothing.

### `SetOnUninfuseFn(fn)`
* **Description:** Assigns a callback function invoked when the entity loses infusion.
* **Parameters:** `fn` (function or `nil`) — callback accepting `inst` as argument.
* **Returns:** Nothing.

### `SetUseRainImmunity(userainimmunity)`
* **Description:** Configures whether rain immunity prevents acid infusion. Triggers re-evaluation if changed.
* **Parameters:** `userainimmunity` (boolean) — whether to respect rain immunity status.
* **Returns:** Nothing.

### `SetFXLevel(level)`
* **Description:** Sets the visual FX level for the acid smoke effect; updates existing FX immediately if present.
* **Parameters:** `level` (number) — integer level for the `acidsmoke_fx`.
* **Returns:** Nothing.

### `IsInfused()`
* **Description:** Returns the current infusion state.
* **Parameters:** None.
* **Returns:** `true` if the entity is currently acid-infused, otherwise `false`.

### `OnInfuse()`
* **Description:** Applies the configured multipliers and spawns FX. Called internally when transitioning to infused state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUninfuse()`
* **Description:** Removes the configured multipliers and kills FX. Called internally when transitioning out of infused state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInfusedDirty(acidraining, hasrainimmunity)`
* **Description:** Evaluates whether the entity should be infused based on world acid rain state and rain immunity. Triggers `OnInfuse()` or `OnUninfuse()` as needed.
* **Parameters:**  
  - `acidraining` (boolean) — current world acid rain state.  
  - `hasrainimmunity` (boolean) — whether the entity currently has rain immunity.
* **Returns:** Nothing.

### `SpawnFX()`
* **Description:** Creates and configures the `acidsmoke_fx` child entity.
* **Parameters:** None.
* **Returns:** Nothing.

### `KillFX()`
* **Description:** Removes the `acidsmoke_fx` child entity, scheduling safe removal at animation end.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a debug-readable string summarizing the infusion state.
* **Parameters:** None.
* **Returns:** String `"INFUSED: true"` or `"INFUSED: false"`.

## Events & listeners
- **Listens to:**  
  - `isacidraining` (via `WatchWorldState`) — triggers update when world acid rain state changes.  
  - `gainrainimmunity` — re-evaluates infusion status upon gaining rain immunity.  
  - `loserainimmunity` — re-evaluates infusion status upon losing rain immunity.
- **Pushes:** None.
