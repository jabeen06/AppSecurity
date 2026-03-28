export const TIMING_RULES = {
  preparedSpeech: {
    green: '3:00',
    yellow: '4:00',
    red: '5:00',
    grace: '5:30'
  },
  evaluation: {
    green: '2:00',
    yellow: '2:30',
    red: '3:00',
    grace: '3:30'
  },
  tableTopics: {
    green: '1:00',
    yellow: '1:30',
    red: '2:00',
    grace: '2:30'
  }
};

export const VOTING_RULES = {
  awards: ['Best Speaker', 'Best Evaluator', 'Best Roleplayer', 'Best Thematic Topics Speaker'],
  rules: [
    'Speeches must be within the allowed time range.',
    'Disqualification occurs if below minimum or above grace time.',
    'Awards are learning-focused recognition, not live competition.'
  ]
};

