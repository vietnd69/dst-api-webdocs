---
id: icebox_coffin_bat_fx
title: Icebox Coffin Bat Fx
description: Spawns a non-persistent local visual FX entity (bat) with randomized animation variation and sound when triggered in non-dedicated servers.
tags: [fx, visual, sound, local]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c6495cb5
system_scope: fx
---

# Icebox Coffin Bat Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`icebox_coffin_bat_fx` is a lightweight FX prefab that spawns a temporary, non-persistent visual effect representing a bat exiting from a coffin in the Icebox biome. It is designed to run *only* on the client side (excludes dedicated servers), and does not participate in world simulation or persistence. The prefab uses proxy data (specifically a `variation` property) to determine which of three bat animations to play and plays randomized fluttering sound effects during playback.

It does not add any custom components or define logic beyond entity creation and basic setup; its functionality is almost entirely contained in the top-level `fn()` constructor and two helper functions.

## Usage example
This prefab is instantiated internally by the game when a specific in-world event occurs (e.g., opening an `icebox_coffin`). Modders typically do not instantiate it directly.

However, a typical call flow looks like this:
```lua
-- Internal usage by the game (simplified pseudo-code)
local fx = SpawnPrefab("icebox_coffin_bat_fx")
fx.variation:set(math.random(3))  -- client-side variation is set on master
```

## Dependencies & tags
**Components used:** None (uses only built-in entity components: `transform`, `animstate`, `soundemitter`, `network`).  
**Tags:** Adds `FX` and `NOCLICK` to spawned FX entities; `FX` to the root entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | `net_tinybyte` | `nil` | Networked property (client-server synced) indicating which bat animation variant to play (`0`, `1`, or `2`). Set only on the master instance and replicated to clients. |

## Main functions
### `DoFlutterSound(inst, intensity)`
* **Description:** Recursively plays the bat flap sound using `easing.outQuad()` to modulate volume (intensity) and continues scheduling future sound events as intensity decays.
* **Parameters:**  
  - `inst` (Entity) — the entity playing the sound.  
  - `intensity` (number) — initial sound volume/intensity (must be `<= 1.0`).  
* **Returns:** Nothing.
* **Error states:** recursion terminates when `intensity <= 0.12`.

### `PlayBatFX(proxy)`
* **Description:** Creates and configures a *local-only* entity with animation, sound, and lifetime logic to render the bat FX. Only runs on non-dedicated clients.
* **Parameters:**  
  - `proxy` (Entity) — the source entity from which this FX inherits transform and `variation` data.  
* **Returns:** Nothing.
* **Error states:** No effect if `proxy.variation:value() <= 0`.

### `fn()`
* **Description:** Constructor function that creates the root FX entity. Sets up network replication, spawns the client-side FX via `PlayBatFX`, and ensures the entity is removed after 1 second on the master sim.
* **Parameters:** None.
* **Returns:** (`Entity`) the fully configured FX prefab instance.

## Events & listeners
- **Listens to:** `animover` — removes the FX entity when its animation completes.
- **Pushes:** None.