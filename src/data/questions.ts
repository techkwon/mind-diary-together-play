import { Question } from "@/contexts/GameContext";

export const questions: Question[] = [
  // 자기 인식 (Self-awareness) 관련 질문들
  {
    id: "self_awareness_1",
    text: "지금 내 기분을 색깔로 표현한다면 어떤 색이며, 그 이유는 무엇인가요?",
    category: "normal"
  },
  {
    id: "self_awareness_2", 
    text: "내가 가장 자랑스러워하는 나의 장점은 무엇인가요?",
    category: "normal"
  },
  {
    id: "self_awareness_3",
    text: "화가 날 때 내 몸에서 느끼는 변화(심장박동, 얼굴 등)를 설명해보세요.",
    category: "normal"
  },
  {
    id: "self_awareness_4",
    text: "내가 스트레스를 받을 때 나타나는 행동이나 습관이 있나요?",
    category: "normal"
  },
  {
    id: "self_awareness_5",
    text: "내가 가장 행복해질 때는 언제인지 구체적으로 말해보세요.",
    category: "normal"
  },

  // 자기 관리 (Self-management) 관련 질문들
  {
    id: "self_management_1",
    text: "화가 날 때 마음을 진정시키는 나만의 방법을 공유해보세요.",
    category: "normal"
  },
  {
    id: "self_management_2",
    text: "실수했을 때 기분을 회복하기 위해 어떤 말을 자신에게 해주나요?",
    category: "normal"
  },
  {
    id: "self_management_3",
    text: "올해 달성하고 싶은 목표가 있다면 무엇이며, 어떻게 실행할 계획인가요?",
    category: "normal"
  },
  {
    id: "self_management_4",
    text: "힘든 일이 있을 때 긍정적으로 생각하는 방법을 알려주세요.",
    category: "normal"
  },
  {
    id: "self_management_5",
    text: "집중하기 어려울 때 사용하는 나만의 집중 방법이 있나요?",
    category: "normal"
  },

  // 사회적 인식 (Social awareness) 관련 질문들  
  {
    id: "social_awareness_1",
    text: "친구가 슬퍼할 때 어떤 표정이나 행동으로 알 수 있나요?",
    category: "normal"
  },
  {
    id: "social_awareness_2",
    text: "다른 사람의 기분을 이해하기 위해 어떤 것들을 관찰하나요?",
    category: "normal"
  },
  {
    id: "social_awareness_3",
    text: "누군가 화났을 때, 그 사람이 왜 화났는지 추측해본 경험을 말해보세요.",
    category: "normal"
  },
  {
    id: "social_awareness_4",
    text: "다른 문화나 배경을 가진 사람들을 이해하려고 노력한 경험이 있나요?",
    category: "normal"
  },
  {
    id: "social_awareness_5",
    text: "주변에서 도움이 필요해 보이는 사람을 어떻게 알아차릴 수 있나요?",
    category: "normal"
  },

  // 관계 기술 (Relationship skills) - 칭찬 카테고리
  {
    id: "relationship_1",
    text: "왼쪽 사람에게 진심 어린 칭찬과 그 이유를 자세히 말해주세요.",
    category: "praise"
  },
  {
    id: "relationship_2",
    text: "오른쪽 사람이 다른 사람을 배려하는 모습을 본 적이 있다면 말해주세요.",
    category: "praise"
  },
  {
    id: "relationship_3",
    text: "함께 있는 사람 중에서 가장 좋은 리더십을 보여준 사람을 칭찬해주세요.",
    category: "praise"
  },
  {
    id: "relationship_4",
    text: "모든 사람에게 각각 다른 감사 인사와 이유를 말해주세요.",
    category: "praise"
  },
  {
    id: "relationship_5",
    text: "가장 좋은 경청자라고 생각하는 사람에게 그 이유를 말하며 칭찬해주세요.",
    category: "praise"
  },
  {
    id: "relationship_6",
    text: "갈등이 생겼을 때 평화롭게 해결하는 방법을 함께 이야기해보세요.",
    category: "praise"
  },
  {
    id: "relationship_7",
    text: "팀워크가 좋다고 생각하는 사람에게 구체적인 사례를 들어 칭찬해주세요.",
    category: "praise"
  },
  {
    id: "relationship_8",
    text: "다른 사람의 말을 잘 들어주는 사람을 칭찬하고 감사 인사를 해주세요.",
    category: "praise"
  },

  // 책임감 있는 의사결정 (Responsible decision-making) - 하트 카테고리
  {
    id: "decision_1",
    text: "어려운 선택을 해야 할 때 어떤 기준으로 결정하는지 나눠주세요.",
    category: "heart"
  },
  {
    id: "decision_2",
    text: "다른 사람을 도울지 말지 고민될 때 어떻게 결정하나요?",
    category: "heart"
  },
  {
    id: "decision_3",
    text: "친구가 잘못된 행동을 할 때 어떻게 말해주는 것이 좋을까요?",
    category: "heart"
  },
  {
    id: "decision_4",
    text: "모든 사람에게 '고마워요'라고 말하고 그 이유를 설명해주세요.",
    category: "heart"
  },
  {
    id: "decision_5",
    text: "공정하고 모두가 만족할 수 있는 해결책을 제시해본 경험이 있나요?",
    category: "heart"
  },
  {
    id: "decision_6",
    text: "다른 사람의 감정을 배려해서 행동한 경험을 나눠주세요.",
    category: "heart"
  },
  {
    id: "decision_7",
    text: "함께 있는 사람들에게 용기를 주는 따뜻한 메시지를 전해주세요.",
    category: "heart"
  },
  {
    id: "decision_8",
    text: "지금 이 순간 가장 감사한 것과 그 이유를 진심으로 말해주세요.",
    category: "heart"
  }
];