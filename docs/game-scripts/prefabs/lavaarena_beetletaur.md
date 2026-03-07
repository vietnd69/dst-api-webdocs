---
id: lavaarena_beetletaur
title: Lavaarena Beetletaur
description: Manages client-side visual effects and camera focus for the Lava Arena Beetletaur boss entity, including buff-indicator pulses, break FX, and flower-spawning logic.
tags: [fx, camera, boss, visual, lavaarena]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c2a6d7a6
system_scope: fx
---

# Lavaarena Beetletaur

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines the `lavaarena_beetletaur` prefab, which establishes the visual and behavioral logic for the Beetletaur boss in the Lava Arena event. It handles client-side FX (e.g., buff pulses, break animations, healing flowers), networked properties (`_bufftype`, `_camerafocus`), and integration with the `lavaarenamobtracker` and `focalpoint` components. The prefab spawns reusable FX prefabs for fossilized break animations and manages state-driven visual updates (e.g., buff pulses, camera focus) based on networked property changes.

## Usage example
The prefab is automatically instantiated by the game when spawning the Beetletaur boss in the Lava Arena. Modders can listen to its network events or override behavior via `master_postinit`, but typical usage is internal:

```lua
-- Example: registering custom behavior when the flower spawns
local function MyOnSpawnFlower(inst)
    -- Custom logic here
end

inst:ListenForEvent("beetletaur._spawnflower", MyOnSpawnFlower)

-- Example: enabling camera focus manually (server-side only)
if TheWorld.ismastersim then
    inst.EnableCameraFocus(true)
end
```

## Dependencies & tags
**Components used:** `lavaarenamobtracker` (`StartTracking`), `focalpoint` (`StartFocusSource`, `StopFocusSource`) via global `TheFocalPoint`.
**Tags:** Adds `LA_mob`, `monster`, `hostile`, `largecreature`, `epic`, `fossilizable`, `FX`, `DECOR`, `NOCLICK`, and `NOCLICK` (again) to FX entities.
**Networked properties:** `beetletaur._bufftype` (`net_tinybyte`), `beetletaur._camerafocus` (`net_bool`), `beetletaur._spawnflower` (`net_event`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_bufftype` | `net_tinybyte` | `0` | Networked buff type (`0`: none, `1`: fossilized, `2`: buffed). Triggers FX updates on change. |
| `_camerafocus` | `net_bool` | `false` | Networked flag indicating whether camera should focus on this entity. |
| `EnableCameraFocus` | function | `nil` (server only) | Server-side method to toggle camera focus on/off. |

## Main functions
### `EnableCameraFocus(enable)`
*   **Description:** Sets the `_camerafocus` networked property and triggers camera focus logic on the client. Should only be called on the server (`TheWorld.ismastersim`).
*   **Parameters:** `enable` (boolean) — whether to activate camera focus.
*   **Returns:** Nothing.
*   **Error states:** No-op if called on a dedicated server or if the value matches the current state.

### `CreateBreakFX()`
*   **Description:** Spawns a one-shot FX entity for fossilized break animation (audio + visual).
*   **Parameters:** None.
*   **Returns:** `Entity` — the FX entity instance.
*   **Error states:** Returns entity that self-removes on `"animover"`.

### `CreatePulse(bufftype)`
*   **Description:** Spawns a looping FX entity that animates for buff states (1 or 2). Supports manual termination via `KillFX`.
*   **Parameters:** `bufftype` (number) — `1` for fossilized, `2` for buffed (affects animation).
*   **Returns:** `Entity` — the FX entity instance.
*   **Error states:** FX is scheduled to respawn until manually killed via `KillFX()`.

### `OnSpawnFlower(inst)`
*   **Description:** Spawns and launches a healing flower FX from the parent entity.
*   **Parameters:** `inst` (Entity) — the parent entity triggering flower spawn.
*   **Returns:** Nothing (side effect only).
*   **Error states:** No effect if parent is removed before flower spawn completes.

## Events & listeners
- **Listens to:** `beetletaur._spawnflower` — triggers flower spawn logic (`OnSpawnFlower`).
- **Listens to (client):** `bufftypedirty` — updates buff FX (`OnBuffTypeDirty`).
- **Listens to (client):** `camerafocusdirty` — updates camera focus (`OnCameraFocusDirty`).
- **Pushes (networked):** `beetletaur._spawnflower` (via `net_event`) — triggers remote flower spawn.
- **Pushes (networked):** `bufftypedirty`, `camerafocusdirty` — triggered by `net_tinybyte`/`net_bool` changes.