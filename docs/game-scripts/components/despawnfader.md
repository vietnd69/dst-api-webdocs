---
id: despawnfader
title: Despawnfader
description: This component manages the visual fading and eventual removal of an entity from the game world.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: e7e7c1fe
---

# Despawnfader

## Overview
This component is responsible for gracefully removing an entity from the game by visually fading it out over time. It handles both the animation of the fade and the eventual destruction of the entity, synchronizing the fade state between the server (master sim) and clients.

## Dependencies & Tags
*   **Dependencies:** While not explicitly added as components, this script interacts with `inst.AnimState` for visual effects and relies on the networking capabilities provided by `net_tinybyte` for synchronization.
*   **Tags:**
    *   Adds `NOCLICK` when fading out to prevent interaction with the entity during its removal process.

## Properties
| Property    | Type          | Default Value | Description                                                               |
| :---------- | :------------ | :------------ | :------------------------------------------------------------------------ |
| `_fade`     | `net_tinybyte`| `nil`         | A networked `net_tinybyte` variable used to synchronize the fade value between server and clients. |
| `fadeval`   | `number`      | `0`           | The current normalized fade progress, ranging from 0 (fully transparent/removed) to 1 (fully opaque). |
| `updating`  | `boolean`     | `false`       | A flag indicating whether the component is actively running its `OnUpdate` loop. |

## Main Functions
### `_ctor(self, inst)`
*   **Description:** The constructor initializes the component, associating it with the entity instance, setting up the networked fade variable, and initializing internal state flags. On clients, it immediately registers an event listener for `fadedirty` to react to server-side fade changes.
*   **Parameters:**
    *   `self`: The `DespawnFader` component instance.
    *   `inst`: The entity instance this component is attached to.

### `OnFadeDirty(inst)`
*   **Description:** This function is called on client machines when the `_fade` networked variable changes (becomes "dirty"). It triggers the client-side fade process to match the server's state, recalculating `fadeval` and starting the component's update loop if not already running.
*   **Parameters:**
    *   `inst`: The entity instance associated with the event.

### `OnRemoveFromEntity()`
*   **Description:** Performs cleanup operations when the component is removed from its entity. Specifically, on client machines, it removes the event callback for `fadedirty` to prevent memory leaks or errors.
*   **Parameters:** None.

### `FadeOut()`
*   **Description:** Initiates the fade-out process for the entity. It sets the `fadeval` to 1, ensuring the entity is initially opaque, starts the component's update loop if not already active, adds the `NOCLICK` tag to prevent interaction, and sets the entity's `persists` property to `false` to prevent it from being saved. It then immediately calls `OnUpdate` to start the process.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** The core update logic for the despawn fader, called periodically. It decrements `fadeval` over time, calculates a non-linear transparency value (`k`), and applies it to the entity's `AnimState:OverrideMultColour`. When `fadeval` reaches 0, the entity is either removed on the master sim or the component stops updating on clients. On the master sim, it also synchronizes `fadeval` with clients via the `_fade` networked variable.
*   **Parameters:**
    *   `dt`: The time elapsed since the last update, in seconds.

## Events & Listeners
*   **Listens For:**
    *   `"fadedirty"`: Listened to on client instances of the entity to synchronize the fade state with the server.