---
id: fertilizerresearchable
title: Fertilizerresearchable
description: Marks an entity as capable of providing fertilizer research information and enables learning fertilizer items via player interaction.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: af2cc389
---

# Fertilizerresearchable

## Overview
This component marks an entity as a researchable source for fertilizer items. It stores a custom research-info function and provides methods to retrieve and share that information, primarily for use in research benches or similar UIs. When a player interacts with the entity, it can notify the player to learn a specific fertilizer item.

## Dependencies & Tags
- Adds the tag `"fertilizerresearchable"` to the entity instance (`inst`).
- No external component dependencies are added or required by this component.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity instance, stored at construction. |
| `reasearchinfofn` | `function?` | `nil` | Optional callback function that returns fertilizer research data (e.g., a string or table) for this entity. *Note:* Typo in original source (`reasearchinfofn` instead of `researchinfofn`). |

## Main Functions

### `SetResearchFn(fn)`
* **Description:** Assigns a custom function (`fn`) that will be called by `GetResearchInfo()` to retrieve the fertilizer research data for this entity.
* **Parameters:**
  * `fn` (`function`): A callable function that accepts the entity instance as its only argument and returns the research information (e.g., the name or ID of the fertilizer to be learned).

### `GetResearchInfo()`
* **Description:** Invokes the stored `reasearchinfofn` (if set) and returns its result. Returns `nil` if no function is defined.
* **Parameters:** None.

### `LearnFertilizer(doer)`
* **Description:** Triggers the "learnfertilizer" event on the `doer` (typically a player), passing along the fertilizer research info obtained via `GetResearchInfo()`. Used when a player interacts with the researchable entity to learn the associated fertilizer.
* **Parameters:**
  * `doer` (`Entity`): The entity (usually a player) performing the action and receiving the learn event.

## Events & Listeners
- Listens to no events.
- Emits the `"learnfertilizer"` event on the `doer` entity (via `doer:PushEvent`) when `LearnFertilizer()` is called, with the payload `{ fertilizer = <fertilizer_data> }`.