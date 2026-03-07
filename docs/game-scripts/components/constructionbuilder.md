---
id: constructionbuilder
title: Constructionbuilder
description: Manages the construction state and UI container for a builder entity performing construction tasks.
tags: [crafting, inventory, state, container]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f7a6c9cc
system_scope: crafting
---

# Constructionbuilder

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ConstructionBuilder` is a client-server aware component that coordinates the construction workflow for an entity (typically a player or controllable character). It tracks the active construction target (`constructionsite`), manages a temporary UI container (`constructioninst`), and synchronizes state transitions in the builder's stategraph (e.g., entering `construct`, `constructing`, or `construct_pst`). It depends on `ConstructionBuilderUIData` to expose the current container and target to the UI layer, and interacts with `ConstructionSite` to initiate/complete construction actions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("constructionbuilder")

-- Begin constructing a site
local site = some_constructionsite_entity
local success, reason = inst.components.constructionbuilder:StartConstruction(site)

-- Finish construction (e.g., after player deposits all materials)
if inst.components.constructionbuilder:FinishConstruction() then
    -- Transition to post-construction state in the stategraph
end

-- Clean up on entity removal
inst.components.constructionbuilder:StopConstruction()
```

## Dependencies & tags
**Components used:** `constructionbuilderuidata`, `constructionsite`, `container`, `inventory`, `stategraph`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `constructioninst` | `Entity` or `nil` | `nil` | The temporary container entity used during construction (e.g., a crafting table or chest opened by the builder). |
| `constructionsite` | `Entity` or `nil` | `nil` | The target `ConstructionSite` entity being built. |

## Main functions
### `CanStartConstruction()`
*   **Description:** Checks whether the builder is allowed to begin a new construction. Ensures the builder is in the `construct` state and not already constructing.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if construction can be started, `false` otherwise.

### `IsConstructing(constructioninst)`
*   **Description:** Verifies whether the builder is currently constructing a specific construction container instance.
*   **Parameters:** `constructioninst` (`Entity` or `nil`) — the expected construction container to check.
*   **Returns:** `boolean` — `true` if the current construction matches the provided instance, `false` otherwise.

### `IsConstructingAny()`
*   **Description:** Checks whether the builder is actively in the `constructing` state and has a construction container.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the builder is in the `constructing` state with a valid `constructioninst`, `false` otherwise.

### `StartConstruction(target)`
*   **Description:** Attempts to begin construction on the given `ConstructionSite` entity. Opens the construction container, sets up event listeners, and transitions the builder to the `constructing` state.
*   **Parameters:** `target` (`Entity` or `nil`) — the `ConstructionSite` to construct.
*   **Returns:** `boolean` or `{boolean, string}` — `true` on success; `false` or `{false, "INUSE"/"BURNT"}` on failure (e.g., site already in use or burnt).
*   **Error states:** Returns `"INUSE"` if the site already has a builder; `"BURNT"` if the site is burnt.

### `StopConstruction()`
*   **Description:** Aborts construction, cancels event listeners, drops or returns materials to the builder’s inventory, and removes the temporary container. Pushes the `stopconstruction` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `FinishConstruction()`
*   **Description:** Verifies that all materials are in the construction container and transitions the builder to the `construct_pst` state (post-construction). Does *not* finalize the `ConstructionSite`; that is handled by `OnFinishConstruction`.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if the builder is ready to transition, `false` if conditions are not met.

### `OnFinishConstruction()`
*   **Description:** Finalizes construction by transferring materials from the container to the `ConstructionSite`, calling `ConstructionSite:OnConstruct`, and cleaning up temporary state.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Captures the current construction state for persistence. Returns data only if construction is in progress and the container has items.
*   **Parameters:** None.
*   **Returns:** `{ constructing = table }` or `nil` — save record containing the container’s state, or `nil` if not constructing.

### `OnLoad(data)`
*   **Description:** Restores construction state from saved data. Recreates the container entity and reattaches it to the builder.
*   **Parameters:** `data` (`table` or `nil`) — save data from `OnSave`.
*   **Returns:** Nothing.

### `OnRemoveFromEntity`
*   **Description:** Alias for `StopConstruction`, invoked automatically when the component is removed from its entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity`
*   **Description:** Alias for `StopConstruction`, invoked automatically when the owning entity is destroyed.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — triggered on the `constructionsite` entity to abort construction if the site is removed.
- **Pushes:** `stopconstruction` — fired when `StopConstruction` is called.
