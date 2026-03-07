---
id: icebox_victorian_frost_fx
title: Icebox Victorian Frost Fx
description: Renders a short-lived visual FX animation for the Victorian icebox event in DST.
tags: [fx, visual, event]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9e57a293
system_scope: fx
---

# Icebox Victorian Frost Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`icebox_victorian_frost_fx` is a non-simulating visual effect entity used exclusively for rendering animation during the Victorian Icebox event. It plays a prelude animation (`pre`) followed by a looping animation (`loop`) on the master client, and terminates after the animation completes. The entity has no simulation logic beyond basic lifecycle management.

## Usage example
```lua
--Typically spawned internally by the game via Prefab spawner during the Icebox event
local inst = Prefab("icebox_victorian_frost_fx")
inst:ListenForEvent("kill", function()
    if inst.components.transform ~= nil then
        inst.Transform:SetPosition(x, y, z)
    end
end)
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`  
**Tags:** Adds `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_killtask` | function/task reference | `nil` | Internal task reference to the delayed entity removal callback. |

## Main functions
### `Kill(inst)`
*   **Description:** Initiates immediate termination of the effect by scheduling `OnKillTask` to run after the remaining animation duration. Ensures no duplicate scheduled tasks.
*   **Parameters:** `inst` (entity) — the entity instance to kill.
*   **Returns:** Nothing.
*   **Error states:** If `_killtask` is already set, does nothing.

### `OnKillTask(inst)`
*   **Description:** Internal callback scheduled by `Kill()`; plays the post-animation (`pst`) and removes the entity after a short buffer.
*   **Parameters:** `inst` (entity) — the entity instance being killed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.