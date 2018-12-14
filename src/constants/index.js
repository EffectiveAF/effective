export const PURSUANCE_DISPLAY_PREFIX = '(P) ';

// For whitelabeling purposes, may want to change to 'pursuance'
export const PROJECT = 'pursuance';

export const PROJECTS = PROJECT + 's';

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const PROJECT_CAPITAL = capitalizeFirstLetter(PROJECT);

export const PROJECTS_CAPITAL = capitalizeFirstLetter(PROJECTS);

export const THIS_PROJECT_NAME = 'Pursuance';
