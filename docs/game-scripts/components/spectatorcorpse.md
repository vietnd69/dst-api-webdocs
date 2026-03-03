---
id: spectatorcorpse
title: Spectatorcorpse
description: Manages camera focus behavior for a player entity when spectating from a corpse, smoothly adjusting the camera range toward the nearest living player.
tags: [camera, spectator, networking, player]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 127e611c
system_scope: camera
---
# Spectatorcorpse

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SpectatorCorpse` enables camera focus logic for a player entity acting as a spectator while in corpse (ghost) form. It automatically adjusts the focal point camera range over time and selects the nearest valid living player as the camera target. It runs on both server and client, with client-side focus management handled via the `focalpoint` component. The component is designed to be attached to player prefabs and activates when the player becomes a ghost.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("player")
inst:AddComponent("spectatorcorpse")
-- Component activates automatically when the entity receives "playeractivated"
-- and enters ghost state via "ms_becameghost"
```

## Dependencies & tags
**Components used:** `focalpoint`, `transform`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `false` | Whether the component is actively managing camera focus. |
| `updating` | boolean | `false` | Whether the `OnUpdate` loop is running. |
| `lasttarget` | Entity or `nil` | `nil` | Last target selected for focus; used for smoothing priority. |
| `str` | number | `0` | Current camera range (clamped to `maxrange`). |
| `maxrange` | number | `40` | Maximum distance the camera may zoom out. |
| `startspeed` | number | `0.5` | Rate at which `str` increases per frame. |
| `priority` | number | `1` | Priority level used by `focalpoint` when selecting sources. |
| `_isspectating` | `net_bool` | — | Networked boolean indicating whether the player is spectating. |

## Main functions
### `OnUpdate()`
* **Description:** Runs every frame while `updating` is true. Adjusts the camera range `str` toward `maxrange` and updates the focal point source to focus on the nearest living, visible player within range.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if the focal point entity's parent is not `self.inst`. May call `StartFocusSource`/`StopFocusSource` on `TheFocalPoint.components.focalpoint`.

## Events & listeners
- **Listens to:**  
  - `isspectatingdirty` (client only) — triggers focus state updates.  
  - `ms_becameghost` (server only) — sets `_isspectating` to true.  
  - `ms_respawnedfromghost` (server only) — sets `_isspectating` to false.  
  - `playeractivated` — activates the component and sets up listeners.  
  - `playerdeactivated` — deactivates the component and cleans up listeners.
- **Pushes:** None identified.
