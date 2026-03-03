---
id: lunarhailbirdsoundmanager
title: Lunarhailbirdsoundmanager
description: Manages audio levels for the lunar hail bird event, controlling ambient sound playback based on event intensity.
tags: [audio, event, server, client]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5dd843ff
system_scope: audio
---

# Lunarhailbirdsoundmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`lunarhailbirdsoundmanager` is a client-side component that manages sound playback during lunar hail events. It listens for updates to a networked parameter (`birds_dropping_param`) and adjusts ambient audio levels accordingly — playing "scuffling/fighting" or "corpses falling" sounds as event intensity increases, or silencing the audio when the event ends. The component delegates ambient sound management to `ambientsound.lua` and sound playback to `TheFocalPoint.SoundEmitter`.

Note: The component comment indicates it is "Handled by birdmanager.lua", but this file contains the complete implementation for sound control.

## Usage example
```lua
-- The component is automatically added to the world entity during event initialization
-- No manual usage is typical for modders; event intensity is controlled via birdmanager.lua
-- Example usage if invoked manually:
inst.components.lunarhailbirdsoundmanager:SetLevel(inst.components.lunarhailbirdsoundmanager.HAIL_SOUND_LEVELS.CORPSES)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The owner entity (typically `TheWorld`). |
| `birds_dropping_param` | `net_tinybyte` | `0` | Networked parameter synced to clients to reflect current event intensity. |
| `sound_level` | number | `0` | Local cached copy of the current sound level (aligned with `birds_dropping_param`). |
| `HAIL_SOUND_LEVELS` | table | `{NONE=0, SCUFFLES=1, CORPSES=2, NO_AMBIENCE=3}` | Constants defining possible sound levels. |

## Main functions
### `GetIsBirdlessAmbience()`
*   **Description:** Returns whether the bird ambience has been removed (i.e., `sound_level > 0`). Used to determine if bird-related ambience should be suppressed elsewhere (e.g., turf ambience).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if bird ambience is active (`sound_level > 0`), otherwise `false`.
*   **Error states:** None.

### `SetLevel(level)`
*   **Description:** Sets the sound level for the lunar hail event. Syncs the value to clients via `birds_dropping_param` and triggers sound playback locally on non-dedicated servers.
*   **Parameters:** `level` (number) — One of the `HAIL_SOUND_LEVELS` constants.
*   **Returns:** Nothing.
*   **Error states:** None.

## Events & listeners
- **Listens to:** `hailbirddirty` — Fired when `birds_dropping_param` is updated on the client; triggers local sound update.
- **Pushes:** None identified.
