---
id: balatro_machine
title: Balatro Machine
description: Hosts the Balatro mini-game session, manages card gameplay state, joker selection, and reward distribution for player interaction.
tags: [minigame, reward, interaction, game_logic]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 32147cd1
system_scope: entity
---

# Balatro Machine

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `balatro_machine` prefab acts as a host for the Balatro mini-game session. It manages game state—including joker selection, card deck management, discard rounds, scoring, and reward processing—and coordinates interaction between the player (via popup communication) and the world (via loot and FX spawning). It integrates with the `activatable`, `talker`, `combat`, and `playingcardsmanager` components and listens for in-game popup events to orchestrate gameplay flow.

## Usage example
```lua
-- Example usage within a prefab constructor (e.g., during world generation or event spawn)
local inst = Prefab("balatro_machine", fn, assets)
inst:AddComponent("activatable")
inst.components.activatable.OnActivate = OnActivated
inst.components.activatable.standingaction = true
```

## Dependencies & tags
**Components used:**
- `activatable` (for activation handling and standing action)
- `talker` (for dialogue and chatter management)
- `combat` (via `MakePlayingCard` and spawned loot, sets target on enemies)
- `playingcardsmanager` (creates card FX rewards)
- `updatelooper` (client-side frame update loop)

**Tags:**
- Adds `structure` tag on the entity.
- Client-side FX cards carry the `FX` tag.
- No persistent tags used for gameplay logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_currentgame` | table | `{}` | Stores runtime game state: `user`, `round`, `joker`, `jokerchoices`, `carddeck`, `selectedcards`, `_lastselectedcards`, `score`. |
| `light_mode` | net_tinybyte | `LIGHTMODES.IDLE1` | Networked light state indicator (used by `balatro_util.lua`). |
| `rewarding` | boolean | `false` | Flag indicating whether rewards are currently being issued. |
| `cardstate` | string (client-only) | `CARD_STATE.NONE` | Tracks client-side card animation state: `"DEAL"`, `"DISCARDING"`, `"NONE"`, or `"SHOWING"`. |
| `cardfx` | table of FX entities (client-only) | `nil` | Array of 5 card FX entities used for rendering and animation. |
| `deck` | table of integers (client-only) | `nil` | Local deck array used by `DrawCard()` for card IDs (e.g., `s*100 + n`). |

## Main functions
### `OnActivated(inst, doer)`
*   **Description:** Initializes and starts a new Balatro game session for the specified player (`doer`). Prepares the deck, joker pool, and selected cards, sets up event listeners, and transitions the player to the `"playingbalatro"` state. Only runs on the master simulation.
*   **Parameters:**
    - `inst` (Entity) — The Balatro machine entity.
    - `doer` (Entity) — The player initiating the game.
*   **Returns:** Nothing.
*   **Error states:** None; always succeeds on master sim. Assumes valid `BALATRO_UTIL` definitions.

### `EndInteraction(inst, doer)`
*   **Description:** Terminates the Balatro session for the player, evaluates the final score, and triggers reward logic (if score valid) or closes with a message. Cleans up event listeners and resets `_currentgame`.
*   **Parameters:**
    - `inst` (Entity) — The Balatro machine entity.
    - `doer` (Entity) — The player ending the session.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `doer` is not the current `_currentgame.user`. Uses score `#REWARDS` (lowest reward) if player ran away mid-game (score nil but joker was chosen).

### `SpawnRewards(inst, doer, score, loot)`
*   **Description:** Spawns loot items (e.g., `"hound"`, `"goldnugget"`) at walkable positions around the machine using `FindWalkableOffset`. Attaches a `combat` target if the spawned item has combat logic (e.g., enemies).
*   **Parameters:**
    - `inst` (Entity) — The Balatro machine entity.
    - `doer` (Entity) — The player (unused directly, but passed from caller).
    - `score` (integer) — The rank/score level (1-based index).
    - `loot` (table) — A loot entry: `{string_name, count, [optional_tuning_key]}`.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on `FindWalkableOffset` returning valid positions.

### `DoDelayedRewards(inst, doer, score)`
*   **Description:** Orchestrates reward selection and dispatch. Spawns loot with a short delay (2s) and schedules card-based rewards (if `score > 3` and `score ~= 9`). Handles invalid or skipped reward tiers via chatter.
*   **Parameters:**
    - `inst` (Entity) — The Balatro machine entity.
    - `doer` (Entity) — The player.
    - `score` (integer) — Final game score/rank.
*   **Returns:** Nothing.
*   **Error states:** Uses fallback random sub-reward if `REWARDS[score]` is an array (multiple options). Skips rewards if tuning key (e.g., `HOUNDMOUND_ENABLED`) is disabled.

### `Card_UpdateFn(inst)`
*   **Description (client-only):** Drives client card animation state transitions: initiating card deals (`DEAL` → `SHOWING`) and discard flows (`SHOWING` → `DISCARDING`) based on `cardstate`.
*   **Parameters:**
    - `inst` (Entity) — The Balatro machine entity (used as parent for card FX).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"onremove"` — On `doer` removal, calls `EndInteraction`.
  - `"ms_closepopup"` — On popup close (Balatro only), triggers `EndInteraction`.
  - `"ms_popupmessage"` — Handles gameplay messages (`DISCARD_CARDS`, `CHOOSE_JOKER`) and updates game state.
- **Pushes:** None directly. Relies on `doer:PushEventImmediate("ms_endplayingbalatro")` to signal session end.

