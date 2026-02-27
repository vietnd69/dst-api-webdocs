---
id: channelable
title: Channelable
description: Manages an entity's ability to be continuously interacted with over time by one or more other entities.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 734b1a1b
---

# Channelable

## Overview
The Channelable component allows an entity to be the target of a sustained, continuous action performed by another entity, known as the "channeler". This is commonly used for actions like repairing, healing, or charging objects over a period of time.

This component manages the state of both the channelable entity and the channeler, ensuring their state graphs (`sg`) are synchronized. It supports both a single-channeler mode and a multi-channeler mode, where several entities can channel the target simultaneously. It provides callback functions that can be defined to trigger custom logic when channeling starts and stops.

## Dependencies & Tags

**Dependencies:**
*   This component relies on the *channeler* entity having a `stategraph` component to manage states like `"channeling"` and `"stopchanneling"`.

**Tags:**
*   `channelable`: Added to the entity when the component is enabled, indicating it can be channeled.
*   `channeled`: Added to the entity when it is actively being channeled by at least one entity.
*   `multichannelable`: Added to the entity when it is configured to allow multiple simultaneous channelers.
*   `use_channel_longaction`: Added to the entity if the `use_channel_longaction` property is set to true.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `enabled` | boolean | `true` | If false, the entity cannot be channeled. |
| `channeler` | entity | `nil` | In single-channeler mode, this holds the reference to the entity currently channeling. |
| `multichannelersallowed` | boolean | `nil` | If true, the entity can be channeled by multiple entities at once. |
| `multichannelers` | table | `nil` | In multi-channeler mode, this table stores references to all current channelers. |
| `onchannelingfn` | function | `nil` | A callback function that fires when channeling begins. |
| `onstopchannelingfn` | function | `nil` | A callback function that fires when channeling ends. |
| `use_channel_longaction` | boolean | `nil` | When set to true, adds the `use_channel_longaction` tag to the entity. |
| `skip_state_channeling` | boolean | `nil` | If true, does not force the channeler's stategraph to the "channeling" state. |
| `skip_state_stopchanneling` | boolean | `nil` | If true, does not force the channeler's stategraph to the "stopchanneling" state. |

## Main Functions

### `SetMultipleChannelersAllowed(allowed)`
*   **Description:** Configures the component to either allow a single channeler or multiple simultaneous channelers. If the mode is changed while active channelers are present, it will stop all current channeling.
*   **Parameters:**
    *   `allowed` (boolean): Set to `true` to enable multi-channeler mode, `false` for single-channeler mode.

### `SetEnabled(enabled)`
*   **Description:** Enables or disables the component. When disabled, the entity cannot be targeted for new channeling actions.
*   **Parameters:**
    *   `enabled` (boolean): `true` to enable, `false` to disable.

### `SetChannelingFn(startfn, stopfn)`
*   **Description:** Sets the callback functions that are executed when channeling starts and stops. This is the primary way to implement custom game logic for a channelable object.
*   **Parameters:**
    *   `startfn` (function): The function to call when channeling starts. It receives the component's instance (`inst`) and the `channeler` entity as arguments.
    *   `stopfn` (function): The function to call when channeling stops. It receives the component's instance (`inst`), an `aborted` boolean, and the `channeler` entity as arguments.

### `IsChanneling(targetchanneler)`
*   **Description:** Checks if the entity is currently being channeled. In multi-channeler mode, can optionally check for a specific channeler.
*   **Parameters:**
    *   `targetchanneler` (entity, optional): In multi-channeler mode, the specific entity to check for. If nil, checks if any entity is channeling.

### `StartChanneling(channeler)`
*   **Description:** Initiates a channeling session. This will only succeed if the component is enabled and the provided `channeler` entity is in a valid state (e.g., `"prechanneling"`). On success, it sets the channeler's state to `"channeling"` and triggers the `onchannelingfn` callback.
*   **Parameters:**
    *   `channeler` (entity): The entity that will begin channeling this object.

### `StopChanneling(aborted, targetchanneler)`
*   **Description:** Stops an active channeling session. It sets the channeler's state to `"stopchanneling"` and triggers the `onstopchannelingfn` callback.
*   **Parameters:**
    *   `aborted` (boolean): A flag passed to the `onstopchannelingfn` callback, typically `true` if the action was interrupted rather than completed.
    *   `targetchanneler` (entity, optional): In multi-channeler mode, specifies which channeler to stop. If omitted, all channelers are stopped.

## Events & Listeners

*   **Listens To:** `onremove` (on the `channeler` entity)
    *   When channeling starts, this component begins listening for the `onremove` event on the channeler entity. If the channeler is removed from the game, this listener ensures the channeling session is properly terminated.