---
id: vault_torch
title: Vault Torch
description: Manages the operational states (normal, stuck, broken) and lighting behavior of the vault torch item in DST.
tags: [environment, lighting, state]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ac96622c
system_scope: environment
---

# Vault Torch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vault_torch` is a prefab that implements a controllable, environment-decorative light source with three operational states: normal, stuck-on, and broken. It uses the `machine` component for state persistence and state transitions, the `firefx` component for lighting and animation effects, and the `inspectable` component for status reporting. The torch supports state-specific animations, sound effects, and dynamic light levels depending on its condition (normal, stuck, or broken).

## Usage example
```lua
local torch = SpawnPrefab("vault_torch")
TheSim:AddEntity(torch)

-- Turn the torch on
torch.components.machine:TurnOn()

-- Simulate breaking the torch
torch:MakeBroken()

-- Restore it to normal operation
torch:MakeNormal()
```

## Dependencies & tags
**Components used:** `firefx`, `inspectable`, `machine`, `talker` (via `CheckStuckPlayerAction`), `soundemitter`, `animstate`, `transform`, `network`, `physics`.
**Tags:** Adds `FX` to flame entity (`"FX"` tag used for culling/selection).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_animdelay` | number \| nil | `nil` | Delay (in seconds) before animation sequences proceed, used to synchronize with player actions. |
| `_task` | Task \| nil | `nil` | Task handle for delayed state transitions (e.g., delayed flame spawn). |
| `fire` | Entity \| nil | `nil` | Reference to the spawned flame entity (`vault_torch_flame`). |
| `MakeStuckOn` | function | `nil` | State transition function to set torch to stuck-on mode. |
| `MakeStuckOff` | function | `nil` | State transition function to set torch to stuck-off mode. |
| `MakeBroken` | function | `nil` | State transition function to set torch to broken mode. |
| `MakeNormal` | function | `nil` | State transition function to restore torch to normal operation. |
| `IsStuck` | function | `nil` | Returns `true` if the torch is in stuck state. |
| `IsBroken` | function | `nil` | Returns `true` if the torch is in broken state. |
| `ToggleOnOff` | function | `nil` | Toggles the torch state (on/off) with animation delay. |
| `OnSave` | function | `nil` | Serialization function for save/restore. |
| `OnLoad` | function | `nil` | Deserialization function for save/restore. |

## Main functions
### `DoTurnOn(inst)`
*   **Description:** Instantiates and configures the flame entity when the torch is turned on. Applies appropriate `firefx` level based on state (broken: level 1, stuck: level 3, normal: level 2), attaches the light to the torch, and adds it as a child.
*   **Parameters:** `inst` (Entity) — the torch entity.
*   **Returns:** Nothing.
*   **Error states:** Creates new flame only if `inst.fire` is `nil`.

### `TurnOn(inst)`
*   **Description:** Initiates the torch turn-on animation sequence. Schedules `DoTurnOn` after a 0.2-second delay (or immediately if sleeping/populating).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Returns early if already animating to `idle_on` or `turn_on`.

### `BrokenTurnOn(inst)`
*   **Description:** Same as `TurnOn`, but uses broken-state animations (`broken_hit` → `broken_idle`) and sound. Used as `machine.turnonfn` when torch is broken.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `DoTurnOff(inst)`
*   **Description:** Handles torch flame extinguishing. Applies smoke-out animation, removes the flame after animation completes, and disables light rendering.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `TurnOff(inst)`
*   **Description:** Initiates the torch turn-off animation sequence. Schedules `DoTurnOff` after a 0.2-second delay (or immediately if sleeping/populating).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `BrokenTurnOff(inst)`
*   **Description:** Same as `TurnOff`, but uses broken-state animations. Used as `machine.turnofffn` when torch is broken.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StuckCantTurnOn(inst)`
*   **Description:** Forces torch to *stuck-off* state when user attempts to turn it on while stuck. Plays stuck sound and message, then calls `machine:TurnOff()` to cancel action.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `StuckCantTurnOff(inst)`
*   **Description:** Forces torch to *stuck-on* state when user attempts to turn it off while stuck. Plays stuck sound and message, then calls `machine:TurnOn()` to cancel action.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeStuckOn(inst)`
*   **Description:** Configures torch to *stuck-on* state: sets `machine.enabled = true`, clears turnon/turnoff functions, sets cooldown to `0.25`, forces level 3 flame, and listens to `machineturnedoff` to re-trigger stuck-on behavior.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeStuckOff(inst)`
*   **Description:** Configures torch to *stuck-off* state: sets `machine.enabled = true`, clears turnon/turnoff functions, sets cooldown to `0.25`, extinguishes flame, and listens to `machineturnedon` to re-trigger stuck-off behavior.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeBroken(inst)`
*   **Description:** Configures torch to *broken* state: disables machine (`enabled = false`), sets `turnonfn = BrokenTurnOn`, `turnofffn = BrokenTurnOff`, cooldown `0`, forces level 1 flame, and plays broken idle animation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `MakeNormal(inst)`
*   **Description:** Restores torch to *normal* state: sets `machine.enabled = true`, restores standard turnon/turnoff functions, sets cooldown to `0.5`, and sets flame level 2.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `IsStuck(inst)`
*   **Description:** Utility function to check if torch is in stuck state (`turnonfn == nil`).
*   **Parameters:** `inst` (Entity).
*   **Returns:** `boolean`.

### `IsBroken(inst)`
*   **Description:** Utility function to check if torch is broken (`machine.enabled == false`).
*   **Parameters:** `inst` (Entity).
*   **Returns:** `boolean`.

### `ToggleOnOff(inst)`
*   **Description:** Toggles machine state (on/off) with a fixed animation delay of `0.2` seconds.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `GetStatus(inst, viewer)`
*   **Description:** Returns `"BROKEN"` if torch is broken; otherwise returns `nil`. Used by `inspectable` component.
*   **Parameters:**  
  * `inst` (Entity) — the torch.  
  * `viewer` (Entity) — viewer (unused).  
*   **Returns:** `string?` — `"BROKEN"` or `nil`.

### `OnSave(inst, data)`
*   **Description:** Serializes torch state for persistence. Captures `stuck` and `broken` flags.
*   **Parameters:**  
  * `inst` (Entity).  
  * `data` (table) — passed to save system.  
*   **Returns:** Table with optional `stuck` and `broken` keys.

### `OnLoad(inst, data)`
*   **Description:** Restores torch state on load. Applies `MakeStuckOn`, `MakeStuckOff`, or `MakeBroken` as needed based on saved flags.
*   **Parameters:**  
  * `inst` (Entity).  
  * `data` (table) — saved state data.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `machineturnedon` — triggers `StuckCantTurnOff` when in stuck-off state.  
- **Pushes:** None directly.  
- **Uses event callbacks:**  
  - Removes `machineturnedon` / `machineturnedoff` listeners when transitioning between states.  
  - Adds listeners conditionally for stuck behavior.