---
id: wortox_soul_heal_fx
title: Wortox Soul Heal Fx
description: A visual effect prefab that applies a temporary tint to a target entity during Wortox's soul heal animation.
tags: [fx, visual, heal, wortox]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: df4389fc
system_scope: fx
---

# Wortox Soul Heal Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wortox_soul_heal_fx` is a client-side FX prefab that creates a healing visual effect for Wortox. It uses an animation sequence to dynamically apply a color tint to a target entity via the `colouradder` component. The effect is short-lived, non-persistent, and only runs on the master simulation. It integrates with `updatelooper` to drive per-frame updates that modulate tint intensity over time and plays a sound on the target.

## Usage example
```lua
local fx = SpawnPrefab("wortox_soul_heal_fx")
if fx ~= nil then
    fx:Setup(some_entity)
    fx.components.updatelooper:AddOnUpdateFn(some_other_function)
end
```

## Dependencies & tags
**Components used:** `colouradder`, `updatelooper`, `animstate`, `transform`, `network`, `soundemitter`
**Tags:** Adds `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_tinttarget` | `Entity` or `nil` | `nil` | The entity whose colour tint will be modified during the effect. |
| `Setup` | function | `Setup` (defined in prefab) | Callback used to attach this FX to a target entity. |

## Main functions
### `Setup(inst, target)`
*   **Description:** Attaches the FX to a target entity and begins animation/tint updates. Also plays a healing sound on the target if possible.
*   **Parameters:**  
    `inst` (`Entity`) — the FX entity instance.  
    `target` (`Entity`) — the entity to receive the temporary tint effect.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `target` is `nil` or lacks `SoundEmitter` or `colouradder` components.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove()` to clean up the FX after its animation completes.
- **Pushes:** None.