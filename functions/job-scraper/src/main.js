import { Client } from 'node-appwrite';
import axios from 'axios';
import cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async ({ req, res, log, error }) => {
  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405);
  }

  const { url } = req.body;

  if (!url) {
    return res.json({ error: 'URL is required' }, 400);
  }

  try {
    const scrapedData = await scrapeJobPosting(url);
    const processedData = await processJobData(scrapedData);
    return res.json(processedData);
  } catch (err) {
    error(`Error processing job data: ${err.message}`);
    return res.json({ error: 'Failed to process job data' }, 500);
  }
};

async function scrapeJobPosting(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Extract relevant information from the page
  const title = $('h1').first().text().trim();
  const company = $('meta[name="author"]').attr('content') || $('h2').first().text().trim();
  const location = $('[data-test="location"]').text().trim() || $('meta[name="geo.placename"]').attr('content');
  const description = $('[data-test="jobDescriptionText"]').text().trim() || $('meta[name="description"]').attr('content');

  const requirements = [];
  $('ul li').each((i, el) => {
    const text = $(el).text().trim();
    if (text.toLowerCase().includes('year') || text.toLowerCase().includes('experience')) {
      requirements.push(text);
    }
  });

  const salaryText = $('body').text().match(/\$\d{2,3}(,\d{3})*(\s*-\s*\$\d{2,3}(,\d{3})*)?(\s*per\s*year)?/);
  const salary = salaryText ? salaryText[0] : null;

  return {
    title,
    company,
    location,
    description,
    requirements: requirements.join('\n'),
    salary,
  };
}

async function processJobData(scrapedData) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts job details from scraped web content."
        },
        {
          role: "user",
          content: `Extract and structure the following job details from this text. Return the result as a JSON object:

          ${JSON.stringify(scrapedData)}

          Include the following fields if available:
          - title: The job title
          - company: The company name
          - location: The job location
          - description: A brief job description
          - requirements: An array of key job requirements
          - salary: Salary information if available
          - applicationDeadline: Application deadline if mentioned
          - employmentType: Full-time, part-time, contract, etc.
          - experienceLevel: Entry-level, mid-level, senior, etc.

          If any field is not found, omit it from the JSON.`
        }
      ],
      temperature: 0.2,
      max_tokens: 1000
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('Failed to process job data:', error);
    return scrapedData; // Return original scraped data if AI processing fails
  }
}
