---
id: fireflies
title: Fireflies
description: Manages the lifecycle, lighting behavior, and gameplay interactions of fireflies, including fading animations, workability, and inventory handling.
tags: [environment, lighting, inventory, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 11966633
system_scope: environment
---

# Fireflies

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fireflies` is a prefab definition that creates a lightweight, dynamic entity used primarily as a collectible item and light source in DST. It manages client-side lighting modulation via fading animations and server-side gameplay logic (e.g., workability, pickup, stacking, and hauntable interactions). The entity reacts to player proximity and world state (`isnight`) to control its active state—fading in when near a player at night and fading out otherwise.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddPhysics()
inst.entity:AddLight()
inst.entity:AddNetwork()

-- Load the fireflies prefab logic
inst:DoTaskInTime(0, function() 
    local firefly = Prefab("fireflies", nil, nil):Spawn(inst:GetPosition())
end)
```

## Dependencies & tags
**Components used:**  
- `playerprox`  
- `inspectable`  
- `workable`  
- `stackable`  
- `inventoryitem`  
- `tradable`  
- `fuel`  
- `hauntable`

**Tags:**  
- Adds: `firefly`, `cattoyairborne`, `flying`, `NOBLOCK`, `NOCLICK`  
- Checks: `NOCLICK` (removes/adds based on fade state)

## Properties
No public properties are exposed directly. Internal reactive values are managed via replicated network variables:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._fadeval` | `net_float` | `0` | Tracks current light intensity (0 to `INTENSITY`). |
| `inst._faderate` | `net_smallbyte` | `0` | Controls fade direction/rate (0 = none, `<0` = fade out, >0 = fade in). |

## Main functions
### `fadein(inst)`
*   **Description:** Triggers the firefly to fade in: enables light and animation (`swarm_loop`), removes `NOCLICK` tag, and enables workability. Called when player proximity and night state justify activation.
*   **Parameters:** `inst` (Entity) — the firefly instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if already in fade-in state or not mastersim when expecting server-side state changes.

### `fadeout(inst)`
*   **Description:** Triggers the firefly to fade out: plays `swarm_pst` animation, disables light, adds `NOCLICK` tag, disables workability, and waits before scheduling `disablework`.
*   **Parameters:** `inst` (Entity) — the firefly instance.
*   **Returns:** Nothing.
*   **Error states:** No-op if already fading out or not mastersim.

### `updatefade(inst, rate)`
*   **Description:** Applies incremental light intensity changes over time to animate fading in/out smoothly. Uses `inst._fadeval` and synchronizes client lighting via `inst.Light:SetIntensity`.
*   **Parameters:**  
  - `inst` (Entity) — the firefly instance.  
  - `rate` (number) — intensity delta per frame; derived from `resolvefaderate`.  
*   **Returns:** Nothing.
*   **Error states:** Stops task and resets when intensity reaches bound (`0` or `INTENSITY`); on master, adds `NOCLICK` tag and disables light when fade completes at `0`.

### `resolvefaderate(x)`
*   **Description:** Computes the fade rate (intensity change per frame) based on `_faderate` value. Returns a rate in (0, positive] for fade-in, negative for fade-out, or `0` for no change.
*   **Parameters:** `x` (number) — the current `_faderate` value (`0`, `1..31`, or `32..63`).  
*   **Returns:** number — calculated fade rate.
*   **Error states:** None; uses precomputed constants (`INTENSITY`, `FRAMES`) and clamp logic.

### `updatelight(inst)`
*   **Description:** Re-evaluates whether the firefly should be active based on night status and player proximity. Invokes `fadein` or `fadeout` as appropriate.
*   **Parameters:** `inst` (Entity) — the firefly instance.  
*   **Returns:** Nothing.

### `ondropped(inst)`
*   **Description:** Callback for inventory item drop event. Resets work left, triggers immediate fade-out, then schedules a delayed `updatelight` call.
*   **Parameters:** `inst` (Entity) — the firefly instance.  
*   **Returns:** Nothing.

### `onputininventory(inst)`
*   **Description:** Callback for inventory insert event. Immediately disables fade task, light, and animation; sets intensity to `0`.
*   **Parameters:** `inst` (Entity) — the firefly instance.  
*   **Returns:** Nothing.

### `getstatus(inst)`
*   **Description:** Returns `"HELD"` when the firefly is held by a player; otherwise returns `nil`.
*   **Parameters:** `inst` (Entity) — the firefly instance.  
*   **Returns:** `"HELD"` or `nil`.

## Events & listeners
- **Listens to:**  
  - `onfaderatedirty` — triggers re-computation of fade state via `OnFadeRateDirty` (client-side only).  
  - `isnight` — triggers `updatelight` after delay via `OnIsNight`.  

- **Pushes:**  
  - `onfaderatedirty` — implicitly triggered via `inst._faderate:set(...)` (see networked variable binding).