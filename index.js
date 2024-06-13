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

function getLearnerData(courseInfo, assignmentGroup, submissions) {
  let result = [];
  const currentDate = new Date();

  try {
    // Course validation
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error(
        `Assignment group ${assignmentGroup.id} does not belong to course ${courseInfo.id}`
      );
    }

    // Assignments by ID
    const assignmentsById = {};
    assignmentGroup.assignments.forEach((assignment) => {
      assignmentsById[assignment.id] = assignment;
    });

    // Group submissions by learner
    const submissionsByLearner = {};
    submissions.forEach((submission) => {
      const { learner_id, assignment_id, submission: sub } = submission;
      if (!submissionsByLearner[learner_id]) {
        submissionsByLearner[learner_id] = [];
      }
      submissionsByLearner[learner_id].push({ assignment_id, submission: sub });
    });

    // Calculate scores
    Object.keys(submissionsByLearner).forEach((learnerId) => {
      const learnerIdNum = parseInt(learnerId);
      const learnerSubmissions = submissionsByLearner[learnerId];
      const learnerResult = { id: learnerIdNum, avg: 0 };
      let totalScore = 0;
      let totalPointsPossible = 0;

      learnerSubmissions.forEach(({ assignment_id, submission }) => {
        const assignment = assignmentsById[assignment_id];

        // Check to see if assignment is valid
        if (!assignment) {
          throw new Error(`Assignment ${assignment_id} not found`);
        }

        // Skip assignments not yet due
        if (new Date(assignment.due_at) > currentDate) {
          return;
        }

        // Check for points_possible being zero
        if (assignment.points_possible === 0) {
          throw new Error(
            `Assignment ${assignment.id} has zero points possible`
          );
        }

        // Late submission
        let score = submission.score;
        if (new Date(submission.submitted_at) > new Date(assignment.due_at)) {
          score -= 10;
        }

        // Calculate score percentage
        const scorePercentage = calculateScorePercentage(
          submission,
          assignment
        );
        learnerResult[assignment_id] = scorePercentage;
        totalScore += submission.score;
        totalPointsPossible += assignment.points_possible;
      });

      if (totalPointsPossible > 0) {
        learnerResult.avg = totalScore / totalPointsPossible;
      }

      result.push(learnerResult);
    });
  } catch (err) {
    console.error('An error:', err.message);
  }

  return result;
}

const results = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(results);
