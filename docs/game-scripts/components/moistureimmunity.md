---
id: moistureimmunity
title: Moistureimmunity
description: Grants and manages temporary immunity to moisture accumulation for an entity by registering sources of immunity and syncing with the moisture component.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: b521f009
---

# Moistureimmunity

## Overview
This component provides a mechanism for entities to gain temporary immunity to moisture accumulation. It tracks one or more *sources* of immunity—such as equipped items or active buffs—and ensures the entity is marked as dry (via the `moisture` component) while at least one source is active. Immunity is automatically revoked when the last source is removed.

## Dependencies & Tags
- **Component Dependency:** Requires the `moisture` component to be present on the same entity for full functionality (`self.inst.components.moisture`).
- **Tags Added/Removed:** Adds or removes the `"moistureimmunity"` tag from the entity based on whether any immunity sources are active.

## Properties
No public properties are explicitly declared or documented beyond internal state.

## Main Functions

### `AddSource(src)`
* **Description:** Registers a new source of moisture immunity. If this is the first source, the entity gains the `"moistureimmunity"` tag and the moisture component is instructed to force-dry the entity. Event listeners are also established to track source removal.
* **Parameters:**
  - `src`: The source object (e.g., an item or component instance). Must be truthy. If it is *not* the entity itself (`src ~= self.inst`), an `"onremove"` event listener is attached to the source.

### `RemoveSource(src)`
* **Description:** Explicitly removes a source of immunity. Invokes internal cleanup and checks whether the immunity should be fully dropped.
* **Parameters:**
  - `src`: The source object to remove. Must have been previously added via `AddSource`.

### `RemoveSource_Internal(src)`
* **Description:** Handles the internal mechanics of removing a source—specifically, notifying the moisture component to stop forcing dryness and cleaning up event callbacks. It does *not* check whether immunity should be fully dropped; that is handled separately by `_onremovesource`.
* **Parameters:**
  - `src`: The source object to remove.

### `OnRemoveFromEntity()`
* **Description:** Called when the component itself is removed from the entity. Clears all registered sources, removes the `"moistureimmunity"` tag, and cleans up all associated listeners.

## Events & Listeners
- **Listens for:** `"onremove"` event on registered sources (via `inst:ListenForEvent`) to detect when a source is destroyed.
- **Triggers:** `"onremove"` event on the entity’s component root via `inst:RemoveComponent("moistureimmunity")` when the last source is removed.