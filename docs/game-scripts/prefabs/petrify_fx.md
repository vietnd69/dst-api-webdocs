---
id: petrify_fx
title: Petrify Fx
description: Creates and manages non-persistent visual and audio effects for petrified tree and trunk destruction.
tags: [fx, environment, visual]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6e6f118b
system_scope: fx
---

# Petrify Fx

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`petrify_fx` is a utility module that defines prefabs for visual and sound effects triggered when petrified trees and trunks are destroyed. It creates temporary FX entities that play particle animations and sounds at a given world location (proxied from an existing entity), then self-destruct after the animation completes. These prefabs are not persisted or networked for simulation — they are strictly client-side visual artifacts.

The module exports a master `petrified_trunk_break_fx` prefab and four tree-related variants (`petrified_tree_fx_short`, `_normal`, `_tall`, `_old`) via a loop.

## Usage example
```lua
-- Create and position a trunk-break FX at world coordinates (x, y, z)
local fx = Prefab("petrified_trunk_break_fx")
fx.Transform:SetWorldPosition(x, y, z)

-- Similarly for a tree FX:
local fx_tree = Prefab("petrified_tree_fx_normal")
fx_tree.Transform:SetWorldPosition(x, y, z)
```

## Dependencies & tags
**Components used:** None directly. FX entities use standard subsystems: `transform`, `animstate`, `soundemitter`, `network`.
**Tags:** Adds `FX` tag to all FX entities; does not interact with custom tags.

## Properties
No public properties exposed. Internal state (`_darken`, a `net_tinybyte` signal) is used for colour darkening sync and is not part of the public API.

## Main functions
The module exports prefabs built via the `makefx` factory — there are no standalone public methods. All functionality is encapsulated in closure-scoped helpers and returned via `Prefab(...)` constructors.

### Factory: `makefx(assetname, animname, soundname)`
* **Description:** Returns a closure that creates and configures an FX entity for a specific petrified object type. The factory handles both dedicated-server (skip FX) and client-server (spawn FX) logic.
* **Parameters:**  
  `assetname` (string) — animation bank/build name (e.g., `"petrified_tree_fx"`).  
  `animname` (string) — animation clip name (e.g., `"rock_scatter_normal"`).  
  `soundname` (string) — sound file name component (e.g., `"post"`).  
* **Returns:** A function that, when invoked, returns a `Prefab` instance (entity).
* **Error states:** If `TheWorld.ismastersim` is `false` (client), the function returns the entity immediately. If `TheNet:IsDedicated()` is `true`, it returns a bare entity without spawning visual FX.

### Helper: `PlayFX(proxy, assetname, animname, soundname)`
* **Description:** Inner function responsible for spawning and configuring a non-networked FX entity. It is invoked once per FX to play the actual animation and sound.
* **Parameters:**  
  `proxy` (entity) — entity whose position/orientation the FX copies.  
  `assetname`, `animname`, `soundname` (strings) — same semantics as in `makefx`.  
* **Returns:** Nothing (side-effect only).
* **Error states:** The effect is removed automatically on `"animover"` event; no error conditions.

### Helper: `SetDarkened(inst, val)`
* **Description:** Encodes a darkness value (0.0–1.0) into a `net_tinybyte` signal (`0`–`7`) for color darkening sync.
* **Parameters:**  
  `inst` (entity) — the FX entity.  
  `val` (number) — darkness factor in `[0, 1]`.  
* **Returns:** Nothing.

### Helper: `SerializeDarken(inst, r, g, b)`
* **Description:** Computes a normalized darkening value from RGB and updates `inst._darken`. Invoked via `InheritColour` callback.
* **Parameters:**  
  `inst`, `r`, `g`, `b` — color components.  
* **Returns:** Nothing.

### Helper: `DeserializeDarken(inst)`
* **Description:** Decodes the stored darkening value into an RGBA tuple for `AnimState:SetMultColour`.
* **Parameters:** `inst` — the FX entity.  
* **Returns:** `{ r, g, b, a }` (all equal, in `[0, 1]`).

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` on FX entity to clean up after animation completion.
- **Pushes:** None.

