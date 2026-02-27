---
id: rainimmunity
title: Rainimmunity
description: Grants and manages immunity to rain damage by tracking external sources and automatically removing itself when no sources remain active.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 8ef1602a
---

# Rainimmunity

## Overview
The `RainImmunity` component grants temporary immunity to rain damage for an entity by maintaining a registry of active immunity sources. It automatically adds the `"rainimmunity"` tag to the entity upon initialization, triggers the `"gainrainimmunity"` event, and removes the component (and its tag) when all immunity sources are removed.

## Dependencies & Tags
- Adds the `"rainimmunity"` tag to the entity.
- Does not require any other components to be present on the entity.

## Properties
No public properties are initialized in the constructor. All internal state is held in private members:
- `self.sources`: A table used as a set to track active immunity sources (keys are source entities or identifiers; values are `true`).
- `self._onremovesource`: A private callback function used to deregister a source and potentially remove the component.

## Main Functions
### `AddSource(src)`
* **Description:** Registers a new source of rain immunity. If the source is not already tracked, it is added to the internal list, and an `"onremove"` event listener is attached (unless the source is the entity itself).
* **Parameters:**  
  `src` — A reference (typically an entity or identifier) representing a source of immunity. May be the entity itself.

### `RemoveSource(src)`
* **Description:** Deregisters a previously added immunity source. If the source was tracked, it removes the associated event listener and triggers `self._onremovesource(src)`, which may lead to full removal of the component if no sources remain.
* **Parameters:**  
  `src` — The immunity source to remove.

### `OnRemoveFromEntity()`
* **Description:** Cleanup routine called when the component is fully removed from the entity. Removes the `"rainimmunity"` tag, cleans up all event listeners for tracked sources, and emits the `"loserainimmunity"` event.
* **Parameters:** None.

## Events & Listeners
- **Listens to:**
  - `"onremove"` on each tracked source entity (via `inst:ListenForEvent("onremove", self._onremovesource, src)`), to deregister the source automatically when it is removed from the world.
- **Triggers:**
  - `"gainrainimmunity"` — emitted once during initialization (immediately after adding the component and tag).
  - `"loserainimmunity"` — emitted once when the component is fully removed from the entity.