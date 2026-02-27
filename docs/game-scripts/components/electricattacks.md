---
id: electricattacks
title: Electricattacks
description: This component tracks various sources that apply an "electric" state to an entity and automatically removes itself when no such sources remain.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 976561a0
---

# Electricattacks

## Overview
The `ElectricAttacks` component is responsible for managing the "electric" state of an entity. It uses an internal `SourceModifierList` to track multiple distinct origins (sources) that might be making the entity electric. The component ensures that the entity remains electric as long as at least one source is active. Crucially, once all registered sources are removed, the `ElectricAttacks` component automatically detaches itself from the entity, effectively reverting the entity out of its electric state.

## Dependencies & Tags
This component internally utilizes the `util/sourcemodifierlist` utility for managing its state. No other game components are explicitly added or required by this script, nor does it add or remove any specific entity tags.

## Properties
No public properties were clearly identified from the source. Internal properties include `self.inst` (the entity instance) and `self._sources` (an instance of `SourceModifierList` managing the electric state sources).

## Main Functions
### `AddSource(source)`
*   **Description:** Adds a new source that contributes to the entity's "electric" state. As long as this source is active, the `electricattacks` component will remain on the entity.
*   **Parameters:**
    *   `source`: A unique identifier (e.g., a string or an object reference) representing the origin of the "electric" state.

### `RemoveSource(source)`
*   **Description:** Removes a previously added source from the list of contributors to the "electric" state. If, after removing this source, there are no other active sources, the `electricattacks` component will automatically be removed from the entity.
*   **Parameters:**
    *   `source`: The unique identifier of the source to be removed.