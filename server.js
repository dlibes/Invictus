const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    console.log('Received message:', userMessage);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [{ role: "user", content: userMessage }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('OpenAI response:', response.data);

        const gptResponse = response.data.choices[0].message.content;
        res.json({ reply: gptResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ reply: 'An error occurred. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
