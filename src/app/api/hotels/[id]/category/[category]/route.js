// /api/categories/[id]/route.js
export async function GET(req, { params }) {
  const { id } = params;
  // Fetch from DB
  return Response.json({
    id,
    name: "Sample Category",
    image: "https://via.placeholder.com/150",
  });
}
// Update category by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const { name, image } = await req.json();
  // Update in DB
  return Response.json({ success: true });
}

