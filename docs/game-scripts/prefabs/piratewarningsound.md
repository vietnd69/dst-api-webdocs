---
id: piratewarningsound
title: Piratewarningsound
description: Creates a one-frame local sound effect for pirate-related warnings, positioned near the player and anchored to their current platform when applicable.
tags: [audio, fx, networking]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 1c42ff2b
system_scope: audio
---

# Piratewarningsound

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `piratewarningsound` prefab is a lightweight, non-persistent entity used exclusively for playing localized audio feedback during pirate warning events. It spawns a temporary entity with a sound emitter at a calculated position relative to the player, ensuring the sound plays only when the player is within proximity (and optionally, on a platform with `walkableplatform`). The prefab is instantiated server-side but only executes its logic on the client (and not on dedicated servers), and it removes itself after one frame to avoid lingering side effects.

## Usage example
This prefab is not intended to be manually spawned. It is created internally by the game, for example by the `piratespawner` logic. In most modding scenarios, you would not interact with this prefab directly.

If absolutely needed for debugging or testing, the following snippet demonstrates how the underlying prefab might be instantiated:

```lua
-- WARNING: Not recommended for production use
local inst = SpawnPrefab("piratewarningsound")
if inst ~= nil then
    -- Position must be set before the one-frame delay fires
    inst.Transform:SetPosition(x, 0, z)
end
```

## Dependencies & tags
**Components used:** `walkableplatform` — accessed via `boat.components.walkableplatform.platform_radius`.  
**Tags:** Adds `FX`.

## Properties
No public properties.

## Main functions
### `CreateSoundFxAt(x, z)`
*   **Description:** Helper function that creates a temporary, non-networked entity at `(x, 0, z)` and plays the sound `"monkeyisland/primemate/announce"` using its sound emitter, then immediately removes the entity.
*   **Parameters:**  
    `x` (number) — X-coordinate for the sound position.  
    `z` (number) — Z-coordinate for the sound position.
*   **Returns:** Nothing.
*   **Error states:** No error handling; silently fails if `SoundEmitter` fails to play.

### `PlayWarningSound(inst)`
*   **Description:** Determines the correct spawn position for the warning sound, based on the player’s location and platform. If the player is within range (`<= 40` units horizontally, plus platform radius), it clamps the sound position to no closer than 15 units to avoid audio distortion and calls `CreateSoundFxAt`.
*   **Parameters:**  
    `inst` (entity) — Unused in this function (present for consistency with event/data flow).
*   **Returns:** Nothing.
*   **Error states:**  
    - Returns early if `ThePlayer` is `nil`.  
    - Returns early if the player has no current platform or the platform lacks `walkableplatform`.  
    - Uses squared distance for comparison to avoid expensive square root calls until needed.

### `fn()`
*   **Description:** Constructor function for the prefab. Sets up the minimal entity structure (transform, network, tag), schedules a one-frame-delayed call to `PlayWarningSound` on non-dedicated clients, and marks the entity as non-persistent with a self-removal task after 1 second (server-side).
*   **Parameters:** None.
*   **Returns:** `inst` — The created entity.
*   **Error states:** Returns immediately on dedicated servers without scheduling the sound playback.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** None.
