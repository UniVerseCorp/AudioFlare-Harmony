import { NextRequest, NextResponse } from 'next/server';
import { getGatewayUrl } from '../../../lib/utils';

export async function POST(req: NextRequest) {
  const startTime = process.hrtime.bigint();
	const { CLOUDFLARE_API_TOKEN: authToken } = process.env;

	if (!authToken)
		return NextResponse.json(
			{ error: 'No Cloudflare auth token provided' },
			{ status: 500 }
		);

	const headers = {
		'Authorization': `Bearer ${authToken}`,
		'Content-Type': 'application/json',
	};

	const data = await req.formData();
	const text = data.get('text');

	if (!text || typeof text !== 'string')
		return NextResponse.json(
			{ error: 'No transcript provided' },
			{ status: 400 }
		);

	const url = getGatewayUrl('textClassification');

	const response = await fetch(url, {
		method: 'POST',
		headers,
		body: JSON.stringify({ text }),
	});
	const result = await response.json();
  const endTime = process.hrtime.bigint();
  const timeTaken = Number(endTime - startTime) / 1e6;
  result.timeTaken = timeTaken;

	return NextResponse.json(result);
}
