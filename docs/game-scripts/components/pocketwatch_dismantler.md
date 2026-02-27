---
id: pocketwatch_dismantler
title: Pocketwatch Dismantler
description: Handles disassembly logic for the Pocket Watch item, enforcing cooldown and permission checks and distributing loot on successful dismantling.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 99ca1151
---

# Pocketwatch Dismantler

## Overview
This component implements the dismantling logic for the Pocket Watch item in Don't Starve Together. It validates whether dismantling is allowed (e.g., checking if the target is off cooldown and the actor is a Clockmaker), and if so, executes the disassembly process—handling item mimic threats, spawning a broken tool, and distributing loot either to a compatible receiver or into the world.

## Dependencies & Tags
- **Component Dependency:** Relies on the target entity having `rechargeable`, `inventoryitem`, `itemmimic`, `lootdropper`, and `loot` components.
- **Doer Requirement:** Requires the dismantler (`doer`) to have the `"clockmaker"` tag.
- **Tag Used:** `"pocketdimension_container"` (to determine loot drop behavior).
- **No new tags are added or removed** by this component itself.

## Properties
No public properties are initialized or exposed in this component. It is a lightweight stateless service class whose behavior is fully determined by its methods and the state of the passed `target` and `doer` entities.

## Main Functions

### `CanDismantle(target, doer)`
* **Description:** Validates whether the Pocket Watch (`target`) can be dismantled by the given actor (`doer`). Enforces two conditions: (1) the item must be charged (not on cooldown), and (2) the actor must be a Clockmaker.
* **Parameters:**
  - `target` (Entity): The Pocket Watch entity to be dismantled.
  - `doer` (Entity): The entity attempting the dismantling.
* **Returns:** `true` if dismantling is allowed; otherwise `false` (optionally with reason `"ONCOOLDOWN"` if uncharged).

### `Dismantle(target, doer)`
* **Description:** Performs the dismantling of the Pocket Watch. Checks for item mimic threat, spawns a broken tool, and distributes loot (excluding `nightmarefuel`). Loot is given to a compatible receiver (if any exists and is not a pocket dimension container), otherwise dropped at the doer's position.
* **Parameters:**
  - `target` (Entity): The Pocket Watch entity to dismantle.
  - `doer` (Entity): The entity performing the dismantle.

## Events & Listeners
- Listens to no events internally.
- Does not push any custom events. (Standard sound effects like `"dontstarve/creatures/monkey/poopsplat"` are played via `SoundEmitter`, but this is not an event-based mechanism.)