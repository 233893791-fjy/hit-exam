// 考研历年真题题库（2000-2024）独立只读
var EXAM_POOL = {
  kaoyan: {
    name: "考研",
    subjects: {
      数学: [
        {year:2000,q:"$\\lim_{x\\to 0} \\frac{\\sin x - x}{x^3}$",o:["A. $-\\frac{1}{6}$","B. $\\frac{1}{6}$","C. $0$","D. $1$"],a:"A"}
      ]
    }
  }
};
function getExamQuestions(examType, subject) {
  var d = EXAM_POOL[examType];
  return d && d.subjects[subject] ? d.subjects[subject] : [];
}
function getExamSubjects(examType) {
  var d = EXAM_POOL[examType];
  return d ? Object.keys(d.subjects) : [];
}
function getExamYears(examType, subject) {
  var qs = getExamQuestions(examType, subject);
  var y = {};
  qs.forEach(function(q) { y[q.year] = 1; });
  return Object.keys(y).sort();
}
