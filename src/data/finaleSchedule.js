export const finaleSchedule = [
  {
    day: 'Day 1',
    date: '5 September 2026',
    venue: 'AB 2 Audi 1 and Audi 2',
    color: '#FF9933',
    badge: 'Day 1 • 5 Sep 2026',
    items: [
      {
        time: '01:30 PM – 02:00 PM',
        startTime: '2026-09-05T13:30:00+05:30',
        endTime: '2026-09-05T14:00:00+05:30',
        session: 'Registration & Entry',
        details: 'Teams check-in, collect kits & settle in',
        icon: '📋',
        type: 'entry'
      },
      {
        time: '02:00 PM – 02:30 PM',
        startTime: '2026-09-05T14:00:00+05:30',
        endTime: '2026-09-05T14:30:00+05:30',
        session: 'Inauguration',
        details: 'Welcome to Smart VIT Hackathon 2026',
        icon: '🎙️',
        type: 'ceremony'
      },
      {
        time: '02:30 PM – 03:00 PM',
        startTime: '2026-09-05T14:30:00+05:30',
        endTime: '2026-09-05T15:00:00+05:30',
        session: 'Hackathon Briefing',
        details: 'Overview of rules, themes & evaluation criteria',
        icon: '📢',
        type: 'briefing'
      },
      {
        time: '03:00 PM – 05:00 PM',
        startTime: '2026-09-05T15:00:00+05:30',
        endTime: '2026-09-05T17:00:00+05:30',
        session: 'Coding + Mentoring',
        details: 'Start building your ideas with mentor support',
        icon: '💻',
        type: 'coding'
      },
      {
        time: '05:00 PM – 05:30 PM',
        startTime: '2026-09-05T17:00:00+05:30',
        endTime: '2026-09-05T17:30:00+05:30',
        session: 'Break',
        details: 'Short break',
        icon: '☕',
        type: 'break'
      },
      {
        time: '05:30 PM – 06:30 PM',
        startTime: '2026-09-05T17:30:00+05:30',
        endTime: '2026-09-05T18:30:00+05:30',
        session: 'Coding – Round 2',
        details: 'Continue coding & develop your solution',
        icon: '⚡',
        type: 'coding'
      },
      {
        time: '06:30 PM – 07:30 PM',
        startTime: '2026-09-05T18:30:00+05:30',
        endTime: '2026-09-05T19:30:00+05:30',
        session: 'Fun Activities',
        details: 'Engage, unwind & bond with peers',
        icon: '🎉',
        type: 'activity'
      }
    ]
  },
  {
    day: 'Day 2',
    date: '6 September 2026',
    venue: 'AB 1 Audi 1 and Audi 2',
    color: '#138808',
    badge: 'Day 2 • 6 Sep 2026',
    items: [
      {
        time: '10:00 AM – 11:30 AM',
        startTime: '2026-09-06T10:00:00+05:30',
        endTime: '2026-09-06T11:30:00+05:30',
        session: 'Huddle & Day 2 Brief',
        details: 'Quick recap of Day 1 & plan for Day 2',
        icon: '💬',
        type: 'briefing'
      },
      {
        time: '11:30 AM – 01:00 PM',
        startTime: '2026-09-06T11:30:00+05:30',
        endTime: '2026-09-06T13:00:00+05:30',
        session: 'Coding Session',
        details: 'Continue building your solution • Mentor support available',
        icon: '💻',
        type: 'coding'
      },
      {
        time: '01:00 PM – 01:30 PM',
        startTime: '2026-09-06T13:00:00+05:30',
        endTime: '2026-09-06T13:30:00+05:30',
        session: 'Lunch Break',
        details: 'Recharge & refuel',
        icon: '🍱',
        type: 'break'
      },
      {
        time: '01:30 PM – 04:30 PM',
        startTime: '2026-09-06T13:30:00+05:30',
        endTime: '2026-09-06T16:30:00+05:30',
        session: 'Coding Session & Judging',
        details: 'Finalize your solution • Judging by the panel',
        icon: '⚖️',
        type: 'judging'
      },
      {
        time: '04:30 PM – 06:00 PM',
        startTime: '2026-09-06T16:30:00+05:30',
        endTime: '2026-09-06T18:00:00+05:30',
        session: 'Results & Prize Distribution',
        details: 'Winners announcement & prize distribution',
        icon: '🏆',
        type: 'ceremony'
      }
    ]
  }
];

export function getActiveFinaleMilestone(now = new Date()) {
  const opens = new Date('2026-07-01T00:00:00+05:30');
  const regCloses = new Date('2026-07-25T23:59:59+05:30');
  const pptCloses = new Date('2026-08-10T23:59:59+05:30');
  const evalCloses = new Date('2026-08-15T23:59:59+05:30');
  const finaleDay1Start = new Date('2026-09-05T13:30:00+05:30');
  const finaleEnd = new Date('2026-09-06T18:00:00+05:30');

  if (now < opens) {
    return {
      label: 'Registration Opens In',
      target: '2026-07-01T00:00:00+05:30',
      color: '#FF9933',
      venue: null,
      status: 'upcoming'
    };
  }
  if (now < regCloses) {
    return {
      label: 'Registration Closes In',
      target: '2026-07-25T23:59:59+05:30',
      color: '#FF9933',
      venue: null,
      status: 'active'
    };
  }
  if (now < pptCloses) {
    return {
      label: 'PPT Submission Closes In',
      target: '2026-08-10T23:59:59+05:30',
      color: '#138808',
      venue: null,
      status: 'active'
    };
  }
  if (now < evalCloses) {
    return {
      label: 'PPT Evaluation Ongoing — Results Announcement In',
      target: '2026-08-15T23:59:59+05:30',
      color: '#38bdf8',
      venue: null,
      status: 'active'
    };
  }
  if (now < finaleDay1Start) {
    return {
      label: 'Grand Finale Check-in & Registration Begins In',
      target: '2026-09-05T13:30:00+05:30',
      color: '#FF9933',
      venue: 'AB 2 Audi 1 & Audi 2',
      sessionName: 'Registration & Entry (01:30 PM)',
      status: 'upcoming'
    };
  }

  // Iterate over all schedule items across Day 1 & Day 2
  for (const day of finaleSchedule) {
    for (const item of day.items) {
      const itemStart = new Date(item.startTime);
      const itemEnd = new Date(item.endTime);

      if (now >= itemStart && now < itemEnd) {
        return {
          label: `LIVE NOW: ${item.session}`,
          nextLabel: `Next session begins in`,
          target: item.endTime,
          color: day.color,
          venue: day.venue,
          currentSession: item,
          day: day.day,
          status: 'live'
        };
      }
    }
  }

  // Between Day 1 wrap (19:30) and Day 2 start (10:00)
  const day1End = new Date('2026-09-05T19:30:00+05:30');
  const day2Start = new Date('2026-09-06T10:00:00+05:30');
  if (now >= day1End && now < day2Start) {
    return {
      label: 'Day 1 Complete — Day 2 Huddle Begins In',
      target: '2026-09-06T10:00:00+05:30',
      color: '#138808',
      venue: 'AB 1 Audi 1 & Audi 2',
      sessionName: 'Huddle & Day 2 Brief (10:00 AM)',
      status: 'intermission'
    };
  }

  if (now >= finaleEnd) {
    return {
      label: 'Grand Finale Concluded',
      target: '2026-09-06T18:00:00+05:30',
      color: '#10b981',
      venue: 'AB 1 Audi 1 & Audi 2',
      status: 'completed'
    };
  }

  return {
    label: 'Grand Finale In Progress',
    target: '2026-09-06T18:00:00+05:30',
    color: '#FF9933',
    venue: 'VIT Bhopal University',
    status: 'active'
  };
}
