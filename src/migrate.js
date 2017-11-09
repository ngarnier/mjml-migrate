import fs from 'fs'
import { unavailableTags, attributesWithUnit } from './config'
import mjml2json from 'mjml2json'
import json2mjml from 'json2mjml'

function removeContainerTag(bodyTag) {
  bodyTag.attributes = bodyTag.children[0].attributes
  bodyTag.children = bodyTag.children[0].children
  
  return bodyTag
}

function fixUnits(attribute, value) {
  let length = attributesWithUnit.length
  for (let i = 0; i < length; i++) {
    if (attributesWithUnit[i] === attribute) {
      return addPx(value)
    }
  }
  return value
}

function addPx(value) {
  if (!isNaN(value)) {
    return value + 'px'
  }
  else {
    return value
  }
}

function cleanAttributes(attributes) {
  for (let key in attributes) {
    attributes[key] = fixUnits(key, attributes[key])
  }
  return attributes
}

function migrateSocialSyntax(socialTag) {
  const listAllNetworks = (tag) => {
    let attributes = tag.attributes['display'].split(' ')
    delete(tag.attributes['display'])
    return attributes
  }

  const listAttributes = (tag) => {
    return tag.attributes
  }

  const attributes = listAttributes(socialTag)

  const networks = listAllNetworks(socialTag)
  socialTag.children = []

  // migrate all attributes to their child attributes
  for (let network in networks) {
    socialTag.children.push({
      tagName: `mj-social-element`,
      attributes: {"name": networks[network]},
      content: attributes[`${networks[network]}-content`] ? attributes[`${networks[network]}-content`] : ''
    })

    for (let attribute in attributes) {
      if (attribute.match(networks[network]) && !attribute.match('content')) {
        socialTag.children[network].attributes[attribute.replace(`${networks[network]}-`,'')] = socialTag.attributes[attribute]
        delete(socialTag.attributes[attribute])
      }
    }
  }

  // delete all content attributes from the root tag after they've been migrated
  for (let attribute in attributes) {
    if (attribute.match('content')) {
      delete(attributes[attribute])
    }
  }

  return socialTag
}

function isSupportedTag(tag) {
  const length = unavailableTags.length
  for (let i = 0; i < length; i++) {
    if (tag === unavailableTags[i]) {
      return false
    }
  }
  return true
}

function loopThrough(tree) {
  for (let key in tree) {
    if (key === 'children') {
      for (let i = 0; i < tree.children.length; i++) {
        if (isSupportedTag(tree.children[i].tagName)) {
          if (tree.children[i].tagName === 'mj-body') {
            tree.children[i] = removeContainerTag(tree.children[i])
          }
          if (tree.children[i].tagName === 'mj-social') {
            tree.children[i] = migrateSocialSyntax(tree.children[i])
          }
          tree.children[i].attributes = cleanAttributes(tree.children[i].attributes)
          loopThrough(tree.children[i])
        }
        else {
          delete(tree.children[i])
        }
      }
    }
  }
}

export default function migrate(input) {
  const mjmlJson = mjml2json(input)
  loopThrough(mjmlJson)
  
  return json2mjml(mjmlJson)
}