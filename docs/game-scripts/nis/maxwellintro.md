---
id: maxwellintro
title: Maxwellintro
description: Controls a scripted narrative sequence where Maxwell appears, delivers dialogue, and disappears while Wilson is unconscious, restoring normal gameplay afterward.
tags: [nis, camera, animation, dialogue]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: nis
source_hash: 178d2647
system_scope: world
---

# Maxwellintro

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`maxwellintro` is a Narrative Interface Script (NIS) that orchestrates a cinematic intro sequence involving the player character Wilson and Maxwell. It manages scene setup (positioning characters, disabling player control), dialogue playback, visual effects, and cleanup. It uses the global `TheCamera`, character `Transform` and `AnimState` components, and the `Talker` component for speech, while relying on `PlayerController` to toggle player control.

## Usage example
```lua
local nis = require "nis/maxwellintro"
local dat = {}
nis.init(dat)
-- Later, trigger the sequence with dialogue lines
nis.script(nis, dat, {"I am trapped here...", "You can help me out."})
```

## Dependencies & tags
**Components used:** `playercontroller`, `talker`, `Transform`, `AnimState`, `SoundEmitter`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `init(dat)`
*   **Description:** Initializes the NIS scene. Locates the player (Wilson), disables their controller, puts them into the `"sleep"` state, spawns Maxwell, positions him to the right of Wilson, faces him at Wilson, hides him, and configures the camera for a close-up shot.
*   **Parameters:** `dat` (table) - A data table used to store references to `wilson`, `maxwell`, and other transient scene variables for later use.
*   **Returns:** Nothing.

### `script(nis, dat, lines)`
*   **Description:** Executes the main cinematic sequence. Makes Maxwell visible with an entrance animation, plays his dialogue lines with synchronized animation and sound, then triggers his disappearance and wakes Wilson. Restores camera and player control at the end.
*   **Parameters:**
    *   `nis` (table) - The NIS script table itself, used to set `nis.skippable`.
    *   `dat` (table) - The data table populated in `init`.
    *   `lines` (table or nil) - A list of dialogue strings for Maxwell to speak. If `nil`, no dialogue is spoken.
*   **Returns:** Nothing.
*   **Error states:** If `lines` is `nil`, the dialogue section is skipped.

### `cancel(dat)`
*   **Description:** Instantly aborts and cleans up the NIS. Cancels Maxwell's appearance, removes him, wakes Wilson immediately, and restores normal camera and player controls.
*   **Parameters:** `dat` (table) - The data table populated in `init`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
    *   `"animqueueover"` — fired on Maxwell's animation queue completion; triggers removal of the Maxwell entity after the full sequence.
    *   `"animover"` — fired on Maxwell's animation completion; used during `cancel` to remove the entity.
- **Pushes:** None.