---
id: statueruins
title: Statueruins
description: Handles the behavior and state transitions of ancient statues in the Caves, including light fading, nightmare phase responses, gem植入 logic, and loot generation upon destruction.
tags: [caves, boss, environment, loot, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f21317c
system_scope: environment
---

# Statueruins

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `statueruins` system defines prefabs for ancient statues found in the Caves, which dynamically respond to the world’s Nightmare Phase. It manages light intensity transitions, sound, visual FX (e.g., bloom and sprite swapping), and loot dropping when the statue is mined. The component logic resides within the Prefab factory functions (`commonfn`, `gem`, `nogem`) and uses the `workable` and `lootdropper` components to handle interaction and reward distribution.

## Usage example
```lua
-- Create a non-gemmed small statue (e.g., head variant)
local statue = Prefab("ruins_statue_head_nogem", function() return nogem(true) end)

-- Create a gemmed large statue (e.g., mage variant)
local giant_statue = Prefab("ruins_statue_mage", function() return gem() end)

-- Statues respond automatically to nightmare phase changes and mining.
-- Loot and FX are handled internally by OnWorkFinished and OnNightmarePhaseChanged.
```

## Dependencies & tags
**Components used:**  
- `workable` — handles mining interaction, callbacks, and progress tracking  
- `lootdropper` — manages loot generation upon destruction  
- `inspectable` — enables inspection via UI  
**Tags added:** `cavedweller`, `structure`, `statue`  
**Tags checked:** None explicitly (but `destructible`, `burnable`, and `hauntable` may be added by `MakeHauntableWork`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `gemmed` | string or nil | `nil` | The type of gem embedded in the statue (e.g., `"greengem"`). Set via `SetGemmed`. |
| `small` | boolean | `false` | Indicates if this is the smaller variant (head) or larger variant (mage). |
| `_suffix` | string or nil | `nil` | Animation suffix used for day/night (e.g., `"_night"` when wild). |
| `_lightframe` | net_smallbyte | `0` initially | Current interpolation frame for light transition. |
| `_lightradius0` | net_tinybyte | `0` | Current target radius during transition. |
| `_lightradius1` | net_tinybyte | `0` | Desired target radius. |
| `_lightmaxframe` | number | `30` (`MAX_LIGHT_OFF_FRAME`) | Total frames for transition interpolation. |
| `_phasetask` | FutureTask or nil | `nil` | Delayed task to safely apply phase changes in animation. |

## Main functions
### `SetGemmed(inst, gem)`
* **Description:** Applies a gem visual and updates loot table for the statue. Called during construction and load.  
* **Parameters:** `inst` (Entity) — the statue instance; `gem` (string) — the prefab name of the gem (e.g., `"greengem"`).  
* **Returns:** Nothing.  
* **Error states:** None. Sets `inst.gemmed`, overrides animation symbol, and configures loot table.

### `OnNightmarePhaseChanged(inst, phase, instant)`
* **Description:** Triggers visual and light changes in response to a change in the world’s Nightmare Phase (`"wild"`, `"warn"`, `"dawn"`, `"calm"`).  
* **Parameters:** `inst` (Entity); `phase` (string) — new nightmare phase; `instant` (boolean) — whether to apply changes immediately (e.g., on load or while sleeping).  
* **Returns:** Nothing.  
* **Error states:** Cancels any pending `_phasetask` if already active.

### `fade_to(inst, rad, instant)`
* **Description:** Smoothly transitions the statue’s light radius between current and target radius (`rad`).  
* **Parameters:** `rad` (number) — target light radius (`0`, `2`, or `4`); `instant` (boolean) — bypass interpolation.  
* **Returns:** Nothing.  
* **Error states:** No-op if target radius equals current `inst._lightradius1:value()`.

### `OnWorkFinished(inst, worker)`
* **Description:** Executed upon successful mining. Drops loot, spawns FX, checks for nightmare creature spawn, and removes the statue.  
* **Parameters:** `inst` (Entity); `worker` (Entity or nil) — the player/miner (may be `nil` during triggering events).  
* **Returns:** Nothing.  
* **Error states:** None. Calls `inst:Remove()` at the end.

### `ShowPhaseState(inst, phase, instant)`
* **Description:** Sets the correct animation state, bloom effect, and light based on the Nightmare Phase.  
* **Parameters:** `inst` (Entity); `phase` (string); `instant` (boolean).  
* **Returns:** Nothing.  
* **Error states:** None. Delegates to `fade_to`, toggles bloom, and resets `_suffix`.

## Events & listeners
- **Listens to:** `lightdirty` — triggers `OnLightDirty` on clients to update light interpolation.  
- **Pushes:** `entity_droploot` — via `lootdropper:DropLoot`. Internal events (`OnNightmarePhaseChanged`) are routed through callbacks (not pushed by this prefab directly).