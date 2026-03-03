---
id: lavaarenaeventstate
title: Lavaarenaeventstate
description: Manages the state and progression of the Lava Arena event, including round tracking, victory condition reporting, and player quest data for network synchronization.
tags: [event, boss, combat, network, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d46ba4a1
system_scope: world
---

# Lavaarenaeventstate

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lavaarenaeventstate` is a network-synchronized component that tracks and exposes the current state of the Lava Arena event. It stores and broadcasts round number, victory/defeat state, server-wide progression JSON, and per-player quest JSON across the network. It is attached to the world entity and only activates logic on the server (`ismastersim`) while providing read-only query interfaces for clients.

## Usage example
```lua
-- Accessing the lava arena event state from the world entity
if TheWorld.components.lavaarenaeventstate then
    local round = TheWorld.components.lavaarenaeventstate:GetCurrentRound()
    local progression_json = TheWorld.components.lavaarenaeventstate:GetServerProgressionJson()
    local player_quest = TheWorld.components.lavaarenaeventstate:GetServerPlayerQuestJson(1)
end
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity (typically the world) that owns this component. |
| `_netvars.round` | `net_smallbyte` | — | Network variable holding the current arena round number. |
| `_netvars.victorystate` | `net_tinybyte` | — | Network variable indicating current match state (`Playing`, `Victory`, `Defeat`). |
| `_netvars.progression_json` | `net_string` | — | Network variable containing JSON string for server-level progression. |
| `_netvars.player_quest_json[i]` | `net_string` (array) | — | Per-player quest JSON strings, indexed by player slot (1-based). |

## Main functions
### `GetServerProgressionJson()`
* **Description:** Returns the current server-wide progression state as a JSON string.
* **Parameters:** None.
* **Returns:** `string` — JSON-encoded progression data.
* **Error states:** Returns an empty string if no data has been set.

### `GetCurrentRound()`
* **Description:** Returns the current arena round number, clamped to at least `1`.
* **Parameters:** None.
* **Returns:** `number` — the current round (always `>= 1`).
* **Error states:** None.

### `GetServerPlayerQuestJson(quest_slot)`
* **Description:** Returns the quest JSON string for a specific player slot.
* **Parameters:** `quest_slot` (number) — the 1-based index of the player slot.
* **Returns:** `string` — JSON-encoded quest data for that player; empty string if unset.
* **Error states:** Index out of bounds (e.g., `quest_slot <= 0` or `> maxplayers`) may yield invalid network variable access.

### `GetDebugString()`
* **Description:** Returns a placeholder debug string for debugging purposes.
* **Parameters:** None.
* **Returns:** `string` — currently always `"?"`.

## Events & listeners
- **Listens to:**  
  - `victorystatedirty` — triggers match-end logic on the client when the victory state changes.  
  - `playeractivated` — same handler as above, used when a player joins the world.  
- **Pushes:**  
  - `endofmatch` — fired on the client when the match ends, with payload `{ victory = true/false }`.  
  - (Server-side) events are expected to be fired by other systems (e.g., `victorystatedirty`) to notify this component of changes.
