import { Client } from 'node-appwrite';
import axios from 'axios';
import OpenAI from 'openai';
import * as cheerio from 'cheerio';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async ({ req, res, log, error }) => {
  if (req.method === 'OPTIONS') {
    return res.send('', 200, {
      'Access-Control-Allow-Origin': '*', // Or specify your frontend URL
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
  }

  if (req.method !== 'POST') {
    return res.json({ error: 'Method not allowed' }, 405, {
      'Access-Control-Allow-Origin': '*',
    });
  }

  const { url } = req.body;

  if (!url) {
    return res.json({ error: 'URL is required' }, 400, {
      'Access-Control-Allow-Origin': '*',
    });
  }

  try {
    const scrapedData = await scrapeJobPosting(url);
    const processedData = await processJobData(scrapedData, log);
    return res.json(processedData, 200, {
      'Access-Control-Allow-Origin': '*',
    });
  } catch (err) {
    error(`Error processing job data: ${err.message}`);
    return res.json({ error: 'Failed to process job data' }, 500, {
      'Access-Control-Allow-Origin': '*',
    });
  }
};

async function scrapeJobPosting(url) {
  const response = await axios.get(url);
  const $ = cheerio.load(response.data);

  // Extract relevant information from the page
  const title = $('h1').first().text().trim();
  const company =
    $('meta[name="author"]').attr('content') || $('h2').first().text().trim();
  const location =
    $('[data-test="location"]').text().trim() ||
    $('meta[name="geo.placename"]').attr('content');
  const description = $('body').text().trim();

  const requirements = [];
  $('ul li').each((i, el) => {
    const text = $(el).text().trim();
    if (
      text.toLowerCase().includes('year') ||
      text.toLowerCase().includes('experience')
    ) {
      requirements.push(text);
    }
  });

  const salaryText = $('body')
    .text()
    .match(/\$\d{2,3}(,\d{3})*(\s*-\s*\$\d{2,3}(,\d{3})*)?(\s*per\s*year)?/);
  const salary = salaryText ? salaryText[0] : null;

  return {
    title,
    company,
    location,
    description,
    requirements: requirements.join('\n'),
    salary,
    url, // Add the original URL
  };
}

async function processJobData(scrapedData, log) {
  log('scrapedData=====>', scrapedData);
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Leave this as gpt-4o-mini. It's the most capable model.
      messages: [
        {
          role: 'system',
          content:
            'You are an expert job analyst that extracts job details from scraped web content and provides helpful advice for job seekers.',
        },
        {
          role: 'user',
          content: `Analyze the following job details and provide a structured response. Job data: ${JSON.stringify(scrapedData)}
          ---
          Return the result in this format:
          {
            "title": "the job title",
            "company": "the company name",
            "location": "the job location",
            "description": "a brief job description",
            "requirements": ["key job requirements"],
            "salary": "salary information if available",
            "applicationDeadline": "application deadline if mentioned",
            "employmentType": "full-time, part-time, contract, etc.",
            "experienceLevel": "entry-level, mid-level, senior, etc.",
            "preparationTasks": ["An array of 5-7 specific tasks to help the user prepare for and increase their chances of getting this job"]
          }
          If any field is not found, omit it from the JSON. Ensure the preparationTasks are specific, actionable, and tailored to the job description.`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1500, // Increased to accommodate more detailed response
    });

    log('completion', completion.choices[0].message.content);

    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    console.error('==========> Failed to process job data:', error);
    return scrapedData; // Return original scraped data if AI processing fails
  }
}
