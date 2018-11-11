const initialState = [{id: 12345, username: 'geraldnewman18', skills: ['Programming:Go', 'Programming:React'], interests: ['PrisonReform', 'WrongfulConvictions']},
  {id: 123483454, username: 'diego-sanchez', skills: ['Marketing', 'Fundraising'], interests: ['Healthcare', 'Education']},
  {id: 12648459345, username: 'dianne-ennis', skills: ['Law', 'Research', 'CommunityOrganizing'], interests: ['PrisonReform']},
  {id: 12047504, username: 'sarahthomas', skills: ['Design', 'PublicSpeaking', 'Marketing'], interests: ['VoterRights']},
  {id: 802984, username: 'bosko-bertolini', skills: ['Research', 'Business'], interests: ['MarriageEquality', 'SkillsTraining']},
  {id: 94365, username: 'peleg-colombo', skills: ['Research', 'DataScience', 'Management'], interests: ['StateSurveillance', 'DrugLegalization']},
  {id: 205602, username: 'natanael-venczel', skills: ['Chemistry', 'Physics', 'Programming:Python', 'IT:DevOps'], interests: ['Education', 'AccessibleHealthcare', 'HigherEducation']},
  {id: 890234, username: 'huri-london', skills: ['IT:Security', 'Programming:C'], interests: ['PrisonReform', 'MandatoryMinimums']}
];

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
