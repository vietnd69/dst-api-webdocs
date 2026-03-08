---
id: SGpigking
title: Sgpigking
description: Manages the Pig King's state machine, including idle, happy, sleeping, and minigame intro sequences.
tags: [ai, boss, minigame, stategraph]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: stategraphs
source_hash: 781e1f6b
system_scope: entity
---

# Sgpigking

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SGpigking` defines the state graph for the Pig King entity, controlling its animation states, sound playback, and behavior transitions (e.g., idle, happy, unimpressed, sleeping, and minigame intro). It integrates with components such as `trader`, `entitytracker`, `knownlocations`, and `minigame_participator` to manage the Pig King's role in the Pig Minigame, including spawning elite pig followers and coordinating minigame activation.

## Usage example
```lua
-- The Pig King entity automatically uses this state graph
-- No manual component addition is required; it is built into the prefab definition.
-- To trigger a transition (e.g., to the happy state), the entity triggers:
inst.sg:GoToState("happy")
```

## Dependencies & tags
**Components used:** `trader`, `entitytracker`, `knownlocations`, `minigame_participator`  
**Tags:** States `idle`, `sleeping`, and `intro` are tagged in the state definitions.

## Properties
No public properties are defined in this file.

## Main functions
### `SpawnElite(inst, prefab, xoffs, zoffs, strid)`
* **Description:** Spawns an elite pig follower, positions it, sets its state graph, and registers tracking/locomotion data. Called during the minigame intro sequence to create followers.
* **Parameters:**  
  `inst` (entity) – The Pig King instance.  
  `prefab` (string) – Prefab name for the elite pig (e.g., `"pigelite1"`).  
  `xoffs`, `zoffs` (number) – Offset position relative to the Pig King.  
  `strid` (string or number) – Localization string ID for intro dialogue.
* **Returns:** The spawned elite entity.
* **Error states:** None explicitly handled; assumes prefabs exist and components are present.

### `OnEndHappy(inst)`
* **Description:** Callback that resets the Pig King’s `happy` flag and clears the `endhappytask` memory reference when the happy state times out after 5 seconds.
* **Parameters:**  
  `inst` (entity) – The Pig King instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `animover` – Triggers state transitions upon animation completion (e.g., `"happy"` → `"idle"`).  
  `onremove` – Installed on spawned elites to clean up `inst._minigame_elites` references.  
- **Pushes:**  
  `introover` – Pushed on each elite pig during `intro4`’s `onexit` handler to signal minigame intro completion.