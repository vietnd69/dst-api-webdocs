---
id: sparks
title: Sparks
description: Generates particle-like light and sound effects (sparks) at a specified position, optionally with a flashing screen effect upon targeting.
tags: [fx, lighting, audio, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 93717cf4
system_scope: fx
---

# Sparks

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sparks` is a prefab factory that creates non-persistent FX entities for visual and audio feedback (e.g., impact sparks, electric hits). Each generated entity plays a spark animation, emits light, and optionally plays a sound. It supports two modes: simple static spark emission via `StartFX()`, and interactive targeting with screen flash via `AlignToTarget()`, which applies a temporary additive flash to the target using the `updatelooper` component. It relies on `colouradder` for flash blending and falls back to `AnimState:SetAddColour()` or `freezable:UpdateTint()` when needed.

## Usage example
```lua
-- Spawn generic sparks at an entity's position
local target = TheWorld.components.playerindex[1]
local attacker = TheWorld:GetPlayerEntity()
if target ~= nil and attacker ~= nil then
    local sparks = MakeSparks("sparks", "sparks", nil)
    local fx = sparks:Spawn()
    fx.AlignToTarget(target, attacker, true)
end
```

## Dependencies & tags
**Components used:**  
- `updatelooper` (added dynamically for flash effect)  
- `colouradder` (read via `target.components.colouradder`)  
- `freezable` (read via `target.components.freezable`)  

**Tags:** Adds `FX` to spawned FX entities.  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `i` | number | `.9` | Current light intensity; decremented over time. |
| `sound` | boolean | `true` if `SoundEmitter` exists | Whether to play a sound on first update. |
| `sound_to_play` | string | `nil` | Sound filename to play once. |
| `task` | DoTask | `nil` | Periodic task handle for light fade and sound playback. |
| `killfx` | boolean | `false` | Flag to remove entity when light fades. |
| `target` | Entity | `nil` | Target for screen flash effect (used only in flash mode). |
| `flash` | number | `1` | Flash intensity counter (for screen flash). |
| `blink` | number | `0` | Blink counter for pulsing flash effect. |
| `intensity` | number | `.1` or `.2` | Base flash intensity (larger if target has `largecreature` tag). |
| `OnRemoveEntity` | function | `nil` | Callback triggered when entity is removed (used for cleanup). |

## Main functions
### `StartFX(proxy, animindex, build, sound)`
* **Description:** Creates and spawns a short-lived FX entity (spark particle) at the proxy's position, playing a spark animation and light. The entity automatically removes itself after animation or fade-out.
* **Parameters:**  
  - `proxy` (Entity) — Source entity whose transform is copied; used for positioning.  
  - `animindex` (number) — Index appended to animation name (`sparks_X`).  
  - `build` (string) — Anim bank/build name (e.g., `"sparks"`, `"elec_hit_fx"`).  
  - `sound` (string) — Optional sound filename to play once.  
* **Returns:** Nothing.  
* **Error states:** None.

### `AlignToTarget(inst, target, attacker, flash)`
* **Description:** Positions the sparks FX at a point along the line between `target` and `attacker`, slightly offset from the target’s surface. If `flash` is `true`, it enables a screen flash effect that fades over time, updating the target’s additive colour via `colouradder` or `AnimState`.
* **Parameters:**  
  - `inst` (Entity) — The FX entity instance.  
  - `target` (Entity) — Entity being hit (for positioning and flash effect).  
  - `attacker` (Entity) — Source of hit (e.g., projectile or attacker entity).  
  - `flash` (boolean) — Whether to enable screen flash effect.  
* **Returns:** Nothing.  
* **Error states:** None; silently skips flash setup if `updatelooper` is already present.

### `OnUpdateFlash(inst)`
* **Description:** Updates the flash effect intensity per-frame: decreases `flash`, toggles `blink`, and applies additive colour to the target. Cleans up on completion.
* **Parameters:**  
  - `inst` (Entity) — The FX entity managing the flash.  
* **Returns:** Nothing.  
* **Error states:** Returns early if target is invalid or anim state missing; removes component and cleans up.

### `OnRemoveFlash(inst)`
* **Description:** Cleanup callback for flash effect when FX entity is removed mid-flash. Ensures additive colour is reset on the target.
* **Parameters:**  
  - `inst` (Entity) — The FX entity being removed.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `animover` — Fired on FX entity after animation completes; triggers removal if `killfx` is set.  
  - `randdirty` — Fired on networked spark prefab to spawn a random FX instance.  
- **Pushes:** None.