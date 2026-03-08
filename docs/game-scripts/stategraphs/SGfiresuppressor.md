---
id: SGfiresuppressor
title: Sgfiresuppressor
description: Manages the state machine for the Fire Suppressor structure, handling its startup, idle, spinning, and extinguishing animations and sounds.
tags: [structure, machine, fire, sound, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 799073e7
system_scope: entity
---

# Sgfiresuppressor

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGfiresuppressor` defines the state graph for the Fire Suppressor structure, a DST item used to suppress nearby fires. It orchestrates animation playback, sound effects, and transitions between states such as idle, spinning up, shooting water projectiles, and handling warnings. The state graph responds to the `putoutfire` event—triggered when a fire is detected—and coordinates with the `machine` and `firedetector` components to manage active behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("machine")
inst:AddComponent("firedetector")
inst:AddStateGraph("firesuppressor")
inst.sg:GoToState("idle_off")
-- Later, when a fire is detected:
inst:PushEvent("putoutfire", { firePos = Vector3(x, y, z) })
```

## Dependencies & tags
**Components used:** `machine` (for `IsOn()`), `firedetector` (for `DetectFire()`)  
**Tags:** States use `idle`, `busy`, `shooting`, and `light` tags, which are checked via `inst.sg:HasStateTag("...")`.

## Properties
No public properties.

## Main functions
*No top-level functions or methods are exported.* This is a `StateGraph` definition returned from the module. The internal `onenter`, `timeline`, and `events` handlers are invoked automatically by the state machine engine.

### `PlayWarningSound(inst)`
*   **Description:** Plays the warning bell sound for the fire suppressor.
*   **Parameters:** `inst` (Entity) — the fire suppressor instance.
*   **Returns:** Nothing.

### `ToggleWarningSound(inst, on)`
*   **Description:** Starts or cancels a periodic warning sound task based on the `on` flag.
*   **Parameters:** 
    * `inst` (Entity) — the fire suppressor instance.
    * `on` (boolean) — `true` to start periodic warning sound, `false` to cancel.
*   **Returns:** Nothing.
*   **Error states:** If `inst.sg.mem.soundtask` is already set while attempting to enable, no new task is created.

### `EventHandler("putoutfire", ...)`
*   **Description:** Responds to fire suppression requests. Triggers `spin_up` from idle or `shoot` if already spinning, *only if* the machine is on.
*   **Parameters:** `data` (table) — must contain `firePos` (Vector3 or similar) indicating the fire location.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `putoutfire` — triggers fire suppression sequence if the machine is active.
- **Pushes:** None. The state graph itself does not emit events, but it may be triggered by external `PushEvent("putoutfire", ...)` calls.