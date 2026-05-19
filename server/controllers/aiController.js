const Performance = require('../models/Performance');
const Employee = require('../models/Employee');

exports.generateRecommendation = async (req, res) => {
  try {
    const { employeeId, reviewPeriod, kpiScore, technicalSkillsScore, softSkillsScore, comments } = req.body;
    const employee = await Employee.findById(employeeId);
    
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    // Prepare prompt
    const prompt = `You are an expert HR AI assistant. Based on the following employee data, provide a short, actionable recommendation (max 3 sentences) on whether this employee should be promoted, given a raise, or assigned specific training.
    
    Employee Name: ${employee.name}
    Role: ${employee.role}
    Department: ${employee.department}
    Skills: ${employee.skills.join(', ')}
    
    Performance Review (${reviewPeriod}):
    KPI Score: ${kpiScore}/10
    Technical Skills: ${technicalSkillsScore}/10
    Soft Skills: ${softSkillsScore}/10
    Manager Comments: ${comments}
    `;

    let aiRecommendation = "AI recommendation could not be generated. Please check your API key.";
    
    // Call Gemini API using fetch
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      if (data.candidates && data.candidates.length > 0) {
        aiRecommendation = data.candidates[0].content.parts[0].text;
      } else {
        console.error('Gemini API Error:', data);
      }
    }

    const performance = new Performance({
      employee: employeeId,
      reviewPeriod,
      kpiScore,
      technicalSkillsScore,
      softSkillsScore,
      comments,
      aiRecommendation,
      aiGeneratedAt: new Date()
    });

    await performance.save();
    res.json(performance);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const performances = await Performance.find().populate('employee', ['name', 'role', 'department']);
    
    // Simple ranking based on average score
    const analytics = performances.map(p => {
      const avgScore = (p.kpiScore + p.technicalSkillsScore + p.softSkillsScore) / 3;
      return {
        _id: p._id,
        employee: p.employee,
        reviewPeriod: p.reviewPeriod,
        avgScore: avgScore.toFixed(1),
        aiRecommendation: p.aiRecommendation
      };
    }).sort((a, b) => b.avgScore - a.avgScore);

    res.json(analytics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
