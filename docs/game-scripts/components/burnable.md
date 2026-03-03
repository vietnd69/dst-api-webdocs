---
id: burnable
title: Burnable
description: Manages the burning and smoldering state of an entity, including fire effects, propagation, fuel consumption, and lifecycle hooks.
tags: [fire, state, propagation, effects]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b6632502
system_scope: entity
---

# Burnable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Burnable` is a core component that governs the ignition, sustained burning, and smoldering behavior of an entity. It manages fire effects (via `firefx`), integrates with `propagator` for heat spread, interacts with `fueled` for consumption control, and coordinates damage timing through the `health` component. It exposes customizable callbacks for ignition, extinction, smoldering transitions, and final burn-out events. The component also supports *controlled burns* (skill-modified) and *smothering* actions (e.g., via items like the Fire Stick).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("burnable")
inst:AddTag("burnable")
inst:AddTag("ignitable")

-- Configure custom callbacks
inst.components.burnable:SetOnIgniteFn(function() print("Lit!") end)
inst.components.burnable:SetOnExtinguishFn(function() print("Out!") end)

-- Start smoldering or ignite directly
inst.components.burnable:StartWildfire()
inst.components.burnable:Ignite()
```

## Dependencies & tags
**Components used:** `combat`, `diseaseable`, `explosive`, `finiteuses`, `firefx`, `fueled`, `health`, `heater`, `propagator`, `rainimmunity`, `skilltreeupdater`, `stackable`  
**Tags:** Adds/removes tags dynamically: `fire`, `smolder`, `canlight`, `nolight`, `burnableignorefuel`, `stokeablefire`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flammability` | number | `1` | Multiplier for how easily the entity ignites. Not directly used in this file; intended for external callers. |
| `burning` | boolean | `false` | Whether the entity is currently burning. |
| `smoldering` | boolean | `false` | Whether the entity is currently smoldering (precursor to burning). |
| `burntime` | number? | `nil` | Optional fixed time until the entity finishes burning; overrides default logic. |
| `extinguishimmediately` | boolean | `true` | If `true`, calling `Extinguish` or auto-burn completion triggers immediate `Extinguish()` (vs delayed). |
| `stokeablefire` | boolean | `false` | Indicates if the fire can be stoked (converted to uncontrolled) via `StokeControlledBurn`. |
| `controlled_burn` | table? | `nil` | Non-`nil` when currently a controlled burn; contains `duration_creature` and `damage` multipliers. |
| `canlight` | boolean | `true` | Controls presence of `canlight`/`nolight` tags and lighting logic. |
| `ignorefuel` | boolean | (not set by default) | If set to `true`, ignition/extinguishing won't affect `fueled` consumption. |
| `fastextinguish` | boolean | `false` (set temporarily during entity removal) | Enables faster extinguish animation when available. |
| `smoldertimeremaining` | number? | `nil` | Remaining smolder time in seconds; used to determine transition to actual burning. |
| `fxdata` | table | `{}` | List of effect descriptors (prefabs, offsets, follow symbols) for fire FX. |
| `fxchildren` | table | `{}` | Active FX entities spawned for burning (e.g., fire prefabs). |
| `fxoffset` | Vector3? | `nil` | Global offset added to all FX positions. |
| `fxlevel` | number | `1` | Base intensity level for fire effects (affects radius, color, sound). |

## Main functions
### `Ignite(immediate, source, doer)`
*   **Description:** Ignites the entity, spawning fire FX and starting propagation/fuel consumption. Supports controlled burns if `doer` or `source` has tag `controlled_burner`.  
*   **Parameters:**  
    - `immediate` (boolean) – Controls whether FX animations start instantly or with a pre-transition.  
    - `source` (entity?) – The entity that caused ignition (e.g., match).  
    - `doer` (entity?) – The actor performing ignition (used for controlled burn logic).  
*   **Returns:** Nothing.  
*   **Error states:** Early exit if already burning or `fireimmune` tag is present.

### `Extinguish(resetpropagator, heatpct, smotherer)`
*   **Description:** Extinguishes the fire, stopping propagation, halting fuel consumption, and removing all fire FX.  
*   **Parameters:**  
    - `resetpropagator` (boolean) – Whether to reset propagator state (default: `false`).  
    - `heatpct` (number?) – Heat percentage to preserve in propagator after stopping spread.  
    - `smotherer` (entity?) – Optional item/entity used to smother fire; deducts uses/stack/health.  
*   **Returns:** Nothing.

### `StartWildfire()`
*   **Description:** Initiates smoldering phase before full ignition. Spawns a `smoke_plant` FX and starts a periodic timer that reduces `smoldertimeremaining` based on local heat and rain. Upon timer expiry, triggers `Ignite()`.  
*   **Parameters:** None.  
*   **Returns:** Nothing.  
*   **Error states:** Early exit if already burning, smoldering, or `fireimmune`.

### `StopSmoldering(heatpct)`
*   **Description:** Cancels the smoldering phase and cleans up associated FX (e.g., smoke). Updates the `propagator` component with leftover heat.  
*   **Parameters:**  
    - `heatpct` (number?) – Heat percentage to restore in the propagator component.  
*   **Returns:** Nothing.

### `SetOnIgniteFn(fn)`
*   **Description:** Sets a callback invoked when ignition completes. Signature: `function(inst, source, doer)`.  
*   **Parameters:** `fn` (function) – Custom function to call.  
*   **Returns:** Nothing.

### `SetOnExtinguishFn(fn)`
*   **Description:** Sets a callback invoked when extinguishing completes. Signature: `function(inst)`.  
*   **Parameters:** `fn` (function) – Custom function to call.  
*   **Returns:** Nothing.

### `SetOnBurntFn(fn)`
*   **Description:** Sets a callback invoked when burning finishes (after `DoneBurning` internal logic). Wraps internal cleanup (e.g., lunar hail removal) for modders. Signature: `function(inst)`.  
*   **Parameters:** `fn` (function) – Custom function to call.  
*   **Returns:** Nothing.

### `SetOnSmolderingFn(fn)`
*   **Description:** Sets a callback invoked when smoldering starts. Signature: `function(inst)`.  
*   **Parameters:** `fn` (function) – Custom function to call.  
*   **Returns:** Nothing.

### `SetOnStopSmolderingFn(fn)`
*   **Description:** Sets a callback invoked when smoldering ends (via `StopSmoldering`). Signature: `function(inst)`.  
*   **Parameters:** `fn` (function) – Custom function to call.  
*   **Returns:** Nothing.

### `AddBurnFX(prefab, offset, followsymbol, followaschild, scale, followlayered)`
*   **Description:** Registers a fire effect prefab to spawn during burning. Effects can follow a symbol or be positioned absolutely.  
*   **Parameters:**  
    - `prefab` (string) – Name of the FX prefab to spawn.  
    - `offset` (Vector3) – Local position offset for the FX.  
    - `followsymbol` (string?) – Optional symbol name on the parent to follow.  
    - `followaschild` (boolean?) – If `true`, makes FX a direct child even when following.  
    - `scale` (number?) – Optional additional scale multiplier.  
    - `followlayered` (boolean?) – If `true`, respects layered transform for the symbol.  
*   **Returns:** Nothing.

### `SetFXLevel(level, percent)`
*   **Description:** Updates the intensity level of all active fire FX. Affects radius, color, sound, and animation.  
*   **Parameters:**  
    - `level` (number) – Target level index (1-based).  
    - `percent` (number) – Interpolation factor within the level (0.0–1.0); defaults to `1`.  
*   **Returns:** Nothing.

### `KillFX()`
*   **Description:** Removes all FX children, playing the extinguish animation if available (via `firefx.Extinguish`).  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `StokeControlledBurn()`
*   **Description:** Converts a controlled burn back to a standard burn, removing the controlled burn multiplier fields and disabling stokeability. Resets FX level to full.  
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `IsControlledBurn()`
*   **Description:** Returns whether the entity is currently undergoing a controlled burn.  
*   **Parameters:** None.  
*   **Returns:** boolean.

### `GetControlledBurn()`
*   **Description:** Returns the internal `controlled_burn` table (or `nil`). Contains `duration_creature` and `damage` multipliers.  
*   **Parameters:** None.  
*   **Returns:** table?.

### `CalculateControlledBurnDuration()`
*   **Description:** Returns the adjusted burn duration for a controlled burn, based on skill tree multipliers. Only valid if `controlled_burn.duration_creature` is set and a `health` component exists.  
*   **Parameters:** None.  
*   **Returns:** number? (duration multiplier).

### `IsBurning()`
*   **Description:** Returns whether the entity is currently burning.  
*   **Parameters:** None.  
*   **Returns:** boolean.

### `IsSmoldering()`
*   **Description:** Returns whether the entity is currently smoldering.  
*   **Parameters:** None.  
*   **Returns:** boolean.

### `GetDebugString()`
*   **Description:** Returns a human-readable status string for debugging: `"BURNING"`, `"SMOLDERING X.XX"`, or `"NOT BURNING"`.  
*   **Parameters:** None.  
*   **Returns:** string.

### `GetLargestLightRadius()`
*   **Description:** Computes the maximum light radius among all active fire FX children.  
*   **Parameters:** None.  
*   **Returns:** number? (`nil` if no FX children emit light).

## Events & listeners
- **Listens to:** `death` – triggers `OnKilled` to check for charring and sync burn FX with health destruction.
- **Pushes:** `onignite`, `onextinguish`, `onburnt`, `startfiredamage`, `changefiredamage`, `firedamage` (via propagation and `health` interaction).
