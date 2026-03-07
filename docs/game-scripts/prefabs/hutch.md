---
id: hutch
title: Hutch
description: Manages the Chester hutch entity, a companion that transforms between forms based on inventory batteries and provides light, damage reflection, and sanity effects.
tags: [companion, transform, container, light, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 37bcec81
system_scope: entity
---

# Hutch

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `hutch` prefab implements Chester's transformable hutch form, a passive companion entity that dynamically changes appearance, abilities, and light emission based on the batteries inserted into its container. It relies heavily on the `amorphous`, `container`, `sleeper`, `follower`, and `acidinfusible` components to manage state transitions, inventory interactions, sleep behavior, following the leader, and environmental resilience. It supports three forms: `FUGU` (pufferfish, with damage reflection), `MUSIC` (music box, with ambient light and sanity aura), and `NORMAL` (default, with standard lighting).

## Usage example
```lua
local inst = Prefab("hutch", create_hutch, assets, prefabs)
inst:AddComponent("amorphous")
inst:AddComponent("container")
inst.components.container:AddItem("lightbattery")
inst.components.amorphous:MorphToForm(inst.components.amorphous.forms[1])
```

## Dependencies & tags
**Components used:** `maprevealable`, `combat`, `health`, `inspectable`, `locomotor`, `follower`, `knownlocations`, `container`, `sleeper`, `acidinfusible`, `hauntable`, `damagereflect`, `sanityaura`, `fueled`, `finiteuses`, `weapon`, `amorphous`  
**Tags added:** `companion`, `character`, `scarytoprey`, `hutch`, `notraptrigger`, `noauradamage`, `devourable`, `NOBLOCK`  
**Tags removed:** `companion` (on `stopfollowing` event)  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `current_def_build` | string | `"hutch_build"` | Stores the current build animation set used by the entity. |
| `_lightbattery` | GameObject or nil | `nil` | Cached reference to the current light battery item in container. |
| `_pointybattery` | GameObject or nil | `nil` | Cached reference to the current pointy (damage reflect) battery item (only for FUGU form). |
| `_musicbattery` | GameObject or nil | `nil` | Cached reference to the current music battery item (only for MUSIC form). |
| `sounds` | table | See `sounds` constant | Local table mapping sound names to their paths. |
| `leave_slime` | boolean | `true` | Indicates whether the entity leaves a slime trail. |
| `scrapbook_scale` | number | `2` | Scaling factor for scrapbook view. |
| `scrapbook_animoffsetx` | number | `120` | Horizontal offset for scrapbook animation. |
| `scrapbook_animoffsety` | number | `-100` | Vertical offset for scrapbook animation. |
| `forms` | table | Initialized in constructor | Array of form definitions used by `amorphous` component. |
| `current_def_build` | string | `"hutch_build"` | Default animation build name. |

## Main functions
### `SetNormalLight(inst)`
*   **Description:** Configures the hutch's light to the standard brightness and warm color.
*   **Parameters:** `inst` (GameObject) — The hutch instance.
*   **Returns:** Nothing.

### `SetDimLight(inst)`
*   **Description:** Configures the hutch's light to a dimmer state, used in FUGU form.
*   **Parameters:** `inst` (GameObject) — The hutch instance.
*   **Returns:** Nothing.

### `SetMusicLight(inst)`
*   **Description:** Configures the hutch's light to a blue-tinted state, used in MUSIC form.
*   **Parameters:** `inst` (GameObject) — The hutch instance.
*   **Returns:** Nothing.

### `CheckBattery(inst)`
*   **Description:** Scans the container for matching battery tags, then activates/deactivates light, damage reflection, and sanity aura based on the current form and battery presence. This function is called during load, item changes, and form changes.
*   **Parameters:** `inst` (GameObject) — The hutch instance.
*   **Returns:** Nothing.

### `CreateForm(name, itemtags, build, icon, onenter, onexit)`
*   **Description:** Helper function to define an `amorphous` form with specific tags, animation build, minimap icon, and enter/exit callbacks.
*   **Parameters:**  
  `name` (string) — Form name (`"FUGU"`, `"MUSIC"`, `"NORMAL"`).  
  `itemtags` (table or nil) — Required tags for the form to activate.  
  `build` (string) — Animation build file name.  
  `icon` (string) — Minimap icon filename.  
  `onenter` (function or nil) — Function called on entry.  
  `onexit` (function or nil) — Function called on exit.  
*   **Returns:** A form table with `name`, `itemtags`, `enterformfn`, and `exitformfn`.

### `SetBuild(inst)`
*   **Description:** Applies optional skin overrides for the hutch's animation symbols based on the current build (normal, musicbox, or pufferfish). If no skin is applied, it resets overrides and sets the default build.
*   **Parameters:** `inst` (GameObject) — The hutch instance.
*   **Returns:** Nothing.

### `OnReflectDamage(inst, data)`
*   **Description:** Handles damage reflection logic when an attacker hits the hutch: consumes a pointy battery if present, and spawns an impact effect at the attacker's location.
*   **Parameters:**  
  `inst` (GameObject) — The hutch instance.  
  `data` (table) — Combat damage event data, must contain `attacker` field.  
*   **Returns:** Nothing.

### `OnLoadPostPass(inst)`
*   **Description:** Event handler for post-pass loading. Registers listeners for `itemget` and `itemlose` to trigger battery checks, and runs `CheckBattery` if loading a populated world.
*   **Parameters:** `inst` (GameObject) — The hutch instance.
*   **Returns:** Nothing.

### `SpawnFX()`
*   **Description:** Creates and configures the music box ground glow effect prefab (`hutch_music_light_fx`).
*   **Parameters:** None.
*   **Returns:** The spawned `hutch_music_light_fx` entity.

### `InitFX(inst, hutch, data)`
*   **Description:** Attaches the music box ground glow effect to the hutch, sets up event listeners, and initializes animation state based on hutch state.
*   **Parameters:**  
  `inst` (GameObject) — The music light FX instance.  
  `hutch` (GameObject) — The parent hutch entity.  
  `data` (table) — FX parameters (`rot`, `rotrate`, `alpha`, `alphadir`, `alpharate`).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `stopfollowing` — Triggers `OnStopFollowing`, removes `companion` tag.  
  `startfollowing` — Triggers `OnStartFollowing`, adds `companion` tag.  
  `itemget` — Triggers `CheckBattery` (added via `OnLoadPostPass`).  
  `itemlose` — Triggers `CheckBattery` (added via `OnLoadPostPass`).  
  `onreflectdamage` — Triggers `OnReflectDamage` (added when damage reflection is active).  
  `newstate` — Updates music light FX animation state.  
  `fxdirty` — Triggers `OnFXDirty` for FX state synchronization.  
  `animdirty` — Triggers `OnAnimDirty` to update FX animation.  
- **Pushes:**  
  `morph` — Pushed during form transition in `enterformfn` (non-instant morph only).  
