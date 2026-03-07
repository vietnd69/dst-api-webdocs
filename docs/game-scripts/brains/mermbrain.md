---
id: mermbrain
title: Mermbrain
description: Defines the AI decision tree and behavior logic for merms, including combat, tool management, throne seeking, garden assistance, and social interactions.
tags: [ai, combat, npc, social]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 9b4a7ea5
system_scope: entity
---

# Mermbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MermBrain` implements the AI decision tree for merms, governing how they interact with the world, players, and environment. It manages combat behaviors (chase, dodge, panic), tool acquisition from tool sheds, following a leader, seeking thrones during the Merm King event, assisting in garden tasks (tilling/digging), and responding to offering pot calls. The brain uses `PriorityNode` and `WhileNode` behavior trees combined with custom action functions to determine high-level actions.

It relies heavily on components such as `combat`, `inventory`, `follower`, `timer`, `trader`, `homeseeker`, `childspawner`, `burnable`, `tool`, and `eater`, as well as world-level systems like `mermkingmanager`.

## Usage example
```lua
-- Add MermBrain to a merm entity instance
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:OnStart()
```

## Dependencies & tags
**Components used:**  
`burnable`, `childspawner`, `combat`, `container`, `eater`, `equippable`, `follower`, `homeseeker`, `inventory`, `inventoryitem`, `knownlocations`, `mermkingmanager`, `playercontroller`, `timer`, `tool`, `trader`

**Tags added/removed:**  
Adds `mermprince` when `MermKingManager` designates this entity as a throne candidate (removed upon removal/death via event listeners). No tags are added/removed in the constructor itself.

## Properties
No public properties. All internal logic is encapsulated within the behavior tree and helper functions.

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree (`self.bt`) that governs all AI decision-making for the merm. This function is called once during the entity's initialization and must be invoked for AI to function.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None. Assumes required components and world systems are available; missing components (e.g., `mermkingmanager`) result in degraded or safe fallback behavior within the tree.

## Events & listeners
- **Listens to:**  
  `onremove` — Removes candidate status and associated tags when the entity is removed.  
  `death` — Removes candidate status and associated tags when the entity dies.

- **Pushes:**  
  `merm_use_building` — Fired when the merm begins using a tool shed.  
  `onarrivedatthrone` — Fired when the merm successfully reaches a valid throne.

The `onremove` and `death` listeners are registered dynamically inside `MermKingManager:ShouldGoToThrone()` when an entity becomes a throne candidate. They are not directly part of `MermBrain` but are managed in coordination with it.
