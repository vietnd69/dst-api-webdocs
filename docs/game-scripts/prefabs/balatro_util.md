---
id: balatro_util
title: Balatro Util
description: Provides shared constants, data encoding utilities, and light animation management for the Balatro minigame system.
tags: [minigame, animation, networking]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 03e5da7e
system_scope: world
---

# Balatro Util

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`balatro_util` is a utility module (not an ECS component) that centralizes data structures and helper functions used across the Balatro minigame. It defines constants for card and joker identification, score thresholds, UI light animation modes, and encoding/decoding logic for discard selections. It also provides server/client-aware debug printing and animation update routines called by the Balatro cabinet or UI machine.

## Usage example
```lua
local util = require "prefabs/balatro_util"

-- Access defined constants
print("Max score rank index:", util.MAX_SCORE)
print("Available cards count:", #util.AVAILABLE_CARDS)

-- Encode/decode discard choices
local discard_data = {true, false, true, false, false}
local encoded = util.EncodeDiscardData(discard_data)
local decoded = util.DecodeDiscardData(encoded)

-- Trigger light mode changes on the Balatro cabinet
util.SetLightMode_Idle(cabinet_inst)
util.SetLightMode_Blink(cabinet_inst)
util.UpdateLoop(cabinet_inst, dt)
```

## Dependencies & tags
**Components used:** None. This is a pure utility module with no component dependencies.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `COLORS` | table | See source | Array of RGB color tables indexed by suit (1-4: spades, hearts, clubs, diamonds). |
| `LIGHTMODES` | table | `{IDLE1=1, BLINK=2}` | Enum for light animation states. |
| `SCORE_RANKS` | table | `[0, 120, 150, ..., 1400]` | Score thresholds indexed by rank (1-8). |
| `MAX_SCORE` | number | `8` | Highest index in `SCORE_RANKS`. |
| `AVAILABLE_JOKERS` | table | See source | List of valid joker IDs (filtered by characters). |
| `AVAILABLE_JOKER_IDS` | table | Inverted `AVAILABLE_JOKERS` | Fast lookup map: `id -> true`. |
| `AVAILABLE_CARDS` | table |见 source | List of encoded card IDs (suit * 100 + pip). |
| `AVAILABLE_CARD_IDS` | table | Inverted `AVAILABLE_CARDS` | Fast lookup map: `card_id -> true`. |
| `NUM_JOKER_CHOICES` | number | `3` | Number of jokers presented per offer. |
| `NUM_SELECTED_CARDS` | number | `5` | Max number of cards in a hand (used for discard encoding). |
| `POPUP_MESSAGE_TYPE` | table | `{CHOOSE_JOKER=1, DISCARD_CARDS=2, NEW_CARDS=3}` | Enum for UI popup types. |
| `DEBUG_MODE` | boolean | `false` | Enabled when running dev branch (`BRANCH == "dev"`). |

## Main functions
### `UpdateLoop(inst, dt)`
* **Description:** Drives the light animation logic for the Balatro cabinet. Should be called each frame in the cabinet's update loop. It reads the current light mode and invokes the appropriate animation subroutine.
* **Parameters:**  
  `inst` (entity instance) – The cabinet instance with `light_mode` and `animstate_lights`/`AnimState`.  
  `dt` (number) – Delta time in seconds.
* **Returns:** Nothing.

### `SetLightMode_Idle(inst, nosound)`
* **Description:** Switches the cabinet's light animation to `IDLE1` mode. Optionally prevents sound playback.
* **Parameters:**  
  `inst` (entity instance) – The cabinet instance.  
  `nosound` (boolean, optional) – If truthy, prevents starting the light blink loop sound.
* **Returns:** Nothing.

### `SetLightMode_Blink(inst)`
* **Description:** Switches the cabinet's light animation to `BLINK` mode and stops any playing loop sound.
* **Parameters:**  
  `inst` (entity instance) – The cabinet instance.
* **Returns:** Nothing.

### `LightMode_DeferredSoundInit(inst)`
* **Description:** Initializes the sound state for the cabinet's light animation based on the current `light_mode`. Starts the loop sound only if in `IDLE1` mode.
* **Parameters:**  
  `inst` (entity instance) – The cabinet instance with `SoundEmitter`.
* **Returns:** Nothing.

### `SetAnimState(inst, animstate)`
* **Description:** Assigns the animation state object to use for lights. Used to redirect light updates to a custom animstate (e.g., UI-side).
* **Parameters:**  
  `inst` (entity instance) – The cabinet instance.  
  `animstate` (animstate instance) – The target animation state.
* **Returns:** Nothing.

### `EncodeDiscardData(data)`
* **Description:** Encodes a 5-entry boolean discard array into a single byte using bit flags.
* **Parameters:**  
  `data` (array of boolean) – Length-5 array where `true` indicates the card is discarded.
* **Returns:** `byte` (number 0–31) – Encoded discard bitmask.

### `DecodeDiscardData(byte)`
* **Description:** Decodes a byte into a 5-entry boolean discard array.
* **Parameters:**  
  `byte` (number) – Encoded discard bitmask (0–31).
* **Returns:** Array of 5 booleans.

### `ServerDebugPrint(message, card_ids, joker_ids, ...)`
* **Description:** Prints a formatted debug message on the server if `DEBUG_MODE` is enabled. Embeds human-readable card/joker names when IDs are provided.
* **Parameters:**  
  `message` (string) – The main log message.  
  `card_ids` (array of number, optional) – Card IDs to resolve and print.  
  `joker_ids` (array of number, optional) – Joker IDs to resolve and print.  
  `...` – Additional arguments passed to `print`.
* **Returns:** Nothing (no-op in non-dev builds).

### `ClientDebugPrint(message, card_ids, joker_ids, ...)`
* **Description:** Same as `ServerDebugPrint`, but prints on the client.
* **Parameters:** Identical to `ServerDebugPrint`.
* **Returns:** Nothing.

## Events & listeners
Not applicable.