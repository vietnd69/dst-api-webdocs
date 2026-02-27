---
id: beefalometrics
title: Beefalometrics
description: This component tracks and reports beefalo domestication and interaction events for game analytics.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: fd572fcf
---

# Beefalometrics

## Overview
The `beefalometrics` component is attached to beefalo entities to monitor and report analytics related to their domestication lifecycle. It listens for key events such as being fed, brushed, ridden, attacked, or dying, and pushes this data to the game's metrics system. The component also tracks the last player who interacted with the beefalo for domestication purposes, ensuring this information persists across game sessions.

## Dependencies & Tags
**Dependencies:**
- `uniqueid`: Used to identify the specific beefalo in metrics events.
- `domesticatable`: Used to get domestication levels and status.
- `rideable`: Used to track rider information and mounted combat events.

**Tags:**
- None identified.

## Properties

| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `entity` | `inst` | A reference to the entity instance this component is attached to. |
| `lastdomesticator` | `entity` (player) | `nil` | A runtime reference to the last player who performed a domestication action (e.g., feeding, brushing). |
| `lastdomesticator_id`| `string` | `nil` | The User ID of the last domesticator, used for persistence across game saves. |
| `ridestarttime` | `number` | `nil` | Stores the game time when a player starts riding the beefalo, used to calculate ride duration. |

## Main Functions
### `SetLastDomesticator(player)`
* **Description:** Sets or updates the last player who performed a domestication-related action on the beefalo. This clears any previously stored user ID.
* **Parameters:**
    * `player` (`entity`): The player entity to be set as the last domesticator.

### `GetLastDomesticator()`
* **Description:** Retrieves the last known domesticator. It prioritizes the active player entity reference. If that is unavailable, it attempts to find the player in the world using the saved `lastdomesticator_id`.
* **Parameters:** None.

### `OnSave()`
* **Description:** Called when the game saves. It packages the `userid` of the `lastdomesticator` for persistence.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Called when the game loads. It restores the `lastdomesticator_id` from the saved data.
* **Parameters:**
    * `data` (`table`): The saved data table containing the `lastdomesticator_id`.

## Events & Listeners
This component listens for several events on its owner entity to trigger metrics reporting.

*   **Listens to `domesticationdelta`:** Pushes a `beefalo.domestication.start` metric when domestication first begins (i.e., when the value changes from 0 to greater than 0).
*   **Listens to `oneat`:** Pushes a `beefalo.domestication.feed` metric when the beefalo is fed. Records the feeder as the `lastdomesticator`.
*   **Listens to `brushed`:** Pushes a `beefalo.domestication.brushed` metric when the beefalo is brushed. Records the brusher as the `lastdomesticator`.
*   **Listens to `domesticated`:** Pushes a `beefalo.domestication.domesticated` metric when the beefalo becomes fully domesticated, including tendency data.
*   **Listens to `goneferal`:** Pushes a `beefalo.domestication.feral` metric when the beefalo reverts to a feral state.
*   **Listens to `death`:** Pushes a `beefalo.domestication.death` metric if a beefalo with any amount of domestication dies.
*   **Listens to `riderchanged`:** Tracks ride duration. When a rider dismounts, it pushes a `beefalo.domestication.ride` metric with the total ride time.
*   **Listens to `attacked`:** Pushes a `beefalo.domestication.mountedattacked` metric if the beefalo is attacked while being ridden.
*   **Listens to `riderdoattackother`:** Pushes a `beefalo.domestication.mountedattack` metric when the rider initiates an attack while mounted.