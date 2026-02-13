---
id: electricconnector
title: Electricconnector
description: Manages and establishes electrical connections between entities, creating visual field effects and handling linking/unlinking logic.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: environment
---

# Electricconnector

## Overview
The `Electricconnector` component allows an entity to establish and manage electrical connections with other entities. It handles the logic for detecting connectable targets, forming links, creating visual electric field effects between connected entities, and managing disconnections. This component also supports saving and loading of established connections.

## Dependencies & Tags
This component relies on other entities also having an `Electricconnector` component to establish bidirectional links.

*   **Tags Added:**
    *   `electric_connector`: Marks the entity as capable of forming electrical connections.
    *   `is_electrically_linked`: Added when the entity has at least one active electrical connection.
    *   `fully_electrically_linked`: Added when the entity has reached its `max_links` capacity.
*   **Tags Removed:**
    *   `fully_electrically_linked`: Removed when the entity's number of connections drops below `max_links`.
    *   `is_electrically_linked`: Removed when the entity has no active electrical connections.

## Properties
| Property         | Type      | Default Value                      | Description                                                                     |
| :--------------- | :-------- | :--------------------------------- | :------------------------------------------------------------------------------ |
| `inst`           | `userdata`| `self.inst`                        | A reference to the entity this component is attached to.                        |
| `fields`         | `table`   | `{}`                               | A table storing active connections, mapping `other_entity` to `field_fx_prefab`. |
| `field_prefab`   | `string`  | `"fence_electric_field"`           | The prefab name for the visual electric field effect created between connectors. |
| `max_links`      | `number`  | `TUNING.ELECTRIC_FENCE_MAX_LINKS`  | The maximum number of simultaneous electrical links this entity can maintain.   |
| `link_range`     | `number`  | `TUNING.ELECTRIC_FENCE_MAX_DIST`   | The maximum distance within which this entity can form a link.                  |
| `onlinkedfn`     | `function`| `nil`                              | An optional callback function executed when a new link is established.          |
| `onunlinkedfn`   | `function`| `nil`                              | An optional callback function executed when a link is broken.                   |

## Main Functions
### `StartLinking()`
*   **Description:** Initiates the linking process for the entity, typically indicating it's ready to form new connections.
*   **Parameters:** None.

### `EndLinking()`
*   **Description:** Concludes the linking process for the entity, typically indicating it's no longer actively seeking new connections.
*   **Parameters:** None.

### `IsLinking()`
*   **Description:** Checks if the entity's state graph currently has the "linking" state tag, indicating it is in the process of attempting to form connections.
*   **Parameters:** None.

### `HasConnection()`
*   **Description:** Determines if the entity currently has any active electrical connections.
*   **Parameters:** None.

### `CanLinkTo(guy, on_load)`
*   **Description:** Checks if the component can establish a valid electrical link with another specified entity. It verifies the target has an `electricconnector` component, is linking (or the check is for loading), isn't on a platform (boats), and isn't already linked.
*   **Parameters:**
    *   `guy`: The potential target entity to link with.
    *   `on_load`: A boolean indicating if this check is happening during game loading (allows linking even if `guy` isn't actively linking).

### `Disconnect()`
*   **Description:** Breaks all active electrical connections the entity has. It removes the visual field effects and notifies both this entity and all previously connected entities of the disconnection.
*   **Parameters:** None.

### `FindAndLinkConnector()`
*   **Description:** Searches for a suitable connectable entity within `link_range` and, if found, attempts to establish a connection with it.
*   **Parameters:** None.

### `ConnectTo(connector)`
*   **Description:** Establishes a direct electrical connection with a specified target entity. If successful, it spawns a visual electric field effect between the two entities and registers the connection.
*   **Parameters:**
    *   `connector`: The target entity to establish a connection with.

### `RegisterField(other, field)`
*   **Description:** Internal function to formally register a new electrical connection and its associated field effect. It calls `onlinkedfn` if defined, adds the connection to `self.fields`, and updates relevant entity tags.
*   **Parameters:**
    *   `other`: The entity connected to.
    *   `field`: The visual electric field entity spawned between the two connectors.

### `UnregisterField(other)`
*   **Description:** Internal function to formally deregister an existing electrical connection. It removes the connection from `self.fields`, updates entity tags, and calls `onunlinkedfn` if defined and no other fields remain.
*   **Parameters:**
    *   `other`: The entity to disconnect from.

### `OnSave()`
*   **Description:** Provides data necessary to save the entity's current electrical connections, specifically the GUIDs of connected entities.
*   **Parameters:** None.

### `LoadPostPass(newents, savedata)`
*   **Description:** Re-establishes electrical connections after the game loads, using the saved GUIDs to link with newly spawned or re-identified entities.
*   **Parameters:**
    *   `newents`: A table mapping saved GUIDs to their newly instantiated entities.
    *   `savedata`: The saved data containing the `connectors` table with GUIDs.

### `OnRemoveEntity()`
*   **Description:** An alias for `Disconnect()`, automatically called when the entity is removed.
*   **Parameters:** None.

### `OnRemoveFromEntity()`
*   **Description:** An alias for `Disconnect()`, automatically called when the component is removed from the entity.
*   **Parameters:** None.

## Events & Listeners
*   **Pushed Events:**
    *   `start_linking`: Triggered when `StartLinking()` is called.
    *   `end_linking`: Triggered when `EndLinking()` is called.
    *   `disconnect_links`: Triggered when `Disconnect()` is called, and also pushed to other connected entities.
    *   `linked_to`: Triggered on a connected entity when a new link is formed to it.