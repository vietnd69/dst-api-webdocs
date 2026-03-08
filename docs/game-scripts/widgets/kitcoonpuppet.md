---
id: kitcoonpuppet
title: KitcoonPuppet
description: Manages the visual representation and state updates of a virtual pet kitcoon in the game's UI, including animations, hunger/happiness statistics, and hibernation lifecycle.
tags: [ui, pet, animation, state]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: df9e126f
system_scope: ui
---

# KitcoonPuppet

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`KitcoonPuppet` is a UI widget that visually represents and manages a virtual pet (the kitcoon) in the game's frontend. It handles animation playback, statistical updates (hunger, happiness, size, poops), user interaction (naming and playing), and lifecycle events such as entering hibernation. The component reads and writes persistent data via `Profile` functions and synchronizes state across game sessions using `RunKitcoonLongUpdate`.

## Usage example
```lua
local kitcoon = KitcoonPuppet(
    nil, -- profile_remove_me (unused)
    true, -- interactable
    { {x=100, y=200, scale=1.0} }, -- positions
    0.5 -- chance_to_show
)
kitcoon:OnEnable()
-- Later, if player interacts:
kitcoon:Play()
-- Or to simulate eating:
kitcoon:Eat()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `interactable`, `kit_active`; uses `Profile` for data persistence.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chance_to_show` | number | `0.4` | Probability the puppet is shown on enable. |
| `interactable` | boolean | `nil` | Whether the puppet responds to user input. |
| `positions` | table or `nil` | `nil` | List of position/scale tables for random placement. |
| `anim` | `UIAnim` | — | Main animation widget for the kitcoon. |
| `nametag_anim` | `UIAnim` | — | Animation widget for the name tag. |
| `size` | number | `0` | Current kitcoon size (between `MIN_SIZE` and `MAX_SIZE`). |
| `hunger` | number | `0` | Current hunger level (0 = starved, 1 = full). |
| `happiness` | number | `0` | Current happiness level (0 = unhappy, 1 = happy). |
| `poops` | number | `0` | Current number of poops (capped at `MAX_POOPS`). |
| `kit_active` | boolean | `false` | Whether the kitcoon is active (not hibernating or unnamed). |

## Main functions
### `PickPosition(positions)`
*   **Description:** Sets the puppet’s position and scale by randomly selecting from the provided or stored `positions` list.
*   **Parameters:** `positions` (table or `nil`) – list of position tables `{x, y, scale}`; defaults to `self.positions` if `nil`.
*   **Returns:** Nothing.

### `InitNewKit()`
*   **Description:** Initializes a new kitcoon with a random build, default stats, timestamps, and persists them to `Profile`.
*   **Parameters:** None.
*   **Returns:** `build` (string) – the randomly selected build name.

### `StartKit()`
*   **Description:** Activates the kitcoon, sets up animations and stats from `Profile`, and shows the main animation.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GoToHibernation(cb)`
*   **Description:** Moves the kitcoon to the pouch location, hides it, and updates hibernation timestamps in `Profile`.
*   **Parameters:** `cb` (function) – callback executed after animation completes.
*   **Returns:** Nothing.

### `WakeFromHibernation()`
*   **Description:** Restores the kitcoon from hibernation, adjusts birth time to avoid aging, and moves it back to its last known position.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DoIntention(on_start)`
*   **Description:** Plays a context-sensitive idle animation and sound (yawning, distress, licking, playing) based on current hunger/happiness.
*   **Parameters:** `on_start` (boolean) – if true, starts in idle loop; otherwise responds to current stats.
*   **Returns:** Nothing.

### `Play()`
*   **Description:** Increases happiness and plays an affectionate animation (nuzzle or pet) in response to user interaction.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TryQueueEat()`
*   **Description:** Queues an eat animation if idle and not hibernating.
*   **Parameters:** None.
*   **Returns:** `true` if queued; `false` otherwise.

### `Eat()`
*   **Description:** Executes the queued eat animation, reduces hunger, and updates `Profile`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `RemovePoop()`
*   **Description:** Decrements the poop count and updates `Profile`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `LeaveGameScreen()`
*   **Description:** Applies a happiness penalty based on current poop count when leaving the frontend.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DebugReset()`
*   **Description:** Resets kitcoon stats to a fresh state via `InitNewKit()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `OnUpdate(dt)` – schedules next intention animation based on idle time; `OnEnable()` – initializes visibility, stats, and animation from `Profile`; `OnDisable()` – cancels pending intention tasks.
- **Pushes:** None identified (uses `TheFrontEnd:GetSound():PlaySound()` for audio feedback but no custom events).