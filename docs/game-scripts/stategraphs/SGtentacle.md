---
id: SGtentacle
title: Sgtentacle
description: Manages the state machine for a tentacle enemy, handling idle cycles, taunting, attacking, death, and hit reactions using animation events and combat component integration.
tags: [ai, combat, state-machine]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 16dfa837
system_scope: entity
---

# Sgtentacle

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGtentacle` defines the state graph for a tentacle entity in Don't Starve Together. It orchestrates transitions between idle, rumble, taunt, attack, hit, and death states, integrating with the `combat` and `health` components to respond to combat events and manage attack sequences. It also handles audio cues for environmental interaction (e.g., rumbling) and lifecycle events like entity sleep/wake.

## Usage example
This state graph is automatically applied to the entity prefab via `return StateGraph("tentacle", states, events, "idle")` at the end of the file. Modders do not manually instantiate or call this file — they reference its state names (e.g., `"taunt"`, `"attack"`) when extending or overriding states in their own state graphs.

## Dependencies & tags
**Components used:** `combat`, `health`
**Tags:** The state machine sets and checks various tags:
- `idle`, `invisible`, `noelectrocute` (in *rumble*, *idle*, *taunt* states)
- `taunting`, `noelectrocute` (in *taunt* state)
- `attack` (in *attack_pre*, *attack* states)
- `busy`, `hit` (in *hit* state)
- `busy` (in *death* state)
- `noelectrocute` (in *attack_post*, *death* states)
- Added via `CommonStates`: frozen, electrocuted, init, and corpse states (all inherited but not exhaustive here).

## Properties
No public properties are defined in this stategraph. All persistent data is stored in `inst.sg.mem` or `inst.sg.statemem` (e.g., `rumblesoundstate`, `keeprumblesound`).

## Main functions
This file returns a `StateGraph` constructor invocation and does not define mod-callable methods. Core behavior is expressed via `State` definitions and their `onenter`, `onupdate`, `ontimeout`, and `onexit` callbacks.

### `State{name = "rumble", ...}`
* **Description:** Initial idle cycle behavior; triggers low-frequency rumble animation and sound before returning to idle.
* **Parameters:** N/A — state behavior is declared via `onenter`, `ontimeout`, `onexit` functions.
* **Returns:** N/A.
* **Error states:** None.

### `State{name = "idle", ...}`
* **Description:** The default resting state; waits a random duration before entering rumble.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** None.

### `State{name = "taunt", ...}`
* **Description:** Reaction to a new combat target. Attempts attack if combat target exists; otherwise exits to idle.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** If `combat.target` is `nil` during update, transitions to `idle`.

### `State{name = "attack_pre", ...}`
* **Description:** Prepares for attack — emits emergence sound and begins attack animation; schedules transition to `attack` state.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** None.

### `State{name = "attack", ...}`
* **Description:** Executes multi-hit attack loop; fires combat attacks at specific timeline frames and queues loop or `attack_post`.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** If `combat.target` becomes `nil` during loop, exits to `attack_post`; otherwise loops `attack`.

### `State{name = "attack_post", ...}`
* **Description:** Finalizes attack — plays disappearance sound and animation, then returns to idle.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** None.

### `State{name = "death", ...}`
* **Description:** Handles entity death — plays death VO, animation, removes physics colliders, drops loot.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** None.

### `State{name = "hit", ...}`
* **Description:** Handles damage receipt — plays hurt VO and hit animation; upon completion, returns to `attack`.
* **Parameters:** N/A.
* **Returns:** N/A.
* **Error states:** Does not transition to idle; assumes entity will resume attacking.

### `StartRumbleSound(inst, state)`
* **Description:** Helper to manage rumble sound lifecycle; starts listening for sleep/wake events if not already active.
* **Parameters:** `inst` (entity), `state` (number/string) — sound state identifier.
* **Returns:** Nothing.
* **Error states:** Avoids duplicate events if sound state unchanged.

### `StopRumbleSound(inst)`
* **Description:** Halts rumble sound unless `keeprumblesound` flag is set (e.g., during active combat).
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.
* **Error states:** Does nothing if `keeprumblesound` is `true`.

## Events & listeners
- **Listens to:**
  - `attacked` — triggers hit or electrocution response.
  - `newcombattarget` — transitions to `taunt` if in `idle` and target exists.
  - `entitysleep` / `entitywake` — manages rumble sound presence.
  - `animover`, `animqueueover` — drives animation state transitions.
  - `death` — handled via `CommonHandlers.OnDeath()` in events table.

- **Pushes:** None — this stategraph consumes events and triggers transitions internally.
