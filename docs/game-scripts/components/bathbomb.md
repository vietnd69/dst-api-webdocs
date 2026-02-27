---
id: bathbomb
title: Bathbomb
description: Marks an entity as a bath bomb by managing the "bathbomb" tag.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 5356e9d9
---

# Bathbomb

## Overview
This component's sole responsibility is to identify an entity as a bath bomb. It achieves this by adding the `"bathbomb"` tag to the entity upon initialization and removing it when the component is destroyed.

## Dependencies & Tags
**Tags:**
*   `bathbomb`: Added to the entity when the component is attached.

## Properties
| Property | Type     | Default Value                                | Description                                       |
|:---------|:---------|:---------------------------------------------|:--------------------------------------------------|
| `inst`   | `Entity` | The entity instance the component is on. | A reference to the entity instance this component is attached to. |

## Main Functions
### `OnRemoveFromEntity()`
* **Description:** A lifecycle callback that is automatically triggered when the component is removed from the entity. It cleans up by removing the `"bathbomb"` tag.
* **Parameters:** None.