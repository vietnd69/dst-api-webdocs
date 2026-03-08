---
id: SGcarrat
title: Sgcarrat
description: Defines the state machine and behavior logic for carrat entities, including movement, burrowing, racing animations, and interaction with race-related components.
tags: [ai, locomotion, race, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: a6766b40
system_scope: entity
---

# Sgcarrat

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGcarrat` is a state graph that controls the animation and behavior of carrat entities in DST. It handles core actions such as burrowing (`submerge`), emerging (`emerge_fast`), eating, picking up items, reacting to race events (e.g., exhaustion, victory/defeat), and responding to environmental hazards like being trapped or stunned. It integrates tightly with the `locomotor`, `health`, `inventoryitem`, `lootdropper`, `sleeper`, `yotc_racecompetitor`, `yotc_racestats`, and `entitytracker` components.

## Usage example
This state graph is automatically assigned to carrat prefabs by the engine. Modders typically interact with it indirectly via component interactions, but for reference:

```lua
-- Example of triggering a carrat's stunned state from a script:
if carratinst.sg ~= nil then
    carratinst:PushEvent("stunbomb")
end

-- Example of marking a carrat as exhausted for race behavior:
if carratinst.components.yotc_racecompetitor ~= nil then
    carratinst:PushEvent("yotc_racer_exhausted")
end
```

## Dependencies & tags
**Components used:**  
`locomotor`, `health`, `inventoryitem`, `lootdropper`, `sleeper`, `yotc_racecompetitor`, `yotc_racestats`, `entitytracker`

**Tags:**  
`idle`, `canrotate`, `busy`, `noattack`, `noelectrocute`, `stunned`, `trapped`, `exhausted`, `alert`, `sleeping`, `moving`, `running`, `softstop`

## Properties
No public properties are declared directly in this state graph.

## Main functions
### `beefalotest(inst)`
*   **Description:** Checks if a non-baby beefalo is within a 20-unit radius. Used to determine if the carrat should continue eating instead of submerging.
*   **Parameters:** `inst` (Entity) - The carrat entity.
*   **Returns:** `true` if a qualifying beefalo is nearby; otherwise `false`.
*   **Error states:** Returns `false` if `inst.beefalo_carrat` is falsy or no beefalos match the tag criteria.

### `play_carrat_scream(inst)`
*   **Description:** Plays the carrat's scream sound.
*   **Parameters:** `inst` (Entity) - The carrat entity.
*   **Returns:** Nothing.

### `GoToPostRaceState(inst)`
*   **Description:** Determines the appropriate post-race state based on race outcome and prize availability. If applicable, transitions the carrat to a reward state and returns `true`.
*   **Parameters:** `inst` (Entity) - The carrat entity.
*   **Returns:** `true` if a post-race state was entered; otherwise `false`.
*   **Error states:** Returns `false` if race-related components are missing or state is not `"postrace"`/`"raceover"`.

## Events & listeners
- **Listens to:**  
  - `locomote` – Syncs movement state tags (`moving`, `running`, `idle`) with `locomotor` inputs.  
  - `trapped` – Transitions to `"trapped"` state.  
  - `yotc_racer_exhausted` – Enters `"exhausted"` state if not dead, sleeping, or already exhausted.  
  - `stunbomb` – Enters `"stunned"` state.  
  - `animover`, `animqueueover` – Handles animation-driven state transitions (e.g., `"idle2"`, `"eat"`, `"pickup"`).  
  - `gotosleep`, `wakeup`, `freeze`, `electrocute`, `attacked`, `death`, `sink`, `fallinvoid` – Handled via `CommonStates` helper functions.

- **Pushes:**  
  - `carrat_error_sleeping` – Fired during exhaustion recovery when stamina is fully depleted and sleep chance triggers.

