---
id: SGcarnival_crowkid
title: Sgcarnival Crowkid
description: Manages state machine behaviors for the Carnival Crowkid entity, including idle animations, snack eating, campfire sitting, minigame reactions, and reward giving during carnival events.
tags: [ai, stategraph, carnival, npc, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 54d47599
system_scope: entity
---

# Sgcarnival Crowkid

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
The `SGcarnival_crowkid` state graph defines the complete behavior tree for the Carnival Crowkid NPC. It orchestrates animations, sound playback, and logic flow across various states — including idle, eating snacks, sitting at campfires, reacting to minigame excitement (cheer/boo), reacting to minigame completion, and giving rewards upon gift receipt. It integrates with the `locomotor`, `talker`, `stackable`, `minigame_spectator`, and common state helpers to produce contextual, dynamic behaviors.

## Usage example
This state graph is not added as a component but instantiated automatically by the engine as part of the carnival_crowkid prefab definition. It is invoked internally when the Crowkid entity enters or transitions between behaviors.

```lua
-- The state graph is referenced internally by the Crowkid prefab and is not manually instantiated.
-- Example of how it integrates:
-- The prefab `carnival_crowkid` includes:
-- inst:AddStateGraph("carnival_crowkid")
-- inst.sg:GoToState("idle")
```

## Dependencies & tags
**Components used:** `locomotor`, `talker`, `stackable`, `minigame_spectator`  
**Tags added/removed/checks:** States may include tags `"idle"`, `"canrotate"`, `"talking"`, `"busy"`, `"flight"`, `"game_over"`. No static tags are added/removed; tags are set per-state via the `tags` array.

## Properties
No public properties are exposed. State memory (`inst.sg.statemem`) is used internally (e.g., `giver`, `rewards_given`, `loops`) but not intended for external consumption.

## Main functions
### `GoToGameOverState(inst)`
*   **Description:** Transitions the Crowkid to the appropriate minigame-over state (`minigame_over_cheer` or `minigame_over_boo`) depending on whether the minigame ended successfully (i.e., `_good_ending` is `true`).
*   **Parameters:** `inst` (Entity instance) — the Crowkid entity.
*   **Returns:** Nothing.
*   **Error states:** Uses `nil` as a safe fallback if `minigame_spectator` or `_good_ending` are missing.

### `DropRewards(inst)`
*   **Description:** Spawns carnival prize tickets and game tokens at the Crowkid's position and launches them toward the gift-giver if known. Ensures rewards are only given once per interaction.
*   **Parameters:** `inst` (Entity instance) — the Crowkid entity.
*   **Returns:** Nothing.
*   **Error states:** No-op if `rewards_given` is already `true`; gracefully handles a missing or invalid `giver`.

### `GetEatSnackState(inst)`
*   **Description:** Returns the appropriate state name (`"eat_popcorn"` or `"eat_corntea"`) based on the Crowkid's `has_snack` field, or `nil` if no snack is held.
*   **Parameters:** `inst` (Entity instance) — the Crowkid entity.
*   **Returns:** String (`"eat_popcorn"`, `"eat_corntea"`) or `nil`.
*   **Error states:** Assumes `inst.has_snack` is a string; returns `nil` if it is missing or unexpected.

## Events & listeners
- **Listens to:**  
  - `locomote` — via `CommonHandlers.OnLocomote(true, true)`  
  - `minigame_spectator_start_outro` — triggers transition to game-over state  
  - `ontalk` — initiates talk animation if idle, depending on minigame presence  
  - `animover` and `animqueueover` — used across multiple states to return to `idle` or loop animations  
- **Pushes:**  
  - No events are explicitly pushed by this state graph. It responds to external events but does not fire its own.