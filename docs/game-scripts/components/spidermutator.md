---
id: spidermutator
title: Spidermutator
description: Handles the conversion of one spider type into another, typically used when a spider consumes a mutator item.
tags: [spider, mutation, transformation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9ce5f588
system_scope: entity
---

# Spidermutator

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SpiderMutator` is a component that enables an entity to mutate one spider into another spider type. It supports two mutation paths: one for spiders that are held in an inventory/container (where the spider is replaced in the slot) and one for free-roaming spiders (where the spider receives mutation flags and fires a `"mutate"` event). After mutation, the mutator item is consumed.

This component is primarily used by items like the *Spider Mutator* (e.g., *Mutated Spider Egg*) and interacts with `follower`, `inventory`, `inventoryitem`, and `stackable` components.

## Usage example
```lua
local mutator = SpawnPrefab("spider_mutator")
mutator:AddComponent("spidermutator")
mutator.components.spidermutator:SetMutationTarget("beefalospider")
mutator.components.spidermutator:Mutate(target_spider, false, player)
```

## Dependencies & tags
**Components used:** `inventory`, `inventoryitem`, `follower`, `stackable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance that owns this component (the mutator item). |
| `mutation_target` | `string` or `nil` | `nil` | Prefab name of the spider type to mutate into. Set via `SetMutationTarget`. |

## Main functions
### `SetMutationTarget(target)`
*   **Description:** Sets the target spider prefab name for mutation.
*   **Parameters:** `target` (string) — the prefab name of the spider to mutate into (e.g., `"beefalospider"`).
*   **Returns:** Nothing.

### `CanMutate(spider)`
*   **Description:** Checks whether a given spider can be mutated. Returns `true` if the spider's prefab differs from the `mutation_target`.
*   **Parameters:** `spider` (`Entity`) — the spider entity to check.
*   **Returns:** `boolean` — `true` if mutation is allowed, `false` otherwise.
*   **Error states:** Returns `true` if `mutation_target` is `nil`.

### `Mutate(spider, skip_event, giver)`
*   **Description:** Performs the mutation on the given spider. If the spider is held in an inventory or container, it replaces the spider with a new instance of the target prefab in the same slot and assigns the `giver` as leader. Otherwise, it sets mutation flags on the spider and fires the `"mutate"` event for external logic to handle. Finally, it consumes the mutator item.
*   **Parameters:**
    *   `spider` (`Entity`) — the spider to mutate.
    *   `skip_event` (boolean) — if `true`, the `"mutate"` event is not fired (used when mutation is handled explicitly elsewhere).
    *   `giver` (`Entity` or `nil`) — the entity that gave the mutator; used to set as leader of the new spider.
*   **Returns:** Nothing.
*   **Error states:**
    *   If `spider.components.inventoryitem.owner` is `nil` and the spider is *not* held in inventory, the mutation is deferred via flag-setting and event firing.
    *   If `mutation_target` is `nil`, the behavior is undefined (but no explicit error is raised).
    *   If `spider` or `giver` is `nil`, errors may occur in component access or function calls (e.g., `SetLeader`).

## Events & listeners
- **Listens to:** None.
- **Pushes:** `spider:PushEvent("mutate")` — fired on the *spider* being mutated (not on `inst`) if `skip_event` is `false`. Used to trigger visual/audio effects and state changes on the mutated spider.
