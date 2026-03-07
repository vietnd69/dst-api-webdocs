---
id: strafer
title: Strafer
description: Manages strafing input and facing direction for player entities during movement, integrating with locomotion and player controller systems.
tags: [player, locomotion, input]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e3433b47
system_scope: player
---
# Strafer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Strafer` is a client-side component responsible for handling strafing input (left/right/diagonal movement with camera-relative aiming) and synchronizing the entity’s facing direction accordingly. It integrates with `playercontroller` to detect input state and with `locomotor` to update rotation and motor velocity when strafing begins or ends. This component is specifically designed for player entities and activates when strafing input is detected via controller or mouse.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("strafer")
-- Strafing is automatically handled via events:
inst:PushEvent("startstrafing")
-- ... (while moving and aiming) ...
inst:PushEvent("stopstrafing")
```

## Dependencies & tags
**Components used:** `playercontroller`, `locomotor`
**Tags:** Checks `inst.player_classified.isstrafing` on initialization.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance the component is attached to. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Indicates whether this instance is running on the master simulation (server). |
| `playercontroller` | `PlayerController` | `inst.components.playercontroller` | Reference to the player controller component. |
| `aiming` | boolean | `false` | Whether strafing (aiming) is currently active. |
| `lastdir` | number or `nil` | `nil` | Cached last strafing direction (used to avoid redundant RPCs on non-master clients). |

## Main functions
### `IsAiming()`
* **Description:** Returns whether the entity is currently in a strafing (aiming) state.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if strafing is active, `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Per-frame update function that reads input (analog strafe controls for controllers or mouse world position for keyboard), computes the desired facing direction, and informs `locomotor` to update facing and velocity. On non-master clients, it sends the direction to the server via RPC.
* **Parameters:** `dt` (number) — Delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Exits early without updating direction if:
  - Player controller is disabled *and* not HUD-blocking, *or*
  - The entity’s stategraph has the `"busy"` state tag.

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when the component is removed from its entity. Ensures event listeners are unregistered and strafing is disabled in `locomotor`.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `"startstrafing"` — Triggered externally to begin strafing (e.g., by holding right stick or Ctrl+arrow keys).
  - `"stopstrafing"` — Triggered externally to stop strafing (e.g., input released).
- **Pushes:** None.

`<`!-- Note: RPC call `RPC.StrafeFacing` is sent to server but is not an event handled by this component directly. -->
