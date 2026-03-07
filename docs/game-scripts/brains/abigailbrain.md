---
id: abigailbrain
title: Abigailbrain
description: Controls the behavior tree logic for Abigail, determining her movement, combat, and social actions based on leader proximity, mode (defensive/aggressive), and environmental context.
tags: [ai, boss, ghost]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 025c19d9
system_scope: brain
---

# Abigailbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Abigailbrain` defines the behavior tree (`BT`) for Abigail, a ghost entity in DST. It dynamically selects between defensive and aggressive behavioral modes, and handles interactions such as dancing with the leader, haunting targets, playing with other ghosts, watching minigames, and responding to traders. The brain relies heavily on external components: `follower` for leader tracking, `combat` for target management, `timer` for cooldowns, `trader` for trade detection, and `minigame_participator` for minigame observation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst:AddComponent("combat")
inst:AddComponent("timer")
inst:AddComponent("trader")
inst:AddComponent("minigame_participator")
inst.is_defensive = true  -- Set Abigail's mode
inst:AddBrain("abigailbrain")
```

## Dependencies & tags
**Components used:** `follower`, `combat`, `timer`, `trader`, `minigame_participator`  
**Tags:** Checks `ghostkid`, `graveghost`, `busy`, `gestalt`, `swoop`; adds none.

## Properties
No public properties are initialized directly in the constructor. The behavior is driven by instance properties set externally (e.g., `inst.is_defensive`, `inst._haunt_target`, `inst._is_transparent`).

## Main functions
### `OnStart()`
* **Description:** Initializes and starts the behavior tree for Abigail. Constructs a prioritized hierarchy of `WhileNode`s and `PriorityNode`s that define her behavior under varying conditions (e.g., dancing, watching, haunting, playing, fighting).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not return errors; failure occurs silently if required components are missing.

## Events & listeners
- **Listens to:** None (does not register event handlers).
- **Pushes:** `dance`, `start_playwithghost` (with `{ target = playfultarget }`).
