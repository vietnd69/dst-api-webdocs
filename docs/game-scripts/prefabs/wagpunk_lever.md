---
id: wagpunk_lever
title: Wagpunk Lever
description: A switchablelever component that extends when activated, enabling proximity-based interaction with the Wagpunk arena manager.
tags: [switch, arena, environment, physics]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 80e37e04
system_scope: environment
---

# Wagpunk Lever

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wagpunk_lever` prefab represents a switchable lever used in the Wagpunk arena zones. When activated, it extends physically and emits sound/animation feedback, while registering with the `wagpunk_arena_manager` component via `LeverToggled` events. Its behavior toggles between a retracted state (non-interactive, physically solid) and an extended state (interactive, triggers player proximity detection and arena state updates). It uses the `activatable` component to respond to player actions and the `playerprox` component to detect when players enter or leave its interaction radius.

## Usage example
```lua
local inst = SpawnPrefab("wagpunk_lever")
inst.Transform:SetPosition(x, 0, z)
-- Levers are typically pre-configured via worldgen; manual activation:
inst.components.activatable:Activate(inst)
```

## Dependencies & tags
**Components used:** `activatable`, `inspectable`, `playerprox` (added at runtime), `wagpunk_arena_manager` (external world component)  
**Tags:** Adds `NOCLICK` when retracted; removes `NOCLICK` when extended.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `extended` | boolean | `false` | Indicates whether the lever is currently extended (true) or retracted (false). |
| `OnPlayerNear` | function | `nil` | Callback invoked when a player enters the lever's proximity radius. |
| `OnPlayerFar` | function | `nil` | Callback invoked when a player leaves the lever's proximity radius. |
| `ExtendLever` | function | `nil` | Public method to extend the lever, enabling proximity detection and arena updates. |
| `RetractLever` | function | `nil` | Public method to retract the lever, disabling proximity detection and signaling arena closure. |

## Main functions
### `ExtendLever(inst)`
*   **Description:** Extends the lever physically, enabling interaction and proximity detection. Removes `NOCLICK` tag, adds `playerprox`, activates activatable, and notifies arena manager.
*   **Parameters:** `inst` (entity instance) — the lever entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if already extended (`inst.extended == true`).

### `RetractLever(inst)`
*   **Description:** Retracts the lever, disabling interaction and proximity detection. Adds `NOCLICK` tag, removes `playerprox`, deactivates activatable, and notifies arena manager.
*   **Parameters:** `inst` (entity instance) — the lever entity.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if already retracted (`inst.extended == false`).

## Events & listeners
- **Listens to:** `ms_wagpunk_lever_activated` — emitted via `TheWorld:PushEvent` when lever is activated (not a listener itself, but triggers other logic).
- **Pushes:** `nil` — this prefab does not emit custom events; it relies on world-level events and component callbacks (`wagpunk_arena_manager:LeverToggled`) to communicate state.
- **Component events:**
    - `activatable.OnActivate` → calls `OnActivate(inst, doer)` which emits `ms_wagpunk_lever_activated` then calls `inst:RetractLever()`.
    - `playerprox` callbacks → `inst.OnPlayerNear` / `inst.OnPlayerFar`, which notify `wagpunk_arena_manager:LeverToggled(inst, true/false)`.