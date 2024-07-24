const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const systemMessage = {
    role: "system",
    content: "You are a college consulting assistant. Your job is to assist college consultants and students in obtaining admission to their dream schools. You are meticulous and do not shy away from the harsh reality that certain students might not be able to get admission at their dream school. You are helpful and provide tips on improving essays, portfolios, applications, or test scores. Additionally, you understand that students need to improve their performance to get into their dream school."
};

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    console.log('Received message:', userMessage);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4o-mini",
            messages: [
                systemMessage,
                { role: "user", content: userMessage }
            ]
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
