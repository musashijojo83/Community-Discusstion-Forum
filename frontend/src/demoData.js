//For demo data use

export const DEMO_BOARD_DESCRIPTION =
  'This discussion board is a place for students to share ideas, ask questions, and discuss topics related to the course. We can share our opinions, learn from each other, and help each other understand the course content better.';

export const DEMO_POSTS = [
  {
    _id: 'demo-p1',
    title: 'Is "leaving work on time" actually the ultimate priority, or is money still king?',
    content: `Had dinner with a few friends recently, and I noticed how much our definition of a "dream job" has changed over the past couple of years. Back when we were fresh graduates, everyone was chasing big company names, high salaries, and impressive job titles.
Now, almost every conversation revolves around work-life balance and whether a company actually lets you walk out the door on time.
Some of my friends are happily taking slightly lower pay in exchange for stress-free evenings to work out, cook, or just relax. On the flip side, others argue that when you're young, you should hustle as hard as possible, max out your income, and trade personal time for faster career growth.
Where do you draw the line when job hunting? Is leaving on time a dealbreaker for you, or is any amount of overtime acceptable as long as the paycheck is right?`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
  },
  {
    _id: 'demo-p2',
    title: 'The Importance of Good System Design',
    content: `I think good system design is important because it helps make a system easier to understand, develop, and maintain. A well-designed system can also reduce errors and improve communication between team members.
For example, using diagrams such as UML or SysML can help us clearly understand the system structure and how different components interact with each other. In my opinion, spending more time on the design stage can make the development process smoother and save time later.`,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString()
  }
];

export const mockComments = [
  {
    id: 'c1',
    text: 'I agree with your point. I think the discussion board is a useful way for us to share ideas and learn from each other. It also helps us understand different perspectives on the same topic.',
    time: '2mo ago',
    commentCount: 5,
    replies: [
      { id: 'c1-r1', text: 'I agree with your perspective.', time: '2mo ago' }
    ],
    moreReplies: 5
  }
];
