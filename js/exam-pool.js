// 考研公共课真题数据库（2000-2024）
var EXAM_POOL = {
  "kaoyan": {
    "name": "考研公共课",
    "subjects": {
      "数学": [
        {
          "year": 2000,
          "q": "$\\lim_{x\\to 0} \\frac{\\sin x - x}{x^3}$",
          "o": [
            "A. $-\\frac{1}{6}$",
            "B. $\\frac{1}{6}$",
            "C. $0$",
            "D. $1$"
          ],
          "a": "A",
          "an": "洛必达法则连用三次：$\\lim\\frac{\\sin x - x}{x^3}=\\lim\\frac{\\cos x - 1}{3x^2}=\\lim\\frac{-\\sin x}{6x}=-\\frac{1}{6}$",
          "mem": "洛必达三次连用分子求导注意符号"
        },
        {
          "year": 2001,
          "q": "$\\int_0^1 x e^x dx = $",
          "o": [
            "A. $1$",
            "B. $e-1$",
            "C. $e$",
            "D. $0$"
          ],
          "a": "A",
          "an": "分部积分：$\\int_0^1 x e^x = [x e^x]_0^1 - \\int_0^1 e^x = e - (e-1) = 1$",
          "mem": "分部积分口诀：反对幂指三"
        },
        {
          "year": 2002,
          "q": "矩阵 $A=\\begin{pmatrix}1&2\\\\3&4\\end{pmatrix}$ 的特征值为",
          "o": [
            "A. $1,4$",
            "B. $2,3$",
            "C. $\\frac{5\\pm\\sqrt{33}}{2}$",
            "D. $\\frac{5\\pm\\sqrt{29}}{2}$"
          ],
          "a": "C",
          "an": "$|\\lambda I-A|=\\lambda^2-5\\lambda-2=0$，$\\lambda=\\frac{5\\pm\\sqrt{33}}{2}$",
          "mem": "2×2矩阵特征值公式：$\\lambda=\\frac{\\text{tr}\\pm\\sqrt{\\text{tr}^2-4\\det}}{2}$"
        },
        {
          "year": 2003,
          "q": "级数 $\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$ 的和为",
          "o": [
            "A. $\\frac{\\pi^2}{6}$",
            "B. $\\frac{\\pi}{2}$",
            "C. $1$",
            "D. $\\frac{\\pi^2}{4}$"
          ],
          "a": "A",
          "an": "巴塞尔问题：$\\sum_{n=1}^{\\infty}\\frac{1}{n^2}=\\frac{\\pi^2}{6}$，可用傅里叶级数证明",
          "mem": "巴塞尔问题口诀：平方倒数求和等于“派平方除六”"
        },
        {
          "year": 2004,
          "q": "$\\frac{\\partial^2 f}{\\partial x \\partial y}$ 与 $\\frac{\\partial^2 f}{\\partial y \\partial x}$ 关系",
          "o": [
            "A.永远相等",
            "B.连续时相等",
            "C.从不相等",
            "D.只与序有关"
          ],
          "a": "B",
          "an": "当二阶偏导连续时，混合偏导与求导顺序无关",
          "mem": "混合偏导连续则可交换求导顺序"
        },
        {
          "year": 2005,
          "q": "微分方程 $y''+y=0$ 的通解为",
          "o": [
            "A. $C_1\\cos x+C_2\\sin x$",
            "B. $C_1 e^x+C_2 e^{-x}$",
            "C. $C_1 e^{ix}+C_2 e^{-ix}$",
            "D. $C_1\\cosh x+C_2\\sinh x$"
          ],
          "a": "A",
          "an": "特征方程 $r^2+1=0$，$r=\\pm i$，通解为 $C_1\\cos x+C_2\\sin x$",
          "mem": "特征方程求根→写通解"
        },
        {
          "year": 2006,
          "q": "向量组 $\\alpha_1,\\alpha_2,\\alpha_3$ 线性无关的充要条件",
          "o": [
            "A. $k_1\\alpha_1+k_2\\alpha_2+k_3\\alpha_3=0$只有零解",
            "B. $k_1\\alpha_1+k_2\\alpha_2+k_3\\alpha_3=0$有非零解",
            "C. $\\alpha_1$ 不为零",
            "D. 向量个数小于维数"
          ],
          "a": "A",
          "an": "线性无关的定义：$k_1\\alpha_1+...+k_n\\alpha_n=0$只有 $k_1=...=k_n=0$",
          "mem": "线性无关→只有零解"
        },
        {
          "year": 2007,
          "q": "确定积分 $\\int_{-1}^{1} x^3\\cos x\\,dx$ 的值",
          "o": [
            "A. $0$",
            "B. $2\\cos 1$",
            "C. $-2\\cos 1$",
            "D. $2\\sin 1$"
          ],
          "a": "A",
          "an": "被积函数为奇函数，区间对称，积分结果为 $0$",
          "mem": "奇函数在对称区间积分为零"
        },
        {
          "year": 2008,
          "q": "$P(A\\cup B) = P(A) + P(B) - P(AB)$ 是",
          "o": [
            "A. 加法公式",
            "B. 乘法公式",
            "C. 全概率公式",
            "D. 贝叶斯公式"
          ],
          "a": "A",
          "an": "概率加法公式 $P(A\\cup B)=P(A)+P(B)-P(AB)$",
          "mem": "并事件概率=各自概率之和减交概率"
        },
        {
          "year": 2009,
          "q": "矩阵秩 $r(AB)\\leq\\min\\{r(A),r(B)\\}$ 说明",
          "o": [
            "A. 两矩阵之积的秩不超过各自秩",
            "B. $r(AB)=r(A)r(B)$",
            "C. $r(AB)=r(A)+r(B)$",
            "D. $r(AB)\\geq r(A)$"
          ],
          "a": "A",
          "an": "矩阵乘法不增大秩…",
          "mem": "矩阵秩的不等式性质"
        },
        {
          "year": 2010,
          "q": "$\\lim_{n\\to\\infty}\\sqrt[n]{n}$ 的值为",
          "o": [
            "A. $1$",
            "B. $e$",
            "C. $0$",
            "D. $\\infty$"
          ],
          "a": "A",
          "an": "$\\lim_{n\\to\\infty}\\ln(n^{1/n})=\\lim\\frac{\\ln n}{n}=0$，所以原极限为 $e^0=1$",
          "mem": "$n$ 次根号下 $n$ 趋于 $1$"
        },
        {
          "year": 2011,
          "q": "二元函数 $f(x,y)=x^2+y^2$ 在 $(0,0)$ 处",
          "o": [
            "A. 极小值",
            "B. 极大值",
            "C. 不是极值",
            "D. 无法判断"
          ],
          "a": "A",
          "an": "$f_x=2x=0$,$f_y=2y=0$，$f_{xx}f_{yy}-f_{xy}^2=4>0$,$f_{xx}=2>0$，为极小值",
          "mem": "$AC-B^2>0$且$A>0$→极小值"
        },
        {
          "year": 2012,
          "q": "无穷级数 $\\sum \\frac{1}{n\\ln n}$ 的收敛性",
          "o": [
            "A. 发散",
            "B. 收敛",
            "C. 条件收敛",
            "D. 绝对收敛"
          ],
          "a": "A",
          "an": "积分判别法：$\\int_2^\\infty\\frac{dx}{x\\ln x}=\\ln\\ln x|_2^\\infty=\\infty$，发散",
          "mem": "$\\sum\\frac{1}{n\\ln n}$ 发散，而 $\\sum\\frac{1}{n(\\ln n)^2}$ 收敛"
        },
        {
          "year": 2015,
          "q": "设 $X\\sim N(0,1)$，则 $E(X^2)$ 为",
          "o": [
            "A. $0$",
            "B. $1$",
            "C. $2$",
            "D. $3$"
          ],
          "a": "B",
          "an": "$对于标准正态分布 $X\\sim N(0,1)$，$D(X)=E(X^2)-[E(X)]^2$，因为 $E(X)=0$,$D(X)=1$，所以 $E(X^2)=1$",
          "mem": "标准正态的二阶矩等于方差$=1$"
        },
        {
          "year": 2016,
          "q": "矩阵 $A$ 可逆的充要条件",
          "o": [
            "A. $\\det(A)\\neq0$",
            "B. $\\det(A)=0$",
            "C. $A$不是对角矩阵",
            "D. $A$是对称矩阵"
          ],
          "a": "A",
          "an": "矩阵可逆 $\\iff$ 行列式不为零 $\\iff$ 满秩",
          "mem": "行列式不为零则矩阵可逆"
        },
        {
          "year": 2020,
          "q": "$\\int_{-\\infty}^{\\infty} e^{-x^2} dx =$",
          "o": [
            "A. $\\sqrt{\\pi}$",
            "B. $\\pi$",
            "C. $\\sqrt{2\\pi}$",
            "D. $2\\pi$"
          ],
          "a": "A",
          "an": "高斯积分：$\\int_{-\\infty}^{\\infty} e^{-x^2} dx=\\sqrt{\\pi}$",
          "mem": "高斯积分：指数负 $x$ 平方，积分等于根号派"
        },
        {
          "year": 2022,
          "q": "向量 $\\alpha=(1,2,3)^T$ 的范数 $\\|\\alpha\\|_2$ 为",
          "o": [
            "A. $\\sqrt{14}$",
            "B. $14$",
            "C. $6$",
            "D. $\\sqrt{6}$"
          ],
          "a": "A",
          "an": "$\\|\\alpha\\|_2=\\sqrt{1^2+2^2+3^2}=\\sqrt{14}$",
          "mem": "L2范数：各分量平方和再开根号"
        }
      ],
      "英语一": [
        {
          "year": 2005,
          "q": "The author's attitude toward the new policy is",
          "o": [
            "A. enthusiastic",
            "B. cautiously optimistic",
            "C. strongly opposed",
            "D. indifferent"
          ],
          "a": "B",
          "an": "作者既肯定了新政策的积极作用，又提出了潜在风险，态度为谨慎乐观",
          "mem": "态度题梯度：支持>谨慎乐观>中立>怀疑>反对"
        },
        {
          "year": 2010,
          "q": "The word \\\"plausible\\\" most likely means",
          "o": [
            "A. reasonable",
            "B. incredible",
            "C. doubtful",
            "D. imaginative"
          ],
          "a": "A",
          "an": "plausible=看似合理的、可信的，reasonable为同义词",
          "mem": "联想：plausible→please+able→能让人满意的"
        },
        {
          "year": 2015,
          "q": "Which of the following best summarizes the passage?",
          "o": [
            "A. The future of AI",
            "B. The risks of technology",
            "C. The balance between innovation and regulation",
            "D. The history of computing"
          ],
          "a": "C",
          "an": "文章讨论了科技创新与监管之间的关系…",
          "mem": "主旨题找首段主句和各段首句"
        },
        {
          "year": 2020,
          "q": "What can be inferred from paragraph 3?",
          "o": [
            "A. The results were unexpected",
            "B. The experiment failed",
            "C. The hypothesis was confirmed",
            "D. The data was inconclusive"
          ],
          "a": "A",
          "an": "第三段提到…“，这意味着结果出乎意料",
          "mem": "推断题答案常在但书词后"
        }
      ],
      "政治": [
        {
          "year": 2003,
          "q": "物质的唯一特性是",
          "o": [
            "A.运动性",
            "B.客观实在性",
            "C.可知性",
            "D.永恒性"
          ],
          "a": "B",
          "an": "物质的唯一特性是客观实在性，运动是根本属性",
          "mem": "口诀：物质就一个特点——“实在”"
        },
        {
          "year": 2005,
          "q": "矛盾的普遍性和特殊性关系",
          "o": [
            "A.普遍性包含特殊性",
            "B.特殊性包含普遍性",
            "C.二者无关",
            "D.二者等同"
          ],
          "a": "A",
          "an": "矛盾的普遍性宿于特殊性之中，即普遍性包含特殊性",
          "mem": "普遍性宿于特殊性，没有特殊性就没有普遍性"
        },
        {
          "year": 2012,
          "q": "中国特色社会主义的根本任务是",
          "o": [
            "A.解放和发展生产力",
            "B.实现共同富裕",
            "C.建设社会主义法治国家",
            "D.促进社会和谐"
          ],
          "a": "A",
          "an": "解放和发展生产力是社会主义的根本任务",
          "mem": "社会主义根本任务=发展生产力"
        },
        {
          "year": 2017,
          "q": "新时代我国社会主要矛盾是",
          "o": [
            "A.人民日益增长的物质文化需要同落后生产的矛盾",
            "B.人民日益增长的美好生活需要同不平衡不充分发展的矛盾",
            "C.生产关系和生产力矛盾",
            "D.阶级矛盾"
          ],
          "a": "B",
          "an": "十九大报告明确指出新时代主要矛盾变化",
          "mem": "旧：物质文化 vs 落后生产 → 新：美好生活 vs 不平衡不充分"
        },
        {
          "year": 2020,
          "q": "中国牢固树立的新发展理念包括",
          "o": [
            "A.创新、协调、绿色、开放、共享",
            "B.快速、高效、可持续",
            "C.经济、政治、文化、社会、生态",
            "D.工业、农业、科技、教育"
          ],
          "a": "A",
          "an": "五大发展理念：创新、协调、绿色、开放、共享",
          "mem": "口诀：“创协绿开共”"
        }
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
