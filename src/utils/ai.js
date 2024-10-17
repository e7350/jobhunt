import { HfInference } from '@huggingface/inference'

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY)

export async function processJobData(scrapedData) {
  try {
    const result = await hf.textGeneration({
      model: 'gpt2', // or another suitable model
      inputs: `Extract job details from the following text and format as JSON:
               ${scrapedData}

               Format:
               {
                 "title": "Job Title",
                 "company": "Company Name",
                 "location": "Job Location",
                 "description": "Brief job description",
                 "requirements": ["Requirement 1", "Requirement 2", ...],
                 "salary": "Salary information if available"
               }`,
      parameters: {
        max_new_tokens: 250,
        return_full_text: false,
      },
    })

    return JSON.parse(result.generated_text)
  } catch (error) {
    console.error('Failed to process job data:', error)
    return null
  }
}
