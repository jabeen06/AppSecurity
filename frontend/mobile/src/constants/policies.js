export const TIMING_RULES = {
  preparedSpeech: {
    green: '3 min',
    yellow: '4 min',
    red: '5 min',
    grace: '5:30'
  },
  evaluation: {
    green: '2 min',
    yellow: '2:30',
    red: '3 min',
    grace: '3:30'
  },
  tableTopics: {
    green: '1 min',
    yellow: '1:30',
    red: '2 min',
    grace: '2:30'
  }
};

export const VOTING_RULES = {
  awards: ['Best Speaker', 'Best Evaluator', 'Best Roleplayer', 'Best Thematic Topics Speaker'],
  rules: [
    'Must speak within the allowed time range.',
    'Disqualified if below minimum or above grace time.',
    'Awards are learning-focused recognition.'
  ]
};

