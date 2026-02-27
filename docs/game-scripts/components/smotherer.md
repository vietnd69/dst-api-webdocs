---
id: smotherer
title: Smotherer
description: A minimal placeholder component that serves as a base class for entities capable of being smothered, currently implementing only initialization logic without active functionality.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d1f36c66
---

# Smotherer

## Overview  
This component acts as a foundational marker component for entities that may interact with smothering mechanics (e.g., fire extinguishing), but currently contains no functional logic beyond instantiation. It does not modify behavior, register events, or alter entity state.

## Dependencies & Tags  
None identified.

## Properties  
No public properties were clearly identified from the source. The constructor assigns only the instance reference (`self.inst`), with no additional state initialized.

## Main Functions  
No core functional methods are defined beyond the constructor (`_ctor`). All standard methods (e.g., `OnRemove`, `OnSave`, etc.) are absent.

## Events & Listeners  
None.