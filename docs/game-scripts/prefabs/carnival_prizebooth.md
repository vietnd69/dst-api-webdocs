---
id: carnival_prizebooth
title: Carnival Prizebooth
description: A deployable carnival-themed structure that provides lighting, music effects, crafting opportunities, and loot upon destruction.
tags: [structure, crafting, lighting, music]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 426ac5cc
system_scope: entity
---

# Carnival Prizebooth

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`carnival_prizebooth` is a deployable structure used in DST's summer events. It provides ambient lighting, triggers carnival-themed music playback when players are nearby, serves as a prototype for carnival-themed crafting (via the `prototyper` component), and drops loot when hammered. The component relies on several core systems: `prototyper` for crafting tree integration, `workable` for hammering interaction, `lootdropper` for loot generation, and `hauntable` for hauntable gameplay. It also integrates with `sound`, `light`, and `animstate` for visual/audio feedback during interactions.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddLight()
inst.entity:AddSoundEmitter()
inst:AddTag("structure")
inst:AddTag("carnival_prizebooth")
inst:AddTag("carnivaldecor")
inst:AddTag("prototyper")
MakeObstaclePhysics(inst, .4)
inst.Light:SetRadius(4)
inst.Light:SetIntensity(0.55)
inst.Light:SetFalloff(1.3)
inst.Light:SetColour(251/255, 240/255, 218/255)
inst:AddComponent("inspectable")
inst:AddComponent("carnivaldecor")
inst:AddComponent("lootdropper")
inst:AddComponent("prototyper")
inst.components.prototyper.trees = TUNING.PROTOTYPER_TREES.CARNIVAL_PRIZESHOP
inst:AddComponent("workable")
inst.components.workable:SetWorkAction(ACTIONS.HAMMER)
inst.components.workable:SetWorkLeft(1)
inst.components.workable:SetOnFinishCallback(onhammered)
inst:AddComponent("hauntable")
inst.components.hauntable:SetHauntValue(TUNING.HAUNT_TINY)
```

## Dependencies & tags
**Components used:** `inspectable`, `carnivaldecor`, `lootdropper`, `prototyper`, `workable`, `hauntable`, `light`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`  
**Tags added:** `structure`, `carnival_prizebooth`, `carnivaldecor`, `prototyper`  
**Tags checked:** None (uses `inst:HasTag()` in external components)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `Light` | Light component | — | Used to enable/disable and configure the booth’s glow (radius, intensity, color). |
| `AnimState` | AnimState component | — | Controls animation states: `idle`, `place`, `use`, `proximity_loop`. |
| `SoundEmitter` | SoundEmitter component | — | Manages sound playback for booth interactions. |
| `MiniMapEntity` | MiniMapEntity component | — | Configures minimap icon and priority. |
| `deployhelper_key` | string | `"carnival_plaza_decor"` | Set during placer initialization to categorize deployment. |
| `components.prototyper.trees` | TechTree | `TUNING.PROTOTYPER_TREES.CARNIVAL_PRIZESHOP` | The crafting tree associated with this booth. |
| `components.prototyper.onturnon` | function | `onturnon` | Called when the booth is turned on (e.g., via player action). |
| `components.prototyper.onturnoff` | function | `onturnoff` | Called when the booth is turned off. |
| `components.prototyper.onactivate` | function | `onactivate` | Called when the booth is activated (e.g., via "Activate" action). |

## Main functions
### `onturnoff(inst)`
* **Description:** Turns off the booth’s light and stops proximity looping sound; resets animation to `idle`.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

### `onturnon(inst)`
* **Description:** Enables the booth’s light (intensity `0.55`, radius `4`) and starts looping proximity sound (`prox_LP`) with animation `proximity_loop`. Preserves animation order if `proximity_loop` was already playing.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

### `onactivate(inst)`
* **Description:** Triggers the `use` animation sequence and plays the `use` sound effect once.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

### `onhammered(inst, worker)`
* **Description:** Handles destruction of the booth. Spawns `collapse_small` FX, drops loot via `lootdropper`, and removes the entity.
* **Parameters:**  
  - `inst` (Entity) — The prizebooth entity instance.  
  - `worker` (Entity) — The entity performing the hammering action.
* **Returns:** Nothing.

### `onbuilt(inst)`
* **Description:** Plays the `place` animation once and then transitions to `idle`; emits the `place` sound effect.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

### `UpdateGameMusic(inst)`
* **Description:** Checks if the current player is within `TUNING.CARNIVAL_THEME_MUSIC_RANGE`; if so, pushes `playcarnivalmusic` event to trigger music.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Starts a periodic task to call `UpdateGameMusic` every 1 second on non-dedicated servers.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

### `OnEntitySleep(inst)`
* **Description:** Cancels the periodic music-check task upon entity sleep.
* **Parameters:** `inst` (Entity) — The prizebooth entity instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onbuilt` — Triggers `onbuilt` callback after construction.
- **Pushes:** None directly (but `UpdateGameMusic` pushes `playcarnivalmusic` to `ThePlayer`).

