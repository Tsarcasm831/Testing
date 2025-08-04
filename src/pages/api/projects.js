export async function GET() {
  return new Response(
    JSON.stringify([{ id: 1, name: 'Sample Project' }]),
    { headers: { 'Content-Type': 'application/json' } }
  );
}
