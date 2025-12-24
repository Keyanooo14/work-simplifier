// Complex word to simple word mapping
const complexWordMap: Record<string, string> = {
  'KPI': 'key performance indicator',
  'KPIs': 'key performance indicators',
  'UX': 'user experience',
  'UI': 'user interface',
  'ROI': 'return on investment',
  'ASAP': 'as soon as possible',
  'EOD': 'end of day',
  'ETA': 'estimated time of arrival',
  'FYI': 'for your information',
  'TBD': 'to be determined',
  'WIP': 'work in progress',
  'POC': 'proof of concept',
  'MVP': 'minimum viable product',
  'API': 'application programming interface',
  'SLA': 'service level agreement',
  'OKR': 'objectives and key results',
  'OKRs': 'objectives and key results',
  'B2B': 'business to business',
  'B2C': 'business to consumer',
  'CTA': 'call to action',
  'SEO': 'search engine optimization',
  'CRM': 'customer relationship management',
  'ERP': 'enterprise resource planning',
  'P&L': 'profit and loss',
  'Q1': 'first quarter',
  'Q2': 'second quarter',
  'Q3': 'third quarter',
  'Q4': 'fourth quarter',
  'YoY': 'year over year',
  'MoM': 'month over month',
  'QoQ': 'quarter over quarter',
  'synergy': 'combined effort',
  'leverage': 'use effectively',
  'bandwidth': 'capacity or time',
  'actionable': 'doable',
  'deliverables': 'items to complete',
  'stakeholder': 'person involved',
  'stakeholders': 'people involved',
  'scalable': 'can grow easily',
  'optimize': 'improve',
  'streamline': 'simplify',
  'paradigm': 'model or pattern',
  'ecosystem': 'connected system',
  'holistic': 'complete or whole',
  'proactive': 'taking action early',
  'onboarding': 'getting started process',
  'offboarding': 'leaving process',
  'upskill': 'learn new skills',
  'deep dive': 'detailed analysis',
  'low-hanging fruit': 'easy wins',
  'circle back': 'follow up later',
  'touch base': 'check in',
  'move the needle': 'make significant progress',
  'drill down': 'look into details',
  'pivot': 'change direction',
  'bottleneck': 'slowdown point',
  'pain point': 'problem area',
  'best practices': 'recommended methods',
  'game changer': 'major improvement',
  'value-add': 'extra benefit',
  'win-win': 'mutually beneficial',
  'next steps': 'what to do next',
  'takeaways': 'key points',
  'key takeaways': 'main points',
};

export function simplifyText(text: string): string {
  let simplified = text;
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = Object.keys(complexWordMap).sort((a, b) => b.length - a.length);
  
  for (const term of sortedTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    simplified = simplified.replace(regex, (match) => {
      const replacement = complexWordMap[term.toUpperCase()] || complexWordMap[term.toLowerCase()] || complexWordMap[term];
      return replacement || match;
    });
  }
  
  return simplified;
}

export function extractTaskInfo(text: string): {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  deadline: string;
} {
  const simplified = simplifyText(text);
  const lines = simplified.split('\n').filter(line => line.trim());
  
  // Extract title (first line or first sentence)
  let title = lines[0] || text.slice(0, 50);
  if (title.length > 60) {
    title = title.slice(0, 57) + '...';
  }
  
  // Extract description (rest of the text)
  const description = lines.slice(1).join(' ').trim() || simplified;
  
  // Detect priority based on keywords
  const textLower = text.toLowerCase();
  let priority: 'high' | 'medium' | 'low' = 'medium';
  if (textLower.includes('urgent') || textLower.includes('asap') || textLower.includes('critical') || textLower.includes('immediately')) {
    priority = 'high';
  } else if (textLower.includes('when possible') || textLower.includes('low priority') || textLower.includes('nice to have')) {
    priority = 'low';
  }
  
  // Extract assignee (look for @mentions or "assign to" patterns)
  let assignee = 'Unassigned';
  const assigneeMatch = text.match(/@(\w+)|assign(?:ed)?\s+to\s+(\w+)|(\w+)\s+(?:will|should|to)\s+handle/i);
  if (assigneeMatch) {
    assignee = assigneeMatch[1] || assigneeMatch[2] || assigneeMatch[3] || 'Unassigned';
    assignee = assignee.charAt(0).toUpperCase() + assignee.slice(1);
  }
  
  // Extract deadline (look for date patterns)
  let deadline = 'No deadline';
  const deadlineMatch = text.match(/(?:by|due|deadline|before)\s+(\w+\s+\d+|\d+\/\d+(?:\/\d+)?|tomorrow|today|next\s+\w+|end\s+of\s+\w+)/i);
  if (deadlineMatch) {
    deadline = deadlineMatch[1];
    deadline = deadline.charAt(0).toUpperCase() + deadline.slice(1);
  }
  
  return { title, description, priority, assignee, deadline };
}
