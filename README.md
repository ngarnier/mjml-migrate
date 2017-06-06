# mjml-migrate

## Purpose

Makes a template coded for MJML 3 compatible with MJML 4

## Installation

`npm install`

## Usage

`babel-node index.js input output`

The output can be either a filename or `-s` to ouput the migrated template to `stdout`.

## What happens

* `mj-container` is removed and its attributes are passed to `mj-body`
* Unitless values are converted to `px`
* Unsupported tags (defined in `unavailableTags`) are removed 
