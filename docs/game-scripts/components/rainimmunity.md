---
id: rainimmunity
title: Rainimmunity
description: Grants and manages immunity to rain damage for an entity by tracking external sources of immunity.
tags: [environment, entity, damage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 8ef1602a
system_scope: environment
---

# Rainimmunity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RainImmunity` is an entity component that provides immunity to rain-based damage. It tracks one or more external sources that grant this immunity, and automatically removes the component—and the `rainimmunity` tag—when no sources remain active. This component is typically used by entities (e.g., characters, structures, or creatures) that must be protected from environmental rain effects, such as damage accumulation or weather-related penalties.

The component is self-contained and does not depend on other components directly. Instead, it relies on the game's event system (`onremove` events) to monitor the lifecycle of immunity sources.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("rainimmunity")

-- Add a source (e.g., an equipped item or proximity to a shelter)
local item = prefabs.my_shelter_item
inst.components.rainimmunity:AddSource(item)

-- Later, remove the source
inst.components.rainimmunity:RemoveSource(item)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `rainimmunity` on initialization; removes it when the component is removed from the entity.

## Properties
No public properties

## Main functions
### `AddSource(src)`
*   **Description:** Registers a new source that grants rain immunity. The source is tracked internally; immunity is lost only when all sources are removed.
*   **Parameters:** `src` (entity or object reference) — the source of immunity (e.g., an item, structure, or proximity zone). May be the same entity (`self.inst`) but is typically external.
*   **Returns:** Nothing.
*   **Error states:** If `src` is already registered, this call has no effect.

### `RemoveSource(src)`
*   **Description:** Unregisters a source of rain immunity. If no sources remain, the component automatically removes itself from the entity and fires `loserainimmunity`.
*   **Parameters:** `src` (entity or object reference) — the source to remove.
*   **Returns:** Nothing.
*   **Error states:** If `src` is not currently registered, this call has no effect.

### `OnRemoveFromEntity()`
*   **Description:** Internal method called when the component is removed (e.g., via `inst:RemoveComponent("rainimmunity")`). Cleans up event listeners, removes the `rainimmunity` tag, and broadcasts `loserainimmunity`.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — registered on each external source to detect when it is destroyed; triggers automatic removal of that source.
- **Pushes:**  
  - `gainrainimmunity` — fired once during component initialization (after adding the `rainimmunity` tag).  
  - `loserainimmunity` — fired when the last source is removed and the component is about to be destroyed.
