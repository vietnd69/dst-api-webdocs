---
id: maxwelltalker
title: Maxwelltalker
description: Manages scripted dialogue sequences for Maxwell's interactions, including speech playback, player input blocking, and scene transitions during adventure mode cutscenes.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: brain
source_hash: c66ac35b
---

# Maxwelltalker

## Overview
This component orchestrates Maxwell's scripted dialogue and cinematic events—such as cutscenes—during adventure mode. It controls speech playback, handles player input to skip dialogue, manages camera focus and HUD visibility, and triggers animation/sound sequences for Maxwell's entrance, speech, and exit.

## Dependencies & Tags
**Component Dependencies:**
- `talker` (used conditionally for speech rendering via `Say()`)

**Tags:**
- Adds `"maxwellnottalking"` tag initially; removed when speech is active.
- Removes `"maxwellnottalking"` tag on component removal.

**Entities:**
- Requires an entity with `Transform`, `AnimState`, `SoundEmitter`, and ` wilson` (player) components to function correctly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `speech` | string / table | `nil` | Name of the speech sequence to play (or the sequence table itself if pre-resolved). |
| `speeches` | table | `nil` | Dictionary mapping speech names to their definition tables. |
| `canskip` | boolean | `false` | Flag indicating whether user input can terminate the speech early. Set to `true` after speech begins. |
| `defaultvoice` | string | `"dontstarve/maxwell/talk_LP"` | Default sound file used for speech audio. |
| `inputhandlers` | table | `{}` | List of input control handlers created during initialization to enable skipping via controls. |

## Main Functions

### `Initialize()`
* **Description:** Prepares the scene for speech playback: hides the player HUD, disables player controls, places Maxwell near the player, rotates him to face the player, and configures the camera. Only executes if `speech.disableplayer` is true.
* **Parameters:** None.

### `DoTalk()`
* **Description:** Executes the full speech sequence: shows Maxwell, plays entrance animations/sounds, iterates through speech sections (including text, animations, and sounds), waits per section, handles exit animations/sounds, and restores player control upon completion. Handles both adventure and non-adventure modes differently for entrance/exit sounds.
* **Parameters:** None.

### `OnCancel()`
* **Description:** Immediately terminates the current speech sequence: stops talking, restores player HUD/control, resets camera, and optionally triggers Maxwell’s disappearance animation (with smoke FX and sound). If `speech.disappearanim` exists, schedules self-removal after animation completes.
* **Parameters:** None.

### `OnClick()`
* **Description:** Handles user input to skip the speech if `canskip` is true and `speech.disableplayer` is active. Cancels speech, removes all registered input handlers, and invokes `OnCancel()`.
* **Parameters:** None.

### `StopTalking()`
* **Description:** Stops any ongoing speech audio and task timers, clears the current speech state, and shuts down the talker component if present. Does *not* restore player state or reset camera.
* **Parameters:** None.

### `IsTalking()`
* **Description:** Returns whether a speech sequence is currently active.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.inst.speech ~= nil`.

### `SetSpeech(speech)`
* **Description:** Sets the current speech to be played by name (e.g., `"INTRO"`).
* **Parameters:**
  - `speech` (string): Key in the `speeches` table specifying which speech to play.

## Events & Listeners
- Listens to `"animqueueover"` on `self.inst` to remove the entity after disappearance animation ends (in `DoTalk()` and `OnCancel()`).
- Registers input handlers for `CONTROL_PRIMARY`, `CONTROL_SECONDARY`, `CONTROL_ATTACK`, `CONTROL_INSPECT`, `CONTROL_ACTION`, and `CONTROL_CONTROLLER_ACTION` during construction; these handlers call `OnClick()`.
- Registers a global listener `speech = onspeech` on the class, which toggles the `"maxwellnottalking"` tag based on whether `speech` is `nil`.