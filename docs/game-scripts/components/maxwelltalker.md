---
id: maxwelltalker
title: Maxwelltalker
description: Manages scripted dialogue and cutscenes for Maxwell, handling speech synchronization, input skipping, player control disable/enable, and camera control during narrative events.
tags: [narrative, ai, cutscene, input, camera]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c66ac35b
system_scope: entity
---

# Maxwelltalker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MaxwellTalker` orchestrates Maxwell’s scripted dialogue sequences and narrative events in DST. It is responsible for driving speech timing, animation states, sound playback, input skipping, and temporarily disabling player control and HUD. It integrates with the `talker` component for text display and modifies camera and player controller state to create cinematic moments. Typically used during initial encounters or story-critical events involving Maxwell.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("maxwelltalker")
inst.components.maxwelltalker:SetSpeech("MAXWELL_INTRO")
inst.components.maxwelltalker.speeches = {
    MAXWELL_INTRO = {
        disableplayer = true,
        delay = 0.5,
        appearanim = "appear",
        dialoganim = "talk_loop",
        dialogpostanim = "talk_end",
        disappearanim = "disappear",
        voice = "dontstarve/maxwell/talk_LP",
        { string = "Well, hello there.", wait = 2.0 },
        { string = "You’ve finally arrived.", wait = 2.5, waitbetweenlines = 0.5 },
    }
}
inst.components.maxwelltalker:Initialize()
inst.components.maxwelltalker:DoTalk()
```

## Dependencies & tags
**Components used:** `talker`, `playercontroller`, `health`, `sleeper`, `revivablecorpse` (read-only checks only).  
**Tags:** Adds `maxwellnottalking` on instantiation; removes it when speech starts; removes it on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `speech` | string \| nil | `nil` | Key (e.g., `"SPEECH_KEY"`) referencing a speech block in `speeches`. If `nil`, defaults to `"NULL_SPEECH"`. |
| `speeches` | table | `nil` | Map of speech definitions (keyed by name), each containing animation, timing, and dialogue data. |
| `canskip` | boolean | `false` | Whether the current speech sequence can be skipped via input. Set to `true` once speech begins. |
| `defaultvoice` | string | `"dontstarve/maxwell/talk_LP"` | Default sound path used when no per-section or per-speech voice is defined. |
| `inputhandlers` | table of InputHandler | `{}` | List of registered input handlers for skip controls. Cleared after speech ends. |

## Main functions
### `SetSpeech(speech)`
*   **Description:** Sets the speech to be used by this component. Must be called before `Initialize()` or `DoTalk()` to define the active sequence.
*   **Parameters:** `speech` (string) — The key identifying the desired speech entry in `speeches`. Can be `nil` (defaults to `"NULL_SPEECH"`).
*   **Returns:** Nothing.

### `Initialize()`
*   **Description:** Prepares the entity and player for speech. Hides player HUD, disables player control, puts the player in the `"sleep"` state, repositions Maxwell toward the player, and configures camera zoom/position.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoTalk()`
*   **Description:** Executes the full speech sequence: plays appearance animation, iterates over speech sections (dialogue, sound, wait), calls `talker:Say`, handles end-of-line transitions, triggers disappearance animation, removes the entity, and restores player control/ HUD/camera. Internally calls `oncancel` flow on completion.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopTalking()`
*   **Description:** Immediately halts current speech, kills talk sound, clears `talker`, cancels tasks, and nullifies the speech data. Used for emergency termination.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCancel()`
*   **Description:** Handles mid-speech cancellation (typically invoked via `OnClick()`). Runs `StopTalking()`, executes Maxwell’s disappearance logic (sound, smoke, animation), removes the entity if animation ends, and restores player state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnClick()`
*   **Description:** Input handler triggered by primary, secondary, attack, inspect, or action controls. If `canskip` is `true` and speech disables player, cancels the talk and cleans up input handlers.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsTalking()`
*   **Description:** Reports whether a speech sequence is currently active.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if `self.inst.speech ~= nil`, otherwise `false`.

### `OnRemoveFromEntity()`
*   **Description:** Cleanup method called when the component is removed from its entity. Ensures the `maxwellnottalking` tag is removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animqueueover` — registered during disappearance to remove the entity after the animation completes.
- **Pushes:** None.

## Notes
- The component assumes the entity has `Transform`, `AnimState`, `SoundEmitter`, `Health`, `Talker`, and `Sleeper` components present during speech operations.
- Speech sections are defined in the `speeches` table under a chosen key. Each section can contain `string`, `anim`, `sound`, `wait`, and `waitbetweenlines` fields.
- The component modifies `TheCamera` and `GetPlayer().HUD` globally during initialization and cleanup.
- Player state transition to/from `"sleep"` occurs only if `speech.disableplayer` is `true`.
- Input handlers are registered once in the constructor and removed automatically on talk end or cancellation.
