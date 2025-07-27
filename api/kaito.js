export default async function handler(req, res) {
  let { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Missing username in query" });
  }

  username = username.replace(/^@/, "");

  const url = `https://star7777.shop/Kaito/GetUserRank?id=${username}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const unionData = data.filter(entry => entry.S_PROJECT_NAME === "UNION");

    res.status(200).json(unionData);
  } catch (error) {
    res.status(500).json({ error: "Proxy failed", message: error.message });
  }
}
