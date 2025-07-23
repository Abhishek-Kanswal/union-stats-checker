export default async function handler(req, res) {
  const { duration } = req.query;

  const url = `https://hub.kaito.ai/api/v1/gateway/ai/kol/mindshare/top-leaderboard?duration=${duration}&topic_id=UNION&top_n=100&customized_community=customized&community_yaps=true`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed", message: error.message });
  }
}
