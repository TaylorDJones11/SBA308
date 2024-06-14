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

//   Helper function to calculate average
function calculateScorePercentage(submission, assignment) {
  return (submission.score / assignment.points_possible) * 100;
}

function getLearnerData(courseInfo, assignmentGroup, submissions) {
  let result = [];
  const currentDate = new Date();

  try {
    // Is this course valid?
    if (assignmentGroup.course_id !== courseInfo.id) {
      throw new Error(
        `Assignment group ${assignmentGroup.id} does not belong to course ${courseInfo.id}`
      );
    }

    // Assignments by ID
    // {1: { id: 1, title: 'Declare a Variable', points_possible: 50, due_at: '2023-01-25' }}
    const assignmentsById = {};
    assignmentGroup.assignments.forEach((assignment) => {
      assignmentsById[assignment.id] = assignment;
    });

    // Group submissions by learner
    // {125: [ { assignment_id: 1, submission: { score: 47, submitted_at: '2023-01-25' } },
    // { assignment_id: 2, submission: { score: 150, submitted_at: '2023-02-12' } }]
    const submissionsByLearner = {};
    submissions.forEach((submission) => {
      const { learner_id, assignment_id, submission: sub } = submission;
      if (!submissionsByLearner[learner_id]) {
        submissionsByLearner[learner_id] = [];
      }
      submissionsByLearner[learner_id].push({ assignment_id, submission: sub });
    });

    // Calculate each learner scores
    Object.keys(submissionsByLearner).forEach((learnerId) => {
      const learnerIdNum = parseInt(learnerId);
      const learnerSubmissions = submissionsByLearner[learnerId];
      const learnerResult = { id: learnerIdNum, avg: 0 };

      // Initialize assignment scores
      //  assignments: [{ id: 1, title: 'Assignment 1' },{ id: 2, title: 'Assignment 2' },{ id: 3, title: 'Assignment 3' }]
      assignmentGroup.assignments.forEach((assignment) => {
        learnerResult[assignment.id] = 0;
      });

      let totalScore = 0;
      let totalPointsPossible = 0;

      assignmentGroup.assignments.forEach((assignment) => {
        const assignment_id = assignment.id;
        const submission = learnerSubmissions.find(
          (sub) => sub.assignment_id === assignment_id
        );

        if (submission) {
          // Is this assignment valid?
          if (!assignmentsById[assignment_id]) {
            throw new Error(`Assignment ${assignment_id} not found`);
          }

          // Skip assignments not yet due
          if (new Date(assignmentsById[assignment_id].due_at) > currentDate) {
            return;
          }

          // Check for points_possible being zero
          if (assignmentsById[assignment_id].points_possible === 0) {
            throw new Error(
              `Assignment ${assignment_id} has zero points possible`
            );
          }

          // Late submission penalty - deduct 10 points
          let score = submission.submission.score;
          if (
            new Date(submission.submission.submitted_at) >
            new Date(assignmentsById[assignment_id].due_at)
          ) {
            score -= 10;
          }

          // Calculate score percentage with helper function
          const scorePercentage = calculateScorePercentage(
            submission.submission,
            assignmentsById[assignment_id]
          );
          learnerResult[assignment_id] =
            Math.round(scorePercentage * 1000) / 1000;
          totalScore += score;
          totalPointsPossible += assignmentsById[assignment_id].points_possible;
        }
      });

      if (totalPointsPossible > 0) {
        learnerResult.avg =
          Math.round((totalScore / totalPointsPossible) * 1000) / 1000;
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
