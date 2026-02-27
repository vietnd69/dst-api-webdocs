---
id: lunarhailbirdsoundmanager
title: Lunarhailbirdsoundmanager
description: Manages audio state and sound playback for lunar hail bird events based on server-controlled sound level updates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: audio
source_hash: 5dd843ff
---

# Lunarhailbirdsoundmanager

## Overview
This component handles audio cue synchronization and playback for lunar hail bird events (e.g., scuffles, falling corpses) in Don't Starve Together. It listens for sound-level updates via networked parameters and controls the playback of shared ambient sounds via `TheFocalPoint.SoundEmitter`, separating responsibilities between server (authoritative) and clients (sound emitter).

## Dependencies & Tags
- Relies on `net_tinybyte` networked parameter system (`net_tinybyte(self.inst.GUID, ...)`).
- Uses `TheWorld.Map`, `TheWorld`, `TheFocalPoint.SoundEmitter`, `TheNet`, and `TheNet:IsDedicated()` from core globals.
- Listens for the custom event `"hailbirddirty"` on clients.
- Tags: None added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | The owning entity instance (typically the world). |
| `birds_dropping_param` | `net_tinybyte` | `0` | Networked parameter synced with clients to drive sound level changes. |
| `sound_level` | `integer` | `0` | Current sound level (cached from `birds_dropping_param`), ranging 0–3. |
| `HAIL_SOUND_LEVELS` | `table` | `{NONE = 0, SCUFFLES = 1, CORPSES = 2, NO_AMBIENCE = 3}` | Enum defining four distinct auditory states for the event. |

## Main Functions
### `GetIsBirdlessAmbience()`
* **Description:** Returns `true` if the current sound level indicates bird ambience is absent or degraded (i.e., `sound_level > 0`), indicating no active bird chirps in ambient sound.
* **Parameters:** None.

### `SetLevel(level)`
* **Description:** Sets the server-authoritative sound level, updates the networked parameter, and triggers sound playback (on non-dedicated servers only). Should only be called on the server.
* **Parameters:**
  - `level` (*integer*): One of the `HAIL_SOUND_LEVELS` constants (0–3).

### `PlaySoundLevel(level)` *(local helper)*
* **Description:** Plays or stops the shared "gestalt_attack_storm" sound and sets the `"birds_dropping"` sound parameter; kills the sound if `level` is 0 or 3.
* **Parameters:**
  - `level` (*integer*): Desired sound level (0–3). Used to decide whether to play/kill sounds and what parameter value to apply.

## Events & Listeners
- Listens for `"hailbirddirty"` event on non-mastersim (client) instances to update `sound_level` and re-trigger sound playback via `OnHailBirdDirty`.
- Pushes `"updateambientsoundparams"` event via `TheWorld:PushEvent(...)` when changing sound states to refresh ambient sound systems.