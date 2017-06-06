import fs from 'fs'

const unavailableTags = [
  'mj-accordion', 
  'mj-carousel', 
  'mj-group', 
  'mj-html', 
  'mj-hero', 
  'mj-invoice', 
  'mj-list', 
  'mj-location', 
  'mj-navbar', 
  'mj-social', 
  'mj-spacer',
  'mj-wrapper',
]

const input = process.argv[2]
const output = process.argv[3] ? process.argv[3] : `${process.argv[2].replace('.mjml','')}-mjml4.mjml`

function addPixelsUnit (content) {
  const regexTag = new RegExp(/['"]\d{1,}[^"']/g)
  const replaceTag = `$&px`
  
  const newContent = content.replace(regexTag, replaceTag).replace(/%px/g, '%').replace(/ppxx/g, 'px')

  return newContent
}

function addContainerAttributesToBody (content) {
  const findContainerAttributes = new RegExp(/<mj-container\s([^>]*)/i)
  const containerAttributes = content.match(findContainerAttributes)
  
  const newContent = content.replace('<mj-body', `<mj-body ${containerAttributes[1]}`)
  
  return newContent
}

function removeContainerTag (content) {
  const findContainerOpeningTag = new RegExp(/<mj-container\s([^>]*)>/i)
  const findContainerTag = content.match(findContainerOpeningTag)
  
  const newContent = content.replace(findContainerTag[0], '').replace('</mj-container>', '')
  
  return newContent
}

function removeUnmigratedTags (content) {
  const findUnmigratedComponent = tag => new RegExp(`<${tag}([^>\/]*)>([^]*?)</${tag}>`, 'gmi')
  const unmigratedComponents = content.match(findUnmigratedComponent)
  
  let newContent = content
  unavailableTags.forEach(tag => {
    if (content.match(findUnmigratedComponent(tag))) {
      console.log(`Removed ${tag} which is not supported in MJML 4 at the moment`)
      newContent = newContent.replace(findUnmigratedComponent(tag), '')
    }
  })
  return newContent
}

function readMjml(content) {
    return fs.readFileSync(content, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      }
      return data
    })
}

function writeMjml(content) {
  if (output != '-s') {
    fs.writeFileSync(output, content, err => {
      if (err) {
        console.log(err)
        }
    })
  }
  else {
    console.log(content)
  }
}

let newContent = readMjml(input)
newContent = addContainerAttributesToBody(newContent)
newContent = removeContainerTag(newContent)
newContent = addPixelsUnit(newContent)
newContent = removeUnmigratedTags(newContent)
writeMjml(newContent)
