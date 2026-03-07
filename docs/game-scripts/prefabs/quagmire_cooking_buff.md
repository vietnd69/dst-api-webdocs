---
id: quagmire_cooking_buff
title: Quagmire Cooking Buff
description: Manages the visual FX entity for Quagmire cooking animations, shown when food is being prepared in that biome.
tags: [fx, visual, quagmire]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5450b556
system_scope: fx
---

# Quagmire Cooking Buff

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`quagmire_cooking_buff` is a Prefab that creates and manages a localized, non-persistent visual FX entity used during Quagmire cooking animations. It is not a component but a standalone prefab used to render special particle or animation effects (e.g., cooking steam or sparks). The entity is automatically destroyed after the animation completes or when explicitly hidden. It is designed for client-only use on non-dedicated servers and ensures proper synchronization between master and client simulation.

## Usage example
```lua
-- Typically used internally by Quagmire cooking systems
local fx_entity = Prefab("quagmire_cooking_buff")()
fx_entity:ShowFX()  -- Starts animation and spawns the FX
fx_entity:HideFX()  -- Triggers FX removal after animation ends
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX` and `NOCLICK`; uses `showdirty` networked event.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_show` | `net_bool` | `false` | Networked boolean controlling whether FX should be shown. |
| `ShowFX` | function | `ShowFX` | Method to show the FX (initializes and plays animation). |
| `HideFX` | function | `HideFX` | Method to hide and schedule removal of the FX. |

## Main functions
### `ShowFX()`
* **Description:** Sets the `_show` flag to `true` and, on the client, creates or reactivates the FX entity by calling `OnShowDirty`. Does nothing on dedicated servers.
* **Parameters:** None.
* **Returns:** Nothing.

### `HideFX()`
* **Description:** Sets the `_show` flag to `false` and, on the client, schedules the FX entity for removal by marking it `killed = true`. Does nothing on dedicated servers.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `showdirty` — triggers `OnShowDirty` when the `_show` state changes (client-side only).
- **Pushes:** None.

### `OnAnimOver(inst)`
* **Description:** Callback fired when the FX animation completes. If `killed` is true, the entity is removed; otherwise, it loops to play the `"fx"` animation.
* **Parameters:** `inst` (entity) — the FX entity instance.
* **Returns:** Nothing.