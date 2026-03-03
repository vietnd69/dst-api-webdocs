---
id: ambientlighting
title: Ambientlighting
description: Manages dynamic ambient lighting color transitions based on world phase, moon phase, season, weather, and player night vision state.
tags: [environment, lighting, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: af52a4cc
system_scope: environment
---

# Ambientlighting

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AmbientLighting` computes and applies the current ambient lighting colour for the game world, using lerping to smoothly transition between colours for different phases of day, moon phases, seasons, and weather conditions. It responds to player activation/deactivation events to support per-player night vision overrides and ambient lighting customization. This component is attached to the world entity and drives the global `TheSim:SetAmbientColour` and `TheSim:SetVisualAmbientColour` calls.

It interacts with the `playervision` component to apply custom ambient overrides when night vision is active.

## Usage example
```lua
-- This component is automatically added to the world prefab and is not typically added manually.
-- Example of triggering a lighting override:
TheWorld.inst.components.ambientlighting:OnOverrideAmbientLighting({ r = 0.5, g = 0.5, b = 0.5 })
-- Note: `OnOverrideAmbientLighting` is an internal event handler — use the corresponding event instead.
```

## Dependencies & tags
**Components used:** `playervision` (via `GetNightVisionAmbientOverrides`)
**Tags:** Checks `cave` tag on the instance to adjust default lighting behaviour.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *(instance passed to constructor)* | The entity that owns this component (typically the world). |

**Note:** Most member variables are private and internal to the component's state management.

## Main functions
### `GetVisualAmbientValue()`
*   **Description:** Computes and returns a single scalar value representing the current visual ambient lighting intensity, used for UI or debugging purposes. Accounts for flash state, light percent, and RGB averages.
*   **Parameters:** None.
*   **Returns:** `number` — A float value derived from the override colour's RGB components weighted by light percent, or flash colour when active.

### `OnUpdate(dt)`
*   **Description:** The main update loop for lighting interpolation and flash state handling. Calls internal update functions for real and override colour sets, handles screen flash sequences, and pushes final colour to the renderer. Runs during `Update` phase.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing. Updates internal state and calls `PushCurrentColour`.

### `LongUpdate(dt)`
*   **Description:** Called when the component has been paused or stopped. Ensures final interpolation is complete, resets flash and lerp state, and pushes final colour before stopping updates. Typically used when resuming from a long pause or large time skip.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"phasechanged"` — Updates _phase and triggers recomputation of ambient colour.
  - `"moonphasechanged2"` — Updates _moonphase and triggers recomputation if phase is `"night"`.
  - `"weathertick"` — Updates `_realcolour.lightpercent` and `_overridecolour.lightpercent`.
  - `"screenflash"` — Initiates a screen flash sequence.
  - `"seasontick"` — Updates _season (only if not in a cave).
  - `"playeractivated"` — Caches the active player and registers `nightvision` and `nightvisionambientoverrides` event callbacks.
  - `"playerdeactivated"` — Cleans up player-specific event listeners and disables night vision override.
  - `"overrideambientlighting"` — Applies a fixed ambient colour override (note: marked `NOT safe to use!` in comments).
  - `"continuefrompause"` — Refreshes screen flash scaling setting from profile.
- **Pushes:** None — This component only consumes events and does not fire its own.

**Note:** `OnOverrideAmbientLighting` is an internal event handler, not a public API. Modders should use the `"overrideambientlighting"` event to trigger it, but note the safety warning in comments.
