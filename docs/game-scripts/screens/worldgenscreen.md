---
id: worldgenscreen
title: Worldgenscreen
description: Manages the world generation UI screen, displaying animated visuals and status while the server generates a new world.
tags: [ui, world, generation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: acbf219f
system_scope: ui
---

# Worldgenscreen

> Based on game build **71414** | Last updated: 2026-03-09

## Overview
`WorldGenScreen` is a UI screen that provides visual feedback during world generation. It runs on both server and client, showing animated elements, text, and sound while the server performs world generation via `TheSim:GenerateNewWorld`. On the server, it manages the generation lifecycle and invokes a callback upon completion or failure. On the client, it simply waits and optionally handles control inputs without interfering with the active game session.

## Usage example
```lua
local WorldGenScreen = require "screens/worldgenscreen"
local screen = WorldGenScreen(new_profile, function(worlddata)
    if worlddata ~= nil and not string.match(worlddata, "^error") then
        -- Proceed with loaded world data
    else
        -- Handle error
    end
end, world_gen_data, false)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `ChangeFlavourText()`
*   **Description:** Updates the flavour text display with the next verb-noun pair from shuffled arrays, then schedules the next update with randomized timing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeActive()`
*   **Description:** Notifies the loading system that world generation has started (server-side only).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Notifies the loading system that world generation has completed (server-side only).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnControl(control, down)`
*   **Description:** Handles input control events; defers to base class behavior and returns `true` to prevent further propagation (useful when overlaying the screen on an active game).
*   **Parameters:**  
    `control` (string) - The control action pressed or released.  
    `down` (boolean) - Whether the control was pressed (`true`) or released (`false`).  
*   **Returns:** `true` — always consumes the control event.

### `OnDestroy()`
*   **Description:** Cleans up resources, specifically stopping the world generation sound.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Handles per-frame logic. On the server, checks for generation completion and invokes the callback when generation finishes or after a minimum delay. On the client, monitors child process status and exits the screen if the process finishes successfully.
*   **Parameters:**  
    `dt` (number) - Time elapsed since the last frame in seconds.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `DoTaskInTime` — internally used via `self.inst:DoTaskInTime(...)` to schedule recurring flavour text updates.
- **Pushes:** None identified.