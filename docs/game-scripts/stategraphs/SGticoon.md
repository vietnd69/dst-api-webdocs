---
id: SGticoon
title: Sgticoon
description: Defines the state graph for the Ticoon entity, governing its AI behavior including idle, walking, searching for a quest target, waiting for its leader, and reacting to events such as abandonment or finding a kitcoon.
tags: [ai, locomotion, quest, follower]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 578dea4e
system_scope: brain
---

# Sgticoon

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGticoon` is the state graph for the Ticoon entity, defining its core behavioral logic through a set of states and event handlers. It coordinates movement (`locomotor`), leader tracking (`follower`), quest completion (`questowner`), entity tracking (`entitytracker`), and communication (`talker`) to implement behaviors such as following a leader, searching for a quest target (e.g., a missing kitcoon), reacting to abandonment, and entering idle or despawn states. It integrates with common states for combat, sleep, freeze, electrocution, hop, sink, and void fall via `CommonStates` helpers.

## Usage example
This state graph is automatically assigned to the Ticoon prefab via its `StateGraph` definition. Modders do not typically instantiate or interact with `SGticoon` directly. Event-driven behavior is triggered by pushing custom events (e.g., `ticoon_abandoned`, `ticoon_getattention`) on the Ticoon instance.

## Dependencies & tags
**Components used:** `combat`, `embarker`, `entitytracker`, `follower`, `health`, `locomotor`, `questowner`, `talker`, `transform` (for `SetSixFaced`/`SetFourFaced`)
**Tags:** `"idle"`, `"canrotate"`, `"moving"`, `"busy"`, `"caninterrupt"`

## Properties
No public properties are declared in the constructor or state functions. Internal state is stored via `inst.sg.statemem` and `inst.sg.mem` (e.g., `msg`, `prev_wait_talk_time`).

## Main functions
Not applicable (This is a stategraph definition, not a component with callable methods. State transitions are managed by the stategraph engine.)

## Events & listeners
- **Listens to:**  
  `ticoon_getattention`, `ticoon_abandoned`, `ticoon_kitcoonfound`, `oneat`, `sleep`, `freeze`, `electrocute`, `attacked`, `attack`, `death`, `locomote`, `hop`, `sink`, `voidfall`, `animover`, `animqueueover`  
- **Pushes:** None (this stategraph does not fire custom events).