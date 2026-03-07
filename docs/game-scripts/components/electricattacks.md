---
id: electricattacks
title: Electricattacks
description: Manages a collection of electric attack sources on an entity, automatically removing itself when no sources remain.
tags: [combat, electric, entity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 976561a0
system_scope: entity
---

# Electricattacks

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ElectricAttacks` is a lightweight component that tracks active electric attack sources on an entity using a `SourceModifierList`. It ensures the component remains attached only while at least one source is present—automatically removing itself from the entity when the last source is removed. It is intended for entities (e.g., bosses, enemies) capable of emitting electric attacks, allowing dynamic activation/deactivation of electric damage capabilities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("electricattacks")
inst.components.electricattacks:AddSource("lightning_bolt")
-- ... later ...
inst.components.electricattacks:RemoveSource("lightning_bolt")
-- If no other sources exist, the component removes itself from inst
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
No public properties.

## Main functions
### `AddSource(source)`
*   **Description:** Registers a new electric attack source. The component remains active (attached) after adding any source.
*   **Parameters:** `source` (string or hashable identifier) - A unique identifier for the electric attack source.
*   **Returns:** Nothing.

### `RemoveSource(source)`
*   **Description:** Removes an electric attack source. If no sources remain after removal, the component automatically detaches itself from the entity.
*   **Parameters:** `source` (string or hashable identifier) - The identifier of the source to remove.
*   **Returns:** Nothing.
*   **Error states:** No explicit failure conditions—silently handles removal of non-existent sources via `SourceModifierList`.

## Events & listeners
None identified.
