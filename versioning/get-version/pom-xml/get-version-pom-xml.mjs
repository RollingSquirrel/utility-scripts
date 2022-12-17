import { readFileSync } from 'fs';
import { join } from 'path';

const DEFAULT_FILE_NAME = 'pom.xml';
/**
 * The level of the version tag in the xml file.
 * Level starts at 0 and increases with every opening tag.
 * The level beneath the project tag is 1.
 * Every closing tag decreases the level by 1.
 */
const TARGET_VERSION_TAG_NESTED_LEVEL = 1;

/**
 * Get the version of a pom.xml file.
 * 
 * This script attempts to parse the xml file and find the correct version tag.
 * It has no dependencies to a xml parser.
 * It assumes that the version tag is the correct direct descendant of the project tag.
 */
function main() {
  const pathArgument = process.argv[2] || DEFAULT_FILE_NAME;
  const path = join(process.cwd(), pathArgument);
  let pomXml;
  try {
    pomXml = readFileSync(path, 'utf8');
  } catch (error) {
    console.log(`\x1b[31mCould not read file: ${path}\x1b[0m`);
    process.exit(1);
  }

  // get a list of all opening and closing tags in order
  let tagList = [];
  let index = pomXml.indexOf('<');

  while (index !== -1) {
    const closingTagIndex = pomXml.indexOf('>', index);
    const tag = pomXml.substring(index, closingTagIndex + 1);
    tagList.push(tag);
    index = pomXml.indexOf('<', closingTagIndex);
  }

  // now we have all opening and closing tags inside the tagList array
  // we have to find the version tag that is the direct descendant of the project tag
  // everything before the project tag can be ignored
  const projectTagIndex = tagList.findIndex((tag) => tag.startsWith('<project'));
  tagList = tagList.slice(projectTagIndex);

  let nestedLevel = 0;

  for (let i = 0; i < tagList.length; i++) {
    const tag = tagList[i];

    // skip comments
    // skip closing version tag
    if (tag.startsWith('<!--') || tag === '</version>') {
      continue;
    }

    if (tag === '<version>') {
      // found version tag
      // check if it is the direct descendant of the project tag
      if (nestedLevel === TARGET_VERSION_TAG_NESTED_LEVEL) {
        const currentVersionTagIndex = i;
        const versionTagCountBeforeThisTag = tagList.slice(0, currentVersionTagIndex).filter(t => t === '<version>').length;

        // now we know that this version tag is the one we are looking for
        // find the value of this version tag with regexp
        const versionTagValueRegExp = new RegExp(`<version>(.+?)</version>`, 'g');
        const allVersionTagValues = [...pomXml.matchAll(versionTagValueRegExp)];
        const indexOfThisVersionTag = versionTagCountBeforeThisTag;
        const version = allVersionTagValues[indexOfThisVersionTag][1];

        // do not add a newline
        process.stdout.write(version);
        return;
      } else {
        // the nested level is not TARGET_VERSION_TAG_NESTED_LEVEL
        // this is another version tag that is not the one we are looking for
      }
    } else {
      if (tag.startsWith('<') && !tag.startsWith('</') && !tag.endsWith('/>')) {
        // found an opening tag
        nestedLevel++;
      } else if (tag.startsWith('</')) {
        // found a closing tag
        nestedLevel--;
      } else {
        // found a self-closing tag
        // do nothing
      }
    }
  }

  // if we reach this point, no version tag was found
  console.log('\x1b[31mNo version tag found.\x1b[0m');
  process.exit(1);
}

main();