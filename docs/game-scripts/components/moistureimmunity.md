---
id: moistureimmunity
title: Moistureimmunity
description: Grants temporary immunity to moisture accumulation by forcing an entity's moisture level to remain dry via external sources.
tags: [moisture, status, immunity, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b521f009
system_scope: entity
---

# Moistureimmunity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MoistureImmunity` is a component that grants temporary immunity to moisture accumulation on an entity by interfacing with the `moisture` component. When sources are active, it forces the entity to remain dry (`moisture:ForceDry(true, ...)`) and adds the `moistureimmunity` tag. Each source tracks independently, and the immunity deactivates when the last source is removed—this also removes the component from the entity entirely.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("moistureimmunity")

-- Grant immunity from an external source (e.g., an item or effect)
inst.components.moistureimmunity:AddSource(some_item)

-- Remove immunity from that source later
inst.components.moistureimmunity:RemoveSource(some_item)
```

## Dependencies & tags
**Components used:** `moisture`  
**Tags:** Adds `moistureimmunity`; removes `moistureimmunity`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sources` | table | `{}` | Dictionary of active immunity sources (keys are source entities or tokens, values are `true`). |
| `_onremovesource` | function | `function(src)` | Internal callback used to clean up a source and potentially remove the component when no sources remain. |

## Main functions
### `AddSource(src)`
* **Description:** Adds a new immunity source. Ensures the `moistureimmunity` tag is present and calls `moisture:ForceDry(true, src)` if the `moisture` component exists.
* **Parameters:** `src` (entity or token) — the entity or unique identifier granting immunity.
* **Returns:** Nothing.
* **Error states:** No-op if `src` is already in `sources`.

### `RemoveSource(src)`
* **Description:** Removes an immunity source, cleaning up event listeners and moisture forcing. If this was the last source, removes the component from the entity.
* **Parameters:** `src` (entity or token) — the source to remove.
* **Returns:** Nothing.

### `RemoveSource_Internal(src)`
* **Description:** Internal helper that stops moisture forcing via `moisture:ForceDry(false, src)` and removes event listeners. Does *not* modify `sources` or invoke cleanup logic.
* **Parameters:** `src` (entity or token).
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method called when the component is removed from the entity. Removes all sources, clears the `moistureimmunity` tag, and stops moisture forcing for each source.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — registered per external source (`src ~= self.inst`) to automatically clean up when the source entity is destroyed.

- **Pushes:** None.
