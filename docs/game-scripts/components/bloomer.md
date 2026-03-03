---
id: bloomer
title: Bloomer
description: Manages bloom effect stacking and propagation for entities and their children, supporting priority-based bloom layering and automatic cleanup on source removal.
tags: [fx, visual, entity, lighting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 5edd8703
system_scope: fx
---

# Bloomer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Bloomer` is a component that manages visual bloom effects on an entity and propagates those effects to its child entities. It maintains a priority-sorted stack of bloom sources (e.g., light sources, abilities), ensuring only the highest-priority bloom is applied directly to the entity. The component supports dynamic addition/removal of bloom sources, automatic event cleanup when sources are removed, and cascading bloom updates to attached children.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("bloomer")

-- Push a bloom effect from a light source with priority 5
inst.components.bloomer:PushBloom(light_source, "bloom_light_small", 5)

-- Attach a child entity (e.g., a particle system or attachable item)
inst.components.bloomer:AttachChild(child)

-- Remove bloom from a specific source
inst.components.bloomer:PopBloom(light_source)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `nil` | The entity instance this component is attached to. |
| `bloomstack` | `table` | `{}` | Stack of bloom layers, sorted by descending priority. Each entry is `{ source, fx, priority }`. |
| `children` | `table` | `{}` | Map of child entities → event callback function. Tracks children for bloom propagation. |
| `_onremovesource` | `function` | `nil` | Internal callback to pop bloom when a source entity is removed. |

## Main functions
### `PushBloom(source, fx, priority)`
*   **Description:** Adds or updates a bloom layer from a given source with specified priority. Maintains stack sorted by descending priority and triggers bloom update if highest layer changes.
*   **Parameters:**  
    `source` (any) – Identifier for the bloom source (e.g., an entity or string).  
    `fx` (string) – Bloom effect handle name.  
    `priority` (number, optional) – Bloom priority (higher = more dominant). Defaults to `0`.
*   **Returns:** Nothing.
*   **Error states:** No-op if `source == nil` or `fx == nil`. Registers an `"onremove"` event listener for `source` only if it is an entity (`EntityScript.is_instance(source)`).

### `PopBloom(source)`
*   **Description:** Removes a bloom layer from the stack for a given source. Triggers bloom update if highest layer changes or if stack becomes empty.
*   **Parameters:**  
    `source` (any) – The bloom source to remove.
*   **Returns:** Nothing.
*   **Error states:** No-op if `source == nil` or no matching entry exists.

### `AttachChild(child)`
*   **Description:** Registers a child entity and propagates the current highest-priority bloom to it. If the child has its own `Bloomer`, pushes bloom down recursively; otherwise, sets bloom directly on `AnimState`.
*   **Parameters:**  
    `child` (GEntity) – Child entity to attach.
*   **Returns:** Nothing.

### `DetachChild(child)`
*   **Description:** Removes child registration and clears bloom effect on the child (if applicable).
*   **Parameters:**  
    `child` (GEntity) – Child entity to detach.
*   **Returns:** Nothing.

### `GetCurrentFX()`
*   **Description:** Returns the bloom effect handle (`fx`) of the highest-priority layer.
*   **Parameters:** None.
*   **Returns:** `(string?)` Bloom effect name, or `nil` if stack is empty.

### `GetCurrentFxAndPriority()`
*   **Description:** Returns both the current bloom effect and its priority.
*   **Parameters:** None.
*   **Returns:** `(string?, number?)` Bloom effect name and priority of the top stack entry, or `(nil, nil)` if empty.

### `OnSetBloomEffectHandle(fx, priority)`
*   **Description:** Updates the entity's bloom effect and propagates it to all attached children.
*   **Parameters:**  
    `fx` (string) – Bloom effect handle to apply.  
    `priority` (number) – Priority of the effect (passed to child propagation).
*   **Returns:** Nothing.

### `OnClearBloomEffectHandle()`
*   **Description:** Clears the entity's bloom effect and propagates clearing to all attached children.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable stack trace of bloom layers for debugging.
*   **Parameters:** None.
*   **Returns:** `string` – Multi-line string listing bloom layers in descending priority order, e.g., `"\n\t[5] Entity123: bloom_light_small"`.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up all event listeners and removes bloom from attached children on component/entity removal.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"onremove"` on source entities (to call `PopBloom` on source removal) and on child entities (to unregister them from `children` table).
- **Pushes:** None identified.
