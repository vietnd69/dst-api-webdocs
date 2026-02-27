---
id: spidermutator
title: Spidermutator
description: Provides mutation logic for spiders, replacing a given spider with a new one of a specified target prefab.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 9ce5f588
---

# Spidermutator

## Overview
This component enables spider mutation: it replaces an existing spider entity with a new spider of a configurable target prefab. It handles both cases where the spider is held in an inventory/container and when it is an active world entity, ensuring proper transfer of the mutated spider to the target slot and preserving leadership relationships.

## Dependencies & Tags
- Relies on the target entity (`spider`) having the following components if applicable:  
  `inventoryitem`, `inventory`, `container`, `follower`, `stackable`  
- No tags are added or removed by this component itself.

## Properties
No public properties are initialized in the constructor. The component only stores `self.inst` and assigns `self.mutation_target` dynamically via `SetMutationTarget`. No other persistent state is exposed.

## Main Functions

### `SetMutationTarget(target)`
* **Description:** Sets the target prefab name to which spiders will be mutated.  
* **Parameters:**  
  - `target` (string): The prefab name of the spider type to mutate into (e.g., `"spider"` → `"spiderfighter"`).

### `CanMutate(spider)`
* **Description:** Checks whether the given spider qualifies for mutation by comparing its prefab against the current mutation target.  
* **Parameters:**  
  - `spider` (Entity): The spider entity to evaluate.  
  *Returns:* `true` if `spider.prefab` differs from `self.mutation_target`; otherwise `false`.

### `Mutate(spider, skip_event, giver)`
* **Description:** Executes the mutation process on the given spider. If the spider is held in an inventory or container, it is removed and replaced in the same slot. Otherwise, mutation flags are set on the spider and the `"mutate"` event is broadcast (unless skipped). Finally, the mutator item itself is consumed.  
* **Parameters:**  
  - `spider` (Entity): The spider to mutate.  
  - `skip_event` (boolean, optional): If `true`, suppresses the `"mutate"` event broadcast. Default: `nil` → event is pushed.  
  - `giver` (Entity): The entity responsible for initiating mutation (typically used to set the new spider's leader).  

## Events & Listeners
- **Listens for:** None.  
- **Triggers:**  
  - `spider:PushEvent("mutate")` — Broadcast on the spider entity during mutation *unless* `skip_event` is `true`.  
  - The mutator entity (`self.inst`) is removed (or its stack decremented) after successful mutation.