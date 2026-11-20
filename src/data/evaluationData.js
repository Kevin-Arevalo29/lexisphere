export const initialEvaluationModules = [
  {
    id: 'social-media-technology',
    title: 'Social Media and Technology',
    percentage: 85,
    ringColor: '#10B981',
    status: 'Passed',
    statusVariant: 'passed',
    tests: [
      { name: 'Reading', score: '90%', graded: true },
      { name: 'Listening', score: '80%', graded: true },
      { name: 'Speaking (3 Audios)', score: 'Pending', graded: false },
      { name: 'Writing', score: '85%', graded: true }
    ]
  },
  {
    id: 'environment',
    title: 'Environment',
    percentage: 72,
    ringColor: '#F59E0B',
    status: 'In Progress',
    statusVariant: 'progress',
    tests: [
      { name: 'Reading', score: '75%', graded: true },
      { name: 'Listening', score: '70%', graded: true },
      { name: 'Speaking', score: 'Pending', graded: false },
      { name: 'Writing', score: 'Pending', graded: false }
    ]
  },
  {
    id: 'society',
    title: 'Society',
    percentage: 90,
    ringColor: '#10B981',
    status: 'Passed',
    statusVariant: 'passed',
    tests: [
      { name: 'Reading', score: '92%', graded: true },
      { name: 'Listening', score: '88%', graded: true },
      { name: 'Speaking', score: '90%', graded: true },
      { name: 'Writing', score: 'Pending', graded: false }
    ]
  },
  {
    id: 'final-test',
    title: 'Final Test',
    percentage: 78,
    ringColor: '#F59E0B',
    status: 'In Progress',
    statusVariant: 'progress',
    tests: [
      { name: 'Reading (25 pts)', score: '80%', graded: true },
      { name: 'Listening (25 pts)', score: '76%', graded: true },
      { name: 'Writing (25 pts)', score: 'Pending', graded: false },
      { name: 'Speaking (25 pts)', score: 'Pending', graded: false }
    ]
  }
];