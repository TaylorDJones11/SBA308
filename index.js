// The provided course information.
const CourseInfo = {
  id: 451,
  name: 'Introduction to JavaScript',
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: 'Fundamentals of JavaScript',
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: 'Declare a Variable',
      due_at: '2023-01-25',
      points_possible: 50,
    },
    {
      id: 2,
      name: 'Write a Function',
      due_at: '2023-02-27',
      points_possible: 150,
    },
    {
      id: 3,
      name: 'Code the World',
      due_at: '3156-11-15',
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: '2023-01-25',
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: '2023-02-12',
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: '2023-01-25',
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: '2023-01-24',
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: '2023-03-07',
      score: 140,
    },
  },
];

//   Helper functions to calculate average
function calculateScorePercentage(submission, assignment) {
  return (submission.score / assignment.points_possible) * 100;
}

function getLearnerData(courseInfo, assignmentGroups, LearnerSubmissions) {
  let result = [];
  const currentDate = new Date();

  try {
    // Course valid?

    assignmentGroups.forEach((group) => {
      if (group.course_id !== courseInfo.id) {
        throw new Error(
          `Assignment group ${group.id} does not belong to course`
        );
      }
    });
  } catch (err) {
    console.error('An error:', err.message);
  }

  // Get learner's id + info related to the id # - dont repeat if the id number is already there
  for (const obj of LearnerSubmissions) {
    if (obj.learner_id === id && !learnerObj[obj.learner_id]) {
      learnerObj[obj.learner_id] = {
        learner_id: obj.learner_id,
        // avg: getAverage(),
        // submissions: LearnerSubmissions.filter((sub) => sub.learner_id === id),
      };
      result.push(learnerObj[obj.learner_id]);
    }
  }

  return result;
}

const results = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(results);
