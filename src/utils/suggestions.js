import { PURSUANCE_DISPLAY_PREFIX } from '../constants';

export const filterSuggestion = (value, suggestionsObj) => {
  const suggestionsArr = Object.values(suggestionsObj);
  const lowerCaseVal = value.toLowerCase();
  const filtered = suggestionsArr.filter(suggestion => {
    const suggest = suggestion.name || suggestion.suggestionName;
    const lowerCaseSuggestion = suggest.toLowerCase();
    return lowerCaseSuggestion.startsWith(lowerCaseVal);
  });
  return filtered.sort(sortBySuggest);
};

const sortBySuggest = (suggest1, suggest2) => {
  if ((suggest1.suggestionName.startsWith(PURSUANCE_DISPLAY_PREFIX) &&
       !suggest2.suggestionName.startsWith(PURSUANCE_DISPLAY_PREFIX)) ||
      (suggest2.suggestionName.startsWith(PURSUANCE_DISPLAY_PREFIX) &&
       !suggest1.suggestionName.startsWith(PURSUANCE_DISPLAY_PREFIX))) {
     return suggest2.suggestionName.localeCompare(suggest1.suggestionName);
  }
  return suggest1.suggestionName.localeCompare(suggest2.suggestionName);
};
