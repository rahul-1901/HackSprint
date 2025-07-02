import express from 'express'
import axios from 'axios'
 
export const githubAuthLogin = async (req,res) => {
    try {
        const { code } = req.query
        const params = "?client_id" + process.env.GITHUB_CLIENT_ID + "&client_secret=" + process.env.GITHUB_CLIENT_SECRET + "&code=" + code
        const response = await axios.post("https://github.com/login/oauth/access_token" + params, {
            headers: {
                "Accept": "application/json"
            }
        })

        return res.status(200).json(response.data)
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error on githubAuth....."
        })
    }
}

export const githubTokenExchange = async (req, res) => {
  try {
    const authHeader = req.get("Authorization");

    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: authHeader,
      },
    })

    return res.status(200).json({
        userData: response.data
    })
  } catch (error) {
    res.status(500).json({ 
        message: error
    });
  }
};
