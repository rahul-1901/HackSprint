// data.js

export const allHackathons = [
    { id: 'live-01', slug: "ai-innovators-hackathon", title: "AI Innovators Hackathon", status: 'live' },
    { id: 'live-02', slug: "quantumverse-challenge", title: "QuantumVerse Challenge", status: 'live' },
    { id: 'recent-01', slug: "gamedev-gauntlet", title: "GameDev Gauntlet", status: 'recent' },
    { id: 'recent-02', slug: "cyber-sentinel-showdown", title: "Cyber Sentinel Showdown", status: 'recent' },
    { id: 'ended-01', slug: "decentralized-future-hack", title: "Decentralized Future Hack", status: 'ended' },
    { id: 'ended-02', slug: "eco-coders-challenge", title: "Eco-Coders Challenge", status: 'ended' },
];

export const hackathonUsers = {
  "ai-innovators-hackathon": [
    { id: 1, name: "Alice Johnson", email: "alice.j@example.com", hasSubmission: true },
    { id: 2, name: "Bob Williams", email: "bob.w@example.com", hasSubmission: false },
    { id: 3, name: "Charlie Brown", email: "charlie.b@example.com", hasSubmission: true },
    { id: 4, name: "Diana Miller", email: "diana.m@example.com", hasSubmission: false },
  ],
  "gamedev-gauntlet": [
    { id: 5, name: "Ethan Hunt", email: "ethan.h@example.com", hasSubmission: true },
    { id: 6, name: "Fiona Gallagher", email: "fiona.g@example.com", hasSubmission: true },
  ],
  "decentralized-future-hack": [
    { id: 7, name: "George Costanza", email: "george.c@example.com", hasSubmission: true },
    { id: 8, name: "Helen Troy", email: "helen.t@example.com", hasSubmission: false },
    { id: 9, name: "Ian Wright", email: "ian.w@example.com", hasSubmission: true },
  ]
};

export const userSubmissions = {
  1: { title: "AI-Powered Personal Assistant", repoUrl: "https://github.com/alice/ai-assistant", liveDemo: "https://ai-assistant.example.com" },
  3: { title: "Real-time Emotion Detection API", repoUrl: "https://github.com/charlie/emotion-api", liveDemo: "https://emotion-api.example.com" },
  5: { title: "Pixel Adventure RPG", repoUrl: "https://github.com/ethan/pixel-rpg", liveDemo: "https://pixel-rpg.example.com" },
  6: { title: "Co-op Puzzle Platformer", repoUrl: "https://github.com/fiona/puzzle-game", liveDemo: "https://puzzle-game.example.com" },
  7: { title: "Decentralized Voting System", repoUrl: "https://github.com/george/d-vote", liveDemo: "https://d-vote.example.com" },
  9: { title: "Blockchain Identity Manager", repoUrl: "https://github.com/ian/block-id", liveDemo: "https://block-id.example.com" },
};