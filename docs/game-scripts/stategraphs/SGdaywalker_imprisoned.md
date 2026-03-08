---
id: SGdaywalker_imprisoned
title: Sgdaywalker Imprisoned
description: Manages the behavior and animation state machine for a captured Daywalker entity that struggles against its chains while imprisoned.
tags: [ai, boss, stategraph, combat]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 21598583
system_scope: entity
---

# Sgdaywalker Imprisoned

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGdaywalker_imprisoned` is a stategraph that governs the behavior of a Daywalker entity that is imprisoned and bound to resonating pillars. It handles idle waiting, struggle animations against the chains, and eventual chain-breaking sequences. The state machine integrates closely with the `daywalkerspawner` component (to assess power level for dialogue variation) and the `talker` component (to trigger voice lines), and uses helper functions like `CheckPillars` to determine pillar status during transitions.

## Usage example
This stategraph is applied to the Daywalker entity during initialization and not directly invoked by external code. A typical integration looks like:

```lua
local inst = CreateEntity()
-- ... other setup ...
inst.sg = StateGraph("daywalker_imprisoned", TheWorld, inst, states, events, "idle")
inst:AddComponent("daywalkerspawner")
inst:AddComponent("talker")
```

The stategraph is returned by the file itself and attached to the entity, after which the state machine drives behavior automatically.

## Dependencies & tags
**Components used:** `daywalkerspawner` (via `TheWorld.components.daywalkerspawner:GetPowerLevel()`), `talker` (via `inst.components.talker:Chatter()`), and relies on helper functions like `CheckPillars()`, `ShakeAllCameras`, and `CountPillars`.  
**Tags:** Adds/removes state tags such as `"notalksound"` (to suppress chatter during struggles), `"noelectrocute"` (to prevent electrocution during struggle/chain-breaking), and `"NOCLICK"` (to disable interaction during critical moments).

## Properties
No public properties are declared in the constructor, as this file defines only the stategraph structure via the `states` table and does not declare a class with instance fields.

## Main functions
This file does not define any public methods. All logic is embedded in state callbacks (`onenter`, `ontimeout`, `onexit`) and `FrameEvent` handlers. Key internal functions used are:

### `CheckPillars(inst)`
*   **Description:** Checks the number of resonating and idle pillars attached to the Daywalker. Returns two booleans indicating whether any pillar is vibrating and whether all vibrated pillars are idle.
*   **Parameters:** `inst` (entity) — the Daywalker instance.
*   **Returns:** `any` (boolean) — true if at least one pillar is vibrating; `all` (boolean) — true if all vibrating pillars are idle.

### `DoIdleChain(inst)`
*   **Description:** Plays a repeated chain-shake sound on a randomized timer to simulate tension during idle behavior.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing. Schedules a repeating task and returns early if task already exists.

### `DoChainBreakShake(inst)`
*   **Description:** Triggers a camera shake effect during the chain-break sequence.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `CommonStates.AddElectrocuteStates(...)`
*   **Description:** Extends the stategraph with predefined electrocution states (loop and post) to support electrocution events during idle or struggle states.
*   **Parameters:** Defines timeline frame events for chain-shake sounds and animation names (`loop = "chained_shock_loop"`, `pst = "chained_shock_pst"`).
*   **Returns:** Extends the `states` table in-place with electrocution states.

## Events & listeners
- **Listens to:**  
  - `pillarvibrating` — triggers transition to `"struggle3"` when any pillar vibrates.  
  - `animover` — used across all struggle and idle states to detect animation completion and transition to next state (e.g., back to `"idle"` or forward to `"chain_break"`).  
  - Electrocution events (`onstartelectrocute`, `onendelectrocute`) — added by `CommonStates.AddElectrocuteStates`.

- **Pushes:**  
  - `"daywalkerchainbreak"` — fired during `"chain_break"` state upon pillar destruction and leech spawning (frame event 23).

